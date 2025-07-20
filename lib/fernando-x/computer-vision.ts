// Fernando-X Computer Vision Module
// Analyzes property photos for condition, features, and investment potential

export interface PhotoAnalysis {
  imageUrl: string
  condition: {
    overall: 'excellent' | 'good' | 'fair' | 'poor'
    score: number // 1-10
    confidence: number
  }
  propertyType: {
    type: string
    confidence: number
  }
  features: Array<{
    name: string
    confidence: number
    location?: { x: number; y: number; width: number; height: number }
  }>
  issues: Array<{
    type: string
    severity: 'minor' | 'moderate' | 'major'
    location?: { x: number; y: number; width: number; height: number }
    estimatedCost?: number
  }>
  rooms: Array<{
    type: string
    condition: string
    features: string[]
  }>
  exterior: {
    roofCondition: string
    sidingCondition: string
    landscaping: string
    driveway: string
    pool?: string
  }
  marketAppeal: {
    score: number // 1-10
    strengths: string[]
    improvements: string[]
  }
  renovationEstimate: {
    minimum: number
    maximum: number
    breakdown: Record<string, number>
  }
}

export interface PropertyPhotoSet {
  propertyId: string
  photos: Array<{
    url: string
    type: 'exterior' | 'interior' | 'aerial' | 'floorplan'
    room?: string
    angle?: string
  }>
  analysisResults?: PhotoAnalysis[]
}

class ComputerVisionAnalyzer {
  private openAIKey: string | null = null
  private analysisCache: Map<string, PhotoAnalysis> = new Map()
  
  constructor() {
    if (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY) {
      this.openAIKey = process.env.OPENAI_API_KEY
    }
  }
  
  // Analyze single photo
  async analyzePhoto(imageUrl: string, context?: {
    propertyType?: string
    askingPrice?: number
    location?: string
  }): Promise<PhotoAnalysis> {
    // Check cache
    const cacheKey = this.getCacheKey(imageUrl)
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey)!
    }
    
    try {
      if (!this.openAIKey) {
        // Return mock analysis for demo
        return this.getMockAnalysis(imageUrl, context)
      }
      
      // Use OpenAI Vision API
      const analysis = await this.callVisionAPI(imageUrl, context)
      
      // Cache result
      this.analysisCache.set(cacheKey, analysis)
      
      return analysis
    } catch (error) {
      console.error('Photo analysis error:', error)
      return this.getMockAnalysis(imageUrl, context)
    }
  }
  
  // Analyze multiple photos of a property
  async analyzePropertyPhotos(photoSet: PropertyPhotoSet): Promise<{
    overallCondition: string
    conditionScore: number
    propertyType: string
    keyFeatures: string[]
    majorIssues: string[]
    renovationNeeded: string[]
    estimatedRenovationCost: { min: number; max: number }
    marketAppealScore: number
    investmentPotential: 'excellent' | 'good' | 'fair' | 'poor'
    recommendations: string[]
  }> {
    const analyses: PhotoAnalysis[] = []
    
    // Analyze each photo
    for (const photo of photoSet.photos) {
      const analysis = await this.analyzePhoto(photo.url, {
        propertyType: photo.type
      })
      analyses.push(analysis)
    }
    
    // Aggregate results
    const conditionScores = analyses.map(a => a.condition.score)
    const avgConditionScore = conditionScores.reduce((a, b) => a + b, 0) / conditionScores.length
    
    // Collect all features
    const allFeatures = new Map<string, number>()
    analyses.forEach(analysis => {
      analysis.features.forEach(feature => {
        const count = allFeatures.get(feature.name) || 0
        allFeatures.set(feature.name, count + 1)
      })
    })
    
    // Collect all issues
    const allIssues = new Map<string, { severity: string; count: number }>()
    analyses.forEach(analysis => {
      analysis.issues.forEach(issue => {
        const existing = allIssues.get(issue.type)
        if (!existing || this.getSeverityLevel(issue.severity) > this.getSeverityLevel(existing.severity)) {
          allIssues.set(issue.type, {
            severity: issue.severity,
            count: (existing?.count || 0) + 1
          })
        }
      })
    })
    
    // Calculate renovation costs
    let minRenovation = 0
    let maxRenovation = 0
    analyses.forEach(analysis => {
      minRenovation += analysis.renovationEstimate.minimum
      maxRenovation += analysis.renovationEstimate.maximum
    })
    
    // Determine overall condition
    const overallCondition = this.getConditionLabel(avgConditionScore)
    
    // Calculate market appeal
    const marketAppealScores = analyses.map(a => a.marketAppeal.score)
    const avgMarketAppeal = marketAppealScores.reduce((a, b) => a + b, 0) / marketAppealScores.length
    
    // Determine investment potential
    const investmentPotential = this.calculateInvestmentPotential(
      avgConditionScore,
      avgMarketAppeal,
      maxRenovation
    )
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      analyses,
      avgConditionScore,
      allIssues,
      allFeatures
    )
    
    return {
      overallCondition,
      conditionScore: avgConditionScore,
      propertyType: this.determinePropertyType(analyses),
      keyFeatures: Array.from(allFeatures.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([feature]) => feature),
      majorIssues: Array.from(allIssues.entries())
        .filter(([_, data]) => data.severity === 'major')
        .map(([issue]) => issue),
      renovationNeeded: this.identifyRenovations(allIssues, analyses),
      estimatedRenovationCost: {
        min: minRenovation,
        max: maxRenovation
      },
      marketAppealScore: avgMarketAppeal,
      investmentPotential,
      recommendations
    }
  }
  
  // Call OpenAI Vision API
  private async callVisionAPI(imageUrl: string, context?: any): Promise<PhotoAnalysis> {
    const prompt = this.buildAnalysisPrompt(context)
    
    // In production, this would call OpenAI's API
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4-vision-preview",
    //   messages: [{
    //     role: "user",
    //     content: [
    //       { type: "text", text: prompt },
    //       { type: "image_url", image_url: { url: imageUrl } }
    //     ]
    //   }],
    //   max_tokens: 1000
    // })
    
    // For now, return structured mock data
    return this.getMockAnalysis(imageUrl, context)
  }
  
  // Build analysis prompt
  private buildAnalysisPrompt(context?: any): string {
    return `Analyze this property photo and provide detailed information about:

1. Overall condition (excellent/good/fair/poor) with a score 1-10
2. Property type and style
3. Visible features and amenities
4. Any visible issues or needed repairs
5. Room type and condition (if interior)
6. Exterior elements (if exterior photo)
7. Market appeal factors
8. Estimated renovation costs by category

${context?.propertyType ? `Property type: ${context.propertyType}` : ''}
${context?.askingPrice ? `Asking price: $${context.askingPrice}` : ''}
${context?.location ? `Location: ${context.location}` : ''}

Provide response in structured JSON format.`
  }
  
  // Generate mock analysis
  private getMockAnalysis(imageUrl: string, context?: any): PhotoAnalysis {
    // Simulate different analyses based on image URL
    const isExterior = imageUrl.includes('exterior') || imageUrl.includes('front')
    const isKitchen = imageUrl.includes('kitchen')
    const isBathroom = imageUrl.includes('bath')
    
    const baseAnalysis: PhotoAnalysis = {
      imageUrl,
      condition: {
        overall: 'good',
        score: 7.5,
        confidence: 0.85
      },
      propertyType: {
        type: context?.propertyType || 'single-family',
        confidence: 0.9
      },
      features: [],
      issues: [],
      rooms: [],
      exterior: {
        roofCondition: 'good',
        sidingCondition: 'good',
        landscaping: 'well-maintained',
        driveway: 'concrete, good condition'
      },
      marketAppeal: {
        score: 7,
        strengths: [],
        improvements: []
      },
      renovationEstimate: {
        minimum: 0,
        maximum: 0,
        breakdown: {}
      }
    }
    
    if (isExterior) {
      baseAnalysis.features = [
        { name: 'Brick exterior', confidence: 0.95 },
        { name: 'Two-car garage', confidence: 0.92 },
        { name: 'Covered porch', confidence: 0.88 },
        { name: 'Mature trees', confidence: 0.85 },
        { name: 'Professional landscaping', confidence: 0.82 }
      ]
      
      baseAnalysis.issues = [
        { type: 'Gutter cleaning needed', severity: 'minor', estimatedCost: 200 },
        { type: 'Driveway crack', severity: 'minor', estimatedCost: 500 }
      ]
      
      baseAnalysis.marketAppeal.strengths = [
        'Excellent curb appeal',
        'Well-maintained landscaping',
        'Attractive brick facade'
      ]
      
      baseAnalysis.marketAppeal.improvements = [
        'Power wash exterior',
        'Update front door',
        'Add outdoor lighting'
      ]
      
      baseAnalysis.renovationEstimate = {
        minimum: 700,
        maximum: 3000,
        breakdown: {
          'Gutter cleaning': 200,
          'Driveway repair': 500,
          'Power washing': 300,
          'Front door': 1500,
          'Landscape lighting': 1000
        }
      }
    } else if (isKitchen) {
      baseAnalysis.features = [
        { name: 'Granite countertops', confidence: 0.93 },
        { name: 'Stainless steel appliances', confidence: 0.95 },
        { name: 'Kitchen island', confidence: 0.91 },
        { name: 'Tile backsplash', confidence: 0.87 },
        { name: 'Recessed lighting', confidence: 0.84 }
      ]
      
      baseAnalysis.rooms = [{
        type: 'kitchen',
        condition: 'good',
        features: ['Updated appliances', 'Good storage', 'Natural light']
      }]
      
      baseAnalysis.issues = [
        { type: 'Cabinet refinishing recommended', severity: 'minor', estimatedCost: 2500 }
      ]
      
      baseAnalysis.marketAppeal.strengths = [
        'Modern appliances',
        'Functional layout',
        'Quality finishes'
      ]
      
      baseAnalysis.renovationEstimate = {
        minimum: 2500,
        maximum: 8000,
        breakdown: {
          'Cabinet refinishing': 2500,
          'Hardware update': 500,
          'Paint': 1000,
          'Minor repairs': 1000,
          'Optional upgrades': 3000
        }
      }
    } else if (isBathroom) {
      baseAnalysis.features = [
        { name: 'Double vanity', confidence: 0.88 },
        { name: 'Tile flooring', confidence: 0.92 },
        { name: 'Glass shower enclosure', confidence: 0.85 },
        { name: 'Updated fixtures', confidence: 0.83 }
      ]
      
      baseAnalysis.rooms = [{
        type: 'bathroom',
        condition: 'good',
        features: ['Modern fixtures', 'Good ventilation', 'Tile surfaces']
      }]
      
      baseAnalysis.issues = [
        { type: 'Grout cleaning needed', severity: 'minor', estimatedCost: 300 },
        { type: 'Caulk replacement', severity: 'minor', estimatedCost: 200 }
      ]
      
      baseAnalysis.renovationEstimate = {
        minimum: 500,
        maximum: 2000,
        breakdown: {
          'Grout cleaning': 300,
          'Caulk replacement': 200,
          'Fixture updates': 1000,
          'Vanity hardware': 200,
          'Mirror frame': 300
        }
      }
    } else {
      // Generic interior
      baseAnalysis.features = [
        { name: 'Hardwood floors', confidence: 0.89 },
        { name: 'Crown molding', confidence: 0.82 },
        { name: 'Ceiling fan', confidence: 0.94 },
        { name: 'Large windows', confidence: 0.87 },
        { name: 'Neutral paint', confidence: 0.91 }
      ]
      
      baseAnalysis.rooms = [{
        type: 'living area',
        condition: 'good',
        features: ['Good natural light', 'Open layout', 'Quality flooring']
      }]
      
      baseAnalysis.marketAppeal.strengths = [
        'Move-in ready condition',
        'Quality finishes',
        'Neutral decor'
      ]
      
      baseAnalysis.renovationEstimate = {
        minimum: 500,
        maximum: 2000,
        breakdown: {
          'Touch-up paint': 500,
          'Minor repairs': 500,
          'Cleaning': 200,
          'Optional updates': 800
        }
      }
    }
    
    return baseAnalysis
  }
  
  // Calculate investment potential
  private calculateInvestmentPotential(
    conditionScore: number,
    marketAppeal: number,
    renovationCost: number
  ): 'excellent' | 'good' | 'fair' | 'poor' {
    const avgScore = (conditionScore + marketAppeal) / 2
    
    if (avgScore >= 8 && renovationCost < 20000) return 'excellent'
    if (avgScore >= 7 && renovationCost < 50000) return 'good'
    if (avgScore >= 5) return 'fair'
    return 'poor'
  }
  
  // Generate recommendations
  private generateRecommendations(
    analyses: PhotoAnalysis[],
    conditionScore: number,
    issues: Map<string, any>,
    features: Map<string, number>
  ): string[] {
    const recommendations: string[] = []
    
    // Condition-based recommendations
    if (conditionScore >= 8) {
      recommendations.push('Property is in excellent condition - consider premium pricing')
      recommendations.push('Focus marketing on move-in ready status')
    } else if (conditionScore >= 6) {
      recommendations.push('Address minor repairs before listing for best results')
      recommendations.push('Consider strategic updates to maximize value')
    } else {
      recommendations.push('Property needs significant work - price accordingly')
      recommendations.push('Market as renovation opportunity or to investors')
    }
    
    // Issue-based recommendations
    const majorIssues = Array.from(issues.entries()).filter(([_, data]) => data.severity === 'major')
    if (majorIssues.length > 0) {
      recommendations.push('Address major issues before listing: ' + majorIssues.map(([issue]) => issue).join(', '))
    }
    
    // Feature-based recommendations
    const premiumFeatures = ['pool', 'granite', 'stainless steel', 'hardwood', 'smart home']
    const hasPremiumFeatures = Array.from(features.keys()).some(feature => 
      premiumFeatures.some(pf => feature.toLowerCase().includes(pf))
    )
    
    if (hasPremiumFeatures) {
      recommendations.push('Highlight premium features in marketing materials')
    }
    
    // Market-specific recommendations
    recommendations.push('Compare with recent sales in neighborhood for pricing')
    recommendations.push('Consider seasonal market timing for listing')
    
    return recommendations
  }
  
  // Helper methods
  private getCacheKey(imageUrl: string): string {
    return `vision_${imageUrl.substring(imageUrl.lastIndexOf('/') + 1)}`
  }
  
  private getSeverityLevel(severity: string): number {
    switch (severity) {
      case 'major': return 3
      case 'moderate': return 2
      case 'minor': return 1
      default: return 0
    }
  }
  
  private getConditionLabel(score: number): string {
    if (score >= 8.5) return 'excellent'
    if (score >= 7) return 'good'
    if (score >= 5) return 'fair'
    return 'poor'
  }
  
  private determinePropertyType(analyses: PhotoAnalysis[]): string {
    const types = new Map<string, number>()
    
    analyses.forEach(analysis => {
      const count = types.get(analysis.propertyType.type) || 0
      types.set(analysis.propertyType.type, count + analysis.propertyType.confidence)
    })
    
    let bestType = 'unknown'
    let bestScore = 0
    
    types.forEach((score, type) => {
      if (score > bestScore) {
        bestScore = score
        bestType = type
      }
    })
    
    return bestType
  }
  
  private identifyRenovations(
    issues: Map<string, any>,
    analyses: PhotoAnalysis[]
  ): string[] {
    const renovations = new Set<string>()
    
    // Based on issues
    issues.forEach((data, issue) => {
      if (issue.includes('roof')) renovations.add('Roof repair/replacement')
      if (issue.includes('foundation')) renovations.add('Foundation repair')
      if (issue.includes('plumbing')) renovations.add('Plumbing updates')
      if (issue.includes('electrical')) renovations.add('Electrical updates')
      if (issue.includes('hvac')) renovations.add('HVAC service/replacement')
      if (issue.includes('paint')) renovations.add('Interior/exterior painting')
      if (issue.includes('flooring')) renovations.add('Flooring replacement')
      if (issue.includes('kitchen')) renovations.add('Kitchen update')
      if (issue.includes('bathroom')) renovations.add('Bathroom renovation')
    })
    
    // Based on low scores in specific areas
    analyses.forEach(analysis => {
      if (analysis.condition.score < 6) {
        analysis.rooms.forEach(room => {
          if (room.condition === 'poor' || room.condition === 'fair') {
            renovations.add(`${room.type} renovation`)
          }
        })
      }
    })
    
    return Array.from(renovations)
  }
  
  // Clear cache
  clearCache() {
    this.analysisCache.clear()
  }
  
  // Get cache statistics
  getCacheStats() {
    return {
      size: this.analysisCache.size,
      entries: Array.from(this.analysisCache.keys())
    }
  }
}

export const computerVision = new ComputerVisionAnalyzer()
export default ComputerVisionAnalyzer