import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkNeighborhoods() {
  console.log('🏘️  Checking Neighborhood Data...\n')
  
  // Check HAR Neighborhoods
  const harNeighborhoods = await prisma.harNeighborhoodData.findMany({
    orderBy: { avgSalePrice: 'desc' },
    take: 20
  })
  
  console.log(`📊 HAR Neighborhoods: ${await prisma.harNeighborhoodData.count()} total`)
  console.log('Top 20 by price:')
  harNeighborhoods.forEach(n => {
    console.log(`- ${n.name} | ZIP: ${n.zipCode || 'N/A'} | Avg: $${n.avgSalePrice.toLocaleString()} | Sales: ${n.totalSales || 0}`)
  })
  
  // Check Area Demographics
  const demographics = await prisma.areaDemographics.findMany()
  console.log(`\n📊 Area Demographics: ${demographics.length} total`)
  demographics.forEach(d => {
    console.log(`- ${d.neighborhood} | Population: ${d.totalPopulation?.toLocaleString() || 'N/A'}`)
  })
  
  // Check for $0 prices
  const zeroPriceCount = await prisma.harNeighborhoodData.count({
    where: { avgSalePrice: 0 }
  })
  console.log(`\n⚠️  Neighborhoods with $0 prices: ${zeroPriceCount}`)
  
  // Check for missing ZIP codes
  const noZipCount = await prisma.harNeighborhoodData.count({
    where: { 
      OR: [
        { zipCode: null },
        { zipCode: 'N/A' },
        { zipCode: '' }
      ]
    }
  })
  console.log(`⚠️  Neighborhoods without ZIP codes: ${noZipCount}`)
  
  await prisma.$disconnect()
}

checkNeighborhoods().catch(console.error)