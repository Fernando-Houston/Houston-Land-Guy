// Base Agent class for multi-agent system
export interface AgentTask {
  id: string
  type: string
  priority: number
  data: any
  timeout?: number
}

export interface AgentResult {
  taskId: string
  agentName: string
  success: boolean
  data?: any
  error?: string
  executionTime: number
  confidence?: number
}

export interface AgentConfig {
  name: string
  maxConcurrent: number
  timeout: number
  retryAttempts: number
}

export abstract class BaseAgent {
  protected name: string
  protected config: AgentConfig
  protected isProcessing: boolean = false
  protected taskQueue: AgentTask[] = []
  
  constructor(name: string, config?: Partial<AgentConfig>) {
    this.name = name
    this.config = {
      name,
      maxConcurrent: config?.maxConcurrent || 5,
      timeout: config?.timeout || 30000,
      retryAttempts: config?.retryAttempts || 3
    }
  }
  
  // Abstract method that each agent must implement
  abstract execute(task: AgentTask): Promise<AgentResult>
  
  // Common methods all agents share
  async processTask(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now()
    
    try {
      console.log(`[${this.name}] Processing task: ${task.id}`)
      
      // Execute with timeout
      const result = await this.executeWithTimeout(task)
      
      return {
        taskId: task.id,
        agentName: this.name,
        success: true,
        data: result,
        executionTime: Date.now() - startTime
      }
    } catch (error) {
      console.error(`[${this.name}] Error processing task ${task.id}:`, error)
      
      return {
        taskId: task.id,
        agentName: this.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime
      }
    }
  }
  
  // Process multiple tasks in parallel
  async processParallel(tasks: AgentTask[]): Promise<AgentResult[]> {
    const chunks = this.chunkArray(tasks, this.config.maxConcurrent)
    const results: AgentResult[] = []
    
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(task => this.processTask(task))
      )
      results.push(...chunkResults)
    }
    
    return results
  }
  
  // Execute with timeout protection
  private async executeWithTimeout(task: AgentTask): Promise<any> {
    const timeout = task.timeout || this.config.timeout
    
    return Promise.race([
      this.execute(task),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Task ${task.id} timed out after ${timeout}ms`)), timeout)
      )
    ])
  }
  
  // Retry logic for failed tasks
  protected async retry<T>(
    fn: () => Promise<T>,
    retries: number = this.config.retryAttempts
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      if (retries > 0) {
        console.log(`[${this.name}] Retrying... (${retries} attempts left)`)
        await this.delay(1000) // Wait 1 second before retry
        return this.retry(fn, retries - 1)
      }
      throw error
    }
  }
  
  // Utility methods
  protected chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
  
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // Agent status
  getStatus() {
    return {
      name: this.name,
      isProcessing: this.isProcessing,
      queueLength: this.taskQueue.length,
      config: this.config
    }
  }
}