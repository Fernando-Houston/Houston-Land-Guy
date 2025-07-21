// Enhanced Fernando-X Conversation Engine with Training Dataset
import { fernandoMemory } from './memory-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface ConversationContext {
  userId?: string
  sessionId: string
  currentQuery: string
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  userProfile?: {
    interests: string[]
    previousQueries: string[]
    preferences: Record<string, any>
  }
}

export interface ResponseContext {
  text: string
  confidence: number
  sources: string[]
  suggestedFollowUps: string[]
  dataUsed: any
}

export class EnhancedConversationEngine {
  
  async processQuery(context: ConversationContext): Promise<ResponseContext> {
    console.log('🧠 Processing query with enhanced context...')
    
    // 1. Find similar training questions
    const trainingMatches = await this.findSimilarTrainingQuestions(context.currentQuery)
    
    // 2. Get relevant real-time data
    const realtimeData = await this.fetchRelevantData(context.currentQuery)
    
    // 3. Retrieve user context and memories
    const userContext = await this.getUserContext(context)
    
    // 4. Generate contextual response
    const response = await this.generateResponse({
      query: context.currentQuery,
      trainingMatches,
      realtimeData,
      userContext,
      conversationHistory: context.conversationHistory
    })
    
    // 5. Store this interaction for future learning
    await this.storeInteraction(context, response)
    
    return response
  }
  
  private async findSimilarTrainingQuestions(query: string): Promise<any[]> {
    // Search for similar training questions using keywords
    const keywords = this.extractKeywords(query)
    
    const trainingMemories = await fernandoMemory.searchMemories({
      memoryType: 'training_qa',
      limit: 5
    })
    
    // Score training questions by relevance
    const scoredQuestions = trainingMemories.map(memory => {
      const questionText = memory.content.question.toLowerCase()
      const answerText = memory.content.answer.toLowerCase()
      
      let score = 0
      keywords.forEach(keyword => {
        if (questionText.includes(keyword)) score += 2
        if (answerText.includes(keyword)) score += 1
        if (memory.content.tags?.includes(keyword)) score += 1
      })
      
      return { ...memory, relevanceScore: score }
    }).filter(q => q.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    
    return scoredQuestions.slice(0, 3)
  }
  
  private async fetchRelevantData(query: string): Promise<any> {
    const keywords = this.extractKeywords(query)
    const data: any = {}
    
    // Determine what data to fetch based on keywords
    if (this.hasKeywords(keywords, ['market', 'trends', 'sales', 'har'])) {
      data.latestMarket = await prisma.harMlsReport.findFirst({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: { neighborhoods: { take: 5, orderBy: { totalSales: 'desc' } } }
      })
    }
    
    if (this.hasKeywords(keywords, ['construction', 'cost', 'build', 'materials'])) {
      data.constructionCosts = await prisma.constructionCostDP5.findFirst({
        orderBy: { effectiveDate: 'desc' }
      })
    }
    
    if (this.hasKeywords(keywords, ['permits', 'permit', 'building'])) {
      data.recentPermits = await prisma.constructionActivity.findMany({
        take: 5,
        orderBy: { permitDate: 'desc' },
        where: { status: 'active' }
      })
    }
    
    // Check for specific neighborhood mentions
    const neighborhoods = await this.extractNeighborhoods(query)
    if (neighborhoods.length > 0) {
      data.neighborhoodData = await prisma.harNeighborhoodData.findMany({
        where: {
          neighborhood: { in: neighborhoods, mode: 'insensitive' }
        },
        include: { report: true },
        orderBy: { report: { year: 'desc' } },
        take: 5
      })
    }
    
    return data
  }
  
  private async getUserContext(context: ConversationContext): Promise<any> {
    if (!context.userId) return {}
    
    // Get user preferences and past interactions
    const [preferences, pastConversations] = await Promise.all([
      fernandoMemory.searchMemories({
        userId: context.userId,
        memoryType: 'preference',
        limit: 10
      }),
      fernandoMemory.searchMemories({
        userId: context.userId,
        memoryType: 'conversation',
        limit: 5
      })
    ])
    
    return {
      preferences: preferences.map(p => p.content),
      pastInterests: pastConversations.map(c => c.content),
      conversationCount: pastConversations.length
    }
  }
  
  private async generateResponse(params: {
    query: string
    trainingMatches: any[]
    realtimeData: any
    userContext: any
    conversationHistory: any[]
  }): Promise<ResponseContext> {
    
    const { query, trainingMatches, realtimeData, userContext } = params
    
    // If we have a direct training match with high confidence
    if (trainingMatches.length > 0 && trainingMatches[0].relevanceScore >= 3) {
      const bestMatch = trainingMatches[0]
      let response = bestMatch.content.answer
      
      // Enhance with real-time data if available
      response = await this.enhanceWithRealtimeData(response, realtimeData, query)
      
      return {
        text: response,
        confidence: 0.9,
        sources: [bestMatch.content.dataSource],
        suggestedFollowUps: this.generateFollowUps(bestMatch.content.category),
        dataUsed: realtimeData
      }
    }
    
    // Generate custom response using available data
    return await this.generateCustomResponse(query, realtimeData, userContext, trainingMatches)
  }
  
  private async enhanceWithRealtimeData(baseResponse: string, realtimeData: any, query: string): Promise<string> {
    let enhanced = baseResponse
    
    // Update with latest market data
    if (realtimeData.latestMarket) {
      const market = realtimeData.latestMarket
      enhanced = enhanced.replace(
        /\$[\d,]+/g, 
        `$${market.avgSalePrice.toLocaleString()}`
      )
      enhanced += ` (Updated: ${this.getMonthName(market.month)} ${market.year})`
    }
    
    // Add neighborhood-specific data
    if (realtimeData.neighborhoodData && realtimeData.neighborhoodData.length > 0) {
      const neighborhood = realtimeData.neighborhoodData[0]
      enhanced += ` Specifically for ${neighborhood.neighborhood}, recent data shows ${neighborhood.totalSales} sales with an average price of $${neighborhood.avgSalePrice.toLocaleString()}.`
    }
    
    return enhanced
  }
  
  private async generateCustomResponse(
    query: string, 
    realtimeData: any, 
    userContext: any, 
    trainingMatches: any[]
  ): Promise<ResponseContext> {
    
    const keywords = this.extractKeywords(query)
    let response = ''
    let confidence = 0.7
    let sources: string[] = []
    
    // Handle market questions
    if (this.hasKeywords(keywords, ['market', 'trends', 'houston'])) {
      if (realtimeData.latestMarket) {
        const market = realtimeData.latestMarket
        response = `Based on the latest Houston market data for ${this.getMonthName(market.month)} ${market.year}, `
        response += `the market shows ${market.totalSales.toLocaleString()} total sales with an average price of $${market.avgSalePrice.toLocaleString()}. `
        response += `Sales are ${market.salesChangeYoY > 0 ? 'up' : 'down'} ${Math.abs(market.salesChangeYoY).toFixed(1)}% year-over-year.`
        sources.push('HAR MLS Reports')
        confidence = 0.9
      }
    }
    
    // Handle construction cost questions
    else if (this.hasKeywords(keywords, ['construction', 'cost', 'build'])) {
      if (realtimeData.constructionCosts) {
        const costs = realtimeData.constructionCosts
        response = `Current Houston construction costs are approximately $${costs.residentialMid}/sqft for standard residential construction. `
        response += `This ranges from $${costs.residentialLow}/sqft for basic builds to $${costs.residentialHigh}/sqft for luxury construction. `
        response += `Commercial office space runs about $${costs.commercialOffice}/sqft.`
        sources.push('Construction Cost Database')
        confidence = 0.9
      }
    }
    
    // Handle neighborhood questions
    else if (realtimeData.neighborhoodData && realtimeData.neighborhoodData.length > 0) {
      const neighborhood = realtimeData.neighborhoodData[0]
      response = `${neighborhood.neighborhood} shows strong market activity with ${neighborhood.totalSales} recent sales. `
      response += `The average sale price is $${neighborhood.avgSalePrice.toLocaleString()} and properties typically sell within ${neighborhood.avgDaysOnMarket} days.`
      sources.push('HAR Neighborhood Data')
      confidence = 0.8
    }
    
    // Fallback to training matches if available
    else if (trainingMatches.length > 0) {
      response = trainingMatches[0].content.answer
      sources.push(trainingMatches[0].content.dataSource)
      confidence = 0.6
    }
    
    // Ultimate fallback
    else {
      response = "I'd be happy to help with your Houston real estate question. Could you provide more specific details? I have access to market data, construction costs, neighborhood analytics, and permit information."
      confidence = 0.5
    }
    
    return {
      text: response,
      confidence,
      sources,
      suggestedFollowUps: this.generateFollowUps(keywords[0] || 'general'),
      dataUsed: realtimeData
    }
  }
  
  private generateFollowUps(category: string): string[] {
    const followUps: Record<string, string[]> = {
      market: [
        "Which neighborhoods are trending upward?",
        "What's driving these market changes?",
        "How do these trends affect investment opportunities?"
      ],
      construction: [
        "What permits do I need for this project?",
        "How do material costs compare to last year?",
        "What's the typical timeline for construction?"
      ],
      neighborhood: [
        "What are the investment prospects for this area?",
        "How do schools and amenities compare?",
        "What new developments are planned nearby?"
      ],
      investment: [
        "What financing options are available?",
        "Can you analyze a specific property's ROI potential?",
        "What are the tax implications?"
      ],
      general: [
        "Tell me about Houston market trends",
        "What are current construction costs?",
        "Which neighborhoods should I consider?"
      ]
    }
    
    return followUps[category] || followUps.general
  }
  
  private async storeInteraction(context: ConversationContext, response: ResponseContext): Promise<void> {
    // Store successful interactions as learning examples
    if (response.confidence > 0.7) {
      await fernandoMemory.storeMemory({
        userId: context.userId,
        sessionId: context.sessionId,
        memoryType: 'successful_interaction',
        content: {
          query: context.currentQuery,
          response: response.text,
          confidence: response.confidence,
          sources: response.sources,
          timestamp: new Date()
        },
        importance: response.confidence,
        metadata: {
          dataUsed: response.dataUsed,
          queryType: this.classifyQuery(context.currentQuery)
        }
      })
    }
  }
  
  private extractKeywords(text: string): string[] {
    const commonWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by']
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 10)
  }
  
  private hasKeywords(keywords: string[], targets: string[]): boolean {
    return targets.some(target => keywords.includes(target))
  }
  
  private async extractNeighborhoods(query: string): Promise<string[]> {
    const houstonNeighborhoods = [
      'heights', 'montrose', 'river oaks', 'memorial', 'katy', 'woodlands', 'cypress',
      'sugar land', 'pearland', 'bellaire', 'west university', 'rice village',
      'midtown', 'downtown', 'eado', 'first ward', 'fourth ward', 'museum district'
    ]
    
    const text = query.toLowerCase()
    return houstonNeighborhoods.filter(neighborhood => text.includes(neighborhood))
  }
  
  private classifyQuery(query: string): string {
    const keywords = this.extractKeywords(query)
    
    if (this.hasKeywords(keywords, ['market', 'trends', 'sales', 'price'])) return 'market_analysis'
    if (this.hasKeywords(keywords, ['construction', 'cost', 'build', 'materials'])) return 'construction'
    if (this.hasKeywords(keywords, ['neighborhood', 'area', 'location'])) return 'neighborhood'
    if (this.hasKeywords(keywords, ['investment', 'roi', 'returns', 'financing'])) return 'investment'
    if (this.hasKeywords(keywords, ['permits', 'permit', 'building'])) return 'permits'
    
    return 'general'
  }
  
  private getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[month - 1] || 'Unknown'
  }
}

export const enhancedConversationEngine = new EnhancedConversationEngine()