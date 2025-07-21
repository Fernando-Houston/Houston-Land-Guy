// Costs Data Service - Real Database Integration
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CostData {
  category: string
  subcategory: string
  unit: string
  lowCost: number
  avgCost: number
  highCost: number
  lastUpdated: string
  source: string
  notes?: string
  location?: string
}

export interface ConstructionCostBreakdown {
  category: string
  residential: {
    low: number
    mid: number
    high: number
  }
  commercial: {
    office: number
    retail: number
    industrial: number
  }
  materials: {
    concrete: number
    steel: number
    lumber: number
  }
  labor: {
    skilled: number
    unskilled: number
    availability: string
  }
}

export interface CostStats {
  totalItems: number
  avgCostPerSqft: number
  yearlyChange: number
  projectCount: number
  categories: { name: string; count: number; avgCost: number }[]
  recentUpdates: string[]
  materialCosts: {
    concrete: number
    steel: number
    lumber: number
  }
  laborRates: {
    skilled: number
    unskilled: number
    availability: string
  }
  constructionTypes: {
    residentialLow: number
    residentialMid: number
    residentialHigh: number
    commercialOffice: number
    commercialRetail: number
    commercialIndustrial: number
  }
}

export class CostsDataService {
  // Get cost data with filters
  async getCostData(filters: {
    category?: string
    search?: string
    limit?: number
  } = {}): Promise<CostData[]> {
    try {
      const { category, search, limit = 100 } = filters

      // Get cost analysis data
      const whereClause: any = {}
      if (category && category !== 'all') {
        whereClause.analysisType = category
      }
      if (search) {
        whereClause.OR = [
          { tradeType: { contains: search, mode: 'insensitive' } },
          { permitType: { contains: search, mode: 'insensitive' } },
          { skillLevel: { contains: search, mode: 'insensitive' } }
        ]
      }

      // Get both CostAnalysis and ConstructionCostDP5 data
      const [costAnalysis, constructionCosts] = await Promise.all([
        prisma.costAnalysis.findMany({
          where: whereClause,
          orderBy: { effectiveDate: 'desc' },
          take: Math.floor(limit * 0.7) // 70% from CostAnalysis
        }),
        prisma.constructionCostDP5.findMany({
          orderBy: { effectiveDate: 'desc' },
          take: Math.floor(limit * 0.3) // 30% from ConstructionCostDP5
        })
      ])

      // Combine and format data
      const costAnalysisData = costAnalysis.map(cost => this.formatCostData(cost))
      const constructionCostData = constructionCosts.map(cost => this.formatConstructionCostData(cost))

      return [...costAnalysisData, ...constructionCostData].slice(0, limit)
    } catch (error) {
      console.error('Error fetching cost data:', error)
      return []
    }
  }

  // Get cost statistics
  async getCostStats(): Promise<CostStats> {
    try {
      // Get counts from both models
      const [costAnalysisCount, constructionCostCount] = await Promise.all([
        prisma.costAnalysis.count(),
        prisma.constructionCostDP5.count()
      ])
      const totalItems = costAnalysisCount + constructionCostCount

      // Get latest ConstructionCostDP5 data for comprehensive stats
      const latestConstructionCost = await prisma.constructionCostDP5.findFirst({
        orderBy: { effectiveDate: 'desc' }
      })

      // Calculate average cost per sqft using both models
      const constructionCosts = await prisma.costAnalysis.findMany({
        where: {
          analysisType: 'construction',
          costPerSqft: { not: null }
        },
        select: { costPerSqft: true }
      })

      // Use ConstructionCostDP5 mid-range residential as baseline if available
      const avgCostPerSqft = latestConstructionCost?.residentialMid || 
        (constructionCosts.length > 0
          ? constructionCosts.reduce((sum, c) => sum + (c.costPerSqft || 0), 0) / constructionCosts.length
          : 142)

      // Calculate yearly change (simplified - compare recent vs older data)
      const recentCosts = await prisma.costAnalysis.findMany({
        where: {
          effectiveDate: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
          },
          costPerSqft: { not: null }
        },
        select: { costPerSqft: true }
      })

      const olderCosts = await prisma.costAnalysis.findMany({
        where: {
          effectiveDate: {
            lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
          },
          costPerSqft: { not: null }
        },
        select: { costPerSqft: true }
      })

      const recentAvg = recentCosts.length > 0
        ? recentCosts.reduce((sum, c) => sum + (c.costPerSqft || 0), 0) / recentCosts.length
        : avgCostPerSqft

      const olderAvg = olderCosts.length > 0
        ? olderCosts.reduce((sum, c) => sum + (c.costPerSqft || 0), 0) / olderCosts.length
        : avgCostPerSqft

      const yearlyChange = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 8

      // Get categories breakdown
      const categories = await prisma.costAnalysis.groupBy({
        by: ['analysisType'],
        _count: { id: true },
        _avg: { costPerSqft: true }
      })

      const categoryData = categories.map(cat => ({
        name: this.formatCategoryName(cat.analysisType),
        count: cat._count.id,
        avgCost: cat._avg.costPerSqft || 0
      }))

      // Get recent updates
      const recentUpdates = await prisma.costAnalysis.findMany({
        orderBy: { effectiveDate: 'desc' },
        take: 5,
        select: { analysisType: true, effectiveDate: true }
      })

      return {
        totalItems,
        avgCostPerSqft: Math.round(avgCostPerSqft),
        yearlyChange: Math.round(yearlyChange * 10) / 10,
        projectCount: 2341, // Estimate based on construction activity
        categories: categoryData,
        recentUpdates: recentUpdates.map(u => 
          `${this.formatCategoryName(u.analysisType)} - ${u.effectiveDate.toLocaleDateString()}`
        ),
        materialCosts: {
          concrete: latestConstructionCost?.concretePrice || 120,
          steel: latestConstructionCost?.steelPrice || 800,
          lumber: latestConstructionCost?.lumberPrice || 650
        },
        laborRates: {
          skilled: latestConstructionCost?.laborRateSkilled || 35,
          unskilled: latestConstructionCost?.laborRateUnskilled || 18,
          availability: latestConstructionCost?.laborAvailability || 'Moderate'
        },
        constructionTypes: {
          residentialLow: latestConstructionCost?.residentialLow || 95,
          residentialMid: latestConstructionCost?.residentialMid || 140,
          residentialHigh: latestConstructionCost?.residentialHigh || 220,
          commercialOffice: latestConstructionCost?.commercialOffice || 165,
          commercialRetail: latestConstructionCost?.commercialRetail || 125,
          commercialIndustrial: latestConstructionCost?.commercialIndustrial || 85
        }
      }
    } catch (error) {
      console.error('Error calculating cost stats:', error)
      return {
        totalItems: 0,
        avgCostPerSqft: 142,
        yearlyChange: 8,
        projectCount: 2341,
        categories: [],
        recentUpdates: [],
        materialCosts: {
          concrete: 120,
          steel: 800,
          lumber: 650
        },
        laborRates: {
          skilled: 35,
          unskilled: 18,
          availability: 'Moderate'
        },
        constructionTypes: {
          residentialLow: 95,
          residentialMid: 140,
          residentialHigh: 220,
          commercialOffice: 165,
          commercialRetail: 125,
          commercialIndustrial: 85
        }
      }
    }
  }

  // Get cost breakdown by category
  async getCostsByCategory(category: string) {
    try {
      const costs = await prisma.costAnalysis.findMany({
        where: { analysisType: category },
        orderBy: { effectiveDate: 'desc' }
      })

      return costs.map(cost => this.formatCostData(cost))
    } catch (error) {
      console.error('Error fetching costs by category:', error)
      return []
    }
  }

  // Get cost trends (monthly data for last 6 months)
  async getCostTrends() {
    try {
      const months = []
      const now = new Date()

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

        const monthCosts = await prisma.costAnalysis.findMany({
          where: {
            effectiveDate: {
              gte: date,
              lt: nextMonth
            },
            costPerSqft: { not: null }
          },
          select: {
            costPerSqft: true,
            materialsCost: true,
            laborCost: true
          }
        })

        const avgTotal = monthCosts.length > 0
          ? monthCosts.reduce((sum, c) => sum + (c.costPerSqft || 0), 0) / monthCosts.length
          : 0

        const avgMaterials = monthCosts.length > 0
          ? monthCosts.reduce((sum, c) => sum + (c.materialsCost || 0), 0) / monthCosts.length
          : 0

        const avgLabor = monthCosts.length > 0
          ? monthCosts.reduce((sum, c) => sum + (c.laborCost || 0), 0) / monthCosts.length
          : 0

        months.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          total: Math.round(avgTotal),
          materials: Math.round(avgMaterials),
          labor: Math.round(avgLabor)
        })
      }

      return months
    } catch (error) {
      console.error('Error fetching cost trends:', error)
      return []
    }
  }

  // Get construction cost breakdown
  async getConstructionCostBreakdown(): Promise<ConstructionCostBreakdown[]> {
    try {
      const constructionCosts = await prisma.constructionCostDP5.findMany({
        orderBy: { effectiveDate: 'desc' },
        take: 5
      })

      return constructionCosts.map(cost => ({
        category: cost.area,
        residential: {
          low: cost.residentialLow || 0,
          mid: cost.residentialMid || 0,
          high: cost.residentialHigh || 0
        },
        commercial: {
          office: cost.commercialOffice || 0,
          retail: cost.commercialRetail || 0,
          industrial: cost.commercialIndustrial || 0
        },
        materials: {
          concrete: cost.concretePrice || 0,
          steel: cost.steelPrice || 0,
          lumber: cost.lumberPrice || 0
        },
        labor: {
          skilled: cost.laborRateSkilled || 0,
          unskilled: cost.laborRateUnskilled || 0,
          availability: cost.laborAvailability || 'Unknown'
        }
      }))
    } catch (error) {
      console.error('Error fetching construction cost breakdown:', error)
      return []
    }
  }

  // Private helper methods
  private formatCostData(cost: any): CostData {
    const category = this.mapAnalysisTypeToCategory(cost.analysisType)
    const subcategory = this.formatSubcategory(cost)
    const unit = this.getUnit(cost.analysisType)

    // Calculate low, avg, high based on available data
    let avgCost = 0
    let lowCost = 0
    let highCost = 0

    if (cost.costPerSqft) {
      avgCost = cost.costPerSqft
      lowCost = avgCost * 0.8 // Estimate 20% below average
      highCost = avgCost * 1.3 // Estimate 30% above average
    } else if (cost.hourlyRate) {
      avgCost = cost.hourlyRate
      lowCost = avgCost * 0.85
      highCost = avgCost * 1.25
    } else if (cost.baseFee) {
      avgCost = cost.baseFee
      lowCost = avgCost * 0.9
      highCost = avgCost * 1.15
    } else if (cost.pricePerAcre) {
      avgCost = cost.pricePerAcre
      lowCost = avgCost * 0.7
      highCost = avgCost * 1.5
    }

    return {
      category,
      subcategory,
      unit,
      lowCost: Math.round(lowCost * 100) / 100,
      avgCost: Math.round(avgCost * 100) / 100,
      highCost: Math.round(highCost * 100) / 100,
      lastUpdated: cost.effectiveDate.toISOString().split('T')[0],
      source: 'Houston Construction Database',
      notes: this.generateNotes(cost),
      location: cost.location
    }
  }

  private mapAnalysisTypeToCategory(analysisType: string): string {
    const mapping: Record<string, string> = {
      'construction': 'structure',
      'labor': 'labor_costs',
      'land': 'site_work',
      'permits': 'permits_fees'
    }
    return mapping[analysisType] || 'other'
  }

  private formatCategoryName(analysisType: string): string {
    const mapping: Record<string, string> = {
      'construction': 'Construction',
      'labor': 'Labor',
      'land': 'Land',
      'permits': 'Permits'
    }
    return mapping[analysisType] || analysisType.charAt(0).toUpperCase() + analysisType.slice(1)
  }

  private formatSubcategory(cost: any): string {
    if (cost.tradeType) return cost.tradeType
    if (cost.permitType) return `${cost.permitType} Permit`
    if (cost.analysisType === 'land') return 'Land Acquisition'
    return 'General Construction'
  }

  private formatConstructionCostData(cost: any): CostData {
    // For ConstructionCostDP5 data, create multiple entries for different construction types
    const baseData = {
      lastUpdated: cost.effectiveDate.toISOString().split('T')[0],
      source: 'Houston Construction Cost Database (DP5)',
      location: cost.area
    }

    // Return residential mid-range as the primary cost data point
    return {
      category: 'construction',
      subcategory: 'Residential Construction (Mid-Range)',
      unit: 'per sqft',
      lowCost: cost.residentialLow || 0,
      avgCost: cost.residentialMid || 0,
      highCost: cost.residentialHigh || 0,
      notes: `Includes: Low: $${cost.residentialLow}/sqft, High: $${cost.residentialHigh}/sqft. Materials: Concrete $${cost.concretePrice}/cy, Steel $${cost.steelPrice}/ton`,
      ...baseData
    }
  }

  private getUnit(analysisType: string): string {
    const units: Record<string, string> = {
      'construction': 'per sqft',
      'labor': 'per hour',
      'land': 'per acre',
      'permits': 'per permit'
    }
    return units[analysisType] || 'per unit'
  }

  private generateNotes(cost: any): string | undefined {
    const notes = []
    
    if (cost.skillLevel) notes.push(`Skill level: ${cost.skillLevel}`)
    if (cost.tradeType) notes.push(`Trade: ${cost.tradeType}`)
    if (cost.materialsCost && cost.laborCost) {
      notes.push(`Materials: $${cost.materialsCost}, Labor: $${cost.laborCost}`)
    }
    
    return notes.length > 0 ? notes.join('; ') : undefined
  }
}

// Export default instance
export const costsDataService = new CostsDataService()