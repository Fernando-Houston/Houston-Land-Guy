import axios from 'axios'

export interface PerplexityResponse {
  answer: string
  sources: string[]
  confidence: number
  timestamp: string
}

export interface MarketResearchQuery {
  topic: string
  location?: string
  timeframe?: string
  includeStatistics?: boolean
  includeSources?: boolean
}

export class PerplexityService {
  private static apiKey = process.env.PERPLEXITY_API_KEY || ''
  private static baseURL = 'https://api.perplexity.ai'

  static async queryMarketResearch(query: MarketResearchQuery): Promise<PerplexityResponse> {
    try {
      // Build the research prompt
      const prompt = this.buildResearchPrompt(query)

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'pplx-7b-online', // Using online model for real-time data
          messages: [
            {
              role: 'system',
              content: 'You are a Houston real estate market research expert. Provide accurate, data-driven insights with sources.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.2, // Lower temperature for more factual responses
          return_citations: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return this.parseResponse(response.data)
    } catch (error) {
      console.error('Perplexity API error:', error)
      throw new Error('Failed to fetch market research data')
    }
  }

  static async getNeighborhoodInsights(neighborhood: string): Promise<PerplexityResponse> {
    return this.queryMarketResearch({
      topic: `Real estate development opportunities and market trends in ${neighborhood}, Houston, TX`,
      includeStatistics: true,
      includeSources: true,
      timeframe: 'last 6 months'
    })
  }

  static async getMarketTrends(propertyType: string, location: string): Promise<PerplexityResponse> {
    return this.queryMarketResearch({
      topic: `Current market trends for ${propertyType} development in ${location}, Houston area`,
      includeStatistics: true,
      includeSources: true,
      timeframe: 'current year'
    })
  }

  static async getZoningRegulations(area: string): Promise<PerplexityResponse> {
    return this.queryMarketResearch({
      topic: `Zoning regulations and development restrictions in ${area}, Houston`,
      includeSources: true
    })
  }

  static async getCompetitorAnalysis(propertyType: string, neighborhood: string): Promise<PerplexityResponse> {
    return this.queryMarketResearch({
      topic: `Recent ${propertyType} developments and competing projects in ${neighborhood}, Houston`,
      includeStatistics: true,
      includeSources: true,
      timeframe: 'last 12 months'
    })
  }

  static async getDemographicTrends(location: string): Promise<PerplexityResponse> {
    return this.queryMarketResearch({
      topic: `Population growth, income trends, and demographic shifts in ${location}, Houston metropolitan area`,
      includeStatistics: true,
      includeSources: true,
      timeframe: 'last 5 years'
    })
  }

  private static buildResearchPrompt(query: MarketResearchQuery): string {
    let prompt = query.topic

    if (query.location) {
      prompt += ` Focus on ${query.location}.`
    }

    if (query.timeframe) {
      prompt += ` Provide data from ${query.timeframe}.`
    }

    if (query.includeStatistics) {
      prompt += ' Include specific statistics, percentages, and numerical data.'
    }

    if (query.includeSources) {
      prompt += ' Cite all sources with URLs when possible.'
    }

    return prompt
  }

  private static parseResponse(data: any): PerplexityResponse {
    const content = data.choices[0].message.content
    const citations = data.citations || []

    // Extract confidence based on response characteristics
    const hasStatistics = /\d+%|\$\d+|[\d,]+\s*(units|homes|properties)/.test(content)
    const hasSources = citations.length > 0
    const confidence = (hasStatistics ? 0.4 : 0) + (hasSources ? 0.4 : 0) + 0.2

    return {
      answer: content,
      sources: citations.map((c: any) => c.url || c.title || '').filter(Boolean),
      confidence: Math.min(confidence, 1),
      timestamp: new Date().toISOString()
    }
  }
}