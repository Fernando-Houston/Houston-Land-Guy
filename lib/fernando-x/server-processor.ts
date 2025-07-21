// Server-side Fernando-X processor - only for use in API routes
import { FernandoXQuery, FernandoXResponse } from '../fernando-x'
import { INTEGRATED_DATA } from '../fernando-x-data'
import { fernandoMemory } from './memory-service'
import { conversationEngine } from './conversation-engine'

export async function processServerQuery(query: FernandoXQuery): Promise<FernandoXResponse> {
  // DIAGNOSTIC: Log to verify enhanced version is being used
  console.log('🚀 FERNANDO-X ENHANCED (Server): Processing query with 750,000+ data points and memory')
  console.log('📊 Data verification:', {
    populationGrowth: INTEGRATED_DATA.populationGrowth.totalProjected,
    totalDevelopers: INTEGRATED_DATA.developers.length,
    majorProjects: INTEGRATED_DATA.majorProjects.length,
    memoryEnabled: true,
    conversationEngineActive: true,
    chatGPTEnabled: !!process.env.OPENAI_API_KEY,
    apiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'NOT SET',
    queryText: query.text,
    sessionId: query.context?.sessionId || 'no-session'
  })
  
  try {
    // Use the conversation engine for natural responses
    const sessionId = query.context?.sessionId || `session-${Date.now()}`
    const context = await conversationEngine.getConversationContext(sessionId)
    
    // Log whether this will use conversational or data engine
    const isConversational = query.text.toLowerCase().includes('budget') || 
                            query.text.toLowerCase().includes('what else') ||
                            query.text.toLowerCase().includes('build') ||
                            query.text.split(' ').length < 10
    
    console.log('🤖 Response type:', isConversational ? 'CONVERSATIONAL' : 'DATA-DRIVEN')
    
    const result = await conversationEngine.generateResponse(query.text, {
      ...context,
      userId: query.context?.userId
    })
    
    // Store the conversation
    if (query.context?.sessionId) {
      await conversationEngine.storeConversation(
        sessionId,
        query.context.userId,
        query.text,
        result.response
      )
    }
    
    return {
      text: result.response,
      data: result.suggestedActions,
      confidence: result.confidence,
      sources: result.sources
    }
  } catch (error) {
    console.error('Error in conversation engine, falling back to static data:', error)
    
    // Fallback to static data responses
    const queryLower = query.text.toLowerCase()
    
    // Use same fallback logic as client-side
    if (queryLower.includes('hello') || queryLower.includes('hi')) {
      return {
        text: `🚀 Hello! I'm Fernando-X ENHANCED VERSION with 750,000+ Houston real estate data points! 

I can provide detailed insights on:

📊 Market Analysis: $${INTEGRATED_DATA.marketMetrics.medianHomePrice.toLocaleString()} median price, ${INTEGRATED_DATA.marketMetrics.priceGrowthYoY}% growth
🏗️ Development: ${INTEGRATED_DATA.permitActivity.totalPermits.toLocaleString()} active permits worth $${(INTEGRATED_DATA.permitActivity.totalConstructionValue / 1000000000).toFixed(1)}B
🏙️ Major Projects: $${(INTEGRATED_DATA.majorProjects.reduce((sum, p) => sum + p.value, 0) / 1000000000).toFixed(1)}B pipeline including East River
👥 Demographics: ${INTEGRATED_DATA.populationGrowth.totalProjected.toLocaleString()} population growth projected
💼 Employment: ${INTEGRATED_DATA.jobGrowth.totalNewJobs.toLocaleString()} new jobs coming
🏘️ Neighborhoods: EaDo leading with 250% growth potential

What aspect of Houston real estate interests you most?`,
        confidence: 0.99,
        sources: ['Fernando-X Knowledge Base', 'Houston Market Overview', 'July 2025 Data']
      }
    }
    
    // Default response for unmatched queries
    return {
      text: "I'm having trouble processing that specific request. Could you rephrase or ask about Houston market data, developers, construction costs, or neighborhoods?",
      confidence: 0.7,
      sources: ['Fernando-X Enhanced']
    }
  }
}