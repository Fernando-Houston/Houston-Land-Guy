// Fixed Data Process 5 Import Service - Corrected schema mappings
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import csv from 'csv-parser'

const prisma = new PrismaClient()

export class DataProcess5ImportFixed {
  
  async importAll() {
    console.log('🚀 Starting Data Process 5 Fixed Import...')
    
    const results = {
      demographics: await this.importDemographics(),
      rentalMarket: await this.importRentalMarket(),
      strMarket: await this.importSTRMarket(),
      employers: await this.importEmployers(),
      incomeData: await this.importIncomeData(),
      migrationData: await this.importMigrationData(),
      educationMetrics: await this.importEducationMetrics(),
      economicIndicators: await this.importEconomicIndicators(),
      constructionCosts: await this.importConstructionCosts()
    }
    
    console.log('✅ Data Process 5 Fixed Import Completed')
    return results
  }

  async importDemographics() {
    console.log('📊 Importing Demographics with corrected schema...')
    
    const dataPath = 'Data process 5'
    if (!fs.existsSync(dataPath)) {
      return { imported: 0, failed: 0, errors: ['Data Process 5 folder not found'] }
    }

    let imported = 0
    let failed = 0
    const errors: string[] = []

    // Look for demographic CSV files recursively
    const files = this.findCSVFiles(dataPath)
      .filter(f => f.includes('demographic') || f.includes('population') || f.includes('harris_county'))

    for (const file of files) {
      const filePath = path.join(dataPath, file)
      
      try {
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            // Map to correct schema fields
            const data = {
              zipCode: this.safeString(record.ZIP_Code || record.Zip_Code),
              neighborhood: this.safeString(record.Neighborhood || record.Area_Name),
              tract: this.safeString(record.Census_Tract || record.Tract),
              
              // Population - required field
              totalPopulation: parseInt(record.Total_Population || record.total_pop || '0') || 1,
              populationDensity: this.safeFloat(record.Population_Density || record.pop_density),
              householdCount: this.safeInt(record.Household_Count || record.households),
              avgHouseholdSize: this.safeFloat(record.Avg_Household_Size || record.avg_hh_size),
              
              // Age Demographics
              medianAge: this.safeFloat(record.Median_Age || record.median_age),
              under18Percent: this.safeFloat(record.Under_18_Pct || record.under18),
              over65Percent: this.safeFloat(record.Over_65_Pct || record.over65),
              workingAgePercent: this.safeFloat(record.Working_Age_Pct || record.working_age),
              
              // Race/Ethnicity - using correct schema field names
              whitePercent: this.safeFloat(record.White_Non_Hispanic || record.white_nh),
              blackPercent: this.safeFloat(record.Black_Non_Hispanic || record.black_nh),
              hispanicPercent: this.safeFloat(record.Hispanic_Latino || record.hispanic),
              asianPercent: this.safeFloat(record.Asian_Non_Hispanic || record.asian_nh),
              otherRacePercent: this.safeFloat(record.Other_Non_Hispanic || record.other_nh),
              
              // Nativity
              foreignBornPercent: this.safeFloat(record.Foreign_Born_Pct || record.foreign_born),
              citizenPercent: this.safeFloat(record.Citizen_Pct || record.citizen),
              
              // Housing
              ownerOccupiedPercent: this.safeFloat(record.Owner_Occupied_Pct || record.owner_occ),
              renterOccupiedPercent: this.safeFloat(record.Renter_Occupied_Pct || record.renter_occ),
              vacancyRate: this.safeFloat(record.Vacancy_Rate || record.vacancy),
              medianHomeValue: this.safeFloat(record.Median_Home_Value || record.median_value),
              
              reportYear: 2025
            }
            
            // Only import if we have location data
            if (data.zipCode || data.neighborhood) {
              await prisma.areaDemographics.upsert({
                where: data.zipCode ? 
                  { zipCode_reportYear: { zipCode: data.zipCode, reportYear: 2025 } } :
                  { neighborhood_reportYear: { neighborhood: data.neighborhood!, reportYear: 2025 } },
                update: data,
                create: data
              })
              imported++
            }
          } catch (error) {
            console.error(`Error importing demographic record:`, error)
            errors.push(`${file}: ${error}`)
            failed++
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error)
        errors.push(`File ${file}: ${error}`)
        failed++
      }
    }

    return { imported, failed, errors }
  }

  async importRentalMarket() {
    console.log('🏠 Importing Rental Market Data...')
    
    const dataPath = 'Data process 5'
    let imported = 0
    let failed = 0
    const errors: string[] = []

    try {
      const files = this.findCSVFiles(dataPath)
        .filter(f => f.includes('rental') || f.includes('rent'))

      for (const file of files) {
        const filePath = path.join(dataPath, file)
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            const data = {
              zipCode: this.safeString(record.ZIP_Code || record.Zip_Code) || '77001',
              neighborhood: this.safeString(record.Neighborhood || record.Area) || 'Houston',
              
              avgRent1Bed: this.safeFloat(record.Avg_Rent_1BR || record.rent_1br),
              avgRent2Bed: this.safeFloat(record.Avg_Rent_2BR || record.rent_2br),
              avgRent3Bed: this.safeFloat(record.Avg_Rent_3BR || record.rent_3br),
              avgRentOverall: this.safeFloat(record.Avg_Rent_Overall || record.avg_rent),
              
              occupancyRate: this.safeFloat(record.Occupancy_Rate || record.occupancy),
              vacancyRate: this.safeFloat(record.Vacancy_Rate || record.vacancy),
              rentGrowthYoY: this.safeFloat(record.Rent_Growth_YoY || record.growth),
              
              totalUnits: this.safeInt(record.Total_Units || record.units),
              newSupply: this.safeInt(record.New_Supply || record.new_units),
              
              medianIncome: this.safeFloat(record.Median_Income || record.income),
              rentToIncomeRatio: this.safeFloat(record.Rent_to_Income || record.ratio),
              
              reportDate: new Date('2025-01-01')
            }
            
            await prisma.rentalMarket.upsert({
              where: { zipCode_reportDate: { zipCode: data.zipCode, reportDate: data.reportDate } },
              update: data,
              create: data
            })
            imported++
          } catch (error) {
            console.error(`Error importing rental record:`, error)
            errors.push(`${file}: ${error}`)
            failed++
          }
        }
      }
    } catch (error) {
      console.error('Error in rental market import:', error)
      errors.push(`General error: ${error}`)
    }

    return { imported, failed, errors }
  }

  async importSTRMarket() {
    console.log('🏨 Importing Short-Term Rental Data...')
    
    const dataPath = 'Data process 5'
    let imported = 0
    let failed = 0
    const errors: string[] = []

    try {
      const files = this.findCSVFiles(dataPath)
        .filter(f => f.includes('str') || f.includes('airbnb') || f.includes('short_term'))

      for (const file of files) {
        const filePath = path.join(dataPath, file)
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            const data = {
              zipCode: this.safeString(record.ZIP_Code || record.Zip_Code) || '77001',
              neighborhood: this.safeString(record.Neighborhood || record.Area) || 'Houston',
              
              totalListings: this.safeInt(record.Total_Listings || record.listings),
              activeListings: this.safeInt(record.Active_Listings || record.active),
              avgDailyRate: this.safeFloat(record.Avg_Daily_Rate || record.adr),
              occupancyRate: this.safeFloat(record.Occupancy_Rate || record.occupancy),
              revPAR: this.safeFloat(record.RevPAR || record.revenue_per_available),
              
              avgMonthlyRevenue: this.safeFloat(record.Avg_Monthly_Revenue || record.monthly_rev),
              medianMonthlyRevenue: this.safeFloat(record.Median_Monthly_Revenue || record.median_rev),
              
              superhostPercentage: this.safeFloat(record.Superhost_Pct || record.superhost),
              avgReviewScore: this.safeFloat(record.Avg_Review_Score || record.review_score),
              
              reportDate: new Date('2025-01-01')
            }
            
            await prisma.strMarket.upsert({
              where: { zipCode_reportDate: { zipCode: data.zipCode, reportDate: data.reportDate } },
              update: data,
              create: data
            })
            imported++
          } catch (error) {
            console.error(`Error importing STR record:`, error)
            errors.push(`${file}: ${error}`)
            failed++
          }
        }
      }
    } catch (error) {
      console.error('Error in STR market import:', error)
      errors.push(`General error: ${error}`)
    }

    return { imported, failed, errors }
  }

  async importEmployers() {
    console.log('🏢 Importing Major Employers...')
    
    const dataPath = 'Data process 5'
    let imported = 0
    let failed = 0
    const errors: string[] = []

    try {
      const files = this.findCSVFiles(dataPath)
        .filter(f => f.includes('employer') || f.includes('company') || f.includes('jobs'))

      for (const file of files) {
        const filePath = path.join(dataPath, file)
        const records = await this.readCSV(filePath)
        
        for (const record of records) {
          try {
            const data = {
              companyName: this.safeString(record.Company_Name || record.Employer || record.Name) || 'Unknown',
              industry: this.safeString(record.Industry || record.Sector) || 'General',
              employeeCount: this.safeInt(record.Employee_Count || record.Employees) || 100,
              location: this.safeString(record.Location || record.City) || 'Houston',
              zipCode: this.safeString(record.ZIP_Code || record.Zip_Code),
              
              avgSalary: this.safeFloat(record.Avg_Salary || record.Average_Salary),
              jobGrowthRate: this.safeFloat(record.Job_Growth_Rate || record.Growth_Rate),
              
              headquarters: this.safeString(record.Headquarters) === 'true' || this.safeString(record.HQ) === 'true',
              publicCompany: this.safeString(record.Public_Company) === 'true' || this.safeString(record.Public) === 'true',
              
              description: this.safeString(record.Description),
              website: this.safeString(record.Website),
              
              reportYear: 2025
            }
            
            await prisma.employer.upsert({
              where: { companyName_reportYear: { companyName: data.companyName, reportYear: 2025 } },
              update: data,
              create: data
            })
            imported++
          } catch (error) {
            console.error(`Error importing employer record:`, error)
            errors.push(`${file}: ${error}`)
            failed++
          }
        }
      }
    } catch (error) {
      console.error('Error in employers import:', error)
      errors.push(`General error: ${error}`)
    }

    return { imported, failed, errors }
  }

  // Helper method to find CSV files recursively
  private findCSVFiles(dir: string): string[] {
    const csvFiles: string[] = []
    
    const scanDirectory = (currentDir: string, relativePath: string = '') => {
      try {
        const items = fs.readdirSync(currentDir)
        
        for (const item of items) {
          const fullPath = path.join(currentDir, item)
          const stats = fs.statSync(fullPath)
          
          if (stats.isDirectory()) {
            scanDirectory(fullPath, path.join(relativePath, item))
          } else if (item.endsWith('.csv')) {
            csvFiles.push(path.join(relativePath, item))
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${currentDir}:`, error)
      }
    }
    
    scanDirectory(dir)
    return csvFiles
  }

  // Helper methods for data conversion
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

  // Stub methods for other import functions
  async importIncomeData() { return { imported: 0, failed: 0, errors: ['Not implemented'] } }
  async importMigrationData() { return { imported: 0, failed: 0, errors: ['Not implemented'] } }
  async importEducationMetrics() { return { imported: 0, failed: 0, errors: ['Not implemented'] } }
  async importEconomicIndicators() { return { imported: 0, failed: 0, errors: ['Not implemented'] } }
  async importConstructionCosts() { return { imported: 0, failed: 0, errors: ['Not implemented'] } }
}

export const dataProcess5ImportFixed = new DataProcess5ImportFixed()