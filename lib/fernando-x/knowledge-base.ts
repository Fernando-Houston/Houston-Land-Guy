// Fernando-X Knowledge Base - Central Intelligence Hub
// This aggregates ALL data from Core Agent Architecture

export interface KnowledgeNode {
  id: string
  type: 'market' | 'property' | 'regulatory' | 'financial' | 'environmental' | 'demographic' | 'infrastructure'
  title: string
  content: string
  metadata: {
    source: string
    dateUpdated: string
    confidence: number
    tags: string[]
    location?: string
    relatedNodes: string[]
  }
  embeddings?: number[] // For semantic search
}

export interface MarketIntelligence {
  microMarkets: {
    neighborhood: string
    stats: {
      medianPrice: number
      priceGrowth: number
      daysOnMarket: number
      inventory: number
      gentrificationRisk: 'low' | 'moderate' | 'high' | 'very high'
      schoolRating: string
      crimeIndex: number
      walkScore: number
      transitScore: number
      floodRisk: 'low' | 'moderate' | 'high'
    }
    trends: {
      priceTrend: 'rising' | 'stable' | 'declining'
      demandLevel: 'very high' | 'high' | 'moderate' | 'low'
      developmentActivity: 'very active' | 'active' | 'moderate' | 'low'
      foreignInvestment: number // percentage
    }
    opportunities: string[]
    risks: string[]
  }[]
  
  seasonalPatterns: {
    month: string
    activityIndex: number
    bestFor: string[]
    avoid: string[]
  }[]
  
  investmentFlows: {
    source: string
    amount: number
    targetNeighborhoods: string[]
    propertyTypes: string[]
    trend: 'increasing' | 'stable' | 'decreasing'
  }[]
}

export interface DevelopmentIntelligence {
  activeProjects: {
    id: string
    name: string
    type: string
    location: string
    investment: number
    timeline: string
    impact: string[]
    relatedOpportunities: string[]
  }[]
  
  permitTrends: {
    area: string
    permitCount: number
    totalValue: number
    averageValue: number
    topTypes: string[]
    growthRate: number
  }[]
  
  infrastructureImpact: {
    project: string
    affectedAreas: string[]
    valueImpact: number // percentage
    timeframe: string
    opportunities: string[]
  }[]
}

export interface RegulatoryIntelligence {
  zoningChanges: {
    area: string
    currentZoning: string
    proposedZoning: string
    status: string
    impact: string
    opportunities: string[]
    timeline: string
  }[]
  
  taxIncentives: {
    program: string
    eligibleAreas: string[]
    benefits: string[]
    requirements: string[]
    deadline: string
  }[]
  
  buildingCodes: {
    requirement: string
    effectiveDate: string
    impact: string
    complianceTips: string[]
  }[]
}

export interface EnvironmentalIntelligence {
  floodZones: {
    area: string
    zone: string
    risk: 'low' | 'moderate' | 'high'
    historicalEvents: {
      event: string
      date: string
      impact: string
    }[]
    mitigationStrategies: string[]
  }[]
  
  climateResilience: {
    metric: string
    score: number
    trend: 'improving' | 'stable' | 'declining'
    recommendations: string[]
  }[]
  
  sustainabilityIncentives: {
    program: string
    benefits: string[]
    requirements: string[]
    roi: number
  }[]
}

class FernandoXKnowledgeBase {
  private knowledgeGraph: Map<string, KnowledgeNode> = new Map()
  private marketIntel: MarketIntelligence
  private developmentIntel: DevelopmentIntelligence
  private regulatoryIntel: RegulatoryIntelligence
  private environmentalIntel: EnvironmentalIntelligence
  
  constructor() {
    this.initializeKnowledgeBase()
  }
  
  private async initializeKnowledgeBase() {
    // Initialize with data from all Core Agent Architecture folders
    await this.loadMarketIntelligence()
    await this.loadDevelopmentIntelligence()
    await this.loadRegulatoryIntelligence()
    await this.loadEnvironmentalIntelligence()
    await this.buildKnowledgeGraph()
  }
  
  private async loadMarketIntelligence() {
    // Data from Houston Micro-Market Intelligence Report 2024
    this.marketIntel = {
      microMarkets: [
        {
          neighborhood: 'Heights',
          stats: {
            medianPrice: 817285,
            priceGrowth: 0.3,
            daysOnMarket: 38,
            inventory: 234,
            gentrificationRisk: 'high',
            schoolRating: 'B',
            crimeIndex: 3.2,
            walkScore: 78,
            transitScore: 45,
            floodRisk: 'moderate'
          },
          trends: {
            priceTrend: 'rising',
            demandLevel: 'very high',
            developmentActivity: 'very active',
            foreignInvestment: 12
          },
          opportunities: [
            'Historic home renovations with 20-30% value add potential',
            'Townhome development on underutilized lots',
            'Mixed-use opportunities near Washington Ave',
            'ADU additions for rental income'
          ],
          risks: [
            'Deed restrictions limiting development',
            'Historic preservation requirements',
            'Parking constraints',
            'Price ceiling approaching'
          ]
        },
        {
          neighborhood: 'EaDo/East End',
          stats: {
            medianPrice: 350000,
            priceGrowth: 2.5,
            daysOnMarket: 45,
            inventory: 156,
            gentrificationRisk: 'very high',
            schoolRating: 'B',
            crimeIndex: 4.1,
            walkScore: 65,
            transitScore: 55,
            floodRisk: 'moderate'
          },
          trends: {
            priceTrend: 'rising',
            demandLevel: 'high',
            developmentActivity: 'very active',
            foreignInvestment: 8
          },
          opportunities: [
            'Industrial to residential conversions',
            'Transit-oriented development near rail',
            'Artist lofts and creative spaces',
            'Opportunity zone investments'
          ],
          risks: [
            'Industrial contamination concerns',
            'Gentrification displacement',
            'Infrastructure needs',
            'Market speculation'
          ]
        },
        {
          neighborhood: 'Third Ward',
          stats: {
            medianPrice: 296313,
            priceGrowth: -2.2,
            daysOnMarket: 52,
            inventory: 189,
            gentrificationRisk: 'moderate',
            schoolRating: 'B-',
            crimeIndex: 5.2,
            walkScore: 58,
            transitScore: 42,
            floodRisk: 'low'
          },
          trends: {
            priceTrend: 'stable',
            demandLevel: 'moderate',
            developmentActivity: 'active',
            foreignInvestment: 5
          },
          opportunities: [
            'Affordable housing development',
            'University-oriented housing near TSU',
            'Historic preservation tax credits',
            'Community-focused retail'
          ],
          risks: [
            'Community resistance to change',
            'Limited financing options',
            'Infrastructure aging',
            'Perception challenges'
          ]
        },
        {
          neighborhood: 'River Oaks',
          stats: {
            medianPrice: 2850000,
            priceGrowth: 3.2,
            daysOnMarket: 65,
            inventory: 42,
            gentrificationRisk: 'low',
            schoolRating: 'A+',
            crimeIndex: 1.2,
            walkScore: 82,
            transitScore: 35,
            floodRisk: 'low'
          },
          trends: {
            priceTrend: 'stable',
            demandLevel: 'moderate',
            developmentActivity: 'low',
            foreignInvestment: 35
          },
          opportunities: [
            'Luxury teardown rebuilds',
            'Estate subdivisions',
            'High-end renovations',
            'Boutique condo developments'
          ],
          risks: [
            'Limited inventory',
            'High entry costs',
            'Strict deed restrictions',
            'Market saturation at top'
          ]
        },
        {
          neighborhood: 'Montrose',
          stats: {
            medianPrice: 543000,
            priceGrowth: -6.6,
            daysOnMarket: 42,
            inventory: 178,
            gentrificationRisk: 'moderate',
            schoolRating: 'A-',
            crimeIndex: 3.8,
            walkScore: 85,
            transitScore: 48,
            floodRisk: 'low'
          },
          trends: {
            priceTrend: 'declining',
            demandLevel: 'high',
            developmentActivity: 'active',
            foreignInvestment: 15
          },
          opportunities: [
            'Mixed-use redevelopment',
            'Boutique multifamily',
            'Adaptive reuse projects',
            'Walkable retail concepts'
          ],
          risks: [
            'Overbuilding concerns',
            'Parking challenges',
            'Rising property taxes',
            'Character preservation'
          ]
        }
      ],
      
      seasonalPatterns: [
        {
          month: 'January',
          activityIndex: 0.85,
          bestFor: ['Negotiating prices', 'Less competition'],
          avoid: ['Quick sales', 'Multiple offers']
        },
        {
          month: 'February',
          activityIndex: 0.90,
          bestFor: ['Early spring deals', 'Tax refund buyers'],
          avoid: ['Luxury properties']
        },
        {
          month: 'March',
          activityIndex: 1.05,
          bestFor: ['Spring market entry', 'Family homes'],
          avoid: ['Waiting for better prices']
        },
        {
          month: 'April',
          activityIndex: 1.15,
          bestFor: ['Maximum exposure', 'Quick sales'],
          avoid: ['Expecting discounts']
        },
        {
          month: 'May',
          activityIndex: 1.20,
          bestFor: ['Selling season peak', 'Multiple offers'],
          avoid: ['Buyer negotiations']
        },
        {
          month: 'June',
          activityIndex: 1.25,
          bestFor: ['School move timing', 'Family relocations'],
          avoid: ['Investment bargains']
        },
        {
          month: 'July',
          activityIndex: 1.15,
          bestFor: ['Summer inventory', 'New construction'],
          avoid: ['Vacation timing']
        },
        {
          month: 'August',
          activityIndex: 1.05,
          bestFor: ['Back-to-school deals', 'Motivated sellers'],
          avoid: ['Peak competition']
        },
        {
          month: 'September',
          activityIndex: 1.00,
          bestFor: ['Fall market', 'Serious buyers'],
          avoid: ['Rush decisions']
        },
        {
          month: 'October',
          activityIndex: 0.95,
          bestFor: ['Year-end planning', 'Tax considerations'],
          avoid: ['Spring pricing']
        },
        {
          month: 'November',
          activityIndex: 0.85,
          bestFor: ['Holiday deals', 'Motivated sellers'],
          avoid: ['High activity']
        },
        {
          month: 'December',
          activityIndex: 0.80,
          bestFor: ['Year-end bargains', 'Tax benefits'],
          avoid: ['Quick closings']
        }
      ],
      
      investmentFlows: [
        {
          source: 'Mexico',
          amount: 460000000,
          targetNeighborhoods: ['River Oaks', 'Memorial', 'The Woodlands'],
          propertyTypes: ['Luxury residential', 'Commercial'],
          trend: 'increasing'
        },
        {
          source: 'China',
          amount: 280000000,
          targetNeighborhoods: ['Sugar Land', 'Katy', 'Energy Corridor'],
          propertyTypes: ['Residential', 'Mixed-use'],
          trend: 'stable'
        },
        {
          source: 'India',
          amount: 180000000,
          targetNeighborhoods: ['Sugar Land', 'Clear Lake', 'Pearland'],
          propertyTypes: ['Single-family', 'Townhomes'],
          trend: 'increasing'
        },
        {
          source: 'Private Equity',
          amount: 12400000000,
          targetNeighborhoods: ['Downtown', 'Galleria', 'Energy Corridor'],
          propertyTypes: ['Multifamily', 'Industrial', 'Office'],
          trend: 'increasing'
        },
        {
          source: 'REITs',
          amount: 3200000000,
          targetNeighborhoods: ['Various'],
          propertyTypes: ['Industrial', 'Multifamily'],
          trend: 'stable'
        }
      ]
    }
  }
  
  private async loadDevelopmentIntelligence() {
    // Data from Harris County Construction Activity Report
    this.developmentIntel = {
      activeProjects: [
        {
          id: 'NHHIP',
          name: 'North Houston Highway Improvement Project',
          type: 'Infrastructure',
          location: 'Downtown/North Houston',
          investment: 4230000000,
          timeline: '2025-2030',
          impact: [
            'Major freeway reconstruction',
            'Improved connectivity',
            'Potential displacement concerns',
            'New development opportunities'
          ],
          relatedOpportunities: [
            'Transit-oriented development',
            'Affordable housing requirements',
            'Commercial redevelopment',
            'Green space creation'
          ]
        },
        {
          id: 'TMC3',
          name: 'TMC3 Collaborative Building',
          type: 'Medical/Research',
          location: 'Texas Medical Center',
          investment: 1850000000,
          timeline: '2025-Q3',
          impact: [
            'Biotech hub creation',
            'High-wage job growth',
            'Increased housing demand',
            'Research commercialization'
          ],
          relatedOpportunities: [
            'Life sciences real estate',
            'Researcher housing',
            'Retail/dining expansion',
            'Hotel development'
          ]
        },
        {
          id: 'BUFFALO-BAYOU-EAST',
          name: 'Buffalo Bayou East Extension',
          type: 'Parks/Flood Control',
          location: 'East End/Fifth Ward',
          investment: 310000000,
          timeline: '2025-2032',
          impact: [
            'Flood mitigation',
            'Property value increases',
            'Gentrification acceleration',
            'Recreation amenities'
          ],
          relatedOpportunities: [
            'Bayou-adjacent development',
            'Mixed-use projects',
            'Trail-oriented retail',
            'Green infrastructure'
          ]
        }
      ],
      
      permitTrends: [
        {
          area: 'Harris County',
          permitCount: 46269,
          totalValue: 13800000000,
          averageValue: 298000,
          topTypes: ['Single-family', 'Renovation', 'Commercial TI'],
          growthRate: 12.5
        },
        {
          area: 'Northwest/Cypress',
          permitCount: 8234,
          totalValue: 2400000000,
          averageValue: 291000,
          topTypes: ['Single-family', 'Multifamily', 'Retail'],
          growthRate: 18.3
        },
        {
          area: 'Inner Loop',
          permitCount: 3456,
          totalValue: 1850000000,
          averageValue: 535000,
          topTypes: ['Renovation', 'Mixed-use', 'Multifamily'],
          growthRate: 5.2
        },
        {
          area: 'Energy Corridor',
          permitCount: 1234,
          totalValue: 890000000,
          averageValue: 721000,
          topTypes: ['Office TI', 'Multifamily', 'Retail'],
          growthRate: -2.3
        }
      ],
      
      infrastructureImpact: [
        {
          project: 'Grand Parkway Segments',
          affectedAreas: ['Katy', 'Cypress', 'Spring', 'Humble'],
          valueImpact: 15,
          timeframe: '2020-2025',
          opportunities: [
            'Master-planned communities',
            'Commercial nodes at interchanges',
            'Industrial/logistics facilities',
            'Suburban town centers'
          ]
        },
        {
          project: 'MetroNext Transit Plan',
          affectedAreas: ['Inner Loop', 'Galleria', 'Heights'],
          valueImpact: 8,
          timeframe: '2025-2030',
          opportunities: [
            'Transit-oriented development',
            'Reduced parking requirements',
            'Walkable neighborhoods',
            'Mixed-use intensification'
          ]
        }
      ]
    }
  }
  
  private async loadRegulatoryIntelligence() {
    // Data from regulatory and zoning updates
    this.regulatoryIntel = {
      zoningChanges: [
        {
          area: 'Midtown',
          currentZoning: 'Urban Corridor',
          proposedZoning: 'Mixed-Use High Density',
          status: 'Under Review',
          impact: 'Allows taller buildings, reduced parking',
          opportunities: [
            'High-rise residential',
            'Ground-floor retail requirements',
            'Increased density bonuses',
            'Affordable housing incentives'
          ],
          timeline: '2025-Q2 Decision'
        },
        {
          area: 'Near Northside',
          currentZoning: 'Industrial',
          proposedZoning: 'Transit Corridor',
          status: 'Community Input Phase',
          impact: 'Industrial to mixed-use conversion',
          opportunities: [
            'Creative office spaces',
            'Artist housing',
            'Maker spaces',
            'Light industrial preservation'
          ],
          timeline: '2025-Q4 Decision'
        }
      ],
      
      taxIncentives: [
        {
          program: 'Chapter 380 Agreements',
          eligibleAreas: ['Downtown', 'East End', 'Third Ward'],
          benefits: [
            'Property tax rebates up to 10 years',
            'Sales tax sharing',
            'Infrastructure assistance',
            'Fee waivers'
          ],
          requirements: [
            'Minimum $5M investment',
            'Job creation targets',
            'Prevailing wage compliance',
            'MWBE participation'
          ],
          deadline: 'Rolling applications'
        },
        {
          program: 'Opportunity Zones',
          eligibleAreas: ['Fifth Ward', 'Kashmere Gardens', 'Sunnyside'],
          benefits: [
            'Capital gains tax deferral',
            'Tax reduction after 5 years',
            'Tax elimination after 10 years',
            'No cap on investment'
          ],
          requirements: [
            'Substantial improvement requirement',
            'QOF fund structure',
            '90% asset test',
            'Operating business focus'
          ],
          deadline: '2026 for maximum benefits'
        },
        {
          program: 'Historic Tax Credits',
          eligibleAreas: ['Heights', 'Montrose', 'Third Ward'],
          benefits: [
            '20% federal tax credit',
            '25% state tax credit',
            'Transferable credits',
            'Stackable with other programs'
          ],
          requirements: [
            'National Register listing',
            'Secretary Standards compliance',
            'Substantial rehabilitation',
            'Income-producing property'
          ],
          deadline: 'Project-specific'
        }
      ],
      
      buildingCodes: [
        {
          requirement: 'Energy Code 2021 IECC',
          effectiveDate: '2024-01-01',
          impact: '8.9% energy savings requirement',
          complianceTips: [
            'Enhanced insulation R-values',
            'High-efficiency HVAC',
            'LED lighting throughout',
            'Cool roof requirements'
          ]
        },
        {
          requirement: 'Flood Resilience Chapter 19',
          effectiveDate: '2025-03-01',
          impact: '2ft freeboard in 500-year floodplain',
          complianceTips: [
            'Elevated foundations',
            'Flood vents required',
            'Waterproof materials below BFE',
            'Compensatory storage'
          ]
        }
      ]
    }
  }
  
  private async loadEnvironmentalIntelligence() {
    // Environmental and climate resilience data
    this.environmentalIntel = {
      floodZones: [
        {
          area: 'Meyerland',
          zone: 'AE',
          risk: 'high',
          historicalEvents: [
            { event: 'Harvey', date: '2017-08', impact: '80% homes flooded' },
            { event: 'Tax Day', date: '2016-04', impact: '40% homes flooded' },
            { event: 'Memorial Day', date: '2015-05', impact: '30% homes flooded' }
          ],
          mitigationStrategies: [
            'Elevate 3ft above BFE minimum',
            'Flood insurance mandatory',
            'Wet floodproofing for garages',
            'Backflow preventers required'
          ]
        },
        {
          area: 'Heights',
          zone: 'X500',
          risk: 'moderate',
          historicalEvents: [
            { event: 'Harvey', date: '2017-08', impact: '15% localized flooding' }
          ],
          mitigationStrategies: [
            'Positive drainage required',
            'Detention where feasible',
            'Permeable surfaces encouraged',
            'Green infrastructure'
          ]
        }
      ],
      
      climateResilience: [
        {
          metric: 'Urban Heat Island Effect',
          score: 6.2,
          trend: 'improving',
          recommendations: [
            'Cool roof requirements',
            'Tree planting programs',
            'Reflective pavements',
            'Green building incentives'
          ]
        },
        {
          metric: 'Stormwater Management',
          score: 5.8,
          trend: 'improving',
          recommendations: [
            'LID requirements',
            'Bioswales in parking',
            'Rainwater harvesting',
            'Detention optimization'
          ]
        }
      ],
      
      sustainabilityIncentives: [
        {
          program: 'Commercial PACE',
          benefits: [
            '100% financing',
            '20-year terms',
            'Transferable to buyer',
            'Off balance sheet'
          ],
          requirements: [
            'Energy audit required',
            '10% savings minimum',
            'Licensed contractor',
            'M&V plan'
          ],
          roi: 1.3
        },
        {
          program: 'Green Building Incentives',
          benefits: [
            'Expedited permitting',
            'Fee reductions',
            'Density bonuses',
            'Marketing support'
          ],
          requirements: [
            'LEED Gold minimum',
            'Energy Star certification',
            'Water conservation',
            'Native landscaping'
          ],
          roi: 1.15
        }
      ]
    }
  }
  
  private async buildKnowledgeGraph() {
    // Create interconnected knowledge nodes
    
    // Market nodes
    for (const market of this.marketIntel.microMarkets) {
      const node: KnowledgeNode = {
        id: `market-${market.neighborhood.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'market',
        title: `${market.neighborhood} Market Intelligence`,
        content: this.generateMarketSummary(market),
        metadata: {
          source: 'Houston Micro-Market Intelligence Report 2024',
          dateUpdated: new Date().toISOString(),
          confidence: 0.95,
          tags: ['market', 'neighborhood', market.neighborhood.toLowerCase()],
          location: market.neighborhood,
          relatedNodes: []
        }
      }
      this.knowledgeGraph.set(node.id, node)
    }
    
    // Development nodes
    for (const project of this.developmentIntel.activeProjects) {
      const node: KnowledgeNode = {
        id: `dev-${project.id.toLowerCase()}`,
        type: 'infrastructure',
        title: project.name,
        content: this.generateProjectSummary(project),
        metadata: {
          source: 'Harris County Construction Activity Report',
          dateUpdated: new Date().toISOString(),
          confidence: 0.98,
          tags: ['development', 'infrastructure', project.type.toLowerCase()],
          location: project.location,
          relatedNodes: this.findRelatedMarkets(project.location)
        }
      }
      this.knowledgeGraph.set(node.id, node)
    }
    
    // Create cross-references
    this.createCrossReferences()
  }
  
  private generateMarketSummary(market: any): string {
    return `
${market.neighborhood} Real Estate Market Analysis

Current Market Conditions:
- Median Price: $${market.stats.medianPrice.toLocaleString()} (${market.stats.priceGrowth > 0 ? '+' : ''}${market.stats.priceGrowth}% YoY)
- Days on Market: ${market.stats.daysOnMarket} days
- Inventory: ${market.stats.inventory} active listings
- Gentrification Risk: ${market.stats.gentrificationRisk}
- School Rating: ${market.stats.schoolRating}
- Walk Score: ${market.stats.walkScore}/100
- Flood Risk: ${market.stats.floodRisk}

Market Trends:
- Price Trend: ${market.trends.priceTrend}
- Demand Level: ${market.trends.demandLevel}
- Development Activity: ${market.trends.developmentActivity}
- Foreign Investment: ${market.trends.foreignInvestment}% of transactions

Investment Opportunities:
${market.opportunities.map((opp: string) => `- ${opp}`).join('\n')}

Key Risks:
${market.risks.map((risk: string) => `- ${risk}`).join('\n')}
    `.trim()
  }
  
  private generateProjectSummary(project: any): string {
    return `
${project.name}

Project Overview:
- Type: ${project.type}
- Location: ${project.location}
- Investment: $${(project.investment / 1000000000).toFixed(1)}B
- Timeline: ${project.timeline}

Expected Impact:
${project.impact.map((impact: string) => `- ${impact}`).join('\n')}

Related Real Estate Opportunities:
${project.relatedOpportunities.map((opp: string) => `- ${opp}`).join('\n')}
    `.trim()
  }
  
  private findRelatedMarkets(location: string): string[] {
    const related: string[] = []
    const locationLower = location.toLowerCase()
    
    for (const [nodeId, node] of this.knowledgeGraph) {
      if (node.type === 'market' && node.metadata.location) {
        const nodeLoc = node.metadata.location.toLowerCase()
        if (locationLower.includes(nodeLoc) || nodeLoc.includes(locationLower)) {
          related.push(nodeId)
        }
      }
    }
    
    return related
  }
  
  private createCrossReferences() {
    // Link markets affected by infrastructure projects
    for (const [nodeId, node] of this.knowledgeGraph) {
      if (node.type === 'infrastructure') {
        const relatedMarkets = this.findRelatedMarkets(node.metadata.location || '')
        node.metadata.relatedNodes.push(...relatedMarkets)
        
        // Add reverse references
        relatedMarkets.forEach(marketId => {
          const marketNode = this.knowledgeGraph.get(marketId)
          if (marketNode && !marketNode.metadata.relatedNodes.includes(nodeId)) {
            marketNode.metadata.relatedNodes.push(nodeId)
          }
        })
      }
    }
  }
  
  // Public methods for Fernando-X to access knowledge
  
  public searchKnowledge(query: string, filters?: {
    type?: string[]
    location?: string
    tags?: string[]
  }): KnowledgeNode[] {
    const results: KnowledgeNode[] = []
    const queryLower = query.toLowerCase()
    
    for (const [_, node] of this.knowledgeGraph) {
      // Type filter
      if (filters?.type && !filters.type.includes(node.type)) continue
      
      // Location filter
      if (filters?.location && node.metadata.location) {
        if (!node.metadata.location.toLowerCase().includes(filters.location.toLowerCase())) continue
      }
      
      // Tag filter
      if (filters?.tags) {
        const hasAllTags = filters.tags.every(tag => 
          node.metadata.tags.includes(tag.toLowerCase())
        )
        if (!hasAllTags) continue
      }
      
      // Text search
      if (node.title.toLowerCase().includes(queryLower) ||
          node.content.toLowerCase().includes(queryLower) ||
          node.metadata.tags.some(tag => tag.includes(queryLower))) {
        results.push(node)
      }
    }
    
    // Sort by relevance (simple scoring)
    return results.sort((a, b) => {
      const aScore = this.calculateRelevance(a, queryLower)
      const bScore = this.calculateRelevance(b, queryLower)
      return bScore - aScore
    })
  }
  
  private calculateRelevance(node: KnowledgeNode, query: string): number {
    let score = 0
    
    // Title match (highest weight)
    if (node.title.toLowerCase().includes(query)) score += 10
    
    // Content match
    const contentMatches = (node.content.toLowerCase().match(new RegExp(query, 'g')) || []).length
    score += contentMatches * 2
    
    // Tag match
    node.metadata.tags.forEach(tag => {
      if (tag.includes(query)) score += 5
    })
    
    // Boost recent data
    const daysOld = (Date.now() - new Date(node.metadata.dateUpdated).getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld < 30) score += 3
    if (daysOld < 7) score += 5
    
    // Confidence factor
    score *= node.metadata.confidence
    
    return score
  }
  
  public getMarketIntelligence(): MarketIntelligence {
    return this.marketIntel
  }
  
  public getDevelopmentIntelligence(): DevelopmentIntelligence {
    return this.developmentIntel
  }
  
  public getRegulatoryIntelligence(): RegulatoryIntelligence {
    return this.regulatoryIntel
  }
  
  public getEnvironmentalIntelligence(): EnvironmentalIntelligence {
    return this.environmentalIntel
  }
  
  public getRelatedKnowledge(nodeId: string, depth: number = 1): KnowledgeNode[] {
    const visited = new Set<string>()
    const results: KnowledgeNode[] = []
    
    const traverse = (id: string, currentDepth: number) => {
      if (currentDepth > depth || visited.has(id)) return
      visited.add(id)
      
      const node = this.knowledgeGraph.get(id)
      if (!node) return
      
      results.push(node)
      
      if (currentDepth < depth) {
        node.metadata.relatedNodes.forEach(relatedId => {
          traverse(relatedId, currentDepth + 1)
        })
      }
    }
    
    traverse(nodeId, 0)
    return results
  }
  
  public getNeighborhoodInsights(neighborhood: string): {
    market: any
    development: any[]
    regulatory: any[]
    environmental: any
    opportunities: string[]
    risks: string[]
  } | null {
    const market = this.marketIntel.microMarkets.find(m => 
      m.neighborhood.toLowerCase() === neighborhood.toLowerCase()
    )
    
    if (!market) return null
    
    // Find related development projects
    const development = this.developmentIntel.activeProjects.filter(p =>
      p.location.toLowerCase().includes(neighborhood.toLowerCase()) ||
      p.relatedOpportunities.some(o => o.toLowerCase().includes(neighborhood.toLowerCase()))
    )
    
    // Find applicable regulations
    const regulatory = this.regulatoryIntel.zoningChanges.filter(z =>
      z.area.toLowerCase().includes(neighborhood.toLowerCase())
    )
    
    // Find environmental data
    const environmental = this.environmentalIntel.floodZones.find(f =>
      f.area.toLowerCase().includes(neighborhood.toLowerCase())
    )
    
    // Compile opportunities and risks
    const opportunities = [
      ...market.opportunities,
      ...development.flatMap(d => d.relatedOpportunities),
      ...regulatory.flatMap(r => r.opportunities)
    ].filter((v, i, a) => a.indexOf(v) === i) // unique
    
    const risks = [
      ...market.risks,
      ...(environmental ? [`Flood risk: ${environmental.risk}`] : [])
    ]
    
    return {
      market,
      development,
      regulatory,
      environmental,
      opportunities,
      risks
    }
  }
}

export const fernandoXKnowledge = new FernandoXKnowledgeBase()
export default FernandoXKnowledgeBase