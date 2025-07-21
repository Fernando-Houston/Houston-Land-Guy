import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAPIData() {
  console.log('🔍 Testing Houston Development Intelligence API Data Accuracy\n')
  
  // Test 1: Market Metrics
  console.log('1️⃣  Market Metrics Data:')
  const marketMetrics = await prisma.marketMetrics.findFirst({
    orderBy: { startDate: 'desc' }
  })
  console.log('   Latest Market Metrics:')
  console.log(`   - Median Price: $${marketMetrics?.medianPrice || 'N/A'}`)
  console.log(`   - Average Price: $${marketMetrics?.averagePrice || 'N/A'}`)
  console.log(`   - Closed Sales: ${marketMetrics?.closedSales || 'N/A'}`)
  console.log(`   - Days on Market: ${marketMetrics?.avgDaysOnMarket || 'N/A'}`)
  console.log(`   - Active Listings: ${marketMetrics?.activeListings || 'N/A'}`)
  console.log(`   - Inventory: ${marketMetrics?.inventory || 'N/A'} months`)
  
  // Test 2: Neighborhoods
  console.log('\n2️⃣  Neighborhoods Data:')
  const neighborhoodCount = await prisma.harNeighborhoodData.count()
  const topNeighborhoods = await prisma.harNeighborhoodData.findMany({
    take: 5,
    orderBy: { totalSales: 'desc' }
  })
  console.log(`   Total Neighborhoods: ${neighborhoodCount}`)
  console.log('   Top 5 by Sales Volume:')
  topNeighborhoods.forEach(n => {
    console.log(`   - ${n.neighborhood}: ${n.totalSales} sales, Median: $${n.medianSalePrice}`)
  })
  
  // Test 3: Developers
  console.log('\n3️⃣  Developer Data:')
  const developerCount = await prisma.developer.count()
  const topDevelopers = await prisma.developer.findMany({
    take: 5,
    orderBy: { activeProjects: 'desc' },
    include: {
      projects: {
        select: { totalValue: true }
      }
    }
  })
  console.log(`   Total Developers: ${developerCount}`)
  console.log('   Top 5 by Active Projects:')
  topDevelopers.forEach(d => {
    const totalValue = d.projects.reduce((sum, p) => sum + p.totalValue, 0)
    console.log(`   - ${d.name}: ${d.activeProjects} active projects, Total Value: $${(totalValue / 1000000).toFixed(1)}M`)
  })
  
  // Test 4: Permit Activity
  console.log('\n4️⃣  Permit Activity:')
  const permitCount = await prisma.permit.count()
  const permitValue = await prisma.permit.aggregate({
    _sum: { estimatedValue: true }
  })
  const permitsByType = await prisma.permit.groupBy({
    by: ['permitType'],
    _count: true
  })
  console.log(`   Total Permits: ${permitCount}`)
  console.log(`   Total Value: $${((permitValue._sum.estimatedValue || 0) / 1000000).toFixed(1)}M`)
  console.log('   By Type:')
  permitsByType.forEach(p => {
    console.log(`   - ${p.permitType}: ${p._count} permits`)
  })
  
  // Test 5: Projects
  console.log('\n5️⃣  Project Data:')
  const projectCount = await prisma.project.count()
  const projectValue = await prisma.project.aggregate({
    _sum: { totalValue: true }
  })
  const projectsByPhase = await prisma.project.groupBy({
    by: ['phase'],
    _count: true,
    _sum: { totalValue: true }
  })
  console.log(`   Total Projects: ${projectCount}`)
  console.log(`   Total Value: $${((projectValue._sum.totalValue || 0) / 1000000000).toFixed(1)}B`)
  console.log('   By Phase:')
  projectsByPhase.forEach(p => {
    console.log(`   - ${p.phase}: ${p._count} projects, Value: $${((p._sum.totalValue || 0) / 1000000).toFixed(1)}M`)
  })
  
  // Test 6: Construction Activity
  console.log('\n6️⃣  Construction Activity:')
  const constructionCount = await prisma.constructionActivity.count()
  const constructionValue = await prisma.constructionActivity.aggregate({
    _sum: { estimatedCost: true },
    where: { status: 'active' }
  })
  console.log(`   Total Activities: ${constructionCount}`)
  console.log(`   Active Construction Value: $${((constructionValue._sum.estimatedCost || 0) / 1000000000).toFixed(1)}B`)
  
  console.log('\n✅ Data Accuracy Test Complete')
  
  // Compare with expected values
  console.log('\n📊 Comparison with Expected Values:')
  console.log(`   Median Home Price: ${marketMetrics?.medianPrice === 346651 ? '✅' : '❌'} (Expected: $346,000, Actual: $${marketMetrics?.medianPrice || 'N/A'})`)
  console.log(`   D.R. Horton as Top Developer: ${topDevelopers[0]?.name === 'D.R. Horton' ? '✅' : '❌'} (Actual: ${topDevelopers[0]?.name || 'N/A'})`)
  console.log(`   Neighborhoods Count: ${neighborhoodCount > 0 ? '✅' : '❌'} (${neighborhoodCount} neighborhoods found)`)
  console.log(`   Permit Data Available: ${permitCount > 0 ? '✅' : '❌'} (${permitCount} permits found)`)
  
  // Additional API endpoint tests
  console.log('\n🔍 API Endpoint Response Tests:')
  console.log('   Note: Run the development server and test these endpoints manually:')
  console.log('   - GET /api/market-data - Should return median price, metrics, and trends')
  console.log('   - GET /api/neighborhoods - Should return Houston neighborhoods list')
  console.log('   - GET /api/developers - Should return D.R. Horton as top developer')
  console.log('   - GET /api/permit-activity - Should return permit counts and values')
}

testAPIData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())