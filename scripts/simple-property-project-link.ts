#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function simplePropertyProjectLink() {
  console.log('🔗 Linking Properties to Projects by Area...')
  console.log('=' .repeat(60))
  
  try {
    // Get all projects
    const projects = await prisma.project.findMany()
    console.log(`📊 Found ${projects.length} projects`)
    
    // Group projects by area
    const projectsByArea: Record<string, any[]> = {}
    projects.forEach(project => {
      const area = project.area || 'Unknown'
      if (!projectsByArea[area]) {
        projectsByArea[area] = []
      }
      projectsByArea[area].push(project)
    })
    
    console.log(`📍 Projects found in ${Object.keys(projectsByArea).length} areas`)
    
    // Update properties with development flags
    let totalFlagged = 0
    
    for (const [area, areaProjects] of Object.entries(projectsByArea)) {
      // Find properties in matching neighborhoods
      const matchingProperties = await prisma.property.findMany({
        where: {
          OR: [
            { neighborhood: { contains: area } },
            { city: { contains: area } }
          ]
        }
      })
      
      console.log(`\n🏘️ ${area}: ${areaProjects.length} projects, ${matchingProperties.length} properties`)
      
      // Flag properties near development
      for (const property of matchingProperties) {
        const currentFeatures = property.features || []
        
        if (!currentFeatures.includes('Near Development')) {
          await prisma.property.update({
            where: { id: property.id },
            data: {
              features: [...currentFeatures, 'Near Development']
            }
          })
          totalFlagged++
        }
      }
    }
    
    // Create investment opportunity report
    console.log('\n📈 INVESTMENT OPPORTUNITY ANALYSIS:')
    console.log('─'.repeat(60))
    
    // Find best opportunities (low price + near development)
    const opportunities = await prisma.property.findMany({
      where: {
        AND: [
          { features: { has: 'Near Development' } },
          { listPrice: { gt: 0, lt: 300000 } }
        ]
      },
      orderBy: { listPrice: 'asc' },
      take: 20
    })
    
    console.log('\n💎 TOP 20 AFFORDABLE PROPERTIES NEAR DEVELOPMENT:')
    opportunities.forEach((prop, idx) => {
      console.log(`${idx + 1}. $${prop.listPrice?.toLocaleString()} - ${prop.address} (${prop.neighborhood || prop.city})`)
    })
    
    // Summary statistics
    const developmentProperties = await prisma.property.count({
      where: {
        features: { has: 'Near Development' }
      }
    })
    
    const avgPriceNearDev = await prisma.property.aggregate({
      where: {
        features: { has: 'Near Development' },
        listPrice: { gt: 0 }
      },
      _avg: { listPrice: true }
    })
    
    const avgPriceNotNearDev = await prisma.property.aggregate({
      where: {
        NOT: { features: { has: 'Near Development' } },
        listPrice: { gt: 0 }
      },
      _avg: { listPrice: true }
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 PROPERTY-PROJECT RELATIONSHIP SUMMARY:')
    console.log(`✅ Properties flagged near development: ${totalFlagged}`)
    console.log(`🏠 Total properties near development: ${developmentProperties}`)
    console.log(`💰 Avg price near development: $${avgPriceNearDev._avg.listPrice?.toLocaleString() || 'N/A'}`)
    console.log(`💰 Avg price NOT near development: $${avgPriceNotNearDev._avg.listPrice?.toLocaleString() || 'N/A'}`)
    
    const priceDiff = (avgPriceNearDev._avg.listPrice || 0) - (avgPriceNotNearDev._avg.listPrice || 0)
    console.log(`📈 Development premium: $${Math.abs(priceDiff).toLocaleString()} (${priceDiff > 0 ? '+' : ''}${((priceDiff / (avgPriceNotNearDev._avg.listPrice || 1)) * 100).toFixed(1)}%)`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

simplePropertyProjectLink()