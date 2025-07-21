#!/usr/bin/env node
// Fetch and store all missing critical data for Houston Development Intelligence
import { PrismaClient } from '@prisma/client'
import { queryPerplexity } from '../lib/services/data-intelligence'
import { perplexityFetcher } from '../lib/services/data-refresh/perplexity-fetcher'

const prisma = new PrismaClient()

interface FetchResult {
  category: string
  success: boolean
  recordsAdded: number
  error?: string
}

async function fetchAllMissingData() {
  console.log('🚀 Houston Development Intelligence - Fetching All Missing Data')
  console.log('============================================================\n')
  
  const results: FetchResult[] = []
  
  try {
    // 1. HOUSING INVENTORY & ACTIVE LISTINGS
    console.log('🏠 FETCHING HOUSING INVENTORY DATA...\n')
    const inventoryResult = await fetchInventoryData()
    results.push(inventoryResult)
    
    // 2. BUILDING PERMITS & CONSTRUCTION
    console.log('\n🏗️  FETCHING BUILDING PERMITS DATA...\n')
    const permitsResult = await fetchPermitsData()
    results.push(permitsResult)
    
    // 3. TRANSACTION DATA & SALES
    console.log('\n💰 FETCHING TRANSACTION DATA...\n')
    const transactionResult = await fetchTransactionData()
    results.push(transactionResult)
    
    // 4. INTEREST RATES & FINANCING
    console.log('\n📈 FETCHING INTEREST RATES DATA...\n')
    const ratesResult = await fetchInterestRatesData()
    results.push(ratesResult)
    
    // 5. RENTAL MARKET DYNAMICS
    console.log('\n🏢 FETCHING RENTAL MARKET DATA...\n')
    const rentalResult = await fetchRentalMarketData()
    results.push(rentalResult)
    
    // 6. DEVELOPMENT PROJECTS
    console.log('\n🏗️  FETCHING DEVELOPMENT PROJECTS...\n')
    const projectsResult = await fetchDevelopmentProjects()
    results.push(projectsResult)
    
    // Summary
    console.log('\n\n📊 DATA FETCH SUMMARY')
    console.log('═══════════════════════════════════════')
    
    let totalRecords = 0
    results.forEach(result => {
      const status = result.success ? '✅' : '❌'
      console.log(`${status} ${result.category}: ${result.recordsAdded} records${result.error ? ' - ' + result.error : ''}`)
      totalRecords += result.recordsAdded
    })
    
    console.log('═══════════════════════════════════════')
    console.log(`TOTAL NEW RECORDS: ${totalRecords}`)
    
    // Check current data counts
    console.log('\n📈 UPDATED DATABASE STATISTICS:')
    const counts = {
      'Market Intelligence': await getTableCount('marketIntelligence'),
      'Economic Indicators': await getTableCount('economicIndicator'),
      'Projects': await getTableCount('project'),
      'Developers': await getTableCount('developer'),
      'Rental Markets': await getTableCount('rentalMarket'),
      'Construction Costs': await getTableCount('constructionCost'),
    }
    
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count.toLocaleString()} records`)
    })
    
  } catch (error) {
    console.error('❌ Critical error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Fetch housing inventory data
async function fetchInventoryData(): Promise<FetchResult> {
  try {
    const queries = [
      'What is the current housing inventory in Houston Texas by neighborhood July 2025? Include total active listings and months of supply.',
      'What are the average days on market for homes in Houston Texas by price range?',
      'What neighborhoods in Houston have the most new listings this month?'
    ]
    
    let recordsAdded = 0
    
    for (const query of queries) {
      const response = await queryPerplexity(query)
      console.log(`Query: ${query.substring(0, 50)}...`)
      
      // Extract and store data
      const marketData = await perplexityFetcher.fetchMarketData(query)
      if (marketData) {
        await storeMarketIntelligence('inventory', marketData.topic, marketData.summary, marketData.extractedNumbers[0])
        recordsAdded++
        
        // Extract specific metrics
        const inventoryMatch = response.match(/(\d+,?\d*)\s*(?:homes?|active listings?)/gi)
        const domMatch = response.match(/(\d+)\s*days?\s*on\s*market/gi)
        const supplyMatch = response.match(/(\d+\.?\d*)\s*months?\s*(?:of\s*)?supply/gi)
        
        if (inventoryMatch || domMatch || supplyMatch) {
          console.log(`   📊 Found: ${inventoryMatch?.[0] || ''} ${domMatch?.[0] || ''} ${supplyMatch?.[0] || ''}`)
        }
      }
    }
    
    return { category: 'Housing Inventory', success: true, recordsAdded }
  } catch (error) {
    return { category: 'Housing Inventory', success: false, recordsAdded: 0, error: error.message }
  }
}

// Fetch building permits data
async function fetchPermitsData(): Promise<FetchResult> {
  try {
    const queries = [
      'What new construction permits were filed in Houston Texas in July 2025? Include permit counts and values.',
      'Which Houston developers filed the most building permits in 2025?',
      'What areas of Houston have the most construction activity based on permits?'
    ]
    
    let recordsAdded = 0
    
    for (const query of queries) {
      const response = await queryPerplexity(query)
      console.log(`Query: ${query.substring(0, 50)}...`)
      
      const newsData = await perplexityFetcher.fetchDevelopmentNews(query)
      if (newsData && newsData.projects) {
        for (const project of newsData.projects) {
          // Store as project if it has enough detail
          if (project.name && project.developer) {
            await storeProject(project)
            recordsAdded++
          }
        }
      }
      
      // Store general permit data
      await storeMarketIntelligence('permits', 'Construction Activity', response.substring(0, 500))
      recordsAdded++
    }
    
    return { category: 'Building Permits', success: true, recordsAdded }
  } catch (error) {
    return { category: 'Building Permits', success: false, recordsAdded: 0, error: error.message }
  }
}

// Fetch transaction data
async function fetchTransactionData(): Promise<FetchResult> {
  try {
    const queries = [
      'What is the current sales velocity and closed sales count in Houston real estate July 2025?',
      'What percentage of Houston home sales are cash versus financed?',
      'What is the average sale to list price ratio in Houston?'
    ]
    
    let recordsAdded = 0
    
    for (const query of queries) {
      const response = await queryPerplexity(query)
      const marketData = await perplexityFetcher.fetchMarketData(query)
      
      if (marketData) {
        await storeMarketIntelligence('transactions', marketData.topic, marketData.summary, marketData.extractedNumbers[0])
        recordsAdded++
        
        // Extract transaction metrics
        const salesMatch = response.match(/(\d+,?\d*)\s*(?:closed sales?|homes? sold)/gi)
        const cashMatch = response.match(/(\d+\.?\d*)%?\s*cash/gi)
        const ratioMatch = response.match(/(\d+\.?\d*)%?\s*(?:sale-to-list|list-to-sale)/gi)
        
        if (salesMatch || cashMatch || ratioMatch) {
          console.log(`   💰 Found: ${salesMatch?.[0] || ''} ${cashMatch?.[0] || ''} ${ratioMatch?.[0] || ''}`)
        }
      }
    }
    
    return { category: 'Transaction Data', success: true, recordsAdded }
  } catch (error) {
    return { category: 'Transaction Data', success: false, recordsAdded: 0, error: error.message }
  }
}

// Fetch interest rates data
async function fetchInterestRatesData(): Promise<FetchResult> {
  try {
    const queries = [
      'What are current mortgage rates in Houston Texas July 2025? Include 30-year, 15-year, and ARM rates.',
      'What are current FHA and VA loan limits for Houston Texas 2025?',
      'How have mortgage rates affected Houston home affordability?'
    ]
    
    let recordsAdded = 0
    
    for (const query of queries) {
      const economicData = await perplexityFetcher.fetchEconomicData(query)
      
      if (economicData) {
        await prisma.economicIndicator.upsert({
          where: {
            indicatorName_reportDate: {
              indicatorName: economicData.indicator,
              reportDate: new Date()
            }
          },
          update: {
            currentValue: economicData.value,
            unit: economicData.unit
          },
          create: {
            indicatorName: economicData.indicator,
            category: 'financing',
            currentValue: economicData.value,
            unit: economicData.unit || '%',
            frequency: 'weekly',
            reportDate: new Date()
          }
        })
        recordsAdded++
        
        console.log(`   📈 Stored: ${economicData.indicator} = ${economicData.value}${economicData.unit}`)
      }
    }
    
    return { category: 'Interest Rates', success: true, recordsAdded }
  } catch (error) {
    return { category: 'Interest Rates', success: false, recordsAdded: 0, error: error.message }
  }
}

// Fetch rental market data
async function fetchRentalMarketData(): Promise<FetchResult> {
  try {
    const queries = [
      'What are current apartment vacancy rates in Houston by submarket July 2025?',
      'What is the rental absorption rate for new apartments in Houston?',
      'What rental concessions are Houston apartments offering?'
    ]
    
    let recordsAdded = 0
    
    for (const query of queries) {
      const response = await queryPerplexity(query)
      const marketData = await perplexityFetcher.fetchMarketData(query)
      
      if (marketData) {
        await storeMarketIntelligence('rentals', marketData.topic, marketData.summary, marketData.extractedNumbers[0])
        recordsAdded++
        
        // Update rental market records if we have neighborhood data
        if (marketData.neighborhoods) {
          for (const [neighborhood, value] of Object.entries(marketData.neighborhoods)) {
            await prisma.rentalMarket.updateMany({
              where: { neighborhood },
              data: { 
                occupancyRate: typeof value === 'number' ? 100 - value : undefined,
                reportDate: new Date()
              }
            })
          }
        }
      }
    }
    
    return { category: 'Rental Market', success: true, recordsAdded }
  } catch (error) {
    return { category: 'Rental Market', success: false, recordsAdded: 0, error: error.message }
  }
}

// Fetch development projects
async function fetchDevelopmentProjects(): Promise<FetchResult> {
  try {
    const queries = [
      'What major real estate development projects were announced in Houston Texas July 2025? Include project names, developers, and investment amounts.',
      'What mixed-use developments are under construction in Houston?',
      'Which Houston neighborhoods have the most development activity?'
    ]
    
    let recordsAdded = 0
    
    for (const query of queries) {
      const newsData = await perplexityFetcher.fetchDevelopmentNews(query)
      
      if (newsData && newsData.projects) {
        for (const project of newsData.projects) {
          const added = await storeProject(project)
          if (added) recordsAdded++
        }
      }
    }
    
    return { category: 'Development Projects', success: true, recordsAdded }
  } catch (error) {
    return { category: 'Development Projects', success: false, recordsAdded: 0, error: error.message }
  }
}

// Helper functions
async function storeMarketIntelligence(category: string, metric: string, value: string, numericValue?: number) {
  try {
    await prisma.marketIntelligence.create({
      data: {
        metricName: metric,
        metricValue: value.substring(0, 1000),
        numericValue: numericValue || 0,
        category: category,
        subCategory: 'weekly_refresh',
        period: 'current',
        periodStart: new Date(),
        periodEnd: new Date(),
        confidence: 85
      }
    })
  } catch (error) {
    console.error(`Failed to store ${category} data:`, error.message)
  }
}

async function storeProject(project: any): Promise<boolean> {
  try {
    // Check if project exists
    const existing = await prisma.project.findFirst({
      where: { name: project.name }
    })
    
    if (existing) return false
    
    // Find or create developer
    let developer = await prisma.developer.findFirst({
      where: { name: project.developer }
    })
    
    if (!developer && project.developer) {
      developer = await prisma.developer.create({
        data: {
          name: project.developer,
          companyType: 'developer',
          activeProjects: 1,
          totalValue: project.value || 0,
          primaryFocus: project.type || 'mixed-use',
          targetMarket: ['Houston']
        }
      })
    }
    
    if (developer) {
      await prisma.project.create({
        data: {
          name: project.name,
          projectType: project.type || 'development',
          area: project.location || 'Houston',
          description: project.description || '',
          totalValue: project.value || 0,
          phase: 'planning',
          developerId: developer.id,
          announcedDate: new Date()
        }
      })
      return true
    }
    
    return false
  } catch (error) {
    console.error(`Failed to store project ${project.name}:`, error.message)
    return false
  }
}

async function getTableCount(table: string): Promise<number> {
  try {
    return await (prisma as any)[table].count()
  } catch {
    return 0
  }
}

// Run the fetch
fetchAllMissingData().catch(console.error)