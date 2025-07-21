import { NextResponse } from 'next/server'
import { dataImportService } from '@/lib/services/data-import-service'
import { getServerSession } from 'next-auth'
import authConfig from '@/lib/auth/auth-config'

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authConfig)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { importType } = await request.json()

    let result
    switch (importType) {
      case 'developers':
        result = await dataImportService.importDevelopers()
        break
      case 'projects':
        result = await dataImportService.importProjects()
        break
      case 'market-metrics':
        result = await dataImportService.importMarketMetrics()
        break
      case 'sample-properties':
        result = await dataImportService.importSampleProperties()
        break
      case 'all':
        // Import all data types
        const results = []
        results.push(await dataImportService.importDevelopers())
        results.push(await dataImportService.importProjects())
        results.push(await dataImportService.importMarketMetrics())
        results.push(await dataImportService.importSampleProperties())
        
        result = {
          success: results.every(r => r.success),
          totalRecords: results.reduce((sum, r) => sum + r.totalRecords, 0),
          importedRecords: results.reduce((sum, r) => sum + r.importedRecords, 0),
          failedRecords: results.reduce((sum, r) => sum + r.failedRecords, 0),
          errors: results.flatMap(r => r.errors),
          results
        }
        break
      default:
        return NextResponse.json(
          { error: 'Invalid import type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error('Data import error:', error)
    return NextResponse.json(
      { error: 'Import failed', details: error },
      { status: 500 }
    )
  }
}

// Get import status
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const importId = searchParams.get('importId')

    if (importId) {
      // Get specific import status
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      const importLog = await prisma.dataImport.findUnique({
        where: { id: importId }
      })

      if (!importLog) {
        return NextResponse.json(
          { error: 'Import not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(importLog)
    } else {
      // Get recent imports
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      const imports = await prisma.dataImport.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      return NextResponse.json(imports)
    }
  } catch (error) {
    console.error('Error fetching import status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch import status' },
      { status: 500 }
    )
  }
}