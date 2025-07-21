// HAR MLS Data Process 4 Import Service v2 - Using Existing Models
// Maps HAR MLS monthly reports to existing HarMlsReport and HarNeighborhoodData models
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as csv from 'csv-parse'

const prisma = new PrismaClient()

interface ImportResult {
  imported: number
  failed: number
  total: number
  errors?: string[]
}

interface MonthMapping {
  folder: string
  month: number
  reportType: 'monthly' | 'quarterly' | 'seasonal'
  description: string
}

export class HarMlsImportServiceV2 {
  private basePath = path.join(process.cwd(), 'Core Agent Architecture -Webiste', 'Data process 4')
  
  // Comprehensive month mappings for all HAR reports found in Data Process 4
  private monthMappings: MonthMapping[] = [
    { 
      folder: 'Houston Association of Realtors (HAR) MLS Data Rep', 
      month: 1, 
      reportType: 'monthly', 
      description: 'January 2025 HAR MLS Report' 
    },
    { 
      folder: 'Houston Association of Realtors MLS Market Report', 
      month: 2, 
      reportType: 'monthly', 
      description: 'February 2025 HAR MLS Market Report' 
    },
    { 
      folder: 'Houston Association of Realtors (HAR) MLS Data Ana', 
      month: 3, 
      reportType: 'monthly', 
      description: 'March 2025 HAR MLS Data Analysis' 
    },
    { 
      folder: 'Houston Association of Realtors MLS Market Analysi', 
      month: 4, 
      reportType: 'monthly', 
      description: 'April 2025 HAR MLS Market Analysis' 
    },
    { 
      folder: 'Houston Association of Realtors MLS Market Analysi-June', 
      month: 6, 
      reportType: 'monthly', 
      description: 'June 2025 HAR MLS Market Analysis' 
    },
    { 
      folder: 'Houston Association of Realtors MLS Data Report_ J', 
      month: 7, 
      reportType: 'monthly', 
      description: 'July 2025 HAR MLS Data Report' 
    },
    { 
      folder: 'Houston Metro Area Real Estate Market Analysis_ Ju', 
      month: 7, 
      reportType: 'monthly', 
      description: 'July 2025 Houston Metro Market Analysis' 
    },
    { 
      folder: 'Houston Real Estate Market Analysis_ August-Decemb', 
      month: 8, 
      reportType: 'seasonal', 
      description: 'August-December 2025 Seasonal Analysis' 
    },
    { 
      folder: 'Harris County Texas Summer 2025 Real Estate Market', 
      month: 6, 
      reportType: 'seasonal', 
      description: 'Summer 2025 Real Estate Market Analysis' 
    }
  ]
  
  // Main import orchestrator
  async importAll(): Promise<Record<string, ImportResult>> {
    console.log('🏘️ Starting HAR MLS Data Process 4 import using existing models...')
    
    const results: Record<string, ImportResult> = {}
    let totalImported = 0
    let totalFailed = 0
    
    try {
      // Import each month's data
      for (const mapping of this.monthMappings) {
        const monthKey = `${this.getMonthName(mapping.month)}_${mapping.reportType}`
        console.log(`\n📊 Importing ${mapping.description}...`)
        
        const result = await this.importMonthlyReport(mapping)
        results[monthKey] = result
        
        totalImported += result.imported
        totalFailed += result.failed
      }
      
      console.log(`\n✅ HAR MLS import completed: ${totalImported} imported, ${totalFailed} failed`)
      return results
    } catch (error) {
      console.error('❌ HAR MLS import failed:', error)
      throw error
    }
  }

  // Import a single monthly report
  async importMonthlyReport(mapping: MonthMapping): Promise<ImportResult> {
    const folderPath = path.join(this.basePath, mapping.folder)
    
    if (!fs.existsSync(folderPath)) {
      console.log(`📂 Folder not found: ${mapping.folder}`)
      return { imported: 0, failed: 0, total: 0, errors: [`Folder not found: ${mapping.folder}`] }
    }
    
    // Find CSV files in the folder
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.csv'))
    console.log(`📁 Found ${files.length} CSV files in ${mapping.folder}`)
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    // First, create or update the main HarMlsReport
    let reportId: string | null = null
    
    for (const file of files) {
      try {
        const filePath = path.join(folderPath, file)
        
        if (file.includes('summary') || file.includes('metrics') || 
            file.includes('houston_mls') || file.includes('market_summary')) {
          // Main summary report
          reportId = await this.importSummaryReport(filePath, mapping)
          if (reportId) imported++
        }
      } catch (error) {
        console.error(`❌ Error processing summary ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
        failed++
      }
    }
    
    // If no report was created, create a default one
    if (!reportId) {
      reportId = await this.createDefaultReport(mapping)
      if (reportId) imported++
    }
    
    // Now process neighborhood-level data
    for (const file of files) {
      try {
        const filePath = path.join(folderPath, file)
        
        if ((file.includes('neighborhood') || file.includes('zip_code') || 
             file.includes('regional') || file.includes('areas')) && reportId) {
          // Neighborhood-level data
          const result = await this.importNeighborhoodData(filePath, reportId)
          imported += result.imported
          failed += result.failed
          if (result.errors) errors.push(...result.errors)
        }
      } catch (error) {
        console.error(`❌ Error processing neighborhood ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
        failed++
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // Import main summary report data to HarMlsReport
  async importSummaryReport(filePath: string, mapping: MonthMapping): Promise<string | null> {
    try {
      const records = await this.parseCSV(filePath)
      console.log(`📈 Processing summary report with ${records.length} records`)
      
      // Use the first record as the main report data, or aggregate if multiple
      const summaryData = records.length > 0 ? records[0] : {}
      
      // Create or update the monthly report
      const report = await prisma.harMlsReport.upsert({
        where: {
          month_year_reportType: {
            month: mapping.month,
            year: 2025,
            reportType: mapping.reportType
          }
        },
        update: {
          totalSales: this.safeInt(summaryData.Total_Sales || summaryData.Sales || summaryData.Closed_Sales) || 0,
          totalVolume: this.safeFloat(summaryData.Total_Volume || summaryData.Sales_Volume) || 0,
          avgSalePrice: this.safeFloat(summaryData.Avg_Sale_Price || summaryData.Average_Price || summaryData.Avg_Price) || 0,
          medianSalePrice: this.safeFloat(summaryData.Median_Sale_Price || summaryData.Median_Price) || 0,
          pricePerSqft: this.safeFloat(summaryData.Price_Per_Sqft || summaryData.Price_Per_SF) || 0,
          
          salesChangeYoY: this.safeFloat(summaryData.Sales_Change_YoY || summaryData.Sales_YoY) || 0,
          priceChangeYoY: this.safeFloat(summaryData.Price_Change_YoY || summaryData.Price_YoY) || 0,
          volumeChangeYoY: this.safeFloat(summaryData.Volume_Change_YoY || summaryData.Volume_YoY) || 0,
          
          activeListings: this.safeInt(summaryData.Active_Listings || summaryData.Active || summaryData.For_Sale) || 0,
          newListings: this.safeInt(summaryData.New_Listings || summaryData.New) || 0,
          pendingSales: this.safeInt(summaryData.Pending_Sales || summaryData.Pending || summaryData.Under_Contract) || 0,
          monthsInventory: this.safeFloat(summaryData.Months_Inventory || summaryData.Months_Supply || summaryData.Inventory) || 0,
          avgDaysOnMarket: this.safeInt(summaryData.Days_On_Market || summaryData.DOM || summaryData.Avg_DOM) || 0,
          
          // Price segments
          under200k: this.safeInt(summaryData.Under_200k || summaryData['<$200k']) || 0,
          from200to400k: this.safeInt(summaryData.From_200k_400k || summaryData['$200k-$400k']) || 0,
          from400to600k: this.safeInt(summaryData.From_400k_600k || summaryData['$400k-$600k']) || 0,
          from600to800k: this.safeInt(summaryData.From_600k_800k || summaryData['$600k-$800k']) || 0,
          from800to1M: this.safeInt(summaryData.From_800k_1M || summaryData['$800k-$1M']) || 0,
          over1M: this.safeInt(summaryData.Over_1M || summaryData['>$1M']) || 0,
          
          // Property types
          singleFamily: this.safeInt(summaryData.Single_Family || summaryData.SF) || 0,
          townhouse: this.safeInt(summaryData.Townhouse || summaryData.TH) || 0,
          condo: this.safeInt(summaryData.Condo || summaryData.Condominium) || 0,
          
          metadata: {
            source: path.basename(filePath),
            importDate: new Date(),
            originalData: summaryData,
            description: mapping.description
          }
        },
        create: {
          month: mapping.month,
          year: 2025,
          reportType: mapping.reportType,
          
          totalSales: this.safeInt(summaryData.Total_Sales || summaryData.Sales || summaryData.Closed_Sales) || 0,
          totalVolume: this.safeFloat(summaryData.Total_Volume || summaryData.Sales_Volume) || 0,
          avgSalePrice: this.safeFloat(summaryData.Avg_Sale_Price || summaryData.Average_Price || summaryData.Avg_Price) || 0,
          medianSalePrice: this.safeFloat(summaryData.Median_Sale_Price || summaryData.Median_Price) || 0,
          pricePerSqft: this.safeFloat(summaryData.Price_Per_Sqft || summaryData.Price_Per_SF) || 0,
          
          salesChangeYoY: this.safeFloat(summaryData.Sales_Change_YoY || summaryData.Sales_YoY) || 0,
          priceChangeYoY: this.safeFloat(summaryData.Price_Change_YoY || summaryData.Price_YoY) || 0,
          volumeChangeYoY: this.safeFloat(summaryData.Volume_Change_YoY || summaryData.Volume_YoY) || 0,
          
          activeListings: this.safeInt(summaryData.Active_Listings || summaryData.Active || summaryData.For_Sale) || 0,
          newListings: this.safeInt(summaryData.New_Listings || summaryData.New) || 0,
          pendingSales: this.safeInt(summaryData.Pending_Sales || summaryData.Pending || summaryData.Under_Contract) || 0,
          monthsInventory: this.safeFloat(summaryData.Months_Inventory || summaryData.Months_Supply || summaryData.Inventory) || 0,
          avgDaysOnMarket: this.safeInt(summaryData.Days_On_Market || summaryData.DOM || summaryData.Avg_DOM) || 0,
          
          // Price segments
          under200k: this.safeInt(summaryData.Under_200k || summaryData['<$200k']) || 0,
          from200to400k: this.safeInt(summaryData.From_200k_400k || summaryData['$200k-$400k']) || 0,
          from400to600k: this.safeInt(summaryData.From_400k_600k || summaryData['$400k-$600k']) || 0,
          from600to800k: this.safeInt(summaryData.From_600k_800k || summaryData['$600k-$800k']) || 0,
          from800to1M: this.safeInt(summaryData.From_800k_1M || summaryData['$800k-$1M']) || 0,
          over1M: this.safeInt(summaryData.Over_1M || summaryData['>$1M']) || 0,
          
          // Property types
          singleFamily: this.safeInt(summaryData.Single_Family || summaryData.SF) || 0,
          townhouse: this.safeInt(summaryData.Townhouse || summaryData.TH) || 0,
          condo: this.safeInt(summaryData.Condo || summaryData.Condominium) || 0,
          
          metadata: {
            source: path.basename(filePath),
            importDate: new Date(),
            originalData: summaryData,
            description: mapping.description
          }
        }
      })
      
      return report.id
    } catch (error) {
      console.error(`❌ Error importing summary report:`, error)
      throw error
    }
  }

  // Create a default report if no summary data is found
  async createDefaultReport(mapping: MonthMapping): Promise<string | null> {
    try {
      console.log(`📋 Creating default HAR MLS report for ${mapping.description}`)
      
      const report = await prisma.harMlsReport.upsert({
        where: {
          month_year_reportType: {
            month: mapping.month,
            year: 2025,
            reportType: mapping.reportType
          }
        },
        update: {
          metadata: {
            source: 'default_creation',
            importDate: new Date(),
            description: mapping.description,
            note: 'Created as default when no summary data found'
          }
        },
        create: {
          month: mapping.month,
          year: 2025,
          reportType: mapping.reportType,
          
          // Default values - will be updated when neighborhood data is processed
          totalSales: 0,
          totalVolume: 0,
          avgSalePrice: 0,
          medianSalePrice: 0,
          pricePerSqft: 0,
          
          salesChangeYoY: 0,
          priceChangeYoY: 0,
          volumeChangeYoY: 0,
          
          activeListings: 0,
          newListings: 0,
          pendingSales: 0,
          monthsInventory: 0,
          avgDaysOnMarket: 0,
          
          under200k: 0,
          from200to400k: 0,
          from400to600k: 0,
          from600to800k: 0,
          from800to1M: 0,
          over1M: 0,
          
          singleFamily: 0,
          townhouse: 0,
          condo: 0,
          
          metadata: {
            source: 'default_creation',
            importDate: new Date(),
            description: mapping.description,
            note: 'Created as default when no summary data found'
          }
        }
      })
      
      return report.id
    } catch (error) {
      console.error(`❌ Error creating default report:`, error)
      return null
    }
  }

  // Import neighborhood-level data to HarNeighborhoodData
  async importNeighborhoodData(filePath: string, reportId: string): Promise<ImportResult> {
    const records = await this.parseCSV(filePath)
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    console.log(`🏘️ Processing ${records.length} neighborhood records from ${path.basename(filePath)}`)
    
    for (const record of records) {
      try {
        await prisma.harNeighborhoodData.create({
          data: {
            reportId,
            neighborhood: this.safeString(record.Neighborhood || record.Area || record.Submarket || record.Market_Area) || 'Unknown',
            zipCode: this.safeString(record.ZIP_Code || record.Zip || record.zipCode),
            
            totalSales: this.safeInt(record.Total_Sales || record.Sales || record.Closed_Sales) || 0,
            avgSalePrice: this.safeFloat(record.Avg_Sale_Price || record.Average_Price || record.Avg_Price) || 0,
            medianSalePrice: this.safeFloat(record.Median_Sale_Price || record.Median_Price) || 0,
            pricePerSqft: this.safeFloat(record.Price_Per_Sqft || record.Price_Per_SF) || 0,
            
            activeListings: this.safeInt(record.Active_Listings || record.Active || record.For_Sale) || 0,
            monthsInventory: this.safeFloat(record.Months_Inventory || record.Months_Supply || record.Inventory) || 0,
            avgDaysOnMarket: this.safeInt(record.Days_On_Market || record.DOM || record.Avg_DOM) || 0,
            
            listToSaleRatio: this.safeFloat(record.List_To_Sale_Ratio || record.SP_LP_Ratio),
            sellerConcessions: this.safeFloat(record.Seller_Concessions || record.Concessions),
            
            metadata: {
              source: path.basename(filePath),
              importDate: new Date(),
              originalData: record
            }
          }
        })
        
        imported++
      } catch (error) {
        failed++
        errors.push(`Neighborhood ${record.Neighborhood || 'Unknown'}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // Utility methods for safe data conversion
  private safeString(value: any): string | null {
    if (value === null || value === undefined || value === '') return null
    return String(value).toString()
  }

  private safeFloat(value: any): number {
    if (value === null || value === undefined || value === '') return 0
    const num = parseFloat(String(value).replace(/[,$%]/g, ''))
    return isNaN(num) ? 0 : num
  }

  private safeInt(value: any): number {
    if (value === null || value === undefined || value === '') return 0
    const num = parseInt(String(value).replace(/[,$]/g, ''))
    return isNaN(num) ? 0 : num
  }

  // CSV parsing utility
  private async parseCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const records: any[] = []
      
      fs.createReadStream(filePath)
        .pipe(csv.parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
          cast: false, // Keep as strings for safe conversion
          cast_date: false
        }))
        .on('data', (record) => {
          records.push(record)
        })
        .on('error', reject)
        .on('end', () => {
          resolve(records)
        })
    })
  }

  // Helper to get month name
  private getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[month - 1] || 'Unknown'
  }

  // Get import status
  async getImportStatus(): Promise<any> {
    const reports = await prisma.harMlsReport.findMany({
      where: { year: 2025 },
      orderBy: { month: 'asc' },
      select: {
        month: true,
        reportType: true,
        totalSales: true,
        avgSalePrice: true,
        createdAt: true,
        _count: {
          select: { neighborhoods: true }
        }
      }
    })
    
    return reports.map(report => ({
      month: this.getMonthName(report.month),
      type: report.reportType,
      totalSales: report.totalSales,
      avgPrice: report.avgSalePrice,
      neighborhoodCount: report._count.neighborhoods,
      importedAt: report.createdAt
    }))
  }

  // Import specific month
  async importMonth(month: number): Promise<ImportResult> {
    const mapping = this.monthMappings.find(m => m.month === month)
    if (!mapping) {
      return {
        imported: 0,
        failed: 0,
        total: 0,
        errors: [`No mapping found for month ${month}`]
      }
    }
    
    return this.importMonthlyReport(mapping)
  }
}