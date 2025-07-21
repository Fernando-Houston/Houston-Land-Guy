// HAR MLS Monthly Reports Import Service
// Imports all HAR MLS data from Data Process 4
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
}

export class HarMlsImportService {
  private basePath = path.join(process.cwd(), 'Core Agent Architecture -Webiste', 'Data process 4')
  
  // Month mappings for all HAR reports found
  private monthMappings: MonthMapping[] = [
    { folder: 'Houston Association of Realtors (HAR) MLS Data Rep', month: 1, reportType: 'monthly' }, // January
    { folder: 'Houston Association of Realtors MLS Market Report', month: 2, reportType: 'monthly' }, // February
    { folder: 'Houston Association of Realtors (HAR) MLS Data Ana', month: 3, reportType: 'monthly' }, // March
    { folder: 'Houston Association of Realtors MLS Market Analysi', month: 4, reportType: 'monthly' }, // April
    { folder: 'Houston Association of Realtors MLS Market Analysi-June', month: 6, reportType: 'monthly' }, // June
    { folder: 'Houston Association of Realtors MLS Data Report_ J', month: 7, reportType: 'monthly' }, // July
    { folder: 'Houston Metro Area Real Estate Market Analysis_ Ju', month: 7, reportType: 'monthly' }, // July (alt)
    { folder: 'Houston Real Estate Market Analysis_ August-Decemb', month: 8, reportType: 'seasonal' }, // Aug-Dec
    { folder: 'Harris County Texas Summer 2025 Real Estate Market', month: 6, reportType: 'seasonal' } // Summer
  ]
  
  // Main import orchestrator
  async importAll(): Promise<Record<string, ImportResult>> {
    console.log('Starting HAR MLS comprehensive import...')
    
    const results: Record<string, ImportResult> = {}
    let totalImported = 0
    let totalFailed = 0
    
    try {
      // Import each month's data
      for (const mapping of this.monthMappings) {
        const monthName = this.getMonthName(mapping.month)
        console.log(`\nImporting ${monthName} 2025 data...`)
        
        const result = await this.importMonthlyReport(mapping)
        results[`${monthName}_2025`] = result
        
        totalImported += result.imported
        totalFailed += result.failed
      }
      
      console.log('\nHAR MLS import completed:')
      console.log(`Total reports imported: ${totalImported}`)
      console.log(`Total failed: ${totalFailed}`)
      
      return results
    } catch (error) {
      console.error('Import failed:', error)
      throw error
    }
  }

  // Import a single monthly report
  async importMonthlyReport(mapping: MonthMapping): Promise<ImportResult> {
    const folderPath = path.join(this.basePath, mapping.folder)
    
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder not found: ${mapping.folder}`)
      return { imported: 0, failed: 0, total: 0, errors: [`Folder not found: ${mapping.folder}`] }
    }
    
    // Find CSV files in the folder
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.csv'))
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    for (const file of files) {
      try {
        const filePath = path.join(folderPath, file)
        
        if (file.includes('summary') || file.includes('metrics')) {
          // Main summary report
          const result = await this.importSummaryReport(filePath, mapping.month, mapping.reportType)
          imported += result.imported
          failed += result.failed
          if (result.errors) errors.push(...result.errors)
        } else if (file.includes('neighborhood') || file.includes('zip_code')) {
          // Neighborhood-level data
          const result = await this.importNeighborhoodData(filePath, mapping.month)
          imported += result.imported
          failed += result.failed
          if (result.errors) errors.push(...result.errors)
        } else if (file.includes('price_segment')) {
          // Price segment data (will be merged into main report)
          const result = await this.updatePriceSegments(filePath, mapping.month)
          imported += result.imported
          failed += result.failed
          if (result.errors) errors.push(...result.errors)
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
        failed++
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // Import summary report data
  async importSummaryReport(filePath: string, month: number, reportType: 'monthly' | 'quarterly' | 'seasonal'): Promise<ImportResult> {
    const records = await this.parseCSV(filePath)
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    for (const record of records) {
      try {
        // Create or update the monthly report
        await prisma.harMlsReport.upsert({
          where: {
            month_year_reportType: {
              month,
              year: 2025,
              reportType
            }
          },
          update: {
            totalSales: parseInt(record.Total_Sales || record.Sales || record.Closed_Sales || '0'),
            totalVolume: parseFloat(record.Total_Volume || record.Sales_Volume || '0'),
            avgSalePrice: parseFloat(record.Avg_Sale_Price || record.Average_Price || record.Avg_Price || '0'),
            medianSalePrice: parseFloat(record.Median_Sale_Price || record.Median_Price || '0'),
            pricePerSqft: parseFloat(record.Price_Per_Sqft || record.Price_Per_SF || '0'),
            
            salesChangeYoY: parseFloat(record.Sales_Change_YoY || record.Sales_YoY || '0'),
            priceChangeYoY: parseFloat(record.Price_Change_YoY || record.Price_YoY || '0'),
            volumeChangeYoY: parseFloat(record.Volume_Change_YoY || record.Volume_YoY || '0'),
            
            activeListings: parseInt(record.Active_Listings || record.Active || record.For_Sale || '0'),
            newListings: parseInt(record.New_Listings || record.New || '0'),
            pendingSales: parseInt(record.Pending_Sales || record.Pending || record.Under_Contract || '0'),
            monthsInventory: parseFloat(record.Months_Inventory || record.Months_Supply || record.Inventory || '0'),
            avgDaysOnMarket: parseInt(record.Days_On_Market || record.DOM || record.Avg_DOM || '0'),
            
            // Price segments (if available in summary)
            under200k: parseInt(record.Under_200k || record['<$200k'] || '0'),
            from200to400k: parseInt(record.From_200k_400k || record['$200k-$400k'] || '0'),
            from400to600k: parseInt(record.From_400k_600k || record['$400k-$600k'] || '0'),
            from600to800k: parseInt(record.From_600k_800k || record['$600k-$800k'] || '0'),
            from800to1M: parseInt(record.From_800k_1M || record['$800k-$1M'] || '0'),
            over1M: parseInt(record.Over_1M || record['>$1M'] || '0'),
            
            // Property types
            singleFamily: parseInt(record.Single_Family || record.SF || '0'),
            townhouse: parseInt(record.Townhouse || record.TH || '0'),
            condo: parseInt(record.Condo || record.Condominium || '0'),
            
            metadata: {
              source: path.basename(filePath),
              importDate: new Date(),
              originalData: record
            }
          },
          create: {
            month,
            year: 2025,
            reportType,
            totalSales: parseInt(record.Total_Sales || record.Sales || record.Closed_Sales || '0'),
            totalVolume: parseFloat(record.Total_Volume || record.Sales_Volume || '0'),
            avgSalePrice: parseFloat(record.Avg_Sale_Price || record.Average_Price || record.Avg_Price || '0'),
            medianSalePrice: parseFloat(record.Median_Sale_Price || record.Median_Price || '0'),
            pricePerSqft: parseFloat(record.Price_Per_Sqft || record.Price_Per_SF || '0'),
            
            salesChangeYoY: parseFloat(record.Sales_Change_YoY || record.Sales_YoY || '0'),
            priceChangeYoY: parseFloat(record.Price_Change_YoY || record.Price_YoY || '0'),
            volumeChangeYoY: parseFloat(record.Volume_Change_YoY || record.Volume_YoY || '0'),
            
            activeListings: parseInt(record.Active_Listings || record.Active || record.For_Sale || '0'),
            newListings: parseInt(record.New_Listings || record.New || '0'),
            pendingSales: parseInt(record.Pending_Sales || record.Pending || record.Under_Contract || '0'),
            monthsInventory: parseFloat(record.Months_Inventory || record.Months_Supply || record.Inventory || '0'),
            avgDaysOnMarket: parseInt(record.Days_On_Market || record.DOM || record.Avg_DOM || '0'),
            
            // Price segments
            under200k: parseInt(record.Under_200k || record['<$200k'] || '0'),
            from200to400k: parseInt(record.From_200k_400k || record['$200k-$400k'] || '0'),
            from400to600k: parseInt(record.From_400k_600k || record['$400k-$600k'] || '0'),
            from600to800k: parseInt(record.From_600k_800k || record['$600k-$800k'] || '0'),
            from800to1M: parseInt(record.From_800k_1M || record['$800k-$1M'] || '0'),
            over1M: parseInt(record.Over_1M || record['>$1M'] || '0'),
            
            // Property types
            singleFamily: parseInt(record.Single_Family || record.SF || '0'),
            townhouse: parseInt(record.Townhouse || record.TH || '0'),
            condo: parseInt(record.Condo || record.Condominium || '0'),
            
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
        errors.push(`Summary report: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // Import neighborhood-level data
  async importNeighborhoodData(filePath: string, month: number): Promise<ImportResult> {
    const records = await this.parseCSV(filePath)
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    // First get the report ID
    const report = await prisma.harMlsReport.findUnique({
      where: {
        month_year_reportType: {
          month,
          year: 2025,
          reportType: 'monthly'
        }
      }
    })
    
    if (!report) {
      errors.push(`No monthly report found for month ${month}`)
      return { imported: 0, failed: records.length, total: records.length, errors }
    }
    
    for (const record of records) {
      try {
        await prisma.harNeighborhoodData.create({
          data: {
            reportId: report.id,
            neighborhood: record.Neighborhood || record.Area || record.Submarket || 'Unknown',
            zipCode: record.ZIP_Code || record.Zip || record.zipCode,
            
            totalSales: parseInt(record.Total_Sales || record.Sales || record.Closed_Sales || '0'),
            avgSalePrice: parseFloat(record.Avg_Sale_Price || record.Average_Price || record.Avg_Price || '0'),
            medianSalePrice: parseFloat(record.Median_Sale_Price || record.Median_Price || '0'),
            pricePerSqft: parseFloat(record.Price_Per_Sqft || record.Price_Per_SF || '0'),
            
            activeListings: parseInt(record.Active_Listings || record.Active || record.For_Sale || '0'),
            monthsInventory: parseFloat(record.Months_Inventory || record.Months_Supply || record.Inventory || '0'),
            avgDaysOnMarket: parseInt(record.Days_On_Market || record.DOM || record.Avg_DOM || '0'),
            
            listToSaleRatio: parseFloat(record.List_To_Sale_Ratio || record.SP_LP_Ratio || '0'),
            sellerConcessions: parseFloat(record.Seller_Concessions || record.Concessions || '0'),
            
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

  // Update price segments for existing report
  async updatePriceSegments(filePath: string, month: number): Promise<ImportResult> {
    const records = await this.parseCSV(filePath)
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    // Aggregate price segment data
    const segments = {
      under200k: 0,
      from200to400k: 0,
      from400to600k: 0,
      from600to800k: 0,
      from800to1M: 0,
      over1M: 0
    }
    
    for (const record of records) {
      try {
        const priceRange = record.Price_Range || record.Price_Segment || record.Segment
        const count = parseInt(record.Count || record.Sales || record.Total || '0')
        
        if (priceRange) {
          if (priceRange.includes('200') && priceRange.includes('<')) segments.under200k += count
          else if (priceRange.includes('200') && priceRange.includes('400')) segments.from200to400k += count
          else if (priceRange.includes('400') && priceRange.includes('600')) segments.from400to600k += count
          else if (priceRange.includes('600') && priceRange.includes('800')) segments.from600to800k += count
          else if (priceRange.includes('800') && (priceRange.includes('1M') || priceRange.includes('1,000'))) segments.from800to1M += count
          else if (priceRange.includes('1M') || priceRange.includes('1,000')) segments.over1M += count
        }
        
        imported++
      } catch (error) {
        failed++
        errors.push(`Price segment: ${error.message}`)
      }
    }
    
    // Update the report with price segments
    try {
      await prisma.harMlsReport.update({
        where: {
          month_year_reportType: {
            month,
            year: 2025,
            reportType: 'monthly'
          }
        },
        data: segments
      })
    } catch (error) {
      errors.push(`Failed to update price segments: ${error.message}`)
    }
    
    return { imported, failed, total: imported + failed, errors }
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
          cast: true,
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
}