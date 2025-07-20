// Script to import initial data into the database
// Run with: npx tsx scripts/import-initial-data.ts

import { dataImportService } from '../lib/services/data-import-service'

async function importAllData() {
  console.log('🚀 Starting data import process...')
  
  try {
    // Import developers
    console.log('\n📊 Importing developers...')
    const developerResult = await dataImportService.importDevelopers()
    console.log(`✅ Developers: ${developerResult.importedRecords}/${developerResult.totalRecords} imported`)
    if (developerResult.errors.length > 0) {
      console.log('⚠️  Errors:', developerResult.errors)
    }

    // Import projects
    console.log('\n🏗️  Importing major projects...')
    const projectResult = await dataImportService.importProjects()
    console.log(`✅ Projects: ${projectResult.importedRecords}/${projectResult.totalRecords} imported`)
    if (projectResult.errors.length > 0) {
      console.log('⚠️  Errors:', projectResult.errors)
    }

    // Import market metrics
    console.log('\n📈 Importing market metrics...')
    const marketResult = await dataImportService.importMarketMetrics()
    console.log(`✅ Market metrics: ${marketResult.importedRecords}/${marketResult.totalRecords} imported`)
    if (marketResult.errors.length > 0) {
      console.log('⚠️  Errors:', marketResult.errors)
    }

    // Import sample properties
    console.log('\n🏠 Importing sample properties...')
    const propertyResult = await dataImportService.importSampleProperties()
    console.log(`✅ Properties: ${propertyResult.importedRecords}/${propertyResult.totalRecords} imported`)
    if (propertyResult.errors.length > 0) {
      console.log('⚠️  Errors:', propertyResult.errors)
    }

    // Summary
    console.log('\n📋 Import Summary:')
    console.log('==================')
    console.log(`Developers: ${developerResult.importedRecords}`)
    console.log(`Projects: ${projectResult.importedRecords}`)
    console.log(`Market Metrics: ${marketResult.importedRecords}`)
    console.log(`Properties: ${propertyResult.importedRecords}`)
    console.log(`Total Records: ${
      developerResult.importedRecords + 
      projectResult.importedRecords + 
      marketResult.importedRecords + 
      propertyResult.importedRecords
    }`)
    
    console.log('\n✅ Data import completed successfully!')
    console.log('Fernando-X can now query real data from the database.')
    
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

// Run the import
importAllData()