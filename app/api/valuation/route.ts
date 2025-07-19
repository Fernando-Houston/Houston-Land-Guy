import { NextResponse } from 'next/server'
import { marketIntelligence } from '@/lib/services/market-intelligence'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const propertyId = searchParams.get('propertyId')

    // Default valuation data
    const valuationData = {
      estimatedValue: 2850000,
      valueRange: {
        low: 2565000,
        mid: 2850000,
        high: 3135000
      },
      confidence: 88,
      methodology: [
        'Comparative Market Analysis',
        'Income Approach',
        'Cost Approach',
        'AI-Enhanced Valuation'
      ],
      comparables: [
        {
          address: '12345 Westheimer Rd',
          soldPrice: 2750000,
          soldDate: '2024-12-15',
          pricePerSqft: 185,
          similarity: 92
        },
        {
          address: '67890 Memorial Dr',
          soldPrice: 2950000,
          soldDate: '2024-11-20',
          pricePerSqft: 195,
          similarity: 88
        },
        {
          address: '54321 Katy Fwy',
          soldPrice: 2650000,
          soldDate: '2024-10-30',
          pricePerSqft: 175,
          similarity: 85
        }
      ],
      factors: {
        location: 95,
        condition: 88,
        marketDemand: 92,
        developmentPotential: 96,
        zoning: 90
      },
      appreciation: {
        oneYear: 8.5,
        threeYear: 28.2,
        fiveYear: 45.8
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: valuationData,
      address,
      propertyId
    })
  } catch (error) {
    console.error('Error fetching valuation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch valuation data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      propertyId,
      address,
      propertyType,
      size,
      yearBuilt,
      features 
    } = body

    // Generate AI-powered valuation
    const cma = await marketIntelligence.generateCMA(
      propertyId || 'demo-property',
      {
        radius: 2,
        timeframe: 6,
        propertyTypes: [propertyType || 'residential']
      }
    )

    const customValuation = {
      propertyDetails: {
        address,
        propertyType,
        size,
        yearBuilt,
        features
      },
      valuation: {
        estimated: cma.valuationRange.most_likely,
        range: cma.valuationRange,
        confidence: cma.confidence
      },
      analysis: cma,
      recommendations: [
        'Property is priced competitively for current market',
        'Consider improvements to maximize value',
        'Optimal listing window in next 30-45 days'
      ],
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: customValuation
    })
  } catch (error) {
    console.error('Error generating valuation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate valuation' },
      { status: 500 }
    )
  }
}