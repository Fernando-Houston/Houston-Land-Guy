#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRentalFormat() {
  const sample = await prisma.rentalMarket.findFirst()
  console.log('Sample rental market record:', sample)
  
  await prisma.$disconnect()
}

checkRentalFormat()