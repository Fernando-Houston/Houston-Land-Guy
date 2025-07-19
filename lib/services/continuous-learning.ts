import { queryPerplexity } from './data-intelligence'
import { TrainingExample } from './training-data-collector'

// Continuous Learning System for Houston Development Assistant
export class ContinuousLearningSystem {
  private readonly MIN_CONFIDENCE_THRESHOLD = 0.6
  private readonly FEEDBACK_LEARNING_RATE = 0.1
  private readonly QUERY_SIMILARITY_THRESHOLD = 0.8
  private readonly MAX_LEARNING_ITERATIONS = 50

  async analyzeQueryGaps(recentQueries: string[]): Promise<string[]> {
    const gaps: string[] = []
    
    try {
      // Import database services
      // const { trainingDataService } = await import('../database/connection')
      const trainingDataService = null as any
      
      // Analyze query patterns
      const queryAnalysis = await queryPerplexity(`
        Analyze these recent Houston development queries and identify knowledge gaps:
        ${recentQueries.join('\n')}
        
        Return a JSON array of specific topics we should add training data for.
        Focus on Houston-specific development knowledge.
      `)
      
      // Parse AI response and extract gaps
      const analysisMatch = queryAnalysis.match(/\[[\s\S]*?\]/)
      if (analysisMatch) {
        const gapsArray = JSON.parse(analysisMatch[0])
        gaps.push(...gapsArray)
      }
      
      // Check database for underrepresented intents
      if (trainingDataService) {
        const stats = await trainingDataService.getTrainingStats()
        const lowConfidenceIntents = await this.findLowConfidenceIntents()
        
        gaps.push(...lowConfidenceIntents)
      }
      
    } catch (error) {
      console.error('Error analyzing query gaps:', error)
    }
    
    return gaps
  }

  async generateTrainingDataForGaps(gaps: string[]): Promise<TrainingExample[]> {
    const newTrainingData: TrainingExample[] = []
    
    for (const gap of gaps) {
      try {
        const examples = await this.generateExamplesForTopic(gap)
        newTrainingData.push(...examples)
      } catch (error) {
        console.error(`Error generating training data for gap: ${gap}`, error)
      }
    }
    
    return newTrainingData
  }

  private async generateExamplesForTopic(topic: string): Promise<TrainingExample[]> {
    const examples: TrainingExample[] = []
    
    const prompts = [
      `Generate 3 realistic user questions about ${topic} in Houston development`,
      `Create expert responses for ${topic} questions with specific Houston market data`,
      `What are common follow-up questions about ${topic} for Houston developers?`
    ]
    
    for (const prompt of prompts) {
      try {
        const response = await queryPerplexity(prompt)
        
        // Parse the response and create training examples
        const parsedExamples = this.parseGeneratedExamples(response, topic)
        examples.push(...parsedExamples)
        
      } catch (error) {
        console.error(`Error generating examples for ${topic}:`, error)
      }
    }
    
    return examples
  }

  private parseGeneratedExamples(response: string, topic: string): TrainingExample[] {
    const examples: TrainingExample[] = []
    
    // Simple parsing - in production, use more sophisticated NLP
    const lines = response.split('\n').filter(line => line.trim().length > 0)
    
    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        const query = lines[i].replace(/^\d+\.\s*/, '').trim()
        const answer = lines[i + 1].trim()
        
        if (query.length > 10 && answer.length > 20) {
          examples.push({
            id: `generated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            query,
            intent: this.classifyIntent(query),
            entities: this.extractEntities(query),
            response: answer,
            confidence: 0.75,
            timestamp: new Date()
          })
        }
      }
    }
    
    return examples
  }

  private classifyIntent(query: string): string {
    const queryLower = query.toLowerCase()
    
    if (queryLower.includes('find') || queryLower.includes('looking for') || queryLower.includes('search')) {
      return 'property_search'
    }
    if (queryLower.includes('roi') || queryLower.includes('return') || queryLower.includes('profit')) {
      return 'roi_calculation'
    }
    if (queryLower.includes('permit') || queryLower.includes('approval') || queryLower.includes('zoning')) {
      return 'permitting_inquiry'
    }
    if (queryLower.includes('cost') || queryLower.includes('price') || queryLower.includes('expensive')) {
      return 'cost_inquiry'
    }
    if (queryLower.includes('financing') || queryLower.includes('loan') || queryLower.includes('funding')) {
      return 'financing_inquiry'
    }
    if (queryLower.includes('contractor') || queryLower.includes('builder') || queryLower.includes('construction')) {
      return 'contractor_inquiry'
    }
    if (queryLower.includes('neighborhood') || queryLower.includes('area') || queryLower.includes('location')) {
      return 'neighborhood_inquiry'
    }
    
    return 'general_inquiry'
  }

  private extractEntities(query: string): Record<string, any> {
    const entities: Record<string, any> = {}
    
    // Extract neighborhoods
    const neighborhoods = [
      'downtown', 'midtown', 'heights', 'montrose', 'river oaks', 'galleria',
      'medical center', 'energy corridor', 'katy', 'woodlands', 'sugar land',
      'cypress', 'pearland', 'spring', 'clear lake', 'memorial', 'bellaire'
    ]
    
    const foundNeighborhood = neighborhoods.find(n => query.toLowerCase().includes(n))
    if (foundNeighborhood) {
      entities.neighborhood = foundNeighborhood
    }
    
    // Extract property types
    const propertyTypes = [
      'residential', 'commercial', 'office', 'retail', 'industrial', 'mixed-use',
      'apartment', 'condo', 'townhome', 'single-family', 'multi-family'
    ]
    
    const foundPropertyType = propertyTypes.find(t => query.toLowerCase().includes(t))
    if (foundPropertyType) {
      entities.property_type = foundPropertyType
    }
    
    // Extract price ranges
    const priceMatch = query.match(/\$?([\d,]+(?:\.\d+)?)\s*([kmb])?/i)
    if (priceMatch) {
      let amount = parseFloat(priceMatch[1].replace(/,/g, ''))
      const unit = priceMatch[2]?.toLowerCase()
      
      if (unit === 'k') amount *= 1000
      else if (unit === 'm') amount *= 1000000
      else if (unit === 'b') amount *= 1000000000
      
      entities.price_range = amount
    }
    
    return entities
  }

  private async findLowConfidenceIntents(): Promise<string[]> {
    const lowConfidenceIntents: string[] = []
    
    try {
      // const { trainingDataService } = await import('../database/connection')
      const trainingDataService = null as any
      
      // Get examples with low confidence
      const examples = await trainingDataService.getTrainingExamples(1000)
      const intentConfidence: Record<string, number[]> = {}
      
      examples.forEach(example => {
        if (!intentConfidence[example.intent]) {
          intentConfidence[example.intent] = []
        }
        intentConfidence[example.intent].push(example.confidence)
      })
      
      // Find intents with average confidence below threshold
      Object.entries(intentConfidence).forEach(([intent, confidences]) => {
        const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length
        if (avgConfidence < this.MIN_CONFIDENCE_THRESHOLD) {
          lowConfidenceIntents.push(intent)
        }
      })
      
    } catch (error) {
      console.error('Error finding low confidence intents:', error)
    }
    
    return lowConfidenceIntents
  }

  async improveFromFeedback(feedbackData: {
    query: string
    originalResponse: string
    feedback: 'positive' | 'negative'
    correctedResponse?: string
  }[]): Promise<void> {
    try {
      // const { trainingDataService } = await import('../database/connection')
      const trainingDataService = null as any
      
      for (const feedback of feedbackData) {
        // Create improved training example
        const improvedExample: TrainingExample = {
          id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          query: feedback.query,
          intent: this.classifyIntent(feedback.query),
          entities: this.extractEntities(feedback.query),
          response: feedback.correctedResponse || feedback.originalResponse,
          confidence: feedback.feedback === 'positive' ? 0.95 : 0.4,
          feedback: feedback.feedback,
          timestamp: new Date()
        }
        
        if (trainingDataService) {
          await trainingDataService.insertTrainingExample({
            query: improvedExample.query,
          intent: improvedExample.intent,
          entities: improvedExample.entities,
          response: improvedExample.response,
          confidence: improvedExample.confidence,
          feedback: improvedExample.feedback,
          isSynthetic: false
          })
        }
      }
      
    } catch (error) {
      console.error('Error improving from feedback:', error)
    }
  }

  async generatePerformanceReport(): Promise<{
    totalExamples: number
    avgConfidence: number
    intentDistribution: Record<string, number>
    recentFeedback: { positive: number; negative: number }
    recommendations: string[]
  }> {
    const report = {
      totalExamples: 0,
      avgConfidence: 0,
      intentDistribution: {},
      recentFeedback: { positive: 0, negative: 0 },
      recommendations: []
    }
    
    try {
      // const { trainingDataService } = await import('../database/connection')
      const trainingDataService = null as any
      
      const stats = await trainingDataService.getTrainingStats()
      report.totalExamples = stats.total_examples
      report.avgConfidence = parseFloat(stats.avg_confidence)
      report.recentFeedback.positive = stats.positive_feedback
      report.recentFeedback.negative = stats.negative_feedback
      
      // Get intent distribution
      const examples = await trainingDataService.getTrainingExamples(1000)
      const intentCounts: Record<string, number> = {}
      
      examples.forEach(example => {
        intentCounts[example.intent] = (intentCounts[example.intent] || 0) + 1
      })
      
      report.intentDistribution = intentCounts
      
      // Generate recommendations
      if (report.avgConfidence < 0.8) {
        report.recommendations.push('Average confidence is low - consider adding more high-quality training examples')
      }
      
      if (report.recentFeedback.negative > report.recentFeedback.positive * 0.2) {
        report.recommendations.push('High negative feedback ratio - review recent responses and improve training data')
      }
      
      const lowCountIntents = Object.entries(intentCounts).filter(([_, count]) => count < 10)
      if (lowCountIntents.length > 0) {
        report.recommendations.push(`Add more training examples for: ${lowCountIntents.map(([intent]) => intent).join(', ')}`)
      }
      
    } catch (error) {
      console.error('Error generating performance report:', error)
    }
    
    return report
  }

  async runContinuousLearning(): Promise<void> {
    try {
      console.log('Starting continuous learning cycle...')
      
      // Get recent queries for analysis
      // const { conversationService } = await import('../database/connection')
      const conversationService = null as any
      // In production, get recent queries from database
      
      // Identify gaps
      const gaps = await this.analyzeQueryGaps([
        'development opportunities in emerging Houston neighborhoods',
        'impact of new infrastructure on property values',
        'co-working space development trends',
        'sustainable building requirements in Houston'
      ])
      
      // Generate new training data for gaps
      const newTrainingData = await this.generateTrainingDataForGaps(gaps)
      
      // Store new training data
      // const { trainingDataService } = await import('../database/connection')
      const trainingDataService = null as any
      if (trainingDataService) {
        for (const example of newTrainingData) {
          await trainingDataService.insertTrainingExample({
            query: example.query,
            intent: example.intent,
            entities: example.entities,
            response: example.response,
            confidence: example.confidence,
            isSynthetic: true
          })
        }
      }
      
      console.log(`Generated ${newTrainingData.length} new training examples`)
      
      // Generate performance report
      const report = await this.generatePerformanceReport()
      console.log('Performance Report:', report)
      
    } catch (error) {
      console.error('Error in continuous learning cycle:', error)
    }
  }
}

// Export singleton instance
export const continuousLearningSystem = new ContinuousLearningSystem()

// Schedule continuous learning (run every 24 hours in production)
if (typeof window === 'undefined') {
  setInterval(() => {
    continuousLearningSystem.runContinuousLearning()
  }, 24 * 60 * 60 * 1000) // 24 hours
}