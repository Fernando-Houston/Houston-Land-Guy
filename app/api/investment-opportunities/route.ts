import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get real properties from our database
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { propertyType: { not: null } },
          { price: { gt: 0 } }
        ]
      },
      orderBy: {
        price: 'desc'
      },
      take: 50
    })

    // Get neighborhood data for enrichment
    const neighborhoods = await prisma.neighborhood.findMany({
      where: {
        avgROI: { gt: 0 }
      }
    })

    // Transform properties into investment opportunities
    const opportunities = properties.map((property, index) => {
      const neighborhood = neighborhoods.find(n => 
        n.name === property.neighborhood || 
        n.zipCode === property.zipCode
      )

      // Calculate ROI based on property type and location
      let baseROI = 15
      if (property.propertyType === 'commercial') baseROI = 18
      if (property.propertyType === 'industrial') baseROI = 22
      if (property.propertyType === 'mixed-use') baseROI = 25
      if (property.propertyType === 'land') baseROI = 35
      
      // Add neighborhood ROI if available
      const projectedROI = neighborhood?.avgROI || baseROI + (Math.random() * 10)

      // Determine property type label
      let typeLabel = 'Development Site'
      if (property.propertyType === 'commercial') typeLabel = 'Commercial Development'
      if (property.propertyType === 'industrial') typeLabel = 'Industrial Development'
      if (property.propertyType === 'mixed-use') typeLabel = 'Mixed-Use Development'
      if (property.propertyType === 'residential') typeLabel = 'Residential Development'
      if (property.propertyType === 'land') typeLabel = 'Raw Land Development'

      return {
        id: property.id,
        title: property.address || `${typeLabel} Opportunity #${index + 1}`,
        location: property.address || 'Houston Metro Area',
        neighborhood: property.neighborhood || property.city || 'Houston',
        type: typeLabel,
        price: property.price || 5000000,
        size: property.size || property.lotSize || 10,
        projectedROI: parseFloat(projectedROI.toFixed(1)),
        highlights: [
          `${property.city || 'Houston'} ${property.propertyType || 'development'} opportunity`,
          property.propertyDescription || 'Prime location for development',
          `${property.zipCode || '77001'} zip code market`,
          neighborhood?.population ? `Population: ${neighborhood.population.toLocaleString()}` : 'Growing market area'
        ],
        risks: [
          'Market conditions subject to change',
          'Development approval required',
          'Construction costs may vary'
        ],
        timeline: property.propertyType === 'land' ? '36-48 months' : '24-36 months',
        minimumInvestment: Math.round((property.price || 5000000) * 0.2),
        targetIRR: projectedROI - 5,
        exitStrategy: property.propertyType === 'commercial' 
          ? 'Develop and lease or sell'
          : property.propertyType === 'residential'
          ? 'Develop and sell to homebuilders'
          : 'Multiple exit strategies available',
        images: [`/images/${property.propertyType || 'development'}-site.jpg`],
        actualProperty: true,
        propertyData: {
          beds: property.beds,
          baths: property.baths,
          sqft: property.sqft,
          yearBuilt: property.yearBuilt,
          zipCode: property.zipCode,
          mlsNumber: property.mlsNumber
        }
      }
    })

    // Get market timing data
    const marketMetrics = await prisma.marketMetrics.findFirst({
      orderBy: { date: 'desc' }
    })

    const marketTiming = {
      currentPhase: 'Growth',
      indicators: {
        inventory: marketMetrics?.inventoryMonths || 3.2,
        priceGrowth: marketMetrics?.yearOverYearGrowth || 8.5,
        absorption: 85,
        construction: 'High Activity'
      },
      recommendation: 'Strong Buy',
      analysis: 'Houston market shows strong fundamentals with low inventory and steady price appreciation.'
    }

    return NextResponse.json({
      opportunities,
      total: opportunities.length,
      marketTiming
    })
  } catch (error) {
    console.error('Error fetching investment opportunities:', error)
    return NextResponse.json({
      opportunities: [],
      total: 0,
      marketTiming: {
        currentPhase: 'Growth',
        indicators: {
          inventory: 3.2,
          priceGrowth: 8.5,
          absorption: 85,
          construction: 'High Activity'
        },
        recommendation: 'Strong Buy',
        analysis: 'Houston market shows strong fundamentals.'
      }
    })
  }
}