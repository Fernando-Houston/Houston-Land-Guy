#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Houston neighborhoods with coordinates for realistic comparable sales
const houstonNeighborhoods = [
  { name: 'The Woodlands', lat: 30.1658, lng: -95.4613, avgPrice: 525000, priceVariance: 0.3, zipCode: '77380' },
  { name: 'Katy', lat: 29.7858, lng: -95.8245, avgPrice: 445000, priceVariance: 0.25, zipCode: '77494' },
  { name: 'Sugar Land', lat: 29.6197, lng: -95.6349, avgPrice: 485000, priceVariance: 0.28, zipCode: '77479' },
  { name: 'Memorial', lat: 29.7646, lng: -95.4561, avgPrice: 825000, priceVariance: 0.4, zipCode: '77024' },
  { name: 'River Oaks', lat: 29.7565, lng: -95.4191, avgPrice: 2200000, priceVariance: 0.6, zipCode: '77019' },
  { name: 'Pearland', lat: 29.5636, lng: -95.2860, avgPrice: 385000, priceVariance: 0.22, zipCode: '77584' },
  { name: 'Spring', lat: 30.0799, lng: -95.4171, avgPrice: 395000, priceVariance: 0.25, zipCode: '77373' },
  { name: 'Cypress', lat: 29.9691, lng: -95.6971, avgPrice: 405000, priceVariance: 0.24, zipCode: '77429' },
  { name: 'Heights', lat: 29.8011, lng: -95.4171, avgPrice: 675000, priceVariance: 0.35, zipCode: '77008' },
  { name: 'Montrose', lat: 29.7425, lng: -95.3905, avgPrice: 595000, priceVariance: 0.32, zipCode: '77006' },
  { name: 'Midtown', lat: 29.7373, lng: -95.3769, avgPrice: 525000, priceVariance: 0.3, zipCode: '77002' },
  { name: 'Galleria', lat: 29.7369, lng: -95.4613, avgPrice: 545000, priceVariance: 0.28, zipCode: '77056' },
  { name: 'Clear Lake', lat: 29.5693, lng: -95.0982, avgPrice: 375000, priceVariance: 0.2, zipCode: '77058' },
  { name: 'Energy Corridor', lat: 29.7355, lng: -95.6890, avgPrice: 495000, priceVariance: 0.26, zipCode: '77077' }
]

function generateComparableSales() {
  const comparables = []
  const now = new Date()
  
  for (const neighborhood of houstonNeighborhoods) {
    // Generate 15-25 comparable sales per neighborhood over the last 6 months
    const salesCount = Math.floor(Math.random() * 11) + 15
    
    for (let i = 0; i < salesCount; i++) {
      // Random date within last 6 months
      const daysBack = Math.floor(Math.random() * 180)
      const soldDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
      
      // Property characteristics
      const bedrooms = Math.floor(Math.random() * 4) + 2 // 2-5 bedrooms
      const bathrooms = Math.floor(Math.random() * 3) + 1.5 // 1.5-4.5 bathrooms
      const baseSqft = 1200 + (bedrooms - 2) * 400 // Base size by bedrooms
      const sqft = Math.floor(baseSqft + (Math.random() * 800 - 400)) // Add variance
      
      // Calculate price with neighborhood base + variance
      const priceVariation = (Math.random() * 2 - 1) * neighborhood.priceVariance
      const basePrice = neighborhood.avgPrice * (1 + priceVariation)
      const pricePerSqft = basePrice / sqft
      const soldPrice = Math.round(pricePerSqft * sqft)
      
      // Generate address within neighborhood bounds
      const latVariance = (Math.random() * 0.02 - 0.01) // ~1 mile variance
      const lngVariance = (Math.random() * 0.02 - 0.01)
      const lat = neighborhood.lat + latVariance
      const lng = neighborhood.lng + lngVariance
      
      // Generate realistic street addresses
      const streetNumbers = [Math.floor(Math.random() * 9000) + 1000]
      const streetNames = [
        'Oak Grove Dr', 'Maple Ridge Ln', 'Pine Valley Ct', 'Cedar Creek Way',
        'Willow Brook Dr', 'Sunset Hills Blvd', 'Garden Valley St', 'Spring Creek Dr',
        'Forest Glen Ln', 'River Oaks Dr', 'Park Ridge Ct', 'Highland Park Dr',
        'Meadow View Ln', 'Country Club Dr', 'Bay Area Blvd', 'Main Street'
      ]
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)]
      const address = `${streetNumbers[0]} ${streetName}, ${neighborhood.name}, TX`
      
      // Property types
      const propertyTypes = ['Single Family', 'Townhome', 'Condo']
      let propertyType = propertyTypes[0] // Default to Single Family
      if (bedrooms <= 3 && sqft < 1800) {
        propertyType = Math.random() > 0.6 ? 'Townhome' : 'Single Family'
      }
      if (neighborhood.name === 'Midtown' || neighborhood.name === 'Galleria') {
        propertyType = Math.random() > 0.4 ? 'Condo' : propertyType
      }
      
      // Features based on price and neighborhood
      const features = []
      if (soldPrice > 600000) features.push('Luxury Finishes', 'Granite Counters')
      if (soldPrice > 800000) features.push('Pool', 'Game Room')
      if (soldPrice > 1500000) features.push('Wine Cellar', 'Home Theater')
      if (neighborhood.name === 'River Oaks' || neighborhood.name === 'Memorial') {
        features.push('Gated Community', 'Chef\'s Kitchen')
      }
      
      comparables.push({
        address,
        zipCode: neighborhood.zipCode,
        soldPrice,
        listPrice: Math.round(soldPrice * (1 + Math.random() * 0.1 - 0.05)), // List vs sold variance
        soldDate,
        listDate: new Date(soldDate.getTime() - (Math.random() * 60 * 24 * 60 * 60 * 1000)), // Listed 0-60 days before sold
        sqft,
        bedrooms,
        bathrooms,
        propertyType,
        lat,
        lng,
        neighborhood: neighborhood.name,
        features,
        pricePerSqft: Math.round(soldPrice / sqft),
        daysOnMarket: Math.floor(Math.random() * 45) + 5, // 5-50 days on market
        yearBuilt: 1985 + Math.floor(Math.random() * 38), // 1985-2023
        lotSize: Math.round((0.15 + Math.random() * 0.35) * 43560) // 0.15-0.5 acres in sq ft
      })
    }
  }
  
  return comparables
}

async function importComparableSales() {
  console.log('🏠 Starting Comparable Sales Data Import...')
  console.log('=' .repeat(60))
  
  try {
    // Clear existing comparable sales
    console.log('🧹 Clearing existing comparable sales...')
    await prisma.property.deleteMany({
      where: {
        propertyType: {
          in: ['Single Family', 'Townhome', 'Condo']
        },
        soldDate: {
          not: null
        }
      }
    })
    
    // Generate and import new comparable sales
    const comparables = generateComparableSales()
    console.log(`📊 Generated ${comparables.length} comparable sales`)
    
    let importedCount = 0
    
    for (const comp of comparables) {
      try {
        await prisma.property.create({
          data: {
            address: comp.address,
            city: 'Houston',
            zipCode: comp.zipCode,
            listPrice: comp.listPrice,
            soldPrice: comp.soldPrice,
            listDate: comp.listDate,
            soldDate: comp.soldDate,
            squareFeet: comp.sqft,
            bedrooms: comp.bedrooms,
            bathrooms: comp.bathrooms,
            propertyType: comp.propertyType,
            latitude: comp.lat,
            longitude: comp.lng,
            neighborhood: comp.neighborhood,
            features: comp.features,
            yearBuilt: comp.yearBuilt,
            lotSize: comp.lotSize,
            description: `Beautiful ${comp.propertyType.toLowerCase()} in ${comp.neighborhood}. ${comp.features.join(', ')}. Recently sold for market analysis.`,
            status: 'sold',
            daysOnMarket: comp.daysOnMarket
          }
        })
        importedCount++
        
        if (importedCount % 50 === 0) {
          console.log(`📈 Imported ${importedCount} comparable sales...`)
        }
      } catch (error) {
        console.error(`❌ Error importing ${comp.address}:`, error)
      }
    }
    
    // Generate summary statistics
    const totalComparables = await prisma.property.count({
      where: {
        soldDate: { not: null }
      }
    })
    
    const avgPrice = await prisma.property.aggregate({
      where: {
        soldDate: { not: null },
        soldPrice: { not: null }
      },
      _avg: {
        soldPrice: true,
        squareFeet: true,
        daysOnMarket: true
      }
    })
    
    const priceRanges = await prisma.property.groupBy({
      by: ['neighborhood'],
      where: {
        soldDate: { not: null },
        soldPrice: { not: null }
      },
      _avg: {
        soldPrice: true
      },
      _count: {
        id: true
      }
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('🏠 COMPARABLE SALES IMPORT SUMMARY:')
    console.log(`✅ Successfully imported: ${importedCount} properties`)
    console.log(`📊 Total comparable sales in database: ${totalComparables}`)
    console.log(`💰 Average sold price: $${avgPrice._avg.soldPrice?.toLocaleString()}`)
    console.log(`📐 Average square feet: ${avgPrice._avg.squareFeet?.toLocaleString()}`)
    console.log(`⏰ Average days on market: ${avgPrice._avg.daysOnMarket}`)
    console.log(`🏘️  Neighborhoods covered: ${priceRanges.length}`)
    console.log('\nTop 5 Neighborhoods by Average Price:')
    
    priceRanges
      .sort((a, b) => (b._avg.soldPrice || 0) - (a._avg.soldPrice || 0))
      .slice(0, 5)
      .forEach((area, index) => {
        console.log(`   ${index + 1}. ${area.neighborhood}: $${area._avg.soldPrice?.toLocaleString()} (${area._count.id} sales)`)
      })
    
    console.log('\n🎯 Valuation API now has comprehensive comparable sales data!')
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importComparableSales()