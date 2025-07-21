import { NextResponse } from 'next/server'
import { realDataService } from '@/lib/services/real-data-service'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get available neighborhoods from real data service
    const neighborhoods = await realDataService.getAvailableNeighborhoods()
    
    return NextResponse.json({
      success: true,
      neighborhoods: neighborhoods || []
    })
  } catch (error) {
    console.error('Error fetching neighborhoods:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch neighborhoods',
        neighborhoods: []
      },
      { status: 500 }
    )
  }
}