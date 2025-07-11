import { Loader } from '@googlemaps/js-api-loader'

export interface GeocodingResult {
  lat: number
  lng: number
  formattedAddress: string
  placeId: string
  neighborhood?: string
  zipCode?: string
}

export interface PropertyDetails {
  address: string
  coordinates: { lat: number; lng: number }
  propertyType?: string
  lotSize?: number
  yearBuilt?: number
  nearbyAmenities: string[]
}

export class GoogleMapsService {
  private static loader: Loader | null = null

  static getLoader(): Loader {
    if (!this.loader) {
      this.loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places', 'geocoding']
      })
    }
    return this.loader
  }

  static async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      )

      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0]
        const location = result.geometry.location

        // Extract neighborhood and zip code from address components
        let neighborhood = ''
        let zipCode = ''

        for (const component of result.address_components) {
          if (component.types.includes('neighborhood')) {
            neighborhood = component.long_name
          }
          if (component.types.includes('postal_code')) {
            zipCode = component.long_name
          }
        }

        return {
          lat: location.lat,
          lng: location.lng,
          formattedAddress: result.formatted_address,
          placeId: result.place_id,
          neighborhood,
          zipCode
        }
      }

      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  static async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      )

      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address
      }

      return null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }

  static async searchNearbyPlaces(
    lat: number,
    lng: number,
    radius: number = 1000,
    types: string[] = ['school', 'shopping_mall', 'hospital', 'park']
  ): Promise<string[]> {
    try {
      const amenities: string[] = []

      for (const type of types) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        )

        const data = await response.json()

        if (data.status === 'OK') {
          const places = data.results.slice(0, 3).map((place: any) => place.name)
          amenities.push(...places)
        }
      }

      return amenities
    } catch (error) {
      console.error('Nearby places search error:', error)
      return []
    }
  }

  static async getPropertyDetails(address: string): Promise<PropertyDetails | null> {
    try {
      // First, geocode the address
      const geocodeResult = await this.geocodeAddress(address)
      if (!geocodeResult) return null

      // Search for nearby amenities
      const nearbyAmenities = await this.searchNearbyPlaces(
        geocodeResult.lat,
        geocodeResult.lng
      )

      return {
        address: geocodeResult.formattedAddress,
        coordinates: {
          lat: geocodeResult.lat,
          lng: geocodeResult.lng
        },
        nearbyAmenities
      }
    } catch (error) {
      console.error('Property details error:', error)
      return null
    }
  }

  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in kilometers
  }
}