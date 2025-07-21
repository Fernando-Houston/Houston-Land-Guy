import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Comprehensive Houston construction cost data based on 2024-2025 market rates
const constructionCosts = [
  // Foundation Costs
  { category: 'foundation', subcategory: 'Slab Foundation', unit: 'per sqft', lowCost: 4.50, avgCost: 6.50, highCost: 8.50, source: 'Houston Contractor Surveys 2024' },
  { category: 'foundation', subcategory: 'Pier & Beam Foundation', unit: 'per sqft', lowCost: 7.00, avgCost: 10.00, highCost: 15.00, source: 'Houston Contractor Surveys 2024' },
  { category: 'foundation', subcategory: 'Basement Foundation', unit: 'per sqft', lowCost: 25.00, avgCost: 35.00, highCost: 50.00, source: 'Houston Contractor Surveys 2024' },
  { category: 'foundation', subcategory: 'Foundation Repair', unit: 'per pier', lowCost: 250, avgCost: 400, highCost: 600, source: 'Houston Foundation Repair Companies 2024' },
  
  // Framing Costs
  { category: 'framing', subcategory: 'Wood Framing', unit: 'per sqft', lowCost: 12.00, avgCost: 18.00, highCost: 25.00, source: 'Houston Building Association 2024' },
  { category: 'framing', subcategory: 'Steel Framing', unit: 'per sqft', lowCost: 15.00, avgCost: 22.00, highCost: 30.00, source: 'Houston Building Association 2024' },
  { category: 'framing', subcategory: 'Concrete Block', unit: 'per sqft', lowCost: 10.00, avgCost: 14.00, highCost: 18.00, source: 'Houston Building Association 2024' },
  
  // Roofing Costs
  { category: 'roofing', subcategory: 'Asphalt Shingles', unit: 'per sqft', lowCost: 3.50, avgCost: 5.50, highCost: 8.00, source: 'Houston Roofing Contractors 2024' },
  { category: 'roofing', subcategory: 'Metal Roofing', unit: 'per sqft', lowCost: 7.00, avgCost: 10.00, highCost: 15.00, source: 'Houston Roofing Contractors 2024' },
  { category: 'roofing', subcategory: 'Clay Tile', unit: 'per sqft', lowCost: 10.00, avgCost: 15.00, highCost: 25.00, source: 'Houston Roofing Contractors 2024' },
  { category: 'roofing', subcategory: 'Slate Roofing', unit: 'per sqft', lowCost: 12.00, avgCost: 18.00, highCost: 30.00, source: 'Houston Roofing Contractors 2024' },
  
  // Electrical Costs
  { category: 'electrical', subcategory: 'Basic Electrical', unit: 'per sqft', lowCost: 3.00, avgCost: 4.50, highCost: 6.00, source: 'Houston Electrical Contractors 2024' },
  { category: 'electrical', subcategory: 'Upgraded Electrical', unit: 'per sqft', lowCost: 5.00, avgCost: 7.50, highCost: 10.00, source: 'Houston Electrical Contractors 2024' },
  { category: 'electrical', subcategory: 'Smart Home Wiring', unit: 'per sqft', lowCost: 2.00, avgCost: 3.50, highCost: 5.00, source: 'Houston Electrical Contractors 2024' },
  { category: 'electrical', subcategory: 'Panel Upgrade', unit: 'per unit', lowCost: 1500, avgCost: 2500, highCost: 3500, source: 'Houston Electrical Contractors 2024' },
  
  // Plumbing Costs
  { category: 'plumbing', subcategory: 'Basic Plumbing', unit: 'per sqft', lowCost: 4.00, avgCost: 6.00, highCost: 8.00, source: 'Houston Plumbing Contractors 2024' },
  { category: 'plumbing', subcategory: 'Upgraded Plumbing', unit: 'per sqft', lowCost: 6.00, avgCost: 9.00, highCost: 12.00, source: 'Houston Plumbing Contractors 2024' },
  { category: 'plumbing', subcategory: 'Bathroom Addition', unit: 'per bathroom', lowCost: 5000, avgCost: 8000, highCost: 15000, source: 'Houston Plumbing Contractors 2024' },
  { category: 'plumbing', subcategory: 'Kitchen Plumbing', unit: 'per kitchen', lowCost: 3000, avgCost: 5000, highCost: 8000, source: 'Houston Plumbing Contractors 2024' },
  
  // HVAC Costs
  { category: 'hvac', subcategory: 'Central AC (per ton)', unit: 'per ton', lowCost: 1200, avgCost: 1800, highCost: 2500, source: 'Houston HVAC Contractors 2024' },
  { category: 'hvac', subcategory: 'Ductwork', unit: 'per sqft', lowCost: 3.00, avgCost: 5.00, highCost: 7.00, source: 'Houston HVAC Contractors 2024' },
  { category: 'hvac', subcategory: 'Mini-Split System', unit: 'per unit', lowCost: 2000, avgCost: 3500, highCost: 5000, source: 'Houston HVAC Contractors 2024' },
  { category: 'hvac', subcategory: 'High-Efficiency Upgrade', unit: 'per system', lowCost: 500, avgCost: 1500, highCost: 3000, source: 'Houston HVAC Contractors 2024' },
  
  // Insulation Costs
  { category: 'insulation', subcategory: 'Batt Insulation', unit: 'per sqft', lowCost: 0.50, avgCost: 1.00, highCost: 1.50, source: 'Houston Energy Contractors 2024' },
  { category: 'insulation', subcategory: 'Blown-In Insulation', unit: 'per sqft', lowCost: 1.00, avgCost: 1.50, highCost: 2.50, source: 'Houston Energy Contractors 2024' },
  { category: 'insulation', subcategory: 'Spray Foam Insulation', unit: 'per sqft', lowCost: 2.50, avgCost: 3.50, highCost: 5.00, source: 'Houston Energy Contractors 2024' },
  
  // Drywall Costs
  { category: 'interior', subcategory: 'Drywall Installation', unit: 'per sqft', lowCost: 1.50, avgCost: 2.50, highCost: 3.50, source: 'Houston Drywall Contractors 2024' },
  { category: 'interior', subcategory: 'Drywall Finishing', unit: 'per sqft', lowCost: 1.00, avgCost: 1.75, highCost: 2.50, source: 'Houston Drywall Contractors 2024' },
  { category: 'interior', subcategory: 'Texture Application', unit: 'per sqft', lowCost: 0.50, avgCost: 1.00, highCost: 1.50, source: 'Houston Drywall Contractors 2024' },
  
  // Flooring Costs
  { category: 'flooring', subcategory: 'Vinyl Plank', unit: 'per sqft', lowCost: 2.00, avgCost: 4.00, highCost: 6.00, source: 'Houston Flooring Retailers 2024' },
  { category: 'flooring', subcategory: 'Laminate', unit: 'per sqft', lowCost: 1.50, avgCost: 3.50, highCost: 5.00, source: 'Houston Flooring Retailers 2024' },
  { category: 'flooring', subcategory: 'Hardwood', unit: 'per sqft', lowCost: 5.00, avgCost: 8.00, highCost: 15.00, source: 'Houston Flooring Retailers 2024' },
  { category: 'flooring', subcategory: 'Tile', unit: 'per sqft', lowCost: 3.00, avgCost: 6.00, highCost: 12.00, source: 'Houston Flooring Retailers 2024' },
  { category: 'flooring', subcategory: 'Carpet', unit: 'per sqft', lowCost: 1.50, avgCost: 3.00, highCost: 5.00, source: 'Houston Flooring Retailers 2024' },
  { category: 'flooring', subcategory: 'Polished Concrete', unit: 'per sqft', lowCost: 3.00, avgCost: 5.00, highCost: 8.00, source: 'Houston Flooring Retailers 2024' },
  
  // Painting Costs
  { category: 'finishes', subcategory: 'Interior Painting', unit: 'per sqft', lowCost: 1.50, avgCost: 2.50, highCost: 4.00, source: 'Houston Painting Contractors 2024' },
  { category: 'finishes', subcategory: 'Exterior Painting', unit: 'per sqft', lowCost: 2.00, avgCost: 3.50, highCost: 5.00, source: 'Houston Painting Contractors 2024' },
  { category: 'finishes', subcategory: 'Cabinet Painting', unit: 'per kitchen', lowCost: 2000, avgCost: 3500, highCost: 5000, source: 'Houston Painting Contractors 2024' },
  
  // Kitchen Costs
  { category: 'kitchen', subcategory: 'Basic Cabinets', unit: 'per linear ft', lowCost: 100, avgCost: 200, highCost: 350, source: 'Houston Kitchen Suppliers 2024' },
  { category: 'kitchen', subcategory: 'Custom Cabinets', unit: 'per linear ft', lowCost: 350, avgCost: 550, highCost: 1000, source: 'Houston Kitchen Suppliers 2024' },
  { category: 'kitchen', subcategory: 'Granite Countertops', unit: 'per sqft', lowCost: 40, avgCost: 60, highCost: 100, source: 'Houston Kitchen Suppliers 2024' },
  { category: 'kitchen', subcategory: 'Quartz Countertops', unit: 'per sqft', lowCost: 50, avgCost: 75, highCost: 120, source: 'Houston Kitchen Suppliers 2024' },
  { category: 'kitchen', subcategory: 'Basic Appliances', unit: 'per kitchen', lowCost: 2000, avgCost: 4000, highCost: 6000, source: 'Houston Appliance Retailers 2024' },
  { category: 'kitchen', subcategory: 'Premium Appliances', unit: 'per kitchen', lowCost: 6000, avgCost: 12000, highCost: 25000, source: 'Houston Appliance Retailers 2024' },
  
  // Bathroom Costs
  { category: 'bathroom', subcategory: 'Basic Vanity', unit: 'per unit', lowCost: 300, avgCost: 600, highCost: 1200, source: 'Houston Bath Suppliers 2024' },
  { category: 'bathroom', subcategory: 'Custom Vanity', unit: 'per unit', lowCost: 1200, avgCost: 2500, highCost: 5000, source: 'Houston Bath Suppliers 2024' },
  { category: 'bathroom', subcategory: 'Tile Shower', unit: 'per shower', lowCost: 2000, avgCost: 3500, highCost: 6000, source: 'Houston Bath Contractors 2024' },
  { category: 'bathroom', subcategory: 'Glass Shower Enclosure', unit: 'per unit', lowCost: 800, avgCost: 1500, highCost: 3000, source: 'Houston Bath Contractors 2024' },
  
  // Exterior Costs
  { category: 'exterior', subcategory: 'Vinyl Siding', unit: 'per sqft', lowCost: 3.00, avgCost: 5.00, highCost: 7.00, source: 'Houston Siding Contractors 2024' },
  { category: 'exterior', subcategory: 'Hardie Board Siding', unit: 'per sqft', lowCost: 6.00, avgCost: 9.00, highCost: 12.00, source: 'Houston Siding Contractors 2024' },
  { category: 'exterior', subcategory: 'Brick Veneer', unit: 'per sqft', lowCost: 8.00, avgCost: 12.00, highCost: 18.00, source: 'Houston Masonry Contractors 2024' },
  { category: 'exterior', subcategory: 'Stone Veneer', unit: 'per sqft', lowCost: 15.00, avgCost: 25.00, highCost: 40.00, source: 'Houston Masonry Contractors 2024' },
  { category: 'exterior', subcategory: 'Stucco', unit: 'per sqft', lowCost: 6.00, avgCost: 9.00, highCost: 12.00, source: 'Houston Stucco Contractors 2024' },
  
  // Windows and Doors
  { category: 'openings', subcategory: 'Vinyl Windows', unit: 'per window', lowCost: 300, avgCost: 500, highCost: 800, source: 'Houston Window Suppliers 2024' },
  { category: 'openings', subcategory: 'Wood Windows', unit: 'per window', lowCost: 600, avgCost: 1000, highCost: 1800, source: 'Houston Window Suppliers 2024' },
  { category: 'openings', subcategory: 'Entry Door - Basic', unit: 'per door', lowCost: 500, avgCost: 1000, highCost: 1500, source: 'Houston Door Suppliers 2024' },
  { category: 'openings', subcategory: 'Entry Door - Premium', unit: 'per door', lowCost: 1500, avgCost: 3000, highCost: 6000, source: 'Houston Door Suppliers 2024' },
  { category: 'openings', subcategory: 'Interior Doors', unit: 'per door', lowCost: 150, avgCost: 300, highCost: 600, source: 'Houston Door Suppliers 2024' },
  
  // Site Work Costs
  { category: 'sitework', subcategory: 'Land Clearing', unit: 'per acre', lowCost: 2500, avgCost: 4000, highCost: 8000, source: 'Houston Site Contractors 2024' },
  { category: 'sitework', subcategory: 'Excavation', unit: 'per cubic yard', lowCost: 15, avgCost: 25, highCost: 40, source: 'Houston Site Contractors 2024' },
  { category: 'sitework', subcategory: 'Fill Dirt', unit: 'per cubic yard', lowCost: 15, avgCost: 25, highCost: 35, source: 'Houston Site Contractors 2024' },
  { category: 'sitework', subcategory: 'Concrete Driveway', unit: 'per sqft', lowCost: 4.00, avgCost: 6.00, highCost: 10.00, source: 'Houston Concrete Contractors 2024' },
  { category: 'sitework', subcategory: 'Asphalt Driveway', unit: 'per sqft', lowCost: 2.50, avgCost: 4.00, highCost: 6.00, source: 'Houston Paving Contractors 2024' },
  
  // Landscaping Costs
  { category: 'landscaping', subcategory: 'Sod Installation', unit: 'per sqft', lowCost: 0.30, avgCost: 0.50, highCost: 0.80, source: 'Houston Landscapers 2024' },
  { category: 'landscaping', subcategory: 'Sprinkler System', unit: 'per sqft', lowCost: 0.50, avgCost: 0.85, highCost: 1.25, source: 'Houston Landscapers 2024' },
  { category: 'landscaping', subcategory: 'Tree Installation', unit: 'per tree', lowCost: 150, avgCost: 350, highCost: 800, source: 'Houston Landscapers 2024' },
  { category: 'landscaping', subcategory: 'Fence - Wood', unit: 'per linear ft', lowCost: 15, avgCost: 25, highCost: 40, source: 'Houston Fence Contractors 2024' },
  { category: 'landscaping', subcategory: 'Fence - Chain Link', unit: 'per linear ft', lowCost: 10, avgCost: 15, highCost: 25, source: 'Houston Fence Contractors 2024' },
  
  // Pool and Outdoor
  { category: 'outdoor', subcategory: 'Pool - Basic', unit: 'per pool', lowCost: 25000, avgCost: 40000, highCost: 60000, source: 'Houston Pool Builders 2024' },
  { category: 'outdoor', subcategory: 'Pool - Custom', unit: 'per pool', lowCost: 60000, avgCost: 100000, highCost: 200000, source: 'Houston Pool Builders 2024' },
  { category: 'outdoor', subcategory: 'Patio Cover', unit: 'per sqft', lowCost: 8.00, avgCost: 15.00, highCost: 25.00, source: 'Houston Patio Builders 2024' },
  { category: 'outdoor', subcategory: 'Outdoor Kitchen', unit: 'per kitchen', lowCost: 5000, avgCost: 15000, highCost: 40000, source: 'Houston Outdoor Living 2024' },
  
  // Special Houston Considerations
  { category: 'special', subcategory: 'Hurricane Windows', unit: 'per window', lowCost: 600, avgCost: 1000, highCost: 1500, source: 'Houston Hurricane Protection 2024' },
  { category: 'special', subcategory: 'Flood Vents', unit: 'per vent', lowCost: 300, avgCost: 450, highCost: 600, source: 'Houston Flood Mitigation 2024' },
  { category: 'special', subcategory: 'House Elevation', unit: 'per sqft', lowCost: 30, avgCost: 50, highCost: 80, source: 'Houston Foundation Specialists 2024' },
  { category: 'special', subcategory: 'Generator Installation', unit: 'per unit', lowCost: 3000, avgCost: 6000, highCost: 12000, source: 'Houston Electrical Contractors 2024' },
  
  // Labor Rates
  { category: 'labor', subcategory: 'General Labor', unit: 'per hour', lowCost: 25, avgCost: 35, highCost: 45, source: 'Houston Labor Statistics 2024' },
  { category: 'labor', subcategory: 'Skilled Trade', unit: 'per hour', lowCost: 45, avgCost: 65, highCost: 85, source: 'Houston Labor Statistics 2024' },
  { category: 'labor', subcategory: 'Master Plumber', unit: 'per hour', lowCost: 85, avgCost: 120, highCost: 150, source: 'Houston Labor Statistics 2024' },
  { category: 'labor', subcategory: 'Master Electrician', unit: 'per hour', lowCost: 85, avgCost: 120, highCost: 150, source: 'Houston Labor Statistics 2024' },
  { category: 'labor', subcategory: 'Project Manager', unit: 'per hour', lowCost: 65, avgCost: 95, highCost: 125, source: 'Houston Labor Statistics 2024' },
  
  // Permits and Fees
  { category: 'permits', subcategory: 'Building Permit', unit: 'per project', lowCost: 1000, avgCost: 4363, highCost: 10000, source: 'City of Houston 2024' },
  { category: 'permits', subcategory: 'Electrical Permit', unit: 'per project', lowCost: 100, avgCost: 350, highCost: 800, source: 'City of Houston 2024' },
  { category: 'permits', subcategory: 'Plumbing Permit', unit: 'per project', lowCost: 100, avgCost: 350, highCost: 800, source: 'City of Houston 2024' },
  { category: 'permits', subcategory: 'Mechanical Permit', unit: 'per project', lowCost: 100, avgCost: 350, highCost: 800, source: 'City of Houston 2024' },
  { category: 'permits', subcategory: 'Impact Fees', unit: 'per unit', lowCost: 1500, avgCost: 3000, highCost: 5000, source: 'Houston Development 2024' },
  
  // Commercial Construction
  { category: 'commercial', subcategory: 'Office Build-Out', unit: 'per sqft', lowCost: 40, avgCost: 60, highCost: 100, source: 'Houston Commercial Contractors 2024' },
  { category: 'commercial', subcategory: 'Retail Build-Out', unit: 'per sqft', lowCost: 50, avgCost: 75, highCost: 125, source: 'Houston Commercial Contractors 2024' },
  { category: 'commercial', subcategory: 'Restaurant Build-Out', unit: 'per sqft', lowCost: 150, avgCost: 250, highCost: 400, source: 'Houston Commercial Contractors 2024' },
  { category: 'commercial', subcategory: 'Warehouse Space', unit: 'per sqft', lowCost: 25, avgCost: 40, highCost: 60, source: 'Houston Commercial Contractors 2024' },
  { category: 'commercial', subcategory: 'Medical Office', unit: 'per sqft', lowCost: 150, avgCost: 220, highCost: 350, source: 'Houston Commercial Contractors 2024' }
];

async function importConstructionCosts() {
  console.log('🔨 Starting Construction Costs Import...');
  console.log(`📊 Total costs to import: ${constructionCosts.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  try {
    // Clear existing construction costs
    await prisma.constructionCostDP5.deleteMany();
    console.log('🗑️  Cleared existing construction costs');
    
    for (const cost of constructionCosts) {
      try {
        await prisma.constructionCostDP5.create({
          data: {
            area: 'Houston Metro', // Default to Houston Metro
            residentialLow: cost.category === 'construction' && cost.subcategory.includes('Basic') ? cost.avgCost : null,
            residentialMid: cost.category === 'construction' && cost.subcategory.includes('Standard') ? cost.avgCost : null,
            residentialHigh: cost.category === 'construction' && cost.subcategory.includes('Luxury') ? cost.avgCost : null,
            commercialOffice: cost.category === 'commercial' && cost.subcategory.includes('Office') ? cost.avgCost : null,
            commercialRetail: cost.category === 'commercial' && cost.subcategory.includes('Retail') ? cost.avgCost : null,
            commercialIndustrial: cost.category === 'commercial' && cost.subcategory.includes('Warehouse') ? cost.avgCost : null,
            materialCostsPerSqft: cost.category === 'materials' ? cost.avgCost : null,
            laborCostsPerSqft: cost.category === 'labor' ? cost.avgCost : null,
            permitFees: cost.category === 'permits' && cost.subcategory === 'Building Permit' ? cost.avgCost : null,
            reportDate: new Date(),
            lastUpdated: new Date(),
            source: cost.source
          }
        });
        successCount++;
        
        if (successCount % 10 === 0) {
          console.log(`✅ Imported ${successCount} construction costs...`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error importing ${cost.subcategory}:`, error);
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} construction costs`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Get category summary
    const categorySummary = await prisma.constructionCosts.groupBy({
      by: ['category'],
      _count: true
    });
    
    console.log('\n📈 Categories Imported:');
    categorySummary.forEach(cat => {
      console.log(`   ${cat.category}: ${cat._count} items`);
    });
    
  } catch (error) {
    console.error('💥 Critical error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importConstructionCosts().catch(console.error);