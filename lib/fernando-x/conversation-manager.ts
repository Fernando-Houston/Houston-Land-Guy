// Fernando-X Conversation Manager
// Handles multi-turn conversations with context awareness

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    entities?: Record<string, any>
    confidence?: number
    sources?: string[]
    audioUrl?: string // For voice messages
  }
}

export interface ConversationContext {
  sessionId: string
  userId?: string
  messages: Message[]
  currentIntent?: string
  entities: Record<string, any>
  preferences: {
    propertyTypes?: string[]
    priceRange?: { min: number; max: number }
    locations?: string[]
    investmentGoals?: string[]
  }
  lastActive: Date
}

export interface ConversationInsights {
  userProfile: {
    experienceLevel: 'beginner' | 'intermediate' | 'expert'
    focusAreas: string[]
    communicationStyle: 'technical' | 'casual' | 'professional'
    decisionStage: 'research' | 'evaluation' | 'ready'
  }
  topicsSummary: Record<string, number> // topic -> frequency
  sentimentTrend: 'positive' | 'neutral' | 'negative'
  nextBestActions: string[]
}

class ConversationManager {
  private conversations: Map<string, ConversationContext> = new Map()
  private intents: Map<string, RegExp[]> = new Map()
  
  constructor() {
    this.initializeIntents()
  }
  
  private initializeIntents() {
    // Define intent patterns
    this.intents.set('property_search', [
      /looking for|searching|find me|show me|properties|homes|real estate/i,
      /what's available|what properties|any properties/i,
      /\b(house|home|property|condo|townhome|land)\b.*\b(in|near|around)\b/i
    ])
    
    this.intents.set('market_analysis', [
      /market|trends?|analysis|statistics|data/i,
      /how's the market|market condition|market report/i,
      /appreciation|growth|declining|stable/i
    ])
    
    this.intents.set('investment_advice', [
      /invest|roi|return|cash flow|cap rate/i,
      /good investment|worth investing|should i invest/i,
      /rental income|passive income|investment property/i
    ])
    
    this.intents.set('development_opportunity', [
      /develop|build|construction|zoning|permits?/i,
      /vacant land|tear down|redevelop|subdivide/i,
      /highest and best use|development potential/i
    ])
    
    this.intents.set('neighborhood_info', [
      /neighborhood|area|community|location/i,
      /what's it like|tell me about|information about/i,
      /schools|crime|safety|amenities|walkability/i
    ])
    
    this.intents.set('financial_calculation', [
      /calculat|mortgage|payment|afford|finance|loan/i,
      /how much|monthly payment|down payment|closing cost/i,
      /budget|qualify for|pre-approval/i
    ])
    
    this.intents.set('comparison', [
      /compare|versus|vs|better|difference between/i,
      /which is better|should i choose|pros and cons/i,
      /side by side|comparison|evaluate/i
    ])
    
    this.intents.set('timing_advice', [
      /when|timing|best time|should i wait/i,
      /market timing|buy now or wait|seasonal/i,
      /right time|good time|bad time/i
    ])
  }
  
  // Start or continue a conversation
  startConversation(sessionId: string, userId?: string): ConversationContext {
    if (!this.conversations.has(sessionId)) {
      const context: ConversationContext = {
        sessionId,
        userId,
        messages: [],
        entities: {},
        preferences: {},
        lastActive: new Date()
      }
      this.conversations.set(sessionId, context)
      
      // Add welcome message
      this.addMessage(sessionId, {
        role: 'assistant',
        content: "Hello! I'm Fernando-X, your Houston real estate AI expert. I can help you with property searches, market analysis, investment opportunities, development potential, and much more. What would you like to explore today?"
      })
    }
    
    return this.conversations.get(sessionId)!
  }
  
  // Add a message to the conversation
  addMessage(sessionId: string, message: Omit<Message, 'id' | 'timestamp'>): Message {
    const context = this.conversations.get(sessionId)
    if (!context) {
      throw new Error('Conversation not found')
    }
    
    const fullMessage: Message = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date()
    }
    
    context.messages.push(fullMessage)
    context.lastActive = new Date()
    
    // Extract intent and entities if user message
    if (message.role === 'user') {
      const intent = this.detectIntent(message.content)
      const entities = this.extractEntities(message.content)
      
      fullMessage.metadata = {
        ...fullMessage.metadata,
        intent,
        entities
      }
      
      // Update context
      context.currentIntent = intent
      context.entities = { ...context.entities, ...entities }
      this.updatePreferences(context, entities)
    }
    
    // Limit conversation history
    if (context.messages.length > 100) {
      context.messages = context.messages.slice(-50)
    }
    
    return fullMessage
  }
  
  // Detect user intent
  private detectIntent(text: string): string {
    const scores: Record<string, number> = {}
    
    for (const [intent, patterns] of this.intents) {
      scores[intent] = 0
      patterns.forEach(pattern => {
        if (pattern.test(text)) {
          scores[intent]++
        }
      })
    }
    
    // Find highest scoring intent
    let maxScore = 0
    let bestIntent = 'general'
    
    Object.entries(scores).forEach(([intent, score]) => {
      if (score > maxScore) {
        maxScore = score
        bestIntent = intent
      }
    })
    
    return bestIntent
  }
  
  // Extract entities from text
  private extractEntities(text: string): Record<string, any> {
    const entities: Record<string, any> = {}
    
    // Extract price
    const priceMatch = text.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:k|K|thousand|million|M)?/g)
    if (priceMatch) {
      entities.price = this.parsePrice(priceMatch[0])
    }
    
    // Extract neighborhoods/locations
    const neighborhoods = [
      'Heights', 'River Oaks', 'Montrose', 'Memorial', 'Galleria',
      'Katy', 'Sugar Land', 'The Woodlands', 'Cypress', 'Spring',
      'Pearland', 'Clear Lake', 'Downtown', 'Midtown', 'EaDo',
      'East End', 'Third Ward', 'Fifth Ward', 'Museum District'
    ]
    
    const foundNeighborhoods = neighborhoods.filter(n => 
      new RegExp(`\\b${n}\\b`, 'i').test(text)
    )
    if (foundNeighborhoods.length > 0) {
      entities.locations = foundNeighborhoods
    }
    
    // Extract property types
    const propertyTypes = {
      'single family': ['single family', 'single-family', 'house', 'home'],
      'townhome': ['townhome', 'townhouse', 'town home'],
      'condo': ['condo', 'condominium'],
      'land': ['land', 'lot', 'acreage'],
      'multifamily': ['multifamily', 'multi-family', 'apartment', 'duplex', 'triplex'],
      'commercial': ['commercial', 'retail', 'office', 'industrial']
    }
    
    Object.entries(propertyTypes).forEach(([type, keywords]) => {
      if (keywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(text))) {
        entities.propertyType = type
      }
    })
    
    // Extract numeric values
    const numbers = text.match(/\b\d+(?:,\d{3})*(?:\.\d+)?\b/g)
    if (numbers) {
      entities.numbers = numbers.map(n => parseFloat(n.replace(/,/g, '')))
    }
    
    // Extract time references
    const timePatterns = {
      'now': /\b(now|today|immediate|asap)\b/i,
      'soon': /\b(soon|shortly|near future|coming months?)\b/i,
      'future': /\b(future|later|eventually|someday)\b/i,
      'past': /\b(ago|last|previous|past)\b/i
    }
    
    Object.entries(timePatterns).forEach(([timeframe, pattern]) => {
      if (pattern.test(text)) {
        entities.timeframe = timeframe
      }
    })
    
    return entities
  }
  
  // Parse price strings
  private parsePrice(priceStr: string): number {
    let price = parseFloat(priceStr.replace(/[$,]/g, ''))
    
    if (/k|thousand/i.test(priceStr)) {
      price *= 1000
    } else if (/m|million/i.test(priceStr)) {
      price *= 1000000
    }
    
    return price
  }
  
  // Update user preferences based on entities
  private updatePreferences(context: ConversationContext, entities: Record<string, any>) {
    if (entities.locations) {
      context.preferences.locations = [
        ...(context.preferences.locations || []),
        ...entities.locations
      ].filter((v, i, a) => a.indexOf(v) === i) // unique
    }
    
    if (entities.propertyType) {
      context.preferences.propertyTypes = [
        ...(context.preferences.propertyTypes || []),
        entities.propertyType
      ].filter((v, i, a) => a.indexOf(v) === i)
    }
    
    if (entities.price) {
      // Update price range
      if (!context.preferences.priceRange) {
        context.preferences.priceRange = {
          min: entities.price * 0.8,
          max: entities.price * 1.2
        }
      } else {
        // Adjust range based on new price
        context.preferences.priceRange.min = Math.min(
          context.preferences.priceRange.min,
          entities.price * 0.8
        )
        context.preferences.priceRange.max = Math.max(
          context.preferences.priceRange.max,
          entities.price * 1.2
        )
      }
    }
  }
  
  // Get conversation context
  getContext(sessionId: string): ConversationContext | null {
    return this.conversations.get(sessionId) || null
  }
  
  // Get recent messages
  getRecentMessages(sessionId: string, limit: number = 10): Message[] {
    const context = this.conversations.get(sessionId)
    if (!context) return []
    
    return context.messages.slice(-limit)
  }
  
  // Get conversation summary
  getConversationSummary(sessionId: string): string {
    const context = this.conversations.get(sessionId)
    if (!context || context.messages.length === 0) {
      return 'No conversation history'
    }
    
    const userMessages = context.messages
      .filter(m => m.role === 'user')
      .slice(-5)
    
    const topics = new Set<string>()
    userMessages.forEach(msg => {
      if (msg.metadata?.intent) {
        topics.add(msg.metadata.intent)
      }
    })
    
    const preferences = []
    if (context.preferences.locations?.length) {
      preferences.push(`Interested in: ${context.preferences.locations.join(', ')}`)
    }
    if (context.preferences.propertyTypes?.length) {
      preferences.push(`Property types: ${context.preferences.propertyTypes.join(', ')}`)
    }
    if (context.preferences.priceRange) {
      preferences.push(`Budget: $${context.preferences.priceRange.min.toLocaleString()}-$${context.preferences.priceRange.max.toLocaleString()}`)
    }
    
    return `Topics discussed: ${Array.from(topics).join(', ')}. ${preferences.join('. ')}`
  }
  
  // Analyze conversation for insights
  analyzeConversation(sessionId: string): ConversationInsights {
    const context = this.conversations.get(sessionId)
    if (!context) {
      return this.getDefaultInsights()
    }
    
    // Analyze user messages
    const userMessages = context.messages.filter(m => m.role === 'user')
    
    // Determine experience level
    let experienceLevel: 'beginner' | 'intermediate' | 'expert' = 'beginner'
    const technicalTerms = ['cap rate', 'noi', 'irr', 'cash-on-cash', 'ltv', 'dscr']
    const technicalCount = userMessages.filter(msg => 
      technicalTerms.some(term => msg.content.toLowerCase().includes(term))
    ).length
    
    if (technicalCount > 3) experienceLevel = 'expert'
    else if (technicalCount > 1) experienceLevel = 'intermediate'
    
    // Analyze topics
    const topicsSummary: Record<string, number> = {}
    userMessages.forEach(msg => {
      const intent = msg.metadata?.intent || 'general'
      topicsSummary[intent] = (topicsSummary[intent] || 0) + 1
    })
    
    // Determine focus areas
    const focusAreas = Object.entries(topicsSummary)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic)
    
    // Analyze sentiment
    let sentimentScore = 0
    const positiveWords = ['great', 'excellent', 'love', 'excited', 'perfect', 'amazing']
    const negativeWords = ['worried', 'concerned', 'expensive', 'difficult', 'problem', 'issue']
    
    userMessages.forEach(msg => {
      const content = msg.content.toLowerCase()
      positiveWords.forEach(word => {
        if (content.includes(word)) sentimentScore++
      })
      negativeWords.forEach(word => {
        if (content.includes(word)) sentimentScore--
      })
    })
    
    const sentimentTrend = sentimentScore > 2 ? 'positive' : 
                          sentimentScore < -2 ? 'negative' : 'neutral'
    
    // Determine decision stage
    let decisionStage: 'research' | 'evaluation' | 'ready' = 'research'
    const evaluationKeywords = ['compare', 'versus', 'specific', 'this property', 'visit', 'tour']
    const readyKeywords = ['ready', 'offer', 'buy', 'contract', 'financing', 'close']
    
    if (userMessages.some(msg => readyKeywords.some(kw => msg.content.toLowerCase().includes(kw)))) {
      decisionStage = 'ready'
    } else if (userMessages.some(msg => evaluationKeywords.some(kw => msg.content.toLowerCase().includes(kw)))) {
      decisionStage = 'evaluation'
    }
    
    // Suggest next best actions
    const nextBestActions = this.suggestNextActions(context, decisionStage)
    
    return {
      userProfile: {
        experienceLevel,
        focusAreas,
        communicationStyle: this.detectCommunicationStyle(userMessages),
        decisionStage
      },
      topicsSummary,
      sentimentTrend,
      nextBestActions
    }
  }
  
  private detectCommunicationStyle(messages: Message[]): 'technical' | 'casual' | 'professional' {
    const content = messages.map(m => m.content).join(' ').toLowerCase()
    
    const casualIndicators = ['hey', 'gonna', 'wanna', 'yeah', 'cool', 'awesome']
    const technicalIndicators = ['analysis', 'calculate', 'metrics', 'data', 'percentage']
    
    const casualCount = casualIndicators.filter(word => content.includes(word)).length
    const technicalCount = technicalIndicators.filter(word => content.includes(word)).length
    
    if (casualCount > technicalCount * 2) return 'casual'
    if (technicalCount > casualCount * 2) return 'technical'
    return 'professional'
  }
  
  private suggestNextActions(context: ConversationContext, stage: string): string[] {
    const actions: string[] = []
    
    switch (stage) {
      case 'research':
        actions.push('View neighborhood comparison report')
        actions.push('Explore market trends dashboard')
        actions.push('Calculate investment potential')
        break
      case 'evaluation':
        actions.push('Schedule property tours')
        actions.push('Request detailed property analysis')
        actions.push('Compare financing options')
        break
      case 'ready':
        actions.push('Connect with preferred lender')
        actions.push('Review contract checklist')
        actions.push('Calculate closing costs')
        break
    }
    
    // Add context-specific actions
    if (context.preferences.locations?.length) {
      actions.push(`Get ${context.preferences.locations[0]} market report`)
    }
    
    if (context.currentIntent === 'investment_advice') {
      actions.push('View ROI calculator')
      actions.push('Analyze cash flow scenarios')
    }
    
    return actions
  }
  
  private getDefaultInsights(): ConversationInsights {
    return {
      userProfile: {
        experienceLevel: 'beginner',
        focusAreas: ['general'],
        communicationStyle: 'professional',
        decisionStage: 'research'
      },
      topicsSummary: {},
      sentimentTrend: 'neutral',
      nextBestActions: [
        'Start with a neighborhood overview',
        'Explore current market conditions',
        'Define your investment goals'
      ]
    }
  }
  
  // Generate message ID
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Clean up old conversations
  cleanupInactiveSessions(maxInactiveHours: number = 24) {
    const cutoffTime = Date.now() - (maxInactiveHours * 60 * 60 * 1000)
    
    for (const [sessionId, context] of this.conversations) {
      if (context.lastActive.getTime() < cutoffTime) {
        this.conversations.delete(sessionId)
      }
    }
  }
  
  // Export conversation
  exportConversation(sessionId: string): object | null {
    const context = this.conversations.get(sessionId)
    if (!context) return null
    
    return {
      sessionId: context.sessionId,
      userId: context.userId,
      startTime: context.messages[0]?.timestamp,
      endTime: context.lastActive,
      messageCount: context.messages.length,
      messages: context.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        intent: msg.metadata?.intent
      })),
      preferences: context.preferences,
      insights: this.analyzeConversation(sessionId)
    }
  }
}

export const conversationManager = new ConversationManager()
export default ConversationManager