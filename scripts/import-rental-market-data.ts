#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Houston rental market data by neighborhood
const rentalMarketData = [
  // Premium neighborhoods
  { neighborhood: 'River Oaks', avgRent1BR: 2850, avgRent2BR: 4200, avgRent3BR: 6500, vacancyRate: 3.2, capRate: 4.8 },
  { neighborhood: 'Memorial', avgRent1BR: 2200, avgRent2BR: 3100, avgRent3BR: 4500, vacancyRate: 4.1, capRate: 5.2 },
  { neighborhood: 'West University', avgRent1BR: 2100, avgRent2BR: 2900, avgRent3BR: 4200, vacancyRate: 3.8, capRate: 5.0 },
  { neighborhood: 'Tanglewood', avgRent1BR: 1950, avgRent2BR: 2750, avgRent3BR: 3900, vacancyRate: 4.5, capRate: 5.3 },
  { neighborhood: 'Museum District', avgRent1BR: 1850, avgRent2BR: 2600, avgRent3BR: 3700, vacancyRate: 5.2, capRate: 5.5 },
  
  // Urban core neighborhoods
  { neighborhood: 'Downtown', avgRent1BR: 1750, avgRent2BR: 2450, avgRent3BR: 3500, vacancyRate: 8.5, capRate: 5.8 },
  { neighborhood: 'Midtown', avgRent1BR: 1680, avgRent2BR: 2350, avgRent3BR: 3300, vacancyRate: 6.8, capRate: 6.0 },
  { neighborhood: 'Montrose', avgRent1BR: 1550, avgRent2BR: 2150, avgRent3BR: 3100, vacancyRate: 5.5, capRate: 6.2 },
  { neighborhood: 'Houston Heights', avgRent1BR: 1600, avgRent2BR: 2250, avgRent3BR: 3200, vacancyRate: 4.8, capRate: 5.9 },
  { neighborhood: 'Rice Military', avgRent1BR: 1700, avgRent2BR: 2400, avgRent3BR: 3400, vacancyRate: 4.2, capRate: 5.7 },
  
  // Inner loop neighborhoods  
  { neighborhood: 'Galleria', avgRent1BR: 1450, avgRent2BR: 2050, avgRent3BR: 2900, vacancyRate: 7.2, capRate: 6.3 },
  { neighborhood: 'Medical Center', avgRent1BR: 1350, avgRent2BR: 1900, avgRent3BR: 2700, vacancyRate: 5.8, capRate: 6.5 },
  { neighborhood: 'Energy Corridor', avgRent1BR: 1300, avgRent2BR: 1850, avgRent3BR: 2600, vacancyRate: 9.2, capRate: 6.8 },
  { neighborhood: 'Westchase', avgRent1BR: 1150, avgRent2BR: 1650, avgRent3BR: 2300, vacancyRate: 8.5, capRate: 7.2 },
  { neighborhood: 'Greenway Plaza', avgRent1BR: 1250, avgRent2BR: 1750, avgRent3BR: 2500, vacancyRate: 7.8, capRate: 6.9 },
  
  // Suburban neighborhoods
  { neighborhood: 'The Woodlands', avgRent1BR: 1400, avgRent2BR: 1950, avgRent3BR: 2800, vacancyRate: 5.2, capRate: 5.8 },
  { neighborhood: 'Katy', avgRent1BR: 1200, avgRent2BR: 1700, avgRent3BR: 2400, vacancyRate: 6.5, capRate: 6.4 },
  { neighborhood: 'Sugar Land', avgRent1BR: 1300, avgRent2BR: 1850, avgRent3BR: 2600, vacancyRate: 5.8, capRate: 6.2 },
  { neighborhood: 'Pearland', avgRent1BR: 1150, avgRent2BR: 1650, avgRent3BR: 2300, vacancyRate: 6.2, capRate: 6.7 },
  { neighborhood: 'Clear Lake', avgRent1BR: 1100, avgRent2BR: 1550, avgRent3BR: 2200, vacancyRate: 7.5, capRate: 6.9 },
  
  // Outer suburbs
  { neighborhood: 'Spring', avgRent1BR: 1050, avgRent2BR: 1500, avgRent3BR: 2100, vacancyRate: 7.8, capRate: 7.2 },
  { neighborhood: 'Cypress', avgRent1BR: 1100, avgRent2BR: 1550, avgRent3BR: 2200, vacancyRate: 6.8, capRate: 7.0 },
  { neighborhood: 'Humble', avgRent1BR: 950, avgRent2BR: 1350, avgRent3BR: 1900, vacancyRate: 8.2, capRate: 7.5 },
  { neighborhood: 'Tomball', avgRent1BR: 1000, avgRent2BR: 1450, avgRent3BR: 2000, vacancyRate: 7.5, capRate: 7.3 },
  { neighborhood: 'Conroe', avgRent1BR: 1050, avgRent2BR: 1500, avgRent3BR: 2100, vacancyRate: 6.5, capRate: 7.1 },
  
  // Value neighborhoods
  { neighborhood: 'Alief', avgRent1BR: 850, avgRent2BR: 1200, avgRent3BR: 1700, vacancyRate: 10.2, capRate: 8.5 },
  { neighborhood: 'Sharpstown', avgRent1BR: 900, avgRent2BR: 1250, avgRent3BR: 1750, vacancyRate: 9.8, capRate: 8.2 },
  { neighborhood: 'Greenspoint', avgRent1BR: 800, avgRent2BR: 1150, avgRent3BR: 1600, vacancyRate: 12.5, capRate: 8.8 },
  { neighborhood: 'Gulfton', avgRent1BR: 825, avgRent2BR: 1175, avgRent3BR: 1650, vacancyRate: 11.2, capRate: 8.6 },
  { neighborhood: 'Pasadena', avgRent1BR: 875, avgRent2BR: 1225, avgRent3BR: 1725, vacancyRate: 9.5, capRate: 8.0 }
]

// STR/Airbnb performance data
const strPerformanceData = [
  { neighborhood: 'Downtown', avgNightlyRate: 185, occupancyRate: 72, monthlyRevenue: 4014 },
  { neighborhood: 'Midtown', avgNightlyRate: 165, occupancyRate: 68, monthlyRevenue: 3366 },
  { neighborhood: 'Montrose', avgNightlyRate: 145, occupancyRate: 70, monthlyRevenue: 3045 },
  { neighborhood: 'Museum District', avgNightlyRate: 175, occupancyRate: 75, monthlyRevenue: 3937 },
  { neighborhood: 'Medical Center', avgNightlyRate: 125, occupancyRate: 82, monthlyRevenue: 3075 },
  { neighborhood: 'Galleria', avgNightlyRate: 135, occupancyRate: 65, monthlyRevenue: 2632 },
  { neighborhood: 'Houston Heights', avgNightlyRate: 155, occupancyRate: 66, monthlyRevenue: 3069 },
  { neighborhood: 'River Oaks', avgNightlyRate: 285, occupancyRate: 55, monthlyRevenue: 4702 },
  { neighborhood: 'The Woodlands', avgNightlyRate: 125, occupancyRate: 60, monthlyRevenue: 2250 },
  { neighborhood: 'Energy Corridor', avgNightlyRate: 115, occupancyRate: 58, monthlyRevenue: 2001 }
]

async function importRentalMarketData() {
  console.log('🏠 Starting Rental Market Data Import...')
  console.log('=' .repeat(60))
  
  let totalImported = 0
  
  try {
    // Import rental market data
    console.log('\n📊 Importing neighborhood rental data...')
    
    for (const rental of rentalMarketData) {
      try {
        await prisma.rentalMarket.create({
          data: {
            area: rental.neighborhood,
            areaType: 'neighborhood',
            propertyType: 'All Residential',
            avgRent: Math.round((rental.avgRent1BR + rental.avgRent2BR + rental.avgRent3BR) / 3),
            rentGrowthYoY: 3.5 + Math.random() * 3, // 3.5-6.5% growth
            vacancyRate: rental.vacancyRate,
            avgDaysToLease: Math.floor(25 + Math.random() * 20), // 25-45 days
            totalUnits: Math.floor(500 + Math.random() * 5000), // 500-5500 units
            newSupply: Math.floor(50 + Math.random() * 450), // 50-500 new units
            absorption: Math.floor(40 + Math.random() * 400), // 40-440 absorbed
            avgRentPerSqft: rental.avgRent2BR / 1000, // Approximate $/sqft
            medianHouseholdIncome: Math.floor(45000 + Math.random() * 80000), // $45-125k
            employmentGrowth: 2 + Math.random() * 3, // 2-5% growth
            capRate: rental.capRate,
            investorActivity: rental.capRate > 7 ? 'High' : rental.capRate > 6 ? 'Medium' : 'Low',
            topEmployers: ['Healthcare', 'Energy', 'Education', 'Technology'],
            transportAccess: rental.neighborhood.includes('Downtown') || rental.neighborhood.includes('Medical') ? 'Excellent' : 'Good',
            demographicTrends: 'Growing millennial population',
            reportDate: new Date(),
            metadata: {
              avgRent1BR: rental.avgRent1BR,
              avgRent2BR: rental.avgRent2BR,
              avgRent3BR: rental.avgRent3BR,
              lastUpdated: new Date()
            }
          }
        })
        totalImported++
      } catch (error) {
        console.error(`❌ Error importing ${rental.neighborhood}:`, error)
      }
    }
    
    console.log(`✅ Imported ${totalImported} rental market records`)
    
    // Import STR/Airbnb data
    console.log('\n📊 Importing STR/Airbnb performance data...')
    let strImported = 0
    
    for (const str of strPerformanceData) {
      try {
        await prisma.sTRMarket.create({
          data: {
            area: str.neighborhood,
            areaType: 'neighborhood',
            propertyType: 'All Types',
            activeListings: Math.floor(50 + Math.random() * 300), // 50-350 listings
            avgDailyRate: str.avgNightlyRate,
            occupancyRate: str.occupancyRate,
            revPAR: Math.round(str.avgNightlyRate * str.occupancyRate / 100),
            avgMonthlyRevenue: str.monthlyRevenue,
            seasonalTrends: 'Peak: March-May, Oct-Nov',
            topAmenities: ['WiFi', 'Kitchen', 'Parking', 'Pool Access'],
            avgBookingLeadTime: Math.floor(14 + Math.random() * 30), // 14-44 days
            guestOrigins: 'Business (45%), Leisure (35%), Medical (20%)',
            regulatoryStatus: 'Permitted with restrictions',
            competitionLevel: str.avgNightlyRate > 200 ? 'Low' : str.avgNightlyRate > 150 ? 'Medium' : 'High',
            hostTypes: 'Professional (60%), Individual (40%)',
            avgReviewScore: 4.3 + Math.random() * 0.5, // 4.3-4.8
            demandDrivers: ['Medical Center', 'Business Travel', 'Events'],
            reportDate: new Date(),
            metadata: {
              yearlyRevenue: str.monthlyRevenue * 12,
              roi: ((str.monthlyRevenue * 12) / 350000 * 100), // Assume $350k property
              lastUpdated: new Date()
            }
          }
        })
        strImported++
      } catch (error) {
        console.error(`❌ Error importing STR data for ${str.neighborhood}:`, error)
      }
    }
    
    console.log(`✅ Imported ${strImported} STR market records`)
    
    // Create rental investment analysis
    console.log('\n📊 RENTAL INVESTMENT ANALYSIS:')
    console.log('─'.repeat(80))
    console.log('Neighborhood'.padEnd(20) + 'Avg Rent'.padEnd(12) + 'Vacancy'.padEnd(10) + 'Cap Rate'.padEnd(10) + 'STR Rev/Mo')
    console.log('─'.repeat(80))
    
    for (const rental of rentalMarketData.slice(0, 10)) {
      const str = strPerformanceData.find(s => s.neighborhood === rental.neighborhood)
      const avgRent = Math.round((rental.avgRent1BR + rental.avgRent2BR + rental.avgRent3BR) / 3)
      console.log(
        rental.neighborhood.padEnd(20) +
        `$${avgRent}`.padEnd(12) +
        `${rental.vacancyRate}%`.padEnd(10) +
        `${rental.capRate}%`.padEnd(10) +
        `$${str?.monthlyRevenue || 'N/A'}`
      )
    }
    
    // Summary
    const totalRental = await prisma.rentalMarket.count()
    const totalSTR = await prisma.sTRMarket.count()
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 RENTAL MARKET DATA IMPORT SUMMARY:')
    console.log(`✅ Total rental market records: ${totalRental}`)
    console.log(`✅ Total STR market records: ${totalSTR}`)
    console.log(`🏘️ Neighborhoods covered: ${rentalMarketData.length}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Import error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importRentalMarketData()