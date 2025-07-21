#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function countFilesInFolder(folderPath) {
  let count = 0
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return
    
    try {
      const items = fs.readdirSync(dir)
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          scanDir(fullPath)
        } else {
          const ext = path.extname(item).toLowerCase()
          if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
            count++
          }
        }
      }
    } catch (error) {
      // Skip errors
    }
  }
  
  scanDir(folderPath)
  return count
}

async function main() {
  console.log('📋 HOUSTON DEVELOPMENT INTELLIGENCE - DATA AUDIT')
  console.log('=' .repeat(70))
  console.log(`Generated: ${new Date().toLocaleString()}`)
  
  // Count files in each folder
  const folders = [
    { name: 'Data Processing', path: './Core Agent Architecture -Webiste/Data Processing' },
    { name: 'Data Processing Part 2', path: './Core Agent Architecture -Webiste/Data Processing Part 2' },
    { name: 'DataProcess 3', path: './Core Agent Architecture -Webiste/DataProcess 3' },
    { name: 'Data process 4', path: './Core Agent Architecture -Webiste/Data process 4' },
    { name: 'Data process 5', path: './Data process 5' },
    { name: 'Houston P-Data', path: './Core Agent Architecture -Webiste/HOuston Pdata' }
  ]
  
  console.log('\n📁 DATA FILES ANALYSIS:')
  console.log('-' .repeat(50))
  
  let totalFiles = 0
  for (const folder of folders) {
    const fileCount = await countFilesInFolder(folder.path)
    totalFiles += fileCount
    console.log(`${folder.name}: ${fileCount} files`)
  }
  console.log(`\nTotal Files Available: ${totalFiles}`)
  
  // Check database tables
  console.log('\n💾 DATABASE STATUS:')
  console.log('-' .repeat(50))
  
  const tables = [
    'property', 'developer', 'project', 'permit', 'marketMetrics', 
    'harMlsReport', 'harNeighborhoodData', 'constructionActivity',
    'marketIntelligence', 'costAnalysis', 'qualityOfLife', 'rentalMarket',
    'employerDP5', 'sTRMarket', 'areaDemographics', 'incomeData',
    'populationProjection', 'economicIndicatorDP5', 'migrationData',
    'educationMetrics', 'constructionCostDP5', 'fernandoMemory'
  ]
  
  let totalRecords = 0
  const populated = []
  const empty = []
  
  for (const table of tables) {
    try {
      const count = await prisma[table].count()
      totalRecords += count
      if (count > 0) {
        populated.push({ table, count })
      } else {
        empty.push(table)
      }
    } catch (error) {
      empty.push(table)
    }
  }
  
  // Sort populated tables by count
  populated.sort((a, b) => b.count - a.count)
  
  console.log('\n✅ TOP POPULATED TABLES:')
  populated.slice(0, 10).forEach(p => {
    console.log(`  ${p.table}: ${p.count.toLocaleString()} records`)
  })
  
  console.log('\n❌ EMPTY TABLES:')
  empty.forEach(table => console.log(`  ${table}`))
  
  // Calculate percentages
  const dataImportRate = totalFiles > 0 ? (totalRecords / (totalFiles * 50)) * 100 : 0
  const tablePopulationRate = (populated.length / tables.length) * 100
  
  console.log('\n📊 SUMMARY METRICS:')
  console.log('=' .repeat(50))
  console.log(`Total Data Files Available: ${totalFiles}`)
  console.log(`Total Database Records: ${totalRecords.toLocaleString()}`)
  console.log(`Estimated Import Success: ${dataImportRate.toFixed(1)}%`)
  console.log(`Tables Populated: ${populated.length}/${tables.length} (${tablePopulationRate.toFixed(1)}%)`)
  
  console.log('\n🎯 KEY FINDINGS:')
  console.log('-' .repeat(30))
  
  if (empty.includes('property')) {
    console.log('❌ No property data imported (0 properties)')
  }
  
  if (empty.includes('areaDemographics')) {
    console.log('❌ No demographic data imported')
  }
  
  if (empty.includes('incomeData')) {
    console.log('❌ No income data imported')  
  }
  
  if (populated.find(p => p.table === 'fernandoMemory')?.count > 1000) {
    console.log('✅ Fernando-X training data is well populated')
  }
  
  if (populated.find(p => p.table === 'marketIntelligence')?.count > 100) {
    console.log('✅ Market intelligence data is available')
  }
  
  console.log('\n💡 URGENT ACTIONS NEEDED:')
  console.log('1. Import Data Process 5 files to populate demographic tables')
  console.log('2. Import Houston P-Data Excel files for property information')
  console.log('3. Verify HAR MLS data completeness')
  console.log('4. Check why some available CSV files were not imported')
  
  await prisma.$disconnect()
}

main().catch((error) => {
  console.error('Error running audit:', error)
  process.exit(1)
})