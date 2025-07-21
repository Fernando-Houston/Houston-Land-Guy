#!/usr/bin/env node
// Test HCAD Web Scraper with account number
import { hcadScraper } from '../lib/services/hcad-web-scraper'

async function testHCADScraper(accountNumber: string) {
  console.log(`\n🔍 Testing HCAD Web Scraper for account: ${accountNumber}`)
  console.log('================================================\n')
  
  try {
    // 1. Get property details
    console.log('1. Fetching property details from HCAD website...')
    const property = await hcadScraper.getPropertyByAccount(accountNumber)
    
    if (property) {
      console.log('✅ Property data retrieved!')
      console.log('\nProperty Details:')
      console.log(`  Account: ${property.accountNumber}`)
      console.log(`  Owner: ${property.ownerName || 'N/A'}`)
      console.log(`  Address: ${property.siteAddress || 'N/A'}`)
      console.log(`  Year Built: ${property.yearBuilt || 'N/A'}`)
      console.log(`  Building Area: ${property.buildingArea || 'N/A'} sq ft`)
      console.log('\nValuation:')
      console.log(`  Land Value: $${property.landValue?.toLocaleString() || 'N/A'}`)
      console.log(`  Improvement Value: $${property.improvementValue?.toLocaleString() || 'N/A'}`)
      console.log(`  Market Value: $${property.marketValue?.toLocaleString() || 'N/A'}`)
      
      // 2. Try to import to database
      console.log('\n2. Testing database import...')
      const imported = await hcadScraper.importPropertyToDatabase(accountNumber)
      
      if (imported) {
        console.log('✅ Successfully imported to database!')
      } else {
        console.log('❌ Failed to import to database')
      }
      
    } else {
      console.log('❌ Could not retrieve property data')
      console.log('\nNote: This might be due to:')
      console.log('  - Invalid account number')
      console.log('  - HCAD website structure changes')
      console.log('  - Network/access issues')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the test
const accountNumber = '0660640130020'
testHCADScraper(accountNumber).catch(console.error)