import { NextResponse } from 'next/server'
import { hcadApi } from '@/lib/services/hcad-api-service'

export async function POST(request: Request) {
  try {
    // In production, add authentication check here
    // const session = await getServerSession()
    // if (!session?.user?.email?.includes('@houstonlandguy.com')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    
    const body = await request.json()
    const { action, params } = body
    
    console.log(`HCAD import action: ${action}`, params)
    
    let result
    
    switch (action) {
      case 'import-property':
        if (!params?.accountNumber) {
          return NextResponse.json({ error: 'Account number required' }, { status: 400 })
        }
        const success = await hcadApi.importPropertyToDatabase(params.accountNumber)
        result = { success, accountNumber: params.accountNumber }
        break
        
      case 'import-area':
        if (!params?.zipCode) {
          return NextResponse.json({ error: 'ZIP code required' }, { status: 400 })
        }
        result = await hcadApi.importAreaProperties(
          params.zipCode, 
          params.limit || 100
        )
        break
        
      case 'search':
        result = await hcadApi.searchProperties(params || {})
        break
        
      case 'area-stats':
        if (!params?.zipCode) {
          return NextResponse.json({ error: 'ZIP code required' }, { status: 400 })
        }
        result = await hcadApi.getAreaStats(params.zipCode)
        break
        
      case 'distressed':
        result = await hcadApi.findDistressedProperties(params || {})
        break
        
      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: import-property, import-area, search, area-stats, or distressed' 
        }, { status: 400 })
    }
    
    console.log('HCAD action completed:', action, result)
    
    return NextResponse.json({
      success: true,
      action,
      result
    })
  } catch (error) {
    console.error('HCAD import error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'HCAD operation failed'
    }, { status: 500 })
  }
}

// GET endpoint to check available actions
export async function GET() {
  return NextResponse.json({
    available_actions: [
      {
        action: 'import-property',
        params: { accountNumber: 'string' },
        description: 'Import a single property by account number'
      },
      {
        action: 'import-area',
        params: { zipCode: 'string', limit: 'number (optional)' },
        description: 'Import all properties in a ZIP code'
      },
      {
        action: 'search',
        params: { 
          account: 'string (optional)',
          owner: 'string (optional)',
          address: 'string (optional)',
          zipCode: 'string (optional)',
          limit: 'number (optional)',
          offset: 'number (optional)'
        },
        description: 'Search HCAD properties'
      },
      {
        action: 'area-stats',
        params: { zipCode: 'string' },
        description: 'Get aggregated stats for a ZIP code'
      },
      {
        action: 'distressed',
        params: { 
          zipCode: 'string (optional)',
          maxValue: 'number (optional)',
          minYearBuilt: 'number (optional)'
        },
        description: 'Find potentially distressed properties'
      }
    ],
    usage: 'POST /api/admin/import-hcad with { "action": "...", "params": {...} }'
  })
}