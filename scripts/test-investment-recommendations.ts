// Test Fernando-X Investment Recommendations with Actual Data
// Validates that investment advice uses real database information

import { getIntegratedData } from '../lib/fernando-x-data'

interface InvestmentRecommendation {
  recommendation: string
  dataSource: string
  confidence: number
  actualData: any
}

async function testInvestmentRecommendations() {
  console.log('💰 Testing Fernando-X Investment Recommendations\n')
  
  const data = await getIntegratedData()
  const recommendations: InvestmentRecommendation[] = []
  
  console.log('🔍 Analyzing Available Investment Data...\n')
  
  // Test 1: Rental Market Investment Analysis
  console.log('1. 🏠 Rental Market Investment Analysis')
  if (data.rentalMarketData?.totalRecords > 0) {
    const rentalAnalysis = analyzeRentalInvestment(data.rentalMarketData)
    recommendations.push(rentalAnalysis)
    console.log(`   ✅ ${rentalAnalysis.recommendation}`)
    console.log(`   📊 Based on ${data.rentalMarketData.totalRecords} market areas`)
    console.log(`   📈 Confidence: ${rentalAnalysis.confidence}%`)
  } else {
    console.log(`   ❌ Insufficient rental market data`)
  }
  
  // Test 2: Employment-Based Investment Analysis  
  console.log('\n2. 🏢 Employment-Based Investment Analysis')
  if (data.majorEmployers?.totalEmployers > 0) {
    const employmentAnalysis = analyzeEmploymentInvestment(data.majorEmployers)
    recommendations.push(employmentAnalysis)
    console.log(`   ✅ ${employmentAnalysis.recommendation}`)
    console.log(`   👥 Based on ${data.majorEmployers.totalEmployers} major employers`)
    console.log(`   📈 Confidence: ${employmentAnalysis.confidence}%`)
  } else {
    console.log(`   ❌ Insufficient employment data`)
  }
  
  // Test 3: Development Project Investment Analysis
  console.log('\n3. 🏗️ Development Project Investment Analysis')
  if (data.majorProjects?.length > 0) {
    const projectAnalysis = analyzeProjectInvestment(data)
    recommendations.push(projectAnalysis)
    console.log(`   ✅ ${projectAnalysis.recommendation}`)
    console.log(`   🏗️ Based on ${data.majorProjects.length} major projects`)
    console.log(`   📈 Confidence: ${projectAnalysis.confidence}%`)
  } else {
    console.log(`   ❌ Insufficient project data`)
  }
  
  // Test 4: Market Trends Investment Analysis
  console.log('\n4. 📈 Market Trends Investment Analysis')
  if (data.marketStats) {
    const trendsAnalysis = analyzeTrendsInvestment(data.marketStats)
    recommendations.push(trendsAnalysis)
    console.log(`   ✅ ${trendsAnalysis.recommendation}`)
    console.log(`   📊 Based on current market statistics`)
    console.log(`   📈 Confidence: ${trendsAnalysis.confidence}%`)
  } else {
    console.log(`   ❌ Insufficient market trend data`)
  }
  
  // Test 5: Integrated Investment Recommendation
  console.log('\n5. 🎯 Comprehensive Investment Strategy')
  if (recommendations.length >= 2) {
    const integratedRecommendation = generateIntegratedRecommendation(recommendations, data)
    console.log(`   ✅ ${integratedRecommendation.recommendation}`)
    console.log(`   🔗 Based on ${recommendations.length} data sources`)
    console.log(`   📈 Overall Confidence: ${integratedRecommendation.confidence}%`)
    
    recommendations.push(integratedRecommendation)
  } else {
    console.log(`   ❌ Insufficient data for comprehensive strategy`)
  }
  
  // Validation Summary
  console.log('\n' + '='.repeat(60))
  console.log('🎯 INVESTMENT RECOMMENDATION VALIDATION')
  console.log('='.repeat(60))
  console.log(`📊 Total Data Points Used: ${data.totalDataPoints}`)
  console.log(`💡 Recommendations Generated: ${recommendations.length}`)
  console.log(`📈 Average Confidence: ${(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length).toFixed(1)}%`)
  console.log(`✅ Uses Real Database Data: ${recommendations.length > 0 ? 'YES' : 'NO'}`)
  console.log(`✅ Investment Ready: ${recommendations.length >= 3 ? 'YES' : 'LIMITED'}`)
  
  // Detailed recommendation summary
  if (recommendations.length > 0) {
    console.log('\n📋 Summary of Investment Recommendations:')
    recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec.dataSource}: ${rec.recommendation.substring(0, 80)}...`)
    })
  }
  
  console.log('='.repeat(60))
  
  return {
    totalRecommendations: recommendations.length,
    averageConfidence: recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length,
    dataPointsUsed: data.totalDataPoints,
    investmentReady: recommendations.length >= 3,
    recommendations
  }
}

function analyzeRentalInvestment(rentalData: any): InvestmentRecommendation {
  const avgRent = rentalData.averageRent || 0
  const totalAreas = rentalData.totalRecords || 0
  const topAreas = rentalData.topRentalAreas || []
  
  let recommendation = ""
  let confidence = 60
  
  if (avgRent > 1500) {
    recommendation = `Strong rental market with $${avgRent} average rent across ${totalAreas} areas suggests good rental investment potential.`
    confidence = 75
  } else if (avgRent > 1000) {
    recommendation = `Moderate rental market at $${avgRent} average indicates selective rental investment opportunities.`
    confidence = 65
  } else {
    recommendation = `Lower rental rates at $${avgRent} may indicate emerging market opportunities.`
    confidence = 50
  }
  
  if (topAreas.length > 0) {
    recommendation += ` Focus on ${topAreas[0].neighborhood} area with highest performance.`
    confidence += 10
  }
  
  return {
    recommendation,
    dataSource: "Rental Market Analysis",
    confidence: Math.min(confidence, 90),
    actualData: { avgRent, totalAreas, topPerformer: topAreas[0]?.neighborhood }
  }
}

function analyzeEmploymentInvestment(employerData: any): InvestmentRecommendation {
  const totalEmployers = employerData.totalEmployers || 0
  const totalEmployees = employerData.totalEmployees || 0
  const topEmployer = employerData.topEmployers?.[0]
  const sectors = Object.keys(employerData.sectorBreakdown || {})
  
  let recommendation = ""
  let confidence = 70
  
  if (totalEmployees > 100000) {
    recommendation = `Strong employment base with ${totalEmployees.toLocaleString()} employees across ${totalEmployers} major employers supports residential and commercial investment.`
    confidence = 80
  } else {
    recommendation = `Growing employment market with ${totalEmployees.toLocaleString()} employees indicates moderate investment potential.`
    confidence = 65
  }
  
  if (topEmployer) {
    recommendation += ` Key anchor employer ${topEmployer.companyName} in ${topEmployer.sector} sector.`
    confidence += 5
  }
  
  if (sectors.length > 3) {
    recommendation += ` Diversified economy across ${sectors.length} sectors reduces risk.`
    confidence += 10
  }
  
  return {
    recommendation,
    dataSource: "Employment Analysis",
    confidence: Math.min(confidence, 95),
    actualData: { totalEmployers, totalEmployees, topEmployer, sectorCount: sectors.length }
  }
}

function analyzeProjectInvestment(data: any): InvestmentRecommendation {
  const majorProjects = data.majorProjects?.length || 0
  const totalDevelopers = data.totalDevelopers || 0
  const activeProjects = data.activeProjects || 0
  
  let recommendation = ""
  let confidence = 65
  
  if (majorProjects > 5) {
    recommendation = `Active development pipeline with ${majorProjects} major projects and ${totalDevelopers} developers indicates strong growth potential.`
    confidence = 75
  } else {
    recommendation = `Moderate development activity with ${majorProjects} projects suggests selective opportunities.`
    confidence = 60
  }
  
  if (activeProjects > 0) {
    recommendation += ` ${activeProjects} projects currently under construction.`
    confidence += 10
  }
  
  return {
    recommendation,
    dataSource: "Development Projects",
    confidence: Math.min(confidence, 85),
    actualData: { majorProjects, totalDevelopers, activeProjects }
  }
}

function analyzeTrendsInvestment(marketStats: any): InvestmentRecommendation {
  const medianPrice = marketStats.medianPrice || 0
  const priceChange = marketStats.priceChangeYoY || 0
  const daysOnMarket = marketStats.daysOnMarket || 0
  
  let recommendation = ""
  let confidence = 55
  
  if (medianPrice > 200000) {
    recommendation = `Healthy market with $${medianPrice.toLocaleString()} median price`
    confidence = 65
  } else {
    recommendation = `Affordable market at $${medianPrice.toLocaleString()} median price`
    confidence = 60
  }
  
  if (Math.abs(priceChange) > 0) {
    if (priceChange > 0) {
      recommendation += ` and ${priceChange.toFixed(1)}% price appreciation suggests upward momentum.`
      confidence += 15
    } else {
      recommendation += ` with ${Math.abs(priceChange).toFixed(1)}% price decline may indicate opportunity.`
      confidence += 5
    }
  } else {
    recommendation += ` with stable pricing.`
    confidence += 10
  }
  
  return {
    recommendation,
    dataSource: "Market Trends",
    confidence: Math.min(confidence, 80),
    actualData: { medianPrice, priceChange, daysOnMarket }
  }
}

function generateIntegratedRecommendation(recommendations: InvestmentRecommendation[], data: any): InvestmentRecommendation {
  const avgConfidence = recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length
  const dataSourceCount = recommendations.length
  
  let recommendation = `Based on comprehensive analysis of ${dataSourceCount} data sources with ${data.totalDataPoints} data points: `
  
  if (avgConfidence > 75) {
    recommendation += "Houston presents strong investment opportunities across multiple sectors."
  } else if (avgConfidence > 65) {
    recommendation += "Houston shows moderate investment potential with selective opportunities."
  } else {
    recommendation += "Houston market requires careful analysis but shows emerging potential."
  }
  
  // Add specific insights
  const hasRental = recommendations.some(r => r.dataSource.includes("Rental"))
  const hasEmployment = recommendations.some(r => r.dataSource.includes("Employment"))
  const hasProjects = recommendations.some(r => r.dataSource.includes("Development"))
  
  if (hasRental && hasEmployment && hasProjects) {
    recommendation += " Rental, employment, and development data all support investment thesis."
  }
  
  return {
    recommendation,
    dataSource: "Integrated Analysis",
    confidence: Math.min(avgConfidence + 5, 95),
    actualData: { 
      sourcesAnalyzed: dataSourceCount, 
      totalDataPoints: data.totalDataPoints,
      avgConfidence 
    }
  }
}

// Execute test
testInvestmentRecommendations().catch(console.error)