import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importHoustonDemographicsFixed() {
  console.log('📊 Terminal 3: Importing Houston Demographics (Fixed Schema)...');
  
  try {
    const currentCount = await prisma.areaDemographics.count();
    console.log(`📊 Current demographics count: ${currentCount}`);
    
    // Houston area demographics matching the actual schema
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
        neighborhood: 'Midtown Houston',
        zipCode: '77006',
        totalPopulation: 8900,
        householdCount: 4200,
        medianAge: 29.8,
        avgHouseholdSize: 2.1,
        ownerOccupiedPercent: 22.3,
        renterOccupiedPercent: 77.7,
        vacancyRate: 9.8,
        medianHomeValue: 325000,
        under18Percent: 8.5,
        over65Percent: 6.2,
        workingAgePercent: 85.3,
        whitePercent: 48.5,
        blackPercent: 15.2,
        hispanicPercent: 25.5,
        asianPercent: 8.8,
        otherRacePercent: 2.0,
        reportYear: 2024
      },
      {
        neighborhood: 'Montrose',
        zipCode: '77006',
        totalPopulation: 35000,
        householdCount: 18500,
        medianAge: 35.2,
        avgHouseholdSize: 1.9,
        ownerOccupiedPercent: 28.5,
        renterOccupiedPercent: 71.5,
        vacancyRate: 7.2,
        medianHomeValue: 485000,
        under18Percent: 10.2,
        over65Percent: 12.5,
        workingAgePercent: 77.3,
        whitePercent: 52.5,
        blackPercent: 12.8,
        hispanicPercent: 22.5,
        asianPercent: 10.2,
        otherRacePercent: 2.0,
        reportYear: 2024
      },
      
      // Affluent Areas
      {
        neighborhood: 'River Oaks',
        zipCode: '77019',
        totalPopulation: 25000,
        householdCount: 9800,
        medianAge: 42.5,
        avgHouseholdSize: 2.5,
        ownerOccupiedPercent: 78.5,
        renterOccupiedPercent: 21.5,
        vacancyRate: 4.2,
        medianHomeValue: 2850000,
        under18Percent: 18.5,
        over65Percent: 22.8,
        workingAgePercent: 58.7,
        whitePercent: 82.5,
        blackPercent: 2.8,
        hispanicPercent: 8.5,
        asianPercent: 5.2,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      {
        neighborhood: 'Memorial',
        zipCode: '77024',
        totalPopulation: 48000,
        householdCount: 18500,
        medianAge: 39.8,
        avgHouseholdSize: 2.6,
        ownerOccupiedPercent: 82.3,
        renterOccupiedPercent: 17.7,
        vacancyRate: 3.8,
        medianHomeValue: 985000,
        under18Percent: 22.5,
        over65Percent: 18.2,
        workingAgePercent: 59.3,
        whitePercent: 78.5,
        blackPercent: 3.2,
        hispanicPercent: 10.5,
        asianPercent: 6.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      {
        neighborhood: 'West University',
        zipCode: '77005',
        totalPopulation: 15000,
        householdCount: 5200,
        medianAge: 38.5,
        avgHouseholdSize: 2.9,
        ownerOccupiedPercent: 85.2,
        renterOccupiedPercent: 14.8,
        vacancyRate: 2.5,
        medianHomeValue: 1250000,
        under18Percent: 28.5,
        over65Percent: 15.2,
        workingAgePercent: 56.3,
        whitePercent: 85.2,
        blackPercent: 1.8,
        hispanicPercent: 6.5,
        asianPercent: 5.5,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      
      // Family Suburbs - Using neighborhoods instead of city names
      {
        neighborhood: 'Cinco Ranch',
        zipCode: '77494',
        totalPopulation: 65000,
        householdCount: 20000,
        medianAge: 35.2,
        avgHouseholdSize: 3.2,
        ownerOccupiedPercent: 75.8,
        renterOccupiedPercent: 24.2,
        vacancyRate: 5.2,
        medianHomeValue: 385000,
        under18Percent: 32.5,
        over65Percent: 8.2,
        workingAgePercent: 59.3,
        whitePercent: 48.5,
        blackPercent: 8.2,
        hispanicPercent: 22.5,
        asianPercent: 18.8,
        otherRacePercent: 2.0,
        reportYear: 2024
      },
      {
        neighborhood: 'First Colony',
        zipCode: '77479',
        totalPopulation: 45000,
        householdCount: 15000,
        medianAge: 37.8,
        avgHouseholdSize: 3.0,
        ownerOccupiedPercent: 78.2,
        renterOccupiedPercent: 21.8,
        vacancyRate: 4.8,
        medianHomeValue: 425000,
        under18Percent: 28.5,
        over65Percent: 12.5,
        workingAgePercent: 59.0,
        whitePercent: 35.5,
        blackPercent: 12.2,
        hispanicPercent: 18.5,
        asianPercent: 31.8,
        otherRacePercent: 2.0,
        reportYear: 2024
      },
      {
        neighborhood: 'Grogan\'s Mill',
        zipCode: '77380',
        totalPopulation: 28000,
        householdCount: 11000,
        medianAge: 38.2,
        avgHouseholdSize: 2.6,
        ownerOccupiedPercent: 72.5,
        renterOccupiedPercent: 27.5,
        vacancyRate: 6.2,
        medianHomeValue: 485000,
        under18Percent: 24.5,
        over65Percent: 16.2,
        workingAgePercent: 59.3,
        whitePercent: 72.5,
        blackPercent: 4.2,
        hispanicPercent: 12.5,
        asianPercent: 9.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      
      // Urban Core
      {
        neighborhood: 'The Heights',
        zipCode: '77008',
        totalPopulation: 42000,
        householdCount: 18500,
        medianAge: 33.5,
        avgHouseholdSize: 2.3,
        ownerOccupiedPercent: 52.3,
        renterOccupiedPercent: 47.7,
        vacancyRate: 6.2,
        medianHomeValue: 585000,
        under18Percent: 18.5,
        over65Percent: 10.2,
        workingAgePercent: 71.3,
        whitePercent: 68.5,
        blackPercent: 8.2,
        hispanicPercent: 18.5,
        asianPercent: 3.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      {
        neighborhood: 'EaDo',
        zipCode: '77003',
        totalPopulation: 15000,
        householdCount: 7200,
        medianAge: 31.2,
        avgHouseholdSize: 2.1,
        ownerOccupiedPercent: 35.2,
        renterOccupiedPercent: 64.8,
        vacancyRate: 8.5,
        medianHomeValue: 325000,
        under18Percent: 15.5,
        over65Percent: 8.2,
        workingAgePercent: 76.3,
        whitePercent: 38.5,
        blackPercent: 22.2,
        hispanicPercent: 32.5,
        asianPercent: 5.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      
      // Medical/Educational Districts
      {
        neighborhood: 'Medical Center',
        zipCode: '77030',
        totalPopulation: 35000,
        householdCount: 15000,
        medianAge: 30.5,
        avgHouseholdSize: 2.3,
        ownerOccupiedPercent: 18.5,
        renterOccupiedPercent: 81.5,
        vacancyRate: 10.2,
        medianHomeValue: 285000,
        under18Percent: 12.5,
        over65Percent: 8.2,
        workingAgePercent: 79.3,
        whitePercent: 42.5,
        blackPercent: 18.2,
        hispanicPercent: 22.5,
        asianPercent: 14.8,
        otherRacePercent: 2.0,
        reportYear: 2024
      },
      {
        neighborhood: 'Museum District',
        zipCode: '77004',
        totalPopulation: 22000,
        householdCount: 10500,
        medianAge: 34.2,
        avgHouseholdSize: 2.1,
        ownerOccupiedPercent: 32.5,
        renterOccupiedPercent: 67.5,
        vacancyRate: 8.8,
        medianHomeValue: 425000,
        under18Percent: 14.5,
        over65Percent: 12.2,
        workingAgePercent: 73.3,
        whitePercent: 52.5,
        blackPercent: 15.2,
        hispanicPercent: 20.5,
        asianPercent: 10.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      
      // Business Districts
      {
        neighborhood: 'Galleria',
        zipCode: '77056',
        totalPopulation: 28000,
        householdCount: 14500,
        medianAge: 35.8,
        avgHouseholdSize: 1.9,
        ownerOccupiedPercent: 25.8,
        renterOccupiedPercent: 74.2,
        vacancyRate: 11.2,
        medianHomeValue: 325000,
        under18Percent: 8.5,
        over65Percent: 14.2,
        workingAgePercent: 77.3,
        whitePercent: 58.5,
        blackPercent: 8.2,
        hispanicPercent: 22.5,
        asianPercent: 9.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      {
        neighborhood: 'Energy Corridor',
        zipCode: '77079',
        totalPopulation: 85000,
        householdCount: 35000,
        medianAge: 36.5,
        avgHouseholdSize: 2.4,
        ownerOccupiedPercent: 48.5,
        renterOccupiedPercent: 51.5,
        vacancyRate: 9.2,
        medianHomeValue: 285000,
        under18Percent: 22.5,
        over65Percent: 12.2,
        workingAgePercent: 65.3,
        whitePercent: 48.5,
        blackPercent: 12.2,
        hispanicPercent: 25.5,
        asianPercent: 12.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      
      // Diverse Communities
      {
        neighborhood: 'Alief',
        zipCode: '77072',
        totalPopulation: 95000,
        householdCount: 28000,
        medianAge: 32.5,
        avgHouseholdSize: 3.4,
        ownerOccupiedPercent: 45.2,
        renterOccupiedPercent: 54.8,
        vacancyRate: 8.5,
        medianHomeValue: 165000,
        under18Percent: 32.5,
        over65Percent: 8.2,
        workingAgePercent: 59.3,
        whitePercent: 12.5,
        blackPercent: 28.2,
        hispanicPercent: 38.5,
        asianPercent: 18.8,
        otherRacePercent: 2.0,
        reportYear: 2024
      },
      {
        neighborhood: 'Sharpstown',
        zipCode: '77074',
        totalPopulation: 85000,
        householdCount: 25000,
        medianAge: 33.8,
        avgHouseholdSize: 3.4,
        ownerOccupiedPercent: 42.8,
        renterOccupiedPercent: 57.2,
        vacancyRate: 9.8,
        medianHomeValue: 145000,
        under18Percent: 30.5,
        over65Percent: 10.2,
        workingAgePercent: 59.3,
        whitePercent: 15.5,
        blackPercent: 25.2,
        hispanicPercent: 42.5,
        asianPercent: 14.8,
        otherRacePercent: 2.0,
        reportYear: 2024
      },
      {
        neighborhood: 'East End',
        zipCode: '77011',
        totalPopulation: 65000,
        householdCount: 18000,
        medianAge: 31.2,
        avgHouseholdSize: 3.6,
        ownerOccupiedPercent: 48.5,
        renterOccupiedPercent: 51.5,
        vacancyRate: 10.2,
        medianHomeValue: 125000,
        under18Percent: 35.5,
        over65Percent: 8.2,
        workingAgePercent: 56.3,
        whitePercent: 8.5,
        blackPercent: 5.2,
        hispanicPercent: 82.5,
        asianPercent: 2.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      
      // Growing Areas
      {
        neighborhood: 'Spring',
        zipCode: '77373',
        totalPopulation: 78000,
        householdCount: 26000,
        medianAge: 35.5,
        avgHouseholdSize: 3.0,
        ownerOccupiedPercent: 65.8,
        renterOccupiedPercent: 34.2,
        vacancyRate: 7.2,
        medianHomeValue: 285000,
        under18Percent: 28.5,
        over65Percent: 10.2,
        workingAgePercent: 61.3,
        whitePercent: 42.5,
        blackPercent: 22.2,
        hispanicPercent: 25.5,
        asianPercent: 8.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      {
        neighborhood: 'Clear Lake',
        zipCode: '77058',
        totalPopulation: 68000,
        householdCount: 25000,
        medianAge: 37.2,
        avgHouseholdSize: 2.7,
        ownerOccupiedPercent: 68.5,
        renterOccupiedPercent: 31.5,
        vacancyRate: 6.8,
        medianHomeValue: 325000,
        under18Percent: 24.5,
        over65Percent: 14.2,
        workingAgePercent: 61.3,
        whitePercent: 62.5,
        blackPercent: 8.2,
        hispanicPercent: 18.5,
        asianPercent: 9.8,
        otherRacePercent: 1.0,
        reportYear: 2024
      },
      
      // Historic Areas
      {
        neighborhood: 'Third Ward',
        zipCode: '77004',
        totalPopulation: 22000,
        householdCount: 8500,
        medianAge: 34.8,
        avgHouseholdSize: 2.6,
        ownerOccupiedPercent: 38.5,
        renterOccupiedPercent: 61.5,
        vacancyRate: 12.5,
        medianHomeValue: 185000,
        under18Percent: 22.5,
        over65Percent: 14.2,
        workingAgePercent: 63.3,
        whitePercent: 12.5,
        blackPercent: 72.2,
        hispanicPercent: 12.5,
        asianPercent: 2.8,
        otherRacePercent: 0.0,
        reportYear: 2024
      },
      {
        neighborhood: 'Fifth Ward',
        zipCode: '77020',
        totalPopulation: 18000,
        householdCount: 6200,
        medianAge: 36.2,
        avgHouseholdSize: 2.9,
        ownerOccupiedPercent: 42.3,
        renterOccupiedPercent: 57.7,
        vacancyRate: 14.2,
        medianHomeValue: 125000,
        under18Percent: 28.5,
        over65Percent: 12.2,
        workingAgePercent: 59.3,
        whitePercent: 8.5,
        blackPercent: 68.2,
        hispanicPercent: 20.5,
        asianPercent: 2.8,
        otherRacePercent: 0.0,
        reportYear: 2024
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    console.log(`\n🚀 Starting import of ${houstonDemographics.length} demographic records...`);
    
    for (const demo of houstonDemographics) {
      try {
        // Check if already exists
        const existing = await prisma.areaDemographics.findFirst({
          where: { 
            neighborhood: demo.neighborhood,
            reportYear: demo.reportYear
          }
        });
        
        if (existing) {
          skippedCount++;
          console.log(`⏭️  Skipped ${demo.neighborhood} - already exists`);
          continue;
        }
        
        await prisma.areaDemographics.create({
          data: demo
        });
        
        successCount++;
        const income = demo.medianHomeValue.toLocaleString();
        console.log(`✅ Added ${demo.neighborhood} (ZIP: ${demo.zipCode}) - Home Value: $${income}`);
      } catch (error) {
        console.error(`❌ Error adding ${demo.neighborhood}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} demographic records`);
    console.log(`⏭️  Skipped: ${skippedCount} (already existed)`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Final statistics
    const finalCount = await prisma.areaDemographics.count();
    console.log(`\n📈 Total demographics in database: ${finalCount}`);
    
    // Show demographics summary
    const avgValues = await prisma.areaDemographics.aggregate({
      _avg: {
        medianAge: true,
        medianHomeValue: true,
        avgHouseholdSize: true,
        ownerOccupiedPercent: true
      }
    });
    
    console.log('\n🏘️  Demographics Summary:');
    console.log(`   Avg Median Age: ${avgValues._avg.medianAge?.toFixed(1)} years`);
    console.log(`   Avg Home Value: $${Math.round(avgValues._avg.medianHomeValue || 0).toLocaleString()}`);
    console.log(`   Avg Household Size: ${avgValues._avg.avgHouseholdSize?.toFixed(1)}`);
    console.log(`   Avg Owner Occupied: ${avgValues._avg.ownerOccupiedPercent?.toFixed(1)}%`);
    
    // Show home value distribution
    console.log('\n💰 Home Value Distribution:');
    const valueRanges = await prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN "medianHomeValue" < 200000 THEN 'Under $200K'
          WHEN "medianHomeValue" < 400000 THEN '$200K-$400K'
          WHEN "medianHomeValue" < 600000 THEN '$400K-$600K'
          WHEN "medianHomeValue" < 1000000 THEN '$600K-$1M'
          ELSE 'Over $1M'
        END as value_range,
        COUNT(*) as count
      FROM "AreaDemographics"
      GROUP BY value_range
      ORDER BY MIN("medianHomeValue")
    `;
    
    // @ts-ignore
    valueRanges.forEach(range => {
      console.log(`   ${range.value_range}: ${range.count} areas`);
    });
    
  } catch (error) {
    console.error('💥 Critical error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importHoustonDemographicsFixed().catch(console.error);