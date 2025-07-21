import { NextRequest, NextResponse } from 'next/server'
import { EnhancedOrchestrator } from '@/lib/agents/orchestrator-enhanced'
import { VisualIntelligenceAgentWrapper } from '@/lib/agents/visual-intelligence-agent-wrapper'
import { APIIntegrationAgent } from '@/lib/agents/api-integration-agent'
import { DataAccuracyAgent } from '@/lib/agents/data-accuracy-agent'
import { AgentTask } from '@/lib/agents/base-agent'

// Initialize orchestrator and agents
const orchestrator = new EnhancedOrchestrator({
  enableLogging: true,
  enableMetrics: true,
  enableCaching: true
})

// Register agents
orchestrator.registerAgent(new VisualIntelligenceAgentWrapper())
orchestrator.registerAgent(new APIIntegrationAgent())
orchestrator.registerAgent(new DataAccuracyAgent())

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { analysisType, data, options = {} } = body
    
    if (!analysisType || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: analysisType and data' },
        { status: 400 }
      )
    }
    
    let tasks: AgentTask[] = []
    
    switch (analysisType) {
      case 'comprehensive-property':
        tasks = createComprehensivePropertyTasks(data)
        break
        
      case 'market-analysis':
        tasks = createMarketAnalysisTasks(data)
        break
        
      case 'investment-opportunity':
        tasks = createInvestmentOpportunityTasks(data)
        break
        
      case 'development-potential':
        tasks = createDevelopmentPotentialTasks(data)
        break
        
      case 'quick-valuation':
        tasks = createQuickValuationTasks(data)
        break
        
      default:
        return NextResponse.json(
          { error: `Unknown analysis type: ${analysisType}` },
          { status: 400 }
        )
    }
    
    // Create execution plan with dependencies
    const dependencies = options.dependencies || []
    const plan = orchestrator.createExecutionPlan(tasks, dependencies)
    
    // Execute the plan
    const { results, summary } = await orchestrator.executePlan(plan)
    
    // Format response
    const response = {
      analysisType,
      summary: {
        ...summary,
        confidence: calculateOverallConfidence(results),
        recommendations: generateRecommendations(analysisType, results)
      },
      results: formatResults(results),
      metrics: orchestrator.getAgentMetrics()
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Agent analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Create comprehensive property analysis tasks
function createComprehensivePropertyTasks(data: any): AgentTask[] {
  const { address, images = [], propertyDetails = {} } = data
  
  const tasks: AgentTask[] = [
    // Visual analysis tasks
    ...images.map((imageUrl: string, index: number) => ({
      id: `visual-property-${index}`,
      type: 'visual-analysis' as const,
      priority: 1,
      data: {
        action: 'analyzeProperty',
        params: { imageUrl, propertyType: propertyDetails.type }
      }
    })),
    
    // API data fetching
    {
      id: 'api-property-data',
      type: 'api-fetch' as const,
      priority: 1,
      data: {
        action: 'fetchPropertyData',
        params: { address }
      }
    },
    
    // Market trends
    {
      id: 'api-market-trends',
      type: 'api-fetch' as const,
      priority: 2,
      data: {
        action: 'fetchMarketTrends',
        params: { 
          zipCode: propertyDetails.zipCode || extractZipCode(address),
          timeframe: 'current'
        }
      }
    },
    
    // Data validation
    {
      id: 'validate-property',
      type: 'data-validation' as const,
      priority: 3,
      data: {
        action: 'validateProperty',
        params: { propertyData: propertyDetails }
      }
    }
  ]
  
  return tasks
}

// Create market analysis tasks
function createMarketAnalysisTasks(data: any): AgentTask[] {
  const { zipCodes = [], neighborhoods = [], timeframe = '6months' } = data
  
  const tasks: AgentTask[] = []
  
  // Create market trend tasks for each area
  const areas = [...zipCodes, ...neighborhoods]
  areas.forEach((area, index) => {
    tasks.push({
      id: `market-trends-${index}`,
      type: 'api-fetch' as const,
      priority: 1,
      data: {
        action: 'fetchMarketTrends',
        params: { 
          zipCode: area,
          timeframe
        }
      }
    })
    
    tasks.push({
      id: `area-development-${index}`,
      type: 'api-fetch' as const,
      priority: 2,
      data: {
        action: 'fetchAreaDevelopment',
        params: { area }
      }
    })
  })
  
  // Add anomaly detection
  tasks.push({
    id: 'detect-market-anomalies',
    type: 'data-validation' as const,
    priority: 3,
    data: {
      action: 'detectAnomalies',
      params: {
        dataset: areas,
        field: 'marketTrends'
      }
    }
  })
  
  return tasks
}

// Create investment opportunity tasks
function createInvestmentOpportunityTasks(data: any): AgentTask[] {
  const { properties = [], investmentCriteria = {} } = data
  
  const tasks: AgentTask[] = []
  
  // Analyze each property
  properties.forEach((property: any, index: number) => {
    // Fetch property data
    tasks.push({
      id: `inv-property-${index}`,
      type: 'api-fetch' as const,
      priority: 1,
      data: {
        action: 'fetchPropertyData',
        params: { address: property.address }
      }
    })
    
    // Visual analysis if images provided
    if (property.images?.length > 0) {
      tasks.push({
        id: `inv-visual-${index}`,
        type: 'visual-analysis' as const,
        priority: 2,
        data: {
          action: 'analyzeProperty',
          params: { 
            imageUrl: property.images[0],
            propertyType: property.type
          }
        }
      })
    }
  })
  
  // Cross-reference all data
  tasks.push({
    id: 'inv-cross-reference',
    type: 'data-validation' as const,
    priority: 3,
    data: {
      action: 'crossReference',
      params: {
        sources: properties.map((p: any, i: number) => ({
          source: `property-${i}`,
          data: p
        }))
      }
    }
  })
  
  return tasks
}

// Create development potential tasks
function createDevelopmentPotentialTasks(data: any): AgentTask[] {
  const { location, images = [], currentUse, proposedUse } = data
  
  const tasks: AgentTask[] = [
    // Area development data
    {
      id: 'dev-area-data',
      type: 'api-fetch' as const,
      priority: 1,
      data: {
        action: 'fetchAreaDevelopment',
        params: { area: location }
      }
    },
    
    // Construction detection
    ...images.map((imageUrl: string, index: number) => ({
      id: `dev-construction-${index}`,
      type: 'visual-analysis' as const,
      priority: 2,
      data: {
        action: 'detectConstruction',
        params: { imageUrl }
      }
    })),
    
    // Satellite/aerial analysis if available
    {
      id: 'dev-satellite',
      type: 'visual-analysis' as const,
      priority: 2,
      data: {
        action: 'analyzeSatellite',
        params: { 
          imageUrl: images.find((img: string) => img.includes('satellite') || img.includes('aerial')) || images[0]
        }
      }
    }
  ]
  
  return tasks
}

// Create quick valuation tasks
function createQuickValuationTasks(data: any): AgentTask[] {
  const { address, propertyDetails = {} } = data
  
  return [
    {
      id: 'quick-property-data',
      type: 'api-fetch' as const,
      priority: 1,
      data: {
        action: 'fetchPropertyData',
        params: { address }
      }
    },
    {
      id: 'quick-market-data',
      type: 'api-fetch' as const,
      priority: 1,
      data: {
        action: 'fetchMarketTrends',
        params: { 
          zipCode: propertyDetails.zipCode || extractZipCode(address),
          timeframe: 'current'
        }
      }
    }
  ]
}

// Helper functions
function extractZipCode(address: string): string {
  const zipMatch = address.match(/\b\d{5}\b/)
  return zipMatch ? zipMatch[0] : '77002' // Default to downtown Houston
}

function calculateOverallConfidence(results: any[]): number {
  const confidenceScores = results
    .filter(r => r.success && r.data?.confidence)
    .map(r => r.data.confidence)
  
  if (confidenceScores.length === 0) return 0.5
  
  return confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
}

function generateRecommendations(analysisType: string, results: any[]): string[] {
  const recommendations: string[] = []
  
  // Extract insights from results
  const successfulResults = results.filter(r => r.success)
  
  switch (analysisType) {
    case 'comprehensive-property':
      // Property-specific recommendations
      const propertyData = successfulResults.find(r => r.taskId.includes('property-data'))?.data
      const visualData = successfulResults.find(r => r.taskId.includes('visual'))?.data
      
      if (propertyData?.daysOnMarket > 60) {
        recommendations.push('Property has been on market for extended period - negotiate price')
      }
      
      if (visualData?.renovationEstimate > 50000) {
        recommendations.push('Significant renovation needed - factor into offer price')
      }
      break
      
    case 'market-analysis':
      // Market trend recommendations
      const marketData = successfulResults.filter(r => r.taskId.includes('market'))
      const avgAppreciation = marketData.reduce((sum, r) => 
        sum + (r.data?.appreciation?.year || 0), 0) / marketData.length
      
      if (avgAppreciation > 8) {
        recommendations.push('Strong appreciation trend - consider investing in this area')
      }
      break
      
    case 'investment-opportunity':
      // Investment recommendations
      const crossRef = successfulResults.find(r => r.taskId.includes('cross-reference'))?.data
      
      if (crossRef?.confidence > 0.8) {
        recommendations.push('High data confidence - reliable for investment decision')
      }
      break
  }
  
  // Add generic recommendations
  if (recommendations.length === 0) {
    recommendations.push('Review detailed results for specific insights')
  }
  
  return recommendations
}

function formatResults(results: any[]): Record<string, any> {
  const formatted: Record<string, any> = {}
  
  results.forEach(result => {
    const category = result.taskId.split('-')[0]
    if (!formatted[category]) {
      formatted[category] = []
    }
    
    formatted[category].push({
      taskId: result.taskId,
      agentName: result.agentName,
      success: result.success,
      data: result.data,
      error: result.error,
      executionTime: result.executionTime
    })
  })
  
  return formatted
}

// GET endpoint to check agent status
export async function GET() {
  const status = {
    agents: orchestrator.getAgents(),
    metrics: orchestrator.getAgentMetrics(),
    status: orchestrator.getAllAgentStatuses()
  }
  
  return NextResponse.json(status)
}