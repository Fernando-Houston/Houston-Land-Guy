import { CoreAgentsRequest, CoreAgentsResponse } from '@/lib/types/api'

export class CoreAgentsClient {
  private baseURL = process.env.CORE_AGENTS_URL || 'https://core-agents-6d4f5.up.railway.app'
  private secretKey = process.env.CORE_AGENTS_SECRET_KEY || ''

  private async makeRequest(endpoint: string, data?: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.secretKey}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Core Agents API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async getMarketIntelligence(query: string, context?: Record<string, any>): Promise<CoreAgentsResponse> {
    const request: CoreAgentsRequest = {
      query,
      context,
      options: {
        includeAnalysis: true,
        includeRecommendations: true,
      }
    }

    return this.makeRequest('/api/intelligence/market', request)
  }

  async getPropertyAnalysis(address: string, additionalData?: Record<string, any>) {
    return this.makeRequest('/api/intelligence/property', {
      address,
      ...additionalData,
    })
  }

  async getNeighborhoodData(neighborhood: string) {
    return this.makeRequest('/api/intelligence/neighborhood', {
      neighborhood,
    })
  }

  async getPermitData(params: {
    location?: string
    dateRange?: { start: Date; end: Date }
    permitType?: string
  }) {
    return this.makeRequest('/api/intelligence/permits', params)
  }

  async getDemographics(location: string, radius?: number) {
    return this.makeRequest('/api/intelligence/demographics', {
      location,
      radius: radius || 5, // 5 mile default
    })
  }

  async getMarketTrends(params: {
    neighborhoods: string[]
    timeframe: string
    metrics?: string[]
  }) {
    return this.makeRequest('/api/intelligence/trends', params)
  }

  async calculateROI(params: {
    purchasePrice: number
    renovationCost: number
    location: string
    propertyType: string
    additionalFactors?: Record<string, any>
  }) {
    return this.makeRequest('/api/tools/roi-calculator', params)
  }
}

// Singleton instance
export const coreAgentsClient = new CoreAgentsClient()