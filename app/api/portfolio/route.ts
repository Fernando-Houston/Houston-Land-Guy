import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Demo portfolio data - no authentication required for now
    const portfolioData = {
      overview: {
        totalValue: 12850000,
        totalProperties: 8,
        totalEquity: 8920000,
        totalDebt: 3930000,
        monthlyIncome: 42500,
        monthlyExpenses: 28750,
        netCashFlow: 13750
      },
      performance: {
        totalReturn: 285000,
        returnPercentage: 18.5,
        appreciation: 425000,
        cashFlow: 165000,
        taxBenefits: 52000
      },
      properties: [
        {
          id: 'prop-001',
          address: '1234 Main St, Houston, TX',
          type: 'Multi-Family',
          units: 12,
          value: 2850000,
          equity: 1425000,
          monthlyIncome: 12500,
          occupancy: 92,
          acquired: '2023-03-15'
        },
        {
          id: 'prop-002', 
          address: '5678 Oak Blvd, Katy, TX',
          type: 'Commercial',
          value: 1950000,
          equity: 975000,
          monthlyIncome: 8200,
          occupancy: 100,
          acquired: '2023-07-22'
        },
        {
          id: 'prop-003',
          address: '9012 Pine Ave, Spring, TX',
          type: 'Single-Family',
          value: 450000,
          equity: 350000,
          monthlyIncome: 2800,
          occupancy: 100,
          acquired: '2024-01-10'
        }
      ],
      allocation: {
        byType: {
          'Multi-Family': 45,
          'Commercial': 35,
          'Single-Family': 15,
          'Land': 5
        },
        byLocation: {
          'Houston': 55,
          'Katy': 25,
          'Spring': 12,
          'Cypress': 8
        }
      },
      metrics: {
        avgCapRate: 7.8,
        avgCashOnCash: 12.5,
        debtServiceRatio: 1.48,
        loanToValue: 68.5
      },
      alerts: [
        {
          type: 'opportunity',
          message: 'New development opportunity matches your criteria',
          property: 'Land parcel in Cypress',
          action: 'View Details'
        },
        {
          type: 'market',
          message: 'Property values in Katy up 8.5% this quarter',
          impact: '+$165,750 portfolio value',
          action: 'View Report'
        }
      ],
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: portfolioData,
      authenticated: false
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // For now, allow portfolio actions without authentication

    const body = await request.json()
    const { action, propertyId, data } = body

    // Handle portfolio actions
    let result
    switch (action) {
      case 'add':
        result = {
          message: 'Property added to portfolio',
          propertyId: propertyId || 'new-prop-' + Date.now(),
          portfolio: {
            totalProperties: 9,
            totalValue: 15700000
          }
        }
        break
      
      case 'remove':
        result = {
          message: 'Property removed from portfolio',
          propertyId,
          portfolio: {
            totalProperties: 7,
            totalValue: 9850000
          }
        }
        break
      
      case 'update':
        result = {
          message: 'Portfolio updated',
          changes: data,
          timestamp: new Date().toISOString()
        }
        break
      
      default:
        result = {
          message: 'Portfolio action completed',
          action,
          timestamp: new Date().toISOString()
        }
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}