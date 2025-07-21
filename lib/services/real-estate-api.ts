// Real Estate Data Integration Service
import { z } from 'zod'

// Data schemas for type safety
export const PropertySchema = z.object({
  id: z.string(),
  mlsNumber: z.string().optional(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  price: z.number(),
  pricePerSqft: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  squareFeet: z.number().optional(),
  lotSize: z.number().optional(),
  yearBuilt: z.number().optional(),
  propertyType: z.enum(['residential', 'commercial', 'industrial', 'land', 'mixed-use']),
  status: z.enum(['active', 'pending', 'sold', 'off-market']),
  daysOnMarket: z.number().optional(),
  listingDate: z.string(),
  photos: z.array(z.string()).optional(),
  description: z.string().optional(),
  agent: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string()
  }).optional(),
  features: z.array(z.string()).optional(),
  zoning: z.string().optional(),
  taxAssessedValue: z.number().optional(),
  propertyTaxes: z.number().optional(),
  hoa: z.number().optional(),
  utilities: z.array(z.string()).optional(),
  lastSalePrice: z.number().optional(),
  lastSaleDate: z.string().optional(),
  priceHistory: z.array(z.object({
    date: z.string(),
    price: z.number(),
    event: z.string()
  })).optional()
})

export const PermitSchema = z.object({
  id: z.string(),
  permitNumber: z.string(),
  address: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  type: z.string(),
  description: z.string(),
  value: z.number(),
  status: z.enum(['pending', 'approved', 'issued', 'completed', 'expired']),
  applicationDate: z.string(),
  issuedDate: z.string().optional(),
  expirationDate: z.string().optional(),
  contractor: z.object({
    name: z.string(),
    license: z.string().optional(),
    phone: z.string().optional()
  }).optional(),
  owner: z.object({
    name: z.string(),
    address: z.string().optional()
  }).optional(),
  workDescription: z.string().optional(),
  squareFeet: z.number().optional(),
  units: z.number().optional()
})

export const MarketDataSchema = z.object({
  neighborhood: z.string(),
  zipCode: z.string(),
  medianPrice: z.number(),
  averagePrice: z.number(),
  pricePerSqft: z.number(),
  daysOnMarket: z.number(),
  salesVolume: z.number(),
  inventory: z.number(),
  monthsOfSupply: z.number(),
  appreciation: z.object({
    month: z.number(),
    quarter: z.number(),
    year: z.number()
  }),
  lastUpdated: z.string()
})

export type Property = z.infer<typeof PropertySchema>
export type Permit = z.infer<typeof PermitSchema>
export type MarketData = z.infer<typeof MarketDataSchema>

class RealEstateAPI {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor() {
    this.baseUrl = process.env.REAL_ESTATE_API_URL || 'https://api.houstonrealestate.com'
    this.apiKey = process.env.REAL_ESTATE_API_KEY || ''
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    // Return mock data for now - real API integration coming soon
    if (process.env.NODE_ENV === 'development') {
      console.log(`API request to: ${endpoint}`, params)
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200))
    
    // Return appropriate mock data based on endpoint
    if (endpoint.includes('/properties/search')) {
      return { properties: this.getMockPropertiesData(params) } as any
    } else if (endpoint.includes('/permits')) {
      return { permits: this.getMockPermitsData(params) } as any
    } else if (endpoint.includes('/market-data')) {
      return { markets: this.getMockMarketStatsData() } as any
    } else if (endpoint.includes('/economic-indicators')) {
      return this.getMockEconomicData() as any
    }
    
    throw new Error(`Endpoint not implemented: ${endpoint}`)
  }

  // HAR (Houston Association of Realtors) MLS Integration
  async searchProperties(filters: {
    minPrice?: number
    maxPrice?: number
    propertyType?: string
    bedrooms?: number
    bathrooms?: number
    minSqft?: number
    maxSqft?: number
    zipCodes?: string[]
    neighborhoods?: string[]
    status?: string
    daysOnMarket?: number
    limit?: number
    offset?: number
  }): Promise<Property[]> {
    try {
      const data = await this.makeRequest<any>('/properties/search', filters)
      return data.properties.map((prop: any) => PropertySchema.parse(prop))
    } catch (error) {
      // Expected in development - using mock data
      // Return mock data for development
      return this.getMockProperties(filters)
    }
  }

  // Houston City Permit Database Integration
  async getPermits(filters: {
    startDate?: string
    endDate?: string
    type?: string
    minValue?: number
    maxValue?: number
    status?: string
    zipCodes?: string[]
    limit?: number
    offset?: number
  }): Promise<Permit[]> {
    try {
      const data = await this.makeRequest<any>('/permits', filters)
      return data.permits.map((permit: any) => PermitSchema.parse(permit))
    } catch (error) {
      // Expected in development - using mock data
      return this.getMockPermits(filters)
    }
  }

  // Harris County Appraisal District Integration
  async getPropertyTaxData(propertyId: string): Promise<{
    assessedValue: number
    marketValue: number
    taxAmount: number
    exemptions: string[]
    taxHistory: Array<{
      year: number
      assessedValue: number
      taxAmount: number
    }>
  }> {
    try {
      return await this.makeRequest(`/tax-data/${propertyId}`)
    } catch (error) {
      // Expected in development - using mock data
      return {
        assessedValue: 425000,
        marketValue: 450000,
        taxAmount: 8500,
        exemptions: ['Homestead'],
        taxHistory: [
          { year: 2023, assessedValue: 425000, taxAmount: 8500 },
          { year: 2022, assessedValue: 410000, taxAmount: 8200 },
          { year: 2021, assessedValue: 395000, taxAmount: 7900 }
        ]
      }
    }
  }

  // Market Statistics
  async getMarketData(zipCode?: string, neighborhood?: string): Promise<MarketData[]> {
    try {
      const data = await this.makeRequest<any>('/market-data', { zipCode, neighborhood })
      return data.markets.map((market: any) => MarketDataSchema.parse(market))
    } catch (error) {
      // Expected in development - using mock data
      return this.getMockMarketData()
    }
  }

  // Comparable Sales Analysis
  async getComparables(propertyId: string, radius: number = 0.5): Promise<Property[]> {
    try {
      const data = await this.makeRequest<any>(`/properties/${propertyId}/comparables`, { radius })
      return data.comparables.map((prop: any) => PropertySchema.parse(prop))
    } catch (error) {
      // Expected in development - using mock data
      return this.getMockComparables()
    }
  }

  // Price History
  async getPriceHistory(propertyId: string): Promise<Array<{
    date: string
    price: number
    event: 'listing' | 'price_change' | 'sale' | 'withdrawn'
    source: string
  }>> {
    try {
      return await this.makeRequest(`/properties/${propertyId}/price-history`)
    } catch (error) {
      // Expected in development - using mock data
      return [
        { date: '2024-01-15', price: 450000, event: 'listing', source: 'MLS' },
        { date: '2024-02-20', price: 435000, event: 'price_change', source: 'MLS' },
        { date: '2024-03-10', price: 425000, event: 'price_change', source: 'MLS' }
      ]
    }
  }

  // Economic Indicators
  async getEconomicIndicators(): Promise<{
    unemployment: number
    populationGrowth: number
    medianIncome: number
    jobGrowth: number
    constructionJobs: number
    oilPrices: number
    interestRates: number
    lastUpdated: string
  }> {
    try {
      return await this.makeRequest('/economic-indicators')
    } catch (error) {
      // Expected in development - using mock data
      return {
        unemployment: 3.8,
        populationGrowth: 2.1,
        medianIncome: 65000,
        jobGrowth: 3.2,
        constructionJobs: 185000,
        oilPrices: 78.50,
        interestRates: 6.75,
        lastUpdated: new Date().toISOString()
      }
    }
  }

  // Enhanced mock data methods with realistic Houston data
  private getMockPropertiesData(filters?: any): Property[] {
    const baseProperties: Property[] = [
      {
        id: '1',
        mlsNumber: 'HAR12345',
        address: '1234 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77002',
        coordinates: { lat: 29.7604, lng: -95.3698 },
        price: 425000,
        pricePerSqft: 285,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1500,
        lotSize: 7200,
        yearBuilt: 2010,
        propertyType: 'residential',
        status: 'active',
        daysOnMarket: 15,
        listingDate: '2024-01-01',
        photos: ['/images/property1.jpg'],
        description: 'Beautiful home in downtown Houston',
        zoning: 'Residential',
        taxAssessedValue: 410000,
        propertyTaxes: 8200,
        lastSalePrice: 380000,
        lastSaleDate: '2020-05-15'
      },
      {
        id: '2',
        mlsNumber: 'HAR12346',
        address: '5678 Westheimer Rd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77056',
        coordinates: { lat: 29.7370, lng: -95.4613 },
        price: 875000,
        pricePerSqft: 350,
        bedrooms: 4,
        bathrooms: 3.5,
        squareFeet: 2500,
        lotSize: 8500,
        yearBuilt: 2018,
        propertyType: 'residential',
        status: 'active',
        daysOnMarket: 22,
        listingDate: '2023-12-20',
        photos: ['/images/property2.jpg'],
        description: 'Luxury home in Galleria area',
        zoning: 'Residential',
        taxAssessedValue: 850000,
        propertyTaxes: 17000,
        lastSalePrice: 750000,
        lastSaleDate: '2019-03-10'
      },
      {
        id: '3',
        mlsNumber: 'HAR12347',
        address: '910 Heights Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77008',
        coordinates: { lat: 29.7900, lng: -95.3985 },
        price: 650000,
        pricePerSqft: 310,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 2100,
        lotSize: 6000,
        yearBuilt: 2020,
        propertyType: 'residential',
        status: 'pending',
        daysOnMarket: 8,
        listingDate: '2024-01-20',
        photos: ['/images/property3.jpg'],
        description: 'Modern home in Houston Heights',
        zoning: 'Residential',
        taxAssessedValue: 625000,
        propertyTaxes: 12500
      },
      {
        id: '4',
        mlsNumber: 'HAR12348',
        address: '1515 Louisiana St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77002',
        coordinates: { lat: 29.7502, lng: -95.3706 },
        price: 2500000,
        pricePerSqft: 450,
        squareFeet: 5555,
        propertyType: 'commercial',
        status: 'active',
        daysOnMarket: 45,
        listingDate: '2023-12-15',
        photos: ['/images/property4.jpg'],
        description: 'Prime commercial property in CBD',
        zoning: 'Commercial',
        taxAssessedValue: 2400000,
        propertyTaxes: 48000
      }
    ]
    
    // Apply filters
    return baseProperties.filter(prop => {
      if (filters?.minPrice && prop.price < filters.minPrice) return false
      if (filters?.maxPrice && prop.price > filters.maxPrice) return false
      if (filters?.propertyType && prop.propertyType !== filters.propertyType) return false
      if (filters?.bedrooms && prop.bedrooms && prop.bedrooms < filters.bedrooms) return false
      if (filters?.zipCodes && !filters.zipCodes.includes(prop.zipCode)) return false
      if (filters?.status && prop.status !== filters.status) return false
      return true
    }).slice(0, filters?.limit || 10)
  }

  private getMockProperties(filters: any): Property[] {
    return [
      {
        id: '1',
        mlsNumber: 'HAR12345',
        address: '1234 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77002',
        coordinates: { lat: 29.7604, lng: -95.3698 },
        price: 425000,
        pricePerSqft: 285,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1500,
        lotSize: 7200,
        yearBuilt: 2010,
        propertyType: 'residential',
        status: 'active',
        daysOnMarket: 15,
        listingDate: '2024-01-01',
        photos: ['/images/property1.jpg'],
        description: 'Beautiful home in downtown Houston',
        zoning: 'Residential',
        taxAssessedValue: 410000,
        propertyTaxes: 8200,
        lastSalePrice: 380000,
        lastSaleDate: '2020-05-15'
      }
    ]
  }

  private getMockPermitsData(filters?: any): Permit[] {
    const basePermits: Permit[] = [
      {
        id: '1',
        permitNumber: 'H2024-001234',
        address: '1234 Main St, Houston, TX',
        coordinates: { lat: 29.7604, lng: -95.3698 },
        type: 'New Construction',
        description: 'Single Family Residence',
        value: 450000,
        status: 'issued',
        applicationDate: '2024-01-15',
        issuedDate: '2024-02-01',
        workDescription: 'Construction of 2,500 sq ft single family home',
        squareFeet: 2500,
        units: 1
      },
      {
        id: '2',
        permitNumber: 'H2024-001235',
        address: '5678 Westheimer Rd, Houston, TX',
        coordinates: { lat: 29.7370, lng: -95.4613 },
        type: 'Commercial Renovation',
        description: 'Restaurant buildout',
        value: 250000,
        status: 'approved',
        applicationDate: '2024-01-20',
        workDescription: 'Interior renovation for new restaurant',
        squareFeet: 3500
      },
      {
        id: '3',
        permitNumber: 'H2024-001236',
        address: '910 Heights Blvd, Houston, TX',
        coordinates: { lat: 29.7900, lng: -95.3985 },
        type: 'Residential Addition',
        description: 'Second story addition',
        value: 125000,
        status: 'pending',
        applicationDate: '2024-01-25',
        workDescription: 'Add 800 sq ft second story to existing home',
        squareFeet: 800
      },
      {
        id: '4',
        permitNumber: 'H2024-001237',
        address: '1515 Louisiana St, Houston, TX',
        coordinates: { lat: 29.7502, lng: -95.3706 },
        type: 'Commercial New Construction',
        description: 'Mixed-use development',
        value: 15000000,
        status: 'approved',
        applicationDate: '2023-12-01',
        issuedDate: '2024-01-10',
        workDescription: '20-story mixed-use tower with retail and residential',
        squareFeet: 250000,
        units: 180
      }
    ]
    
    // Apply filters
    return basePermits.filter(permit => {
      if (filters?.type && permit.type !== filters.type) return false
      if (filters?.minValue && permit.value < filters.minValue) return false
      if (filters?.maxValue && permit.value > filters.maxValue) return false
      if (filters?.status && permit.status !== filters.status) return false
      return true
    }).slice(0, filters?.limit || 10)
  }

  private getMockPermits(filters: any): Permit[] {
    return [
      {
        id: '1',
        permitNumber: 'H2024-001234',
        address: '1234 Main St, Houston, TX',
        coordinates: { lat: 29.7604, lng: -95.3698 },
        type: 'New Construction',
        description: 'Single Family Residence',
        value: 450000,
        status: 'issued',
        applicationDate: '2024-01-15',
        issuedDate: '2024-02-01',
        workDescription: 'Construction of 2,500 sq ft single family home',
        squareFeet: 2500,
        units: 1
      }
    ]
  }

  private getMockMarketStatsData(): MarketData[] {
    return [
      {
        neighborhood: 'Heights',
        zipCode: '77008',
        medianPrice: 425000,
        averagePrice: 455000,
        pricePerSqft: 285,
        daysOnMarket: 25,
        salesVolume: 145,
        inventory: 234,
        monthsOfSupply: 3.2,
        appreciation: {
          month: 1.2,
          quarter: 3.8,
          year: 8.5
        },
        lastUpdated: new Date().toISOString()
      },
      {
        neighborhood: 'Montrose',
        zipCode: '77006',
        medianPrice: 485000,
        averagePrice: 515000,
        pricePerSqft: 315,
        daysOnMarket: 22,
        salesVolume: 132,
        inventory: 198,
        monthsOfSupply: 2.8,
        appreciation: {
          month: 1.5,
          quarter: 4.2,
          year: 9.8
        },
        lastUpdated: new Date().toISOString()
      },
      {
        neighborhood: 'River Oaks',
        zipCode: '77019',
        medianPrice: 1850000,
        averagePrice: 2250000,
        pricePerSqft: 485,
        daysOnMarket: 65,
        salesVolume: 28,
        inventory: 85,
        monthsOfSupply: 8.5,
        appreciation: {
          month: 0.8,
          quarter: 2.5,
          year: 6.2
        },
        lastUpdated: new Date().toISOString()
      },
      {
        neighborhood: 'Midtown',
        zipCode: '77002',
        medianPrice: 385000,
        averagePrice: 420000,
        pricePerSqft: 295,
        daysOnMarket: 18,
        salesVolume: 178,
        inventory: 156,
        monthsOfSupply: 2.2,
        appreciation: {
          month: 2.1,
          quarter: 5.8,
          year: 12.5
        },
        lastUpdated: new Date().toISOString()
      }
    ]
  }

  private getMockEconomicData() {
    return {
      unemployment: 3.8,
      populationGrowth: 2.1,
      medianIncome: 65000,
      jobGrowth: 3.2,
      constructionJobs: 185000,
      oilPrices: 78.50,
      interestRates: 6.75,
      gdpGrowth: 3.5,
      inflationRate: 2.8,
      housingStarts: 28500,
      permitApplications: 3250,
      energySectorEmployment: 245000,
      techSectorGrowth: 5.8,
      lastUpdated: new Date().toISOString()
    }
  }

  private getMockMarketData(): MarketData[] {
    return [
      {
        neighborhood: 'Heights',
        zipCode: '77008',
        medianPrice: 425000,
        averagePrice: 455000,
        pricePerSqft: 285,
        daysOnMarket: 25,
        salesVolume: 145,
        inventory: 234,
        monthsOfSupply: 3.2,
        appreciation: {
          month: 1.2,
          quarter: 3.8,
          year: 8.5
        },
        lastUpdated: new Date().toISOString()
      }
    ]
  }

  private getMockComparables(): Property[] {
    return this.getMockProperties({})
  }
}

export const realEstateAPI = new RealEstateAPI()

// Utility functions for data processing
export const calculatePricePerSqft = (price: number, sqft: number): number => {
  return Math.round(price / sqft)
}

export const calculateDaysOnMarket = (listingDate: string): number => {
  const listing = new Date(listingDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - listing.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price)
}

export const getPropertyTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    residential: '#10B981',
    commercial: '#3B82F6',
    industrial: '#6366F1',
    land: '#F59E0B',
    'mixed-use': '#8B5CF6'
  }
  return colors[type] || '#6B7280'
}