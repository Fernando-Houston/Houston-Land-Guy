import { prisma } from '@/lib/db/prisma'
import { cacheGet, cacheSet } from '@/lib/cache/redis'

export interface Metrics {
  apiCalls: number
  uniqueVisitors: number
  leadsGenerated: number
  toolsUsed: number
  conversionRate: number
  averageResponseTime: number
}

export interface DailyMetrics extends Metrics {
  date: string
  topEndpoints: { endpoint: string; calls: number }[]
  topTools: { tool: string; uses: number }[]
  errorRate: number
}

export class MetricsService {
  private static CACHE_TTL = 300 // 5 minutes

  static async getDailyMetrics(date: Date = new Date()): Promise<DailyMetrics> {
    const dateStr = date.toISOString().split('T')[0]
    const cacheKey = `metrics:daily:${dateStr}`

    // Check cache first
    const cached = await cacheGet<DailyMetrics>(cacheKey)
    if (cached) return cached

    // Calculate metrics
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Get leads created today
    const [leadsCount, totalLeads] = await Promise.all([
      prisma.lead.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      prisma.lead.count()
    ])

    // Get interactions for metrics
    const interactions = await prisma.interaction.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      select: {
        type: true,
        details: true
      }
    })

    // Get tool usage
    const toolUsage = await prisma.calculatorResult.groupBy({
      by: ['calculatorType'],
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      _count: true
    })

    // Calculate metrics
    const apiCalls = interactions.filter(i => i.type === 'api_call').length
    const uniqueVisitors = new Set(interactions.map(i => (i.details as any)?.sessionId)).size
    const toolsUsed = toolUsage.reduce((sum, t) => sum + t._count, 0)
    const conversionRate = totalLeads > 0 ? (leadsCount / uniqueVisitors) * 100 : 0

    // Get top endpoints from interactions
    const endpointCounts = new Map<string, number>()
    interactions
      .filter(i => i.type === 'api_call')
      .forEach(i => {
        const endpoint = (i.details as any)?.endpoint || 'unknown'
        endpointCounts.set(endpoint, (endpointCounts.get(endpoint) || 0) + 1)
      })

    const topEndpoints = Array.from(endpointCounts.entries())
      .map(([endpoint, calls]) => ({ endpoint, calls }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 5)

    // Get top tools
    const topTools = toolUsage
      .map(t => ({ tool: t.calculatorType, uses: t._count }))
      .sort((a, b) => b.uses - a.uses)

    // Calculate error rate
    const errors = interactions.filter(i => i.type === 'system_error').length
    const errorRate = apiCalls > 0 ? (errors / apiCalls) * 100 : 0

    const metrics: DailyMetrics = {
      date: dateStr,
      apiCalls,
      uniqueVisitors,
      leadsGenerated: leadsCount,
      toolsUsed,
      conversionRate,
      averageResponseTime: 0, // TODO: Implement response time tracking
      topEndpoints,
      topTools,
      errorRate
    }

    // Cache the results
    await cacheSet(cacheKey, metrics, this.CACHE_TTL)

    return metrics
  }

  static async getWeeklyMetrics(): Promise<DailyMetrics[]> {
    const metrics: DailyMetrics[] = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      metrics.push(await this.getDailyMetrics(date))
    }

    return metrics.reverse()
  }

  static async getConversionFunnel(): Promise<{
    visitors: number
    toolUsers: number
    leadsCaptured: number
    qualifiedLeads: number
    conversions: number
  }> {
    const cacheKey = 'metrics:funnel'
    const cached = await cacheGet<any>(cacheKey)
    if (cached) return cached

    const [
      visitors,
      toolUsers,
      leadsCaptured,
      qualifiedLeads,
      conversions
    ] = await Promise.all([
      // Unique visitors (approximated by unique sessions)
      prisma.interaction.findMany({
        distinct: ['details'],
        select: { details: true }
      }).then(results => new Set(results.map(r => (r.details as any)?.sessionId)).size),

      // Users who used tools
      prisma.calculatorResult.findMany({
        distinct: ['sessionId'],
        select: { sessionId: true }
      }).then(results => results.length),

      // Total leads
      prisma.lead.count(),

      // Qualified leads
      prisma.lead.count({
        where: { status: 'QUALIFIED' }
      }),

      // Converted leads
      prisma.lead.count({
        where: { status: 'CONVERTED' }
      })
    ])

    const funnel = {
      visitors,
      toolUsers,
      leadsCaptured,
      qualifiedLeads,
      conversions
    }

    await cacheSet(cacheKey, funnel, this.CACHE_TTL)
    return funnel
  }

  static async trackApiPerformance(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number
  ) {
    await prisma.interaction.create({
      data: {
        type: 'api_call',
        details: {
          endpoint,
          method,
          duration,
          statusCode,
          timestamp: new Date().toISOString()
        }
      }
    })
  }

  static async getPerformanceReport(): Promise<{
    slowestEndpoints: { endpoint: string; avgTime: number }[]
    errorProne: { endpoint: string; errorRate: number }[]
    mostUsed: { endpoint: string; calls: number }[]
  }> {
    const last24Hours = new Date()
    last24Hours.setHours(last24Hours.getHours() - 24)

    const apiCalls = await prisma.interaction.findMany({
      where: {
        type: 'api_call',
        createdAt: { gte: last24Hours }
      },
      select: { details: true }
    })

    // Analyze performance
    const endpointStats = new Map<string, {
      totalTime: number
      calls: number
      errors: number
    }>()

    apiCalls.forEach(call => {
      const details = call.details as any
      const endpoint = details.endpoint || 'unknown'
      const stats = endpointStats.get(endpoint) || { totalTime: 0, calls: 0, errors: 0 }
      
      stats.totalTime += details.duration || 0
      stats.calls += 1
      if (details.statusCode >= 400) stats.errors += 1
      
      endpointStats.set(endpoint, stats)
    })

    // Calculate reports
    const entries = Array.from(endpointStats.entries())

    const slowestEndpoints = entries
      .map(([endpoint, stats]) => ({
        endpoint,
        avgTime: stats.calls > 0 ? stats.totalTime / stats.calls : 0
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 5)

    const errorProne = entries
      .map(([endpoint, stats]) => ({
        endpoint,
        errorRate: stats.calls > 0 ? (stats.errors / stats.calls) * 100 : 0
      }))
      .filter(e => e.errorRate > 0)
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 5)

    const mostUsed = entries
      .map(([endpoint, stats]) => ({
        endpoint,
        calls: stats.calls
      }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 5)

    return {
      slowestEndpoints,
      errorProne,
      mostUsed
    }
  }
}