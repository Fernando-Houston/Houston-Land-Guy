import { HCADApiService } from '../lib/services/hcad-api-service'

async function testHCADAPI() {
  console.log('Testing HCAD API with account number: 0660640130020')
  
  const hcadService = new HCADApiService()
  
  try {
    // Test 1: Get property by account number
    console.log('\n1. Testing getPropertyByAccount...')
    const property = await hcadService.getPropertyByAccount('0660640130020')
    
    if (property) {
      console.log('✓ Property found:')
      console.log(`  - Account: ${property.account}`)
      console.log(`  - Address: ${property.situs_address}`)
      console.log(`  - Owner: ${property.owner}`)
      console.log(`  - Market Value: $${property.market_value?.toLocaleString()}`)
      console.log(`  - Year Built: ${property.year_built}`)
      console.log(`  - Property Type: ${property.property_type}`)
    } else {
      console.log('✗ No property found for account 0660640130020')
    }
    
    // Test 2: Get property value history
    console.log('\n2. Testing getPropertyValueHistory...')
    const valueHistory = await hcadService.getPropertyValueHistory('0660640130020')
    console.log(`✓ Value history entries: ${valueHistory.length}`)
    
    // Test 3: Get tax information
    console.log('\n3. Testing getPropertyTaxInfo...')
    const taxInfo = await hcadService.getPropertyTaxInfo('0660640130020')
    if (taxInfo) {
      console.log('✓ Tax information retrieved')
    } else {
      console.log('✗ No tax information found')
    }
    
    // Test 4: Search properties
    console.log('\n4. Testing searchProperties...')
    const searchResults = await hcadService.searchProperties({ 
      zipCode: '77002', 
      limit: 5 
    })
    console.log(`✓ Found ${searchResults.length} properties in zip code 77002`)
    
    // Test 5: Import to database
    console.log('\n5. Testing importPropertyToDatabase...')
    const imported = await hcadService.importPropertyToDatabase('0660640130020')
    console.log(imported ? '✓ Successfully imported to database' : '✗ Failed to import to database')
    
  } catch (error) {
    console.error('Error during testing:', error)
  }
}

// Run the test
testHCADAPI().catch(console.error)