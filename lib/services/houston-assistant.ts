import { queryPerplexity } from './data-intelligence'
import { runDevelopmentScout } from './ai-scout'
import { cache } from 'react'
import { initializeTrainingSystem } from './training-data-collector'

// Houston Development Expert Knowledge Base
export const HOUSTON_KNOWLEDGE_BASE = {
  neighborhoods: {
    "Downtown": {
      aliases: ["downtown", "dt", "central houston", "city center"],
      coordinates: { lat: 29.7604, lng: -95.3698 },
      avg_land_price_per_acre: 3500000,
      zoning: ["commercial", "mixed-use", "high-density residential"],
      key_features: ["business district", "transit hub", "high-rise development"],
      development_trends: "Mixed-use towers, luxury condos, office conversions",
      demographics: "Young professionals, empty nesters",
      avg_construction_cost_sqft: 180,
      permit_approval_time: "6-8 months",
      parking_requirements: "1 space per 500 sqft commercial",
      height_restrictions: "No limit in central core",
      popular_developers: ["Hines", "Skanska", "Midway"]
    },
    "Midtown": {
      aliases: ["midtown", "museum district area", "near downtown"],
      coordinates: { lat: 29.7374, lng: -95.3774 },
      avg_land_price_per_acre: 2800000,
      zoning: ["mixed-use", "commercial", "medium-density residential"],
      key_features: ["entertainment district", "walkable", "nightlife"],
      development_trends: "Mid-rise apartments, retail, restaurants",
      demographics: "Young professionals, students",
      avg_construction_cost_sqft: 165,
      permit_approval_time: "4-6 months",
      parking_requirements: "1.5 spaces per unit",
      height_restrictions: "8 stories max",
      popular_developers: ["Camden", "Greystar", "Hanover"]
    },
    "Heights": {
      aliases: ["the heights", "houston heights", "near heights"],
      coordinates: { lat: 29.7989, lng: -95.3984 },
      avg_land_price_per_acre: 1800000,
      zoning: ["single-family", "townhomes", "limited commercial"],
      key_features: ["historic", "trendy", "walkable"],
      development_trends: "Luxury townhomes, single-family teardowns",
      demographics: "Young families, professionals",
      avg_construction_cost_sqft: 150,
      permit_approval_time: "3-5 months",
      parking_requirements: "2 spaces per unit",
      height_restrictions: "35 feet max",
      popular_developers: ["Newmark Homes", "Village Builders", "Toll Brothers"]
    },
    "Montrose": {
      aliases: ["montrose", "museum district", "near museum"],
      coordinates: { lat: 29.7407, lng: -95.3908 },
      avg_land_price_per_acre: 2200000,
      zoning: ["mixed-use", "commercial", "medium-density"],
      key_features: ["arts district", "diverse", "walkable"],
      development_trends: "Boutique condos, adaptive reuse, galleries",
      demographics: "Artists, young professionals, LGBTQ+ community",
      avg_construction_cost_sqft: 160,
      permit_approval_time: "4-6 months",
      parking_requirements: "1.25 spaces per unit",
      height_restrictions: "6 stories max",
      popular_developers: ["Transwestern", "Hines", "Patrinely Group"]
    },
    "River Oaks": {
      aliases: ["river oaks", "ro", "galleria area"],
      coordinates: { lat: 29.7569, lng: -95.4145 },
      avg_land_price_per_acre: 4500000,
      zoning: ["single-family", "estate lots"],
      key_features: ["luxury", "established", "exclusive"],
      development_trends: "Luxury custom homes, estate subdivisions",
      demographics: "High-net-worth families",
      avg_construction_cost_sqft: 250,
      permit_approval_time: "6-12 months",
      parking_requirements: "3+ spaces per home",
      height_restrictions: "35 feet max",
      popular_developers: ["Mirador Group", "Thompson Custom Homes", "Frankel Building Group"]
    },
    "Galleria": {
      aliases: ["galleria", "uptown", "post oak", "westheimer"],
      coordinates: { lat: 29.7371, lng: -95.4618 },
      avg_land_price_per_acre: 3200000,
      zoning: ["commercial", "office", "high-density residential"],
      key_features: ["business district", "shopping", "international"],
      development_trends: "Office towers, luxury apartments, retail",
      demographics: "International business, high-income professionals",
      avg_construction_cost_sqft: 190,
      permit_approval_time: "8-12 months",
      parking_requirements: "1 space per 300 sqft office",
      height_restrictions: "No limit",
      popular_developers: ["Brookfield", "Hines", "Skanska"]
    },
    "Medical Center": {
      aliases: ["medical center", "tmc", "texas medical center", "med center"],
      coordinates: { lat: 29.7100, lng: -95.3959 },
      avg_land_price_per_acre: 2500000,
      zoning: ["medical", "commercial", "high-density residential"],
      key_features: ["hospitals", "research", "dense employment"],
      development_trends: "Medical office, research facilities, workforce housing",
      demographics: "Medical professionals, students, researchers",
      avg_construction_cost_sqft: 200,
      permit_approval_time: "6-10 months",
      parking_requirements: "1 space per 250 sqft medical",
      height_restrictions: "No limit for medical",
      popular_developers: ["Skanska", "Turner Construction", "Gilbane"]
    },
    "Energy Corridor": {
      aliases: ["energy corridor", "westside", "katy freeway", "i-10 west"],
      coordinates: { lat: 29.7836, lng: -95.6347 },
      avg_land_price_per_acre: 850000,
      zoning: ["commercial", "office", "mixed-use"],
      key_features: ["energy companies", "corporate", "master-planned"],
      development_trends: "Office parks, corporate campuses, mixed-use",
      demographics: "Energy professionals, suburban families",
      avg_construction_cost_sqft: 140,
      permit_approval_time: "4-6 months",
      parking_requirements: "4 spaces per 1000 sqft office",
      height_restrictions: "12 stories max",
      popular_developers: ["Patrinely Group", "Hines", "Transwestern"]
    },
    "Katy": {
      aliases: ["katy", "west houston", "cinco ranch area"],
      coordinates: { lat: 29.7858, lng: -95.8245 },
      avg_land_price_per_acre: 450000,
      zoning: ["single-family", "commercial", "mixed-use"],
      key_features: ["family-friendly", "master-planned", "growing"],
      development_trends: "Single-family subdivisions, retail centers",
      demographics: "Families with children, suburban professionals",
      avg_construction_cost_sqft: 130,
      permit_approval_time: "3-4 months",
      parking_requirements: "2 spaces per unit",
      height_restrictions: "45 feet max",
      popular_developers: ["Toll Brothers", "KB Home", "Lennar"]
    },
    "The Woodlands": {
      aliases: ["woodlands", "the woodlands", "north houston"],
      coordinates: { lat: 30.1658, lng: -95.4613 },
      avg_land_price_per_acre: 750000,
      zoning: ["single-family", "commercial", "office"],
      key_features: ["master-planned", "nature preserve", "corporate"],
      development_trends: "Single-family homes, office parks, retail",
      demographics: "Corporate executives, families",
      avg_construction_cost_sqft: 145,
      permit_approval_time: "2-4 months",
      parking_requirements: "2 spaces per unit",
      height_restrictions: "45 feet max",
      popular_developers: ["The Howard Hughes Corporation", "Toll Brothers", "Village Builders"]
    },
    "Sugar Land": {
      aliases: ["sugar land", "southwest houston", "missouri city area"],
      coordinates: { lat: 29.5994, lng: -95.6348 },
      avg_land_price_per_acre: 550000,
      zoning: ["single-family", "commercial", "mixed-use"],
      key_features: ["master-planned", "diverse", "family-oriented"],
      development_trends: "Single-family subdivisions, town centers",
      demographics: "Diverse families, tech professionals",
      avg_construction_cost_sqft: 135,
      permit_approval_time: "3-5 months",
      parking_requirements: "2 spaces per unit",
      height_restrictions: "45 feet max",
      popular_developers: ["Newland", "Johnson Development", "Lennar"]
    },
    "Cypress": {
      aliases: ["cypress", "northwest houston", "nw houston"],
      coordinates: { lat: 29.9691, lng: -95.6972 },
      avg_land_price_per_acre: 380000,
      zoning: ["single-family", "commercial", "light industrial"],
      key_features: ["growing", "family-friendly", "affordable"],
      development_trends: "Single-family subdivisions, retail strips",
      demographics: "Young families, first-time homebuyers",
      avg_construction_cost_sqft: 125,
      permit_approval_time: "2-3 months",
      parking_requirements: "2 spaces per unit",
      height_restrictions: "35 feet max",
      popular_developers: ["DR Horton", "Lennar", "KB Home"]
    },
    "Pearland": {
      aliases: ["pearland", "south houston", "southeast houston"],
      coordinates: { lat: 29.5635, lng: -95.2860 },
      avg_land_price_per_acre: 480000,
      zoning: ["single-family", "commercial", "mixed-use"],
      key_features: ["family-friendly", "growing", "good schools"],
      development_trends: "Single-family subdivisions, retail centers",
      demographics: "Young families, professionals",
      avg_construction_cost_sqft: 130,
      permit_approval_time: "3-4 months",
      parking_requirements: "2 spaces per unit",
      height_restrictions: "35 feet max",
      popular_developers: ["Toll Brothers", "Village Builders", "Newmark Homes"]
    },
    "Spring": {
      aliases: ["spring", "north houston", "the woodlands area"],
      coordinates: { lat: 30.0799, lng: -95.4172 },
      avg_land_price_per_acre: 420000,
      zoning: ["single-family", "commercial", "mixed-use"],
      key_features: ["suburban", "family-friendly", "growing"],
      development_trends: "Single-family subdivisions, strip centers",
      demographics: "Families, commuters",
      avg_construction_cost_sqft: 128,
      permit_approval_time: "3-4 months",
      parking_requirements: "2 spaces per unit",
      height_restrictions: "35 feet max",
      popular_developers: ["DR Horton", "Lennar", "Centex"]
    },
    "Clear Lake": {
      aliases: ["clear lake", "nasa area", "southeast houston", "webster"],
      coordinates: { lat: 29.5768, lng: -95.1204 },
      avg_land_price_per_acre: 650000,
      zoning: ["single-family", "commercial", "mixed-use"],
      key_features: ["waterfront", "nasa", "recreational"],
      development_trends: "Waterfront condos, single-family homes",
      demographics: "NASA employees, retirees, boating enthusiasts",
      avg_construction_cost_sqft: 140,
      permit_approval_time: "4-6 months",
      parking_requirements: "2 spaces per unit",
      height_restrictions: "45 feet max",
      popular_developers: ["Friendswood Development", "Village Builders", "Toll Brothers"]
    }
  },
  
  development_types: {
    "single-family": {
      typical_roi: "18-25%",
      construction_time: "6-8 months",
      avg_cost_per_sqft: 130,
      financing_options: ["construction loan", "spec loan", "owner financing"],
      key_considerations: ["lot size", "school district", "HOA restrictions"],
      permitting_time: "2-4 months",
      common_sizes: "2000-4000 sqft",
      target_buyers: "families, first-time buyers, move-up buyers"
    },
    "townhomes": {
      typical_roi: "20-28%",
      construction_time: "8-12 months",
      avg_cost_per_sqft: 140,
      financing_options: ["construction loan", "mini-perm", "bridge loan"],
      key_considerations: ["density", "parking", "HOA structure"],
      permitting_time: "3-5 months",
      common_sizes: "1400-2500 sqft",
      target_buyers: "young professionals, empty nesters, investors"
    },
    "apartments": {
      typical_roi: "15-22%",
      construction_time: "12-18 months",
      avg_cost_per_sqft: 125,
      financing_options: ["construction loan", "permanent loan", "bridge loan"],
      key_considerations: ["unit mix", "amenities", "parking ratio"],
      permitting_time: "6-12 months",
      common_sizes: "600-1200 sqft units",
      target_buyers: "institutional investors, REITs, private equity"
    },
    "office": {
      typical_roi: "12-18%",
      construction_time: "15-24 months",
      avg_cost_per_sqft: 180,
      financing_options: ["construction loan", "permanent loan", "joint venture"],
      key_considerations: ["tenant mix", "location", "parking"],
      permitting_time: "8-12 months",
      common_sizes: "50,000-500,000 sqft",
      target_buyers: "REITs, institutional investors, owner-users"
    },
    "retail": {
      typical_roi: "14-20%",
      construction_time: "8-15 months",
      avg_cost_per_sqft: 150,
      financing_options: ["construction loan", "SBA loan", "ground lease"],
      key_considerations: ["anchor tenant", "traffic counts", "demographics"],
      permitting_time: "4-8 months",
      common_sizes: "5,000-100,000 sqft",
      target_buyers: "retail investors, REITs, owner-users"
    },
    "industrial": {
      typical_roi: "16-24%",
      construction_time: "6-12 months",
      avg_cost_per_sqft: 85,
      financing_options: ["construction loan", "SBA loan", "build-to-suit"],
      key_considerations: ["truck access", "rail access", "utilities"],
      permitting_time: "3-6 months",
      common_sizes: "10,000-1,000,000 sqft",
      target_buyers: "industrial REITs, logistics companies, manufacturers"
    },
    "mixed-use": {
      typical_roi: "18-25%",
      construction_time: "18-36 months",
      avg_cost_per_sqft: 160,
      financing_options: ["construction loan", "mezzanine", "joint venture"],
      key_considerations: ["phasing", "parking", "retail synergy"],
      permitting_time: "8-15 months",
      common_sizes: "100,000-1,000,000 sqft",
      target_buyers: "institutional investors, developers, REITs"
    }
  },

  financing: {
    "construction_loan": {
      typical_ltv: "70-80%",
      interest_rate: "Prime + 0.5-2%",
      term: "12-24 months",
      requirements: ["experience", "equity", "pre-sales/leases"],
      best_for: ["experienced developers", "pre-sold projects"]
    },
    "spec_loan": {
      typical_ltv: "65-75%",
      interest_rate: "Prime + 1-3%",
      term: "6-12 months",
      requirements: ["strong market", "exit strategy", "reserves"],
      best_for: ["single-family", "townhomes", "small projects"]
    },
    "bridge_loan": {
      typical_ltv: "60-70%",
      interest_rate: "8-12%",
      term: "6-24 months",
      requirements: ["clear exit", "asset quality", "sponsor strength"],
      best_for: ["value-add", "lease-up", "refinancing"]
    },
    "permanent_loan": {
      typical_ltv: "75-80%",
      interest_rate: "5-7%",
      term: "10-30 years",
      requirements: ["stabilized asset", "cash flow", "market"],
      best_for: ["hold strategy", "refinancing", "acquisition"]
    }
  },

  permits: {
    "city_of_houston": {
      typical_timeline: "3-6 months",
      key_departments: ["Planning", "Public Works", "Fire", "Building"],
      common_delays: ["traffic study", "drainage", "utility conflicts"],
      expedite_options: ["express review", "pre-application meeting"],
      fees: "$2-5 per sqft",
      contact: "832-393-6200"
    },
    "harris_county": {
      typical_timeline: "2-4 months",
      key_departments: ["Engineering", "Fire Marshal", "Environmental"],
      common_delays: ["septic approval", "road improvements", "environmental"],
      expedite_options: ["pre-submission meeting", "fast track"],
      fees: "$1-3 per sqft",
      contact: "713-274-3000"
    }
  },

  contractors: {
    "general_contractors": [
      {
        name: "Skanska",
        specialties: ["high-rise", "commercial", "medical"],
        typical_projects: "$50M+",
        contact: "713-654-4000",
        reputation: "Premium quality, experienced with complex projects"
      },
      {
        name: "Hines Construction",
        specialties: ["office", "mixed-use", "retail"],
        typical_projects: "$25M+",
        contact: "713-621-8000",
        reputation: "Developer-builder, integrated approach"
      },
      {
        name: "Gilbane",
        specialties: ["healthcare", "education", "commercial"],
        typical_projects: "$10M+",
        contact: "713-961-2000",
        reputation: "Strong project management, on-time delivery"
      }
    ],
    "residential_builders": [
      {
        name: "Toll Brothers",
        specialties: ["luxury homes", "active adult", "townhomes"],
        typical_projects: "$500K+",
        contact: "281-367-3100",
        reputation: "Luxury market leader, high-end finishes"
      },
      {
        name: "Village Builders",
        specialties: ["single-family", "townhomes", "master-planned"],
        typical_projects: "$200K+",
        contact: "713-328-3060",
        reputation: "Quality construction, good value"
      },
      {
        name: "Newmark Homes",
        specialties: ["custom homes", "luxury", "infill"],
        typical_projects: "$400K+",
        contact: "713-827-9000",
        reputation: "Custom builder, design flexibility"
      }
    ]
  },

  regulations: {
    "setbacks": {
      "single_family": "25 ft front, 5 ft side, 10 ft rear",
      "townhomes": "20 ft front, 0 ft side, 10 ft rear",
      "apartments": "25 ft front, 10 ft side, 15 ft rear",
      "commercial": "25 ft front, 10 ft side, 15 ft rear"
    },
    "height_limits": {
      "single_family": "35 ft max",
      "townhomes": "35 ft max",
      "apartments": "varies by district",
      "commercial": "varies by district"
    },
    "parking_requirements": {
      "single_family": "2 spaces per unit",
      "apartments": "1.5 spaces per unit",
      "office": "1 space per 300 sqft",
      "retail": "1 space per 200 sqft",
      "restaurant": "1 space per 100 sqft"
    },
    "landscape_requirements": {
      "residential": "20% of lot area",
      "commercial": "25% of lot area",
      "industrial": "15% of lot area"
    }
  }
}

// Common development queries and responses
export const TRAINING_EXAMPLES = [
  {
    query: "What's the average construction cost per square foot in Houston?",
    intent: "cost_inquiry",
    response: "Construction costs in Houston vary by project type: Single-family homes average $130/sqft, townhomes $140/sqft, apartments $125/sqft, office buildings $180/sqft, and retail $150/sqft. These are 2024 prices including labor and materials but excluding land, permits, and soft costs."
  },
  {
    query: "Find me land in the Medical Center under $3M",
    intent: "property_search",
    response: "The Medical Center area typically runs $2.5M per acre. For under $3M, you'd be looking at 1+ acre sites. I can help you search for specific opportunities. The area is great for medical office, research facilities, or workforce housing. Typical ROI is 15-20% for medical office development."
  },
  {
    query: "What's the permit approval time for apartments in Houston?",
    intent: "permitting_inquiry",
    response: "Apartment permit approval in Houston typically takes 6-12 months. The process involves Planning Department review, Public Works approval, Fire Department review, and Building Department permitting. Common delays include traffic studies, drainage requirements, and utility conflicts. I recommend pre-application meetings to expedite the process."
  },
  {
    query: "Best neighborhoods for townhome development?",
    intent: "market_analysis",
    response: "Top neighborhoods for townhome development are Heights ($1.8M/acre, strong demand), Midtown ($2.8M/acre, young professionals), Montrose ($2.2M/acre, arts district), and Energy Corridor ($850K/acre, corporate workers). Heights and Midtown offer the best ROI at 22-28%. Consider parking requirements and HOA structures."
  },
  {
    query: "ROI for single family development in Katy?",
    intent: "roi_calculation",
    response: "Single-family development in Katy typically delivers 18-25% ROI. Land costs average $450K/acre, construction $130/sqft, and homes sell for $200-400K. The area is popular with families seeking good schools and master-planned communities. Permit approval takes 3-4 months, construction 6-8 months."
  },
  {
    query: "Who are the best general contractors in Houston?",
    intent: "contractor_inquiry",
    response: "Top general contractors in Houston include: Skanska (high-rise/commercial, $50M+ projects), Hines Construction (mixed-use/office, $25M+), and Gilbane (healthcare/education, $10M+). For residential: Toll Brothers (luxury homes), Village Builders (production homes), and Newmark Homes (custom builds). Choose based on project type and budget."
  },
  {
    query: "Zoning requirements for mixed-use development?",
    intent: "zoning_inquiry",
    response: "Mixed-use developments in Houston require special zoning approval. Key requirements include: 25ft front setback, 10ft side setback, parking varies by use (retail: 1/200sqft, residential: 1.5/unit), height limits vary by district, and 25% landscaping. The approval process takes 8-15 months and requires public hearings."
  },
  {
    query: "How to finance apartment development?",
    intent: "financing_inquiry",
    response: "Apartment development financing options include: Construction loans (70-80% LTV, Prime+0.5-2%), Bridge loans (60-70% LTV, 8-12%), and Permanent loans (75-80% LTV, 5-7%). You'll need development experience, 20-30% equity, and often pre-leasing requirements. I can help you find the best financing structure for your project."
  }
]

// Query processing and intent recognition
export interface QueryResult {
  response: string
  confidence: number
  intent: string
  followUpQuestions?: string[]
  dataUsed?: string[]
  actionItems?: string[]
}

export const processQuery = cache(async (query: string): Promise<QueryResult> => {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Check for exact matches first
  const exactMatch = TRAINING_EXAMPLES.find(example => 
    normalizedQuery === example.query.toLowerCase()
  )
  
  if (exactMatch) {
    return {
      response: exactMatch.response,
      confidence: 1.0,
      intent: exactMatch.intent,
      followUpQuestions: generateFollowUpQuestions(exactMatch.intent),
      dataUsed: ['Houston Knowledge Base'],
      actionItems: generateActionItems(exactMatch.intent)
    }
  }
  
  // Intent detection
  const intent = detectIntent(normalizedQuery)
  
  // Use knowledge base for specific intents
  if (intent === 'neighborhood_inquiry') {
    return await handleNeighborhoodInquiry(normalizedQuery)
  } else if (intent === 'cost_inquiry') {
    return await handleCostInquiry(normalizedQuery)
  } else if (intent === 'property_search') {
    return await handlePropertySearch(normalizedQuery)
  } else if (intent === 'roi_calculation') {
    return await handleROICalculation(normalizedQuery)
  } else if (intent === 'permitting_inquiry') {
    return await handlePermittingInquiry(normalizedQuery)
  } else if (intent === 'financing_inquiry') {
    return await handleFinancingInquiry(normalizedQuery)
  }
  
  // Fall back to Perplexity for complex queries
  return await handleComplexQuery(normalizedQuery)
})

const detectIntent = (query: string): string => {
  const intentPatterns = {
    'neighborhood_inquiry': ['neighborhood', 'area', 'district', 'where should', 'best location'],
    'cost_inquiry': ['cost', 'price', 'expensive', 'budget', 'per square foot', 'per sqft'],
    'property_search': ['find', 'search', 'looking for', 'available', 'land', 'property'],
    'roi_calculation': ['roi', 'return', 'profit', 'investment', 'yield', 'percentage'],
    'permitting_inquiry': ['permit', 'approval', 'zoning', 'regulations', 'requirements'],
    'financing_inquiry': ['financing', 'loan', 'lender', 'money', 'capital', 'fund'],
    'contractor_inquiry': ['contractor', 'builder', 'construction', 'who builds', 'recommend'],
    'market_analysis': ['market', 'trend', 'demand', 'best', 'opportunity', 'analysis']
  }
  
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (patterns.some(pattern => query.includes(pattern))) {
      return intent
    }
  }
  
  return 'general_inquiry'
}

const handleNeighborhoodInquiry = async (query: string): Promise<QueryResult> => {
  // Extract neighborhood from query
  const neighborhood = extractNeighborhood(query)
  
  if (neighborhood && HOUSTON_KNOWLEDGE_BASE.neighborhoods[neighborhood]) {
    const data = HOUSTON_KNOWLEDGE_BASE.neighborhoods[neighborhood]
    const response = `${neighborhood} is a ${data.key_features.join(', ')} area with average land prices of ${formatCurrency(data.avg_land_price_per_acre)} per acre. Current development trends include ${data.development_trends}. Construction costs average $${data.avg_construction_cost_sqft}/sqft with permit approval taking ${data.permit_approval_time}. The area attracts ${data.demographics}.`
    
    return {
      response,
      confidence: 0.9,
      intent: 'neighborhood_inquiry',
      followUpQuestions: [
        "Would you like specific property recommendations in this area?",
        "What type of development are you considering?",
        "Do you need financing options for this location?"
      ],
      dataUsed: ['Houston Knowledge Base'],
      actionItems: [
        "Search for available properties in " + neighborhood,
        "Run feasibility analysis for your project type",
        "Connect with local contractors and architects"
      ]
    }
  }
  
  return await handleComplexQuery(query)
}

const handleCostInquiry = async (query: string): Promise<QueryResult> => {
  const projectType = extractProjectType(query)
  
  if (projectType && HOUSTON_KNOWLEDGE_BASE.development_types[projectType]) {
    const data = HOUSTON_KNOWLEDGE_BASE.development_types[projectType]
    const response = `${projectType.replace('_', ' ').toUpperCase()} development in Houston costs approximately $${data.avg_cost_per_sqft}/sqft. Construction typically takes ${data.construction_time} with ${data.typical_roi} ROI. Key considerations include ${data.key_considerations.join(', ')}. Common financing options are ${data.financing_options.join(', ')}.`
    
    return {
      response,
      confidence: 0.9,
      intent: 'cost_inquiry',
      followUpQuestions: [
        "What size project are you considering?",
        "Do you need help with financing options?",
        "Would you like contractor recommendations?"
      ],
      dataUsed: ['Houston Knowledge Base', 'Construction Cost Database'],
      actionItems: [
        "Run detailed cost analysis for your project",
        "Get quotes from recommended contractors",
        "Explore financing options"
      ]
    }
  }
  
  return await handleComplexQuery(query)
}

const handlePropertySearch = async (query: string): Promise<QueryResult> => {
  // Extract search criteria
  const location = extractNeighborhood(query)
  const priceLimit = extractPriceLimit(query)
  const size = extractSize(query)
  
  let response = "I can help you find properties in Houston. "
  
  if (location) {
    response += `Looking in ${location}, `
  }
  
  if (priceLimit) {
    response += `under ${formatCurrency(priceLimit)}, `
  }
  
  if (size) {
    response += `approximately ${size} acres. `
  }
  
  response += "Let me search our database for current opportunities and run the AI Scout to find the best matches for your criteria."
  
  return {
    response,
    confidence: 0.8,
    intent: 'property_search',
    followUpQuestions: [
      "What type of development are you planning?",
      "What's your timeline for acquisition?",
      "Do you need financing pre-approval?"
    ],
    dataUsed: ['Property Database', 'AI Scout'],
    actionItems: [
      "Run AI Scout with your criteria",
      "Schedule property tours",
      "Prepare LOI templates"
    ]
  }
}

const handleROICalculation = async (query: string): Promise<QueryResult> => {
  const projectType = extractProjectType(query)
  const location = extractNeighborhood(query)
  
  let response = "ROI calculations depend on several factors. "
  
  if (projectType && HOUSTON_KNOWLEDGE_BASE.development_types[projectType]) {
    const data = HOUSTON_KNOWLEDGE_BASE.development_types[projectType]
    response += `For ${projectType} development, typical ROI ranges from ${data.typical_roi}. `
  }
  
  if (location && HOUSTON_KNOWLEDGE_BASE.neighborhoods[location]) {
    const data = HOUSTON_KNOWLEDGE_BASE.neighborhoods[location]
    response += `In ${location}, land costs average ${formatCurrency(data.avg_land_price_per_acre)} per acre with construction at $${data.avg_construction_cost_sqft}/sqft. `
  }
  
  response += "I can run a detailed ROI analysis with your specific parameters."
  
  return {
    response,
    confidence: 0.8,
    intent: 'roi_calculation',
    followUpQuestions: [
      "What's your target investment amount?",
      "What's your preferred hold period?",
      "Do you need help with financing assumptions?"
    ],
    dataUsed: ['Houston Knowledge Base', 'ROI Calculator'],
    actionItems: [
      "Run comprehensive ROI analysis",
      "Create sensitivity analysis",
      "Compare with market benchmarks"
    ]
  }
}

const handlePermittingInquiry = async (query: string): Promise<QueryResult> => {
  const projectType = extractProjectType(query)
  const location = extractNeighborhood(query)
  
  let response = "Permitting in Houston varies by project type and location. "
  
  if (projectType && HOUSTON_KNOWLEDGE_BASE.development_types[projectType]) {
    const data = HOUSTON_KNOWLEDGE_BASE.development_types[projectType]
    response += `For ${projectType} development, typical permitting takes ${data.permitting_time}. `
  }
  
  response += "Key departments include Planning, Public Works, Fire, and Building. Common delays involve traffic studies, drainage requirements, and utility conflicts. I recommend pre-application meetings to expedite the process."
  
  return {
    response,
    confidence: 0.9,
    intent: 'permitting_inquiry',
    followUpQuestions: [
      "Do you need help with permit applications?",
      "Would you like expedited review options?",
      "Do you need consultant recommendations?"
    ],
    dataUsed: ['Houston Knowledge Base', 'Permit Database'],
    actionItems: [
      "Schedule pre-application meeting",
      "Prepare permit application package",
      "Connect with permitting consultants"
    ]
  }
}

const handleFinancingInquiry = async (query: string): Promise<QueryResult> => {
  const projectType = extractProjectType(query)
  
  let response = "Financing options in Houston include construction loans, bridge loans, and permanent financing. "
  
  if (projectType && HOUSTON_KNOWLEDGE_BASE.development_types[projectType]) {
    const data = HOUSTON_KNOWLEDGE_BASE.development_types[projectType]
    response += `For ${projectType} development, common options are ${data.financing_options.join(', ')}. `
  }
  
  response += "Typical requirements include development experience, 20-30% equity, and often pre-sales or pre-leasing. I can help you find the best financing structure for your project."
  
  return {
    response,
    confidence: 0.9,
    intent: 'financing_inquiry',
    followUpQuestions: [
      "What's your experience level with development?",
      "How much equity can you contribute?",
      "Do you need help with lender introductions?"
    ],
    dataUsed: ['Houston Knowledge Base', 'Financing Database'],
    actionItems: [
      "Prepare financing package",
      "Connect with preferred lenders",
      "Structure optimal deal terms"
    ]
  }
}

const handleComplexQuery = async (query: string): Promise<QueryResult> => {
  try {
    const contextualQuery = `As a Houston development expert, answer this question about Houston real estate development: "${query}". Provide specific, actionable advice based on Houston market conditions, regulations, and opportunities.`
    
    const response = await queryPerplexity(contextualQuery)
    
    return {
      response,
      confidence: 0.7,
      intent: 'complex_inquiry',
      followUpQuestions: [
        "Would you like more specific information about any aspect?",
        "Do you need help with next steps?",
        "Should I run additional analysis?"
      ],
      dataUsed: ['Perplexity AI', 'Houston Knowledge Base'],
      actionItems: [
        "Research specific opportunities",
        "Connect with relevant professionals",
        "Prepare detailed analysis"
      ]
    }
  } catch (error) {
    return {
      response: "I apologize, but I'm having trouble processing your request right now. Please try rephrasing your question or contact our support team for immediate assistance.",
      confidence: 0.1,
      intent: 'error',
      dataUsed: ['Error Handler']
    }
  }
}

// Helper functions
const extractNeighborhood = (query: string): string | null => {
  const neighborhoods = Object.keys(HOUSTON_KNOWLEDGE_BASE.neighborhoods)
  for (const neighborhood of neighborhoods) {
    const aliases = HOUSTON_KNOWLEDGE_BASE.neighborhoods[neighborhood].aliases
    if (aliases.some(alias => query.includes(alias.toLowerCase()))) {
      return neighborhood
    }
  }
  return null
}

const extractProjectType = (query: string): string | null => {
  const types = Object.keys(HOUSTON_KNOWLEDGE_BASE.development_types)
  for (const type of types) {
    if (query.includes(type.replace('_', ' ')) || query.includes(type)) {
      return type
    }
  }
  return null
}

const extractPriceLimit = (query: string): number | null => {
  const priceMatch = query.match(/under\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*([kmb])?/i)
  if (priceMatch) {
    let amount = parseFloat(priceMatch[1].replace(/,/g, ''))
    const unit = priceMatch[2]?.toLowerCase()
    
    if (unit === 'k') amount *= 1000
    else if (unit === 'm') amount *= 1000000
    else if (unit === 'b') amount *= 1000000000
    
    return amount
  }
  return null
}

const extractSize = (query: string): string | null => {
  const sizeMatch = query.match(/(\d+(?:\.\d+)?)\s*acres?/i)
  return sizeMatch ? sizeMatch[1] : null
}

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount.toFixed(0)}`
}

const generateFollowUpQuestions = (intent: string): string[] => {
  const questions = {
    'neighborhood_inquiry': [
      "Would you like property recommendations in this area?",
      "What type of development are you considering?",
      "Do you need financing options for this location?"
    ],
    'cost_inquiry': [
      "What size project are you considering?",
      "Do you need help with financing options?",
      "Would you like contractor recommendations?"
    ],
    'property_search': [
      "What type of development are you planning?",
      "What's your timeline for acquisition?",
      "Do you need financing pre-approval?"
    ],
    'roi_calculation': [
      "What's your target investment amount?",
      "What's your preferred hold period?",
      "Do you need help with financing assumptions?"
    ]
  }
  
  return questions[intent] || [
    "How can I help you further?",
    "Do you need additional information?",
    "Would you like me to run more analysis?"
  ]
}

const generateActionItems = (intent: string): string[] => {
  const actions = {
    'neighborhood_inquiry': [
      "Search for available properties in area",
      "Run feasibility analysis for project type",
      "Connect with local contractors and architects"
    ],
    'cost_inquiry': [
      "Run detailed cost analysis",
      "Get quotes from recommended contractors",
      "Explore financing options"
    ],
    'property_search': [
      "Run AI Scout with criteria",
      "Schedule property tours",
      "Prepare LOI templates"
    ],
    'roi_calculation': [
      "Run comprehensive ROI analysis",
      "Create sensitivity analysis",
      "Compare with market benchmarks"
    ]
  }
  
  return actions[intent] || [
    "Research specific opportunities",
    "Connect with relevant professionals",
    "Prepare detailed analysis"
  ]
}

// Initialize the training system when the module is loaded
let trainingSystemInitialized = false

const initializeIfNeeded = async () => {
  if (!trainingSystemInitialized) {
    trainingSystemInitialized = true
    await initializeTrainingSystem()
  }
}

// Auto-initialize when the module is imported
setTimeout(initializeIfNeeded, 1000)