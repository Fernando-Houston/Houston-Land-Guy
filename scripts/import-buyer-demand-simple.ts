#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Buyer demand patterns by neighborhood
const demandPatterns = [
  // High demand neighborhoods
  { area: 'The Woodlands', demandLevel: 'Very High', buyerSearches: 4500, avgBudget: 550000, investmentScore: 92 },
  { area: 'Katy', demandLevel: 'Very High', buyerSearches: 4200, avgBudget: 425000, investmentScore: 89 },
  { area: 'Sugar Land', demandLevel: 'Very High', buyerSearches: 3800, avgBudget: 475000, investmentScore: 87 },
  { area: 'Memorial', demandLevel: 'High', buyerSearches: 3500, avgBudget: 950000, investmentScore: 85 },
  { area: 'River Oaks', demandLevel: 'High', buyerSearches: 2800, avgBudget: 2500000, investmentScore: 88 },
  { area: 'Pearland', demandLevel: 'High', buyerSearches: 3200, avgBudget: 375000, investmentScore: 82 },
  { area: 'Spring', demandLevel: 'High', buyerSearches: 2900, avgBudget: 385000, investmentScore: 80 },
  { area: 'Cypress', demandLevel: 'High', buyerSearches: 3100, avgBudget: 395000, investmentScore: 81 },
  
  // Medium demand neighborhoods
  { area: 'Heights', demandLevel: 'Medium', buyerSearches: 2400, avgBudget: 650000, investmentScore: 75 },
  { area: 'Montrose', demandLevel: 'Medium', buyerSearches: 2200, avgBudget: 575000, investmentScore: 73 },
  { area: 'Midtown', demandLevel: 'Medium', buyerSearches: 2000, avgBudget: 425000, investmentScore: 70 },
  { area: 'Galleria', demandLevel: 'Medium', buyerSearches: 2100, avgBudget: 525000, investmentScore: 72 },
  { area: 'Clear Lake', demandLevel: 'Medium', buyerSearches: 1900, avgBudget: 365000, investmentScore: 68 },
  { area: 'Energy Corridor', demandLevel: 'Medium', buyerSearches: 1800, avgBudget: 485000, investmentScore: 71 },
  
  // Emerging areas
  { area: 'EaDo', demandLevel: 'Growing', buyerSearches: 1500, avgBudget: 385000, investmentScore: 78 },
  { area: 'Third Ward', demandLevel: 'Growing', buyerSearches: 1200, avgBudget: 325000, investmentScore: 74 },
  { area: 'Northside', demandLevel: 'Growing', buyerSearches: 1100, avgBudget: 285000, investmentScore: 72 },
  { area: 'Sunnyside', demandLevel: 'Growing', buyerSearches: 900, avgBudget: 225000, investmentScore: 70 }
]

async function importBuyerDemandData() {
  console.log('📊 Starting Buyer Demand Data Import (MarketIntelligence)...')
  console.log('=' .repeat(60))
  
  try {
    let importCount = 0
    
    for (const pattern of demandPatterns) {
      try {
        // Create market intelligence record for buyer demand
        await prisma.marketIntelligence.create({
          data: {
            dataType: 'buyer_demand',
            neighborhood: pattern.area,
            investmentScore: pattern.investmentScore,
            capRate: pattern.investmentScore > 80 ? 7.5 : pattern.investmentScore > 70 ? 6.5 : 5.5,
            roi: pattern.investmentScore > 80 ? 12.5 : pattern.investmentScore > 70 ? 10.5 : 8.5,
            marketShare: pattern.buyerSearches / 100, // Convert to percentage
            competitors: Math.floor(pattern.buyerSearches / 100), // Estimate active agents
            walkabilityScore: pattern.area === 'Midtown' || pattern.area === 'Montrose' ? 85 : 
                             pattern.area === 'Heights' || pattern.area === 'EaDo' ? 75 : 65,
            dataDate: new Date(),
            metadata: {
              demandLevel: pattern.demandLevel,
              monthlySearches: pattern.buyerSearches,
              averageBudget: pattern.avgBudget,
              demandTrend: pattern.demandLevel === 'Very High' ? 'increasing' : 
                          pattern.demandLevel === 'Growing' ? 'emerging' : 'stable',
              competitionIndex: pattern.demandLevel === 'Very High' ? 85 : 
                               pattern.demandLevel === 'High' ? 70 : 
                               pattern.demandLevel === 'Medium' ? 50 : 35
            }
          }
        })
        
        console.log(`✅ Imported buyer demand data for ${pattern.area}`)
        importCount++
      } catch (error) {
        console.error(`❌ Error importing ${pattern.area}:`, error)
      }
    }
    
    // Also create some search trend records
    const searchTrends = [
      { keyword: 'homes for sale houston', volume: 12500, trend: 18 },
      { keyword: 'new construction houston', volume: 8200, trend: 32 },
      { keyword: 'houston real estate', volume: 9800, trend: 12 },
      { keyword: 'investment properties houston', volume: 4500, trend: 25 },
      { keyword: 'luxury homes houston', volume: 3200, trend: 8 }
    ]
    
    console.log('\n🔍 Importing search trends...')
    let trendCount = 0
    
    for (const trend of searchTrends) {
      try {
        await prisma.marketIntelligence.create({
          data: {
            dataType: 'search_trend',
            neighborhood: 'Houston-Wide',
            marketShare: trend.volume / 1000, // Convert to relative share
            investmentScore: 75 + (trend.trend / 2), // Higher trend = better score
            dataDate: new Date(),
            metadata: {
              keyword: trend.keyword,
              monthlyVolume: trend.volume,
              trendPercent: trend.trend,
              competitiveness: trend.volume > 10000 ? 'High' : 
                              trend.volume > 5000 ? 'Medium' : 'Low'
            }
          }
        })
        
        console.log(`✅ Imported search trend: ${trend.keyword}`)
        trendCount++
      } catch (error) {
        console.error(`❌ Error importing trend ${trend.keyword}:`, error)
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 BUYER DEMAND DATA IMPORT SUMMARY:')
    console.log(`✅ Imported ${importCount} neighborhood demand records`)
    console.log(`✅ Imported ${trendCount} search trend records`)
    console.log(`📈 Total records: ${importCount + trendCount}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importBuyerDemandData()