import { fernandoXAI } from './ai-service'
import { marketIntelligence } from './market-intelligence'
import { realEstateAPI } from './real-estate-api'
import { houstonDataService } from './houston-data-service'

export interface Alert {
  id: string
  userId: string
  type: 'price_drop' | 'new_listing' | 'permit_filed' | 'market_trend' | 'inventory_change' | 'investment_opportunity'
  title: string
  message: string
  severity: 'info' | 'warning' | 'urgent'
  data: Record<string, any>
  read: boolean
  createdAt: Date
  expiresAt?: Date
}

export interface AlertPreference {
  userId: string
  alertTypes: {
    priceDrops: boolean
    newListings: boolean
    permitFilings: boolean
    marketTrends: boolean
    inventoryChanges: boolean
    investmentOpportunities: boolean
  }
  channels: {
    email: boolean
    push: boolean
    sms: boolean
    inApp: boolean
  }
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly'
  quietHours: {
    enabled: boolean
    start: string // "22:00"
    end: string // "08:00"
  }
  watchedAreas: string[]
  priceRanges: {
    min?: number
    max?: number
  }
  propertyTypes: string[]
}

export interface WatchedArea {
  id: string
  userId: string
  name: string
  type: 'zipcode' | 'neighborhood' | 'city' | 'polygon'
  boundaries: string | { lat: number; lng: number }[]
  criteria: {
    propertyTypes?: string[]
    priceRange?: { min?: number; max?: number }
    lotSizeMin?: number
    yearBuiltAfter?: number
    keywords?: string[]
  }
  alerts: {
    priceDropPercent?: number
    daysOnMarketMax?: number
    inventoryChangePercent?: number
  }
  active: boolean
  createdAt: Date
}

class MarketAlertsService {
  private alerts: Map<string, Alert[]> = new Map()
  private preferences: Map<string, AlertPreference> = new Map()
  private watchedAreas: Map<string, WatchedArea[]> = new Map()
  private subscribers: Map<string, (alert: Alert) => void> = new Map()
  
  // Alert Preferences
  async setAlertPreferences(userId: string, preferences: Partial<AlertPreference>): Promise<void> {
    const existing = this.preferences.get(userId) || this.getDefaultPreferences(userId)
    this.preferences.set(userId, { ...existing, ...preferences })
  }
  
  async getAlertPreferences(userId: string): Promise<AlertPreference> {
    return this.preferences.get(userId) || this.getDefaultPreferences(userId)
  }
  
  // Watched Areas
  async addWatchedArea(userId: string, area: Omit<WatchedArea, 'id' | 'userId' | 'createdAt'>): Promise<WatchedArea> {
    const watchedArea: WatchedArea = {
      id: `area-${Date.now()}`,
      userId,
      ...area,
      createdAt: new Date()
    }
    
    const userAreas = this.watchedAreas.get(userId) || []
    userAreas.push(watchedArea)
    this.watchedAreas.set(userId, userAreas)
    
    // Start monitoring this area
    this.startAreaMonitoring(watchedArea)
    
    return watchedArea
  }
  
  async removeWatchedArea(userId: string, areaId: string): Promise<void> {
    const userAreas = this.watchedAreas.get(userId) || []
    const filtered = userAreas.filter(area => area.id !== areaId)
    this.watchedAreas.set(userId, filtered)
  }
  
  async getWatchedAreas(userId: string): Promise<WatchedArea[]> {
    return this.watchedAreas.get(userId) || []
  }
  
  // Alert Generation
  async generatePriceDropAlert(
    userId: string,
    property: any,
    previousPrice: number,
    currentPrice: number
  ): Promise<Alert> {
    const dropPercent = ((previousPrice - currentPrice) / previousPrice) * 100
    
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      userId,
      type: 'price_drop',
      title: `Price Drop Alert: ${property.address}`,
      message: `Price reduced by ${dropPercent.toFixed(1)}% from $${previousPrice.toLocaleString()} to $${currentPrice.toLocaleString()}`,
      severity: dropPercent > 10 ? 'urgent' : 'info',
      data: {
        propertyId: property.id,
        address: property.address,
        previousPrice,
        currentPrice,
        dropPercent,
        daysOnMarket: property.daysOnMarket
      },
      read: false,
      createdAt: new Date()
    }
    
    await this.sendAlert(alert)
    return alert
  }
  
  async generateNewListingAlert(userId: string, property: any, matchedCriteria: string[]): Promise<Alert> {
    const aiAnalysis = await fernandoXAI.analyzeProperty(property.id, 'investment')
    
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      userId,
      type: 'new_listing',
      title: `New Listing: ${property.address}`,
      message: `New property matching your criteria: ${matchedCriteria.join(', ')}. AI Grade: ${aiAnalysis.investmentGrade}`,
      severity: aiAnalysis.investmentGrade === 'A' ? 'urgent' : 'info',
      data: {
        propertyId: property.id,
        address: property.address,
        price: property.price,
        matchedCriteria,
        aiInsights: {
          grade: aiAnalysis.investmentGrade,
          roiProjection: aiAnalysis.roiProjections.oneYear
        }
      },
      read: false,
      createdAt: new Date()
    }
    
    await this.sendAlert(alert)
    return alert
  }
  
  async generatePermitAlert(userId: string, permit: any, nearbyProperty?: any): Promise<Alert> {
    const impactAnalysis = await this.analyzePermitImpact(permit, nearbyProperty)
    
    // Format value for Houston locals
    const formattedValue = permit.value >= 1000000 
      ? `$${(permit.value / 1000000).toFixed(1)}M`
      : `$${(permit.value / 1000).toFixed(0)}K`
    
    // Determine severity based on Houston market context
    const severity: Alert['severity'] = 
      permit.value >= 100000000 ? 'urgent' :  // $100M+ projects
      permit.value >= 10000000 ? 'warning' :   // $10M+ projects
      'info'
    
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      userId,
      type: 'permit_filed',
      title: `New ${permit.type} Permit: ${formattedValue}`,
      message: `${permit.developer || 'Developer'} filed permit at ${permit.address}. ${impactAnalysis.summary}`,
      severity,
      data: {
        permitNumber: permit.permitNumber,
        permitType: permit.type,
        address: permit.address,
        value: permit.value,
        formattedValue,
        developer: permit.developer,
        sqft: permit.sqft,
        status: permit.status,
        filedDate: permit.filedDate,
        approvedDate: permit.approvedDate,
        impact: impactAnalysis
      },
      read: false,
      createdAt: new Date()
    }
    
    await this.sendAlert(alert)
    return alert
  }
  
  async generateMarketTrendAlert(
    userId: string,
    area: string,
    trendType: 'appreciation' | 'inventory' | 'demand',
    data: any
  ): Promise<Alert> {
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      userId,
      type: 'market_trend',
      title: `Market Trend Alert: ${area}`,
      message: this.getTrendMessage(trendType, data),
      severity: this.getTrendSeverity(trendType, data),
      data: {
        area,
        trendType,
        ...data
      },
      read: false,
      createdAt: new Date()
    }
    
    await this.sendAlert(alert)
    return alert
  }
  
  async generateMajorProjectAlert(userId: string, project: any): Promise<Alert> {
    // Format investment amount
    const formattedInvestment = project.investmentAmount >= 1000000000 
      ? `$${(project.investmentAmount / 1000000000).toFixed(2)}B`
      : `$${(project.investmentAmount / 1000000).toFixed(0)}M`
    
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      userId,
      type: 'investment_opportunity',
      title: `Major Project: ${project.name}`,
      message: `${project.developer} announces ${formattedInvestment} ${project.type} project in ${project.location}. Expected completion: ${project.expectedCompletion}`,
      severity: project.investmentAmount >= 1000000000 ? 'urgent' : 'info',
      data: {
        projectName: project.name,
        type: project.type,
        location: project.location,
        investmentAmount: project.investmentAmount,
        formattedInvestment,
        developer: project.developer,
        expectedCompletion: project.expectedCompletion,
        status: project.status,
        sqft: project.sqft,
        units: project.units,
        description: project.description
      },
      read: false,
      createdAt: new Date()
    }
    
    await this.sendAlert(alert)
    return alert
  }
  
  // Alert Delivery
  private async sendAlert(alert: Alert): Promise<void> {
    // Store alert
    const userAlerts = this.alerts.get(alert.userId) || []
    userAlerts.unshift(alert)
    this.alerts.set(alert.userId, userAlerts)
    
    // Get user preferences
    const prefs = await this.getAlertPreferences(alert.userId)
    
    // Check quiet hours
    if (prefs.quietHours.enabled && this.isQuietHours(prefs.quietHours)) {
      // Queue for later delivery
      return
    }
    
    // Deliver through enabled channels
    if (prefs.channels.push) {
      await this.sendPushNotification(alert)
    }
    
    if (prefs.channels.email && (prefs.frequency === 'instant' || alert.severity === 'urgent')) {
      await this.sendEmailAlert(alert)
    }
    
    if (prefs.channels.sms && alert.severity === 'urgent') {
      await this.sendSMSAlert(alert)
    }
    
    // Notify in-app subscribers
    const subscriber = this.subscribers.get(alert.userId)
    if (subscriber) {
      subscriber(alert)
    }
  }
  
  // Monitoring
  private async startAreaMonitoring(area: WatchedArea): Promise<void> {
    // In production, this would be a scheduled job
    setInterval(async () => {
      if (!area.active) return
      
      try {
        // Check for new listings
        const newListings = await this.checkNewListings(area)
        for (const listing of newListings) {
          if (this.matchesCriteria(listing, area.criteria)) {
            await this.generateNewListingAlert(
              area.userId,
              listing,
              this.getMatchedCriteria(listing, area.criteria)
            )
          }
        }
        
        // Check for price drops
        const priceDrops = await this.checkPriceDrops(area)
        for (const drop of priceDrops) {
          if (drop.dropPercent >= (area.alerts.priceDropPercent || 5)) {
            await this.generatePriceDropAlert(
              area.userId,
              drop.property,
              drop.previousPrice,
              drop.currentPrice
            )
          }
        }
        
        // Check for new permits
        const newPermits = await this.checkNewPermits(area)
        for (const permit of newPermits) {
          await this.generatePermitAlert(area.userId, permit)
        }
        
        // Check for Houston market data
        const marketData = await houstonDataService.getMarketData(area.name)
        if (marketData && marketData.marketStatus === 'hot') {
          await this.generateInvestmentOpportunityAlert(area.userId, area.name, marketData)
        }
        
        // Check for major projects in area
        const majorProjects = await houstonDataService.getMajorProjects({ 
          status: 'planning' 
        })
        const relevantProjects = majorProjects.filter(p => 
          p.location.toLowerCase().includes(area.name.toLowerCase())
        )
        for (const project of relevantProjects) {
          await this.generateMajorProjectAlert(area.userId, project)
        }
        
        // Check market trends
        const trends = await marketIntelligence.getMarketTrends(area.name)
        if (trends.metrics.inventory.changePercent >= (area.alerts.inventoryChangePercent || 20)) {
          await this.generateMarketTrendAlert(
            area.userId,
            area.name,
            'inventory',
            trends.metrics.inventory
          )
        }
      } catch (error) {
        console.error('Error monitoring area:', error)
      }
    }, 300000) // Check every 5 minutes
  }
  
  async generateInvestmentOpportunityAlert(
    userId: string,
    area: string,
    marketData: any
  ): Promise<Alert> {
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      userId,
      type: 'investment_opportunity',
      title: `Hot Market Alert: ${area}`,
      message: `${area} showing strong investment potential with ${marketData.yearOverYearChange}% YoY growth and only ${marketData.inventoryMonths} months inventory`,
      severity: marketData.investmentAppeal >= 9 ? 'urgent' : 'info',
      data: {
        area,
        neighborhood: marketData.neighborhood,
        zipCode: marketData.zipCode,
        medianPrice: marketData.medianPrice,
        pricePerSqft: marketData.pricePerSqft,
        yearOverYearChange: marketData.yearOverYearChange,
        marketStatus: marketData.marketStatus,
        investmentAppeal: marketData.investmentAppeal,
        inventoryMonths: marketData.inventoryMonths,
        daysOnMarket: marketData.daysOnMarket
      },
      read: false,
      createdAt: new Date()
    }
    
    await this.sendAlert(alert)
    return alert
  }
  
  // Alert Management
  async getAlerts(
    userId: string,
    options?: {
      unreadOnly?: boolean
      types?: Alert['type'][]
      limit?: number
      offset?: number
    }
  ): Promise<Alert[]> {
    let alerts = this.alerts.get(userId) || []
    
    if (options?.unreadOnly) {
      alerts = alerts.filter(a => !a.read)
    }
    
    if (options?.types) {
      alerts = alerts.filter(a => options.types!.includes(a.type))
    }
    
    const limit = options?.limit || 50
    const offset = options?.offset || 0
    
    return alerts.slice(offset, offset + limit)
  }
  
  async markAsRead(userId: string, alertId: string): Promise<void> {
    const userAlerts = this.alerts.get(userId) || []
    const alert = userAlerts.find(a => a.id === alertId)
    if (alert) {
      alert.read = true
    }
  }
  
  async markAllAsRead(userId: string): Promise<void> {
    const userAlerts = this.alerts.get(userId) || []
    userAlerts.forEach(alert => alert.read = true)
  }
  
  async deleteAlert(userId: string, alertId: string): Promise<void> {
    const userAlerts = this.alerts.get(userId) || []
    const filtered = userAlerts.filter(a => a.id !== alertId)
    this.alerts.set(userId, filtered)
  }
  
  // Real-time subscriptions
  subscribe(userId: string, callback: (alert: Alert) => void): () => void {
    this.subscribers.set(userId, callback)
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(userId)
    }
  }
  
  // Helper methods
  private getDefaultPreferences(userId: string): AlertPreference {
    return {
      userId,
      alertTypes: {
        priceDrops: true,
        newListings: true,
        permitFilings: true,
        marketTrends: true,
        inventoryChanges: true,
        investmentOpportunities: true
      },
      channels: {
        email: true,
        push: true,
        sms: false,
        inApp: true
      },
      frequency: 'instant',
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      },
      watchedAreas: [],
      priceRanges: {},
      propertyTypes: []
    }
  }
  
  private isQuietHours(quietHours: { start: string; end: string }): boolean {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const [startHour, startMin] = quietHours.start.split(':').map(Number)
    const [endHour, endMin] = quietHours.end.split(':').map(Number)
    
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      // Overnight quiet hours
      return currentTime >= startTime || currentTime <= endTime
    }
  }
  
  private async sendPushNotification(alert: Alert): Promise<void> {
    // In production, integrate with service like Firebase Cloud Messaging
    console.log('Sending push notification:', alert)
  }
  
  private async sendEmailAlert(alert: Alert): Promise<void> {
    // Use the existing email service
    console.log('Sending email alert:', alert)
  }
  
  private async sendSMSAlert(alert: Alert): Promise<void> {
    // In production, integrate with Twilio or similar
    console.log('Sending SMS alert:', alert)
  }
  
  private async checkNewListings(area: WatchedArea): Promise<any[]> {
    // Mock implementation - in production, check against MLS or database
    return []
  }
  
  private async checkPriceDrops(area: WatchedArea): Promise<any[]> {
    // Mock implementation
    return []
  }
  
  private async checkNewPermits(area: WatchedArea): Promise<any[]> {
    try {
      // Get recent permits from Houston data service
      const allPermits = await houstonDataService.getRecentPermits(50)
      
      // Filter permits for the watched area
      const relevantPermits = allPermits.filter(permit => {
        // Check if permit is in watched area (simplified for now)
        if (area.type === 'zipcode') {
          return permit.address.includes(area.boundaries as string)
        }
        
        // For neighborhood matches
        const addressLower = permit.address.toLowerCase()
        const areaNameLower = area.name.toLowerCase()
        return addressLower.includes(areaNameLower)
      })
      
      return relevantPermits
    } catch (error) {
      console.error('Error checking permits:', error)
      return []
    }
  }
  
  private matchesCriteria(property: any, criteria: WatchedArea['criteria']): boolean {
    if (criteria.propertyTypes && !criteria.propertyTypes.includes(property.type)) {
      return false
    }
    
    if (criteria.priceRange) {
      if (criteria.priceRange.min && property.price < criteria.priceRange.min) return false
      if (criteria.priceRange.max && property.price > criteria.priceRange.max) return false
    }
    
    if (criteria.lotSizeMin && property.lotSize < criteria.lotSizeMin) {
      return false
    }
    
    return true
  }
  
  private getMatchedCriteria(property: any, criteria: WatchedArea['criteria']): string[] {
    const matched: string[] = []
    
    if (criteria.propertyTypes?.includes(property.type)) {
      matched.push(property.type)
    }
    
    if (criteria.priceRange) {
      matched.push(`Price: $${property.price.toLocaleString()}`)
    }
    
    if (criteria.lotSizeMin && property.lotSize >= criteria.lotSizeMin) {
      matched.push(`Lot size: ${property.lotSize.toLocaleString()} sqft`)
    }
    
    return matched
  }
  
  private async analyzePermitImpact(permit: any, nearbyProperty?: any): Promise<any> {
    // Houston-specific permit impact analysis
    const impact = 
      permit.value >= 100000000 ? 'high' :    // $100M+ major development
      permit.value >= 10000000 ? 'medium' :    // $10M+ significant project
      'low'                                    // Under $10M
    
    // Create meaningful summaries based on permit type and value
    let summary = ''
    
    if (permit.type?.includes('Commercial')) {
      if (permit.value >= 50000000) {
        summary = 'Major commercial development likely to transform area and boost property values'
      } else {
        summary = 'New commercial development may increase area activity and property demand'
      }
    } else if (permit.type?.includes('Residential')) {
      if (permit.value >= 100000000) {
        summary = 'Large residential project will significantly increase housing supply and reshape neighborhood'
      } else {
        summary = 'New residential development adding to neighborhood growth'
      }
    } else if (permit.type?.includes('Mixed-Use')) {
      summary = 'Mixed-use development bringing new amenities and increasing area desirability'
    } else {
      summary = `Potential ${impact} development impact on area values and future growth`
    }
    
    // Add specific insights for known Houston developers
    if (permit.developer && ['Hines', 'Midway', 'Howard Hughes'].includes(permit.developer)) {
      summary += `. Premium developer ${permit.developer} typically delivers high-quality projects`
    }
    
    return {
      impact,
      summary,
      estimatedCompletion: this.estimateCompletionTime(permit),
      potentialPropertyImpact: impact === 'high' ? '+5-10%' : impact === 'medium' ? '+2-5%' : '+1-2%'
    }
  }
  
  private estimateCompletionTime(permit: any): string {
    // Estimate based on Houston development patterns
    if (permit.value >= 100000000) return '24-36 months'
    if (permit.value >= 50000000) return '18-24 months'
    if (permit.value >= 10000000) return '12-18 months'
    return '6-12 months'
  }
  
  private getTrendMessage(type: string, data: any): string {
    switch (type) {
      case 'appreciation':
        return `${data.change > 0 ? 'Prices up' : 'Prices down'} ${Math.abs(data.change)}% in the last month`
      case 'inventory':
        return `Inventory ${data.change > 0 ? 'increased' : 'decreased'} by ${Math.abs(data.change)}%`
      case 'demand':
        return `Demand is ${data.level} with ${data.daysOnMarket} average days on market`
      default:
        return 'Market conditions have changed'
    }
  }
  
  private getTrendSeverity(type: string, data: any): Alert['severity'] {
    if (type === 'appreciation' && Math.abs(data.change) > 10) return 'urgent'
    if (type === 'inventory' && Math.abs(data.change) > 30) return 'warning'
    return 'info'
  }
}

export const marketAlerts = new MarketAlertsService()
export default MarketAlertsService