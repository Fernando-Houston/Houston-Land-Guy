// Houston P-Data Excel Import Service
// Imports property data from Excel files in HOuston Pdata folder
import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

export class HoustonPDataImportService {
  private basePath = path.join(process.cwd(), 'Core Agent Architecture -Webiste', 'HOuston Pdata')

  async importAll() {
    console.log('🏠 Starting Houston P-Data Excel Import...')
    
    const results = {
      laraProperties: await this.importLaraProperties(),
      taxRolls: await this.importTaxRolls(),
      cipListing: await this.importCIPListing(),
      parkingAreas: await this.importParkingAreas(),
      laganKnowledge: await this.importLaganKnowledge()
    }
    
    console.log('✅ Houston P-Data Import Completed')
    return results
  }

  async importLaraProperties() {
    console.log('📋 Importing LARA Properties (2015 Lots)...')
    
    try {
      const filePath = path.join(this.basePath, 'lara-lots-for-sale-2015.xlsx')
      if (!fs.existsSync(filePath)) {
        return { imported: 0, failed: 0, errors: ['File not found'] }
      }

      const workbook = XLSX.readFile(filePath)
      const sheet = workbook.Sheets['LARA Lots 2015']
      const data = XLSX.utils.sheet_to_json(sheet)

      let imported = 0
      let failed = 0
      const errors: string[] = []

      for (const record of data as any[]) {
        try {
          // Handle the actual LARA data structure
          const address = this.safeString(record.Address)
          const zipCode = this.safeString(record.Zipcode) || '77001'
          
          if (!address || address === '0' || address.startsWith('0 ')) {
            // Skip properties with invalid addresses
            continue
          }

          const propertyData = {
            // Core Property fields (matching schema)
            address: address,
            city: 'Houston',
            state: 'TX',
            zipCode: String(zipCode),
            neighborhood: this.safeString(record['Hope Area']),
            county: 'Harris',
            
            // Property details matching schema
            propertyType: this.safeString(record['Lot Use Description']) || 'land',
            propertySubType: 'vacant-lot',
            status: 'available',
            
            // Financial data
            listPrice: this.safeFloat(record['RFP Price']), // Request for Proposal price
            
            // Size - convert sqft to acres for lotSize (schema expects acres)
            lotSize: this.safeFloat(record['Land SQFT']) ? this.safeFloat(record['Land SQFT'])! / 43560 : null,
            
            // Features array for additional data
            features: [
              `Hope Area: ${this.safeString(record['Hope Area']) || 'Unknown'}`,
              `Subdivision: ${this.safeString(record.Subdivision) || 'None'}`,
              `Legal: ${this.safeString(record['Legal Description']) || 'N/A'}`,
              `Dimensions: ${this.safeString(record.Dimensions) || 'N/A'}`,
              `Keymap: ${this.safeString(record.Keymap) || 'N/A'}`,
              `HCAD#: ${this.safeString(record['HCAD#']) || 'N/A'}`,
              `COH#: ${this.safeInt(record['COH#']) || 'N/A'}`
            ].filter(f => !f.includes('N/A') && !f.includes('Unknown') && !f.includes('None')),
            
            amenities: ['Government-owned', 'Redevelopment opportunity'],
            
            // Historic date
            listDate: new Date('2015-01-01')
          }

          // Check if property already exists by address
          const existingProperty = await prisma.property.findFirst({
            where: {
              address: propertyData.address,
              city: propertyData.city,
              zipCode: propertyData.zipCode
            }
          })

          if (existingProperty) {
            // Update existing property
            await prisma.property.update({
              where: { id: existingProperty.id },
              data: propertyData
            })
          } else {
            // Create new property
            await prisma.property.create({
              data: propertyData
            })
          }
          imported++
        } catch (error) {
          console.error('Error importing LARA property:', error)
          failed++
          errors.push(`LARA Property: ${error}`)
        }
      }

      return { imported, failed, errors }
    } catch (error) {
      console.error('Error reading LARA properties file:', error)
      return { imported: 0, failed: 0, errors: [`File error: ${error}`] }
    }
  }

  async importTaxRolls() {
    console.log('📊 Importing Tax Roll Metadata...')
    
    try {
      const filePath = path.join(this.basePath, 'metadata-for-city-of-houston-tax-rolls.xlsx')
      if (!fs.existsSync(filePath)) {
        return { imported: 0, failed: 0, errors: ['File not found'] }
      }

      const workbook = XLSX.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(sheet)

      let imported = 0
      let failed = 0
      const errors: string[] = []

      for (const record of data as any[]) {
        try {
          const propertyData = {
            // Property identification
            address: this.safeString(record.PROPERTY_ADDRESS || record.Address || record.SITE_ADDR) || 'Unknown Address',
            city: 'Houston',
            state: 'TX', 
            zipCode: this.safeString(record.ZIP_CODE || record.Zip || record.POSTAL_CODE) || '77001',
            
            // Tax information
            propertyType: this.safeString(record.PROPERTY_TYPE || record.USE_CODE_DESC) || 'Residential',
            taxValue: this.safeFloat(record.APPRAISED_VALUE || record.TOTAL_APPRAISED_VALUE),
            marketValue: this.safeFloat(record.MARKET_VALUE || record.LAND_VALUE + record.IMPROVEMENT_VALUE),
            landValue: this.safeFloat(record.LAND_VALUE),
            improvementValue: this.safeFloat(record.IMPROVEMENT_VALUE),
            
            // Property details
            lotSize: this.safeFloat(record.LOT_SIZE || record.ACREAGE),
            buildingSize: this.safeFloat(record.LIVING_AREA || record.BUILDING_SIZE),
            yearBuilt: this.safeInt(record.YEAR_BUILT || record.EFFECTIVE_YEAR_BUILT),
            
            // Tax data
            exemptions: this.safeString(record.EXEMPTIONS),
            taxDistrict: this.safeString(record.TAX_DISTRICT),
            
            // Status and source
            propertyStatus: 'Active',
            dataSource: 'Houston Tax Rolls',
            lastUpdated: new Date(),
            
            // Owner information
            ownerName: this.safeString(record.OWNER_NAME || record.PROPERTY_OWNER),
            ownerAddress: this.safeString(record.OWNER_ADDRESS || record.MAILING_ADDR),
            
            // Geographic data
            parcelNumber: this.safeString(record.PARCEL_ID || record.PARCEL_NUMBER),
            legalDescription: this.safeString(record.LEGAL_DESC || record.LEGAL_DESCRIPTION)
          }

          if (propertyData.address && propertyData.address !== 'Unknown Address') {
            await prisma.property.upsert({
              where: { address_city_zipCode: { 
                address: propertyData.address, 
                city: propertyData.city, 
                zipCode: propertyData.zipCode 
              }},
              update: propertyData,
              create: propertyData
            })
            imported++
          }
        } catch (error) {
          console.error('Error importing tax roll property:', error)
          failed++
          errors.push(`Tax Roll: ${error}`)
        }
      }

      return { imported, failed, errors }
    } catch (error) {
      console.error('Error reading tax rolls file:', error)
      return { imported: 0, failed: 0, errors: [`File error: ${error}`] }
    }
  }

  async importCIPListing() {
    console.log('🏗️ Importing CIP (Capital Improvement Program) Listings...')
    
    try {
      const filePath = path.join(this.basePath, 'open-data-summary-cip-listing-fy17-21-adopted-cip.xlsx')
      if (!fs.existsSync(filePath)) {
        return { imported: 0, failed: 0, errors: ['File not found'] }
      }

      const workbook = XLSX.readFile(filePath)
      const sheet = workbook.Sheets['CIP Summary']
      const data = XLSX.utils.sheet_to_json(sheet)

      let imported = 0
      let failed = 0
      const errors: string[] = []

      // Skip the first row which is headers, and process actual data rows
      for (let i = 1; i < data.length; i++) {
        const record = data[i] as any
        
        try {
          // Use the correct field names from the actual data structure
          const location = this.safeString(record.__EMPTY_3) // Location column
          const description = this.safeString(record.__EMPTY_4) // Project Description
          const zipCode = this.safeString(record.__EMPTY_11) // Zip Code column
          const total = this.safeFloat(record.__EMPTY_12) // Total cost
          
          if (location && location !== 'Location' && location !== 'N/A') {
            const propertyData = {
              address: location,
              city: 'Houston',
              state: 'TX',
              zipCode: zipCode || '77001',
              county: 'Harris',
              
              propertyType: 'infrastructure',
              propertySubType: 'cip-project',
              status: 'planned',
              
              // CIP Financial data
              listPrice: total,
              
              // Features array for CIP-specific data (including description)
              features: [
                `CIP No: ${this.safeString(record.__EMPTY) || 'N/A'}`,
                `Project: ${this.safeString(record.__EMPTY_1) || 'N/A'}`,
                `Start Year: ${this.safeString(record.__EMPTY_6) || 'N/A'}`,
                `Council District: ${this.safeString(record.__EMPTY_7) || 'N/A'}`,
                `Description: ${description || 'Houston CIP Project'}`
              ].filter(f => !f.includes('N/A')),
              
              amenities: ['Government-owned', 'Capital Improvement Project'],
              
              // Historic planning date
              listDate: new Date('2017-01-01')
            }

            // Check if property already exists
            const existingProperty = await prisma.property.findFirst({
              where: {
                address: propertyData.address,
                city: propertyData.city,
                zipCode: propertyData.zipCode
              }
            })

            if (existingProperty) {
              await prisma.property.update({
                where: { id: existingProperty.id },
                data: propertyData
              })
            } else {
              await prisma.property.create({
                data: propertyData
              })
            }
            imported++
          }
        } catch (error) {
          console.error('Error importing CIP project:', error)
          failed++
          errors.push(`CIP: ${error}`)
        }
      }

      return { imported, failed, errors }
    } catch (error) {
      console.error('Error reading CIP file:', error)
      return { imported: 0, failed: 0, errors: [`File error: ${error}`] }
    }
  }

  async importParkingAreas() {
    console.log('🅿️ Importing Parking Areas...')
    
    try {
      const filePath = path.join(this.basePath, 'residentialparkingareas.xls')
      if (!fs.existsSync(filePath)) {
        return { imported: 0, failed: 0, errors: ['File not found'] }
      }

      const workbook = XLSX.readFile(filePath)
      const sheet = workbook.Sheets['Approved']
      const data = XLSX.utils.sheet_to_json(sheet)

      let imported = 0
      let failed = 0
      const errors: string[] = []

      for (const record of data as any[]) {
        try {
          // Build address from Block and Street
          const block = this.safeString(record.Block)
          const street = this.safeString(record.Street)
          
          if (block && street) {
            const address = `${block} ${street}`
            
            const propertyData = {
              address: address,
              city: 'Houston',
              state: 'TX',
              zipCode: String(record.Zip || '77001'),
              county: 'Harris',
              
              propertyType: 'parking',
              propertySubType: 'residential-parking',
              status: 'active',
              
              // Features for parking-specific data
              features: [
                `Time: ${this.safeString(record.Time) || 'N/A'}`,
                `Days: ${this.safeString(record.Days) || 'N/A'}`,
                `Council District: ${this.safeString(record['Council District']) || 'N/A'}`,
                `Super Neighborhood: ${record['Super Neighborhood'] || 'N/A'}`
              ].filter(f => !f.includes('N/A')),
              
              amenities: ['Residential parking', 'Time-restricted'],
              
              // Parse effective date (Excel date format) - safer handling
              listDate: (() => {
                try {
                  if (record['Effective Date'] && typeof record['Effective Date'] === 'number') {
                    return new Date((record['Effective Date'] - 25569) * 86400 * 1000)
                  }
                  return new Date('2020-01-01')
                } catch {
                  return new Date('2020-01-01')
                }
              })()
            }

            // Check if property already exists
            const existingProperty = await prisma.property.findFirst({
              where: {
                address: propertyData.address,
                city: propertyData.city,
                zipCode: propertyData.zipCode
              }
            })

            if (existingProperty) {
              await prisma.property.update({
                where: { id: existingProperty.id },
                data: propertyData
              })
            } else {
              await prisma.property.create({
                data: propertyData
              })
            }
            imported++
          }
        } catch (error) {
          console.error('Error importing parking area:', error)
          failed++
          errors.push(`Parking: ${error}`)
        }
      }

      return { imported, failed, errors }
    } catch (error) {
      console.error('Error reading parking areas file:', error)
      return { imported: 0, failed: 0, errors: [`File error: ${error}`] }
    }
  }

  async importLaganKnowledge() {
    console.log('📚 Importing Lagan Knowledge Data...')
    
    try {
      const filePath = path.join(this.basePath, 'laganknowledge-04062017.xlsx')
      if (!fs.existsSync(filePath)) {
        return { imported: 0, failed: 0, errors: ['File not found'] }
      }

      const workbook = XLSX.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(sheet)

      let imported = 0
      let failed = 0
      const errors: string[] = []

      // Lagan typically contains permit and code enforcement data
      for (const record of data as any[]) {
        try {
          const address = this.safeString(record.ADDRESS || record.PROPERTY_ADDRESS || record.SITE_ADDRESS)
          
          if (address && address !== 'Unknown Address') {
            const propertyData = {
              address: address,
              city: 'Houston', 
              state: 'TX',
              zipCode: this.safeString(record.ZIP_CODE || record.Zip) || '77001',
              
              propertyType: this.safeString(record.PROPERTY_TYPE || record.USE_TYPE) || 'Residential',
              
              // Status and source
              propertyStatus: this.safeString(record.STATUS) || 'Active',
              dataSource: 'Lagan Knowledge System',
              lastUpdated: new Date('2017-04-06'), // Based on filename date
              
              // Permit/Code data
              description: this.safeString(record.DESCRIPTION || record.CASE_DESCRIPTION),
              
              // Case information
              caseNumber: this.safeString(record.CASE_NUMBER || record.CASE_ID),
              caseType: this.safeString(record.CASE_TYPE || record.TYPE),
              
              // Location data
              parcelNumber: this.safeString(record.PARCEL_ID || record.PARCEL),
              
              // Additional details
              department: this.safeString(record.DEPARTMENT || record.RESPONSIBLE_DEPT),
              inspector: this.safeString(record.INSPECTOR || record.ASSIGNED_TO)
            }

            await prisma.property.upsert({
              where: { address_city_zipCode: { 
                address: propertyData.address, 
                city: propertyData.city, 
                zipCode: propertyData.zipCode 
              }},
              update: propertyData,
              create: propertyData
            })
            imported++
          }
        } catch (error) {
          console.error('Error importing Lagan record:', error)
          failed++
          errors.push(`Lagan: ${error}`)
        }
      }

      return { imported, failed, errors }
    } catch (error) {
      console.error('Error reading Lagan file:', error)
      return { imported: 0, failed: 0, errors: [`File error: ${error}`] }
    }
  }

  // Helper methods
  private safeString(value: any): string | null {
    if (value === undefined || value === null || value === '' || value === 'N/A') return null
    return String(value).trim()
  }

  private safeInt(value: any): number | null {
    if (value === undefined || value === null || value === '') return null
    const parsed = parseInt(String(value).replace(/[^0-9-]/g, ''))
    return isNaN(parsed) ? null : parsed
  }

  private safeFloat(value: any): number | null {
    if (value === undefined || value === null || value === '') return null
    const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ''))
    return isNaN(parsed) ? null : parsed
  }
}

export const houstonPDataImport = new HoustonPDataImportService()