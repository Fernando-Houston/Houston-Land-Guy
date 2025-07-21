import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface DataQualityIssue {
  table: string
  field: string
  issue: string
  severity: 'critical' | 'warning' | 'info'
  count: number
  example?: any
}

export async function GET() {
  try {
    const issues: DataQualityIssue[] = []

    // Check HAR Neighborhood Data
    const zeroSalePriceNeighborhoods = await prisma.hARNeighborhoodData.count({
      where: { avgSalePrice: 0 }
    })
    if (zeroSalePriceNeighborhoods > 0) {
      const example = await prisma.hARNeighborhoodData.findFirst({
        where: { avgSalePrice: 0 }
      })
      issues.push({
        table: 'HARNeighborhoodData',
        field: 'avgSalePrice',
        issue: `${zeroSalePriceNeighborhoods} neighborhoods have $0 average sale price`,
        severity: 'critical',
        count: zeroSalePriceNeighborhoods,
        example
      })
    }

    // Check missing ZIP codes
    const noZipNeighborhoods = await prisma.hARNeighborhoodData.count({
      where: { 
        OR: [
          { zipCode: null },
          { zipCode: 'N/A' },
          { zipCode: '' }
        ]
      }
    })
    if (noZipNeighborhoods > 0) {
      issues.push({
        table: 'HARNeighborhoodData',
        field: 'zipCode',
        issue: `${noZipNeighborhoods} neighborhoods missing ZIP codes`,
        severity: 'warning',
        count: noZipNeighborhoods
      })
    }

    // Check Market Metrics
    const marketMetricsCount = await prisma.marketMetrics.count()
    if (marketMetricsCount < 12) {
      issues.push({
        table: 'MarketMetrics',
        field: 'all',
        issue: `Only ${marketMetricsCount} months of market data (need 24+)`,
        severity: 'critical',
        count: marketMetricsCount
      })
    }

    // Check zero price properties
    const zeroPriceProperties = await prisma.property.count({
      where: { price: 0 }
    })
    if (zeroPriceProperties > 0) {
      issues.push({
        table: 'Property',
        field: 'price',
        issue: `${zeroPriceProperties} properties have $0 price`,
        severity: 'critical',
        count: zeroPriceProperties
      })
    }

    // Check permits with no value
    const noValuePermits = await prisma.permit.count({
      where: { 
        OR: [
          { declaredValue: null },
          { declaredValue: 0 }
        ]
      }
    })
    if (noValuePermits > 0) {
      issues.push({
        table: 'Permit',
        field: 'declaredValue',
        issue: `${noValuePermits} permits have no declared value`,
        severity: 'warning',
        count: noValuePermits
      })
    }

    // Check construction costs
    const constructionCostCount = await prisma.constructionCostDP5.count()
    if (constructionCostCount < 10) {
      issues.push({
        table: 'ConstructionCostDP5',
        field: 'all',
        issue: `Only ${constructionCostCount} construction cost records (need 100+)`,
        severity: 'critical',
        count: constructionCostCount
      })
    }

    // Check population projections
    const populationCount = await prisma.populationProjection.count()
    if (populationCount === 0) {
      issues.push({
        table: 'PopulationProjection',
        field: 'all',
        issue: 'No population projection data',
        severity: 'critical',
        count: 0
      })
    }

    // Check developers with no projects
    const developersNoProjects = await prisma.developer.count({
      where: { activeProjects: 0 }
    })
    if (developersNoProjects > 0) {
      issues.push({
        table: 'Developer',
        field: 'activeProjects',
        issue: `${developersNoProjects} developers show 0 active projects`,
        severity: 'info',
        count: developersNoProjects
      })
    }

    // Check for duplicate neighborhoods
    const neighborhoods = await prisma.hARNeighborhoodData.groupBy({
      by: ['name'],
      _count: { id: true },
      having: { id: { _count: { gt: 1 } } }
    })
    if (neighborhoods.length > 0) {
      issues.push({
        table: 'HARNeighborhoodData',
        field: 'name',
        issue: `${neighborhoods.length} duplicate neighborhood names found`,
        severity: 'warning',
        count: neighborhoods.length
      })
    }

    return NextResponse.json({ 
      issues,
      summary: {
        total: issues.length,
        critical: issues.filter(i => i.severity === 'critical').length,
        warning: issues.filter(i => i.severity === 'warning').length,
        info: issues.filter(i => i.severity === 'info').length
      },
      checkedAt: new Date()
    })
  } catch (error) {
    console.error('Error checking data quality:', error)
    return NextResponse.json({ 
      error: 'Failed to check data quality',
      issues: []
    }, { status: 500 })
  }
}