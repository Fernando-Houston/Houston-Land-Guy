#!/usr/bin/env ts-node

import { prisma } from '../lib/db/prisma'

async function checkDatabaseCounts() {
  console.log('🔍 Checking database record counts...\n')

  try {
    // Core tables
    console.log('📊 CORE TABLES:')
    console.log('================')
    const developers = await prisma.developer.count()
    console.log(`1. Developers: ${developers.toLocaleString()}`)
    
    const projects = await prisma.project.count()
    console.log(`2. Projects: ${projects.toLocaleString()}`)
    
    const properties = await prisma.property.count()
    console.log(`3. Properties: ${properties.toLocaleString()}`)
    
    const permits = await prisma.permit.count()
    console.log(`7. Permits: ${permits.toLocaleString()}`)

    // Market data
    console.log('\n📈 MARKET DATA:')
    console.log('================')
    const marketMetrics = await prisma.marketMetrics.count()
    console.log(`5. Market Metrics: ${marketMetrics.toLocaleString()}`)
    
    const neighborhoods = await prisma.marketMetrics.groupBy({
      by: ['areaName'],
      _count: true
    })
    console.log(`4. Neighborhoods (unique): ${neighborhoods.length}`)

    const harMlsReports = await prisma.harMlsReport.count()
    console.log(`- HAR MLS Reports: ${harMlsReports.toLocaleString()}`)
    
    const harNeighborhoodData = await prisma.harNeighborhoodData.count()
    console.log(`- HAR Neighborhood Data: ${harNeighborhoodData.toLocaleString()}`)
    
    const marketIntelligence = await prisma.marketIntelligence.count()
    console.log(`- Market Intelligence: ${marketIntelligence.toLocaleString()}`)

    // Construction & Costs
    console.log('\n🏗️ CONSTRUCTION & COSTS:')
    console.log('========================')
    const constructionCosts = await prisma.constructionCostDP5.count()
    console.log(`6. Construction Costs: ${constructionCosts.toLocaleString()}`)
    
    const constructionActivity = await prisma.constructionActivity.count()
    console.log(`- Construction Activity: ${constructionActivity.toLocaleString()}`)

    // Rental Markets
    console.log('\n🏠 RENTAL MARKETS:')
    console.log('==================')
    const rentalMarket = await prisma.rentalMarket.count()
    console.log(`- Rental Market: ${rentalMarket.toLocaleString()}`)
    
    const strMarket = await prisma.sTRMarket.count()
    console.log(`- Short-Term Rental Market: ${strMarket.toLocaleString()}`)

    // Demographics
    console.log('\n👥 DEMOGRAPHICS:')
    console.log('================')
    const areaDemographics = await prisma.areaDemographics.count()
    console.log(`- Area Demographics: ${areaDemographics.toLocaleString()}`)
    
    const incomeData = await prisma.incomeData.count()
    console.log(`- Income Data: ${incomeData.toLocaleString()}`)
    
    const populationProjection = await prisma.populationProjection.count()
    console.log(`- Population Projections: ${populationProjection.toLocaleString()}`)
    
    const migrationData = await prisma.migrationData.count()
    console.log(`- Migration Data: ${migrationData.toLocaleString()}`)

    // Quality & Education
    console.log('\n🎓 QUALITY & EDUCATION:')
    console.log('=======================')
    const qualityOfLife = await prisma.qualityOfLife.count()
    console.log(`- Quality of Life: ${qualityOfLife.toLocaleString()}`)
    
    const educationMetrics = await prisma.educationMetrics.count()
    console.log(`- Education Metrics: ${educationMetrics.toLocaleString()}`)

    // Economic Data
    console.log('\n💼 ECONOMIC DATA:')
    console.log('=================')
    const employerDP5 = await prisma.employerDP5.count()
    console.log(`- Major Employers: ${employerDP5.toLocaleString()}`)
    
    const economicIndicatorDP5 = await prisma.economicIndicatorDP5.count()
    console.log(`- Economic Indicators: ${economicIndicatorDP5.toLocaleString()}`)

    // Calculate totals
    const totalRecords = developers + projects + properties + permits + 
                        marketMetrics + harMlsReports + harNeighborhoodData +
                        marketIntelligence + constructionCosts + constructionActivity +
                        rentalMarket + strMarket + areaDemographics + incomeData +
                        populationProjection + migrationData + qualityOfLife +
                        educationMetrics + employerDP5 + economicIndicatorDP5

    console.log('\n📊 SUMMARY:')
    console.log('===========')
    console.log(`Total Records: ${totalRecords.toLocaleString()}`)
    
    // Recent imports
    console.log('\n📥 RECENT IMPORTS:')
    console.log('==================')
    const recentImports = await prisma.dataImport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        importType: true,
        status: true,
        totalRecords: true,
        processedRecords: true,
        createdAt: true
      }
    })

    if (recentImports.length === 0) {
      console.log('No recent imports found.')
    } else {
      recentImports.forEach((imp, index) => {
        console.log(`${index + 1}. ${imp.importType} - ${imp.status}`)
        console.log(`   Records: ${imp.processedRecords}/${imp.totalRecords}`)
        console.log(`   Date: ${imp.createdAt.toLocaleDateString()}`)
      })
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:')
    console.log('===================')
    if (totalRecords < 1000) {
      console.log('⚠️  Database has minimal data.')
      console.log('   Terminal 2 and Terminal 3 should help populate more data across all tables.')
    } else if (totalRecords < 10000) {
      console.log('⚠️  Database has some data but could benefit from additional population.')
      console.log('   Consider using Terminal 2 and Terminal 3 for specific data categories that are low.')
    } else {
      console.log('✅ Database is well-populated with sufficient data for most operations.')
    }

    // Identify empty tables
    const emptySections = []
    if (developers === 0) emptySections.push('Developers')
    if (projects === 0) emptySections.push('Projects')
    if (properties === 0) emptySections.push('Properties')
    if (permits === 0) emptySections.push('Permits')
    if (marketMetrics === 0) emptySections.push('Market Metrics')
    if (constructionCosts === 0) emptySections.push('Construction Costs')

    if (emptySections.length > 0) {
      console.log(`\n🚨 Empty tables that need data: ${emptySections.join(', ')}`)
    }

  } catch (error) {
    console.error('❌ Error checking database counts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check
checkDatabaseCounts()