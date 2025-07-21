#!/usr/bin/env node
// Simple data check
import { PrismaClient } from '@prisma/client'

async function checkData() {
  const prisma = new PrismaClient()
  
  try {
    console.log('📊 Checking available data...\n')
    
    // Try to check different tables
    try {
      const rentalCount = await prisma.rentalMarket.count()
      console.log(`Rental Markets: ${rentalCount}`)
      
      if (rentalCount > 0) {
        const samples = await prisma.rentalMarket.findMany({ take: 3 })
        console.log('Sample rental data:')
        samples.forEach(s => {
          console.log(`  - ${s.neighborhood || s.zipCode}: $${s.avgRent2BR || 0}/mo`)
        })
      }
    } catch (e) {
      console.log('Rental Market table not available')
    }
    
    try {
      const employerCount = await prisma.employer.count()
      console.log(`\nEmployers: ${employerCount}`)
      
      if (employerCount > 0) {
        const topEmployers = await prisma.employer.findMany({ 
          take: 3,
          orderBy: { employeeCount: 'desc' }
        })
        console.log('Top employers:')
        topEmployers.forEach(e => {
          console.log(`  - ${e.companyName}: ${e.employeeCount} employees`)
        })
      }
    } catch (e) {
      console.log('Employer table not available')
    }
    
    try {
      const demographicsCount = await prisma.demographics.count()
      console.log(`\nDemographics: ${demographicsCount}`)
    } catch (e) {
      console.log('Demographics table not available')
    }
    
    try {
      const strCount = await prisma.sTRMarket.count()
      console.log(`STR Markets: ${strCount}`)
    } catch (e) {
      console.log('STR Market table not available')
    }
    
    // Check main schema tables
    console.log('\n--- Main Schema Tables ---')
    
    try {
      const propertyCount = await prisma.property.count()
      console.log(`Properties: ${propertyCount}`)
    } catch (e) {
      console.log('Property table not available')
    }
    
    try {
      const permitCount = await prisma.permit.count()
      console.log(`Permits: ${permitCount}`)
    } catch (e) {
      console.log('Permit table not available')
    }
    
    try {
      const projectCount = await prisma.project.count()
      console.log(`Projects: ${projectCount}`)
    } catch (e) {
      console.log('Project table not available')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData().catch(console.error)