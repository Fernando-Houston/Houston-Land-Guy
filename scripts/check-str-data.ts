// Check STR Market Data
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSTRData() {
  try {
    const strData = await prisma.sTRMarket.findMany()
    
    console.log(`📊 STR Market Records: ${strData.length}`)
    
    if (strData.length > 0) {
      console.log('\n🏠 Sample STR Data:')
      strData.slice(0, 3).forEach((record, i) => {
        console.log(`   ${i + 1}. ${record.neighborhood}`)
        console.log(`      Active Listings: ${record.activeListings}`)
        console.log(`      Avg Daily Rate: $${record.avgDailyRate}`)
        console.log(`      Occupancy Rate: ${record.occupancyRate}%`)
        console.log(`      Performance Tier: ${record.performanceTier}`)
        console.log('')
      })
      
      const totalListings = strData.reduce((sum, s) => sum + (s.activeListings || 0), 0)
      const avgDailyRate = strData.reduce((sum, s) => sum + (s.avgDailyRate || 0), 0) / strData.length
      
      console.log(`🎯 Aggregated Data:`)
      console.log(`   Total Listings: ${totalListings}`)
      console.log(`   Average Daily Rate: $${avgDailyRate.toFixed(2)}`)
    }
    
  } catch (error) {
    console.error('❌ Error checking STR data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSTRData()