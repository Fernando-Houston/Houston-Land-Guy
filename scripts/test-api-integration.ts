import { APIIntegrationAgent } from '../lib/agents/api-integration-agent'
import { DataAccuracyAgent } from '../lib/agents/data-accuracy-agent'
import { houstonDataService } from '../lib/services/houston-data-service'

async function testAPIIntegration() {
  console.log('Testing API Integration & Data Accuracy Agents...\n')
  
  const apiAgent = new APIIntegrationAgent()
  const dataAgent = new DataAccuracyAgent()
  
  try {
    // Test 1: Fetch property data from multiple sources
    console.log('1. Testing multi-source property data fetch...')
    const propertyData = await apiAgent.execute({
      action: 'fetchPropertyData',
      params: {
        address: '1234 Main St, Houston, TX 77002',
        accountNumber: '0660640130020'
      }
    })
    
    console.log(`✓ Found ${propertyData.length} data sources`)
    propertyData.forEach((source: any) => {
      console.log(`  - ${source.source}: ${source.status}`)
    })
    
    // Test 2: Validate property data
    console.log('\n2. Testing data validation...')
    const validationResult = await dataAgent.execute({
      action: 'validateProperty',
      params: {
        propertyData: {
          marketValue: 425000,
          buildingArea: 2500,
          yearBuilt: 2010,
          zipCode: '77002'
        }
      }
    })
    
    console.log(`✓ Overall valid: ${validationResult.overallValid}`)
    console.log(`✓ Overall confidence: ${(validationResult.overallConfidence * 100).toFixed(1)}%`)
    validationResult.validations.forEach((v: any) => {
      console.log(`  - ${v.field}: ${v.isValid ? '✓' : '✗'} (${(v.confidence * 100).toFixed(0)}% confidence)`)
    })
    
    // Test 3: Cross-reference data
    console.log('\n3. Testing data cross-reference...')
    const crossRefResult = await dataAgent.execute({
      action: 'crossReference',
      params: {
        sources: [
          { source: 'HCAD', field: 'marketValue', value: 425000, timestamp: new Date(), confidence: 0.9 },
          { source: 'Realtor.com', field: 'marketValue', value: 435000, timestamp: new Date(), confidence: 0.7 },
          { source: 'Houston Open Data', field: 'marketValue', value: 420000, timestamp: new Date(), confidence: 0.8 }
        ]
      }
    })
    
    crossRefResult.forEach((result: any) => {
      console.log(`✓ Field: ${result.field}`)
      console.log(`  - Consensus value: $${result.consensus.toLocaleString()}`)
      console.log(`  - Confidence: ${(result.confidence * 100).toFixed(1)}%`)
      console.log(`  - Recommendation: ${result.recommendation}`)
    })
    
    // Test 4: Fetch market trends
    console.log('\n4. Testing market trends fetch...')
    const marketTrends = await apiAgent.execute({
      action: 'fetchMarketTrends',
      params: { zipCode: '77008', timeframe: '12months' }
    })
    
    console.log(`✓ Market data for ${marketTrends.zipCode}:`)
    console.log(`  - Median price: $${marketTrends.aggregated.medianPrice.toLocaleString()}`)
    console.log(`  - Price change: ${marketTrends.aggregated.priceChange}%`)
    console.log(`  - Inventory: ${marketTrends.aggregated.inventory} homes`)
    console.log(`  - Days on market: ${marketTrends.aggregated.daysOnMarket}`)
    
    // Test 5: Detect anomalies
    console.log('\n5. Testing anomaly detection...')
    const testDataset = [
      { price: 425000 }, { price: 450000 }, { price: 435000 },
      { price: 440000 }, { price: 1200000 }, { price: 428000 }
    ]
    
    const anomalies = await dataAgent.execute({
      action: 'detectAnomalies',
      params: { dataset: testDataset, field: 'price' }
    })
    
    if (anomalies.length > 0) {
      console.log(`✓ Found ${anomalies.length} anomalies:`)
      anomalies.forEach((a: any) => {
        console.log(`  - Value $${a.actualValue.toLocaleString()} outside expected range`)
        console.log(`    Expected: $${a.expectedRange.min.toLocaleString()} - $${a.expectedRange.max.toLocaleString()}`)
        console.log(`    Severity: ${a.severity}`)
      })
    } else {
      console.log('✓ No anomalies detected')
    }
    
    // Test 6: Houston Data Service integration
    console.log('\n6. Testing Houston Data Service with live data...')
    const marketData = await houstonDataService.getMarketData('77008')
    if (marketData) {
      console.log('✓ Market data retrieved:')
      console.log(`  - ${marketData.neighborhood}: $${marketData.medianPrice.toLocaleString()}`)
      console.log(`  - Status: ${marketData.marketStatus}`)
      console.log(`  - Investment appeal: ${marketData.investmentAppeal}/10`)
    }
    
    // Test 7: Get live property data
    console.log('\n7. Testing live property data with validation...')
    const liveData = await houstonDataService.getLivePropertyData(
      '1234 Main St, Houston, TX 77002',
      '0660640130020'
    )
    
    if (liveData) {
      console.log(`✓ Live data retrieved with ${(liveData.confidence * 100).toFixed(1)}% confidence`)
      console.log(`  - Sources: ${liveData.sources.length}`)
      console.log(`  - Validated fields: ${liveData.validated.length}`)
    }
    
  } catch (error) {
    console.error('Error during testing:', error)
  }
}

// Run the test
testAPIIntegration().catch(console.error)