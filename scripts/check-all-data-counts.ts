#!/usr/bin/env node
// Check all data counts in the database

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAllCounts() {
  console.log('📊 Checking All Database Table Counts')
  console.log('=' .repeat(50))
  
  try {
    const counts = await Promise.all([
      // Core models
      prisma.property.count().then(c => ({ name: 'Properties', count: c })),
      prisma.developer.count().then(c => ({ name: 'Developers', count: c })),
      prisma.project.count().then(c => ({ name: 'Projects', count: c })),
      prisma.permit.count().then(c => ({ name: 'Permits', count: c })),
      
      // Market data
      prisma.marketMetrics.count().then(c => ({ name: 'Market Metrics', count: c })),
      prisma.rentalMarket.count().then(c => ({ name: 'Rental Market', count: c })),
      prisma.sTRMarket.count().then(c => ({ name: 'STR Market', count: c })),
      
      // Demographics
      prisma.areaDemographics.count().then(c => ({ name: 'Area Demographics', count: c })),
      prisma.incomeData.count().then(c => ({ name: 'Income Data', count: c })),
      prisma.migrationData.count().then(c => ({ name: 'Migration Data', count: c })),
      prisma.educationMetrics.count().then(c => ({ name: 'Education Metrics', count: c })),
      
      // HAR/MLS data
      prisma.hARMlsReport.count().then(c => ({ name: 'HAR MLS Reports', count: c })),
      prisma.hARNeighborhoodData.count().then(c => ({ name: 'HAR Neighborhood Data', count: c })),
      
      // Construction/Cost
      prisma.constructionActivity.count().then(c => ({ name: 'Construction Activity', count: c })),
      prisma.costAnalysis.count().then(c => ({ name: 'Cost Analysis', count: c })),
      
      // Other data
      prisma.marketIntelligence.count().then(c => ({ name: 'Market Intelligence', count: c })),
      prisma.qualityOfLife.count().then(c => ({ name: 'Quality of Life', count: c })),
      prisma.fernandoMemory.count().then(c => ({ name: 'Fernando Memory', count: c })),
      
      // Data Process 5 specific models
      prisma.employerDP5.count().then(c => ({ name: 'Employers (DP5)', count: c })),
      prisma.economicIndicatorDP5.count().then(c => ({ name: 'Economic Indicators (DP5)', count: c })),
      prisma.constructionCostDP5.count().then(c => ({ name: 'Construction Costs (DP5)', count: c })),
      prisma.populationProjectionDP5.count().then(c => ({ name: 'Population Projections (DP5)', count: c }))
    ])
    
    // Group by category
    console.log('\n🏢 Core Real Estate Data:')
    counts.filter(c => ['Properties', 'Developers', 'Projects', 'Permits'].includes(c.name))
      .forEach(c => console.log(`  ${c.name}: ${c.count}`))
    
    console.log('\n📈 Market Data:')
    counts.filter(c => ['Market Metrics', 'Rental Market', 'STR Market', 'Market Intelligence'].includes(c.name))
      .forEach(c => console.log(`  ${c.name}: ${c.count}`))
    
    console.log('\n👥 Demographics & Income:')
    counts.filter(c => ['Area Demographics', 'Income Data', 'Migration Data', 'Education Metrics'].includes(c.name))
      .forEach(c => console.log(`  ${c.name}: ${c.count}`))
    
    console.log('\n🏗️ Construction & Costs:')
    counts.filter(c => ['Construction Activity', 'Cost Analysis', 'Construction Costs (DP5)'].includes(c.name))
      .forEach(c => console.log(`  ${c.name}: ${c.count}`))
    
    console.log('\n📊 HAR/MLS Data:')
    counts.filter(c => ['HAR MLS Reports', 'HAR Neighborhood Data'].includes(c.name))
      .forEach(c => console.log(`  ${c.name}: ${c.count}`))
    
    console.log('\n🏢 Employment & Economic:')
    counts.filter(c => ['Employers (DP5)', 'Economic Indicators (DP5)', 'Population Projections (DP5)'].includes(c.name))
      .forEach(c => console.log(`  ${c.name}: ${c.count}`))
    
    console.log('\n🤖 AI & Other:')
    counts.filter(c => ['Quality of Life', 'Fernando Memory'].includes(c.name))
      .forEach(c => console.log(`  ${c.name}: ${c.count}`))
    
    const total = counts.reduce((sum, c) => sum + c.count, 0)
    console.log('\n' + '=' .repeat(50))
    console.log(`📊 TOTAL RECORDS ACROSS ALL TABLES: ${total.toLocaleString()}`)
    console.log('=' .repeat(50))
    
  } catch (error) {
    console.error('Error checking counts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check
checkAllCounts().catch(console.error)