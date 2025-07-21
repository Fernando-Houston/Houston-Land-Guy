// Fernando-X Learning Conversation Engine
// Implements smart question matching and continuous learning

import { fernandoMemory } from './memory-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface LearningContext {
  userId?: string
  sessionId: string
  currentQuery: string
  conversationHistory: Array<{
    role: 'user' | 'assistant' 
    content: string
    timestamp: Date
  }>
}

export interface LearningResponse {
  text: string
  confidence: number
  sources: string[]
  matchType: 'exact' | 'similar' | 'concept' | 'learned' | 'generated'
  suggestedFollowUps: string[]
  learning: {
    understood: boolean
    keywords: string[]
    concepts: string[]
    improved: boolean
  }
}

export class LearningConversationEngine {
  
  async processWithLearning(context: LearningContext): Promise<LearningResponse> {
    console.log('🧠 Processing with learning capabilities...')
    
    // Extract intelligence from query
    const queryIntelligence = this.analyzeQuery(context.currentQuery)
    
    // Try multiple matching strategies
    const matchResult = await this.findBestMatch(context.currentQuery, queryIntelligence)
    
    if (matchResult.match) {
      // Use existing knowledge
      const response = await this.generateFromMatch(matchResult, context)
      
      // Learn from this interaction
      await this.learnFromInteraction(context, response, matchResult)
      
      return response
    }
    
    // Generate new response and learn
    const generatedResponse = await this.generateNewResponse(context, queryIntelligence)
    await this.storeNewLearning(context, generatedResponse, queryIntelligence)
    
    return generatedResponse
  }
  
  private analyzeQuery(query: string): any {
    const keywords = this.extractKeywords(query)
    const concepts = this.identifyConcepts(query)
    const intent = this.detectIntent(query)
    const entities = this.extractEntities(query)
    
    return {
      keywords,
      concepts, 
      intent,
      entities,
      originalQuery: query
    }
  }
  
  private async findBestMatch(query: string, intelligence: any): Promise<any> {
    // Search training data with multiple strategies
    const memories = await fernandoMemory.searchMemories({
      memoryType: 'training_qa_enhanced',
      limit: 20
    })
    
    let bestMatch = null
    let bestScore = 0
    let matchType = 'none'
    
    for (const memory of memories) {
      const score = this.calculateMatchScore(query, memory, intelligence)
      
      if (score > bestScore) {
        bestScore = score
        bestMatch = memory
        
        // Determine match type
        if (score > 0.9) matchType = 'exact'
        else if (score > 0.75) matchType = 'similar'
        else if (score > 0.6) matchType = 'concept'
        else if (score > 0.5) matchType = 'learned'
      }
    }
    
    // Also check variations
    const variations = await fernandoMemory.searchMemories({
      memoryType: 'training_variation',
      limit: 10
    })
    
    for (const variation of variations) {
      if (this.fuzzyMatch(query, variation.content.variation)) {
        // Found a variation match
        return {
          match: variation,
          score: 0.85,
          type: 'similar'
        }
      }
    }
    
    return {
      match: bestScore > 0.5 ? bestMatch : null,
      score: bestScore,
      type: matchType
    }
  }
  
  private calculateMatchScore(query: string, memory: any, intelligence: any): number {
    let score = 0
    const content = memory.content
    
    // Direct question similarity (30%)
    if (content.question) {
      const similarity = this.calculateSimilarity(query, content.question)
      score += similarity * 0.3
    }
    
    // Keyword overlap (25%)
    if (content.keywords && intelligence.keywords) {
      const keywordScore = this.calculateOverlap(intelligence.keywords, content.keywords)
      score += keywordScore * 0.25
    }
    
    // Concept matching (25%)
    if (content.concepts && intelligence.concepts) {
      const conceptScore = this.calculateOverlap(intelligence.concepts, content.concepts)
      score += conceptScore * 0.25
    }
    
    // Check variations (20%)
    if (content.variations) {
      for (const variation of content.variations) {
        if (this.fuzzyMatch(query, variation)) {
          score += 0.2
          break
        }
      }
    }
    
    return Math.min(score, 1.0)
  }
  
  private async generateFromMatch(matchResult: any, context: LearningContext): Promise<LearningResponse> {
    const match = matchResult.match
    const content = match.content
    
    // Get current data to update the answer
    const currentData = await this.fetchCurrentData(content.category)
    
    // Update answer with current data if available
    let answer = content.answer
    if (currentData) {
      answer = this.updateAnswerWithCurrentData(answer, currentData)
    }
    
    // Add personalization based on conversation history
    if (context.conversationHistory.length > 0) {
      answer = this.personalizeAnswer(answer, context)
    }
    
    return {
      text: answer,
      confidence: matchResult.score,
      sources: content.dataSource ? [content.dataSource] : ['Training Data'],
      matchType: matchResult.type,
      suggestedFollowUps: this.generateSmartFollowUps(content, context),
      learning: {
        understood: true,
        keywords: content.keywords || [],
        concepts: content.concepts || [],
        improved: false
      }
    }
  }
  
  private async generateNewResponse(context: LearningContext, intelligence: any): Promise<LearningResponse> {
    // Fetch relevant data based on concepts
    const relevantData = await this.fetchRelevantData(intelligence)
    
    // Generate response based on intent and data
    let response = 'I understand you\'re asking about '
    
    if (intelligence.intent === 'market_inquiry') {
      response += 'Houston market conditions. '
      if (relevantData.market) {
        response += `Currently, we're seeing ${relevantData.market.totalSales} sales with average prices at $${relevantData.market.avgSalePrice}. `
      }
    } else if (intelligence.intent === 'neighborhood_inquiry') {
      response += `${intelligence.entities.neighborhood || 'Houston neighborhoods'}. `
    } else if (intelligence.intent === 'cost_inquiry') {
      response += 'costs and pricing. '
      if (relevantData.costs) {
        response += `Construction costs range from $${relevantData.costs.residentialLow} to $${relevantData.costs.residentialHigh} per square foot. `
      }
    }
    
    response += 'Would you like more specific information?'
    
    return {
      text: response,
      confidence: 0.7,
      sources: ['Generated Response'],
      matchType: 'generated',
      suggestedFollowUps: this.generateContextualFollowUps(intelligence),
      learning: {
        understood: true,
        keywords: intelligence.keywords,
        concepts: intelligence.concepts,
        improved: true
      }
    }
  }
  
  private async learnFromInteraction(context: LearningContext, response: LearningResponse, matchResult: any): Promise<void> {
    // Store successful interaction for future learning
    await fernandoMemory.storeMemory({
      memoryType: 'learned_interaction',
      content: {
        query: context.currentQuery,
        response: response.text,
        matchedTo: matchResult.match.content.question,
        confidence: response.confidence,
        timestamp: new Date()
      },
      importance: response.confidence,
      metadata: {
        sessionId: context.sessionId,
        userId: context.userId,
        improved: true
      }
    })
  }
  
  private async storeNewLearning(context: LearningContext, response: LearningResponse, intelligence: any): Promise<void> {
    // Store new Q&A pair for future use
    await fernandoMemory.storeMemory({
      memoryType: 'training_qa_learned',
      content: {
        question: context.currentQuery,
        answer: response.text,
        keywords: intelligence.keywords,
        concepts: intelligence.concepts,
        category: this.categorizeQuery(intelligence),
        learned: true,
        timestamp: new Date()
      },
      importance: 0.7,
      metadata: {
        autoLearned: true,
        sessionId: context.sessionId
      }
    })
  }
  
  // Helper methods
  private extractKeywords(text: string): string[] {
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'be', 'are', 'been', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'do', 'does', 'did', 'has', 'have', 'had', 'if'])
    
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
  }
  
  private identifyConcepts(text: string): string[] {
    const concepts: string[] = []
    const textLower = text.toLowerCase()
    
    // Real estate concepts
    if (/(market|trend|condition|analysis)/.test(textLower)) concepts.push('market_analysis')
    if (/(price|cost|expensive|cheap|afford)/.test(textLower)) concepts.push('pricing')
    if (/(buy|buying|purchase|buyer)/.test(textLower)) concepts.push('buying')
    if (/(sell|selling|seller|list)/.test(textLower)) concepts.push('selling')
    if (/(invest|investment|roi|return|yield)/.test(textLower)) concepts.push('investment')
    if (/(build|construction|develop)/.test(textLower)) concepts.push('construction')
    if (/(neighbor|area|location|zone)/.test(textLower)) concepts.push('location')
    if (/(permit|regulation|legal|code)/.test(textLower)) concepts.push('regulatory')
    if (/(finance|loan|mortgage|lend)/.test(textLower)) concepts.push('financing')
    
    return concepts
  }
  
  private detectIntent(query: string): string {
    const queryLower = query.toLowerCase()
    
    if (/(what|how|when|where|why|tell me|explain)/.test(queryLower)) {
      if (/market|trend/.test(queryLower)) return 'market_inquiry'
      if (/cost|price|much/.test(queryLower)) return 'cost_inquiry'
      if (/neighbor|area|location/.test(queryLower)) return 'neighborhood_inquiry'
      if (/buy|purchase/.test(queryLower)) return 'buying_guidance'
      if (/sell|list/.test(queryLower)) return 'selling_guidance'
      if (/invest|roi/.test(queryLower)) return 'investment_analysis'
    }
    
    if (/(should|can|would|could)/.test(queryLower)) return 'advice_seeking'
    if (/(hi|hello|help)/.test(queryLower)) return 'greeting'
    
    return 'general_inquiry'
  }
  
  private extractEntities(query: string): any {
    const entities: any = {}
    
    // Extract neighborhoods
    const neighborhoods = ['heights', 'montrose', 'river oaks', 'memorial', 'katy', 'woodlands', 'cypress', 'eado', 'downtown', 'midtown']
    for (const hood of neighborhoods) {
      if (query.toLowerCase().includes(hood)) {
        entities.neighborhood = hood.charAt(0).toUpperCase() + hood.slice(1)
      }
    }
    
    // Extract price ranges
    const priceMatch = query.match(/\$?([\d,]+)k?/)
    if (priceMatch) {
      entities.price = priceMatch[1].replace(/,/g, '')
    }
    
    // Extract property types
    const types = ['house', 'condo', 'townhome', 'apartment', 'land', 'commercial']
    for (const type of types) {
      if (query.toLowerCase().includes(type)) {
        entities.propertyType = type
      }
    }
    
    return entities
  }
  
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(this.extractKeywords(text1))
    const words2 = new Set(this.extractKeywords(text2))
    
    if (words1.size === 0 || words2.size === 0) return 0
    
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    
    // Jaccard similarity
    const jaccard = intersection.size / union.size
    
    // Boost score if order is similar
    const order1 = Array.from(words1)
    const order2 = Array.from(words2)
    let orderScore = 0
    
    for (let i = 0; i < Math.min(order1.length, order2.length); i++) {
      if (order1[i] === order2[i]) orderScore += 0.1
    }
    
    return Math.min(jaccard + orderScore, 1.0)
  }
  
  private calculateOverlap(set1: string[], set2: string[]): number {
    if (!set1.length || !set2.length) return 0
    
    const s1 = new Set(set1.map(s => s.toLowerCase()))
    const s2 = new Set(set2.map(s => s.toLowerCase()))
    
    const intersection = new Set([...s1].filter(x => s2.has(x)))
    return intersection.size / Math.max(s1.size, s2.size)
  }
  
  private fuzzyMatch(str1: string, str2: string): boolean {
    const s1 = str1.toLowerCase().replace(/[^\w\s]/g, '')
    const s2 = str2.toLowerCase().replace(/[^\w\s]/g, '')
    
    // Check if substantially similar
    const similarity = this.calculateSimilarity(s1, s2)
    return similarity > 0.7
  }
  
  private async fetchCurrentData(category: string): Promise<any> {
    if (category === 'market_trends') {
      return await prisma.harMlsReport.findFirst({
        orderBy: [{ year: 'desc' }, { month: 'desc' }]
      })
    }
    
    if (category === 'construction_costs') {
      return await prisma.constructionCostDP5.findFirst({
        orderBy: { effectiveDate: 'desc' }
      })
    }
    
    return null
  }
  
  private async fetchRelevantData(intelligence: any): Promise<any> {
    const data: any = {}
    
    if (intelligence.concepts.includes('market_analysis')) {
      data.market = await prisma.harMlsReport.findFirst({
        orderBy: [{ year: 'desc' }, { month: 'desc' }]
      })
    }
    
    if (intelligence.concepts.includes('construction') || intelligence.concepts.includes('pricing')) {
      data.costs = await prisma.constructionCostDP5.findFirst({
        orderBy: { effectiveDate: 'desc' }
      })
    }
    
    return data
  }
  
  private updateAnswerWithCurrentData(answer: string, data: any): string {
    // Update placeholders with current data
    if (data.totalSales) {
      answer = answer.replace(/\d+(?=\s*total sales)/gi, data.totalSales.toLocaleString())
    }
    
    if (data.avgSalePrice) {
      answer = answer.replace(/\$[\d,]+(?=.*average)/gi, `$${data.avgSalePrice.toLocaleString()}`)
    }
    
    return answer
  }
  
  private personalizeAnswer(answer: string, context: LearningContext): string {
    // Add personalization based on conversation
    if (context.conversationHistory.length > 1) {
      answer = answer.replace(/Would you like/, 'Based on our conversation, would you like')
    }
    
    return answer
  }
  
  private generateSmartFollowUps(content: any, context: LearningContext): string[] {
    const followUps: string[] = []
    
    if (content.category === 'market_trends') {
      followUps.push(
        'Which specific neighborhoods interest you?',
        'Would you like to see price trends for a particular area?',
        'Are you looking to buy or sell in this market?'
      )
    } else if (content.category === 'construction_costs') {
      followUps.push(
        'What size home are you planning to build?',
        'Would you like a detailed cost breakdown?',
        'Are you interested in specific construction types?'
      )
    } else if (content.category === 'investment_analysis') {
      followUps.push(
        'What\'s your investment budget range?',
        'Are you interested in rental or flip strategies?',
        'Would you like to analyze specific properties?'
      )
    }
    
    return followUps.slice(0, 3)
  }
  
  private generateContextualFollowUps(intelligence: any): string[] {
    const followUps: string[] = []
    
    if (intelligence.intent === 'market_inquiry') {
      followUps.push('Would you like neighborhood-specific data?')
    }
    
    if (intelligence.entities.neighborhood) {
      followUps.push(`Would you like investment analysis for ${intelligence.entities.neighborhood}?`)
    }
    
    followUps.push('Can I help you with anything else?')
    
    return followUps
  }
  
  private categorizeQuery(intelligence: any): string {
    if (intelligence.concepts.includes('market_analysis')) return 'market_trends'
    if (intelligence.concepts.includes('construction')) return 'construction_costs'
    if (intelligence.concepts.includes('investment')) return 'investment_analysis'
    if (intelligence.concepts.includes('location')) return 'neighborhood_analysis'
    if (intelligence.concepts.includes('buying')) return 'buyer_guidance'
    if (intelligence.concepts.includes('selling')) return 'seller_advice'
    
    return 'general'
  }
}

export const learningEngine = new LearningConversationEngine()