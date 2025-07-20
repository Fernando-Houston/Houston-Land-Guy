import { fernandoXAI } from './ai-service'
import { leadScoring } from './lead-scoring'
import { houstonDataService, MajorProject } from './houston-data-service'

export interface Deal {
  id: string
  userId: string
  status: 'lead' | 'qualified' | 'negotiating' | 'under_contract' | 'due_diligence' | 'closing' | 'closed' | 'dead'
  stage: number // 1-7 corresponding to status
  score: number // AI-calculated priority score
  property: {
    id?: string
    address: string
    price: number
    type: string
    sqft?: number
    yearBuilt?: number
    description?: string
  }
  client: {
    id: string
    name: string
    email: string
    phone?: string
    type: 'buyer' | 'seller' | 'investor'
    prequalified?: boolean
    budget?: number
  }
  timeline: {
    created: Date
    lastActivity: Date
    expectedClose?: Date
    stageHistory: Array<{
      stage: string
      enteredAt: Date
      duration?: number
    }>
  }
  financials: {
    listPrice?: number
    offerPrice?: number
    negotiatedPrice?: number
    finalPrice?: number
    commission?: number
    commissionSplit?: {
      listing: number
      buying: number
      referral?: number
    }
    expenses?: Array<{
      type: string
      amount: number
      description?: string
    }>
  }
  tasks: Array<{
    id: string
    title: string
    completed: boolean
    dueDate?: Date
    assignedTo?: string
  }>
  documents: Array<{
    id: string
    type: string
    name: string
    url: string
    uploadedAt: Date
    signedAt?: Date
  }>
  communications: Array<{
    id: string
    type: 'email' | 'call' | 'text' | 'meeting' | 'note'
    subject?: string
    content: string
    direction: 'inbound' | 'outbound'
    timestamp: Date
  }>
  aiInsights: {
    winProbability: number
    riskFactors: string[]
    recommendations: string[]
    nextBestAction: string
    dealScore: number
  }
}

export interface DealMetrics {
  totalDeals: number
  closedDeals: number
  totalVolume: number
  averageDealSize: number
  averageTimeToClose: number
  conversionRate: number
  pipeline: {
    count: number
    value: number
    byStage: Record<string, { count: number; value: number }>
  }
}

export interface DealTemplate {
  id: string
  name: string
  type: 'residential' | 'commercial' | 'land' | 'investment'
  stages: Array<{
    name: string
    order: number
    tasks: string[]
    documents: string[]
    duration: number // estimated days
  }>
}

class DealFlowService {
  private deals: Map<string, Deal[]> = new Map()
  private templates: Map<string, DealTemplate> = new Map()
  
  constructor() {
    this.initializeTemplates()
    this.loadHoustonProjects()
  }
  
  // Deal Management
  async createDeal(
    userId: string,
    dealData: Partial<Deal>,
    templateId?: string
  ): Promise<Deal> {
    const dealId = `deal-${Date.now()}`
    const template = templateId ? this.templates.get(templateId) : null
    
    // AI scoring
    const aiScore = await this.calculateDealScore(dealData)
    const aiInsights = await this.generateDealInsights(dealData)
    
    const deal: Deal = {
      id: dealId,
      userId,
      status: 'lead',
      stage: 1,
      score: aiScore,
      property: dealData.property || {} as any,
      client: dealData.client || {} as any,
      timeline: {
        created: new Date(),
        lastActivity: new Date(),
        stageHistory: [{
          stage: 'lead',
          enteredAt: new Date()
        }]
      },
      financials: dealData.financials || {},
      tasks: template ? this.generateTasksFromTemplate(template, 'lead') : [],
      documents: [],
      communications: [],
      aiInsights
    }
    
    // Store deal
    const userDeals = this.deals.get(userId) || []
    userDeals.push(deal)
    this.deals.set(userId, userDeals)
    
    return deal
  }
  
  async createDealFromHoustonProject(
    userId: string,
    project: MajorProject,
    clientInfo?: Partial<Deal['client']>
  ): Promise<Deal> {
    // Determine template based on project type
    const templateId = project.type.toLowerCase().includes('commercial') ? 'commercial' : 
                      project.type.toLowerCase().includes('residential') ? 'residential' : 
                      'commercial' // Default to commercial for mixed-use and other types
    
    // Create deal data from Houston project
    const dealData: Partial<Deal> = {
      property: {
        address: project.location,
        price: project.investmentAmount,
        type: project.type,
        sqft: project.sqft,
        description: project.description
      },
      client: clientInfo || {
        id: `client-${project.developer.replace(/\s+/g, '-').toLowerCase()}`,
        name: project.developer,
        type: 'investor',
        budget: project.investmentAmount
      },
      financials: {
        listPrice: project.investmentAmount,
        commission: project.investmentAmount * 0.025 // 2.5% for commercial
      },
      timeline: {
        expectedClose: new Date(project.expectedCompletion.replace(' Q', ' Q').replace('Q1', '03-31').replace('Q2', '06-30').replace('Q3', '09-30').replace('Q4', '12-31'))
      }
    }
    
    const deal = await this.createDeal(userId, dealData, templateId)
    
    // Update deal with Houston-specific insights
    const houstonInsights = {
      ...deal.aiInsights,
      recommendations: [
        ...deal.aiInsights.recommendations,
        `Track ${project.name} development progress`,
        `Monitor ${project.location} area development activity`,
        project.status === 'planning' ? 'Engage early in planning phase' : 
        project.status === 'approved' ? 'Prepare for construction phase opportunities' :
        'Identify subcontracting and partnership opportunities'
      ]
    }
    
    await this.updateDeal(userId, deal.id, { aiInsights: houstonInsights })
    
    return deal
  }
  
  async updateDeal(
    userId: string,
    dealId: string,
    updates: Partial<Deal>
  ): Promise<Deal> {
    const userDeals = this.deals.get(userId) || []
    const dealIndex = userDeals.findIndex(d => d.id === dealId)
    
    if (dealIndex === -1) {
      throw new Error('Deal not found')
    }
    
    const deal = userDeals[dealIndex]
    const updatedDeal = { ...deal, ...updates }
    
    // Track stage changes
    if (updates.status && updates.status !== deal.status) {
      const previousStage = deal.timeline.stageHistory[deal.timeline.stageHistory.length - 1]
      previousStage.duration = Date.now() - previousStage.enteredAt.getTime()
      
      updatedDeal.timeline.stageHistory.push({
        stage: updates.status,
        enteredAt: new Date()
      })
      
      // Generate new tasks for the stage
      const template = this.findTemplateForDeal(deal)
      if (template) {
        const newTasks = this.generateTasksFromTemplate(template, updates.status)
        updatedDeal.tasks.push(...newTasks)
      }
    }
    
    // Update activity timestamp
    updatedDeal.timeline.lastActivity = new Date()
    
    // Recalculate AI insights
    updatedDeal.aiInsights = await this.generateDealInsights(updatedDeal)
    updatedDeal.score = await this.calculateDealScore(updatedDeal)
    
    userDeals[dealIndex] = updatedDeal
    this.deals.set(userId, userDeals)
    
    return updatedDeal
  }
  
  async moveToStage(
    userId: string,
    dealId: string,
    newStatus: Deal['status']
  ): Promise<Deal> {
    return this.updateDeal(userId, dealId, {
      status: newStatus,
      stage: this.getStageNumber(newStatus)
    })
  }
  
  async addCommunication(
    userId: string,
    dealId: string,
    communication: Omit<Deal['communications'][0], 'id' | 'timestamp'>
  ): Promise<void> {
    const deal = await this.getDeal(userId, dealId)
    if (!deal) throw new Error('Deal not found')
    
    deal.communications.push({
      ...communication,
      id: `comm-${Date.now()}`,
      timestamp: new Date()
    })
    
    await this.updateDeal(userId, dealId, { communications: deal.communications })
  }
  
  async addDocument(
    userId: string,
    dealId: string,
    document: Omit<Deal['documents'][0], 'id' | 'uploadedAt'>
  ): Promise<void> {
    const deal = await this.getDeal(userId, dealId)
    if (!deal) throw new Error('Deal not found')
    
    deal.documents.push({
      ...document,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date()
    })
    
    await this.updateDeal(userId, dealId, { documents: deal.documents })
  }
  
  async completeTask(
    userId: string,
    dealId: string,
    taskId: string
  ): Promise<void> {
    const deal = await this.getDeal(userId, dealId)
    if (!deal) throw new Error('Deal not found')
    
    const task = deal.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = true
    }
    
    await this.updateDeal(userId, dealId, { tasks: deal.tasks })
  }
  
  // Deal Retrieval
  async getDeal(userId: string, dealId: string): Promise<Deal | null> {
    const userDeals = this.deals.get(userId) || []
    return userDeals.find(d => d.id === dealId) || null
  }
  
  async getDeals(
    userId: string,
    filters?: {
      status?: Deal['status'][]
      minScore?: number
      clientType?: 'buyer' | 'seller' | 'investor'
      dateRange?: { start: Date; end: Date }
    }
  ): Promise<Deal[]> {
    let deals = this.deals.get(userId) || []
    
    if (filters?.status) {
      deals = deals.filter(d => filters.status!.includes(d.status))
    }
    
    if (filters?.minScore) {
      deals = deals.filter(d => d.score >= filters.minScore!)
    }
    
    if (filters?.clientType) {
      deals = deals.filter(d => d.client.type === filters.clientType)
    }
    
    if (filters?.dateRange) {
      deals = deals.filter(d => 
        d.timeline.created >= filters.dateRange!.start &&
        d.timeline.created <= filters.dateRange!.end
      )
    }
    
    // Sort by score and last activity
    deals.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      return b.timeline.lastActivity.getTime() - a.timeline.lastActivity.getTime()
    })
    
    return deals
  }
  
  // Analytics
  async getDealMetrics(userId: string, period?: 'month' | 'quarter' | 'year'): Promise<DealMetrics> {
    const deals = this.deals.get(userId) || []
    const now = new Date()
    const periodStart = this.getPeriodStart(now, period || 'month')
    
    const periodDeals = deals.filter(d => d.timeline.created >= periodStart)
    const closedDeals = periodDeals.filter(d => d.status === 'closed')
    
    const totalVolume = closedDeals.reduce((sum, d) => sum + (d.financials.finalPrice || 0), 0)
    
    // Calculate pipeline by stage
    const pipeline = {
      count: 0,
      value: 0,
      byStage: {} as Record<string, { count: number; value: number }>
    }
    
    periodDeals.forEach(deal => {
      if (deal.status !== 'closed' && deal.status !== 'dead') {
        pipeline.count++
        pipeline.value += deal.property.price || 0
        
        if (!pipeline.byStage[deal.status]) {
          pipeline.byStage[deal.status] = { count: 0, value: 0 }
        }
        pipeline.byStage[deal.status].count++
        pipeline.byStage[deal.status].value += deal.property.price || 0
      }
    })
    
    // Calculate average time to close
    const closedWithTime = closedDeals.filter(d => d.timeline.expectedClose)
    const avgTimeToClose = closedWithTime.length > 0
      ? closedWithTime.reduce((sum, d) => {
          const duration = d.timeline.expectedClose!.getTime() - d.timeline.created.getTime()
          return sum + duration / (1000 * 60 * 60 * 24) // Convert to days
        }, 0) / closedWithTime.length
      : 0
    
    return {
      totalDeals: periodDeals.length,
      closedDeals: closedDeals.length,
      totalVolume,
      averageDealSize: closedDeals.length > 0 ? totalVolume / closedDeals.length : 0,
      averageTimeToClose: avgTimeToClose,
      conversionRate: periodDeals.length > 0 ? closedDeals.length / periodDeals.length : 0,
      pipeline
    }
  }
  
  async getForecast(userId: string, months: number = 3): Promise<{
    expectedRevenue: number
    expectedDeals: number
    confidence: number
    breakdown: Array<{
      month: string
      revenue: number
      deals: number
    }>
  }> {
    const deals = await this.getDeals(userId, {
      status: ['qualified', 'negotiating', 'under_contract', 'due_diligence', 'closing']
    })
    
    const forecast = {
      expectedRevenue: 0,
      expectedDeals: 0,
      confidence: 0,
      breakdown: [] as any[]
    }
    
    // Calculate expected revenue based on win probability
    deals.forEach(deal => {
      const expectedValue = (deal.property.price || 0) * 
        (deal.financials.commission || 0.03) * 
        (deal.aiInsights.winProbability / 100)
      
      forecast.expectedRevenue += expectedValue
      forecast.expectedDeals += deal.aiInsights.winProbability / 100
    })
    
    // Generate monthly breakdown
    const monthlyRevenue = forecast.expectedRevenue / months
    const monthlyDeals = forecast.expectedDeals / months
    
    for (let i = 0; i < months; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() + i)
      
      forecast.breakdown.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthlyRevenue * (0.8 + Math.random() * 0.4), // Add some variance
        deals: Math.round(monthlyDeals * (0.8 + Math.random() * 0.4))
      })
    }
    
    forecast.confidence = Math.min(95, 60 + deals.length * 2)
    
    return forecast
  }
  
  // AI Features
  private async calculateDealScore(deal: Partial<Deal>): Promise<number> {
    let score = 50 // Base score
    
    // Property factors
    if (deal.property?.price) {
      score += Math.min(20, deal.property.price / 100000) // Higher value = higher score
    }
    
    // Client factors
    if (deal.client?.prequalified) score += 15
    if (deal.client?.type === 'buyer' && deal.client.budget) score += 10
    
    // Timeline factors
    if (deal.timeline?.expectedClose) {
      const daysToClose = (deal.timeline.expectedClose.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      if (daysToClose < 30) score += 20
      else if (daysToClose < 60) score += 10
    }
    
    // Activity factors
    if (deal.communications && deal.communications.length > 5) score += 10
    if (deal.documents && deal.documents.length > 0) score += 15
    
    return Math.min(100, Math.round(score))
  }
  
  private async generateDealInsights(deal: Partial<Deal>): Promise<Deal['aiInsights']> {
    // Calculate win probability based on various factors
    let winProbability = 50
    
    if (deal.status === 'under_contract') winProbability = 85
    else if (deal.status === 'negotiating') winProbability = 65
    else if (deal.status === 'qualified') winProbability = 40
    
    if (deal.client?.prequalified) winProbability += 10
    if (deal.documents && deal.documents.length > 2) winProbability += 10
    
    // Check if it's a known Houston developer
    const topDevelopers = ['Hines', 'Midway', 'Howard Hughes', 'Jacob Companies', 'MetroNational']
    if (deal.client?.name && topDevelopers.some(dev => deal.client!.name.includes(dev))) {
      winProbability += 15
    }
    
    // Identify risk factors
    const riskFactors: string[] = []
    if (!deal.client?.prequalified) {
      riskFactors.push('Client not pre-qualified')
    }
    if (deal.timeline?.lastActivity) {
      const daysSinceActivity = (Date.now() - deal.timeline.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceActivity > 7) {
        riskFactors.push('No recent activity')
      }
    }
    if (deal.property?.price && deal.client?.budget && deal.property.price > deal.client.budget) {
      riskFactors.push('Property exceeds client budget')
    }
    
    // Houston-specific risk factors
    if (deal.property?.address) {
      const addressLower = deal.property.address.toLowerCase()
      if (addressLower.includes('energy corridor')) {
        riskFactors.push('Energy Corridor has 22.5% vacancy rate')
      }
      if (addressLower.includes('flood') || addressLower.includes('bayou')) {
        riskFactors.push('Property may be in flood-prone area')
      }
    }
    
    // Generate recommendations with Houston context
    const recommendations: string[] = []
    if (!deal.client?.prequalified) {
      recommendations.push('Get client pre-qualified with Houston-area lender')
    }
    if (deal.status === 'lead') {
      recommendations.push('Schedule property showing')
    }
    if (deal.status === 'qualified') {
      recommendations.push('Prepare CMA with Houston market comps')
    }
    
    // Add Houston-specific recommendations
    if (deal.property?.type === 'commercial') {
      recommendations.push('Review Houston commercial submarket data')
      recommendations.push('Check City of Houston permit requirements')
    }
    if (deal.property?.price && deal.property.price > 10000000) {
      recommendations.push('Connect with Houston economic development office')
    }
    if (deal.property?.address?.toLowerCase().includes('medical center')) {
      recommendations.push('Consider TMC expansion impact on property value')
    }
    
    // Determine next best action
    const nextBestAction = recommendations[0] || 'Follow up with client'
    
    return {
      winProbability: Math.min(95, winProbability),
      riskFactors,
      recommendations: recommendations.slice(0, 5), // Limit to top 5
      nextBestAction,
      dealScore: await this.calculateDealScore(deal)
    }
  }
  
  // Template Management
  private initializeTemplates() {
    // Residential template
    this.templates.set('residential', {
      id: 'residential',
      name: 'Residential Sale',
      type: 'residential',
      stages: [
        {
          name: 'lead',
          order: 1,
          tasks: ['Initial contact', 'Gather requirements', 'Schedule showing', 'Review Houston neighborhoods'],
          documents: [],
          duration: 3
        },
        {
          name: 'qualified',
          order: 2,
          tasks: ['Pre-qualification check', 'Property tour', 'Answer questions', 'Houston ISD school ratings', 'Neighborhood market analysis'],
          documents: ['Pre-qualification letter'],
          duration: 7
        },
        {
          name: 'negotiating',
          order: 3,
          tasks: ['Prepare offer', 'Submit offer', 'Negotiate terms', 'Review HCAD valuation'],
          documents: ['Purchase agreement', 'Earnest money receipt'],
          duration: 5
        },
        {
          name: 'under_contract',
          order: 4,
          tasks: ['Order inspections', 'Review inspection reports', 'Negotiate repairs', 'Houston flood history check', 'Foundation inspection (Houston clay soil)'],
          documents: ['Executed contract', 'Inspection reports', 'WDI report'],
          duration: 10
        },
        {
          name: 'closing',
          order: 5,
          tasks: ['Final walkthrough', 'Review closing documents', 'Coordinate closing', 'Harris County deed prep'],
          documents: ['Closing disclosure', 'Title commitment', 'Survey'],
          duration: 3
        }
      ]
    })
    
    // Commercial template
    this.templates.set('commercial', {
      id: 'commercial',
      name: 'Commercial Sale',
      type: 'commercial',
      stages: [
        {
          name: 'lead',
          order: 1,
          tasks: ['Initial contact', 'NDA execution', 'Gather investment criteria', 'Review Houston market data'],
          documents: ['NDA'],
          duration: 5
        },
        {
          name: 'qualified',
          order: 2,
          tasks: ['Financial verification', 'Property tour', 'Review financials', 'Houston submarket analysis', 'Check City of Houston permits'],
          documents: ['Proof of funds', 'Financial statements', 'Houston market report'],
          duration: 14
        },
        {
          name: 'negotiating',
          order: 3,
          tasks: ['LOI preparation', 'LOI negotiation', 'Purchase agreement', 'Review HCAD tax assessment'],
          documents: ['LOI', 'Purchase agreement', 'HCAD report'],
          duration: 14
        },
        {
          name: 'due_diligence',
          order: 4,
          tasks: ['Environmental assessment', 'Property condition', 'Title review', 'Lease audit', 'Houston flood zone check', 'TxDOT traffic study'],
          documents: ['Phase I ESA', 'Property condition report', 'Title report', 'Flood zone certificate'],
          duration: 30
        },
        {
          name: 'closing',
          order: 5,
          tasks: ['Final negotiations', 'Closing preparation', 'Fund coordination', 'Houston deed recording'],
          documents: ['Closing statement', 'Deed', 'Title policy', 'Harris County filing'],
          duration: 7
        }
      ]
    })
  }
  
  private generateTasksFromTemplate(
    template: DealTemplate,
    stage: string
  ): Deal['tasks'] {
    const stageConfig = template.stages.find(s => s.name === stage)
    if (!stageConfig) return []
    
    return stageConfig.tasks.map((task, index) => ({
      id: `task-${Date.now()}-${index}`,
      title: task,
      completed: false,
      dueDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000) // Stagger due dates
    }))
  }
  
  private findTemplateForDeal(deal: Deal): DealTemplate | null {
    // Find template based on property type
    if (deal.property.type === 'commercial') {
      return this.templates.get('commercial') || null
    }
    return this.templates.get('residential') || null
  }
  
  private getStageNumber(status: Deal['status']): number {
    const stageMap: Record<Deal['status'], number> = {
      'lead': 1,
      'qualified': 2,
      'negotiating': 3,
      'under_contract': 4,
      'due_diligence': 5,
      'closing': 6,
      'closed': 7,
      'dead': 0
    }
    return stageMap[status] || 1
  }
  
  private getPeriodStart(date: Date, period: 'month' | 'quarter' | 'year'): Date {
    const start = new Date(date)
    switch (period) {
      case 'month':
        start.setMonth(start.getMonth() - 1)
        break
      case 'quarter':
        start.setMonth(start.getMonth() - 3)
        break
      case 'year':
        start.setFullYear(start.getFullYear() - 1)
        break
    }
    return start
  }
  
  private async loadHoustonProjects() {
    try {
      // Load some Houston projects as sample deals
      const projects = await houstonDataService.getMajorProjects({ status: 'under_construction' })
      const demoUserId = 'demo-user'
      
      // Create sample deals from top 3 Houston projects
      for (const project of projects.slice(0, 3)) {
        await this.createDealFromHoustonProject(demoUserId, project, {
          id: `demo-client-${project.developer.replace(/\s+/g, '-').toLowerCase()}`,
          name: project.developer,
          email: `contact@${project.developer.replace(/\s+/g, '').toLowerCase()}.com`,
          type: 'investor',
          prequalified: true,
          budget: project.investmentAmount
        })
      }
    } catch (error) {
      console.error('Error loading Houston projects:', error)
    }
  }
}

export const dealFlow = new DealFlowService()
export default DealFlowService