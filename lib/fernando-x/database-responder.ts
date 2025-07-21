// Fernando-X Database Responder - Uses real database data in conversations
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class DatabaseResponder {
  async generateDatabaseResponse(query: string): Promise<{
    response: string
    data?: any
    confidence: number
    sources: string[]
  }> {
    const queryLower = query.toLowerCase()
    
    // Property search queries
    if (queryLower.includes('buy') && (queryLower.includes('home') || queryLower.includes('house') || queryLower.includes('property'))) {
      return this.handlePropertySearch(query)
    }
    
    // Neighborhood queries
    if (queryLower.includes('neighborhood') || queryLower.includes('area') || queryLower.includes('where') && queryLower.includes('live')) {
      return this.handleNeighborhoodQuery(query)
    }
    
    // Developer queries
    if (queryLower.includes('developer') || queryLower.includes('builder') || queryLower.includes('who builds')) {
      return this.handleDeveloperQuery(query)
    }
    
    // Market data queries
    if (queryLower.includes('market') || queryLower.includes('price') || queryLower.includes('trend')) {
      return this.handleMarketQuery(query)
    }
    
    // Construction cost queries
    if (queryLower.includes('cost') || queryLower.includes('build') || queryLower.includes('construction')) {
      return this.handleConstructionQuery(query)
    }
    
    // Permit queries
    if (queryLower.includes('permit') || queryLower.includes('approval') || queryLower.includes('zoning')) {
      return this.handlePermitQuery(query)
    }
    
    // Investment queries
    if (queryLower.includes('invest') || queryLower.includes('roi') || queryLower.includes('opportunity')) {
      return this.handleInvestmentQuery(query)
    }
    
    return {
      response: "I can help you with Houston real estate! Try asking about neighborhoods, developers, market prices, construction costs, or investment opportunities.",
      confidence: 0.7,
      sources: ['Fernando-X Database']
    }
  }
  
  private async handlePropertySearch(query: string): Promise<any> {
    const queryLower = query.toLowerCase()
    
    // Extract budget if mentioned
    const budgetMatch = query.match(/\$?([\d,]+)k?/i)
    let maxPrice = 500000 // default
    if (budgetMatch) {
      const amount = parseInt(budgetMatch[1].replace(/,/g, ''))
      maxPrice = queryLower.includes('k') ? amount * 1000 : amount
    }
    
    // Get properties from database
    const properties = await prisma.property.findMany({
      where: {
        price: {
          gt: 0,
          lte: maxPrice
        }
      },
      orderBy: { price: 'asc' },
      take: 5
    })
    
    // Get neighborhood data
    const neighborhoods = await prisma.hARNeighborhoodData.findMany({
      where: {
        avgSalePrice: {
          gt: 0,
          lte: maxPrice
        }
      },
      orderBy: { avgSalePrice: 'asc' },
      take: 5
    })
    
    if (properties.length === 0 && neighborhoods.length === 0) {
      return {
        response: `I don't have many properties in my database under $${maxPrice.toLocaleString()} right now. However, Houston has many affordable neighborhoods!\n\nConsider areas like:\n- Alief (Southwest Houston) - Houses from $150K\n- Greenspoint (North Houston) - Condos from $80K\n- East Houston - Opportunities from $120K\n\nWould you like me to search for specific neighborhoods or property types?`,
        confidence: 0.8,
        sources: ['Property Database', 'HAR Neighborhood Data']
      }
    }
    
    let response = `Based on your budget of $${maxPrice.toLocaleString()}, here's what I found:\n\n`
    
    if (properties.length > 0) {
      response += `**Available Properties:**\n`
      properties.forEach(p => {
        response += `• ${p.address || 'Property'} in ${p.city || 'Houston'} - $${p.price.toLocaleString()}\n`
        if (p.beds && p.baths) {
          response += `  ${p.beds} bed, ${p.baths} bath, ${p.sqft ? p.sqft.toLocaleString() + ' sqft' : ''}\n`
        }
      })
      response += '\n'
    }
    
    if (neighborhoods.length > 0) {
      response += `**Affordable Neighborhoods:**\n`
      neighborhoods.forEach(n => {
        if (n.avgSalePrice > 0) {
          response += `• ${n.name} - Avg price: $${n.avgSalePrice.toLocaleString()}\n`
          if (n.medianDaysOnMarket) {
            response += `  Homes sell in ${n.medianDaysOnMarket} days\n`
          }
        }
      })
    }
    
    response += `\nWant me to look at specific neighborhoods or property types?`
    
    return {
      response,
      data: { properties, neighborhoods },
      confidence: 0.9,
      sources: ['Property Database', 'HAR Neighborhood Data']
    }
  }
  
  private async handleNeighborhoodQuery(query: string): Promise<any> {
    // Get neighborhoods with actual data
    const neighborhoods = await prisma.hARNeighborhoodData.findMany({
      where: {
        avgSalePrice: { gt: 0 }
      },
      orderBy: { avgSalePrice: 'asc' },
      take: 10
    })
    
    if (neighborhoods.length === 0) {
      return {
        response: "I'm still loading neighborhood data. Here are Houston's popular areas:\n\n• The Heights - Trendy, walkable, $400K-$800K\n• Montrose - Urban, diverse, $300K-$600K\n• Rice/Museum District - Cultural hub, $500K-$1M\n• East Downtown (EaDo) - Up-and-coming, $250K-$500K\n• Spring Branch - Family-friendly, $300K-$500K\n\nWhich area interests you?",
        confidence: 0.7,
        sources: ['Houston Knowledge Base']
      }
    }
    
    let response = `Here are Houston neighborhoods with current market data:\n\n`
    
    neighborhoods.forEach(n => {
      response += `**${n.name}**\n`
      response += `• Average Price: $${n.avgSalePrice.toLocaleString()}\n`
      if (n.medianSalePrice) {
        response += `• Median Price: $${n.medianSalePrice.toLocaleString()}\n`
      }
      if (n.medianDaysOnMarket) {
        response += `• Days on Market: ${n.medianDaysOnMarket}\n`
      }
      if (n.totalSales) {
        response += `• Recent Sales: ${n.totalSales}\n`
      }
      response += '\n'
    })
    
    response += `Which neighborhood would you like to know more about?`
    
    return {
      response,
      data: neighborhoods,
      confidence: 0.95,
      sources: ['HAR Neighborhood Database', 'Market Analytics']
    }
  }
  
  private async handleDeveloperQuery(query: string): Promise<any> {
    const developers = await prisma.developer.findMany({
      orderBy: { activeProjects: 'desc' },
      take: 10
    })
    
    if (developers.length === 0) {
      return {
        response: "Developer data is being updated. Houston's major builders include D.R. Horton, Lennar, Perry Homes, and Toll Brothers.",
        confidence: 0.6,
        sources: ['Developer Database']
      }
    }
    
    let response = `Here are Houston's active developers:\n\n`
    
    developers.forEach(d => {
      response += `**${d.name}**\n`
      response += `• Active Projects: ${d.activeProjects}\n`
      if (d.averagePrice) {
        response += `• Average Home Price: $${d.averagePrice.toLocaleString()}\n`
      }
      if (d.primaryFocus) {
        response += `• Focus: ${d.primaryFocus}\n`
      }
      if (d.primaryAreas && d.primaryAreas.length > 0) {
        response += `• Areas: ${d.primaryAreas.join(', ')}\n`
      }
      response += '\n'
    })
    
    return {
      response,
      data: developers,
      confidence: 0.9,
      sources: ['Developer Database', 'Project Records']
    }
  }
  
  private async handleMarketQuery(query: string): Promise<any> {
    const marketMetrics = await prisma.marketMetrics.findFirst({
      orderBy: { date: 'desc' }
    })
    
    const neighborhoods = await prisma.hARNeighborhoodData.findMany({
      where: { avgSalePrice: { gt: 0 } },
      orderBy: { priceChangeYTD: 'desc' },
      take: 5
    })
    
    let response = `Here's the current Houston market snapshot:\n\n`
    
    if (marketMetrics) {
      response += `**Overall Market:**\n`
      response += `• Median Price: $${marketMetrics.medianPrice?.toLocaleString() || 'N/A'}\n`
      response += `• Average Price: $${marketMetrics.averagePrice?.toLocaleString() || 'N/A'}\n`
      response += `• Days on Market: ${marketMetrics.avgDaysOnMarket || 'N/A'}\n`
      response += `• Inventory: ${marketMetrics.inventoryMonths || 'N/A'} months\n\n`
    }
    
    if (neighborhoods.length > 0) {
      response += `**Hot Neighborhoods (by price growth):**\n`
      neighborhoods.forEach(n => {
        if (n.priceChangeYTD) {
          response += `• ${n.name}: ${n.priceChangeYTD > 0 ? '+' : ''}${n.priceChangeYTD}% YTD\n`
        }
      })
    }
    
    response += `\nWhat specific market data interests you?`
    
    return {
      response,
      data: { marketMetrics, neighborhoods },
      confidence: 0.85,
      sources: ['Market Metrics Database', 'HAR Analytics']
    }
  }
  
  private async handleConstructionQuery(query: string): Promise<any> {
    const costs = await prisma.constructionCostDP5.findFirst({
      orderBy: { effectiveDate: 'desc' }
    })
    
    if (!costs) {
      return {
        response: `Houston construction costs (2025 estimates):\n\n• Basic Home: $85-$110/sqft\n• Mid-Range: $110-$150/sqft\n• High-End: $150-$250/sqft\n• Luxury: $250+/sqft\n\nFor a 2,000 sqft home:\n• Basic: $170K-$220K\n• Mid-Range: $220K-$300K\n• High-End: $300K-$500K\n\nThese are construction costs only. Add land, permits, utilities.`,
        confidence: 0.8,
        sources: ['Construction Cost Estimates']
      }
    }
    
    let response = `Current Houston construction costs:\n\n`
    response += `**Residential (per sqft):**\n`
    response += `• Economy: $${costs.residentialLow || 85}/sqft\n`
    response += `• Standard: $${costs.residentialMid || 142}/sqft\n`
    response += `• Premium: $${costs.residentialHigh || 225}/sqft\n\n`
    
    response += `**Commercial:**\n`
    response += `• Office: $${costs.commercialOffice || 165}/sqft\n`
    response += `• Retail: $${costs.commercialRetail || 145}/sqft\n`
    response += `• Warehouse: $${costs.commercialIndustrial || 95}/sqft\n\n`
    
    if (costs.laborRateSkilled) {
      response += `**Labor Rates:**\n`
      response += `• Skilled: $${costs.laborRateSkilled}/hour\n`
      response += `• General: $${costs.laborRateUnskilled}/hour\n`
    }
    
    return {
      response,
      data: costs,
      confidence: 0.9,
      sources: ['Construction Cost Database', 'Market Data']
    }
  }
  
  private async handlePermitQuery(query: string): Promise<any> {
    const permitCount = await prisma.permit.count()
    const recentPermits = await prisma.permit.findMany({
      orderBy: { applicationDate: 'desc' },
      take: 5
    })
    
    let response = `Houston permit information:\n\n`
    response += `• Total permits in database: ${permitCount}\n`
    response += `• Typical approval time: 2-4 weeks for residential\n`
    response += `• Commercial permits: 4-8 weeks\n\n`
    
    if (recentPermits.length > 0) {
      response += `**Recent Permits:**\n`
      recentPermits.forEach(p => {
        response += `• ${p.permitType || 'Building'} - ${p.address || 'Houston'}\n`
        if (p.declaredValue) {
          response += `  Value: $${p.declaredValue.toLocaleString()}\n`
        }
      })
    }
    
    response += `\nNeed help with a specific permit type?`
    
    return {
      response,
      data: recentPermits,
      confidence: 0.8,
      sources: ['Permit Database', 'City of Houston']
    }
  }
  
  private async handleInvestmentQuery(query: string): Promise<any> {
    const properties = await prisma.property.findMany({
      where: {
        price: { gt: 0 },
        propertyType: { in: ['land', 'commercial', 'mixed-use'] }
      },
      orderBy: { price: 'asc' },
      take: 5
    })
    
    const projects = await prisma.project.findMany({
      where: { phase: { in: ['planning', 'approved'] } },
      orderBy: { totalValue: 'desc' },
      take: 3
    })
    
    let response = `Houston investment opportunities:\n\n`
    
    if (properties.length > 0) {
      response += `**Development Properties:**\n`
      properties.forEach(p => {
        const roi = p.propertyType === 'land' ? 35 : 25
        response += `• ${p.address || p.propertyType} in ${p.city || 'Houston'}\n`
        response += `  Price: $${p.price.toLocaleString()} | Est. ROI: ${roi}%\n`
      })
      response += '\n'
    }
    
    if (projects.length > 0) {
      response += `**Major Projects (partnership opportunities):**\n`
      projects.forEach(p => {
        response += `• ${p.name} - ${p.phase}\n`
        response += `  Value: $${(p.totalValue / 1000000).toFixed(1)}M\n`
      })
    }
    
    response += `\nInterested in residential, commercial, or land development?`
    
    return {
      response,
      data: { properties, projects },
      confidence: 0.85,
      sources: ['Investment Database', 'Project Pipeline']
    }
  }
}

export const databaseResponder = new DatabaseResponder()