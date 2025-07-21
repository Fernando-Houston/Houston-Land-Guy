import { NextResponse } from 'next/server'
import { realDataService } from '@/lib/services/real-data-service'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Get developers from real data service
    const developers = await realDataService.getDevelopers(limit)
    
    return NextResponse.json({
      success: true,
      developers: developers || [],
      total: developers?.length || 0
    })
  } catch (error) {
    console.error('Error fetching developers:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch developers',
        developers: [],
        total: 0
      },
      { status: 500 }
    )
  }
}