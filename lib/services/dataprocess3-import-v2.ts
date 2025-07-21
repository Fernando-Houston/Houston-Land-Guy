// Data Process 3 Import Service v2 - Using Existing Models
// Maps Data Process 3 data to existing database schema
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

export class DataProcess3ImportServiceV2 {
  private basePath = path.join(process.cwd(), 'Core Agent Architecture -Webiste', 'DataProcess 3')
  
  // Main import orchestrator
  async importAll(): Promise<Record<string, ImportResult>> {
    console.log('🚀 Starting Data Process 3 import using existing models...')
    
    const results: Record<string, ImportResult> = {}
    
    try {
      // Import each data type to appropriate existing models
      results.competitiveIntelligence = await this.importCompetitiveIntelligence()
      results.constructionActivity = await this.importConstructionActivity()
      results.financialPerformance = await this.importFinancialPerformance()
      results.costAnalysis = await this.importCostAnalysis()
      results.microMarketIntelligence = await this.importMicroMarketIntelligence()
      results.investmentSentiment = await this.importInvestmentSentiment()
      results.mlsRealTimeData = await this.importMLSRealTimeData()
      results.infrastructureProjects = await this.importInfrastructureProjects()
      results.qualityOfLifeMetrics = await this.importQualityOfLifeMetrics()
      
      const totalImported = Object.values(results).reduce((sum, r) => sum + r.imported, 0)
      const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0)
      
      console.log(`✅ Data Process 3 import completed: ${totalImported} imported, ${totalFailed} failed`)
      return results
    } catch (error) {
      console.error('❌ Import failed:', error)
      throw error
    }
  }

  // 1. Import Competitive Intelligence to MarketIntelligence
  async importCompetitiveIntelligence(): Promise<ImportResult> {
    const files = [
      'Competitive Intelligence_ Texas Real Estate Market/houston_development_platforms.csv',
      'Competitive Intelligence_ Texas Real Estate Market/texas_county_comparison_2024.csv',
      'Competitive Intelligence_ Texas Real Estate Market/texas_investment_metrics_2024.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) {
          console.log(`📂 File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        console.log(`📊 Processing ${records.length} competitive intelligence records from ${file}`)
        
        for (const record of records) {
          try {
            await prisma.marketIntelligence.create({
              data: {
                dataType: 'competitive',
                zipCode: this.safeString(record.ZIP_Code || record.zipCode),
                neighborhood: this.safeString(record.Area || record.County || record.Platform || record.City),
                marketShare: this.safeFloat(record.Market_Share || record.market_share),
                competitors: this.safeInt(record.Competitors || record.Platform_Count),
                capRate: this.safeFloat(record.Cap_Rate || record.cap_rate),
                roi: this.safeFloat(record.ROI || record.roi || record.Return_Rate),
                investmentScore: this.safeFloat(record.Investment_Score || record.Score),
                dataDate: new Date('2024-01-01'),
                metadata: {
                  source: file,
                  platformType: record.Platform_Type,
                  county: record.County,
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file} row: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 2. Import Construction Activity to ConstructionActivity
  async importConstructionActivity(): Promise<ImportResult> {
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    // Look for construction data in specific folders
    const constructionDirs = [
      'Harris County Texas Construction Activity Report_',
      'Houston Micro-Market Intelligence Report 2024'
    ]
    
    for (const dir of constructionDirs) {
      const dirPath = path.join(this.basePath, dir)
      if (!fs.existsSync(dirPath)) continue
      
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.csv'))
      
      for (const file of files) {
        if (file.includes('construction') || file.includes('permit') || file.includes('activity')) {
          try {
            const filePath = path.join(dirPath, file)
            const records = await this.parseCSV(filePath)
            console.log(`🏗️ Processing ${records.length} construction records from ${file}`)
            
            for (const record of records) {
              try {
                await prisma.constructionActivity.create({
                  data: {
                    permitNumber: this.safeString(record.Permit_Number) || `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    permitType: this.safeString(record.Type || record.Permit_Type || record.Project_Type) || 'residential',
                    subType: this.safeString(record.Sub_Type || record.Construction_Type),
                    address: this.safeString(record.Address || record.Location) || 'Harris County, TX',
                    zipCode: this.safeString(record.ZIP_Code || record.zipCode) || '77001',
                    neighborhood: this.safeString(record.Neighborhood || record.Area),
                    precinct: this.safeString(record.Precinct),
                    projectName: this.safeString(record.Project_Name || record.Development),
                    developer: this.safeString(record.Developer),
                    contractor: this.safeString(record.Contractor),
                    estimatedCost: this.safeFloat(record.Estimated_Cost || record.Cost || record.Value),
                    squareFootage: this.safeInt(record.Square_Footage || record.sqft || record.SF),
                    units: this.safeInt(record.Units || record.Dwelling_Units),
                    permitDate: this.safeDate(record.Permit_Date || record.Date || record.Issue_Date) || new Date('2024-01-01'),
                    status: this.safeString(record.Status) || 'active',
                    metadata: {
                      source: file,
                      permitFee: this.safeFloat(record.Permit_Fee),
                      originalData: record
                    }
                  }
                })
                imported++
              } catch (error) {
                failed++
                errors.push(`${file} construction: ${error.message}`)
              }
            }
          } catch (error) {
            console.error(`❌ Error processing construction ${file}:`, error)
            errors.push(`${file}: ${error.message}`)
          }
        }
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 3. Import Financial Performance to MarketIntelligence
  async importFinancialPerformance(): Promise<ImportResult> {
    const files = [
      'Harris County Real Estate Financial Performance An/harris_county_real_estate_performance_2024.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) {
          console.log(`📂 File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        console.log(`💰 Processing ${records.length} financial performance records`)
        
        for (const record of records) {
          try {
            await prisma.marketIntelligence.create({
              data: {
                dataType: 'financial-performance',
                zipCode: this.safeString(record.ZIP_Code || record.zipCode),
                neighborhood: this.safeString(record.Area || record.Submarket || record.Market),
                capRate: this.safeFloat(record.Cap_Rate || record.cap_rate || record.CapRate),
                roi: this.safeFloat(record.ROI || record.Annual_Return || record.Return),
                investmentScore: this.safeFloat(record.Performance_Score || record.Score),
                dataDate: new Date('2024-01-01'),
                metadata: {
                  source: file,
                  avgRent: this.safeFloat(record.Avg_Rent || record.Average_Rent),
                  occupancyRate: this.safeFloat(record.Occupancy || record.Occupancy_Rate),
                  priceAppreciation: this.safeFloat(record.Price_Appreciation),
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file} financial: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`❌ Error processing financial data:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 4. Import Cost Analysis to CostAnalysis
  async importCostAnalysis(): Promise<ImportResult> {
    const files = [
      'Harris County Texas and Houston Metro Area Cost An/construction_costs_2024.csv',
      'Harris County Texas and Houston Metro Area Cost An/labor_rates_2024.csv',
      'Harris County Texas and Houston Metro Area Cost An/land_prices_2024.csv',
      'Harris County Texas and Houston Metro Area Cost An/permit_fees_2024.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) {
          console.log(`📂 File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        let analysisType = 'construction'
        
        if (file.includes('labor')) analysisType = 'labor'
        else if (file.includes('land')) analysisType = 'land'
        else if (file.includes('permit')) analysisType = 'permits'
        
        console.log(`💲 Processing ${records.length} ${analysisType} cost records`)
        
        for (const record of records) {
          try {
            await prisma.costAnalysis.create({
              data: {
                analysisType,
                location: this.safeString(record.ZIP_Code || record.Area || record.Location) || 'Houston',
                costPerSqft: this.safeFloat(record.Cost_Per_Sqft || record.Price_Per_Sqft),
                materialsCost: this.safeFloat(record.Materials_Cost || record.Material_Cost),
                laborCost: this.safeFloat(record.Labor_Cost),
                hourlyRate: this.safeFloat(record.Hourly_Rate || record.Rate),
                skillLevel: this.safeString(record.Skill_Level || record.Trade_Level),
                tradeType: this.safeString(record.Trade_Type || record.Trade),
                pricePerAcre: this.safeFloat(record.Price_Per_Acre || record.Land_Price_Acre),
                pricePerSqft: this.safeFloat(record.Land_Price_Sqft || record.Price_SF),
                permitType: this.safeString(record.Permit_Type),
                baseFee: this.safeFloat(record.Base_Fee || record.Fee),
                additionalFees: record.Additional_Fees ? 
                  (typeof record.Additional_Fees === 'string' ? 
                    JSON.parse(record.Additional_Fees) : record.Additional_Fees) : null,
                effectiveDate: this.safeDate(record.Effective_Date) || new Date('2024-01-01'),
                metadata: {
                  source: file,
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file} cost: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`❌ Error processing cost data:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 5. Import Micro-Market Intelligence to MarketIntelligence
  async importMicroMarketIntelligence(): Promise<ImportResult> {
    const files = [
      'Houston Micro-Market Intelligence Report 2024/houston_micro_market_intelligence.csv',
      'Houston Micro-Market Intelligence Report 2024/houston_gentrification_indicators.csv',
      'Houston Micro-Market Intelligence Report 2024/houston_isd_ratings.csv',
      'Houston Micro-Market Intelligence Report 2024/school_district_property_impact.csv',
      'Houston Micro-Market Intelligence Report 2024/houston_property_values.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) {
          console.log(`📂 File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        console.log(`🏘️ Processing ${records.length} micro-market records from ${file}`)
        
        for (const record of records) {
          try {
            await prisma.marketIntelligence.create({
              data: {
                dataType: 'micro-market',
                zipCode: this.safeString(record.ZIP_Code || record.zipCode),
                neighborhood: this.safeString(record.Neighborhood || record.Area || record.Micro_Market),
                gentrificationScore: this.safeFloat(record.Gentrification_Score || record.Change_Index),
                schoolRating: this.safeFloat(record.Rating || record.School_Rating || record.ISD_Rating),
                investmentScore: this.safeFloat(record.Investment_Score),
                dataDate: new Date('2024-01-01'),
                metadata: {
                  source: file,
                  avgValue: this.safeFloat(record.Avg_Value || record.Property_Value),
                  schoolImprovement: record.School_Ratings_Improvement,
                  marketResponse: record.Market_Response_2024,
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file} micro-market: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`❌ Error processing micro-market data:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 6. Import Investment Sentiment to MarketIntelligence
  async importInvestmentSentiment(): Promise<ImportResult> {
    const files = [
      'Investment Sentiment and International Capital Flo/houston_institutional_investor_activity.csv',
      'Investment Sentiment and International Capital Flo/houston_international_investment.csv',
      'Investment Sentiment and International Capital Flo/houston_market_outlook_2024.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) {
          console.log(`📂 File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        console.log(`🌐 Processing ${records.length} investment sentiment records from ${file}`)
        
        for (const record of records) {
          try {
            await prisma.marketIntelligence.create({
              data: {
                dataType: 'investment-sentiment',
                zipCode: this.safeString(record.ZIP_Code || record.zipCode),
                neighborhood: this.safeString(record.Area || record.Submarket),
                foreignInvestmentPct: this.safeFloat(record.Foreign_Investment_Pct || record.International_Pct),
                institutionalPct: this.safeFloat(record.Institutional_Pct || record.Institutional_Share),
                dataDate: new Date('2024-01-01'),
                metadata: {
                  source: file,
                  sentiment: record.Sentiment || record.Outlook,
                  investmentVolume: this.safeFloat(record.Volume || record.Investment_Volume),
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file} sentiment: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`❌ Error processing investment sentiment:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 7. Import MLS Real-Time Data to MarketIntelligence
  async importMLSRealTimeData(): Promise<ImportResult> {
    const files = [
      'MLS-Real-Time/harris_county_real_estate_market_data_q4_2024.csv',
      'MLS-Real-Time/houston_zip_code_breakdown_q4_2024.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) {
          console.log(`📂 File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        console.log(`📈 Processing ${records.length} MLS real-time records from ${file}`)
        
        for (const record of records) {
          try {
            await prisma.marketIntelligence.create({
              data: {
                dataType: 'mls-realtime',
                zipCode: this.safeString(record.ZIP_Code || record.zipCode),
                neighborhood: this.safeString(record.Neighborhood || record.Area),
                dataDate: new Date('2024-10-01'), // Q4 2024
                metadata: {
                  source: file,
                  avgPrice: this.safeFloat(record.Avg_Price || record.Average_Price || record.Median_Home_Value),
                  medianPrice: this.safeFloat(record.Median_Price || record.Median_Home_Value),
                  pricePerSqft: this.safeFloat(record.Price_Per_Sq_Ft),
                  totalSales: this.safeInt(record.Total_Sales || record.Sales),
                  daysOnMarket: this.safeInt(record.DOM || record.Days_On_Market),
                  marketTier: record.Market_Tier,
                  transactionVolume: record.Q4_2024_Transaction_Volume,
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file} mls: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`❌ Error processing MLS data:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 8. Import Infrastructure Projects to ConstructionActivity
  async importInfrastructureProjects(): Promise<ImportResult> {
    const files = [
      'Major Infrastructure and Climate Resilience Invest/harris_county_major_projects.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) {
          console.log(`📂 File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        console.log(`🚧 Processing ${records.length} infrastructure project records`)
        
        for (const record of records) {
          try {
            await prisma.constructionActivity.create({
              data: {
                permitNumber: `INFRA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                permitType: 'infrastructure',
                subType: this.safeString(record.Project_Type) || 'major-infrastructure',
                address: this.safeString(record.Location) || 'Harris County, TX',
                zipCode: this.safeString(record.ZIP_Code) || '77001',
                neighborhood: this.safeString(record.Area),
                projectName: this.safeString(record.Project_Name || record.Project),
                developer: this.safeString(record.Agency) || 'Harris County',
                estimatedCost: this.safeFloat(record.Budget || record.Cost),
                permitDate: this.safeDate(record.Start_Date) || new Date('2024-01-01'),
                completionDate: this.safeDate(record.Completion_Date),
                status: this.safeString(record.Status) || 'active',
                metadata: {
                  source: file,
                  fundingSource: record.Funding_Source,
                  climateResilience: record.Climate_Component === 'Yes',
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file} infrastructure: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`❌ Error processing infrastructure data:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 9. Import Quality of Life Metrics to QualityOfLife
  async importQualityOfLifeMetrics(): Promise<ImportResult> {
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    // Look for CSV files in the Quality of Life folder
    const qolDir = path.join(this.basePath, 'Quality of Life Metrics_ Houston and Harris County')
    if (fs.existsSync(qolDir)) {
      const csvFiles = fs.readdirSync(qolDir).filter(f => f.endsWith('.csv'))
      
      for (const file of csvFiles) {
        try {
          const filePath = path.join(qolDir, file)
          const records = await this.parseCSV(filePath)
          console.log(`🌟 Processing ${records.length} quality of life records from ${file}`)
          
          for (const record of records) {
            try {
              await prisma.qualityOfLife.create({
                data: {
                  zipCode: this.safeString(record.ZIP_Code || record.zipCode) || '77001',
                  neighborhood: this.safeString(record.Neighborhood || record.Area),
                  crimeRate: this.safeFloat(record.Crime_Rate || record.Crime_Index) || 0,
                  crimeReduction: this.safeFloat(record.Crime_Reduction || record.YoY_Change),
                  safetyScore: this.safeFloat(record.Safety_Score) || 70,
                  walkScore: this.safeFloat(record.Walk_Score || record.Walkability) || 50,
                  transitScore: this.safeFloat(record.Transit_Score),
                  bikeScore: this.safeFloat(record.Bike_Score),
                  dataDate: new Date('2024-01-01'),
                  metadata: {
                    source: file,
                    originalData: record
                  }
                }
              })
              imported++
            } catch (error) {
              failed++
              errors.push(`${file} qol: ${error.message}`)
            }
          }
        } catch (error) {
          console.error(`❌ Error processing quality of life ${file}:`, error)
          errors.push(`${file}: ${error.message}`)
        }
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // Utility methods for safe data conversion
  private safeString(value: any): string | null {
    if (value === null || value === undefined || value === '') return null
    return String(value).toString()
  }

  private safeFloat(value: any): number | null {
    if (value === null || value === undefined || value === '') return null
    const num = parseFloat(String(value).replace(/[,$%]/g, ''))
    return isNaN(num) ? null : num
  }

  private safeInt(value: any): number | null {
    if (value === null || value === undefined || value === '') return null
    const num = parseInt(String(value).replace(/[,$]/g, ''))
    return isNaN(num) ? null : num
  }

  private safeDate(value: any): Date | null {
    if (value === null || value === undefined || value === '') return null
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
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
}