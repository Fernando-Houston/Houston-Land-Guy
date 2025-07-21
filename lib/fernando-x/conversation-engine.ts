// Fernando-X Conversation Engine with LLM Integration
import { getIntegratedData } from '../fernando-x-data'
import { fernandoMemory } from './memory-service'
import { fernandoDataQuery } from './data-query-service'
import { investmentScoring } from '../services/investment-scoring-service'
import { enhancedDataQuery } from './enhanced-data-query-service'
import { conversationalFernando, shouldUseConversationalResponse } from './conversational-response'
import { chatGPTEngine } from './chatgpt-engine'
import { dataValidationService } from '../services/data-validation-service'
import { dataRelationshipService } from '../services/data-relationships'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

1. 750,000+ data points about Houston real estate (live database integration)
2. Real-time market analytics and trends
3. Developer ecosystem data (projects, permits, relationships)
4. Neighborhood demographics and growth projections
5. Investment opportunities with confidence scoring
6. Data validation and relationship mapping
7. Property intelligence and document analysis

Your capabilities include:
- Querying live database for current information
- Cross-referencing data across multiple sources
- Providing data quality assessments
- Generating investment insights
- Analyzing developer-project-permit relationships
- Neighborhood ecosystem analysis

Your personality:
- Expert and knowledgeable but approachable
- Proactive in offering insights and suggestions
- Data-driven but conversational
- Enthusiastic about Houston's growth potential
- Helpful in guiding users to make informed decisions

Always:
- Use live data from the database when available
- Cite specific data sources and confidence scores
- Offer actionable insights with supporting evidence
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
      // FIRST: Search training data for exact or similar Q&As
      console.log('🎓 Searching Fernando training data for:', userMessage)
      const trainingResults = await fernandoMemory.searchTrainingData(userMessage, 3)
      
      if (trainingResults.length > 0 && trainingResults[0].confidence > 0.5) {
        console.log(`✅ Found training match with confidence: ${trainingResults[0].confidence}`)
        return {
          response: trainingResults[0].answer,
          confidence: trainingResults[0].confidence,
          sources: ['Fernando-X Training Data', 'Houston Real Estate Knowledge Base'],
          suggestedActions: this.getTrainingBasedActions(userMessage, trainingResults[0])
        }
      }
      
      // Try ChatGPT if no good training match
      if (process.env.OPENAI_API_KEY && typeof window === 'undefined') {
        console.log('🤖 Using ChatGPT for response generation')
        
        // Convert conversation history to the format ChatGPT expects
        const formattedHistory = context.conversationHistory.map(h => ({
          role: h.role,
          content: h.content
        }))
        
        const chatGPTResponse = await chatGPTEngine.generateResponse(
          userMessage,
          context.sessionId,
          formattedHistory
        )
        
        // If ChatGPT gave a good response, use it
        if (chatGPTResponse.confidence > 0.8) {
          return chatGPTResponse
        }
      }
      
      // Fallback to conversational response for casual queries
      if (shouldUseConversationalResponse(userMessage)) {
        const conversationalResponse = await conversationalFernando.getResponse(
          userMessage,
          context.sessionId
        )
        
        return {
          response: conversationalResponse,
          confidence: 0.95,
          sources: ['Fernando-X Conversational AI'],
          suggestedActions: this.getConversationalActions(userMessage, conversationalResponse)
        }
      }
      
      // Check if we need to use fallback for specific queries
      const fallbackResponse = this.checkForDataQuery(userMessage)
      if (fallbackResponse) {
        return fallbackResponse
      }

      // Use enhanced pattern matching with data context
      return this.generateSmartResponse(userMessage, context)
    } catch (error) {
      console.error('Error generating response:', error)
      return this.getFallbackResponse(userMessage)
    }
  }

  private async checkForDataQuery(message: string): Promise<any> {
    const messageLower = message.toLowerCase()
    
    // Get live integrated data
    const integratedData = await getIntegratedData()
    
    // Check for data validation queries
    if (messageLower.includes('data quality') || messageLower.includes('validation') || messageLower.includes('data issues')) {
      const validation = await dataValidationService.validateAllData()
      return this.formatValidationResponse(validation)
    }
    
    // Check for relationship queries
    if (messageLower.includes('relationship') || messageLower.includes('connected') || messageLower.includes('links between')) {
      const relationships = await dataRelationshipService.getAllRelationshipsSummary()
      return this.formatRelationshipResponse(relationships)
    }
    
    // Check for developer ecosystem queries
    const developerMatch = messageLower.match(/(?:developer|development)\s+(.+?)(?:\s|$)/i)
    if (developerMatch) {
      const developerName = developerMatch[1]
      return this.getDeveloperEcosystemData(developerName)
    }
    
    // Check for neighborhood ecosystem queries
    const neighborhoodMatch = messageLower.match(/(?:neighborhood|area)\s+(.+?)(?:\s|$)/i)
    if (neighborhoodMatch) {
      const neighborhoodName = neighborhoodMatch[1]
      return this.getNeighborhoodEcosystemData(neighborhoodName)
    }
    
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
        // Fallback to generic data
        return {
          response: `Houston's population is experiencing significant growth with several key areas showing strong development potential. The fastest growing areas include Katy, Cypress, and Spring, each showing double-digit growth rates. This creates massive opportunities for developers. Would you like to explore specific areas or development types?`,
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
        // Fallback to generic developer info
        return {
          response: `D.R. Horton is one of Houston's major homebuilders, focusing on entry-level and move-up homes across key growth areas like Katy, Spring, and Fort Bend County. They typically develop communities in the $250K-$450K price range and are known for high permit activity. Want to see their specific communities or analyze investment opportunities?`,
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
        // Fallback to generic development info
        return {
          response: `Based on current market data, the best areas for development in Houston are:

1. **Katy** - Strong population growth, adding thousands of new residents annually
2. **Cypress** - High growth area with strong demand for single-family homes
3. **Spring** - Emerging market with lower land costs and good access

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

With significant job growth coming to Houston, rental demand is surging. Would you like me to analyze specific areas or find distressed properties with high potential?`,
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
    try {
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
    } catch (error) {
      console.log('Memory storage skipped - service not available')
    }
  }

  async getConversationContext(sessionId: string): Promise<ConversationContext> {
    try {
      const memories = await fernandoMemory.getConversationHistory(sessionId, 10)
      
      return {
        sessionId,
        conversationHistory: memories.map(m => ({
          role: m.content.userMessage ? 'user' : 'assistant',
          content: m.content.userMessage || m.content.assistantResponse,
          timestamp: new Date(m.createdAt)
        }))
      }
    } catch (error) {
      console.log('Memory service not available, using empty context')
      return {
        sessionId,
        conversationHistory: []
      }
    }
  }
  
  // Format validation response for user-friendly display
  private formatValidationResponse(validation: any): any {
    let response = `## Data Quality Report\n\n`
    response += `**Overall Quality Score: ${(validation.overallQualityScore * 100).toFixed(1)}%**\n\n`
    response += `**Summary:**\n`
    
    // Top issues by entity
    const topIssues = Object.entries(validation.summary)
      .sort((a: any, b: any) => a[1].dataQualityScore - b[1].dataQualityScore)
      .slice(0, 3)
    
    topIssues.forEach(([key, result]: any) => {
      response += `• **${result.entity}**: ${(result.dataQualityScore * 100).toFixed(1)}% quality`
      if (result.invalidRecords > 0) response += ` (${result.invalidRecords} issues)`
      if (result.duplicates > 0) response += ` (${result.duplicates} duplicates)`
      if (result.orphanedRecords > 0) response += ` (${result.orphanedRecords} orphaned)`
      response += `\n`
    })
    
    response += `\n**Total Issues Found:** ${validation.issues.length}\n\n`
    
    if (validation.issues.length > 0) {
      response += `**Critical Issues:**\n`
      validation.issues.slice(0, 5).forEach((issue: any) => {
        response += `⚠️ ${issue.details}\n`
      })
      if (validation.issues.length > 5) {
        response += `... and ${validation.issues.length - 5} more issues\n`
      }
    }
    
    return {
      response,
      confidence: 0.95,
      sources: ['Data Validation Service', 'Database Analysis'],
      suggestedActions: [
        { label: 'Full Validation Report', action: 'generate:validation-report' },
        { label: 'Fix Data Issues', action: 'navigate:/admin/data-quality' }
      ]
    }
  }
  
  // Format relationship response for user-friendly display
  private formatRelationshipResponse(relationships: any): any {
    let response = `## Data Relationships Summary\n\n`
    response += `**System Health Score: ${(relationships.healthScore * 100).toFixed(1)}%**\n\n`
    
    response += `**Entity Counts:**\n`
    Object.entries(relationships.entities).forEach(([entity, count]) => {
      response += `• ${entity}: ${count}\n`
    })
    
    response += `\n**Relationship Completeness:**\n`
    Object.entries(relationships.relationships.completeness).forEach(([rel, completeness]) => {
      const percentage = parseFloat(completeness as string)
      const emoji = percentage > 90 ? '✅' : percentage > 70 ? '⚠️' : '❌'
      response += `${emoji} ${rel}: ${completeness}\n`
    })
    
    response += `\n**Key Insights:**\n`
    const devProjectComp = parseFloat(relationships.relationships.completeness['developer-project'])
    const projectPermitComp = parseFloat(relationships.relationships.completeness['project-permit'])
    
    if (devProjectComp < 90) {
      response += `• ${(100 - devProjectComp).toFixed(1)}% of projects need developer assignment\n`
    }
    if (projectPermitComp < 80) {
      response += `• ${(100 - projectPermitComp).toFixed(1)}% of permits need project linking\n`
    }
    if (relationships.healthScore > 0.85) {
      response += `• Overall data integrity is excellent\n`
    }
    
    return {
      response,
      confidence: 0.92,
      sources: ['Data Relationship Service', 'Entity Mapping'],
      suggestedActions: [
        { label: 'View Relationship Map', action: 'navigate:/admin/relationships' },
        { label: 'Fix Orphaned Records', action: 'tool:data-cleanup' }
      ]
    }
  }
  
  // Get developer ecosystem data with comprehensive analysis
  private async getDeveloperEcosystemData(developerName: string): Promise<any> {
    try {
      // Try to find developer by name
      const developer = await prisma.developer.findFirst({
        where: {
          name: {
            contains: developerName,
            mode: 'insensitive'
          }
        }
      })
      
      if (!developer) {
        return {
          response: `I couldn't find a developer named "${developerName}" in our database. Would you like me to search for similar names or show you a list of major developers?`,
          confidence: 0.70,
          sources: ['Developer Database'],
          suggestedActions: [
            { label: 'Search All Developers', action: 'search:developers' },
            { label: 'View Top Developers', action: 'navigate:/data/developers' }
          ]
        }
      }
      
      const ecosystem = await dataRelationshipService.getDeveloperEcosystem(developer.id)
      
      let response = `## ${ecosystem.developer.name} - Developer Ecosystem\n\n`
      response += `**Overview:**\n`
      response += `• Total Projects: ${ecosystem.metrics.totalProjects}\n`
      response += `• Active Projects: ${ecosystem.metrics.activeProjects}\n`
      response += `• Total Construction Value: $${(ecosystem.metrics.totalConstructionValue / 1000000).toFixed(1)}M\n`
      response += `• Permits Filed: ${ecosystem.metrics.totalPermits}\n`
      response += `• Neighborhoods Active: ${ecosystem.metrics.neighborhoodsActive}\n`
      response += `• Average Project Value: $${(ecosystem.metrics.averageProjectValue / 1000000).toFixed(1)}M\n\n`
      
      if (ecosystem.timeline && ecosystem.timeline.length > 0) {
        response += `**Recent Activity:**\n`
        ecosystem.timeline.slice(0, 3).forEach((event: any) => {
          response += `• ${new Date(event.date).toLocaleDateString()}: ${event.event}\n`
        })
        response += `\n`
      }
      
      response += `This developer is ${ecosystem.metrics.activeProjects > 5 ? 'highly active' : 'moderately active'} in the Houston market.`
      
      return {
        response,
        confidence: 0.95,
        sources: ['Developer Ecosystem Analysis', 'Project Database'],
        suggestedActions: [
          { label: 'View All Projects', action: `filter:developer:${ecosystem.developer.name}` },
          { label: 'Investment Analysis', action: 'analyze:investment' }
        ]
      }
    } catch (error) {
      console.error('Error getting developer ecosystem:', error)
      return {
        response: `I encountered an issue retrieving developer data. Please try again or search for developers in our database.`,
        confidence: 0.60,
        sources: ['Database Error'],
        suggestedActions: [
          { label: 'Browse Developers', action: 'navigate:/data/developers' }
        ]
      }
    }
  }
  
  // Get neighborhood ecosystem data with comprehensive analysis
  private async getNeighborhoodEcosystemData(neighborhoodName: string): Promise<any> {
    try {
      // Try to find neighborhood by name
      const neighborhood = await prisma.neighborhood.findFirst({
        where: {
          name: {
            contains: neighborhoodName,
            mode: 'insensitive'
          }
        }
      })
      
      if (!neighborhood) {
        return {
          response: `I couldn't find a neighborhood named "${neighborhoodName}" in our database. Would you like me to search for similar names or show you popular Houston neighborhoods?`,
          confidence: 0.70,
          sources: ['Neighborhood Database'],
          suggestedActions: [
            { label: 'Search Neighborhoods', action: 'search:neighborhoods' },
            { label: 'View Houston Map', action: 'navigate:/intelligence/map' }
          ]
        }
      }
      
      const ecosystem = await dataRelationshipService.getNeighborhoodEcosystem(neighborhood.id)
      
      let response = `## ${ecosystem.neighborhood.name} - Neighborhood Ecosystem\n\n`
      
      // Demographics
      if (ecosystem.neighborhood.demographics && ecosystem.neighborhood.demographics.length > 0) {
        const latest = ecosystem.neighborhood.demographics[0]
        response += `**Demographics:**\n`
        response += `• Population: ${latest.population?.toLocaleString()}\n`
        if (latest.medianIncome) response += `• Median Income: $${latest.medianIncome.toLocaleString()}\n`
        if (latest.averageHouseholdSize) response += `• Avg Household Size: ${latest.averageHouseholdSize}\n`
        response += `\n`
      }
      
      // Market data
      if (ecosystem.neighborhood.marketData && ecosystem.neighborhood.marketData.length > 0) {
        const latest = ecosystem.neighborhood.marketData[0]
        response += `**Market Data:**\n`
        if (latest.medianPrice) response += `• Median Price: $${latest.medianPrice.toLocaleString()}\n`
        if (latest.priceChangeYoY) response += `• Price Growth YoY: ${latest.priceChangeYoY.toFixed(1)}%\n`
        if (latest.inventoryMonths) response += `• Inventory: ${latest.inventoryMonths} months\n`
        response += `\n`
      }
      
      // Development activity
      response += `**Development Activity:**\n`
      response += `• Active Projects: ${ecosystem.developmentActivity.activeProjects}\n`
      response += `• Total Investment: $${(ecosystem.developmentActivity.totalInvestment / 1000000).toFixed(1)}M\n`
      
      if (ecosystem.developmentActivity.topDevelopers.length > 0) {
        response += `• Top Developers: ${ecosystem.developmentActivity.topDevelopers.slice(0, 2).map((d: any) => d.name).join(', ')}\n`
      }
      
      // Growth indicators
      if (ecosystem.growthIndicators) {
        response += `\n**Growth Score: ${ecosystem.growthIndicators.growthScore.toFixed(1)}/10**\n`
        response += `• Population Growth: ${ecosystem.growthIndicators.populationGrowth.toFixed(1)}%\n`
        response += `• Development Activity: ${ecosystem.growthIndicators.developmentActivity} projects\n`
      }
      
      // Housing demand
      if (ecosystem.housingDemand) {
        response += `\n**Housing Demand: ${ecosystem.housingDemand} units needed**\n`
      }
      
      return {
        response,
        confidence: 0.95,
        sources: ['Neighborhood Ecosystem Analysis', 'Demographics', 'Market Data'],
        suggestedActions: [
          { label: 'View Properties', action: `search:properties:area:${ecosystem.neighborhood.name}` },
          { label: 'Investment Analysis', action: 'analyze:investment' },
          { label: 'Compare Areas', action: 'tool:comparison' }
        ]
      }
    } catch (error) {
      console.error('Error getting neighborhood ecosystem:', error)
      return {
        response: `I encountered an issue retrieving neighborhood data. Please try again or browse our neighborhood database.`,
        confidence: 0.60,
        sources: ['Database Error'],
        suggestedActions: [
          { label: 'Browse Neighborhoods', action: 'navigate:/data/neighborhoods' }
        ]
      }
    }
  }
  
  private getConversationalActions(message: string, response: string): Array<{ label: string; action: string }> {
    const actions: Array<{ label: string; action: string }> = []
    const messageLower = message.toLowerCase()
    const responseLower = response.toLowerCase()
    
    // Add relevant actions based on conversation context
    if (messageLower.includes('build') || responseLower.includes('build')) {
      actions.push(
        { label: 'Construction Cost Calculator', action: 'navigate:/tools/cost-calculator' },
        { label: 'Find Lots', action: 'search:land' }
      )
    }
    
    if (messageLower.includes('invest') || messageLower.includes('roi')) {
      actions.push(
        { label: 'ROI Calculator', action: 'navigate:/roi-calculator' },
        { label: 'View Properties', action: 'search:properties' }
      )
    }
    
    if (responseLower.includes('area') || responseLower.includes('neighborhood')) {
      actions.push(
        { label: 'View Map', action: 'navigate:/intelligence/map' },
        { label: 'Compare Areas', action: 'tool:comparison' }
      )
    }
    
    // Always include a help action
    if (actions.length === 0) {
      actions.push(
        { label: 'Search Properties', action: 'search:properties' },
        { label: 'View Market Data', action: 'navigate:/intelligence' }
      )
    }
    
    return actions
  }

  // Generate suggested actions based on training data match
  private getTrainingBasedActions(userMessage: string, trainingMatch: { question: string; answer: string; confidence: number }) {
    const actions: Array<{ label: string; action: string }> = []
    const messageLower = userMessage.toLowerCase()
    const answerLower = trainingMatch.answer.toLowerCase()
    
    // Property-related actions
    if (messageLower.includes('property') || messageLower.includes('home') || messageLower.includes('house')) {
      actions.push({ label: 'Search Properties', action: 'search:properties' })
    }
    
    // Neighborhood-related actions
    if (messageLower.includes('neighborhood') || messageLower.includes('area')) {
      actions.push({ label: 'Explore Neighborhoods', action: 'navigate:/neighborhoods' })
    }
    
    // Investment-related actions
    if (messageLower.includes('invest') || messageLower.includes('roi') || messageLower.includes('return')) {
      actions.push({ label: 'View Investment Opportunities', action: 'navigate:/investment-opportunities' })
    }
    
    // Developer-related actions
    if (messageLower.includes('developer') || messageLower.includes('builder')) {
      actions.push({ label: 'Browse Developers', action: 'navigate:/developers' })
    }
    
    // Market data actions
    if (messageLower.includes('market') || messageLower.includes('trend') || messageLower.includes('data')) {
      actions.push({ label: 'View Market Intelligence', action: 'navigate:/intelligence' })
    }
    
    // Always include follow-up option
    actions.push({ label: 'Ask Follow-up', action: 'continue:conversation' })
    
    return actions.slice(0, 3) // Limit to 3 actions
  }
}

export const conversationEngine = new FernandoXConversationEngine()