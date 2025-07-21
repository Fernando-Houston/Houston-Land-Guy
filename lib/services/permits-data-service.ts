// Permits Data Service - Real Database Integration
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface PermitData {
  permitNumber: string
  type: string
  address: string
  description: string
  value: number
  issuedDate: string
  contractor?: string
  owner?: string
  coordinates?: { lat: number; lng: number }
  status: string
  zipCode: string
  neighborhood?: string
}

export interface PermitStats {
  totalPermits: number
  totalValue: number
  avgValue: number
  topContractor: string
  hotZones: string[]
  typeBreakdown: { type: string; count: number; value: number }[]
  monthlyTrend: { month: string; count: number; value: number }[]
}

export class PermitsDataService {
  // Get permits with filters
  async getPermits(filters: {
    limit?: number
    dateFrom?: string
    type?: string
    zipCode?: string
    search?: string
  } = {}): Promise<PermitData[]> {
    try {
      const { limit = 100, dateFrom, type, zipCode, search } = filters

      // Build where clause
      const whereClause: any = {
        status: 'active' // Only show active permits
      }

      if (dateFrom) {
        whereClause.permitDate = {
          gte: new Date(dateFrom)
        }
      }

      if (type && type !== 'all') {
        if (type === 'new_construction') {
          whereClause.permitType = 'residential'
          whereClause.subType = 'new construction'
        } else {
          whereClause.permitType = type
        }
      }

      if (zipCode) {
        whereClause.zipCode = zipCode
      }

      if (search) {
        whereClause.OR = [
          { address: { contains: search, mode: 'insensitive' } },
          { contractor: { contains: search, mode: 'insensitive' } },
          { projectName: { contains: search, mode: 'insensitive' } }
        ]
      }

      const permits = await prisma.constructionActivity.findMany({
        where: whereClause,
        orderBy: { permitDate: 'desc' },
        take: limit
      })

      return permits.map(permit => ({
        permitNumber: permit.permitNumber,
        type: this.formatPermitType(permit.permitType, permit.subType),
        address: permit.address,
        description: permit.projectName || `${permit.permitType} permit`,
        value: permit.estimatedCost || 0,
        issuedDate: permit.permitDate.toISOString().split('T')[0],
        contractor: permit.contractor || undefined,
        owner: permit.developer || undefined,
        status: permit.status,
        zipCode: permit.zipCode,
        neighborhood: permit.neighborhood || undefined,
        coordinates: this.generateCoordinates(permit.zipCode) // Generate approximate coordinates
      }))
    } catch (error) {
      console.error('Error fetching permits:', error)
      return []
    }
  }

  // Get permit statistics
  async getPermitStats(filters: {
    dateFrom?: string
    type?: string
  } = {}): Promise<PermitStats> {
    try {
      const { dateFrom, type } = filters

      // Build where clause
      const whereClause: any = {
        status: 'active'
      }

      if (dateFrom) {
        whereClause.permitDate = {
          gte: new Date(dateFrom)
        }
      }

      if (type && type !== 'all') {
        if (type === 'new_construction') {
          whereClause.permitType = 'residential'
          whereClause.subType = 'new construction'
        } else {
          whereClause.permitType = type
        }
      }

      const permits = await prisma.constructionActivity.findMany({
        where: whereClause,
        select: {
          permitType: true,
          subType: true,
          estimatedCost: true,
          contractor: true,
          zipCode: true,
          neighborhood: true,
          permitDate: true
        }
      })

      // Calculate statistics
      const totalPermits = permits.length
      const totalValue = permits.reduce((sum, p) => sum + (p.estimatedCost || 0), 0)
      const avgValue = totalPermits > 0 ? totalValue / totalPermits : 0

      // Top contractor
      const contractorCounts = permits.reduce((acc, p) => {
        if (p.contractor) {
          acc[p.contractor] = (acc[p.contractor] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)

      const topContractor = Object.entries(contractorCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'

      // Hot zones (neighborhoods/zip codes)
      const zoneCounts = permits.reduce((acc, p) => {
        const zone = p.neighborhood || p.zipCode
        if (zone) {
          acc[zone] = (acc[zone] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)

      const hotZones = Object.entries(zoneCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([zone]) => zone)

      // Type breakdown
      const typeBreakdown = permits.reduce((acc, p) => {
        const type = this.formatPermitType(p.permitType, p.subType)
        const existing = acc.find(item => item.type === type)
        if (existing) {
          existing.count += 1
          existing.value += p.estimatedCost || 0
        } else {
          acc.push({
            type,
            count: 1,
            value: p.estimatedCost || 0
          })
        }
        return acc
      }, [] as { type: string; count: number; value: number }[])

      // Monthly trend (last 6 months)
      const monthlyTrend = this.calculateMonthlyTrend(permits)

      return {
        totalPermits,
        totalValue,
        avgValue,
        topContractor,
        hotZones,
        typeBreakdown,
        monthlyTrend
      }
    } catch (error) {
      console.error('Error calculating permit stats:', error)
      return {
        totalPermits: 0,
        totalValue: 0,
        avgValue: 0,
        topContractor: 'N/A',
        hotZones: [],
        typeBreakdown: [],
        monthlyTrend: []
      }
    }
  }

  // Get permits by neighborhood
  async getPermitsByNeighborhood(limit: number = 10) {
    try {
      const permits = await prisma.constructionActivity.groupBy({
        by: ['neighborhood'],
        where: {
          status: 'active',
          neighborhood: { not: null },
          permitDate: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
          }
        },
        _count: { permitNumber: true },
        _sum: { estimatedCost: true },
        orderBy: { _count: { permitNumber: 'desc' } },
        take: limit
      })

      return permits.map(group => ({
        neighborhood: group.neighborhood,
        count: group._count.permitNumber,
        totalValue: group._sum.estimatedCost || 0
      }))
    } catch (error) {
      console.error('Error fetching permits by neighborhood:', error)
      return []
    }
  }

  // Private helper methods
  private formatPermitType(permitType: string, subType?: string | null): string {
    if (subType) {
      return `${permitType} - ${subType}`.replace(/^\w/, c => c.toUpperCase())
    }
    return permitType.charAt(0).toUpperCase() + permitType.slice(1)
  }

  private generateCoordinates(zipCode: string): { lat: number; lng: number } {
    // Houston zip code coordinate mapping (approximate)
    const zipCoordinates: Record<string, { lat: number; lng: number }> = {
      '77001': { lat: 29.7604, lng: -95.3698 }, // Downtown
      '77002': { lat: 29.7504, lng: -95.3698 }, // Downtown
      '77003': { lat: 29.7404, lng: -95.3498 }, // Third Ward
      '77004': { lat: 29.7204, lng: -95.3898 }, // Museum District
      '77005': { lat: 29.7104, lng: -95.4098 }, // Rice Village
      '77006': { lat: 29.7304, lng: -95.3898 }, // Montrose
      '77007': { lat: 29.7704, lng: -95.3998 }, // Heights
      '77008': { lat: 29.8004, lng: -95.4098 }, // Heights
      '77009': { lat: 29.8204, lng: -95.3898 }, // Near Northside
      '77010': { lat: 29.7104, lng: -95.3598 }, // Medical Center
      '77019': { lat: 29.7504, lng: -95.4298 }, // River Oaks
      '77024': { lat: 29.7804, lng: -95.4898 }, // Memorial
      '77025': { lat: 29.6804, lng: -95.4398 }, // Bellaire
      '77027': { lat: 29.7404, lng: -95.4398 }, // River Oaks
      '77030': { lat: 29.7104, lng: -95.3798 }, // Medical Center
      '77056': { lat: 29.7604, lng: -95.4598 }, // Galleria
      '77077': { lat: 29.7404, lng: -95.6398 }, // West Houston
      '77098': { lat: 29.7304, lng: -95.4198 }, // Upper Kirby
    }

    return zipCoordinates[zipCode] || { lat: 29.7604, lng: -95.3698 } // Default to downtown Houston
  }

  private calculateMonthlyTrend(permits: any[]): { month: string; count: number; value: number }[] {
    const months = []
    const now = new Date()
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStr = date.toISOString().substring(0, 7) // YYYY-MM format
      
      const monthPermits = permits.filter(p => {
        const permitMonth = p.permitDate.toISOString().substring(0, 7)
        return permitMonth === monthStr
      })

      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: monthPermits.length,
        value: monthPermits.reduce((sum, p) => sum + (p.estimatedCost || 0), 0)
      })
    }

    return months
  }
}

// Export default instance
export const permitsDataService = new PermitsDataService()