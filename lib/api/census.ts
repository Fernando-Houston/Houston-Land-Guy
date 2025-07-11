import axios from 'axios'

export interface CensusData {
  population: number
  households: number
  medianIncome: number
  medianAge: number
  housingUnits: number
  ownerOccupiedRate: number
  medianHomeValue: number
  populationGrowth?: number
  employmentRate?: number
}

export interface DemographicProfile {
  location: string
  data: CensusData
  year: number
  source: string
}

export class CensusService {
  private static apiKey = process.env.CENSUS_API_KEY || ''
  private static baseURL = 'https://api.census.gov/data'
  
  // Harris County, TX FIPS code
  private static HARRIS_COUNTY_FIPS = '48201'
  
  // Houston MSA codes
  private static HOUSTON_MSA = '26420'

  static async getDemographicData(zipCode?: string): Promise<DemographicProfile | null> {
    try {
      // Using American Community Survey 5-Year Data (most recent available)
      const year = 2022 // Update this as new data becomes available
      const dataset = 'acs/acs5'
      
      // Variables to fetch
      const variables = [
        'B01003_001E', // Total population
        'B11001_001E', // Total households
        'B19013_001E', // Median household income
        'B01002_001E', // Median age
        'B25001_001E', // Total housing units
        'B25003_002E', // Owner occupied housing units
        'B25003_001E', // Total occupied housing units
        'B25077_001E', // Median home value
        'B23025_002E', // Employment count
        'B23025_001E'  // Total labor force
      ].join(',')

      let url = `${this.baseURL}/${year}/${dataset}?get=NAME,${variables}&key=${this.apiKey}`
      
      if (zipCode) {
        // Query by ZIP code
        url += `&for=zip%20code%20tabulation%20area:${zipCode}`
      } else {
        // Default to Harris County
        url += `&for=county:${this.HARRIS_COUNTY_FIPS.slice(-3)}&in=state:48`
      }

      const response = await axios.get(url)
      
      if (response.data && response.data.length > 1) {
        return this.parseCensusResponse(response.data, year)
      }
      
      return null
    } catch (error) {
      console.error('Census API error:', error)
      return null
    }
  }

  static async getNeighborhoodDemographics(lat: number, lng: number): Promise<DemographicProfile | null> {
    try {
      // First, get the census tract for the coordinates
      const tract = await this.getCensusTract(lat, lng)
      if (!tract) return null

      const year = 2022
      const dataset = 'acs/acs5'
      
      const variables = [
        'B01003_001E', // Total population
        'B19013_001E', // Median household income
        'B01002_001E', // Median age
        'B25077_001E'  // Median home value
      ].join(',')

      const url = `${this.baseURL}/${year}/${dataset}?get=NAME,${variables}&for=tract:${tract.tract}&in=state:48&in=county:${tract.county}&key=${this.apiKey}`

      const response = await axios.get(url)
      
      if (response.data && response.data.length > 1) {
        return this.parseCensusResponse(response.data, year)
      }
      
      return null
    } catch (error) {
      console.error('Census tract API error:', error)
      return null
    }
  }

  static async getHoustonMSAStats(): Promise<DemographicProfile | null> {
    try {
      const year = 2022
      const dataset = 'acs/acs5'
      
      const variables = [
        'B01003_001E', // Total population
        'B11001_001E', // Total households
        'B19013_001E', // Median household income
        'B25077_001E', // Median home value
        'B15003_022E', // Bachelor's degree
        'B15003_001E'  // Total education
      ].join(',')

      const url = `${this.baseURL}/${year}/${dataset}?get=NAME,${variables}&for=metropolitan%20statistical%20area/micropolitan%20statistical%20area:${this.HOUSTON_MSA}&key=${this.apiKey}`

      const response = await axios.get(url)
      
      if (response.data && response.data.length > 1) {
        return this.parseCensusResponse(response.data, year)
      }
      
      return null
    } catch (error) {
      console.error('Census MSA API error:', error)
      return null
    }
  }

  private static async getCensusTract(lat: number, lng: number): Promise<{ tract: string; county: string } | null> {
    try {
      // Use Census Geocoder API
      const url = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lng}&y=${lat}&benchmark=4&vintage=4&format=json`
      
      const response = await axios.get(url)
      
      if (response.data.result && response.data.result.geographies) {
        const tract = response.data.result.geographies['2020 Census Blocks']?.[0]
        if (tract) {
          return {
            tract: tract.TRACT,
            county: tract.COUNTY
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('Census geocoder error:', error)
      return null
    }
  }

  private static parseCensusResponse(data: any[], year: number): DemographicProfile {
    const headers = data[0]
    const values = data[1]
    
    const getValue = (varName: string): number => {
      const index = headers.indexOf(varName)
      return index !== -1 ? parseInt(values[index]) || 0 : 0
    }
    
    const population = getValue('B01003_001E')
    const households = getValue('B11001_001E')
    const medianIncome = getValue('B19013_001E')
    const medianAge = getValue('B01002_001E')
    const housingUnits = getValue('B25001_001E')
    const ownerOccupied = getValue('B25003_002E')
    const totalOccupied = getValue('B25003_001E')
    const medianHomeValue = getValue('B25077_001E')
    const employed = getValue('B23025_002E')
    const laborForce = getValue('B23025_001E')
    
    return {
      location: values[headers.indexOf('NAME')] || 'Unknown',
      year,
      source: 'US Census Bureau',
      data: {
        population,
        households,
        medianIncome,
        medianAge,
        housingUnits,
        ownerOccupiedRate: totalOccupied > 0 ? (ownerOccupied / totalOccupied) * 100 : 0,
        medianHomeValue,
        employmentRate: laborForce > 0 ? (employed / laborForce) * 100 : 0
      }
    }
  }
}