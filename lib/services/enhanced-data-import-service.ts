// Enhanced Data Import Service for Core Agent CSV Data
import { PrismaClient } from '@prisma/client'
import * as csv from 'csv-parse'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

export class EnhancedDataImportService {
  // Import developer activity from CSV
  async importDeveloperActivity(csvPath: string): Promise<any> {
    console.log('Importing developer activity from:', csvPath)
    const content = await fs.promises.readFile(csvPath, 'utf-8')
    const records = await this.parseCSV(content)
    
    let imported = 0
    let failed = 0
    
    for (const record of records) {
      try {
        // First, ensure developer exists
        const developer = await prisma.developer.upsert({
          where: { name: record.Developer },
          update: {},
          create: {
            name: record.Developer,
            companyType: record.Type || 'developer',
            activeProjects: parseInt(record['January 2025 Permits']) || 0,
            totalValue: 0,
            primaryFocus: record.Type || 'residential',
            targetMarket: ['general'],
            primaryAreas: []
          }
        })
        
        // Create activity record
        await prisma.developerActivity.create({
          data: {
            developerId: developer.id,
            month: new Date('2025-01-01'),
            permitCount: parseInt(record['January 2025 Permits']) || 0,
            averageHomeValue: parseFloat(record['Average Home Value ($)']) || 0,
            constructionValue: 0, // Calculate from permits * avg value
            activeProjects: record['Major Projects 2024'] ? 
              record['Major Projects 2024'].split(',').map((p: string) => p.trim()) : []
          }
        })
        imported++
      } catch (error) {
        console.error('Failed to import developer activity:', error)
        failed++
      }
    }
    
    return { imported, failed, total: records.length }
  }

  // Import construction permits
  async importConstructionPermits(csvPath: string): Promise<any> {
    console.log('Importing construction permits from:', csvPath)
    const content = await fs.promises.readFile(csvPath, 'utf-8')
    const records = await this.parseCSV(content)
    
    let imported = 0
    let failed = 0
    
    for (const record of records) {
      try {
        const month = this.parseMonthYear(record.Month)
        const constructionValue = this.parseCurrency(record['Construction Value'])
        const avgValue = this.parseCurrency(record['Average Value'])
        
        // Create market metrics for permit data
        await prisma.marketMetrics.create({
          data: {
            areaName: 'Houston Metro',
            areaType: 'city',
            period: 'monthly',
            startDate: month,
            endDate: new Date(month.getFullYear(), month.getMonth() + 1, 0),
            activeListings: 0,
            newListings: parseInt(record['Houston Metro Permits']) || 0,
            closedSales: 0,
            pendingSales: 0,
            inventory: 0,
            medianPrice: avgValue,
            averagePrice: avgValue,
            pricePerSqft: 0,
            medianPriceChange: 0,
            avgPriceChange: 0,
            avgDaysOnMarket: 0,
            avgDaysToClose: 0,
            listToSaleRatio: 0
          }
        })
        imported++
      } catch (error) {
        console.error('Failed to import permit data:', error)
        failed++
      }
    }
    
    return { imported, failed, total: records.length }
  }

  // Import ROI indicators
  async importROIIndicators(csvPath: string, area: string): Promise<any> {
    console.log('Importing ROI indicators from:', csvPath)
    const content = await fs.promises.readFile(csvPath, 'utf-8')
    const records = await this.parseCSV(content)
    
    let imported = 0
    let failed = 0
    
    for (const record of records) {
      try {
        await prisma.rOIIndicator.create({
          data: {
            area: area,
            indicatorName: record.ROI_Indicator,
            currentValue: parseFloat(record.Current_Value) || 0,
            metricType: record.Metric_Type || 'numeric',
            sourcePeriod: new Date(),
            category: this.categorizeROIIndicator(record.ROI_Indicator),
            confidence: 0.85
          }
        })
        imported++
      } catch (error) {
        console.error('Failed to import ROI indicator:', error)
        failed++
      }
    }
    
    return { imported, failed, total: records.length }
  }

  // Import construction activity by area
  async importAreaConstruction(csvPath: string): Promise<any> {
    console.log('Importing area construction activity from:', csvPath)
    const content = await fs.promises.readFile(csvPath, 'utf-8')
    const records = await this.parseCSV(content)
    
    let imported = 0
    let failed = 0
    
    for (const record of records) {
      try {
        await prisma.areaConstructionActivity.create({
          data: {
            neighborhood: record.Neighborhood,
            year: 2024,
            newConstructionUnits: parseInt(record.New_Construction_Units_2024) || 0,
            townhomeDevelopments: parseInt(record.Townhome_Developments) || 0,
            mixedUseProjects: parseInt(record.Mixed_Use_Projects) || 0,
            averageUnitPrice: parseFloat(record.Average_Unit_Price) || 0,
            activeBuilders: 0,
            priceRangeLow: 0,
            priceRangeHigh: 0,
            keyCommunities: []
          }
        })
        imported++
      } catch (error) {
        console.error('Failed to import area construction:', error)
        failed++
      }
    }
    
    return { imported, failed, total: records.length }
  }

  // Import competitive analysis
  async importCompetitiveAnalysis(csvPath: string): Promise<any> {
    console.log('Importing competitive analysis from:', csvPath)
    const content = await fs.promises.readFile(csvPath, 'utf-8')
    const records = await this.parseCSV(content)
    
    let imported = 0
    let failed = 0
    
    for (const record of records) {
      try {
        await prisma.competitiveAnalysis.create({
          data: {
            analysisCategory: record['Analysis Category'],
            keyFindings: record['Key Findings'],
            competitiveImplications: record['Competitive Implications'],
            strategicRecommendations: record['Strategic Recommendations'],
            relatedDevelopers: this.extractDevelopers(record['Key Findings']),
            relatedAreas: this.extractAreas(record['Key Findings']),
            analysisDate: new Date(),
            validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            confidence: 0.8
          }
        })
        imported++
      } catch (error) {
        console.error('Failed to import competitive analysis:', error)
        failed++
      }
    }
    
    return { imported, failed, total: records.length }
  }

  // Import market statistics
  async importMarketStatistics(csvPath: string): Promise<any> {
    console.log('Importing market statistics from:', csvPath)
    const content = await fs.promises.readFile(csvPath, 'utf-8')
    const records = await this.parseCSV(content)
    
    let imported = 0
    let failed = 0
    
    for (const record of records) {
      try {
        const numericValue = this.extractNumericValue(record.Value)
        
        await prisma.marketIntelligence.create({
          data: {
            metricName: record.Metric,
            metricValue: record.Value,
            numericValue: numericValue,
            unit: this.extractUnit(record.Value),
            nationalRanking: record['National Ranking'],
            period: 'yearly',
            periodStart: new Date('2024-01-01'),
            periodEnd: new Date('2024-12-31'),
            category: this.categorizeMetric(record.Metric),
            subCategory: null
          }
        })
        imported++
      } catch (error) {
        console.error('Failed to import market statistic:', error)
        failed++
      }
    }
    
    return { imported, failed, total: records.length }
  }

  // Helper methods
  private async parseCSV(content: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      csv.parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }, (err, records) => {
        if (err) reject(err)
        else resolve(records)
      })
    })
  }

  private parseMonthYear(monthYear: string): Date {
    const [month, year] = monthYear.split(' ')
    const monthNum = new Date(Date.parse(month + " 1, 2012")).getMonth()
    return new Date(parseInt(year), monthNum, 1)
  }

  private parseCurrency(value: string): number {
    if (!value) return 0
    // Remove $, commas, and convert M/B to numbers
    const cleaned = value.replace(/[$,]/g, '')
    if (cleaned.includes('M')) {
      return parseFloat(cleaned.replace('M', '')) * 1000000
    }
    if (cleaned.includes('B')) {
      return parseFloat(cleaned.replace('B', '')) * 1000000000
    }
    return parseFloat(cleaned) || 0
  }

  private categorizeROIIndicator(indicator: string): string {
    const lower = indicator.toLowerCase()
    if (lower.includes('price') || lower.includes('appreciation')) return 'market'
    if (lower.includes('population') || lower.includes('demographic')) return 'demographic'
    if (lower.includes('income') || lower.includes('employment')) return 'economic'
    if (lower.includes('construction') || lower.includes('permit')) return 'construction'
    return 'general'
  }

  private extractDevelopers(text: string): string[] {
    // Extract known developer names from text
    const developers = ['D.R. Horton', 'Lennar', 'Perry Homes', 'KB Home', 'Taylor Morrison']
    return developers.filter(dev => text.includes(dev))
  }

  private extractAreas(text: string): string[] {
    // Extract known area names from text
    const areas = ['Katy', 'Cypress', 'Spring', 'Woodlands', 'Sugar Land', 'Pearland', 'Downtown', 'Heights']
    return areas.filter(area => text.toLowerCase().includes(area.toLowerCase()))
  }

  private extractNumericValue(value: string): number | null {
    if (!value) return null
    const match = value.match(/[\d,]+\.?\d*/)
    if (match) {
      const num = parseFloat(match[0].replace(/,/g, ''))
      if (value.includes('M')) return num * 1000000
      if (value.includes('B')) return num * 1000000000
      if (value.includes('%')) return num
      return num
    }
    return null
  }

  private extractUnit(value: string): string | null {
    if (value.includes('%')) return '%'
    if (value.includes('$')) return '$'
    if (value.includes('M')) return '$M'
    if (value.includes('B')) return '$B'
    if (value.includes('units')) return 'units'
    if (value.includes('days')) return 'days'
    return null
  }

  private categorizeMetric(metric: string): string {
    const lower = metric.toLowerCase()
    if (lower.includes('gdp') || lower.includes('economy')) return 'economic'
    if (lower.includes('population') || lower.includes('growth')) return 'demographic'
    if (lower.includes('construction') || lower.includes('permit')) return 'construction'
    if (lower.includes('job') || lower.includes('employment')) return 'employment'
    if (lower.includes('investment') || lower.includes('development')) return 'investment'
    return 'general'
  }

  // Batch import all enhanced data
  async importAllEnhancedData(coreAgentPath: string): Promise<any> {
    const results = []
    
    // Define CSV files to import
    const imports = [
      { file: 'houston_developers_2024.csv', method: 'importDeveloperActivity' },
      { file: 'houston_construction_permits.csv', method: 'importConstructionPermits' },
      { file: 'katy_heights_roi_indicators.csv', method: 'importROIIndicators', area: 'Katy Heights' },
      { file: 'houston_construction_activity.csv', method: 'importAreaConstruction' },
      { file: 'houston_competitive_analysis_2024.csv', method: 'importCompetitiveAnalysis' },
      { file: 'houston_market_statistics_2024.csv', method: 'importMarketStatistics' }
    ]
    
    for (const imp of imports) {
      try {
        const filePath = path.join(coreAgentPath, imp.file)
        if (fs.existsSync(filePath)) {
          console.log(`\nImporting ${imp.file}...`)
          const result = await (this as any)[imp.method](filePath, imp.area)
          results.push({ file: imp.file, ...result })
        } else {
          console.log(`File not found: ${filePath}`)
        }
      } catch (error) {
        console.error(`Failed to import ${imp.file}:`, error)
        results.push({ file: imp.file, error: error.message })
      }
    }
    
    return results
  }
}

export const enhancedDataImport = new EnhancedDataImportService()