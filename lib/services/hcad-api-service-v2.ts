// HCAD (Harris County Appraisal District) API Service V2
// Updated with correct HCAD public data endpoints
import { PrismaClient } from '@prisma/client'
import { cache } from 'react'

const prisma = new PrismaClient()

// HCAD uses Socrata Open Data API
const HCAD_DATA_URL = 'https://publicdata.hcad.org/resource'
const REAL_PROPERTY_DATASET = 'sh2p-qp6k' // Real Property Account Information
const BUILDING_DATASET = 'p8vj-jz5p' // Building Information  
const PARCEL_DATASET = 'h7bi-cu88' // Parcel Information

interface HCADSearchParams {
  account?: string
  owner?: string
  address?: string
  zipCode?: string
  limit?: number
  offset?: number
}

interface HCADPropertyData {
  account: string
  condo_flag?: string
  county?: string
  dba?: string
  hcad_num?: string
  land_acres?: string
  land_sqft?: string
  legal_class_code?: string
  neighborhood_code?: string
  neighborhood_factor?: string
  new_construction?: string
  owner_name?: string
  percent_ownership?: string
  property_use_code?: string
  situs_city?: string
  situs_num?: string
  situs_state?: string
  situs_street_pfx?: string
  situs_street?: string
  situs_street_sfx?: string
  situs_unit?: string
  situs_zip?: string
  tax_district?: string
  total_appraised_value?: string
  total_building_area?: string
  total_land_area?: string
  total_market_value?: string
  year?: string
}

interface HCADBuildingData {
  account: string
  building_number?: string
  building_style_code?: string
  building_value?: string
  cdu_value?: string
  depreciation_value?: string
  extra_features_value?: string
  impr_type?: string
  impr_value?: string
  imprv_state_cd?: string
  rcn_value?: string
  year_built?: string
}

export class HCADApiServiceV2 {
  private async fetchFromSocrata(dataset: string, params: URLSearchParams): Promise<any[]> {
    try {
      const url = `${HCAD_DATA_URL}/${dataset}.json?${params.toString()}`
      console.log('Fetching from:', url)
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'X-App-Token': process.env.SOCRATA_APP_TOKEN || '', // Optional but recommended
        }
      })
      
      if (!response.ok) {
        console.error('Socrata API error:', response.status, response.statusText)
        const text = await response.text()
        console.error('Response:', text)
        return []
      }
      
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Socrata fetch error:', error)
      return []
    }
  }

  // Search properties by various criteria
  async searchProperties(params: HCADSearchParams): Promise<HCADPropertyData[]> {
    try {
      const queryParams = new URLSearchParams()
      
      // Build SoQL query
      const whereConditions: string[] = []
      
      if (params.account) {
        whereConditions.push(`account='${params.account}'`)
      }
      if (params.owner) {
        whereConditions.push(`owner_name like '%${params.owner.toUpperCase()}%'`)
      }
      if (params.address) {
        whereConditions.push(`situs_street like '%${params.address.toUpperCase()}%'`)
      }
      if (params.zipCode) {
        whereConditions.push(`situs_zip='${params.zipCode}'`)
      }
      
      if (whereConditions.length > 0) {
        queryParams.append('$where', whereConditions.join(' AND '))
      }
      
      queryParams.append('$limit', (params.limit || 100).toString())
      if (params.offset) {
        queryParams.append('$offset', params.offset.toString())
      }
      
      return await this.fetchFromSocrata(REAL_PROPERTY_DATASET, queryParams)
    } catch (error) {
      console.error('HCAD search error:', error)
      return []
    }
  }

  // Get detailed property information by account number
  async getPropertyByAccount(accountNumber: string): Promise<HCADPropertyData | null> {
    try {
      const queryParams = new URLSearchParams({
        account: accountNumber,
        '$limit': '1'
      })
      
      const results = await this.fetchFromSocrata(REAL_PROPERTY_DATASET, queryParams)
      return results.length > 0 ? results[0] : null
    } catch (error) {
      console.error('HCAD property error:', error)
      return null
    }
  }

  // Get building information for a property
  async getBuildingInfo(accountNumber: string): Promise<HCADBuildingData[]> {
    try {
      const queryParams = new URLSearchParams({
        account: accountNumber
      })
      
      return await this.fetchFromSocrata(BUILDING_DATASET, queryParams)
    } catch (error) {
      console.error('HCAD building info error:', error)
      return []
    }
  }

  // Get parcel information
  async getParcelInfo(accountNumber: string): Promise<any> {
    try {
      const queryParams = new URLSearchParams({
        account: accountNumber,
        '$limit': '1'
      })
      
      const results = await this.fetchFromSocrata(PARCEL_DATASET, queryParams)
      return results.length > 0 ? results[0] : null
    } catch (error) {
      console.error('HCAD parcel info error:', error)
      return null
    }
  }

  // Import HCAD property data into our database
  async importPropertyToDatabase(accountNumber: string): Promise<boolean> {
    try {
      const [propertyData, buildingData] = await Promise.all([
        this.getPropertyByAccount(accountNumber),
        this.getBuildingInfo(accountNumber)
      ])
      
      if (!propertyData) return false
      
      // Build full address
      const address = [
        propertyData.situs_num,
        propertyData.situs_street_pfx,
        propertyData.situs_street,
        propertyData.situs_street_sfx,
        propertyData.situs_unit
      ].filter(Boolean).join(' ').trim()
      
      // Get building info if available
      const primaryBuilding = buildingData[0]
      
      // Transform HCAD data to our schema
      const property = {
        accountNumber: propertyData.account,
        propertyId: propertyData.hcad_num,
        geoId: propertyData.neighborhood_code,
        siteAddress: address,
        city: propertyData.situs_city || 'Houston',
        zipCode: propertyData.situs_zip || '',
        legalDescription: `${propertyData.legal_class_code || ''} - ${propertyData.neighborhood_code || ''}`,
        ownerName: propertyData.owner_name || '',
        ownerAddress: propertyData.dba,
        landArea: propertyData.land_sqft ? parseFloat(propertyData.land_sqft) : null,
        buildingArea: propertyData.total_building_area ? parseFloat(propertyData.total_building_area) : null,
        yearBuilt: primaryBuilding?.year_built ? parseInt(primaryBuilding.year_built) : null,
        propertyType: propertyData.property_use_code || 'Unknown',
        propertyClass: propertyData.legal_class_code,
        landValue: 0, // Would need separate value dataset
        improvementValue: primaryBuilding?.building_value ? parseFloat(primaryBuilding.building_value) : 0,
        totalMarketValue: propertyData.total_market_value ? parseFloat(propertyData.total_market_value) : 0,
        totalAppraisedValue: propertyData.total_appraised_value ? parseFloat(propertyData.total_appraised_value) : 0,
        taxableValue: 0, // Would need tax dataset
        taxes: 0, // Would need tax dataset
        taxYear: propertyData.year ? parseInt(propertyData.year) : new Date().getFullYear(),
        zoningCode: propertyData.property_use_code,
        neighborhoods: [propertyData.neighborhood_code].filter(Boolean),
        lastSaleDate: null, // Would need sales dataset
        lastSaleAmount: null,
        lastUpdated: new Date()
      }
      
      // Upsert to database
      await prisma.hCADProperty.upsert({
        where: { accountNumber: property.accountNumber },
        update: property,
        create: property
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
      
      // Process in batches of 10 to avoid rate limits
      const batchSize = 10
      for (let i = 0; i < properties.length; i += batchSize) {
        const batch = properties.slice(i, i + batchSize)
        
        await Promise.all(
          batch.map(async (prop) => {
            const success = await this.importPropertyToDatabase(prop.account)
            if (success) {
              imported++
            } else {
              failed++
            }
          })
        )
        
        // Small delay between batches
        if (i + batchSize < properties.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
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

  // Get aggregated stats for an area using Socrata's aggregation
  async getAreaStats(zipCode: string): Promise<{
    totalProperties: number
    avgMarketValue: number
    medianMarketValue: number
    totalMarketValue: number
    avgBuildingArea: number
  } | null> {
    try {
      const queryParams = new URLSearchParams({
        '$select': 'count(account) as total_properties, avg(total_market_value) as avg_market_value, sum(total_market_value) as total_market_value, avg(total_building_area) as avg_building_area',
        '$where': `situs_zip='${zipCode}' AND total_market_value > 0`
      })
      
      const results = await this.fetchFromSocrata(REAL_PROPERTY_DATASET, queryParams)
      
      if (results.length === 0) return null
      
      const stats = results[0]
      
      // For median, we need a separate query
      const medianParams = new URLSearchParams({
        '$select': 'total_market_value',
        '$where': `situs_zip='${zipCode}' AND total_market_value > 0`,
        '$order': 'total_market_value',
        '$limit': '5000'
      })
      
      const properties = await this.fetchFromSocrata(REAL_PROPERTY_DATASET, medianParams)
      const values = properties.map(p => parseFloat(p.total_market_value)).filter(v => v > 0)
      const median = values.length > 0 ? values[Math.floor(values.length / 2)] : 0
      
      return {
        totalProperties: parseInt(stats.total_properties),
        avgMarketValue: parseFloat(stats.avg_market_value),
        medianMarketValue: median,
        totalMarketValue: parseFloat(stats.total_market_value),
        avgBuildingArea: parseFloat(stats.avg_building_area)
      }
    } catch (error) {
      console.error('Area stats error:', error)
      return null
    }
  }
}

// Cached versions of key methods for performance
export const hcadApiV2 = new HCADApiServiceV2()

export const searchHCADPropertiesV2 = cache(hcadApiV2.searchProperties.bind(hcadApiV2))
export const getHCADPropertyV2 = cache(hcadApiV2.getPropertyByAccount.bind(hcadApiV2))
export const getAreaStatsV2 = cache(hcadApiV2.getAreaStats.bind(hcadApiV2))