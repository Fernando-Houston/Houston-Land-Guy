// API route for permits data
import { NextRequest, NextResponse } from 'next/server'
import { PermitsDataService } from '@/lib/services/permits-data-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      limit: parseInt(searchParams.get('limit') || '100'),
      dateFrom: searchParams.get('dateFrom') || undefined,
      type: searchParams.get('type') || undefined,
      zipCode: searchParams.get('zipCode') || undefined,
      search: searchParams.get('search') || undefined
    }

    const permitsService = new PermitsDataService()
    
    const [permits, stats] = await Promise.all([
      permitsService.getPermits(filters),
      permitsService.getPermitStats({
        dateFrom: filters.dateFrom,
        type: filters.type
      })
    ])

    return NextResponse.json({
      permits,
      stats
    })
  } catch (error) {
    console.error('Error fetching permits data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch permits data' },
      { status: 500 }
    )
  }
}