import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getDatabaseStats() {
  console.log('🔍 Houston Development Intelligence - Database Statistics')
  console.log('=' .repeat(60))
  console.log(`📅 Report Generated: ${new Date().toLocaleString()}`)
  console.log('=' .repeat(60))

  try {
    // Core Tables
    const developers = await prisma.developer.count()
    const projects = await prisma.project.count()
    const properties = await prisma.property.count()
    const neighborhoods = await prisma.neighborhood.count()
    const marketMetrics = await prisma.marketMetrics.count()
    const constructionCosts = await prisma.constructionCost.count()
    const permits = await prisma.permit.count()
    
    // Additional Tables
    const harReports = await prisma.hARMLSReport.count()
    const harNeighborhoods = await prisma.hARNeighborhoodData.count()
    const marketIntelligence = await prisma.marketIntelligence.count()
    const constructionActivity = await prisma.constructionActivity.count()
    const rentalMarket = await prisma.rentalMarket.count()
    const strMarket = await prisma.shortTermRentalMarket.count()
    const demographics = await prisma.areaDemographics.count()
    const income = await prisma.incomeData.count()
    const population = await prisma.populationProjection.count()
    const migration = await prisma.migrationData.count()
    const qualityOfLife = await prisma.qualityOfLife.count()
    const education = await prisma.educationMetrics.count()
    const employers = await prisma.majorEmployer.count()
    const economic = await prisma.economicIndicator.count()
    
    // Calculate totals
    const coreTotal = developers + projects + properties + neighborhoods + 
                      marketMetrics + constructionCosts + permits
    const additionalTotal = harReports + harNeighborhoods + marketIntelligence + 
                           constructionActivity + rentalMarket + strMarket + 
                           demographics + income + population + migration + 
                           qualityOfLife + education + employers + economic
    const grandTotal = coreTotal + additionalTotal

    // Display Core Tables
    console.log('\n📊 CORE TABLES (Priority for Platform):')
    console.log('-'.repeat(40))
    console.log(`👥 Developers:           ${developers.toString().padStart(6)} ${getStatus(developers, 50)}`)
    console.log(`🏗️  Projects:            ${projects.toString().padStart(6)} ${getStatus(projects, 100)}`)
    console.log(`🏠 Properties:           ${properties.toString().padStart(6)} ${getStatus(properties, 1000)}`)
    console.log(`🏘️  Neighborhoods:       ${neighborhoods.toString().padStart(6)} ${getStatus(neighborhoods, 100)}`)
    console.log(`📈 Market Metrics:       ${marketMetrics.toString().padStart(6)} ${getStatus(marketMetrics, 24)}`)
    console.log(`💰 Construction Costs:   ${constructionCosts.toString().padStart(6)} ${getStatus(constructionCosts, 100)}`)
    console.log(`📋 Permits:              ${permits.toString().padStart(6)} ${getStatus(permits, 1000)}`)
    console.log(`                        ────────`)
    console.log(`   Core Total:           ${coreTotal.toString().padStart(6)}`)

    // Display Additional Tables
    console.log('\n📊 ENRICHMENT DATA:')
    console.log('-'.repeat(40))
    console.log(`📄 HAR MLS Reports:      ${harReports.toString().padStart(6)}`)
    console.log(`🏡 HAR Neighborhoods:    ${harNeighborhoods.toString().padStart(6)}`)
    console.log(`🧠 Market Intelligence:  ${marketIntelligence.toString().padStart(6)}`)
    console.log(`🔨 Construction Activity:${constructionActivity.toString().padStart(6)}`)
    console.log(`🏢 Rental Market:        ${rentalMarket.toString().padStart(6)}`)
    console.log(`🏨 STR Market:           ${strMarket.toString().padStart(6)}`)
    console.log(`👥 Demographics:         ${demographics.toString().padStart(6)}`)
    console.log(`💵 Income Data:          ${income.toString().padStart(6)}`)
    console.log(`📊 Population Proj:      ${population.toString().padStart(6)} ${getStatus(population, 50)}`)
    console.log(`🚚 Migration Data:       ${migration.toString().padStart(6)}`)
    console.log(`⭐ Quality of Life:      ${qualityOfLife.toString().padStart(6)}`)
    console.log(`🎓 Education Metrics:    ${education.toString().padStart(6)}`)
    console.log(`🏢 Major Employers:      ${employers.toString().padStart(6)}`)
    console.log(`💹 Economic Indicators:  ${economic.toString().padStart(6)}`)
    console.log(`                        ────────`)
    console.log(`   Additional Total:     ${additionalTotal.toString().padStart(6)}`)

    // Grand Total
    console.log('\n' + '='.repeat(40))
    console.log(`🎯 GRAND TOTAL:          ${grandTotal.toString().padStart(6)} records`)
    console.log('='.repeat(40))

    // Critical Gaps Analysis
    console.log('\n⚠️  CRITICAL GAPS:')
    console.log('-'.repeat(40))
    if (neighborhoods < 50) console.log('🔴 Neighborhoods: Need 100+ Houston neighborhoods')
    if (marketMetrics < 12) console.log('🔴 Market Metrics: Need 24+ months of data')
    if (permits < 500) console.log('🔴 Permits: Need 1000+ recent permits')
    if (constructionCosts < 50) console.log('🔴 Construction Costs: Need 100+ cost items')
    if (population === 0) console.log('🔴 Population Projections: No data!')
    if (developers < 50) console.log('🟡 Developers: Could use more (50+ target)')
    if (projects < 50) console.log('🟡 Projects: Could use more (100+ target)')

    // Progress Bar
    const progress = Math.round((grandTotal / 5000) * 100)
    console.log('\n📊 OVERALL PROGRESS TO 5,000 RECORDS:')
    console.log(getProgressBar(progress))
    console.log(`${progress}% Complete (${grandTotal}/5000)`)

    // Recommendations
    console.log('\n💡 NEXT STEPS:')
    console.log('-'.repeat(40))
    const recommendations = getRecommendations(neighborhoods, marketMetrics, permits, constructionCosts, population)
    recommendations.forEach(rec => console.log(`• ${rec}`))

  } catch (error) {
    console.error('❌ Error fetching database stats:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function getStatus(count: number, target: number): string {
  const percentage = (count / target) * 100
  if (percentage >= 80) return '✅'
  if (percentage >= 50) return '🟡'
  return '🔴'
}

function getProgressBar(percentage: number): string {
  const filled = Math.floor(percentage / 5)
  const empty = 20 - filled
  return `[${('█'.repeat(filled))}${('░'.repeat(empty))}]`
}

function getRecommendations(neighborhoods: number, marketMetrics: number, permits: number, constructionCosts: number, population: number): string[] {
  const recommendations = []
  
  if (neighborhoods < 50) {
    recommendations.push('Priority 1: Import neighborhood data from HAR CSV files')
  }
  if (marketMetrics < 12) {
    recommendations.push('Priority 2: Import historical market metrics (24 months)')
  }
  if (permits < 500) {
    recommendations.push('Priority 3: Import Houston building permits data')
  }
  if (constructionCosts < 50) {
    recommendations.push('Priority 4: Import construction cost database')
  }
  if (population === 0) {
    recommendations.push('URGENT: Import population projection data')
  }
  
  return recommendations
}

// Run the stats
getDatabaseStats()