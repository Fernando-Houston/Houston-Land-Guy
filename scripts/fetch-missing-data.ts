#!/usr/bin/env node
// Fetch missing data for Houston Development Intelligence
import { PrismaClient } from '@prisma/client'
import { perplexityFetcher } from '../lib/services/data-refresh/perplexity-fetcher'
import { queryPerplexity } from '../lib/services/data-intelligence'

const prisma = new PrismaClient()

async function fetchMissingData() {
  console.log('🔍 Houston Development Intelligence - Fetching Missing Data')
  console.log('========================================================\n')
  
  try {
    // 1. Test Perplexity connection
    console.log('🤖 Testing Perplexity API...')
    try {
      const testQuery = 'What is the current median home price in Houston Texas as of 2025?'
      const response = await queryPerplexity(testQuery)
      console.log('✅ Perplexity API working!')
      console.log(`Sample response: ${response.substring(0, 200)}...`)
    } catch (error) {
      console.error('❌ Perplexity API error:', error.message)
      console.log('Please check your PERPLEXITY_API_KEY in .env file')
      return
    }
    
    // 2. Fetch missing property data
    console.log('\n🏠 Fetching Houston property market data...')
    
    const propertyQueries = [
      {
        query: 'Houston Texas median home price by neighborhood 2025 latest data',
        type: 'price_by_area'
      },
      {
        query: 'Houston Texas housing inventory levels and months of supply current 2025',
        type: 'inventory'
      },
      {
        query: 'Houston Texas new home construction statistics and builder activity 2025',
        type: 'new_construction'
      },
      {
        query: 'Houston Texas real estate market forecast and predictions for 2025',
        type: 'forecast'
      }
    ]
    
    for (const { query, type } of propertyQueries) {
      console.log(`\nFetching ${type} data...`)
      const marketData = await perplexityFetcher.fetchMarketData(query)
      
      if (marketData) {
        // Store in market intelligence
        await prisma.marketIntelligence.create({
          data: {
            metricName: `Houston Market - ${type}`,
            metricValue: marketData.summary,
            numericValue: marketData.extractedNumbers[0] || 0,
            unit: marketData.unit || 'value',
            period: 'current',
            periodStart: new Date(),
            periodEnd: new Date(),
            category: 'market_research',
            subCategory: type,
            confidence: 90,
            insights: `Live data from Perplexity research`
          }
        })
        
        console.log(`✅ Stored ${type} data`)
        console.log(`   Preview: ${marketData.summary.substring(0, 150)}...`)
        
        // If we got neighborhood data, update rental markets
        if (marketData.neighborhoods && Object.keys(marketData.neighborhoods).length > 0) {
          for (const [neighborhood, value] of Object.entries(marketData.neighborhoods)) {
            console.log(`   - ${neighborhood}: $${value}`)
          }
        }
      }
    }
    
    // 3. Fetch missing development projects
    console.log('\n🏗️  Fetching Houston development projects...')
    
    const developmentQueries = [
      'Houston Texas major real estate development projects announced 2025',
      'Houston Texas mixed-use developments under construction 2025',
      'Houston Texas affordable housing projects planned 2025'
    ]
    
    for (const query of developmentQueries) {
      const newsData = await perplexityFetcher.fetchDevelopmentNews(query)
      
      if (newsData && newsData.projects) {
        console.log(`Found ${newsData.projects.length} projects`)
        
        for (const project of newsData.projects) {
          // Check if developer exists
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
          
          // Check if project exists
          const existingProject = await prisma.project.findFirst({
            where: { name: project.name }
          })
          
          if (!existingProject && developer) {
            await prisma.project.create({
              data: {
                name: project.name,
                projectType: project.type || 'development',
                area: project.location || 'Houston',
                description: project.description,
                totalValue: project.value || 0,
                phase: 'planning',
                developerId: developer.id,
                announcedDate: new Date()
              }
            })
            console.log(`   ✅ Added project: ${project.name}`)
          }
        }
      }
    }
    
    // 4. Fetch economic indicators
    console.log('\n📊 Fetching Houston economic indicators...')
    
    const economicQueries = [
      {
        query: 'Houston Texas unemployment rate current 2025',
        indicator: 'Unemployment Rate'
      },
      {
        query: 'Houston Texas job growth statistics by industry 2025',
        indicator: 'Job Growth'
      },
      {
        query: 'Houston Texas population growth rate 2025',
        indicator: 'Population Growth'
      },
      {
        query: 'Houston Texas GDP growth and economic outlook 2025',
        indicator: 'GDP Growth'
      }
    ]
    
    for (const { query, indicator } of economicQueries) {
      const economicData = await perplexityFetcher.fetchEconomicData(query)
      
      if (economicData) {
        await prisma.economicIndicator.upsert({
          where: {
            indicatorName_reportDate: {
              indicatorName: indicator,
              reportDate: new Date()
            }
          },
          update: {
            currentValue: economicData.value,
            previousValue: economicData.previousValue,
            yearOverYear: economicData.change
          },
          create: {
            indicatorName: indicator,
            category: 'economic',
            currentValue: economicData.value,
            previousValue: economicData.previousValue,
            yearOverYear: economicData.change,
            unit: economicData.unit || '%',
            frequency: 'monthly',
            reportDate: new Date()
          }
        })
        
        console.log(`✅ Updated ${indicator}: ${economicData.value}${economicData.unit}`)
      }
    }
    
    // 5. Check final data counts
    console.log('\n📈 Final Data Summary:')
    const counts = {
      'Market Intelligence': await prisma.marketIntelligence.count(),
      'Projects': await prisma.project.count(),
      'Developers': await prisma.developer.count(),
      'Economic Indicators': await prisma.economicIndicator.count(),
      'Rental Markets': await prisma.rentalMarket.count(),
      'Employers': await prisma.employer.count(),
      'STR Markets': await prisma.sTRMarket.count()
    }
    
    let total = 0
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count.toLocaleString()}`)
      total += count
    })
    
    console.log(`   ─────────────────────`)
    console.log(`   Total: ${total.toLocaleString()} data points`)
    
    console.log('\n✅ Data fetch completed!')
    
  } catch (error) {
    console.error('❌ Error fetching data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fetchMissingData().catch(console.error)