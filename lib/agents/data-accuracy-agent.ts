import { BaseAgent } from './base-agent'

interface DataPoint {
  source: string
  field: string
  value: any
  timestamp: Date
  confidence?: number
}

interface ValidationResult {
  field: string
  isValid: boolean
  confidence: number
  issues: string[]
  recommendation?: string
}

interface DataAnomalyReport {
  field: string
  expectedRange: { min: number; max: number }
  actualValue: number
  deviation: number
  severity: 'low' | 'medium' | 'high'
}

export class DataAccuracyAgent extends BaseAgent {
  private validationRules: Map<string, (value: any) => ValidationResult>
  private historicalData: Map<string, number[]>
  private confidenceThresholds = {
    high: 0.9,
    medium: 0.7,
    low: 0.5
  }

  constructor() {
    super('DataAccuracyAgent', 'Validates data accuracy through multi-source verification and anomaly detection')
    
    this.validationRules = new Map()
    this.historicalData = new Map()
    this.initializeValidationRules()
  }

  private initializeValidationRules() {
    // Property value validation
    this.validationRules.set('marketValue', (value: number) => {
      const issues: string[] = []
      let confidence = 1.0
      
      if (value <= 0) {
        issues.push('Market value cannot be zero or negative')
        confidence = 0
      } else if (value < 50000) {
        issues.push('Market value unusually low for Houston market')
        confidence *= 0.6
      } else if (value > 50000000) {
        issues.push('Market value unusually high - verify for data entry error')
        confidence *= 0.7
      }
      
      return {
        field: 'marketValue',
        isValid: issues.length === 0,
        confidence,
        issues,
        recommendation: issues.length > 0 ? 'Cross-reference with HCAD and recent sales data' : undefined
      }
    })
    
    // Square footage validation
    this.validationRules.set('buildingArea', (value: number) => {
      const issues: string[] = []
      let confidence = 1.0
      
      if (value <= 0) {
        issues.push('Building area cannot be zero or negative')
        confidence = 0
      } else if (value < 500) {
        issues.push('Building area unusually small')
        confidence *= 0.7
      } else if (value > 100000) {
        issues.push('Building area unusually large for single property')
        confidence *= 0.8
      }
      
      return {
        field: 'buildingArea',
        isValid: issues.length === 0,
        confidence,
        issues
      }
    })
    
    // Year built validation
    this.validationRules.set('yearBuilt', (value: number) => {
      const issues: string[] = []
      let confidence = 1.0
      const currentYear = new Date().getFullYear()
      
      if (value < 1800) {
        issues.push('Year built predates Houston founding (1836)')
        confidence = 0
      } else if (value > currentYear) {
        issues.push('Year built cannot be in the future')
        confidence = 0
      } else if (value < 1900) {
        issues.push('Very old property - verify historical designation')
        confidence *= 0.8
      }
      
      return {
        field: 'yearBuilt',
        isValid: issues.length === 0,
        confidence,
        issues
      }
    })
    
    // ZIP code validation for Houston area
    this.validationRules.set('zipCode', (value: string) => {
      const issues: string[] = []
      let confidence = 1.0
      
      const houstonZipCodes = [
        '77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010',
        '77011', '77012', '77013', '77014', '77015', '77016', '77017', '77018', '77019', '77020',
        '77021', '77022', '77023', '77024', '77025', '77026', '77027', '77028', '77029', '77030',
        '77031', '77032', '77033', '77034', '77035', '77036', '77037', '77038', '77039', '77040',
        '77041', '77042', '77043', '77044', '77045', '77046', '77047', '77048', '77049', '77050',
        '77051', '77052', '77053', '77054', '77055', '77056', '77057', '77058', '77059', '77060',
        '77061', '77062', '77063', '77064', '77065', '77066', '77067', '77068', '77069', '77070',
        '77071', '77072', '77073', '77074', '77075', '77076', '77077', '77078', '77079', '77080',
        '77081', '77082', '77083', '77084', '77085', '77086', '77087', '77088', '77089', '77090',
        '77091', '77092', '77093', '77094', '77095', '77096', '77098', '77099'
      ]
      
      if (!houstonZipCodes.includes(value)) {
        issues.push('ZIP code not in Houston area')
        confidence = 0.3
      }
      
      return {
        field: 'zipCode',
        isValid: issues.length === 0,
        confidence,
        issues
      }
    })
  }

  async execute(task: any): Promise<any> {
    const { action, params } = task.data || task
    
    switch (action) {
      case 'validateProperty':
        return this.validatePropertyData(params.propertyData)
      case 'crossReference':
        return this.crossReferenceData(params.sources)
      case 'detectAnomalies':
        return this.detectAnomalies(params.dataset, params.field)
      case 'calculateConfidence':
        return this.calculateDataConfidence(params.dataPoints)
      case 'reconcileConflicts':
        return this.reconcileDataConflicts(params.conflicts)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  async validatePropertyData(propertyData: any): Promise<{
    overallValid: boolean
    overallConfidence: number
    validations: ValidationResult[]
    recommendations: string[]
  }> {
    const validations: ValidationResult[] = []
    const recommendations: string[] = []
    
    // Run all applicable validation rules
    for (const [field, validator] of this.validationRules) {
      if (propertyData.hasOwnProperty(field)) {
        const result = validator(propertyData[field])
        validations.push(result)
        
        if (result.recommendation) {
          recommendations.push(result.recommendation)
        }
      }
    }
    
    // Additional cross-field validations
    if (propertyData.marketValue && propertyData.buildingArea) {
      const pricePerSqft = propertyData.marketValue / propertyData.buildingArea
      const psfValidation = this.validatePricePerSqft(pricePerSqft, propertyData.zipCode)
      validations.push(psfValidation)
    }
    
    // Calculate overall metrics
    const overallValid = validations.every(v => v.isValid)
    const overallConfidence = validations.reduce((sum, v) => sum + v.confidence, 0) / validations.length
    
    return {
      overallValid,
      overallConfidence,
      validations,
      recommendations
    }
  }

  private validatePricePerSqft(pricePerSqft: number, zipCode: string): ValidationResult {
    const issues: string[] = []
    let confidence = 1.0
    
    // Houston market typical ranges (these would be data-driven in production)
    const marketRanges: Record<string, { min: number; max: number }> = {
      '77002': { min: 150, max: 400 }, // Downtown
      '77005': { min: 200, max: 500 }, // West University
      '77006': { min: 180, max: 450 }, // Montrose
      '77019': { min: 250, max: 600 }, // River Oaks
      'default': { min: 100, max: 350 }
    }
    
    const range = marketRanges[zipCode] || marketRanges.default
    
    if (pricePerSqft < range.min) {
      issues.push(`Price per sqft ($${pricePerSqft.toFixed(2)}) below market range for area`)
      confidence *= 0.7
    } else if (pricePerSqft > range.max) {
      issues.push(`Price per sqft ($${pricePerSqft.toFixed(2)}) above market range for area`)
      confidence *= 0.8
    }
    
    return {
      field: 'pricePerSqft',
      isValid: issues.length === 0,
      confidence,
      issues
    }
  }

  async crossReferenceData(sources: DataPoint[]): Promise<{
    field: string
    consensus: any
    confidence: number
    conflicts: any[]
    recommendation: string
  }[]> {
    // Group data points by field
    const fieldGroups = new Map<string, DataPoint[]>()
    
    for (const point of sources) {
      const group = fieldGroups.get(point.field) || []
      group.push(point)
      fieldGroups.set(point.field, group)
    }
    
    const results = []
    
    for (const [field, points] of fieldGroups) {
      const analysis = this.analyzeDataPoints(points)
      results.push({
        field,
        consensus: analysis.consensus,
        confidence: analysis.confidence,
        conflicts: analysis.conflicts,
        recommendation: analysis.recommendation
      })
    }
    
    return results
  }

  private analyzeDataPoints(points: DataPoint[]): {
    consensus: any
    confidence: number
    conflicts: any[]
    recommendation: string
  } {
    if (points.length === 0) {
      return {
        consensus: null,
        confidence: 0,
        conflicts: [],
        recommendation: 'No data available'
      }
    }
    
    if (points.length === 1) {
      return {
        consensus: points[0].value,
        confidence: 0.6, // Single source has lower confidence
        conflicts: [],
        recommendation: 'Seek additional data sources for verification'
      }
    }
    
    // For numeric values, check variance
    if (typeof points[0].value === 'number') {
      const values = points.map(p => p.value as number)
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
      const stdDev = Math.sqrt(variance)
      const coefficientOfVariation = stdDev / mean
      
      const conflicts = points.filter(p => Math.abs(p.value - mean) > 2 * stdDev)
      
      let confidence = 1.0
      let recommendation = ''
      
      if (coefficientOfVariation > 0.3) {
        confidence = 0.5
        recommendation = 'High variance detected - investigate outliers'
      } else if (coefficientOfVariation > 0.1) {
        confidence = 0.8
        recommendation = 'Moderate variance - verify with primary source'
      } else {
        confidence = 0.95
        recommendation = 'Data sources in agreement'
      }
      
      // Weight by recency
      const weightedValue = this.calculateWeightedValue(points)
      
      return {
        consensus: weightedValue,
        confidence,
        conflicts,
        recommendation
      }
    }
    
    // For non-numeric values, find mode
    const valueCounts = new Map<any, number>()
    for (const point of points) {
      valueCounts.set(point.value, (valueCounts.get(point.value) || 0) + 1)
    }
    
    let maxCount = 0
    let consensus = null
    for (const [value, count] of valueCounts) {
      if (count > maxCount) {
        maxCount = count
        consensus = value
      }
    }
    
    const agreementRate = maxCount / points.length
    const conflicts = points.filter(p => p.value !== consensus)
    
    return {
      consensus,
      confidence: agreementRate,
      conflicts,
      recommendation: agreementRate < 0.7 ? 'Low agreement between sources - manual review needed' : 'Majority consensus reached'
    }
  }

  private calculateWeightedValue(points: DataPoint[]): number {
    const now = Date.now()
    let totalWeight = 0
    let weightedSum = 0
    
    for (const point of points) {
      // Weight by recency (exponential decay over 30 days)
      const ageInDays = (now - point.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      const recencyWeight = Math.exp(-ageInDays / 30)
      
      // Weight by source confidence (if available)
      const confidenceWeight = point.confidence || 0.8
      
      const weight = recencyWeight * confidenceWeight
      totalWeight += weight
      weightedSum += (point.value as number) * weight
    }
    
    return weightedSum / totalWeight
  }

  async detectAnomalies(dataset: any[], field: string): Promise<DataAnomalyReport[]> {
    const values = dataset.map(item => item[field]).filter(v => typeof v === 'number') as number[]
    
    if (values.length < 3) {
      return []
    }
    
    // Calculate statistics
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length)
    
    // Calculate IQR for robust outlier detection
    const sorted = [...values].sort((a, b) => a - b)
    const q1 = sorted[Math.floor(values.length * 0.25)]
    const q3 = sorted[Math.floor(values.length * 0.75)]
    const iqr = q3 - q1
    
    const anomalies: DataAnomalyReport[] = []
    
    dataset.forEach((item, index) => {
      const value = item[field]
      if (typeof value !== 'number') return
      
      // Check both z-score and IQR methods
      const zScore = Math.abs((value - mean) / stdDev)
      const isIQROutlier = value < (q1 - 1.5 * iqr) || value > (q3 + 1.5 * iqr)
      
      if (zScore > 3 || isIQROutlier) {
        const deviation = ((value - mean) / mean) * 100
        
        anomalies.push({
          field,
          expectedRange: {
            min: Math.max(mean - 2 * stdDev, q1 - 1.5 * iqr),
            max: Math.min(mean + 2 * stdDev, q3 + 1.5 * iqr)
          },
          actualValue: value,
          deviation,
          severity: zScore > 4 || Math.abs(deviation) > 100 ? 'high' : 
                   zScore > 3 || Math.abs(deviation) > 50 ? 'medium' : 'low'
        })
      }
    })
    
    return anomalies
  }

  async calculateDataConfidence(dataPoints: DataPoint[]): Promise<{
    overallConfidence: number
    breakdown: {
      source: string
      confidence: number
      factors: string[]
    }[]
  }> {
    const breakdown = []
    
    for (const point of dataPoints) {
      const factors = []
      let confidence = 0.5 // Base confidence
      
      // Factor 1: Data recency
      const ageInDays = (Date.now() - point.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      if (ageInDays < 7) {
        confidence += 0.2
        factors.push('Recent data (+20%)')
      } else if (ageInDays < 30) {
        confidence += 0.1
        factors.push('Fairly recent data (+10%)')
      } else if (ageInDays > 90) {
        confidence -= 0.1
        factors.push('Stale data (-10%)')
      }
      
      // Factor 2: Source reliability
      const sourceReliability: Record<string, number> = {
        'HCAD': 0.25,
        'Houston Open Data': 0.2,
        'Realtor.com': 0.15,
        'Zillow': 0.15,
        'User Input': 0.05
      }
      
      const reliabilityBonus = sourceReliability[point.source] || 0.1
      confidence += reliabilityBonus
      factors.push(`${point.source} reliability (+${(reliabilityBonus * 100).toFixed(0)}%)`)
      
      // Factor 3: Data completeness (if we can check)
      if (point.value && typeof point.value === 'object') {
        const fields = Object.keys(point.value)
        const nullFields = fields.filter(f => point.value[f] === null || point.value[f] === undefined)
        const completeness = (fields.length - nullFields.length) / fields.length
        
        if (completeness > 0.9) {
          confidence += 0.1
          factors.push('High completeness (+10%)')
        } else if (completeness < 0.5) {
          confidence -= 0.1
          factors.push('Low completeness (-10%)')
        }
      }
      
      // Cap confidence at 0.95
      confidence = Math.min(confidence, 0.95)
      
      breakdown.push({
        source: point.source,
        confidence,
        factors
      })
    }
    
    const overallConfidence = breakdown.reduce((sum, b) => sum + b.confidence, 0) / breakdown.length
    
    return {
      overallConfidence,
      breakdown
    }
  }

  async reconcileDataConflicts(conflicts: {
    field: string
    sources: DataPoint[]
  }[]): Promise<{
    field: string
    recommendedValue: any
    confidence: number
    reasoning: string
  }[]> {
    const reconciliations = []
    
    for (const conflict of conflicts) {
      const { field, sources } = conflict
      
      // Sort by confidence and recency
      const scoredSources = sources.map(source => ({
        ...source,
        score: this.calculateSourceScore(source)
      })).sort((a, b) => b.score - a.score)
      
      // Apply field-specific rules
      let recommendedValue
      let confidence
      let reasoning
      
      if (field === 'marketValue' || field === 'price') {
        // For prices, prefer recent actual transactions over estimates
        const transactions = scoredSources.filter(s => s.source.includes('sale') || s.source.includes('transaction'))
        if (transactions.length > 0) {
          recommendedValue = transactions[0].value
          confidence = 0.9
          reasoning = 'Using most recent transaction data'
        } else {
          // Use weighted average of top sources
          const topSources = scoredSources.slice(0, 3)
          const weightedSum = topSources.reduce((sum, s) => sum + s.value * s.score, 0)
          const totalWeight = topSources.reduce((sum, s) => sum + s.score, 0)
          recommendedValue = Math.round(weightedSum / totalWeight)
          confidence = 0.7
          reasoning = 'Weighted average of top data sources'
        }
      } else {
        // For other fields, use highest scoring source
        recommendedValue = scoredSources[0].value
        confidence = scoredSources[0].score
        reasoning = `Highest confidence source: ${scoredSources[0].source}`
      }
      
      reconciliations.push({
        field,
        recommendedValue,
        confidence,
        reasoning
      })
    }
    
    return reconciliations
  }

  private calculateSourceScore(source: DataPoint): number {
    let score = 0.5
    
    // Recency score
    const ageInDays = (Date.now() - source.timestamp.getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(0, (30 - ageInDays) / 60) // Up to +0.5 for very recent data
    
    // Source reliability
    const reliability: Record<string, number> = {
      'HCAD': 0.4,
      'Houston Open Data': 0.35,
      'MLS': 0.35,
      'Realtor.com': 0.25,
      'Zillow': 0.25
    }
    
    score += reliability[source.source] || 0.15
    
    // Existing confidence if provided
    if (source.confidence) {
      score = score * 0.7 + source.confidence * 0.3
    }
    
    return Math.min(score, 1.0)
  }
}

export default DataAccuracyAgent