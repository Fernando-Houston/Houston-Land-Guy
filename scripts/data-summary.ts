#!/usr/bin/env node
// Get comprehensive data summary
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getDataSummary() {
  console.log('📊 Houston Development Intelligence - Data Summary')
  console.log('===============================================\n')
  
  try {
    // Count all available data
    const counts: Record<string, number> = {}
    
    // Try each table and catch errors
    try {
      counts['Market Intelligence'] = await prisma.marketIntelligence.count()
    } catch (e) { counts['Market Intelligence'] = 0 }
    
    try {
      counts['Rental Markets'] = await prisma.rentalMarket.count()
    } catch (e) { counts['Rental Markets'] = 0 }
    
    try {
      counts['Employers'] = await prisma.employer.count()
    } catch (e) { counts['Employers'] = 0 }
    
    try {
      counts['STR Markets'] = await prisma.sTRMarket.count()
    } catch (e) { counts['STR Markets'] = 0 }
    
    try {
      counts['Income Data'] = await prisma.incomeData.count()
    } catch (e) { counts['Income Data'] = 0 }
    
    try {
      counts['Economic Indicators'] = await prisma.economicIndicator.count()
    } catch (e) { counts['Economic Indicators'] = 0 }
    
    try {
      counts['Projects'] = await prisma.project.count()
    } catch (e) { counts['Projects'] = 0 }
    
    try {
      counts['Developers'] = await prisma.developer.count()
    } catch (e) { counts['Developers'] = 0 }
    
    try {
      counts['Migration Data'] = await prisma.migrationData.count()
    } catch (e) { counts['Migration Data'] = 0 }
    
    try {
      counts['Education Data'] = await prisma.educationData.count()
    } catch (e) { counts['Education Data'] = 0 }
    
    try {
      counts['Construction Costs'] = await prisma.constructionCost.count()
    } catch (e) { counts['Construction Costs'] = 0 }
    
    // Display counts
    console.log('📈 DATA COUNTS:')
    let total = 0
    Object.entries(counts).forEach(([table, count]) => {
      if (count > 0) {
        console.log(`   ${table}: ${count.toLocaleString()}`)
        total += count
      }
    })
    
    console.log(`   ─────────────────────────`)
    console.log(`   TOTAL: ${total.toLocaleString()} data points`)
    
    // Show sample data from key tables
    console.log('\n🔍 SAMPLE DATA:\n')
    
    // Top rental markets
    const rentals = await prisma.rentalMarket.findMany({
      where: { avgRent2BR: { gt: 0 } },
      orderBy: { avgRent2BR: 'desc' },
      take: 5
    })
    
    if (rentals.length > 0) {
      console.log('💰 Most Expensive Rental Markets (2BR):')
      rentals.forEach(r => {
        console.log(`   ${r.neighborhood || r.zipCode}: $${r.avgRent2BR}/mo (${r.occupancyRate}% occupancy)`)
      })
    }
    
    // Top employers
    const employers = await prisma.employer.findMany({
      orderBy: { employeeCount: 'desc' },
      take: 5
    })
    
    if (employers.length > 0) {
      console.log('\n🏢 Largest Employers:')
      employers.forEach(e => {
        console.log(`   ${e.companyName}: ${e.employeeCount.toLocaleString()} employees (${e.sector})`)
      })
    }
    
    // Recent market intelligence
    const intelligence = await prisma.marketIntelligence.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    
    if (intelligence.length > 0) {
      console.log('\n📰 Recent Market Intelligence:')
      intelligence.forEach(i => {
        const value = i.numericValue ? ` (${i.numericValue}${i.unit || ''})` : ''
        console.log(`   ${i.metricName}${value}`)
      })
    }
    
    // Economic indicators
    const indicators = await prisma.economicIndicator.findMany({
      orderBy: { reportDate: 'desc' },
      take: 5
    })
    
    if (indicators.length > 0) {
      console.log('\n📊 Economic Indicators:')
      indicators.forEach(i => {
        console.log(`   ${i.indicatorName}: ${i.currentValue}${i.unit || ''}`)
      })
    }
    
    console.log('\n✅ Data summary complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getDataSummary().catch(console.error)