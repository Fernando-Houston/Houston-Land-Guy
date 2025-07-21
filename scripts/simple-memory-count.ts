#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkMemoryCount() {
  try {
    const totalCount = await prisma.fernandoMemory.count()
    console.log(`📊 Total Fernando Memory Q&As: ${totalCount}`)
    
    // Check recent entries (likely the Houston Pdata questions)
    const recentCount = await prisma.fernandoMemory.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })
    console.log(`🆕 Recent additions (last 24h): ${recentCount}`)
    
    if (totalCount >= 700) {
      console.log('✅ SUCCESS: Fernando-X training complete with 700+ Q&A pairs!')
      console.log('🎯 Fernando-X is ready for advanced Houston real estate intelligence!')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkMemoryCount()