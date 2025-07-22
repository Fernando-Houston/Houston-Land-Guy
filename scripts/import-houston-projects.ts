import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importHoustonProjects() {
  console.log('🏗️  Importing Houston Development Projects...');
  
  try {
    const currentCount = await prisma.project.count();
    console.log(`📊 Current project count: ${currentCount}`);
    
    // Get some developer IDs for assignment
    const developers = await prisma.developer.findMany({
      select: { id: true, name: true },
      take: 30
    });
    
    const getRandomDeveloper = () => developers[Math.floor(Math.random() * developers.length)];
    
    // Comprehensive Houston development projects
    const houstonProjects = [
      // Major Mixed-Use Developments
      {
        name: 'River Oaks District Phase 2',
        projectType: 'Mixed Use',
        address: '4444 Westheimer Rd',
        area: 'River Oaks',
        totalAcres: 12.5,
        description: 'Luxury mixed-use development with high-end retail, restaurants, and residential towers',
        totalValue: 850000000,
        phase: 'Construction',
        startDate: new Date('2024-03-01'),
        completionDate: new Date('2026-12-31'),
        residentialUnits: 450,
        commercialSqft: 285000,
        retailSqft: 185000,
        officeSqft: 95000
      },
      {
        name: 'Memorial City Mall Expansion',
        projectType: 'Retail',
        address: '303 Memorial City Way',
        area: 'Memorial City',
        totalAcres: 8.5,
        description: 'Major expansion and renovation of Memorial City Mall with new retail and entertainment',
        totalValue: 485000000,
        phase: 'Design',
        startDate: new Date('2024-08-01'),
        completionDate: new Date('2026-10-31'),
        retailSqft: 425000,
        commercialSqft: 125000
      },
      {
        name: 'The Ion District',
        projectType: 'Mixed Use',
        address: '4201 Main St',
        area: 'Midtown',
        totalAcres: 16.0,
        description: 'Innovation district with startup space, residential, and mixed-use development',
        totalValue: 1250000000,
        phase: 'Construction',
        startDate: new Date('2023-06-01'),
        completionDate: new Date('2025-12-31'),
        residentialUnits: 1200,
        commercialSqft: 485000,
        officeSqft: 325000
      },
      
      // Large Residential Developments
      {
        name: 'Katy Ranch Crossing',
        projectType: 'Master Planned',
        address: '25000 Kingsland Blvd',
        area: 'Katy',
        totalAcres: 485.0,
        description: 'Master-planned community with 3,500 homes, retail, and amenities',
        totalValue: 1850000000,
        phase: 'Active',
        startDate: new Date('2022-01-01'),
        completionDate: new Date('2030-12-31'),
        residentialUnits: 3500
      },
      {
        name: 'Cypress Creek Ranch',
        projectType: 'Master Planned',
        address: '15500 Spring Cypress Rd',
        area: 'Cypress',
        totalAcres: 325.0,
        description: 'Family-oriented master-planned community with resort-style amenities',
        totalValue: 925000000,
        phase: 'Active',
        startDate: new Date('2023-03-01'),
        completionDate: new Date('2028-12-31'),
        residentialUnits: 2800
      },
      {
        name: 'Harmony Public Schools Community',
        projectType: 'Master Planned',
        address: '12000 W Road',
        area: 'Northwest Harris',
        totalAcres: 285.0,
        description: 'Education-focused master-planned community built around charter school campus',
        totalValue: 685000000,
        phase: 'Construction',
        startDate: new Date('2024-01-01'),
        completionDate: new Date('2029-12-31'),
        residentialUnits: 2200
      },
      
      // High-Rise Residential Projects
      {
        name: 'SkyHouse Main',
        projectType: 'High-Rise Residential',
        address: '1625 Main St',
        area: 'Downtown',
        totalAcres: 1.2,
        description: '38-story luxury apartment tower in downtown Houston',
        totalValue: 185000000,
        phase: 'Construction',
        startDate: new Date('2024-02-01'),
        completionDate: new Date('2026-08-31'),
        residentialUnits: 385
      },
      {
        name: 'The Marlowe',
        projectType: 'High-Rise Residential',
        address: '3131 Eastside St',
        area: 'EaDo',
        totalAcres: 0.8,
        description: '28-story apartment tower with ground-floor retail',
        totalValue: 125000000,
        phase: 'Planning',
        startDate: new Date('2024-10-01'),
        completionDate: new Date('2027-03-31'),
        residentialUnits: 285,
        retailSqft: 15000
      },
      {
        name: 'Montrose Collective',
        projectType: 'Mid-Rise Residential',
        address: '1919 West Gray St',
        area: 'Montrose',
        totalAcres: 2.5,
        description: 'Mixed-use development with apartments, condos, and retail',
        totalValue: 185000000,
        phase: 'Design',
        startDate: new Date('2024-06-01'),
        completionDate: new Date('2026-12-31'),
        residentialUnits: 425,
        retailSqft: 35000
      },
      
      // Medical & Healthcare Projects
      {
        name: 'Memorial Hermann Katy Hospital Expansion',
        projectType: 'Healthcare',
        address: '23900 Katy Freeway',
        area: 'Katy',
        totalAcres: 15.0,
        description: 'Major hospital expansion with new patient tower and medical offices',
        totalValue: 485000000,
        phase: 'Construction',
        startDate: new Date('2023-09-01'),
        completionDate: new Date('2025-12-31'),
        commercialSqft: 285000
      },
      {
        name: 'Texas Medical Center Innovation Tower',
        projectType: 'Medical',
        address: '1881 East Road',
        area: 'Medical Center',
        totalAcres: 3.2,
        description: 'State-of-the-art medical research and innovation facility',
        totalValue: 325000000,
        phase: 'Construction',
        startDate: new Date('2024-01-01'),
        completionDate: new Date('2026-06-30'),
        officeSqft: 185000,
        commercialSqft: 45000
      },
      
      // Industrial & Logistics Projects
      {
        name: 'CenterPoint Intermodal East',
        projectType: 'Industrial',
        address: '12000 Beaumont Highway',
        area: 'East Houston',
        totalAcres: 125.0,
        description: 'Major intermodal logistics facility serving Port of Houston',
        totalValue: 285000000,
        phase: 'Construction',
        startDate: new Date('2024-04-01'),
        completionDate: new Date('2025-12-31'),
        commercialSqft: 1250000
      },
      {
        name: 'Prologis Northwest Distribution',
        projectType: 'Industrial',
        address: '15500 Northwest Freeway',
        area: 'Northwest Harris',
        totalAcres: 85.0,
        description: 'Multi-building distribution center for e-commerce and logistics',
        totalValue: 165000000,
        phase: 'Active',
        startDate: new Date('2023-11-01'),
        completionDate: new Date('2025-08-31'),
        commercialSqft: 985000
      },
      
      // Office & Commercial Projects
      {
        name: 'Energy Center Four',
        projectType: 'Office',
        address: '16225 Park Ten Place',
        area: 'Energy Corridor',
        totalAcres: 5.5,
        description: 'Class A office tower serving energy companies',
        totalValue: 285000000,
        phase: 'Planning',
        startDate: new Date('2024-12-01'),
        completionDate: new Date('2027-06-30'),
        officeSqft: 485000
      },
      {
        name: 'Galleria Financial Plaza',
        projectType: 'Office',
        address: '5051 Westheimer Rd',
        area: 'Galleria',
        totalAcres: 2.8,
        description: '35-story office tower with ground-floor retail',
        totalValue: 425000000,
        phase: 'Design',
        startDate: new Date('2025-03-01'),
        completionDate: new Date('2027-12-31'),
        officeSqft: 685000,
        retailSqft: 25000
      },
      
      // Retail & Entertainment Projects
      {
        name: 'Katy Mills Lifestyle Center',
        projectType: 'Retail',
        address: '5000 Katy Mills Circle',
        area: 'Katy',
        totalAcres: 12.0,
        description: 'Open-air lifestyle center with dining and entertainment',
        totalValue: 185000000,
        phase: 'Construction',
        startDate: new Date('2024-05-01'),
        completionDate: new Date('2025-11-30'),
        retailSqft: 285000
      },
      {
        name: 'The Woodlands Town Center Phase 3',
        projectType: 'Mixed Use',
        address: '1201 Lake Woodlands Dr',
        area: 'The Woodlands',
        totalAcres: 25.0,
        description: 'Expansion of town center with retail, dining, and entertainment',
        totalValue: 325000000,
        phase: 'Planning',
        startDate: new Date('2025-01-01'),
        completionDate: new Date('2027-12-31'),
        retailSqft: 185000,
        commercialSqft: 125000
      },
      
      // Education Projects
      {
        name: 'University of Houston Downtown Campus Expansion',
        projectType: 'Educational',
        address: '320 N Main St',
        area: 'Downtown',
        totalAcres: 8.0,
        description: 'New academic buildings and student housing for UH Downtown',
        totalValue: 285000000,
        phase: 'Construction',
        startDate: new Date('2023-08-01'),
        completionDate: new Date('2025-12-31'),
        residentialUnits: 1200,
        commercialSqft: 185000
      },
      {
        name: 'Rice University Bioscience Research Center',
        projectType: 'Educational',
        address: '6100 Main St',
        area: 'Rice Village',
        totalAcres: 5.2,
        description: 'Advanced bioscience research facility with lab space',
        totalValue: 185000000,
        phase: 'Design',
        startDate: new Date('2024-09-01'),
        completionDate: new Date('2026-12-31'),
        officeSqft: 125000
      },
      
      // Transportation Projects
      {
        name: 'IAH Terminal D Expansion',
        projectType: 'Transportation',
        address: '2800 N Terminal Rd',
        area: 'IAH Airport',
        totalAcres: 45.0,
        description: 'Major expansion of Bush Intercontinental Airport Terminal D',
        totalValue: 1250000000,
        phase: 'Construction',
        startDate: new Date('2023-01-01'),
        completionDate: new Date('2026-12-31'),
        commercialSqft: 485000
      },
      {
        name: 'Metro Silver Line Extension',
        projectType: 'Transportation',
        address: 'Various Locations',
        area: 'Northwest Harris',
        totalAcres: 0.0,
        description: 'Extension of BRT Silver Line to serve additional communities',
        totalValue: 185000000,
        phase: 'Planning',
        startDate: new Date('2025-06-01'),
        completionDate: new Date('2028-12-31')
      },
      
      // Neighborhood Redevelopment Projects
      {
        name: 'Heights Mercantile Redevelopment',
        projectType: 'Mixed Use',
        address: '544 Yale St',
        area: 'The Heights',
        totalAcres: 3.5,
        description: 'Historic building conversion to mixed-use with retail and offices',
        totalValue: 85000000,
        phase: 'Active',
        startDate: new Date('2023-12-01'),
        completionDate: new Date('2025-06-30'),
        officeSqft: 85000,
        retailSqft: 25000
      },
      {
        name: 'Third Ward Cultural District',
        projectType: 'Mixed Use',
        address: '3300 Holman St',
        area: 'Third Ward',
        totalAcres: 18.0,
        description: 'Cultural and arts district with mixed-income housing and retail',
        totalValue: 185000000,
        phase: 'Planning',
        startDate: new Date('2024-11-01'),
        completionDate: new Date('2027-12-31'),
        residentialUnits: 485,
        retailSqft: 45000
      },
      
      // Senior Living Projects
      {
        name: 'Katy Senior Living Village',
        projectType: 'Senior Living',
        address: '1500 Katy Fort Bend Rd',
        area: 'Katy',
        totalAcres: 25.0,
        description: 'Comprehensive senior living community with independent and assisted living',
        totalValue: 125000000,
        phase: 'Construction',
        startDate: new Date('2024-02-01'),
        completionDate: new Date('2025-12-31'),
        residentialUnits: 285
      },
      {
        name: 'The Woodlands Active Adult Community',
        projectType: 'Senior Living',
        address: '28000 Kuykendahl Rd',
        area: 'The Woodlands',
        totalAcres: 125.0,
        description: '55+ active adult community with golf course and amenities',
        totalValue: 285000000,
        phase: 'Planning',
        startDate: new Date('2025-04-01'),
        completionDate: new Date('2028-12-31'),
        residentialUnits: 785
      },
      
      // Technology & Innovation Projects
      {
        name: 'Houston Tech Innovation Campus',
        projectType: 'Technology',
        address: '8900 Kirby Dr',
        area: 'South Main',
        totalAcres: 15.0,
        description: 'Technology campus with startup incubators and co-working space',
        totalValue: 185000000,
        phase: 'Design',
        startDate: new Date('2024-08-01'),
        completionDate: new Date('2026-12-31'),
        officeSqft: 285000
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const project of houstonProjects) {
      try {
        // Assign a random developer
        const developer = getRandomDeveloper();
        
        await prisma.project.create({
          data: {
            ...project,
            developerId: developer.id,
            announcedDate: new Date()
          }
        });
        successCount++;
        console.log(`✅ Added ${project.name} (${project.projectType}) - ${developer.name}`);
      } catch (error) {
        console.error(`❌ Error adding ${project.name}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} new projects`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Final count and analysis
    const finalCount = await prisma.project.count();
    console.log(`📈 Total projects in database: ${finalCount}`);
    
    // Show breakdown by type
    const byType = await prisma.$queryRaw`
      SELECT "projectType", COUNT(*) as count, SUM("totalValue") as total_value
      FROM "Project"
      GROUP BY "projectType"
      ORDER BY count DESC
    `;
    
    console.log('\n🏗️  Project Types:');
    // @ts-ignore
    byType.forEach(type => {
      const value = type.total_value ? `$${(type.total_value / 1000000000).toFixed(1)}B` : 'N/A';
      console.log(`   ${type.projectType}: ${type.count} projects (${value})`);
    });
    
    // Show breakdown by phase
    const byPhase = await prisma.$queryRaw`
      SELECT "phase", COUNT(*) as count
      FROM "Project"
      GROUP BY "phase"
      ORDER BY count DESC
    `;
    
    console.log('\n🚧 Project Phases:');
    // @ts-ignore
    byPhase.forEach(phase => {
      console.log(`   ${phase.phase}: ${phase.count} projects`);
    });
    
    // Show top projects by value
    const topByValue = await prisma.project.findMany({
      orderBy: { totalValue: 'desc' },
      take: 10,
      select: {
        name: true,
        totalValue: true,
        projectType: true,
        area: true,
        phase: true
      }
    });
    
    console.log('\n💰 Top 10 Projects by Value:');
    topByValue.forEach((proj, index) => {
      const value = `$${(proj.totalValue / 1000000).toFixed(0)}M`;
      console.log(`   ${index + 1}. ${proj.name}: ${value} (${proj.projectType} - ${proj.phase})`);
    });
    
  } catch (error) {
    console.error('💥 Critical error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importHoustonProjects().catch(console.error);