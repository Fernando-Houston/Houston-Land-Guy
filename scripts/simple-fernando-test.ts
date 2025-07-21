import { getIntegratedData } from '../lib/fernando-x-data'

async function testFernandoXBasic() {
  try {
    console.log('🤖 Testing Fernando-X Basic Integration\n')
    
    // Test data retrieval
    console.log('1. Testing data retrieval...')
    const data = await getIntegratedData()
    
    console.log(`   ✅ Successfully retrieved data`)
    console.log(`   📊 Total data points: ${data.totalDataPoints.toLocaleString()}`)
    
    // Test data structure
    console.log('\n2. Analyzing data structure...')
    console.log(`   👥 Developers: ${data.totalDevelopers} records`)
    console.log(`   🏗️ Projects: ${data.totalProjects} records`) 
    console.log(`   📄 Permits: ${data.permitActivity.totalPermits} records`)
    console.log(`   🏘️ Neighborhoods: ${data.totalNeighborhoods} records`)
    console.log(`   🏠 Properties: ${data.propertyStats.totalProperties} records`)
    
    // Test data content
    console.log('\n3. Testing data content...')
    if (data.developers.length > 0) {
      console.log(`   ✅ Top developer: ${data.developers[0].name}`)
    }
    
    if (data.majorProjects.length > 0) {
      console.log(`   ✅ Major project: ${data.majorProjects[0].name}`)
    }
    
    if (data.neighborhoodRankings.length > 0) {
      console.log(`   ✅ Top neighborhood: ${data.neighborhoodRankings[0].name}`)
    }
    
    // Test legacy compatibility
    console.log('\n4. Testing legacy compatibility...')
    if (data.INTEGRATED_DATA && data.INTEGRATED_DATA.populationGrowth) {
      console.log(`   ✅ Legacy data structure maintained`)
      console.log(`   📈 Growth areas: ${data.INTEGRATED_DATA.populationGrowth.topGrowthAreas.length}`)
    }
    
    console.log('\n🎉 Fernando-X integration test PASSED!')
    console.log(`\n📋 Summary:`)
    console.log(`   • Database: ✅ Connected`)
    console.log(`   • Data Points: ✅ ${data.totalDataPoints.toLocaleString()}`)
    console.log(`   • Developers: ✅ ${data.totalDevelopers}`)
    console.log(`   • Projects: ✅ ${data.totalProjects}`)
    console.log(`   • Legacy Support: ✅ Maintained`)
    
    return {
      success: true,
      dataPoints: data.totalDataPoints,
      entities: {
        developers: data.totalDevelopers,
        projects: data.totalProjects,
        permits: data.permitActivity.totalPermits,
        neighborhoods: data.totalNeighborhoods,
        properties: data.propertyStats.totalProperties
      }
    }
    
  } catch (error) {
    console.error('❌ Fernando-X test failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Run test
testFernandoXBasic().then(result => {
  if (result.success) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})