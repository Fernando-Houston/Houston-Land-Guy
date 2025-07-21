// Market Trend Tracker - Detects significant changes in market data
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface MarketChange {
  metric: string
  previousValue: number
  currentValue: number
  changePercent: number
  significance: 'low' | 'medium' | 'high'
  description: string
  timestamp: Date
}

export class MarketTrendTracker {
  // Threshold for significant changes
  private readonly THRESHOLDS = {
    price: { low: 2, medium: 5, high: 10 }, // Percentage change
    inventory: { low: 5, medium: 10, high: 20 },
    daysOnMarket: { low: 3, medium: 7, high: 14 }, // Days change
    permitCount: { low: 10, medium: 25, high: 50 },
    rentalRate: { low: 2, medium: 5, high: 8 },
    occupancy: { low: 1, medium: 3, high: 5 }
  }
  
  // Detect significant changes across all metrics
  async detectSignificantChanges(): Promise<MarketChange[]> {
    const changes: MarketChange[] = []
    
    // Check market metrics
    const marketChanges = await this.checkMarketMetrics()
    changes.push(...marketChanges)
    
    // Check rental market changes
    const rentalChanges = await this.checkRentalMarket()
    changes.push(...rentalChanges)
    
    // Check permit trends
    const permitChanges = await this.checkPermitTrends()
    changes.push(...permitChanges)
    
    // Check economic indicators
    const economicChanges = await this.checkEconomicIndicators()
    changes.push(...economicChanges)
    
    return changes.filter(c => c.significance !== 'low') // Only return medium/high changes
  }
  
  // Check market metrics for significant changes
  private async checkMarketMetrics(): Promise<MarketChange[]> {
    const changes: MarketChange[] = []
    
    try {
      // Get latest and previous period metrics
      const latestMetrics = await prisma.marketMetrics.findMany({
        orderBy: { startDate: 'desc' },
        take: 10
      })
      
      for (const latest of latestMetrics) {
        // Find previous period for comparison
        const previous = await prisma.marketMetrics.findFirst({
          where: {
            areaName: latest.areaName,
            period: latest.period,
            startDate: { lt: latest.startDate }
          },
          orderBy: { startDate: 'desc' }
        })
        
        if (!previous) continue
        
        // Check median price change
        if (latest.medianPrice > 0 && previous.medianPrice > 0) {
          const priceChange = ((latest.medianPrice - previous.medianPrice) / previous.medianPrice) * 100
          
          if (Math.abs(priceChange) > this.THRESHOLDS.price.low) {
            changes.push({
              metric: `${latest.areaName} Median Price`,
              previousValue: previous.medianPrice,
              currentValue: latest.medianPrice,
              changePercent: priceChange,
              significance: this.getSignificance(Math.abs(priceChange), this.THRESHOLDS.price),
              description: `Median home price in ${latest.areaName} ${priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceChange).toFixed(1)}%`,
              timestamp: latest.startDate
            })
          }
        }
        
        // Check inventory change
        if (latest.inventory > 0 && previous.inventory > 0) {
          const inventoryChange = ((latest.inventory - previous.inventory) / previous.inventory) * 100
          
          if (Math.abs(inventoryChange) > this.THRESHOLDS.inventory.low) {
            changes.push({
              metric: `${latest.areaName} Inventory`,
              previousValue: previous.inventory,
              currentValue: latest.inventory,
              changePercent: inventoryChange,
              significance: this.getSignificance(Math.abs(inventoryChange), this.THRESHOLDS.inventory),
              description: `Housing inventory in ${latest.areaName} ${inventoryChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(inventoryChange).toFixed(1)}%`,
              timestamp: latest.startDate
            })
          }
        }
        
        // Check days on market
        if (latest.avgDaysOnMarket > 0 && previous.avgDaysOnMarket > 0) {
          const domChange = latest.avgDaysOnMarket - previous.avgDaysOnMarket
          
          if (Math.abs(domChange) > this.THRESHOLDS.daysOnMarket.low) {
            changes.push({
              metric: `${latest.areaName} Days on Market`,
              previousValue: previous.avgDaysOnMarket,
              currentValue: latest.avgDaysOnMarket,
              changePercent: (domChange / previous.avgDaysOnMarket) * 100,
              significance: this.getSignificance(Math.abs(domChange), this.THRESHOLDS.daysOnMarket),
              description: `Average days on market in ${latest.areaName} ${domChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(domChange)} days`,
              timestamp: latest.startDate
            })
          }
        }
      }
    } catch (error) {
      console.error('Error checking market metrics:', error)
    }
    
    return changes
  }
  
  // Check rental market changes
  private async checkRentalMarket(): Promise<MarketChange[]> {
    const changes: MarketChange[] = []
    
    try {
      // Get neighborhoods with multiple data points
      const neighborhoods = await prisma.rentalMarket.groupBy({
        by: ['neighborhood'],
        where: { neighborhood: { not: null } },
        _count: true,
        having: { _count: { neighborhood: { gt: 1 } } }
      })
      
      for (const { neighborhood } of neighborhoods) {
        if (!neighborhood) continue
        
        // Get latest and previous data
        const rentData = await prisma.rentalMarket.findMany({
          where: { neighborhood },
          orderBy: { reportDate: 'desc' },
          take: 2
        })
        
        if (rentData.length < 2) continue
        
        const [latest, previous] = rentData
        
        // Check rent change
        if (latest.avgRent2BR && previous.avgRent2BR) {
          const rentChange = ((latest.avgRent2BR - previous.avgRent2BR) / previous.avgRent2BR) * 100
          
          if (Math.abs(rentChange) > this.THRESHOLDS.rentalRate.low) {
            changes.push({
              metric: `${neighborhood} Rental Rate`,
              previousValue: previous.avgRent2BR,
              currentValue: latest.avgRent2BR,
              changePercent: rentChange,
              significance: this.getSignificance(Math.abs(rentChange), this.THRESHOLDS.rentalRate),
              description: `Average 2BR rent in ${neighborhood} ${rentChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(rentChange).toFixed(1)}% to $${latest.avgRent2BR}/mo`,
              timestamp: latest.reportDate
            })
          }
        }
        
        // Check occupancy change
        if (latest.occupancyRate && previous.occupancyRate) {
          const occupancyChange = latest.occupancyRate - previous.occupancyRate
          
          if (Math.abs(occupancyChange) > this.THRESHOLDS.occupancy.low) {
            changes.push({
              metric: `${neighborhood} Occupancy`,
              previousValue: previous.occupancyRate,
              currentValue: latest.occupancyRate,
              changePercent: occupancyChange,
              significance: this.getSignificance(Math.abs(occupancyChange), this.THRESHOLDS.occupancy),
              description: `Occupancy rate in ${neighborhood} ${occupancyChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(occupancyChange).toFixed(1)} percentage points`,
              timestamp: latest.reportDate
            })
          }
        }
      }
    } catch (error) {
      console.error('Error checking rental market:', error)
    }
    
    return changes
  }
  
  // Check permit trends
  private async checkPermitTrends(): Promise<MarketChange[]> {
    const changes: MarketChange[] = []
    
    try {
      // Get recent permits by month
      const recentMonths = await prisma.permit.groupBy({
        by: ['issueDate'],
        where: {
          issueDate: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // Last 90 days
        },
        _count: true
      })
      
      if (recentMonths.length >= 2) {
        // Sort by date
        recentMonths.sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
        
        const latestMonth = recentMonths[0]
        const previousMonth = recentMonths[1]
        
        const permitChange = ((latestMonth._count - previousMonth._count) / previousMonth._count) * 100
        
        if (Math.abs(permitChange) > this.THRESHOLDS.permitCount.low) {
          changes.push({
            metric: 'Construction Permits',
            previousValue: previousMonth._count,
            currentValue: latestMonth._count,
            changePercent: permitChange,
            significance: this.getSignificance(Math.abs(permitChange), this.THRESHOLDS.permitCount),
            description: `Construction permits ${permitChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(permitChange).toFixed(1)}% month-over-month`,
            timestamp: latestMonth.issueDate
          })
        }
      }
      
      // Check permit values
      const permitValues = await prisma.permit.groupBy({
        by: ['issueDate'],
        where: {
          issueDate: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
          estimatedValue: { gt: 0 }
        },
        _sum: { estimatedValue: true }
      })
      
      if (permitValues.length >= 2) {
        permitValues.sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
        
        const latestValue = permitValues[0]._sum.estimatedValue || 0
        const previousValue = permitValues[1]._sum.estimatedValue || 0
        
        if (previousValue > 0) {
          const valueChange = ((latestValue - previousValue) / previousValue) * 100
          
          if (Math.abs(valueChange) > this.THRESHOLDS.price.medium) {
            changes.push({
              metric: 'Construction Value',
              previousValue,
              currentValue: latestValue,
              changePercent: valueChange,
              significance: this.getSignificance(Math.abs(valueChange), this.THRESHOLDS.price),
              description: `Total construction value ${valueChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(valueChange).toFixed(1)}% to $${(latestValue / 1000000).toFixed(1)}M`,
              timestamp: permitValues[0].issueDate
            })
          }
        }
      }
    } catch (error) {
      console.error('Error checking permit trends:', error)
    }
    
    return changes
  }
  
  // Check economic indicators
  private async checkEconomicIndicators(): Promise<MarketChange[]> {
    const changes: MarketChange[] = []
    
    try {
      // Get unique indicators
      const indicators = await prisma.economicIndicator.groupBy({
        by: ['indicatorName'],
        _count: true,
        having: { _count: { indicatorName: { gt: 1 } } }
      })
      
      for (const { indicatorName } of indicators) {
        // Get latest and previous values
        const indicatorData = await prisma.economicIndicator.findMany({
          where: { indicatorName },
          orderBy: { reportDate: 'desc' },
          take: 2
        })
        
        if (indicatorData.length < 2) continue
        
        const [latest, previous] = indicatorData
        
        // Check for significant change
        const change = ((latest.currentValue - previous.currentValue) / previous.currentValue) * 100
        
        // Use different thresholds based on indicator type
        let threshold = this.THRESHOLDS.price
        if (indicatorName.includes('Unemployment') || indicatorName.includes('Rate')) {
          threshold = this.THRESHOLDS.occupancy
        }
        
        if (Math.abs(change) > threshold.low) {
          changes.push({
            metric: indicatorName,
            previousValue: previous.currentValue,
            currentValue: latest.currentValue,
            changePercent: change,
            significance: this.getSignificance(Math.abs(change), threshold),
            description: `${indicatorName} ${change > 0 ? 'increased' : 'decreased'} from ${previous.currentValue}${latest.unit} to ${latest.currentValue}${latest.unit}`,
            timestamp: latest.reportDate
          })
        }
      }
    } catch (error) {
      console.error('Error checking economic indicators:', error)
    }
    
    return changes
  }
  
  // Determine significance level
  private getSignificance(value: number, thresholds: { low: number, medium: number, high: number }): 'low' | 'medium' | 'high' {
    if (value >= thresholds.high) return 'high'
    if (value >= thresholds.medium) return 'medium'
    return 'low'
  }
  
  // Store detected changes for historical tracking
  async storeChanges(changes: MarketChange[]): Promise<void> {
    for (const change of changes) {
      await prisma.marketIntelligence.create({
        data: {
          metricName: change.metric,
          metricValue: change.description,
          numericValue: change.currentValue,
          previousValue: change.previousValue,
          changePercent: change.changePercent,
          unit: change.currentValue > 1000000 ? 'millions' : 'value',
          period: 'change_detection',
          periodStart: change.timestamp,
          periodEnd: change.timestamp,
          category: 'trend_alert',
          subCategory: change.significance,
          confidence: 95,
          insights: `Significant ${change.significance} change detected`
        }
      })
    }
  }
}

export const marketTrendTracker = new MarketTrendTracker()