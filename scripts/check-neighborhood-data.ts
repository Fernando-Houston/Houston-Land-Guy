#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkNeighborhoodData() {
  console.log('🔍 Checking Neighborhood Data Quality...')
  console.log('=' .repeat(60))
  
  try {
    // Get total count
    const totalCount = await prisma.harNeighborhoodData.count()
    console.log(`Total neighborhoods: ${totalCount}`)
    
    // Check for undefined names
    const undefinedNames = await prisma.harNeighborhoodData.count({
      where: {
        OR: [
          { neighborhood: 'undefined' },
          { neighborhood: '' },
          { neighborhood: null }
        ]
      }
    })
    console.log(`\n❌ Neighborhoods with undefined/empty names: ${undefinedNames}`)
    
    // Check for zero prices
    const zeroPrices = await prisma.harNeighborhoodData.count({
      where: {
        medianSalePrice: 0
      }
    })
    console.log(`❌ Neighborhoods with $0 median price: ${zeroPrices}`)
    
    // Sample some records
    console.log('\n📊 Sample Records:')
    const samples = await prisma.harNeighborhoodData.findMany({
      take: 10,
      orderBy: { id: 'desc' }
    })
    
    samples.forEach((record, index) => {
      console.log(`\n${index + 1}. ID: ${record.id}`)
      console.log(`   Neighborhood: ${record.neighborhood}`)
      console.log(`   ZIP Code: ${record.zipCode}`)
      console.log(`   Median Price: $${record.medianSalePrice.toLocaleString()}`)
      console.log(`   Avg Price: $${record.avgSalePrice.toLocaleString()}`)
    })
    
    // Check which records have good data
    const goodRecords = await prisma.harNeighborhoodData.findMany({
      where: {
        AND: [
          { neighborhood: { not: 'undefined' } },
          { medianSalePrice: { gt: 0 } }
        ]
      },
      take: 5
    })
    
    if (goodRecords.length > 0) {
      console.log('\n✅ Records with good data:')
      goodRecords.forEach(record => {
        console.log(`   ${record.neighborhood} (${record.zipCode}): $${record.medianSalePrice.toLocaleString()}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkNeighborhoodData()