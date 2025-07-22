#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyConstructionCosts() {
  const count = await prisma.constructionCostDP5.count()
  console.log('✅ Total construction cost records:', count)
  
  // Get sample of areas covered
  const areas = await prisma.constructionCostDP5.findMany({
    select: { area: true },
    distinct: ['area'],
    take: 10
  })
  
  console.log('\n📍 Sample areas covered:')
  areas.forEach(a => console.log(`   - ${a.area}`))
  
  // Get date range
  const dates = await prisma.constructionCostDP5.findMany({
    select: { effectiveDate: true },
    orderBy: { effectiveDate: 'desc' },
    take: 1
  })
  
  if (dates.length > 0) {
    console.log(`\n📅 Latest data from: ${dates[0].effectiveDate.toLocaleDateString()}`)
  }
  
  await prisma.$disconnect()
}

verifyConstructionCosts()