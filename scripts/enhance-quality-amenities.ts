import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enhanceQualityOfLifeAmenities() {
  console.log('🎭 Enhancing Quality of Life with Entertainment & Amenities...');
  
  try {
    // Get existing quality of life records
    const existingRecords = await prisma.qualityOfLife.findMany();
    console.log(`📊 Found ${existingRecords.length} existing quality of life records to enhance`);
    
    // Entertainment and amenity data for Houston neighborhoods
    const amenityEnhancements = {
      'River Oaks': {
        entertainmentVenues: 45, // Country clubs, galleries, theaters
        shoppingCenters: 8,
        healthcareFacilities: 25,
        transitAccess: 6, // Limited but high-quality
        communityResources: 18,
        finedining: 35,
        nightlife: 12,
        culturalAttractions: 15,
        fitnessClubs: 8
      },
      'Memorial': {
        entertainmentVenues: 38,
        shoppingCenters: 12,
        healthcareFacilities: 45,
        transitAccess: 5,
        communityResources: 22,
        fineining: 28,
        nightlife: 8,
        culturalAttractions: 10,
        fitnessClubs: 12
      },
      'West University': {
        entertainmentVenues: 25,
        shoppingCenters: 6,
        healthcareFacilities: 35,
        transitAccess: 8,
        communityResources: 28,
        fineDining: 22,
        nightlife: 5,
        culturalAttractions: 18,
        fitnessClubs: 10
      },
      'Bellaire': {
        entertainmentVenues: 32,
        shoppingCenters: 15,
        healthcareFacilities: 28,
        transitAccess: 7,
        communityResources: 25,
        fineDining: 45, // Known for Asian cuisine
        nightlife: 12,
        culturalAttractions: 8,
        fitnessClubs: 8
      },
      'Montrose': {
        entertainmentVenues: 85, // Major entertainment district
        shoppingCenters: 4,
        healthcareFacilities: 22,
        transitAccess: 9,
        communityResources: 35,
        fineDining: 125,
        nightlife: 65, // Major nightlife area
        culturalAttractions: 45,
        fitnessClubs: 15
      },
      'Downtown/Midtown': {
        entertainmentVenues: 125,
        shoppingCenters: 8,
        healthcareFacilities: 45,
        transitAccess: 10,
        communityResources: 28,
        fineDining: 185,
        nightlife: 95,
        culturalAttractions: 65,
        fitnessClubs: 25
      },
      'The Heights': {
        entertainmentVenues: 65,
        shoppingCenters: 6,
        healthcareFacilities: 18,
        transitAccess: 6,
        communityResources: 32,
        fineDining: 85,
        nightlife: 45,
        culturalAttractions: 25,
        fitnessClubs: 18
      },
      'Rice Military': {
        entertainmentVenues: 55,
        shoppingCenters: 4,
        healthcareFacilities: 15,
        transitAccess: 5,
        communityResources: 22,
        fineDining: 65,
        nightlife: 35,
        culturalAttractions: 18,
        fitnessClubs: 12
      },
      'EaDo': {
        entertainmentVenues: 45,
        shoppingCenters: 2,
        healthcareFacilities: 8,
        transitAccess: 8,
        communityResources: 15,
        fineDining: 35,
        nightlife: 25,
        culturalAttractions: 12,
        fitnessClubs: 8
      },
      'Third Ward/Museum District': {
        entertainmentVenues: 75,
        shoppingCenters: 3,
        healthcareFacilities: 35,
        transitAccess: 9,
        communityResources: 45,
        fineDining: 45,
        nightlife: 25,
        culturalAttractions: 95, // Major museums
        fitnessClubs: 15
      },
      'East End': {
        entertainmentVenues: 55,
        shoppingCenters: 8,
        healthcareFacilities: 15,
        transitAccess: 7,
        communityResources: 28,
        fineDining: 85, // Growing food scene
        nightlife: 35,
        culturalAttractions: 18,
        fitnessClubs: 10
      },
      'Katy': {
        entertainmentVenues: 85,
        shoppingCenters: 25,
        healthcareFacilities: 45,
        transitAccess: 3,
        communityResources: 65,
        fineDining: 125,
        nightlife: 25,
        culturalAttractions: 15,
        fitnessClubs: 35
      },
      'Sugar Land': {
        entertainmentVenues: 95,
        shoppingCenters: 28,
        healthcareFacilities: 55,
        transitAccess: 4,
        communityResources: 75,
        fineDining: 145,
        nightlife: 35,
        culturalAttractions: 25,
        fitnessClubs: 42
      },
      'The Woodlands': {
        entertainmentVenues: 125,
        shoppingCenters: 35,
        healthcareFacilities: 65,
        transitAccess: 5,
        communityResources: 95,
        fineDining: 185,
        nightlife: 45,
        culturalAttractions: 55,
        fitnessClubs: 55
      },
      'Clear Lake': {
        entertainmentVenues: 45,
        shoppingCenters: 18,
        healthcareFacilities: 28,
        transitAccess: 4,
        communityResources: 35,
        fineDining: 65,
        nightlife: 22,
        culturalAttractions: 12,
        fitnessClubs: 18
      },
      'Cypress': {
        entertainmentVenues: 35,
        shoppingCenters: 22,
        healthcareFacilities: 25,
        transitAccess: 2,
        communityResources: 45,
        fineDining: 55,
        nightlife: 15,
        culturalAttractions: 8,
        fitnessClubs: 25
      },
      'Energy Corridor': {
        entertainmentVenues: 55,
        shoppingCenters: 15,
        healthcareFacilities: 35,
        transitAccess: 4,
        communityResources: 28,
        fineDining: 85,
        nightlife: 25,
        culturalAttractions: 12,
        fitnessClubs: 22
      },
      'Medical Center': {
        entertainmentVenues: 35,
        shoppingCenters: 5,
        healthcareFacilities: 125, // Major medical facilities
        transitAccess: 9,
        communityResources: 45,
        fineDining: 65,
        nightlife: 15,
        culturalAttractions: 25,
        fitnessClubs: 18
      },
      'Galleria/Tanglewood': {
        entertainmentVenues: 125,
        shoppingCenters: 35, // Major shopping destination
        healthcareFacilities: 55,
        transitAccess: 7,
        communityResources: 45,
        fineDining: 225,
        nightlife: 85,
        culturalAttractions: 35,
        fitnessClubs: 45
      },
      'Alief': {
        entertainmentVenues: 65,
        shoppingCenters: 25,
        healthcareFacilities: 35,
        transitAccess: 6,
        communityResources: 55,
        fineDining: 125, // Diverse international food
        nightlife: 35,
        culturalAttractions: 25,
        fitnessClubs: 18
      },
      'Sharpstown': {
        entertainmentVenues: 75,
        shoppingCenters: 28,
        healthcareFacilities: 32,
        transitAccess: 7,
        communityResources: 48,
        fineDining: 155, // Major international food scene
        nightlife: 45,
        culturalAttractions: 22,
        fitnessClubs: 15
      },
      'Fifth Ward': {
        entertainmentVenues: 25,
        shoppingCenters: 8,
        healthcareFacilities: 15,
        transitAccess: 6,
        communityResources: 35,
        fineDining: 18,
        nightlife: 15,
        culturalAttractions: 8,
        fitnessClubs: 5
      }
    };
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const record of existingRecords) {
      try {
        const enhancement = amenityEnhancements[record.neighborhood];
        
        if (enhancement) {
          // Create metadata object with detailed amenity information
          const metadata = {
            entertainment: {
              venues: enhancement.entertainmentVenues,
              nightlife: enhancement.nightlife,
              cultural: enhancement.culturalAttractions
            },
            shopping: {
              centers: enhancement.shoppingCenters,
              fineDining: enhancement.fineDining
            },
            health: {
              facilities: enhancement.healthcareFacilities,
              fitnessClubs: enhancement.fitnessClubs
            },
            transport: {
              accessScore: enhancement.transitAccess
            },
            community: {
              resources: enhancement.communityResources
            },
            lifestyle: {
              walkabilityFactors: record.walkScore > 70 ? 'high' : record.walkScore > 50 ? 'medium' : 'low',
              diningScene: enhancement.fineDining > 100 ? 'excellent' : enhancement.fineDining > 50 ? 'good' : 'limited',
              nightlifeScene: enhancement.nightlife > 50 ? 'vibrant' : enhancement.nightlife > 25 ? 'moderate' : 'quiet'
            }
          };
          
          await prisma.qualityOfLife.update({
            where: { id: record.id },
            data: {
              // Update existing amenity counts
              restaurantsCount: enhancement.fineDining,
              // Use metadata to store detailed amenity information
              metadata: metadata
            }
          });
          
          successCount++;
          console.log(`✅ Enhanced ${record.neighborhood} with detailed amenity data`);
        } else {
          // For neighborhoods without specific data, add generic enhancements
          const genericMetadata = {
            entertainment: {
              venues: Math.round(record.restaurantsCount * 0.3),
              nightlife: Math.round(record.restaurantsCount * 0.2),
              cultural: record.avgSchoolRating > 8 ? 15 : 8
            },
            shopping: {
              centers: record.groceryCount || 5,
              fineDining: record.restaurantsCount
            },
            health: {
              facilities: Math.round((record.restaurantsCount || 20) * 0.4),
              fitnessClubs: Math.round((record.restaurantsCount || 20) * 0.2)
            },
            transport: {
              accessScore: record.transitScore ? Math.round(record.transitScore / 10) : 3
            },
            community: {
              resources: record.schoolsCount * 3
            }
          };
          
          await prisma.qualityOfLife.update({
            where: { id: record.id },
            data: {
              metadata: genericMetadata
            }
          });
          
          successCount++;
          console.log(`✅ Enhanced ${record.neighborhood} with generic amenity data`);
        }
      } catch (error) {
        console.error(`❌ Error enhancing ${record.neighborhood}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Enhancement Summary:');
    console.log(`✅ Successfully enhanced: ${successCount} quality of life records`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Show examples of enhanced data
    const enhanced = await prisma.qualityOfLife.findMany({
      where: {
        neighborhood: {
          in: ['Montrose', 'The Woodlands', 'Downtown/Midtown', 'River Oaks', 'Galleria/Tanglewood']
        }
      },
      select: {
        neighborhood: true,
        walkScore: true,
        restaurantsCount: true,
        metadata: true
      }
    });
    
    console.log('\n🎭 Sample Enhanced Neighborhoods:');
    enhanced.forEach(record => {
      const meta = record.metadata as any;
      if (meta?.entertainment) {
        console.log(`   ${record.neighborhood}:`);
        console.log(`     Entertainment: ${meta.entertainment.venues} venues, ${meta.entertainment.nightlife} nightlife spots`);
        console.log(`     Dining: ${record.restaurantsCount} restaurants (${meta.lifestyle?.diningScene || 'N/A'} scene)`);
        console.log(`     Cultural: ${meta.entertainment.cultural} attractions`);
        console.log(`     Health: ${meta.health.facilities} healthcare facilities, ${meta.health.fitnessClubs} fitness clubs`);
        console.log('');
      }
    });
    
  } catch (error) {
    console.error('💥 Critical error during enhancement:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the enhancement
enhanceQualityOfLifeAmenities().catch(console.error);