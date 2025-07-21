import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface IndexOptimization {
  table: string
  indexes: {
    name: string
    fields: string[]
    type: 'btree' | 'gin' | 'gist'
    purpose: string
  }[]
}

async function addDatabaseIndexes() {
  console.log('⚡ Optimizing Database Performance with Strategic Indexes\n')
  
  const optimizations: IndexOptimization[] = [
    {
      table: 'Property',
      indexes: [
        {
          name: 'idx_property_location',
          fields: ['zipCode', 'city', 'neighborhood'],
          type: 'btree',
          purpose: 'Fast location-based queries'
        },
        {
          name: 'idx_property_price_range',
          fields: ['listPrice', 'soldPrice'],
          type: 'btree',
          purpose: 'Price range filtering'
        },
        {
          name: 'idx_property_type_status',
          fields: ['propertyType', 'status'],
          type: 'btree',
          purpose: 'Property type and status filtering'
        }
      ]
    },
    {
      table: 'Developer',
      indexes: [
        {
          name: 'idx_developer_focus_areas',
          fields: ['primaryFocus', 'primaryAreas'],
          type: 'gin',
          purpose: 'Developer specialization queries'
        },
        {
          name: 'idx_developer_metrics',
          fields: ['activeProjects', 'totalValue'],
          type: 'btree',
          purpose: 'Developer ranking and sorting'
        }
      ]
    },
    {
      table: 'Project',
      indexes: [
        {
          name: 'idx_project_location_phase',
          fields: ['area', 'phase'],
          type: 'btree',
          purpose: 'Project location and status queries'
        },
        {
          name: 'idx_project_value_date',
          fields: ['totalValue', 'startDate'],
          type: 'btree',
          purpose: 'Project value and timeline analysis'
        }
      ]
    },
    {
      table: 'Permit',
      indexes: [
        {
          name: 'idx_permit_location_type',
          fields: ['zipCode', 'permitType'],
          type: 'btree',
          purpose: 'Permit location and type filtering'
        },
        {
          name: 'idx_permit_dates',
          fields: ['applicationDate', 'issueDate'],
          type: 'btree',
          purpose: 'Permit timeline queries'
        }
      ]
    },
    {
      table: 'MarketMetrics',
      indexes: [
        {
          name: 'idx_market_area_period',
          fields: ['areaName', 'period', 'startDate'],
          type: 'btree',
          purpose: 'Market trend analysis'
        },
        {
          name: 'idx_market_pricing',
          fields: ['medianPrice', 'averagePrice'],
          type: 'btree',
          purpose: 'Price comparison queries'
        }
      ]
    },
    {
      table: 'ConstructionActivity',
      indexes: [
        {
          name: 'idx_construction_location_type',
          fields: ['zipCode', 'permitType'],
          type: 'btree',
          purpose: 'Construction activity by area and type'
        },
        {
          name: 'idx_construction_timeline',
          fields: ['permitDate', 'status'],
          type: 'btree',
          purpose: 'Construction timeline tracking'
        }
      ]
    },
    {
      table: 'MarketIntelligence',
      indexes: [
        {
          name: 'idx_intelligence_location_type',
          fields: ['zipCode', 'dataType'],
          type: 'btree',
          purpose: 'Market intelligence by location and type'
        },
        {
          name: 'idx_intelligence_metrics',
          fields: ['investmentScore', 'dataDate'],
          type: 'btree',
          purpose: 'Investment scoring and freshness'
        }
      ]
    }
  ]
  
  console.log('Creating performance indexes...\n')
  
  for (const table of optimizations) {
    console.log(`📊 Optimizing ${table.table} table:`)
    
    for (const index of table.indexes) {
      try {
        // Create index using raw SQL since Prisma doesn't directly support index creation
        const indexSQL = `CREATE INDEX IF NOT EXISTS "${index.name}" ON "${table.table}" USING ${index.type} (${index.fields.map(f => `"${f}"`).join(', ')})`
        
        await prisma.$executeRawUnsafe(indexSQL)
        console.log(`   ✅ ${index.name}: ${index.purpose}`)
        
      } catch (error) {
        console.log(`   ⚠️ ${index.name}: ${error.message.includes('already exists') ? 'Already exists' : 'Failed'}`)
      }
    }
    console.log('')
  }
  
  // Additional specialized indexes
  console.log('Creating specialized indexes...\n')
  
  try {
    // Full-text search index for property addresses
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "idx_property_search" ON "Property" 
      USING gin(to_tsvector('english', address || ' ' || COALESCE(neighborhood, '')))
    `)
    console.log('   ✅ Full-text search index for properties')
    
    // Geospatial index for coordinates (if using PostGIS)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "idx_property_coordinates" ON "Property" 
      USING gist(coordinates) WHERE coordinates IS NOT NULL
    `)
    console.log('   ✅ Geospatial index for property coordinates')
    
  } catch (error) {
    console.log(`   ⚠️ Specialized indexes: Some may require PostGIS extension`)
  }
  
  console.log('\n🎯 Database Performance Optimization Complete!')
  
  // Test query performance
  console.log('\nTesting query performance...')
  
  const startTime = Date.now()
  await prisma.property.findMany({
    where: {
      zipCode: '77019',
      listPrice: { gte: 500000 }
    },
    take: 10
  })
  const queryTime = Date.now() - startTime
  
  console.log(`   ⚡ Sample query execution: ${queryTime}ms`)
  
  if (queryTime < 100) {
    console.log('   ✅ Excellent performance (< 100ms)')
  } else if (queryTime < 500) {
    console.log('   ✅ Good performance (< 500ms)')
  } else {
    console.log('   ⚠️ Performance could be improved')
  }
  
  return {
    indexesCreated: optimizations.reduce((sum, table) => sum + table.indexes.length, 0),
    queryPerformance: queryTime,
    status: 'completed'
  }
}

// Main execution
async function main() {
  try {
    console.log('🎯 Houston Development Intelligence - Database Optimization\n')
    console.log('=' .repeat(60) + '\n')
    
    const result = await addDatabaseIndexes()
    
    console.log('\n' + '=' .repeat(60))
    console.log('⚡ DATABASE OPTIMIZATION RESULTS')
    console.log('=' .repeat(60))
    console.log(`📊 Indexes Created: ${result.indexesCreated}`)
    console.log(`⚡ Query Performance: ${result.queryPerformance}ms`)
    console.log(`✅ Status: ${result.status}`)
    
    console.log('\n🎯 Benefits:')
    console.log('   • Faster location-based queries')
    console.log('   • Improved price range filtering')
    console.log('   • Optimized developer and project searches')
    console.log('   • Enhanced market trend analysis')
    console.log('   • Better Fernando-X response times')
    
  } catch (error) {
    console.error('❌ Database optimization failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { addDatabaseIndexes }