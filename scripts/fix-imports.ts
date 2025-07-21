#!/usr/bin/env node
// Fix rental market and employer data imports
import { dataImportFix } from '../lib/services/dataprocess5-import-fix'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function runFixes() {
  console.log('🔧 Houston Development Intelligence - Data Import Fixes')
  console.log('=====================================================\n')
  
  try {
    // Run all fixes
    await dataImportFix.fixAllImports()
    
    // Check the results
    console.log('\n📊 Verifying fixed data...\n')
    
    // Check rental markets
    const rentals = await prisma.rentalMarket.findMany({
      where: { avgRent2BR: { gt: 0 } },
      take: 5,
      orderBy: { avgRent2BR: 'desc' }
    })
    
    console.log('🏠 Top 5 Rental Markets by 2BR Rent:')
    rentals.forEach(r => {
      console.log(`   ${r.neighborhood || r.zipCode}: $${r.avgRent2BR}/mo (${r.occupancyRate}% occupancy)`)
    })
    
    // Check employers
    const employers = await prisma.employer.findMany({
      orderBy: { employeeCount: 'desc' },
      take: 5
    })
    
    console.log('\n👥 Top 5 Employers by Employee Count:')
    employers.forEach(e => {
      console.log(`   ${e.companyName}: ${e.employeeCount.toLocaleString()} employees (${e.sector})`)
    })
    
    // Check STR markets
    const strMarkets = await prisma.sTRMarket.findMany({
      orderBy: { avgDailyRate: 'desc' },
      take: 5
    })
    
    console.log('\n🏨 Top 5 STR Markets by ADR:')
    strMarkets.forEach(s => {
      console.log(`   ${s.neighborhood}: $${s.avgDailyRate}/night (${s.occupancyRate}% occupancy)`)
    })
    
    console.log('\n✅ Data fixes completed successfully!')
    
  } catch (error) {
    console.error('❌ Error running fixes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

runFixes().catch(console.error)