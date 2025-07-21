#!/usr/bin/env node
// Configure weekly refresh for critical Houston data
import { dataRefreshManager } from '../lib/services/data-refresh/refresh-manager'
import { cronManager } from '../lib/services/data-refresh/cron-manager'
import { alertService } from '../lib/services/data-refresh/alert-service'

async function configureWeeklyRefresh() {
  console.log('⚙️  Houston Development Intelligence - Weekly Refresh Configuration')
  console.log('================================================================\n')
  
  // 1. Configure refresh sources
  console.log('📋 Configuring Data Sources for Weekly Refresh:\n')
  
  const weeklyRefreshConfig = {
    monday: {
      time: '6:00 AM CST',
      sources: [
        {
          name: 'Housing Inventory',
          queries: [
            'Houston real estate inventory levels by neighborhood current month',
            'Average days on market for Houston homes by price range',
            'Houston housing months of supply by area'
          ]
        },
        {
          name: 'Transaction Data',
          queries: [
            'Houston home sales velocity and closed sales counts',
            'Cash versus financed home sales percentage Houston',
            'Sale to list price ratio Houston real estate'
          ]
        }
      ]
    },
    
    wednesday: {
      time: '6:00 AM CST',
      sources: [
        {
          name: 'Building Permits',
          queries: [
            'New construction permits filed Houston Texas this week',
            'Houston developers with most building permits current month',
            'Construction permit values by Houston area'
          ]
        },
        {
          name: 'Development Projects',
          queries: [
            'Major development projects announced Houston this week',
            'Mixed-use developments under construction Houston',
            'Houston neighborhoods with most development activity'
          ]
        }
      ]
    },
    
    friday: {
      time: '6:00 AM CST',
      sources: [
        {
          name: 'Interest Rates',
          queries: [
            'Current mortgage rates Houston Texas all types',
            'FHA VA loan limits Houston current',
            'Mortgage rate impact Houston affordability'
          ]
        },
        {
          name: 'Rental Market',
          queries: [
            'Houston apartment vacancy rates by submarket',
            'Rental absorption rate new Houston apartments',
            'Rental concessions Houston apartment market'
          ]
        }
      ]
    }
  }
  
  // Display schedule
  console.log('📅 WEEKLY REFRESH SCHEDULE:')
  console.log('─────────────────────────────────────\n')
  
  Object.entries(weeklyRefreshConfig).forEach(([day, config]) => {
    console.log(`${day.toUpperCase()} @ ${config.time}:`)
    config.sources.forEach(source => {
      console.log(`  📊 ${source.name}`)
      source.queries.forEach(query => {
        console.log(`     • ${query}`)
      })
    })
    console.log()
  })
  
  // 2. Configure alert thresholds
  console.log('🚨 ALERT THRESHOLDS:')
  console.log('─────────────────────────────────────\n')
  
  const alertThresholds = {
    inventory: {
      metric: 'Housing Inventory Change',
      low: 5,
      medium: 10,
      high: 20,
      unit: '%'
    },
    price: {
      metric: 'Median Price Change',
      low: 2,
      medium: 5,
      high: 10,
      unit: '%'
    },
    permits: {
      metric: 'Permit Volume Change',
      low: 10,
      medium: 25,
      high: 50,
      unit: '%'
    },
    vacancy: {
      metric: 'Vacancy Rate Change',
      low: 1,
      medium: 3,
      high: 5,
      unit: 'percentage points'
    },
    rates: {
      metric: 'Interest Rate Change',
      low: 0.125,
      medium: 0.25,
      high: 0.5,
      unit: 'percentage points'
    }
  }
  
  Object.entries(alertThresholds).forEach(([key, threshold]) => {
    console.log(`${threshold.metric}:`)
    console.log(`  🟢 Low: >${threshold.low}${threshold.unit}`)
    console.log(`  🟡 Medium: >${threshold.medium}${threshold.unit}`)
    console.log(`  🔴 High: >${threshold.high}${threshold.unit}`)
    console.log()
  })
  
  // 3. Create npm scripts
  console.log('📝 NPM SCRIPTS TO ADD TO package.json:')
  console.log('─────────────────────────────────────\n')
  
  const npmScripts = `
  "scripts": {
    // ... existing scripts ...
    
    // Weekly refresh commands
    "refresh:all": "tsx scripts/test-data-refresh.ts",
    "refresh:inventory": "tsx scripts/refresh-inventory.ts",
    "refresh:permits": "tsx scripts/refresh-permits.ts",
    "refresh:transactions": "tsx scripts/refresh-transactions.ts",
    "refresh:rates": "tsx scripts/refresh-rates.ts",
    "refresh:rentals": "tsx scripts/refresh-rentals.ts",
    
    // Cron management
    "cron:start": "tsx scripts/start-cron.ts",
    "cron:stop": "tsx scripts/stop-cron.ts",
    "cron:status": "tsx scripts/cron-status.ts",
    
    // Alert management
    "alerts:test": "tsx scripts/test-alerts.ts",
    "alerts:config": "tsx scripts/configure-alerts.ts"
  }`
  
  console.log(npmScripts)
  
  // 4. Create cron configuration
  console.log('\n🕐 CRON JOB CONFIGURATION:')
  console.log('─────────────────────────────────────\n')
  
  const cronJobs = `
// Add to lib/services/data-refresh/cron-manager.ts

const WEEKLY_REFRESH_JOBS = [
  {
    name: 'monday_inventory_refresh',
    schedule: '0 6 * * 1', // Every Monday at 6 AM
    task: async () => {
      await dataRefreshManager.refreshDataSource({
        source: 'perplexity_market_trends',
        frequency: 'weekly',
        enabled: true
      })
    }
  },
  {
    name: 'wednesday_permits_refresh',
    schedule: '0 6 * * 3', // Every Wednesday at 6 AM
    task: async () => {
      await dataRefreshManager.refreshDataSource({
        source: 'construction_permits',
        frequency: 'weekly',
        enabled: true
      })
    }
  },
  {
    name: 'friday_rates_refresh',
    schedule: '0 6 * * 5', // Every Friday at 6 AM
    task: async () => {
      await dataRefreshManager.refreshDataSource({
        source: 'perplexity_economic_data',
        frequency: 'weekly',
        enabled: true
      })
    }
  }
]`
  
  console.log(cronJobs)
  
  // 5. Environment variables
  console.log('\n\n🔐 ENVIRONMENT VARIABLES TO SET:')
  console.log('─────────────────────────────────────\n')
  
  console.log('# Add to .env for production')
  console.log('ENABLE_WEEKLY_REFRESH=true')
  console.log('ALERT_EMAIL=your-email@example.com')
  console.log('SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...')
  console.log('ALERT_MIN_SIGNIFICANCE=medium')
  
  // 6. Quick start guide
  console.log('\n\n🚀 QUICK START GUIDE:')
  console.log('─────────────────────────────────────\n')
  
  console.log('1. Add npm scripts to package.json')
  console.log('2. Set environment variables')
  console.log('3. Test individual refreshes:')
  console.log('   npm run refresh:inventory')
  console.log('   npm run refresh:permits')
  console.log('4. Start cron jobs:')
  console.log('   npm run cron:start')
  console.log('5. Monitor alerts:')
  console.log('   npm run alerts:test')
  
  console.log('\n✅ Weekly refresh configuration complete!')
  console.log('\nThe system will automatically:')
  console.log('• Fetch fresh data every Monday, Wednesday, and Friday')
  console.log('• Detect significant market changes')
  console.log('• Send alerts when thresholds are exceeded')
  console.log('• Keep Fernando-X updated with latest intelligence')
}

configureWeeklyRefresh().catch(console.error)