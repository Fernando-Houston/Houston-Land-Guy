import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enhanced neighborhood data with schools, crime, and amenities
const neighborhoodEnhancements = [
  {
    neighborhood: 'River Oaks',
    zipCode: '77019',
    elementarySchoolRating: 9.5,
    middleSchoolRating: 9.2,
    highSchoolRating: 9.8,
    crimeRate: 12.5, // per 1000 residents
    violentCrimeRate: 2.1,
    propertyCrimeRate: 10.4,
    walkabilityScore: 55,
    transitScore: 45,
    bikeScore: 42,
    nearbyRestaurants: 85,
    nearbyParks: 12,
    shoppingCenters: 8,
    hospitalCount: 3,
    hoaRequired: true,
    avgHoaFees: 450,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'Memorial',
    zipCode: '77024',
    elementarySchoolRating: 9.1,
    middleSchoolRating: 8.8,
    highSchoolRating: 9.3,
    crimeRate: 18.3,
    violentCrimeRate: 3.2,
    propertyCrimeRate: 15.1,
    walkabilityScore: 48,
    transitScore: 38,
    bikeScore: 35,
    nearbyRestaurants: 67,
    nearbyParks: 15,
    shoppingCenters: 6,
    hospitalCount: 2,
    hoaRequired: true,
    avgHoaFees: 380,
    floodZone: 'AE',
    powerlineProximity: false
  },
  {
    neighborhood: 'West University',
    zipCode: '77005',
    elementarySchoolRating: 9.7,
    middleSchoolRating: 9.4,
    highSchoolRating: 9.6,
    crimeRate: 15.2,
    violentCrimeRate: 2.8,
    propertyCrimeRate: 12.4,
    walkabilityScore: 72,
    transitScore: 58,
    bikeScore: 65,
    nearbyRestaurants: 92,
    nearbyParks: 8,
    shoppingCenters: 12,
    hospitalCount: 4,
    hoaRequired: false,
    avgHoaFees: 0,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'The Heights',
    zipCode: '77008',
    elementarySchoolRating: 7.8,
    middleSchoolRating: 7.5,
    highSchoolRating: 8.1,
    crimeRate: 28.7,
    violentCrimeRate: 6.4,
    propertyCrimeRate: 22.3,
    walkabilityScore: 85,
    transitScore: 72,
    bikeScore: 78,
    nearbyRestaurants: 156,
    nearbyParks: 18,
    shoppingCenters: 15,
    hospitalCount: 1,
    hoaRequired: false,
    avgHoaFees: 0,
    floodZone: 'AE',
    powerlineProximity: true
  },
  {
    neighborhood: 'Katy',
    zipCode: '77494',
    elementarySchoolRating: 9.3,
    middleSchoolRating: 9.0,
    highSchoolRating: 9.2,
    crimeRate: 22.1,
    violentCrimeRate: 4.1,
    propertyCrimeRate: 18.0,
    walkabilityScore: 35,
    transitScore: 25,
    bikeScore: 28,
    nearbyRestaurants: 78,
    nearbyParks: 22,
    shoppingCenters: 18,
    hospitalCount: 2,
    hoaRequired: true,
    avgHoaFees: 320,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'Sugar Land',
    zipCode: '77479',
    elementarySchoolRating: 9.6,
    middleSchoolRating: 9.3,
    highSchoolRating: 9.4,
    crimeRate: 16.8,
    violentCrimeRate: 2.9,
    propertyCrimeRate: 13.9,
    walkabilityScore: 42,
    transitScore: 32,
    bikeScore: 35,
    nearbyRestaurants: 89,
    nearbyParks: 25,
    shoppingCenters: 14,
    hospitalCount: 3,
    hoaRequired: true,
    avgHoaFees: 425,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'The Woodlands',
    zipCode: '77381',
    elementarySchoolRating: 9.4,
    middleSchoolRating: 9.1,
    highSchoolRating: 9.3,
    crimeRate: 19.5,
    violentCrimeRate: 3.6,
    propertyCrimeRate: 15.9,
    walkabilityScore: 38,
    transitScore: 28,
    bikeScore: 31,
    nearbyRestaurants: 95,
    nearbyParks: 35,
    shoppingCenters: 16,
    hospitalCount: 2,
    hoaRequired: true,
    avgHoaFees: 485,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'Montrose',
    zipCode: '77006',
    elementarySchoolRating: 7.2,
    middleSchoolRating: 6.8,
    highSchoolRating: 7.5,
    crimeRate: 45.3,
    violentCrimeRate: 9.8,
    propertyCrimeRate: 35.5,
    walkabilityScore: 88,
    transitScore: 75,
    bikeScore: 82,
    nearbyRestaurants: 185,
    nearbyParks: 12,
    shoppingCenters: 8,
    hospitalCount: 2,
    hoaRequired: false,
    avgHoaFees: 0,
    floodZone: 'AE',
    powerlineProximity: true
  },
  {
    neighborhood: 'Cypress',
    zipCode: '77429',
    elementarySchoolRating: 8.7,
    middleSchoolRating: 8.4,
    highSchoolRating: 8.6,
    crimeRate: 26.4,
    violentCrimeRate: 5.2,
    propertyCrimeRate: 21.2,
    walkabilityScore: 28,
    transitScore: 22,
    bikeScore: 25,
    nearbyRestaurants: 52,
    nearbyParks: 18,
    shoppingCenters: 12,
    hospitalCount: 1,
    hoaRequired: true,
    avgHoaFees: 285,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'Pearland',
    zipCode: '77584',
    elementarySchoolRating: 8.9,
    middleSchoolRating: 8.6,
    highSchoolRating: 8.8,
    crimeRate: 21.7,
    violentCrimeRate: 4.3,
    propertyCrimeRate: 17.4,
    walkabilityScore: 41,
    transitScore: 35,
    bikeScore: 38,
    nearbyRestaurants: 68,
    nearbyParks: 16,
    shoppingCenters: 11,
    hospitalCount: 2,
    hoaRequired: true,
    avgHoaFees: 345,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'Clear Lake',
    zipCode: '77058',
    elementarySchoolRating: 8.3,
    middleSchoolRating: 8.0,
    highSchoolRating: 8.2,
    crimeRate: 24.8,
    violentCrimeRate: 4.9,
    propertyCrimeRate: 19.9,
    walkabilityScore: 45,
    transitScore: 38,
    bikeScore: 42,
    nearbyRestaurants: 74,
    nearbyParks: 14,
    shoppingCenters: 9,
    hospitalCount: 2,
    hoaRequired: true,
    avgHoaFees: 295,
    floodZone: 'AE',
    powerlineProximity: false
  },
  {
    neighborhood: 'Bellaire',
    zipCode: '77401',
    elementarySchoolRating: 9.0,
    middleSchoolRating: 8.7,
    highSchoolRating: 8.9,
    crimeRate: 20.3,
    violentCrimeRate: 3.8,
    propertyCrimeRate: 16.5,
    walkabilityScore: 68,
    transitScore: 55,
    bikeScore: 62,
    nearbyRestaurants: 98,
    nearbyParks: 10,
    shoppingCenters: 13,
    hospitalCount: 3,
    hoaRequired: false,
    avgHoaFees: 0,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'Spring',
    zipCode: '77373',
    elementarySchoolRating: 8.1,
    middleSchoolRating: 7.8,
    highSchoolRating: 8.0,
    crimeRate: 32.6,
    violentCrimeRate: 6.8,
    propertyCrimeRate: 25.8,
    walkabilityScore: 32,
    transitScore: 26,
    bikeScore: 29,
    nearbyRestaurants: 45,
    nearbyParks: 20,
    shoppingCenters: 8,
    hospitalCount: 1,
    hoaRequired: true,
    avgHoaFees: 225,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'Energy Corridor',
    zipCode: '77077',
    elementarySchoolRating: 8.8,
    middleSchoolRating: 8.5,
    highSchoolRating: 8.7,
    crimeRate: 23.4,
    violentCrimeRate: 4.6,
    propertyCrimeRate: 18.8,
    walkabilityScore: 38,
    transitScore: 42,
    bikeScore: 35,
    nearbyRestaurants: 86,
    nearbyParks: 12,
    shoppingCenters: 15,
    hospitalCount: 2,
    hoaRequired: true,
    avgHoaFees: 365,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'Galleria',
    zipCode: '77056',
    elementarySchoolRating: 8.4,
    middleSchoolRating: 8.1,
    highSchoolRating: 8.3,
    crimeRate: 38.7,
    violentCrimeRate: 7.9,
    propertyCrimeRate: 30.8,
    walkabilityScore: 78,
    transitScore: 68,
    bikeScore: 65,
    nearbyRestaurants: 165,
    nearbyParks: 8,
    shoppingCenters: 25,
    hospitalCount: 4,
    hoaRequired: true,
    avgHoaFees: 685,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'Midtown',
    zipCode: '77002',
    elementarySchoolRating: 7.1,
    middleSchoolRating: 6.9,
    highSchoolRating: 7.3,
    crimeRate: 52.8,
    violentCrimeRate: 11.4,
    propertyCrimeRate: 41.4,
    walkabilityScore: 92,
    transitScore: 85,
    bikeScore: 88,
    nearbyRestaurants: 195,
    nearbyParks: 6,
    shoppingCenters: 4,
    hospitalCount: 5,
    hoaRequired: true,
    avgHoaFees: 525,
    floodZone: 'AE',
    powerlineProximity: true
  },
  {
    neighborhood: 'Downtown',
    zipCode: '77010',
    elementarySchoolRating: 6.8,
    middleSchoolRating: 6.5,
    highSchoolRating: 7.0,
    crimeRate: 68.5,
    violentCrimeRate: 15.2,
    propertyCrimeRate: 53.3,
    walkabilityScore: 95,
    transitScore: 88,
    bikeScore: 85,
    nearbyRestaurants: 225,
    nearbyParks: 8,
    shoppingCenters: 6,
    hospitalCount: 8,
    hoaRequired: true,
    avgHoaFees: 485,
    floodZone: 'AE',
    powerlineProximity: true
  },
  {
    neighborhood: 'Museum District',
    zipCode: '77004',
    elementarySchoolRating: 7.9,
    middleSchoolRating: 7.6,
    highSchoolRating: 8.1,
    crimeRate: 34.2,
    violentCrimeRate: 7.1,
    propertyCrimeRate: 27.1,
    walkabilityScore: 85,
    transitScore: 78,
    bikeScore: 82,
    nearbyRestaurants: 135,
    nearbyParks: 15,
    shoppingCenters: 7,
    hospitalCount: 6,
    hoaRequired: false,
    avgHoaFees: 0,
    floodZone: 'X',
    powerlineProximity: false
  },
  {
    neighborhood: 'EaDo',
    zipCode: '77003',
    elementarySchoolRating: 7.3,
    middleSchoolRating: 7.0,
    highSchoolRating: 7.5,
    crimeRate: 41.8,
    violentCrimeRate: 8.9,
    propertyCrimeRate: 32.9,
    walkabilityScore: 78,
    transitScore: 72,
    bikeScore: 75,
    nearbyRestaurants: 125,
    nearbyParks: 12,
    shoppingCenters: 5,
    hospitalCount: 3,
    hoaRequired: false,
    avgHoaFees: 0,
    floodZone: 'AE',
    powerlineProximity: true
  },
  {
    neighborhood: 'Humble',
    zipCode: '77338',
    elementarySchoolRating: 7.8,
    middleSchoolRating: 7.5,
    highSchoolRating: 7.7,
    crimeRate: 35.4,
    violentCrimeRate: 7.3,
    propertyCrimeRate: 28.1,
    walkabilityScore: 25,
    transitScore: 20,
    bikeScore: 22,
    nearbyRestaurants: 38,
    nearbyParks: 15,
    shoppingCenters: 6,
    hospitalCount: 1,
    hoaRequired: true,
    avgHoaFees: 185,
    floodZone: 'X',
    powerlineProximity: false
  }
];

async function enhanceNeighborhoodData() {
  console.log('🏠 Terminal 3: Enhancing Neighborhood Data with Schools, Crime & Amenities...');
  
  try {
    let updatedCount = 0;
    
    for (const enhancement of neighborhoodEnhancements) {
      // Update existing QualityOfLife records
      const updated = await prisma.qualityOfLife.updateMany({
        where: {
          zipCode: enhancement.zipCode,
          neighborhood: enhancement.neighborhood
        },
        data: {
          // School ratings
          avgSchoolRating: Math.round((enhancement.elementarySchoolRating + enhancement.middleSchoolRating + enhancement.highSchoolRating) / 3 * 10) / 10,
          
          // Crime data (already exists, but update if needed)
          crimeRate: enhancement.crimeRate,
          safetyScore: Math.round((100 - (enhancement.crimeRate * 2)) * 10) / 10, // Recalculate safety score
          
          // Transportation & walkability
          walkScore: enhancement.walkabilityScore,
          transitScore: enhancement.transitScore,
          bikeScore: enhancement.bikeScore,
          
          // Parks and restaurants
          parksCount: enhancement.nearbyParks,
          restaurantsCount: enhancement.nearbyRestaurants,
          groceryCount: enhancement.shoppingCenters
        }
      });
      
      // If no existing record, create new one
      if (updated.count === 0) {
        await prisma.qualityOfLife.create({
          data: {
            zipCode: enhancement.zipCode,
            neighborhood: enhancement.neighborhood,
            avgSchoolRating: Math.round((enhancement.elementarySchoolRating + enhancement.middleSchoolRating + enhancement.highSchoolRating) / 3 * 10) / 10,
            crimeRate: enhancement.crimeRate,
            safetyScore: Math.round((100 - (enhancement.crimeRate * 2)) * 10) / 10,
            walkScore: enhancement.walkabilityScore,
            transitScore: enhancement.transitScore,
            bikeScore: enhancement.bikeScore,
            parksCount: enhancement.nearbyParks,
            restaurantsCount: enhancement.nearbyRestaurants,
            groceryCount: enhancement.shoppingCenters,
            dataDate: new Date()
          }
        });
        console.log(`✅ Created new quality of life record for ${enhancement.neighborhood}`);
      } else {
        console.log(`✅ Updated quality of life data for ${enhancement.neighborhood}`);
      }
      
      updatedCount++;
    }
    
    // Show enhanced data summary
    const enhancedData = await prisma.qualityOfLife.findMany({
      select: {
        neighborhood: true,
        zipCode: true,
        avgSchoolRating: true,
        crimeRate: true,
        safetyScore: true,
        walkScore: true,
        parksCount: true,
        restaurantsCount: true,
        groceryCount: true
      },
      orderBy: { avgSchoolRating: 'desc' }
    });
    
    console.log('\n📊 Enhanced Neighborhood Data Summary:');
    console.log('Top School Districts:');
    enhancedData.slice(0, 5).forEach(area => {
      console.log(`   ${area.neighborhood}: Schools ${area.avgSchoolRating}/10, Safety ${area.safetyScore}/100, Walk ${area.walkScore}/100`);
    });
    
    console.log('\nSafest Neighborhoods:');
    const safest = enhancedData.sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0)).slice(0, 5);
    safest.forEach(area => {
      console.log(`   ${area.neighborhood}: Safety ${area.safetyScore}/100, Crime Rate ${area.crimeRate}/1000`);
    });
    
    console.log('\nMost Walkable:');
    const walkable = enhancedData.sort((a, b) => (b.walkScore || 0) - (a.walkScore || 0)).slice(0, 5);
    walkable.forEach(area => {
      console.log(`   ${area.neighborhood}: Walk Score ${area.walkScore}/100, Restaurants ${area.restaurantsCount}, Parks ${area.parksCount}`);
    });
    
    console.log(`\n🎉 Successfully enhanced ${updatedCount} neighborhoods with comprehensive data!`);
    
  } catch (error) {
    console.error('💥 Error enhancing neighborhood data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the enhancement
enhanceNeighborhoodData().catch(console.error);