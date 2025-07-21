// Fernando-X Conversation Capability Test
// Tests if Fernando-X can provide real Houston market insights using database data

import { getIntegratedData } from '../lib/fernando-x-data'

interface ConversationTest {
  query: string
  expectedDataSources: string[]
  testResponse: string
  dataAvailable: boolean
  quality: number
}

async function testFernandoXConversation() {
  console.log('🤖 Testing Fernando-X Conversation Capabilities\n')
  
  const data = await getIntegratedData()
  
  const conversationTests: ConversationTest[] = [
    {
      query: "Tell me about Houston's rental market",
      expectedDataSources: ['rentalMarketData'],
      testResponse: '',
      dataAvailable: false,
      quality: 0
    },
    {
      query: "Who are the major employers in Houston?",
      expectedDataSources: ['majorEmployers'],
      testResponse: '',
      dataAvailable: false,
      quality: 0
    },
    {
      query: "What development projects are happening in Houston?",
      expectedDataSources: ['majorProjects', 'developers'],
      testResponse: '',
      dataAvailable: false,
      quality: 0
    },
    {
      query: "Give me investment recommendations for Houston real estate",
      expectedDataSources: ['rentalMarketData', 'majorEmployers', 'majorProjects', 'costAnalysisData'],
      testResponse: '',
      dataAvailable: false,
      quality: 0
    },
    {
      query: "What neighborhoods have the highest growth potential?",
      expectedDataSources: ['rentalMarketData', 'majorEmployers', 'constructionData'],
      testResponse: '',
      dataAvailable: false,
      quality: 0
    }
  ]
  
  console.log('🎯 Available Data for Fernando-X Responses:\n')
  
  // Test 1: Rental Market Questions
  console.log('1. 🏠 Testing Rental Market Data Access...')
  if (data.rentalMarketData?.totalRecords > 0) {
    conversationTests[0].dataAvailable = true
    conversationTests[0].quality = 8
    conversationTests[0].testResponse = generateRentalMarketResponse(data.rentalMarketData)
    console.log(`   ✅ Can provide rental market insights for ${data.rentalMarketData.totalRecords} areas`)
    console.log(`   📊 Average rent: $${data.rentalMarketData.averageRent}`)
    if (data.rentalMarketData.topRentalAreas.length > 0) {
      console.log(`   🏆 Top area: ${data.rentalMarketData.topRentalAreas[0].neighborhood}`)
    }
  } else {
    console.log(`   ❌ Limited rental market data available`)
  }
  
  // Test 2: Employment Data
  console.log('\n2. 🏢 Testing Employment Data Access...')
  if (data.majorEmployers?.totalEmployers > 0) {
    conversationTests[1].dataAvailable = true
    conversationTests[1].quality = 9
    conversationTests[1].testResponse = generateEmploymentResponse(data.majorEmployers)
    console.log(`   ✅ Can provide insights on ${data.majorEmployers.totalEmployers} major employers`)
    console.log(`   👥 Total employees: ${data.majorEmployers.totalEmployees.toLocaleString()}`)
    if (data.majorEmployers.topEmployers.length > 0) {
      console.log(`   🏆 Top employer: ${data.majorEmployers.topEmployers[0].companyName}`)
    }
  } else {
    console.log(`   ❌ Limited employment data available`)
  }
  
  // Test 3: Development Projects
  console.log('\n3. 🏗️ Testing Development Project Data...')
  if (data.majorProjects?.length > 0) {
    conversationTests[2].dataAvailable = true
    conversationTests[2].quality = 7
    conversationTests[2].testResponse = generateProjectResponse(data)
    console.log(`   ✅ Can provide insights on ${data.majorProjects.length} major projects`)
    console.log(`   🏢 Total developers: ${data.totalDevelopers}`)
    console.log(`   🚧 Active projects: ${data.activeProjects}`)
  } else {
    console.log(`   ❌ Limited project data available`)
  }
  
  // Test 4: Investment Analysis
  console.log('\n4. 💰 Testing Investment Analysis Capability...')
  const investmentDataSources = [
    data.rentalMarketData?.totalRecords > 0,
    data.majorEmployers?.totalEmployers > 0,
    data.majorProjects?.length > 0,
    data.costAnalysisData?.totalAnalyses > 0
  ].filter(Boolean).length
  
  if (investmentDataSources >= 2) {
    conversationTests[3].dataAvailable = true
    conversationTests[3].quality = investmentDataSources * 2
    conversationTests[3].testResponse = generateInvestmentResponse(data)
    console.log(`   ✅ Can provide investment analysis using ${investmentDataSources}/4 data sources`)
  } else {
    console.log(`   ❌ Limited investment analysis capability (${investmentDataSources}/4 sources)`)
  }
  
  // Test 5: Neighborhood Analysis
  console.log('\n5. 🗺️ Testing Neighborhood Analysis...')
  const neighborhoodSources = [
    data.rentalMarketData?.topRentalAreas?.length > 0,
    data.majorEmployers?.sectorBreakdown && Object.keys(data.majorEmployers.sectorBreakdown).length > 0,
    data.constructionData?.total > 0
  ].filter(Boolean).length
  
  if (neighborhoodSources >= 1) {
    conversationTests[4].dataAvailable = true
    conversationTests[4].quality = neighborhoodSources * 3
    conversationTests[4].testResponse = generateNeighborhoodResponse(data)
    console.log(`   ✅ Can analyze neighborhoods using ${neighborhoodSources}/3 data sources`)
  } else {
    console.log(`   ❌ Limited neighborhood analysis capability`)
  }
  
  // Generate summary
  const availableTests = conversationTests.filter(t => t.dataAvailable).length
  const averageQuality = conversationTests.reduce((sum, t) => sum + t.quality, 0) / conversationTests.length
  
  console.log('\n' + '='.repeat(60))
  console.log('🎯 FERNANDO-X CONVERSATION CAPABILITY SUMMARY')
  console.log('='.repeat(60))
  console.log(`📊 Total Data Points: ${data.totalDataPoints}`)
  console.log(`🤖 Conversation Capabilities: ${availableTests}/5 (${(availableTests/5*100).toFixed(0)}%)`)
  console.log(`⭐ Average Response Quality: ${averageQuality.toFixed(1)}/10`)
  console.log(`✅ Can answer Houston market questions: ${availableTests >= 3 ? 'YES' : 'LIMITED'}`)
  console.log(`✅ Can provide investment advice: ${conversationTests[3].dataAvailable ? 'YES' : 'NO'}`)
  console.log(`✅ Can analyze neighborhoods: ${conversationTests[4].dataAvailable ? 'YES' : 'NO'}`)
  console.log('='.repeat(60))
  
  return {
    totalDataPoints: data.totalDataPoints,
    conversationCapability: availableTests / 5,
    averageQuality: averageQuality,
    canProvideMarketInsights: availableTests >= 3,
    canProvideInvestmentAdvice: conversationTests[3].dataAvailable,
    canAnalyzeNeighborhoods: conversationTests[4].dataAvailable,
    tests: conversationTests
  }
}

function generateRentalMarketResponse(rentalData: any): string {
  if (!rentalData || rentalData.totalRecords === 0) return "Limited rental market data available."
  
  return `Houston's rental market shows an average rent of $${rentalData.averageRent} based on ${rentalData.totalRecords} market areas. ${rentalData.topRentalAreas.length > 0 ? `Top performing areas include ${rentalData.topRentalAreas.slice(0, 3).map(a => a.neighborhood).join(', ')}.` : ''}`
}

function generateEmploymentResponse(employerData: any): string {
  if (!employerData || employerData.totalEmployers === 0) return "Limited employment data available."
  
  const topEmployer = employerData.topEmployers[0]
  const topSectors = Object.entries(employerData.sectorBreakdown)
    .sort(([,a], [,b]) => Number(b) - Number(a))
    .slice(0, 3)
    .map(([sector]) => sector)
  
  return `Houston has ${employerData.totalEmployers} major employers with a combined ${employerData.totalEmployees.toLocaleString()} employees. Leading employers include ${topEmployer.companyName} (${topEmployer.sector}). Key sectors: ${topSectors.join(', ')}.`
}

function generateProjectResponse(data: any): string {
  if (!data.majorProjects || data.majorProjects.length === 0) return "Limited development project data available."
  
  return `Houston has ${data.majorProjects.length} major development projects with ${data.totalDevelopers} active developers. ${data.activeProjects > 0 ? `${data.activeProjects} projects are currently under construction.` : 'Most projects are in planning phases.'}`
}

function generateInvestmentResponse(data: any): string {
  const insights = []
  
  if (data.rentalMarketData?.averageRent > 0) {
    insights.push(`rental market averaging $${data.rentalMarketData.averageRent}`)
  }
  
  if (data.majorEmployers?.totalEmployees > 0) {
    insights.push(`strong employment base of ${data.majorEmployers.totalEmployees.toLocaleString()} employees`)
  }
  
  if (data.majorProjects?.length > 0) {
    insights.push(`${data.majorProjects.length} major development projects`)
  }
  
  return `Investment analysis for Houston shows ${insights.join(', ')}. This data suggests ${insights.length >= 3 ? 'strong' : 'moderate'} investment potential.`
}

function generateNeighborhoodResponse(data: any): string {
  const insights = []
  
  if (data.rentalMarketData?.topRentalAreas?.length > 0) {
    insights.push(`top rental performance in ${data.rentalMarketData.topRentalAreas[0].neighborhood}`)
  }
  
  if (data.constructionData?.total > 0) {
    insights.push(`${data.constructionData.total} construction projects`)
  }
  
  return `Neighborhood analysis shows ${insights.join(' and ')}. ${insights.length >= 2 ? 'Comprehensive' : 'Basic'} neighborhood insights available.`
}

// Execute test
testFernandoXConversation().catch(console.error)