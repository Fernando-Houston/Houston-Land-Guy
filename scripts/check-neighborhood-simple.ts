#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkNeighborhoodSimple() {
  console.log('🔍 Checking Neighborhood Data...')
  console.log('=' .repeat(60))
  
  try {
    // Get all neighborhoods
    const neighborhoods = await prisma.harNeighborhoodData.findMany({
      take: 20,
      orderBy: { id: 'desc' }
    })
    
    console.log(`\nShowing ${neighborhoods.length} recent neighborhoods:\n`)
    
    neighborhoods.forEach((n, index) => {
      console.log(`${index + 1}. Neighborhood: "${n.neighborhood}" | ZIP: "${n.zipCode}" | Median: $${n.medianSalePrice} | Avg: $${n.avgSalePrice}`)
    })
    
    // Count problems
    let undefinedCount = 0
    let zeroPriceCount = 0
    
    const allNeighborhoods = await prisma.harNeighborhoodData.findMany()
    
    allNeighborhoods.forEach(n => {
      if (!n.neighborhood || n.neighborhood === 'undefined' || n.neighborhood === '') {
        undefinedCount++
      }
      if (n.medianSalePrice === 0 || !n.medianSalePrice) {
        zeroPriceCount++
      }
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 Data Quality Issues:')
    console.log(`❌ Undefined/empty neighborhood names: ${undefinedCount} out of ${allNeighborhoods.length}`)
    console.log(`❌ Zero median prices: ${zeroPriceCount} out of ${allNeighborhoods.length}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkNeighborhoodSimple()