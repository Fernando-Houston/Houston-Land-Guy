// Fernando-X Conversation Engine with LLM Integration
import { INTEGRATED_DATA } from '../fernando-x-data'
import { fernandoMemory } from './memory-service'
import { fernandoDataQuery } from './data-query-service'
import { investmentScoring } from '../services/investment-scoring-service'
import { enhancedDataQuery } from './enhanced-data-query-service'

interface ConversationContext {
  sessionId: string
  userId?: string
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  userPreferences?: any
}

export class FernandoXConversationEngine {
  private systemPrompt = `You are Fernando-X, an advanced AI real estate expert specializing in Houston development intelligence. You have access to:

1. 750,000+ data points about Houston real estate
2. Real-time market analytics and trends
3. Developer insights and project data
4. Population growth projections
5. Investment opportunities and analysis

Your personality:
- Expert and knowledgeable but approachable
- Proactive in offering insights and suggestions
- Data-driven but conversational
- Enthusiastic about Houston's growth potential
- Helpful in guiding users to make informed decisions

Always:
- Cite specific data when available
- Offer actionable insights
- Ask follow-up questions to better help users
- Maintain conversation context
- Be concise but comprehensive`

  async generateResponse(
    userMessage: string,
    context: ConversationContext
  ): Promise<{
    response: string
    confidence: number
    sources: string[]
    suggestedActions?: Array<{ label: string; action: string }>
  }> {
    try {
      // Check if we need to use fallback for specific queries
      const fallbackResponse = this.checkForDataQuery(userMessage)
      if (fallbackResponse) {
        return fallbackResponse
      }

      // For now, use enhanced pattern matching with data context
      // In production, this would call OpenAI or another LLM
      return this.generateSmartResponse(userMessage, context)
    } catch (error) {
      console.error('Error generating response:', error)
      return this.getFallbackResponse(userMessage)
    }
  }

  private async checkForDataQuery(message: string): Promise<any> {
    const messageLower = message.toLowerCase()
    
    // Get real database stats first
    const dbStats = await fernandoDataQuery.getDatabaseStats()
    
    // Check for area-specific comprehensive analysis
    const areaMatch = messageLower.match(/(?:tell me about|analyze|overview of|data on|stats for)\s+(\w+(?:\s+\w+)?)/i)
    if (areaMatch) {
      const area = areaMatch[1].trim()
      const analysis = await enhancedDataQuery.getComprehensiveAreaAnalysis(area)
      
      if (analysis.demographics || analysis.rentalMarket || analysis.income) {
        let response = `Here's a comprehensive analysis of **${area}**:\n\n`
        
        if (analysis.demographics) {
          response += `**Demographics:**\n`
          response += `• Population: ${analysis.demographics.population?.toLocaleString()}\n`
          response += `• Median Age: ${analysis.demographics.medianAge}\n`
          response += `• Foreign Born: ${analysis.demographics.foreignBorn.percentage}%\n`
          response += `• Diversity: ${analysis.demographics.diversity.hispanic}% Hispanic, ${analysis.demographics.diversity.white}% White, ${analysis.demographics.diversity.black}% Black, ${analysis.demographics.diversity.asian}% Asian\n\n`
        }
        
        if (analysis.income) {
          response += `**Income & Wealth:**\n`
          response += `• Median Income: $${analysis.income.median?.toLocaleString()}\n`
          response += `• Homeownership: ${analysis.income.affordability?.homeownership}%\n`
          response += `• Median Home Value: $${analysis.income.affordability?.medianHomeValue?.toLocaleString()}\n\n`
        }
        
        if (analysis.rentalMarket) {
          response += `**Rental Market:**\n`
          response += `• 2BR Average: $${analysis.rentalMarket.avgRents?.twoBed?.toLocaleString()}/month\n`
          response += `• Occupancy: ${analysis.rentalMarket.occupancy}%\n`
          response += `• YoY Growth: ${analysis.rentalMarket.yearOverYear}%\n\n`
        }
        
        if (analysis.strMarket) {
          response += `**Short-Term Rental Market:**\n`
          response += `• Performance Tier: ${analysis.strMarket.tier}\n`
          response += `• Active Listings: ${analysis.strMarket.activeListings}\n`
          response += `• Avg Daily Rate: $${analysis.strMarket.avgDailyRate}\n`
          response += `• Annual Revenue: $${analysis.strMarket.annualRevenue?.toLocaleString()}\n\n`
        }
        
        if (analysis.employers && analysis.employers.length > 0) {
          response += `**Major Employers:**\n`
          analysis.employers.slice(0, 3).forEach(emp => {
            response += `• ${emp.name} - ${emp.employees.toLocaleString()} employees (${emp.sector})\n`
          })
          response += '\n'
        }
        
        response += `**Investment Score: ${analysis.investmentScore}/100**`
        
        return {
          response,
          confidence: 0.95,
          sources: ['Census Data', 'Rental Market Analysis', 'HCAD', 'Employment Data'],
          suggestedActions: [
            { label: 'View Properties', action: `search:properties:area:${area}` },
            { label: 'Investment Analysis', action: 'analyze:investment' }
          ]
        }
      }
    }
    
    // Check for rental market queries
    if (messageLower.includes('rent') || messageLower.includes('rental')) {
      const areaMatch = messageLower.match(/(?:in|for|at)\s+(\w+(?:\s+\w+)?)/i)
      const area = areaMatch ? areaMatch[1] : 'Houston'
      
      const rentalData = await enhancedDataQuery.getRentalMarketData(area)
      if (rentalData) {
        return {
          response: `Rental market data for ${area}:\n\n• Studio: $${rentalData.avgRents.studio}/month\n• 1BR: $${rentalData.avgRents.oneBed}/month\n• 2BR: $${rentalData.avgRents.twoBed}/month\n• 3BR: $${rentalData.avgRents.threeBed}/month\n\nOccupancy Rate: ${rentalData.occupancy}%\nYear-over-Year Growth: ${rentalData.yearOverYear}%\n\n${rentalData.supply.underConstruction} units currently under construction.`,
          confidence: 0.92,
          sources: ['Rental Market Database', 'Property Management Reports'],
          suggestedActions: [
            { label: 'ROI Calculator', action: 'navigate:/roi-calculator' },
            { label: 'Find Rental Properties', action: 'search:rentals' }
          ]
        }
      }
    }
    
    // Check for employer/jobs queries
    if (messageLower.includes('employer') || messageLower.includes('jobs') || messageLower.includes('companies')) {
      const employers = await enhancedDataQuery.getTopEmployers('Houston', 5)
      if (employers.length > 0) {
        let response = 'Top employers in Houston:\n\n'
        employers.forEach((emp, idx) => {
          response += `${idx + 1}. **${emp.name}**\n`
          response += `   • Employees: ${emp.employees.toLocaleString()}\n`
          response += `   • Sector: ${emp.sector}\n`
          response += `   • Growth: ${emp.growth > 0 ? '+' : ''}${emp.growth}% YoY\n\n`
        })
        
        return {
          response,
          confidence: 0.90,
          sources: ['Major Employers Database', 'Economic Development Reports'],
          suggestedActions: [
            { label: 'View All Employers', action: 'navigate:/data/employers' },
            { label: 'Economic Indicators', action: 'view:economic' }
          ]
        }
      }
    }
    
    // Population growth queries - use real data if available
    if (messageLower.includes('population') || messageLower.includes('growth')) {
      try {
        // Try to get real market data for growth areas
        const areas = ['Katy', 'Cypress', 'Spring', 'Pearland', 'Sugar Land']
        const areaStats = await Promise.all(
          areas.map(area => fernandoDataQuery.getAreaGrowth(area))
        )
        
        const topGrowthAreas = areaStats
          .sort((a, b) => b.growthMetrics.priceGrowth - a.growthMetrics.priceGrowth)
          .slice(0, 3)
        
        return {
          response: `Based on our database of ${dbStats.estimatedDataPoints.toLocaleString()}+ data points, Houston's fastest growing areas are:

1. **${topGrowthAreas[0].areaName}** - ${topGrowthAreas[0].growthMetrics.priceGrowth.toFixed(1)}% price growth, ${topGrowthAreas[0].activeProjects} active projects
2. **${topGrowthAreas[1].areaName}** - ${topGrowthAreas[1].growthMetrics.priceGrowth.toFixed(1)}% growth, ${topGrowthAreas[1].recentPermits} recent permits
3. **${topGrowthAreas[2].areaName}** - ${topGrowthAreas[2].growthMetrics.priceGrowth.toFixed(1)}% growth

With ${dbStats.tables.permits} permits tracked and ${dbStats.tables.projects} major projects in our database, these areas show tremendous development potential. Would you like specific property listings or market analysis?`,
          confidence: 0.95,
          sources: ['Real Estate Database', 'Permit Records', 'Market Analytics'],
          suggestedActions: [
            { label: 'View Growth Areas', action: 'navigate:/intelligence/map' },
            { label: 'Search Properties', action: 'search:properties' }
          ]
        }
      } catch (error) {
        // Fallback to hardcoded data
        const data = INTEGRATED_DATA.populationGrowth
        return {
          response: `Houston's population is booming! We're projected to add ${data.totalProjected.toLocaleString()} new residents. The fastest growing areas are ${data.topGrowthAreas[0].area} (${data.topGrowthAreas[0].growthRate}% growth) and ${data.topGrowthAreas[1].area} (${data.topGrowthAreas[1].growthRate}% growth). This creates massive opportunities for developers. Would you like to explore specific areas or development types?`,
          confidence: 0.85,
          sources: ['Houston Planning Department', 'Census Projections'],
          suggestedActions: [
            { label: 'View Growth Map', action: 'navigate:/intelligence/map' },
            { label: 'Find Development Sites', action: 'search:development' }
          ]
        }
      }
    }

    // Developer queries - use real database
    if (messageLower.includes('d.r. horton') || messageLower.includes('dr horton')) {
      try {
        const developer = await fernandoDataQuery.getDeveloperInfo('D.R. Horton')
        
        if (developer && !Array.isArray(developer)) {
          return {
            response: `D.R. Horton is a leading Houston developer with ${developer.activeProjects} active projects worth $${(developer.totalValue / 1000000000).toFixed(1)}B. They specialize in ${developer.primaryFocus} development.

Current Projects:
${developer.projects.slice(0, 3).map(p => `• ${p.name} - $${(p.totalValue / 1000000).toFixed(0)}M in ${p.area}`).join('\n')}

They currently have ${developer.properties.length} active property listings. Want to see specific communities or analyze investment opportunities?`,
            confidence: 0.94,
            sources: ['Developer Database', 'Project Records', 'Property Listings'],
            suggestedActions: [
              { label: 'View All Projects', action: 'filter:developer:D.R. Horton' },
              { label: 'See Active Listings', action: 'search:properties:developer:D.R. Horton' }
            ]
          }
        }
      } catch (error) {
        // Fallback to hardcoded data
        const drHorton = INTEGRATED_DATA.developers.find(d => d.name === 'D.R. Horton')
        return {
          response: `D.R. Horton is Houston's #1 developer with ${drHorton?.activeProjects} active projects worth $${(drHorton?.totalValue! / 1000000000).toFixed(1)}B. They're focusing on entry-level homes ($250K-$450K) in Katy, Spring, and Fort Bend County. They're filing 300+ permits monthly! Want to see their specific communities or analyze investment opportunities?`,
          confidence: 0.84,
          sources: ['Developer Database', 'Permit Records'],
          suggestedActions: [
            { label: 'View D.R. Horton Projects', action: 'filter:developer:D.R. Horton' },
            { label: 'Investment Analysis', action: 'analyze:investment' }
          ]
        }
      }
    }

    return null
  }

  private async generateSmartResponse(
    message: string,
    context: ConversationContext
  ): Promise<any> {
    const messageLower = message.toLowerCase()
    
    // Building/Development queries
    if (messageLower.includes('build') || messageLower.includes('develop')) {
      try {
        // Get real data from database
        const [marketStats, activeProjects, dbStats] = await Promise.all([
          fernandoDataQuery.getMarketStats(),
          fernandoDataQuery.getProjects({ phase: 'under-construction', limit: 5 }),
          fernandoDataQuery.getDatabaseStats()
        ])
        
        // Get area growth data
        const areas = ['Katy', 'Cypress', 'Spring']
        const areaGrowth = await Promise.all(
          areas.map(area => fernandoDataQuery.getAreaGrowth(area))
        )
        
        const sortedAreas = areaGrowth.sort((a, b) => 
          b.growthMetrics.developmentActivity - a.growthMetrics.developmentActivity
        )
        
        return {
          response: `Based on our database of ${dbStats.tables.properties} properties and ${dbStats.tables.permits} permits, the best areas for development in Houston are:

1. **${sortedAreas[0].areaName}** - ${sortedAreas[0].growthMetrics.priceGrowth.toFixed(1)}% price growth, ${sortedAreas[0].activeProjects} active projects, ${sortedAreas[0].recentPermits} recent permits
2. **${sortedAreas[1].areaName}** - ${sortedAreas[1].growthMetrics.priceGrowth.toFixed(1)}% growth, market heat index: ${sortedAreas[1].growthMetrics.marketHeatIndex}
3. **${sortedAreas[2].areaName}** - ${sortedAreas[2].activeProjects + sortedAreas[2].recentPermits} total development activities

Current market conditions:
• Median price: $${marketStats.current?.medianPrice?.toLocaleString() || 'N/A'}
• Days on market: ${marketStats.current?.avgDaysOnMarket || 'N/A'}
• ${activeProjects.length} major projects underway

What type of development are you considering? I can provide specific analysis for residential, commercial, or mixed-use projects.`,
          confidence: 0.92,
          sources: ['Real Estate Database', 'Permit Records', 'Market Analytics'],
          suggestedActions: [
            { label: 'Compare Areas', action: 'tool:comparison' },
            { label: 'ROI Calculator', action: 'navigate:/roi-calculator' },
            { label: 'View Active Projects', action: 'search:projects' }
          ]
        }
      } catch (error) {
        // Fallback to hardcoded data
        const areas = INTEGRATED_DATA.populationGrowth.topGrowthAreas.slice(0, 3)
        return {
          response: `Based on current market data, the best areas for development in Houston are:

1. **${areas[0].area}** - ${areas[0].growthRate}% population growth, adding ${areas[0].projectedGrowth.toLocaleString()} residents
2. **${areas[1].area}** - ${areas[1].growthRate}% growth, strong demand for single-family homes
3. **${areas[2].area}** - ${areas[2].growthRate}% growth, emerging market with lower land costs

Key factors to consider:
• Land availability and pricing
• Permit approval times (2-4 months average)
• School district quality (affects home values)
• Infrastructure development plans

What type of development are you considering? Residential, commercial, or mixed-use?`,
          confidence: 0.82,
          sources: ['Market Analysis', 'Growth Projections', 'Permit Data'],
          suggestedActions: [
            { label: 'Compare Areas', action: 'tool:comparison' },
            { label: 'ROI Calculator', action: 'navigate:/roi-calculator' },
            { label: 'View Available Land', action: 'search:land' }
          ]
        }
      }
    }

    // Investment queries - use real investment scoring
    if (messageLower.includes('invest') || messageLower.includes('roi')) {
      try {
        // Check for specific area investment queries
        const areas = ['katy', 'cypress', 'spring', 'heights', 'downtown']
        const mentionedArea = areas.find(area => messageLower.includes(area))
        
        if (mentionedArea) {
          const score = await investmentScoring.calculateAreaInvestmentScore(
            mentionedArea.charAt(0).toUpperCase() + mentionedArea.slice(1)
          )
          
          return {
            response: `Based on comprehensive analysis, ${score.area} has an investment score of **${score.totalScore.toFixed(1)}/100**.

**Score Breakdown:**
• Growth Potential: ${score.components.growthScore}/100
• Affordability: ${score.components.affordabilityScore}/100
• Infrastructure: ${score.components.infrastructureScore}/100
• Risk Level: ${score.components.riskScore}/100
• Market Dynamics: ${score.components.marketDynamicsScore}/100

**Key Recommendations:**
${score.recommendations.map(r => `• ${r}`).join('\n')}

**Risk Factors:**
${score.riskFactors.map(r => `⚠️ ${r}`).join('\n')}

Would you like me to find specific properties or calculate ROI projections for this area?`,
            confidence: 0.92,
            sources: ['Investment Scoring Engine', 'Market Analytics', 'Risk Assessment'],
            suggestedActions: [
              { label: 'Find Properties', action: `search:properties:area:${score.area}` },
              { label: 'Calculate ROI', action: 'navigate:/roi-calculator' },
              { label: 'View Heat Map', action: 'navigate:/intelligence/map' }
            ]
          }
        }
        
        // Check for distressed property queries
        if (messageLower.includes('distressed') || messageLower.includes('foreclosure') || messageLower.includes('opportunity')) {
          const opportunities = await investmentScoring.findDistressedOpportunities()
          
          if (opportunities.length > 0) {
            return {
              response: `I found ${opportunities.length} distressed property opportunities with high investment potential:

${opportunities.slice(0, 3).map((opp, idx) => `
**${idx + 1}. ${opp.property.address}**
• Price: $${opp.property.listPrice?.toLocaleString() || 'Contact for price'}
• Investment Score: ${opp.score.investmentScore}/100
• Strategy: ${opp.strategy}
• Key Factors: ${opp.score.factors.slice(0, 2).join(', ')}
`).join('\n')}

These properties show signs of motivated sellers and significant value-add potential. Would you like detailed ROI projections for any of these properties?`,
              confidence: 0.90,
              sources: ['Distressed Property Finder', 'Investment Analysis', 'Market Data'],
              suggestedActions: [
                { label: 'View All Opportunities', action: 'search:distressed' },
                { label: 'Calculate ROI', action: 'navigate:/roi-calculator' },
                { label: 'Get Financing', action: 'navigate:/tools/financing-calculator' }
              ]
            }
          }
        }
      } catch (error) {
        console.error('Investment scoring error:', error)
      }
      
      // Fallback to general investment info
      return {
        response: `Houston real estate offers excellent investment opportunities with average ROIs of 15-25% annually. The hottest investment areas are:

• **Residential Development**: 18-22% ROI in growth corridors
• **Multifamily**: 16-20% ROI with strong rental demand
• **Commercial**: 14-18% ROI in emerging business districts
• **Land Banking**: 25-35% appreciation in path of growth

With ${INTEGRATED_DATA.jobGrowth.totalNewJobs.toLocaleString()} new jobs coming to Houston, rental demand is surging. Would you like me to analyze specific areas or find distressed properties with high potential?`,
        confidence: 0.85,
        sources: ['Investment Analysis', 'Market Returns Data', 'Economic Projections'],
        suggestedActions: [
          { label: 'Area Analysis', action: 'analyze:investment:area' },
          { label: 'Find Opportunities', action: 'search:distressed' },
          { label: 'Calculate ROI', action: 'navigate:/roi-calculator' }
        ]
      }
    }

    // Check for construction cost queries
    if (messageLower.includes('construction cost') || messageLower.includes('building cost')) {
      const costs = await enhancedDataQuery.getConstructionCosts()
      if (costs) {
        return {
          response: `Current Houston construction costs (per sq ft):\n\n**Residential:**\n• Basic: $${costs.residential.low}/sq ft\n• Standard: $${costs.residential.mid}/sq ft\n• Luxury: $${costs.residential.high}/sq ft\n\n**Commercial:**\n• Office: $${costs.commercial.office}/sq ft\n• Retail: $${costs.commercial.retail}/sq ft\n• Industrial: $${costs.commercial.industrial}/sq ft\n\n**Market Trends:**\n• Overall costs up ${costs.yearOverYear.overall}% YoY\n• Materials up ${costs.yearOverYear.materials}%\n• Labor up ${costs.yearOverYear.labor}%`,
          confidence: 0.93,
          sources: ['Construction Cost Index', 'Builder Reports'],
          suggestedActions: [
            { label: 'Calculate Project Cost', action: 'navigate:/tools/cost-calculator' },
            { label: 'View Trends', action: 'view:construction-trends' }
          ]
        }
      }
    }
    
    // Check for STR/Airbnb queries
    if (messageLower.includes('str') || messageLower.includes('airbnb') || messageLower.includes('short term') || messageLower.includes('short-term')) {
      const neighborhoods = ['Heights', 'Montrose', 'Downtown', 'Midtown', 'Museum District']
      const strData = await Promise.all(
        neighborhoods.map(n => enhancedDataQuery.getSTRMarketData(n))
      )
      
      const validData = strData.filter(d => d !== null).slice(0, 3)
      if (validData.length > 0) {
        let response = 'Top short-term rental markets in Houston:\n\n'
        neighborhoods.forEach((neighborhood, idx) => {
          if (strData[idx]) {
            const data = strData[idx]!
            response += `**${neighborhood}** (${data.tier} Tier)\n`
            response += `• ADR: $${data.avgDailyRate}/night\n`
            response += `• Occupancy: ${data.occupancy}%\n`
            response += `• Annual Revenue: $${data.annualRevenue?.toLocaleString()}\n\n`
          }
        })
        
        return {
          response,
          confidence: 0.91,
          sources: ['STR Market Analysis', 'AirDNA Data'],
          suggestedActions: [
            { label: 'STR Calculator', action: 'navigate:/tools/str-calculator' },
            { label: 'Find STR Properties', action: 'search:str-properties' }
          ]
        }
      }
    }
    
    // Check for income/demographic queries
    if (messageLower.includes('income') || messageLower.includes('demographic') || messageLower.includes('who lives')) {
      const areaMatch = messageLower.match(/(?:in|for|at)\s+(\w+(?:\s+\w+)?)/i)
      const area = areaMatch ? areaMatch[1] : '77019' // River Oaks as default
      
      const [demographics, income] = await Promise.all([
        enhancedDataQuery.getAreaDemographics(area),
        enhancedDataQuery.getIncomeData(area)
      ])
      
      if (demographics || income) {
        let response = `Demographics and income data for ${area}:\n\n`
        
        if (demographics) {
          response += `**Population:** ${demographics.population?.toLocaleString()}\n`
          response += `**Median Age:** ${demographics.medianAge}\n`
          response += `**Diversity:** ${Math.round(100 - demographics.diversity.white)}% minority population\n\n`
        }
        
        if (income) {
          response += `**Income Levels:**\n`
          response += `• Median: $${income.median?.toLocaleString()}\n`
          response += `• Top 20%: ${income.distribution.over200k}% earn $200k+\n`
          response += `• Middle Class: ${income.distribution['50to75k'] + income.distribution['75to100k']}% earn $50-100k\n\n`
          response += `**Housing Affordability:**\n`
          response += `• Median Home: $${income.affordability?.medianHomeValue?.toLocaleString()}\n`
          response += `• Homeownership: ${income.affordability?.homeownership}%\n`
        }
        
        return {
          response,
          confidence: 0.94,
          sources: ['Census Data', 'Income Statistics', 'Demographic Analysis'],
          suggestedActions: [
            { label: 'View Full Report', action: `report:demographics:${area}` },
            { label: 'Compare Areas', action: 'tool:comparison' }
          ]
        }
      }
    }
    
    // Check for economic/GDP queries
    if (messageLower.includes('economy') || messageLower.includes('gdp') || messageLower.includes('economic')) {
      const indicators = await enhancedDataQuery.getEconomicIndicators()
      if (indicators.length > 0) {
        let response = 'Houston economic indicators:\n\n'
        indicators.slice(0, 5).forEach(ind => {
          response += `• **${ind.name}**: ${ind.value.toLocaleString()} ${ind.unit}`
          if (ind.change) {
            response += ` (${ind.change > 0 ? '+' : ''}${ind.change}% YoY)`
          }
          response += '\n'
        })
        
        response += '\nHouston ranks #4 in US metro GDP at $678 billion, with strong growth in energy, healthcare, and technology sectors.'
        
        return {
          response,
          confidence: 0.92,
          sources: ['Economic Indicators', 'Federal Reserve Data', 'Greater Houston Partnership'],
          suggestedActions: [
            { label: 'View All Indicators', action: 'navigate:/data/economic' },
            { label: 'Industry Analysis', action: 'analyze:industries' }
          ]
        }
      }
    }
    
    // Default conversational response with enhanced data mention
    return {
      response: `I understand you're interested in Houston real estate. With our enhanced database including demographics, rental markets, employment data, and HCAD property records, I can help you with:

• Comprehensive area analysis (demographics, income, rentals)
• Employer and job market insights  
• Construction costs and trends
• Short-term rental opportunities
• Property valuations from HCAD
• Investment opportunity scoring

What specific aspect would you like to explore?`,
      confidence: 0.85,
      sources: ['Fernando-X Enhanced Database'],
      suggestedActions: [
        { label: 'Area Analysis', action: 'analyze:area' },
        { label: 'Find Opportunities', action: 'search:opportunities' }
      ]
    }
  }

  private getFallbackResponse(message: string): any {
    return {
      response: `I'm having trouble understanding that specific query, but I'm definitely here to help! I have access to comprehensive Houston real estate data including population growth, developer information, and market trends. Could you rephrase your question or tell me what specific information you're looking for?`,
      confidence: 0.60,
      sources: ['Fernando-X'],
      suggestedActions: [
        { label: 'View Examples', action: 'help' },
        { label: 'Browse Topics', action: 'navigate:/' }
      ]
    }
  }

  async storeConversation(
    sessionId: string,
    userId: string | undefined,
    userMessage: string,
    assistantResponse: string
  ): Promise<void> {
    // Store in memory for context
    await fernandoMemory.storeMemory({
      userId,
      sessionId,
      memoryType: 'conversation',
      content: {
        userMessage,
        assistantResponse,
        timestamp: new Date()
      },
      importance: 0.7
    })
  }

  async getConversationContext(sessionId: string): Promise<ConversationContext> {
    const memories = await fernandoMemory.getConversationHistory(sessionId, 10)
    
    return {
      sessionId,
      conversationHistory: memories.map(m => ({
        role: m.content.userMessage ? 'user' : 'assistant',
        content: m.content.userMessage || m.content.assistantResponse,
        timestamp: new Date(m.createdAt)
      }))
    }
  }
}

export const conversationEngine = new FernandoXConversationEngine()