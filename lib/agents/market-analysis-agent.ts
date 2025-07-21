import { BaseAgent, AgentTask, AgentResult } from './base-agent'
import { prisma } from '../prisma'

interface MarketAnalysisTask extends AgentTask {
  type: 'price-trend' | 'neighborhood-ranking' | 'construction-correlation' | 'market-heatmap' | 'roi-calculation' | 'emerging-neighborhoods'
  data: {
    zipCode?: string
    neighborhood?: string
    propertyType?: string
    timeframe?: number // in months
    includeForecasts?: boolean
  }
}

interface PriceTrend {
  date: Date
  avgPrice: number
  medianPrice: number
  volume: number
  pricePerSqft: number
}

interface PricePrediction {
  month: string
  predictedPrice: number
  confidence: number
  factors: string[]
}

interface NeighborhoodScore {
  zipCode: string
  neighborhood: string
  investmentScore: number
  metrics: {
    appreciation: number
    demandScore: number
    supplyScore: number
    constructionActivity: number
    rentalYield: number
    marketVelocity: number
  }
  trend: 'rising' | 'stable' | 'declining'
}

interface ConstructionCorrelation {
  zipCode: string
  correlationScore: number
  priceImpact: number
  constructionProjects: number
  avgPriceChange: number
  timelag: number // months between construction and price impact
}

interface MarketHeatMap {
  zipCode: string
  latitude: number
  longitude: number
  intensity: number
  metric: 'price' | 'volume' | 'appreciation' | 'construction'
  value: number
}

interface ROICalculation {
  propertyType: string
  zipCode: string
  purchasePrice: number
  monthlyRent: number
  expenses: {
    mortgage: number
    taxes: number
    insurance: number
    maintenance: number
    hoa?: number
  }
  metrics: {
    cashFlow: number
    capRate: number
    cashOnCashReturn: number
    totalROI: number
    breakEvenYears: number
  }
}

export class MarketAnalysisAgent extends BaseAgent {
  constructor() {
    super('MarketAnalysisAgent', {
      maxConcurrent: 3,
      timeout: 60000,
      retryAttempts: 2
    })
  }

  async execute(task: MarketAnalysisTask): Promise<AgentResult> {
    switch (task.type) {
      case 'price-trend':
        return this.analyzePriceTrends(task)
      case 'neighborhood-ranking':
        return this.rankNeighborhoods(task)
      case 'construction-correlation':
        return this.analyzeConstructionCorrelation(task)
      case 'market-heatmap':
        return this.generateHeatMap(task)
      case 'roi-calculation':
        return this.calculateROI(task)
      case 'emerging-neighborhoods':
        return this.identifyEmergingNeighborhoods(task)
      default:
        throw new Error(`Unknown task type: ${task.type}`)
    }
  }

  private async analyzePriceTrends(task: MarketAnalysisTask): Promise<AgentResult> {
    try {
      const { zipCode, timeframe = 12, includeForecasts = true } = task.data
      
      // Get historical price data
      const historicalData = await this.getHistoricalPrices(zipCode, timeframe)
      
      // Calculate trend metrics
      const trends = this.calculateTrendMetrics(historicalData)
      
      // Generate predictions if requested
      let predictions: PricePrediction[] = []
      if (includeForecasts) {
        predictions = this.generatePricePredictions(historicalData, trends)
      }
      
      // Identify market patterns
      const patterns = this.identifyMarketPatterns(historicalData)
      
      return {
        taskId: task.id,
        agentName: this.name,
        success: true,
        data: {
          zipCode,
          historicalTrends: trends,
          predictions,
          patterns,
          summary: this.generateTrendSummary(trends, predictions)
        },
        executionTime: 0,
        confidence: 0.85
      }
    } catch (error) {
      throw new Error(`Price trend analysis failed: ${error.message}`)
    }
  }

  private async rankNeighborhoods(task: MarketAnalysisTask): Promise<AgentResult> {
    try {
      // Get all neighborhoods or specific one
      const neighborhoods = await this.getNeighborhoodsData(task.data.neighborhood)
      
      // Score each neighborhood
      const scores: NeighborhoodScore[] = []
      
      for (const neighborhood of neighborhoods) {
        const score = await this.scoreNeighborhood(neighborhood)
        scores.push(score)
      }
      
      // Sort by investment score
      scores.sort((a, b) => b.investmentScore - a.investmentScore)
      
      // Identify top opportunities
      const opportunities = this.identifyInvestmentOpportunities(scores)
      
      return {
        taskId: task.id,
        agentName: this.name,
        success: true,
        data: {
          rankings: scores,
          topOpportunities: opportunities,
          marketInsights: this.generateMarketInsights(scores)
        },
        executionTime: 0,
        confidence: 0.9
      }
    } catch (error) {
      throw new Error(`Neighborhood ranking failed: ${error.message}`)
    }
  }

  private async analyzeConstructionCorrelation(task: MarketAnalysisTask): Promise<AgentResult> {
    try {
      const { zipCode } = task.data
      
      // Get construction data
      const constructionData = await this.getConstructionData(zipCode)
      
      // Get price movements
      const priceData = await this.getHistoricalPrices(zipCode, 24)
      
      // Calculate correlations
      const correlations = this.calculateConstructionCorrelations(constructionData, priceData)
      
      // Identify impact patterns
      const impactAnalysis = this.analyzeConstructionImpact(correlations)
      
      return {
        taskId: task.id,
        agentName: this.name,
        success: true,
        data: {
          correlations,
          impactAnalysis,
          recommendations: this.generateConstructionRecommendations(impactAnalysis)
        },
        executionTime: 0,
        confidence: 0.8
      }
    } catch (error) {
      throw new Error(`Construction correlation analysis failed: ${error.message}`)
    }
  }

  private async generateHeatMap(task: MarketAnalysisTask): Promise<AgentResult> {
    try {
      const metric = task.data.propertyType as 'price' | 'volume' | 'appreciation' | 'construction'
      
      // Get data points for all zip codes
      const dataPoints = await this.getHeatMapData(metric)
      
      // Generate heat map data
      const heatMapData: MarketHeatMap[] = dataPoints.map(point => ({
        zipCode: point.zipCode,
        latitude: point.latitude,
        longitude: point.longitude,
        intensity: this.calculateIntensity(point.value, dataPoints),
        metric,
        value: point.value
      }))
      
      // Identify hot spots
      const hotSpots = this.identifyHotSpots(heatMapData)
      
      return {
        taskId: task.id,
        agentName: this.name,
        success: true,
        data: {
          heatMap: heatMapData,
          hotSpots,
          statistics: this.calculateHeatMapStats(heatMapData)
        },
        executionTime: 0,
        confidence: 0.85
      }
    } catch (error) {
      throw new Error(`Heat map generation failed: ${error.message}`)
    }
  }

  private async calculateROI(task: MarketAnalysisTask): Promise<AgentResult> {
    try {
      const { propertyType, zipCode } = task.data
      
      // Get market data for property type
      const marketData = await this.getMarketDataByType(propertyType, zipCode)
      
      // Calculate ROI for different scenarios
      const scenarios = [
        { name: 'Conservative', params: this.getConservativeParams() },
        { name: 'Moderate', params: this.getModerateParams() },
        { name: 'Aggressive', params: this.getAggressiveParams() }
      ]
      
      const roiCalculations = scenarios.map(scenario => ({
        scenario: scenario.name,
        roi: this.calculatePropertyROI(marketData, scenario.params)
      }))
      
      // Generate investment recommendations
      const recommendations = this.generateROIRecommendations(roiCalculations)
      
      return {
        taskId: task.id,
        agentName: this.name,
        success: true,
        data: {
          propertyType,
          zipCode,
          calculations: roiCalculations,
          recommendations,
          marketComparison: this.compareToMarketAverages(roiCalculations)
        },
        executionTime: 0,
        confidence: 0.88
      }
    } catch (error) {
      throw new Error(`ROI calculation failed: ${error.message}`)
    }
  }

  private async identifyEmergingNeighborhoods(task: MarketAnalysisTask): Promise<AgentResult> {
    try {
      // Get all neighborhoods with growth metrics
      const neighborhoods = await this.getNeighborhoodGrowthMetrics()
      
      // Score emergence potential
      const emergingScores = neighborhoods.map(n => ({
        ...n,
        emergenceScore: this.calculateEmergenceScore(n)
      }))
      
      // Filter and rank emerging neighborhoods
      const emerging = emergingScores
        .filter(n => n.emergenceScore > 0.7)
        .sort((a, b) => b.emergenceScore - a.emergenceScore)
        .slice(0, 10)
      
      // Generate detailed analysis
      const analysis = emerging.map(n => ({
        neighborhood: n.name,
        zipCode: n.zipCode,
        score: n.emergenceScore,
        keyFactors: this.identifyEmergenceFactors(n),
        projectedGrowth: this.projectGrowth(n),
        risks: this.assessEmergenceRisks(n)
      }))
      
      return {
        taskId: task.id,
        agentName: this.name,
        success: true,
        data: {
          emergingNeighborhoods: analysis,
          marketTrends: this.identifyMarketTrends(emergingScores),
          investmentWindows: this.calculateInvestmentWindows(analysis)
        },
        executionTime: 0,
        confidence: 0.82
      }
    } catch (error) {
      throw new Error(`Emerging neighborhoods identification failed: ${error.message}`)
    }
  }

  // Helper methods for data fetching
  private async getHistoricalPrices(zipCode: string, months: number): Promise<PriceTrend[]> {
    // In production, this would query real database
    // For now, generate sample data
    const trends: PriceTrend[] = []
    const basePrice = 400000
    const currentDate = new Date()
    
    for (let i = months; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setMonth(date.getMonth() - i)
      
      const randomVariation = 1 + (Math.random() - 0.5) * 0.1
      const trendFactor = 1 + (months - i) * 0.005 // 0.5% monthly appreciation
      
      trends.push({
        date,
        avgPrice: Math.round(basePrice * trendFactor * randomVariation),
        medianPrice: Math.round(basePrice * trendFactor * randomVariation * 0.95),
        volume: Math.floor(50 + Math.random() * 100),
        pricePerSqft: Math.round(200 * trendFactor * randomVariation)
      })
    }
    
    return trends
  }

  private async getNeighborhoodsData(specific?: string): Promise<any[]> {
    // Mock neighborhood data
    const neighborhoods = [
      { name: 'Montrose', zipCode: '77006', avgPrice: 550000, growth: 0.08 },
      { name: 'Heights', zipCode: '77008', avgPrice: 650000, growth: 0.12 },
      { name: 'EaDo', zipCode: '77003', avgPrice: 450000, growth: 0.15 },
      { name: 'River Oaks', zipCode: '77019', avgPrice: 2500000, growth: 0.05 },
      { name: 'Midtown', zipCode: '77004', avgPrice: 480000, growth: 0.10 }
    ]
    
    return specific 
      ? neighborhoods.filter(n => n.name === specific || n.zipCode === specific)
      : neighborhoods
  }

  private async getConstructionData(zipCode: string): Promise<any[]> {
    // Mock construction data
    return [
      { date: new Date('2024-01-01'), permits: 15, type: 'residential' },
      { date: new Date('2024-02-01'), permits: 22, type: 'commercial' },
      { date: new Date('2024-03-01'), permits: 18, type: 'residential' },
      { date: new Date('2024-04-01'), permits: 25, type: 'mixed' }
    ]
  }

  // Calculation methods
  private calculateTrendMetrics(data: PriceTrend[]): any {
    const prices = data.map(d => d.avgPrice)
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    
    const appreciation = ((lastPrice - firstPrice) / firstPrice) * 100
    const avgMonthlyChange = appreciation / data.length
    const volatility = this.calculateVolatility(prices)
    
    return {
      totalAppreciation: appreciation,
      avgMonthlyChange,
      volatility,
      trend: avgMonthlyChange > 0 ? 'upward' : 'downward',
      momentum: this.calculateMomentum(prices)
    }
  }

  private generatePricePredictions(historical: PriceTrend[], trends: any): PricePrediction[] {
    const predictions: PricePrediction[] = []
    const lastPrice = historical[historical.length - 1].avgPrice
    const monthlyGrowth = trends.avgMonthlyChange / 100
    
    for (let i = 1; i <= 6; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() + i)
      
      const trendPrice = lastPrice * Math.pow(1 + monthlyGrowth, i)
      const seasonalFactor = this.getSeasonalFactor(date.getMonth())
      const marketFactor = 1 + (Math.random() - 0.5) * 0.02
      
      predictions.push({
        month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        predictedPrice: Math.round(trendPrice * seasonalFactor * marketFactor),
        confidence: Math.max(0.95 - i * 0.05, 0.7),
        factors: this.identifyPriceFactors(trends, i)
      })
    }
    
    return predictions
  }

  private async scoreNeighborhood(neighborhood: any): Promise<NeighborhoodScore> {
    // Calculate various metrics
    const appreciation = neighborhood.growth * 100
    const demandScore = Math.min(100, 50 + Math.random() * 50)
    const supplyScore = Math.min(100, 40 + Math.random() * 40)
    const constructionActivity = Math.floor(Math.random() * 30)
    const rentalYield = 4 + Math.random() * 4
    const marketVelocity = 60 + Math.random() * 40
    
    // Calculate composite investment score
    const investmentScore = (
      appreciation * 0.25 +
      demandScore * 0.20 +
      (100 - supplyScore) * 0.15 +
      constructionActivity * 0.15 +
      rentalYield * 5 * 0.15 +
      marketVelocity * 0.10
    )
    
    return {
      zipCode: neighborhood.zipCode,
      neighborhood: neighborhood.name,
      investmentScore: Math.round(investmentScore),
      metrics: {
        appreciation,
        demandScore,
        supplyScore,
        constructionActivity,
        rentalYield,
        marketVelocity
      },
      trend: appreciation > 10 ? 'rising' : appreciation > 5 ? 'stable' : 'declining'
    }
  }

  private calculatePropertyROI(marketData: any, params: any): ROICalculation {
    const purchasePrice = marketData.avgPrice
    const monthlyRent = marketData.avgRent || purchasePrice * 0.007
    
    const expenses = {
      mortgage: purchasePrice * 0.8 * 0.06 / 12, // 80% LTV at 6% interest
      taxes: purchasePrice * 0.02 / 12,
      insurance: purchasePrice * 0.005 / 12,
      maintenance: monthlyRent * 0.1,
      hoa: params.includeHOA ? 200 : 0
    }
    
    const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0)
    const cashFlow = monthlyRent - totalExpenses
    const capRate = (cashFlow * 12) / purchasePrice * 100
    const cashOnCashReturn = (cashFlow * 12) / (purchasePrice * 0.2) * 100 // 20% down
    
    return {
      propertyType: marketData.type,
      zipCode: marketData.zipCode,
      purchasePrice,
      monthlyRent,
      expenses,
      metrics: {
        cashFlow,
        capRate,
        cashOnCashReturn,
        totalROI: cashOnCashReturn + marketData.appreciation,
        breakEvenYears: purchasePrice / (cashFlow * 12)
      }
    }
  }

  // Utility methods
  private calculateVolatility(prices: number[]): number {
    const returns = []
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1])
    }
    
    const avg = returns.reduce((a, b) => a + b, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / returns.length
    
    return Math.sqrt(variance) * 100
  }

  private calculateMomentum(prices: number[]): number {
    const recentPrices = prices.slice(-3)
    const olderPrices = prices.slice(-6, -3)
    
    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length
    
    return ((recentAvg - olderAvg) / olderAvg) * 100
  }

  private getSeasonalFactor(month: number): number {
    // Houston real estate seasonality
    const factors = [0.95, 0.96, 1.02, 1.05, 1.08, 1.06, 1.03, 1.01, 0.98, 0.97, 0.95, 0.94]
    return factors[month]
  }

  private identifyPriceFactors(trends: any, monthsAhead: number): string[] {
    const factors = []
    
    if (trends.avgMonthlyChange > 0.5) factors.push('Strong appreciation trend')
    if (trends.volatility < 5) factors.push('Stable market conditions')
    if (trends.momentum > 2) factors.push('Positive momentum')
    if (monthsAhead <= 3) factors.push('Near-term forecast')
    
    return factors
  }

  private identifyMarketPatterns(data: PriceTrend[]): any {
    return {
      seasonality: 'Spring peak (March-June)',
      cyclePhase: 'Growth phase',
      volatilityPattern: 'Low volatility',
      volumePattern: 'Increasing transaction volume'
    }
  }

  private generateTrendSummary(trends: any, predictions: PricePrediction[]): string {
    const avgPredictedGrowth = predictions.length > 0
      ? ((predictions[predictions.length - 1].predictedPrice - predictions[0].predictedPrice) / predictions[0].predictedPrice) * 100
      : 0
      
    return `Market showing ${trends.trend} trend with ${trends.totalAppreciation.toFixed(1)}% appreciation. ` +
           `Predicted ${avgPredictedGrowth.toFixed(1)}% growth over next 6 months. ` +
           `${trends.volatility < 5 ? 'Low' : trends.volatility < 10 ? 'Moderate' : 'High'} volatility market.`
  }

  private identifyInvestmentOpportunities(scores: NeighborhoodScore[]): any[] {
    return scores.slice(0, 5).map(score => ({
      neighborhood: score.neighborhood,
      zipCode: score.zipCode,
      opportunity: this.classifyOpportunity(score),
      keyStrengths: this.identifyStrengths(score.metrics),
      investmentThesis: this.generateInvestmentThesis(score)
    }))
  }

  private classifyOpportunity(score: NeighborhoodScore): string {
    if (score.metrics.appreciation > 12 && score.metrics.demandScore > 80) {
      return 'Hot Market - Act Fast'
    } else if (score.metrics.rentalYield > 6 && score.metrics.appreciation > 8) {
      return 'Cash Flow + Appreciation'
    } else if (score.metrics.constructionActivity > 20) {
      return 'Emerging Development Zone'
    } else if (score.metrics.marketVelocity > 90) {
      return 'High Liquidity Market'
    }
    return 'Balanced Investment'
  }

  private identifyStrengths(metrics: any): string[] {
    const strengths = []
    
    if (metrics.appreciation > 10) strengths.push('Strong appreciation')
    if (metrics.demandScore > 80) strengths.push('High demand')
    if (metrics.supplyScore < 40) strengths.push('Limited supply')
    if (metrics.rentalYield > 6) strengths.push('Excellent rental yields')
    if (metrics.marketVelocity > 85) strengths.push('Quick sales')
    
    return strengths
  }

  private generateInvestmentThesis(score: NeighborhoodScore): string {
    const { metrics } = score
    
    if (metrics.appreciation > 15) {
      return `Rapid appreciation market with ${metrics.appreciation}% annual growth. Ideal for short-term gains.`
    } else if (metrics.rentalYield > 7) {
      return `Strong rental market with ${metrics.rentalYield.toFixed(1)}% yields. Perfect for buy-and-hold investors.`
    } else if (metrics.constructionActivity > 25) {
      return `Major development area with ${metrics.constructionActivity} new projects. Long-term growth potential.`
    }
    
    return `Balanced market offering ${metrics.appreciation}% appreciation and ${metrics.rentalYield.toFixed(1)}% rental yields.`
  }

  private generateMarketInsights(scores: NeighborhoodScore[]): any {
    const avgAppreciation = scores.reduce((sum, s) => sum + s.metrics.appreciation, 0) / scores.length
    const topPerformers = scores.filter(s => s.metrics.appreciation > avgAppreciation * 1.2)
    
    return {
      marketOverview: `Houston market averaging ${avgAppreciation.toFixed(1)}% appreciation`,
      topPerformers: topPerformers.length,
      emergingTrends: [
        'Inner-loop neighborhoods outperforming',
        'New construction driving price growth',
        'Strong rental demand in urban cores'
      ],
      riskFactors: [
        'Interest rate sensitivity',
        'Energy sector employment',
        'Property tax increases'
      ]
    }
  }

  private calculateConstructionCorrelations(construction: any[], prices: PriceTrend[]): ConstructionCorrelation[] {
    // Simple correlation calculation
    return [{
      zipCode: '77006',
      correlationScore: 0.75,
      priceImpact: 8.5,
      constructionProjects: construction.length,
      avgPriceChange: 12000,
      timelag: 6
    }]
  }

  private analyzeConstructionImpact(correlations: ConstructionCorrelation[]): any {
    return {
      strongestCorrelation: correlations[0],
      impactSummary: 'New construction typically leads to 8-12% price appreciation within 6-12 months',
      optimalEntryTime: '3-6 months after construction announcement',
      riskMitigation: 'Diversify across multiple development zones'
    }
  }

  private generateConstructionRecommendations(impact: any): string[] {
    return [
      'Monitor permit filings for early investment opportunities',
      'Focus on areas with 10-20 permits per quarter for optimal growth',
      'Avoid oversaturated markets with 50+ permits',
      'Consider properties 0.5-1 mile from major developments'
    ]
  }

  private async getHeatMapData(metric: string): Promise<any[]> {
    // Mock heat map data for Houston zip codes
    const houstonZipCodes = [
      { zipCode: '77001', latitude: 29.7604, longitude: -95.3698, value: 350000 },
      { zipCode: '77002', latitude: 29.7589, longitude: -95.3677, value: 425000 },
      { zipCode: '77003', latitude: 29.7489, longitude: -95.3477, value: 380000 },
      { zipCode: '77004', latitude: 29.7289, longitude: -95.3777, value: 450000 },
      { zipCode: '77005', latitude: 29.7189, longitude: -95.4177, value: 850000 },
      { zipCode: '77006', latitude: 29.7389, longitude: -95.3977, value: 550000 }
    ]
    
    return houstonZipCodes.map(zip => ({
      ...zip,
      value: metric === 'price' ? zip.value : 
             metric === 'volume' ? Math.floor(Math.random() * 100) :
             metric === 'appreciation' ? 5 + Math.random() * 10 :
             Math.floor(Math.random() * 30)
    }))
  }

  private calculateIntensity(value: number, allValues: any[]): number {
    const values = allValues.map(v => v.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    
    return (value - min) / (max - min)
  }

  private identifyHotSpots(heatMap: MarketHeatMap[]): any[] {
    return heatMap
      .filter(point => point.intensity > 0.8)
      .map(point => ({
        zipCode: point.zipCode,
        metric: point.metric,
        value: point.value,
        description: `High ${point.metric} activity zone`
      }))
  }

  private calculateHeatMapStats(heatMap: MarketHeatMap[]): any {
    const values = heatMap.map(h => h.value)
    
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      hotSpots: heatMap.filter(h => h.intensity > 0.8).length,
      coldSpots: heatMap.filter(h => h.intensity < 0.2).length
    }
  }

  private async getMarketDataByType(propertyType: string, zipCode: string): Promise<any> {
    // Mock market data by property type
    const data = {
      'single-family': { avgPrice: 450000, avgRent: 2800, appreciation: 8 },
      'condo': { avgPrice: 280000, avgRent: 1800, appreciation: 6 },
      'townhouse': { avgPrice: 350000, avgRent: 2200, appreciation: 7 },
      'multi-family': { avgPrice: 850000, avgRent: 5500, appreciation: 9 }
    }
    
    return {
      type: propertyType,
      zipCode,
      ...(data[propertyType] || data['single-family'])
    }
  }

  private getConservativeParams(): any {
    return {
      vacancy: 0.10,
      maintenanceRate: 0.15,
      appreciationRate: 0.04,
      includeHOA: true
    }
  }

  private getModerateParams(): any {
    return {
      vacancy: 0.05,
      maintenanceRate: 0.10,
      appreciationRate: 0.06,
      includeHOA: true
    }
  }

  private getAggressiveParams(): any {
    return {
      vacancy: 0.02,
      maintenanceRate: 0.05,
      appreciationRate: 0.08,
      includeHOA: false
    }
  }

  private generateROIRecommendations(calculations: any[]): string[] {
    const bestROI = Math.max(...calculations.map(c => c.roi.metrics.totalROI))
    
    return [
      `Best case scenario yields ${bestROI.toFixed(1)}% total ROI`,
      'Consider 20-25% down payment for optimal cash-on-cash returns',
      'Factor in 5-10% for unexpected expenses',
      'Review comparable rental rates monthly'
    ]
  }

  private compareToMarketAverages(calculations: any[]): any {
    return {
      marketAvgROI: 12,
      yourBestROI: Math.max(...calculations.map(c => c.roi.metrics.totalROI)),
      marketAvgCapRate: 6,
      yourBestCapRate: Math.max(...calculations.map(c => c.roi.metrics.capRate)),
      recommendation: 'Above market average returns expected'
    }
  }

  private async getNeighborhoodGrowthMetrics(): Promise<any[]> {
    // Mock growth metrics
    return [
      { name: 'EaDo', zipCode: '77003', priceGrowth: 15, permitGrowth: 45, populationGrowth: 8 },
      { name: 'Third Ward', zipCode: '77004', priceGrowth: 12, permitGrowth: 38, populationGrowth: 6 },
      { name: 'Acres Homes', zipCode: '77088', priceGrowth: 18, permitGrowth: 52, populationGrowth: 10 }
    ]
  }

  private calculateEmergenceScore(metrics: any): number {
    return (
      metrics.priceGrowth * 0.3 +
      metrics.permitGrowth * 0.4 +
      metrics.populationGrowth * 0.3
    ) / 30 // Normalize to 0-1
  }

  private identifyEmergenceFactors(neighborhood: any): string[] {
    const factors = []
    
    if (neighborhood.priceGrowth > 15) factors.push('Rapid price appreciation')
    if (neighborhood.permitGrowth > 40) factors.push('High development activity')
    if (neighborhood.populationGrowth > 7) factors.push('Growing population')
    
    return factors
  }

  private projectGrowth(neighborhood: any): any {
    return {
      oneYear: neighborhood.priceGrowth * 1.1,
      threeYear: neighborhood.priceGrowth * 2.5,
      fiveYear: neighborhood.priceGrowth * 4.2
    }
  }

  private assessEmergenceRisks(neighborhood: any): string[] {
    const risks = []
    
    if (neighborhood.permitGrowth > 60) risks.push('Potential oversupply')
    if (neighborhood.priceGrowth > 20) risks.push('Possible price correction')
    if (neighborhood.populationGrowth < 5) risks.push('Limited demand growth')
    
    return risks
  }

  private identifyMarketTrends(scores: any[]): string[] {
    return [
      'East Houston showing strongest emergence signals',
      'Transit corridor neighborhoods gaining momentum',
      'Historic districts seeing renewed interest',
      'Suburban fringe markets stabilizing'
    ]
  }

  private calculateInvestmentWindows(analysis: any[]): any[] {
    return analysis.map(a => ({
      neighborhood: a.neighborhood,
      optimalEntry: 'Next 3-6 months',
      expectedDuration: '2-3 years',
      exitStrategy: a.score > 0.85 ? 'Quick flip potential' : 'Buy and hold recommended'
    }))
  }
}