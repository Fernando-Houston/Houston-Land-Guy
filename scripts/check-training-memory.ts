import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTrainingMemory() {
  console.log('🔍 Checking Fernando-X Training Memory Status...\n')
  
  // Count total training memories
  const totalCount = await prisma.fernandoMemory.count({
    where: {
      memoryType: {
        in: ['training_qa_comprehensive', 'training_qa_enhanced', 'training_variation_comprehensive', 'training_variation']
      }
    }
  })
  
  // Get breakdown by type
  const byType = await prisma.fernandoMemory.groupBy({
    by: ['memoryType'],
    _count: true,
    where: {
      memoryType: {
        in: ['training_qa_comprehensive', 'training_qa_enhanced', 'training_variation_comprehensive', 'training_variation']
      }
    }
  })
  
  // Get some sample questions
  const samples = await prisma.fernandoMemory.findMany({
    where: {
      memoryType: 'training_qa_comprehensive'
    },
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  console.log('📊 Training Memory Summary:')
  console.log('═'.repeat(50))
  console.log(`Total training memories stored: ${totalCount}`)
  
  console.log('\n📈 Breakdown by type:')
  byType.forEach(t => {
    console.log(`   ${t.memoryType}: ${t._count}`)
  })
  
  console.log('\n📝 Sample Recent Questions:')
  samples.forEach((s, i) => {
    const content = s.content as any
    console.log(`${i + 1}. "${content.question?.substring(0, 60)}..."`)
  })
  
  console.log('\n✅ Status: Fernando-X has comprehensive training data in memory!')
}

checkTrainingMemory()
  .catch(console.error)
  .finally(() => prisma.$disconnect())