import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ValuationRequest {
  address?: string
  neighborhood?: string
  propertyType?: string
  squareFeet?: number
  bedrooms?: number
  bathrooms?: number
  yearBuilt?: number
  lotSize?: number
}

export async function POST(request: Request) {
  try {
    const body: ValuationRequest = await request.json()
    
    // Get comparable properties
    const comparables = await findComparables(body)
    
    // Calculate base valuation
    const baseValuation = calculateBaseValuation(comparables, body)
    
    // Get neighborhood market data
    const marketData = await getNeighborhoodMarketData(body.neighborhood || '')
    
    // Apply market adjustments
    const adjustedValuation = applyMarketAdjustments(baseValuation, marketData)
    
    // Calculate confidence score
    const confidenceScore = calculateConfidenceScore(comparables, body)
    
    // Generate valuation range
    const valuationRange = {
      low: Math.round(adjustedValuation * 0.95),
      mid: Math.round(adjustedValuation),
      high: Math.round(adjustedValuation * 1.05)
    }
    
    return NextResponse.json({
      success: true,
      data: {
        valuation: valuationRange,
        confidenceScore,
        comparables: comparables.slice(0, 5).map(comp => ({
          address: comp.address,
          price: comp.listPrice,
          pricePerSqft: comp.pricePerSqft,
          squareFeet: comp.squareFeet,
          bedrooms: comp.bedrooms,
          bathrooms: comp.bathrooms,
          soldDate: comp.soldDate,
          daysOnMarket: comp.listDate && comp.soldDate ? 
            Math.floor((comp.soldDate.getTime() - comp.listDate.getTime()) / (1000 * 60 * 60 * 24)) : null
        })),
        marketInsights: {
          neighborhoodMedian: marketData?.medianPrice || 0,
          pricePerSqft: Math.round(adjustedValuation / (body.squareFeet || 2000)),
          marketTrend: marketData?.trend || 'stable',
          avgDaysOnMarket: marketData?.avgDaysOnMarket || 30
        },
        valuationFactors: generateValuationFactors(body, marketData),
        lastUpdated: new Date()
      }
    })
  } catch (error) {
    console.error('Valuation API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to calculate property valuation' 
    }, { status: 500 })
  }
}

async function findComparables(criteria: ValuationRequest) {
  const where: any = {}
  
  if (criteria.neighborhood) {
    where.neighborhood = { contains: criteria.neighborhood }
  }
  
  if (criteria.propertyType) {
    where.propertyType = criteria.propertyType
  }
  
  // Find similar properties
  const comparables = await prisma.property.findMany({
    where: {
      ...where,
      listPrice: { gt: 0 },
      squareFeet: criteria.squareFeet ? {
        gte: criteria.squareFeet * 0.8,
        lte: criteria.squareFeet * 1.2
      } : undefined,
      bedrooms: criteria.bedrooms ? {
        gte: (criteria.bedrooms - 1) || 1,
        lte: criteria.bedrooms + 1
      } : undefined
    },
    orderBy: [
      { soldDate: 'desc' },
      { listDate: 'desc' }
    ],
    take: 20
  })
  
  return comparables
}

function calculateBaseValuation(comparables: any[], criteria: ValuationRequest) {
  if (comparables.length === 0) {
    // Use Houston average if no comparables
    const avgPricePerSqft = 150 // Houston average
    return (criteria.squareFeet || 2000) * avgPricePerSqft
  }
  
  // Calculate weighted average based on similarity
  let totalWeight = 0
  let weightedSum = 0
  
  comparables.forEach(comp => {
    let weight = 1
    
    // Increase weight for more similar properties
    if (criteria.squareFeet && comp.squareFeet) {
      const sizeDiff = Math.abs(comp.squareFeet - criteria.squareFeet) / criteria.squareFeet
      weight *= (1 - sizeDiff)
    }
    
    if (criteria.bedrooms && comp.bedrooms) {
      const bedDiff = Math.abs(comp.bedrooms - criteria.bedrooms)
      weight *= (1 - bedDiff * 0.1)
    }
    
    // Recent sales weighted more heavily
    if (comp.soldDate) {
      const monthsOld = (Date.now() - comp.soldDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      weight *= Math.max(0.5, 1 - monthsOld / 12)
    }
    
    if (comp.listPrice && comp.listPrice > 0) {
      weightedSum += comp.listPrice * weight
      totalWeight += weight
    }
  })
  
  return totalWeight > 0 ? weightedSum / totalWeight : 300000 // Default
}

async function getNeighborhoodMarketData(neighborhood: string) {
  if (!neighborhood) return null
  
  // Get latest HAR data for the neighborhood
  const harData = await prisma.harNeighborhoodData.findFirst({
    where: {
      neighborhood: { contains: neighborhood }
    },
    orderBy: { report: { reportDate: 'desc' } }
  })
  
  // Get market metrics
  const marketMetrics = await prisma.marketMetrics.findFirst({
    where: {
      areaName: { contains: neighborhood }
    },
    orderBy: { startDate: 'desc' }
  })
  
  return {
    medianPrice: harData?.medianSalePrice || marketMetrics?.medianPrice || 350000,
    avgDaysOnMarket: harData?.avgDaysOnMarket || marketMetrics?.avgDaysOnMarket || 30,
    trend: (harData?.medianSalePrice || 0) > 350000 ? 'appreciating' : 'stable',
    inventoryMonths: marketMetrics?.inventoryMonths || 3
  }
}

function applyMarketAdjustments(baseValuation: number, marketData: any) {
  let adjustedValue = baseValuation
  
  if (marketData) {
    // Adjust for market conditions
    if (marketData.inventoryMonths < 3) {
      // Seller's market - increase value
      adjustedValue *= 1.05
    } else if (marketData.inventoryMonths > 6) {
      // Buyer's market - decrease value
      adjustedValue *= 0.95
    }
    
    // Adjust for market trend
    if (marketData.trend === 'appreciating') {
      adjustedValue *= 1.02
    }
  }
  
  return adjustedValue
}

function calculateConfidenceScore(comparables: any[], criteria: ValuationRequest) {
  let score = 50 // Base score
  
  // More comparables = higher confidence
  if (comparables.length >= 10) score += 20
  else if (comparables.length >= 5) score += 10
  else if (comparables.length >= 3) score += 5
  
  // Complete property info = higher confidence
  if (criteria.squareFeet) score += 10
  if (criteria.bedrooms && criteria.bathrooms) score += 10
  if (criteria.yearBuilt) score += 5
  if (criteria.neighborhood) score += 5
  
  return Math.min(95, score)
}

function generateValuationFactors(criteria: ValuationRequest, marketData: any) {
  const factors = []
  
  // Property-specific factors
  if (criteria.squareFeet && criteria.squareFeet > 3000) {
    factors.push({ factor: 'Large Home Premium', impact: '+5%' })
  }
  
  if (criteria.yearBuilt && criteria.yearBuilt > 2020) {
    factors.push({ factor: 'New Construction', impact: '+8%' })
  } else if (criteria.yearBuilt && criteria.yearBuilt < 1980) {
    factors.push({ factor: 'Older Home Discount', impact: '-5%' })
  }
  
  // Market factors
  if (marketData?.inventoryMonths < 3) {
    factors.push({ factor: 'Low Inventory', impact: '+5%' })
  }
  
  if (marketData?.avgDaysOnMarket < 30) {
    factors.push({ factor: 'Fast Moving Market', impact: '+3%' })
  }
  
  // Neighborhood factors
  if (criteria.neighborhood?.includes('River Oaks') || 
      criteria.neighborhood?.includes('Memorial') ||
      criteria.neighborhood?.includes('West University')) {
    factors.push({ factor: 'Premium Neighborhood', impact: '+15%' })
  }
  
  return factors
}