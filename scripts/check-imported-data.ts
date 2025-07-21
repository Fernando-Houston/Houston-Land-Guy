#!/usr/bin/env node
// Check what data has been imported
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkImportedData() {
  console.log('\n📊 Houston Development Intelligence - Data Summary')
  console.log('================================================\n')
  
  try {
    // Check demographics
    const demographics = await prisma.areaDemographics.count()
    const sampleDemo = await prisma.areaDemographics.findFirst({
      orderBy: { totalPopulation: 'desc' }
    })
    
    console.log(`✅ Demographics: ${demographics} areas loaded`)
    if (sampleDemo) {
      console.log(`   Example: ${sampleDemo.neighborhood || sampleDemo.zipCode} - Population: ${sampleDemo.totalPopulation?.toLocaleString()}`)
    }
    
    // Check rental markets
    const rentals = await prisma.rentalMarket.count()
    const sampleRental = await prisma.rentalMarket.findFirst({
      where: { avgRent2BR: { gt: 0 } }
    })
    
    console.log(`\n✅ Rental Markets: ${rentals} records loaded`)
    if (sampleRental) {
      console.log(`   Example: ${sampleRental.neighborhood || sampleRental.zipCode} - 2BR Rent: $${sampleRental.avgRent2BR}/month`)
    }
    
    // Check employers
    const employers = await prisma.employer.count()
    const topEmployer = await prisma.employer.findFirst({
      orderBy: { employeeCount: 'desc' }
    })
    
    console.log(`\n✅ Major Employers: ${employers} companies loaded`)
    if (topEmployer) {
      console.log(`   Top Employer: ${topEmployer.companyName} - ${topEmployer.employeeCount?.toLocaleString()} employees`)
    }
    
    // Check STR markets
    const strMarkets = await prisma.sTRMarket.count()
    const topSTR = await prisma.sTRMarket.findFirst({
      orderBy: { annualRevenue: 'desc' }
    })
    
    console.log(`\n✅ STR Markets: ${strMarkets} neighborhoods loaded`)
    if (topSTR) {
      console.log(`   Top STR Market: ${topSTR.neighborhood} - ADR: $${topSTR.avgDailyRate}/night`)
    }
    
    // Check education
    const education = await prisma.educationMetrics.count()
    console.log(`\n✅ Education Metrics: ${education} districts loaded`)
    
    // Check economic indicators
    const indicators = await prisma.economicIndicator.count()
    console.log(`\n✅ Economic Indicators: ${indicators} metrics loaded`)
    
    // Check construction costs
    const construction = await prisma.constructionCost.count()
    const latestCosts = await prisma.constructionCost.findFirst({
      orderBy: { reportDate: 'desc' }
    })
    
    console.log(`\n✅ Construction Costs: ${construction} reports loaded`)
    if (latestCosts) {
      console.log(`   Residential (Mid): $${latestCosts.residentialMid}/sq ft`)
      console.log(`   Commercial Office: $${latestCosts.commercialOffice}/sq ft`)
    }
    
    // Summary
    console.log('\n📈 Database Enhancement Summary:')
    console.log('--------------------------------')
    console.log('Fernando-X now has access to:')
    console.log(`• ${demographics} neighborhood demographic profiles`)
    console.log(`• ${rentals} rental market data points`)
    console.log(`• ${employers} major Houston employers`)
    console.log(`• ${strMarkets} short-term rental markets`)
    console.log(`• Real-time construction costs`)
    console.log(`• Economic indicators and projections`)
    
    console.log('\n✨ Try asking Fernando-X:')
    console.log('• "What\'s the demographic profile of 77019?"')
    console.log('• "Show me rental rates in Montrose"')
    console.log('• "Who are the top employers in Houston?"')
    console.log('• "What\'s the STR market like in Heights?"')
    console.log('• "Current construction costs?"')
    
  } catch (error) {
    console.error('Error checking data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkImportedData().catch(console.error)