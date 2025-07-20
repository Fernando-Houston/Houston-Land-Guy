// Investment Scoring Service based on Core Agent Intelligence
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface InvestmentScore {
  area: string
  totalScore: number
  components: {
    growthScore: number
    affordabilityScore: number
    infrastructureScore: number
    riskScore: number
    marketDynamicsScore: number
  }
  recommendations: string[]
  riskFactors: string[]
}

export class InvestmentScoringService {
  // Calculate comprehensive investment score for an area
  async calculateAreaInvestmentScore(areaName: string): Promise<InvestmentScore> {
    // Gather all relevant data
    const [
      marketData,
      constructionActivity,
      roiIndicators,
      permitActivity,
      competitiveAnalysis
    ] = await Promise.all([
      this.getAreaMarketData(areaName),
      this.getConstructionActivity(areaName),
      this.getROIIndicators(areaName),
      this.getPermitActivity(areaName),
      this.getCompetitiveInsights(areaName)
    ])

    // Calculate component scores
    const growthScore = this.calculateGrowthScore(marketData, constructionActivity)
    const affordabilityScore = this.calculateAffordabilityScore(marketData, roiIndicators)
    const infrastructureScore = this.calculateInfrastructureScore(permitActivity, constructionActivity)
    const riskScore = this.calculateRiskScore(marketData, competitiveAnalysis)
    const marketDynamicsScore = this.calculateMarketDynamicsScore(marketData, constructionActivity)

    // Calculate total score (weighted average)
    const totalScore = (
      growthScore * 0.25 +
      affordabilityScore * 0.20 +
      infrastructureScore * 0.20 +
      (100 - riskScore) * 0.15 + // Invert risk score
      marketDynamicsScore * 0.20
    )

    // Generate recommendations and identify risks
    const recommendations = this.generateRecommendations(totalScore, {
      growthScore,
      affordabilityScore,
      infrastructureScore,
      riskScore,
      marketDynamicsScore
    })

    const riskFactors = this.identifyRiskFactors(marketData, competitiveAnalysis, riskScore)

    return {
      area: areaName,
      totalScore,
      components: {
        growthScore,
        affordabilityScore,
        infrastructureScore,
        riskScore,
        marketDynamicsScore
      },
      recommendations,
      riskFactors
    }
  }

  // Find distressed properties with investment potential
  async findDistressedOpportunities(area?: string): Promise<any[]> {
    const whereClause: any = {
      OR: [
        { status: 'off-market' },
        { pricePerSqft: { lt: 100 } }, // Below market
        { yearBuilt: { lt: 1980 } } // Older properties
      ]
    }

    if (area) {
      whereClause.neighborhood = area
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        codeViolations: {
          where: { status: 'open' }
        },
        taxAssessments: {
          orderBy: { taxYear: 'desc' },
          take: 1
        },
        priceHistory: {
          orderBy: { date: 'desc' },
          take: 5
        }
      },
      take: 20
    })

    // Score each property for investment potential
    const opportunities = []
    
    for (const property of properties) {
      const score = await this.scoreDistressedProperty(property)
      if (score.investmentScore > 60) {
        opportunities.push({
          property,
          score,
          strategy: this.recommendInvestmentStrategy(property, score)
        })
      }
    }

    return opportunities.sort((a, b) => b.score.investmentScore - a.score.investmentScore)
  }

  // Calculate ROI projections for a property
  async calculatePropertyROI(propertyId: string, investmentType: string): Promise<any> {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        marketAnalyses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        neighborhood: true
      }
    })

    if (!property) throw new Error('Property not found')

    const marketData = await this.getAreaMarketData(property.neighborhood || 'Houston')
    
    // Calculate based on investment type
    switch (investmentType) {
      case 'flip':
        return this.calculateFlipROI(property, marketData)
      case 'rental':
        return this.calculateRentalROI(property, marketData)
      case 'development':
        return this.calculateDevelopmentROI(property, marketData)
      default:
        throw new Error('Invalid investment type')
    }
  }

  // Private helper methods
  private async getAreaMarketData(area: string) {
    return prisma.marketMetrics.findFirst({
      where: { areaName: area },
      orderBy: { startDate: 'desc' }
    })
  }

  private async getConstructionActivity(area: string) {
    return prisma.areaConstructionActivity.findFirst({
      where: { neighborhood: area },
      orderBy: { year: 'desc' }
    })
  }

  private async getROIIndicators(area: string) {
    return prisma.rOIIndicator.findMany({
      where: { area }
    })
  }

  private async getPermitActivity(area: string) {
    return prisma.permit.count({
      where: {
        address: { contains: area },
        applicationDate: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        }
      }
    })
  }

  private async getCompetitiveInsights(area: string) {
    return prisma.competitiveAnalysis.findMany({
      where: {
        relatedAreas: { has: area }
      }
    })
  }

  // Scoring calculations
  private calculateGrowthScore(marketData: any, constructionActivity: any): number {
    if (!marketData) return 50
    
    let score = 50
    
    // Price appreciation
    if (marketData.medianPriceChange > 10) score += 20
    else if (marketData.medianPriceChange > 5) score += 10
    else if (marketData.medianPriceChange < 0) score -= 10
    
    // Construction activity
    if (constructionActivity) {
      if (constructionActivity.newConstructionUnits > 100) score += 15
      else if (constructionActivity.newConstructionUnits > 50) score += 10
      else if (constructionActivity.newConstructionUnits < 10) score -= 5
    }
    
    // Market velocity
    if (marketData.avgDaysOnMarket < 30) score += 15
    else if (marketData.avgDaysOnMarket > 90) score -= 10
    
    return Math.max(0, Math.min(100, score))
  }

  private calculateAffordabilityScore(marketData: any, roiIndicators: any[]): number {
    if (!marketData) return 50
    
    let score = 50
    
    // Price per sqft compared to city average
    const cityAvg = 125 // Houston average
    const ratio = marketData.pricePerSqft / cityAvg
    
    if (ratio < 0.8) score += 20
    else if (ratio < 1.0) score += 10
    else if (ratio > 1.5) score -= 20
    else if (ratio > 1.2) score -= 10
    
    // ROI indicators
    const avgROI = roiIndicators
      .filter(i => i.indicatorName.includes('ROI'))
      .reduce((sum, i) => sum + i.currentValue, 0) / roiIndicators.length
    
    if (avgROI > 20) score += 20
    else if (avgROI > 15) score += 10
    else if (avgROI < 10) score -= 10
    
    return Math.max(0, Math.min(100, score))
  }

  private calculateInfrastructureScore(permitCount: number, constructionActivity: any): number {
    let score = 50
    
    // Permit activity
    if (permitCount > 100) score += 20
    else if (permitCount > 50) score += 10
    else if (permitCount < 10) score -= 10
    
    // Mixed-use development
    if (constructionActivity?.mixedUseProjects > 5) score += 15
    else if (constructionActivity?.mixedUseProjects > 0) score += 10
    
    // Active builders
    if (constructionActivity?.activeBuilders > 10) score += 15
    else if (constructionActivity?.activeBuilders > 5) score += 10
    else if (constructionActivity?.activeBuilders < 3) score -= 10
    
    return Math.max(0, Math.min(100, score))
  }

  private calculateRiskScore(marketData: any, competitiveAnalysis: any[]): number {
    let riskScore = 0
    
    // Market volatility
    if (marketData?.inventory > 6) riskScore += 20 // High inventory
    if (marketData?.avgDaysOnMarket > 90) riskScore += 15
    
    // Competitive risks
    competitiveAnalysis.forEach(analysis => {
      if (analysis.competitiveImplications.toLowerCase().includes('oversupply')) {
        riskScore += 15
      }
      if (analysis.competitiveImplications.toLowerCase().includes('declining')) {
        riskScore += 10
      }
    })
    
    // Price volatility
    if (marketData?.medianPriceChange < -5) riskScore += 20
    else if (marketData?.medianPriceChange < 0) riskScore += 10
    
    return Math.min(100, riskScore)
  }

  private calculateMarketDynamicsScore(marketData: any, constructionActivity: any): number {
    let score = 50
    
    // Supply/demand balance
    if (marketData?.inventory < 3) score += 20 // Low inventory
    else if (marketData?.inventory < 4) score += 10
    else if (marketData?.inventory > 6) score -= 15
    
    // Sales velocity
    if (marketData?.listToSaleRatio > 98) score += 15
    else if (marketData?.listToSaleRatio > 95) score += 10
    else if (marketData?.listToSaleRatio < 90) score -= 10
    
    // Price dynamics
    if (constructionActivity?.averageUnitPrice > 400000) score += 10 // Luxury market
    else if (constructionActivity?.averageUnitPrice < 200000) score += 15 // Affordable market
    
    return Math.max(0, Math.min(100, score))
  }

  private generateRecommendations(totalScore: number, components: any): string[] {
    const recommendations: string[] = []
    
    if (totalScore > 80) {
      recommendations.push('Strong investment opportunity - act quickly')
      recommendations.push('Consider multiple property investments')
    } else if (totalScore > 60) {
      recommendations.push('Good investment potential with careful property selection')
      recommendations.push('Focus on properties below market value')
    } else {
      recommendations.push('Higher risk area - thorough due diligence required')
      recommendations.push('Consider partnering with experienced local developers')
    }
    
    // Component-specific recommendations
    if (components.growthScore > 80) {
      recommendations.push('Excellent growth trajectory - consider long-term holds')
    }
    if (components.affordabilityScore < 40) {
      recommendations.push('Premium market - focus on luxury developments')
    }
    if (components.infrastructureScore > 70) {
      recommendations.push('Strong development activity - new construction opportunities')
    }
    if (components.riskScore > 60) {
      recommendations.push('Elevated risk - ensure adequate reserves and exit strategies')
    }
    
    return recommendations
  }

  private identifyRiskFactors(marketData: any, competitiveAnalysis: any[], riskScore: number): string[] {
    const risks: string[] = []
    
    if (riskScore > 70) {
      risks.push('High overall market risk')
    }
    
    if (marketData?.inventory > 6) {
      risks.push('Oversupply conditions - extended selling times likely')
    }
    
    if (marketData?.medianPriceChange < 0) {
      risks.push('Declining property values')
    }
    
    competitiveAnalysis.forEach(analysis => {
      if (analysis.keyFindings.toLowerCase().includes('saturation')) {
        risks.push('Market saturation risk')
      }
    })
    
    if (marketData?.avgDaysOnMarket > 90) {
      risks.push('Slow market conditions')
    }
    
    return risks
  }

  private async scoreDistressedProperty(property: any): Promise<any> {
    let investmentScore = 50
    const factors: string[] = []
    
    // Code violations can mean opportunity
    if (property.codeViolations.length > 0) {
      investmentScore += 10
      factors.push('Code violations present - potential for value-add')
    }
    
    // Tax delinquency
    const taxAssessment = property.taxAssessments[0]
    if (taxAssessment?.paymentStatus === 'delinquent') {
      investmentScore += 15
      factors.push('Tax delinquency - motivated seller likely')
    }
    
    // Price history
    if (property.priceHistory.length > 2) {
      const priceDrops = property.priceHistory.filter((p: any) => p.priceType === 'reduced')
      if (priceDrops.length > 0) {
        investmentScore += 10
        factors.push('Multiple price reductions')
      }
    }
    
    // Below market value
    if (property.pricePerSqft && property.pricePerSqft < 100) {
      investmentScore += 20
      factors.push('Significantly below market price')
    }
    
    return {
      investmentScore: Math.min(100, investmentScore),
      factors
    }
  }

  private recommendInvestmentStrategy(property: any, score: any): string {
    if (property.codeViolations.length > 2) {
      return 'Fix-and-flip: Address violations, renovate, and resell'
    }
    
    if (property.yearBuilt < 1980 && property.squareFeet > 2000) {
      return 'Renovation rental: Update property for premium rental income'
    }
    
    if (property.lotSize > 0.5) {
      return 'Development opportunity: Consider subdivision or multifamily'
    }
    
    return 'Buy-and-hold: Good long-term appreciation potential'
  }

  private async calculateFlipROI(property: any, marketData: any) {
    const purchasePrice = property.listPrice || property.soldPrice || 0
    const estimatedARV = purchasePrice * 1.3 // After repair value
    const renovationCost = property.squareFeet * 50 // $50/sqft renovation
    const holdingCosts = purchasePrice * 0.06 // 6 months holding
    const sellingCosts = estimatedARV * 0.08 // Realtor + closing
    
    const totalInvestment = purchasePrice + renovationCost + holdingCosts
    const netProfit = estimatedARV - totalInvestment - sellingCosts
    const roi = (netProfit / totalInvestment) * 100
    
    return {
      investmentType: 'flip',
      purchasePrice,
      renovationCost,
      holdingCosts,
      sellingCosts,
      estimatedARV,
      totalInvestment,
      netProfit,
      roi,
      timeline: '6-8 months'
    }
  }

  private async calculateRentalROI(property: any, marketData: any) {
    const purchasePrice = property.listPrice || property.soldPrice || 0
    const monthlyRent = property.squareFeet * 1.2 // $1.20/sqft avg rent
    const annualRent = monthlyRent * 12
    const expenses = annualRent * 0.4 // 40% expense ratio
    const noi = annualRent - expenses
    const capRate = (noi / purchasePrice) * 100
    
    return {
      investmentType: 'rental',
      purchasePrice,
      monthlyRent,
      annualRent,
      expenses,
      noi,
      capRate,
      cashOnCashReturn: capRate * 0.8, // Assuming 20% down
      timeline: 'Long-term hold'
    }
  }

  private async calculateDevelopmentROI(property: any, marketData: any) {
    const landCost = property.listPrice || property.soldPrice || 0
    const developableUnits = Math.floor((property.lotSize || 0.25) * 4) // 4 units per acre
    const constructionCost = developableUnits * 150000 // $150k per unit
    const totalCost = landCost + constructionCost
    const salesRevenue = developableUnits * 250000 // $250k per unit sale price
    const profit = salesRevenue - totalCost - (salesRevenue * 0.15) // 15% soft costs
    const roi = (profit / totalCost) * 100
    
    return {
      investmentType: 'development',
      landCost,
      developableUnits,
      constructionCost,
      totalCost,
      salesRevenue,
      profit,
      roi,
      timeline: '18-24 months'
    }
  }
}

export const investmentScoring = new InvestmentScoringService()