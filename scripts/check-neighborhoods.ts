#!/usr/bin/env npx tsx
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkNeighborhoods() {
  try {
    console.log('🏘️ Checking HarNeighborhoodData...\n')
    
    // Get sample of neighborhood data
    const neighborhoods = await prisma.harNeighborhoodData.findMany({
      take: 20,
      orderBy: { neighborhood: 'asc' },
      select: {
        neighborhood: true,
        zipCode: true,
        avgSalePrice: true,
        totalSales: true
      }
    })
    
    console.log('Sample Neighborhood Data:')
    console.log('========================')
    neighborhoods.forEach(n => {
      console.log(`${n.neighborhood} | ZIP: ${n.zipCode || 'N/A'} | Avg Price: $${n.avgSalePrice.toLocaleString()} | Sales: ${n.totalSales}`)
    })
    
    // Get distinct neighborhood names
    const distinctNeighborhoods = await prisma.harNeighborhoodData.findMany({
      distinct: ['neighborhood'],
      select: { neighborhood: true },
      orderBy: { neighborhood: 'asc' }
    })
    
    console.log('\n\nDistinct Neighborhoods:')
    console.log('======================')
    distinctNeighborhoods.forEach((n, i) => {
      console.log(`${i + 1}. ${n.neighborhood}`)
    })
    
    console.log(`\nTotal distinct neighborhoods: ${distinctNeighborhoods.length}`)
    
    // Check for undefined values
    const undefinedCount = await prisma.harNeighborhoodData.count({
      where: { neighborhood: 'undefined' }
    })
    
    const unknownCount = await prisma.harNeighborhoodData.count({
      where: { neighborhood: 'Unknown' }
    })
    
    console.log(`\nUndefined neighborhoods: ${undefinedCount}`)
    console.log(`Unknown neighborhoods: ${unknownCount}`)
    
  } catch (error) {
    console.error('Error checking neighborhoods:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkNeighborhoods()