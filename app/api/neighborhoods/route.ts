import { NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Return available neighborhoods for comparison
    const neighborhoods = [
      { slug: 'heights', name: 'The Heights', zipCode: '77008' },
      { slug: 'river-oaks', name: 'River Oaks', zipCode: '77019' },
      { slug: 'memorial', name: 'Memorial', zipCode: '77024' },
      { slug: 'montrose', name: 'Montrose', zipCode: '77006' },
      { slug: 'cypress', name: 'Cypress', zipCode: '77429' },
      { slug: 'pearland', name: 'Pearland', zipCode: '77584' },
      { slug: 'spring', name: 'Spring', zipCode: '77373' },
      { slug: 'conroe', name: 'Conroe', zipCode: '77301' },
      { slug: 'richmond', name: 'Richmond', zipCode: '77469' },
      { slug: 'friendswood', name: 'Friendswood', zipCode: '77546' },
      { slug: 'league-city', name: 'League City', zipCode: '77573' },
      { slug: 'clear-lake', name: 'Clear Lake', zipCode: '77058' },
      { slug: 'bellaire', name: 'Bellaire', zipCode: '77401' },
      { slug: 'energy-corridor', name: 'Energy Corridor', zipCode: '77079' },
      { slug: 'champions', name: 'Champions', zipCode: '77379' }
    ]

    return NextResponse.json({
      success: true,
      neighborhoods,
      total: neighborhoods.length
    })
  } catch (error) {
    console.error('Error in neighborhoods API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch neighborhoods',
        neighborhoods: []
      },
      { status: 500 }
    )
  }
}