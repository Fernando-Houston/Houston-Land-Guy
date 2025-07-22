import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateDataQuality() {
  console.log('🔍 Running Comprehensive Data Quality Validation...');
  
  try {
    let issues = 0;
    let checks = 0;
    
    console.log('\n📊 Checking Core Tables...');
    
    // Check Developers
    checks++;
    const devsWithNullNames = await prisma.developer.count({
      where: { 
        OR: [
          { name: '' },
          { name: 'undefined' }
        ]
      }
    });
    if (devsWithNullNames > 0) {
      console.log(`❌ Found ${devsWithNullNames} developers with null/undefined names`);
      issues++;
    } else {
      console.log(`✅ All developers have valid names`);
    }
    
    // Check Projects
    checks++;
    const projectsWithNullNames = await prisma.project.count({
      where: { 
        OR: [
          { name: '' },
          { name: 'undefined' }
        ]
      }
    });
    if (projectsWithNullNames > 0) {
      console.log(`❌ Found ${projectsWithNullNames} projects with null/undefined names`);
      issues++;
    } else {
      console.log(`✅ All projects have valid names`);
    }
    
    // Check Market Metrics for $0 prices
    checks++;
    const zeroPrice = await prisma.marketMetrics.count({
      where: { 
        OR: [
          { averagePrice: 0 },
          { medianPrice: 0 }
        ]
      }
    });
    if (zeroPrice > 0) {
      console.log(`❌ Found ${zeroPrice} market metrics with $0 prices`);
      issues++;
    } else {
      console.log(`✅ All market metrics have valid prices`);
    }
    
    // Check Quality of Life for optional fields that should have data
    checks++;
    const qolMissingData = await prisma.qualityOfLife.count({
      where: { 
        OR: [
          { avgSchoolRating: null },
          { restaurantsCount: null },
          { schoolsCount: null }
        ]
      }
    });
    if (qolMissingData > 0) {
      console.log(`⚠️  Found ${qolMissingData} quality of life records missing optional data`);
    } else {
      console.log(`✅ All quality of life records have complete optional data`);
    }
    
    // Check Construction Costs
    checks++;
    const constructionCosts = await prisma.constructionCostDP5.count();
    if (constructionCosts < 100) {
      console.log(`⚠️  Construction costs: ${constructionCosts} (target: 100+)`);
    } else {
      console.log(`✅ Construction costs: ${constructionCosts} (meets target)`);
    }
    
    console.log('\n🏘️  Checking Neighborhood Data...');
    
    // Check for undefined neighborhoods in Market Metrics
    checks++;
    const undefinedNeighborhoods = await prisma.marketMetrics.count({
      where: { 
        OR: [
          { areaName: 'undefined' },
          { areaName: '' }
        ]
      }
    });
    if (undefinedNeighborhoods > 0) {
      console.log(`❌ Found ${undefinedNeighborhoods} market metrics with undefined area names`);
      issues++;
    } else {
      console.log(`✅ All market metrics have valid area names`);
    }
    
    // Check Market Metrics data completeness
    checks++;
    const incompleteMarketData = await prisma.marketMetrics.count({
      where: { 
        AND: [
          { areaType: 'neighborhood' },
          { OR: [
            { activeListings: { lte: 0 } },
            { closedSales: { lte: 0 } },
            { averagePrice: { lte: 50000 } } // Suspiciously low
          ]}
        ]
      }
    });
    if (incompleteMarketData > 0) {
      console.log(`⚠️  Found ${incompleteMarketData} neighborhood market records with suspicious data`);
    } else {
      console.log(`✅ All neighborhood market data appears valid`);
    }
    
    console.log('\n💰 Checking Price Ranges...');
    
    // Check for reasonable price ranges
    checks++;
    const priceRanges = await prisma.marketMetrics.aggregate({
      where: { areaType: 'neighborhood' },
      _min: { averagePrice: true },
      _max: { averagePrice: true },
      _avg: { averagePrice: true }
    });
    
    if (priceRanges._min.averagePrice && priceRanges._max.averagePrice) {
      console.log(`📊 Price range: $${priceRanges._min.averagePrice.toLocaleString()} - $${priceRanges._max.averagePrice.toLocaleString()}`);
      console.log(`📊 Average price: $${Math.round(priceRanges._avg.averagePrice || 0).toLocaleString()}`);
      
      if (priceRanges._min.averagePrice < 100000) {
        console.log(`⚠️  Minimum price seems low: $${priceRanges._min.averagePrice.toLocaleString()}`);
      }
      if (priceRanges._max.averagePrice > 5000000) {
        console.log(`⚠️  Maximum price seems high: $${priceRanges._max.averagePrice.toLocaleString()}`);
      }
    }
    
    console.log('\n🔗 Checking Data Relationships...');
    
    // All projects must have developers (developerId is required field)
    console.log(`✅ All projects have assigned developers (required by schema)`);
    
    // Check developer project counts
    checks++;
    const devsWithProjects = await prisma.developer.count({
      where: {
        projects: {
          some: {}
        }
      }
    });
    const totalDevs = await prisma.developer.count();
    const devsWithoutProjects = totalDevs - devsWithProjects;
    
    if (devsWithoutProjects > totalDevs * 0.3) { // More than 30% without projects
      console.log(`⚠️  ${devsWithoutProjects} developers have no assigned projects (${Math.round(devsWithoutProjects/totalDevs*100)}%)`);
    } else {
      console.log(`✅ Developer-project assignment looks good (${devsWithoutProjects} devs without projects)`);
    }
    
    console.log('\n📈 Summary Statistics...');
    
    // Overall statistics
    const totalRecords = await prisma.$transaction([
      prisma.developer.count(),
      prisma.project.count(),
      prisma.property.count(),
      prisma.marketMetrics.count(),
      prisma.qualityOfLife.count(),
      prisma.constructionCostDP5.count(),
      prisma.permit.count(),
      prisma.areaDemographics.count(),
      prisma.populationProjection.count(),
      prisma.economicIndicatorDP5.count()
    ]);
    
    const [developers, projects, properties, marketMetrics, qualityOfLife, constructionCostCount, permits, demographics, population, economic] = totalRecords;
    const total = totalRecords.reduce((sum, count) => sum + count, 0);
    
    console.log(`📊 Core Tables:`);
    console.log(`   Developers: ${developers}`);
    console.log(`   Projects: ${projects}`);
    console.log(`   Properties: ${properties}`);
    console.log(`   Market Metrics: ${marketMetrics}`);
    console.log(`   Quality of Life: ${qualityOfLife}`);
    console.log(`   Construction Costs: ${constructionCosts}`);
    console.log(`   Permits: ${permits}`);
    console.log(`   Demographics: ${demographics}`);
    console.log(`   Population Projections: ${population}`);
    console.log(`   Economic Indicators: ${economic}`);
    console.log(`   TOTAL: ${total} records`);
    
    // Data quality score
    const qualityScore = ((checks - issues) / checks) * 100;
    console.log(`\n🎯 Data Quality Score: ${qualityScore.toFixed(1)}% (${checks - issues}/${checks} checks passed)`);
    
    if (qualityScore >= 90) {
      console.log(`🏆 Excellent data quality!`);
    } else if (qualityScore >= 80) {
      console.log(`✅ Good data quality`);
    } else if (qualityScore >= 70) {
      console.log(`⚠️  Acceptable data quality, some improvements needed`);
    } else {
      console.log(`❌ Poor data quality, significant issues need attention`);
    }
    
    // Platform completion
    const targetRecords = 5000;
    const completionPercentage = (total / targetRecords) * 100;
    console.log(`\n🚀 Platform Completion: ${completionPercentage.toFixed(1)}% (${total}/${targetRecords} records)`);
    
    if (completionPercentage >= 70) {
      console.log(`🎉 Excellent progress! Platform is ready for production use.`);
    } else if (completionPercentage >= 50) {
      console.log(`✅ Good progress! Platform has solid foundation.`);
    } else {
      console.log(`⚠️  More data needed for comprehensive platform.`);
    }
    
  } catch (error) {
    console.error('💥 Critical error during validation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the validation
validateDataQuality().catch(console.error);