#!/usr/bin/env node
// Check current data counts across all tables
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.POSTGRES_PRISMA_URL
})

async function checkDataCounts() {
  console.log('📊 Houston Development Intelligence - Data Count Report')
  console.log('=====================================================\n')
  
  try {
    // Core tables
    console.log('🏗️  CORE DATA:')
    const coreCounts = {
      Properties: await prisma.property.count(),
      Permits: await prisma.permit.count(),
      Projects: await prisma.project.count(),
      Developers: await prisma.developer.count(),
      PropertyHistory: await prisma.propertyHistory.count(),
    }
    
    Object.entries(coreCounts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count.toLocaleString()}`)
    })
    
    // Market data
    console.log('\n📈 MARKET DATA:')
    const marketCounts = {
      MarketMetrics: await prisma.marketMetrics.count(),
      MarketIntelligence: await prisma.marketIntelligence.count(),
      EconomicIndicators: await prisma.economicIndicator.count(),
    }
    
    Object.entries(marketCounts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count.toLocaleString()}`)
    })
    
    // Data Process 5 tables
    console.log('\n📊 DATA PROCESS 5:')
    const dp5Counts = {
      Demographics: await prisma.demographics.count(),
      RentalMarkets: await prisma.rentalMarket.count(),
      Employers: await prisma.employer.count(),
      STRMarkets: await prisma.sTRMarket.count(),
      IncomeData: await prisma.incomeData.count(),
      PopulationData: await prisma.populationData.count(),
      MigrationData: await prisma.migrationData.count(),
      EducationData: await prisma.educationData.count(),
      ConstructionCosts: await prisma.constructionCost.count(),
    }
    
    Object.entries(dp5Counts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count.toLocaleString()}`)
    })
    
    // Calculate totals
    const coreTotal = Object.values(coreCounts).reduce((sum, count) => sum + count, 0)
    const marketTotal = Object.values(marketCounts).reduce((sum, count) => sum + count, 0)
    const dp5Total = Object.values(dp5Counts).reduce((sum, count) => sum + count, 0)
    const grandTotal = coreTotal + marketTotal + dp5Total
    
    console.log('\n📊 SUMMARY:')
    console.log(`   Core Data: ${coreTotal.toLocaleString()} records`)
    console.log(`   Market Data: ${marketTotal.toLocaleString()} records`)
    console.log(`   Data Process 5: ${dp5Total.toLocaleString()} records`)
    console.log(`   ─────────────────────────────────`)
    console.log(`   TOTAL DATA POINTS: ${grandTotal.toLocaleString()}`)
    
    // Check for missing data
    console.log('\n⚠️  MISSING DATA:')
    const missing = []
    if (coreCounts.Properties === 0) missing.push('Properties')
    if (coreCounts.Permits === 0) missing.push('Permits')
    if (marketCounts.MarketMetrics === 0) missing.push('Market Metrics')
    if (dp5Counts.IncomeData === 0) missing.push('Income Data')
    if (dp5Counts.PopulationData === 0) missing.push('Population Data')
    
    if (missing.length > 0) {
      missing.forEach(table => console.log(`   - ${table}`))
    } else {
      console.log('   None - All major tables have data!')
    }
    
    // Sample data from key tables
    console.log('\n📋 SAMPLE DATA:')
    
    // Sample rental market
    const topRentals = await prisma.rentalMarket.findMany({
      where: { avgRent2BR: { gt: 0 } },
      orderBy: { avgRent2BR: 'desc' },
      take: 3
    })
    
    if (topRentals.length > 0) {
      console.log('\n   Top Rental Markets:')
      topRentals.forEach(r => {
        console.log(`   - ${r.neighborhood || r.zipCode}: $${r.avgRent2BR}/mo`)
      })
    }
    
    // Sample employers
    const topEmployers = await prisma.employer.findMany({
      orderBy: { employeeCount: 'desc' },
      take: 3
    })
    
    if (topEmployers.length > 0) {
      console.log('\n   Top Employers:')
      topEmployers.forEach(e => {
        console.log(`   - ${e.companyName}: ${e.employeeCount.toLocaleString()} employees`)
      })
    }
    
    // Recent projects
    const recentProjects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { developer: true }
    })
    
    if (recentProjects.length > 0) {
      console.log('\n   Recent Projects:')
      recentProjects.forEach(p => {
        console.log(`   - ${p.name} by ${p.developer?.name || 'Unknown'} ($${(p.totalValue / 1000000).toFixed(1)}M)`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error checking data counts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDataCounts().catch(console.error)