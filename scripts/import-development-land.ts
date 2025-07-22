#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Land development categories
const landCategories = [
  { type: 'Residential Development', zoning: 'R-1', density: 'Low' },
  { type: 'Multi-Family Development', zoning: 'R-3', density: 'High' },
  { type: 'Commercial Development', zoning: 'C-1', density: 'Medium' },
  { type: 'Mixed-Use Development', zoning: 'MU', density: 'High' },
  { type: 'Industrial Development', zoning: 'I-1', density: 'Low' },
  { type: 'Master Planned Community', zoning: 'PUD', density: 'Mixed' }
]

// Growth corridors and expansion areas
const developmentAreas = [
  { name: 'Grand Parkway North', growth: 'High', pricePerAcre: 125000 },
  { name: 'Grand Parkway South', growth: 'High', pricePerAcre: 110000 },
  { name: 'Highway 290 Corridor', growth: 'High', pricePerAcre: 95000 },
  { name: 'FM 1960 East', growth: 'Medium', pricePerAcre: 75000 },
  { name: 'Fort Bend County', growth: 'High', pricePerAcre: 85000 },
  { name: 'Montgomery County', growth: 'High', pricePerAcre: 70000 },
  { name: 'Baytown/Mont Belvieu', growth: 'Medium', pricePerAcre: 55000 },
  { name: 'Hockley/Waller', growth: 'Medium', pricePerAcre: 45000 },
  { name: 'Fulshear/Simonton', growth: 'High', pricePerAcre: 90000 },
  { name: 'League City/Dickinson', growth: 'Medium', pricePerAcre: 80000 }
]

// Major roads for land parcels
const majorRoads = [
  'FM 529', 'FM 1463', 'FM 1093', 'FM 359', 'FM 723',
  'Highway 6', 'Highway 36', 'Highway 90', 'Highway 146',
  'Spring Cypress Rd', 'Telge Rd', 'Mason Rd', 'Fry Rd'
]

function generateDevelopmentLand(index: number) {
  const category = landCategories[Math.floor(Math.random() * landCategories.length)]
  const area = developmentAreas[Math.floor(Math.random() * developmentAreas.length)]
  const road = majorRoads[Math.floor(Math.random() * majorRoads.length)]
  
  // Generate acreage based on development type
  let acreage: number
  if (category.type === 'Master Planned Community') {
    acreage = 100 + Math.floor(Math.random() * 900) // 100-1000 acres
  } else if (category.type === 'Industrial Development') {
    acreage = 20 + Math.floor(Math.random() * 180) // 20-200 acres
  } else if (category.type === 'Multi-Family Development') {
    acreage = 5 + Math.floor(Math.random() * 45) // 5-50 acres
  } else {
    acreage = 2 + Math.floor(Math.random() * 48) // 2-50 acres
  }
  
  // Calculate price with area adjustment
  const basePrice = area.pricePerAcre * (0.8 + Math.random() * 0.4) // ±20% variation
  const totalPrice = Math.round(acreage * basePrice)
  
  // Generate features based on land type
  const features = ['Utilities Available', 'Road Frontage']
  
  if (area.growth === 'High') {
    features.push('High Growth Area')
  }
  
  if (category.type.includes('Residential')) {
    features.push('Schools Nearby', 'Residential Zoning')
  } else if (category.type.includes('Commercial')) {
    features.push('High Traffic Count', 'Commercial Zoning')
  } else if (category.type.includes('Industrial')) {
    features.push('Rail Access Possible', 'Industrial Zoning')
  }
  
  if (acreage > 20) {
    features.push('Subdividable')
  }
  
  if (Math.random() > 0.5) {
    features.push('Corner Lot')
  }
  
  // Property description
  const description = `${acreage} acre ${category.type.toLowerCase()} site in ${area.name}. ` +
    `Zoned ${category.zoning} for ${category.density.toLowerCase()} density development. ` +
    `${area.growth} growth area with excellent access to ${road}. ` +
    `${features.includes('Utilities Available') ? 'All utilities available at site. ' : ''}` +
    `Perfect for ${category.type === 'Master Planned Community' ? 'large-scale residential development' : 
      category.type.includes('Multi-Family') ? 'apartments or townhomes' :
      category.type.includes('Commercial') ? 'retail or office development' :
      category.type.includes('Industrial') ? 'warehouse or distribution center' :
      'future development'}.`
  
  return {
    address: `0 ${road}`, // Undeveloped land typically has no street number
    neighborhood: area.name,
    city: 'Houston Metro Area',
    state: 'TX',
    zipCode: '77000',
    propertyType: 'Land',
    propertySubType: category.type,
    status: 'For Sale',
    listPrice: totalPrice,
    pricePerSqft: Math.round(totalPrice / (acreage * 43560)), // Convert to price per sqft
    lotSize: acreage * 43560, // Convert acres to sqft
    features: features,
    county: area.name.includes('Fort Bend') ? 'Fort Bend' : 
            area.name.includes('Montgomery') ? 'Montgomery' : 'Harris',
    listDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Within 90 days
    description: description
  }
}

async function importDevelopmentLand() {
  console.log('🏗️ Starting Development Land Parcels Import...')
  console.log('=' .repeat(60))
  
  let totalImported = 0
  const targetCount = 100 // Import 100 development land parcels
  
  try {
    console.log(`🌍 Importing ${targetCount} development land parcels...`)
    
    for (let i = 0; i < targetCount; i++) {
      const land = generateDevelopmentLand(i)
      
      try {
        await prisma.property.create({
          data: {
            address: land.address,
            neighborhood: land.neighborhood,
            city: land.city,
            state: land.state,
            zipCode: land.zipCode,
            propertyType: land.propertyType,
            propertySubType: land.propertySubType,
            status: land.status,
            listPrice: land.listPrice,
            pricePerSqft: land.pricePerSqft,
            lotSize: land.lotSize,
            features: land.features,
            county: land.county,
            listDate: land.listDate,
            lastModified: new Date()
          }
        })
        
        totalImported++
        
        if (totalImported % 20 === 0) {
          console.log(`   ✅ Imported ${totalImported} land parcels...`)
        }
        
      } catch (error) {
        console.error(`   ❌ Error importing land parcel ${i}:`, error)
      }
    }
    
    // Summary statistics
    const landCount = await prisma.property.count({
      where: {
        propertyType: 'Land'
      }
    })
    
    const avgLandPrice = await prisma.property.aggregate({
      where: {
        propertyType: 'Land',
        listPrice: { gt: 0 }
      },
      _avg: {
        listPrice: true,
        lotSize: true
      }
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 DEVELOPMENT LAND IMPORT SUMMARY:')
    console.log(`✅ Successfully imported: ${totalImported} land parcels`)
    console.log(`🌍 Total land parcels in database: ${landCount}`)
    console.log(`💰 Average land price: $${avgLandPrice._avg.listPrice?.toLocaleString() || 'N/A'}`)
    console.log(`📏 Average lot size: ${Math.round((avgLandPrice._avg.lotSize || 0) / 43560)} acres`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importDevelopmentLand()