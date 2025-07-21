// Quick test of Data Process 5 model access
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDataProcess5Access() {
  try {
    console.log('🔍 Testing Data Process 5 Model Access...\n')
    
    // Test all Data Process 5 models
    const [rentalMarket, employersDP5, strMarket, areaDemographics, incomeData] = await Promise.all([
      prisma.rentalMarket.findMany(),
      prisma.employerDP5.findMany(), 
      prisma.sTRMarket.findMany(),
      prisma.areaDemographics.findMany(),
      prisma.incomeData.findMany()
    ])
    
    console.log('📊 Data Process 5 Records:')
    console.log(`   Rental Market: ${rentalMarket.length} records`)
    console.log(`   Employers DP5: ${employersDP5.length} records`)
    console.log(`   STR Market: ${strMarket.length} records`)
    console.log(`   Area Demographics: ${areaDemographics.length} records`)
    console.log(`   Income Data: ${incomeData.length} records`)
    
    const totalDP5Records = rentalMarket.length + employersDP5.length + strMarket.length + 
                           areaDemographics.length + incomeData.length
    
    console.log(`\n🎯 Total Data Process 5 Records: ${totalDP5Records}`)
    
    // Test sample data access
    if (rentalMarket.length > 0) {
      console.log('\n📍 Sample Rental Market Data:')
      console.log(`   Neighborhood: ${rentalMarket[0].neighborhood}`)
      console.log(`   Avg Rent 2BR: $${rentalMarket[0].avgRent2BR}`)
    }
    
    if (employersDP5.length > 0) {
      console.log('\n🏢 Sample Employer Data:')
      console.log(`   Company: ${employersDP5[0].companyName}`)
      console.log(`   Sector: ${employersDP5[0].sector}`)
      console.log(`   Employees: ${employersDP5[0].employeeCount}`)
    }
    
    return {
      rentalMarket: rentalMarket.length,
      employersDP5: employersDP5.length,
      strMarket: strMarket.length,
      areaDemographics: areaDemographics.length,
      incomeData: incomeData.length,
      total: totalDP5Records
    }
    
  } catch (error) {
    console.error('❌ Error accessing Data Process 5 models:', error)
    return null
  } finally {
    await prisma.$disconnect()
  }
}

testDataProcess5Access()