// Final Data Processing Import Service
// Imports all remaining CSV files from Data Processing folder
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import csv from 'csv-parser'

const prisma = new PrismaClient()

export class DataProcessingImportFinal {
  private basePath = path.join(process.cwd(), 'Core Agent Architecture -Webiste', 'Data Processing')

  async importAll() {
    console.log('🚀 Starting Final Data Processing Import (31 CSV files)...')
    
    const results = {
      developmentProjects: await this.importDevelopmentProjects(),
      constructionPermits: await this.importConstructionPermits(),
      marketIntelligence: await this.importMarketIntelligence(),
      competitiveAnalysis: await this.importCompetitiveAnalysis(),
      roiIndicators: await this.importROIIndicators(),
      lendingRates: await this.importLendingRates(),
      environmentalPrograms: await this.importEnvironmentalPrograms(),
      stemEducation: await this.importSTEMEducation(),
      techEcosystem: await this.importTechEcosystem(),
      regulatoryChanges: await this.importRegulatoryChanges()
    }
    
    console.log('✅ Final Data Processing Import Completed')
    return results
  }

  async importDevelopmentProjects() {
    console.log('🏗️ Importing Development Projects...')
    
    const files = [
      'Real-Time Houston Development Pipeline Research/houston_development_projects.csv',
      'Real-Time Houston Development Pipeline Research/houston_infrastructure_projects.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) continue
        
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            const data = {
              projectName: this.safeString(record.Project_Name || record.project_name || record.name) || 'Unknown Project',
              developer: this.safeString(record.Developer || record.developer_name),
              projectType: this.safeString(record.Project_Type || record.type) || 'Mixed-Use',
              status: this.safeString(record.Status || record.project_status) || 'Planned',
              location: this.safeString(record.Location || record.address),
              zipCode: this.safeString(record.ZIP_Code || record.zip_code) || '77001',
              totalInvestment: this.safeFloat(record.Total_Investment || record.investment_amount),
              estimatedCompletion: this.parseDate(record.Completion_Date || record.estimated_completion),
              units: this.safeInt(record.Units || record.total_units),
              squareFootage: this.safeFloat(record.Square_Footage || record.sqft),
              description: this.safeString(record.Description || record.project_description)
            }

            if (data.projectName !== 'Unknown Project') {
              await prisma.project.upsert({
                where: { projectName: data.projectName },
                update: data,
                create: data
              })
              imported++
            }
          } catch (error) {
            console.error('Error importing project:', error)
            failed++
            errors.push(`Project: ${error}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`File ${file}: ${error}`)
      }
    }

    return { imported, failed, errors }
  }

  async importConstructionPermits() {
    console.log('🔨 Importing Construction Permits...')
    
    const filePath = path.join(this.basePath, 'Real-Time Houston Development Pipeline Research/houston_construction_permits.csv')
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    try {
      if (!fs.existsSync(filePath)) {
        return { imported: 0, failed: 0, errors: ['File not found'] }
      }

      const records = await this.readCSV(filePath)
      
      for (const record of records) {
        try {
          const data = {
            permitNumber: this.safeString(record.Permit_Number || record.permit_id) || `PERM-${Date.now()}`,
            permitType: this.safeString(record.Permit_Type || record.type) || 'Construction',
            address: this.safeString(record.Address || record.location) || 'Houston, TX',
            zipCode: this.safeString(record.ZIP_Code || record.zip_code) || '77001',
            applicant: this.safeString(record.Applicant || record.contractor),
            projectValue: this.safeFloat(record.Project_Value || record.estimated_cost),
            issuedDate: this.parseDate(record.Issue_Date || record.permit_date),
            status: this.safeString(record.Status || record.permit_status) || 'Issued',
            description: this.safeString(record.Description || record.work_description)
          }

          await prisma.permit.upsert({
            where: { permitNumber: data.permitNumber },
            update: data,
            create: data
          })
          imported++
        } catch (error) {
          console.error('Error importing permit:', error)
          failed++
          errors.push(`Permit: ${error}`)
        }
      }
    } catch (error) {
      console.error('Error processing permits file:', error)
      errors.push(`Permits file: ${error}`)
    }

    return { imported, failed, errors }
  }

  async importMarketIntelligence() {
    console.log('📊 Importing Market Intelligence...')
    
    const files = [
      'Neighborhood-Level Market Intelligence /houston_market_intelligence_2024.csv',
      'Economic and Demographic Intelligence _Houston population growth projections by/houston_housing_market_data.csv',
      'Economic and Demographic Intelligence _Houston population growth projections by/houston_commercial_real_estate_data.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) continue
        
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            const data = {
              reportTitle: this.safeString(record.Report_Title || record.title) || 'Market Intelligence Report',
              category: this.safeString(record.Category || record.market_segment) || 'General',
              dataPoint: this.safeString(record.Data_Point || record.metric_name) || 'Market Metric',
              value: this.safeString(record.Value || record.metric_value) || '0',
              location: this.safeString(record.Location || record.area) || 'Houston',
              reportDate: this.parseDate(record.Report_Date || record.date) || new Date(),
              source: this.safeString(record.Source || record.data_source) || 'Market Research',
              trend: this.safeString(record.Trend || record.direction),
              significance: this.safeString(record.Significance || record.impact_level) || 'Medium'
            }

            await prisma.marketIntelligence.create({ data })
            imported++
          } catch (error) {
            console.error('Error importing market intelligence:', error)
            failed++
            errors.push(`Market Intel: ${error}`)
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        errors.push(`File ${file}: ${error}`)
      }
    }

    return { imported, failed, errors }
  }

  async importCompetitiveAnalysis() {
    console.log('🎯 Importing Competitive Analysis...')
    
    const files = [
      'Houston Development Market_ Competitive Analysis/houston_competitive_analysis_2024.csv',
      'Houston Development Market_ Competitive Analysis/houston_developers_2024.csv',
      'Houston Development Market_ Competitive Analysis/houston_major_projects_2024.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) continue
        
        const records = await this.readCSV(filePath)
        
        if (file.includes('developers')) {
          // Import developer data
          for (const record of records) {
            try {
              const data = {
                companyName: this.safeString(record.Company_Name || record.developer_name) || 'Unknown Developer',
                companyType: this.safeString(record.Company_Type || record.type) || 'Developer',
                headquarters: this.safeString(record.Headquarters || record.location),
                founded: this.safeInt(record.Founded || record.established_year),
                keyProjects: this.safeString(record.Key_Projects || record.notable_projects),
                totalProjects: this.safeInt(record.Total_Projects || record.project_count),
                marketShare: this.safeFloat(record.Market_Share || record.market_percentage),
                specialization: this.safeString(record.Specialization || record.focus_area) || 'Mixed-Use'
              }

              if (data.companyName !== 'Unknown Developer') {
                await prisma.developer.upsert({
                  where: { companyName: data.companyName },
                  update: data,
                  create: data
                })
                imported++
              }
            } catch (error) {
              failed++
              errors.push(`Developer: ${error}`)
            }
          }
        } else {
          // Import as market intelligence
          for (const record of records) {
            try {
              const data = {
                reportTitle: 'Competitive Analysis 2024',
                category: 'Competitive Intelligence',
                dataPoint: this.safeString(record.Metric || record.data_point) || 'Competition Metric',
                value: this.safeString(record.Value || record.metric_value) || '0',
                location: 'Houston Metro',
                reportDate: new Date('2024-01-01'),
                source: 'Market Research',
                trend: this.safeString(record.Trend),
                significance: 'High'
              }

              await prisma.marketIntelligence.create({ data })
              imported++
            } catch (error) {
              failed++
              errors.push(`Competitive: ${error}`)
            }
          }
        }
      } catch (error) {
        errors.push(`File ${file}: ${error}`)
      }
    }

    return { imported, failed, errors }
  }

  async importROIIndicators() {
    console.log('💰 Importing ROI Indicators...')
    
    const files = [
      'What are the key indicators of development ROI in Katy Heights/katy_heights_roi_indicators.csv',
      'What are the key indicators of development ROI in Katy Heights/katy_heights_price_history.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) continue
        
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            const data = {
              reportTitle: 'Katy Heights ROI Analysis',
              category: 'ROI Analysis',
              dataPoint: this.safeString(record.Indicator || record.metric) || 'ROI Metric',
              value: this.safeString(record.Value || record.price || record.percentage) || '0',
              location: 'Katy Heights',
              reportDate: this.parseDate(record.Date || record.year) || new Date(),
              source: 'ROI Analysis',
              trend: this.safeString(record.Trend || record.direction),
              significance: 'High'
            }

            await prisma.marketIntelligence.create({ data })
            imported++
          } catch (error) {
            failed++
            errors.push(`ROI: ${error}`)
          }
        }
      } catch (error) {
        errors.push(`File ${file}: ${error}`)
      }
    }

    return { imported, failed, errors }
  }

  async importLendingRates() {
    console.log('🏦 Importing Lending Rates...')
    
    const files = [
      'How do lending rate trends impact commercial real estate projects in Harris County/harris_county_lending_rate_progression.csv',
      'How do lending rate trends impact commercial real estate projects in Harris County/harris_county_cre_lending_impacts.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) continue
        
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            const data = {
              reportTitle: 'Harris County Lending Trends',
              category: 'Lending Rates',
              dataPoint: this.safeString(record.Rate_Type || record.metric) || 'Interest Rate',
              value: this.safeString(record.Rate || record.percentage || record.value) || '0',
              location: 'Harris County',
              reportDate: this.parseDate(record.Date || record.period) || new Date(),
              source: 'Lending Analysis',
              trend: this.safeString(record.Trend || record.direction),
              significance: 'High'
            }

            await prisma.marketIntelligence.create({ data })
            imported++
          } catch (error) {
            failed++
            errors.push(`Lending: ${error}`)
          }
        }
      } catch (error) {
        errors.push(`File ${file}: ${error}`)
      }
    }

    return { imported, failed, errors }
  }

  async importEnvironmentalPrograms() {
    console.log('🌱 Importing Environmental Programs...')
    
    const filePath = path.join(this.basePath, 'Environmental and Risk Intelligence/harris_county_environmental_programs.csv')
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    try {
      if (!fs.existsSync(filePath)) {
        return { imported: 0, failed: 0, errors: ['File not found'] }
      }

      const records = await this.readCSV(filePath)
      
      for (const record of records) {
        try {
          const data = {
            reportTitle: 'Harris County Environmental Programs',
            category: 'Environmental',
            dataPoint: this.safeString(record.Program_Name || record.program) || 'Environmental Program',
            value: this.safeString(record.Impact || record.value || record.status) || 'Active',
            location: 'Harris County',
            reportDate: this.parseDate(record.Date) || new Date(),
            source: 'Environmental Intelligence',
            trend: this.safeString(record.Trend),
            significance: 'Medium'
          }

          await prisma.marketIntelligence.create({ data })
          imported++
        } catch (error) {
          failed++
          errors.push(`Environmental: ${error}`)
        }
      }
    } catch (error) {
      errors.push(`Environmental file: ${error}`)
    }

    return { imported, failed, errors }
  }

  async importSTEMEducation() {
    console.log('🎓 Importing STEM Education Data...')
    
    const files = [
      'What role does STEM education play in Houston\'s economic expansion/houston_stem_economic_impact.csv',
      'What role does STEM education play in Houston\'s economic expansion/houston_stem_employers.csv',
      'What role does STEM education play in Houston\'s economic expansion/houston_stem_pipeline.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) continue
        
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            const data = {
              reportTitle: 'Houston STEM Economic Impact',
              category: 'STEM Education',
              dataPoint: this.safeString(record.Metric || record.employer || record.program) || 'STEM Metric',
              value: this.safeString(record.Value || record.impact || record.count) || '0',
              location: 'Houston',
              reportDate: new Date('2024-01-01'),
              source: 'STEM Analysis',
              trend: this.safeString(record.Trend || record.growth),
              significance: 'High'
            }

            await prisma.marketIntelligence.create({ data })
            imported++
          } catch (error) {
            failed++
            errors.push(`STEM: ${error}`)
          }
        }
      } catch (error) {
        errors.push(`File ${file}: ${error}`)
      }
    }

    return { imported, failed, errors }
  }

  async importTechEcosystem() {
    console.log('💻 Importing Tech Ecosystem Data...')
    
    const files = [
      'Technology and Innovation District Intelligence _Houston innovation distri/houston_tech_metrics.csv',
      'Technology and Innovation District Intelligence _Houston innovation distri/houston_districts_data.csv',
      'Technology and Innovation District Intelligence _Houston innovation distri/houston_investment_data.csv'
    ]
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (const file of files) {
      try {
        const filePath = path.join(this.basePath, file)
        if (!fs.existsSync(filePath)) continue
        
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            const data = {
              reportTitle: 'Houston Tech Ecosystem',
              category: 'Technology',
              dataPoint: this.safeString(record.District || record.metric || record.company) || 'Tech Metric',
              value: this.safeString(record.Investment || record.value || record.employees) || '0',
              location: 'Houston Innovation District',
              reportDate: new Date('2024-01-01'),
              source: 'Tech Analysis',
              trend: this.safeString(record.Trend || record.growth),
              significance: 'High'
            }

            await prisma.marketIntelligence.create({ data })
            imported++
          } catch (error) {
            failed++
            errors.push(`Tech: ${error}`)
          }
        }
      } catch (error) {
        errors.push(`File ${file}: ${error}`)
      }
    }

    return { imported, failed, errors }
  }

  async importRegulatoryChanges() {
    console.log('📋 Importing Regulatory Changes...')
    
    const filePath = path.join(this.basePath, 'Zoning and Regulatory Intelligence/regulatory_changes_2024_2025.csv')
    
    let imported = 0
    let failed = 0
    const errors: string[] = []

    try {
      if (!fs.existsSync(filePath)) {
        return { imported: 0, failed: 0, errors: ['File not found'] }
      }

      const records = await this.readCSV(filePath)
      
      for (const record of records) {
        try {
          const data = {
            reportTitle: 'Regulatory Changes 2024-2025',
            category: 'Regulatory',
            dataPoint: this.safeString(record.Regulation || record.change_type) || 'Regulatory Change',
            value: this.safeString(record.Impact || record.status || record.description) || 'Active',
            location: 'Harris County',
            reportDate: this.parseDate(record.Effective_Date || record.date) || new Date(),
            source: 'Regulatory Intelligence',
            trend: this.safeString(record.Trend),
            significance: 'High'
          }

          await prisma.marketIntelligence.create({ data })
          imported++
        } catch (error) {
          failed++
          errors.push(`Regulatory: ${error}`)
        }
      }
    } catch (error) {
      errors.push(`Regulatory file: ${error}`)
    }

    return { imported, failed, errors }
  }

  // Helper methods
  private safeString(value: any): string | null {
    if (value === undefined || value === null || value === '') return null
    return String(value).trim()
  }

  private safeInt(value: any): number | null {
    if (value === undefined || value === null || value === '') return null
    const parsed = parseInt(String(value))
    return isNaN(parsed) ? null : parsed
  }

  private safeFloat(value: any): number | null {
    if (value === undefined || value === null || value === '') return null
    const parsed = parseFloat(String(value))
    return isNaN(parsed) ? null : parsed
  }

  private parseDate(value: any): Date | null {
    if (!value) return null
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
  }

  private readCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = []
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject)
    })
  }
}

export const dataProcessingImportFinal = new DataProcessingImportFinal()