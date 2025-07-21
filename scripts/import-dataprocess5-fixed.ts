import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

const prisma = new PrismaClient()

interface ImportResult {
  imported: number
  failed: number
  total: number
  errors: string[]
}

interface ImportSummary {
  rentalMarket: ImportResult
  employers: ImportResult
  strMarket: ImportResult
  demographics: ImportResult
  income: ImportResult
}

async function importDataProcess5(): Promise<ImportSummary> {
  console.log('🔄 Starting Data Process 5 Import (Fixed Schema)\n')
  
  const summary: ImportSummary = {
    rentalMarket: { imported: 0, failed: 0, total: 0, errors: [] },
    employers: { imported: 0, failed: 0, total: 0, errors: [] },
    strMarket: { imported: 0, failed: 0, total: 0, errors: [] },
    demographics: { imported: 0, failed: 0, total: 0, errors: [] },
    income: { imported: 0, failed: 0, total: 0, errors: [] }
  }
  
  try {
    const dataProcessPath = '/Users/fernandox/Desktop/Houston Land Group New Webiste/houston-development-intelligence/Data process 5'
    
    // 1. Import Rental Market Data
    console.log('1. Importing Rental Market data...')
    await importRentalMarketData(dataProcessPath, summary.rentalMarket)
    
    // 2. Import Employer Data  
    console.log('2. Importing Employer data...')
    await importEmployerData(dataProcessPath, summary.employers)
    
    // 3. Import STR Market Data
    console.log('3. Importing STR Market data...')
    await importSTRMarketData(dataProcessPath, summary.strMarket)
    
    // 4. Import Demographics Data
    console.log('4. Importing Demographics data...')
    await importDemographicsData(dataProcessPath, summary.demographics)
    
    // 5. Import Income Data
    console.log('5. Importing Income data...')
    await importIncomeData(dataProcessPath, summary.income)
    
    return summary
    
  } catch (error) {
    console.error('Error in Data Process 5 import:', error)
    throw error
  }
}

async function importRentalMarketData(basePath: string, result: ImportResult) {
  try {
    const rentalFiles = [
      'Harris County Texas Rental Market Analysis - 2025/houston_rental_market_2025.csv',
      'Harris County Texas Rental Market Analysis - 2025/houston_zip_code_rents_2025.csv'
    ]
    
    for (const file of rentalFiles) {
      const filePath = path.join(basePath, file)
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️ File not found: ${file}`)
        continue
      }
      
      const csvContent = fs.readFileSync(filePath, 'utf-8')
      const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      result.total += parsed.data.length
      
      for (const row of parsed.data as any[]) {
        try {
          // Handle the actual CSV format which has Category,Metric,Value,Unit,Source
          const rentalData = {
            zipCode: null, // Not in this format
            neighborhood: row.Category || 'Houston Metro',
            submarket: row.Metric || 'Overall',
            avgRentStudio: null,
            avgRent1BR: null,
            avgRent2BR: parseFloat(row.Value || '0') || null,
            avgRent3BR: null,
            avgRent4BR: null,
            occupancyRate: null,
            occupancyClass: 'B',
            yearOverYearGrowth: null,
            quarterOverQuarter: null,
            totalUnits: null,
            deliveredUnits: null,
            underConstruction: null,
            plannedUnits: null,
            netAbsorption: null,
            leasingVelocity: null,
            concessions: null,
            reportDate: new Date('2025-01-01'),
            reportPeriod: 'monthly'
          }
          
          // Only create records with valid neighborhood
          if (rentalData.neighborhood) {
            await prisma.rentalMarket.upsert({
              where: {
                neighborhood_reportDate: {
                  neighborhood: rentalData.neighborhood,
                  reportDate: rentalData.reportDate
                }
              },
              update: rentalData,
              create: rentalData
            })
            
            result.imported++
          } else {
            result.failed++
          }
          
        } catch (error) {
          result.failed++
          result.errors.push(`Rental Market: ${error.message}`)
        }
      }
    }
    
    console.log(`   ✅ Rental Market: ${result.imported} imported, ${result.failed} failed`)
    
  } catch (error) {
    console.error('Error importing rental market data:', error)
    result.errors.push(`Rental Market Import Error: ${error.message}`)
  }
}

async function importEmployerData(basePath: string, result: ImportResult) {
  try {
    const employerFile = path.join(basePath, 'Employment and Labor Market Analysis_ Harris Count/houston_major_employers_2025.csv')
    
    if (!fs.existsSync(employerFile)) {
      console.log('   ⚠️ Employer file not found')
      return
    }
    
    const csvContent = fs.readFileSync(employerFile, 'utf-8')
    const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
    
    result.total = parsed.data.length
    
    for (const row of parsed.data as any[]) {
      try {
        // Handle actual CSV format: Company,Sector,Hiring_Status_2025,Employment_Size
        const employerData = {
          companyName: row.Company || row.company || 'Unknown',
          sector: row.Sector || 'Other',
          industry: row.Sector || 'Other',
          subIndustry: null,
          employeeCount: parseInt(row.Employment_Size?.replace(/[^\d]/g, '') || '1000'), // Extract numbers
          employeeGrowth: null,
          avgSalary: null,
          salaryRange: null,
          headquarters: 'Houston, TX',
          primaryAddress: null,
          zipCode: null,
          campusSize: null,
          economicImpact: null,
          taxContribution: null,
          houstonRank: null,
          nationalRank: null
        }
        
        if (!employerData.companyName || employerData.companyName === 'Unknown') {
          result.failed++
          continue
        }
        
        await prisma.employerDP5.upsert({
          where: { companyName: employerData.companyName },
          update: employerData,
          create: employerData
        })
        
        result.imported++
        
      } catch (error) {
        result.failed++
        result.errors.push(`Employer: ${error.message}`)
      }
    }
    
    console.log(`   ✅ Employers: ${result.imported} imported, ${result.failed} failed`)
    
  } catch (error) {
    console.error('Error importing employer data:', error)
    result.errors.push(`Employer Import Error: ${error.message}`)
  }
}

async function importSTRMarketData(basePath: string, result: ImportResult) {
  try {
    const strFiles = [
      'Harris County Short-Term Rental Market Analysis 20/houston_str_market_summary.csv',
      'Harris County Short-Term Rental Market Analysis 20/houston_str_neighborhood_tiers.csv'
    ]
    
    for (const file of strFiles) {
      const filePath = path.join(basePath, file)
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️ File not found: ${file}`)
        continue
      }
      
      const csvContent = fs.readFileSync(filePath, 'utf-8')
      const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      result.total += parsed.data.length
      
      for (const row of parsed.data as any[]) {
        try {
          const strData = {
            neighborhood: row.neighborhood || row.area || 'Unknown',
            performanceTier: row.tier || row.performance_tier || 'Mid',
            activeListings: parseInt(row.active_listings || row.listings || '0'),
            totalProperties: parseInt(row.total_properties || row.properties || '0') || null,
            professionalHosts: parseInt(row.professional_hosts || row.pro_hosts || '0') || null,
            avgDailyRate: parseFloat(row.avg_daily_rate || row.adr || row.daily_rate || '0'),
            occupancyRate: parseFloat(row.occupancy_rate || row.occupancy || '0'),
            revPAR: parseFloat(row.revpar || row.revenue_per_available || '0') || null,
            annualRevenue: parseFloat(row.annual_revenue || row.yearly_revenue || '0'),
            avgLengthOfStay: parseFloat(row.avg_length_stay || row.los || '0') || null,
            weekendPremium: parseFloat(row.weekend_premium || '0') || null,
            seasonalVariance: parseFloat(row.seasonal_variance || '0') || null,
            regulatoryStatus: row.regulatory_status || row.status || 'Compliant',
            permitRequired: (row.permit_required || row.requires_permit || 'false').toLowerCase() === 'true',
            reportDate: new Date(row.report_date || row.date || '2025-01-01')
          }
          
          await prisma.sTRMarket.upsert({
            where: {
              neighborhood_reportDate: {
                neighborhood: strData.neighborhood,
                reportDate: strData.reportDate
              }
            },
            update: strData,
            create: strData
          })
          
          result.imported++
          
        } catch (error) {
          result.failed++
          result.errors.push(`STR Market: ${error.message}`)
        }
      }
    }
    
    console.log(`   ✅ STR Market: ${result.imported} imported, ${result.failed} failed`)
    
  } catch (error) {
    console.error('Error importing STR market data:', error)
    result.errors.push(`STR Market Import Error: ${error.message}`)
  }
}

async function importDemographicsData(basePath: string, result: ImportResult) {
  try {
    const demoFiles = [
      'Diversity and Cultural Demographics_ Harris County/harris_county_demographics_2025.csv',
      'Diversity and Cultural Demographics_ Harris County/houston_neighborhood_demographics_2025.csv'
    ]
    
    for (const file of demoFiles) {
      const filePath = path.join(basePath, file)
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️ File not found: ${file}`)
        continue
      }
      
      const csvContent = fs.readFileSync(filePath, 'utf-8')
      const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      result.total += parsed.data.length
      
      for (const row of parsed.data as any[]) {
        try {
          const demoData = {
            zipCode: row.zipCode || row.zip_code || row.zip,
            neighborhood: row.neighborhood || row.area,
            tract: row.tract || row.census_tract,
            totalPopulation: parseInt(row.total_population || row.population || '0'),
            populationDensity: parseFloat(row.population_density || row.density || '0') || null,
            householdCount: parseInt(row.household_count || row.households || '0') || null,
            avgHouseholdSize: parseFloat(row.avg_household_size || row.household_size || '0') || null,
            medianAge: parseFloat(row.median_age || row.age_median || '0') || null,
            under18Percent: parseFloat(row.under_18_percent || row.under18 || '0') || null,
            over65Percent: parseFloat(row.over_65_percent || row.over65 || '0') || null,
            workingAgePercent: parseFloat(row.working_age_percent || row.working_age || '0') || null,
            whitePercent: parseFloat(row.white_percent || row.white || '0') || null,
            blackPercent: parseFloat(row.black_percent || row.black || '0') || null,
            hispanicPercent: parseFloat(row.hispanic_percent || row.hispanic || '0') || null,
            asianPercent: parseFloat(row.asian_percent || row.asian || '0') || null,
            otherRacePercent: parseFloat(row.other_race_percent || row.other || '0') || null,
            foreignBornPercent: parseFloat(row.foreign_born_percent || row.foreign_born || '0') || null,
            citizenPercent: parseFloat(row.citizen_percent || row.citizens || '0') || null,
            ownerOccupiedPercent: parseFloat(row.owner_occupied_percent || row.owner_occupied || '0') || null,
            renterOccupiedPercent: parseFloat(row.renter_occupied_percent || row.renter_occupied || '0') || null,
            vacancyRate: parseFloat(row.vacancy_rate || row.vacant || '0') || null,
            medianHomeValue: parseFloat(row.median_home_value || row.home_value || '0') || null,
            reportYear: parseInt(row.year || row.report_year || '2025')
          }
          
          if (demoData.totalPopulation === 0) {
            result.failed++
            continue
          }
          
          await prisma.areaDemographics.upsert({
            where: demoData.zipCode ? {
              zipCode_reportYear: {
                zipCode: demoData.zipCode,
                reportYear: demoData.reportYear
              }
            } : {
              neighborhood_reportYear: {
                neighborhood: demoData.neighborhood || 'Unknown',
                reportYear: demoData.reportYear
              }
            },
            update: demoData,
            create: demoData
          })
          
          result.imported++
          
        } catch (error) {
          result.failed++
          result.errors.push(`Demographics: ${error.message}`)
        }
      }
    }
    
    console.log(`   ✅ Demographics: ${result.imported} imported, ${result.failed} failed`)
    
  } catch (error) {
    console.error('Error importing demographics data:', error)
    result.errors.push(`Demographics Import Error: ${error.message}`)
  }
}

async function importIncomeData(basePath: string, result: ImportResult) {
  try {
    const incomeFiles = [
      'Income and Wealth Demographics_ Harris County Texa/harris_county_income_stats.csv',
      'Income and Wealth Demographics_ Harris County Texa/top_income_zip_codes.csv'
    ]
    
    for (const file of incomeFiles) {
      const filePath = path.join(basePath, file)
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️ File not found: ${file}`)
        continue
      }
      
      const csvContent = fs.readFileSync(filePath, 'utf-8')
      const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      result.total += parsed.data.length
      
      for (const row of parsed.data as any[]) {
        try {
          const incomeData = {
            zipCode: row.zipCode || row.zip_code || row.zip,
            neighborhood: row.neighborhood || row.area,
            medianHouseholdIncome: parseFloat(row.median_household_income || row.median_income || '0'),
            meanHouseholdIncome: parseFloat(row.mean_household_income || row.mean_income || '0') || null,
            perCapitaIncome: parseFloat(row.per_capita_income || row.per_capita || '0') || null,
            under25k: parseFloat(row.under_25k || row.income_under_25k || '0') || null,
            from25to50k: parseFloat(row.from_25_to_50k || row.income_25_50k || '0') || null,
            from50to75k: parseFloat(row.from_50_to_75k || row.income_50_75k || '0') || null,
            from75to100k: parseFloat(row.from_75_to_100k || row.income_75_100k || '0') || null,
            from100to150k: parseFloat(row.from_100_to_150k || row.income_100_150k || '0') || null,
            from150to200k: parseFloat(row.from_150_to_200k || row.income_150_200k || '0') || null,
            over200k: parseFloat(row.over_200k || row.income_over_200k || '0') || null,
            medianGrossRent: parseFloat(row.median_gross_rent || row.median_rent || '0') || null,
            rentBurdenPercent: parseFloat(row.rent_burden_percent || row.rent_burden || '0') || null,
            homeAffordabilityIndex: parseFloat(row.home_affordability_index || row.affordability || '0') || null,
            reportYear: parseInt(row.year || row.report_year || '2025')
          }
          
          if (incomeData.medianHouseholdIncome === 0) {
            result.failed++
            continue
          }
          
          await prisma.incomeData.upsert({
            where: incomeData.zipCode ? {
              zipCode_reportYear: {
                zipCode: incomeData.zipCode,
                reportYear: incomeData.reportYear
              }
            } : {
              neighborhood_reportYear: {
                neighborhood: incomeData.neighborhood || 'Unknown',
                reportYear: incomeData.reportYear
              }
            },
            update: incomeData,
            create: incomeData
          })
          
          result.imported++
          
        } catch (error) {
          result.failed++
          result.errors.push(`Income: ${error.message}`)
        }
      }
    }
    
    console.log(`   ✅ Income Data: ${result.imported} imported, ${result.failed} failed`)
    
  } catch (error) {
    console.error('Error importing income data:', error)
    result.errors.push(`Income Import Error: ${error.message}`)
  }
}

// Main execution
async function main() {
  try {
    console.log('🎯 Data Process 5 Integration - Fixed Import\n')
    console.log('=' .repeat(50) + '\n')
    
    const summary = await importDataProcess5()
    
    console.log('\n' + '=' .repeat(50))
    console.log('📊 DATA PROCESS 5 IMPORT SUMMARY')
    console.log('=' .repeat(50))
    
    let totalImported = 0
    let totalFailed = 0
    let totalRecords = 0
    
    Object.entries(summary).forEach(([category, result]) => {
      console.log(`${category}: ${result.imported} imported, ${result.failed} failed (${result.total} total)`)
      totalImported += result.imported
      totalFailed += result.failed
      totalRecords += result.total
      
      if (result.errors.length > 0) {
        console.log(`  ⚠️ Errors: ${result.errors.length}`)
        result.errors.slice(0, 3).forEach(error => {
          console.log(`    - ${error.substring(0, 100)}...`)
        })
      }
    })
    
    console.log('\n📊 TOTALS:')
    console.log(`✅ Successfully imported: ${totalImported} records`)
    console.log(`❌ Failed imports: ${totalFailed} records`)
    console.log(`📊 Total processed: ${totalRecords} records`)
    console.log(`🎯 Success rate: ${((totalImported / totalRecords) * 100).toFixed(1)}%`)
    
  } catch (error) {
    console.error('❌ Data Process 5 import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { importDataProcess5 }