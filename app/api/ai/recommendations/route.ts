import { NextResponse } from 'next/server'
import { aiRecommendations } from '@/lib/services/ai-recommendations'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/auth-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, category, limit, preferences } = body

    // Get session if available
    const session = await getServerSession(authConfig)
    const effectiveUserId = session?.user?.id || userId || 'demo-user'

    // Get AI recommendations
    const recommendations = await aiRecommendations.getPersonalizedRecommendations(
      effectiveUserId,
      preferences,
      {
        userBehavior: {
          viewedProperties: [],
          savedProperties: [],
          searchHistory: [],
          calculatorUsage: []
        },
        marketConditions: {
          trending: ['Cypress', 'Katy', 'Heights'],
          hotAreas: ['East End', 'Third Ward'],
          priceMovements: {
            increasing: ['77429', '77494'],
            stable: ['77024'],
            decreasing: []
          }
        }
      }
    )

    // Filter by category if specified
    let filteredRecommendations = recommendations
    if (category && category !== 'all') {
      filteredRecommendations = recommendations.filter(rec => {
        switch (category) {
          case 'investment':
            return rec.matchScore > 85 && rec.insights.investmentPotential.includes('ROI')
          case 'development':
            return rec.property.propertyType.toLowerCase().includes('land') || 
                   rec.property.propertyType.toLowerCase().includes('commercial')
          case 'trending':
            return rec.reasoning.some(r => r.toLowerCase().includes('trending') || 
                                          r.toLowerCase().includes('hot'))
          default:
            return true
        }
      })
    }

    // Apply limit
    const limitedRecommendations = filteredRecommendations.slice(0, limit || 10)

    return NextResponse.json({
      success: true,
      recommendations: limitedRecommendations,
      total: recommendations.length,
      category
    })
  } catch (error) {
    console.error('Error getting AI recommendations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'

    // Quick recommendations for GET requests
    const recommendations = await aiRecommendations.getPersonalizedRecommendations(
      userId,
      undefined,
      undefined
    )

    return NextResponse.json({
      success: true,
      recommendations: recommendations.slice(0, 5),
      total: recommendations.length
    })
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}