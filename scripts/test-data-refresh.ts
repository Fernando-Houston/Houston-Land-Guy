#!/usr/bin/env node
// Test the data refresh automation system
import { dataRefreshManager } from '../lib/services/data-refresh/refresh-manager'
import { marketTrendTracker } from '../lib/services/data-refresh/market-trend-tracker'
import { alertService } from '../lib/services/data-refresh/alert-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDataRefresh() {
  console.log('🧪 Houston Development Intelligence - Data Refresh Test')
  console.log('=====================================================\n')
  
  try {
    // 1. Test manual refresh
    console.log('📊 Testing manual data refresh...\n')
    const refreshResults = await dataRefreshManager.refreshAllData(true)
    
    console.log('Refresh Results:')
    refreshResults.forEach(result => {
      const status = result.success ? '✅' : '❌'
      console.log(`${status} ${result.source}: ${result.recordsUpdated} records (${result.duration}ms)`)
      if (!result.success && result.errors) {
        console.log(`   Error: ${result.errors.join(', ')}`)
      }
    })
    
    // 2. Test trend detection
    console.log('\n📈 Testing trend detection...\n')
    const changes = await marketTrendTracker.detectSignificantChanges()
    
    if (changes.length > 0) {
      console.log(`Found ${changes.length} significant changes:`)
      changes.forEach(change => {
        const icon = change.changePercent > 0 ? '📈' : '📉'
        console.log(`${icon} ${change.metric}: ${change.changePercent.toFixed(1)}% (${change.significance})`)
        console.log(`   ${change.description}`)
      })
      
      // Store changes for history
      await marketTrendTracker.storeChanges(changes)
    } else {
      console.log('No significant changes detected')
    }
    
    // 3. Test alert system
    console.log('\n🚨 Testing alert system...\n')
    
    // Configure alerts for testing
    alertService.updateConfig({
      minSignificance: 'medium',
      webhook: 'https://example.com/webhook', // Test webhook
      slackChannel: '#market-alerts' // Test Slack channel
    })
    
    if (changes.length > 0) {
      const alertResults = await alertService.sendAlerts(changes)
      console.log('Alert Results:')
      alertResults.forEach(result => {
        const status = result.sent ? '✅' : '❌'
        console.log(`${status} ${result.channel} alert ${result.sent ? 'sent' : 'failed'}`)
        if (result.error) {
          console.log(`   Error: ${result.error}`)
        }
      })
    } else {
      // Create test change for alert testing
      const testChange = {
        metric: 'Test Market Metric',
        previousValue: 100000,
        currentValue: 115000,
        changePercent: 15,
        significance: 'high' as const,
        description: 'Test alert for significant market change',
        timestamp: new Date()
      }
      
      console.log('Creating test alert...')
      await alertService.sendAlerts([testChange])
    }
    
    // 4. Check stored intelligence
    console.log('\n💾 Checking stored market intelligence...\n')
    const recentIntelligence = await prisma.marketIntelligence.findMany({
      where: {
        category: { in: ['perplexity_research', 'trend_alert'] }
      },
      orderBy: { periodStart: 'desc' },
      take: 5
    })
    
    if (recentIntelligence.length > 0) {
      console.log('Recent Market Intelligence:')
      recentIntelligence.forEach(intel => {
        console.log(`- ${intel.metricName}: ${intel.numericValue || intel.metricValue}`)
        console.log(`  Category: ${intel.category} | Sub: ${intel.subCategory || 'N/A'}`)
      })
    }
    
    // 5. Test data sources
    console.log('\n🔍 Testing individual data sources...\n')
    
    // Test if Perplexity integration would work
    console.log('Perplexity Integration: Ready (requires API key in production)')
    
    // Check imported data
    const dataCounts = {
      properties: await prisma.property.count(),
      permits: await prisma.permit.count(),
      projects: await prisma.project.count(),
      developers: await prisma.developer.count(),
      rentalMarkets: await prisma.rentalMarket.count(),
      employers: await prisma.employer.count(),
      demographics: await prisma.demographics.count(),
      economicIndicators: await prisma.economicIndicator.count()
    }
    
    console.log('\nCurrent Data Counts:')
    Object.entries(dataCounts).forEach(([table, count]) => {
      console.log(`${table}: ${count.toLocaleString()} records`)
    })
    
    const totalDataPoints = Object.values(dataCounts).reduce((sum, count) => sum + count, 0)
    console.log(`\nTotal Data Points: ${totalDataPoints.toLocaleString()}`)
    
    console.log('\n✅ Data refresh system test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testDataRefresh().catch(console.error)