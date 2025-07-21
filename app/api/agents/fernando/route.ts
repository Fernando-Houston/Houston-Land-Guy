import { NextRequest, NextResponse } from 'next/server'
import { EnhancedOrchestrator } from '@/lib/agents/orchestrator-enhanced'
import { VisualIntelligenceAgentWrapper } from '@/lib/agents/visual-intelligence-agent-wrapper'
import { APIIntegrationAgent } from '@/lib/agents/api-integration-agent'
import { DataAccuracyAgent } from '@/lib/agents/data-accuracy-agent'
import { AgentTask } from '@/lib/agents/base-agent'

// Initialize orchestrator
const orchestrator = new EnhancedOrchestrator({
  enableLogging: false, // Disable for Fernando-X
  enableMetrics: true,
  enableCaching: true,
  cacheTTL: 600000 // 10 minutes for Fernando responses
})

// Register agents
orchestrator.registerAgent(new VisualIntelligenceAgentWrapper())
orchestrator.registerAgent(new APIIntegrationAgent())
orchestrator.registerAgent(new DataAccuracyAgent())

interface FernandoQuery {
  message: string
  sessionId: string
  context?: {
    budget?: number
    propertyType?: string
    location?: string
    purpose?: 'buy' | 'sell' | 'invest' | 'develop'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FernandoQuery = await request.json()
    const { message, sessionId, context } = body
    
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: message and sessionId' },
        { status: 400 }
      )
    }
    
    // Parse user intent from message
    const intent = parseUserIntent(message, context)
    
    // Create tasks based on intent
    const tasks = createTasksFromIntent(intent)
    
    if (tasks.length === 0) {
      return NextResponse.json({
        needsMoreInfo: true,
        clarification: "I'd be happy to help! Could you provide more specific details about what you're looking for?"
      })
    }
    
    // Execute tasks
    const results = await orchestrator.executeParallelTasks(tasks)
    
    // Format response for Fernando-X
    const response = formatFernandoResponse(intent, results, context)
    
    return NextResponse.json({
      response: response.message,
      data: response.data,
      suggestions: response.suggestions,
      visualizations: response.visualizations,
      confidence: response.confidence
    })
    
  } catch (error) {
    console.error('Fernando agent integration error:', error)
    return NextResponse.json(
      { 
        response: "I apologize, but I'm having trouble processing your request. Could you please try rephrasing it?",
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// Parse user intent from natural language
function parseUserIntent(message: string, context?: any) {
  const lowerMessage = message.toLowerCase()
  
  const intent: any = {
    type: 'general',
    entities: {},
    confidence: 0.5
  }
  
  // Property search intent
  if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for')) {
    intent.type = 'property-search'
    intent.confidence = 0.8
    
    // Extract property type
    if (lowerMessage.includes('house')) intent.entities.propertyType = 'house'
    if (lowerMessage.includes('condo')) intent.entities.propertyType = 'condo'
    if (lowerMessage.includes('apartment')) intent.entities.propertyType = 'apartment'
    if (lowerMessage.includes('commercial')) intent.entities.propertyType = 'commercial'
    if (lowerMessage.includes('land')) intent.entities.propertyType = 'land'
    
    // Extract location
    const zipMatch = message.match(/\b\d{5}\b/)
    if (zipMatch) intent.entities.zipCode = zipMatch[0]
    
    const neighborhoods = ['heights', 'montrose', 'midtown', 'river oaks', 'galleria', 'memorial']
    neighborhoods.forEach(n => {
      if (lowerMessage.includes(n)) intent.entities.neighborhood = n
    })
    
    // Extract budget
    const priceMatch = message.match(/\$?([\d,]+)k?/i)
    if (priceMatch) {
      let price = parseInt(priceMatch[1].replace(/,/g, ''))
      if (message.includes('k')) price *= 1000
      intent.entities.budget = price
    }
  }
  
  // Property analysis intent
  else if (lowerMessage.includes('analyze') || lowerMessage.includes('evaluate') || lowerMessage.includes('worth')) {
    intent.type = 'property-analysis'
    intent.confidence = 0.85
    
    // Extract address if present
    const addressMatch = message.match(/\d+\s+[\w\s]+(?:st|street|rd|road|ave|avenue|blvd|boulevard|ln|lane|dr|drive)/i)
    if (addressMatch) intent.entities.address = addressMatch[0]
  }
  
  // Market analysis intent
  else if (lowerMessage.includes('market') || lowerMessage.includes('trend') || lowerMessage.includes('appreciation')) {
    intent.type = 'market-analysis'
    intent.confidence = 0.9
  }
  
  // Investment intent
  else if (lowerMessage.includes('invest') || lowerMessage.includes('roi') || lowerMessage.includes('rental')) {
    intent.type = 'investment-analysis'
    intent.confidence = 0.85
  }
  
  // Development intent
  else if (lowerMessage.includes('develop') || lowerMessage.includes('build') || lowerMessage.includes('construction')) {
    intent.type = 'development-analysis'
    intent.confidence = 0.8
  }
  
  // Merge with context
  if (context) {
    intent.entities = { ...intent.entities, ...context }
  }
  
  return intent
}

// Create agent tasks based on parsed intent
function createTasksFromIntent(intent: any): AgentTask[] {
  const tasks: AgentTask[] = []
  
  switch (intent.type) {
    case 'property-search':
      // Market data for the area
      if (intent.entities.zipCode || intent.entities.neighborhood) {
        tasks.push({
          id: 'search-market-data',
          type: 'api-fetch',
          priority: 1,
          data: {
            action: 'fetchMarketTrends',
            params: {
              zipCode: intent.entities.zipCode || intent.entities.neighborhood,
              timeframe: 'current'
            }
          }
        })
      }
      break
      
    case 'property-analysis':
      if (intent.entities.address) {
        // Fetch property data
        tasks.push({
          id: 'analyze-property-data',
          type: 'api-fetch',
          priority: 1,
          data: {
            action: 'fetchPropertyData',
            params: { address: intent.entities.address }
          }
        })
        
        // Validate data
        tasks.push({
          id: 'validate-property',
          type: 'data-validation',
          priority: 2,
          data: {
            action: 'validateProperty',
            params: { propertyData: intent.entities }
          }
        })
      }
      break
      
    case 'market-analysis':
      const areas = intent.entities.zipCode ? [intent.entities.zipCode] : ['77002', '77006', '77008']
      areas.forEach((area, index) => {
        tasks.push({
          id: `market-${index}`,
          type: 'api-fetch',
          priority: 1,
          data: {
            action: 'fetchMarketTrends',
            params: { zipCode: area, timeframe: '1year' }
          }
        })
      })
      
      // Detect anomalies
      tasks.push({
        id: 'market-anomalies',
        type: 'data-validation',
        priority: 2,
        data: {
          action: 'detectAnomalies',
          params: { dataset: areas, field: 'marketTrends' }
        }
      })
      break
      
    case 'investment-analysis':
      // Get market data for ROI calculation
      tasks.push({
        id: 'investment-market',
        type: 'api-fetch',
        priority: 1,
        data: {
          action: 'fetchMarketTrends',
          params: { 
            zipCode: intent.entities.zipCode || '77002',
            timeframe: '2years'
          }
        }
      })
      break
      
    case 'development-analysis':
      // Get area development data
      tasks.push({
        id: 'dev-area',
        type: 'api-fetch',
        priority: 1,
        data: {
          action: 'fetchAreaDevelopment',
          params: { area: intent.entities.location || 'Houston' }
        }
      })
      break
  }
  
  return tasks
}

// Format response for Fernando-X
function formatFernandoResponse(intent: any, results: any, context?: any) {
  const successfulResults = results.results.filter((r: any) => r.success)
  
  let message = ''
  let data: any = {}
  let suggestions: string[] = []
  let visualizations: any[] = []
  let confidence = results.summary.successfulTasks / results.summary.totalTasks
  
  switch (intent.type) {
    case 'property-search':
      const marketData = successfulResults.find((r: any) => r.taskId.includes('market'))?.data
      
      if (marketData) {
        const area = intent.entities.zipCode || intent.entities.neighborhood || 'the area'
        message = `Based on current market data for ${area}, the median home price is ${formatPrice(marketData.aggregated?.medianPrice || 0)} with properties typically staying on the market for ${marketData.aggregated?.daysOnMarket || 'N/A'} days. `
        
        if (marketData.aggregated?.priceChange > 0) {
          message += `The area has seen ${marketData.aggregated.priceChange}% appreciation recently. `
        }
        
        if (intent.entities.budget) {
          const budget = intent.entities.budget
          if (budget < marketData.aggregated?.medianPrice * 0.8) {
            message += `Your budget of ${formatPrice(budget)} might require looking at smaller properties or considering nearby areas. `
            suggestions.push('Search in nearby zip codes', 'Consider condos or townhomes', 'Look at properties needing renovation')
          } else {
            message += `Your budget of ${formatPrice(budget)} should provide good options in this area. `
            suggestions.push('Schedule property viewings', 'Get pre-approved for financing', 'Work with a local agent')
          }
        }
        
        data = marketData
        
        // Add visualization
        visualizations.push({
          type: 'market-chart',
          data: marketData
        })
      } else {
        message = "I'm having trouble accessing market data right now. Could you provide more specific location details?"
      }
      break
      
    case 'property-analysis':
      const propertyData = successfulResults.find((r: any) => r.taskId.includes('property'))?.data
      const validationData = successfulResults.find((r: any) => r.taskId.includes('validate'))?.data
      
      if (propertyData) {
        message = `Here's my analysis of the property at ${intent.entities.address}: `
        
        // Add property details
        if (propertyData.length > 0) {
          const realtorData = propertyData.find((d: any) => d.source === 'Realtor.com')?.data
          if (realtorData) {
            message += `It's currently listed at ${formatPrice(realtorData.listPrice)} and has been on the market for ${realtorData.daysOnMarket} days. `
            
            if (realtorData.priceHistory?.length > 0) {
              const priceChange = realtorData.priceHistory[realtorData.priceHistory.length - 1]
              message += `The price was ${priceChange.event.toLowerCase()} on ${new Date(priceChange.date).toLocaleDateString()}. `
            }
          }
        }
        
        if (validationData?.overallConfidence > 0.8) {
          message += 'The data quality is high, so this analysis should be reliable. '
        }
        
        data = { property: propertyData, validation: validationData }
        suggestions.push('Request a showing', 'Get a professional inspection', 'Research the neighborhood')
      } else {
        message = "I couldn't find detailed information for that property. Please verify the address and try again."
      }
      break
      
    case 'market-analysis':
      const marketResults = successfulResults.filter((r: any) => r.taskId.includes('market'))
      const anomalies = successfulResults.find((r: any) => r.taskId.includes('anomalies'))?.data
      
      if (marketResults.length > 0) {
        message = "Here's my market analysis for Houston areas: "
        
        marketResults.forEach((result: any) => {
          const marketData = result.data
          if (marketData?.aggregated) {
            message += `\n\n${marketData.zipCode}: Median price ${formatPrice(marketData.aggregated.medianPrice)}, ${marketData.aggregated.priceChange}% change, ${marketData.aggregated.daysOnMarket} days on market. `
          }
        })
        
        if (anomalies?.length > 0) {
          message += '\n\nNote: I detected some unusual market activity in certain areas that might present opportunities or risks.'
        }
        
        data = { markets: marketResults.map((r: any) => r.data), anomalies }
        suggestions.push('Compare specific neighborhoods', 'Analyze price trends', 'Look at inventory levels')
        
        visualizations.push({
          type: 'market-comparison',
          data: marketResults.map((r: any) => r.data)
        })
      }
      break
      
    case 'investment-analysis':
      const investmentData = successfulResults[0]?.data
      
      if (investmentData) {
        const roi = calculateROI(investmentData, intent.entities)
        message = `For investment properties in ${intent.entities.zipCode || 'this area'}, `
        message += `the median price is ${formatPrice(investmentData.aggregated?.medianPrice || 0)}. `
        message += `Based on current market conditions, estimated annual ROI could be around ${roi}%. `
        message += `The market has appreciated ${investmentData.aggregated?.priceChange || 0}% recently. `
        
        data = { investment: investmentData, estimatedROI: roi }
        suggestions.push('Analyze specific properties', 'Calculate cash flow', 'Research rental demand')
      }
      break
      
    case 'development-analysis':
      const devData = successfulResults[0]?.data
      
      if (devData) {
        message = `Development analysis for ${intent.entities.location || 'Houston'}: `
        message += `The area is showing ${devData.developmentActivity || 'moderate'} development activity. `
        
        data = devData
        suggestions.push('Check zoning regulations', 'Research permits', 'Analyze construction costs')
      }
      break
      
    default:
      message = "I can help you with property searches, market analysis, investment opportunities, and development potential. What would you like to know?"
      suggestions.push('Search for properties', 'Analyze market trends', 'Evaluate investment opportunities')
  }
  
  return {
    message,
    data,
    suggestions,
    visualizations,
    confidence
  }
}

// Helper functions
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price)
}

function calculateROI(marketData: any, entities: any): number {
  // Simple ROI calculation
  const price = marketData.aggregated?.medianPrice || 500000
  const monthlyRent = price * 0.007 // 0.7% rent-to-price ratio
  const annualRent = monthlyRent * 12
  const expenses = annualRent * 0.4 // 40% for expenses
  const netIncome = annualRent - expenses
  const downPayment = price * 0.2 // 20% down
  
  return Math.round((netIncome / downPayment) * 100)
}