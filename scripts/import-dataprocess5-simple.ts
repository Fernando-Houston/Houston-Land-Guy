#!/usr/bin/env node
// Simple Data Process 5 Import Script
// Handles the actual CSV formats in the Data Process 5 directory

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

const prisma = new PrismaClient()

async function importDemographics() {
  console.log('\n📊 Importing Demographics Data...')
  
  try {
    // Import Harris County demographics
    const harrisPath = path.join(process.cwd(), 'Data process 5/Diversity and Cultural Demographics_ Harris County/harris_county_demographics_2025.csv')
    if (fs.existsSync(harrisPath)) {
      const csvContent = fs.readFileSync(harrisPath, 'utf-8')
      const { data } = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      // Create a summary record for Harris County
      const totalPop = data.reduce((sum: number, row: any) => sum + parseInt(row.Population_2025 || '0'), 0)
      
      const demographics = {
        neighborhood: 'Harris County',
        totalPopulation: totalPop,
        medianAge: 34.5, // Houston metro median
        whitePercent: parseFloat(data.find((r: any) => r['Race/Ethnicity']?.includes('White'))?.Percentage_2025 || '0'),
        hispanicPercent: parseFloat(data.find((r: any) => r['Race/Ethnicity']?.includes('Hispanic'))?.Percentage_2025 || '0'),
        blackPercent: parseFloat(data.find((r: any) => r['Race/Ethnicity']?.includes('Black'))?.Percentage_2025 || '0'),
        asianPercent: parseFloat(data.find((r: any) => r['Race/Ethnicity']?.includes('Asian'))?.Percentage_2025 || '0'),
        reportYear: 2025
      }
      
      await prisma.areaDemographics.upsert({
        where: { neighborhood_reportYear: { neighborhood: 'Harris County', reportYear: 2025 } },
        update: demographics,
        create: demographics
      })
      
      console.log('  ✅ Harris County demographics imported')
    }
    
    // Import neighborhood demographics
    const neighPath = path.join(process.cwd(), 'Data process 5/Diversity and Cultural Demographics_ Harris County/houston_neighborhood_demographics_2025.csv')
    if (fs.existsSync(neighPath)) {
      const csvContent = fs.readFileSync(neighPath, 'utf-8')
      const { data } = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      let imported = 0
      for (const row of data as any[]) {
        if (row.neighborhood || row.Neighborhood) {
          try {
            await prisma.areaDemographics.upsert({
              where: {
                neighborhood_reportYear: {
                  neighborhood: row.neighborhood || row.Neighborhood,
                  reportYear: 2025
                }
              },
              update: {
                totalPopulation: parseInt(row.total_population || row.Population || '0'),
                hispanicPercent: parseFloat(row.hispanic_percent || row.Hispanic || '0'),
                whitePercent: parseFloat(row.white_percent || row.White || '0'),
                blackPercent: parseFloat(row.black_percent || row.Black || '0'),
                asianPercent: parseFloat(row.asian_percent || row.Asian || '0'),
                medianAge: parseFloat(row.median_age || '35'),
                reportYear: 2025
              },
              create: {
                neighborhood: row.neighborhood || row.Neighborhood,
                totalPopulation: parseInt(row.total_population || row.Population || '0'),
                hispanicPercent: parseFloat(row.hispanic_percent || row.Hispanic || '0'),
                whitePercent: parseFloat(row.white_percent || row.White || '0'),
                blackPercent: parseFloat(row.black_percent || row.Black || '0'),
                asianPercent: parseFloat(row.asian_percent || row.Asian || '0'),
                medianAge: parseFloat(row.median_age || '35'),
                reportYear: 2025
              }
            })
            imported++
          } catch (e) {
            console.error(`  ⚠️ Failed to import ${row.neighborhood}:`, e.message)
          }
        }
      }
      console.log(`  ✅ ${imported} neighborhood demographics imported`)
    }
  } catch (error) {
    console.error('  ❌ Demographics import error:', error.message)
  }
}

async function importRentalMarket() {
  console.log('\n🏠 Importing Rental Market Data...')
  
  try {
    const rentalPath = path.join(process.cwd(), 'Data process 5/Harris County Texas Rental Market Analysis - 2025/houston_rental_market_2025.csv')
    if (fs.existsSync(rentalPath)) {
      const csvContent = fs.readFileSync(rentalPath, 'utf-8')
      const { data } = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      // Group by category to create rental market records
      const categories = new Map()
      
      for (const row of data as any[]) {
        const category = row.Category || 'Overall'
        if (!categories.has(category)) {
          categories.set(category, {
            neighborhood: category,
            reportDate: new Date('2025-01-01'),
            reportPeriod: 'monthly'
          })
        }
        
        const record = categories.get(category)
        
        // Map metrics to fields
        if (row.Metric?.includes('Studio')) {
          record.avgRentStudio = parseFloat(row.Value || '0')
        } else if (row.Metric?.includes('1-Bedroom')) {
          record.avgRent1BR = parseFloat(row.Value || '0')
        } else if (row.Metric?.includes('2-Bedroom')) {
          record.avgRent2BR = parseFloat(row.Value || '0')
        } else if (row.Metric?.includes('3-Bedroom')) {
          record.avgRent3BR = parseFloat(row.Value || '0')
        } else if (row.Metric?.includes('Occupancy')) {
          record.occupancyRate = parseFloat(row.Value || '0')
        } else if (row.Metric?.includes('YoY')) {
          record.yearOverYearGrowth = parseFloat(row.Value || '0')
        }
      }
      
      let imported = 0
      for (const [category, data] of categories) {
        try {
          await prisma.rentalMarket.upsert({
            where: {
              neighborhood_reportDate: {
                neighborhood: data.neighborhood,
                reportDate: data.reportDate
              }
            },
            update: data,
            create: data
          })
          imported++
        } catch (e) {
          console.error(`  ⚠️ Failed to import ${category}:`, e.message)
        }
      }
      
      console.log(`  ✅ ${imported} rental market records imported`)
    }
  } catch (error) {
    console.error('  ❌ Rental market import error:', error.message)
  }
}

async function importEmployers() {
  console.log('\n🏢 Importing Major Employers...')
  
  try {
    const employerPath = path.join(process.cwd(), 'Data process 5/Employment and Labor Market Analysis_ Harris Count/houston_major_employers_2025.csv')
    if (fs.existsSync(employerPath)) {
      const csvContent = fs.readFileSync(employerPath, 'utf-8')
      const { data } = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      let imported = 0
      for (const row of data as any[]) {
        if (row.Company) {
          try {
            await prisma.employerDP5.upsert({
              where: { companyName: row.Company },
              update: {
                sector: row.Sector || 'Other',
                industry: row.Sector || 'Other',
                employeeCount: parseInt(row.Employment_Size?.replace(/[^\d]/g, '') || '1000'),
                headquarters: 'Houston, TX'
              },
              create: {
                companyName: row.Company,
                sector: row.Sector || 'Other',
                industry: row.Sector || 'Other',
                employeeCount: parseInt(row.Employment_Size?.replace(/[^\d]/g, '') || '1000'),
                headquarters: 'Houston, TX'
              }
            })
            imported++
          } catch (e) {
            console.error(`  ⚠️ Failed to import ${row.Company}:`, e.message)
          }
        }
      }
      console.log(`  ✅ ${imported} employers imported`)
    }
  } catch (error) {
    console.error('  ❌ Employer import error:', error.message)
  }
}

async function importSTRMarket() {
  console.log('\n🏨 Importing STR Market Data...')
  
  try {
    const strPath = path.join(process.cwd(), 'Data process 5/Harris County Short-Term Rental Market Analysis 20/houston_str_market_summary.csv')
    if (fs.existsSync(strPath)) {
      const csvContent = fs.readFileSync(strPath, 'utf-8')
      const { data } = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      let imported = 0
      for (const row of data as any[]) {
        if (row.Metric && row.Value) {
          try {
            // Create a summary record
            const neighborhood = row.Category || 'Houston Metro'
            await prisma.sTRMarket.upsert({
              where: {
                neighborhood_reportDate: {
                  neighborhood,
                  reportDate: new Date('2025-01-01')
                }
              },
              update: {
                activeListings: row.Metric.includes('Active Listings') ? parseInt(row.Value) : undefined,
                avgDailyRate: row.Metric.includes('ADR') ? parseFloat(row.Value) : undefined,
                occupancyRate: row.Metric.includes('Occupancy') ? parseFloat(row.Value) : undefined,
                annualRevenue: row.Metric.includes('Revenue') ? parseFloat(row.Value) : undefined
              },
              create: {
                neighborhood,
                performanceTier: 'Mid',
                activeListings: row.Metric.includes('Active Listings') ? parseInt(row.Value) : 0,
                avgDailyRate: row.Metric.includes('ADR') ? parseFloat(row.Value) : 0,
                occupancyRate: row.Metric.includes('Occupancy') ? parseFloat(row.Value) : 0,
                annualRevenue: row.Metric.includes('Revenue') ? parseFloat(row.Value) : 0,
                reportDate: new Date('2025-01-01')
              }
            })
            imported++
          } catch (e) {
            // Skip duplicates
          }
        }
      }
      console.log(`  ✅ ${imported} STR market records imported`)
    }
  } catch (error) {
    console.error('  ❌ STR market import error:', error.message)
  }
}

async function importIncomeData() {
  console.log('\n💰 Importing Income Data...')
  
  try {
    const incomePath = path.join(process.cwd(), 'Data process 5/Income and Wealth Demographics_ Harris County Texa/top_income_zip_codes.csv')
    if (fs.existsSync(incomePath)) {
      const csvContent = fs.readFileSync(incomePath, 'utf-8')
      const { data } = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
      
      let imported = 0
      for (const row of data as any[]) {
        if (row.zip_code || row.ZipCode || row.ZIP) {
          try {
            const zipCode = (row.zip_code || row.ZipCode || row.ZIP).toString()
            await prisma.incomeData.upsert({
              where: {
                zipCode_reportYear: {
                  zipCode,
                  reportYear: 2025
                }
              },
              update: {
                medianHouseholdIncome: parseFloat(row.median_income || row.MedianIncome || '0'),
                neighborhood: row.neighborhood || row.Neighborhood || null
              },
              create: {
                zipCode,
                neighborhood: row.neighborhood || row.Neighborhood || null,
                medianHouseholdIncome: parseFloat(row.median_income || row.MedianIncome || '0'),
                reportYear: 2025
              }
            })
            imported++
          } catch (e) {
            console.error(`  ⚠️ Failed to import income for ${row.zip_code}:`, e.message)
          }
        }
      }
      console.log(`  ✅ ${imported} income records imported`)
    }
  } catch (error) {
    console.error('  ❌ Income data import error:', error.message)
  }
}

async function main() {
  console.log('🚀 Starting Data Process 5 Simple Import')
  console.log('=' .repeat(50))
  
  try {
    await importDemographics()
    await importRentalMarket()
    await importEmployers()
    await importSTRMarket()
    await importIncomeData()
    
    // Get final counts
    const [demographics, rental, employers, str, income] = await Promise.all([
      prisma.areaDemographics.count(),
      prisma.rentalMarket.count(),
      prisma.employerDP5.count(),
      prisma.sTRMarket.count(),
      prisma.incomeData.count()
    ])
    
    console.log('\n' + '=' .repeat(50))
    console.log('📊 IMPORT COMPLETE - Final Database Counts:')
    console.log(`  Demographics: ${demographics}`)
    console.log(`  Rental Market: ${rental}`)
    console.log(`  Employers: ${employers}`)
    console.log(`  STR Market: ${str}`)
    console.log(`  Income Data: ${income}`)
    console.log('=' .repeat(50))
    
  } catch (error) {
    console.error('\n❌ Import failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the import
main().catch(console.error)