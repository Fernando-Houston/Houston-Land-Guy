export interface APIResponse<T> {
  data?: T
  error?: string
  code?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CoreAgentsRequest {
  query: string
  context?: Record<string, any>
  options?: {
    includeAnalysis?: boolean
    includeRecommendations?: boolean
    maxResults?: number
  }
}

export interface CoreAgentsResponse {
  result: any
  metadata: {
    processingTime: number
    dataPoints: number
    confidence: number
  }
  recommendations?: string[]
  analysis?: Record<string, any>
}