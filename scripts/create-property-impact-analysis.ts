#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Houston neighborhood approximate coordinates
const neighborhoodCoordinates: Record<string, { lat: number, lon: number }> = {
  'Downtown': { lat: 29.7604, lon: -95.3698 },
  'Midtown': { lat: 29.7373, lon: -95.3769 },
  'Montrose': { lat: 29.7425, lon: -95.3905 },
  'River Oaks': { lat: 29.7565, lon: -95.4191 },
  'Memorial': { lat: 29.7646, lon: -95.4561 },
  'Galleria': { lat: 29.7369, lon: -95.4613 },
  'Medical Center': { lat: 29.7080, lon: -95.3975 },
  'Energy Corridor': { lat: 29.7817, lon: -95.6371 },
  'The Woodlands': { lat: 30.1658, lon: -95.4613 },
  'Katy': { lat: 29.7858, lon: -95.8245 },
  'Sugar Land': { lat: 29.6197, lon: -95.6349 },
  'Pearland': { lat: 29.5636, lon: -95.2860 },
  'Downtown CBD': { lat: 29.7604, lon: -95.3698 },
  'Galleria/Uptown': { lat: 29.7369, lon: -95.4613 }
}

// Create a simple property impact summary
async function createPropertyImpactAnalysis() {
  console.log('📊 Creating Property Impact Analysis...')
  console.log('=' .repeat(60))
  
  try {
    // Get properties and projects by neighborhood
    const neighborhoodStats = await prisma.property.groupBy({
      by: ['neighborhood'],
      _count: { neighborhood: true },
      _avg: { listPrice: true }
    })
    
    const projectsByNeighborhood = await prisma.project.groupBy({
      by: ['neighborhood'],
      _count: { neighborhood: true }
    })
    
    // Create impact summary
    const impactSummary = []
    
    for (const area of neighborhoodStats) {
      if (!area.neighborhood) continue
      
      const projectCount = projectsByNeighborhood.find(
        p => p.neighborhood === area.neighborhood
      )?._count.neighborhood || 0
      
      // Simple impact calculation
      let valueImpact = 0
      if (projectCount >= 3) valueImpact = 0.12 // 12% increase
      else if (projectCount >= 2) valueImpact = 0.08 // 8% increase
      else if (projectCount >= 1) valueImpact = 0.05 // 5% increase
      
      const avgPrice = area._avg.listPrice || 0
      const projectedValue = avgPrice * (1 + valueImpact)
      
      impactSummary.push({
        neighborhood: area.neighborhood,
        propertyCount: area._count.neighborhood,
        projectCount: projectCount,
        avgPrice: avgPrice,
        valueImpact: valueImpact,
        projectedValue: projectedValue,
        potentialGain: projectedValue - avgPrice
      })
    }
    
    // Sort by potential gain
    impactSummary.sort((a, b) => b.potentialGain - a.potentialGain)
    
    console.log('\n📈 TOP 10 NEIGHBORHOODS BY DEVELOPMENT IMPACT:')
    console.log('─'.repeat(80))
    console.log('Neighborhood'.padEnd(25) + 
                'Properties'.padEnd(12) + 
                'Projects'.padEnd(10) + 
                'Avg Price'.padEnd(15) + 
                'Impact %'.padEnd(10) + 
                'Potential Gain')
    console.log('─'.repeat(80))
    
    impactSummary.slice(0, 10).forEach(area => {
      console.log(
        area.neighborhood.padEnd(25) +
        area.propertyCount.toString().padEnd(12) +
        area.projectCount.toString().padEnd(10) +
        `$${Math.round(area.avgPrice).toLocaleString()}`.padEnd(15) +
        `${(area.valueImpact * 100).toFixed(0)}%`.padEnd(10) +
        `$${Math.round(area.potentialGain).toLocaleString()}`
      )
    })
    
    // Update properties with simple flags
    console.log('\n🔧 Updating properties with development flags...')
    
    let flaggedCount = 0
    for (const area of impactSummary.filter(a => a.projectCount > 0)) {
      // Add feature flag to properties in neighborhoods with projects
      const updated = await prisma.property.updateMany({
        where: {
          neighborhood: area.neighborhood,
          features: {
            has: 'Near Development' 
          }
        },
        data: {
          features: {
            push: 'Near Development'
          }
        }
      })
      
      // For properties not yet flagged
      const properties = await prisma.property.findMany({
        where: {
          neighborhood: area.neighborhood,
          NOT: {
            features: {
              has: 'Near Development'
            }
          }
        }
      })
      
      for (const prop of properties) {
        await prisma.property.update({
          where: { id: prop.id },
          data: {
            features: {
              push: 'Near Development'
            }
          }
        })
        flaggedCount++
      }
    }
    
    console.log(`\n✅ Flagged ${flaggedCount} properties as "Near Development"`)
    
    // Create investment opportunity report
    const opportunities = await prisma.property.findMany({
      where: {
        AND: [
          { features: { has: 'Near Development' } },
          { listPrice: { lt: 500000 } },
          { propertyType: { in: ['Single Family', 'Townhouse', 'Land'] } }
        ]
      },
      orderBy: { listPrice: 'asc' },
      take: 20
    })
    
    console.log('\n💎 TOP 20 INVESTMENT OPPORTUNITIES (Under $500K Near Development):')
    console.log('─'.repeat(80))
    
    opportunities.forEach((prop, idx) => {
      console.log(`${idx + 1}. ${prop.address} (${prop.neighborhood}) - $${prop.listPrice?.toLocaleString() || 'N/A'}`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 PROPERTY-PROJECT RELATIONSHIP SUMMARY:')
    console.log(`✅ Total neighborhoods analyzed: ${impactSummary.length}`)
    console.log(`🏘️ Neighborhoods with active projects: ${impactSummary.filter(a => a.projectCount > 0).length}`)
    console.log(`🏠 Properties flagged near development: ${flaggedCount}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Error creating impact analysis:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createPropertyImpactAnalysis()