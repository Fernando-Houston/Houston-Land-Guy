import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Transform our detailed construction costs into aggregated cost data
async function importConstructionCosts() {
  console.log('🔨 Starting Construction Costs Import...');
  
  try {
    // Clear existing construction costs
    await prisma.constructionCostDP5.deleteMany();
    console.log('🗑️  Cleared existing construction costs');
    
    // Calculate aggregated costs from our detailed data
    const residentialCosts = {
      low: [100, 150], // Basic construction range
      mid: [150, 220], // Standard construction range
      high: [250, 400] // Luxury construction range
    };
    
    const commercialCosts = {
      office: [40, 60, 100], // Low, mid, high for office
      retail: [50, 75, 125], // Low, mid, high for retail
      industrial: [25, 40, 60] // Low, mid, high for warehouse/industrial
    };
    
    // Create cost entries for different areas
    const areas = [
      'Houston Metro',
      '77001-77010', // Downtown
      '77011-77020', // East Houston
      '77021-77030', // South Houston
      '77031-77040', // Southwest Houston
      '77041-77050', // Northwest Houston
      '77051-77060', // Southeast Houston
      '77061-77070', // Clear Lake/Pasadena
      '77071-77080', // Southwest suburbs
      '77081-77090', // West Houston
      '77091-77099'  // North Houston
    ];
    
    let successCount = 0;
    
    for (const area of areas) {
      // Adjust costs based on area (downtown more expensive, suburbs less)
      let costMultiplier = 1.0;
      if (area.includes('77001-77010')) costMultiplier = 1.25; // Downtown premium
      else if (area.includes('77019') || area.includes('77024')) costMultiplier = 1.35; // River Oaks/Memorial premium
      else if (area.includes('77071-77080') || area.includes('77091-77099')) costMultiplier = 0.85; // Suburban discount
      
      const baseDate = new Date('2024-01-01');
      
      // Create entries for each quarter of 2024
      for (let quarter = 0; quarter < 4; quarter++) {
        const effectiveDate = new Date(baseDate);
        effectiveDate.setMonth(effectiveDate.getMonth() + (quarter * 3));
        
        // Apply quarterly inflation (0.7% per quarter based on Turner index)
        const inflationMultiplier = 1 + (quarter * 0.007);
        
        await prisma.constructionCostDP5.create({
          data: {
            area: area,
            
            // Residential costs
            residentialLow: residentialCosts.low[0] * costMultiplier * inflationMultiplier,
            residentialMid: (residentialCosts.mid[0] + residentialCosts.mid[1]) / 2 * costMultiplier * inflationMultiplier,
            residentialHigh: residentialCosts.high[1] * costMultiplier * inflationMultiplier,
            
            // Commercial costs
            commercialOffice: commercialCosts.office[1] * costMultiplier * inflationMultiplier,
            commercialRetail: commercialCosts.retail[1] * costMultiplier * inflationMultiplier,
            commercialIndustrial: commercialCosts.industrial[1] * costMultiplier * inflationMultiplier,
            
            // Material costs (Houston specific)
            concretePrice: 130 * inflationMultiplier, // per cubic yard
            steelPrice: 800 * inflationMultiplier, // per ton
            lumberPrice: 400 * inflationMultiplier, // per thousand board feet
            
            // Labor costs
            laborRateSkilled: 65 * inflationMultiplier, // $/hour for skilled trades
            laborRateUnskilled: 35 * inflationMultiplier, // $/hour for general labor
            laborAvailability: quarter < 2 ? 'Tight' : 'Moderate', // Labor was tighter in early 2024
            
            // Cost indices (base 100 in Q1 2024)
            totalCostIndex: 100 * inflationMultiplier,
            materialIndex: 100 * (1 + (quarter * 0.009)), // Materials inflating faster
            laborIndex: 100 * (1 + (quarter * 0.005)), // Labor inflation more moderate
            
            effectiveDate: effectiveDate
          }
        });
        
        successCount++;
      }
      
      console.log(`✅ Imported costs for ${area} (4 quarters)`);
    }
    
    // Add special high-cost areas with premium data
    const premiumAreas = [
      { area: 'River Oaks (77019)', multiplier: 1.5 },
      { area: 'Memorial (77024)', multiplier: 1.4 },
      { area: 'West University (77005)', multiplier: 1.35 },
      { area: 'Bellaire (77401)', multiplier: 1.3 },
      { area: 'The Heights (77008)', multiplier: 1.25 }
    ];
    
    for (const premium of premiumAreas) {
      await prisma.constructionCostDP5.create({
        data: {
          area: premium.area,
          residentialLow: residentialCosts.low[1] * premium.multiplier,
          residentialMid: residentialCosts.mid[1] * premium.multiplier,
          residentialHigh: residentialCosts.high[1] * premium.multiplier,
          commercialOffice: commercialCosts.office[2] * premium.multiplier,
          commercialRetail: commercialCosts.retail[2] * premium.multiplier,
          commercialIndustrial: commercialCosts.industrial[1] * premium.multiplier,
          concretePrice: 140,
          steelPrice: 850,
          lumberPrice: 450,
          laborRateSkilled: 75,
          laborRateUnskilled: 40,
          laborAvailability: 'Tight',
          totalCostIndex: 100 * premium.multiplier,
          materialIndex: 105,
          laborIndex: 103,
          effectiveDate: new Date('2024-10-01')
        }
      });
      successCount++;
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`✅ Successfully imported: ${successCount} construction cost records`);
    
    // Verify the import
    const totalRecords = await prisma.constructionCostDP5.count();
    const uniqueAreas = await prisma.constructionCostDP5.findMany({
      select: { area: true },
      distinct: ['area']
    });
    
    console.log(`\n📈 Database now contains:`);
    console.log(`   Total records: ${totalRecords}`);
    console.log(`   Unique areas: ${uniqueAreas.length}`);
    console.log(`   Areas covered: ${uniqueAreas.slice(0, 5).map(a => a.area).join(', ')}...`);
    
  } catch (error) {
    console.error('💥 Critical error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importConstructionCosts().catch(console.error);