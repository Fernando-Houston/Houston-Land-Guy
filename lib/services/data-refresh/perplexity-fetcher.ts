// Perplexity Data Fetcher - Fetches latest market data using Perplexity API
import { queryPerplexity } from '../data-intelligence'

export interface MarketDataResult {
  topic: string
  summary: string
  extractedNumbers: number[]
  unit?: string
  neighborhoods?: Record<string, number>
  permitCount?: number
  timestamp: Date
}

export interface DevelopmentNewsResult {
  projects?: Array<{
    name: string
    developer: string
    type: string
    location: string
    value?: number
    description: string
  }>
  timestamp: Date
}

export interface EconomicDataResult {
  indicator: string
  value: number
  previousValue?: number
  change?: number
  unit: string
  period: string
  timestamp: Date
}

export class PerplexityDataFetcher {
  // Fetch market data with structured extraction
  async fetchMarketData(query: string): Promise<MarketDataResult | null> {
    try {
      const systemPrompt = `You are a Houston real estate data analyst. Extract specific numbers and data points from market reports. Always provide:
1. Exact numbers when available
2. Unit of measurement (%, $, days, etc.)
3. Time period of the data
4. Neighborhood-specific data when mentioned
Format your response with clear data points that can be parsed.`

      const response = await queryPerplexity(query, systemPrompt)
      
      // Parse the response to extract structured data
      const result: MarketDataResult = {
        topic: this.extractTopic(query),
        summary: response,
        extractedNumbers: this.extractNumbers(response),
        unit: this.extractUnit(response),
        timestamp: new Date()
      }
      
      // Extract neighborhood data if present
      const neighborhoods = this.extractNeighborhoodData(response)
      if (neighborhoods) {
        result.neighborhoods = neighborhoods
      }
      
      // Extract permit count if present
      const permitCount = this.extractPermitCount(response)
      if (permitCount) {
        result.permitCount = permitCount
      }
      
      return result
    } catch (error) {
      console.error('Perplexity fetch error:', error)
      return null
    }
  }
  
  // Fetch development news
  async fetchDevelopmentNews(query: string): Promise<DevelopmentNewsResult | null> {
    try {
      const systemPrompt = `You are a Houston real estate development tracker. Extract information about new development projects. For each project provide:
1. Project name
2. Developer name
3. Project type (residential, commercial, mixed-use, etc.)
4. Location/area
5. Investment value if mentioned
6. Brief description
Format as a structured list.`

      const response = await queryPerplexity(query, systemPrompt)
      
      // Parse projects from response
      const projects = this.extractProjects(response)
      
      return {
        projects,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Development news fetch error:', error)
      return null
    }
  }
  
  // Fetch economic indicators
  async fetchEconomicData(query: string): Promise<EconomicDataResult | null> {
    try {
      const systemPrompt = `You are a Houston economic data analyst. Extract specific economic indicators with:
1. The exact indicator name
2. Current value
3. Previous value if mentioned
4. Year-over-year or period change
5. Unit (%, $, jobs, etc.)
6. Time period
Provide precise numbers only.`

      const response = await queryPerplexity(query, systemPrompt)
      
      return this.extractEconomicData(response, query)
    } catch (error) {
      console.error('Economic data fetch error:', error)
      return null
    }
  }
  
  // Helper methods for parsing
  private extractTopic(query: string): string {
    // Extract main topic from query
    if (query.includes('rental')) return 'Rental Market'
    if (query.includes('median home price')) return 'Home Prices'
    if (query.includes('inventory')) return 'Housing Inventory'
    if (query.includes('permit')) return 'Construction Permits'
    if (query.includes('employment') || query.includes('job')) return 'Employment'
    return 'Market Update'
  }
  
  private extractNumbers(text: string): number[] {
    const numbers: number[] = []
    
    // Match various number formats
    const patterns = [
      /\$?([\d,]+\.?\d*)\s*(million|billion|M|B)?/gi,
      /(\d+\.?\d*)\s*%/g,
      /(\d+,?\d*)\s*(days|months|years)/gi
    ]
    
    patterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        let value = parseFloat(match[1].replace(/,/g, ''))
        
        // Convert millions/billions
        if (match[2]) {
          if (match[2].toLowerCase().includes('million') || match[2] === 'M') {
            value *= 1000000
          } else if (match[2].toLowerCase().includes('billion') || match[2] === 'B') {
            value *= 1000000000
          }
        }
        
        numbers.push(value)
      }
    })
    
    return numbers
  }
  
  private extractUnit(text: string): string {
    if (text.includes('%')) return '%'
    if (text.includes('$')) return '$'
    if (text.includes('days')) return 'days'
    if (text.includes('months')) return 'months'
    if (text.includes('per square foot')) return '$/sqft'
    return 'units'
  }
  
  private extractNeighborhoodData(text: string): Record<string, number> | null {
    const neighborhoods: Record<string, number> = {}
    
    // Common Houston neighborhoods
    const neighborhoodNames = [
      'River Oaks', 'Heights', 'Montrose', 'Downtown', 'Galleria',
      'Memorial', 'West University', 'Bellaire', 'Katy', 'Sugar Land',
      'The Woodlands', 'Cypress', 'Spring', 'Pearland'
    ]
    
    neighborhoodNames.forEach(name => {
      // Look for neighborhood followed by a number
      const pattern = new RegExp(`${name}[^\\d]*(\\$?[\\d,]+)`, 'gi')
      const match = pattern.exec(text)
      
      if (match) {
        const value = parseFloat(match[1].replace(/[$,]/g, ''))
        if (!isNaN(value)) {
          neighborhoods[name] = value
        }
      }
    })
    
    return Object.keys(neighborhoods).length > 0 ? neighborhoods : null
  }
  
  private extractPermitCount(text: string): number | null {
    // Look for permit counts
    const patterns = [
      /(\d+,?\d*)\s*permits?\s*(issued|filed|approved)/gi,
      /issued\s*(\d+,?\d*)\s*permits?/gi,
      /permit\s*count[:\s]+(\d+,?\d*)/gi
    ]
    
    for (const pattern of patterns) {
      const match = pattern.exec(text)
      if (match) {
        return parseInt(match[1].replace(/,/g, ''))
      }
    }
    
    return null
  }
  
  private extractProjects(text: string): Array<any> {
    const projects: Array<any> = []
    
    // Split by common project separators
    const lines = text.split(/\n|;|\d+\.|•|-\s/)
    
    lines.forEach(line => {
      if (line.length < 20) return // Skip short lines
      
      // Try to extract project info
      const project: any = {}
      
      // Extract project name (usually in quotes or before 'by' or 'from')
      const nameMatch = line.match(/"([^"]+)"|^([^,\-:]+?)(?:\s+by|\s+from|\s*-|\s*:)/)
      if (nameMatch) {
        project.name = (nameMatch[1] || nameMatch[2]).trim()
      }
      
      // Extract developer
      const devMatch = line.match(/by\s+([^,\-]+?)(?:\s+will|\s+is|\s+plans|,|$)/i)
      if (devMatch) {
        project.developer = devMatch[1].trim()
      }
      
      // Extract value
      const valueMatch = line.match(/\$(\d+\.?\d*)\s*(million|billion|M|B)/i)
      if (valueMatch) {
        let value = parseFloat(valueMatch[1])
        if (valueMatch[2].toLowerCase().includes('billion')) {
          value *= 1000000000
        } else {
          value *= 1000000
        }
        project.value = value
      }
      
      // Extract type
      if (line.toLowerCase().includes('residential')) project.type = 'residential'
      else if (line.toLowerCase().includes('commercial')) project.type = 'commercial'
      else if (line.toLowerCase().includes('mixed-use')) project.type = 'mixed-use'
      else if (line.toLowerCase().includes('office')) project.type = 'office'
      else if (line.toLowerCase().includes('retail')) project.type = 'retail'
      else project.type = 'development'
      
      // Extract location
      const locationMatch = line.match(/in\s+([^,]+?)(?:\s+will|\s+is|,|$)/i)
      if (locationMatch) {
        project.location = locationMatch[1].trim()
      }
      
      project.description = line.substring(0, 200)
      
      // Only add if we have at least a name
      if (project.name) {
        projects.push(project)
      }
    })
    
    return projects
  }
  
  private extractEconomicData(text: string, query: string): EconomicDataResult | null {
    // Determine indicator from query
    let indicator = 'Economic Indicator'
    if (query.includes('unemployment')) indicator = 'Unemployment Rate'
    else if (query.includes('job growth')) indicator = 'Job Growth Rate'
    else if (query.includes('GDP')) indicator = 'GDP Growth'
    else if (query.includes('population')) indicator = 'Population Growth'
    else if (query.includes('income')) indicator = 'Median Household Income'
    
    // Extract current value
    const numbers = this.extractNumbers(text)
    if (numbers.length === 0) return null
    
    const currentValue = numbers[0]
    
    // Look for previous value or change
    let previousValue: number | undefined
    let change: number | undefined
    
    // Look for YoY change
    const changeMatch = text.match(/(\d+\.?\d*)\s*%\s*(increase|decrease|growth|decline|change)/i)
    if (changeMatch) {
      change = parseFloat(changeMatch[1])
      if (changeMatch[2].includes('decrease') || changeMatch[2].includes('decline')) {
        change = -change
      }
    }
    
    // Determine unit
    let unit = 'value'
    if (text.includes('%') || indicator.includes('Rate')) unit = '%'
    else if (text.includes('$') || indicator.includes('Income')) unit = '$'
    else if (indicator.includes('Population')) unit = 'people'
    
    return {
      indicator,
      value: currentValue,
      previousValue,
      change,
      unit,
      period: 'latest',
      timestamp: new Date()
    }
  }
}

export const perplexityFetcher = new PerplexityDataFetcher()