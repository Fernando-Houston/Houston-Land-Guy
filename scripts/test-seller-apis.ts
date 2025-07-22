#!/usr/bin/env tsx

// Test script to validate all seller APIs are working
console.log('🧪 Testing Seller APIs...')
console.log('=' .repeat(60))

const API_BASE = 'http://localhost:3000/api/sellers'

interface APITest {
  name: string
  endpoint: string
  method: 'GET' | 'POST'
  body?: any
  expectedKeys: string[]
}

const tests: APITest[] = [
  {
    name: 'Market Timing API',
    endpoint: `${API_BASE}/market-timing`,
    method: 'GET',
    expectedKeys: ['currentMarket', 'priceTrends', 'seasonalPatterns', 'recommendations']
  },
  {
    name: 'Buyer Demand API', 
    endpoint: `${API_BASE}/demand`,
    method: 'GET',
    expectedKeys: ['demandByArea', 'searchTrends', 'priceWillingness', 'heatMapData']
  },
  {
    name: 'Property Valuation API',
    endpoint: `${API_BASE}/valuation`,
    method: 'POST',
    body: {
      address: '123 Main St, Houston, TX',
      neighborhood: 'Heights',
      squareFeet: 2000,
      bedrooms: 3,
      bathrooms: 2
    },
    expectedKeys: ['valuation', 'confidenceScore', 'comparables', 'marketInsights']
  }
]

async function runTests() {
  let passed = 0
  let failed = 0
  
  for (const test of tests) {
    console.log(`\n🔍 Testing: ${test.name}`)
    console.log(`   ${test.method} ${test.endpoint}`)
    
    try {
      const options: RequestInit = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      }
      
      if (test.body) {
        options.body = JSON.stringify(test.body)
      }
      
      const response = await fetch(test.endpoint, options)
      const data = await response.json()
      
      if (!response.ok) {
        console.log(`   ❌ HTTP ${response.status}: ${data.error || 'Unknown error'}`)
        failed++
        continue
      }
      
      // Check for expected keys in response
      const missingKeys = test.expectedKeys.filter(key => !(key in data.data))
      
      if (missingKeys.length > 0) {
        console.log(`   ❌ Missing keys: ${missingKeys.join(', ')}`)
        failed++
      } else {
        console.log(`   ✅ All expected keys present`)
        console.log(`   📊 Response size: ${JSON.stringify(data).length} bytes`)
        passed++
      }
      
    } catch (error) {
      console.log(`   ❌ Network error: ${error}`)
      failed++
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🧪 API TEST SUMMARY:')
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📊 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)
  
  if (passed === tests.length) {
    console.log('\n🎉 ALL APIS READY FOR TERMINAL 1 INTEGRATION!')
  } else {
    console.log('\n⚠️  Some APIs need attention before integration')
  }
  
  console.log('='.repeat(60))
}

// Only run if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error)
}

export { runTests }