#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Distressed property types and conditions
const distressTypes = [
  { status: 'Foreclosure', discount: 0.7 },
  { status: 'Pre-Foreclosure', discount: 0.8 },
  { status: 'Bank Owned (REO)', discount: 0.75 },
  { status: 'Short Sale', discount: 0.85 },
  { status: 'Tax Lien', discount: 0.65 },
  { status: 'Auction', discount: 0.6 }
]

// Areas with higher foreclosure activity
const distressedAreas = [
  { name: 'Greenspoint', basePrice: 165000, rate: 'High' },
  { name: 'Sunnyside', basePrice: 125000, rate: 'High' },
  { name: 'Third Ward', basePrice: 145000, rate: 'Medium' },
  { name: 'Fifth Ward', basePrice: 135000, rate: 'High' },
  { name: 'Acres Homes', basePrice: 155000, rate: 'Medium' },
  { name: 'Alief', basePrice: 185000, rate: 'Medium' },
  { name: 'Sharpstown', basePrice: 195000, rate: 'Medium' },
  { name: 'Gulfton', basePrice: 175000, rate: 'Medium' },
  { name: 'Northeast Houston', basePrice: 165000, rate: 'High' },
  { name: 'South Houston', basePrice: 155000, rate: 'Medium' }
]

// Common issues with distressed properties
const propertyIssues = [
  'Deferred Maintenance',
  'Foundation Issues',
  'Roof Damage',
  'HVAC Needs Replacement',
  'Plumbing Issues',
  'Electrical Updates Needed',
  'Flood Damage History',
  'Code Violations'
]

function generateDistressedProperty(index: number) {
  const distressType = distressTypes[Math.floor(Math.random() * distressTypes.length)]
  const area = distressedAreas[Math.floor(Math.random() * distressedAreas.length)]
  
  // Property details
  const propertyType = Math.random() > 0.7 ? 'Single Family' : 
                      Math.random() > 0.5 ? 'Townhouse' : 'Condo'
  const bedrooms = 2 + Math.floor(Math.random() * 3) // 2-4 bedrooms
  const bathrooms = 1 + Math.floor(Math.random() * 2.5) // 1-3 bathrooms
  const sqft = 900 + Math.floor(Math.random() * 1600) // 900-2500 sqft
  const yearBuilt = 1960 + Math.floor(Math.random() * 40) // 1960-2000
  const lotSize = propertyType === 'Single Family' ? 5000 + Math.floor(Math.random() * 5000) : 0
  
  // Calculate distressed price
  const marketValue = area.basePrice * (0.9 + Math.random() * 0.3) // ±15% variation
  const distressedPrice = Math.round(marketValue * distressType.discount)
  
  // Generate specific issues (1-3 issues per property)
  const issueCount = 1 + Math.floor(Math.random() * 3)
  const selectedIssues = []
  for (let i = 0; i < issueCount; i++) {
    const issue = propertyIssues[Math.floor(Math.random() * propertyIssues.length)]
    if (!selectedIssues.includes(issue)) {
      selectedIssues.push(issue)
    }
  }
  
  // Features (limited due to distressed condition)
  const features = ['As-Is Sale', 'Cash Only']
  if (distressType.status === 'Auction') {
    features.push('Online Auction Available')
  }
  if (Math.random() > 0.7) {
    features.push('Investor Special')
  }
  
  // Generate address
  const streetNumber = 100 + Math.floor(Math.random() * 9900)
  const streets = ['MLK Blvd', 'Scott St', 'Cullen Blvd', 'Almeda Rd', 'Telephone Rd', 
                  'Bellfort Ave', 'Bissonnet St', 'Fondren Rd', 'Antoine Dr', 'Jensen Dr']
  const street = streets[Math.floor(Math.random() * streets.length)]
  
  // Property description
  const description = `${distressType.status} opportunity! ${bedrooms} bed/${bathrooms} bath ${propertyType.toLowerCase()} ` +
    `in ${area.name}. Property needs work - ${selectedIssues.join(', ').toLowerCase()}. ` +
    `${distressedPrice < marketValue * 0.7 ? 'Priced for quick sale! ' : ''}` +
    `${features.includes('Investor Special') ? 'Great investment opportunity for fix & flip or rental. ' : ''}` +
    `${distressType.status === 'Auction' ? 'Bidding starts at ' + Math.round(distressedPrice * 0.8).toLocaleString() + '. ' : ''}` +
    `Estimated ARV (After Repair Value): $${Math.round(marketValue * 1.1).toLocaleString()}.`
  
  return {
    address: `${streetNumber} ${street}`,
    neighborhood: area.name,
    city: 'Houston',
    state: 'TX',
    zipCode: '77000',
    propertyType: propertyType,
    propertySubType: 'Distressed Sale',
    status: distressType.status,
    listPrice: distressedPrice,
    pricePerSqft: Math.round(distressedPrice / sqft),
    taxAssessedValue: Math.round(marketValue * 0.8), // Usually below market
    squareFeet: sqft,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    yearBuilt: yearBuilt,
    lotSize: lotSize,
    features: features.concat(selectedIssues),
    county: 'Harris',
    listDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Within 60 days
    description: description
  }
}

async function importDistressedProperties() {
  console.log('🏚️ Starting Distressed/Foreclosure Properties Import...')
  console.log('=' .repeat(60))
  
  let totalImported = 0
  const targetCount = 80 // Import 80 distressed properties
  
  try {
    console.log(`💔 Importing ${targetCount} distressed properties...`)
    
    for (let i = 0; i < targetCount; i++) {
      const property = generateDistressedProperty(i)
      
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
            taxAssessedValue: property.taxAssessedValue,
            squareFeet: property.squareFeet,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            yearBuilt: property.yearBuilt,
            lotSize: property.lotSize,
            features: property.features,
            county: property.county,
            listDate: property.listDate,
            lastModified: new Date()
          }
        })
        
        totalImported++
        
        if (totalImported % 20 === 0) {
          console.log(`   ✅ Imported ${totalImported} distressed properties...`)
        }
        
      } catch (error) {
        console.error(`   ❌ Error importing distressed property ${i}:`, error)
      }
    }
    
    // Summary statistics
    const distressedCount = await prisma.property.count({
      where: {
        OR: [
          { status: { contains: 'Foreclosure' } },
          { status: 'Bank Owned (REO)' },
          { status: 'Short Sale' },
          { status: 'Tax Lien' },
          { status: 'Auction' }
        ]
      }
    })
    
    const avgDistressedPrice = await prisma.property.aggregate({
      where: {
        propertySubType: 'Distressed Sale'
      },
      _avg: {
        listPrice: true
      }
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 DISTRESSED PROPERTIES IMPORT SUMMARY:')
    console.log(`✅ Successfully imported: ${totalImported} distressed properties`)
    console.log(`🏚️ Total distressed properties in database: ${distressedCount}`)
    console.log(`💰 Average distressed price: $${avgDistressedPrice._avg.listPrice?.toLocaleString() || 'N/A'}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importDistressedProperties()