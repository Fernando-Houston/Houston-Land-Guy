#!/usr/bin/env node
import { DataProcess3ImportService } from '../lib/services/dataprocess3-import-service'
import { HarMlsImportService } from '../lib/services/har-mls-import-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting comprehensive data import for DataProcess 3 and HAR MLS...\n')
  
  const startTime = Date.now()
  const results: any = {
    dataProcess3: {},
    harMls: {},
    summary: {
      totalImported: 0,
      totalFailed: 0,
      duration: 0
    }
  }
  
  try {
    // Import DataProcess 3
    console.log('📊 Phase 1: Importing DataProcess 3 data...')
    console.log('=' .repeat(60))
    
    const dp3Service = new DataProcess3ImportService()
    results.dataProcess3 = await dp3Service.importAll()
    
    // Calculate DataProcess 3 totals
    let dp3Imported = 0
    let dp3Failed = 0
    
    Object.values(results.dataProcess3).forEach((result: any) => {
      dp3Imported += result.imported || 0
      dp3Failed += result.failed || 0
    })
    
    console.log(`\n✅ DataProcess 3 import completed:`)
    console.log(`   - Total imported: ${dp3Imported}`)
    console.log(`   - Total failed: ${dp3Failed}`)
    
    // Import HAR MLS Monthly Reports
    console.log('\n\n🏘️ Phase 2: Importing HAR MLS Monthly Reports...')
    console.log('=' .repeat(60))
    
    const harService = new HarMlsImportService()
    results.harMls = await harService.importAll()
    
    // Calculate HAR MLS totals
    let harImported = 0
    let harFailed = 0
    
    Object.values(results.harMls).forEach((result: any) => {
      harImported += result.imported || 0
      harFailed += result.failed || 0
    })
    
    console.log(`\n✅ HAR MLS import completed:`)
    console.log(`   - Total imported: ${harImported}`)
    console.log(`   - Total failed: ${harFailed}`)
    
    // Update summary
    results.summary.totalImported = dp3Imported + harImported
    results.summary.totalFailed = dp3Failed + harFailed
    results.summary.duration = (Date.now() - startTime) / 1000
    
    // Log import summary
    await logImportSummary(results)
    
    // Display final summary
    console.log('\n\n' + '=' .repeat(60))
    console.log('📈 IMPORT SUMMARY')
    console.log('=' .repeat(60))
    console.log(`Total records imported: ${results.summary.totalImported}`)
    console.log(`Total records failed: ${results.summary.totalFailed}`)
    console.log(`Success rate: ${((results.summary.totalImported / (results.summary.totalImported + results.summary.totalFailed)) * 100).toFixed(1)}%`)
    console.log(`Duration: ${results.summary.duration.toFixed(1)} seconds`)
    
    // Display detailed breakdown
    console.log('\n📊 DataProcess 3 Breakdown:')
    Object.entries(results.dataProcess3).forEach(([type, result]: [string, any]) => {
      console.log(`   ${type}: ${result.imported} imported, ${result.failed} failed`)
    })
    
    console.log('\n🏘️ HAR MLS Breakdown:')
    Object.entries(results.harMls).forEach(([month, result]: [string, any]) => {
      console.log(`   ${month}: ${result.imported} imported, ${result.failed} failed`)
    })
    
    // Check import status
    console.log('\n\n📅 Verifying HAR MLS monthly coverage...')
    const harStatus = await harService.getImportStatus()
    console.log('\nMonths with data:')
    harStatus.forEach((status: any) => {
      console.log(`   ${status.month}: ${status.totalSales} sales, $${status.avgPrice.toLocaleString()} avg price, ${status.neighborhoodCount} neighborhoods`)
    })
    
    console.log('\n\n✨ Import process completed successfully!')
    
  } catch (error) {
    console.error('\n\n❌ Import failed:', error)
    results.summary.error = error.message
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Log import summary to database
async function logImportSummary(results: any) {
  try {
    await prisma.dataImport.create({
      data: {
        importType: 'dataprocess3-and-mls',
        source: 'DataProcess 3 & HAR MLS',
        status: results.summary.totalFailed === 0 ? 'completed' : 'completed-with-errors',
        totalRecords: results.summary.totalImported + results.summary.totalFailed,
        processedRecords: results.summary.totalImported,
        failedRecords: results.summary.totalFailed,
        startedAt: new Date(Date.now() - results.summary.duration * 1000),
        completedAt: new Date(),
        metadata: results
      }
    })
  } catch (error) {
    console.error('Failed to log import summary:', error)
  }
}

// Run the import
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})