// API endpoint for data refresh operations
import { NextRequest, NextResponse } from 'next/server'
import { dataRefreshManager } from '@/lib/services/data-refresh/refresh-manager'
import { cronManager } from '@/lib/services/data-refresh/cron-manager'

export async function GET(request: NextRequest) {
  try {
    // Get refresh status
    const status = {
      cronJobs: cronManager.getJobStatus(),
      lastRefresh: await getLastRefreshTime(),
      nextScheduled: getNextScheduledTime()
    }
    
    return NextResponse.json(status)
  } catch (error) {
    console.error('Error getting refresh status:', error)
    return NextResponse.json(
      { error: 'Failed to get refresh status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, source, force } = body
    
    switch (action) {
      case 'refresh_all':
        // Trigger full refresh
        const results = await dataRefreshManager.refreshAllData(force)
        return NextResponse.json({
          success: true,
          results,
          timestamp: new Date()
        })
        
      case 'refresh_source':
        // Refresh specific source
        if (!source) {
          return NextResponse.json(
            { error: 'Source parameter required' },
            { status: 400 }
          )
        }
        
        const result = await dataRefreshManager.refreshAllData(force)
        return NextResponse.json({
          success: true,
          result: result.find(r => r.source === source),
          timestamp: new Date()
        })
        
      case 'start_cron':
        // Start cron jobs
        await cronManager.initialize()
        return NextResponse.json({
          success: true,
          message: 'Cron jobs started',
          jobs: cronManager.getJobStatus()
        })
        
      case 'stop_cron':
        // Stop cron jobs
        cronManager.stopAll()
        return NextResponse.json({
          success: true,
          message: 'Cron jobs stopped'
        })
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in data refresh:', error)
    return NextResponse.json(
      { error: 'Failed to execute refresh action' },
      { status: 500 }
    )
  }
}

// Helper functions
async function getLastRefreshTime(): Promise<Date | null> {
  // In production, this would query the database for last refresh
  return new Date()
}

function getNextScheduledTime(): Date {
  // Calculate next scheduled refresh (6 AM next day)
  const next = new Date()
  next.setDate(next.getDate() + 1)
  next.setHours(6, 0, 0, 0)
  return next
}