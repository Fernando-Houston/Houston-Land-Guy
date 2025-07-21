import { NextResponse } from 'next/server'
import { dataProcess5Import } from '@/lib/services/dataprocess5-import-service'

export async function POST(request: Request) {
  try {
    // In production, add authentication check here
    // const session = await getServerSession()
    // if (!session?.user?.email?.includes('@houstonlandguy.com')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    
    const body = await request.json()
    const { type = 'all' } = body
    
    console.log(`Starting Data Process 5 import: ${type}`)
    
    let result
    
    switch (type) {
      case 'demographics':
        result = await dataProcess5Import.importDemographics()
        break
      case 'rental':
        result = await dataProcess5Import.importRentalMarket()
        break
      case 'employers':
        result = await dataProcess5Import.importEmployers()
        break
      case 'str':
        result = await dataProcess5Import.importSTRMarket()
        break
      case 'income':
        result = await dataProcess5Import.importIncomeData()
        break
      case 'population':
        result = await dataProcess5Import.importPopulationProjections()
        break
      case 'migration':
        result = await dataProcess5Import.importMigrationData()
        break
      case 'education':
        result = await dataProcess5Import.importEducationData()
        break
      case 'economic':
        result = await dataProcess5Import.importEconomicIndicators()
        break
      case 'construction':
        result = await dataProcess5Import.importConstructionCosts()
        break
      case 'all':
      default:
        result = await dataProcess5Import.importAll()
        break
    }
    
    console.log('Import completed:', result)
    
    return NextResponse.json({
      success: true,
      message: `Data Process 5 import completed: ${type}`,
      result
    })
  } catch (error) {
    console.error('Data Process 5 import error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Import failed'
    }, { status: 500 })
  }
}

// GET endpoint to check import status
export async function GET() {
  return NextResponse.json({
    available_imports: [
      'all',
      'demographics',
      'rental',
      'employers', 
      'str',
      'income',
      'population',
      'migration',
      'education',
      'economic',
      'construction'
    ],
    usage: 'POST /api/admin/import-dataprocess5 with { "type": "all" }'
  })
}