#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('📋 COMPREHENSIVE DATA AUDIT REPORT')
  console.log('=' .repeat(80))
  console.log(`Generated: ${new Date().toLocaleString()}`)
  
  // Folder Analysis
  const folders = [
    {
      name: 'Data Processing',
      path: './Core Agent Architecture -Webiste/Data Processing',
      expectedTables: ['marketIntelligence', 'developer', 'project', 'permit', 'marketMetrics']
    },
    {
      name: 'DataProcess 3', 
      path: './Core Agent Architecture -Webiste/DataProcess 3',
      expectedTables: ['marketIntelligence', 'constructionActivity', 'costAnalysis', 'qualityOfLife']
    },
    {
      name: 'Data process 4',
      path: './Core Agent Architecture -Webiste/Data process 4', 
      expectedTables: ['harMlsReport', 'harNeighborhoodData']
    },
    {
      name: 'Data process 5',
      path: './Data process 5',
      expectedTables: ['areaDemographics', 'incomeData', 'rentalMarket', 'employerDP5', 'sTRMarket', 'populationProjection', 'economicIndicatorDP5', 'migrationData', 'educationMetrics', 'constructionCostDP5']
    },
    {
      name: 'Houston P-Data',
      path: './Core Agent Architecture -Webiste/HOuston Pdata',
      expectedTables: ['property']
    }
  ]

  console.log('\n📊 QUICK ANALYSIS')
  console.log('-' .repeat(50))

  let totalFiles = 0
  let totalImported = 0

  for (const folder of folders) {
    // Count files
    let fileCount = 0
    if (fs.existsSync(folder.path)) {
      try {
        const countFiles = (dir: string): number => {
          let count = 0
          const items = fs.readdirSync(dir)
          for (const item of items) {
            const fullPath = path.join(dir, item)
            const stat = fs.statSync(fullPath)
            if (stat.isDirectory()) {
              count += countFiles(fullPath)
            } else if (item.endsWith('.csv') || item.endsWith('.xlsx') || item.endsWith('.xls')) {
              count++
            }
          }
          return count
        }
        fileCount = countFiles(folder.path)
      } catch (error) {
        fileCount = 0
      }
    }
    
    // Count imported records for this folder's tables
    let importedCount = 0
    for (const tableName of folder.expectedTables) {
      try {
        const count = await (prisma as any)[tableName].count()
        importedCount += count
      } catch (error) {
        // Table might not exist or be accessible
      }
    }

    totalFiles += fileCount
    totalImported += importedCount

    const rate = fileCount > 0 ? (importedCount / (fileCount * 50)) * 100 : 0 // Assuming 50 records per file

    console.log(`\n${folder.name}:`)
    console.log(`  Files: ${fileCount}`)
    console.log(`  Records Imported: ${importedCount}`)
    console.log(`  Est. Import Rate: ${rate.toFixed(1)}%`)
    console.log(`  Status: ${rate === 0 ? '❌ No imports' : rate < 25 ? '🔴 Very Low' : rate < 50 ? '🟡 Low' : rate < 75 ? '🟠 Moderate' : '✅ Good'}`)
  }

  // Database summary
  console.log('\n💾 DATABASE TABLE STATUS')
  console.log('-' .repeat(50))

  const tables = [
    'property', 'developer', 'project', 'permit', 'marketMetrics',
    'harMlsReport', 'harNeighborhoodData', 'constructionActivity', 
    'marketIntelligence', 'costAnalysis', 'qualityOfLife', 'rentalMarket',
    'employerDP5', 'sTRMarket', 'areaDemographics', 'incomeData',
    'populationProjection', 'economicIndicatorDP5', 'migrationData',
    'educationMetrics', 'constructionCostDP5'
  ]

  const populated = []
  const empty = []

  for (const table of tables) {
    try {
      const count = await (prisma as any)[table].count()
      if (count > 0) {
        populated.push({ table, count })
      } else {
        empty.push(table)
      }
    } catch (error) {
      empty.push(table)
    }
  }

  console.log('\n✅ POPULATED TABLES:')
  populated.forEach(p => console.log(`  ${p.table}: ${p.count} records`))

  console.log('\n❌ EMPTY TABLES:')
  empty.forEach(table => console.log(`  ${table}`))

  // Summary
  console.log('\n🎯 EXECUTIVE SUMMARY')
  console.log('=' .repeat(50))
  console.log(`Total Data Files Available: ${totalFiles}`)
  console.log(`Total Records in Database: ${totalImported}`)
  console.log(`Estimated Overall Import Rate: ${totalFiles > 0 ? ((totalImported / (totalFiles * 50)) * 100).toFixed(1) : 0}%`)
  console.log(`Tables Populated: ${populated.length}/${tables.length} (${((populated.length / tables.length) * 100).toFixed(1)}%)`)

  console.log('\n🚨 CRITICAL GAPS:')
  if (empty.includes('property')) console.log('  - No property data (Houston P-Data not imported)')
  if (empty.includes('areaDemographics')) console.log('  - No demographic data (Data Process 5 not imported)')
  if (empty.includes('incomeData')) console.log('  - No income data (Data Process 5 not imported)')
  if (empty.includes('employerDP5')) console.log('  - No employer data (Data Process 5 not imported)')

  console.log('\n💡 RECOMMENDATIONS:')
  console.log('  1. Run Data Process 5 imports to populate demographic tables')
  console.log('  2. Create property data import for Houston P-Data Excel files')
  console.log('  3. Verify HAR MLS data import completeness')
  console.log('  4. Check import error logs for failed records')

  await prisma.$disconnect()
}

main().catch(console.error)