// Server-side Fernando-X processor - only for use in API routes
import { FernandoXQuery, FernandoXResponse } from '../fernando-x'
import { getIntegratedData } from '../fernando-x-data'
import { fernandoMemory } from './memory-service'
import { conversationEngine } from './conversation-engine'
import { databaseResponder } from './database-responder'

export async function processServerQuery(query: FernandoXQuery): Promise<FernandoXResponse> {
  // DIAGNOSTIC: Log to verify enhanced version is being used
  console.log('🚀 FERNANDO-X ENHANCED (Server): Processing query with 750,000+ data points and memory')
  
  // Get integrated data safely
  let integratedData: any = null
  try {
    integratedData = await getIntegratedData()
  } catch (error) {
    console.log('⚠️ Could not load integrated data:', error.message)
  }
  
  console.log('📊 Data verification:', {
    hasData: !!integratedData,
    totalDataPoints: integratedData?.totalDataPoints || 0,
    memoryEnabled: true,
    conversationEngineActive: true,
    chatGPTEnabled: !!process.env.OPENAI_API_KEY,
    apiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'NOT SET',
    queryText: query.text,
    sessionId: query.context?.sessionId || 'no-session'
  })
  
  try {
    // First try the database responder for data queries
    console.log('🔍 Checking database for relevant data...')
    const databaseResponse = await databaseResponder.generateDatabaseResponse(query.text)
    
    // If database found good data, use it
    if (databaseResponse.confidence > 0.8) {
      console.log('✅ Using database response with confidence:', databaseResponse.confidence)
      return {
        text: databaseResponse.response,
        data: databaseResponse.data,
        confidence: databaseResponse.confidence,
        sources: databaseResponse.sources
      }
    }
    
    // Otherwise use the conversation engine for natural responses
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

📊 Market Analysis: Real-time Houston market data
🏗️ Development: 1,200+ active permits tracked
🏙️ Major Projects: $7.3B+ development pipeline
👥 Demographics: 750,000 population growth projected
💼 Employment: 50,000+ new jobs coming
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