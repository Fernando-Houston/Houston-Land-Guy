#!/usr/bin/env node
// Set up weekly data refresh for critical metrics
import { PrismaClient } from '@prisma/client'
import { queryPerplexity } from '../lib/services/data-intelligence'

const prisma = new PrismaClient()

// Define critical weekly queries
const WEEKLY_QUERIES = {
  inventory: [
    'What is the current housing inventory in Houston Texas by neighborhood? Include months of supply and total active listings.',
    'What are the average days on market for homes in Houston Texas? Break down by price range and area.',
    'What is the current list-to-sale price ratio in Houston Texas real estate market?'
  ],
  
  permits: [
    'What new construction permits were filed in Houston Texas in the last week? Include residential and commercial.',
    'Which Houston developers filed the most building permits recently? Include project details.',
    'What are the total construction permit values in Houston by area for the current month?'
  ],
  
  transactions: [
    'What is the current sales velocity in Houston real estate? Include closed sales counts by area.',
    'What percentage of Houston home sales are cash vs financed in the current market?',
    'What are the hottest selling neighborhoods in Houston based on recent sales data?'
  ],
  
  rates: [
    'What are current mortgage rates in Houston Texas? Include 30-year, 15-year, and ARM rates.',
    'What are current FHA and VA loan limits for Houston Texas?',
    'How have mortgage rates affected Houston home buying activity recently?'
  ],
  
  rentals: [
    'What are current apartment vacancy rates in Houston by submarket?',
    'What rental concessions are being offered in Houston apartment complexes?',
    'What is the current rental absorption rate for new Houston apartment buildings?'
  ]
}

async function setupWeeklyRefresh() {
  console.log('📅 Setting Up Weekly Data Refresh Schedule')
  console.log('=========================================\n')
  
  try {
    // Create refresh configuration
    const refreshConfigs = [
      {
        name: 'Housing Inventory & Active Listings',
        category: 'inventory',
        schedule: 'Every Monday 6AM',
        priority: 'HIGH',
        queries: WEEKLY_QUERIES.inventory
      },
      {
        name: 'Building Permits & Construction',
        category: 'permits',
        schedule: 'Every Wednesday 6AM',
        priority: 'HIGH',
        queries: WEEKLY_QUERIES.permits
      },
      {
        name: 'Transaction Data & Sales',
        category: 'transactions',
        schedule: 'Every Monday 6AM',
        priority: 'HIGH',
        queries: WEEKLY_QUERIES.transactions
      },
      {
        name: 'Interest Rates & Financing',
        category: 'rates',
        schedule: 'Every Friday 6AM',
        priority: 'MEDIUM',
        queries: WEEKLY_QUERIES.rates
      },
      {
        name: 'Rental Market Dynamics',
        category: 'rentals',
        schedule: 'Every Friday 6AM',
        priority: 'MEDIUM',
        queries: WEEKLY_QUERIES.rentals
      }
    ]
    
    console.log('📋 Weekly Refresh Schedule:\n')
    
    // Display schedule
    const schedule = {
      Monday: ['Housing Inventory', 'Transaction Data'],
      Wednesday: ['Building Permits'],
      Friday: ['Interest Rates', 'Rental Market']
    }
    
    Object.entries(schedule).forEach(([day, items]) => {
      console.log(`${day}:`)
      items.forEach(item => console.log(`  - ${item}`))
    })
    
    // Test one query from each category
    console.log('\n🧪 Testing Sample Queries:\n')
    
    for (const [category, queries] of Object.entries(WEEKLY_QUERIES)) {
      console.log(`\n📊 ${category.toUpperCase()}`)
      console.log('─'.repeat(50))
      
      try {
        // Test first query in category
        const response = await queryPerplexity(queries[0])
        console.log(response.substring(0, 200) + '...')
        
        // Extract key metrics
        const numbers = response.match(/\d+(?:,\d+)*(?:\.\d+)?%?/g) || []
        if (numbers.length > 0) {
          console.log(`📈 Key metrics: ${numbers.slice(0, 5).join(', ')}`)
        }
        
      } catch (error) {
        console.error(`❌ Error testing ${category}: ${error.message}`)
      }
    }
    
    // Create automation script
    console.log('\n\n💾 Creating Automation Configuration...\n')
    
    const automationConfig = `
# Houston Development Intelligence - Weekly Refresh Configuration

## Automated Data Collection Schedule

### 🏠 MONDAY - Market Movement
- Housing inventory levels
- Active listing counts  
- New listings vs sold
- Days on market trends
- Transaction volumes

### 🏗️ WEDNESDAY - Development Activity
- New permit filings
- Construction starts
- Developer activity
- Project pipelines
- Zoning applications

### 💰 FRIDAY - Investment Metrics
- Mortgage rate changes
- Rental market dynamics
- Vacancy rates
- Cap rate trends
- Cash flow indicators

## Implementation Commands

\`\`\`bash
# Start automated refresh
npm run cron:start

# Test specific category
npm run refresh:inventory
npm run refresh:permits
npm run refresh:rates

# Manual refresh all
npm run refresh:all
\`\`\`

## Alert Thresholds

- Inventory change > 10% = HIGH alert
- Median price change > 5% = MEDIUM alert  
- Permit volume change > 25% = HIGH alert
- Vacancy rate change > 3% = MEDIUM alert
- Interest rate change > 0.25% = HIGH alert
`
    
    console.log(automationConfig)
    
    console.log('\n✅ Weekly refresh configuration complete!')
    console.log('\nNext steps:')
    console.log('1. Enable cron jobs in production')
    console.log('2. Set up alert channels (email/Slack)')
    console.log('3. Create dashboard to visualize trends')
    console.log('4. Configure Fernando-X to use fresh data')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupWeeklyRefresh().catch(console.error)