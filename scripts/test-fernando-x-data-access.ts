// Test Fernando-X Data Access
import { getIntegratedData } from '../lib/fernando-x-data'

async function testFernandoXDataAccess() {
  try {
    console.log('🤖 Testing Fernando-X Data Access...\n')
    
    const data = await getIntegratedData()
    
    console.log('📊 Fernando-X Accessible Data:')
    console.log(`   Total Data Points: ${data.totalDataPoints}`)
    console.log(`   Last Updated: ${data.lastUpdated}`)
    
    console.log('\n🏗️ Core Data:')
    console.log(`   Developers: ${data.totalDevelopers}`)
    console.log(`   Projects: ${data.totalProjects}`)
    console.log(`   Active Projects: ${data.activeProjects}`)
    
    console.log('\n🏠 Data Process 5 Integration:')
    console.log(`   Rental Market Records: ${data.rentalMarketData?.totalRecords || 0}`)
    console.log(`   Average Rent: $${data.rentalMarketData?.averageRent || 0}`)
    console.log(`   Top Rental Areas: ${data.rentalMarketData?.topRentalAreas?.length || 0}`)
    
    console.log(`   Major Employers: ${data.majorEmployers?.totalEmployers || 0}`)
    console.log(`   Total Employees: ${data.majorEmployers?.totalEmployees || 0}`)
    console.log(`   Top Employers: ${data.majorEmployers?.topEmployers?.length || 0}`)
    
    console.log(`   STR Total Listings: ${data.strMarketData?.totalListings || 0}`)
    console.log(`   STR Avg Daily Rate: $${data.strMarketData?.averageDailyRate || 0}`)
    console.log(`   STR Top Areas: ${data.strMarketData?.topPerformingAreas?.length || 0}`)
    
    // Check if Data Process 5 is properly integrated
    const hasDP5Integration = Boolean(
      data.rentalMarketData?.totalRecords &&
      data.majorEmployers?.totalEmployers &&
      data.strMarketData?.totalListings
    )
    
    console.log(`\n🎯 Data Process 5 Status: ${hasDP5Integration ? '✅ ACTIVE' : '❌ INACTIVE'}`)
    
    if (hasDP5Integration) {
      console.log('\n📈 Sample Real Estate Intelligence:')
      if (data.rentalMarketData?.topRentalAreas?.length > 0) {
        const topArea = data.rentalMarketData.topRentalAreas[0]
        console.log(`   Top Rental Area: ${topArea.neighborhood} - $${topArea.avgRent2BR}/month`)
      }
      
      if (data.majorEmployers?.topEmployers?.length > 0) {
        const topEmployer = data.majorEmployers.topEmployers[0]
        console.log(`   Top Employer: ${topEmployer.companyName} (${topEmployer.employeeCount} employees)`)
      }
      
      if (data.strMarketData?.topPerformingAreas?.length > 0) {
        const topSTR = data.strMarketData.topPerformingAreas[0]
        console.log(`   Top STR Area: ${topSTR.neighborhood} - $${topSTR.avgDailyRate}/night`)
      }
    }
    
    return {
      totalDataPoints: data.totalDataPoints,
      dataProcess5Active: hasDP5Integration,
      rentalMarketRecords: data.rentalMarketData?.totalRecords || 0,
      employerRecords: data.majorEmployers?.totalEmployers || 0,
      strRecords: data.strMarketData?.totalListings || 0
    }
    
  } catch (error) {
    console.error('❌ Error testing Fernando-X data access:', error)
    return null
  }
}

testFernandoXDataAccess()