#!/usr/bin/env npx tsx
// Direct Fernando-X test using integrated data
import { getIntegratedData } from '../lib/fernando-x-data'

async function testFernandoDataAccess() {
  console.log('🤖 Testing Fernando-X Data Access Directly\n')
  
  try {
    console.log('📊 Loading integrated data from database...')
    const data = await getIntegratedData()
    
    console.log('✅ Data loaded successfully!')
    console.log(`   Total data points: ${data.totalDataPoints.toLocaleString()}`)
    
    // Test data structure
    const tests = [
      {
        name: "Developers Count",
        test: () => data.totalDevelopers > 0,
        value: data.totalDevelopers
      },
      {
        name: "Projects Count", 
        test: () => data.totalProjects > 0,
        value: data.totalProjects
      },
      {
        name: "Properties Count",
        test: () => data.propertyStats?.totalProperties > 0,
        value: data.propertyStats?.totalProperties
      },
      {
        name: "Neighborhoods Count",
        test: () => data.totalNeighborhoods > 0,
        value: data.totalNeighborhoods
      },
      {
        name: "Permit Data",
        test: () => data.permitActivity?.totalPermits > 0,
        value: data.permitActivity?.totalPermits
      },
      {
        name: "Market Metrics",
        test: () => data.marketOverview?.currentMetrics?.length > 0,
        value: data.marketOverview?.currentMetrics?.length
      }
    ]
    
    console.log('\n🧪 Testing data completeness:')
    console.log('─'.repeat(40))
    
    let passed = 0
    for (const test of tests) {
      try {
        if (test.test()) {
          console.log(`✅ ${test.name}: ${test.value}`)
          passed++
        } else {
          console.log(`❌ ${test.name}: ${test.value || 'MISSING'}`)
        }
      } catch (error) {
        console.log(`❌ ${test.name}: ERROR - ${error.message}`)
      }
    }
    
    console.log('\n📋 Sample data preview:')
    console.log('─'.repeat(40))
    
    // Top developers
    if (data.developers?.length > 0) {
      console.log(`🏗️ Top Developer: ${data.developers[0].name}`)
    }
    
    // Top projects
    if (data.projects?.length > 0) {
      console.log(`🏢 Major Project: ${data.projects[0].name}`)
    }
    
    // Neighborhoods
    if (data.neighborhoods?.length > 0) {
      const topNeighborhood = data.neighborhoods[0]
      console.log(`🏘️ Sample Neighborhood: ${topNeighborhood.name}`)
    }
    
    console.log('\n' + '='.repeat(50))
    console.log(`🎯 FERNANDO DATA TEST RESULTS: ${passed}/${tests.length} passed`)
    
    if (passed >= tests.length * 0.8) {
      console.log('🎉 Fernando-X has excellent data access!')
    } else if (passed >= tests.length * 0.5) {
      console.log('⚠️ Fernando-X has partial data access')
    } else {
      console.log('🚨 Fernando-X has insufficient data access')
    }
    
    return { passed, total: tests.length }
    
  } catch (error) {
    console.error('❌ Data access failed:', error)
    return { passed: 0, total: 6 }
  }
}

if (require.main === module) {
  testFernandoDataAccess()
    .then((result) => {
      process.exit(result.passed >= result.total * 0.8 ? 0 : 1)
    })
    .catch((error) => {
      console.error('💥 Test failed:', error)
      process.exit(1)
    })
}

export { testFernandoDataAccess }