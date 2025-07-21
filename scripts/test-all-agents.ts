// Test all agents working together
import { AgentOrchestrator } from '../lib/agents/orchestrator'
import { VisualIntelligenceAgentWrapper } from '../lib/agents/visual-intelligence-agent-wrapper'
import { APIIntegrationAgent } from '../lib/agents/api-integration-agent'
import { DataAccuracyAgent } from '../lib/agents/data-accuracy-agent'
import { AgentTask } from '../lib/agents/base-agent'

async function testAllAgents() {
  console.log('🚀 Testing Multi-Agent System with All Agents\n')
  
  // Set mock mode if Replicate token not available
  if (!process.env.REPLICATE_API_TOKEN) {
    console.log('⚠️  No REPLICATE_API_TOKEN found, using mock mode for visual agent\n')
    process.env.USE_REPLICATE = 'false'
  }
  
  // Create orchestrator
  const orchestrator = new AgentOrchestrator({
    enableLogging: true
  })
  
  // Register all agents
  const visualAgent = new VisualIntelligenceAgentWrapper()
  const apiAgent = new APIIntegrationAgent()
  const dataAgent = new DataAccuracyAgent()
  
  orchestrator.registerAgent(visualAgent)
  orchestrator.registerAgent(apiAgent)
  orchestrator.registerAgent(dataAgent)
  
  console.log('\n📋 Registered Agents:', orchestrator.getAgents())
  
  // Create comprehensive property analysis tasks
  const propertyAddress = '1234 Main St, Houston, TX 77002'
  const propertyImage = 'https://example.com/property-image.jpg'
  
  const tasks: AgentTask[] = [
    // Visual Intelligence Tasks
    {
      id: 'visual-1',
      type: 'visual-analysis',
      priority: 1,
      data: {
        action: 'analyzeProperty',
        params: {
          imageUrl: propertyImage,
          propertyType: 'residential'
        }
      }
    },
    // API Integration Tasks
    {
      id: 'api-1',
      type: 'api-fetch',
      priority: 1,
      data: {
        action: 'fetchPropertyData',
        params: {
          address: propertyAddress
        }
      }
    },
    {
      id: 'api-2',
      type: 'api-fetch',
      priority: 1,
      data: {
        action: 'fetchMarketTrends',
        params: {
          zipCode: '77002',
          timeframe: 'current'
        }
      }
    },
    // Data Accuracy Tasks
    {
      id: 'data-1',
      type: 'data-validation',
      priority: 2,
      data: {
        action: 'validateProperty',
        params: {
          propertyData: {
            address: propertyAddress,
            price: 425000,
            sqft: 1500,
            yearBuilt: 2010
          }
        }
      }
    }
  ]
  
  console.log(`\n🎯 Executing ${tasks.length} tasks across 3 agents...\n`)
  
  const startTime = Date.now()
  const results = await orchestrator.executeParallelTasks(tasks)
  
  console.log(`\n✅ All tasks completed in ${Date.now() - startTime}ms`)
  console.log('\n📊 Results Summary:')
  console.log(`- Total Tasks: ${results.summary.totalTasks}`)
  console.log(`- Successful: ${results.summary.successfulTasks}`)
  console.log(`- Failed: ${results.summary.failedTasks}`)
  console.log(`- Average Time: ${Math.round(results.summary.averageExecutionTime)}ms`)
  
  console.log('\n📦 Detailed Results by Agent:\n')
  
  // Group results by agent
  const resultsByAgent = results.results.reduce((acc, result) => {
    if (!acc[result.agentName]) acc[result.agentName] = []
    acc[result.agentName].push(result)
    return acc
  }, {} as Record<string, any[]>)
  
  for (const [agentName, agentResults] of Object.entries(resultsByAgent)) {
    console.log(`\n🤖 ${agentName}:`)
    agentResults.forEach(result => {
      console.log(`  Task ${result.taskId}: ${result.success ? '✅' : '❌'} (${result.executionTime}ms)`)
      if (result.data) {
        console.log(`  Data:`, JSON.stringify(result.data, null, 2).split('\n').map(l => '    ' + l).join('\n'))
      }
    })
  }
  
  // Test cross-referencing data from multiple sources
  console.log('\n\n🔄 Testing Cross-Reference Analysis...\n')
  
  // Gather all property data from different agents
  const apiPropertyData = results.results.find(r => r.taskId === 'api-1')?.data
  const visualPropertyData = results.results.find(r => r.taskId === 'visual-1')?.data
  const marketData = results.results.find(r => r.taskId === 'api-2')?.data
  
  if (apiPropertyData && visualPropertyData && marketData) {
    // Cross-reference all data sources
    const crossRefTask: AgentTask = {
      id: 'cross-ref-1',
      type: 'data-validation',
      priority: 1,
      data: {
        action: 'crossReference',
        params: {
          sources: [
            { source: 'API', data: apiPropertyData },
            { source: 'Visual', data: visualPropertyData },
            { source: 'Market', data: marketData }
          ]
        }
      }
    }
    
    const crossRefResult = await dataAgent.processTask(crossRefTask)
    console.log('Cross-Reference Result:', JSON.stringify(crossRefResult.data, null, 2))
  }
  
  // Test anomaly detection
  console.log('\n\n🔍 Testing Anomaly Detection...\n')
  
  const anomalyTask: AgentTask = {
    id: 'anomaly-1',
    type: 'data-validation',
    priority: 1,
    data: {
      action: 'detectAnomalies',
      params: {
        dataset: [
          { id: '1', medianPrice: 350000 },
          { id: '2', medianPrice: 375000 },
          { id: '3', medianPrice: 360000 },
          { id: '4', medianPrice: 850000 }, // Outlier
          { id: '5', medianPrice: 365000 }
        ],
        field: 'medianPrice'
      }
    }
  }
  
  const anomalyResult = await dataAgent.processTask(anomalyTask)
  console.log('Anomaly Detection Result:', JSON.stringify(anomalyResult.data, null, 2))
  
  // Show agent statuses
  console.log('\n\n📊 Final Agent Status:\n')
  console.log(orchestrator.getAllAgentStatuses())
}

// Run the test
testAllAgents().catch(console.error)