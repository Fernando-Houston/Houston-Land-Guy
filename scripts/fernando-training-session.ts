// Fernando-X Training Session Framework
// T2 asks questions, T3 provides data-driven answers using integrated Houston data

import { getIntegratedData } from '../lib/fernando-x-data'

interface TrainingQuestion {
  id: string
  question: string
  category: string
  expectedDataSources: string[]
  difficulty: 'basic' | 'intermediate' | 'advanced'
}

interface TrainingAnswer {
  question: string
  answer: string
  dataSources: string[]
  confidence: number
  contextUsed: string[]
  followUpSuggestions: string[]
}

class FernandoTrainingSession {
  private data: any
  private sessionId: string
  private trainingLog: TrainingAnswer[] = []

  constructor() {
    this.sessionId = `training-${Date.now()}`
  }

  async initialize() {
    console.log('🎓 Initializing Fernando-X Training Session')
    console.log(`Session ID: ${this.sessionId}`)
    this.data = await getIntegratedData()
    console.log(`📊 Loaded ${this.data.totalDataPoints} data points for training\n`)
  }

  async answerQuestion(question: string, category: string = 'general'): Promise<TrainingAnswer> {
    console.log(`❓ T2 Question: "${question}"`)
    console.log(`📁 Category: ${category}`)
    
    let answer = ""
    let dataSources: string[] = []
    let contextUsed: string[] = []
    let confidence = 85
    let followUpSuggestions: string[] = []

    // Analyze question and provide contextual answer using real data
    if (this.isRentalMarketQuestion(question)) {
      const response = this.generateRentalMarketAnswer(question)
      answer = response.answer
      dataSources = response.dataSources
      contextUsed = response.context
      confidence = response.confidence
      followUpSuggestions = response.followUps
    } 
    else if (this.isEmploymentQuestion(question)) {
      const response = this.generateEmploymentAnswer(question)
      answer = response.answer
      dataSources = response.dataSources
      contextUsed = response.context
      confidence = response.confidence
      followUpSuggestions = response.followUps
    }
    else if (this.isDevelopmentQuestion(question)) {
      const response = this.generateDevelopmentAnswer(question)
      answer = response.answer
      dataSources = response.dataSources
      contextUsed = response.context
      confidence = response.confidence
      followUpSuggestions = response.followUps
    }
    else if (this.isInvestmentQuestion(question)) {
      const response = this.generateInvestmentAnswer(question)
      answer = response.answer
      dataSources = response.dataSources
      contextUsed = response.context
      confidence = response.confidence
      followUpSuggestions = response.followUps
    }
    else if (this.isNeighborhoodQuestion(question)) {
      const response = this.generateNeighborhoodAnswer(question)
      answer = response.answer
      dataSources = response.dataSources
      contextUsed = response.context
      confidence = response.confidence
      followUpSuggestions = response.followUps
    }
    else {
      // General Houston market question
      const response = this.generateGeneralMarketAnswer(question)
      answer = response.answer
      dataSources = response.dataSources
      contextUsed = response.context
      confidence = response.confidence
      followUpSuggestions = response.followUps
    }

    const trainingAnswer: TrainingAnswer = {
      question,
      answer,
      dataSources,
      confidence,
      contextUsed,
      followUpSuggestions
    }

    this.trainingLog.push(trainingAnswer)
    
    console.log(`\n💬 T3 Answer:`)
    console.log(`${answer}`)
    console.log(`\n📊 Data Sources: ${dataSources.join(', ')}`)
    console.log(`🎯 Confidence: ${confidence}%`)
    console.log(`🔗 Context: ${contextUsed.join(', ')}`)
    console.log(`💡 Follow-ups: ${followUpSuggestions.join(' | ')}\n`)
    console.log('-'.repeat(80))

    return trainingAnswer
  }

  // Question type detection methods
  private isRentalMarketQuestion(question: string): boolean {
    const rentalKeywords = ['rent', 'rental', 'lease', 'tenant', 'occupancy', 'apartment']
    return rentalKeywords.some(keyword => question.toLowerCase().includes(keyword))
  }

  private isEmploymentQuestion(question: string): boolean {
    const employmentKeywords = ['employ', 'job', 'work', 'company', 'business', 'sector', 'industry']
    return employmentKeywords.some(keyword => question.toLowerCase().includes(keyword))
  }

  private isDevelopmentQuestion(question: string): boolean {
    const devKeywords = ['develop', 'project', 'construction', 'build', 'permit', 'pipeline']
    return devKeywords.some(keyword => question.toLowerCase().includes(keyword))
  }

  private isInvestmentQuestion(question: string): boolean {
    const investKeywords = ['invest', 'opportunity', 'ROI', 'return', 'profit', 'recommend', 'buy']
    return investKeywords.some(keyword => question.toLowerCase().includes(keyword))
  }

  private isNeighborhoodQuestion(question: string): boolean {
    const neighborhoodKeywords = ['neighborhood', 'area', 'district', 'location', 'where', 'Heights', 'Midtown', 'EaDo']
    return neighborhoodKeywords.some(keyword => question.toLowerCase().includes(keyword))
  }

  // Answer generation methods using real data
  private generateRentalMarketAnswer(question: string) {
    const rentalData = this.data.rentalMarketData
    const topAreas = rentalData.topRentalAreas || []
    const avgRent = rentalData.averageRent || 0
    
    let answer = `Based on our analysis of ${rentalData.totalRecords} rental market areas in Houston, `
    
    if (question.toLowerCase().includes('average') || question.toLowerCase().includes('typical')) {
      answer += `the average 2-bedroom rent is $${avgRent.toFixed(0)} per month. `
    }
    
    if (question.toLowerCase().includes('best') || question.toLowerCase().includes('top')) {
      if (topAreas.length > 0) {
        answer += `The top-performing rental areas include ${topAreas.slice(0, 3).map(a => a.neighborhood).join(', ')} with rents ranging from $${topAreas[0].avgRent2BR} to $${topAreas[2]?.avgRent2BR || 'varies'}. `
      }
    }
    
    answer += `Current occupancy rates across monitored areas show ${topAreas.length > 0 ? `${topAreas[0].occupancyRate}% average occupancy` : 'stable rental demand'}.`

    return {
      answer,
      dataSources: ['Houston Rental Market Analysis', 'Data Process 5'],
      context: [`${rentalData.totalRecords} rental areas`, `$${avgRent} avg rent`, `${topAreas.length} top areas`],
      confidence: 90,
      followUps: ['Which neighborhoods have the highest rental yields?', 'What are the rental trends by property type?', 'How do Houston rents compare to other Texas cities?']
    }
  }

  private generateEmploymentAnswer(question: string) {
    const employerData = this.data.majorEmployers
    const topEmployers = employerData.topEmployers || []
    const sectors = Object.keys(employerData.sectorBreakdown || {})
    
    let answer = `Houston's employment landscape features ${employerData.totalEmployers} major employers with a combined workforce of ${employerData.totalEmployees.toLocaleString()} employees. `
    
    if (question.toLowerCase().includes('largest') || question.toLowerCase().includes('major')) {
      if (topEmployers.length > 0) {
        answer += `The largest employers include ${topEmployers.slice(0, 3).map(e => `${e.companyName} (${e.sector})`).join(', ')}. `
      }
    }
    
    if (question.toLowerCase().includes('sector') || question.toLowerCase().includes('industry')) {
      answer += `The economy is diversified across ${sectors.length} major sectors including ${sectors.slice(0, 4).join(', ')}.`
    }
    
    answer += ` This employment diversity provides stability for real estate investments across residential and commercial sectors.`

    return {
      answer,
      dataSources: ['Major Employers Database', 'Employment Analytics'],
      context: [`${employerData.totalEmployers} employers`, `${employerData.totalEmployees.toLocaleString()} employees`, `${sectors.length} sectors`],
      confidence: 95,
      followUps: ['Which sectors are growing fastest?', 'What are the average salaries by industry?', 'How does employment affect residential demand?']
    }
  }

  private generateDevelopmentAnswer(question: string) {
    const projectData = this.data.majorProjects || []
    const developers = this.data.developers || []
    const construction = this.data.constructionData
    
    let answer = `Houston's development pipeline includes ${projectData.length} major projects valued at over $10 million each, with ${this.data.totalDevelopers} active developers. `
    
    if (question.toLowerCase().includes('active') || question.toLowerCase().includes('current')) {
      answer += `Currently, there are ${this.data.activeProjects} projects in active development and ${construction.total} construction permits issued. `
    }
    
    if (question.toLowerCase().includes('largest') || question.toLowerCase().includes('major')) {
      if (projectData.length > 0) {
        const topProject = projectData[0]
        answer += `The largest project is ${topProject.name} (${topProject.type}) valued at $${(topProject.value / 1000000).toFixed(1)}M in ${topProject.location}. `
      }
    }
    
    answer += `Total construction value represents $${(construction.totalEstimatedCost / 1000000000).toFixed(1)}B in estimated development activity.`

    return {
      answer,
      dataSources: ['Development Pipeline', 'Construction Activity', 'Permit Database'],
      context: [`${projectData.length} major projects`, `${this.data.totalDevelopers} developers`, `$${(construction.totalEstimatedCost / 1000000000).toFixed(1)}B value`],
      confidence: 88,
      followUps: ['Which neighborhoods have the most development?', 'What types of projects are most common?', 'When are these projects expected to complete?']
    }
  }

  private generateInvestmentAnswer(question: string) {
    const rental = this.data.rentalMarketData
    const employment = this.data.majorEmployers
    const projects = this.data.majorProjects
    const market = this.data.marketMetrics
    
    let answer = `For Houston real estate investment, our analysis of ${this.data.totalDataPoints} data points suggests `
    
    if (question.toLowerCase().includes('recommend') || question.toLowerCase().includes('best')) {
      answer += `strong opportunities based on: (1) Stable rental market with $${rental.averageRent.toFixed(0)} average rents, `
      answer += `(2) Diversified employment base of ${employment.totalEmployees.toLocaleString()} employees, `
      answer += `(3) Active development pipeline with ${projects.length} major projects. `
    }
    
    if (question.toLowerCase().includes('return') || question.toLowerCase().includes('ROI')) {
      answer += `Cap rates for multifamily investments typically range 5.5-6.5%, with rental yields varying by location. `
    }
    
    answer += `Key investment areas include neighborhoods near major employers and development corridors with strong rental demand.`

    return {
      answer,
      dataSources: ['Integrated Investment Analysis', 'Rental Market Data', 'Employment Statistics', 'Development Pipeline'],
      context: [`${this.data.totalDataPoints} data points`, `$${rental.averageRent} avg rent`, `${employment.totalEmployers} employers`, `${projects.length} projects`],
      confidence: 92,
      followUps: ['What are the best neighborhoods for rental properties?', 'How do I analyze a specific investment opportunity?', 'What are the risks to consider?']
    }
  }

  private generateNeighborhoodAnswer(question: string) {
    const neighborhoods = this.data.neighborhoodRankings || []
    const rental = this.data.rentalMarketData.topRentalAreas || []
    
    let answer = `Houston's neighborhood analysis across ${neighborhoods.length} areas shows varying investment potential. `
    
    if (question.toLowerCase().includes('best') || question.toLowerCase().includes('top')) {
      if (neighborhoods.length > 0) {
        const topNeighborhood = neighborhoods[0]
        answer += `${topNeighborhood.name} ranks highest with ${topNeighborhood.growthPotential} growth potential score, median price of $${topNeighborhood.medianPrice.toLocaleString()}. `
      }
    }
    
    if (question.toLowerCase().includes('rental') && rental.length > 0) {
      answer += `For rental properties, ${rental[0].neighborhood} leads with $${rental[0].avgRent2BR} average 2BR rent and ${rental[0].occupancyRate}% occupancy. `
    }
    
    answer += `Each neighborhood offers different advantages based on employment proximity, development activity, and rental demand patterns.`

    return {
      answer,
      dataSources: ['Neighborhood Rankings', 'HAR MLS Data', 'Rental Market Analysis'],
      context: [`${neighborhoods.length} neighborhoods analyzed`, 'Growth potential scoring', 'Rental performance metrics'],
      confidence: 85,
      followUps: ['What makes a neighborhood good for investment?', 'How do I compare different areas?', 'What are the up-and-coming neighborhoods?']
    }
  }

  private generateGeneralMarketAnswer(question: string) {
    const market = this.data.marketMetrics
    const overview = this.data
    
    let answer = `Houston's real estate market currently shows `
    
    if (market && market.medianHomePrice) {
      answer += `a median home price of $${market.medianHomePrice.toLocaleString()} with ${market.priceGrowthYoY}% year-over-year growth. `
      answer += `Properties typically sell in ${market.daysOnMarket} days with ${market.inventoryMonths} months of inventory. `
    }
    
    answer += `The market benefits from ${overview.totalDevelopers} active developers, ${overview.majorEmployers.totalEmployers} major employers, and ${overview.rentalMarketData.totalRecords} tracked rental areas. `
    answer += `This comprehensive data suggests a balanced market with good investment fundamentals.`

    return {
      answer,
      dataSources: ['Market Metrics', 'Comprehensive Database'],
      context: ['Current market conditions', 'Price trends', 'Market fundamentals'],
      confidence: 87,
      followUps: ['What are the market trends?', 'Is now a good time to invest?', 'How does Houston compare to other markets?']
    }
  }

  getTrainingStats() {
    const totalQuestions = this.trainingLog.length
    const avgConfidence = this.trainingLog.reduce((sum, log) => sum + log.confidence, 0) / totalQuestions
    const uniqueDataSources = [...new Set(this.trainingLog.flatMap(log => log.dataSources))].length
    
    return {
      sessionId: this.sessionId,
      totalQuestions,
      averageConfidence: avgConfidence.toFixed(1),
      uniqueDataSourcesUsed: uniqueDataSources,
      trainingLog: this.trainingLog
    }
  }

  exportTrainingData() {
    const stats = this.getTrainingStats()
    console.log('\n🎓 FERNANDO-X TRAINING SESSION COMPLETE')
    console.log('='.repeat(60))
    console.log(`📊 Session ID: ${stats.sessionId}`)
    console.log(`❓ Total Questions: ${stats.totalQuestions}`)
    console.log(`🎯 Average Confidence: ${stats.averageConfidence}%`)
    console.log(`📚 Data Sources Used: ${stats.uniqueDataSourcesUsed}`)
    console.log('='.repeat(60))
    
    return stats
  }
}

// Export for use in training sessions
export { FernandoTrainingSession }