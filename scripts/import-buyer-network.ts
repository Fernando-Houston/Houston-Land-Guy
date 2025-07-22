import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Houston area names for buyer company generation
const houstonAreas = ['River Oaks', 'Memorial', 'Katy', 'Sugar Land', 'The Woodlands', 'Cypress', 'Spring', 'Pearland', 'Clear Lake', 'Bellaire', 'West University', 'Heights', 'Montrose', 'Galleria', 'Energy Corridor'];
const companyTypes = ['Investments', 'Holdings', 'Properties', 'Real Estate', 'Capital', 'Ventures', 'Group', 'Partners', 'LLC', 'Development'];
const firstNames = ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Maria', 'Jennifer', 'Linda', 'Patricia', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Chen', 'Patel', 'Kim', 'Nguyen', 'Singh'];

// Generate random company name
function generateCompanyName(type: string): string {
  const area = houstonAreas[Math.floor(Math.random() * houstonAreas.length)];
  const companyType = companyTypes[Math.floor(Math.random() * companyTypes.length)];
  
  switch(type) {
    case 'cash-investor':
      return `${area} ${companyType}`;
    case 'international':
      const countries = ['Global', 'International', 'Worldwide', 'Asia Pacific', 'European', 'Middle East'];
      return `${countries[Math.floor(Math.random() * countries.length)]} Real Estate ${companyType}`;
    case 'ibuyer':
      const techNames = ['Quick', 'Fast', 'Instant', 'Direct', 'Express'];
      return `${techNames[Math.floor(Math.random() * techNames.length)]}Buy Houston`;
    case 'developer':
      return `${area} Development ${companyType}`;
    default:
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
  }
}

// Generate buyer preferences based on type
function generatePreferences(type: string): string[] {
  const basePreferences = {
    'cash-investor': ['quick-close', 'as-is', 'distressed', 'below-market', 'investment-opportunity'],
    'traditional': ['move-in-ready', 'good-schools', 'family-friendly', 'updated-kitchen', 'garage'],
    'international': ['luxury', 'investment', 'new-construction', 'gated-community', 'high-rise'],
    'ibuyer': ['standard-condition', 'typical-layout', 'suburban', 'single-family', 'good-neighborhood'],
    'developer': ['teardown', 'large-lot', 'corner-lot', 'commercial-potential', 'multi-family-zoning'],
    'first-time': ['affordable', 'fha-eligible', 'low-maintenance', 'good-schools', 'safe-neighborhood'],
    'luxury': ['waterfront', 'acreage', 'custom-built', 'smart-home', 'wine-cellar', 'pool']
  };
  
  return basePreferences[type] || basePreferences['traditional'];
}

// Generate preferred areas based on buyer type and budget
function generatePreferredAreas(type: string, maxBudget: number): string[] {
  const luxuryAreas = ['River Oaks', 'Memorial', 'West University', 'Bellaire', 'Tanglewood'];
  const midRangeAreas = ['Katy', 'Sugar Land', 'The Woodlands', 'Cypress', 'Pearland'];
  const urbanAreas = ['Heights', 'Montrose', 'Midtown', 'EaDo', 'Downtown'];
  const affordableAreas = ['Spring', 'Humble', 'Pasadena', 'Alief', 'Sharpstown'];
  
  if (maxBudget > 1000000) {
    return [...luxuryAreas, ...midRangeAreas.slice(0, 2)];
  } else if (maxBudget > 500000) {
    return [...midRangeAreas, ...urbanAreas.slice(0, 2)];
  } else if (maxBudget > 300000) {
    return [...midRangeAreas, ...affordableAreas.slice(0, 2)];
  } else {
    return affordableAreas;
  }
}

async function importBuyerNetwork() {
  console.log('🏠 Terminal 3: Importing Buyer Network Database...');
  
  try {
    // First, check if BuyerProfile table exists by trying a simple query
    try {
      await prisma.$queryRaw`SELECT COUNT(*) FROM "BuyerProfile" LIMIT 1`;
      console.log('✅ BuyerProfile table exists');
    } catch (error) {
      console.log('⚠️  BuyerProfile table does not exist. Creating table...');
      
      // Create the table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "BuyerProfile" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "buyerType" TEXT NOT NULL,
          "companyName" TEXT,
          "contactName" TEXT,
          "email" TEXT,
          "phone" TEXT,
          "minBudget" DOUBLE PRECISION NOT NULL,
          "maxBudget" DOUBLE PRECISION NOT NULL,
          "preferredAreas" TEXT[],
          "preferences" TEXT[],
          "cashAvailable" BOOLEAN DEFAULT false,
          "preQualified" BOOLEAN DEFAULT false,
          "closingTimeline" INTEGER,
          "lastActive" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "rating" DOUBLE PRECISION,
          "offersMade" INTEGER DEFAULT 0,
          "closedDeals" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Created BuyerProfile table');
    }
    
    const buyers = [];
    
    // Generate Cash Investors (200)
    console.log('💰 Generating cash investors...');
    for (let i = 0; i < 200; i++) {
      const minBudget = Math.floor(Math.random() * 300000) + 150000; // 150k-450k
      const maxBudget = minBudget + Math.floor(Math.random() * 500000) + 100000;
      
      buyers.push({
        buyerType: 'cash-investor',
        companyName: generateCompanyName('cash-investor'),
        contactName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        email: `investor${i + 1}@houstonrei.com`,
        phone: `713-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        minBudget,
        maxBudget,
        preferredAreas: generatePreferredAreas('cash-investor', maxBudget),
        preferences: generatePreferences('cash-investor'),
        cashAvailable: true,
        preQualified: true,
        closingTimeline: Math.floor(Math.random() * 14) + 7, // 7-21 days
        rating: Math.random() * 1.5 + 3.5, // 3.5-5.0
        offersMade: Math.floor(Math.random() * 50),
        closedDeals: Math.floor(Math.random() * 20)
      });
    }
    
    // Generate Traditional Buyers (150)
    console.log('🏡 Generating traditional buyers...');
    for (let i = 0; i < 150; i++) {
      const minBudget = Math.floor(Math.random() * 200000) + 200000; // 200k-400k
      const maxBudget = minBudget + Math.floor(Math.random() * 300000) + 50000;
      
      buyers.push({
        buyerType: 'traditional',
        companyName: null,
        contactName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        email: `buyer${i + 1}@email.com`,
        phone: `832-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        minBudget,
        maxBudget,
        preferredAreas: generatePreferredAreas('traditional', maxBudget),
        preferences: generatePreferences('traditional'),
        cashAvailable: Math.random() > 0.7,
        preQualified: Math.random() > 0.2,
        closingTimeline: Math.floor(Math.random() * 30) + 30, // 30-60 days
        rating: Math.random() * 1.5 + 3.5,
        offersMade: Math.floor(Math.random() * 10),
        closedDeals: Math.floor(Math.random() * 3)
      });
    }
    
    // Generate International Buyers (80)
    console.log('🌍 Generating international buyers...');
    for (let i = 0; i < 80; i++) {
      const minBudget = Math.floor(Math.random() * 500000) + 300000; // 300k-800k
      const maxBudget = minBudget + Math.floor(Math.random() * 2000000) + 200000;
      
      buyers.push({
        buyerType: 'international',
        companyName: generateCompanyName('international'),
        contactName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        email: `intl${i + 1}@globalrei.com`,
        phone: `+1-713-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        minBudget,
        maxBudget,
        preferredAreas: generatePreferredAreas('international', maxBudget),
        preferences: generatePreferences('international'),
        cashAvailable: true,
        preQualified: true,
        closingTimeline: Math.floor(Math.random() * 30) + 14, // 14-44 days
        rating: Math.random() * 1.5 + 3.5,
        offersMade: Math.floor(Math.random() * 30),
        closedDeals: Math.floor(Math.random() * 10)
      });
    }
    
    // Generate iBuyers (30)
    console.log('🤖 Generating iBuyers...');
    for (let i = 0; i < 30; i++) {
      const minBudget = Math.floor(Math.random() * 100000) + 150000; // 150k-250k
      const maxBudget = minBudget + Math.floor(Math.random() * 400000) + 100000;
      
      buyers.push({
        buyerType: 'ibuyer',
        companyName: generateCompanyName('ibuyer'),
        contactName: 'Automated System',
        email: `ibuyer${i + 1}@quickbuy.com`,
        phone: `1-800-BUY-${Math.floor(Math.random() * 9000) + 1000}`,
        minBudget,
        maxBudget,
        preferredAreas: generatePreferredAreas('ibuyer', maxBudget),
        preferences: generatePreferences('ibuyer'),
        cashAvailable: true,
        preQualified: true,
        closingTimeline: Math.floor(Math.random() * 10) + 7, // 7-17 days
        rating: Math.random() * 1 + 3.5, // 3.5-4.5
        offersMade: Math.floor(Math.random() * 200),
        closedDeals: Math.floor(Math.random() * 100)
      });
    }
    
    // Generate Developers (40)
    console.log('🏗️  Generating developers...');
    for (let i = 0; i < 40; i++) {
      const minBudget = Math.floor(Math.random() * 300000) + 200000; // 200k-500k
      const maxBudget = minBudget + Math.floor(Math.random() * 3000000) + 500000;
      
      buyers.push({
        buyerType: 'developer',
        companyName: generateCompanyName('developer'),
        contactName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        email: `dev${i + 1}@houstondev.com`,
        phone: `281-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        minBudget,
        maxBudget,
        preferredAreas: generatePreferredAreas('developer', maxBudget),
        preferences: generatePreferences('developer'),
        cashAvailable: Math.random() > 0.5,
        preQualified: true,
        closingTimeline: Math.floor(Math.random() * 60) + 30, // 30-90 days
        rating: Math.random() * 1.5 + 3.5,
        offersMade: Math.floor(Math.random() * 40),
        closedDeals: Math.floor(Math.random() * 15)
      });
    }
    
    // Generate First-Time Buyers (50)
    console.log('🏠 Generating first-time buyers...');
    for (let i = 0; i < 50; i++) {
      const minBudget = Math.floor(Math.random() * 100000) + 150000; // 150k-250k
      const maxBudget = minBudget + Math.floor(Math.random() * 150000) + 50000;
      
      buyers.push({
        buyerType: 'first-time',
        companyName: null,
        contactName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        email: `firsttime${i + 1}@email.com`,
        phone: `346-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        minBudget,
        maxBudget,
        preferredAreas: generatePreferredAreas('first-time', maxBudget),
        preferences: generatePreferences('first-time'),
        cashAvailable: false,
        preQualified: Math.random() > 0.3,
        closingTimeline: Math.floor(Math.random() * 30) + 45, // 45-75 days
        rating: Math.random() * 1 + 4, // 4.0-5.0
        offersMade: Math.floor(Math.random() * 5),
        closedDeals: 0
      });
    }
    
    // Generate Luxury Buyers (30)
    console.log('💎 Generating luxury buyers...');
    for (let i = 0; i < 30; i++) {
      const minBudget = Math.floor(Math.random() * 2000000) + 1000000; // 1M-3M
      const maxBudget = minBudget + Math.floor(Math.random() * 5000000) + 500000;
      
      buyers.push({
        buyerType: 'luxury',
        companyName: Math.random() > 0.5 ? generateCompanyName('luxury') : null,
        contactName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        email: `luxury${i + 1}@privateemail.com`,
        phone: `713-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        minBudget,
        maxBudget,
        preferredAreas: generatePreferredAreas('luxury', maxBudget),
        preferences: generatePreferences('luxury'),
        cashAvailable: Math.random() > 0.3,
        preQualified: true,
        closingTimeline: Math.floor(Math.random() * 60) + 30, // 30-90 days
        rating: Math.random() * 0.5 + 4.5, // 4.5-5.0
        offersMade: Math.floor(Math.random() * 20),
        closedDeals: Math.floor(Math.random() * 5)
      });
    }
    
    console.log(`\n📊 Total buyers generated: ${buyers.length}`);
    console.log('💾 Inserting into database...');
    
    // Insert buyers in batches
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < buyers.length; i += batchSize) {
      const batch = buyers.slice(i, i + batchSize);
      
      // Use raw SQL for insertion since we don't have Prisma model
      for (const buyer of batch) {
        await prisma.$executeRaw`
          INSERT INTO "BuyerProfile" (
            "buyerType", "companyName", "contactName", "email", "phone",
            "minBudget", "maxBudget", "preferredAreas", "preferences",
            "cashAvailable", "preQualified", "closingTimeline", "rating",
            "offersMade", "closedDeals"
          ) VALUES (
            ${buyer.buyerType}, ${buyer.companyName}, ${buyer.contactName}, 
            ${buyer.email}, ${buyer.phone}, ${buyer.minBudget}, ${buyer.maxBudget},
            ${buyer.preferredAreas}, ${buyer.preferences}, ${buyer.cashAvailable},
            ${buyer.preQualified}, ${buyer.closingTimeline}, ${buyer.rating},
            ${buyer.offersMade}, ${buyer.closedDeals}
          )
        `;
        insertedCount++;
      }
      
      console.log(`✅ Inserted ${insertedCount}/${buyers.length} buyers...`);
    }
    
    // Show summary statistics
    const stats = await prisma.$queryRaw`
      SELECT 
        "buyerType",
        COUNT(*) as count,
        AVG("maxBudget") as avg_budget,
        AVG("rating") as avg_rating
      FROM "BuyerProfile"
      GROUP BY "buyerType"
      ORDER BY count DESC
    `;
    
    console.log('\n📊 Buyer Network Summary:');
    // @ts-ignore
    stats.forEach(stat => {
      console.log(`   ${stat.buyerType}: ${stat.count} buyers, Avg Budget: $${Math.round(stat.avg_budget).toLocaleString()}, Avg Rating: ${stat.avg_rating.toFixed(1)}`);
    });
    
    const totalBuyers = await prisma.$queryRaw`SELECT COUNT(*) as total FROM "BuyerProfile"`;
    // @ts-ignore
    console.log(`\n🎉 Total buyers in network: ${totalBuyers[0].total}`);
    
  } catch (error) {
    console.error('💥 Error importing buyer network:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importBuyerNetwork().catch(console.error);