#!/usr/bin/env node
import { MarketAnalysisAgent } from '../lib/agents/market-analysis-agent'

async function testMarketAnalysisAgent() {
  console.log('🏢 Testing Market Analysis Agent\n')
  
  const agent = new MarketAnalysisAgent()
  
  try {
    // Test 1: Price Trend Analysis
    console.log('📈 Test 1: Analyzing Price Trends for ZIP 77006 (Montrose)...')
    const priceTrendTask = {
      id: 'task-1',
      type: 'price-trend' as const,
      priority: 1,
      data: {
        zipCode: '77006',
        timeframe: 12,
        includeForecasts: true
      }
    }
    
    const priceTrendResult = await agent.execute(priceTrendTask)
    console.log('\n✅ Price Trend Results:')
    console.log(`- Historical Appreciation: ${priceTrendResult.data.historicalTrends.totalAppreciation.toFixed(1)}%`)
    console.log(`- Monthly Growth Rate: ${priceTrendResult.data.historicalTrends.avgMonthlyChange.toFixed(2)}%`)
    console.log(`- Market Volatility: ${priceTrendResult.data.historicalTrends.volatility.toFixed(1)}%`)
    console.log(`- 6-Month Forecast: $${priceTrendResult.data.predictions[5]?.predictedPrice.toLocaleString()}`)
    console.log(`- Summary: ${priceTrendResult.data.summary}`)
    
    // Test 2: Neighborhood Rankings
    console.log('\n\n🏘️ Test 2: Ranking Houston Neighborhoods by Investment Potential...')
    const rankingTask = {
      id: 'task-2',
      type: 'neighborhood-ranking' as const,
      priority: 1,
      data: {}
    }
    
    const rankingResult = await agent.execute(rankingTask)
    console.log('\n✅ Top 3 Investment Neighborhoods:')
    rankingResult.data.rankings.slice(0, 3).forEach((neighborhood: any, index: number) => {
      console.log(`\n${index + 1}. ${neighborhood.neighborhood} (${neighborhood.zipCode})`)
      console.log(`   - Investment Score: ${neighborhood.investmentScore}/100`)
      console.log(`   - Appreciation: ${neighborhood.metrics.appreciation.toFixed(1)}%`)
      console.log(`   - Rental Yield: ${neighborhood.metrics.rentalYield.toFixed(1)}%`)
      console.log(`   - Market Trend: ${neighborhood.trend}`)
    })
    
    // Test 3: Construction Correlation
    console.log('\n\n🏗️ Test 3: Analyzing Construction Impact on Prices...')
    const constructionTask = {
      id: 'task-3',
      type: 'construction-correlation' as const,
      priority: 1,
      data: {
        zipCode: '77006'
      }
    }
    
    const constructionResult = await agent.execute(constructionTask)
    console.log('\n✅ Construction Correlation Analysis:')
    console.log(`- Correlation Score: ${constructionResult.data.correlations[0].correlationScore}`)
    console.log(`- Average Price Impact: +${constructionResult.data.correlations[0].priceImpact}%`)
    console.log(`- Time Lag: ${constructionResult.data.correlations[0].timelag} months`)
    console.log(`- ${constructionResult.data.impactAnalysis.impactSummary}`)
    
    // Test 4: Market Heat Map
    console.log('\n\n🗺️ Test 4: Generating Price Heat Map...')
    const heatMapTask = {
      id: 'task-4',
      type: 'market-heatmap' as const,
      priority: 1,
      data: {
        propertyType: 'price'
      }
    }
    
    const heatMapResult = await agent.execute(heatMapTask)
    console.log('\n✅ Heat Map Statistics:')
    console.log(`- Price Range: $${heatMapResult.data.statistics.min.toLocaleString()} - $${heatMapResult.data.statistics.max.toLocaleString()}`)
    console.log(`- Average Price: $${Math.round(heatMapResult.data.statistics.avg).toLocaleString()}`)
    console.log(`- Hot Spots: ${heatMapResult.data.statistics.hotSpots} zip codes`)
    console.log(`- Top Hot Spot: ${heatMapResult.data.hotSpots[0]?.zipCode} ($${heatMapResult.data.hotSpots[0]?.value.toLocaleString()})`)
    
    // Test 5: ROI Calculations
    console.log('\n\n💰 Test 5: Calculating ROI for Single-Family Home...')
    const roiTask = {
      id: 'task-5',
      type: 'roi-calculation' as const,
      priority: 1,
      data: {
        propertyType: 'single-family',
        zipCode: '77006'
      }
    }
    
    const roiResult = await agent.execute(roiTask)
    console.log('\n✅ ROI Analysis:')
    roiResult.data.calculations.forEach((calc: any) => {
      console.log(`\n${calc.scenario} Scenario:`)
      console.log(`  - Monthly Cash Flow: $${calc.roi.metrics.cashFlow.toFixed(0)}`)
      console.log(`  - Cap Rate: ${calc.roi.metrics.capRate.toFixed(2)}%`)
      console.log(`  - Cash-on-Cash Return: ${calc.roi.metrics.cashOnCashReturn.toFixed(2)}%`)
      console.log(`  - Total ROI: ${calc.roi.metrics.totalROI.toFixed(2)}%`)
    })
    
    // Test 6: Emerging Neighborhoods
    console.log('\n\n🚀 Test 6: Identifying Emerging Neighborhoods...')
    const emergingTask = {
      id: 'task-6',
      type: 'emerging-neighborhoods' as const,
      priority: 1,
      data: {}
    }
    
    const emergingResult = await agent.execute(emergingTask)
    console.log('\n✅ Top 3 Emerging Neighborhoods:')
    emergingResult.data.emergingNeighborhoods.slice(0, 3).forEach((neighborhood: any, index: number) => {
      console.log(`\n${index + 1}. ${neighborhood.neighborhood} (${neighborhood.zipCode})`)
      console.log(`   - Emergence Score: ${(neighborhood.score * 100).toFixed(0)}/100`)
      console.log(`   - Key Factors: ${neighborhood.keyFactors.join(', ')}`)
      console.log(`   - 3-Year Growth: ${neighborhood.projectedGrowth.threeYear.toFixed(1)}%`)
    })
    
    console.log('\n\n✨ All Market Analysis tests completed successfully!')
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error)
  }
}

// Run the test
testMarketAnalysisAgent().catch(console.error)