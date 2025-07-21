import { BaseAgent, AgentTask, AgentResult, AgentConfig } from './base-agent'
import { VisualIntelligenceAgent } from './visual-intelligence-agent'

export class VisualIntelligenceAgentWrapper extends BaseAgent {
  private visualAgent: VisualIntelligenceAgent

  constructor(config?: Partial<AgentConfig>) {
    super({
      name: 'VisualIntelligenceAgent', // Keep original name for orchestrator mapping
      supportedTypes: ['visual-analysis', 'image-processing'],
      maxConcurrent: 3,
      timeout: 30000,
      ...config
    })
    
    this.visualAgent = new VisualIntelligenceAgent()
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now()
    
    try {
      let data: any
      
      switch (task.data.action) {
        case 'analyzeProperty':
          data = await this.visualAgent.analyzePropertyPhoto(task.data.params.imageUrl)
          break
          
        case 'detectConstruction':
          data = await this.visualAgent.detectConstruction(task.data.params.imageUrl)
          break
          
        case 'analyzeSatellite':
          data = await this.visualAgent.analyzeSatelliteImage(
            task.data.params.imageUrl,
            task.data.params.previousImageUrl
          )
          break
          
        case 'performOCR':
          data = await this.visualAgent.performDocumentOCR(task.data.params.imageUrl)
          break
          
        case 'analyzeMultiple':
          data = await this.visualAgent.processMultipleImages(
            task.data.params.imageUrls,
            task.data.params.analysisType
          )
          break
          
        default:
          throw new Error(`Unknown action: ${task.data.action}`)
      }
      
      return {
        taskId: task.id,
        agentName: this.config.name,
        success: true,
        data,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        taskId: task.id,
        agentName: this.config.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    }
  }
}