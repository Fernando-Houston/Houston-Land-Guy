#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkHarData() {
  console.log('🔍 Checking HAR Neighborhood Data...')
  
  try {
    const records = await prisma.harNeighborhoodData.findMany({
      take: 5
    })
    
    console.log('Sample records:')
    records.forEach(r => {
      console.log(`${r.neighborhood}: $${r.medianSalePrice} median, $${r.avgSalePrice} avg`)
    })
    
    // Count records with zero prices
    const allRecords = await prisma.harNeighborhoodData.findMany()
    const zeroCount = allRecords.filter(r => r.medianSalePrice === 0).length
    
    console.log(`\nTotal records: ${allRecords.length}`)
    console.log(`Records with $0 median price: ${zeroCount}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkHarData()