// Enhanced Fernando-X Data Query Service
// Integrates all new data sources from Data Process 5 and HCAD
import { PrismaClient } from '@prisma/client'
import { hcadApi } from '../services/hcad-api-service'

const prisma = new PrismaClient()

export class EnhancedDataQueryService {
  // Get comprehensive area analysis combining all data sources
  async getComprehensiveAreaAnalysis(area: string) {
    const [
      demographics,
      rentalMarket,
      strMarket,
      income,
      employers,
      education,
      hcadStats,
      marketMetrics,
      construction
    ] = await Promise.all([
      this.getAreaDemographics(area),
      this.getRentalMarketData(area),
      this.getSTRMarketData(area),
      this.getIncomeData(area),
      this.getTopEmployers(area),
      this.getEducationMetrics(area),
      this.getHCADStats(area),
      this.getMarketMetrics(area),
      this.getConstructionActivity(area)
    ])
    
    return {
      area,
      demographics,
      rentalMarket,
      strMarket,
      income,
      employers,
      education,
      propertyData: hcadStats,
      marketMetrics,
      construction,
      investmentScore: this.calculateAreaScore({
        demographics,
        rentalMarket,
        income,
        education,
        marketMetrics
      })
    }
  }

  // Demographics queries
  async getAreaDemographics(area: string) {
    // Try ZIP code first, then neighborhood
    const demographics = await prisma.areaDemographics.findFirst({
      where: {
        OR: [
          { zipCode: area },
          { neighborhood: { contains: area, mode: 'insensitive' } }
        ],
        reportYear: 2025
      }
    })
    
    if (!demographics) return null
    
    return {
      population: demographics.totalPopulation,
      medianAge: demographics.medianAge,
      diversity: {
        white: demographics.whiteNonHispanic,
        black: demographics.blackNonHispanic,
        hispanic: demographics.hispanicLatino,
        asian: demographics.asianNonHispanic,
        other: demographics.otherNonHispanic
      },
      foreignBorn: {
        percentage: demographics.foreignBornPct,
        count: demographics.foreignBornCount
      },
      ageDistribution: {
        under18: demographics.under18Pct,
        millennials: demographics.age18to34Pct,
        genX: demographics.age35to54Pct,
        boomers: demographics.age55to74Pct,
        seniors: demographics.over75Pct
      }
    }
  }

  // Rental market data
  async getRentalMarketData(area: string) {
    const rental = await prisma.rentalMarket.findFirst({
      where: {
        OR: [
          { zipCode: area },
          { neighborhood: { contains: area, mode: 'insensitive' } },
          { submarket: { contains: area, mode: 'insensitive' } }
        ]
      },
      orderBy: { reportDate: 'desc' }
    })
    
    if (!rental) return null
    
    return {
      avgRents: {
        studio: rental.avgRentStudio,
        oneBed: rental.avgRent1BR,
        twoBed: rental.avgRent2BR,
        threeBed: rental.avgRent3BR
      },
      occupancy: rental.occupancyRate,
      yearOverYear: rental.yearOverYearGrowth,
      supply: {
        total: rental.totalUnits,
        delivered: rental.deliveredUnits,
        underConstruction: rental.underConstruction
      }
    }
  }

  // Short-term rental market
  async getSTRMarketData(area: string) {
    const str = await prisma.sTRMarket.findFirst({
      where: {
        neighborhood: { contains: area, mode: 'insensitive' }
      },
      orderBy: { reportDate: 'desc' }
    })
    
    if (!str) return null
    
    return {
      tier: str.performanceTier,
      activeListings: str.activeListings,
      avgDailyRate: str.avgDailyRate,
      occupancy: str.occupancyRate,
      annualRevenue: str.annualRevenue,
      avgStayLength: str.avgLengthOfStay
    }
  }

  // Income and wealth data
  async getIncomeData(area: string) {
    const income = await prisma.incomeData.findFirst({
      where: {
        OR: [
          { zipCode: area },
          { neighborhood: { contains: area, mode: 'insensitive' } }
        ],
        reportYear: 2025
      }
    })
    
    if (!income) return null
    
    return {
      median: income.medianIncome,
      average: income.averageIncome,
      perCapita: income.perCapitaIncome,
      distribution: {
        under25k: income.under25k,
        '25to50k': income.income25to50k,
        '50to75k': income.income50to75k,
        '75to100k': income.income75to100k,
        '100to150k': income.income100to150k,
        '150to200k': income.income150to200k,
        over200k: income.over200k
      },
      affordability: {
        medianHomeValue: income.medianHomeValue,
        medianRent: income.medianRent,
        rentBurdened: income.rentBurdenedPct,
        homeownership: income.homeownershipRate
      }
    }
  }

  // Major employers in area
  async getTopEmployers(area: string, limit: number = 10) {
    const employers = await prisma.employer.findMany({
      where: {
        OR: [
          { zipCode: area },
          { headquarters: { contains: area, mode: 'insensitive' } }
        ]
      },
      orderBy: { employeeCount: 'desc' },
      take: limit
    })
    
    return employers.map(emp => ({
      name: emp.companyName,
      sector: emp.sector,
      employees: emp.employeeCount,
      growth: emp.employeeGrowth,
      avgSalary: emp.avgSalary,
      economicImpact: emp.economicImpact
    }))
  }

  // Education quality metrics
  async getEducationMetrics(area: string) {
    // For now, return HISD data for all Houston areas
    const education = await prisma.educationMetrics.findFirst({
      where: { districtName: 'Houston ISD' },
      orderBy: { reportYear: 'desc' }
    })
    
    if (!education) return null
    
    return {
      district: education.districtName,
      rating: education.overallRating,
      schools: {
        total: education.totalSchools,
        aRated: education.aRatedSchools,
        improvement: `${education.aRatedSchools} A-rated schools (up from 93 in 2023)`
      },
      outcomes: {
        graduationRate: education.graduationRate,
        collegeReady: education.collegeReadiness,
        dropoutRate: education.dropoutRate
      }
    }
  }

  // HCAD property statistics
  async getHCADStats(area: string) {
    // Check if area is a ZIP code
    const isZipCode = /^\d{5}$/.test(area)
    
    if (isZipCode) {
      return await hcadApi.getAreaStats(area)
    }
    
    // For neighborhoods, we'd need to map to ZIP codes
    return null
  }

  // Population projections
  async getPopulationProjections(area: string) {
    const projection = await prisma.populationProjection.findFirst({
      where: {
        geographyName: { contains: area, mode: 'insensitive' }
      }
    })
    
    if (!projection) return null
    
    return {
      current: projection.basePopulation,
      projected2025: projection.year2025,
      projected2030: projection.year2030,
      annualGrowth: projection.annualGrowthRate,
      totalGrowthPct: projection.totalGrowthPct
    }
  }

  // Migration patterns
  async getMigrationData(area: string = 'Harris County') {
    const migration = await prisma.migrationData.findFirst({
      where: {
        geographyName: { contains: area, mode: 'insensitive' }
      },
      orderBy: { year: 'desc' }
    })
    
    if (!migration) return null
    
    return {
      netMigration: migration.netMigration,
      domestic: migration.netDomestic,
      international: migration.netInternational,
      inflow: migration.totalInMigration,
      outflow: migration.totalOutMigration
    }
  }

  // Economic indicators
  async getEconomicIndicators() {
    const indicators = await prisma.economicIndicator.findMany({
      orderBy: { reportDate: 'desc' },
      take: 10
    })
    
    return indicators.map(ind => ({
      name: ind.indicatorName,
      value: ind.currentValue,
      change: ind.yearOverYear,
      unit: ind.unit,
      category: ind.category
    }))
  }

  // Construction costs
  async getConstructionCosts() {
    const costs = await prisma.constructionCost.findFirst({
      orderBy: { reportDate: 'desc' }
    })
    
    if (!costs) return null
    
    return {
      residential: {
        low: costs.residentialLow,
        mid: costs.residentialMid,
        high: costs.residentialHigh
      },
      commercial: {
        office: costs.commercialOffice,
        retail: costs.commercialRetail,
        industrial: costs.industrial
      },
      indices: {
        overall: costs.overallIndex,
        materials: costs.materialsIndex,
        labor: costs.laborIndex
      },
      yearOverYear: {
        overall: costs.overallYoY,
        materials: costs.materialsYoY,
        labor: costs.laborYoY
      }
    }
  }

  // Get market metrics from existing tables
  async getMarketMetrics(area: string) {
    const metrics = await prisma.marketMetrics.findFirst({
      where: {
        areaName: { contains: area, mode: 'insensitive' }
      },
      orderBy: { startDate: 'desc' }
    })
    
    return metrics
  }

  // Get construction activity
  async getConstructionActivity(area: string) {
    const activity = await prisma.areaConstructionActivity.findFirst({
      where: {
        neighborhood: { contains: area, mode: 'insensitive' }
      },
      orderBy: { year: 'desc' }
    })
    
    return activity
  }

  // Calculate investment score based on multiple factors
  private calculateAreaScore(data: any): number {
    let score = 50 // Base score
    
    // Demographics factors
    if (data.demographics) {
      if (data.demographics.foreignBorn?.percentage > 20) score += 5 // Diversity
      if (data.demographics.medianAge < 35) score += 5 // Young population
    }
    
    // Rental market factors
    if (data.rentalMarket) {
      if (data.rentalMarket.occupancy > 95) score += 10
      if (data.rentalMarket.yearOverYear > 5) score += 10
    }
    
    // Income factors
    if (data.income) {
      if (data.income.median > 75000) score += 10
      if (data.income.affordability?.homeownership > 60) score += 5
    }
    
    // Education factors
    if (data.education?.rating === 'A' || data.education?.rating === 'B') {
      score += 10
    }
    
    // Market metrics
    if (data.marketMetrics) {
      if (data.marketMetrics.medianPriceChange > 5) score += 10
      if (data.marketMetrics.avgDaysOnMarket < 30) score += 5
    }
    
    return Math.min(100, Math.max(0, score))
  }

  // Search for investment opportunities
  async findInvestmentOpportunities(criteria: {
    maxPrice?: number
    minRentYield?: number
    targetArea?: string
  }) {
    const opportunities = []
    
    // Find areas with good rental yields
    if (criteria.minRentYield) {
      const rentals = await prisma.rentalMarket.findMany({
        where: {
          yearOverYearGrowth: { gte: criteria.minRentYield }
        },
        orderBy: { yearOverYearGrowth: 'desc' },
        take: 10
      })
      
      for (const rental of rentals) {
        const income = await this.getIncomeData(rental.zipCode || rental.neighborhood || '')
        
        if (income?.affordability?.medianHomeValue) {
          const annualRent = (rental.avgRent2BR || 0) * 12
          const grossYield = (annualRent / income.affordability.medianHomeValue) * 100
          
          opportunities.push({
            type: 'rental',
            location: rental.neighborhood || rental.zipCode,
            medianPrice: income.affordability.medianHomeValue,
            monthlyRent: rental.avgRent2BR,
            grossYield,
            occupancy: rental.occupancyRate,
            appreciation: rental.yearOverYearGrowth
          })
        }
      }
    }
    
    // Find distressed properties from HCAD
    if (criteria.maxPrice) {
      const distressed = await hcadApi.findDistressedProperties({
        maxValue: criteria.maxPrice,
        zipCode: criteria.targetArea
      })
      
      for (const prop of distressed.slice(0, 5)) {
        opportunities.push({
          type: 'distressed',
          accountNumber: prop.accountNumber,
          address: prop.siteAddress,
          currentValue: prop.totalMarketValue,
          landValue: prop.landValue,
          improvementValue: prop.improvementValue,
          yearBuilt: prop.yearBuilt,
          potential: 'fix-and-flip or redevelopment'
        })
      }
    }
    
    return opportunities
  }
}

export const enhancedDataQuery = new EnhancedDataQueryService()