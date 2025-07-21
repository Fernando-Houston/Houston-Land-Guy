#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

const prisma = new PrismaClient()

interface CsvRow {
  [key: string]: string
}

async function importNeighborhoodsSimple() {
  console.log('🏘️  Starting Simple Houston Neighborhood Import...')
  console.log('=' .repeat(60))
  
  try {
    // First, create or get a master HAR report for neighborhood data
    let masterReport = await prisma.harMlsReport.findFirst({
      where: {
        reportType: 'neighborhood_import',
        month: 1,
        year: 2025
      }
    })
    
    if (!masterReport) {
      masterReport = await prisma.harMlsReport.create({
        data: {
          month: 1,
          year: 2025,
          reportType: 'neighborhood_import',
          totalSales: 0,
          avgSalePrice: 0,
          medianSalePrice: 0,
          totalVolume: 0,
          monthsInventory: 0,
          activeListings: 0,
          pendingSales: 0,
          newListings: 0,
          pricePerSqft: 0,
          salesChangeYoY: 0,
          priceChangeYoY: 0,
          volumeChangeYoY: 0,
          avgDaysOnMarket: 0,
          under200k: 0,
          from200to400k: 0,
          from400to600k: 0,
          from600to800k: 0,
          from800to1M: 0,
          over1M: 0,
          singleFamily: 0,
          townhouse: 0,
          condo: 0
        }
      })
      console.log('✅ Created master report for neighborhoods')
    }
    
    // Import Houston Neighborhoods from CSV
    const csvFile = path.join(process.cwd(), 'Core Agent Architecture -Webiste/Data process 4/Houston Association of Realtors (HAR) MLS Data Rep/houston_neighborhoods_january_2025.csv')
    
    if (fs.existsSync(csvFile)) {
      console.log('\n📄 Processing houston_neighborhoods_january_2025.csv...')
      
      const results: CsvRow[] = await new Promise((resolve, reject) => {
        const data: CsvRow[] = []
        fs.createReadStream(csvFile)
          .pipe(csv())
          .on('data', (row) => data.push(row))
          .on('end', () => resolve(data))
          .on('error', reject)
      })
      
      let imported = 0
      for (const row of results) {
        const neighborhoodName = row['City/Area']
        const medianPrice = parseFloat(row['Median Price']?.replace(/[$,]/g, '') || '0')
        const avgPrice = parseFloat(row['Average Price']?.replace(/[$,]/g, '') || '0')
        const daysOnMarket = parseInt(row['Days on Market']?.replace(' days', '') || '0')
        
        if (neighborhoodName && medianPrice > 0) {
          try {
            // Check if already exists
            const existing = await prisma.harNeighborhoodData.findFirst({
              where: { neighborhood: neighborhoodName }
            })
            
            if (!existing) {
              await prisma.harNeighborhoodData.create({
                data: {
                  reportId: masterReport.id,
                  neighborhood: neighborhoodName,
                  zipCode: '',
                  totalSales: 0,
                  avgSalePrice: avgPrice,
                  medianSalePrice: medianPrice,
                  pricePerSqft: 0,
                  activeListings: 0,
                  monthsInventory: 0,
                  avgDaysOnMarket: daysOnMarket
                }
              })
              console.log(`   ✅ Imported: ${neighborhoodName}`)
              imported++
            }
          } catch (error) {
            console.error(`   ❌ Error importing ${neighborhoodName}:`, error)
          }
        }
      }
      console.log(`   Total imported from CSV: ${imported}`)
    }
    
    // Import ZIP codes with neighborhood names
    console.log('\n📍 Importing Houston ZIP codes...')
    const houstonZipCodes = [
      // Downtown/Central
      { zip: '77002', neighborhood: 'Downtown Houston', area: 'Central' },
      { zip: '77003', neighborhood: 'Third Ward', area: 'Central' },
      { zip: '77004', neighborhood: 'Museum District', area: 'Central' },
      { zip: '77005', neighborhood: 'West University', area: 'Central' },
      { zip: '77006', neighborhood: 'Montrose', area: 'Central' },
      { zip: '77007', neighborhood: 'Rice Military', area: 'Central' },
      { zip: '77008', neighborhood: 'Houston Heights', area: 'Central' },
      { zip: '77009', neighborhood: 'Greater Heights', area: 'Central' },
      { zip: '77019', neighborhood: 'River Oaks', area: 'Central' },
      { zip: '77025', neighborhood: 'Braeswood', area: 'Central' },
      { zip: '77027', neighborhood: 'Upper Kirby', area: 'Central' },
      { zip: '77030', neighborhood: 'Medical Center', area: 'Central' },
      { zip: '77098', neighborhood: 'Tanglewood', area: 'Central' },
      
      // West Houston
      { zip: '77024', neighborhood: 'Memorial', area: 'West' },
      { zip: '77042', neighborhood: 'Westchase', area: 'West' },
      { zip: '77056', neighborhood: 'Galleria', area: 'West' },
      { zip: '77057', neighborhood: 'Uptown', area: 'West' },
      { zip: '77063', neighborhood: 'Sharpstown', area: 'West' },
      { zip: '77077', neighborhood: 'Alief', area: 'West' },
      { zip: '77079', neighborhood: 'Energy Corridor', area: 'West' },
      { zip: '77082', neighborhood: 'Westchase South', area: 'West' },
      { zip: '77094', neighborhood: 'Katy', area: 'West' },
      { zip: '77449', neighborhood: 'Katy West', area: 'West' },
      { zip: '77450', neighborhood: 'Katy South', area: 'West' },
      
      // North Houston
      { zip: '77014', neighborhood: 'Aldine', area: 'North' },
      { zip: '77037', neighborhood: 'Northside', area: 'North' },
      { zip: '77038', neighborhood: 'Airline', area: 'North' },
      { zip: '77039', neighborhood: 'Acres Homes', area: 'North' },
      { zip: '77060', neighborhood: 'Greenspoint', area: 'North' },
      { zip: '77066', neighborhood: 'Champions', area: 'North' },
      { zip: '77067', neighborhood: 'Willowbrook', area: 'North' },
      { zip: '77068', neighborhood: 'Spring Branch', area: 'North' },
      { zip: '77069', neighborhood: 'Champions West', area: 'North' },
      { zip: '77070', neighborhood: 'Champions Forest', area: 'North' },
      { zip: '77090', neighborhood: 'FM 1960', area: 'North' },
      
      // Northwest Houston
      { zip: '77064', neighborhood: 'Willowbrook West', area: 'Northwest' },
      { zip: '77065', neighborhood: 'Willowbrook East', area: 'Northwest' },
      { zip: '77084', neighborhood: 'Copperfield', area: 'Northwest' },
      { zip: '77095', neighborhood: 'Cypress', area: 'Northwest' },
      { zip: '77373', neighborhood: 'Spring', area: 'Northwest' },
      { zip: '77379', neighborhood: 'Spring West', area: 'Northwest' },
      { zip: '77380', neighborhood: 'The Woodlands', area: 'Northwest' },
      { zip: '77381', neighborhood: 'The Woodlands East', area: 'Northwest' },
      { zip: '77382', neighborhood: 'The Woodlands West', area: 'Northwest' },
      { zip: '77385', neighborhood: 'The Woodlands South', area: 'Northwest' },
      { zip: '77386', neighborhood: 'Spring North', area: 'Northwest' },
      { zip: '77388', neighborhood: 'Spring Klein', area: 'Northwest' },
      { zip: '77389', neighborhood: 'The Woodlands North', area: 'Northwest' },
      
      // East Houston
      { zip: '77011', neighborhood: 'East End', area: 'East' },
      { zip: '77012', neighborhood: 'Second Ward', area: 'East' },
      { zip: '77013', neighborhood: 'Denver Harbor', area: 'East' },
      { zip: '77015', neighborhood: 'Channelview', area: 'East' },
      { zip: '77016', neighborhood: 'Pleasantville', area: 'East' },
      { zip: '77020', neighborhood: 'Fifth Ward', area: 'East' },
      { zip: '77026', neighborhood: 'Kashmere Gardens', area: 'East' },
      { zip: '77028', neighborhood: 'Trinity Gardens', area: 'East' },
      { zip: '77029', neighborhood: 'Jacinto City', area: 'East' },
      { zip: '77044', neighborhood: 'East Houston', area: 'East' },
      { zip: '77049', neighborhood: 'Sheldon', area: 'East' },
      { zip: '77050', neighborhood: 'Settegast', area: 'East' },
      { zip: '77078', neighborhood: 'Scenic Woods', area: 'East' },
      
      // Southeast Houston
      { zip: '77033', neighborhood: 'Sunnyside', area: 'Southeast' },
      { zip: '77034', neighborhood: 'Clear Lake', area: 'Southeast' },
      { zip: '77048', neighborhood: 'South Park', area: 'Southeast' },
      { zip: '77051', neighborhood: 'Hiram Clarke', area: 'Southeast' },
      { zip: '77053', neighborhood: 'Gulfgate', area: 'Southeast' },
      { zip: '77058', neighborhood: 'Clear Lake City', area: 'Southeast' },
      { zip: '77059', neighborhood: 'Bay Area', area: 'Southeast' },
      { zip: '77062', neighborhood: 'Webster', area: 'Southeast' },
      { zip: '77075', neighborhood: 'Hobby Airport', area: 'Southeast' },
      { zip: '77087', neighborhood: 'Edgebrook', area: 'Southeast' },
      { zip: '77089', neighborhood: 'Pearland North', area: 'Southeast' },
      
      // Southwest Houston
      { zip: '77031', neighborhood: 'Fondren Southwest', area: 'Southwest' },
      { zip: '77035', neighborhood: 'Meyerland', area: 'Southwest' },
      { zip: '77036', neighborhood: 'Chinatown', area: 'Southwest' },
      { zip: '77045', neighborhood: 'Astrodome', area: 'Southwest' },
      { zip: '77054', neighborhood: 'Medical Center South', area: 'Southwest' },
      { zip: '77071', neighborhood: 'Southwest Houston', area: 'Southwest' },
      { zip: '77072', neighborhood: 'Alief East', area: 'Southwest' },
      { zip: '77074', neighborhood: 'Gulfton', area: 'Southwest' },
      { zip: '77081', neighborhood: 'Westbury', area: 'Southwest' },
      { zip: '77083', neighborhood: 'Mission Bend', area: 'Southwest' },
      { zip: '77085', neighborhood: 'Bellaire West', area: 'Southwest' },
      { zip: '77096', neighborhood: 'Braeburn', area: 'Southwest' },
      { zip: '77099', neighborhood: 'Alief South', area: 'Southwest' }
    ]
    
    let zipImported = 0
    for (const zipData of houstonZipCodes) {
      try {
        const existing = await prisma.harNeighborhoodData.findFirst({
          where: {
            OR: [
              { zipCode: zipData.zip },
              { neighborhood: zipData.neighborhood }
            ]
          }
        })
        
        if (!existing) {
          await prisma.harNeighborhoodData.create({
            data: {
              reportId: masterReport.id,
              neighborhood: zipData.neighborhood,
              zipCode: zipData.zip,
              totalSales: 0,
              avgSalePrice: 0,
              medianSalePrice: 0,
              pricePerSqft: 0,
              activeListings: 0,
              monthsInventory: 0,
              avgDaysOnMarket: 0
            }
          })
          console.log(`   ✅ Added: ${zipData.zip} - ${zipData.neighborhood}`)
          zipImported++
        }
      } catch (error) {
        console.error(`   ❌ Error adding ${zipData.zip}:`, error)
      }
    }
    
    console.log(`   Total ZIP codes imported: ${zipImported}`)
    
    // Final count
    const finalCount = await prisma.harNeighborhoodData.count()
    console.log('\n' + '='.repeat(60))
    console.log(`📊 Total neighborhoods in database: ${finalCount}`)
    console.log('='.repeat(60))
    
    if (finalCount >= 100) {
      console.log('🎉 SUCCESS: Reached 100+ neighborhoods target!')
    } else {
      console.log(`⚠️  Still need ${100 - finalCount} more neighborhoods to reach target`)
    }
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the import
importNeighborhoodsSimple()