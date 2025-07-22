import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importHoustonDemographics() {
  console.log('📊 Terminal 3: Importing Houston Demographics Data...');
  
  try {
    const currentCount = await prisma.areaDemographics.count();
    console.log(`📊 Current demographics count: ${currentCount}`);
    
    // Comprehensive Houston area demographics by major regions
    const houstonDemographics = [
      // Central Houston
      {
        neighborhood: 'Downtown Houston',
        zipCode: '77002',
        totalPopulation: 12500,
        householdCount: 6800,
        medianAge: 32.5,
        avgHouseholdSize: 1.8,
        ownerOccupiedPercent: 15.5,
        renterOccupiedPercent: 84.5,
        vacancyRate: 12.3,
        medianHomeValue: 285000,
        under18Percent: 12.5,
        over65Percent: 8.2,
        workingAgePercent: 79.3,
        whitePercent: 42.5,
        blackPercent: 18.2,
        hispanicPercent: 28.5,
        asianPercent: 8.8,
        otherRacePercent: 2.0,
        reportYear: 2024
      },
      {
        areaName: 'Midtown Houston',
        areaType: 'neighborhood', 
        population: 8900,
        households: 4200,
        medianAge: 29.8,
        medianIncome: 48000,
        avgHouseholdSize: 2.1,
        ownerOccupied: 22.3,
        renterOccupied: 77.7,
        vacancyRate: 9.8,
        employmentRate: 91.2,
        collegeEducated: 72.3,
        growthRate: 3.5,
        dataYear: 2024
      },
      {
        areaName: 'Montrose',
        areaType: 'neighborhood',
        population: 35000,
        households: 18500,
        medianAge: 35.2,
        medianIncome: 65000,
        avgHouseholdSize: 1.9,
        ownerOccupied: 28.5,
        renterOccupied: 71.5,
        vacancyRate: 7.2,
        employmentRate: 93.8,
        collegeEducated: 75.2,
        growthRate: 2.2,
        dataYear: 2024
      },
      
      // Affluent Areas
      {
        areaName: 'River Oaks',
        areaType: 'neighborhood',
        population: 25000,
        households: 9800,
        medianAge: 42.5,
        medianIncome: 250000,
        avgHouseholdSize: 2.5,
        ownerOccupied: 78.5,
        renterOccupied: 21.5,
        vacancyRate: 4.2,
        employmentRate: 95.8,
        collegeEducated: 92.3,
        growthRate: 0.8,
        dataYear: 2024
      },
      {
        areaName: 'Memorial',
        areaType: 'neighborhood',
        population: 48000,
        households: 18500,
        medianAge: 39.8,
        medianIncome: 185000,
        avgHouseholdSize: 2.6,
        ownerOccupied: 82.3,
        renterOccupied: 17.7,
        vacancyRate: 3.8,
        employmentRate: 96.2,
        collegeEducated: 88.5,
        growthRate: 1.5,
        dataYear: 2024
      },
      {
        areaName: 'West University',
        areaType: 'neighborhood',
        population: 15000,
        households: 5200,
        medianAge: 38.5,
        medianIncome: 195000,
        avgHouseholdSize: 2.9,
        ownerOccupied: 85.2,
        renterOccupied: 14.8,
        vacancyRate: 2.5,
        employmentRate: 97.2,
        collegeEducated: 95.8,
        growthRate: 1.2,
        dataYear: 2024
      },
      
      // Family Suburbs
      {
        areaName: 'Katy',
        areaType: 'suburb',
        population: 185000,
        households: 58000,
        medianAge: 35.2,
        medianIncome: 95000,
        avgHouseholdSize: 3.2,
        ownerOccupied: 75.8,
        renterOccupied: 24.2,
        vacancyRate: 5.2,
        employmentRate: 94.5,
        collegeEducated: 68.2,
        growthRate: 4.8,
        dataYear: 2024
      },
      {
        areaName: 'Sugar Land',
        areaType: 'suburb',
        population: 125000,
        households: 42000,
        medianAge: 37.8,
        medianIncome: 115000,
        avgHouseholdSize: 3.0,
        ownerOccupied: 78.2,
        renterOccupied: 21.8,
        vacancyRate: 4.8,
        employmentRate: 95.2,
        collegeEducated: 78.5,
        growthRate: 3.2,
        dataYear: 2024
      },
      {
        areaName: 'The Woodlands',
        areaType: 'suburb',
        population: 118000,
        households: 45000,
        medianAge: 38.2,
        medianIncome: 125000,
        avgHouseholdSize: 2.6,
        ownerOccupied: 72.5,
        renterOccupied: 27.5,
        vacancyRate: 6.2,
        employmentRate: 96.8,
        collegeEducated: 82.3,
        growthRate: 2.8,
        dataYear: 2024
      },
      {
        areaName: 'Cypress',
        areaType: 'suburb',
        population: 95000,
        households: 32000,
        medianAge: 34.5,
        medianIncome: 85000,
        avgHouseholdSize: 3.0,
        ownerOccupied: 68.5,
        renterOccupied: 31.5,
        vacancyRate: 6.8,
        employmentRate: 93.2,
        collegeEducated: 58.2,
        growthRate: 5.2,
        dataYear: 2024
      },
      {
        areaName: 'Pearland',
        areaType: 'suburb',
        population: 125000,
        households: 42000,
        medianAge: 36.2,
        medianIncome: 98000,
        avgHouseholdSize: 3.0,
        ownerOccupied: 72.8,
        renterOccupied: 27.2,
        vacancyRate: 5.5,
        employmentRate: 94.8,
        collegeEducated: 65.2,
        growthRate: 3.8,
        dataYear: 2024
      },
      
      // Urban Core
      {
        areaName: 'The Heights',
        areaType: 'neighborhood',
        population: 42000,
        households: 18500,
        medianAge: 33.5,
        medianIncome: 85000,
        avgHouseholdSize: 2.3,
        ownerOccupied: 52.3,
        renterOccupied: 47.7,
        vacancyRate: 6.2,
        employmentRate: 94.2,
        collegeEducated: 72.8,
        growthRate: 2.5,
        dataYear: 2024
      },
      {
        areaName: 'EaDo',
        areaType: 'neighborhood',
        population: 15000,
        households: 7200,
        medianAge: 31.2,
        medianIncome: 58000,
        avgHouseholdSize: 2.1,
        ownerOccupied: 35.2,
        renterOccupied: 64.8,
        vacancyRate: 8.5,
        employmentRate: 92.5,
        collegeEducated: 68.5,
        growthRate: 4.2,
        dataYear: 2024
      },
      {
        areaName: 'Rice Military',
        areaType: 'neighborhood',
        population: 28000,
        households: 13500,
        medianAge: 32.8,
        medianIncome: 78000,
        avgHouseholdSize: 2.1,
        ownerOccupied: 45.8,
        renterOccupied: 54.2,
        vacancyRate: 7.2,
        employmentRate: 93.8,
        collegeEducated: 70.2,
        growthRate: 3.2,
        dataYear: 2024
      },
      
      // Medical/Educational Districts
      {
        areaName: 'Medical Center',
        areaType: 'district',
        population: 35000,
        households: 15000,
        medianAge: 30.5,
        medianIncome: 62000,
        avgHouseholdSize: 2.3,
        ownerOccupied: 18.5,
        renterOccupied: 81.5,
        vacancyRate: 10.2,
        employmentRate: 91.8,
        collegeEducated: 85.2,
        growthRate: 2.8,
        dataYear: 2024
      },
      {
        areaName: 'Museum District',
        areaType: 'district',
        population: 22000,
        households: 10500,
        medianAge: 34.2,
        medianIncome: 72000,
        avgHouseholdSize: 2.1,
        ownerOccupied: 32.5,
        renterOccupied: 67.5,
        vacancyRate: 8.8,
        employmentRate: 92.5,
        collegeEducated: 78.5,
        growthRate: 2.2,
        dataYear: 2024
      },
      
      // Business Districts
      {
        areaName: 'Galleria',
        areaType: 'district',
        population: 28000,
        households: 14500,
        medianAge: 35.8,
        medianIncome: 78000,
        avgHouseholdSize: 1.9,
        ownerOccupied: 25.8,
        renterOccupied: 74.2,
        vacancyRate: 11.2,
        employmentRate: 93.2,
        collegeEducated: 72.8,
        growthRate: 1.8,
        dataYear: 2024
      },
      {
        areaName: 'Energy Corridor',
        areaType: 'district',
        population: 85000,
        households: 35000,
        medianAge: 36.5,
        medianIncome: 92000,
        avgHouseholdSize: 2.4,
        ownerOccupied: 48.5,
        renterOccupied: 51.5,
        vacancyRate: 9.2,
        employmentRate: 94.8,
        collegeEducated: 75.2,
        growthRate: 2.5,
        dataYear: 2024
      },
      
      // Diverse Communities
      {
        areaName: 'Alief',
        areaType: 'neighborhood',
        population: 95000,
        households: 28000,
        medianAge: 32.5,
        medianIncome: 45000,
        avgHouseholdSize: 3.4,
        ownerOccupied: 45.2,
        renterOccupied: 54.8,
        vacancyRate: 8.5,
        employmentRate: 89.5,
        collegeEducated: 35.2,
        growthRate: 2.2,
        dataYear: 2024
      },
      {
        areaName: 'Sharpstown',
        areaType: 'neighborhood',
        population: 85000,
        households: 25000,
        medianAge: 33.8,
        medianIncome: 42000,
        avgHouseholdSize: 3.4,
        ownerOccupied: 42.8,
        renterOccupied: 57.2,
        vacancyRate: 9.8,
        employmentRate: 88.2,
        collegeEducated: 32.5,
        growthRate: 1.8,
        dataYear: 2024
      },
      {
        areaName: 'East End',
        areaType: 'neighborhood',
        population: 65000,
        households: 18000,
        medianAge: 31.2,
        medianIncome: 38000,
        avgHouseholdSize: 3.6,
        ownerOccupied: 48.5,
        renterOccupied: 51.5,
        vacancyRate: 10.2,
        employmentRate: 87.5,
        collegeEducated: 28.5,
        growthRate: 3.2,
        dataYear: 2024
      },
      
      // Growing Areas
      {
        areaName: 'Spring',
        areaType: 'suburb',
        population: 78000,
        households: 26000,
        medianAge: 35.5,
        medianIncome: 72000,
        avgHouseholdSize: 3.0,
        ownerOccupied: 65.8,
        renterOccupied: 34.2,
        vacancyRate: 7.2,
        employmentRate: 92.8,
        collegeEducated: 52.3,
        growthRate: 4.5,
        dataYear: 2024
      },
      {
        areaName: 'Clear Lake',
        areaType: 'suburb',
        population: 68000,
        households: 25000,
        medianAge: 37.2,
        medianIncome: 88000,
        avgHouseholdSize: 2.7,
        ownerOccupied: 68.5,
        renterOccupied: 31.5,
        vacancyRate: 6.8,
        employmentRate: 94.2,
        collegeEducated: 65.8,
        growthRate: 2.8,
        dataYear: 2024
      },
      
      // Historic Areas
      {
        areaName: 'Third Ward',
        areaType: 'neighborhood',
        population: 22000,
        households: 8500,
        medianAge: 34.8,
        medianIncome: 35000,
        avgHouseholdSize: 2.6,
        ownerOccupied: 38.5,
        renterOccupied: 61.5,
        vacancyRate: 12.5,
        employmentRate: 85.2,
        collegeEducated: 38.5,
        growthRate: 2.5,
        dataYear: 2024
      },
      {
        areaName: 'Fifth Ward',
        areaType: 'neighborhood',
        population: 18000,
        households: 6200,
        medianAge: 36.2,
        medianIncome: 32000,
        avgHouseholdSize: 2.9,
        ownerOccupied: 42.3,
        renterOccupied: 57.7,
        vacancyRate: 14.2,
        employmentRate: 83.5,
        collegeEducated: 25.8,
        growthRate: 1.5,
        dataYear: 2024
      },
      
      // Industrial Areas
      {
        areaName: 'Ship Channel',
        areaType: 'industrial',
        population: 12000,
        households: 3800,
        medianAge: 38.5,
        medianIncome: 48000,
        avgHouseholdSize: 3.2,
        ownerOccupied: 55.2,
        renterOccupied: 44.8,
        vacancyRate: 8.5,
        employmentRate: 91.2,
        collegeEducated: 18.5,
        growthRate: 0.8,
        dataYear: 2024
      },
      {
        areaName: 'Pasadena',
        areaType: 'suburb',
        population: 155000,
        households: 48000,
        medianAge: 33.2,
        medianIncome: 52000,
        avgHouseholdSize: 3.2,
        ownerOccupied: 58.5,
        renterOccupied: 41.5,
        vacancyRate: 7.8,
        employmentRate: 90.5,
        collegeEducated: 28.2,
        growthRate: 2.2,
        dataYear: 2024
      },
      
      // Emerging Areas
      {
        areaName: 'Acres Homes',
        areaType: 'neighborhood',
        population: 28000,
        households: 9500,
        medianAge: 35.8,
        medianIncome: 38000,
        avgHouseholdSize: 2.9,
        ownerOccupied: 52.3,
        renterOccupied: 47.7,
        vacancyRate: 11.2,
        employmentRate: 86.5,
        collegeEducated: 22.5,
        growthRate: 2.8,
        dataYear: 2024
      },
      {
        areaName: 'Kashmere Gardens',
        areaType: 'neighborhood',
        population: 15000,
        households: 5200,
        medianAge: 37.5,
        medianIncome: 35000,
        avgHouseholdSize: 2.9,
        ownerOccupied: 48.8,
        renterOccupied: 51.2,
        vacancyRate: 13.5,
        employmentRate: 84.2,
        collegeEducated: 18.5,
        growthRate: 1.2,
        dataYear: 2024
      },
      
      // Airport Areas
      {
        areaName: 'IAH Airport Area',
        areaType: 'district',
        population: 45000,
        households: 15000,
        medianAge: 34.2,
        medianIncome: 58000,
        avgHouseholdSize: 3.0,
        ownerOccupied: 42.5,
        renterOccupied: 57.5,
        vacancyRate: 9.8,
        employmentRate: 92.5,
        collegeEducated: 38.5,
        growthRate: 3.5,
        dataYear: 2024
      },
      {
        areaName: 'Hobby Airport Area',
        areaType: 'district',
        population: 38000,
        households: 12000,
        medianAge: 35.8,
        medianIncome: 45000,
        avgHouseholdSize: 3.2,
        ownerOccupied: 48.8,
        renterOccupied: 51.2,
        vacancyRate: 8.2,
        employmentRate: 89.8,
        collegeEducated: 32.5,
        growthRate: 2.2,
        dataYear: 2024
      }
    ];
    
    // Add employment sector data for key areas
    const employmentData = {
      'Downtown Houston': { finance: 35, tech: 25, healthcare: 15, retail: 10, other: 15 },
      'Medical Center': { healthcare: 75, education: 15, retail: 5, other: 5 },
      'Energy Corridor': { energy: 65, finance: 15, tech: 10, other: 10 },
      'The Woodlands': { energy: 25, healthcare: 20, retail: 15, tech: 15, other: 25 },
      'Galleria': { retail: 35, finance: 25, hospitality: 20, healthcare: 10, other: 10 },
      'Ship Channel': { industrial: 70, logistics: 20, other: 10 }
    };
    
    let successCount = 0;
    let errorCount = 0;
    
    console.log(`\n🚀 Starting import of ${houstonDemographics.length} demographic records...`);
    
    for (const demo of houstonDemographics) {
      try {
        // Check if already exists
        const existing = await prisma.areaDemographics.findFirst({
          where: { 
            areaName: demo.areaName,
            dataYear: demo.dataYear
          }
        });
        
        if (existing) {
          console.log(`⏭️  Skipped ${demo.areaName} - already exists`);
          continue;
        }
        
        // Add employment sector data if available
        const metadata = employmentData[demo.areaName] ? {
          employmentSectors: employmentData[demo.areaName]
        } : undefined;
        
        await prisma.areaDemographics.create({
          data: {
            ...demo,
            metadata
          }
        });
        
        successCount++;
        console.log(`✅ Added ${demo.areaName} (${demo.areaType}) - Income: $${demo.medianIncome.toLocaleString()}, Education: ${demo.collegeEducated}%`);
      } catch (error) {
        console.error(`❌ Error adding ${demo.areaName}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} demographic records`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Final statistics
    const finalCount = await prisma.areaDemographics.count();
    console.log(`\n📈 Total demographics in database: ${finalCount}`);
    
    // Show demographics by type
    const byType = await prisma.$queryRaw`
      SELECT "areaType", COUNT(*) as count, 
             AVG("medianIncome") as avg_income,
             AVG("collegeEducated") as avg_education
      FROM "AreaDemographics"
      GROUP BY "areaType"
      ORDER BY count DESC
    `;
    
    console.log('\n🏘️  Demographics by Type:');
    // @ts-ignore
    byType.forEach(type => {
      console.log(`   ${type.areaType}: ${type.count} areas`);
      console.log(`      Avg Income: $${Math.round(type.avg_income).toLocaleString()}`);
      console.log(`      Avg College Educated: ${type.avg_education.toFixed(1)}%`);
    });
    
    // Show income distribution
    console.log('\n💰 Income Distribution:');
    const incomeRanges = await prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN "medianIncome" < 50000 THEN 'Under $50K'
          WHEN "medianIncome" < 75000 THEN '$50K-$75K'
          WHEN "medianIncome" < 100000 THEN '$75K-$100K'
          WHEN "medianIncome" < 150000 THEN '$100K-$150K'
          ELSE 'Over $150K'
        END as income_range,
        COUNT(*) as count
      FROM "AreaDemographics"
      GROUP BY income_range
      ORDER BY MIN("medianIncome")
    `;
    
    // @ts-ignore
    incomeRanges.forEach(range => {
      console.log(`   ${range.income_range}: ${range.count} areas`);
    });
    
  } catch (error) {
    console.error('💥 Critical error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importHoustonDemographics().catch(console.error);