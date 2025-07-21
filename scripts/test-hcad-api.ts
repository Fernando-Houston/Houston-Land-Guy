#!/usr/bin/env node
// Test HCAD API with specific account number
import { hcadApi } from '../lib/services/hcad-api-service'

async function testHCADAccount(accountNumber: string) {
  console.log(`\n🔍 Testing HCAD API for account: ${accountNumber}`)
  console.log('================================================\n')
  
  try {
    // 1. Get property details
    console.log('1. Fetching property details...')
    const property = await hcadApi.getPropertyByAccount(accountNumber)
    
    if (property) {
      console.log('✅ Property found!')
      console.log('\nProperty Details:')
      console.log(`  Account: ${property.account}`)
      console.log(`  Address: ${property.situs_address || 'N/A'}`)
      console.log(`  City: ${property.city || 'N/A'}`)
      console.log(`  ZIP: ${property.zip || 'N/A'}`)
      console.log(`  Owner: ${property.owner || 'N/A'}`)
      console.log(`  Year Built: ${property.year_built || 'N/A'}`)
      console.log(`  Building Area: ${property.building_area || 'N/A'} sq ft`)
      console.log(`  Land Area: ${property.land_area || 'N/A'} acres`)
      console.log('\nValuation:')
      console.log(`  Land Value: $${property.land_value?.toLocaleString() || 'N/A'}`)
      console.log(`  Improvement Value: $${property.improvement_value?.toLocaleString() || 'N/A'}`)
      console.log(`  Market Value: $${property.market_value?.toLocaleString() || 'N/A'}`)
      console.log(`  Appraised Value: $${property.appraised_value?.toLocaleString() || 'N/A'}`)
      
      // 2. Get value history
      console.log('\n2. Fetching value history...')
      const history = await hcadApi.getPropertyValueHistory(accountNumber)
      
      if (history && history.length > 0) {
        console.log('📈 Value History:')
        history.slice(0, 5).forEach((record: any) => {
          console.log(`  ${record.year || 'N/A'}: $${record.market_value?.toLocaleString() || 'N/A'}`)
        })
      } else {
        console.log('  No value history available')
      }
      
      // 3. Get tax information
      console.log('\n3. Fetching tax information...')
      const taxInfo = await hcadApi.getPropertyTaxInfo(accountNumber)
      
      if (taxInfo) {
        console.log('💰 Tax Information:')
        console.log(`  Taxable Value: $${taxInfo.taxable_value?.toLocaleString() || 'N/A'}`)
        console.log(`  Total Tax: $${taxInfo.total_tax?.toLocaleString() || 'N/A'}`)
        console.log(`  Tax Year: ${taxInfo.tax_year || 'N/A'}`)
      } else {
        console.log('  No tax information available')
      }
      
      // 4. Try to import to database
      console.log('\n4. Testing database import...')
      const imported = await hcadApi.importPropertyToDatabase(accountNumber)
      
      if (imported) {
        console.log('✅ Successfully imported to database!')
      } else {
        console.log('❌ Failed to import to database')
      }
      
    } else {
      console.log('❌ Property not found in HCAD')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('\nNote: HCAD API might be unavailable or the account number might be invalid.')
    console.log('The HCAD public API at pdata.hcad.org may have rate limits or require authentication.')
  }
}

// Run the test
const accountNumber = '0660640130020'
testHCADAccount(accountNumber).catch(console.error)