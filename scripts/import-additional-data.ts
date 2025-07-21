#!/usr/bin/env node
// Import additional data that was missed
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as csv from 'csv-parse'

const prisma = new PrismaClient()

async function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = []
    
    fs.createReadStream(filePath)
      .pipe(csv.parse({ 
        columns: true, 
        skip_empty_lines: true,
        trim: true
      }))
      .on('data', (data) => records.push(data))
      .on('end', () => resolve(records))
      .on('error', reject)
  })
}

async function importAdditionalData() {
  console.log('📥 Importing Additional Houston Data')
  console.log('===================================\n')
  
  const basePath = path.join(process.cwd(), 'Data process 5')
  
  try {
    // 1. Import housing affordability data
    console.log('🏠 Importing housing affordability data...')
    const affordabilityPath = path.join(basePath, 
      'Income and Wealth Demographics_ Harris County Texa/housing_affordability_burden.csv')
    
    if (fs.existsSync(affordabilityPath)) {
      const records = await parseCSV(affordabilityPath)
      
      for (const record of records) {
        if (record.Housing_Status && record.Percentage) {
          await prisma.marketIntelligence.create({
            data: {
              metricName: `Housing Affordability - ${record.Housing_Status} ${record.Burden_Level}`,
              metricValue: `${record.Percentage}% ${record.Description}`,
              numericValue: parseFloat(record.Percentage),
              unit: '%',
              period: 'current',
              periodStart: new Date(),
              periodEnd: new Date(),
              category: 'affordability',
              subCategory: record.Housing_Status.toLowerCase(),
              confidence: 95
            }
          })
        }
      }
      console.log('✅ Imported housing affordability data')
    }
    
    // 2. Import top income ZIP codes
    console.log('\n💰 Importing income by ZIP code data...')
    const incomeZipPath = path.join(basePath,
      'Income and Wealth Demographics_ Harris County Texa/top_income_zip_codes.csv')
    
    if (fs.existsSync(incomeZipPath)) {
      const records = await parseCSV(incomeZipPath)
      let imported = 0
      
      for (const record of records) {
        if (record.Zip_Code && record.Median_Household_Income) {
          // Check if income data exists for this ZIP
          const existing = await prisma.incomeData.findFirst({
            where: { 
              zipCode: record.Zip_Code,
              year: 2025
            }
          })
          
          if (!existing) {
            await prisma.incomeData.create({
              data: {
                zipCode: record.Zip_Code,
                year: 2025,
                medianHouseholdIncome: parseInt(record.Median_Household_Income),
                area: record.Area || 'Houston'
              }
            })
            imported++
          }
          
          // Also store in market intelligence for Fernando-X
          await prisma.marketIntelligence.create({
            data: {
              metricName: `Income - ${record.Area || record.Zip_Code}`,
              metricValue: `Median household income: ${record.Income_Formatted}`,
              numericValue: parseInt(record.Median_Household_Income),
              unit: '$',
              period: 'annual',
              periodStart: new Date('2025-01-01'),
              periodEnd: new Date('2025-12-31'),
              category: 'demographics',
              subCategory: 'income',
              confidence: 95
            }
          })
        }
      }
      console.log(`✅ Imported ${imported} ZIP code income records`)
    }
    
    // 3. Import economic indicators
    console.log('\n📊 Importing economic indicators...')
    const indicatorsPath = path.join(basePath,
      'Education and Workforce Demographics_ Harris Count/houston_economic_indicators_2025.csv')
    
    if (fs.existsSync(indicatorsPath)) {
      const records = await parseCSV(indicatorsPath)
      
      for (const record of records) {
        if (record.Indicator && record.Current_Value) {
          await prisma.economicIndicator.upsert({
            where: {
              indicatorName_reportDate: {
                indicatorName: record.Indicator,
                reportDate: new Date('2025-01-01')
              }
            },
            update: {
              currentValue: parseFloat(record.Current_Value),
              previousValue: record.Previous_Value ? parseFloat(record.Previous_Value) : undefined,
              unit: record.Unit || 'value'
            },
            create: {
              indicatorName: record.Indicator,
              category: record.Category || 'economic',
              currentValue: parseFloat(record.Current_Value),
              previousValue: record.Previous_Value ? parseFloat(record.Previous_Value) : undefined,
              unit: record.Unit || 'value',
              frequency: 'quarterly',
              reportDate: new Date('2025-01-01')
            }
          })
        }
      }
      console.log('✅ Imported economic indicators')
    }
    
    // 4. Import workforce programs
    console.log('\n👥 Importing workforce programs...')
    const workforcePath = path.join(basePath,
      'Education and Workforce Demographics_ Harris Count/houston_workforce_programs.csv')
    
    if (fs.existsSync(workforcePath)) {
      const records = await parseCSV(workforcePath)
      
      for (const record of records) {
        if (record.Program_Name) {
          await prisma.marketIntelligence.create({
            data: {
              metricName: `Workforce Program - ${record.Program_Name}`,
              metricValue: `${record.Type} program by ${record.Provider}. Focus: ${record.Focus_Area}`,
              category: 'workforce',
              subCategory: 'training',
              confidence: 90
            }
          })
        }
      }
      console.log('✅ Imported workforce programs')
    }
    
    // 5. Check final counts
    console.log('\n📈 Data Import Summary:')
    const counts = {
      'Market Intelligence': await prisma.marketIntelligence.count(),
      'Income Data': await prisma.incomeData.count(),
      'Economic Indicators': await prisma.economicIndicator.count(),
      'Rental Markets': await prisma.rentalMarket.count(),
      'Demographics': await prisma.demographics.count() || 0,
      'Employers': await prisma.employer.count(),
      'Projects': await prisma.project.count(),
      'Developers': await prisma.developer.count()
    }
    
    let total = 0
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count.toLocaleString()}`)
      total += count
    })
    
    console.log(`   ─────────────────────`)
    console.log(`   Total: ${total.toLocaleString()} data points`)
    
    // Show some sample insights
    console.log('\n💡 Sample Insights:')
    
    // Top income areas
    const topIncomeAreas = await prisma.incomeData.findMany({
      orderBy: { medianHouseholdIncome: 'desc' },
      take: 3
    })
    
    if (topIncomeAreas.length > 0) {
      console.log('\n   Highest Income Areas:')
      topIncomeAreas.forEach(area => {
        console.log(`   - ${area.area || area.zipCode}: $${area.medianHouseholdIncome.toLocaleString()}`)
      })
    }
    
    // Housing affordability
    const affordability = await prisma.marketIntelligence.findMany({
      where: { category: 'affordability' },
      take: 3
    })
    
    if (affordability.length > 0) {
      console.log('\n   Housing Affordability:')
      affordability.forEach(metric => {
        console.log(`   - ${metric.metricName}: ${metric.metricValue}`)
      })
    }
    
    console.log('\n✅ Additional data import completed!')
    
  } catch (error) {
    console.error('❌ Error importing data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importAdditionalData().catch(console.error)