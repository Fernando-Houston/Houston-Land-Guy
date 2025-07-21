// Import script for Data Process folders 1 & 2
import { DataProcess12ImportServiceV2 } from '../lib/services/dataprocess1-2-import-service-v2'

async function importDataProcess12() {
  console.log('🚀 Starting Data Process 1 & 2 Import (Using Existing Schema)...\n')
  
  const importService = new DataProcess12ImportServiceV2()
  const startTime = Date.now()
  
  try {
    console.log('📁 Importing data using existing database models...\n')
    
    // Import all data
    console.log('📁 Importing data from Data Process folders 1 & 2...\n')
    const results = await importService.importAllData()
    
    // Display results
    console.log('\n' + '='.repeat(60))
    console.log('📊 IMPORT RESULTS')
    console.log('='.repeat(60) + '\n')
    
    let totalRecords = 0
    let totalErrors = 0
    
    results.forEach(result => {
      const status = result.success ? '✅' : '❌'
      console.log(`${status} ${result.dataType}:`)
      console.log(`   Records imported: ${result.recordsImported}`)
      
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.length}`)
        result.errors.slice(0, 3).forEach(error => {
          console.log(`     - ${error}`)
        })
        if (result.errors.length > 3) {
          console.log(`     ... and ${result.errors.length - 3} more errors`)
        }
      }
      console.log()
      
      totalRecords += result.recordsImported
      totalErrors += result.errors.length
    })
    
    // Summary
    console.log('='.repeat(60))
    console.log('📋 SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total records imported: ${totalRecords}`)
    console.log(`Total errors: ${totalErrors}`)
    console.log(`Time taken: ${((Date.now() - startTime) / 1000).toFixed(1)} seconds`)
    console.log()
    
    // Count total data points
    console.log('📊 Counting total data points...')
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    
    const counts = await Promise.all([
      prisma.developer.count(),
      prisma.project.count(),
      prisma.permit.count(),
      prisma.marketMetrics.count(),
      prisma.constructionActivity.count(),
      prisma.marketIntelligence.count(),
      prisma.qualityOfLife.count(),
      prisma.marketData.count()
    ])
    
    const totalDataPoints = counts.reduce((sum, count) => sum + count, 0)
    console.log(`\n🎯 Total data points in database: ${totalDataPoints.toLocaleString()}`)
    
    await prisma.$disconnect()
    
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

// Run the import
importDataProcess12().catch(console.error)