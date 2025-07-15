'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Search, Layers, Info, Download, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { LeadCaptureModal } from '@/src/components/forms/LeadCaptureModal'

// Houston neighborhoods with deed restrictions
const houstonZones = [
  {
    name: 'River Oaks',
    coordinates: [
      { lat: 29.7573, lng: -95.4151 },
      { lat: 29.7573, lng: -95.4051 },
      { lat: 29.7473, lng: -95.4051 },
      { lat: 29.7473, lng: -95.4151 }
    ],
    restrictions: {
      minLotSize: '10,000 sq ft',
      minHomeSqFt: '3,500 sq ft',
      setbacks: 'Front: 50ft, Side: 15ft, Rear: 20ft',
      maxHeight: '35 feet',
      allowedUses: ['Single-family residential'],
      prohibitedUses: ['Commercial', 'Multi-family', 'Short-term rentals']
    },
    color: '#FF6B6B',
    fillOpacity: 0.3
  },
  {
    name: 'The Heights',
    coordinates: [
      { lat: 29.7989, lng: -95.3987 },
      { lat: 29.7989, lng: -95.3787 },
      { lat: 29.7789, lng: -95.3787 },
      { lat: 29.7789, lng: -95.3987 }
    ],
    restrictions: {
      minLotSize: '3,500 sq ft',
      minHomeSqFt: 'Varies by subdivision',
      setbacks: 'Historic district requirements apply',
      maxHeight: '30 feet in historic areas',
      allowedUses: ['Single-family', 'Some multi-family'],
      prohibitedUses: ['Heavy commercial', 'Industrial']
    },
    color: '#4ECDC4',
    fillOpacity: 0.3
  },
  {
    name: 'Montrose',
    coordinates: [
      { lat: 29.7472, lng: -95.3902 },
      { lat: 29.7472, lng: -95.3702 },
      { lat: 29.7272, lng: -95.3702 },
      { lat: 29.7272, lng: -95.3902 }
    ],
    restrictions: {
      minLotSize: 'No minimum (urban district)',
      minHomeSqFt: 'No minimum',
      setbacks: 'Varies by block face',
      maxHeight: 'Varies by corridor',
      allowedUses: ['Mixed-use', 'Residential', 'Commercial'],
      prohibitedUses: ['Industrial', 'Some auto-related uses']
    },
    color: '#FFE66D',
    fillOpacity: 0.3
  },
  {
    name: 'Memorial',
    coordinates: [
      { lat: 29.7641, lng: -95.4774 },
      { lat: 29.7641, lng: -95.4574 },
      { lat: 29.7441, lng: -95.4574 },
      { lat: 29.7441, lng: -95.4774 }
    ],
    restrictions: {
      minLotSize: '15,000 sq ft',
      minHomeSqFt: '4,000 sq ft',
      setbacks: 'Front: 40ft, Side: 20ft, Rear: 25ft',
      maxHeight: '35 feet',
      allowedUses: ['Single-family residential'],
      prohibitedUses: ['Commercial', 'Multi-family', 'Accessory units']
    },
    color: '#A8E6CF',
    fillOpacity: 0.3
  }
]

const center = {
  lat: 29.7604,
  lng: -95.3698
}

export default function ZoningMapNew() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedZone, setSelectedZone] = useState<any>(null)
  const [searchAddress, setSearchAddress] = useState('')
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [capturedEmail, setCapturedEmail] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const polygonsRef = useRef<google.maps.Polygon[]>([])
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'beta',
        libraries: ['places', 'marker', 'geometry']
      })

      try {
        const google = await loader.load()
        
        if (!mapRef.current) return

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          mapId: 'HOUSTON_ZONING_MAP',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true
        })

        setMap(mapInstance)
        setLoading(false)

        // Create info window
        infoWindowRef.current = new google.maps.InfoWindow()

        // Add zone polygons
        const filteredZones = getFilteredZones()
        polygonsRef.current = filteredZones.map((zone) => {
          const polygon = new google.maps.Polygon({
            paths: zone.coordinates,
            fillColor: zone.color,
            fillOpacity: zone.fillOpacity,
            strokeColor: zone.color,
            strokeOpacity: 1,
            strokeWeight: 2,
            clickable: true
          })

          polygon.setMap(mapInstance)

          polygon.addListener('click', (event: any) => {
            setSelectedZone(zone)
            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(`
                <div class="p-2">
                  <h3 class="font-semibold">${zone.name}</h3>
                  <p class="text-sm text-gray-600 mt-1">
                    Click for detailed restrictions
                  </p>
                </div>
              `)
              infoWindowRef.current.setPosition(event.latLng)
              infoWindowRef.current.open(mapInstance)
            }
          })

          return polygon
        })
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        setLoading(false)
      }
    }

    initMap()

    return () => {
      // Cleanup polygons
      polygonsRef.current.forEach(polygon => {
        polygon.setMap(null)
      })
      polygonsRef.current = []
      
      // Cleanup marker
      if (markerRef.current) {
        markerRef.current.map = null
      }
    }
  }, [activeFilters])

  const getFilteredZones = () => {
    if (activeFilters.length === 0) return houstonZones
    
    return houstonZones.filter(zone => {
      return activeFilters.some(filter => {
        switch (filter) {
          case 'residential':
            return zone.restrictions.allowedUses.includes('Single-family residential')
          case 'commercial':
            return zone.restrictions.allowedUses.some(use => use.includes('Commercial'))
          case 'mixed-use':
            return zone.restrictions.allowedUses.includes('Mixed-use')
          case 'large-lots':
            return parseInt(zone.restrictions.minLotSize) >= 10000
          default:
            return true
        }
      })
    })
  }

  const handleSearch = async () => {
    if (!searchAddress || !map) return

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: searchAddress + ', Houston, TX' }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location
        map.panTo(location)
        map.setZoom(16)
        
        // Remove previous marker
        if (markerRef.current) {
          markerRef.current.map = null
        }
        
        // Add new marker
        markerRef.current = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: location,
          title: searchAddress
        })
        
        // Check which zone the address falls in
        const zone = findZoneForLocation(location.lat(), location.lng())
        if (zone) {
          setSelectedZone(zone)
        }
      }
    })
  }

  const findZoneForLocation = (lat: number, lng: number) => {
    // Simplified point-in-polygon check
    return houstonZones.find(zone => {
      const bounds = new google.maps.LatLngBounds()
      zone.coordinates.forEach(coord => bounds.extend(coord))
      return bounds.contains(new google.maps.LatLng(lat, lng))
    })
  }

  const downloadDeedRestrictions = () => {
    if (!capturedEmail) {
      setShowLeadCapture(true)
      return
    }
    
    // Simulate download
    alert('Downloading deed restrictions PDF...')
  }

  const toggleFilter = (filterName: string) => {
    setActiveFilters(prev => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Houston Zoning Explorer</h1>
          <p className="text-gray-600">
            Interactive map of Houston deed restrictions and development regulations
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter address in Houston..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'residential', label: 'Residential' },
                  { name: 'commercial', label: 'Commercial' },
                  { name: 'mixed-use', label: 'Mixed-Use' },
                  { name: 'large-lots', label: 'Large Lots' }
                ].map(filter => (
                  <button
                    key={filter.name}
                    onClick={() => toggleFilter(filter.name)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      activeFilters.includes(filter.name)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map and Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-[600px]">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
              <div ref={mapRef} className="w-full h-full" />
            </div>
          </motion.div>

          {/* Info Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Legend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                Zone Legend
              </h3>
              <div className="space-y-2">
                {houstonZones.map((zone, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="text-sm">{zone.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Zone Details */}
            {selectedZone && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  {selectedZone.name} Restrictions
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Minimum Lot Size</p>
                    <p className="text-sm text-gray-600">{selectedZone.restrictions.minLotSize}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Minimum Home Size</p>
                    <p className="text-sm text-gray-600">{selectedZone.restrictions.minHomeSqFt}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Setbacks</p>
                    <p className="text-sm text-gray-600">{selectedZone.restrictions.setbacks}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Height Limit</p>
                    <p className="text-sm text-gray-600">{selectedZone.restrictions.maxHeight}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Allowed Uses</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {selectedZone.restrictions.allowedUses.map((use: string, idx: number) => (
                        <li key={idx}>{use}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Prohibited</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {selectedZone.restrictions.prohibitedUses.map((use: string, idx: number) => (
                        <li key={idx}>{use}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={downloadDeedRestrictions}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Full Restrictions
                </button>
              </motion.div>
            )}

            {/* Help */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">How to Use</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Search for a specific address</li>
                <li>• Click on colored zones for details</li>
                <li>• Use filters to find specific zone types</li>
                <li>• Download full deed restrictions PDFs</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-yellow-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Important Houston Development Notes
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>• Houston has no traditional zoning, but deed restrictions govern many neighborhoods</p>
            <p>• Always verify current restrictions with title company before purchasing</p>
            <p>• Some areas have overlapping deed restrictions from multiple sources</p>
            <p>• City ordinances still apply regarding building codes, parking, and setbacks</p>
            <p>• Historic districts have additional preservation requirements</p>
          </div>
        </motion.div>
      </div>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <LeadCaptureModal
          isOpen={showLeadCapture}
          onClose={() => setShowLeadCapture(false)}
          onSuccess={() => {
            setCapturedEmail(true)
            setShowLeadCapture(false)
            downloadDeedRestrictions()
          }}
          source="zoning_explorer"
        />
      )}
    </div>
  )
}