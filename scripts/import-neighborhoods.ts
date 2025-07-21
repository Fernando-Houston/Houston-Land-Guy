#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

const prisma = new PrismaClient()

interface NeighborhoodData {
  name: string
  zipCode?: string
  avgSalePrice?: number
  medianPrice?: number
  daysOnMarket?: number
  totalSales?: number
  inventory?: number
  priceChange?: number
  // Additional fields
  county?: string
  area?: string
  marketType?: string
  yearOverYearChange?: number
}

async function parseCSV(filePath: string): Promise<NeighborhoodData[]> {
  return new Promise((resolve, reject) => {
    const results: NeighborhoodData[] = []
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Parse different CSV formats
        const neighborhood: NeighborhoodData = {
          name: data['City/Area'] || data['Area'] || data['Neighborhood'] || '',
          zipCode: data['Zip Code'] || data['ZIP'] || data['ZipCode'] || '',
          medianPrice: parsePrice(data['Median Price'] || data['March 2025 Median'] || data['MedianPrice']),
          avgSalePrice: parsePrice(data['Average Price'] || data['Avg Price'] || data['AvgPrice']),
          daysOnMarket: parseInt(data['Days on Market']?.replace(' days', '') || data['DOM'] || '0'),
          yearOverYearChange: parseFloat(data['YoY Change']?.replace('%', '') || data['YearOverYear'] || '0'),
          marketType: data['Market Type'] || data['MarketType'] || '',
          area: data['Area'] || '',
          county: data['County'] || 'Harris County'
        }
        
        if (neighborhood.name) {
          results.push(neighborhood)
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject)
  })
}

function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0
  return parseInt(priceStr.replace(/[$,]/g, '')) || 0
}

async function importNeighborhoods() {
  console.log('🏘️  Starting Houston Neighborhood Import...')
  console.log('=' .repeat(60))
  
  const csvFiles = [
    'Core Agent Architecture -Webiste/Data process 4/Houston Association of Realtors (HAR) MLS Data Rep/houston_neighborhoods_january_2025.csv',
    'Core Agent Architecture -Webiste/Data process 4/Houston Association of Realtors (HAR) MLS Data Ana/houston_zip_code_prices_march_2025.csv',
    'Core Agent Architecture -Webiste/Data process 4/Houston Association of Realtors MLS Market Report/houston_market_areas_february_2025.csv',
    'Core Agent Architecture -Webiste/Data process 4/Houston Association of Realtors MLS Market Analysi-June/houston_neighborhoods_june_2025.csv',
    'Data process 5/Diversity and Cultural Demographics_ Harris County/houston_neighborhood_demographics_2025.csv',
  ]
  
  let totalImported = 0
  let totalErrors = 0
  const importedNeighborhoods = new Set<string>()
  
  for (const csvFile of csvFiles) {
    const filePath = path.join(process.cwd(), csvFile)
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${csvFile}`)
      continue
    }
    
    console.log(`\n📄 Processing: ${path.basename(csvFile)}`)
    
    try {
      const neighborhoods = await parseCSV(filePath)
      console.log(`   Found ${neighborhoods.length} neighborhoods in file`)
      
      for (const neighborhood of neighborhoods) {
        try {
          // Skip if already imported
          const key = neighborhood.name + (neighborhood.zipCode || '')
          if (importedNeighborhoods.has(key)) {
            continue
          }
          
          // Check if neighborhood already exists
          const existing = await prisma.harNeighborhoodData.findFirst({
            where: {
              OR: [
                { neighborhood: neighborhood.name },
                { zipCode: neighborhood.zipCode || undefined }
              ]
            }
          })
          
          if (existing) {
            // Update existing record
            await prisma.harNeighborhoodData.update({
              where: { id: existing.id },
              data: {
                medianSalePrice: neighborhood.medianPrice || existing.medianSalePrice,
                avgSalePrice: neighborhood.avgSalePrice || existing.avgSalePrice,
                avgDaysOnMarket: neighborhood.daysOnMarket || existing.avgDaysOnMarket,
                yearOverYearChange: neighborhood.yearOverYearChange || 0,
                updatedAt: new Date()
              }
            })
            console.log(`   ✅ Updated: ${neighborhood.name}`)
          } else {
            // Create new record
            // Need to create a HAR MLS Report first
            const report = await prisma.harMlsReport.create({
              data: {
                month: 1,
                year: 2025,
                reportTitle: 'Houston Neighborhood Import',
                reportType: 'Neighborhood Data',
                county: neighborhood.county || 'Harris County',
                totalSales: 0,
                avgSalePrice: 0,
                medianSalePrice: 0,
                totalVolume: 0,
                daysOnMarket: 0,
                monthsInventory: 0,
                activeListings: 0,
                pendingSales: 0,
                newListings: 0,
                sourceUrl: '',
                rawData: {}
              }
            })
            
            await prisma.harNeighborhoodData.create({
              data: {
                reportId: report.id,
                neighborhood: neighborhood.name,
                zipCode: neighborhood.zipCode || '',
                medianSalePrice: neighborhood.medianPrice || 0,
                avgSalePrice: neighborhood.avgSalePrice || 0,
                avgDaysOnMarket: neighborhood.daysOnMarket || 0,
                yearOverYearChange: neighborhood.yearOverYearChange || 0,
                totalSales: neighborhood.totalSales || 0,
                monthsInventory: neighborhood.inventory || 0,
                pricePerSqft: 0,
                activeListings: 0
              }
            })
            console.log(`   ✅ Imported: ${neighborhood.name}`)
            totalImported++
          }
          
          importedNeighborhoods.add(key)
          
        } catch (error) {
          console.error(`   ❌ Error importing ${neighborhood.name}:`, error)
          totalErrors++
        }
      }
      
    } catch (error) {
      console.error(`❌ Error processing file ${csvFile}:`, error)
    }
  }
  
  // Import additional ZIP codes from other sources
  console.log('\n📍 Importing additional Houston ZIP codes...')
  const houstonZipCodes = [
    // Inner Loop
    { zipCode: '77001', name: 'Downtown Houston', area: 'Inner Loop' },
    { zipCode: '77002', name: 'Downtown Houston', area: 'Inner Loop' },
    { zipCode: '77003', name: 'Downtown Houston', area: 'Inner Loop' },
    { zipCode: '77004', name: 'MacGregor/University of Houston', area: 'Inner Loop' },
    { zipCode: '77005', name: 'West University/Rice', area: 'Inner Loop' },
    { zipCode: '77006', name: 'Montrose', area: 'Inner Loop' },
    { zipCode: '77007', name: 'Houston Heights', area: 'Inner Loop' },
    { zipCode: '77008', name: 'Houston Heights/Timbergrove', area: 'Inner Loop' },
    { zipCode: '77009', name: 'Houston Heights', area: 'Inner Loop' },
    { zipCode: '77010', name: 'Downtown Houston', area: 'Inner Loop' },
    { zipCode: '77019', name: 'River Oaks', area: 'Inner Loop' },
    { zipCode: '77020', name: 'East End', area: 'Inner Loop' },
    { zipCode: '77021', name: 'Medical Center/South Main', area: 'Inner Loop' },
    { zipCode: '77025', name: 'West University', area: 'Inner Loop' },
    { zipCode: '77027', name: 'River Oaks/Greenway Plaza', area: 'Inner Loop' },
    { zipCode: '77030', name: 'Medical Center', area: 'Inner Loop' },
    { zipCode: '77098', name: 'Upper Kirby', area: 'Inner Loop' },
    // West Houston
    { zipCode: '77024', name: 'Memorial/Piney Point', area: 'West Houston' },
    { zipCode: '77042', name: 'Westchase', area: 'West Houston' },
    { zipCode: '77056', name: 'Galleria/Uptown', area: 'West Houston' },
    { zipCode: '77057', name: 'Galleria/Uptown', area: 'West Houston' },
    { zipCode: '77063', name: 'Sharpstown', area: 'West Houston' },
    { zipCode: '77077', name: 'Alief', area: 'West Houston' },
    { zipCode: '77079', name: 'Memorial/Energy Corridor', area: 'West Houston' },
    { zipCode: '77082', name: 'Westchase', area: 'West Houston' },
    { zipCode: '77094', name: 'Katy', area: 'West Houston' },
    // Northwest Houston
    { zipCode: '77018', name: 'Garden Oaks/Oak Forest', area: 'Northwest Houston' },
    { zipCode: '77040', name: 'Jersey Village', area: 'Northwest Houston' },
    { zipCode: '77064', name: 'Willowbrook', area: 'Northwest Houston' },
    { zipCode: '77065', name: 'Willowbrook', area: 'Northwest Houston' },
    { zipCode: '77066', name: 'Champions', area: 'Northwest Houston' },
    { zipCode: '77069', name: 'Champions', area: 'Northwest Houston' },
    { zipCode: '77070', name: 'Champions', area: 'Northwest Houston' },
    { zipCode: '77090', name: 'FM 1960', area: 'Northwest Houston' },
    // North Houston
    { zipCode: '77067', name: 'Aldine', area: 'North Houston' },
    { zipCode: '77068', name: 'Greenspoint', area: 'North Houston' },
    { zipCode: '77073', name: 'Greenspoint', area: 'North Houston' },
    { zipCode: '77338', name: 'Humble', area: 'North Houston' },
    { zipCode: '77339', name: 'Kingwood', area: 'North Houston' },
    { zipCode: '77345', name: 'Kingwood', area: 'North Houston' },
    { zipCode: '77346', name: 'Humble', area: 'North Houston' },
    { zipCode: '77396', name: 'Humble', area: 'North Houston' },
  ]
  
  for (const zipData of houstonZipCodes) {
    try {
      const existing = await prisma.harNeighborhoodData.findFirst({
        where: { zipCode: zipData.zipCode }
      })
      
      if (!existing) {
        // Need to create a HAR MLS Report first
        const report = await prisma.harMlsReport.create({
          data: {
            month: 1,
            year: 2025,
            reportTitle: 'Houston ZIP Code Import',
            reportType: 'ZIP Code Data',
            county: 'Harris County',
            totalSales: 0,
            avgSalePrice: 0,
            medianSalePrice: 0,
            totalVolume: 0,
            daysOnMarket: 0,
            monthsInventory: 0,
            activeListings: 0,
            pendingSales: 0,
            newListings: 0,
            sourceUrl: '',
            rawData: {}
          }
        })
        
        await prisma.harNeighborhoodData.create({
          data: {
            reportId: report.id,
            neighborhood: zipData.name,
            zipCode: zipData.zipCode,
            medianSalePrice: 0,
            avgSalePrice: 0,
            avgDaysOnMarket: 0,
            yearOverYearChange: 0,
            totalSales: 0,
            monthsInventory: 0,
            pricePerSqft: 0,
            activeListings: 0
          }
        })
        console.log(`   ✅ Added ZIP: ${zipData.zipCode} - ${zipData.name}`)
        totalImported++
      }
    } catch (error) {
      console.error(`   ❌ Error adding ZIP ${zipData.zipCode}:`, error)
      totalErrors++
    }
  }
  
  // Final summary
  const finalCount = await prisma.harNeighborhoodData.count()
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 IMPORT SUMMARY:')
  console.log(`✅ Successfully imported: ${totalImported} new neighborhoods`)
  console.log(`❌ Errors encountered: ${totalErrors}`)
  console.log(`📍 Total neighborhoods in database: ${finalCount}`)
  console.log('='.repeat(60))
  
  if (finalCount < 100) {
    console.log('\n⚠️  WARNING: Still below 100 neighborhoods target!')
    console.log('   Consider importing additional data sources')
  } else {
    console.log('\n🎉 SUCCESS: Reached 100+ neighborhoods target!')
  }
}

// Run the import
importNeighborhoods()
  .catch(console.error)
  .finally(() => prisma.$disconnect())