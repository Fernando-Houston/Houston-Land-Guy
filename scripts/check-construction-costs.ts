#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkConstructionCosts() {
  const count = await prisma.constructionCostDP5.count()
  console.log('Current construction costs:', count)
  
  if (count < 100) {
    console.log(`Need ${100 - count} more construction costs to reach target`)
  }
  
  await prisma.$disconnect()
}

checkConstructionCosts()