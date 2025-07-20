// Houston City Data Service - Processes HOuston Pdata
// This service handles LARA properties, tax rolls, CIP projects, and other city data

export interface LARAProperty {
  propertyId: string
  address: string
  zipCode: string
  neighborhood: string
  lotSize: number
  zoning: string
  status: 'available' | 'pending' | 'sold'
  price?: number
  description?: string
  yearAcquired?: number
  intendedUse?: string
}

export interface CIPProject {
  projectId: string
  projectName: string
  department: string
  projectType: string
  totalBudget: number
  fundingSources: string[]
  status: 'planning' | 'design' | 'construction' | 'completed'
  startYear: number
  completionYear: number
  location: string
  description: string
  impact: string[]
}

export interface TaxRollMetadata {
  taxYear: number
  totalParcels: number
  totalAssessedValue: number
  averageValue: number
  medianValue: number
  taxRate: number
  exemptions: {
    homestead: number
    senior: number
    disabled: number
    veteran: number
  }
}

export interface ResidentialParkingArea {
  areaId: string
  neighborhood: string
  streets: string[]
  totalSpaces: number
  permitRequired: boolean
  restrictions: string[]
  enforcementHours: string
}

class HoustonCityDataService {
  // LARA (Land Assembly Redevelopment Authority) Properties
  // These are city-owned properties available for development
  private static readonly LARA_PROPERTIES: LARAProperty[] = [
    {
      propertyId: 'LARA-001',
      address: '3815 Dowling St',
      zipCode: '77004',
      neighborhood: 'Third Ward',
      lotSize: 7500,
      zoning: 'Residential',
      status: 'available',
      price: 45000,
      description: 'Vacant lot suitable for single-family development',
      yearAcquired: 2018,
      intendedUse: 'Affordable housing development'
    },
    {
      propertyId: 'LARA-002',
      address: '2912 Sampson St',
      zipCode: '77004',
      neighborhood: 'Third Ward',
      lotSize: 12000,
      zoning: 'Mixed-Use',
      status: 'available',
      price: 85000,
      description: 'Corner lot with commercial potential',
      yearAcquired: 2019,
      intendedUse: 'Mixed-use development'
    },
    {
      propertyId: 'LARA-003',
      address: '5421 Lyons Ave',
      zipCode: '77020',
      neighborhood: 'Fifth Ward',
      lotSize: 15000,
      zoning: 'Commercial',
      status: 'pending',
      price: 125000,
      description: 'Former commercial site ready for redevelopment',
      yearAcquired: 2020,
      intendedUse: 'Community retail center'
    },
    {
      propertyId: 'LARA-004',
      address: '3102 Ennis St',
      zipCode: '77004',
      neighborhood: 'Third Ward',
      lotSize: 6000,
      zoning: 'Residential',
      status: 'available',
      price: 35000,
      description: 'Infill lot in historic neighborhood',
      yearAcquired: 2021,
      intendedUse: 'Single-family home'
    },
    {
      propertyId: 'LARA-005',
      address: '7819 Sherman St',
      zipCode: '77012',
      neighborhood: 'East End',
      lotSize: 10000,
      zoning: 'Residential',
      status: 'available',
      price: 55000,
      description: 'Large lot near new Metro rail line',
      yearAcquired: 2022,
      intendedUse: 'Transit-oriented development'
    }
  ]

  // Capital Improvement Projects (CIP) FY2017-2021
  private static readonly CIP_PROJECTS: CIPProject[] = [
    {
      projectId: 'CIP-001',
      projectName: 'Buffalo Bayou Park Extension',
      department: 'Parks and Recreation',
      projectType: 'Parks/Greenspace',
      totalBudget: 25000000,
      fundingSources: ['General Fund', 'TIRZ', 'Private Donations'],
      status: 'construction',
      startYear: 2019,
      completionYear: 2025,
      location: 'East End/Fifth Ward',
      description: 'Extension of Buffalo Bayou Park trails and amenities eastward',
      impact: ['Flood mitigation', 'Recreation', 'Property values', 'Tourism']
    },
    {
      projectId: 'CIP-002',
      projectName: 'North Houston Highway Improvement',
      department: 'Public Works',
      projectType: 'Transportation',
      totalBudget: 75000000,
      fundingSources: ['Federal Highway', 'State', 'City'],
      status: 'design',
      startYear: 2021,
      completionYear: 2027,
      location: 'North Houston/I-45 Corridor',
      description: 'Major freeway reconstruction and expansion',
      impact: ['Traffic flow', 'Economic development', 'Air quality']
    },
    {
      projectId: 'CIP-003',
      projectName: 'Midtown Drainage Improvements',
      department: 'Public Works',
      projectType: 'Drainage',
      totalBudget: 45000000,
      fundingSources: ['Drainage Fee', 'Federal Grants'],
      status: 'construction',
      startYear: 2020,
      completionYear: 2024,
      location: 'Midtown District',
      description: 'Storm sewer upgrades and detention facilities',
      impact: ['Flood prevention', 'Public safety', 'Development potential']
    },
    {
      projectId: 'CIP-004',
      projectName: 'Heights Hike and Bike Trail Phase 3',
      department: 'Parks and Recreation',
      projectType: 'Transportation/Recreation',
      totalBudget: 12000000,
      fundingSources: ['TIRZ 5', 'Parks Fund', 'TxDOT'],
      status: 'completed',
      startYear: 2018,
      completionYear: 2023,
      location: 'Heights/Washington Avenue',
      description: 'Extension of MKT Trail system',
      impact: ['Active transportation', 'Property values', 'Health']
    },
    {
      projectId: 'CIP-005',
      projectName: 'Southeast Water Plant Expansion',
      department: 'Houston Water',
      projectType: 'Utilities',
      totalBudget: 180000000,
      fundingSources: ['Water Revenue Bonds', 'Federal Infrastructure'],
      status: 'planning',
      startYear: 2024,
      completionYear: 2029,
      location: 'Southeast Houston',
      description: 'Increase water treatment capacity by 50 MGD',
      impact: ['Growth capacity', 'Water security', 'Economic development']
    }
  ]

  // Tax Roll Metadata Summary
  private static readonly TAX_ROLL_METADATA: TaxRollMetadata = {
    taxYear: 2024,
    totalParcels: 785432,
    totalAssessedValue: 285000000000, // $285 billion
    averageValue: 363000,
    medianValue: 245000,
    taxRate: 2.12, // percent
    exemptions: {
      homestead: 125000,
      senior: 45000,
      disabled: 35000,
      veteran: 25000
    }
  }

  // Residential Parking Management Areas
  private static readonly PARKING_AREAS: ResidentialParkingArea[] = [
    {
      areaId: 'RPA-001',
      neighborhood: 'Montrose',
      streets: ['Westheimer', 'Montrose Blvd', 'Alabama', 'Richmond'],
      totalSpaces: 2500,
      permitRequired: true,
      restrictions: ['2-hour limit without permit', 'No overnight parking'],
      enforcementHours: '8am-6pm Mon-Fri'
    },
    {
      areaId: 'RPA-002',
      neighborhood: 'Heights',
      streets: ['19th St', '20th St', 'Heights Blvd', 'Yale St'],
      totalSpaces: 1800,
      permitRequired: true,
      restrictions: ['Resident permit only', '72-hour limit'],
      enforcementHours: '24/7'
    },
    {
      areaId: 'RPA-003',
      neighborhood: 'Museum District',
      streets: ['Main St', 'Fannin St', 'Binz St', 'Ewing St'],
      totalSpaces: 3200,
      permitRequired: true,
      restrictions: ['Event restrictions', 'Metered parking'],
      enforcementHours: '8am-8pm Daily'
    }
  ]

  // Get all LARA properties
  async getLARAProperties(filters?: {
    status?: 'available' | 'pending' | 'sold'
    minPrice?: number
    maxPrice?: number
    neighborhood?: string
    minLotSize?: number
  }): Promise<LARAProperty[]> {
    let properties = [...HoustonCityDataService.LARA_PROPERTIES]
    
    if (filters?.status) {
      properties = properties.filter(p => p.status === filters.status)
    }
    if (filters?.minPrice) {
      properties = properties.filter(p => (p.price || 0) >= filters.minPrice)
    }
    if (filters?.maxPrice) {
      properties = properties.filter(p => (p.price || 0) <= filters.maxPrice)
    }
    if (filters?.neighborhood) {
      properties = properties.filter(p => 
        p.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())
      )
    }
    if (filters?.minLotSize) {
      properties = properties.filter(p => p.lotSize >= filters.minLotSize)
    }
    
    return properties
  }

  // Get CIP projects
  async getCIPProjects(filters?: {
    status?: 'planning' | 'design' | 'construction' | 'completed'
    projectType?: string
    minBudget?: number
    location?: string
  }): Promise<CIPProject[]> {
    let projects = [...HoustonCityDataService.CIP_PROJECTS]
    
    if (filters?.status) {
      projects = projects.filter(p => p.status === filters.status)
    }
    if (filters?.projectType) {
      projects = projects.filter(p => 
        p.projectType.toLowerCase().includes(filters.projectType.toLowerCase())
      )
    }
    if (filters?.minBudget) {
      projects = projects.filter(p => p.totalBudget >= filters.minBudget)
    }
    if (filters?.location) {
      projects = projects.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    return projects
  }

  // Get tax roll metadata
  async getTaxRollMetadata(): Promise<TaxRollMetadata> {
    return HoustonCityDataService.TAX_ROLL_METADATA
  }

  // Get parking areas
  async getParkingAreas(neighborhood?: string): Promise<ResidentialParkingArea[]> {
    if (neighborhood) {
      return HoustonCityDataService.PARKING_AREAS.filter(area => 
        area.neighborhood.toLowerCase().includes(neighborhood.toLowerCase())
      )
    }
    return HoustonCityDataService.PARKING_AREAS
  }

  // Get development opportunities combining LARA and CIP data
  async getDevelopmentOpportunities(area?: string): Promise<{
    laraProperties: LARAProperty[]
    nearbyProjects: CIPProject[]
    totalInvestment: number
    developmentPotential: string
  }> {
    const laraProperties = await this.getLARAProperties({ 
      status: 'available',
      neighborhood: area 
    })
    
    const nearbyProjects = await this.getCIPProjects({
      location: area,
      status: 'construction'
    })
    
    const totalInvestment = nearbyProjects.reduce((sum, p) => sum + p.totalBudget, 0)
    
    let developmentPotential = 'moderate'
    if (totalInvestment > 50000000) developmentPotential = 'high'
    if (totalInvestment > 100000000) developmentPotential = 'very high'
    
    return {
      laraProperties,
      nearbyProjects,
      totalInvestment,
      developmentPotential
    }
  }

  // Get city investment summary
  async getCityInvestmentSummary(): Promise<{
    totalCIPBudget: number
    projectsByType: Record<string, number>
    projectsByStatus: Record<string, number>
    laraInventory: {
      total: number
      available: number
      totalValue: number
    }
  }> {
    const projects = HoustonCityDataService.CIP_PROJECTS
    const laraProperties = HoustonCityDataService.LARA_PROPERTIES
    
    const totalCIPBudget = projects.reduce((sum, p) => sum + p.totalBudget, 0)
    
    const projectsByType = projects.reduce((acc, p) => {
      acc[p.projectType] = (acc[p.projectType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const projectsByStatus = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const availableProperties = laraProperties.filter(p => p.status === 'available')
    const totalValue = availableProperties.reduce((sum, p) => sum + (p.price || 0), 0)
    
    return {
      totalCIPBudget,
      projectsByType,
      projectsByStatus,
      laraInventory: {
        total: laraProperties.length,
        available: availableProperties.length,
        totalValue
      }
    }
  }

  // Get insights for specific neighborhoods
  async getNeighborhoodCityData(neighborhood: string): Promise<{
    laraProperties: LARAProperty[]
    cipProjects: CIPProject[]
    parkingInfo: ResidentialParkingArea | null
    totalCityInvestment: number
  }> {
    const laraProperties = await this.getLARAProperties({ neighborhood })
    const cipProjects = await this.getCIPProjects({ location: neighborhood })
    const parkingAreas = await this.getParkingAreas(neighborhood)
    
    const totalCityInvestment = cipProjects.reduce((sum, p) => sum + p.totalBudget, 0)
    
    return {
      laraProperties,
      cipProjects,
      parkingInfo: parkingAreas[0] || null,
      totalCityInvestment
    }
  }
}

export const houstonCityDataService = new HoustonCityDataService()
export default HoustonCityDataService