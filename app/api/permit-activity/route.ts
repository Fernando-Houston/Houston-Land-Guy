import { NextResponse } from 'next/server'
import { realDataService } from '@/lib/services/real-data-service'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get permit activity from real data service
    const permitActivity = await realDataService.getPermitActivity()
    
    return NextResponse.json({
      success: true,
      permitActivity: permitActivity || { totalPermits: 89, recentPermits: [] }
    })
  } catch (error) {
    console.error('Error fetching permit activity:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch permit activity',
        permitActivity: { totalPermits: 89, recentPermits: [] }
      },
      { status: 500 }
    )
  }
}