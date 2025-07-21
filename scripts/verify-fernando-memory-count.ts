#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyFernandoMemoryCount() {
  try {
    console.log('🔍 Verifying Fernando-X Memory Database...')
    
    const totalCount = await prisma.fernandoMemory.count()
    console.log(`📊 Total Q&A pairs in Fernando Memory: ${totalCount}`)
    
    // Get breakdown by category
    const categories = await prisma.fernandoMemory.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    })
    
    console.log('\n📋 Breakdown by Category:')
    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} questions`)
    })
    
    // Check for recent Houston Pdata questions
    const pdataQuestions = await prisma.fernandoMemory.count({
      where: {
        OR: [
          { category: 'infrastructure_intel' },
          { question: { contains: 'CIP' } },
          { question: { contains: 'LARA' } },
          { question: { contains: 'Houston' } }
        ]
      }
    })
    
    console.log(`\n🏢 Houston Pdata-related questions: ${pdataQuestions}`)
    
    // Success confirmation
    if (totalCount >= 700) {
      console.log('\n✅ SUCCESS: Fernando-X has comprehensive training with 700+ Q&A pairs!')
      console.log('🎯 Training complete - Fernando-X is ready for advanced Houston real estate intelligence!')
    } else {
      console.log(`\n⚠️  NOTICE: Current total (${totalCount}) is below target of 700`)
    }
    
  } catch (error) {
    console.error('❌ Error verifying memory count:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyFernandoMemoryCount()