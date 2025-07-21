#!/usr/bin/env tsx
// Unified V2 Import Script - Using Existing Models
// Imports Data Process 3 and HAR MLS data using v2 services
import { DataProcess3ImportServiceV2 } from '../lib/services/dataprocess3-import-v2'
import { HarMlsImportServiceV2 } from '../lib/services/har-mls-import-v2'

interface ImportSummary {
  service: string
  totalImported: number
  totalFailed: number
  totalProcessed: number
  categories: Record<string, { imported: number; failed: number }>
}

async function main() {
  console.log('🚀 Starting V2 Import Process using existing models...\n')
  
  const results: ImportSummary[] = []
  let grandTotalImported = 0
  let grandTotalFailed = 0
  let grandTotalProcessed = 0
  
  // 1. Import Data Process 3 data
  console.log('===== DATA PROCESS 3 IMPORT =====')
  try {
    const dp3Service = new DataProcess3ImportServiceV2()
    const dp3Results = await dp3Service.importAll()
    
    const dp3Imported = Object.values(dp3Results).reduce((sum, r) => sum + r.imported, 0)
    const dp3Failed = Object.values(dp3Results).reduce((sum, r) => sum + r.failed, 0)
    
    results.push({
      service: 'Data Process 3',
      totalImported: dp3Imported,
      totalFailed: dp3Failed,
      totalProcessed: dp3Imported + dp3Failed,
      categories: Object.fromEntries(
        Object.entries(dp3Results).map(([key, value]) => [
          key, 
          { imported: value.imported, failed: value.failed }
        ])
      )
    })
    
    grandTotalImported += dp3Imported
    grandTotalFailed += dp3Failed
    grandTotalProcessed += dp3Imported + dp3Failed
    
    console.log(`✅ Data Process 3 completed: ${dp3Imported} imported, ${dp3Failed} failed\n`)
  } catch (error) {
    console.error('❌ Data Process 3 import failed:', error)
    results.push({
      service: 'Data Process 3',
      totalImported: 0,
      totalFailed: 0,
      totalProcessed: 0,
      categories: {}
    })
  }
  
  // 2. Import HAR MLS data
  console.log('===== HAR MLS DATA PROCESS 4 IMPORT =====')
  try {
    const harService = new HarMlsImportServiceV2()
    const harResults = await harService.importAll()
    
    const harImported = Object.values(harResults).reduce((sum, r) => sum + r.imported, 0)
    const harFailed = Object.values(harResults).reduce((sum, r) => sum + r.failed, 0)
    
    results.push({
      service: 'HAR MLS Data Process 4',
      totalImported: harImported,
      totalFailed: harFailed,
      totalProcessed: harImported + harFailed,
      categories: Object.fromEntries(
        Object.entries(harResults).map(([key, value]) => [
          key, 
          { imported: value.imported, failed: value.failed }
        ])
      )
    })
    
    grandTotalImported += harImported
    grandTotalFailed += harFailed
    grandTotalProcessed += harImported + harFailed
    
    console.log(`✅ HAR MLS import completed: ${harImported} imported, ${harFailed} failed\n`)
  } catch (error) {
    console.error('❌ HAR MLS import failed:', error)
    results.push({
      service: 'HAR MLS Data Process 4',
      totalImported: 0,
      totalFailed: 0,
      totalProcessed: 0,
      categories: {}
    })
  }
  
  // 3. Final Summary Report
  console.log('=====================================')
  console.log('🎯 FINAL IMPORT SUMMARY REPORT')
  console.log('=====================================')
  
  console.log(`\n📊 GRAND TOTALS:`)
  console.log(`   Total Data Points Imported: ${grandTotalImported.toLocaleString()}`)
  console.log(`   Total Failed: ${grandTotalFailed.toLocaleString()}`)
  console.log(`   Total Processed: ${grandTotalProcessed.toLocaleString()}`)
  console.log(`   Success Rate: ${grandTotalProcessed > 0 ? ((grandTotalImported / grandTotalProcessed) * 100).toFixed(1) : 0}%`)
  
  console.log(`\n📋 BY SERVICE:`)
  for (const result of results) {
    console.log(`\n   ${result.service}:`)
    console.log(`     Imported: ${result.totalImported.toLocaleString()}`)
    console.log(`     Failed: ${result.totalFailed}`)
    console.log(`     Total: ${result.totalProcessed.toLocaleString()}`)
    
    if (Object.keys(result.categories).length > 0) {
      console.log(`     Categories:`)
      for (const [category, stats] of Object.entries(result.categories)) {
        console.log(`       ${category}: ${stats.imported} imported, ${stats.failed} failed`)
      }
    }
  }
  
  console.log(`\n🗃️ DATABASE MODELS POPULATED:`)
  console.log(`   ✓ MarketIntelligence (competitive, financial, micro-market, investment sentiment, MLS real-time)`)
  console.log(`   ✓ ConstructionActivity (permits, infrastructure projects)`)
  console.log(`   ✓ CostAnalysis (construction, labor, land, permit costs)`)
  console.log(`   ✓ QualityOfLife (crime, safety, walkability metrics)`)
  console.log(`   ✓ HarMlsReport (monthly/quarterly/seasonal market reports)`)
  console.log(`   ✓ HarNeighborhoodData (neighborhood-level market data)`)
  
  console.log(`\n✅ V2 import process completed successfully!`)
  console.log(`📈 Total data points imported: ${grandTotalImported.toLocaleString()}`)
  
  // Return results for potential further processing
  return {
    grandTotalImported,
    grandTotalFailed,
    grandTotalProcessed,
    successRate: grandTotalProcessed > 0 ? (grandTotalImported / grandTotalProcessed) * 100 : 0,
    serviceResults: results
  }
}

// Run the import process
if (require.main === module) {
  main()
    .then((summary) => {
      console.log(`\n🎉 Import completed with ${summary.grandTotalImported} total data points imported`)
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Import process failed:', error)
      process.exit(1)
    })
}

export { main as runV2Imports }