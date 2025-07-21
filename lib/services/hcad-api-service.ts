// HCAD (Harris County Appraisal District) API Service
// Integrates with HCAD's public data API for real-time property information
import { PrismaClient } from '@prisma/client'
import { cache } from 'react'

const prisma = new PrismaClient()
const HCAD_BASE_URL = process.env.HCAD_BASE_URL || 'https://pdata.hcad.org'

interface HCADSearchParams {
  account?: string
  owner?: string
  address?: string
  zipCode?: string
  limit?: number
  offset?: number
}

interface HCADPropertyResponse {
  account: string
  prop_id?: string
  geo_id?: string
  situs_address?: string
  city?: string
  zip?: string
  legal_dsc?: string
  owner?: string
  owner_address?: string
  land_value?: number
  improvement_value?: number
  market_value?: number
  appraised_value?: number
  taxable_value?: number
  year_built?: number
  building_area?: number
  land_area?: number
  property_type?: string
  property_class?: string
  zoning?: string
  neighborhoods?: string[]
  last_sale_date?: string
  last_sale_amount?: number
}

export class HCADApiService {
  // Search properties by various criteria
  async searchProperties(params: HCADSearchParams): Promise<HCADPropertyResponse[]> {
    try {
      const queryParams = new URLSearchParams()
      
      // Build query based on parameters
      if (params.account) {
        queryParams.append('account', params.account)
      }
      if (params.owner) {
        queryParams.append('owner_name', params.owner)
      }
      if (params.address) {
        queryParams.append('street_address', params.address)
      }
      if (params.zipCode) {
        queryParams.append('zip_code', params.zipCode)
      }
      if (params.limit) {
        queryParams.append('$limit', params.limit.toString())
      }
      if (params.offset) {
        queryParams.append('$offset', params.offset.toString())
      }
      
      // Make API request
      const response = await fetch(
        `${HCAD_BASE_URL}/api/v1/properties?${queryParams.toString()}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Houston-Development-Intelligence/1.0'
          }
        }
      )
      
      if (!response.ok) {
        console.error('HCAD API error:', response.status)
        return []
      }
      
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('HCAD search error:', error)
      return []
    }
  }

  // Get detailed property information by account number
  async getPropertyByAccount(accountNumber: string): Promise<HCADPropertyResponse | null> {
    try {
      const response = await fetch(
        `${HCAD_BASE_URL}/api/v1/properties/${accountNumber}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Houston-Development-Intelligence/1.0'
          }
        }
      )
      
      if (!response.ok) {
        console.error('HCAD property fetch error:', response.status)
        return null
      }
      
      return await response.json()
    } catch (error) {
      console.error('HCAD property error:', error)
      return null
    }
  }

  // Get property value history
  async getPropertyValueHistory(accountNumber: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${HCAD_BASE_URL}/api/v1/properties/${accountNumber}/values`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Houston-Development-Intelligence/1.0'
          }
        }
      )
      
      if (!response.ok) {
        return []
      }
      
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('HCAD value history error:', error)
      return []
    }
  }

  // Get tax information for a property
  async getPropertyTaxInfo(accountNumber: string): Promise<any> {
    try {
      const response = await fetch(
        `${HCAD_BASE_URL}/api/v1/properties/${accountNumber}/tax`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Houston-Development-Intelligence/1.0'
          }
        }
      )
      
      if (!response.ok) {
        return null
      }
      
      return await response.json()
    } catch (error) {
      console.error('HCAD tax info error:', error)
      return null
    }
  }

  // Import HCAD property data into our database
  async importPropertyToDatabase(accountNumber: string): Promise<boolean> {
    try {
      const hcadData = await this.getPropertyByAccount(accountNumber)
      if (!hcadData) return false
      
      // Transform HCAD data to our schema
      const propertyData = {
        accountNumber: hcadData.account,
        propertyId: hcadData.prop_id,
        geoId: hcadData.geo_id,
        siteAddress: hcadData.situs_address || '',
        city: hcadData.city || 'Houston',
        zipCode: hcadData.zip || '',
        legalDescription: hcadData.legal_dsc,
        ownerName: hcadData.owner || '',
        ownerAddress: hcadData.owner_address,
        landArea: hcadData.land_area ? parseFloat(hcadData.land_area.toString()) : null,
        buildingArea: hcadData.building_area ? parseFloat(hcadData.building_area.toString()) : null,
        yearBuilt: hcadData.year_built ? parseInt(hcadData.year_built.toString()) : null,
        propertyType: hcadData.property_type || 'Unknown',
        propertyClass: hcadData.property_class,
        landValue: hcadData.land_value || 0,
        improvementValue: hcadData.improvement_value || 0,
        totalMarketValue: hcadData.market_value || 0,
        totalAppraisedValue: hcadData.appraised_value || 0,
        taxableValue: hcadData.taxable_value || 0,
        taxes: 0, // Calculate based on tax rate
        taxYear: new Date().getFullYear(),
        zoningCode: hcadData.zoning,
        neighborhoods: hcadData.neighborhoods || [],
        lastSaleDate: hcadData.last_sale_date ? new Date(hcadData.last_sale_date) : null,
        lastSaleAmount: hcadData.last_sale_amount,
        lastUpdated: new Date()
      }
      
      // Upsert to database
      await prisma.hCADProperty.upsert({
        where: { accountNumber: propertyData.accountNumber },
        update: propertyData,
        create: propertyData
      })
      
      return true
    } catch (error) {
      console.error('Import property error:', error)
      return false
    }
  }

  // Batch import properties for an area
  async importAreaProperties(zipCode: string, limit: number = 100): Promise<{
    imported: number
    failed: number
    total: number
  }> {
    try {
      const properties = await this.searchProperties({ zipCode, limit })
      
      let imported = 0
      let failed = 0
      
      for (const prop of properties) {
        const success = await this.importPropertyToDatabase(prop.account)
        if (success) {
          imported++
        } else {
          failed++
        }
      }
      
      return {
        imported,
        failed,
        total: properties.length
      }
    } catch (error) {
      console.error('Batch import error:', error)
      return { imported: 0, failed: 0, total: 0 }
    }
  }

  // Get aggregated stats for an area
  async getAreaStats(zipCode: string): Promise<{
    totalProperties: number
    avgMarketValue: number
    medianMarketValue: number
    totalMarketValue: number
    avgPricePerSqft: number
  } | null> {
    try {
      // First check if we have data in our database
      const localStats = await prisma.hCADProperty.aggregate({
        where: { zipCode },
        _count: { accountNumber: true },
        _avg: { totalMarketValue: true, buildingArea: true },
        _sum: { totalMarketValue: true }
      })
      
      if (localStats._count.accountNumber > 0) {
        // Calculate median (simplified - in production use proper median calculation)
        const properties = await prisma.hCADProperty.findMany({
          where: { zipCode },
          select: { totalMarketValue: true },
          orderBy: { totalMarketValue: 'asc' }
        })
        
        const median = properties.length > 0 ? 
          properties[Math.floor(properties.length / 2)].totalMarketValue : 0
        
        return {
          totalProperties: localStats._count.accountNumber,
          avgMarketValue: localStats._avg.totalMarketValue || 0,
          medianMarketValue: median,
          totalMarketValue: localStats._sum.totalMarketValue || 0,
          avgPricePerSqft: localStats._avg.buildingArea ? 
            (localStats._avg.totalMarketValue || 0) / localStats._avg.buildingArea : 0
        }
      }
      
      // If no local data, fetch from HCAD API
      const properties = await this.searchProperties({ zipCode, limit: 1000 })
      
      if (properties.length === 0) return null
      
      const values = properties
        .map(p => p.market_value || 0)
        .filter(v => v > 0)
        .sort((a, b) => a - b)
      
      const total = values.reduce((sum, v) => sum + v, 0)
      const avg = total / values.length
      const median = values[Math.floor(values.length / 2)]
      
      return {
        totalProperties: properties.length,
        avgMarketValue: avg,
        medianMarketValue: median,
        totalMarketValue: total,
        avgPricePerSqft: 0 // Would need building area data
      }
    } catch (error) {
      console.error('Area stats error:', error)
      return null
    }
  }

  // Search for distressed properties (tax delinquent, low value, etc.)
  async findDistressedProperties(params: {
    zipCode?: string
    maxValue?: number
    minYearBuilt?: number
  }): Promise<any[]> {
    try {
      // Build query for potentially distressed properties
      const where: any = {}
      
      if (params.zipCode) {
        where.zipCode = params.zipCode
      }
      
      if (params.maxValue) {
        where.totalMarketValue = { lte: params.maxValue }
      }
      
      if (params.minYearBuilt) {
        where.yearBuilt = { lte: params.minYearBuilt }
      }
      
      // Look for properties with low improvement value relative to land value
      const properties = await prisma.hCADProperty.findMany({
        where: {
          ...where,
          improvementValue: { lte: prisma.hCADProperty.fields.landValue }
        },
        take: 50,
        orderBy: { totalMarketValue: 'asc' }
      })
      
      return properties
    } catch (error) {
      console.error('Distressed properties search error:', error)
      return []
    }
  }
}

// Cached versions of key methods for performance
export const hcadApi = new HCADApiService()

export const searchHCADProperties = cache(hcadApi.searchProperties.bind(hcadApi))
export const getHCADProperty = cache(hcadApi.getPropertyByAccount.bind(hcadApi))
export const getAreaStats = cache(hcadApi.getAreaStats.bind(hcadApi))