import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSmartRelationships() {
  console.log('🔗 Terminal 3: Creating Smart Data Relationships...');
  
  try {
    console.log('\n📊 Analyzing existing data connections...');
    
    // 1. Link Developers to their primary neighborhoods based on projects
    console.log('\n🏘️  Linking developers to neighborhoods...');
    const developersWithProjects = await prisma.developer.findMany({
      where: {
        projects: {
          some: {}
        }
      },
      include: {
        projects: {
          select: {
            area: true,
            totalValue: true
          }
        }
      }
    });
    
    let devNeighborhoodLinks = 0;
    for (const dev of developersWithProjects) {
      // Calculate which areas this developer is most active in
      const areaActivity: { [key: string]: number } = {};
      
      dev.projects.forEach(project => {
        if (!areaActivity[project.area]) {
          areaActivity[project.area] = 0;
        }
        areaActivity[project.area] += project.totalValue;
      });
      
      // Get top 3 areas by project value
      const topAreas = Object.entries(areaActivity)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([area]) => area);
      
      // Update developer with primaryAreas if not already set
      if (dev.primaryAreas.length === 0 && topAreas.length > 0) {
        await prisma.developer.update({
          where: { id: dev.id },
          data: { primaryAreas: topAreas }
        });
        devNeighborhoodLinks++;
      }
    }
    console.log(`✅ Linked ${devNeighborhoodLinks} developers to their primary neighborhoods`);
    
    // 2. Connect Projects to nearby Properties (within same area)
    console.log('\n🏠 Analyzing project-property proximity...');
    const projectAreas = await prisma.project.groupBy({
      by: ['area'],
      _count: true
    });
    
    const propertyAreas = await prisma.property.groupBy({
      by: ['neighborhood'],
      _count: true,
      where: {
        neighborhood: {
          not: null
        }
      }
    });
    
    console.log(`📍 Projects in ${projectAreas.length} areas`);
    console.log(`📍 Properties in ${propertyAreas.length} areas`);
    
    // Show areas with both projects and properties
    const projectAreaNames = new Set(projectAreas.map(p => p.area));
    const overlappingAreas = propertyAreas.filter(p => p.neighborhood && projectAreaNames.has(p.neighborhood));
    console.log(`🔗 ${overlappingAreas.length} areas have both projects and properties`);
    
    // 3. Create Investment Zones based on activity clusters
    console.log('\n💰 Identifying investment zones...');
    
    // Get areas with high development activity
    const hotZones = await prisma.$queryRaw`
      SELECT 
        p.area,
        COUNT(DISTINCT p.id) as project_count,
        SUM(p."totalValue") as total_investment,
        COUNT(DISTINCT p."developerId") as active_developers,
        AVG(CASE WHEN p.phase IN ('Construction', 'Active') THEN 1 ELSE 0 END) * 100 as active_percentage
      FROM "Project" p
      GROUP BY p.area
      HAVING COUNT(DISTINCT p.id) >= 2
      ORDER BY total_investment DESC
      LIMIT 10
    `;
    
    console.log('\n🔥 Top Investment Zones:');
    // @ts-ignore
    hotZones.forEach((zone, index) => {
      const investment = (zone.total_investment / 1000000000).toFixed(1);
      console.log(`   ${index + 1}. ${zone.area}: ${zone.project_count} projects, $${investment}B investment, ${zone.active_developers} developers`);
    });
    
    // 4. Link Demographics to Market Metrics by ZIP
    console.log('\n📊 Linking demographics to market data...');
    const marketWithZip = await prisma.marketMetrics.findMany({
      where: {
        zipCode: {
          not: null
        }
      },
      select: {
        id: true,
        zipCode: true,
        areaName: true
      }
    });
    
    const demographicsWithZip = await prisma.areaDemographics.findMany({
      where: {
        zipCode: {
          not: null
        }
      },
      select: {
        zipCode: true,
        medianHomeValue: true,
        ownerOccupiedPercent: true
      }
    });
    
    // Create a map of ZIP to demographics
    const demoMap = new Map(demographicsWithZip.map(d => [d.zipCode, d]));
    
    let linkedMarketDemo = 0;
    for (const market of marketWithZip) {
      if (market.zipCode && demoMap.has(market.zipCode)) {
        linkedMarketDemo++;
      }
    }
    console.log(`✅ ${linkedMarketDemo} market metrics can be enriched with demographic data`);
    
    // 5. Analyze Developer Performance Metrics
    console.log('\n📈 Calculating developer performance metrics...');
    const developerStats = await prisma.$queryRaw`
      SELECT 
        d.id,
        d.name,
        d."companyType",
        COUNT(p.id) as project_count,
        SUM(p."totalValue") as total_value,
        AVG(p."totalValue") as avg_project_value,
        SUM(CASE WHEN p.phase = 'Completed' THEN 1 ELSE 0 END) as completed_projects,
        SUM(CASE WHEN p.phase IN ('Construction', 'Active') THEN 1 ELSE 0 END) as active_projects,
        SUM(COALESCE(p."residentialUnits", 0)) as total_units
      FROM "Developer" d
      LEFT JOIN "Project" p ON d.id = p."developerId"
      GROUP BY d.id, d.name, d."companyType"
      HAVING COUNT(p.id) > 0
      ORDER BY total_value DESC
      LIMIT 10
    `;
    
    console.log('\n🏆 Top 10 Developers by Total Project Value:');
    // @ts-ignore
    developerStats.forEach((dev, index) => {
      const totalValue = dev.total_value ? `$${(dev.total_value / 1000000).toFixed(0)}M` : 'N/A';
      const avgValue = dev.avg_project_value ? `$${(dev.avg_project_value / 1000000).toFixed(0)}M` : 'N/A';
      console.log(`   ${index + 1}. ${dev.name}: ${dev.project_count} projects, ${totalValue} total (${avgValue} avg)`);
    });
    
    // 6. Create ROI Indicators for Projects
    console.log('\n💹 Generating ROI indicators for projects...');
    const projectsWithArea = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        area: true,
        totalValue: true,
        residentialUnits: true,
        commercialSqft: true,
        phase: true
      }
    });
    
    // Get market data for areas
    const marketDataByArea = await prisma.marketMetrics.groupBy({
      by: ['areaName'],
      _avg: {
        averagePrice: true,
        pricePerSqft: true
      }
    });
    
    const marketMap = new Map(marketDataByArea.map(m => [m.areaName, m]));
    
    let roiCalculated = 0;
    for (const project of projectsWithArea) {
      const marketData = marketMap.get(project.area);
      if (marketData && project.residentialUnits && project.residentialUnits > 0) {
        const estimatedRevenue = project.residentialUnits * (marketData._avg.averagePrice || 0);
        const roi = estimatedRevenue > 0 ? ((estimatedRevenue - project.totalValue) / project.totalValue) * 100 : 0;
        
        if (roi > 0) {
          roiCalculated++;
        }
      }
    }
    console.log(`✅ Calculated potential ROI for ${roiCalculated} residential projects`);
    
    // 7. Summary of Relationships Created
    console.log('\n📊 Relationship Summary:');
    console.log(`   Developer → Neighborhood Links: ${devNeighborhoodLinks}`);
    console.log(`   Areas with Projects & Properties: ${overlappingAreas.length}`);
    console.log(`   Market Data ↔ Demographics Links: ${linkedMarketDemo}`);
    console.log(`   Projects with ROI Potential: ${roiCalculated}`);
    
    // Show data density by area
    console.log('\n🗺️  Data Density by Area (Top 10):');
    const areaDensity = await prisma.$queryRaw`
      SELECT 
        area,
        'Project' as data_type,
        COUNT(*) as count
      FROM "Project"
      WHERE area IS NOT NULL
      GROUP BY area
      
      UNION ALL
      
      SELECT 
        neighborhood as area,
        'Property' as data_type,
        COUNT(*) as count
      FROM "Property"
      WHERE neighborhood IS NOT NULL
      GROUP BY neighborhood
      
      UNION ALL
      
      SELECT 
        "areaName" as area,
        'MarketMetrics' as data_type,
        COUNT(*) as count
      FROM "MarketMetrics"
      WHERE "areaName" IS NOT NULL
      GROUP BY "areaName"
    `;
    
    // Group by area
    const densityMap: { [key: string]: { projects: number; properties: number; metrics: number } } = {};
    // @ts-ignore
    areaDensity.forEach(row => {
      if (!densityMap[row.area]) {
        densityMap[row.area] = { projects: 0, properties: 0, metrics: 0 };
      }
      if (row.data_type === 'Project') densityMap[row.area].projects = parseInt(row.count);
      if (row.data_type === 'Property') densityMap[row.area].properties = parseInt(row.count);
      if (row.data_type === 'MarketMetrics') densityMap[row.area].metrics = parseInt(row.count);
    });
    
    const sortedAreas = Object.entries(densityMap)
      .map(([area, data]) => ({
        area,
        total: data.projects + data.properties + data.metrics,
        ...data
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
    
    sortedAreas.forEach((area, index) => {
      console.log(`   ${index + 1}. ${area.area}: ${area.total} total (${area.projects} projects, ${area.properties} properties, ${area.metrics} metrics)`);
    });
    
  } catch (error) {
    console.error('💥 Error creating relationships:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the relationship creation
createSmartRelationships().catch(console.error);