// Test script for multi-agent orchestrator
import { AgentOrchestrator } from '../lib/agents/orchestrator'
import { BaseAgent, AgentTask } from '../lib/agents/base-agent'

// Mock agents for testing
class MockDataAgent extends BaseAgent {
  async execute(task: AgentTask) {
    console.log(`[${this.name}] Executing task: ${task.id}`)
    await this.delay(1000) // Simulate work
    return {
      taskId: task.id,
      success: true,
      data: { message: 'Data validated successfully' }
    }
  }
}

class MockVisualAgent extends BaseAgent {
  async execute(task: AgentTask) {
    console.log(`[${this.name}] Executing task: ${task.id}`)
    await this.delay(1500) // Simulate image processing
    return {
      taskId: task.id,
      success: true,
      data: { features: ['pool', 'garage', 'updated kitchen'] }
    }
  }
}

class MockAPIAgent extends BaseAgent {
  async execute(task: AgentTask) {
    console.log(`[${this.name}] Executing task: ${task.id}`)
    await this.delay(800) // Simulate API call
    return {
      taskId: task.id,
      success: true,
      data: { price: 350000, sqft: 2500 }
    }
  }
}

async function testOrchestrator() {
  console.log('🚀 Testing Multi-Agent Orchestrator\n')
  
  // Create orchestrator
  const orchestrator = new AgentOrchestrator({
    enableLogging: true
  })
  
  // Register agents
  const dataAgent = new MockDataAgent('DataAccuracyAgent')
  const visualAgent = new MockVisualAgent('VisualIntelligenceAgent')
  const apiAgent = new MockAPIAgent('APIIntegrationAgent')
  
  orchestrator.registerAgent(dataAgent)
  orchestrator.registerAgent(visualAgent)
  orchestrator.registerAgent(apiAgent)
  
  console.log('\n📋 Registered Agents:', orchestrator.getAgents())
  
  // Create parallel tasks
  const tasks: AgentTask[] = [
    {
      id: 'task-1',
      type: 'data-validation',
      priority: 1,
      data: { propertyId: '123-main-st' }
    },
    {
      id: 'task-2',
      type: 'visual-analysis',
      priority: 1,
      data: { imageUrl: 'https://example.com/property.jpg' }
    },
    {
      id: 'task-3',
      type: 'api-fetch',
      priority: 1,
      data: { address: '123 Main St' }
    }
  ]
  
  console.log('\n🎯 Executing 3 tasks in parallel...\n')
  
  const startTime = Date.now()
  const results = await orchestrator.executeParallelTasks(tasks)
  
  console.log(`\n✅ All tasks completed in ${Date.now() - startTime}ms`)
  console.log('\n📊 Results Summary:')
  console.log(`- Total Tasks: ${results.summary.totalTasks}`)
  console.log(`- Successful: ${results.summary.successfulTasks}`)
  console.log(`- Failed: ${results.summary.failedTasks}`)
  console.log(`- Average Time: ${Math.round(results.summary.averageExecutionTime)}ms`)
  
  console.log('\n📦 Individual Results:')
  results.results.forEach(result => {
    console.log(`\n${result.agentName} - Task ${result.taskId}:`)
    console.log(`- Success: ${result.success}`)
    console.log(`- Time: ${result.executionTime}ms`)
    console.log(`- Data:`, result.data)
  })
}

// Run the test
testOrchestrator().catch(console.error)