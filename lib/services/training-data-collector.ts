import { queryPerplexity } from './data-intelligence'

// Training data collection and enhancement system
export interface TrainingExample {
  id: string
  query: string
  intent: string
  entities: Record<string, any>
  response: string
  confidence: number
  feedback?: 'positive' | 'negative'
  timestamp: Date
  userContext?: {
    sessionId: string
    previousQueries: string[]
    userType: 'developer' | 'investor' | 'contractor' | 'other'
  }
}

export interface EntityExtraction {
  neighborhoods: string[]
  priceRange: { min?: number; max?: number }
  propertyType: string[]
  projectSize: string[]
  timeframe: string[]
  developmentType: string[]
}

// Enhanced training examples with Houston-specific context
export const COMPREHENSIVE_TRAINING_DATA: TrainingExample[] = [
  // Property Search Queries
  {
    id: 'search_001',
    query: 'Find me 3-5 acres in Cypress under $2M for residential development',
    intent: 'property_search',
    entities: {
      neighborhood: 'Cypress',
      size: { min: 3, max: 5 },
      price: { max: 2000000 },
      development_type: 'residential'
    },
    response: 'Cypress is an excellent choice for residential development! At $380K/acre average, you can find 3-5 acres under $2M. The area offers fast permit approvals (2-3 months), $125/sqft construction costs, and strong demand from young families. I found 4 active listings matching your criteria. Would you like me to run feasibility analysis on the top prospects?',
    confidence: 0.95,
    timestamp: new Date()
  },
  
  // ROI Calculations
  {
    id: 'roi_001',
    query: 'What ROI can I expect from townhome development in the Heights?',
    intent: 'roi_calculation',
    entities: {
      neighborhood: 'Heights',
      development_type: 'townhomes',
      calculation_type: 'roi'
    },
    response: 'Heights townhome development typically delivers 22-28% ROI. Land costs $1.8M/acre, construction $150/sqft, and units sell for $400-600K. Key factors: 35ft height limit, 2 parking spaces required, and strong walkability premium. Historic district restrictions in some areas may affect timeline. Target young professionals and families who want urban living with a yard.',
    confidence: 0.92,
    timestamp: new Date()
  },
  
  // Financing Questions
  {
    id: 'finance_001',
    query: 'Best financing options for first-time apartment developer?',
    intent: 'financing_inquiry',
    entities: {
      development_type: 'apartments',
      experience_level: 'first_time',
      financing_type: 'construction'
    },
    response: 'For first-time apartment developers, start with smaller projects (20-50 units) and consider: 1) SBA 504 loans (lower down payment), 2) Partnership with experienced developer, 3) Hard money construction loans (higher cost but more flexible), 4) Community banks (better relationship-based lending). You\'ll need 25-30% down, development experience or strong team, and pre-leasing commitments.',
    confidence: 0.90,
    timestamp: new Date()
  },
  
  // Permit Questions
  {
    id: 'permit_001',
    query: 'How long does it take to get permits for mixed-use development in Midtown?',
    intent: 'permitting_inquiry',
    entities: {
      neighborhood: 'Midtown',
      development_type: 'mixed_use',
      permit_type: 'development'
    },
    response: 'Mixed-use permits in Midtown typically take 6-8 months. Process includes: Planning review (2-3 months), Public Works approval (1-2 months), Fire Department review (1 month), and Building permits (2-3 months). Key requirements: 25ft setbacks, 1.5 parking spaces per residential unit, ground-floor retail encouraged. Schedule pre-application meeting to expedite - can save 2-4 weeks.',
    confidence: 0.88,
    timestamp: new Date()
  },
  
  // Market Analysis
  {
    id: 'market_001',
    query: 'Which Houston neighborhoods are best for luxury single-family development?',
    intent: 'market_analysis',
    entities: {
      development_type: 'single_family',
      market_segment: 'luxury',
      analysis_type: 'neighborhood_comparison'
    },
    response: 'Top luxury single-family neighborhoods: 1) River Oaks ($4.5M/acre, $250/sqft construction) - ultra-luxury market, 2) Memorial ($3.2M/acre, $200/sqft) - established families, 3) Tanglewood ($2.8M/acre, $180/sqft) - country club lifestyle, 4) West University ($3.5M/acre, $190/sqft) - excellent schools. Focus on lots 0.5+ acres, custom builds $800K+, and 6-12 month sales cycles.',
    confidence: 0.94,
    timestamp: new Date()
  },
  
  // Construction & Contractors
  {
    id: 'contractor_001',
    query: 'Recommend general contractors for 100-unit apartment complex',
    intent: 'contractor_inquiry',
    entities: {
      development_type: 'apartments',
      project_size: '100_units',
      contractor_type: 'general'
    },
    response: 'For 100-unit apartment projects, I recommend: 1) Skanska ($15-20M projects, premium quality), 2) Gilbane ($10-15M range, strong multifamily experience), 3) Brasfield & Gorrie ($8-12M, good cost control), 4) Bartlett Cocke ($5-10M, local expertise). All have Houston multifamily experience, proper bonding, and union relationships. Request references from similar projects completed in last 2 years.',
    confidence: 0.87,
    timestamp: new Date()
  },
  
  // Zoning & Regulations
  {
    id: 'zoning_001',
    query: 'What are the parking requirements for retail development in Houston?',
    intent: 'zoning_inquiry',
    entities: {
      development_type: 'retail',
      regulation_type: 'parking',
      jurisdiction: 'houston'
    },
    response: 'Houston retail parking requirements: 1 space per 200 sqft of gross floor area. Restaurants: 1 space per 100 sqft. Shopping centers: 1 space per 250 sqft. Additional requirements: 25ft front setback, 10ft side setback, 25% landscape coverage. Shared parking agreements allowed for mixed-use. Consider adding 10-20% extra spaces for peak shopping periods.',
    confidence: 0.91,
    timestamp: new Date()
  },
  
  // Cost Inquiries
  {
    id: 'cost_001',
    query: 'Current construction costs for Class A office building in Galleria?',
    intent: 'cost_inquiry',
    entities: {
      development_type: 'office',
      building_class: 'class_a',
      neighborhood: 'Galleria',
      cost_type: 'construction'
    },
    response: 'Class A office construction in Galleria: $190-220/sqft including: Steel frame, high-end finishes, building systems, underground parking. Additional costs: Land ($3.2M/acre), soft costs (15-20%), permits ($3-5/sqft), parking ($25K/space). Total development cost: $250-300/sqft. Market rents: $28-35/sqft NNN. Target 12-18% ROI with 75% pre-leasing.',
    confidence: 0.89,
    timestamp: new Date()
  },
  
  // Investment Strategy
  {
    id: 'strategy_001',
    query: 'Should I build spec homes or custom homes in Katy?',
    intent: 'strategy_inquiry',
    entities: {
      neighborhood: 'Katy',
      development_type: 'single_family',
      strategy_type: 'spec_vs_custom'
    },
    response: 'In Katy, spec homes typically perform better: Faster sales cycles (3-6 months vs 6-12), lower risk, easier financing. Target: 2,000-3,000 sqft, $300-500K price point, family-friendly features. Custom homes work for: Premium lots ($100K+), luxury market ($600K+), established builders. Current market favors spec due to inventory shortage and move-in ready demand from relocating families.',
    confidence: 0.86,
    timestamp: new Date()
  },
  
  // Infrastructure & Development
  {
    id: 'infrastructure_001',
    query: 'How does the new Metro rail expansion affect property values?',
    intent: 'infrastructure_inquiry',
    entities: {
      infrastructure_type: 'transit',
      system: 'metro_rail',
      impact: 'property_values'
    },
    response: 'Metro rail expansion creates 15-25% property value increases within 0.5 miles of stations. Best opportunities: Transit-oriented development (TOD), mixed-use projects, workforce housing. Key stations: Downtown, Medical Center, Midtown connections. Timeline: 2025-2027 completion. Focus on areas with planned stations but current lower values. Mixed-use zoning preferred near stations.',
    confidence: 0.83,
    timestamp: new Date()
  },
  
  // Economic & Market Conditions
  {
    id: 'market_conditions_001',
    query: 'How do oil prices affect Houston real estate development?',
    intent: 'market_conditions',
    entities: {
      factor: 'oil_prices',
      impact: 'real_estate',
      market: 'houston'
    },
    response: 'Oil prices significantly impact Houston development: $60+/barrel = strong market, $40-60 = moderate activity, <$40 = cautious development. Energy Corridor and Westside most affected. Diversification into tech, medical, and aerospace reduces dependence. Current market: Mixed signals, focus on diverse employment areas like Medical Center, Downtown, and master-planned communities.',
    confidence: 0.84,
    timestamp: new Date()
  },
  
  // Comparative Analysis
  {
    id: 'comparison_001',
    query: 'Compare development costs between Houston and Dallas',
    intent: 'comparative_analysis',
    entities: {
      cities: ['Houston', 'Dallas'],
      comparison_type: 'development_costs'
    },
    response: 'Houston vs Dallas development costs: Land - Houston 15-20% lower, Labor - Houston 5-10% lower, Materials - Similar, Permits - Houston faster/cheaper. Houston advantages: No state income tax, energy sector jobs, port access. Dallas advantages: Corporate relocations, higher population growth. Houston recommended for: Industrial, energy-related, medical. Dallas for: Corporate, tech, retail.',
    confidence: 0.87,
    timestamp: new Date()
  },
  
  // Seasonal & Timing
  {
    id: 'timing_001',
    query: 'Best time of year to start construction in Houston?',
    intent: 'timing_inquiry',
    entities: {
      activity: 'construction',
      timing: 'seasonal',
      location: 'houston'
    },
    response: 'Best construction start times in Houston: October-March (mild weather, less rain). Avoid: June-September (hurricanes, extreme heat, afternoon storms). Site work: October-December ideal. Concrete pours: Avoid July-August heat. Roofing: October-April. Hurricane season impacts: June-November, peak August-October. Plan weather delays into schedule, especially summer months.',
    confidence: 0.90,
    timestamp: new Date()
  },
  
  // Risk Assessment
  {
    id: 'risk_001',
    query: 'What are the main risks for Houston development projects?',
    intent: 'risk_assessment',
    entities: {
      assessment_type: 'development_risks',
      location: 'houston'
    },
    response: 'Major Houston development risks: 1) Flooding (check flood maps, drainage), 2) Soil conditions (expansive clay, high water table), 3) Hurricane damage (wind, storm surge), 4) Oil price volatility (economic cycles), 5) Permitting delays (drainage requirements), 6) Labor shortages (skilled trades). Mitigation: Insurance, soil studies, contingency planning, diverse tenant base.',
    confidence: 0.88,
    timestamp: new Date()
  },
  
  // Tenant & Buyer Profiles
  {
    id: 'tenant_profile_001',
    query: 'What do Houston apartment tenants want in 2024?',
    intent: 'tenant_preferences',
    entities: {
      property_type: 'apartments',
      tenant_type: 'residential',
      year: '2024'
    },
    response: '2024 Houston apartment tenant priorities: 1) Home office space (80% want dedicated workspace), 2) Outdoor amenities (pools, courtyards, dog parks), 3) Package lockers (online shopping), 4) Fast internet (fiber preferred), 5) Parking (covered preferred), 6) Short commutes (walkable/transit). Premium for: Smart home tech, fitness centers, rooftop spaces. Avoid: Tiny units, limited parking.',
    confidence: 0.91,
    timestamp: new Date()
  }
]

// Generate synthetic training data for comprehensive coverage
export const generateSyntheticTrainingData = async (): Promise<TrainingExample[]> => {
  const templates = [
    {
      pattern: "Find me {size} acres in {neighborhood} under ${price}",
      intent: "property_search",
      variations: [
        { size: "2-3", neighborhood: "Spring", price: "1500000" },
        { size: "5-10", neighborhood: "Cypress", price: "3000000" },
        { size: "1-2", neighborhood: "Heights", price: "2500000" }
      ]
    },
    {
      pattern: "What's the ROI for {development_type} development in {neighborhood}?",
      intent: "roi_calculation",
      variations: [
        { development_type: "apartment", neighborhood: "Downtown" },
        { development_type: "office", neighborhood: "Energy Corridor" },
        { development_type: "retail", neighborhood: "Sugar Land" }
      ]
    },
    {
      pattern: "Best {contractor_type} contractors for {project_type} projects",
      intent: "contractor_inquiry",
      variations: [
        { contractor_type: "general", project_type: "commercial" },
        { contractor_type: "residential", project_type: "luxury home" },
        { contractor_type: "civil", project_type: "infrastructure" }
      ]
    },
    {
      pattern: "How long does {permit_type} permit take in {jurisdiction}?",
      intent: "permitting_inquiry",
      variations: [
        { permit_type: "building", jurisdiction: "Houston" },
        { permit_type: "site development", jurisdiction: "Harris County" },
        { permit_type: "commercial", jurisdiction: "Sugar Land" }
      ]
    }
  ]

  const syntheticData: TrainingExample[] = []

  for (const template of templates) {
    for (const variation of template.variations) {
      let query = template.pattern
      const entities: Record<string, any> = {}

      // Replace placeholders with actual values
      Object.entries(variation).forEach(([key, value]) => {
        query = query.replace(`{${key}}`, value)
        entities[key] = value
      })

      // Generate response using Perplexity
      try {
        const response = await queryPerplexity(
          `As a Houston development expert, answer this question: "${query}". Provide specific, actionable advice with Houston market data.`
        )

        syntheticData.push({
          id: `synthetic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          query,
          intent: template.intent,
          entities,
          response,
          confidence: 0.8,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Error generating synthetic data:', error)
      }
    }
  }

  return syntheticData
}

// Entity extraction from user queries
export const extractEntities = (query: string): EntityExtraction => {
  const entities: EntityExtraction = {
    neighborhoods: [],
    priceRange: {},
    propertyType: [],
    projectSize: [],
    timeframe: [],
    developmentType: []
  }

  const queryLower = query.toLowerCase()

  // Extract neighborhoods
  const neighborhoods = [
    'downtown', 'midtown', 'heights', 'montrose', 'river oaks', 'galleria',
    'medical center', 'energy corridor', 'katy', 'woodlands', 'sugar land',
    'cypress', 'pearland', 'spring', 'clear lake', 'memorial', 'bellaire'
  ]

  neighborhoods.forEach(neighborhood => {
    if (queryLower.includes(neighborhood)) {
      entities.neighborhoods.push(neighborhood)
    }
  })

  // Extract price range
  const priceMatch = queryLower.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*([kmb])?/g)
  if (priceMatch) {
    priceMatch.forEach(price => {
      const match = price.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*([kmb])?/)
      if (match) {
        let amount = parseFloat(match[1].replace(/,/g, ''))
        const unit = match[2]?.toLowerCase()
        
        if (unit === 'k') amount *= 1000
        else if (unit === 'm') amount *= 1000000
        else if (unit === 'b') amount *= 1000000000
        
        if (queryLower.includes('under') || queryLower.includes('below')) {
          entities.priceRange.max = amount
        } else if (queryLower.includes('over') || queryLower.includes('above')) {
          entities.priceRange.min = amount
        }
      }
    })
  }

  // Extract property types
  const propertyTypes = [
    'residential', 'commercial', 'office', 'retail', 'industrial', 'mixed-use',
    'apartment', 'condo', 'townhome', 'single-family', 'multi-family'
  ]

  propertyTypes.forEach(type => {
    if (queryLower.includes(type)) {
      entities.propertyType.push(type)
    }
  })

  // Extract project sizes
  const sizeMatch = queryLower.match(/(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*acres?/g)
  if (sizeMatch) {
    entities.projectSize = sizeMatch
  }

  // Extract timeframes
  const timeframes = [
    'immediate', 'asap', 'urgent', 'next month', 'next quarter', 'next year',
    'short term', 'long term', '6 months', '1 year', '2 years'
  ]

  timeframes.forEach(timeframe => {
    if (queryLower.includes(timeframe)) {
      entities.timeframe.push(timeframe)
    }
  })

  // Extract development types
  const developmentTypes = [
    'new construction', 'renovation', 'redevelopment', 'infill', 'ground up',
    'value add', 'stabilized', 'development', 'construction'
  ]

  developmentTypes.forEach(type => {
    if (queryLower.includes(type)) {
      entities.developmentType.push(type)
    }
  })

  return entities
}

// Collect user feedback and improve responses
export const collectFeedback = async (
  messageId: string,
  query: string,
  response: string,
  feedback: 'positive' | 'negative',
  userCorrection?: string
): Promise<void> => {
  const trainingExample: TrainingExample = {
    id: messageId,
    query,
    intent: 'user_feedback',
    entities: extractEntities(query),
    response: userCorrection || response,
    confidence: feedback === 'positive' ? 1.0 : 0.3,
    feedback,
    timestamp: new Date()
  }

  // In production, save to database
  console.log('Collecting feedback:', trainingExample)
  
  // If negative feedback with correction, retrain
  if (feedback === 'negative' && userCorrection) {
    await retrainModel(trainingExample)
  }
}

// Retrain model with new data
export const retrainModel = async (newExample: TrainingExample): Promise<void> => {
  // In production, this would update the model
  console.log('Retraining model with new example:', newExample)
  
  // Add to comprehensive training data
  COMPREHENSIVE_TRAINING_DATA.push(newExample)
  
  // Update confidence scores for similar queries
  const similarQueries = COMPREHENSIVE_TRAINING_DATA.filter(example => 
    example.intent === newExample.intent && 
    example.id !== newExample.id
  )
  
  similarQueries.forEach(example => {
    if (newExample.feedback === 'positive') {
      example.confidence = Math.min(example.confidence + 0.1, 1.0)
    } else {
      example.confidence = Math.max(example.confidence - 0.1, 0.1)
    }
  })
}

// Query similarity matching
export const findSimilarQueries = (query: string, threshold: number = 0.7): TrainingExample[] => {
  const queryWords = query.toLowerCase().split(/\s+/)
  const similarQueries: (TrainingExample & { similarity: number })[] = []

  COMPREHENSIVE_TRAINING_DATA.forEach(example => {
    const exampleWords = example.query.toLowerCase().split(/\s+/)
    const commonWords = queryWords.filter(word => exampleWords.includes(word))
    const similarity = commonWords.length / Math.max(queryWords.length, exampleWords.length)

    if (similarity >= threshold) {
      similarQueries.push({ ...example, similarity })
    }
  })

  return similarQueries
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
}

// Export comprehensive training data
export const exportTrainingData = (): string => {
  const data = {
    examples: COMPREHENSIVE_TRAINING_DATA,
    metadata: {
      total_examples: COMPREHENSIVE_TRAINING_DATA.length,
      intents: [...new Set(COMPREHENSIVE_TRAINING_DATA.map(e => e.intent))],
      export_date: new Date().toISOString(),
      version: '1.0.0'
    }
  }

  return JSON.stringify(data, null, 2)
}

// Initialize training data collection
export const initializeTrainingSystem = async (): Promise<void> => {
  console.log('Initializing Houston Assistant Training System...')
  
  try {
    // Import database services
    const { trainingDataService, db } = await import('../database/connection')
    
    // Check database health
    const isHealthy = await db.isHealthy()
    if (!isHealthy) {
      console.warn('Database not available, using in-memory training data')
      return
    }
    
    // Load existing training data from database
    const existingData = await trainingDataService.getTrainingExamples(1000)
    console.log(`Loaded ${existingData.length} existing training examples from database`)
    
    // Insert comprehensive training data if database is empty
    if (existingData.length === 0) {
      console.log('Database is empty, populating with comprehensive training data...')
      
      for (const example of COMPREHENSIVE_TRAINING_DATA) {
        await trainingDataService.insertTrainingExample({
          query: example.query,
          intent: example.intent,
          entities: example.entities,
          response: example.response,
          confidence: example.confidence,
          feedback: example.feedback,
          userContext: example.userContext,
          isSynthetic: false
        })
      }
      
      console.log(`Inserted ${COMPREHENSIVE_TRAINING_DATA.length} training examples into database`)
    }
    
    // Generate additional synthetic data
    console.log('Generating synthetic training data...')
    const syntheticData = await generateSyntheticTrainingData()
    
    // Insert synthetic data into database
    for (const example of syntheticData) {
      await trainingDataService.insertTrainingExample({
        query: example.query,
        intent: example.intent,
        entities: example.entities,
        response: example.response,
        confidence: example.confidence,
        isSynthetic: true
      })
    }
    
    console.log(`Generated and stored ${syntheticData.length} synthetic training examples`)
    
    // Get final training stats
    const stats = await trainingDataService.getTrainingStats()
    console.log('Training System Statistics:', {
      total_examples: stats.total_examples,
      positive_feedback: stats.positive_feedback,
      negative_feedback: stats.negative_feedback,
      synthetic_examples: stats.synthetic_examples,
      avg_confidence: parseFloat(stats.avg_confidence).toFixed(2),
      unique_intents: stats.unique_intents
    })
    
  } catch (error) {
    console.error('Error initializing training system:', error)
    console.log('Falling back to in-memory training data')
    
    // Generate additional synthetic data for in-memory use
    const syntheticData = await generateSyntheticTrainingData()
    COMPREHENSIVE_TRAINING_DATA.push(...syntheticData)
    
    console.log(`Training system initialized with ${COMPREHENSIVE_TRAINING_DATA.length} examples`)
    console.log('Available intents:', [...new Set(COMPREHENSIVE_TRAINING_DATA.map(e => e.intent))])
  }
}