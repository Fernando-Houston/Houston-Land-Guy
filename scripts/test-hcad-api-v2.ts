import { HCADApiServiceV2 } from '../lib/services/hcad-api-service-v2'

async function testHCADAPIV2() {
  console.log('Testing HCAD API V2 with account number: 0660640130020')
  
  const hcadService = new HCADApiServiceV2()
  
  try {
    // Test 1: Get property by account number
    console.log('\n1. Testing getPropertyByAccount...')
    const property = await hcadService.getPropertyByAccount('0660640130020')
    
    if (property) {
      console.log('✓ Property found:')
      console.log(`  - Account: ${property.account}`)
      console.log(`  - Owner: ${property.owner_name}`)
      console.log(`  - Address: ${property.situs_num} ${property.situs_street}`)
      console.log(`  - City: ${property.situs_city}`)
      console.log(`  - Zip: ${property.situs_zip}`)
      console.log(`  - Market Value: $${property.total_market_value}`)
      console.log(`  - Appraised Value: $${property.total_appraised_value}`)
      console.log(`  - Building Area: ${property.total_building_area} sqft`)
      console.log(`  - Land Area: ${property.land_sqft} sqft`)
    } else {
      console.log('✗ No property found for account 0660640130020')
    }
    
    // Test 2: Get building information
    console.log('\n2. Testing getBuildingInfo...')
    const buildingInfo = await hcadService.getBuildingInfo('0660640130020')
    console.log(`✓ Building info entries: ${buildingInfo.length}`)
    if (buildingInfo.length > 0) {
      const building = buildingInfo[0]
      console.log(`  - Year Built: ${building.year_built}`)
      console.log(`  - Building Value: $${building.building_value}`)
      console.log(`  - Building Style: ${building.building_style_code}`)
    }
    
    // Test 3: Search properties in zip code 77002
    console.log('\n3. Testing searchProperties...')
    const searchResults = await hcadService.searchProperties({ 
      zipCode: '77002', 
      limit: 5 
    })
    console.log(`✓ Found ${searchResults.length} properties in zip code 77002`)
    if (searchResults.length > 0) {
      console.log('  First property:')
      console.log(`    - Account: ${searchResults[0].account}`)
      console.log(`    - Owner: ${searchResults[0].owner_name}`)
      console.log(`    - Address: ${searchResults[0].situs_num} ${searchResults[0].situs_street}`)
    }
    
    // Test 4: Get area statistics
    console.log('\n4. Testing getAreaStats...')
    const stats = await hcadService.getAreaStats('77002')
    if (stats) {
      console.log('✓ Area statistics for 77002:')
      console.log(`  - Total Properties: ${stats.totalProperties}`)
      console.log(`  - Average Market Value: $${stats.avgMarketValue.toLocaleString()}`)
      console.log(`  - Median Market Value: $${stats.medianMarketValue.toLocaleString()}`)
      console.log(`  - Total Market Value: $${stats.totalMarketValue.toLocaleString()}`)
      console.log(`  - Average Building Area: ${stats.avgBuildingArea} sqft`)
    }
    
    // Test 5: Import to database
    console.log('\n5. Testing importPropertyToDatabase...')
    const imported = await hcadService.importPropertyToDatabase('0660640130020')
    console.log(imported ? '✓ Successfully imported to database' : '✗ Failed to import to database')
    
  } catch (error) {
    console.error('Error during testing:', error)
  }
}

// Run the test
testHCADAPIV2().catch(console.error)