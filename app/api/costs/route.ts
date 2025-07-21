// API route for costs data
import { NextRequest, NextResponse } from 'next/server'
import { CostsDataService } from '@/lib/services/costs-data-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '100')
    }

    const costsService = new CostsDataService()
    
    const [costData, stats, trends, breakdown] = await Promise.all([
      costsService.getCostData(filters),
      costsService.getCostStats(),
      costsService.getCostTrends(),
      costsService.getConstructionCostBreakdown()
    ])

    return NextResponse.json({
      costData,
      stats,
      trends,
      breakdown
    })
  } catch (error) {
    console.error('Error fetching costs data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch costs data' },
      { status: 500 }
    )
  }
}