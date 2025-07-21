// ChatGPT-powered conversation engine for Fernando-X
import OpenAI from 'openai'
import { enhancedDataQuery } from './enhanced-data-query-service'
import { fernandoDataQuery } from './data-query-service'
import { investmentScoring } from '../services/investment-scoring-service'

interface ChatGPTResponse {
  response: string
  confidence: number
  sources: string[]
  suggestedActions?: Array<{ label: string; action: string }>
}

export class ChatGPTConversationEngine {
  private openai: OpenAI | null = null
  private initialized = false
  
  constructor() {
    // Delay initialization to allow env vars to load
  }
  
  private initialize() {
    if (typeof window === 'undefined' && process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        })
        this.initialized = true
        console.log('🤖 ChatGPT engine initialized successfully')
        console.log('🔑 Using API key:', process.env.OPENAI_API_KEY.substring(0, 10) + '...')
      } catch (error) {
        console.error('❌ Failed to initialize OpenAI:', error)
      }
    } else {
      console.log('⚠️ ChatGPT not initialized')
      console.log('- Running on client?', typeof window !== 'undefined')
      console.log('- API key present?', !!process.env.OPENAI_API_KEY)
    }
  }
  
  async generateResponse(
    userMessage: string,
    sessionId: string,
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<ChatGPTResponse> {
    // Initialize on first use
    if (!this.initialized) {
      this.initialize()
    }
    
    if (!this.openai) {
      console.log('ChatGPT not available, falling back to pattern matching')
      return {
        response: "I'm currently running in pattern-matching mode. ChatGPT integration requires server-side configuration.",
        confidence: 0.5,
        sources: ['Pattern Matching Engine']
      }
    }
    
    try {
      // Gather relevant data based on the user's message
      const relevantData = await this.gatherRelevantData(userMessage)
      
      // Build the system prompt with real data
      const systemPrompt = this.buildSystemPrompt(relevantData)
      
      // Prepare messages for ChatGPT
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt }
      ]
      
      // Add conversation history (last 5 exchanges)
      const recentHistory = conversationHistory.slice(-10)
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })
      })
      
      // Add current message
      messages.push({ role: 'user', content: userMessage })
      
      // Call ChatGPT
      console.log('🤖 Calling ChatGPT 3.5 Turbo...')
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6, // Reduce repetition
        frequency_penalty: 0.3 // Encourage variety
      })
      
      const response = completion.choices[0]?.message?.content || 'I apologize, I had trouble generating a response.'
      
      // Generate suggested actions based on the conversation
      const suggestedActions = this.generateSuggestedActions(userMessage, response)
      
      return {
        response,
        confidence: 0.95,
        sources: ['ChatGPT 3.5 Turbo', 'Houston Real Estate Database'],
        suggestedActions
      }
      
    } catch (error) {
      console.error('ChatGPT error:', error)
      
      // Fallback response
      return {
        response: `I understand you're asking about Houston real estate. While I'm having technical difficulties with my AI service, I can still help you with specific data about properties, areas, or market trends. What specific information would you like?`,
        confidence: 0.6,
        sources: ['Fallback Response']
      }
    }
  }
  
  private async gatherRelevantData(message: string): Promise<any> {
    const messageLower = message.toLowerCase()
    const data: any = {}
    
    try {
      // Extract location mentions
      const neighborhoods = ['katy', 'cypress', 'spring', 'heights', 'montrose', 'downtown', 'eado', 'midtown']
      const mentionedArea = neighborhoods.find(n => messageLower.includes(n))
      
      if (mentionedArea) {
        // Get area-specific data
        const [demographics, rentalData, strData] = await Promise.all([
          enhancedDataQuery.getAreaDemographics(mentionedArea),
          enhancedDataQuery.getRentalMarketData(mentionedArea),
          enhancedDataQuery.getSTRMarketData(mentionedArea)
        ])
        
        data.area = {
          name: mentionedArea,
          demographics,
          rentalMarket: rentalData,
          strMarket: strData
        }
      }
      
      // Get market stats if discussing prices or investment
      if (messageLower.includes('price') || messageLower.includes('invest') || messageLower.includes('market')) {
        data.marketStats = await fernandoDataQuery.getMarketStats()
      }
      
      // Get construction costs if discussing building
      if (messageLower.includes('build') || messageLower.includes('construct')) {
        data.constructionCosts = await enhancedDataQuery.getConstructionCosts()
      }
      
      // Get database stats for credibility
      data.dbStats = await fernandoDataQuery.getDatabaseStats()
      
    } catch (error) {
      console.error('Error gathering data:', error)
    }
    
    return data
  }
  
  private buildSystemPrompt(data: any): string {
    const basePrompt = `You are Fernando-X, Houston's premier AI real estate assistant. You have access to a database with ${data.dbStats?.estimatedDataPoints || '750,000'}+ data points about Houston real estate.

Your personality:
- Friendly and conversational, like a knowledgeable local friend
- Give specific, actionable advice with real numbers
- Be concise - aim for 2-3 paragraphs max
- Use a natural, helpful tone without being overly formal
- Acknowledge budget constraints and provide realistic options
- Build on previous conversation context
- Ask ONE clarifying question when appropriate to show you're engaged

Current Houston market data you have access to:
${JSON.stringify(data, null, 2)}

Guidelines:
1. Always cite specific numbers when available
2. Provide 2-3 concrete options or recommendations
3. Keep responses focused and practical
4. If someone mentions a budget, immediately acknowledge it and provide options within that range
5. For areas mentioned, share specific insights about that neighborhood
6. End with a natural follow-up question to keep conversation flowing

Remember: You're having a conversation, not giving a presentation. Be helpful, specific, and human.`

    return basePrompt
  }
  
  private generateSuggestedActions(message: string, response: string): Array<{ label: string; action: string }> {
    const actions: Array<{ label: string; action: string }> = []
    const combinedText = (message + ' ' + response).toLowerCase()
    
    // Smart action suggestions based on conversation
    if (combinedText.includes('calculat') || combinedText.includes('roi')) {
      actions.push({ label: 'ROI Calculator', action: 'navigate:/roi-calculator' })
    }
    
    if (combinedText.includes('map') || combinedText.includes('area') || combinedText.includes('neighborhood')) {
      actions.push({ label: 'View Map', action: 'navigate:/intelligence/map' })
    }
    
    if (combinedText.includes('search') || combinedText.includes('find') || combinedText.includes('properties')) {
      actions.push({ label: 'Search Properties', action: 'search:properties' })
    }
    
    if (combinedText.includes('build') || combinedText.includes('construct')) {
      actions.push({ label: 'Cost Calculator', action: 'navigate:/tools/cost-calculator' })
    }
    
    // Default actions if none matched
    if (actions.length === 0) {
      actions.push(
        { label: 'Explore Data', action: 'navigate:/intelligence' },
        { label: 'View Properties', action: 'search:properties' }
      )
    }
    
    return actions.slice(0, 3) // Max 3 actions
  }
}

export const chatGPTEngine = new ChatGPTConversationEngine()