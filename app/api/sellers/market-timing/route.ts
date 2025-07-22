import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const neighborhood = searchParams.get('neighborhood')
    const propertyType = searchParams.get('propertyType')
    
    // Get historical market data
    const marketData = await prisma.marketMetrics.findMany({
      where: {
        ...(neighborhood && { areaName: { contains: neighborhood } }),
      },
      orderBy: { startDate: 'desc' },
      take: 12 // Last 12 months
    })
    
    // Get seasonal patterns from HAR data
    const harData = await prisma.harMlsReport.findMany({
      orderBy: { reportDate: 'desc' },
      take: 12
    })
    
    // Calculate price trends
    const priceTrends = marketData.map(metric => ({
      month: metric.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      medianPrice: metric.medianPrice,
      avgDaysOnMarket: metric.avgDaysOnMarket,
      inventoryMonths: metric.inventoryMonths,
      changeYoY: metric.changeYoY
    }))
    
    // Analyze seasonal patterns
    const seasonalAnalysis = analyzeSeasonalPatterns(harData)
    
    // Generate predictions
    const predictions = generatePredictions(marketData)
    
    // Calculate optimal timing recommendation
    const recommendation = calculateOptimalTiming(marketData, seasonalAnalysis)
    
    return NextResponse.json({
      success: true,
      data: {
        currentMarket: {
          medianPrice: marketData[0]?.medianPrice || 0,
          avgDaysOnMarket: marketData[0]?.avgDaysOnMarket || 0,
          inventoryMonths: marketData[0]?.inventoryMonths || 0,
          trend: marketData[0]?.changeYoY > 0 ? 'appreciating' : 'depreciating'
        },
        priceTrends,
        seasonalPatterns: seasonalAnalysis,
        predictions,
        recommendation,
        bestMonthsToSell: ['March', 'April', 'May', 'June'],
        worstMonthsToSell: ['November', 'December', 'January'],
        marketStrength: calculateMarketStrength(marketData[0])
      }
    })
  } catch (error) {
    console.error('Market timing API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch market timing data' 
    }, { status: 500 })
  }
}

function analyzeSeasonalPatterns(harData: any[]) {
  const monthlyAverages: Record<string, { avgPrice: number, avgDOM: number, count: number }> = {}
  
  harData.forEach(report => {
    const month = report.reportDate.toLocaleDateString('en-US', { month: 'long' })
    if (!monthlyAverages[month]) {
      monthlyAverages[month] = { avgPrice: 0, avgDOM: 0, count: 0 }
    }
    
    monthlyAverages[month].avgPrice += report.medianSalesPrice || 0
    monthlyAverages[month].avgDOM += report.avgDaysOnMarket || 0
    monthlyAverages[month].count++
  })
  
  // Calculate averages
  Object.keys(monthlyAverages).forEach(month => {
    const data = monthlyAverages[month]
    data.avgPrice = data.avgPrice / data.count
    data.avgDOM = data.avgDOM / data.count
  })
  
  return monthlyAverages
}

function generatePredictions(marketData: any[]) {
  if (marketData.length < 3) {
    return {
      nextMonth: { price: 0, confidence: 0 },
      nextQuarter: { price: 0, confidence: 0 },
      nextSixMonths: { price: 0, confidence: 0 }
    }
  }
  
  // Simple trend projection
  const recentPrices = marketData.slice(0, 3).map(m => m.medianPrice)
  const avgChange = (recentPrices[0] - recentPrices[2]) / 2
  const monthlyChangeRate = avgChange / recentPrices[2]
  
  const currentPrice = recentPrices[0]
  
  return {
    nextMonth: {
      price: Math.round(currentPrice * (1 + monthlyChangeRate)),
      confidence: 75,
      trend: monthlyChangeRate > 0 ? 'up' : 'down'
    },
    nextQuarter: {
      price: Math.round(currentPrice * (1 + monthlyChangeRate * 3)),
      confidence: 65,
      trend: monthlyChangeRate > 0 ? 'up' : 'down'
    },
    nextSixMonths: {
      price: Math.round(currentPrice * (1 + monthlyChangeRate * 6)),
      confidence: 50,
      trend: monthlyChangeRate > 0 ? 'up' : 'down'
    }
  }
}

function calculateOptimalTiming(marketData: any[], seasonalAnalysis: any) {
  const currentDOM = marketData[0]?.avgDaysOnMarket || 30
  const currentInventory = marketData[0]?.inventoryMonths || 3
  
  let recommendation = {
    action: 'SELL NOW',
    reasoning: '',
    confidenceScore: 0,
    optimalWindow: ''
  }
  
  // Seller's market conditions
  if (currentDOM < 30 && currentInventory < 3) {
    recommendation.action = 'SELL NOW'
    recommendation.reasoning = 'Strong seller\'s market with low inventory and fast sales'
    recommendation.confidenceScore = 90
    recommendation.optimalWindow = 'Next 30-60 days'
  }
  // Balanced market
  else if (currentDOM < 60 && currentInventory < 6) {
    recommendation.action = 'SELL SOON'
    recommendation.reasoning = 'Balanced market conditions favor sellers who price competitively'
    recommendation.confidenceScore = 75
    recommendation.optimalWindow = 'Next 60-90 days'
  }
  // Buyer's market
  else {
    recommendation.action = 'WAIT OR PRICE AGGRESSIVELY'
    recommendation.reasoning = 'Buyer\'s market with high inventory - consider waiting or competitive pricing'
    recommendation.confidenceScore = 60
    recommendation.optimalWindow = 'Spring selling season'
  }
  
  return recommendation
}

function calculateMarketStrength(currentMetrics: any) {
  if (!currentMetrics) return 50
  
  let score = 50 // Base score
  
  // Days on market (lower is better for sellers)
  if (currentMetrics.avgDaysOnMarket < 30) score += 20
  else if (currentMetrics.avgDaysOnMarket < 60) score += 10
  else score -= 10
  
  // Inventory (lower is better for sellers)
  if (currentMetrics.inventoryMonths < 3) score += 20
  else if (currentMetrics.inventoryMonths < 6) score += 10
  else score -= 10
  
  // Price change (positive is better)
  if (currentMetrics.changeYoY > 5) score += 10
  else if (currentMetrics.changeYoY > 0) score += 5
  else score -= 5
  
  return Math.max(0, Math.min(100, score))
}