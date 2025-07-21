#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface DataFolderInfo {
  name: string
  path: string
  csvCount: number
  excelCount: number
  totalFiles: number
  files: string[]
}

interface DatabaseTableInfo {
  tableName: string
  recordCount: number
  error?: string
}

interface AuditReport {
  timestamp: Date
  dataFolders: DataFolderInfo[]
  databaseTables: DatabaseTableInfo[]
  summary: {
    totalFilesAvailable: number
    totalRecordsInDatabase: number
    estimatedImportPercentage: number
  }
}

async function countFilesInFolder(folderPath: string): Promise<{ csvCount: number; excelCount: number; files: string[] }> {
  const files: string[] = []
  let csvCount = 0
  let excelCount = 0

  function scanDirectory(dir: string) {
    try {
      const items = fs.readdirSync(dir)
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath)
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase()
          if (ext === '.csv') {
            csvCount++
            files.push(fullPath)
          } else if (ext === '.xlsx' || ext === '.xls') {
            excelCount++
            files.push(fullPath)
          }
        }
      }
    } catch (error) {
      console.log(`Warning: Could not scan directory ${dir}:`, error)
    }
  }

  if (fs.existsSync(folderPath)) {
    scanDirectory(folderPath)
  }

  return { csvCount, excelCount, files }
}

async function getTableCount(tableName: string): Promise<DatabaseTableInfo> {
  try {
    const count = await (prisma as any)[tableName].count()
    return { tableName, recordCount: count }
  } catch (error) {
    return { 
      tableName, 
      recordCount: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

async function main() {
  console.log('🔍 COMPREHENSIVE DATA AUDIT - HOUSTON DEVELOPMENT INTELLIGENCE')
  console.log('=' .repeat(80))
  
  const dataFolders: DataFolderInfo[] = []
  
  // Define all data folders to check
  const foldersToCheck = [
    {
      name: 'Data Processing',
      path: './Core Agent Architecture -Webiste/Data Processing'
    },
    {
      name: 'Data Processing Part 2', 
      path: './Core Agent Architecture -Webiste/Data Processing Part 2'
    },
    {
      name: 'DataProcess 3',
      path: './Core Agent Architecture -Webiste/DataProcess 3'
    },
    {
      name: 'Data process 4',
      path: './Core Agent Architecture -Webiste/Data process 4'
    },
    {
      name: 'Data process 5',
      path: './Data process 5'
    },
    {
      name: 'Houston P-Data',
      path: './Core Agent Architecture -Webiste/HOuston Pdata'
    }
  ]

  // Count files in each folder
  console.log('\n📁 DATA FOLDER ANALYSIS:')
  console.log('-'.repeat(50))
  
  let totalFiles = 0
  for (const folder of foldersToCheck) {
    const { csvCount, excelCount, files } = await countFilesInFolder(folder.path)
    const totalFolderFiles = csvCount + excelCount
    totalFiles += totalFolderFiles
    
    dataFolders.push({
      name: folder.name,
      path: folder.path,
      csvCount,
      excelCount,
      totalFiles: totalFolderFiles,
      files
    })

    console.log(`\n${folder.name}:`)
    console.log(`  📄 CSV Files: ${csvCount}`)
    console.log(`  📊 Excel Files: ${excelCount}`)
    console.log(`  🗃️  Total Files: ${totalFolderFiles}`)
    
    if (totalFolderFiles > 0) {
      console.log(`  📝 Sample Files:`)
      files.slice(0, 3).forEach(file => {
        console.log(`    - ${path.basename(file)}`)
      })
      if (files.length > 3) {
        console.log(`    ... and ${files.length - 3} more`)
      }
    }
  }

  // Check database tables
  console.log('\n\n💾 DATABASE TABLE ANALYSIS:')
  console.log('-'.repeat(50))

  const tablesToCheck = [
    'property',
    'developer', 
    'project',
    'permit',
    'marketMetrics',
    'priceHistory',
    'marketAnalysis',
    'harMlsReport',
    'harNeighborhoodData',
    'constructionActivity',
    'marketIntelligence',
    'costAnalysis',
    'qualityOfLife',
    'rentalMarket',
    'employerDP5',
    'sTRMarket',
    'areaDemographics',
    'incomeData',
    'populationProjection',
    'economicIndicatorDP5',
    'migrationData',
    'educationMetrics',
    'constructionCostDP5',
    'fernandoMemory',
    'fernandoConversation',
    'fernandoInsight',
    'lead',
    'calculatorResult',
    'marketData'
  ]

  const databaseTables: DatabaseTableInfo[] = []
  let totalRecords = 0

  for (const table of tablesToCheck) {
    const tableInfo = await getTableCount(table)
    databaseTables.push(tableInfo)
    if (!tableInfo.error) {
      totalRecords += tableInfo.recordCount
    }
    
    if (tableInfo.error) {
      console.log(`❌ ${table}: ERROR - ${tableInfo.error}`)
    } else if (tableInfo.recordCount === 0) {
      console.log(`⚪ ${table}: ${tableInfo.recordCount} records`)
    } else if (tableInfo.recordCount < 100) {
      console.log(`🟡 ${table}: ${tableInfo.recordCount} records`)
    } else {
      console.log(`🟢 ${table}: ${tableInfo.recordCount} records`)
    }
  }

  // Calculate import percentage estimate
  const estimatedImportPercentage = totalFiles > 0 ? Math.round((totalRecords / (totalFiles * 50)) * 100) : 0 // Assuming ~50 records per file on average

  console.log('\n\n📊 SUMMARY REPORT:')
  console.log('='.repeat(50))
  console.log(`📄 Total Files Available: ${totalFiles}`)
  console.log(`💾 Total Database Records: ${totalRecords}`)
  console.log(`📈 Estimated Import Success: ${estimatedImportPercentage}%`)
  
  // Detailed folder breakdown
  console.log('\n📋 DETAILED FOLDER BREAKDOWN:')
  dataFolders.forEach(folder => {
    const importEstimate = folder.totalFiles > 0 ? Math.round((totalRecords / (folder.totalFiles * 50)) * 100) : 0
    console.log(`\n${folder.name}:`)
    console.log(`  Files: ${folder.totalFiles} (${folder.csvCount} CSV + ${folder.excelCount} Excel)`)
    console.log(`  Status: ${folder.totalFiles === 0 ? '❌ No data files' : folder.totalFiles < 5 ? '⚠️  Low data volume' : '✅ Good data volume'}`)
  })

  // Tables with most records
  const topTables = databaseTables
    .filter(t => !t.error && t.recordCount > 0)
    .sort((a, b) => b.recordCount - a.recordCount)
    .slice(0, 10)

  if (topTables.length > 0) {
    console.log('\n🏆 TOP POPULATED TABLES:')
    topTables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table.tableName}: ${table.recordCount.toLocaleString()} records`)
    })
  }

  // Tables with no records
  const emptyTables = databaseTables.filter(t => !t.error && t.recordCount === 0)
  if (emptyTables.length > 0) {
    console.log('\n⚠️  EMPTY TABLES:')
    emptyTables.forEach(table => {
      console.log(`  - ${table.tableName}`)
    })
  }

  console.log('\n✅ Audit Complete!')
  
  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error('❌ Audit failed:', e)
    process.exit(1)
  })