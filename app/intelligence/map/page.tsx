'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map, Layers, TrendingUp, DollarSign, Building2, 
  Activity, Eye, EyeOff, Zap, AlertCircle, Info,
  BarChart3, Clock, MapPin, Maximize2, Filter,
  Play, Pause, ChevronRight, Camera, Download
} from 'lucide-react'
// Removed direct service imports to prevent client-side Prisma errors
import Script from 'next/script'

interface MapLayer {
  id: string
  name: string
  icon: any
  color: string
  active: boolean
  opacity: number
}

interface DevelopmentSite {
  id: string
  position: { lat: number; lng: number }
  type: 'permit' | 'opportunity' | 'active' | 'completed'
  value: number
  roi?: number
  height?: number
  data: any
}

const mapLayers: MapLayer[] = [
  { id: 'permits', name: 'Active Permits', icon: Building2, color: '#3B82F6', active: true, opacity: 0.7 },
  { id: 'opportunities', name: 'Development Opportunities', icon: TrendingUp, color: '#10B981', active: false, opacity: 0.7 },
  { id: 'costs', name: 'Construction Cost Heat Map', icon: DollarSign, color: '#F59E0B', active: false, opacity: 0.5 },
  { id: 'activity', name: 'Market Activity', icon: Activity, color: '#8B5CF6', active: false, opacity: 0.6 },
  { id: 'risk', name: 'Risk Assessment', icon: AlertCircle, color: '#EF4444', active: false, opacity: 0.4 }
]

const neighborhoods = [
  { name: 'Downtown', center: { lat: 29.7604, lng: -95.3698 }, developmentScore: 95 },
  { name: 'Midtown', center: { lat: 29.7374, lng: -95.3774 }, developmentScore: 88 },
  { name: 'Heights', center: { lat: 29.7989, lng: -95.3984 }, developmentScore: 92 },
  { name: 'Montrose', center: { lat: 29.7407, lng: -95.3908 }, developmentScore: 87 },
  { name: 'River Oaks', center: { lat: 29.7569, lng: -95.4145 }, developmentScore: 78 },
  { name: 'Galleria', center: { lat: 29.7371, lng: -95.4618 }, developmentScore: 85 },
  { name: 'Medical Center', center: { lat: 29.7100, lng: -95.3959 }, developmentScore: 90 },
  { name: 'Museum District', center: { lat: 29.7253, lng: -95.3856 }, developmentScore: 83 }
]

export default function IntelligenceMap() {
  const mapRef = useRef<google.maps.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedLayers, setSelectedLayers] = useState(mapLayers)
  const [sites, setSites] = useState<DevelopmentSite[]>([])
  const [selectedSite, setSelectedSite] = useState<DevelopmentSite | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRange, setTimeRange] = useState('current')
  const [view3D, setView3D] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const markersRef = useRef<google.maps.Marker[]>([])
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null)
  const [aiInsights, setAiInsights] = useState<string[]>([])

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !window.google) return

    const map = new google.maps.Map(document.getElementById('intelligence-map')!, {
      center: { lat: 29.7604, lng: -95.3698 },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }]
        }
      ],
      tilt: view3D ? 45 : 0,
      heading: 0,
      mapId: 'houston-dev-intelligence' // Enable 3D buildings
    })

    mapRef.current = map
    loadMapData()
  }, [mapLoaded, view3D])

  const loadMapData = async () => {
    try {
      // Mock permits data for development sites
      const mockPermits = [
        {
          permitNumber: 'P2024-001',
          address: '1234 Main St, Houston, TX',
          coordinates: { lat: 29.7604, lng: -95.3698 },
          value: 2500000,
          type: 'Commercial',
          status: 'Active'
        },
        {
          permitNumber: 'P2024-002',
          address: '5678 Memorial Dr, Houston, TX',
          coordinates: { lat: 29.7805, lng: -95.4618 },
          value: 1800000,
          type: 'Residential',
          status: 'Active'
        },
        {
          permitNumber: 'P2024-003',
          address: '9012 Heights Blvd, Houston, TX',
          coordinates: { lat: 29.7989, lng: -95.3984 },
          value: 3200000,
          type: 'Mixed-Use',
          status: 'Active'
        },
        {
          permitNumber: 'P2024-004',
          address: '3456 Montrose Blvd, Houston, TX',
          coordinates: { lat: 29.7407, lng: -95.3908 },
          value: 1500000,
          type: 'Commercial',
          status: 'Active'
        },
        {
          permitNumber: 'P2024-005',
          address: '7890 Westheimer Rd, Houston, TX',
          coordinates: { lat: 29.7371, lng: -95.4618 },
          value: 4500000,
          type: 'Commercial',
          status: 'Active'
        }
      ]
      
      const permitSites: DevelopmentSite[] = mockPermits
        .filter(p => p.coordinates)
        .map(p => ({
          id: p.permitNumber,
          position: { lat: p.coordinates!.lat, lng: p.coordinates!.lng },
          type: 'permit' as const,
          value: p.value,
          height: Math.min(p.value / 100000, 50), // Height based on value
          data: p
        }))
      
      setSites(permitSites)
      
      // Generate AI insights
      const insights = [
        "🔥 Cypress showing 47% increase in commercial permits this month",
        "💡 Midtown development costs averaging $142/sqft, down 3% from last quarter",
        "📈 Heights neighborhood ROI potential: 22-28% for mixed-use projects",
        "⚡ New opportunity: 5.2 acres in East End, zoned for high-density residential"
      ]
      setAiInsights(insights)
    } catch (error) {
      console.error('Error loading map data:', error)
    }
  }

  const toggleLayer = (layerId: string) => {
    setSelectedLayers(prev => 
      prev.map(layer => 
        layer.id === layerId ? { ...layer, active: !layer.active } : layer
      )
    )
  }

  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add markers based on active layers
    const activePermitLayer = selectedLayers.find(l => l.id === 'permits')?.active
    
    if (activePermitLayer) {
      sites.forEach(site => {
        const marker = new google.maps.Marker({
          position: site.position,
          map: mapRef.current,
          title: site.data.address || 'Development Site',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: Math.max(8, Math.min(site.value / 100000, 20)),
            fillColor: site.type === 'permit' ? '#3B82F6' : '#10B981',
            fillOpacity: 0.7,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        })

        marker.addListener('click', () => {
          setSelectedSite(site)
        })

        markersRef.current.push(marker)
      })
    }

    // Update heatmap for cost layer
    const activeCostLayer = selectedLayers.find(l => l.id === 'costs')?.active
    if (activeCostLayer && window.google?.maps?.visualization) {
      const heatmapPoints = sites.map(site => ({
        location: new google.maps.LatLng(site.position.lat, site.position.lng),
        weight: site.value / 100000
      }))

      if (heatmapRef.current) {
        heatmapRef.current.setMap(null)
      }

      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        data: heatmapPoints,
        map: mapRef.current,
        radius: 30,
        opacity: 0.6,
        gradient: [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
      })
    } else if (heatmapRef.current) {
      heatmapRef.current.setMap(null)
    }
  }, [sites, selectedLayers])

  useEffect(() => {
    updateMarkers()
  }, [updateMarkers])

  const captureScreenshot = () => {
    // In production, implement map screenshot functionality
    alert('Map screenshot feature coming soon!')
  }

  const toggle3DView = () => {
    setView3D(!view3D)
    if (mapRef.current) {
      mapRef.current.setTilt(view3D ? 0 : 45)
    }
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=visualization&callback=Function.prototype`}
        onLoad={() => setMapLoaded(true)}
      />

      <div className="h-screen flex flex-col bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Map className="h-6 w-6 text-purple-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Houston Development Intelligence Map</h1>
              <div className="ml-6 flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Live Data</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggle3DView}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  view3D ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                3D View
              </button>
              
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                {showStats ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              
              <button
                onClick={captureScreenshot}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          {/* Map Container */}
          <div id="intelligence-map" className="absolute inset-0"></div>

          {/* Layer Controls */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="absolute top-4 left-4 bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-4 w-72"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Data Layers</h3>
              <Layers className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              {selectedLayers.map(layer => {
                const Icon = layer.icon
                return (
                  <div
                    key={layer.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                      layer.active ? 'bg-gray-700' : 'hover:bg-gray-700/50'
                    }`}
                    onClick={() => toggleLayer(layer.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full mr-3 transition-opacity ${
                          layer.active ? 'opacity-100' : 'opacity-30'
                        }`}
                        style={{ backgroundColor: layer.color }}
                      />
                      <Icon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className={`text-sm ${layer.active ? 'text-white' : 'text-gray-400'}`}>
                        {layer.name}
                      </span>
                    </div>
                    <div className={`text-xs ${layer.active ? 'text-green-400' : 'text-gray-500'}`}>
                      {layer.active ? 'ON' : 'OFF'}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Time Controls */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">Time Range</h4>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value="current">Current</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Stats Panel */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">2,847</div>
                    <div className="text-xs text-gray-400">Active Permits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">$4.8B</div>
                    <div className="text-xs text-gray-400">Total Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">156</div>
                    <div className="text-xs text-gray-400">Opportunities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">22%</div>
                    <div className="text-xs text-gray-400">Avg ROI</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Insights Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 right-4 bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-4 max-w-md"
          >
            <div className="flex items-center mb-3">
              <Zap className="h-5 w-5 text-yellow-400 mr-2" />
              <h3 className="text-sm font-semibold text-white">AI Insights</h3>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="text-xs text-gray-300 flex items-start"
                >
                  <ChevronRight className="h-3 w-3 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
                  {insight}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Selected Site Details */}
          <AnimatePresence>
            {selectedSite && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-1/2 -translate-y-1/2 right-4 bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-6 w-80"
              >
                <button
                  onClick={() => setSelectedSite(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  ×
                </button>
                
                <h3 className="text-lg font-semibold text-white mb-4">Site Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400">Address</div>
                    <div className="text-sm text-white">{selectedSite.data.address || 'N/A'}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-400">Value</div>
                    <div className="text-lg font-bold text-green-400">
                      ${(selectedSite.value / 1000000).toFixed(2)}M
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-400">Type</div>
                    <div className="text-sm text-white">{selectedSite.data.type || 'Development'}</div>
                  </div>
                  
                  {selectedSite.roi && (
                    <div>
                      <div className="text-xs text-gray-400">Projected ROI</div>
                      <div className="text-lg font-bold text-purple-400">{selectedSite.roi}%</div>
                    </div>
                  )}
                  
                  <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    View Full Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Neighborhood Scores Overlay */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex space-x-2">
            {neighborhoods.slice(0, 4).map((hood, index) => (
              <motion.div
                key={hood.name}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2"
              >
                <div className="text-xs text-gray-400">{hood.name}</div>
                <div className="text-sm font-bold text-white flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      hood.developmentScore >= 90 ? 'bg-green-400' :
                      hood.developmentScore >= 80 ? 'bg-yellow-400' : 'bg-orange-400'
                    }`}
                  />
                  {hood.developmentScore}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}