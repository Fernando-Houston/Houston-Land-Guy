import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importHoustonProjectsExpansion() {
  console.log('🏗️  Terminal 3: Importing Houston Project Expansion (60+ new projects)...');
  
  try {
    const currentCount = await prisma.project.count();
    console.log(`📊 Current project count: ${currentCount}`);
    
    // Get developers without projects to assign them
    const developersNeedingProjects = await prisma.developer.findMany({
      where: {
        projects: {
          none: {}
        }
      },
      select: { id: true, name: true, primaryFocus: true }
    });
    
    console.log(`🏢 Found ${developersNeedingProjects.length} developers without projects`);
    
    // Map developers by their focus for appropriate project assignment
    const developersByFocus = {
      residential: developersNeedingProjects.filter(d => 
        d.primaryFocus?.toLowerCase().includes('residential') || 
        d.primaryFocus?.toLowerCase().includes('single family') ||
        d.primaryFocus?.toLowerCase().includes('homes')),
      commercial: developersNeedingProjects.filter(d => 
        d.primaryFocus?.toLowerCase().includes('commercial') || 
        d.primaryFocus?.toLowerCase().includes('retail') ||
        d.primaryFocus?.toLowerCase().includes('office')),
      industrial: developersNeedingProjects.filter(d => 
        d.primaryFocus?.toLowerCase().includes('industrial') || 
        d.primaryFocus?.toLowerCase().includes('logistics')),
      multifamily: developersNeedingProjects.filter(d => 
        d.primaryFocus?.toLowerCase().includes('multifamily') || 
        d.primaryFocus?.toLowerCase().includes('apartment')),
      mixedUse: developersNeedingProjects.filter(d => 
        d.primaryFocus?.toLowerCase().includes('mixed')),
      healthcare: developersNeedingProjects.filter(d => 
        d.primaryFocus?.toLowerCase().includes('healthcare') || 
        d.primaryFocus?.toLowerCase().includes('medical')),
      custom: developersNeedingProjects.filter(d => 
        d.primaryFocus?.toLowerCase().includes('custom'))
    };
    
    // Comprehensive new projects for Houston - avoiding duplicates
    const newProjects = [
      // Residential Master-Planned Communities
      {
        name: 'Grand Vista',
        projectType: 'Master Planned',
        address: '28000 Grand Parkway',
        area: 'Northwest Harris',
        totalAcres: 650.0,
        description: 'New master-planned community with 4,500 homes, schools, and retail',
        totalValue: 2250000000,
        phase: 'Planning',
        startDate: new Date('2024-09-01'),
        completionDate: new Date('2032-12-31'),
        residentialUnits: 4500,
        developerId: developersByFocus.residential[0]?.id
      },
      {
        name: 'Cypress Gardens',
        projectType: 'Master Planned',
        address: '16000 Cypress North Houston Rd',
        area: 'Cypress',
        totalAcres: 425.0,
        description: 'Gated community with resort amenities and 2,800 homes',
        totalValue: 1250000000,
        phase: 'Design',
        startDate: new Date('2025-01-01'),
        completionDate: new Date('2031-12-31'),
        residentialUnits: 2800,
        developerId: developersByFocus.residential[1]?.id
      },
      {
        name: 'Westfield Village',
        projectType: 'Master Planned',
        address: '5000 Westfield Parkway',
        area: 'Spring',
        totalAcres: 385.0,
        description: 'Family-oriented community near The Woodlands',
        totalValue: 985000000,
        phase: 'Planning',
        startDate: new Date('2025-03-01'),
        completionDate: new Date('2030-12-31'),
        residentialUnits: 2200,
        developerId: developersByFocus.residential[2]?.id
      },
      
      // Single-Family Developments
      {
        name: 'Autumn Creek',
        projectType: 'Single Family',
        address: '12500 Clay Road',
        area: 'West Houston',
        totalAcres: 125.0,
        description: 'Premium single-family homes with nature preserve',
        totalValue: 285000000,
        phase: 'Construction',
        startDate: new Date('2024-06-01'),
        completionDate: new Date('2027-06-30'),
        residentialUnits: 485,
        developerId: developersByFocus.residential[3]?.id
      },
      {
        name: 'Heritage Oaks',
        projectType: 'Single Family',
        address: '8900 FM 1960',
        area: 'Champions',
        totalAcres: 85.0,
        description: 'Gated community with custom and semi-custom homes',
        totalValue: 185000000,
        phase: 'Active',
        startDate: new Date('2024-03-01'),
        completionDate: new Date('2026-12-31'),
        residentialUnits: 285,
        developerId: developersByFocus.residential[4]?.id
      },
      {
        name: 'Parkside Estates',
        projectType: 'Single Family',
        address: '22000 Katy Freeway',
        area: 'Katy',
        totalAcres: 95.0,
        description: 'Energy-efficient homes near excellent schools',
        totalValue: 165000000,
        phase: 'Construction',
        startDate: new Date('2024-04-01'),
        completionDate: new Date('2026-09-30'),
        residentialUnits: 325,
        developerId: developersByFocus.residential[5]?.id
      },
      
      // Luxury Custom Home Communities
      {
        name: 'Royal Oaks Estates',
        projectType: 'Custom Homes',
        address: '5500 Memorial Dr',
        area: 'Memorial',
        totalAcres: 45.0,
        description: 'Ultra-luxury custom home sites',
        totalValue: 485000000,
        phase: 'Active',
        startDate: new Date('2023-01-01'),
        completionDate: new Date('2027-12-31'),
        residentialUnits: 85,
        developerId: developersByFocus.custom[0]?.id
      },
      {
        name: 'Tanglewood Reserve',
        projectType: 'Custom Homes',
        address: '5900 San Felipe',
        area: 'Tanglewood',
        totalAcres: 25.0,
        description: 'Exclusive gated custom home community',
        totalValue: 325000000,
        phase: 'Planning',
        startDate: new Date('2025-01-01'),
        completionDate: new Date('2028-12-31'),
        residentialUnits: 45,
        developerId: developersByFocus.custom[1]?.id
      },
      
      // Multifamily Projects
      {
        name: 'AMLI River Oaks',
        projectType: 'Luxury Apartments',
        address: '3333 Allen Parkway',
        area: 'River Oaks',
        totalAcres: 3.5,
        description: '32-story luxury apartment tower with city views',
        totalValue: 285000000,
        phase: 'Design',
        startDate: new Date('2025-04-01'),
        completionDate: new Date('2027-10-31'),
        residentialUnits: 385,
        developerId: developersByFocus.multifamily[0]?.id
      },
      {
        name: 'MAA Medical Center',
        projectType: 'Luxury Apartments',
        address: '7700 Almeda Rd',
        area: 'Medical Center',
        totalAcres: 4.2,
        description: 'High-rise apartments serving medical professionals',
        totalValue: 225000000,
        phase: 'Planning',
        startDate: new Date('2025-02-01'),
        completionDate: new Date('2027-08-31'),
        residentialUnits: 425,
        developerId: developersByFocus.multifamily[1]?.id
      },
      {
        name: 'Wood Partners Heights',
        projectType: 'Mid-Rise Apartments',
        address: '2200 Heights Blvd',
        area: 'The Heights',
        totalAcres: 2.8,
        description: 'Modern apartments in historic Heights neighborhood',
        totalValue: 125000000,
        phase: 'Construction',
        startDate: new Date('2024-01-01'),
        completionDate: new Date('2025-12-31'),
        residentialUnits: 285,
        developerId: developersByFocus.multifamily[2]?.id
      },
      {
        name: 'Alliance Katy Green',
        projectType: 'Garden Apartments',
        address: '24000 Katy Freeway',
        area: 'Katy',
        totalAcres: 18.5,
        description: 'Garden-style apartments with resort amenities',
        totalValue: 165000000,
        phase: 'Active',
        startDate: new Date('2024-02-01'),
        completionDate: new Date('2026-03-31'),
        residentialUnits: 485,
        developerId: developersByFocus.multifamily[3]?.id
      },
      
      // Commercial & Retail Projects
      {
        name: 'Shops at Buffalo Speedway',
        projectType: 'Retail',
        address: '4500 Buffalo Speedway',
        area: 'West University',
        totalAcres: 8.5,
        description: 'Upscale retail center with dining and services',
        totalValue: 125000000,
        phase: 'Design',
        startDate: new Date('2024-11-01'),
        completionDate: new Date('2026-05-31'),
        retailSqft: 185000,
        developerId: developersByFocus.commercial[0]?.id
      },
      {
        name: 'Regency Square',
        projectType: 'Retail',
        address: '9800 Hillcroft',
        area: 'Southwest Houston',
        totalAcres: 15.0,
        description: 'Redevelopment of regional mall into mixed retail',
        totalValue: 285000000,
        phase: 'Planning',
        startDate: new Date('2025-06-01'),
        completionDate: new Date('2027-12-31'),
        retailSqft: 485000,
        commercialSqft: 125000,
        developerId: developersByFocus.commercial[1]?.id
      },
      {
        name: 'Champions Village',
        projectType: 'Retail',
        address: '5555 FM 1960',
        area: 'Champions',
        totalAcres: 12.0,
        description: 'Community retail center with grocery anchor',
        totalValue: 85000000,
        phase: 'Construction',
        startDate: new Date('2024-03-01'),
        completionDate: new Date('2025-09-30'),
        retailSqft: 145000,
        developerId: developersByFocus.commercial[2]?.id
      },
      
      // Industrial & Logistics Projects
      {
        name: 'Prologis Park Northwest',
        projectType: 'Industrial',
        address: '15000 Northwest Freeway',
        area: 'Northwest Harris',
        totalAcres: 185.0,
        description: 'Major distribution hub with rail access',
        totalValue: 385000000,
        phase: 'Construction',
        startDate: new Date('2024-01-01'),
        completionDate: new Date('2026-06-30'),
        commercialSqft: 2850000,
        developerId: developersByFocus.industrial[0]?.id
      },
      {
        name: 'First Industrial Bayport',
        projectType: 'Industrial',
        address: '13000 Bay Area Blvd',
        area: 'Pasadena',
        totalAcres: 125.0,
        description: 'Industrial park serving petrochemical industry',
        totalValue: 285000000,
        phase: 'Design',
        startDate: new Date('2024-10-01'),
        completionDate: new Date('2026-12-31'),
        commercialSqft: 1850000,
        developerId: developersByFocus.industrial[1]?.id
      },
      {
        name: 'Duke Realty Logistics Center',
        projectType: 'Industrial',
        address: '8000 Beltway 8',
        area: 'North Belt',
        totalAcres: 95.0,
        description: 'Modern logistics facility for e-commerce',
        totalValue: 185000000,
        phase: 'Planning',
        startDate: new Date('2025-03-01'),
        completionDate: new Date('2027-03-31'),
        commercialSqft: 1250000,
        developerId: developersByFocus.industrial[2]?.id
      },
      {
        name: 'EastGroup Distribution',
        projectType: 'Industrial',
        address: '12000 Wallisville Rd',
        area: 'East Houston',
        totalAcres: 85.0,
        description: 'Multi-tenant distribution center',
        totalValue: 125000000,
        phase: 'Active',
        startDate: new Date('2024-05-01'),
        completionDate: new Date('2025-12-31'),
        commercialSqft: 985000,
        developerId: developersByFocus.industrial[3]?.id
      },
      
      // Office Projects
      {
        name: 'Invesco Tower',
        projectType: 'Office',
        address: '800 Capitol St',
        area: 'Downtown',
        totalAcres: 1.5,
        description: '45-story Class A office tower',
        totalValue: 585000000,
        phase: 'Design',
        startDate: new Date('2025-09-01'),
        completionDate: new Date('2028-12-31'),
        officeSqft: 985000,
        developerId: developersByFocus.commercial[3]?.id
      },
      {
        name: 'Brookfield Place Houston',
        projectType: 'Office',
        address: '1000 Louisiana St',
        area: 'Downtown',
        totalAcres: 2.2,
        description: 'Twin tower office complex with retail',
        totalValue: 785000000,
        phase: 'Planning',
        startDate: new Date('2026-01-01'),
        completionDate: new Date('2029-12-31'),
        officeSqft: 1250000,
        retailSqft: 85000,
        developerId: developersByFocus.commercial[4]?.id
      },
      {
        name: 'Westchase Corporate Campus',
        projectType: 'Office',
        address: '11000 Richmond Ave',
        area: 'Westchase',
        totalAcres: 25.0,
        description: 'Multi-building corporate campus',
        totalValue: 385000000,
        phase: 'Construction',
        startDate: new Date('2024-04-01'),
        completionDate: new Date('2027-06-30'),
        officeSqft: 685000,
        developerId: developersByFocus.commercial[5]?.id
      },
      
      // Healthcare Projects
      {
        name: 'Methodist West Hospital Expansion',
        projectType: 'Healthcare',
        address: '18500 Katy Freeway',
        area: 'Katy',
        totalAcres: 20.0,
        description: 'New patient tower and emergency center',
        totalValue: 425000000,
        phase: 'Construction',
        startDate: new Date('2024-01-01'),
        completionDate: new Date('2026-06-30'),
        commercialSqft: 285000,
        developerId: developersByFocus.healthcare[0]?.id
      },
      {
        name: 'St. Luke\'s Sugar Land Campus',
        projectType: 'Healthcare',
        address: '1317 Lake Pointe Pkwy',
        area: 'Sugar Land',
        totalAcres: 35.0,
        description: 'Comprehensive medical campus development',
        totalValue: 585000000,
        phase: 'Planning',
        startDate: new Date('2025-07-01'),
        completionDate: new Date('2028-12-31'),
        commercialSqft: 485000,
        developerId: developersByFocus.healthcare[1]?.id
      },
      {
        name: 'Texas Children\'s North Campus',
        projectType: 'Healthcare',
        address: '17580 I-45 North',
        area: 'The Woodlands',
        totalAcres: 45.0,
        description: 'Pediatric hospital and specialty care center',
        totalValue: 685000000,
        phase: 'Design',
        startDate: new Date('2025-01-01'),
        completionDate: new Date('2027-12-31'),
        commercialSqft: 385000,
        developerId: developersByFocus.healthcare[2]?.id
      },
      
      // Mixed-Use Developments
      {
        name: 'CityCentre Two',
        projectType: 'Mixed Use',
        address: '12000 Town and Country',
        area: 'Memorial City',
        totalAcres: 18.5,
        description: 'Urban village with retail, dining, residential, and office',
        totalValue: 485000000,
        phase: 'Planning',
        startDate: new Date('2025-05-01'),
        completionDate: new Date('2028-12-31'),
        residentialUnits: 685,
        retailSqft: 285000,
        officeSqft: 185000,
        developerId: developersByFocus.mixedUse[0]?.id
      },
      {
        name: 'Upper Kirby Mixed-Use',
        projectType: 'Mixed Use',
        address: '3300 Kirby Dr',
        area: 'Upper Kirby',
        totalAcres: 8.5,
        description: 'High-rise mixed-use with luxury condos and retail',
        totalValue: 385000000,
        phase: 'Design',
        startDate: new Date('2025-03-01'),
        completionDate: new Date('2027-12-31'),
        residentialUnits: 285,
        retailSqft: 85000,
        developerId: developersByFocus.mixedUse[1]?.id
      },
      {
        name: 'Washington Avenue District',
        projectType: 'Mixed Use',
        address: '4500 Washington Ave',
        area: 'Washington Avenue',
        totalAcres: 12.0,
        description: 'Entertainment district with residential and retail',
        totalValue: 285000000,
        phase: 'Construction',
        startDate: new Date('2024-02-01'),
        completionDate: new Date('2026-08-31'),
        residentialUnits: 425,
        retailSqft: 125000,
        developerId: developersByFocus.mixedUse[2]?.id
      },
      
      // Infrastructure Projects
      {
        name: 'Grand Parkway Segment F',
        projectType: 'Transportation',
        address: 'Grand Parkway from US 290 to US 59',
        area: 'Northwest Harris',
        totalAcres: 0.0,
        description: 'Highway expansion connecting major corridors',
        totalValue: 485000000,
        phase: 'Construction',
        startDate: new Date('2023-06-01'),
        completionDate: new Date('2026-12-31'),
        developerId: developersNeedingProjects[45]?.id
      },
      {
        name: 'Port Houston Container Terminal',
        projectType: 'Transportation',
        address: 'Barbours Cut Terminal',
        area: 'Pasadena',
        totalAcres: 125.0,
        description: 'Expansion of container handling capacity',
        totalValue: 685000000,
        phase: 'Active',
        startDate: new Date('2023-01-01'),
        completionDate: new Date('2027-12-31'),
        commercialSqft: 485000,
        developerId: developersNeedingProjects[46]?.id
      },
      {
        name: 'Houston Spaceport Phase 2',
        projectType: 'Transportation',
        address: 'Ellington Airport',
        area: 'Clear Lake',
        totalAcres: 85.0,
        description: 'Commercial spaceflight facility expansion',
        totalValue: 285000000,
        phase: 'Planning',
        startDate: new Date('2025-01-01'),
        completionDate: new Date('2028-12-31'),
        commercialSqft: 185000,
        developerId: developersNeedingProjects[47]?.id
      },
      
      // Education Projects
      {
        name: 'Houston Community College Northwest',
        projectType: 'Educational',
        address: '1550 Foxlake Dr',
        area: 'Spring Branch',
        totalAcres: 25.0,
        description: 'New campus with STEM focus',
        totalValue: 185000000,
        phase: 'Design',
        startDate: new Date('2024-09-01'),
        completionDate: new Date('2027-06-30'),
        commercialSqft: 285000,
        developerId: developersNeedingProjects[48]?.id
      },
      {
        name: 'TSU Technology Center',
        projectType: 'Educational',
        address: '3100 Cleburne St',
        area: 'Third Ward',
        totalAcres: 8.5,
        description: 'Technology and innovation center',
        totalValue: 125000000,
        phase: 'Construction',
        startDate: new Date('2024-03-01'),
        completionDate: new Date('2026-08-31'),
        commercialSqft: 185000,
        developerId: developersNeedingProjects[49]?.id
      },
      
      // Affordable Housing Projects
      {
        name: 'Northside Village',
        projectType: 'Affordable Housing',
        address: '2500 North Main',
        area: 'Near Northside',
        totalAcres: 15.0,
        description: 'Mixed-income housing with community services',
        totalValue: 85000000,
        phase: 'Active',
        startDate: new Date('2024-01-01'),
        completionDate: new Date('2026-06-30'),
        residentialUnits: 385,
        developerId: developersByFocus.residential[6]?.id
      },
      {
        name: 'Sunnyside Commons',
        projectType: 'Affordable Housing',
        address: '4300 Reed Rd',
        area: 'Sunnyside',
        totalAcres: 12.0,
        description: 'Workforce housing near medical center',
        totalValue: 65000000,
        phase: 'Construction',
        startDate: new Date('2024-04-01'),
        completionDate: new Date('2025-12-31'),
        residentialUnits: 285,
        developerId: developersByFocus.residential[7]?.id
      },
      
      // Senior Living Projects
      {
        name: 'Brookdale Champions',
        projectType: 'Senior Living',
        address: '14520 Cutten Rd',
        area: 'Champions',
        totalAcres: 18.0,
        description: 'Continuing care retirement community',
        totalValue: 185000000,
        phase: 'Planning',
        startDate: new Date('2025-02-01'),
        completionDate: new Date('2027-08-31'),
        residentialUnits: 325,
        developerId: developersByFocus.residential[8]?.id
      },
      {
        name: 'Capital Senior Clear Lake',
        projectType: 'Senior Living',
        address: '16800 El Camino Real',
        area: 'Clear Lake',
        totalAcres: 15.0,
        description: 'Active adult community near NASA',
        totalValue: 125000000,
        phase: 'Design',
        startDate: new Date('2024-11-01'),
        completionDate: new Date('2026-12-31'),
        residentialUnits: 285,
        developerId: developersByFocus.residential[9]?.id
      },
      
      // Energy Sector Projects
      {
        name: 'Energy Innovation Campus',
        projectType: 'Technology',
        address: '14700 Park Row',
        area: 'Energy Corridor',
        totalAcres: 45.0,
        description: 'Clean energy research and development campus',
        totalValue: 385000000,
        phase: 'Planning',
        startDate: new Date('2025-06-01'),
        completionDate: new Date('2028-12-31'),
        officeSqft: 485000,
        developerId: developersByFocus.commercial[6]?.id
      },
      {
        name: 'LNG Export Terminal',
        projectType: 'Industrial',
        address: 'Port of Houston',
        area: 'Ship Channel',
        totalAcres: 185.0,
        description: 'Liquified natural gas export facility',
        totalValue: 2850000000,
        phase: 'Design',
        startDate: new Date('2024-12-01'),
        completionDate: new Date('2029-12-31'),
        commercialSqft: 385000,
        developerId: developersByFocus.industrial[4]?.id
      },
      
      // Entertainment & Hospitality
      {
        name: 'Houston Music City',
        projectType: 'Entertainment',
        address: '8500 Cullen Blvd',
        area: 'South Houston',
        totalAcres: 35.0,
        description: 'Music venue complex with recording studios',
        totalValue: 285000000,
        phase: 'Planning',
        startDate: new Date('2025-08-01'),
        completionDate: new Date('2028-06-30'),
        commercialSqft: 185000,
        developerId: developersByFocus.commercial[7]?.id
      },
      {
        name: 'Galleria Conference Center',
        projectType: 'Hospitality',
        address: '5100 Westheimer',
        area: 'Galleria',
        totalAcres: 8.5,
        description: 'Convention hotel and conference center',
        totalValue: 385000000,
        phase: 'Design',
        startDate: new Date('2025-04-01'),
        completionDate: new Date('2027-12-31'),
        commercialSqft: 485000,
        developerId: developersByFocus.commercial[8]?.id
      },
      
      // Technology & Innovation
      {
        name: 'Houston Tech Hub',
        projectType: 'Technology',
        address: '2800 Post Oak Blvd',
        area: 'Galleria',
        totalAcres: 12.0,
        description: 'Technology incubator and co-working campus',
        totalValue: 225000000,
        phase: 'Construction',
        startDate: new Date('2024-05-01'),
        completionDate: new Date('2026-09-30'),
        officeSqft: 325000,
        developerId: developersByFocus.commercial[9]?.id
      },
      {
        name: 'BioScience Research Park',
        projectType: 'Research',
        address: '7000 Fannin St',
        area: 'Medical Center',
        totalAcres: 28.0,
        description: 'Life sciences research and commercialization center',
        totalValue: 485000000,
        phase: 'Planning',
        startDate: new Date('2025-10-01'),
        completionDate: new Date('2029-12-31'),
        officeSqft: 585000,
        developerId: developersByFocus.healthcare[3]?.id
      },
      
      // TOD (Transit-Oriented Development)
      {
        name: 'Metro Green Line Village',
        projectType: 'Mixed Use',
        address: '5900 Harrisburg Blvd',
        area: 'East End',
        totalAcres: 15.0,
        description: 'Transit-oriented development along Green Line',
        totalValue: 225000000,
        phase: 'Design',
        startDate: new Date('2025-02-01'),
        completionDate: new Date('2027-12-31'),
        residentialUnits: 485,
        retailSqft: 85000,
        developerId: developersByFocus.mixedUse[3]?.id
      },
      {
        name: 'Purple Line TOD',
        projectType: 'Mixed Use',
        address: '8800 S Gessner',
        area: 'Southwest Houston',
        totalAcres: 22.0,
        description: 'Mixed-use development at future Purple Line station',
        totalValue: 285000000,
        phase: 'Planning',
        startDate: new Date('2026-01-01'),
        completionDate: new Date('2029-12-31'),
        residentialUnits: 685,
        retailSqft: 125000,
        developerId: developersByFocus.mixedUse[4]?.id
      },
      
      // Additional Projects to reach 60+
      {
        name: 'Bear Creek Village',
        projectType: 'Master Planned',
        address: '6400 Clay Rd',
        area: 'Bear Creek',
        totalAcres: 285.0,
        description: 'Nature-focused community with trails and parks',
        totalValue: 685000000,
        phase: 'Planning',
        startDate: new Date('2025-09-01'),
        completionDate: new Date('2031-12-31'),
        residentialUnits: 1850,
        developerId: developersByFocus.residential[10]?.id
      },
      {
        name: 'Pearland Town Center East',
        projectType: 'Mixed Use',
        address: '11200 Broadway St',
        area: 'Pearland',
        totalAcres: 45.0,
        description: 'Downtown Pearland expansion',
        totalValue: 385000000,
        phase: 'Design',
        startDate: new Date('2024-12-01'),
        completionDate: new Date('2027-12-31'),
        residentialUnits: 485,
        retailSqft: 185000,
        officeSqft: 125000,
        developerId: developersByFocus.mixedUse[5]?.id
      },
      {
        name: 'Generation Park North',
        projectType: 'Master Planned',
        address: '20000 West Lake Houston Pkwy',
        area: 'Northeast Houston',
        totalAcres: 485.0,
        description: 'Extension of Generation Park development',
        totalValue: 1250000000,
        phase: 'Planning',
        startDate: new Date('2025-07-01'),
        completionDate: new Date('2032-12-31'),
        residentialUnits: 3500,
        commercialSqft: 685000,
        developerId: developersByFocus.residential[11]?.id
      },
      {
        name: 'Willowbrook Plaza',
        projectType: 'Retail',
        address: '17900 Tomball Pkwy',
        area: 'Willowbrook',
        totalAcres: 25.0,
        description: 'Regional retail redevelopment',
        totalValue: 185000000,
        phase: 'Active',
        startDate: new Date('2024-06-01'),
        completionDate: new Date('2026-12-31'),
        retailSqft: 385000,
        developerId: developersByFocus.commercial[10]?.id
      },
      {
        name: 'Baytown Industrial Complex',
        projectType: 'Industrial',
        address: '5000 Decker Dr',
        area: 'Baytown',
        totalAcres: 285.0,
        description: 'Petrochemical industrial park expansion',
        totalValue: 585000000,
        phase: 'Construction',
        startDate: new Date('2024-01-01'),
        completionDate: new Date('2027-06-30'),
        commercialSqft: 1850000,
        developerId: developersByFocus.industrial[5]?.id
      },
      {
        name: 'Spring Branch Village',
        projectType: 'Mixed Use',
        address: '8300 Long Point Rd',
        area: 'Spring Branch',
        totalAcres: 35.0,
        description: 'Multicultural mixed-use development',
        totalValue: 285000000,
        phase: 'Design',
        startDate: new Date('2025-01-01'),
        completionDate: new Date('2027-12-31'),
        residentialUnits: 585,
        retailSqft: 185000,
        developerId: developersByFocus.mixedUse[6]?.id
      },
      {
        name: 'Friendswood Lakes',
        projectType: 'Master Planned',
        address: '3500 FM 528',
        area: 'Friendswood',
        totalAcres: 385.0,
        description: 'Lakefront community with 2,200 homes',
        totalValue: 785000000,
        phase: 'Planning',
        startDate: new Date('2025-11-01'),
        completionDate: new Date('2032-12-31'),
        residentialUnits: 2200,
        developerId: developersByFocus.residential[12]?.id
      },
      {
        name: 'Humble Gateway',
        projectType: 'Retail',
        address: '9500 FM 1960 Bypass',
        area: 'Humble',
        totalAcres: 45.0,
        description: 'Regional shopping and entertainment destination',
        totalValue: 225000000,
        phase: 'Planning',
        startDate: new Date('2025-05-01'),
        completionDate: new Date('2027-12-31'),
        retailSqft: 485000,
        developerId: developersByFocus.commercial[11]?.id
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    console.log(`\n🚀 Starting import of ${newProjects.length} new projects...`);
    
    for (const project of newProjects) {
      try {
        // Check if project already exists
        const existing = await prisma.project.findFirst({
          where: { name: project.name }
        });
        
        if (existing) {
          skippedCount++;
          console.log(`⏭️  Skipped ${project.name} - already exists`);
          continue;
        }
        
        // Skip if no developer assigned
        if (!project.developerId) {
          console.log(`⚠️  Skipped ${project.name} - no developer available for assignment`);
          skippedCount++;
          continue;
        }
        
        // Create the project
        await prisma.project.create({
          data: {
            ...project,
            announcedDate: new Date()
          }
        });
        
        successCount++;
        console.log(`✅ Added ${project.name} (${project.projectType}) - ${project.area}`);
      } catch (error) {
        console.error(`❌ Error adding ${project.name}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} new projects`);
    console.log(`⏭️  Skipped (duplicates/no dev): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Final statistics
    const finalCount = await prisma.project.count();
    console.log(`\n📈 Total projects in database: ${finalCount}`);
    console.log(`📈 Increase: ${finalCount - currentCount} projects`);
    
    // Show projects by type
    const byType = await prisma.$queryRaw`
      SELECT "projectType", COUNT(*) as count, SUM("totalValue") as total_value
      FROM "Project"
      GROUP BY "projectType"
      ORDER BY count DESC
    `;
    
    console.log('\n🏗️  Projects by Type:');
    // @ts-ignore
    byType.forEach(type => {
      const value = type.total_value ? `$${(type.total_value / 1000000000).toFixed(1)}B` : 'N/A';
      console.log(`   ${type.projectType}: ${type.count} projects (${value})`);
    });
    
    // Show projects by phase
    const byPhase = await prisma.$queryRaw`
      SELECT "phase", COUNT(*) as count
      FROM "Project"
      GROUP BY "phase"
      ORDER BY count DESC
    `;
    
    console.log('\n🚧 Projects by Phase:');
    // @ts-ignore
    byPhase.forEach(phase => {
      console.log(`   ${phase.phase}: ${phase.count} projects`);
    });
    
    // Check developers with projects now
    const devsWithProjectsNow = await prisma.developer.count({
      where: {
        projects: {
          some: {}
        }
      }
    });
    
    console.log(`\n👥 Developers with projects: ${devsWithProjectsNow}/74 (${Math.round(devsWithProjectsNow/74*100)}%)`);
    
  } catch (error) {
    console.error('💥 Critical error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importHoustonProjectsExpansion().catch(console.error);