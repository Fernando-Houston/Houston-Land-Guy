// Fernando-X Agent Integration
// Enhances Fernando-X with multi-agent capabilities for comprehensive property intelligence

interface AgentResponse {
  response: string
  data: any
  suggestions: string[]
  visualizations: any[]
  confidence: number
}

export class FernandoAgentIntegration {
  private apiEndpoint = '/api/agents/fernando'
  
  // Enhance Fernando's response with agent intelligence
  async enhanceResponse(
    message: string, 
    sessionId: string,
    context?: any
  ): Promise<AgentResponse> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId,
          context
        })
      })
      
      if (!response.ok) {
        throw new Error(`Agent API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Agent integration error:', error)
      
      // Fallback response
      return {
        response: "I'm having trouble accessing my advanced analysis tools right now. Let me help you with basic information instead.",
        data: {},
        suggestions: ['Try rephrasing your question', 'Ask about specific properties', 'Request market analysis'],
        visualizations: [],
        confidence: 0.3
      }
    }
  }
  
  // Determine if a query should use agent intelligence
  shouldUseAgents(message: string): boolean {
    const agentTriggers = [
      'analyze', 'evaluate', 'worth', 'value',
      'market', 'trend', 'appreciation',
      'invest', 'roi', 'rental',
      'develop', 'build', 'construction',
      'compare', 'vs', 'versus',
      'find', 'search', 'looking for',
      'data', 'statistics', 'numbers'
    ]
    
    const lowerMessage = message.toLowerCase()
    return agentTriggers.some(trigger => lowerMessage.includes(trigger))
  }
  
  // Format agent data for Fernando's conversational style
  formatAgentData(agentResponse: AgentResponse): string {
    let formattedResponse = agentResponse.response
    
    // Add confidence indicator if low
    if (agentResponse.confidence < 0.7) {
      formattedResponse += "\n\n*Note: Some data sources were unavailable, so this analysis may be incomplete.*"
    }
    
    // Add suggestions as conversational prompts
    if (agentResponse.suggestions.length > 0) {
      formattedResponse += "\n\nWould you like me to:"
      agentResponse.suggestions.forEach(suggestion => {
        formattedResponse += `\n• ${suggestion}`
      })
      formattedResponse += "\n\nJust let me know what interests you most!"
    }
    
    return formattedResponse
  }
  
  // Extract structured data from agent response
  extractStructuredData(agentResponse: AgentResponse): {
    properties?: any[]
    marketData?: any
    analysis?: any
    recommendations?: string[]
  } {
    const structured: any = {}
    
    if (agentResponse.data) {
      // Extract properties
      if (agentResponse.data.properties) {
        structured.properties = agentResponse.data.properties
      }
      
      // Extract market data
      if (agentResponse.data.markets || agentResponse.data.aggregated) {
        structured.marketData = agentResponse.data.markets || agentResponse.data
      }
      
      // Extract analysis
      if (agentResponse.data.validation || agentResponse.data.analysis) {
        structured.analysis = agentResponse.data.validation || agentResponse.data.analysis
      }
      
      // Extract recommendations
      if (agentResponse.data.recommendations) {
        structured.recommendations = agentResponse.data.recommendations
      }
    }
    
    return structured
  }
  
  // Generate visualizations from agent data
  generateVisualizations(agentResponse: AgentResponse): Array<{
    type: string
    component: string
    data: any
  }> {
    const visualizations: any[] = []
    
    agentResponse.visualizations.forEach(viz => {
      switch (viz.type) {
        case 'market-chart':
          visualizations.push({
            type: 'chart',
            component: 'MarketTrendChart',
            data: viz.data
          })
          break
          
        case 'market-comparison':
          visualizations.push({
            type: 'comparison',
            component: 'MarketComparisonTable',
            data: viz.data
          })
          break
          
        case 'property-analysis':
          visualizations.push({
            type: 'analysis',
            component: 'PropertyAnalysisCard',
            data: viz.data
          })
          break
          
        case 'heat-map':
          visualizations.push({
            type: 'map',
            component: 'MarketHeatMap',
            data: viz.data
          })
          break
      }
    })
    
    return visualizations
  }
  
  // Handle follow-up questions with context
  async handleFollowUp(
    message: string,
    sessionId: string,
    previousResponse: AgentResponse
  ): Promise<AgentResponse> {
    // Extract context from previous response
    const context = {
      previousTopic: this.extractTopic(previousResponse),
      previousData: previousResponse.data,
      ...this.extractEntities(message)
    }
    
    return this.enhanceResponse(message, sessionId, context)
  }
  
  // Extract topic from response
  private extractTopic(response: AgentResponse): string {
    if (response.data?.propertyData) return 'property-analysis'
    if (response.data?.markets) return 'market-analysis'
    if (response.data?.investment) return 'investment-analysis'
    if (response.data?.development) return 'development-analysis'
    return 'general'
  }
  
  // Extract entities from message
  private extractEntities(message: string): any {
    const entities: any = {}
    
    // Extract price/budget
    const priceMatch = message.match(/\$?([\d,]+)k?/i)
    if (priceMatch) {
      let price = parseInt(priceMatch[1].replace(/,/g, ''))
      if (message.includes('k')) price *= 1000
      entities.budget = price
    }
    
    // Extract zip code
    const zipMatch = message.match(/\b\d{5}\b/)
    if (zipMatch) entities.zipCode = zipMatch[0]
    
    // Extract property type
    const propertyTypes = ['house', 'condo', 'apartment', 'commercial', 'land']
    propertyTypes.forEach(type => {
      if (message.toLowerCase().includes(type)) {
        entities.propertyType = type
      }
    })
    
    return entities
  }
}

// Create singleton instance
export const fernandoAgentIntegration = new FernandoAgentIntegration()

// Example usage in Fernando-X component:
/*
import { fernandoAgentIntegration } from '@/lib/fernando-x/agent-integration'

// In your Fernando-X chat handler:
async function handleUserMessage(message: string, sessionId: string) {
  // Check if we should use agent intelligence
  if (fernandoAgentIntegration.shouldUseAgents(message)) {
    const agentResponse = await fernandoAgentIntegration.enhanceResponse(
      message,
      sessionId,
      currentContext
    )
    
    // Format response for display
    const formattedResponse = fernandoAgentIntegration.formatAgentData(agentResponse)
    
    // Extract structured data for UI components
    const structuredData = fernandoAgentIntegration.extractStructuredData(agentResponse)
    
    // Generate visualizations
    const visualizations = fernandoAgentIntegration.generateVisualizations(agentResponse)
    
    return {
      message: formattedResponse,
      data: structuredData,
      visualizations
    }
  } else {
    // Use regular Fernando-X response
    return generateStandardResponse(message)
  }
}
*/