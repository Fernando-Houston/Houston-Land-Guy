#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Major Houston builders
const builders = [
  'Perry Homes', 'Lennar', 'DR Horton', 'Meritage Homes', 'Taylor Morrison',
  'Pulte Homes', 'David Weekley', 'Toll Brothers', 'Highland Homes', 'Coventry Homes',
  'Beazer Homes', 'Trendmaker Homes', 'Drees Homes', 'Ashton Woods', 'CastleRock Communities'
]

// New construction communities
const newCommunities = [
  { name: 'Bridgeland', area: 'Cypress', priceRange: [400000, 800000] },
  { name: 'Sienna', area: 'Missouri City', priceRange: [350000, 650000] },
  { name: 'Riverstone', area: 'Sugar Land', priceRange: [450000, 900000] },
  { name: 'Cross Creek Ranch', area: 'Fulshear', priceRange: [400000, 750000] },
  { name: 'Meridiana', area: 'Manvel', priceRange: [300000, 550000] },
  { name: 'Harvest Green', area: 'Richmond', priceRange: [350000, 600000] },
  { name: 'Pomona', area: 'Manvel', priceRange: [280000, 450000] },
  { name: 'Firethorne', area: 'Katy', priceRange: [350000, 650000] },
  { name: 'Towne Lake', area: 'Cypress', priceRange: [400000, 800000] },
  { name: 'The Groves', area: 'Humble', priceRange: [300000, 500000] }
]

// Home models and styles
const homeModels = [
  { style: 'Traditional', models: ['Heritage', 'Classic', 'Colonial', 'Estate'] },
  { style: 'Modern', models: ['Urban', 'Contemporary', 'Loft', 'Studio'] },
  { style: 'Mediterranean', models: ['Villa', 'Tuscan', 'Hacienda', 'Cortona'] },
  { style: 'Craftsman', models: ['Bungalow', 'Prairie', 'Lodge', 'Cottage'] },
  { style: 'Ranch', models: ['Texas Ranch', 'Hill Country', 'Rustic', 'Open Range'] }
]

// Premium upgrades and features
const premiumFeatures = [
  'Gourmet Kitchen Package',
  'Smart Home Technology',
  'Extended Covered Patio',
  'Game Room',
  'Media Room',
  'Study/Home Office',
  'Three-Car Garage',
  'Premium Flooring',
  'Upgraded Master Suite',
  'Outdoor Kitchen Prep'
]

function generateNewConstructionPresale(index: number) {
  const builder = builders[Math.floor(Math.random() * builders.length)]
  const community = newCommunities[Math.floor(Math.random() * newCommunities.length)]
  const homeStyle = homeModels[Math.floor(Math.random() * homeModels.length)]
  const model = homeStyle.models[Math.floor(Math.random() * homeStyle.models.length)]
  
  // Generate home details
  const bedrooms = 3 + Math.floor(Math.random() * 3) // 3-5 bedrooms
  const bathrooms = 2 + Math.floor(Math.random() * 2) // 2-3.5 bathrooms
  const stories = Math.random() > 0.3 ? 2 : 1
  const sqft = 2000 + Math.floor(Math.random() * 2500) // 2000-4500 sqft
  const garageSpaces = bedrooms >= 4 ? 3 : 2
  
  // Calculate price based on community and size
  const basePrice = community.priceRange[0] + 
    (sqft - 2000) * ((community.priceRange[1] - community.priceRange[0]) / 2500)
  
  // Add premium for certain builders
  const builderPremium = ['Toll Brothers', 'David Weekley', 'Highland Homes'].includes(builder) ? 1.15 : 1.0
  const finalPrice = Math.round(basePrice * builderPremium)
  
  // Generate lot details
  const lotNumber = 100 + Math.floor(Math.random() * 400)
  const streetNames = ['Oak', 'Elm', 'Maple', 'Cedar', 'Pine', 'Willow', 'Cypress', 'Magnolia']
  const streetTypes = ['Lane', 'Court', 'Drive', 'Way', 'Circle', 'Trail']
  const street = `${streetNames[Math.floor(Math.random() * streetNames.length)]} ${
    streetTypes[Math.floor(Math.random() * streetTypes.length)]}`
  
  // Select premium features (3-6 features)
  const featureCount = 3 + Math.floor(Math.random() * 4)
  const selectedFeatures = ['New Construction', 'Energy Star Certified', 'Builder Warranty']
  for (let i = 0; i < featureCount; i++) {
    const feature = premiumFeatures[Math.floor(Math.random() * premiumFeatures.length)]
    if (!selectedFeatures.includes(feature)) {
      selectedFeatures.push(feature)
    }
  }
  
  // Estimated completion date (3-9 months out)
  const completionMonths = 3 + Math.floor(Math.random() * 7)
  const completionDate = new Date()
  completionDate.setMonth(completionDate.getMonth() + completionMonths)
  
  // Property description
  const description = `${builder} presents the ${model} in ${community.name}! ` +
    `This ${stories}-story ${homeStyle.style} home features ${bedrooms} bedrooms, ${bathrooms} bathrooms, ` +
    `and ${sqft.toLocaleString()} sqft of thoughtfully designed living space. ` +
    `${garageSpaces}-car garage. Located in the master-planned community of ${community.name} in ${community.area}. ` +
    `Estimated completion: ${completionDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. ` +
    `${selectedFeatures.includes('Smart Home Technology') ? 'Smart home ready! ' : ''}` +
    `${selectedFeatures.includes('Gourmet Kitchen Package') ? 'Chef\'s kitchen included! ' : ''}` +
    `Still time to personalize selections at our design center.`
  
  return {
    address: `${lotNumber} ${street} (Lot ${lotNumber})`,
    neighborhood: community.name,
    city: community.area,
    state: 'TX',
    zipCode: '77000',
    propertyType: 'Single Family',
    propertySubType: 'New Construction',
    status: 'Pre-Sale',
    listPrice: finalPrice,
    pricePerSqft: Math.round(finalPrice / sqft),
    squareFeet: sqft,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    yearBuilt: new Date().getFullYear() + 1, // Next year
    stories: stories,
    parkingSpaces: garageSpaces,
    lotSize: 6000 + Math.floor(Math.random() * 4000), // 6000-10000 sqft lots
    features: selectedFeatures,
    county: 'Harris',
    listDate: new Date(),
    description: description
  }
}

async function importNewConstructionPresales() {
  console.log('🏗️ Starting New Construction Pre-Sales Import...')
  console.log('=' .repeat(60))
  
  let totalImported = 0
  const targetCount = 100 // Import 100 new construction pre-sales
  
  try {
    console.log(`🏠 Importing ${targetCount} new construction pre-sales...`)
    
    for (let i = 0; i < targetCount; i++) {
      const property = generateNewConstructionPresale(i)
      
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
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            yearBuilt: property.yearBuilt,
            stories: property.stories,
            parkingSpaces: property.parkingSpaces,
            lotSize: property.lotSize,
            features: property.features,
            county: property.county,
            listDate: property.listDate,
            lastModified: new Date()
          }
        })
        
        totalImported++
        
        if (totalImported % 20 === 0) {
          console.log(`   ✅ Imported ${totalImported} pre-sales...`)
        }
        
      } catch (error) {
        console.error(`   ❌ Error importing pre-sale ${i}:`, error)
      }
    }
    
    // Summary statistics
    const presaleCount = await prisma.property.count({
      where: {
        status: 'Pre-Sale'
      }
    })
    
    const avgPresalePrice = await prisma.property.aggregate({
      where: {
        status: 'Pre-Sale'
      },
      _avg: {
        listPrice: true,
        squareFeet: true
      }
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 NEW CONSTRUCTION PRE-SALES IMPORT SUMMARY:')
    console.log(`✅ Successfully imported: ${totalImported} pre-sales`)
    console.log(`🏗️ Total pre-sales in database: ${presaleCount}`)
    console.log(`💰 Average pre-sale price: $${avgPresalePrice._avg.listPrice?.toLocaleString() || 'N/A'}`)
    console.log(`📏 Average home size: ${Math.round(avgPresalePrice._avg.squareFeet || 0).toLocaleString()} sqft`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importNewConstructionPresales()