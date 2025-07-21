// API route for seller metrics
import { NextResponse } from 'next/server'
import { SellersDataService } from '@/lib/services/sellers-data-service'

export async function GET() {
  try {
    const sellersService = new SellersDataService()
    
    const [metrics, topNeighborhoods, marketTiming, demandData] = await Promise.all([
      sellersService.getSellerMetrics(),
      sellersService.getTopNeighborhoods(8),
      sellersService.getMarketTiming(),
      sellersService.getBuyerDemandData()
    ])

    return NextResponse.json({
      metrics,
      topNeighborhoods,
      marketTiming,
      demandData: demandData.slice(0, 10) // Top 10 areas
    })
  } catch (error) {
    console.error('Error fetching seller data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seller data' },
      { status: 500 }
    )
  }
}