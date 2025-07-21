import { EventEmitter } from 'events'
import { BaseAgent, AgentTask, AgentResult } from './base-agent'

interface TaskDependency {
  taskId: string
  requiredTaskIds: string[]
}

interface ExecutionPlan {
  phases: Array<{
    phase: number
    tasks: AgentTask[]
    dependencies: TaskDependency[]
  }>
  estimatedDuration: number
  totalTasks: number
}

interface AgentMetrics {
  totalTasks: number
  successfulTasks: number
  failedTasks: number
  averageExecutionTime: number
  lastExecutionTime?: number
  errorRate: number
}

interface OrchestratorConfig {
  enableLogging?: boolean
  maxRetries?: number
  taskTimeout?: number
  enableMetrics?: boolean
  enableCaching?: boolean
  cacheTTL?: number
}

export class EnhancedOrchestrator extends EventEmitter {
  private agents: Map<string, BaseAgent> = new Map()
  private taskResults: Map<string, AgentResult> = new Map()
  private agentMetrics: Map<string, AgentMetrics> = new Map()
  private executionPlans: Map<string, ExecutionPlan> = new Map()
  private resultCache: Map<string, { result: any; expires: number }> = new Map()
  private config: OrchestratorConfig
  
  constructor(config: OrchestratorConfig = {}) {
    super()
    this.config = {
      enableLogging: true,
      maxRetries: 3,
      taskTimeout: 30000,
      enableMetrics: true,
      enableCaching: true,
      cacheTTL: 300000, // 5 minutes
      ...config
    }
  }
  
  // Register an agent with the orchestrator
  registerAgent(agent: BaseAgent) {
    const agentName = agent.constructor.name
    this.agents.set(agentName, agent)
    
    // Initialize metrics
    if (this.config.enableMetrics) {
      this.agentMetrics.set(agentName, {
        totalTasks: 0,
        successfulTasks: 0,
        failedTasks: 0,
        averageExecutionTime: 0,
        errorRate: 0
      })
    }
    
    if (this.config.enableLogging) {
      console.log(`[Orchestrator] Registered agent: ${agentName}`)
    }
    
    this.emit('agent:registered', agentName)
  }
  
  // Create an execution plan with dependency resolution
  createExecutionPlan(tasks: AgentTask[], dependencies: TaskDependency[] = []): ExecutionPlan {
    const phases: ExecutionPlan['phases'] = []
    const processed = new Set<string>()
    const taskMap = new Map(tasks.map(task => [task.id, task]))
    
    // Build dependency graph
    const dependencyMap = new Map<string, Set<string>>()
    dependencies.forEach(dep => {
      dependencyMap.set(dep.taskId, new Set(dep.requiredTaskIds))
    })
    
    // Topological sort to determine execution order
    let phase = 0
    while (processed.size < tasks.length) {
      const phaseTasks: AgentTask[] = []
      
      tasks.forEach(task => {
        if (processed.has(task.id)) return
        
        const deps = dependencyMap.get(task.id) || new Set()
        const allDepsProcessed = Array.from(deps).every(depId => processed.has(depId))
        
        if (allDepsProcessed) {
          phaseTasks.push(task)
        }
      })
      
      if (phaseTasks.length === 0 && processed.size < tasks.length) {
        throw new Error('Circular dependency detected in task graph')
      }
      
      phaseTasks.forEach(task => processed.add(task.id))
      
      if (phaseTasks.length > 0) {
        phases.push({
          phase,
          tasks: phaseTasks,
          dependencies: phaseTasks.map(task => ({
            taskId: task.id,
            requiredTaskIds: Array.from(dependencyMap.get(task.id) || [])
          }))
        })
        phase++
      }
    }
    
    // Estimate duration based on task priorities and agent capabilities
    const estimatedDuration = phases.reduce((total, phase) => {
      const maxDuration = Math.max(...phase.tasks.map(task => {
        const agent = this.routeToAgent(task)
        return agent ? 5000 : 1000 // Estimate based on agent type
      }))
      return total + maxDuration
    }, 0)
    
    const plan: ExecutionPlan = {
      phases,
      estimatedDuration,
      totalTasks: tasks.length
    }
    
    // Cache the plan
    const planId = this.generatePlanId(tasks)
    this.executionPlans.set(planId, plan)
    
    return plan
  }
  
  // Execute tasks according to an execution plan
  async executePlan(plan: ExecutionPlan): Promise<{
    results: AgentResult[]
    summary: {
      totalTasks: number
      successfulTasks: number
      failedTasks: number
      totalDuration: number
      phaseResults: Array<{
        phase: number
        duration: number
        results: AgentResult[]
      }>
    }
  }> {
    const startTime = Date.now()
    const allResults: AgentResult[] = []
    const phaseResults: any[] = []
    
    if (this.config.enableLogging) {
      console.log(`[Orchestrator] Executing plan with ${plan.totalTasks} tasks in ${plan.phases.length} phases`)
    }
    
    for (const phase of plan.phases) {
      const phaseStartTime = Date.now()
      
      if (this.config.enableLogging) {
        console.log(`[Orchestrator] Starting phase ${phase.phase} with ${phase.tasks.length} tasks`)
      }
      
      // Execute all tasks in this phase in parallel
      const phaseTaskResults = await this.executeParallelTasks(phase.tasks)
      
      allResults.push(...phaseTaskResults.results)
      phaseResults.push({
        phase: phase.phase,
        duration: Date.now() - phaseStartTime,
        results: phaseTaskResults.results
      })
      
      // Check if any critical tasks failed
      const criticalFailures = phaseTaskResults.results.filter(
        result => !result.success && phase.tasks.find(t => t.id === result.taskId)?.priority === 1
      )
      
      if (criticalFailures.length > 0) {
        console.error(`[Orchestrator] Critical task failures in phase ${phase.phase}, aborting execution`)
        break
      }
    }
    
    const summary = {
      totalTasks: plan.totalTasks,
      successfulTasks: allResults.filter(r => r.success).length,
      failedTasks: allResults.filter(r => !r.success).length,
      totalDuration: Date.now() - startTime,
      phaseResults
    }
    
    this.emit('plan:completed', summary)
    
    return { results: allResults, summary }
  }
  
  // Enhanced parallel task execution with caching
  async executeParallelTasks(tasks: AgentTask[]): Promise<{
    results: AgentResult[]
    summary: {
      totalTasks: number
      successfulTasks: number
      failedTasks: number
      averageExecutionTime: number
      totalExecutionTime: number
    }
  }> {
    const startTime = Date.now()
    
    // Check cache for results
    const cachedResults: AgentResult[] = []
    const tasksToExecute: AgentTask[] = []
    
    if (this.config.enableCaching) {
      tasks.forEach(task => {
        const cacheKey = this.getCacheKey(task)
        const cached = this.resultCache.get(cacheKey)
        
        if (cached && cached.expires > Date.now()) {
          cachedResults.push({
            taskId: task.id,
            agentName: 'cache',
            success: true,
            data: cached.result,
            executionTime: 0,
            timestamp: new Date().toISOString()
          })
        } else {
          tasksToExecute.push(task)
        }
      })
      
      if (cachedResults.length > 0 && this.config.enableLogging) {
        console.log(`[Orchestrator] Retrieved ${cachedResults.length} results from cache`)
      }
    } else {
      tasksToExecute = tasks
    }
    
    // Group tasks by agent
    const tasksByAgent = new Map<string, AgentTask[]>()
    
    tasksToExecute.forEach(task => {
      const agent = this.routeToAgent(task)
      const agentName = agent.constructor.name
      
      if (!tasksByAgent.has(agentName)) {
        tasksByAgent.set(agentName, [])
      }
      tasksByAgent.get(agentName)!.push(task)
    })
    
    // Execute tasks for each agent in parallel
    const executionPromises: Promise<AgentResult[]>[] = []
    
    tasksByAgent.forEach((agentTasks, agentName) => {
      const agent = this.agents.get(agentName)
      if (agent && typeof agent.processParallel === 'function') {
        executionPromises.push(agent.processParallel(agentTasks))
      } else if (agent) {
        // Fallback for agents without processParallel
        const individualPromises = agentTasks.map(task => agent.processTask(task))
        executionPromises.push(Promise.all(individualPromises))
      }
    })
    
    const results = await Promise.all(executionPromises)
    const flatResults = results.flat()
    
    // Cache successful results
    if (this.config.enableCaching) {
      flatResults.forEach((result, index) => {
        if (result.success && index < tasksToExecute.length) {
          const task = tasksToExecute[index]
          const cacheKey = this.getCacheKey(task)
          this.resultCache.set(cacheKey, {
            result: result.data,
            expires: Date.now() + this.config.cacheTTL!
          })
        }
      })
    }
    
    // Update metrics
    if (this.config.enableMetrics) {
      this.updateMetrics(flatResults)
    }
    
    // Store results
    flatResults.forEach(result => {
      this.taskResults.set(result.taskId, result)
    })
    
    const allResults = [...cachedResults, ...flatResults]
    const summary = this.calculateSummary(allResults, Date.now() - startTime)
    
    if (this.config.enableLogging) {
      console.log(`[Orchestrator] Completed ${allResults.length} tasks in ${summary.totalExecutionTime}ms`)
      console.log(`[Orchestrator] Success: ${summary.successfulTasks}, Failed: ${summary.failedTasks}`)
    }
    
    return { results: allResults, summary }
  }
  
  // Get task result with dependency results
  getTaskResultWithDependencies(taskId: string): {
    result: AgentResult | null
    dependencies: Map<string, AgentResult>
  } {
    const result = this.taskResults.get(taskId) || null
    const dependencies = new Map<string, AgentResult>()
    
    // Get all dependency results if execution plan exists
    this.executionPlans.forEach(plan => {
      plan.phases.forEach(phase => {
        const taskDep = phase.dependencies.find(d => d.taskId === taskId)
        if (taskDep) {
          taskDep.requiredTaskIds.forEach(depId => {
            const depResult = this.taskResults.get(depId)
            if (depResult) {
              dependencies.set(depId, depResult)
            }
          })
        }
      })
    })
    
    return { result, dependencies }
  }
  
  // Get agent performance metrics
  getAgentMetrics(agentName?: string): Map<string, AgentMetrics> | AgentMetrics | null {
    if (agentName) {
      return this.agentMetrics.get(agentName) || null
    }
    return new Map(this.agentMetrics)
  }
  
  // Get execution plan by ID
  getExecutionPlan(planId: string): ExecutionPlan | null {
    return this.executionPlans.get(planId) || null
  }
  
  // Clear cache
  clearCache() {
    this.resultCache.clear()
    if (this.config.enableLogging) {
      console.log('[Orchestrator] Cache cleared')
    }
  }
  
  // Private helper methods
  private routeToAgent(task: AgentTask): BaseAgent {
    const agentMapping: Record<string, string> = {
      'visual-analysis': 'VisualIntelligenceAgentWrapper',
      'data-validation': 'DataAccuracyAgent',
      'api-fetch': 'APIIntegrationAgent',
      'market-analysis': 'MarketAnalysisAgent',
      'document-process': 'DocumentProcessingAgent',
      'price-trend': 'MarketAnalysisAgent',
      'neighborhood-ranking': 'MarketAnalysisAgent',
      'construction-correlation': 'MarketAnalysisAgent',
      'market-heatmap': 'MarketAnalysisAgent',
      'roi-calculation': 'MarketAnalysisAgent',
      'emerging-neighborhoods': 'MarketAnalysisAgent'
    }
    
    const agentName = agentMapping[task.type]
    const agent = this.agents.get(agentName)
    
    if (!agent) {
      throw new Error(`No agent found for task type: ${task.type}`)
    }
    
    return agent
  }
  
  private generatePlanId(tasks: AgentTask[]): string {
    return tasks.map(t => t.id).sort().join('-')
  }
  
  private getCacheKey(task: AgentTask): string {
    return `${task.type}-${JSON.stringify(task.data)}`
  }
  
  private updateMetrics(results: AgentResult[]) {
    results.forEach(result => {
      const metrics = this.agentMetrics.get(result.agentName)
      if (metrics) {
        metrics.totalTasks++
        if (result.success) {
          metrics.successfulTasks++
        } else {
          metrics.failedTasks++
        }
        
        // Update average execution time
        const prevTotal = metrics.averageExecutionTime * (metrics.totalTasks - 1)
        metrics.averageExecutionTime = (prevTotal + result.executionTime) / metrics.totalTasks
        metrics.lastExecutionTime = result.executionTime
        
        // Calculate error rate
        metrics.errorRate = metrics.failedTasks / metrics.totalTasks
      }
    })
  }
  
  private calculateSummary(results: AgentResult[], totalTime: number) {
    const successfulTasks = results.filter(r => r.success).length
    const totalExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0)
    
    return {
      totalTasks: results.length,
      successfulTasks,
      failedTasks: results.length - successfulTasks,
      averageExecutionTime: results.length > 0 ? totalExecutionTime / results.length : 0,
      totalExecutionTime: totalTime
    }
  }
  
  // Get all registered agents
  getAgents(): string[] {
    return Array.from(this.agents.keys())
  }
  
  // Get agent status
  getAllAgentStatuses() {
    const statuses: Record<string, any> = {}
    
    this.agents.forEach((agent, name) => {
      statuses[name] = {
        name: agent.name,
        isProcessing: agent.isProcessing,
        queueLength: agent.taskQueue.length,
        config: agent.config,
        metrics: this.agentMetrics.get(name)
      }
    })
    
    return statuses
  }
}