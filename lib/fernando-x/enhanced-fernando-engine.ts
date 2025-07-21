// Enhanced Fernando-X Engine with Multi-Agent Backend
// Fernando-X remains the main interface, but now powered by 5 specialized agents

import { ChatGPTEngine } from './chatgpt-engine'
import { fernandoAgentIntegration } from './agent-integration'

interface FernandoContext {
  sessionId: string
  conversationHistory: Array<{ role: string; content: string }>
  userProfile?: {
    budget?: number
    preferences?: string[]
    searchHistory?: string[]
  }
  currentProperty?: {
    address?: string
    zipCode?: string
    price?: number
  }
}

export class EnhancedFernandoEngine {
  private chatEngine: ChatGPTEngine
  private agentIntegration = fernandoAgentIntegration
  
  constructor() {
    this.chatEngine = new ChatGPTEngine()
  }
  
  // Main entry point - Fernando handles everything
  async processMessage(
    message: string,
    context: FernandoContext
  ): Promise<{
    message: string
    visualizations?: any[]
    actions?: any[]
    confidence: number
  }> {
    try {
      // Step 1: Determine if this needs agent intelligence
      const needsAgents = this.agentIntegration.shouldUseAgents(message)
      
      if (!needsAgents) {
        // Simple conversational response using ChatGPT
        const response = await this.chatEngine.generateResponse(
          message,
          context.sessionId,
          context.conversationHistory
        )
        
        return {
          message: response.content,
          confidence: 0.9
        }
      }
      
      // Step 2: Use multi-agent system for complex queries
      const agentResponse = await this.agentIntegration.enhanceResponse(
        message,
        context.sessionId,
        {
          budget: context.userProfile?.budget,
          propertyType: this.extractPropertyType(message),
          location: context.currentProperty?.zipCode || this.extractLocation(message),
          purpose: this.extractPurpose(message)
        }
      )
      
      // Step 3: Enhance with Fernando's personality
      const personalizedResponse = await this.addFernandoPersonality(
        agentResponse.response,
        context
      )
      
      // Step 4: Format with rich content
      return {
        message: personalizedResponse,
        visualizations: agentResponse.visualizations,
        actions: this.generateActions(agentResponse),
        confidence: agentResponse.confidence
      }
      
    } catch (error) {
      console.error('Fernando engine error:', error)
      
      // Fallback to helpful response
      return {
        message: "I'm having a bit of trouble with that request. Let me try a different approach. Could you tell me more about what you're looking for?",
        confidence: 0.5
      }
    }
  }
  
  // Handle document uploads through Fernando
  async processDocument(
    file: File,
    context: FernandoContext
  ): Promise<{
    message: string
    extractedData?: any
    linkedProperty?: string
  }> {
    // Initial response
    const initialResponse = `I'll analyze this ${file.name} for you. Give me just a moment...`
    
    try {
      // Use document processing agent through the API
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', context.sessionId)
      
      const response = await fetch('/api/agents/fernando', {
        method: 'POST',
        body: JSON.stringify({
          message: `Process document: ${file.name}`,
          sessionId: context.sessionId,
          context: {
            documentUpload: true,
            fileName: file.name,
            currentProperty: context.currentProperty
          }
        })
      })
      
      const result = await response.json()
      
      // Format the response conversationally
      let message = `I've finished analyzing your ${this.getDocumentType(file.name)}. `
      
      if (result.data?.extractedData) {
        const data = result.data.extractedData
        
        if (data.permitNumber) {
          message += `This is permit #${data.permitNumber} `
        }
        
        if (data.address) {
          message += `for the property at ${data.address}. `
        }
        
        if (data.amount) {
          message += `The total amount is $${data.amount.toLocaleString()}. `
        }
        
        message += '\n\nHere are the key details I found:\n'
        
        // Add key points
        if (data.dates?.length > 0) {
          message += `• Important dates: ${data.dates.map((d: any) => 
            `${d.type}: ${new Date(d.date).toLocaleDateString()}`
          ).join(', ')}\n`
        }
        
        if (data.parties?.length > 0) {
          message += `• Parties involved: ${data.parties.map((p: any) => 
            `${p.name} (${p.role})`
          ).join(', ')}\n`
        }
      }
      
      message += '\nIs there anything specific about this document you'd like to know more about?'
      
      return {
        message,
        extractedData: result.data?.extractedData,
        linkedProperty: result.data?.linkedProperty
      }
      
    } catch (error) {
      return {
        message: `I had some trouble reading that document. Could you make sure it's a PDF or text file and try again? If you're still having issues, you can tell me what kind of document it is and I'll help you another way.`
      }
    }
  }
  
  // Add Fernando's conversational personality
  private async addFernandoPersonality(
    agentResponse: string,
    context: FernandoContext
  ): Promise<string> {
    // Add personal touches based on context
    let personalizedResponse = agentResponse
    
    // Add greeting if first message
    if (context.conversationHistory.length === 0) {
      personalizedResponse = `Hi there! I'm Fernando-X, your Houston real estate assistant. ${personalizedResponse}`
    }
    
    // Add budget acknowledgment
    if (context.userProfile?.budget) {
      personalizedResponse = personalizedResponse.replace(
        'Your budget',
        `Your budget of $${context.userProfile.budget.toLocaleString()}`
      )
    }
    
    // Add local knowledge
    if (agentResponse.includes('77002')) {
      personalizedResponse += ' Downtown Houston is one of my favorite areas - lots of development happening there!'
    } else if (agentResponse.includes('77006')) {
      personalizedResponse += ' Montrose is such a vibrant neighborhood with great walkability.'
    } else if (agentResponse.includes('77008')) {
      personalizedResponse += ' The Heights has really transformed in recent years - great mix of old and new.'
    }
    
    return personalizedResponse
  }
  
  // Generate action buttons/links from agent response
  private generateActions(agentResponse: any): any[] {
    const actions = []
    
    if (agentResponse.suggestions?.length > 0) {
      agentResponse.suggestions.forEach((suggestion: string) => {
        if (suggestion.includes('Schedule')) {
          actions.push({
            type: 'button',
            label: suggestion,
            action: 'schedule-viewing'
          })
        } else if (suggestion.includes('Search')) {
          actions.push({
            type: 'button',
            label: suggestion,
            action: 'new-search'
          })
        } else if (suggestion.includes('Calculate')) {
          actions.push({
            type: 'button',
            label: suggestion,
            action: 'open-calculator'
          })
        }
      })
    }
    
    return actions
  }
  
  // Helper methods
  private extractPropertyType(message: string): string | undefined {
    const types = ['house', 'condo', 'apartment', 'commercial', 'land']
    const lower = message.toLowerCase()
    return types.find(type => lower.includes(type))
  }
  
  private extractLocation(message: string): string | undefined {
    const zipMatch = message.match(/\b\d{5}\b/)
    if (zipMatch) return zipMatch[0]
    
    const neighborhoods = ['heights', 'montrose', 'downtown', 'midtown', 'river oaks']
    const lower = message.toLowerCase()
    return neighborhoods.find(n => lower.includes(n))
  }
  
  private extractPurpose(message: string): 'buy' | 'sell' | 'invest' | 'develop' | undefined {
    const lower = message.toLowerCase()
    if (lower.includes('buy') || lower.includes('purchase')) return 'buy'
    if (lower.includes('sell')) return 'sell'
    if (lower.includes('invest') || lower.includes('roi')) return 'invest'
    if (lower.includes('develop') || lower.includes('build')) return 'develop'
    return undefined
  }
  
  private getDocumentType(fileName: string): string {
    const lower = fileName.toLowerCase()
    if (lower.includes('permit')) return 'permit'
    if (lower.includes('contract')) return 'contract'
    if (lower.includes('deed')) return 'deed'
    if (lower.includes('inspection')) return 'inspection report'
    return 'document'
  }
}

// Export singleton instance
export const enhancedFernando = new EnhancedFernandoEngine()