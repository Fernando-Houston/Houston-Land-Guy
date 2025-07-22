#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Calculate distance between two coordinates (in miles)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Radius of Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

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
  'Clear Lake': { lat: 29.5693, lon: -95.0982 },
  'Spring': { lat: 30.0799, lon: -95.4172 },
  'Cypress': { lat: 29.9691, lon: -95.6972 },
  'Humble': { lat: 29.9988, lon: -95.2622 }
}

// Project impact calculations
function calculatePropertyImpact(propertyType: string, projectType: string, distance: number): {
  impactScore: number
  estimatedValueChange: number
  affectedByDevelopment: boolean
} {
  let impactScore = 0
  let estimatedValueChange = 0
  
  // Base impact decreases with distance
  const distanceFactor = distance <= 0.25 ? 1.0 :
                        distance <= 0.5 ? 0.8 :
                        distance <= 1.0 ? 0.5 : 0.2
  
  // Different project types have different impacts
  if (projectType.includes('Transit') || projectType.includes('Rail')) {
    impactScore = 8 * distanceFactor
    estimatedValueChange = distance <= 0.5 ? 0.15 : 0.08 // 15% or 8% increase
  } else if (projectType.includes('Park') || projectType.includes('Green')) {
    impactScore = 7 * distanceFactor
    estimatedValueChange = distance <= 0.5 ? 0.10 : 0.05 // 10% or 5% increase
  } else if (projectType.includes('Commercial') || projectType.includes('Mixed')) {
    impactScore = 6 * distanceFactor
    estimatedValueChange = distance <= 0.5 ? 0.08 : 0.03 // 8% or 3% increase
  } else if (projectType.includes('Highway') || projectType.includes('Freeway')) {
    impactScore = 4 * distanceFactor
    estimatedValueChange = distance <= 0.25 ? -0.05 : 0.02 // -5% if too close, else 2%
  } else if (projectType.includes('Industrial')) {
    impactScore = 3 * distanceFactor
    estimatedValueChange = distance <= 0.5 ? -0.10 : -0.03 // Negative impact
  } else {
    impactScore = 5 * distanceFactor
    estimatedValueChange = 0.05 * distanceFactor // Default 5% scaled by distance
  }
  
  const affectedByDevelopment = distance <= 1.0 && impactScore >= 3
  
  return { impactScore, estimatedValueChange, affectedByDevelopment }
}

// Calculate investment opportunity score
function calculateInvestmentScore(
  property: any,
  nearbyProjects: any[],
  avgValueChange: number
): number {
  let score = 5.0 // Base score
  
  // Price factor (lower price = higher opportunity)
  if (property.listPrice < 200000) score += 2
  else if (property.listPrice < 500000) score += 1
  
  // Development impact
  score += avgValueChange * 10 // Convert percentage to points
  
  // Property condition (distressed = opportunity)
  if (property.status?.includes('Foreclosure') || property.status?.includes('Distressed')) {
    score += 2
  }
  
  // Number of nearby projects
  if (nearbyProjects.length >= 3) score += 1.5
  else if (nearbyProjects.length >= 2) score += 1
  
  // Cap at 10
  return Math.min(Math.max(score, 0), 10)
}

async function createPropertyProjectRelationships() {
  console.log('🔗 Creating Property-Project Relationships...')
  console.log('=' .repeat(60))
  
  try {
    // Get all properties and projects
    const properties = await prisma.property.findMany({
      where: {
        neighborhood: { not: null }
      },
      take: 500 // Process first 500 properties for performance
    })
    
    const projects = await prisma.project.findMany()
    
    console.log(`📊 Processing ${properties.length} properties and ${projects.length} projects...`)
    
    let relationshipsCreated = 0
    let propertiesAffected = 0
    
    // Process each property
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      
      // Get property coordinates
      const propCoords = property.coordinates as any || 
        neighborhoodCoordinates[property.neighborhood || ''] ||
        neighborhoodCoordinates['Downtown'] // Default to downtown
      
      const nearbyProjects = []
      let totalValueChange = 0
      let affectedByAnyProject = false
      
      // Check each project
      for (const project of projects) {
        // Get project coordinates (use neighborhood if not specified)
        const projCoords = project.coordinates as any ||
          neighborhoodCoordinates[project.neighborhood || ''] ||
          neighborhoodCoordinates['Downtown']
        
        // Calculate distance
        const distance = calculateDistance(
          propCoords.lat, propCoords.lon,
          projCoords.lat, projCoords.lon
        )
        
        // If within 1 mile, calculate impact
        if (distance <= 1.0) {
          const impact = calculatePropertyImpact(
            property.propertyType,
            project.projectType,
            distance
          )
          
          if (impact.affectedByDevelopment) {
            nearbyProjects.push({
              projectId: project.id,
              projectName: project.name,
              distance: distance,
              impactScore: impact.impactScore,
              valueChange: impact.estimatedValueChange
            })
            
            totalValueChange += impact.estimatedValueChange
            affectedByAnyProject = true
            relationshipsCreated++
          }
        }
      }
      
      // Update property with development impact data
      if (affectedByAnyProject) {
        const avgValueChange = totalValueChange / nearbyProjects.length
        const investmentScore = calculateInvestmentScore(property, nearbyProjects, avgValueChange)
        
        // Create a metadata object with the impact data
        const developmentImpact = {
          affectedByDevelopment: true,
          nearbyProjects: nearbyProjects,
          estimatedValueChange: avgValueChange,
          investmentOpportunityScore: investmentScore,
          lastUpdated: new Date()
        }
        
        // Update property metadata
        await prisma.property.update({
          where: { id: property.id },
          data: {
            metadata: {
              ...(property.metadata as any || {}),
              developmentImpact
            }
          }
        })
        
        propertiesAffected++
      }
      
      if ((i + 1) % 50 === 0) {
        console.log(`   Processed ${i + 1} properties...`)
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 PROPERTY-PROJECT RELATIONSHIP SUMMARY:')
    console.log(`✅ Relationships created: ${relationshipsCreated}`)
    console.log(`🏠 Properties affected by development: ${propertiesAffected}`)
    console.log(`📈 Average properties per project: ${(propertiesAffected / projects.length).toFixed(1)}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Error creating relationships:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createPropertyProjectRelationships()