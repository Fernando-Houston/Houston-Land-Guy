#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ValidationResult {
  table: string
  totalRecords: number
  issues: string[]
  status: 'passed' | 'warning' | 'failed'
}

async function validateAllData() {
  console.log('🔍 Starting Comprehensive Data Validation...')
  console.log('=' .repeat(60))
  
  const results: ValidationResult[] = []
  
  // Validate Properties
  console.log('\n📊 Validating Properties...')
  const properties = await prisma.property.findMany()
  const propertyIssues: string[] = []
  
  const zeroPrice = properties.filter(p => !p.listPrice || p.listPrice === 0)
  if (zeroPrice.length > 0) {
    propertyIssues.push(`${zeroPrice.length} properties with $0 or null list price`)
  }
  
  const noNeighborhood = properties.filter(p => !p.neighborhood)
  if (noNeighborhood.length > 0) {
    propertyIssues.push(`${noNeighborhood.length} properties without neighborhood`)
  }
  
  const noStatus = properties.filter(p => !p.status)
  if (noStatus.length > 0) {
    propertyIssues.push(`${noStatus.length} properties without status`)
  }
  
  results.push({
    table: 'Property',
    totalRecords: properties.length,
    issues: propertyIssues,
    status: propertyIssues.length > 0 ? 'warning' : 'passed'
  })
  
  // Validate HAR Neighborhood Data
  console.log('📊 Validating HAR Neighborhood Data...')
  const harData = await prisma.harNeighborhoodData.findMany()
  const harIssues: string[] = []
  
  const zeroMedian = harData.filter(h => !h.medianSalePrice || h.medianSalePrice === 0)
  if (zeroMedian.length > 0) {
    harIssues.push(`${zeroMedian.length} neighborhoods with $0 median price`)
  }
  
  const undefinedNames = harData.filter(h => !h.neighborhood || h.neighborhood === 'undefined')
  if (undefinedNames.length > 0) {
    harIssues.push(`${undefinedNames.length} neighborhoods with undefined names`)
  }
  
  results.push({
    table: 'HarNeighborhoodData',
    totalRecords: harData.length,
    issues: harIssues,
    status: harIssues.length > 0 ? 'warning' : 'passed'
  })
  
  // Validate Construction Costs
  console.log('📊 Validating Construction Costs...')
  const costs = await prisma.constructionCostDP5.count()
  results.push({
    table: 'ConstructionCostDP5',
    totalRecords: costs,
    issues: costs < 100 ? ['Less than 100 construction cost items'] : [],
    status: costs >= 100 ? 'passed' : 'warning'
  })
  
  // Validate Market Metrics
  console.log('📊 Validating Market Metrics...')
  const metrics = await prisma.marketMetrics.findMany()
  const metricIssues: string[] = []
  
  const futureMetrics = metrics.filter(m => m.startDate > new Date())
  if (futureMetrics.length > 0) {
    metricIssues.push(`${futureMetrics.length} metrics with future dates`)
  }
  
  results.push({
    table: 'MarketMetrics',
    totalRecords: metrics.length,
    issues: metricIssues,
    status: metricIssues.length > 0 ? 'warning' : 'passed'
  })
  
  // Validate Developers
  console.log('📊 Validating Developers...')
  const developers = await prisma.developer.count()
  results.push({
    table: 'Developer',
    totalRecords: developers,
    issues: developers < 75 ? ['Less than 75 developers'] : [],
    status: developers >= 75 ? 'passed' : 'warning'
  })
  
  // Validate Projects
  console.log('📊 Validating Projects...')
  const projects = await prisma.project.count()
  results.push({
    table: 'Project',
    totalRecords: projects,
    issues: projects < 100 ? ['Less than 100 projects'] : [],
    status: projects >= 100 ? 'passed' : 'warning'
  })
  
  // Print Summary Report
  console.log('\n' + '='.repeat(60))
  console.log('📋 DATA VALIDATION SUMMARY REPORT')
  console.log('='.repeat(60))
  
  let totalIssues = 0
  results.forEach(result => {
    const statusEmoji = result.status === 'passed' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
    console.log(`\n${statusEmoji} ${result.table}:`)
    console.log(`   Total Records: ${result.totalRecords.toLocaleString()}`)
    
    if (result.issues.length > 0) {
      console.log('   Issues:')
      result.issues.forEach(issue => {
        console.log(`     - ${issue}`)
        totalIssues++
      })
    } else {
      console.log('   No issues found!')
    }
  })
  
  // Overall Status
  console.log('\n' + '='.repeat(60))
  const overallPassed = totalIssues === 0
  console.log(`${overallPassed ? '🎉' : '⚠️'} OVERALL STATUS: ${overallPassed ? 'ALL CHECKS PASSED' : `${totalIssues} issues found`}`)
  
  // Calculate platform completion
  const totalRecords = results.reduce((sum, r) => sum + r.totalRecords, 0)
  const completion = Math.round((totalRecords / 5000) * 100)
  console.log(`📊 Platform Completion: ${completion}% (${totalRecords.toLocaleString()}/5,000 records)`)
  
  await prisma.$disconnect()
}

validateAllData().catch(console.error)