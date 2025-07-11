import toast from 'react-hot-toast'

interface FetchOptions extends RequestInit {
  showError?: boolean
}

class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || ''
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { showError = true, ...fetchOptions } = options

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      if (showError) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong')
      }
      throw error
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Core Agents specific client with authentication
class CoreAgentsClient extends APIClient {
  private secretKey: string

  constructor() {
    super()
    this.secretKey = process.env.NEXT_PUBLIC_CORE_AGENTS_SECRET_KEY || ''
  }

  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return super.fetch<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.secretKey}`,
      },
    })
  }

  // Core Agents specific methods
  async getMarketIntelligence(query: string) {
    return this.post('/api/core-agents', {
      endpoint: 'market-intelligence',
      params: { query },
    })
  }

  async getPropertyAnalysis(address: string) {
    return this.post('/api/core-agents', {
      endpoint: 'property-analysis',
      params: { address },
    })
  }

  async getNeighborhoodData(neighborhood: string) {
    return this.post('/api/core-agents', {
      endpoint: 'neighborhood-data',
      params: { neighborhood },
    })
  }

  async getPermitData(neighborhood: string, timeframe: string = '1year') {
    return this.post('/api/core-agents', {
      endpoint: 'permit-data',
      params: { neighborhood, timeframe },
    })
  }

  async getDemographics(location: string, radius: number = 3) {
    return this.post('/api/core-agents', {
      endpoint: 'demographics',
      params: { location, radius },
    })
  }

  async getMarketTrends(neighborhood: string, timeframe: string = '1year') {
    return this.post('/api/core-agents', {
      endpoint: 'market-trends',
      params: { neighborhood, timeframe },
    })
  }
}

// Export singleton instances
export const apiClient = new APIClient()
export const coreAgentsClient = new CoreAgentsClient()

// Export types
export type { FetchOptions }