// HCAD Web Scraper Service
// Since HCAD doesn't provide a public API, we'll scrape their public website
import { PrismaClient } from '@prisma/client'
import * as cheerio from 'cheerio'

const prisma = new PrismaClient()
const HCAD_BASE_URL = 'https://public.hcad.org/records/Real.asp'

interface HCADPropertyData {
  accountNumber: string
  ownerName?: string
  siteAddress?: string
  mailingAddress?: string
  propertyType?: string
  yearBuilt?: number
  buildingArea?: number
  landArea?: number
  landValue?: number
  improvementValue?: number
  marketValue?: number
  appraisedValue?: number
  taxableValue?: number
  lastSaleDate?: string
  lastSaleAmount?: number
  legalDescription?: string
  neighborhoods?: string[]
}

export class HCADWebScraper {
  // Fetch property data by account number
  async getPropertyByAccount(accountNumber: string): Promise<HCADPropertyData | null> {
    try {
      // Fetch the property page
      const response = await fetch(`${HCAD_BASE_URL}?acct=${accountNumber}&taxyear=2025`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; HoustonDevelopmentIntelligence/1.0)'
        }
      })
      
      if (!response.ok) {
        console.error('HCAD fetch error:', response.status)
        return null
      }
      
      const html = await response.text()
      
      // Parse the HTML
      const $ = cheerio.load(html)
      
      // Extract property data from the HTML
      const propertyData: HCADPropertyData = {
        accountNumber: accountNumber
      }
      
      // Look for common patterns in HCAD pages
      // Owner information
      const ownerText = $('td:contains("Owner Name")').next().text().trim()
      if (ownerText) propertyData.ownerName = ownerText
      
      // Property address
      const addressText = $('td:contains("Property Address")').next().text().trim()
      if (addressText) propertyData.siteAddress = addressText
      
      // Values - typically in a table
      $('table').each((i, table) => {
        const $table = $(table)
        
        // Look for value table
        if ($table.text().includes('Land Value') || $table.text().includes('Improvement Value')) {
          // Extract values
          const landValueText = $table.find('td:contains("Land Value")').next().text()
          const improvementValueText = $table.find('td:contains("Improvement Value")').next().text()
          const marketValueText = $table.find('td:contains("Market Value")').next().text()
          
          propertyData.landValue = this.parseValue(landValueText)
          propertyData.improvementValue = this.parseValue(improvementValueText)
          propertyData.marketValue = this.parseValue(marketValueText)
        }
      })
      
      // Building details
      const yearBuiltText = $('td:contains("Year Built")').next().text().trim()
      if (yearBuiltText) propertyData.yearBuilt = parseInt(yearBuiltText)
      
      const buildingAreaText = $('td:contains("Building Area")').next().text().trim()
      if (buildingAreaText) propertyData.buildingArea = parseInt(buildingAreaText.replace(/,/g, ''))
      
      return propertyData
      
    } catch (error) {
      console.error('HCAD scraping error:', error)
      return null
    }
  }
  
  // Parse value from text (removes $, commas, etc.)
  private parseValue(text: string): number {
    if (!text) return 0
    const cleaned = text.replace(/[$,]/g, '').trim()
    const value = parseInt(cleaned)
    return isNaN(value) ? 0 : value
  }
  
  // Import scraped data to database
  async importPropertyToDatabase(accountNumber: string): Promise<boolean> {
    try {
      const propertyData = await this.getPropertyByAccount(accountNumber)
      if (!propertyData) return false
      
      // Transform to our database schema
      const dbData = {
        accountNumber: propertyData.accountNumber,
        ownerName: propertyData.ownerName || '',
        siteAddress: propertyData.siteAddress || '',
        city: 'Houston', // Default for Harris County
        zipCode: '', // Would need to extract from address
        propertyType: propertyData.propertyType || 'Unknown',
        yearBuilt: propertyData.yearBuilt,
        buildingArea: propertyData.buildingArea,
        landArea: propertyData.landArea,
        landValue: propertyData.landValue || 0,
        improvementValue: propertyData.improvementValue || 0,
        totalMarketValue: propertyData.marketValue || 0,
        totalAppraisedValue: propertyData.appraisedValue || propertyData.marketValue || 0,
        taxableValue: propertyData.taxableValue || propertyData.marketValue || 0,
        taxes: 0, // Would need tax rate to calculate
        taxYear: 2025,
        lastUpdated: new Date()
      }
      
      // Upsert to database
      await prisma.hCADProperty.upsert({
        where: { accountNumber: dbData.accountNumber },
        update: dbData,
        create: dbData
      })
      
      return true
    } catch (error) {
      console.error('Import error:', error)
      return false
    }
  }
  
  // Search by owner name (would need to use HCAD's search form)
  async searchByOwner(ownerName: string): Promise<string[]> {
    // This would need to submit the search form and parse results
    // For now, return empty array as this requires more complex scraping
    console.log('Owner search not yet implemented for web scraping')
    return []
  }
}

export const hcadScraper = new HCADWebScraper()