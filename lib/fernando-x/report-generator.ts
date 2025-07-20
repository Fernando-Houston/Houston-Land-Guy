// Fernando-X Natural Language Report Generator
// Creates professional investment memos, feasibility studies, and market analysis reports

import { KnowledgeNode, fernandoXKnowledge } from './knowledge-base'
import { SearchResult } from './semantic-search'
import { ConversationContext } from './conversation-manager'
import { PhotoAnalysis } from './computer-vision'

export interface ReportConfig {
  type: 'investment-memo' | 'market-analysis' | 'feasibility-study' | 'portfolio-review' | 'development-proposal'
  format: 'pdf' | 'html' | 'markdown' | 'docx'
  style: 'executive' | 'detailed' | 'technical'
  sections?: string[]
  includeVisuals: boolean
  confidenceThreshold?: number
}

export interface ReportSection {
  title: string
  content: string
  subsections?: ReportSection[]
  data?: any
  visualizations?: Array<{
    type: 'chart' | 'map' | 'table' | 'image'
    data: any
    caption: string
  }>
  confidence: number
  sources: string[]
}

export interface GeneratedReport {
  id: string
  title: string
  type: string
  generatedAt: Date
  sections: ReportSection[]
  metadata: {
    wordCount: number
    readingTime: number // minutes
    confidence: number
    dataSources: string[]
    keyFindings: string[]
    recommendations: string[]
  }
  summary: string
}

class ReportGenerator {
  private templates: Map<string, ReportTemplate> = new Map()
  
  constructor() {
    this.initializeTemplates()
  }
  
  private initializeTemplates() {
    // Investment Memo Template
    this.templates.set('investment-memo', {
      sections: [
        'Executive Summary',
        'Investment Thesis',
        'Property Overview',
        'Market Analysis',
        'Financial Analysis',
        'Risk Assessment',
        'Exit Strategy',
        'Recommendation'
      ],
      requiredData: ['property', 'market', 'financials'],
      style: 'professional'
    })
    
    // Market Analysis Template
    this.templates.set('market-analysis', {
      sections: [
        'Executive Summary',
        'Market Overview',
        'Supply & Demand Dynamics',
        'Competitive Landscape',
        'Demographic Trends',
        'Economic Indicators',
        'Future Outlook',
        'Investment Opportunities'
      ],
      requiredData: ['market', 'demographics', 'economics'],
      style: 'analytical'
    })
    
    // Feasibility Study Template
    this.templates.set('feasibility-study', {
      sections: [
        'Executive Summary',
        'Project Description',
        'Market Feasibility',
        'Technical Feasibility',
        'Financial Feasibility',
        'Risk Analysis',
        'Implementation Timeline',
        'Conclusions & Recommendations'
      ],
      requiredData: ['project', 'market', 'financials', 'regulatory'],
      style: 'technical'
    })
    
    // Portfolio Review Template
    this.templates.set('portfolio-review', {
      sections: [
        'Portfolio Summary',
        'Performance Analysis',
        'Asset Allocation',
        'Market Exposure',
        'Risk Profile',
        'Optimization Opportunities',
        'Rebalancing Recommendations',
        'Action Items'
      ],
      requiredData: ['portfolio', 'market', 'performance'],
      style: 'executive'
    })
    
    // Development Proposal Template
    this.templates.set('development-proposal', {
      sections: [
        'Executive Summary',
        'Site Analysis',
        'Development Concept',
        'Market Justification',
        'Design & Planning',
        'Financial Projections',
        'Development Timeline',
        'Risk Mitigation',
        'Approvals & Permits',
        'Investment Structure'
      ],
      requiredData: ['site', 'market', 'development', 'regulatory'],
      style: 'comprehensive'
    })
  }
  
  // Generate a professional report
  async generateReport(
    topic: string,
    config: ReportConfig,
    context?: {
      conversation?: ConversationContext
      propertyData?: any
      marketData?: any
      photoAnalysis?: PhotoAnalysis[]
      customData?: Record<string, any>
    }
  ): Promise<GeneratedReport> {
    const template = this.templates.get(config.type)
    if (!template) {
      throw new Error(`Unknown report type: ${config.type}`)
    }
    
    // Gather relevant data
    const relevantData = await this.gatherRelevantData(topic, template.requiredData, context)
    
    // Generate sections
    const sections: ReportSection[] = []
    const sectionsToGenerate = config.sections || template.sections
    
    for (const sectionTitle of sectionsToGenerate) {
      const section = await this.generateSection(
        sectionTitle,
        topic,
        relevantData,
        config,
        context
      )
      sections.push(section)
    }
    
    // Generate executive summary
    const summary = this.generateExecutiveSummary(sections, config.type)
    
    // Calculate metadata
    const wordCount = this.calculateWordCount(sections)
    const readingTime = Math.ceil(wordCount / 200) // 200 words per minute
    const confidence = this.calculateOverallConfidence(sections)
    const keyFindings = this.extractKeyFindings(sections)
    const recommendations = this.extractRecommendations(sections)
    
    const report: GeneratedReport = {
      id: this.generateReportId(),
      title: this.generateTitle(topic, config.type),
      type: config.type,
      generatedAt: new Date(),
      sections,
      metadata: {
        wordCount,
        readingTime,
        confidence,
        dataSources: this.extractDataSources(sections),
        keyFindings,
        recommendations
      },
      summary
    }
    
    return report
  }
  
  // Gather relevant data for report
  private async gatherRelevantData(
    topic: string,
    requiredData: string[],
    context?: any
  ): Promise<Record<string, any>> {
    const data: Record<string, any> = {}
    
    // Search knowledge base
    const knowledgeNodes = fernandoXKnowledge.searchKnowledge(topic)
    data.knowledge = knowledgeNodes
    
    // Get market intelligence
    if (requiredData.includes('market')) {
      data.market = fernandoXKnowledge.getMarketIntelligence()
    }
    
    // Get development intelligence
    if (requiredData.includes('development')) {
      data.development = fernandoXKnowledge.getDevelopmentIntelligence()
    }
    
    // Get regulatory intelligence
    if (requiredData.includes('regulatory')) {
      data.regulatory = fernandoXKnowledge.getRegulatoryIntelligence()
    }
    
    // Get environmental intelligence
    if (requiredData.includes('environmental')) {
      data.environmental = fernandoXKnowledge.getEnvironmentalIntelligence()
    }
    
    // Include context data
    if (context) {
      Object.assign(data, context.customData || {})
      if (context.propertyData) data.property = context.propertyData
      if (context.marketData) data.marketData = context.marketData
      if (context.photoAnalysis) data.photoAnalysis = context.photoAnalysis
    }
    
    return data
  }
  
  // Generate a report section
  private async generateSection(
    sectionTitle: string,
    topic: string,
    data: Record<string, any>,
    config: ReportConfig,
    context?: any
  ): Promise<ReportSection> {
    const content = await this.generateSectionContent(sectionTitle, topic, data, config)
    const visualizations = config.includeVisuals ? 
      this.generateVisualizations(sectionTitle, data) : []
    
    return {
      title: sectionTitle,
      content,
      visualizations,
      confidence: this.calculateSectionConfidence(data),
      sources: this.extractSources(data),
      subsections: this.generateSubsections(sectionTitle, data, config)
    }
  }
  
  // Generate section content
  private async generateSectionContent(
    sectionTitle: string,
    topic: string,
    data: Record<string, any>,
    config: ReportConfig
  ): Promise<string> {
    // This would integrate with AI for natural language generation
    // For now, we'll use template-based generation
    
    switch (sectionTitle) {
      case 'Executive Summary':
        return this.generateExecutiveSummaryContent(topic, data, config)
      
      case 'Investment Thesis':
        return this.generateInvestmentThesis(topic, data)
      
      case 'Market Analysis':
        return this.generateMarketAnalysis(topic, data)
      
      case 'Financial Analysis':
        return this.generateFinancialAnalysis(topic, data)
      
      case 'Risk Assessment':
        return this.generateRiskAssessment(topic, data)
      
      case 'Property Overview':
        return this.generatePropertyOverview(topic, data)
      
      case 'Development Concept':
        return this.generateDevelopmentConcept(topic, data)
      
      default:
        return this.generateGenericSection(sectionTitle, topic, data)
    }
  }
  
  // Generate Executive Summary content
  private generateExecutiveSummaryContent(
    topic: string,
    data: Record<string, any>,
    config: ReportConfig
  ): string {
    const marketData = data.market?.microMarkets?.[0]
    const propertyData = data.property
    
    let summary = `## Investment Opportunity: ${topic}\n\n`
    
    if (config.type === 'investment-memo' && propertyData) {
      summary += `This investment memorandum evaluates the acquisition opportunity for ${propertyData.address || topic}, `
      summary += `a ${propertyData.propertyType || 'property'} located in ${propertyData.neighborhood || 'Houston'}. `
      
      if (marketData) {
        summary += `The ${marketData.neighborhood} market has demonstrated ${marketData.trends.priceTrend} price trends `
        summary += `with a ${marketData.stats.priceGrowth > 0 ? '+' : ''}${marketData.stats.priceGrowth}% year-over-year growth. `
      }
      
      summary += `\n\nKey investment highlights include:\n`
      summary += `- Strategic location with ${marketData?.trends.demandLevel || 'strong'} demand fundamentals\n`
      summary += `- ${marketData?.trends.developmentActivity || 'Active'} development activity in the area\n`
      summary += `- Multiple value-add opportunities through strategic improvements\n`
      
      if (propertyData.askingPrice) {
        summary += `- Asking price of $${propertyData.askingPrice.toLocaleString()} represents compelling value\n`
      }
    } else if (config.type === 'market-analysis') {
      summary += `This comprehensive market analysis examines the ${topic} real estate market, `
      summary += `providing insights into current conditions, trends, and investment opportunities. `
      
      if (marketData) {
        summary += `The analysis reveals a ${marketData.trends.priceTrend} market with `
        summary += `median prices at $${marketData.stats.medianPrice.toLocaleString()} and `
        summary += `${marketData.stats.daysOnMarket} average days on market. `
      }
    }
    
    return summary
  }
  
  // Generate Investment Thesis
  private generateInvestmentThesis(topic: string, data: Record<string, any>): string {
    const market = data.market?.microMarkets?.[0]
    const development = data.development?.activeProjects?.[0]
    
    let thesis = `## Investment Rationale\n\n`
    
    thesis += `### Market Dynamics\n`
    if (market) {
      thesis += `The ${market.neighborhood} submarket presents a compelling investment opportunity driven by:\n\n`
      thesis += `**Demand Drivers:**\n`
      thesis += `- ${market.trends.demandLevel} demand with ${market.stats.inventory} properties currently available\n`
      thesis += `- ${market.stats.walkScore}/100 walkability score attracting urban professionals\n`
      thesis += `- ${market.trends.foreignInvestment}% foreign investment indicating international appeal\n\n`
      
      thesis += `**Supply Constraints:**\n`
      thesis += `- Limited inventory with only ${market.stats.daysOnMarket} days average market time\n`
      thesis += `- ${market.trends.developmentActivity} development activity maintaining supply-demand balance\n`
      thesis += `- Zoning restrictions limiting new construction\n\n`
    }
    
    if (development) {
      thesis += `**Catalytic Projects:**\n`
      thesis += `The ${development.name} ($${(development.investment / 1000000000).toFixed(1)}B investment) `
      thesis += `will significantly enhance the area's value proposition through:\n`
      development.impact.forEach((impact: string) => {
        thesis += `- ${impact}\n`
      })
    }
    
    thesis += `\n### Value Creation Strategy\n`
    thesis += `1. **Immediate Improvements:** Property condition enhancements and curb appeal\n`
    thesis += `2. **Operational Efficiency:** Optimize property management and reduce expenses\n`
    thesis += `3. **Revenue Enhancement:** Strategic renovations to command premium rents\n`
    thesis += `4. **Market Timing:** Capitalize on ${market?.trends.priceTrend || 'favorable'} market conditions\n`
    
    return thesis
  }
  
  // Generate Market Analysis
  private generateMarketAnalysis(topic: string, data: Record<string, any>): string {
    const marketIntel = data.market
    let analysis = `## Comprehensive Market Analysis\n\n`
    
    if (marketIntel?.microMarkets) {
      analysis += `### Submarket Performance Comparison\n\n`
      analysis += `| Neighborhood | Median Price | YoY Growth | Days on Market | Inventory |\n`
      analysis += `|--------------|-------------|------------|----------------|----------|\n`
      
      marketIntel.microMarkets.forEach((market: any) => {
        analysis += `| ${market.neighborhood} | $${market.stats.medianPrice.toLocaleString()} | `
        analysis += `${market.stats.priceGrowth > 0 ? '+' : ''}${market.stats.priceGrowth}% | `
        analysis += `${market.stats.daysOnMarket} | ${market.stats.inventory} |\n`
      })
      
      analysis += `\n### Market Trends & Insights\n\n`
      
      // Seasonal patterns
      analysis += `**Seasonal Market Dynamics:**\n`
      const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' })
      const seasonalData = marketIntel.seasonalPatterns?.find((p: any) => p.month === currentMonth)
      
      if (seasonalData) {
        analysis += `- Current month (${currentMonth}) activity index: ${seasonalData.activityIndex}\n`
        analysis += `- Best for: ${seasonalData.bestFor.join(', ')}\n`
        analysis += `- Considerations: ${seasonalData.avoid.join(', ')}\n\n`
      }
      
      // Investment flows
      analysis += `**Capital Flow Analysis:**\n`
      marketIntel.investmentFlows?.forEach((flow: any) => {
        analysis += `- ${flow.source}: $${(flow.amount / 1000000).toFixed(0)}M targeting `
        analysis += `${flow.targetNeighborhoods.join(', ')} (${flow.trend})\n`
      })
    }
    
    return analysis
  }
  
  // Generate Financial Analysis
  private generateFinancialAnalysis(topic: string, data: Record<string, any>): string {
    const property = data.property
    const market = data.market?.microMarkets?.[0]
    
    let analysis = `## Financial Analysis & Projections\n\n`
    
    if (property?.askingPrice) {
      analysis += `### Acquisition Analysis\n`
      analysis += `- Asking Price: $${property.askingPrice.toLocaleString()}\n`
      analysis += `- Price per Square Foot: $${(property.askingPrice / (property.squareFeet || 1)).toFixed(2)}\n`
      analysis += `- Market Comparison: ${market ? `${((property.askingPrice / market.stats.medianPrice - 1) * 100).toFixed(1)}% vs median` : 'In line with market'}\n\n`
    }
    
    analysis += `### Investment Returns (Projected)\n`
    analysis += `**Year 1 Pro Forma:**\n`
    analysis += `- Gross Rental Income: $${((property?.askingPrice || 500000) * 0.06).toLocaleString()}\n`
    analysis += `- Operating Expenses: $${((property?.askingPrice || 500000) * 0.02).toLocaleString()}\n`
    analysis += `- Net Operating Income: $${((property?.askingPrice || 500000) * 0.04).toLocaleString()}\n`
    analysis += `- Cap Rate: 4.0%\n`
    analysis += `- Cash-on-Cash Return: 8.5%\n\n`
    
    analysis += `**5-Year Financial Projections:**\n`
    analysis += `- Average Annual Appreciation: ${market?.stats.priceGrowth || 3}%\n`
    analysis += `- Total Return (IRR): 12-15%\n`
    analysis += `- Exit Value: $${((property?.askingPrice || 500000) * 1.15).toLocaleString()}\n`
    
    return analysis
  }
  
  // Generate Risk Assessment
  private generateRiskAssessment(topic: string, data: Record<string, any>): string {
    const market = data.market?.microMarkets?.[0]
    const environmental = data.environmental?.floodZones?.[0]
    
    let assessment = `## Risk Assessment & Mitigation Strategies\n\n`
    
    assessment += `### Market Risks\n`
    if (market?.risks) {
      market.risks.forEach((risk: string) => {
        assessment += `- **${risk}**\n`
        assessment += `  - Mitigation: ${this.generateMitigation(risk)}\n`
      })
    }
    
    assessment += `\n### Environmental Risks\n`
    if (environmental) {
      assessment += `- **Flood Risk:** ${environmental.risk} (${environmental.zone} zone)\n`
      assessment += `  - Historical events: ${environmental.historicalEvents.length} major floods\n`
      assessment += `  - Mitigation strategies:\n`
      environmental.mitigationStrategies.forEach((strategy: string) => {
        assessment += `    - ${strategy}\n`
      })
    }
    
    assessment += `\n### Financial Risks\n`
    assessment += `- **Interest Rate Risk:** Rising rates may impact cap rates\n`
    assessment += `  - Mitigation: Lock in long-term financing, focus on value-add\n`
    assessment += `- **Liquidity Risk:** Real estate is illiquid asset\n`
    assessment += `  - Mitigation: Maintain adequate reserves, plan exit strategy\n`
    
    return assessment
  }
  
  // Generate Property Overview
  private generatePropertyOverview(topic: string, data: Record<string, any>): string {
    const property = data.property
    const photoAnalysis = data.photoAnalysis
    
    let overview = `## Property Overview\n\n`
    
    if (property) {
      overview += `### Property Details\n`
      overview += `- **Address:** ${property.address || topic}\n`
      overview += `- **Type:** ${property.propertyType || 'Residential'}\n`
      overview += `- **Size:** ${property.squareFeet?.toLocaleString() || 'TBD'} sq ft\n`
      overview += `- **Lot Size:** ${property.lotSize?.toLocaleString() || 'TBD'} sq ft\n`
      overview += `- **Year Built:** ${property.yearBuilt || 'TBD'}\n`
      overview += `- **Bedrooms/Bathrooms:** ${property.bedrooms || 'TBD'}/${property.bathrooms || 'TBD'}\n\n`
    }
    
    if (photoAnalysis?.length) {
      overview += `### Property Condition Analysis\n`
      const avgCondition = photoAnalysis.reduce((acc, p) => acc + p.condition.score, 0) / photoAnalysis.length
      overview += `- **Overall Condition Score:** ${avgCondition.toFixed(1)}/10\n`
      overview += `- **Key Features:**\n`
      
      const allFeatures = new Set<string>()
      photoAnalysis.forEach(analysis => {
        analysis.features.forEach(f => allFeatures.add(f.name))
      })
      
      Array.from(allFeatures).slice(0, 5).forEach(feature => {
        overview += `  - ${feature}\n`
      })
      
      overview += `- **Renovation Estimate:** $${photoAnalysis[0].renovationEstimate.minimum.toLocaleString()}-$${photoAnalysis[0].renovationEstimate.maximum.toLocaleString()}\n`
    }
    
    return overview
  }
  
  // Generate Development Concept
  private generateDevelopmentConcept(topic: string, data: Record<string, any>): string {
    const site = data.site || data.property
    const market = data.market?.microMarkets?.[0]
    const regulatory = data.regulatory
    
    let concept = `## Development Concept & Vision\n\n`
    
    concept += `### Highest and Best Use Analysis\n`
    concept += `Based on market conditions and site characteristics, the recommended development is:\n\n`
    
    if (market?.opportunities) {
      concept += `**Development Options:**\n`
      market.opportunities.forEach((opp: string) => {
        concept += `- ${opp}\n`
      })
    }
    
    concept += `\n### Conceptual Program\n`
    concept += `- **Residential Units:** 24-36 units (mix of 1BR/2BR)\n`
    concept += `- **Commercial Space:** 5,000 sq ft ground floor retail\n`
    concept += `- **Parking:** 1.5 spaces per unit + retail parking\n`
    concept += `- **Amenities:** Rooftop deck, fitness center, coworking space\n\n`
    
    concept += `### Development Timeline\n`
    concept += `1. **Pre-Development** (Months 1-6)\n`
    concept += `   - Site acquisition and due diligence\n`
    concept += `   - Conceptual design and community input\n`
    concept += `   - Entitlements and permitting\n\n`
    
    concept += `2. **Construction** (Months 7-18)\n`
    concept += `   - Site work and foundation\n`
    concept += `   - Vertical construction\n`
    concept += `   - Interior finishes and landscaping\n\n`
    
    concept += `3. **Lease-Up** (Months 19-24)\n`
    concept += `   - Marketing campaign launch\n`
    concept += `   - Progressive occupancy\n`
    concept += `   - Stabilization\n`
    
    return concept
  }
  
  // Generate generic section
  private generateGenericSection(
    sectionTitle: string,
    topic: string,
    data: Record<string, any>
  ): string {
    let content = `## ${sectionTitle}\n\n`
    
    // Search for relevant knowledge
    const relevantNodes = data.knowledge?.filter((node: KnowledgeNode) => 
      node.title.toLowerCase().includes(sectionTitle.toLowerCase()) ||
      node.content.toLowerCase().includes(sectionTitle.toLowerCase())
    )
    
    if (relevantNodes?.length) {
      relevantNodes.forEach((node: KnowledgeNode) => {
        content += `### ${node.title}\n`
        content += `${node.content.substring(0, 500)}...\n\n`
      })
    } else {
      content += `This section provides detailed analysis of ${sectionTitle.toLowerCase()} factors related to ${topic}.\n\n`
      content += `Key considerations include:\n`
      content += `- Market conditions and trends\n`
      content += `- Regulatory environment\n`
      content += `- Investment opportunities\n`
      content += `- Risk factors and mitigation\n`
    }
    
    return content
  }
  
  // Generate mitigation strategy
  private generateMitigation(risk: string): string {
    const mitigations: Record<string, string> = {
      'deed restrictions': 'Thorough title review and legal consultation before acquisition',
      'parking': 'Explore shared parking agreements or automated parking solutions',
      'gentrification': 'Implement community benefit agreements and affordable housing set-asides',
      'flooding': 'Elevate structures, install flood barriers, maintain adequate insurance',
      'market': 'Diversify property types and maintain conservative underwriting',
      'default': 'Comprehensive due diligence and risk assessment protocols'
    }
    
    const riskLower = risk.toLowerCase()
    for (const [key, mitigation] of Object.entries(mitigations)) {
      if (riskLower.includes(key)) {
        return mitigation
      }
    }
    
    return mitigations.default
  }
  
  // Generate visualizations
  private generateVisualizations(
    sectionTitle: string,
    data: Record<string, any>
  ): Array<any> {
    const visualizations = []
    
    if (sectionTitle === 'Market Analysis' && data.market) {
      visualizations.push({
        type: 'chart',
        data: {
          type: 'bar',
          title: 'Neighborhood Price Comparison',
          labels: data.market.microMarkets.map((m: any) => m.neighborhood),
          values: data.market.microMarkets.map((m: any) => m.stats.medianPrice)
        },
        caption: 'Median home prices across Houston neighborhoods'
      })
    }
    
    if (sectionTitle === 'Financial Analysis') {
      visualizations.push({
        type: 'chart',
        data: {
          type: 'line',
          title: '5-Year Cash Flow Projection',
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          values: [50000, 52500, 55125, 57881, 60775]
        },
        caption: 'Projected net operating income with 5% annual growth'
      })
    }
    
    return visualizations
  }
  
  // Generate subsections
  private generateSubsections(
    sectionTitle: string,
    data: Record<string, any>,
    config: ReportConfig
  ): ReportSection[] | undefined {
    if (config.style !== 'detailed') return undefined
    
    const subsections: ReportSection[] = []
    
    if (sectionTitle === 'Market Analysis' && data.market?.microMarkets) {
      data.market.microMarkets.forEach((market: any) => {
        subsections.push({
          title: `${market.neighborhood} Submarket`,
          content: this.generateMarketSummary(market),
          confidence: 0.9,
          sources: ['Houston Micro-Market Intelligence Report 2024']
        })
      })
    }
    
    return subsections.length > 0 ? subsections : undefined
  }
  
  // Helper methods
  
  private generateExecutiveSummary(sections: ReportSection[], reportType: string): string {
    const keyPoints: string[] = []
    
    sections.forEach(section => {
      if (section.title === 'Investment Thesis' || section.title === 'Recommendation') {
        const firstParagraph = section.content.split('\n\n')[0]
        if (firstParagraph) keyPoints.push(firstParagraph)
      }
    })
    
    return keyPoints.join('\n\n')
  }
  
  private calculateWordCount(sections: ReportSection[]): number {
    let count = 0
    sections.forEach(section => {
      count += section.content.split(/\s+/).length
      if (section.subsections) {
        count += this.calculateWordCount(section.subsections)
      }
    })
    return count
  }
  
  private calculateOverallConfidence(sections: ReportSection[]): number {
    const confidences = sections.map(s => s.confidence)
    return confidences.reduce((a, b) => a + b, 0) / confidences.length
  }
  
  private calculateSectionConfidence(data: Record<string, any>): number {
    let confidence = 0.7 // Base confidence
    
    if (data.knowledge?.length > 3) confidence += 0.1
    if (data.market) confidence += 0.1
    if (data.property) confidence += 0.05
    if (data.photoAnalysis) confidence += 0.05
    
    return Math.min(confidence, 0.95)
  }
  
  private extractKeyFindings(sections: ReportSection[]): string[] {
    const findings: string[] = []
    
    sections.forEach(section => {
      const bullets = section.content.match(/^- (.+)$/gm)
      if (bullets) {
        findings.push(...bullets.slice(0, 2).map(b => b.substring(2)))
      }
    })
    
    return findings.slice(0, 5)
  }
  
  private extractRecommendations(sections: ReportSection[]): string[] {
    const recommendations: string[] = []
    
    const recSection = sections.find(s => 
      s.title.toLowerCase().includes('recommendation') ||
      s.title.toLowerCase().includes('action')
    )
    
    if (recSection) {
      const bullets = recSection.content.match(/^[\d\-\*]\. (.+)$/gm)
      if (bullets) {
        recommendations.push(...bullets.map(b => b.replace(/^[\d\-\*]\. /, '')))
      }
    }
    
    return recommendations
  }
  
  private extractDataSources(sections: ReportSection[]): string[] {
    const sources = new Set<string>()
    
    sections.forEach(section => {
      section.sources.forEach(source => sources.add(source))
      if (section.subsections) {
        this.extractDataSources(section.subsections).forEach(s => sources.add(s))
      }
    })
    
    return Array.from(sources)
  }
  
  private extractSources(data: Record<string, any>): string[] {
    const sources: string[] = []
    
    if (data.knowledge) {
      data.knowledge.forEach((node: KnowledgeNode) => {
        sources.push(node.metadata.source)
      })
    }
    
    return [...new Set(sources)]
  }
  
  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  private generateTitle(topic: string, reportType: string): string {
    const titles: Record<string, string> = {
      'investment-memo': `Investment Memorandum: ${topic}`,
      'market-analysis': `Market Analysis Report: ${topic}`,
      'feasibility-study': `Feasibility Study: ${topic}`,
      'portfolio-review': `Portfolio Performance Review: ${topic}`,
      'development-proposal': `Development Proposal: ${topic}`
    }
    
    return titles[reportType] || `Report: ${topic}`
  }
  
  private generateMarketSummary(market: any): string {
    return `The ${market.neighborhood} submarket shows ${market.trends.priceTrend} price trends with ` +
           `${market.stats.priceGrowth > 0 ? '+' : ''}${market.stats.priceGrowth}% YoY growth. ` +
           `Current median price is $${market.stats.medianPrice.toLocaleString()} with ` +
           `${market.stats.daysOnMarket} average days on market. ` +
           `Development activity is ${market.trends.developmentActivity} with ` +
           `${market.trends.demandLevel} demand levels.`
  }
  
  // Format report for output
  formatReport(report: GeneratedReport, format: 'markdown' | 'html' | 'text'): string {
    if (format === 'markdown') {
      return this.formatMarkdown(report)
    } else if (format === 'html') {
      return this.formatHTML(report)
    } else {
      return this.formatText(report)
    }
  }
  
  private formatMarkdown(report: GeneratedReport): string {
    let output = `# ${report.title}\n\n`
    output += `*Generated: ${report.generatedAt.toLocaleDateString()}*\n\n`
    output += `---\n\n`
    
    report.sections.forEach(section => {
      output += this.formatSectionMarkdown(section, 1)
    })
    
    output += `\n---\n\n`
    output += `## Report Metadata\n\n`
    output += `- Word Count: ${report.metadata.wordCount.toLocaleString()}\n`
    output += `- Reading Time: ${report.metadata.readingTime} minutes\n`
    output += `- Confidence Score: ${(report.metadata.confidence * 100).toFixed(0)}%\n`
    output += `- Data Sources: ${report.metadata.dataSources.length}\n`
    
    return output
  }
  
  private formatSectionMarkdown(section: ReportSection, level: number): string {
    const headerPrefix = '#'.repeat(level + 1)
    let output = `${headerPrefix} ${section.title}\n\n`
    output += `${section.content}\n\n`
    
    if (section.visualizations?.length) {
      section.visualizations.forEach(viz => {
        output += `*[${viz.type.toUpperCase()}: ${viz.data.title}]*\n`
        output += `*${viz.caption}*\n\n`
      })
    }
    
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        output += this.formatSectionMarkdown(subsection, level + 1)
      })
    }
    
    return output
  }
  
  private formatHTML(report: GeneratedReport): string {
    // Basic HTML formatting
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>${report.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2c3e50; }
    h2 { color: #34495e; margin-top: 30px; }
    h3 { color: #7f8c8d; }
    .metadata { background: #ecf0f1; padding: 15px; border-radius: 5px; }
    .visualization { background: #f8f9fa; padding: 10px; margin: 10px 0; border-left: 3px solid #3498db; }
  </style>
</head>
<body>
  <h1>${report.title}</h1>
  <p><em>Generated: ${report.generatedAt.toLocaleDateString()}</em></p>
  <hr>
`
    
    report.sections.forEach(section => {
      html += this.formatSectionHTML(section)
    })
    
    html += `
  <hr>
  <div class="metadata">
    <h2>Report Metadata</h2>
    <ul>
      <li>Word Count: ${report.metadata.wordCount.toLocaleString()}</li>
      <li>Reading Time: ${report.metadata.readingTime} minutes</li>
      <li>Confidence Score: ${(report.metadata.confidence * 100).toFixed(0)}%</li>
    </ul>
  </div>
</body>
</html>`
    
    return html
  }
  
  private formatSectionHTML(section: ReportSection): string {
    let html = `<h2>${section.title}</h2>\n`
    
    // Convert markdown-style content to HTML
    const paragraphs = section.content.split('\n\n')
    paragraphs.forEach(para => {
      if (para.startsWith('- ')) {
        // Convert bullet points
        const items = para.split('\n').filter(line => line.startsWith('- '))
        html += '<ul>\n'
        items.forEach(item => {
          html += `  <li>${item.substring(2)}</li>\n`
        })
        html += '</ul>\n'
      } else {
        html += `<p>${para}</p>\n`
      }
    })
    
    if (section.visualizations?.length) {
      section.visualizations.forEach(viz => {
        html += `<div class="visualization">\n`
        html += `  <strong>${viz.type.toUpperCase()}: ${viz.data.title}</strong><br>\n`
        html += `  <em>${viz.caption}</em>\n`
        html += `</div>\n`
      })
    }
    
    return html
  }
  
  private formatText(report: GeneratedReport): string {
    let output = `${report.title}\n${'='.repeat(report.title.length)}\n\n`
    output += `Generated: ${report.generatedAt.toLocaleDateString()}\n\n`
    
    report.sections.forEach(section => {
      output += `${section.title}\n${'-'.repeat(section.title.length)}\n\n`
      output += `${section.content}\n\n`
    })
    
    return output
  }
}

// Template interface
interface ReportTemplate {
  sections: string[]
  requiredData: string[]
  style: string
}

export const reportGenerator = new ReportGenerator()
export default ReportGenerator