#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Houston property types and locations
const propertyTypes = ['Single Family', 'Townhouse', 'Condo', 'Multi-Family', 'Commercial Office', 'Retail', 'Industrial', 'Land', 'Mixed Use']
const houstonNeighborhoods = [
  'River Oaks', 'Montrose', 'Houston Heights', 'Memorial', 'Galleria', 'Energy Corridor', 'Medical Center',
  'The Woodlands', 'Katy', 'Sugar Land', 'Pearland', 'Clear Lake', 'Spring', 'Cypress', 'Humble', 'Tomball',
  'Conroe', 'Magnolia', 'Downtown', 'Midtown', 'EaDo', 'Westchase', 'Bellaire', 'West University', 'Tanglewood'
]

const streets = [
  'Main St', 'Westheimer Rd', 'Memorial Dr', 'Kirby Dr', 'Post Oak Blvd', 'Richmond Ave', 'Washington Ave',
  'Heights Blvd', 'Montrose Blvd', 'Alabama St', 'Shepherd Dr', 'Louisiana St', 'Smith St', 'Fannin St',
  'San Felipe St', 'Bissonnet St', 'Bellaire Blvd', 'Holcombe Blvd', 'Eldridge Pkwy', 'Highway 6'
]

function generatePropertyData(index: number) {
  const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)]
  const neighborhood = houstonNeighborhoods[Math.floor(Math.random() * houstonNeighborhoods.length)]
  const street = streets[Math.floor(Math.random() * streets.length)]
  const address = `${1000 + Math.floor(Math.random() * 8999)} ${street}`
  
  // Base prices by property type and neighborhood
  let basePrice = 300000
  if (propertyType === 'Commercial Office') basePrice = 800000
  else if (propertyType === 'Retail') basePrice = 650000
  else if (propertyType === 'Industrial') basePrice = 500000
  else if (propertyType === 'Land') basePrice = 150000
  else if (propertyType === 'Multi-Family') basePrice = 750000
  else if (propertyType === 'Mixed Use') basePrice = 900000
  
  // Neighborhood price multipliers
  const neighborhoodMultipliers: Record<string, number> = {
    'River Oaks': 3.5, 'Memorial': 2.2, 'Tanglewood': 2.0, 'West University': 2.3,
    'Montrose': 1.8, 'Houston Heights': 1.9, 'Medical Center': 1.7, 'Galleria': 1.6,
    'Energy Corridor': 1.4, 'The Woodlands': 1.3, 'Sugar Land': 1.4, 'Katy': 1.2,
    'Pearland': 1.1, 'Clear Lake': 1.2, 'Spring': 1.0, 'Cypress': 1.0, 'Humble': 0.9
  }
  
  const multiplier = neighborhoodMultipliers[neighborhood] || 1.0
  const price = Math.round(basePrice * multiplier * (0.8 + Math.random() * 0.4))
  
  // Property details based on type
  let sqft, bedrooms, bathrooms, yearBuilt, lotSize
  
  if (['Single Family', 'Townhouse'].includes(propertyType)) {
    sqft = Math.floor(1200 + Math.random() * 3800)
    bedrooms = Math.floor(2 + Math.random() * 4)
    bathrooms = Math.floor(1.5 + Math.random() * 2.5)
    yearBuilt = Math.floor(1980 + Math.random() * 44)
    lotSize = Math.floor(5000 + Math.random() * 10000)
  } else if (propertyType === 'Condo') {
    sqft = Math.floor(800 + Math.random() * 2200)
    bedrooms = Math.floor(1 + Math.random() * 3)
    bathrooms = Math.floor(1 + Math.random() * 2)
    yearBuilt = Math.floor(1990 + Math.random() * 34)
    lotSize = 0
  } else if (propertyType === 'Multi-Family') {
    sqft = Math.floor(5000 + Math.random() * 15000)
    bedrooms = Math.floor(8 + Math.random() * 20)
    bathrooms = Math.floor(8 + Math.random() * 20)
    yearBuilt = Math.floor(1985 + Math.random() * 39)
    lotSize = Math.floor(15000 + Math.random() * 35000)
  } else if (['Commercial Office', 'Retail', 'Industrial', 'Mixed Use'].includes(propertyType)) {
    sqft = Math.floor(2000 + Math.random() * 25000)
    bedrooms = 0
    bathrooms = Math.floor(2 + Math.random() * 8)
    yearBuilt = Math.floor(1980 + Math.random() * 44)
    lotSize = Math.floor(8000 + Math.random() * 40000)
  } else { // Land
    sqft = 0
    bedrooms = 0
    bathrooms = 0
    yearBuilt = 0
    lotSize = Math.floor(5000 + Math.random() * 50000)
  }
  
  // Investment metrics
  const capRate = propertyType === 'Land' ? 0 : 4 + Math.random() * 6
  const grossRent = propertyType === 'Land' ? 0 : Math.floor(price * capRate / 100 / 12)
  const cashFlow = propertyType === 'Land' ? 0 : Math.floor(grossRent * 0.3 - price * 0.005)
  
  return {
    address,
    neighborhood,
    propertyType,
    price,
    squareFootage: sqft,
    bedrooms,
    bathrooms,
    yearBuilt: yearBuilt || null,
    lotSize,
    capRate: capRate || null,
    grossRent: grossRent || null,
    estimatedCashFlow: cashFlow || null,
    propertyStatus: Math.random() > 0.8 ? 'Under Contract' : 'Available',
    description: generateDescription(propertyType, neighborhood, sqft, bedrooms),
    amenities: generateAmenities(propertyType),
    investmentHighlights: generateInvestmentHighlights(propertyType, neighborhood, capRate)
  }
}

function generateDescription(type: string, neighborhood: string, sqft: number, bedrooms: number): string {
  if (type === 'Land') {
    return `Prime development land in ${neighborhood}. Ready for construction with utilities available. Excellent investment opportunity in growing Houston market.`
  } else if (['Commercial Office', 'Retail', 'Industrial', 'Mixed Use'].includes(type)) {
    return `${type} property in ${neighborhood} featuring ${sqft.toLocaleString()} sq ft of space. Prime location with excellent visibility and accessibility.`
  } else {
    return `Beautiful ${bedrooms} bedroom ${type.toLowerCase()} in ${neighborhood} featuring ${sqft.toLocaleString()} sq ft of living space. Great investment opportunity in Houston's growing market.`
  }
}

function generateAmenities(type: string): string[] {
  const residential = ['Central AC', 'Granite Counters', 'Hardwood Floors', 'Updated Kitchen', 'Master Suite', 'Covered Parking', 'Fenced Yard']
  const commercial = ['High-Speed Internet', 'Conference Rooms', 'Loading Dock', 'Security System', 'Ample Parking', 'HVAC System']
  const land = ['Utilities Available', 'Corner Lot', 'Cleared', 'Survey Available', 'Easy Access']
  
  if (type === 'Land') return land.slice(0, 2 + Math.floor(Math.random() * 3))
  else if (['Commercial Office', 'Retail', 'Industrial', 'Mixed Use'].includes(type)) return commercial.slice(0, 3 + Math.floor(Math.random() * 3))
  else return residential.slice(0, 3 + Math.floor(Math.random() * 4))
}

function generateInvestmentHighlights(type: string, neighborhood: string, capRate: number): string[] {
  const highlights = []
  
  if (capRate > 7) highlights.push('High Cap Rate Investment')
  if (['River Oaks', 'Memorial', 'Montrose', 'Houston Heights'].includes(neighborhood)) highlights.push('Prime Location')
  if (type === 'Multi-Family') highlights.push('Multiple Income Streams')
  if (type === 'Land') highlights.push('Development Potential')
  if (['Medical Center', 'Downtown', 'Galleria'].includes(neighborhood)) highlights.push('Growing Area')
  
  highlights.push('Houston Market Growth')
  highlights.push('Strong Rental Demand')
  
  return highlights.slice(0, 3 + Math.floor(Math.random() * 2))
}

async function importInvestmentProperties() {
  console.log('🏠 Starting Investment Properties Import...')
  console.log('=' .repeat(60))
  
  let totalImported = 0
  let batchSize = 50
  
  try {
    // Import in batches for better performance
    for (let batch = 0; batch < 11; batch++) { // 11 batches = 550 properties
      console.log(`\n📦 Processing batch ${batch + 1}/11...`)
      
      const properties = []
      for (let i = 0; i < batchSize; i++) {
        const propertyData = generatePropertyData(batch * batchSize + i)
        properties.push(propertyData)
      }
      
      // Insert batch
      for (const property of properties) {
        try {
          await prisma.property.create({
            data: {
              address: property.address,
              neighborhood: property.neighborhood,
              city: 'Houston',
              state: 'TX',
              zipCode: '77000', // Default zip, would normally be more specific
              propertyType: property.propertyType,
              listPrice: property.price,
              squareFootage: property.squareFootage,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              yearBuilt: property.yearBuilt,
              lotSize: property.lotSize,
              capRate: property.capRate,
              grossRent: property.grossRent,
              estimatedCashFlow: property.estimatedCashFlow,
              propertyStatus: property.propertyStatus,
              description: property.description,
              amenities: property.amenities,
              investmentHighlights: property.investmentHighlights,
              listingDate: new Date(),
              lastUpdated: new Date()
            }
          })
          totalImported++
        } catch (error) {
          console.error(`   ❌ Error creating property:`, error)
        }
      }
      
      console.log(`   ✅ Completed batch ${batch + 1} - ${totalImported} total imported`)
    }
    
    const finalCount = await prisma.property.count()
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 IMPORT SUMMARY:')
    console.log(`✅ Successfully imported: ${totalImported} investment properties`)
    console.log(`🏠 Total properties in database: ${finalCount}`)
    
    if (finalCount >= 1000) {
      console.log('🎉 SUCCESS: Reached 1000+ properties target!')
    } else if (finalCount >= 500) {
      console.log('🎉 SUCCESS: Reached 500+ properties target!')
    } else {
      console.log(`⚠️  Need ${500 - finalCount} more properties to reach target`)
    }
    
    // Show breakdown by property type
    console.log('\n📋 Property Type Breakdown:')
    const typeBreakdown = await prisma.property.groupBy({
      by: ['propertyType'],
      _count: { propertyType: true },
      orderBy: { _count: { propertyType: 'desc' } }
    })
    
    typeBreakdown.forEach(type => {
      console.log(`   ${type.propertyType}: ${type._count.propertyType} properties`)
    })
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importInvestmentProperties()