// Script to verify Railway database setup
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyDatabase() {
  console.log('🔍 Verifying Railway PostgreSQL Database Setup...\n')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Check if Fernando-X tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'Fernando%'
      ORDER BY table_name;
    ` as any[]
    
    console.log('\n📊 Fernando-X Tables:')
    if (tables.length > 0) {
      tables.forEach((table: any) => {
        console.log(`  ✅ ${table.table_name}`)
      })
    } else {
      console.log('  ❌ No Fernando-X tables found! Run: npx prisma db push')
    }
    
    // Count records in each table
    console.log('\n📈 Table Record Counts:')
    
    const memoryCount = await prisma.fernandoMemory.count()
    console.log(`  - FernandoMemory: ${memoryCount} records`)
    
    const conversationCount = await prisma.fernandoConversation.count()
    console.log(`  - FernandoConversation: ${conversationCount} records`)
    
    const insightCount = await prisma.fernandoInsight.count()
    console.log(`  - FernandoInsight: ${insightCount} records`)
    
    // Test creating a memory record
    console.log('\n🧪 Testing Memory Creation...')
    const testMemory = await prisma.fernandoMemory.create({
      data: {
        memoryType: 'test',
        content: { 
          message: 'Database verification test',
          timestamp: new Date().toISOString()
        },
        embedding: [0.1, 0.2, 0.3],
        importance: 0.1,
        metadata: { source: 'verify-database-script' }
      }
    })
    console.log('  ✅ Successfully created test memory:', testMemory.id)
    
    // Clean up test record
    await prisma.fernandoMemory.delete({
      where: { id: testMemory.id }
    })
    console.log('  ✅ Successfully cleaned up test memory')
    
    console.log('\n🎉 Database verification complete! Fernando-X is ready to use memory.')
    
  } catch (error) {
    console.error('❌ Database verification failed:', error)
    console.log('\nTroubleshooting steps:')
    console.log('1. Make sure DATABASE_URL is set correctly in Railway')
    console.log('2. Run: npx prisma db push')
    console.log('3. Check Railway logs for connection issues')
  } finally {
    await prisma.$disconnect()
  }
}

// Run verification
verifyDatabase()