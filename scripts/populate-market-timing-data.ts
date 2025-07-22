#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Generate historical market data for the past 12 months
function generateMarketTimingData() {
  const data = []
  const now = new Date()
  
  // Houston area neighborhoods
  const areas = [
    'The Woodlands', 'Katy', 'Sugar Land', 'Memorial', 'River Oaks',
    'Pearland', 'Spring', 'Cypress', 'Heights', 'Montrose',
    'Midtown', 'Galleria', 'Clear Lake', 'Energy Corridor'
  ]
  
  for (let monthsBack = 11; monthsBack >= 0; monthsBack--) {
    const date = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 0)
    
    // Base market conditions with seasonal patterns
    const month = date.getMonth()
    const isSpringSellingSeasonStart = month >= 2 && month <= 5 // Mar-Jun
    const isSummerPeak = month >= 5 && month <= 7 // Jun-Aug  
    const isFallSlowdown = month >= 8 && month <= 10 // Sep-Nov
    const isWinterSlow = month >= 11 || month <= 1 // Dec-Feb
    
    let basePrice = 420000
    let baseDaysOnMarket = 35
    let baseInventory = 4.2
    
    // Seasonal adjustments
    if (isSpringSellingSeasonStart) {
      basePrice *= 1.05
      baseDaysOnMarket *= 0.85
      baseInventory *= 0.9
    } else if (isSummerPeak) {
      basePrice *= 1.08
      baseDaysOnMarket *= 0.8
      baseInventory *= 0.85
    } else if (isFallSlowdown) {
      basePrice *= 0.98
      baseDaysOnMarket *= 1.1
      baseInventory *= 1.15
    } else if (isWinterSlow) {
      basePrice *= 0.95
      baseDaysOnMarket *= 1.25
      baseInventory *= 1.3
    }
    
    // Year-over-year growth trend (slightly declining over time)
    const yearProgress = monthsBack / 12
    const growthTrend = 8 - (yearProgress * 3) // Start at 8%, decline to 5%
    
    for (const area of areas) {
      // Area-specific multipliers
      let areaMultiplier = 1
      if (['River Oaks', 'Memorial'].includes(area)) areaMultiplier = 2.2
      else if (['The Woodlands', 'Sugar Land', 'Katy'].includes(area)) areaMultiplier = 1.1
      else if (['Heights', 'Montrose'].includes(area)) areaMultiplier = 1.4
      else if (['Midtown', 'Galleria'].includes(area)) areaMultiplier = 1.2
      
      const medianPrice = Math.round(basePrice * areaMultiplier * (1 + Math.random() * 0.1 - 0.05))
      const avgDaysOnMarket = Math.round(baseDaysOnMarket * (1 + Math.random() * 0.2 - 0.1))
      const inventoryMonths = Math.round((baseInventory * (1 + Math.random() * 0.3 - 0.15)) * 10) / 10
      const volumeSold = Math.round(120 + Math.random() * 80) // 120-200 sales per month
      const changeYoY = Math.round((growthTrend + Math.random() * 4 - 2) * 10) / 10
      const activeListings = Math.round(volumeSold * inventoryMonths) // Active listings based on inventory
      
      data.push({
        areaName: area,
        areaType: 'neighborhood',
        period: 'monthly',
        medianPrice,
        avgDaysOnMarket,
        inventoryMonths,
        volumeSold,
        activeListings,
        changeYoY,
        startDate: date,
        endDate
      })
    }
  }
  
  return data
}

async function populateMarketTimingData() {
  console.log('📊 Starting Market Timing Data Population...')
  console.log('=' .repeat(60))
  
  try {
    // First clear existing market metrics for Houston areas
    console.log('🧹 Clearing existing market metrics...')
    await prisma.marketMetrics.deleteMany({
      where: {
        areaName: {
          in: ['The Woodlands', 'Katy', 'Sugar Land', 'Memorial', 'River Oaks',
               'Pearland', 'Spring', 'Cypress', 'Heights', 'Montrose',
               'Midtown', 'Galleria', 'Clear Lake', 'Energy Corridor']
        }
      }
    })
    
    // Generate and import new data
    const marketData = generateMarketTimingData()
    console.log(`📈 Generated ${marketData.length} market timing records`)
    
    let importedCount = 0
    for (const data of marketData) {
      try {
        await prisma.marketMetrics.create({
          data
        })
        importedCount++
      } catch (error) {
        console.error(`❌ Error importing ${data.areaName} data:`, error)
      }
    }
    
    // Also add some Houston-wide aggregate data
    console.log('\n📊 Adding Houston-wide market data...')
    const houstonWideData = []
    const now = new Date()
    
    for (let monthsBack = 11; monthsBack >= 0; monthsBack--) {
      const date = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 0)
      
      // Houston metro averages
      const month = date.getMonth()
      let basePrice = 385000
      let baseDaysOnMarket = 32
      let baseInventory = 3.8
      
      // Seasonal patterns for Houston metro
      if (month >= 2 && month <= 5) { // Spring
        basePrice *= 1.06
        baseDaysOnMarket *= 0.82
        baseInventory *= 0.88
      } else if (month >= 5 && month <= 7) { // Summer
        basePrice *= 1.09
        baseDaysOnMarket *= 0.78
        baseInventory *= 0.83
      } else if (month >= 8 && month <= 10) { // Fall
        basePrice *= 0.97
        baseDaysOnMarket *= 1.12
        baseInventory *= 1.18
      } else { // Winter
        basePrice *= 0.94
        baseDaysOnMarket *= 1.28
        baseInventory *= 1.35
      }
      
      const yearProgress = monthsBack / 12
      const growthTrend = 7.5 - (yearProgress * 2.5)
      const metroVolume = Math.round(2800 + Math.random() * 600)
      const metroInventory = Math.round(baseInventory * (1 + Math.random() * 0.25 - 0.125) * 10) / 10
      
      houstonWideData.push({
        areaName: 'Houston Metro',
        areaType: 'metro',
        period: 'monthly',
        medianPrice: Math.round(basePrice * (1 + Math.random() * 0.08 - 0.04)),
        avgDaysOnMarket: Math.round(baseDaysOnMarket * (1 + Math.random() * 0.15 - 0.075)),
        inventoryMonths: metroInventory,
        volumeSold: metroVolume, // Metro-wide volume
        activeListings: Math.round(metroVolume * metroInventory),
        changeYoY: Math.round((growthTrend + Math.random() * 3 - 1.5) * 10) / 10,
        startDate: date,
        endDate
      })
    }
    
    let houstonImported = 0
    for (const data of houstonWideData) {
      try {
        await prisma.marketMetrics.create({
          data
        })
        houstonImported++
      } catch (error) {
        console.error(`❌ Error importing Houston Metro data:`, error)
      }
    }
    
    // Verify total data
    const totalMetrics = await prisma.marketMetrics.count()
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 MARKET TIMING DATA SUMMARY:')
    console.log(`✅ Imported ${importedCount} neighborhood market records`)
    console.log(`✅ Imported ${houstonImported} Houston Metro records`)
    console.log(`📈 Total market metrics in database: ${totalMetrics}`)
    console.log('🎯 Data covers 12 months of historical trends')
    console.log('🏠 Includes seasonal patterns and neighborhood variations')
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Population error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateMarketTimingData()