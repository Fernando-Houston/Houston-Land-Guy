'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Layers, Calculator, Brain, Sparkles,
  Building2, Home, Factory, TreePine, ShoppingBag,
  Info, TrendingUp, DollarSign, AlertTriangle,
  Maximize2, ZoomIn, ZoomOut, Crosshair, Palette,
  FileText, Download, Share2, ChevronRight
} from 'lucide-react'
import Script from 'next/script'
import { getNeighborhoodIntelligence, queryPerplexity } from '@/lib/services/data-intelligence'

interface ZoneType {
  id: string
  name: string
  color: string
  opacity: number
  description: string
  allowedUses: string[]
  restrictions: string[]
  developmentPotential: number
}

const zoneTypes: Record<string, ZoneType> = {
  'residential': {
    id: 'residential',
    name: 'Residential',
    color: '#10B981',
    opacity: 0.6,
    description: 'Single-family homes, townhomes, apartments',
    allowedUses: ['Single-family', 'Multi-family', 'Townhomes', 'ADUs'],
    restrictions: ['No commercial', 'Height limits vary'],
    developmentPotential: 75
  },
  'commercial': {
    id: 'commercial',
    name: 'Commercial',
    color: '#3B82F6',
    opacity: 0.6,
    description: 'Retail, office, restaurants',
    allowedUses: ['Retail', 'Office', 'Restaurants', 'Services'],
    restrictions: ['Parking requirements', 'Signage limits'],
    developmentPotential: 85
  },
  'industrial': {
    id: 'industrial',
    name: 'Industrial',
    color: '#6366F1',
    opacity: 0.6,
    description: 'Manufacturing, warehouses, distribution',
    allowedUses: ['Manufacturing', 'Warehousing', 'Distribution', 'Light industrial'],
    restrictions: ['Environmental compliance', 'Truck access required'],
    developmentPotential: 70
  },
  'mixed-use': {
    id: 'mixed-use',
    name: 'Mixed-Use',
    color: '#8B5CF6',
    opacity: 0.6,
    description: 'Combined residential and commercial',
    allowedUses: ['Ground-floor retail', 'Upper-floor residential', 'Live-work units'],
    restrictions: ['Design standards', 'Pedestrian-friendly requirements'],
    developmentPotential: 95
  },
  'special': {
    id: 'special',
    name: 'Special Purpose',
    color: '#F59E0B',
    opacity: 0.6,
    description: 'Schools, hospitals, government',
    allowedUses: ['Institutional', 'Educational', 'Medical', 'Government'],
    restrictions: ['Special permits required', 'Community review'],
    developmentPotential: 60
  }
}

interface DevelopmentScenario {
  type: string
  units?: number
  sqft: number
  floors: number
  parkingSpaces: number
  estimatedCost: number
  estimatedROI: number
  timeline: string
}

export default function ZoningIntelligence() {
  const mapRef = useRef<google.maps.Map | null>(null)
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [scenarios, setScenarios] = useState<DevelopmentScenario[]>([])
  const [viewMode, setViewMode] = useState<'zones' | 'potential' | 'restrictions'>('zones')
  const [loading, setLoading] = useState(false)
  const [drawnPolygons, setDrawnPolygons] = useState<google.maps.Polygon[]>([])
  const [selectedArea, setSelectedArea] = useState<number>(0)

  useEffect(() => {
    if (!mapLoaded || !window.google) return

    const map = new google.maps.Map(document.getElementById('zoning-map')!, {
      center: { lat: 29.7604, lng: -95.3698 },
      zoom: 12,
      mapTypeControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    })

    mapRef.current = map

    // Initialize drawing tools
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      polygonOptions: {
        fillColor: '#8B5CF6',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#8B5CF6',
        editable: true,
        draggable: true
      }
    })

    drawingManager.setMap(map)
    drawingManagerRef.current = drawingManager

    // Handle polygon complete
    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: google.maps.Polygon) => {
      handlePolygonComplete(polygon)
    })

    // Handle click on map
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        handleMapClick(e.latLng)
      }
    })

    // Load sample zoning data
    loadZoningData()
  }, [mapLoaded])

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const area = google.maps.geometry.spherical.computeArea(polygon.getPath())
    const acres = area * 0.000247105
    setSelectedArea(acres)
    setDrawnPolygons(prev => [...prev, polygon])
    
    // Analyze the selected area
    analyzeSelectedArea(polygon, acres)
  }

  const handleMapClick = async (latLng: google.maps.LatLng) => {
    setSelectedLocation(latLng)
    setLoading(true)

    // Simulate zone detection (in production, query actual zoning data)
    const zones = Object.keys(zoneTypes)
    const randomZone = zones[Math.floor(Math.random() * zones.length)]
    setSelectedZone(randomZone)

    // Get AI analysis for this location
    try {
      const analysis = await queryPerplexity(
        `Analyze development potential for a ${randomZone} zoned property in Houston at coordinates ${latLng.lat()}, ${latLng.lng()}. Include market conditions, nearby developments, and opportunities.`,
        'You are a Houston zoning and development expert providing specific, actionable insights.'
      )
      setAiAnalysis(analysis)

      // Generate development scenarios
      generateScenarios(randomZone)
    } catch (error) {
      console.error('Error getting AI analysis:', error)
    }

    setLoading(false)
  }

  const analyzeSelectedArea = async (polygon: google.maps.Polygon, acres: number) => {
    setLoading(true)
    
    try {
      const analysis = await queryPerplexity(
        `Analyze development potential for ${acres.toFixed(2)} acres in Houston. Suggest optimal development types, density, and potential returns based on current market conditions.`,
        'You are a Houston real estate development advisor providing specific recommendations.'
      )
      
      setAiAnalysis(analysis)
      
      // Generate scenarios based on acreage
      generateScenariosForAcreage(acres)
    } catch (error) {
      console.error('Error analyzing area:', error)
    }
    
    setLoading(false)
  }

  const generateScenarios = (zoneType: string) => {
    const zone = zoneTypes[zoneType]
    const baseScenarios: DevelopmentScenario[] = []

    if (zone.id === 'residential' || zone.id === 'mixed-use') {
      baseScenarios.push({
        type: 'Luxury Townhomes',
        units: 24,
        sqft: 48000,
        floors: 3,
        parkingSpaces: 48,
        estimatedCost: 8500000,
        estimatedROI: 28,
        timeline: '18-24 months'
      })
    }

    if (zone.id === 'commercial' || zone.id === 'mixed-use') {
      baseScenarios.push({
        type: 'Retail Center',
        sqft: 25000,
        floors: 1,
        parkingSpaces: 125,
        estimatedCost: 4500000,
        estimatedROI: 22,
        timeline: '12-16 months'
      })
    }

    if (zone.id === 'industrial') {
      baseScenarios.push({
        type: 'Flex Warehouse',
        sqft: 40000,
        floors: 1,
        parkingSpaces: 60,
        estimatedCost: 5200000,
        estimatedROI: 18,
        timeline: '10-14 months'
      })
    }

    setScenarios(baseScenarios)
  }

  const generateScenariosForAcreage = (acres: number) => {
    const scenarios: DevelopmentScenario[] = []
    
    if (acres >= 1) {
      scenarios.push({
        type: 'Single-Family Subdivision',
        units: Math.floor(acres * 4),
        sqft: Math.floor(acres * 4 * 2500),
        floors: 2,
        parkingSpaces: Math.floor(acres * 8),
        estimatedCost: Math.floor(acres * 4 * 350000),
        estimatedROI: 25,
        timeline: '24-36 months'
      })
    }
    
    if (acres >= 2) {
      scenarios.push({
        type: 'Apartment Complex',
        units: Math.floor(acres * 30),
        sqft: Math.floor(acres * 30 * 900),
        floors: 3,
        parkingSpaces: Math.floor(acres * 45),
        estimatedCost: Math.floor(acres * 30 * 125000),
        estimatedROI: 22,
        timeline: '18-24 months'
      })
    }
    
    setScenarios(scenarios)
  }

  const loadZoningData = () => {
    if (!mapRef.current) return

    // Sample zoning polygons for demonstration
    const sampleZones = [
      {
        paths: [
          { lat: 29.7704, lng: -95.3798 },
          { lat: 29.7704, lng: -95.3698 },
          { lat: 29.7604, lng: -95.3698 },
          { lat: 29.7604, lng: -95.3798 }
        ],
        type: 'commercial'
      },
      {
        paths: [
          { lat: 29.7804, lng: -95.3898 },
          { lat: 29.7804, lng: -95.3798 },
          { lat: 29.7704, lng: -95.3798 },
          { lat: 29.7704, lng: -95.3898 }
        ],
        type: 'residential'
      },
      {
        paths: [
          { lat: 29.7504, lng: -95.3798 },
          { lat: 29.7504, lng: -95.3698 },
          { lat: 29.7404, lng: -95.3698 },
          { lat: 29.7404, lng: -95.3798 }
        ],
        type: 'mixed-use'
      }
    ]

    sampleZones.forEach(zone => {
      const zoneData = zoneTypes[zone.type]
      new google.maps.Polygon({
        paths: zone.paths,
        strokeColor: zoneData.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: zoneData.color,
        fillOpacity: zoneData.opacity,
        map: mapRef.current
      })
    })
  }

  const clearDrawings = () => {
    drawnPolygons.forEach(polygon => polygon.setMap(null))
    setDrawnPolygons([])
    setSelectedArea(0)
    setScenarios([])
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=drawing,geometry&callback=Function.prototype`}
        onLoad={() => setMapLoaded(true)}
      />

      <div className="h-screen flex bg-gray-50">
        {/* Left Panel */}
        <motion.div
          initial={{ x: -400 }}
          animate={{ x: 0 }}
          className="w-96 bg-white shadow-xl z-10 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Zoning Intelligence</h1>
              <Brain className="h-6 w-6" />
            </div>
            <p className="text-purple-100">
              AI-powered zoning analysis and development scenarios
            </p>
          </div>

          {/* View Mode Tabs */}
          <div className="flex border-b">
            {['zones', 'potential', 'restrictions'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                  viewMode === mode
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {viewMode === 'zones' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Zone Types</h3>
                {Object.values(zoneTypes).map(zone => (
                  <div
                    key={zone.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedZone(zone.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: zone.color }}
                        />
                        <h4 className="font-medium text-gray-900">{zone.name}</h4>
                      </div>
                      <div className="text-sm text-gray-500">
                        {zone.developmentPotential}% potential
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{zone.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Info className="h-3 w-3 mr-1" />
                      {zone.allowedUses.length} allowed uses
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'potential' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                  </div>
                  {loading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ) : aiAnalysis ? (
                    <p className="text-sm text-gray-700">{aiAnalysis}</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Click on the map or draw an area to analyze development potential
                    </p>
                  )}
                </div>

                {selectedArea > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Selected Area</h4>
                      <button
                        onClick={clearDrawings}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedArea.toFixed(2)} acres
                    </div>
                    <div className="text-sm text-gray-600">
                      {(selectedArea * 43560).toFixed(0)} sq ft
                    </div>
                  </div>
                )}

                {scenarios.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Development Scenarios</h4>
                    {scenarios.map((scenario, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{scenario.type}</h5>
                          <div className="text-lg font-bold text-green-600">
                            {scenario.estimatedROI}% ROI
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {scenario.units && (
                            <div>
                              <span className="text-gray-500">Units:</span>
                              <span className="ml-2 font-medium">{scenario.units}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Size:</span>
                            <span className="ml-2 font-medium">{scenario.sqft.toLocaleString()} sqft</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Cost:</span>
                            <span className="ml-2 font-medium">${(scenario.estimatedCost / 1000000).toFixed(1)}M</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Timeline:</span>
                            <span className="ml-2 font-medium">{scenario.timeline}</span>
                          </div>
                        </div>
                        <button className="mt-3 w-full text-sm text-purple-600 font-medium hover:text-purple-700">
                          View Detailed Analysis →
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'restrictions' && selectedZone && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {zoneTypes[selectedZone].name} Zone Restrictions
                </h3>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <h4 className="font-medium text-gray-900">Key Restrictions</h4>
                  </div>
                  <ul className="space-y-1">
                    {zoneTypes[selectedZone].restrictions.map((restriction, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
                        {restriction}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Building2 className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-gray-900">Allowed Uses</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {zoneTypes[selectedZone].allowedUses.map((use, index) => (
                      <div key={index} className="text-sm text-gray-700 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {use}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                <Download className="h-4 w-4 inline mr-1" />
                Export Report
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                <Share2 className="h-4 w-4 inline mr-1" />
                Share Analysis
              </button>
            </div>
          </div>
        </motion.div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div id="zoning-map" className="absolute inset-0"></div>

          {/* Map Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
            <div className="space-y-2">
              {Object.values(zoneTypes).map(zone => (
                <div key={zone.id} className="flex items-center text-xs">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: zone.color, opacity: zone.opacity }}
                  />
                  <span className="text-gray-700">{zone.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg px-6 py-3"
          >
            <div className="flex items-center text-sm text-gray-700">
              <Crosshair className="h-4 w-4 text-purple-600 mr-2" />
              Click on map to analyze a location or use drawing tools to select an area
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}