import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authConfig from '@/lib/auth/auth-config'
import { prisma } from '@/lib/db/prisma'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authConfig)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Get counts for all major tables
    const [
      developersCount,
      projectsCount,
      propertiesCount,
      neighborhoodsCount,
      marketMetricsCount,
      constructionCostsCount,
      permitsCount,
      harMlsReportsCount,
      harNeighborhoodDataCount,
      constructionActivityCount,
      marketIntelligenceCount,
      rentalMarketCount,
      strMarketCount,
      areaDemographicsCount,
      incomeDataCount,
      populationProjectionCount,
      qualityOfLifeCount,
      educationMetricsCount,
      employerDP5Count,
      economicIndicatorDP5Count,
      migrationDataCount,
      constructionCostDP5Count
    ] = await Promise.all([
      prisma.developer.count(),
      prisma.project.count(),
      prisma.property.count(),
      prisma.marketMetrics.groupBy({
        by: ['areaName'],
        _count: true
      }).then(results => results.length), // Count unique neighborhoods
      prisma.marketMetrics.count(),
      prisma.constructionCostDP5.count(),
      prisma.permit.count(),
      prisma.harMlsReport.count(),
      prisma.harNeighborhoodData.count(),
      prisma.constructionActivity.count(),
      prisma.marketIntelligence.count(),
      prisma.rentalMarket.count(),
      prisma.sTRMarket.count(),
      prisma.areaDemographics.count(),
      prisma.incomeData.count(),
      prisma.populationProjection.count(),
      prisma.qualityOfLife.count(),
      prisma.educationMetrics.count(),
      prisma.employerDP5.count(),
      prisma.economicIndicatorDP5.count(),
      prisma.migrationData.count(),
      prisma.constructionCostDP5.count()
    ])

    // Get additional statistics
    const [
      activeProjects,
      completedProjects,
      totalPropertyValue,
      recentImports
    ] = await Promise.all([
      prisma.project.count({
        where: { phase: { in: ['under-construction', 'approved'] } }
      }),
      prisma.project.count({
        where: { phase: 'completed' }
      }),
      prisma.property.aggregate({
        _sum: { listPrice: true }
      }),
      prisma.dataImport.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          importType: true,
          status: true,
          totalRecords: true,
          processedRecords: true,
          createdAt: true
        }
      })
    ])

    const response = {
      timestamp: new Date().toISOString(),
      counts: {
        core: {
          developers: developersCount,
          projects: projectsCount,
          properties: propertiesCount,
          neighborhoods: neighborhoodsCount,
          permits: permitsCount
        },
        marketData: {
          marketMetrics: marketMetricsCount,
          harMlsReports: harMlsReportsCount,
          harNeighborhoodData: harNeighborhoodDataCount,
          marketIntelligence: marketIntelligenceCount
        },
        rentalData: {
          rentalMarket: rentalMarketCount,
          strMarket: strMarketCount
        },
        demographicData: {
          areaDemographics: areaDemographicsCount,
          incomeData: incomeDataCount,
          populationProjection: populationProjectionCount,
          migrationData: migrationDataCount
        },
        qualityMetrics: {
          qualityOfLife: qualityOfLifeCount,
          educationMetrics: educationMetricsCount
        },
        economicData: {
          employerDP5: employerDP5Count,
          economicIndicatorDP5: economicIndicatorDP5Count,
          constructionCostDP5: constructionCostsCount,
          constructionActivity: constructionActivityCount
        }
      },
      statistics: {
        activeProjects,
        completedProjects,
        totalPropertyValue: totalPropertyValue._sum.listPrice || 0,
        totalRecords: developersCount + projectsCount + propertiesCount + 
                     marketMetricsCount + constructionCostsCount + permitsCount +
                     harMlsReportsCount + harNeighborhoodDataCount + 
                     constructionActivityCount + marketIntelligenceCount +
                     rentalMarketCount + strMarketCount + areaDemographicsCount +
                     incomeDataCount + populationProjectionCount + qualityOfLifeCount +
                     educationMetricsCount + employerDP5Count + economicIndicatorDP5Count +
                     migrationDataCount + constructionCostDP5Count
      },
      recentImports,
      recommendation: {
        needsMoreData: false,
        message: ''
      }
    }

    // Analyze if more data is needed
    const totalRecords = response.statistics.totalRecords
    if (totalRecords < 1000) {
      response.recommendation.needsMoreData = true
      response.recommendation.message = 'Database has minimal data. Terminal 2 and Terminal 3 should help populate more data across all tables.'
    } else if (totalRecords < 10000) {
      response.recommendation.needsMoreData = true
      response.recommendation.message = 'Database has some data but could benefit from additional population. Consider using Terminal 2 and Terminal 3 for specific data categories that are low.'
    } else {
      response.recommendation.message = 'Database is well-populated with sufficient data for most operations.'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching database counts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch database counts', details: error },
      { status: 500 }
    )
  }
}