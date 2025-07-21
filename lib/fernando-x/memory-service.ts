// Fernando-X Memory Service - Database Integration
import { PrismaClient } from '@prisma/client'
import type { FernandoMemory, FernandoConversation, FernandoInsight } from '@prisma/client'

const prisma = new PrismaClient()

export interface MemorySearchOptions {
  userId?: string
  sessionId?: string
  memoryType?: string
  limit?: number
  minImportance?: number
}

export interface ConversationContext {
  userId?: string
  sessionId: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
}

export class FernandoMemoryService {
  // Store a new memory
  async storeMemory(data: {
    userId?: string
    sessionId?: string
    memoryType: string
    content: any
    embedding?: number[]
    importance?: number
    metadata?: any
  }): Promise<FernandoMemory> {
    return await prisma.fernandoMemory.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        memoryType: data.memoryType,
        content: data.content,
        embedding: data.embedding || [],
        importance: data.importance || 0.5,
        metadata: data.metadata || {}
      }
    })
  }

  // Search memories
  async searchMemories(options: MemorySearchOptions): Promise<FernandoMemory[]> {
    const where: any = {}
    
    if (options.userId) where.userId = options.userId
    if (options.sessionId) where.sessionId = options.sessionId
    if (options.memoryType) where.memoryType = options.memoryType
    if (options.minImportance) where.importance = { gte: options.minImportance }

    const memories = await prisma.fernandoMemory.findMany({
      where,
      orderBy: [
        { importance: 'desc' },
        { lastAccessed: 'desc' }
      ],
      take: options.limit || 10
    })

    // Update access count and last accessed
    if (memories.length > 0) {
      await prisma.fernandoMemory.updateMany({
        where: {
          id: { in: memories.map(m => m.id) }
        },
        data: {
          accessCount: { increment: 1 },
          lastAccessed: new Date()
        }
      })
    }

    return memories
  }

  // Store conversation
  async storeConversation(data: ConversationContext & {
    summary?: string
    topics?: string[]
    sentiment?: string
  }): Promise<FernandoConversation> {
    const startedAt = data.messages[0]?.timestamp || new Date()
    const endedAt = data.messages[data.messages.length - 1]?.timestamp || new Date()
    const duration = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000)

    return await prisma.fernandoConversation.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        messages: data.messages as any,
        summary: data.summary,
        topics: data.topics || [],
        sentiment: data.sentiment,
        startedAt,
        endedAt,
        duration
      }
    })
  }

  // Get conversation history
  async getConversationHistory(sessionId: string): Promise<FernandoConversation | null> {
    return await prisma.fernandoConversation.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Store insights
  async storeInsight(data: {
    insightType: string
    title: string
    content: string
    data: any
    confidence: number
    tags?: string[]
    relevantTo?: string[]
    validUntil?: Date
  }): Promise<FernandoInsight> {
    return await prisma.fernandoInsight.create({
      data: {
        insightType: data.insightType,
        title: data.title,
        content: data.content,
        data: data.data,
        confidence: data.confidence,
        tags: data.tags || [],
        relevantTo: data.relevantTo || [],
        validUntil: data.validUntil
      }
    })
  }

  // Get relevant insights
  async getRelevantInsights(options: {
    insightType?: string
    tags?: string[]
    userId?: string
    limit?: number
  }): Promise<FernandoInsight[]> {
    const where: any = {
      validFrom: { lte: new Date() },
      OR: [
        { validUntil: null },
        { validUntil: { gte: new Date() } }
      ]
    }

    if (options.insightType) where.insightType = options.insightType
    if (options.tags && options.tags.length > 0) {
      where.tags = { hasSome: options.tags }
    }
    if (options.userId) {
      where.relevantTo = { has: options.userId }
    }

    return await prisma.fernandoInsight.findMany({
      where,
      orderBy: [
        { confidence: 'desc' },
        { createdAt: 'desc' }
      ],
      take: options.limit || 5
    })
  }

  // Extract key facts from conversation
  async extractAndStoreFacts(conversation: ConversationContext): Promise<FernandoMemory[]> {
    const facts: FernandoMemory[] = []
    
    // Extract user preferences
    for (const message of conversation.messages) {
      if (message.role === 'user') {
        const content = message.content.toLowerCase()
        
        // Budget preferences
        const budgetMatch = content.match(/budget.{0,20}\$?([\d,]+k?m?)/i)
        if (budgetMatch) {
          facts.push(await this.storeMemory({
            userId: conversation.userId,
            sessionId: conversation.sessionId,
            memoryType: 'preference',
            content: { type: 'budget', value: budgetMatch[1] },
            importance: 0.8
          }))
        }
        
        // Location preferences
        const locations = ['heights', 'montrose', 'river oaks', 'memorial', 'katy', 'woodlands', 'cypress']
        for (const location of locations) {
          if (content.includes(location)) {
            facts.push(await this.storeMemory({
              userId: conversation.userId,
              sessionId: conversation.sessionId,
              memoryType: 'preference',
              content: { type: 'location', value: location },
              importance: 0.7
            }))
          }
        }
        
        // Property type preferences
        const propertyTypes = ['single family', 'townhome', 'condo', 'land', 'commercial', 'mixed use']
        for (const propType of propertyTypes) {
          if (content.includes(propType)) {
            facts.push(await this.storeMemory({
              userId: conversation.userId,
              sessionId: conversation.sessionId,
              memoryType: 'preference',
              content: { type: 'property_type', value: propType },
              importance: 0.7
            }))
          }
        }
      }
    }
    
    return facts
  }

  // Search training data for relevant Q&As
  async searchTrainingData(query: string, limit: number = 5): Promise<Array<{ question: string; answer: string; confidence: number }>> {
    const queryLower = query.toLowerCase()
    const keywords = queryLower.split(' ').filter(word => word.length > 2)
    
    try {
      // Search for training Q&As that contain keywords
      const trainingData = await prisma.fernandoMemory.findMany({
        where: {
          AND: [
            {
              memoryType: {
                contains: 'training'
              }
            },
            {
              OR: keywords.map(keyword => ({
                content: {
                  path: ['keywords'],
                  array_contains: keyword
                }
              }))
            }
          ]
        },
        orderBy: {
          importance: 'desc'
        },
        take: limit * 2 // Get extra to filter
      })

      // Process and score results
      const results = trainingData
        .map(record => {
          const content = record.content as any
          if (!content.question || !content.answer) return null
          
          // Calculate relevance score
          let score = 0
          const questionLower = content.question.toLowerCase()
          const answerLower = content.answer.toLowerCase()
          
          // Exact keyword matches
          for (const keyword of keywords) {
            if (questionLower.includes(keyword)) score += 2
            if (answerLower.includes(keyword)) score += 1
          }
          
          // Bonus for similar question structure
          if (questionLower.includes('what') && queryLower.includes('what')) score += 1
          if (questionLower.includes('how') && queryLower.includes('how')) score += 1
          if (questionLower.includes('where') && queryLower.includes('where')) score += 1
          
          return {
            question: content.question,
            answer: content.answer,
            confidence: Math.min(score / (keywords.length + 2), 1.0)
          }
        })
        .filter(result => result !== null && result.confidence > 0.3)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, limit)

      return results
    } catch (error) {
      console.error('Error searching training data:', error)
      return []
    }
  }

  // Clean up old memories
  async cleanupOldMemories(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    
    const result = await prisma.fernandoMemory.deleteMany({
      where: {
        lastAccessed: { lt: cutoffDate },
        importance: { lt: 0.5 }
      }
    })
    
    return result.count
  }
}

export const fernandoMemory = new FernandoMemoryService()