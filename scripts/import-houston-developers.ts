import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importHoustonDevelopers() {
  console.log('🏗️  Starting Houston Developers Import...');
  
  try {
    // Check current count
    const currentCount = await prisma.developer.count();
    console.log(`📊 Current developer count: ${currentCount}`);
    
    // Comprehensive list of Houston developers across all categories
    const houstonDevelopers = [
      // Large Scale Residential Developers
      {
        name: 'Toll Brothers',
        companyType: 'Public Builder',
        website: 'https://tollbrothers.com',
        headquarters: 'Horsham, PA (Houston Division)',
        primaryFocus: 'Luxury Single Family',
        secondaryFocus: 'Active Adult Communities',
        targetMarket: ['Luxury', 'Move-Up Buyers'],
        primaryAreas: ['Katy', 'Cypress', 'The Woodlands', 'Sugar Land'],
        foundedYear: 1967,
        activeProjects: 12,
        completedProjects: 85,
        totalValue: 2500000000,
        averagePrice: 650000
      },
      {
        name: 'KB Home',
        companyType: 'Public Builder',
        website: 'https://kbhome.com',
        headquarters: 'Los Angeles, CA (Houston Division)',
        primaryFocus: 'First Time Buyers',
        secondaryFocus: 'Move-Up Buyers',
        targetMarket: ['Entry Level', 'Move-Up Buyers'],
        primaryAreas: ['Northwest Harris', 'Cypress', 'Spring', 'Humble'],
        foundedYear: 1957,
        activeProjects: 18,
        completedProjects: 125,
        totalValue: 1800000000,
        averagePrice: 285000
      },
      {
        name: 'Lennar Corporation',
        companyType: 'Public Builder',
        website: 'https://lennar.com',
        headquarters: 'Miami, FL (Houston Division)',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Townhomes',
        targetMarket: ['First Time', 'Move-Up', 'Luxury'],
        primaryAreas: ['Katy', 'Pearland', 'League City', 'Cypress'],
        foundedYear: 1954,
        activeProjects: 25,
        completedProjects: 145,
        totalValue: 3200000000,
        averagePrice: 385000
      },
      {
        name: 'Pulte Homes',
        companyType: 'Public Builder',
        website: 'https://pulte.com',
        headquarters: 'Atlanta, GA (Houston Division)',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Active Adult',
        targetMarket: ['Move-Up', 'Active Adult'],
        primaryAreas: ['Sugar Land', 'Katy', 'The Woodlands', 'Friendswood'],
        foundedYear: 1950,
        activeProjects: 15,
        completedProjects: 95,
        totalValue: 2100000000,
        averagePrice: 425000
      },
      {
        name: 'DR Horton',
        companyType: 'Public Builder',
        website: 'https://drhorton.com',
        headquarters: 'Arlington, TX (Houston Division)',
        primaryFocus: 'Entry Level',
        secondaryFocus: 'Single Family',
        targetMarket: ['Entry Level', 'First Time Buyers'],
        primaryAreas: ['Conroe', 'Huntsville', 'Magnolia', 'Montgomery County'],
        foundedYear: 1978,
        activeProjects: 28,
        completedProjects: 185,
        totalValue: 2800000000,
        averagePrice: 315000
      },
      
      // Mid-Size Houston Builders
      {
        name: 'Westin Homes',
        companyType: 'Private Builder',
        website: 'https://westinhomes.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Custom Homes',
        secondaryFocus: 'Semi-Custom',
        targetMarket: ['Luxury', 'Custom'],
        primaryAreas: ['River Oaks', 'Memorial', 'West University', 'Bellaire'],
        foundedYear: 1985,
        activeProjects: 35,
        completedProjects: 450,
        totalValue: 1200000000,
        averagePrice: 850000
      },
      {
        name: 'Partners in Building',
        companyType: 'Private Builder',
        website: 'https://partnersinbuilding.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Custom Homes',
        secondaryFocus: 'Renovations',
        targetMarket: ['Luxury', 'Custom'],
        primaryAreas: ['River Oaks', 'Tanglewood', 'Memorial', 'The Heights'],
        foundedYear: 1995,
        activeProjects: 25,
        completedProjects: 285,
        totalValue: 650000000,
        averagePrice: 1200000
      },
      {
        name: 'Newmark Homes',
        companyType: 'Private Builder',
        website: 'https://newmarkhomes.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Townhomes',
        targetMarket: ['Move-Up', 'First Time'],
        primaryAreas: ['Katy', 'Sugar Land', 'Pearland', 'League City'],
        foundedYear: 1971,
        activeProjects: 22,
        completedProjects: 315,
        totalValue: 925000000,
        averagePrice: 395000
      },
      {
        name: 'Highland Homes',
        companyType: 'Private Builder',
        website: 'https://highland-homes.com',
        headquarters: 'Dallas, TX (Houston Division)',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Luxury Homes',
        targetMarket: ['Move-Up', 'Luxury'],
        primaryAreas: ['Cypress', 'Katy', 'The Woodlands', 'Spring'],
        foundedYear: 1985,
        activeProjects: 18,
        completedProjects: 125,
        totalValue: 785000000,
        averagePrice: 485000
      },
      {
        name: 'Coventry Homes',
        companyType: 'Private Builder',
        website: 'https://coventryhomes.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Semi-Custom',
        targetMarket: ['Move-Up', 'Luxury'],
        primaryAreas: ['Katy', 'Sugar Land', 'Cypress', 'Friendswood'],
        foundedYear: 1988,
        activeProjects: 16,
        completedProjects: 185,
        totalValue: 650000000,
        averagePrice: 425000
      },
      
      // Townhome and Multi-Family Specialists
      {
        name: 'Camden Property Trust',
        companyType: 'REIT',
        website: 'https://camdenliving.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Luxury Apartments',
        secondaryFocus: 'Mixed Use',
        targetMarket: ['Luxury Renters', 'Young Professionals'],
        primaryAreas: ['Galleria', 'Memorial City', 'Downtown', 'Energy Corridor'],
        foundedYear: 1993,
        activeProjects: 8,
        completedProjects: 45,
        totalValue: 1200000000,
        averagePrice: 0 // Rental properties
      },
      {
        name: 'Greystar Real Estate Partners',
        companyType: 'Private Developer',
        website: 'https://greystar.com',
        headquarters: 'Charleston, SC (Houston Office)',
        primaryFocus: 'Multifamily',
        secondaryFocus: 'Student Housing',
        targetMarket: ['Market Rate Renters', 'Luxury Renters'],
        primaryAreas: ['Downtown', 'Midtown', 'Galleria', 'Medical Center'],
        foundedYear: 1993,
        activeProjects: 12,
        completedProjects: 38,
        totalValue: 950000000,
        averagePrice: 0
      },
      {
        name: 'StreetLights Residential',
        companyType: 'Private Developer',
        website: 'https://streetlightsresidential.com',
        headquarters: 'Dallas, TX (Houston Division)',
        primaryFocus: 'Multifamily',
        secondaryFocus: 'Mixed Use',
        targetMarket: ['Market Rate', 'Luxury'],
        primaryAreas: ['Heights', 'Montrose', 'EaDo', 'River Oaks District'],
        foundedYear: 2009,
        activeProjects: 6,
        completedProjects: 22,
        totalValue: 485000000,
        averagePrice: 0
      },
      {
        name: 'Hines',
        companyType: 'Private Developer',
        website: 'https://hines.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Mixed Use',
        secondaryFocus: 'Commercial',
        targetMarket: ['Luxury', 'Commercial'],
        primaryAreas: ['Downtown', 'Galleria', 'Energy Corridor', 'Memorial City'],
        foundedYear: 1957,
        activeProjects: 15,
        completedProjects: 125,
        totalValue: 2500000000,
        averagePrice: 0
      },
      
      // Specialty and Boutique Builders
      {
        name: 'Sitterle Homes',
        companyType: 'Private Builder',
        website: 'https://sitterlehomes.com',
        headquarters: 'San Antonio, TX (Houston Division)',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Townhomes',
        targetMarket: ['Entry Level', 'Move-Up'],
        primaryAreas: ['Northwest Harris', 'Cypress', 'Tomball', 'Spring'],
        foundedYear: 1992,
        activeProjects: 12,
        completedProjects: 85,
        totalValue: 385000000,
        averagePrice: 325000
      },
      {
        name: 'Sandcastle Homes',
        companyType: 'Private Builder',
        website: 'https://sandcastlehomes.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Custom Homes',
        secondaryFocus: 'Spec Homes',
        targetMarket: ['Luxury', 'Custom'],
        primaryAreas: ['Clear Lake', 'League City', 'Nassau Bay', 'Friendswood'],
        foundedYear: 1998,
        activeProjects: 18,
        completedProjects: 125,
        totalValue: 285000000,
        averagePrice: 485000
      },
      {
        name: 'Plantation Homes',
        companyType: 'Private Builder',
        website: 'https://plantationhomes.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Semi-Custom',
        targetMarket: ['Move-Up', 'Luxury'],
        primaryAreas: ['Katy', 'Cinco Ranch', 'Sugar Land', 'Richmond'],
        foundedYear: 1985,
        activeProjects: 14,
        completedProjects: 195,
        totalValue: 485000000,
        averagePrice: 425000
      },
      {
        name: 'Trendmaker Homes',
        companyType: 'Private Builder',
        website: 'https://trendmakerhomes.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Luxury Homes',
        targetMarket: ['Move-Up', 'Luxury'],
        primaryAreas: ['Katy', 'The Woodlands', 'Sugar Land', 'Pearland'],
        foundedYear: 1971,
        activeProjects: 20,
        completedProjects: 285,
        totalValue: 785000000,
        averagePrice: 525000
      },
      {
        name: 'Shea Homes',
        companyType: 'Private Builder',
        website: 'https://sheahomes.com',
        headquarters: 'San Diego, CA (Houston Division)',
        primaryFocus: 'Active Adult',
        secondaryFocus: 'Single Family',
        targetMarket: ['Active Adult', 'Empty Nesters'],
        primaryAreas: ['Katy', 'Sugar Land', 'The Woodlands', 'Cypress'],
        foundedYear: 1968,
        activeProjects: 8,
        completedProjects: 45,
        totalValue: 325000000,
        averagePrice: 485000
      },
      
      // Commercial Developers
      {
        name: 'Patrinely Group',
        companyType: 'Private Developer',
        website: 'https://patrinely.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Commercial',
        secondaryFocus: 'Mixed Use',
        targetMarket: ['Office', 'Retail', 'Mixed Use'],
        primaryAreas: ['Downtown', 'Energy Corridor', 'Westchase', 'Galleria'],
        foundedYear: 1979,
        activeProjects: 12,
        completedProjects: 85,
        totalValue: 1500000000,
        averagePrice: 0
      },
      {
        name: 'MetroNational',
        companyType: 'Private Developer',
        website: 'https://metronational.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Mixed Use',
        secondaryFocus: 'Retail',
        targetMarket: ['Mixed Use', 'Retail'],
        primaryAreas: ['Galleria', 'Memorial City', 'Town Center', 'Sugar Land'],
        foundedYear: 1985,
        activeProjects: 8,
        completedProjects: 45,
        totalValue: 850000000,
        averagePrice: 0
      },
      {
        name: 'Crescent Real Estate',
        companyType: 'Private Developer',
        website: 'https://crescentrealestate.com',
        headquarters: 'Fort Worth, TX (Houston Office)',
        primaryFocus: 'Mixed Use',
        secondaryFocus: 'Luxury Residential',
        targetMarket: ['Luxury', 'Mixed Use'],
        primaryAreas: ['River Oaks District', 'Highland Village', 'Galleria'],
        foundedYear: 1994,
        activeProjects: 6,
        completedProjects: 28,
        totalValue: 1200000000,
        averagePrice: 0
      },
      {
        name: 'Howard Hughes Corporation',
        companyType: 'Public Developer',
        website: 'https://howardhughes.com',
        headquarters: 'Dallas, TX (Houston Office)',
        primaryFocus: 'Master Planned',
        secondaryFocus: 'Mixed Use',
        targetMarket: ['Master Planned', 'Mixed Use'],
        primaryAreas: ['The Woodlands', 'Bridgeland', 'Downtown'],
        foundedYear: 2010,
        activeProjects: 8,
        completedProjects: 25,
        totalValue: 2800000000,
        averagePrice: 0
      },
      
      // Affordable Housing Developers
      {
        name: 'Archstone Communities',
        companyType: 'Private Developer',
        website: 'https://archstonecommunities.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Affordable Housing',
        secondaryFocus: 'Workforce Housing',
        targetMarket: ['Affordable', 'Workforce Housing'],
        primaryAreas: ['East Houston', 'Southwest', 'North Houston', 'Alief'],
        foundedYear: 2005,
        activeProjects: 15,
        completedProjects: 65,
        totalValue: 285000000,
        averagePrice: 185000
      },
      {
        name: 'CDC Houston',
        companyType: 'Non-Profit',
        website: 'https://cdchouston.org',
        headquarters: 'Houston, TX',
        primaryFocus: 'Affordable Housing',
        secondaryFocus: 'Community Development',
        targetMarket: ['Low Income', 'First Time Buyers'],
        primaryAreas: ['Third Ward', 'Fifth Ward', 'Near Northside', 'East End'],
        foundedYear: 1988,
        activeProjects: 12,
        completedProjects: 85,
        totalValue: 165000000,
        averagePrice: 125000
      },
      
      // Industrial/Warehouse Developers
      {
        name: 'Prologis',
        companyType: 'REIT',
        website: 'https://prologis.com',
        headquarters: 'San Francisco, CA (Houston Office)',
        primaryFocus: 'Industrial',
        secondaryFocus: 'Logistics',
        targetMarket: ['Industrial', 'Logistics'],
        primaryAreas: ['East Houston', 'North Belt', 'South Belt', 'Port Area'],
        foundedYear: 1983,
        activeProjects: 18,
        completedProjects: 125,
        totalValue: 1800000000,
        averagePrice: 0
      },
      {
        name: 'Bridge Development Partners',
        companyType: 'Private Developer',
        website: 'https://bridgedevelopment.com',
        headquarters: 'Chicago, IL (Houston Office)',
        primaryFocus: 'Industrial',
        secondaryFocus: 'E-Commerce',
        targetMarket: ['Industrial', 'Distribution'],
        primaryAreas: ['Northwest Harris', 'Beltway 8', 'I-45 Corridor', 'US 290'],
        foundedYear: 2000,
        activeProjects: 12,
        completedProjects: 45,
        totalValue: 950000000,
        averagePrice: 0
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    let existingCount = 0;
    
    for (const developer of houstonDevelopers) {
      try {
        // Check if developer already exists
        const existing = await prisma.developer.findFirst({
          where: { name: developer.name }
        });
        
        if (!existing) {
          await prisma.developer.create({
            data: developer
          });
          successCount++;
          console.log(`✅ Added ${developer.name} (${developer.companyType})`);
        } else {
          existingCount++;
          console.log(`⏭️  ${developer.name} already exists`);
        }
      } catch (error) {
        console.error(`❌ Error adding ${developer.name}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} new developers`);
    console.log(`⏭️  Already existed: ${existingCount} developers`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Final count and analysis
    const finalCount = await prisma.developer.count();
    console.log(`📈 Total developers in database: ${finalCount}`);
    
    // Show breakdown by type
    const byType = await prisma.$queryRaw`
      SELECT "companyType", COUNT(*) as count
      FROM "Developer"
      GROUP BY "companyType"
      ORDER BY count DESC
    `;
    
    console.log('\n🏗️  Developer Types:');
    // @ts-ignore
    byType.forEach(type => {
      console.log(`   ${type.companyType}: ${type.count}`);
    });
    
    // Show breakdown by focus
    const byFocus = await prisma.$queryRaw`
      SELECT "primaryFocus", COUNT(*) as count
      FROM "Developer"
      GROUP BY "primaryFocus"
      ORDER BY count DESC
      LIMIT 10
    `;
    
    console.log('\n🎯 Primary Focus Areas:');
    // @ts-ignore
    byFocus.forEach(focus => {
      console.log(`   ${focus.primaryFocus}: ${focus.count}`);
    });
    
  } catch (error) {
    console.error('💥 Critical error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importHoustonDevelopers().catch(console.error);