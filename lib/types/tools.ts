export interface CalculatorResult {
  roi: number
  totalCost: number
  projectedProfit: number
  timeline: string
  risks: RiskAssessment[]
}

export interface RiskAssessment {
  category: string
  level: 'low' | 'medium' | 'high'
  description: string
  mitigation?: string
}

export interface MarketIntelligence {
  neighborhood: string
  permits: PermitData[]
  trends: TrendData[]
  opportunities: OpportunityScore
  lastUpdated: Date
}

export interface PermitData {
  permitNumber: string
  type: string
  address: string
  value: number
  issuedDate: Date
  status: string
}

export interface TrendData {
  metric: string
  value: number
  change: number
  period: string
}

export interface OpportunityScore {
  overall: number
  factors: {
    growth: number
    demand: number
    competition: number
    regulations: number
  }
  recommendations: string[]
}

export interface ROICalculatorInput {
  purchasePrice: number
  renovationCost: number
  holdingPeriod: number
  propertyType: string
  location: string
  squareFeet: number
  bedroomsBathrooms?: {
    bedrooms: number
    bathrooms: number
  }
}

export interface MarketAnalysisInput {
  neighborhoods: string[]
  propertyTypes: string[]
  priceRange: {
    min: number
    max: number
  }
  timeframe: 'current' | '3months' | '6months' | '1year'
}