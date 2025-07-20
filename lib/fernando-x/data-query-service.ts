// Fernando-X Real Database Query Service
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class FernandoXDataQueryService {
  // Query properties with advanced filters
  async queryProperties(filters: {
    priceMin?: number
    priceMax?: number
    propertyType?: string
    neighborhood?: string
    status?: string
    bedrooms?: number
    bathrooms?: number
    sqftMin?: number
    sqftMax?: number
    yearBuiltMin?: number
    limit?: number
  }) {
    const where: any = {}
    
    if (filters.priceMin || filters.priceMax) {
      where.OR = [
        {
          listPrice: {
            gte: filters.priceMin,
            lte: filters.priceMax
          }
        },
        {
          soldPrice: {
            gte: filters.priceMin,
            lte: filters.priceMax
          }
        }
      ]
    }
    
    if (filters.propertyType) where.propertyType = filters.propertyType
    if (filters.neighborhood) where.neighborhood = filters.neighborhood
    if (filters.status) where.status = filters.status
    if (filters.bedrooms) where.bedrooms = { gte: filters.bedrooms }
    if (filters.bathrooms) where.bathrooms = { gte: filters.bathrooms }
    if (filters.sqftMin) where.squareFeet = { gte: filters.sqftMin }
    if (filters.sqftMax) where.squareFeet = { lte: filters.sqftMax }
    if (filters.yearBuiltMin) where.yearBuilt = { gte: filters.yearBuiltMin }

    return prisma.property.findMany({
      where,
      include: {
        developer: true,
        priceHistory: {
          orderBy: { date: 'desc' },
          take: 5
        }
      },
      take: filters.limit || 10,
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get market statistics
  async getMarketStats(area?: string, period?: string) {
    const where: any = {}
    if (area) where.areaName = area
    if (period) where.period = period

    const stats = await prisma.marketMetrics.findMany({
      where,
      orderBy: { startDate: 'desc' },
      take: 5
    })

    // Calculate trends
    if (stats.length > 1) {
      const latest = stats[0]
      const previous = stats[1]
      
      return {
        current: latest,
        trends: {
          priceChange: ((latest.medianPrice - previous.medianPrice) / previous.medianPrice) * 100,
          inventoryChange: ((latest.inventory - previous.inventory) / previous.inventory) * 100,
          daysOnMarketChange: latest.avgDaysOnMarket - previous.avgDaysOnMarket
        },
        historical: stats
      }
    }

    return {
      current: stats[0],
      trends: null,
      historical: stats
    }
  }

  // Get developer information
  async getDeveloperInfo(name?: string) {
    if (name) {
      const developer = await prisma.developer.findFirst({
        where: {
          name: {
            contains: name,
            mode: 'insensitive'
          }
        },
        include: {
          projects: {
            orderBy: { totalValue: 'desc' },
            take: 5
          },
          properties: {
            where: { status: 'active' },
            take: 10
          }
        }
      })

      return developer
    }

    // Get top developers
    return prisma.developer.findMany({
      orderBy: { totalValue: 'desc' },
      take: 10,
      include: {
        projects: {
          orderBy: { totalValue: 'desc' },
          take: 3
        }
      }
    })
  }

  // Get project information
  async getProjects(filters: {
    area?: string
    projectType?: string
    phase?: string
    minValue?: number
    limit?: number
  }) {
    const where: any = {}
    if (filters.area) where.area = filters.area
    if (filters.projectType) where.projectType = filters.projectType
    if (filters.phase) where.phase = filters.phase
    if (filters.minValue) where.totalValue = { gte: filters.minValue }

    return prisma.project.findMany({
      where,
      include: {
        developer: true,
        permits: {
          orderBy: { applicationDate: 'desc' },
          take: 5
        }
      },
      orderBy: { totalValue: 'desc' },
      take: filters.limit || 10
    })
  }

  // Get permit activity
  async getPermitActivity(filters: {
    zipCode?: string
    permitType?: string
    dateFrom?: Date
    dateTo?: Date
    limit?: number
  }) {
    const where: any = {}
    if (filters.zipCode) where.zipCode = filters.zipCode
    if (filters.permitType) where.permitType = filters.permitType
    if (filters.dateFrom || filters.dateTo) {
      where.applicationDate = {
        gte: filters.dateFrom,
        lte: filters.dateTo
      }
    }

    const permits = await prisma.permit.findMany({
      where,
      include: {
        property: true,
        developer: true,
        project: true
      },
      orderBy: { applicationDate: 'desc' },
      take: filters.limit || 20
    })

    // Calculate summary statistics
    const totalValue = permits.reduce((sum, p) => sum + (p.declaredValue || 0), 0)
    const byType = permits.reduce((acc, p) => {
      acc[p.permitType] = (acc[p.permitType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      permits,
      summary: {
        total: permits.length,
        totalValue,
        byType,
        avgValue: totalValue / permits.length
      }
    }
  }

  // Get area growth data
  async getAreaGrowth(areaName: string) {
    // Get historical market data
    const marketData = await prisma.marketMetrics.findMany({
      where: { areaName },
      orderBy: { startDate: 'asc' }
    })

    // Get active developments
    const activeProjects = await prisma.project.count({
      where: {
        area: areaName,
        phase: { in: ['planning', 'approved', 'under-construction'] }
      }
    })

    // Get recent permits
    const recentPermits = await prisma.permit.count({
      where: {
        address: { contains: areaName },
        applicationDate: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
        }
      }
    })

    // Calculate growth metrics
    const priceGrowth = marketData.length > 1
      ? ((marketData[marketData.length - 1].medianPrice - marketData[0].medianPrice) / marketData[0].medianPrice) * 100
      : 0

    return {
      areaName,
      marketData,
      activeProjects,
      recentPermits,
      growthMetrics: {
        priceGrowth,
        developmentActivity: activeProjects + recentPermits,
        marketHeatIndex: marketData[marketData.length - 1]?.marketHeatIndex || 0
      }
    }
  }

  // Search across all data
  async searchAll(query: string, limit: number = 10) {
    const results = {
      properties: [] as any[],
      developers: [] as any[],
      projects: [] as any[],
      areas: [] as any[]
    }

    // Search properties
    results.properties = await prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: query, mode: 'insensitive' } },
          { neighborhood: { contains: query, mode: 'insensitive' } },
          { mlsNumber: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit
    })

    // Search developers
    results.developers = await prisma.developer.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: limit
    })

    // Search projects
    results.projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { area: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: { developer: true },
      take: limit
    })

    // Search areas
    results.areas = await prisma.marketMetrics.findMany({
      where: {
        areaName: { contains: query, mode: 'insensitive' }
      },
      distinct: ['areaName'],
      take: limit
    })

    return results
  }

  // Get database statistics
  async getDatabaseStats() {
    const [
      propertyCount,
      developerCount,
      projectCount,
      permitCount,
      marketMetricsCount
    ] = await Promise.all([
      prisma.property.count(),
      prisma.developer.count(),
      prisma.project.count(),
      prisma.permit.count(),
      prisma.marketMetrics.count()
    ])

    const totalDataPoints = 
      propertyCount * 20 + // Approx fields per property
      developerCount * 10 +
      projectCount * 15 +
      permitCount * 12 +
      marketMetricsCount * 25

    return {
      tables: {
        properties: propertyCount,
        developers: developerCount,
        projects: projectCount,
        permits: permitCount,
        marketMetrics: marketMetricsCount
      },
      totalRecords: propertyCount + developerCount + projectCount + permitCount + marketMetricsCount,
      estimatedDataPoints: totalDataPoints
    }
  }
}

export const fernandoDataQuery = new FernandoXDataQueryService()