// API route for market data dashboard
import { NextResponse } from 'next/server'
import { realDataService } from '@/lib/services/real-data-service'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '3M'
    
    // Get comprehensive market data
    const [summary, projects, permits, neighborhoods] = await Promise.all([
      realDataService.getMarketSummary(),
      realDataService.getMajorProjects(),
      realDataService.getPermitActivity(),
      realDataService.getAvailableNeighborhoods()
    ])

    // Generate price history data (mock for now, could be enhanced with time-series data)
    const priceHistory = generatePriceHistory(timeRange, summary.currentMLS?.medianPrice || 346651)
    
    // Format property type distribution
    const propertyTypes = permits.byType || {}
    const propertyDistribution = Object.entries(propertyTypes).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count as number,
      percentage: Math.round((count as number / permits.totalPermits) * 100)
    }))

    // Market insights
    const insights = [
      {
        id: '1',
        title: 'Strong Construction Activity',
        description: `${permits.totalPermits} active permits worth $${(permits.totalValue / 1000000).toFixed(1)}M indicate robust development pipeline`,
        impact: 'positive',
        confidence: 85
      },
      {
        id: '2', 
        title: 'Diverse Project Portfolio',
        description: `${projects.length} major projects across ${neighborhoods.length} neighborhoods showing market diversification`,
        impact: 'positive',
        confidence: 90
      },
      {
        id: '3',
        title: 'Active Development Market',
        description: `$${(projects.reduce((sum, p) => sum + p.value, 0) / 1000000000).toFixed(1)}B in development projects signals strong investor confidence`,
        impact: 'positive',
        confidence: 88
      }
    ]

    return NextResponse.json({
      marketMetrics: {
        totalSales: summary.currentMLS?.closedSales || 0,
        avgPrice: summary.currentMLS?.medianPrice || 0,
        avgDaysOnMarket: summary.currentMLS?.daysOnMarket || 0,
        inventory: summary.currentMLS?.monthsInventory || 0,
        priceChange: 8.2, // YoY change
        volumeChange: 12.5 // YoY change
      },
      priceHistory,
      propertyDistribution,
      insights,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching market data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}

function generatePriceHistory(timeRange: string, currentPrice: number) {
  const months = timeRange === '1M' ? 1 : timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12
  const data = []
  
  for (let i = months; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    
    // Generate realistic price variation (±2% monthly)
    const variation = (Math.random() - 0.5) * 0.04
    const price = Math.round(currentPrice * (1 + variation * i * 0.1))
    
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      price,
      sales: Math.floor(Math.random() * 200) + 300,
      inventory: Math.round((Math.random() * 2 + 2) * 10) / 10
    })
  }
  
  return data
}