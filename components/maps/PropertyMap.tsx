'use client'

import { useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
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

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true
}

export function PropertyMap({
  center = defaultCenter,
  zoom = 12,
  markers = [],
  height = '400px',
  showSearch = false,
  onLocationSelect
}: PropertyMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleSearch = () => {
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

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    )
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
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={options}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedMarker(marker.id)}
          />
        ))}
        
        {selectedMarker && (
          <InfoWindow
            position={markers.find(m => m.id === selectedMarker)?.position || center}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-gray-900">
                {markers.find(m => m.id === selectedMarker)?.title}
              </h3>
              {markers.find(m => m.id === selectedMarker)?.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {markers.find(m => m.id === selectedMarker)?.description}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}