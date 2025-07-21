// Data Refresh Manager - Orchestrates all data updates
import { PrismaClient } from '@prisma/client'
import { PerplexityDataFetcher } from './perplexity-fetcher'
import { MarketTrendTracker } from './market-trend-tracker'
import { AlertService } from './alert-service'
import { dataProcess5Import } from '../dataprocess5-import-service'

const prisma = new PrismaClient()

export interface RefreshConfig {
  source: string
  frequency: 'daily' | 'weekly' | 'monthly'
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
}

export interface RefreshResult {
  source: string
  success: boolean
  recordsUpdated: number
  errors?: string[]
  duration: number
  timestamp: Date
}

export class DataRefreshManager {
  private perplexityFetcher: PerplexityDataFetcher
  private trendTracker: MarketTrendTracker
  private alertService: AlertService
  
  constructor() {
    this.perplexityFetcher = new PerplexityDataFetcher()
    this.trendTracker = new MarketTrendTracker()
    this.alertService = new AlertService()
  }
  
  // Main refresh orchestrator
  async refreshAllData(force: boolean = false): Promise<RefreshResult[]> {
    console.log('🔄 Starting comprehensive data refresh...')
    const startTime = Date.now()
    const results: RefreshResult[] = []
    
    // Get refresh configurations
    const configs = await this.getRefreshConfigs()
    
    for (const config of configs) {
      if (!config.enabled && !force) continue
      if (!force && !this.shouldRefresh(config)) continue
      
      const result = await this.refreshDataSource(config)
      results.push(result)
      
      // Update last run time
      await this.updateRefreshConfig(config.source, { lastRun: new Date() })
    }
    
    // After all refreshes, check for significant changes
    const changes = await this.trendTracker.detectSignificantChanges()
    if (changes.length > 0) {
      await this.alertService.sendAlerts(changes)
    }
    
    const duration = Date.now() - startTime
    console.log(`✅ Data refresh completed in ${duration}ms`)
    
    return results
  }
  
  // Refresh specific data source
  private async refreshDataSource(config: RefreshConfig): Promise<RefreshResult> {
    const startTime = Date.now()
    console.log(`📊 Refreshing ${config.source}...`)
    
    try {
      let recordsUpdated = 0
      
      switch (config.source) {
        case 'perplexity_market_trends':
          recordsUpdated = await this.refreshPerplexityMarketTrends()
          break
          
        case 'perplexity_development_news':
          recordsUpdated = await this.refreshPerplexityDevelopmentNews()
          break
          
        case 'perplexity_economic_data':
          recordsUpdated = await this.refreshPerplexityEconomicData()
          break
          
        case 'csv_imports':
          recordsUpdated = await this.refreshCSVImports()
          break
          
        case 'rental_market_data':
          recordsUpdated = await this.refreshRentalMarketData()
          break
          
        case 'construction_permits':
          recordsUpdated = await this.refreshConstructionPermits()
          break
          
        default:
          throw new Error(`Unknown data source: ${config.source}`)
      }
      
      const duration = Date.now() - startTime
      
      return {
        source: config.source,
        success: true,
        recordsUpdated,
        duration,
        timestamp: new Date()
      }
    } catch (error) {
      console.error(`❌ Error refreshing ${config.source}:`, error)
      
      return {
        source: config.source,
        success: false,
        recordsUpdated: 0,
        errors: [error.message],
        duration: Date.now() - startTime,
        timestamp: new Date()
      }
    }
  }
  
  // Refresh Perplexity market trends
  private async refreshPerplexityMarketTrends(): Promise<number> {
    const queries = [
      'Houston real estate market trends latest month',
      'Houston housing inventory and days on market current',
      'Houston median home prices by neighborhood latest',
      'Houston rental market rates current month',
      'Houston new construction permits recent'
    ]
    
    let recordsUpdated = 0
    
    for (const query of queries) {
      const data = await this.perplexityFetcher.fetchMarketData(query)
      if (data) {
        // Store in market trends table
        await prisma.marketIntelligence.create({
          data: {
            metricName: data.topic,
            metricValue: data.summary,
            numericValue: data.extractedNumbers[0],
            unit: data.unit,
            period: 'monthly',
            periodStart: new Date(),
            periodEnd: new Date(),
            category: 'perplexity_research',
            subCategory: 'market_trends'
          }
        })
        recordsUpdated++
      }
    }
    
    return recordsUpdated
  }
  
  // Refresh development news
  private async refreshPerplexityDevelopmentNews(): Promise<number> {
    const queries = [
      'Houston major development projects announced this month',
      'Houston commercial real estate developments latest',
      'Houston residential developments new communities',
      'Houston infrastructure projects updates'
    ]
    
    let recordsUpdated = 0
    
    for (const query of queries) {
      const data = await this.perplexityFetcher.fetchDevelopmentNews(query)
      if (data && data.projects) {
        for (const project of data.projects) {
          // Check if project exists
          const existing = await prisma.project.findFirst({
            where: { name: project.name }
          })
          
          if (!existing) {
            // Find or create developer
            let developer = await prisma.developer.findFirst({
              where: { name: project.developer }
            })
            
            if (!developer) {
              developer = await prisma.developer.create({
                data: {
                  name: project.developer,
                  companyType: 'developer',
                  activeProjects: 1,
                  totalValue: project.value || 0,
                  primaryFocus: project.type,
                  targetMarket: ['general']
                }
              })
            }
            
            await prisma.project.create({
              data: {
                name: project.name,
                projectType: project.type,
                area: project.location,
                description: project.description,
                totalValue: project.value || 0,
                phase: 'planning',
                developerId: developer.id,
                announcedDate: new Date()
              }
            })
            recordsUpdated++
          }
        }
      }
    }
    
    return recordsUpdated
  }
  
  // Refresh economic indicators
  private async refreshPerplexityEconomicData(): Promise<number> {
    const queries = [
      'Houston unemployment rate latest',
      'Houston job growth by sector current',
      'Houston GDP growth rate latest quarter',
      'Houston population growth latest data',
      'Houston median household income current'
    ]
    
    let recordsUpdated = 0
    
    for (const query of queries) {
      const data = await this.perplexityFetcher.fetchEconomicData(query)
      if (data) {
        await prisma.economicIndicator.upsert({
          where: {
            indicatorName_reportDate: {
              indicatorName: data.indicator,
              reportDate: new Date()
            }
          },
          update: {
            currentValue: data.value,
            previousValue: data.previousValue,
            yearOverYear: data.change
          },
          create: {
            indicatorName: data.indicator,
            category: 'economic',
            currentValue: data.value,
            previousValue: data.previousValue,
            yearOverYear: data.change,
            unit: data.unit,
            frequency: 'monthly',
            reportDate: new Date()
          }
        })
        recordsUpdated++
      }
    }
    
    return recordsUpdated
  }
  
  // Refresh CSV imports
  private async refreshCSVImports(): Promise<number> {
    // Re-run the Data Process 5 imports
    const results = await dataProcess5Import.importAll()
    
    let totalUpdated = 0
    Object.values(results).forEach(result => {
      if (typeof result === 'object' && result.imported) {
        totalUpdated += result.imported
      }
    })
    
    return totalUpdated
  }
  
  // Refresh rental market data
  private async refreshRentalMarketData(): Promise<number> {
    // This would connect to rental data APIs or scrape current data
    // For now, using Perplexity to get latest rental trends
    const data = await this.perplexityFetcher.fetchMarketData(
      'Houston apartment rental rates by neighborhood current month average'
    )
    
    if (data && data.neighborhoods) {
      let updated = 0
      for (const [neighborhood, avgRent] of Object.entries(data.neighborhoods)) {
        await prisma.rentalMarket.updateMany({
          where: { neighborhood },
          data: { 
            avgRent2BR: avgRent as number,
            reportDate: new Date()
          }
        })
        updated++
      }
      return updated
    }
    
    return 0
  }
  
  // Refresh construction permits
  private async refreshConstructionPermits(): Promise<number> {
    // Fetch latest permits from Houston OpenData or Perplexity
    const data = await this.perplexityFetcher.fetchMarketData(
      'Houston construction permits issued last month statistics'
    )
    
    if (data && data.permitCount) {
      await prisma.marketMetrics.create({
        data: {
          areaName: 'Houston Metro',
          areaType: 'city',
          period: 'monthly',
          startDate: new Date(),
          endDate: new Date(),
          newListings: data.permitCount,
          activeListings: 0,
          closedSales: 0,
          pendingSales: 0,
          inventory: 0,
          medianPrice: 0,
          averagePrice: 0,
          pricePerSqft: 0,
          medianPriceChange: 0,
          avgPriceChange: 0,
          avgDaysOnMarket: 0,
          avgDaysToClose: 0,
          listToSaleRatio: 0
        }
      })
      return 1
    }
    
    return 0
  }
  
  // Check if refresh should run
  private shouldRefresh(config: RefreshConfig): boolean {
    if (!config.lastRun) return true
    
    const now = new Date()
    const lastRun = new Date(config.lastRun)
    const hoursSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60)
    
    switch (config.frequency) {
      case 'daily':
        return hoursSinceLastRun >= 24
      case 'weekly':
        return hoursSinceLastRun >= 168
      case 'monthly':
        return hoursSinceLastRun >= 720
      default:
        return false
    }
  }
  
  // Get refresh configurations
  private async getRefreshConfigs(): Promise<RefreshConfig[]> {
    // In production, this would come from database
    return [
      {
        source: 'perplexity_market_trends',
        frequency: 'weekly',
        enabled: true
      },
      {
        source: 'perplexity_development_news',
        frequency: 'weekly',
        enabled: true
      },
      {
        source: 'perplexity_economic_data',
        frequency: 'monthly',
        enabled: true
      },
      {
        source: 'csv_imports',
        frequency: 'monthly',
        enabled: true
      },
      {
        source: 'rental_market_data',
        frequency: 'weekly',
        enabled: true
      },
      {
        source: 'construction_permits',
        frequency: 'weekly',
        enabled: true
      }
    ]
  }
  
  // Update refresh config
  private async updateRefreshConfig(source: string, updates: Partial<RefreshConfig>) {
    // In production, this would update database
    console.log(`Updated ${source} config:`, updates)
  }
}

export const dataRefreshManager = new DataRefreshManager()