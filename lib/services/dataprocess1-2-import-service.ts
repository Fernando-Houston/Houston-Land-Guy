// Import service for Data Process folders 1 & 2
import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface ImportResult {
  success: boolean
  recordsImported: number
  errors: string[]
  dataType: string
}

export class DataProcess12ImportService {
  private basePath1 = path.join(process.cwd(), 'Core Agent Architecture -Webiste/Data Processing')
  private basePath2 = path.join(process.cwd(), 'Core Agent Architecture -Webiste/Data Processing Part 2')
  
  async importAllData(): Promise<ImportResult[]> {
    const results: ImportResult[] = []
    
    // Data Process 1 imports
    results.push(await this.importDevelopers())
    results.push(await this.importMajorProjects())
    results.push(await this.importMarketStatistics())
    results.push(await this.importCommercialSectors())
    results.push(await this.importCompetitiveAnalysis())
    results.push(await this.importLandAcquisition())
    results.push(await this.importResidentialActivity())
    results.push(await this.importPermitData())
    results.push(await this.importInfrastructureProjects())
    results.push(await this.importZoningData())
    results.push(await this.importEconomicData())
    results.push(await this.importEnvironmentalData())
    results.push(await this.importTechInnovationData())
    results.push(await this.importFinancingData())
    results.push(await this.importNeighborhoodData())
    
    return results
  }
  
  // Import Houston Developers
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
          await prisma.developer.upsert({
            where: { name: record.Developer },
            create: {
              name: record.Developer,
              type: record.Type,
              monthlyPermits: parseInt(record['January 2025 Permits']) || 0,
              avgHomeValue: parseFloat(record['Average Home Value ($)']) || 0,
              majorProjects: record['Major Projects 2024'],
              createdAt: new Date(),
              updatedAt: new Date()
            },
            update: {
              monthlyPermits: parseInt(record['January 2025 Permits']) || 0,
              avgHomeValue: parseFloat(record['Average Home Value ($)']) || 0,
              majorProjects: record['Major Projects 2024'],
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
  
  // Import Major Projects
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
          
          await prisma.project.upsert({
            where: { name: record['Project Name'] },
            create: {
              name: record['Project Name'],
              developerName: record.Developer,
              type: record.Type,
              investmentValue,
              status: record.Status,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            update: {
              developerName: record.Developer,
              type: record.Type,
              investmentValue,
              status: record.Status,
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
  
  // Import Market Statistics
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
            await prisma.marketStats.create({
              data: {
                metric: record.Metric || 'Unknown',
                value: record.Value || '',
                category: record.Category || 'General',
                year: 2024,
                createdAt: new Date()
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
  
  // Import Commercial Sectors
  async importCommercialSectors(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Houston Development Market_ Competitive Analysis/houston_commercial_sectors_2024.csv')
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
            await prisma.commercialSector.create({
              data: {
                sector: record.Sector || 'Unknown',
                sqftUnderConstruction: parseInt(record['Sq Ft Under Construction']?.replace(/,/g, '')) || 0,
                vacancyRate: parseFloat(record['Vacancy Rate']?.replace('%', '')) || 0,
                avgRentPsf: parseFloat(record['Avg Rent PSF']?.replace('$', '')) || 0,
                netAbsorption: parseInt(record['Net Absorption']?.replace(/,/g, '')) || 0,
                year: 2024,
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Commercial sector: ${error.message}`)
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
      dataType: 'Commercial Sectors'
    }
  }
  
  // Import Houston Job Growth by Sector
  async importEconomicData(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Economic and Demographic Intelligence _Houston population growth projections by/houston_job_growth_by_sector.csv')
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
            await prisma.economicIndicator.create({
              data: {
                name: `Job Growth - ${record.Sector}`,
                value: record['2024 Jobs'] || '0',
                unit: 'jobs',
                period: '2024',
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Economic data: ${error.message}`)
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
      dataType: 'Economic Data'
    }
  }
  
  // Import Population Growth by Area
  async importPopulationData(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Economic and Demographic Intelligence _Houston population growth projections by/houston_population_growth_by_area.csv')
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
            await prisma.demographics.create({
              data: {
                area: record.Area || 'Unknown',
                population2024: parseInt(record['2024 Population']?.replace(/,/g, '')) || 0,
                population2029: parseInt(record['2029 Projected']?.replace(/,/g, '')) || 0,
                growthRate: parseFloat(record['Growth Rate']?.replace('%', '')) || 0,
                newResidents: parseInt(record['New Residents']?.replace(/,/g, '')) || 0,
                source: 'Census Projections',
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Population data: ${error.message}`)
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
      dataType: 'Population Growth'
    }
  }
  
  // Import Construction Permits
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
            await prisma.permit.create({
              data: {
                permitNumber: record['Permit Number'] || `AUTO-${Date.now()}`,
                type: record.Type || 'Unknown',
                address: record.Address || '',
                zipCode: record['ZIP Code'] || '',
                value: parseFloat(record.Value?.replace(/[$,]/g, '')) || 0,
                issueDate: record['Issue Date'] ? new Date(record['Issue Date']) : new Date(),
                status: record.Status || 'Unknown',
                contractor: record.Contractor || '',
                owner: record.Owner || '',
                createdAt: new Date()
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
  
  // Import Infrastructure Projects
  async importInfrastructureProjects(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Real-Time Houston Development Pipeline Research/houston_infrastructure_projects.csv')
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
            await prisma.infrastructureProject.create({
              data: {
                name: record['Project Name'] || 'Unknown',
                type: record.Type || 'Infrastructure',
                agency: record.Agency || '',
                budget: parseFloat(record.Budget?.replace(/[$,]/g, '')) || 0,
                timeline: record.Timeline || '',
                status: record.Status || 'Planning',
                impact: record.Impact || '',
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Infrastructure: ${error.message}`)
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
      dataType: 'Infrastructure Projects'
    }
  }
  
  // Import Zoning Changes
  async importZoningData(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Real-Time Houston Development Pipeline Research/houston_zoning_changes.csv')
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
            await prisma.zoningChange.create({
              data: {
                area: record.Area || 'Unknown',
                previousZoning: record['Previous Zoning'] || '',
                newZoning: record['New Zoning'] || '',
                acreage: parseFloat(record.Acreage) || 0,
                approvalDate: record['Approval Date'] ? new Date(record['Approval Date']) : new Date(),
                impact: record.Impact || '',
                developer: record.Developer || '',
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Zoning data: ${error.message}`)
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
      dataType: 'Zoning Changes'
    }
  }
  
  // Import Environmental Data
  async importEnvironmentalData(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Environmental and Risk Intelligence/harris_county_environmental_programs.csv')
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
            await prisma.environmentalData.create({
              data: {
                program: record.Program || 'Unknown',
                category: record.Category || 'Environmental',
                funding: parseFloat(record.Funding?.replace(/[$,]/g, '')) || 0,
                impact: record.Impact || '',
                status: record.Status || 'Active',
                year: parseInt(record.Year) || 2024,
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Environmental data: ${error.message}`)
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
      dataType: 'Environmental Data'
    }
  }
  
  // Import Technology Innovation Data
  async importTechInnovationData(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Technology and Innovation District Intelligence _Houston innovation distri/houston_tech_metrics.csv')
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
            await prisma.techInnovation.create({
              data: {
                metric: record.Metric || 'Unknown',
                value: record.Value || '',
                category: record.Category || 'Technology',
                district: record.District || 'Houston',
                year: parseInt(record.Year) || 2024,
                growth: parseFloat(record.Growth?.replace('%', '')) || 0,
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Tech data: ${error.message}`)
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
      dataType: 'Technology Innovation'
    }
  }
  
  // Import Financing Data
  async importFinancingData(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'How do lending rate trends impact commercial real estate projects in Harris County/harris_county_cre_lending_impacts.csv')
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
            await prisma.financingData.create({
              data: {
                lenderType: record['Lender Type'] || 'Unknown',
                rate: parseFloat(record.Rate?.replace('%', '')) || 0,
                ltv: parseFloat(record.LTV?.replace('%', '')) || 0,
                propertyType: record['Property Type'] || '',
                minLoan: parseFloat(record['Min Loan']?.replace(/[$,]/g, '')) || 0,
                maxLoan: parseFloat(record['Max Loan']?.replace(/[$,]/g, '')) || 0,
                terms: record.Terms || '',
                date: new Date(),
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Financing data: ${error.message}`)
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
      dataType: 'Financing Data'
    }
  }
  
  // Import Neighborhood Market Intelligence
  async importNeighborhoodData(): Promise<ImportResult> {
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
            await prisma.neighborhoodStats.create({
              data: {
                neighborhood: record.Neighborhood || 'Unknown',
                zipCode: record['ZIP Code'] || '',
                medianPrice: parseFloat(record['Median Price']?.replace(/[$,]/g, '')) || 0,
                priceChange: parseFloat(record['Price Change']?.replace('%', '')) || 0,
                inventory: parseInt(record.Inventory) || 0,
                daysOnMarket: parseInt(record['Days on Market']) || 0,
                salesVolume: parseInt(record['Sales Volume']) || 0,
                listToSaleRatio: parseFloat(record['List to Sale Ratio']?.replace('%', '')) || 0,
                year: 2024,
                month: 'Current',
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Neighborhood data: ${error.message}`)
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
      dataType: 'Neighborhood Intelligence'
    }
  }
  
  // Import Competitive Analysis
  async importCompetitiveAnalysis(): Promise<ImportResult> {
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
        
        for (const record of records) {
          try {
            await prisma.competitiveAnalysis.create({
              data: {
                metric: record.Metric || 'Unknown',
                houston: record.Houston || '',
                dallas: record.Dallas || '',
                austin: record.Austin || '',
                sanAntonio: record['San Antonio'] || '',
                advantage: record.Advantage || '',
                year: 2024,
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Competitive analysis: ${error.message}`)
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
      dataType: 'Competitive Analysis'
    }
  }
  
  // Import Land Acquisition Strategies
  async importLandAcquisition(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Houston Development Market_ Competitive Analysis/houston_land_acquisition_strategies_2024.csv')
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
            await prisma.landAcquisition.create({
              data: {
                developer: record.Developer || 'Unknown',
                strategy: record.Strategy || '',
                targetAreas: record['Target Areas'] || '',
                avgAcreage: parseFloat(record['Avg Acreage']) || 0,
                pricePerAcre: parseFloat(record['Price Per Acre']?.replace(/[$,]/g, '')) || 0,
                totalInvestment: parseFloat(record['Total Investment']?.replace(/[$,]/g, '')) || 0,
                year: 2024,
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Land acquisition: ${error.message}`)
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
      dataType: 'Land Acquisition Strategies'
    }
  }
  
  // Import Residential Activity by Area
  async importResidentialActivity(): Promise<ImportResult> {
    const filePath = path.join(this.basePath1, 'Houston Development Market_ Competitive Analysis/houston_residential_activity_by_area_2024.csv')
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
            await prisma.residentialActivity.create({
              data: {
                area: record.Area || 'Unknown',
                newStarts: parseInt(record['New Starts']) || 0,
                closings: parseInt(record.Closings) || 0,
                avgPrice: parseFloat(record['Avg Price']?.replace(/[$,]/g, '')) || 0,
                inventory: parseInt(record.Inventory) || 0,
                absorptionRate: parseFloat(record['Absorption Rate']?.replace('%', '')) || 0,
                topBuilder: record['Top Builder'] || '',
                year: 2024,
                quarter: 'Q4',
                createdAt: new Date()
              }
            })
            recordsImported++
          } catch (error) {
            errors.push(`Residential activity: ${error.message}`)
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
      dataType: 'Residential Activity'
    }
  }
}