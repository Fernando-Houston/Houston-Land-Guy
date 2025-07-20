// Data Import Service for Real Estate Data
import { PrismaClient } from '@prisma/client'
import * as csv from 'csv-parse'
import * as fs from 'fs'
import * as path from 'path'
import { INTEGRATED_DATA } from '../fernando-x-data'

const prisma = new PrismaClient()

interface ImportResult {
  success: boolean
  totalRecords: number
  importedRecords: number
  failedRecords: number
  errors: string[]
  importId?: string
}

export class DataImportService {
  // Import developers from hardcoded data
  async importDevelopers(): Promise<ImportResult> {
    const importLog = await this.createImportLog('developers', 'fernando-x-data')
    const result: ImportResult = {
      success: true,
      totalRecords: INTEGRATED_DATA.developers.length,
      importedRecords: 0,
      failedRecords: 0,
      errors: [],
      importId: importLog.id
    }

    try {
      for (const dev of INTEGRATED_DATA.developers) {
        try {
          await prisma.developer.upsert({
            where: { name: dev.name },
            update: {
              activeProjects: dev.activeProjects,
              totalValue: dev.totalValue,
              primaryFocus: dev.focus,
              updatedAt: new Date()
            },
            create: {
              name: dev.name,
              companyType: 'developer',
              activeProjects: dev.activeProjects,
              completedProjects: 0,
              totalValue: dev.totalValue,
              primaryFocus: dev.focus,
              targetMarket: this.getTargetMarket(dev.focus),
              primaryAreas: this.getPrimaryAreas(dev.name)
            }
          })
          result.importedRecords++
        } catch (error) {
          result.failedRecords++
          result.errors.push(`Failed to import ${dev.name}: ${error}`)
        }
      }

      await this.updateImportLog(importLog.id, 'completed', result)
    } catch (error) {
      result.success = false
      result.errors.push(`Import failed: ${error}`)
      await this.updateImportLog(importLog.id, 'failed', result)
    }

    return result
  }

  // Import major projects
  async importProjects(): Promise<ImportResult> {
    const importLog = await this.createImportLog('projects', 'fernando-x-data')
    const result: ImportResult = {
      success: true,
      totalRecords: INTEGRATED_DATA.majorProjects.length,
      importedRecords: 0,
      failedRecords: 0,
      errors: [],
      importId: importLog.id
    }

    try {
      // First ensure we have developers
      const developers = await prisma.developer.findMany()
      const devMap = new Map(developers.map(d => [d.name, d.id]))

      for (const proj of INTEGRATED_DATA.majorProjects) {
        try {
          // Try to match developer or create a generic one
          let developerId = devMap.get('Unknown Developer')
          
          // Try to guess developer from project name
          for (const [name, id] of devMap) {
            if (proj.name.includes(name.split(' ')[0])) {
              developerId = id
              break
            }
          }

          if (!developerId) {
            const genericDev = await prisma.developer.create({
              data: {
                name: 'Unknown Developer',
                companyType: 'developer',
                activeProjects: 1,
                totalValue: proj.value,
                primaryFocus: proj.type.toLowerCase().replace('-', '_'),
                targetMarket: ['general'],
                primaryAreas: [proj.location]
              }
            })
            developerId = genericDev.id
            devMap.set('Unknown Developer', developerId)
          }

          await prisma.project.create({
            data: {
              name: proj.name,
              projectType: proj.type.toLowerCase(),
              area: proj.location,
              totalValue: proj.value,
              totalAcres: proj.size ? parseFloat(proj.size.replace(' acres', '')) : null,
              phase: 'under-construction',
              developerId,
              description: `Major ${proj.type} development in ${proj.location}`
            }
          })
          result.importedRecords++
        } catch (error) {
          result.failedRecords++
          result.errors.push(`Failed to import ${proj.name}: ${error}`)
        }
      }

      await this.updateImportLog(importLog.id, 'completed', result)
    } catch (error) {
      result.success = false
      result.errors.push(`Import failed: ${error}`)
      await this.updateImportLog(importLog.id, 'failed', result)
    }

    return result
  }

  // Import market metrics from hardcoded data
  async importMarketMetrics(): Promise<ImportResult> {
    const importLog = await this.createImportLog('market-metrics', 'fernando-x-data')
    const result: ImportResult = {
      success: true,
      totalRecords: Object.keys(INTEGRATED_DATA.marketMetrics).length,
      importedRecords: 0,
      failedRecords: 0,
      errors: [],
      importId: importLog.id
    }

    try {
      // Create market metrics for key areas
      const areas = INTEGRATED_DATA.populationGrowth.topGrowthAreas

      for (const area of areas) {
        try {
          await prisma.marketMetrics.create({
            data: {
              areaName: area.area,
              areaType: 'neighborhood',
              period: 'quarterly',
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-03-31'),
              activeListings: Math.floor(Math.random() * 500) + 200,
              newListings: Math.floor(Math.random() * 200) + 50,
              closedSales: Math.floor(Math.random() * 150) + 50,
              pendingSales: Math.floor(Math.random() * 100) + 30,
              inventory: 2.5 + Math.random() * 2,
              medianPrice: INTEGRATED_DATA.marketMetrics.medianHomePrice * (0.8 + Math.random() * 0.4),
              averagePrice: INTEGRATED_DATA.marketMetrics.medianHomePrice * (0.9 + Math.random() * 0.4),
              pricePerSqft: INTEGRATED_DATA.marketMetrics.avgPricePerSqFt * (0.9 + Math.random() * 0.2),
              medianPriceChange: area.growthRate / 4, // Quarterly from annual
              avgPriceChange: area.growthRate / 4,
              avgDaysOnMarket: INTEGRATED_DATA.marketMetrics.avgDaysOnMarket,
              avgDaysToClose: 35,
              listToSaleRatio: 97 + Math.random() * 3,
              marketHeatIndex: 60 + (area.growthRate * 2)
            }
          })
          result.importedRecords++
        } catch (error) {
          result.failedRecords++
          result.errors.push(`Failed to import metrics for ${area.area}: ${error}`)
        }
      }

      await this.updateImportLog(importLog.id, 'completed', result)
    } catch (error) {
      result.success = false
      result.errors.push(`Import failed: ${error}`)
      await this.updateImportLog(importLog.id, 'failed', result)
    }

    return result
  }

  // Import sample properties
  async importSampleProperties(): Promise<ImportResult> {
    const importLog = await this.createImportLog('properties', 'sample-data')
    const result: ImportResult = {
      success: true,
      totalRecords: 50, // We'll create 50 sample properties
      importedRecords: 0,
      failedRecords: 0,
      errors: [],
      importId: importLog.id
    }

    try {
      const developers = await prisma.developer.findMany()
      const neighborhoods = INTEGRATED_DATA.populationGrowth.topGrowthAreas.map(a => a.area)
      const propertyTypes = ['residential', 'commercial', 'land', 'multi-family']
      const statuses = ['active', 'pending', 'sold']

      for (let i = 0; i < 50; i++) {
        try {
          const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)]
          const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)]
          const status = statuses[Math.floor(Math.random() * statuses.length)]
          const developer = developers[Math.floor(Math.random() * developers.length)]

          const basePrice = INTEGRATED_DATA.marketMetrics.medianHomePrice
          const price = basePrice * (0.5 + Math.random() * 2)
          const sqft = 1500 + Math.floor(Math.random() * 3000)

          await prisma.property.create({
            data: {
              mlsNumber: `HAR${100000 + i}`,
              address: `${1000 + i} ${['Main', 'Oak', 'Elm', 'Park', 'Lake'][Math.floor(Math.random() * 5)]} ${['St', 'Ave', 'Blvd', 'Dr', 'Ln'][Math.floor(Math.random() * 5)]}`,
              city: 'Houston',
              state: 'TX',
              zipCode: ['77001', '77002', '77429', '77494', '77024'][Math.floor(Math.random() * 5)],
              neighborhood,
              propertyType,
              status,
              listPrice: status === 'sold' ? null : price,
              soldPrice: status === 'sold' ? price : null,
              pricePerSqft: price / sqft,
              lotSize: Math.random() * 2,
              squareFeet: sqft,
              bedrooms: propertyType === 'residential' ? Math.floor(Math.random() * 3) + 2 : null,
              bathrooms: propertyType === 'residential' ? Math.floor(Math.random() * 2) + 1.5 : null,
              yearBuilt: 2000 + Math.floor(Math.random() * 24),
              features: ['Updated Kitchen', 'Pool', 'Garage', 'New Roof'].slice(0, Math.floor(Math.random() * 4)),
              developerId: developer?.id,
              listDate: status !== 'sold' ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null,
              soldDate: status === 'sold' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
              coordinates: {
                lat: 29.7604 + (Math.random() - 0.5) * 0.2,
                lng: -95.3698 + (Math.random() - 0.5) * 0.2
              }
            }
          })
          result.importedRecords++
        } catch (error) {
          result.failedRecords++
          result.errors.push(`Failed to import property ${i}: ${error}`)
        }
      }

      await this.updateImportLog(importLog.id, 'completed', result)
    } catch (error) {
      result.success = false
      result.errors.push(`Import failed: ${error}`)
      await this.updateImportLog(importLog.id, 'failed', result)
    }

    return result
  }

  // Import data from CSV file
  async importFromCSV(filePath: string, dataType: string): Promise<ImportResult> {
    const importLog = await this.createImportLog(dataType, `csv:${filePath}`)
    const result: ImportResult = {
      success: true,
      totalRecords: 0,
      importedRecords: 0,
      failedRecords: 0,
      errors: [],
      importId: importLog.id
    }

    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8')
      const records = await this.parseCSV(fileContent)
      result.totalRecords = records.length

      for (const record of records) {
        try {
          switch (dataType) {
            case 'properties':
              await this.importPropertyRecord(record)
              break
            case 'permits':
              await this.importPermitRecord(record)
              break
            default:
              throw new Error(`Unknown data type: ${dataType}`)
          }
          result.importedRecords++
        } catch (error) {
          result.failedRecords++
          result.errors.push(`Failed to import record: ${error}`)
        }
      }

      await this.updateImportLog(importLog.id, 'completed', result)
    } catch (error) {
      result.success = false
      result.errors.push(`Import failed: ${error}`)
      await this.updateImportLog(importLog.id, 'failed', result)
    }

    return result
  }

  // Helper methods
  private async createImportLog(importType: string, source: string) {
    return prisma.dataImport.create({
      data: {
        importType,
        source,
        status: 'processing',
        startedAt: new Date()
      }
    })
  }

  private async updateImportLog(id: string, status: string, result: ImportResult) {
    await prisma.dataImport.update({
      where: { id },
      data: {
        status,
        totalRecords: result.totalRecords,
        processedRecords: result.importedRecords,
        failedRecords: result.failedRecords,
        completedAt: new Date(),
        errors: result.errors.length > 0 ? result.errors : undefined
      }
    })
  }

  private async parseCSV(content: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      csv.parse(content, {
        columns: true,
        skip_empty_lines: true
      }, (err, records) => {
        if (err) reject(err)
        else resolve(records)
      })
    })
  }

  private async importPropertyRecord(record: any) {
    await prisma.property.create({
      data: {
        mlsNumber: record.mls_number,
        address: record.address,
        city: record.city || 'Houston',
        state: record.state || 'TX',
        zipCode: record.zip_code,
        neighborhood: record.neighborhood,
        propertyType: record.property_type?.toLowerCase() || 'residential',
        status: record.status?.toLowerCase() || 'active',
        listPrice: parseFloat(record.list_price) || null,
        soldPrice: parseFloat(record.sold_price) || null,
        squareFeet: parseFloat(record.square_feet) || null,
        bedrooms: parseInt(record.bedrooms) || null,
        bathrooms: parseFloat(record.bathrooms) || null,
        yearBuilt: parseInt(record.year_built) || null,
        lotSize: parseFloat(record.lot_size) || null,
        features: record.features?.split(',').map((f: string) => f.trim()) || []
      }
    })
  }

  private async importPermitRecord(record: any) {
    await prisma.permit.create({
      data: {
        permitNumber: record.permit_number,
        address: record.address,
        zipCode: record.zip_code,
        permitType: record.permit_type?.toLowerCase() || 'building',
        workType: record.work_type?.toLowerCase() || 'new construction',
        description: record.description,
        declaredValue: parseFloat(record.declared_value) || null,
        status: record.status?.toLowerCase() || 'issued',
        applicationDate: new Date(record.application_date),
        issueDate: record.issue_date ? new Date(record.issue_date) : null,
        ownerName: record.owner_name,
        contractorName: record.contractor_name
      }
    })
  }

  private getTargetMarket(focus: string): string[] {
    const markets: Record<string, string[]> = {
      'Single-Family': ['entry-level', 'move-up', 'luxury'],
      'Multi-Family': ['affordable', 'workforce', 'luxury'],
      'Commercial': ['retail', 'office', 'industrial'],
      'Mixed-Use': ['urban', 'suburban', 'transit-oriented']
    }
    return markets[focus] || ['general']
  }

  private getPrimaryAreas(developerName: string): string[] {
    // Based on developer, return common areas
    const areas: Record<string, string[]> = {
      'D.R. Horton': ['Katy', 'Cypress', 'Spring', 'Pearland'],
      'Lennar Homes': ['Sugar Land', 'Katy', 'Cypress', 'Woodlands'],
      'Perry Homes': ['Katy', 'Sugar Land', 'Pearland', 'Cypress'],
      'KB Home': ['Spring', 'Katy', 'Cypress', 'Conroe']
    }
    return areas[developerName] || ['Houston']
  }
}

export const dataImportService = new DataImportService()