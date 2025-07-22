import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importAdditionalDevelopers() {
  console.log('🏗️  Importing Additional Houston Developers...');
  
  try {
    const currentCount = await prisma.developer.count();
    console.log(`📊 Current developer count: ${currentCount}`);
    
    // Additional developers to reach 75+ total
    const additionalDevelopers = [
      // More National Builders
      {
        name: 'Beazer Homes',
        companyType: 'Public Builder',
        website: 'https://beazer.com',
        headquarters: 'Atlanta, GA (Houston Division)',
        primaryFocus: 'Single Family',
        secondaryFocus: 'First Time Buyers',
        targetMarket: ['Entry Level', 'Move-Up'],
        primaryAreas: ['Katy', 'Conroe', 'Pearland', 'League City'],
        foundedYear: 1985,
        activeProjects: 14,
        completedProjects: 85,
        totalValue: 485000000,
        averagePrice: 315000
      },
      {
        name: 'Meritage Homes',
        companyType: 'Public Builder',
        website: 'https://meritagehomes.com',
        headquarters: 'Scottsdale, AZ (Houston Division)',
        primaryFocus: 'Energy Efficient',
        secondaryFocus: 'Single Family',
        targetMarket: ['Move-Up', 'Energy Conscious'],
        primaryAreas: ['Katy', 'Sugar Land', 'Cypress', 'Spring'],
        foundedYear: 1985,
        activeProjects: 12,
        completedProjects: 65,
        totalValue: 425000000,
        averagePrice: 385000
      },
      {
        name: 'Taylor Morrison',
        companyType: 'Public Builder',
        website: 'https://taylormorrison.com',
        headquarters: 'Scottsdale, AZ (Houston Division)',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Luxury Homes',
        targetMarket: ['Move-Up', 'Luxury'],
        primaryAreas: ['Katy', 'The Woodlands', 'Pearland', 'League City'],
        foundedYear: 1936,
        activeProjects: 16,
        completedProjects: 95,
        totalValue: 585000000,
        averagePrice: 425000
      },
      {
        name: 'Century Communities',
        companyType: 'Public Builder',
        website: 'https://centurycommunities.com',
        headquarters: 'Greenwood Village, CO (Houston Division)',
        primaryFocus: 'Single Family',
        secondaryFocus: 'Townhomes',
        targetMarket: ['First Time', 'Move-Up'],
        primaryAreas: ['Northwest Harris', 'Conroe', 'Willis', 'Huntsville'],
        foundedYear: 1982,
        activeProjects: 18,
        completedProjects: 125,
        totalValue: 485000000,
        averagePrice: 295000
      },
      
      // Local Houston Custom Builders
      {
        name: 'Frankel Building Group',
        companyType: 'Private Builder',
        website: 'https://frankelbuildinggroup.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Custom Homes',
        secondaryFocus: 'Luxury Homes',
        targetMarket: ['Luxury', 'Custom'],
        primaryAreas: ['River Oaks', 'Memorial', 'Tanglewood', 'West University'],
        foundedYear: 1996,
        activeProjects: 28,
        completedProjects: 185,
        totalValue: 485000000,
        averagePrice: 1250000
      },
      {
        name: 'Thompson Custom Homes',
        companyType: 'Private Builder',
        website: 'https://thompsoncustomhomes.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Custom Homes',
        secondaryFocus: 'Spec Homes',
        targetMarket: ['Luxury', 'Custom'],
        primaryAreas: ['The Heights', 'Memorial', 'River Oaks', 'Bellaire'],
        foundedYear: 1989,
        activeProjects: 22,
        completedProjects: 285,
        totalValue: 385000000,
        averagePrice: 985000
      },
      {
        name: 'Castle Custom Homes',
        companyType: 'Private Builder',
        website: 'https://castlecustomhomes.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Custom Homes',
        secondaryFocus: 'Luxury Renovations',
        targetMarket: ['Ultra Luxury', 'Custom'],
        primaryAreas: ['River Oaks', 'Memorial', 'Tanglewood', 'West University'],
        foundedYear: 1992,
        activeProjects: 15,
        completedProjects: 125,
        totalValue: 285000000,
        averagePrice: 1850000
      },
      {
        name: 'Distinctive Homes',
        companyType: 'Private Builder',
        website: 'https://distinctivehomes.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Custom Homes',
        secondaryFocus: 'Semi-Custom',
        targetMarket: ['Luxury', 'Semi-Custom'],
        primaryAreas: ['Katy', 'Sugar Land', 'The Woodlands', 'Cypress'],
        foundedYear: 1998,
        activeProjects: 32,
        completedProjects: 195,
        totalValue: 485000000,
        averagePrice: 785000
      },
      {
        name: 'Collaborate Builders',
        companyType: 'Private Builder',
        website: 'https://collaboratebuilders.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Modern Custom',
        secondaryFocus: 'Sustainable Building',
        targetMarket: ['Modern Luxury', 'Eco-Conscious'],
        primaryAreas: ['The Heights', 'Montrose', 'EaDo', 'Rice Military'],
        foundedYear: 2008,
        activeProjects: 18,
        completedProjects: 85,
        totalValue: 185000000,
        averagePrice: 685000
      },
      
      // More Multifamily Developers
      {
        name: 'MAA (Mid-America Apartment Communities)',
        companyType: 'REIT',
        website: 'https://maac.com',
        headquarters: 'Memphis, TN (Houston Division)',
        primaryFocus: 'Luxury Apartments',
        secondaryFocus: 'Mixed Use',
        targetMarket: ['Luxury Renters', 'Young Professionals'],
        primaryAreas: ['Galleria', 'Memorial City', 'Energy Corridor', 'The Woodlands'],
        foundedYear: 1994,
        activeProjects: 8,
        completedProjects: 32,
        totalValue: 850000000,
        averagePrice: 0
      },
      {
        name: 'AMLI Residential',
        companyType: 'Private Developer',
        website: 'https://amli.com',
        headquarters: 'Chicago, IL (Houston Office)',
        primaryFocus: 'Luxury Apartments',
        secondaryFocus: 'Urban Living',
        targetMarket: ['Luxury Renters', 'Urban Professionals'],
        primaryAreas: ['Downtown', 'Galleria', 'River Oaks District', 'Memorial City'],
        foundedYear: 1970,
        activeProjects: 6,
        completedProjects: 25,
        totalValue: 685000000,
        averagePrice: 0
      },
      {
        name: 'Alliance Residential',
        companyType: 'Private Developer',
        website: 'https://allresi.com',
        headquarters: 'Phoenix, AZ (Houston Office)',
        primaryFocus: 'Multifamily',
        secondaryFocus: 'Build-to-Rent',
        targetMarket: ['Market Rate', 'Luxury'],
        primaryAreas: ['Katy', 'Sugar Land', 'The Woodlands', 'Cypress'],
        foundedYear: 1974,
        activeProjects: 10,
        completedProjects: 45,
        totalValue: 485000000,
        averagePrice: 0
      },
      {
        name: 'Wood Partners',
        companyType: 'Private Developer',
        website: 'https://woodpartners.com',
        headquarters: 'Atlanta, GA (Houston Office)',
        primaryFocus: 'Multifamily',
        secondaryFocus: 'Transit-Oriented',
        targetMarket: ['Market Rate', 'TOD'],
        primaryAreas: ['Medical Center', 'Galleria', 'Energy Corridor', 'Downtown'],
        foundedYear: 1990,
        activeProjects: 8,
        completedProjects: 28,
        totalValue: 385000000,
        averagePrice: 0
      },
      
      // Industrial & Warehouse Developers
      {
        name: 'EastGroup Properties',
        companyType: 'REIT',
        website: 'https://eastgroup.net',
        headquarters: 'Jackson, MS (Houston Office)',
        primaryFocus: 'Industrial',
        secondaryFocus: 'Distribution',
        targetMarket: ['Industrial', 'Logistics'],
        primaryAreas: ['Northwest Belt', 'East Houston', 'South Belt', 'Westchase'],
        foundedYear: 1969,
        activeProjects: 12,
        completedProjects: 65,
        totalValue: 785000000,
        averagePrice: 0
      },
      {
        name: 'First Industrial Realty Trust',
        companyType: 'REIT',
        website: 'https://firstindustrial.com',
        headquarters: 'Chicago, IL (Houston Office)',
        primaryFocus: 'Industrial',
        secondaryFocus: 'E-Commerce',
        targetMarket: ['Industrial', 'Last Mile'],
        primaryAreas: ['Beltway 8', 'I-45 Corridor', 'US 290', 'Hardy Toll Road'],
        foundedYear: 1994,
        activeProjects: 10,
        completedProjects: 55,
        totalValue: 685000000,
        averagePrice: 0
      },
      {
        name: 'Duke Realty',
        companyType: 'REIT',
        website: 'https://dukerealty.com',
        headquarters: 'Indianapolis, IN (Houston Office)',
        primaryFocus: 'Industrial',
        secondaryFocus: 'Logistics',
        targetMarket: ['Industrial', 'Distribution'],
        primaryAreas: ['Northwest Harris', 'Katy', 'Cypress', 'Spring'],
        foundedYear: 1972,
        activeProjects: 8,
        completedProjects: 42,
        totalValue: 585000000,
        averagePrice: 0
      },
      
      // Retail & Commercial Developers
      {
        name: 'Weingarten Realty',
        companyType: 'REIT',
        website: 'https://weingarten.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Retail',
        secondaryFocus: 'Shopping Centers',
        targetMarket: ['Retail', 'Grocery Anchored'],
        primaryAreas: ['Throughout Houston Metro'],
        foundedYear: 1948,
        activeProjects: 8,
        completedProjects: 185,
        totalValue: 2500000000,
        averagePrice: 0
      },
      {
        name: 'Regency Centers',
        companyType: 'REIT',
        website: 'https://regencycenters.com',
        headquarters: 'Jacksonville, FL (Houston Office)',
        primaryFocus: 'Retail',
        secondaryFocus: 'Grocery Anchored',
        targetMarket: ['Retail', 'Community Centers'],
        primaryAreas: ['Katy', 'Sugar Land', 'The Woodlands', 'Clear Lake'],
        foundedYear: 1963,
        activeProjects: 6,
        completedProjects: 45,
        totalValue: 485000000,
        averagePrice: 0
      },
      {
        name: 'Shops Development',
        companyType: 'Private Developer',
        website: 'https://shopsdevelopment.com',
        headquarters: 'Houston, TX',
        primaryFocus: 'Retail',
        secondaryFocus: 'Mixed Use',
        targetMarket: ['Retail', 'Entertainment'],
        primaryAreas: ['Energy Corridor', 'Katy', 'Sugar Land', 'Clear Lake'],
        foundedYear: 1985,
        activeProjects: 12,
        completedProjects: 85,
        totalValue: 385000000,
        averagePrice: 0
      },
      
      // Office & Mixed-Use Developers
      {
        name: 'Brookfield Properties',
        companyType: 'Private Developer',
        website: 'https://brookfieldproperties.com',
        headquarters: 'New York, NY (Houston Office)',
        primaryFocus: 'Office',
        secondaryFocus: 'Mixed Use',
        targetMarket: ['Class A Office', 'Mixed Use'],
        primaryAreas: ['Downtown', 'Galleria', 'Energy Corridor', 'Westchase'],
        foundedYear: 1899,
        activeProjects: 8,
        completedProjects: 45,
        totalValue: 1250000000,
        averagePrice: 0
      },
      {
        name: 'Invesco Real Estate',
        companyType: 'Investment Manager',
        website: 'https://invesco.com',
        headquarters: 'Atlanta, GA (Houston Office)',
        primaryFocus: 'Office',
        secondaryFocus: 'Industrial',
        targetMarket: ['Institutional', 'Core Properties'],
        primaryAreas: ['Downtown', 'Galleria', 'Energy Corridor'],
        foundedYear: 1978,
        activeProjects: 6,
        completedProjects: 28,
        totalValue: 985000000,
        averagePrice: 0
      },
      {
        name: 'Skanska USA',
        companyType: 'International Developer',
        website: 'https://usa.skanska.com',
        headquarters: 'Stockholm, Sweden (Houston Office)',
        primaryFocus: 'Mixed Use',
        secondaryFocus: 'Sustainable Development',
        targetMarket: ['Mixed Use', 'Green Building'],
        primaryAreas: ['Downtown', 'Medical Center', 'Energy Corridor'],
        foundedYear: 1887,
        activeProjects: 4,
        completedProjects: 18,
        totalValue: 685000000,
        averagePrice: 0
      },
      
      // Specialty Developers
      {
        name: 'Memorial Hermann',
        companyType: 'Healthcare System',
        website: 'https://memorialhermann.org',
        headquarters: 'Houston, TX',
        primaryFocus: 'Healthcare',
        secondaryFocus: 'Medical Office',
        targetMarket: ['Healthcare', 'Medical'],
        primaryAreas: ['Medical Center', 'Memorial City', 'Katy', 'Sugar Land'],
        foundedYear: 1997,
        activeProjects: 12,
        completedProjects: 85,
        totalValue: 1500000000,
        averagePrice: 0
      },
      {
        name: 'Texas Medical Center',
        companyType: 'Non-Profit',
        website: 'https://tmc.edu',
        headquarters: 'Houston, TX',
        primaryFocus: 'Medical',
        secondaryFocus: 'Research',
        targetMarket: ['Medical', 'Academic'],
        primaryAreas: ['Medical Center', 'South Main'],
        foundedYear: 1945,
        activeProjects: 8,
        completedProjects: 125,
        totalValue: 3500000000,
        averagePrice: 0
      },
      {
        name: 'Rice University',
        companyType: 'Educational Institution',
        website: 'https://rice.edu',
        headquarters: 'Houston, TX',
        primaryFocus: 'Educational',
        secondaryFocus: 'Research',
        targetMarket: ['Academic', 'Research'],
        primaryAreas: ['Rice Village', 'Medical Center', 'Museum District'],
        foundedYear: 1912,
        activeProjects: 6,
        completedProjects: 45,
        totalValue: 485000000,
        averagePrice: 0
      },
      {
        name: 'University of Houston',
        companyType: 'Educational Institution',
        website: 'https://uh.edu',
        headquarters: 'Houston, TX',
        primaryFocus: 'Educational',
        secondaryFocus: 'Student Housing',
        targetMarket: ['Academic', 'Student Housing'],
        primaryAreas: ['University of Houston', 'Third Ward', 'EaDo'],
        foundedYear: 1927,
        activeProjects: 8,
        completedProjects: 65,
        totalValue: 385000000,
        averagePrice: 0
      },
      
      // Senior Living Developers
      {
        name: 'Brookdale Senior Living',
        companyType: 'Public Company',
        website: 'https://brookdale.com',
        headquarters: 'Brentwood, TN (Houston Operations)',
        primaryFocus: 'Senior Living',
        secondaryFocus: 'Memory Care',
        targetMarket: ['Senior Living', 'Assisted Living'],
        primaryAreas: ['Katy', 'Sugar Land', 'The Woodlands', 'Memorial'],
        foundedYear: 1978,
        activeProjects: 8,
        completedProjects: 32,
        totalValue: 285000000,
        averagePrice: 0
      },
      {
        name: 'Capital Senior Living',
        companyType: 'Public Company',
        website: 'https://capitalsenior.com',
        headquarters: 'Dallas, TX (Houston Operations)',
        primaryFocus: 'Senior Living',
        secondaryFocus: 'Independent Living',
        targetMarket: ['Senior Living', 'Active Adult'],
        primaryAreas: ['West Houston', 'Clear Lake', 'Northwest Harris'],
        foundedYear: 1996,
        activeProjects: 6,
        completedProjects: 24,
        totalValue: 185000000,
        averagePrice: 0
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    let existingCount = 0;
    
    for (const developer of additionalDevelopers) {
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
    
    // Show comprehensive breakdown
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
    
    // Show top developers by total value
    const topByValue = await prisma.developer.findMany({
      orderBy: { totalValue: 'desc' },
      take: 10,
      select: {
        name: true,
        totalValue: true,
        companyType: true,
        primaryFocus: true
      }
    });
    
    console.log('\n💰 Top 10 Developers by Total Value:');
    topByValue.forEach((dev, index) => {
      const value = dev.totalValue > 0 ? `$${(dev.totalValue / 1000000000).toFixed(1)}B` : 'N/A';
      console.log(`   ${index + 1}. ${dev.name}: ${value} (${dev.primaryFocus})`);
    });
    
  } catch (error) {
    console.error('💥 Critical error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importAdditionalDevelopers().catch(console.error);