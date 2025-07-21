// Data Process 3 Import Service
// Imports all CSV data from the Data Process 3 folder
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

export class DataProcess3ImportService {
  private basePath = path.join(process.cwd(), 'Core Agent Architecture -Webiste', 'DataProcess 3')
  
  // Main import orchestrator
  async importAll(): Promise<Record<string, ImportResult>> {
    console.log('Starting Data Process 3 comprehensive import...')
    
    const results: Record<string, ImportResult> = {}
    
    try {
      // Import in order of dependencies
      results.competitiveIntelligence = await this.importCompetitiveIntelligence()
      results.constructionActivity = await this.importConstructionActivity()
      results.financialPerformance = await this.importFinancialPerformance()
      results.costAnalysis = await this.importCostAnalysis()
      results.microMarket = await this.importMicroMarket()
      results.investmentSentiment = await this.importInvestmentSentiment()
      results.mlsRealTime = await this.importMLSRealTime()
      results.infrastructure = await this.importInfrastructure()
      results.qualityOfLife = await this.importQualityOfLife()
      
      console.log('Data Process 3 import completed:', results)
      return results
    } catch (error) {
      console.error('Import failed:', error)
      throw error
    }
  }

  // 1. Import Competitive Intelligence Data
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
          console.log(`File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        
        for (const record of records) {
          try {
            await prisma.marketIntelligence.create({
              data: {
                dataType: 'competitive',
                zipCode: String(record.ZIP_Code || record.zipCode || ''),
                neighborhood: record.Area || record.County || record.Platform,
                marketShare: parseFloat(record.Market_Share || record.market_share || '0'),
                competitors: parseInt(record.Competitors || '0'),
                capRate: parseFloat(record.Cap_Rate || record.cap_rate || '0'),
                roi: parseFloat(record.ROI || record.roi || '0'),
                investmentScore: parseFloat(record.Investment_Score || '0'),
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
            errors.push(`${file}: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 2. Import Construction Activity
  async importConstructionActivity(): Promise<ImportResult> {
    const files = [
      'Harris County Texas Construction Activity Report_/construction_permits_chart.png', // Skip PNG
      'MLS-Real-Time/harris_county_permits_dec2024.png' // Skip PNG
    ]
    
    // For now, we'll need to find CSV files with construction data
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    // Look for CSV files in construction folders
    const constructionDirs = [
      'Harris County Texas Construction Activity Report_',
      'Houston Micro-Market Intelligence Report 2024'
    ]
    
    for (const dir of constructionDirs) {
      const dirPath = path.join(this.basePath, dir)
      if (!fs.existsSync(dirPath)) continue
      
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.csv'))
      
      for (const file of files) {
        if (file.includes('construction')) {
          try {
            const records = await this.parseCSV(path.join(dirPath, file))
            
            for (const record of records) {
              try {
                await prisma.constructionActivity.create({
                  data: {
                    permitNumber: record.Permit_Number || `PERM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    permitType: record.Type || record.Permit_Type || 'residential',
                    subType: record.Sub_Type || record.Project_Type,
                    address: record.Address || record.Location || 'Unknown',
                    zipCode: String(record.ZIP_Code || record.zipCode || '77001'),
                    neighborhood: record.Neighborhood || record.Area,
                    precinct: record.Precinct,
                    projectName: record.Project_Name || record.Development,
                    developer: record.Developer,
                    contractor: record.Contractor,
                    estimatedCost: parseFloat(record.Estimated_Cost || record.Cost || '0'),
                    squareFootage: parseInt(record.Square_Footage || record.sqft || '0'),
                    units: parseInt(record.Units || '0'),
                    permitDate: new Date(record.Permit_Date || record.Date || '2024-01-01'),
                    status: record.Status || 'active',
                    metadata: {
                      source: file,
                      originalData: record
                    }
                  }
                })
                imported++
              } catch (error) {
                failed++
                errors.push(`${file}: ${error.message}`)
              }
            }
          } catch (error) {
            console.error(`Error processing ${file}:`, error)
            errors.push(`${file}: ${error.message}`)
          }
        }
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 3. Import Financial Performance Data
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
          console.log(`File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        
        for (const record of records) {
          try {
            await prisma.marketIntelligence.create({
              data: {
                dataType: 'financial-performance',
                zipCode: String(record.ZIP_Code || record.zipCode || ''),
                neighborhood: record.Area || record.Submarket,
                capRate: parseFloat(record.Cap_Rate || record.cap_rate || '0'),
                roi: parseFloat(record.ROI || record.Annual_Return || '0'),
                investmentScore: parseFloat(record.Performance_Score || '0'),
                dataDate: new Date('2024-01-01'),
                metadata: {
                  source: file,
                  avgRent: parseFloat(record.Avg_Rent || '0'),
                  occupancy: parseFloat(record.Occupancy || '0'),
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file}: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 4. Import Cost Analysis Data
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
          console.log(`File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        let analysisType = 'construction'
        
        if (file.includes('labor')) analysisType = 'labor'
        else if (file.includes('land')) analysisType = 'land'
        else if (file.includes('permit')) analysisType = 'permits'
        
        for (const record of records) {
          try {
            await prisma.costAnalysis.create({
              data: {
                analysisType,
                location: record.ZIP_Code || record.Area || record.Location || 'Houston',
                costPerSqft: parseFloat(record.Cost_Per_Sqft || record.Price_Per_Sqft || '0'),
                materialsCost: parseFloat(record.Materials_Cost || '0'),
                laborCost: parseFloat(record.Labor_Cost || '0'),
                hourlyRate: parseFloat(record.Hourly_Rate || record.Rate || '0'),
                skillLevel: record.Skill_Level || record.Trade_Level,
                tradeType: record.Trade_Type || record.Trade,
                pricePerAcre: parseFloat(record.Price_Per_Acre || '0'),
                pricePerSqft: parseFloat(record.Land_Price_Sqft || '0'),
                permitType: record.Permit_Type,
                baseFee: parseFloat(record.Base_Fee || record.Fee || '0'),
                additionalFees: record.Additional_Fees ? JSON.parse(record.Additional_Fees) : null,
                effectiveDate: new Date(record.Effective_Date || '2024-01-01'),
                metadata: {
                  source: file,
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file}: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 5. Import Micro-Market Intelligence
  async importMicroMarket(): Promise<ImportResult> {
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
          console.log(`File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        
        for (const record of records) {
          try {
            if (file.includes('gentrification') || file.includes('isd_ratings')) {
              await prisma.marketIntelligence.create({
                data: {
                  dataType: 'micro-market',
                  zipCode: String(record.ZIP_Code || record.zipCode || ''),
                  neighborhood: record.Neighborhood || record.Area,
                  gentrificationScore: parseFloat(record.Gentrification_Score || record.Change_Index || '0'),
                  schoolRating: parseFloat(record.Rating || record.School_Rating || record.ISD_Rating || '0'),
                  dataDate: new Date('2024-01-01'),
                  metadata: {
                    source: file,
                    originalData: record
                  }
                }
              })
            } else {
              await prisma.marketIntelligence.create({
                data: {
                  dataType: 'micro-market',
                  zipCode: String(record.ZIP_Code || record.zipCode || ''),
                  neighborhood: record.Neighborhood || record.Micro_Market,
                  investmentScore: parseFloat(record.Investment_Score || '0'),
                  dataDate: new Date('2024-01-01'),
                  metadata: {
                    source: file,
                    avgValue: parseFloat(record.Avg_Value || record.Property_Value || '0'),
                    originalData: record
                  }
                }
              })
            }
            imported++
          } catch (error) {
            failed++
            errors.push(`${file}: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 6. Import Investment Sentiment
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
          console.log(`File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        
        for (const record of records) {
          try {
            await prisma.marketIntelligence.create({
              data: {
                dataType: 'investment-sentiment',
                zipCode: String(record.ZIP_Code || record.zipCode || ''),
                neighborhood: record.Area || record.Submarket,
                foreignInvestmentPct: parseFloat(record.Foreign_Investment_Pct || record.International_Pct || '0'),
                institutionalPct: parseFloat(record.Institutional_Pct || record.Institutional_Share || '0'),
                dataDate: new Date('2024-01-01'),
                metadata: {
                  source: file,
                  sentiment: record.Sentiment || record.Outlook,
                  investmentVolume: parseFloat(record.Volume || record.Investment_Volume || '0'),
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file}: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 7. Import MLS Real-Time Data
  async importMLSRealTime(): Promise<ImportResult> {
    const files = [
      'MLS-Real-Time/harris_county_real_estate_market_data_q4_2024.csv',
      'MLS-Real-Time/houston_zip_code_breakdown_q4_2024.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    // This data will be handled by the HAR MLS import service
    // Just import basic market data here
    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) {
          console.log(`File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        
        for (const record of records) {
          try {
            await prisma.marketIntelligence.create({
              data: {
                dataType: 'mls-realtime',
                zipCode: String(record.ZIP_Code || record.zipCode || ''),
                neighborhood: record.Neighborhood || record.Area,
                dataDate: new Date('2024-10-01'), // Q4 2024
                metadata: {
                  source: file,
                  avgPrice: parseFloat(record.Avg_Price || record.Average_Price || '0'),
                  medianPrice: parseFloat(record.Median_Price || '0'),
                  totalSales: parseInt(record.Total_Sales || record.Sales || '0'),
                  daysOnMarket: parseInt(record.DOM || record.Days_On_Market || '0'),
                  originalData: record
                }
              }
            })
            imported++
          } catch (error) {
            failed++
            errors.push(`${file}: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 8. Import Infrastructure Data
  async importInfrastructure(): Promise<ImportResult> {
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
          console.log(`File not found: ${file}`)
          continue
        }
        
        const records = await this.parseCSV(filePath)
        
        for (const record of records) {
          try {
            // Store infrastructure projects as construction activity
            await prisma.constructionActivity.create({
              data: {
                permitNumber: `INFRA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                permitType: 'infrastructure',
                subType: record.Project_Type || 'major-infrastructure',
                address: record.Location || 'Harris County',
                zipCode: String(record.ZIP_Code || '77001'),
                neighborhood: record.Area,
                projectName: record.Project_Name || record.Project,
                developer: record.Agency || 'Harris County',
                estimatedCost: parseFloat(record.Budget || record.Cost || '0'),
                permitDate: new Date(record.Start_Date || '2024-01-01'),
                completionDate: record.Completion_Date ? new Date(record.Completion_Date) : null,
                status: record.Status || 'active',
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
            errors.push(`${file}: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`${file}: ${error.message}`)
      }
    }
    
    return { imported, failed, total: imported + failed, errors }
  }

  // 9. Import Quality of Life Metrics
  async importQualityOfLife(): Promise<ImportResult> {
    const files = [
      'Quality of Life Metrics_ Houston and Harris County/houston_walkability_scores.csv',
      'Quality of Life Metrics_ Houston and Harris County/houston_crime_reduction_chart.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []
    
    // First, look for actual CSV files
    const qolDir = path.join(this.basePath, 'Quality of Life Metrics_ Houston and Harris County')
    if (fs.existsSync(qolDir)) {
      const csvFiles = fs.readdirSync(qolDir).filter(f => f.endsWith('.csv'))
      
      for (const file of csvFiles) {
        try {
          const filePath = path.join(qolDir, file)
          const records = await this.parseCSV(filePath)
          
          for (const record of records) {
            try {
              await prisma.qualityOfLife.create({
                data: {
                  zipCode: String(record.ZIP_Code || record.zipCode || '77001'),
                  neighborhood: record.Neighborhood || record.Area,
                  crimeRate: parseFloat(record.Crime_Rate || record.Crime_Index || '0'),
                  crimeReduction: parseFloat(record.Crime_Reduction || record.YoY_Change || '0'),
                  safetyScore: parseFloat(record.Safety_Score || '70'),
                  walkScore: parseFloat(record.Walk_Score || record.Walkability || '50'),
                  transitScore: parseFloat(record.Transit_Score || '40'),
                  bikeScore: parseFloat(record.Bike_Score || '30'),
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
              errors.push(`${file}: ${error.message}`)
            }
          }
        } catch (error) {
          console.error(`Error processing ${file}:`, error)
          errors.push(`${file}: ${error.message}`)
        }
      }
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
}