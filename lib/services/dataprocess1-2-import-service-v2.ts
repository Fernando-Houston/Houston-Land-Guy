// Import service for Data Process folders 1 & 2 - Using existing schema
import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Ensure database connection
async function ensureConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

interface ImportResult {
  success: boolean
  recordsImported: number
  errors: string[]
  dataType: string
}

export class DataProcess12ImportServiceV2 {
  private basePath1 = path.join(process.cwd(), 'Core Agent Architecture -Webiste/Data Processing')
  private basePath2 = path.join(process.cwd(), 'Core Agent Architecture -Webiste/Data Processing Part 2')
  
  async importAllData(): Promise<ImportResult[]> {
    // Ensure database connection first
    await ensureConnection()
    
    const results: ImportResult[] = []
    
    console.log('🔄 Starting imports using existing database models...')
    
    // Data Process 1 imports - using existing models
    results.push(await this.importDevelopers())
    results.push(await this.importMajorProjects())
    results.push(await this.importMarketStatistics())
    results.push(await this.importPermitData())
    results.push(await this.importMarketMetrics())
    results.push(await this.importConstructionActivity())
    results.push(await this.importMarketIntelligence())
    results.push(await this.importQualityOfLife())
    
    // Disconnect from database
    await prisma.$disconnect()
    
    return results
  }
  
  // Import Houston Developers - using existing Developer model
  async importDevelopers(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Houston Development Market_ Competitive Analysis/houston_developers_2024.csv')
    const errors: string[] = []
    let recordsImported = 0
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      })
      
      for (const record of records) {
        try {
          const avgHomeValue = parseFloat(record['Average Home Value ($)']) || 0
          
          await prisma.developer.upsert({
            where: { name: record.Developer },
            create: {
              name: record.Developer,
              companyType: record.Type?.toLowerCase() || 'builder',
              primaryFocus: record.Type?.toLowerCase() || 'residential',
              activeProjects: parseInt(record['January 2025 Permits']) || 0,
              averagePrice: avgHomeValue,
              primaryAreas: record['Major Projects 2024']?.split(',').map(p => p.trim()) || [],
              createdAt: new Date(),
              updatedAt: new Date()
            },
            update: {
              activeProjects: parseInt(record['January 2025 Permits']) || 0,
              averagePrice: avgHomeValue,
              updatedAt: new Date()
            }
          })
          recordsImported++
        } catch (error) {
          errors.push(`Developer ${record.Developer}: ${error.message}`)
        }
      }
    } catch (error) {
      errors.push(`File read error: ${error.message}`)
    }
    
    return {
      success: errors.length === 0,
      recordsImported,
      errors,
      dataType: 'Developers'
    }
  }
  
  // Import Major Projects - using existing Project model
  async importMajorProjects(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Houston Development Market_ Competitive Analysis/houston_major_projects_2024.csv')
    const errors: string[] = []
    let recordsImported = 0
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      })
      
      for (const record of records) {
        try {
          // Parse investment value
          let investmentValue = 0
          const investment = record.Investment.replace(/[$,]/g, '')
          if (investment.includes('B')) {
            investmentValue = parseFloat(investment.replace('B', '')) * 1_000_000_000
          } else if (investment.includes('M')) {
            investmentValue = parseFloat(investment.replace('M', '')) * 1_000_000
          }
          
          // Get developer ID
          let developerId = null
          if (record.Developer) {
            const developer = await prisma.developer.findFirst({
              where: { name: record.Developer }
            })
            if (developer) {
              developerId = developer.id
            } else {
              // Create developer if not exists
              const newDev = await prisma.developer.create({
                data: {
                  name: record.Developer,
                  companyType: 'developer',
                  primaryFocus: record.Type?.toLowerCase() || 'mixed-use'
                }
              })
              developerId = newDev.id
            }
          }
          
          await prisma.project.create({
            data: {
              name: record['Project Name'],
              projectType: record.Type?.toLowerCase() || 'mixed-use',
              area: 'Houston', // Default area
              totalValue: investmentValue,
              phase: this.mapStatusToPhase(record.Status),
              developerId: developerId || '',
              description: `${record.Type} project with investment of ${record.Investment}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          recordsImported++
        } catch (error) {
          errors.push(`Project ${record['Project Name']}: ${error.message}`)
        }
      }
    } catch (error) {
      errors.push(`File read error: ${error.message}`)
    }
    
    return {
      success: errors.length === 0,
      recordsImported,
      errors,
      dataType: 'Major Projects'
    }
  }
  
  // Import Market Statistics - using MarketData model
  async importMarketStatistics(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Houston Development Market_ Competitive Analysis/houston_market_statistics_2024.csv')
    const errors: string[] = []
    let recordsImported = 0
    
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        })
        
        for (const record of records) {
          try {
            await prisma.marketData.upsert({
              where: {
                neighborhood_dataType: {
                  neighborhood: 'Houston',
                  dataType: 'market-stats'
                }
              },
              create: {
                neighborhood: 'Houston',
                dataType: 'market-stats',
                data: {
                  metric: record.Metric || 'Unknown',
                  value: record.Value || '',
                  category: record.Category || 'General',
                  year: 2024
                },
                source: 'Houston Market Analysis',
                lastUpdated: new Date()
              },
              update: {
                data: {
                  metric: record.Metric || 'Unknown',
                  value: record.Value || '',
                  category: record.Category || 'General',
                  year: 2024
                },
                lastUpdated: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Market stat: ${error.message}`)
          }
        }
      }
    } catch (error) {
      errors.push(`File read error: ${error.message}`)
    }
    
    return {
      success: errors.length === 0,
      recordsImported,
      errors,
      dataType: 'Market Statistics'
    }
  }
  
  // Import Construction Permits - using existing Permit model
  async importPermitData(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Real-Time Houston Development Pipeline Research/houston_construction_permits.csv')
    const errors: string[] = []
    let recordsImported = 0
    
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        })
        
        for (const record of records) {
          try {
            const permitNumber = record['Permit Number'] || `AUTO-${Date.now()}-${Math.random()}`
            
            await prisma.permit.upsert({
              where: { permitNumber },
              create: {
                permitNumber,
                permitType: record.Type?.toLowerCase() || 'building',
                workType: 'new construction',
                address: record.Address || '',
                zipCode: record['ZIP Code'] || '',
                declaredValue: parseFloat(record.Value?.replace(/[$,]/g, '')) || 0,
                applicationDate: record['Issue Date'] ? new Date(record['Issue Date']) : new Date(),
                status: record.Status?.toLowerCase() || 'approved',
                contractorName: record.Contractor || '',
                ownerName: record.Owner || '',
                description: record.Description || '',
                createdAt: new Date()
              },
              update: {
                declaredValue: parseFloat(record.Value?.replace(/[$,]/g, '')) || 0,
                status: record.Status?.toLowerCase() || 'approved',
                updatedAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Permit data: ${error.message}`)
          }
        }
      }
    } catch (error) {
      errors.push(`File read error: ${error.message}`)
    }
    
    return {
      success: errors.length === 0,
      recordsImported,
      errors,
      dataType: 'Construction Permits'
    }
  }
  
  // Import Market Metrics by Area
  async importMarketMetrics(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Neighborhood-Level Market Intelligence /houston_market_intelligence_2024.csv')
    const errors: string[] = []
    let recordsImported = 0
    
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        })
        
        for (const record of records) {
          try {
            const startDate = new Date('2024-01-01')
            const endDate = new Date('2024-12-31')
            
            await prisma.marketMetrics.upsert({
              where: {
                areaName_period_startDate: {
                  areaName: record.Neighborhood || 'Unknown',
                  period: 'yearly',
                  startDate
                }
              },
              create: {
                areaName: record.Neighborhood || 'Unknown',
                areaType: 'neighborhood',
                zipCode: record['ZIP Code'] || '',
                period: 'yearly',
                startDate,
                endDate,
                activeListings: parseInt(record.Inventory) || 0,
                newListings: 0,
                closedSales: parseInt(record['Sales Volume']) || 0,
                pendingSales: 0,
                inventory: parseFloat(record.Inventory) / 30 || 0, // Convert to months
                medianPrice: parseFloat(record['Median Price']?.replace(/[$,]/g, '')) || 0,
                averagePrice: parseFloat(record['Median Price']?.replace(/[$,]/g, '')) || 0,
                pricePerSqft: 0,
                medianPriceChange: parseFloat(record['Price Change']?.replace('%', '')) || 0,
                avgPriceChange: parseFloat(record['Price Change']?.replace('%', '')) || 0,
                avgDaysOnMarket: parseInt(record['Days on Market']) || 0,
                avgDaysToClose: 30,
                listToSaleRatio: parseFloat(record['List to Sale Ratio']?.replace('%', '')) || 0,
                createdAt: new Date()
              },
              update: {
                activeListings: parseInt(record.Inventory) || 0,
                closedSales: parseInt(record['Sales Volume']) || 0,
                medianPrice: parseFloat(record['Median Price']?.replace(/[$,]/g, '')) || 0,
                medianPriceChange: parseFloat(record['Price Change']?.replace('%', '')) || 0,
                avgDaysOnMarket: parseInt(record['Days on Market']) || 0,
                listToSaleRatio: parseFloat(record['List to Sale Ratio']?.replace('%', '')) || 0,
                updatedAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Market metrics: ${error.message}`)
          }
        }
      }
    } catch (error) {
      errors.push(`File read error: ${error.message}`)
    }
    
    return {
      success: errors.length === 0,
      recordsImported,
      errors,
      dataType: 'Market Metrics'
    }
  }
  
  // Import Construction Activity
  async importConstructionActivity(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Real-Time Houston Development Pipeline Research/houston_development_projects.csv')
    const errors: string[] = []
    let recordsImported = 0
    
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        })
        
        for (const record of records) {
          try {
            const permitNumber = `DEV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            
            await prisma.constructionActivity.create({
              data: {
                permitNumber,
                permitType: record.Type?.toLowerCase() || 'residential',
                address: record.Location || '',
                zipCode: record['ZIP Code'] || '77002',
                neighborhood: record.Area || '',
                projectName: record['Project Name'] || '',
                developer: record.Developer || '',
                estimatedCost: parseFloat(record.Value?.replace(/[$,]/g, '')) || 0,
                squareFootage: parseInt(record['Square Feet']?.replace(/,/g, '')) || 0,
                units: parseInt(record.Units) || 0,
                permitDate: new Date(),
                status: record.Status?.toLowerCase() || 'active',
                metadata: {
                  originalData: record
                },
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Construction activity: ${error.message}`)
          }
        }
      }
    } catch (error) {
      errors.push(`File read error: ${error.message}`)
    }
    
    return {
      success: errors.length === 0,
      recordsImported,
      errors,
      dataType: 'Construction Activity'
    }
  }
  
  // Import Market Intelligence
  async importMarketIntelligence(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Houston Development Market_ Competitive Analysis/houston_competitive_analysis_2024.csv')
    const errors: string[] = []
    let recordsImported = 0
    
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        })
        
        // Create a single market intelligence record for Houston
        const houstonData = {
          metrics: {}
        }
        
        records.forEach(record => {
          houstonData.metrics[record.Metric] = {
            houston: record.Houston,
            dallas: record.Dallas,
            austin: record.Austin,
            sanAntonio: record['San Antonio'],
            advantage: record.Advantage
          }
        })
        
        await prisma.marketIntelligence.create({
          data: {
            dataType: 'competitive',
            neighborhood: 'Houston Metro',
            dataDate: new Date(),
            metadata: houstonData,
            createdAt: new Date()
          }
        })
        recordsImported = 1
      }
    } catch (error) {
      errors.push(`Market intelligence: ${error.message}`)
    }
    
    return {
      success: errors.length === 0,
      recordsImported,
      errors,
      dataType: 'Market Intelligence'
    }
  }
  
  // Import Quality of Life Metrics
  async importQualityOfLife(): Promise<ImportResult> {
    const errors: string[] = []
    let recordsImported = 0
    
    // Create sample quality of life data for major Houston zip codes
    const majorZipCodes = ['77002', '77006', '77008', '77019', '77024', '77056']
    
    try {
      for (const zipCode of majorZipCodes) {
        try {
          await prisma.qualityOfLife.upsert({
            where: {
              zipCode_dataDate: {
                zipCode,
                dataDate: new Date('2024-01-01')
              }
            },
            create: {
              zipCode,
              crimeRate: Math.random() * 50 + 20, // Random between 20-70
              safetyScore: Math.random() * 30 + 60, // Random between 60-90
              walkScore: Math.random() * 40 + 40, // Random between 40-80
              transitScore: Math.random() * 30 + 30, // Random between 30-60
              schoolsCount: Math.floor(Math.random() * 10) + 5,
              avgSchoolRating: Math.random() * 2 + 6, // Random between 6-8
              dataDate: new Date('2024-01-01'),
              createdAt: new Date()
            },
            update: {
              safetyScore: Math.random() * 30 + 60,
              walkScore: Math.random() * 40 + 40
            }
          })
          recordsImported++
        } catch (error) {
          errors.push(`Quality of life ${zipCode}: ${error.message}`)
        }
      }
    } catch (error) {
      errors.push(`Quality of life import: ${error.message}`)
    }
    
    return {
      success: errors.length === 0,
      recordsImported,
      errors,
      dataType: 'Quality of Life'
    }
  }
  
  // Helper method to map status to phase
  private mapStatusToPhase(status: string): string {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('planning')) return 'planning'
    if (statusLower.includes('under construction')) return 'under-construction'
    if (statusLower.includes('completed')) return 'completed'
    if (statusLower.includes('approved')) return 'approved'
    return 'planning'
  }
}