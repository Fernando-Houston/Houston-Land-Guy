'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { MapPin } from 'lucide-react'

interface PropertyMapProps {
  center?: {
    lat: number
    lng: number
  }
  zoom?: number
  markers?: Array<{
    id: string
    position: {
      lat: number
      lng: number
    }
    title: string
    description?: string
  }>
  height?: string
  showSearch?: boolean
  onLocationSelect?: (location: { lat: number; lng: number }) => void
}

const defaultCenter = {
  lat: 29.7604,
  lng: -95.3698
}

export function PropertyMapNew({
  center = defaultCenter,
  zoom = 12,
  markers = [],
  height = '400px',
  showSearch = false,
  onLocationSelect
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(true)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'beta',
        libraries: ['places', 'marker']
      })

      try {
        const google = await loader.load()
        
        if (!mapRef.current) return

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapId: 'HOUSTON_DEV_MAP',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true
        })

        setMap(mapInstance)
        setLoading(false)

        // Create info window
        infoWindowRef.current = new google.maps.InfoWindow()

        // Add markers
        markersRef.current = markers.map((marker) => {
          const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: marker.position,
            title: marker.title
          })

          advancedMarker.addListener('click', () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(`
                <div class="p-3">
                  <h3 class="font-semibold text-gray-900 mb-1">${marker.title}</h3>
                  ${marker.description ? `<p class="text-sm text-gray-600">${marker.description}</p>` : ''}
                </div>
              `)
              infoWindowRef.current.open(mapInstance, advancedMarker)
            }
          })

          return advancedMarker
        })
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        setLoading(false)
      }
    }

    initMap()

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => {
        marker.map = null
      })
      markersRef.current = []
    }
  }, [center, zoom, markers])

  const handleSearch = async () => {
    if (!searchValue || !map) return

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: searchValue + ', Houston, TX' }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location
        map.panTo(location)
        map.setZoom(16)
        
        if (onLocationSelect) {
          onLocationSelect({ lat: location.lat(), lng: location.lng() })
        }
      }
    })
  }

  return (
    <div className="relative" style={{ height }}>
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-10 max-w-md">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search Houston address..."
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
            >
              Search
            </button>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  )
}