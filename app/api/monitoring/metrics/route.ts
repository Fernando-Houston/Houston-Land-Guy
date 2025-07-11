import { NextRequest, NextResponse } from 'next/server'
import { MetricsService } from '@/lib/monitoring/metrics'
import { handleAPIError } from '@/lib/errors/api-error'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'daily'
    
    let data
    
    switch (type) {
      case 'daily':
        data = await MetricsService.getDailyMetrics()
        break
        
      case 'weekly':
        data = await MetricsService.getWeeklyMetrics()
        break
        
      case 'funnel':
        data = await MetricsService.getConversionFunnel()
        break
        
      case 'performance':
        data = await MetricsService.getPerformanceReport()
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid metrics type' },
          { status: 400 }
        )
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    return handleAPIError(error)
  }
}