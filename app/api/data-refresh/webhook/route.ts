// Webhook endpoint for external data updates
import { NextRequest, NextResponse } from 'next/server'
import { dataRefreshManager } from '@/lib/services/data-refresh/refresh-manager'
import { alertService } from '@/lib/services/data-refresh/alert-service'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (if configured)
    const secret = request.headers.get('x-webhook-secret')
    if (process.env.WEBHOOK_SECRET && secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Invalid webhook secret' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { type, data } = body
    
    switch (type) {
      case 'perplexity_update':
        // Handle Perplexity research update
        console.log('📊 Received Perplexity update webhook')
        
        // Trigger refresh of Perplexity data
        const results = await dataRefreshManager.refreshAllData(true)
        
        // Check for significant changes
        const perplexityResults = results.filter(r => 
          r.source.startsWith('perplexity_') && r.success
        )
        
        if (perplexityResults.some(r => r.recordsUpdated > 0)) {
          // Send alert about new data
          await alertService.sendAlerts([{
            metric: 'Perplexity Research Update',
            previousValue: 0,
            currentValue: perplexityResults.reduce((sum, r) => sum + r.recordsUpdated, 0),
            changePercent: 100,
            significance: 'medium',
            description: `New market intelligence data received from Perplexity research`,
            timestamp: new Date()
          }])
        }
        
        return NextResponse.json({
          success: true,
          message: 'Perplexity data refreshed',
          recordsUpdated: perplexityResults.reduce((sum, r) => sum + r.recordsUpdated, 0)
        })
        
      case 'market_alert':
        // Handle external market alert
        const { metric, value, change, description } = data
        
        await alertService.sendAlerts([{
          metric,
          previousValue: value - (value * change / 100),
          currentValue: value,
          changePercent: change,
          significance: Math.abs(change) > 10 ? 'high' : 'medium',
          description,
          timestamp: new Date()
        }])
        
        return NextResponse.json({
          success: true,
          message: 'Market alert processed'
        })
        
      case 'data_import':
        // Handle data import notification
        const { source, count } = data
        
        console.log(`📥 Data import notification: ${count} records from ${source}`)
        
        // Trigger refresh of specific source
        await dataRefreshManager.refreshAllData(true)
        
        return NextResponse.json({
          success: true,
          message: 'Data import processed'
        })
        
      default:
        return NextResponse.json(
          { error: 'Unknown webhook type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}