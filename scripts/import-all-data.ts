#!/usr/bin/env node
// Script to import all Data Process 5 data and HCAD samples
// Run with: npm run import-data

import { dataProcess5Import } from '../lib/services/dataprocess5-import-service'
import { hcadApi } from '../lib/services/hcad-api-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function importAllData() {
  console.log('🚀 Starting comprehensive data import...')
  console.log('This will import all Data Process 5 CSV files and sample HCAD data.')
  console.log('----------------------------------------\n')
  
  try {
    // 1. Import all Data Process 5 data
    console.log('📊 Importing Data Process 5...')
    const dp5Results = await dataProcess5Import.importAll()
    
    console.log('\nData Process 5 Results:')
    Object.entries(dp5Results).forEach(([category, result]) => {
      console.log(`  ${category}: ${result.imported} imported, ${result.failed} failed`)
      if (result.errors && result.errors.length > 0) {
        console.log(`    Errors: ${result.errors.slice(0, 3).join('; ')}`)
      }
    })
    
    // 2. Import sample HCAD data for key ZIP codes
    console.log('\n🏠 Importing HCAD sample data...')
    const zipCodes = ['77019', '77006', '77007', '77024', '77056'] // Key Houston areas
    
    for (const zip of zipCodes) {
      console.log(`  Importing properties for ${zip}...`)
      const result = await hcadApi.importAreaProperties(zip, 20) // 20 properties per ZIP
      console.log(`    ${result.imported} imported, ${result.failed} failed`)
    }
    
    // 3. Get final database stats
    console.log('\n📈 Final Database Statistics:')
    const stats = await getDatabaseStats()
    console.log(`  Total Properties: ${stats.properties}`)
    console.log(`  Rental Markets: ${stats.rentalMarkets}`)
    console.log(`  Demographics: ${stats.demographics}`)
    console.log(`  Employers: ${stats.employers}`)
    console.log(`  STR Markets: ${stats.strMarkets}`)
    console.log(`  HCAD Properties: ${stats.hcadProperties}`)
    
    console.log('\n✅ Import completed successfully!')
    
  } catch (error) {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function getDatabaseStats() {
  const [
    properties,
    rentalMarkets,
    demographics,
    employers,
    strMarkets,
    hcadProperties
  ] = await Promise.all([
    prisma.property.count(),
    prisma.rentalMarket.count(),
    prisma.areaDemographics.count(),
    prisma.employer.count(),
    prisma.sTRMarket.count(),
    prisma.hCADProperty.count()
  ])
  
  return {
    properties,
    rentalMarkets,
    demographics,
    employers,
    strMarkets,
    hcadProperties
  }
}

// Run the import
importAllData().catch(console.error)