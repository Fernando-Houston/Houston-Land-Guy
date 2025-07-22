#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// High-value commercial property types
const commercialTypes = [
  'Office Building',
  'Medical Office',
  'Retail Center', 
  'Shopping Mall',
  'Industrial Complex',
  'Warehouse',
  'Data Center',
  'Hotel',
  'Mixed-Use Commercial',
  'Corporate Campus'
]

// Prime Houston commercial areas
const commercialAreas = [
  { name: 'Downtown CBD', multiplier: 1.5 },
  { name: 'Galleria/Uptown', multiplier: 1.4 },
  { name: 'Energy Corridor', multiplier: 1.3 },
  { name: 'Medical Center', multiplier: 1.3 },
  { name: 'Greenway Plaza', multiplier: 1.2 },
  { name: 'Westchase', multiplier: 1.0 },
  { name: 'Memorial City', multiplier: 1.1 },
  { name: 'The Woodlands', multiplier: 1.2 },
  { name: 'Sugar Land Town Square', multiplier: 1.1 },
  { name: 'Pearland Town Center', multiplier: 0.9 }
]

// Major Houston commercial streets
const commercialStreets = [
  'Post Oak Blvd', 'Westheimer Rd', 'San Felipe St', 'Memorial Dr',
  'Richmond Ave', 'Loop 610', 'Beltway 8', 'I-10 Frontage Rd',
  'Highway 290', 'FM 1960', 'Highway 6', 'Gulf Freeway'
]

function generateHighValueCommercial(index: number) {
  const type = commercialTypes[Math.floor(Math.random() * commercialTypes.length)]
  const area = commercialAreas[Math.floor(Math.random() * commercialAreas.length)]
  const street = commercialStreets[Math.floor(Math.random() * commercialStreets.length)]
  
  // Base values for high-value commercial
  const baseSqft = 25000 + Math.floor(Math.random() * 175000) // 25k-200k sqft
  const basePricePerSqft = 250 + Math.random() * 350 // $250-$600/sqft
  
  // Apply area multiplier
  const adjustedPrice = basePricePerSqft * area.multiplier
  const totalPrice = Math.round(baseSqft * adjustedPrice)
  
  // Ensure minimum $5M value
  const finalPrice = Math.max(5000000, totalPrice)
  
  // Generate building details
  const yearBuilt = type === 'Data Center' || type === 'Corporate Campus' 
    ? 2015 + Math.floor(Math.random() * 10) // Newer for tech
    : 1980 + Math.floor(Math.random() * 44) // Varied for others
    
  const stories = type === 'Warehouse' || type === 'Industrial Complex'
    ? 1
    : type === 'Office Building' || type === 'Hotel'
    ? 5 + Math.floor(Math.random() * 25) // 5-30 stories
    : 1 + Math.floor(Math.random() * 4) // 1-5 stories
    
  const parkingSpaces = Math.floor(baseSqft / 250) // 1 space per 250 sqft
  
  // Generate features based on property type
  const features = []
  if (type.includes('Office')) {
    features.push('Executive Suites', 'Conference Center', 'Fitness Center', 'Cafeteria')
  }
  if (type === 'Retail Center' || type === 'Shopping Mall') {
    features.push('Anchor Tenants', 'Food Court', 'Ample Parking', 'High Visibility')
  }
  if (type === 'Industrial Complex' || type === 'Warehouse') {
    features.push('Loading Docks', 'High Ceilings', 'Truck Court', 'Rail Access')
  }
  if (type === 'Hotel') {
    features.push('Business Center', 'Pool', 'Restaurant', 'Meeting Rooms')
  }
  if (type === 'Data Center') {
    features.push('Redundant Power', 'Advanced Cooling', '24/7 Security', 'Fiber Connectivity')
  }
  
  return {
    address: `${10000 + Math.floor(Math.random() * 20000)} ${street}`,
    neighborhood: area.name,
    city: 'Houston',
    state: 'TX',
    zipCode: '77000',
    propertyType: type,
    propertySubType: 'Commercial Investment',
    status: Math.random() > 0.3 ? 'For Sale' : 'Under Contract',
    listPrice: finalPrice,
    pricePerSqft: Math.round(finalPrice / baseSqft),
    squareFeet: baseSqft,
    lotSize: baseSqft * (1.5 + Math.random() * 2), // 1.5-3.5x building size
    yearBuilt: yearBuilt,
    stories: stories,
    parkingSpaces: parkingSpaces,
    features: features,
    county: 'Harris',
    listDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000) // Within 180 days
  }
}

async function importHighValueCommercial() {
  console.log('🏢 Starting High-Value Commercial Property Import...')
  console.log('=' .repeat(60))
  
  let totalImported = 0
  const targetCount = 120 // Import 120 high-value commercial properties
  
  try {
    console.log(`💰 Importing ${targetCount} commercial properties ($5M+ each)...`)
    
    for (let i = 0; i < targetCount; i++) {
      const property = generateHighValueCommercial(i)
      
      try {
        await prisma.property.create({
          data: {
            address: property.address,
            neighborhood: property.neighborhood,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            propertyType: property.propertyType,
            propertySubType: property.propertySubType,
            status: property.status,
            listPrice: property.listPrice,
            pricePerSqft: property.pricePerSqft,
            squareFeet: property.squareFeet,
            lotSize: property.lotSize,
            yearBuilt: property.yearBuilt,
            stories: property.stories,
            parkingSpaces: property.parkingSpaces,
            features: property.features,
            county: property.county,
            listDate: property.listDate,
            lastModified: new Date()
          }
        })
        
        totalImported++
        
        if (totalImported % 20 === 0) {
          console.log(`   ✅ Imported ${totalImported} properties...`)
        }
        
      } catch (error) {
        console.error(`   ❌ Error importing property ${i}:`, error)
      }
    }
    
    // Summary statistics
    const commercialCount = await prisma.property.count({
      where: {
        listPrice: { gte: 5000000 }
      }
    })
    
    const avgPrice = await prisma.property.aggregate({
      where: {
        listPrice: { gte: 5000000 }
      },
      _avg: {
        listPrice: true
      }
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 HIGH-VALUE COMMERCIAL IMPORT SUMMARY:')
    console.log(`✅ Successfully imported: ${totalImported} properties`)
    console.log(`🏢 Total $5M+ commercial properties: ${commercialCount}`)
    console.log(`💰 Average price: $${avgPrice._avg.listPrice?.toLocaleString() || 'N/A'}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importHighValueCommercial()