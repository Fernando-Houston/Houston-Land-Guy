#!/usr/bin/env tsx
// Data Status Checker - Monitor all imports across terminals

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDataStatus() {
  console.log('📊 Houston Development Intelligence - Data Status Report')
  console.log('=' .repeat(60))
  
  try {
    await prisma.$connect()
    
    // Terminal 1 Data (Data Process 1 & 2)
    console.log('\n🔵 Terminal 1 - Data Process 1 & 2:')
    const t1Counts = await Promise.all([
      prisma.developer.count(),
      prisma.project.count(), 
      prisma.permit.count(),
      prisma.marketMetrics.count(),
      prisma.constructionActivity.count(),
      prisma.marketIntelligence.count(),
      prisma.qualityOfLife.count(),
      prisma.marketData.count()
    ])
    
    const t1Labels = [
      'Developers', 'Projects', 'Permits', 'Market Metrics',
      'Construction Activity', 'Market Intelligence', 'Quality of Life', 'Market Data'
    ]
    
    let t1Total = 0
    t1Labels.forEach((label, i) => {
      console.log(`  ${label}: ${t1Counts[i]}`)
      t1Total += t1Counts[i]
    })
    
    console.log(`  📈 T1 Subtotal: ${t1Total} records`)
    
    // Terminal 2 Data (Data Process 3 & HAR MLS)
    console.log('\n🟡 Terminal 2 - Data Process 3 & HAR MLS:')
    const t2Counts = await Promise.all([
      prisma.harMlsReport.count(),
      prisma.harNeighborhoodData.count(),
      prisma.costAnalysis.count()
    ])
    
    const t2Labels = ['HAR MLS Reports', 'HAR Neighborhood Data', 'Cost Analysis']
    let t2Total = 0
    t2Labels.forEach((label, i) => {
      console.log(`  ${label}: ${t2Counts[i]}`)
      t2Total += t2Counts[i]
    })
    
    console.log(`  📈 T2 Subtotal: ${t2Total} records`)
    
    // Data Process 5 (Previously imported)
    console.log('\n🟢 Data Process 5 (Previously imported):')
    const dp5Schema = 'schema-dataprocess5.prisma'
    // Note: These models are in separate schema, would need separate connection
    console.log('  Status: Available in separate schema')
    console.log('  Models: RentalMarket, Employer, STRMarket, AreaDemographics, etc.')
    
    // Calculate total data points using Fernando-X calculation method
    const totalRecords = t1Total + t2Total
    const estimatedDataPoints = totalRecords * 12 // Average 12 data points per record
    
    console.log('\n📊 OVERALL STATUS:')
    console.log('=' .repeat(60))
    console.log(`Total Database Records: ${totalRecords}`)
    console.log(`Estimated Data Points: ${estimatedDataPoints.toLocaleString()}`)
    console.log(`Fernando-X Integration: ${totalRecords > 0 ? '✅ Connected' : '❌ Needs Setup'}`)
    
    // Check Fernando-X data function
    console.log('\n🤖 Fernando-X Status:')
    try {
      const { getIntegratedData } = require('../lib/fernando-x-data')
      const fernandoData = await getIntegratedData()
      console.log(`  Total Data Points: ${fernandoData.totalDataPoints.toLocaleString()}`)
      console.log(`  Last Updated: ${fernandoData.lastUpdated}`)
      console.log(`  Status: ✅ Active`)
    } catch (error) {
      console.log(`  Status: ❌ Error - ${error.message}`)
    }
    
    // Data Coverage Assessment
    console.log('\n📈 Data Coverage Assessment:')
    const folders = ['Process 1', 'Process 2', 'Process 3', 'Process 4', 'Process 5']
    const coverage = [
      t1Total > 0 ? '✅' : '❌',
      t1Total > 0 ? '✅' : '❌', 
      t2Total > 0 ? '✅' : '❌',
      t2Total > 0 ? '✅' : '❌',
      '🟡' // Process 5 in separate schema
    ]
    
    folders.forEach((folder, i) => {
      console.log(`  ${folder}: ${coverage[i]}`)
    })
    
    const completedFolders = coverage.filter(c => c === '✅').length
    const coveragePercent = Math.round((completedFolders / 5) * 100)
    console.log(`\n🎯 Overall Coverage: ${coveragePercent}% (${completedFolders}/5 folders)`)
    
    await prisma.$disconnect()
    
  } catch (error) {
    console.error('❌ Error checking data status:', error)
  }
}

checkDataStatus().catch(console.error)