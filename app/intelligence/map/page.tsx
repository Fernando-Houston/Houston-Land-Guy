'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map, Layers, TrendingUp, DollarSign, Building2, 
  Activity, Eye, EyeOff, Zap, AlertCircle, Info,
  BarChart3, Clock, MapPin, Maximize2, Filter,
  Play, Pause, ChevronRight, Camera, Download,
  Search, Settings, Navigation, ZoomIn, ZoomOut,
  Brain, Target, Shield, Users, Home, ArrowUp,
  ArrowDown, Calendar, Calculator, Share2, X,
  ChevronDown, MoreHorizontal, Bookmark
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
  { id: 'opportunities', name: 'Investment Opportunities', icon: TrendingUp, color: '#10B981', active: false, opacity: 0.7 },
  { id: 'costs', name: 'Construction Cost Heat', icon: DollarSign, color: '#F59E0B', active: false, opacity: 0.5 },
  { id: 'demographics', name: 'Demographics', icon: Users, color: '#06B6D4', active: false, opacity: 0.6 },
  { id: 'risk', name: 'Risk Assessment', icon: Shield, color: '#EF4444', active: false, opacity: 0.4 },
  { id: 'infrastructure', name: 'Infrastructure', icon: Zap, color: '#84CC16', active: false, opacity: 0.6 },
  { id: 'activity', name: 'Market Activity', icon: Activity, color: '#8B5CF6', active: false, opacity: 0.6 }
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
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [currentHeatmapType, setCurrentHeatmapType] = useState<string | null>(null)
  const [animatedMarkers, setAnimatedMarkers] = useState<any[]>([])
  const [pulsingAreas, setPulsingAreas] = useState<any[]>([])

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
      // Enhanced mock permits data with more variety and detail
      const mockPermits = [
        {
          permitNumber: 'P2024-001',
          address: '1234 Main St, Houston, TX',
          coordinates: { lat: 29.7604, lng: -95.3698 },
          value: 2500000,
          type: 'Commercial',
          status: 'Active',
          priority: 'high',
          riskLevel: 'low'
        },
        {
          permitNumber: 'P2024-002',
          address: '5678 Memorial Dr, Houston, TX',
          coordinates: { lat: 29.7805, lng: -95.4618 },
          value: 1800000,
          type: 'Residential',
          status: 'Active',
          priority: 'medium',
          riskLevel: 'medium'
        },
        {
          permitNumber: 'P2024-003',
          address: '9012 Heights Blvd, Houston, TX',
          coordinates: { lat: 29.7989, lng: -95.3984 },
          value: 3200000,
          type: 'Mixed-Use',
          status: 'Active',
          priority: 'high',
          riskLevel: 'low'
        },
        {
          permitNumber: 'P2024-004',
          address: '3456 Montrose Blvd, Houston, TX',
          coordinates: { lat: 29.7407, lng: -95.3908 },
          value: 1500000,
          type: 'Commercial',
          status: 'Active',
          priority: 'low',
          riskLevel: 'high'
        },
        {
          permitNumber: 'P2024-005',
          address: '7890 Westheimer Rd, Houston, TX',
          coordinates: { lat: 29.7371, lng: -95.4618 },
          value: 4500000,
          type: 'Commercial',
          status: 'Active',
          priority: 'high',
          riskLevel: 'low'
        },
        // Additional scattered permits for better visualization
        {
          permitNumber: 'P2024-006',
          address: '2468 River Oaks Blvd, Houston, TX',
          coordinates: { lat: 29.7569, lng: -95.4145 },
          value: 5200000,
          type: 'Luxury Residential',
          status: 'Planning',
          priority: 'high',
          riskLevel: 'low'
        },
        {
          permitNumber: 'P2024-007',
          address: '1357 Energy Corridor Dr, Houston, TX',
          coordinates: { lat: 29.7433, lng: -95.6100 },
          value: 8900000,
          type: 'Office Complex',
          status: 'Under Construction',
          priority: 'high',
          riskLevel: 'medium'
        },
        {
          permitNumber: 'P2024-008',
          address: '9876 Cypress Creek Pkwy, Houston, TX',
          coordinates: { lat: 29.9500, lng: -95.6772 },
          value: 3100000,
          type: 'Industrial',
          status: 'Active',
          priority: 'medium',
          riskLevel: 'low'
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
        // Dynamic marker colors based on priority and type
        let fillColor = '#3B82F6'; // default blue
        let strokeColor = '#ffffff';
        let strokeWeight = 2;
        
        if (site.data.priority === 'high') {
          fillColor = site.data.riskLevel === 'low' ? '#10B981' : '#F59E0B'; // green for safe high priority, yellow for risky
          strokeWeight = 3;
        } else if (site.data.riskLevel === 'high') {
          fillColor = '#EF4444'; // red for high risk
          strokeColor = '#FCA5A5';
        }

        // Pulsing animation for high-priority items
        const isPulsing = site.data.priority === 'high';
        
        const marker = new google.maps.Marker({
          position: site.position,
          map: mapRef.current,
          title: `${site.data.address} - ${site.data.type} ($${(site.value/1000000).toFixed(1)}M)`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isPulsing ? Math.max(12, Math.min(site.value / 80000, 25)) : Math.max(8, Math.min(site.value / 100000, 20)),
            fillColor: fillColor,
            fillOpacity: isPulsing ? 0.8 : 0.7,
            strokeColor: strokeColor,
            strokeWeight: strokeWeight
          },
          animation: isPulsing ? google.maps.Animation.BOUNCE : undefined
        })

        marker.addListener('click', () => {
          setSelectedSite(site)
        })

        markersRef.current.push(marker)
      })
    }
  }, [selectedLayers, sites])

  // Enhanced heatmap system with multiple types
  const updateHeatmap = useCallback(() => {
    const updateHeatmapInternal = (layerId: string, gradientType: string) => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null)
      }

      let heatmapPoints: any[] = [];
      let gradient: string[] = [];
      let radius = 30;
      let opacity = 0.6;

      switch (layerId) {
        case 'costs':
          heatmapPoints = sites.map(site => ({
            location: new google.maps.LatLng(site.position.lat, site.position.lng),
            weight: site.value / 100000
          }));
          gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 0.6)',
            'rgba(0, 191, 255, 0.8)',
            'rgba(0, 127, 255, 1)',
            'rgba(255, 255, 0, 1)',
            'rgba(255, 127, 0, 1)',
            'rgba(255, 0, 0, 1)'
          ];
          break;
        case 'demographics':
          // Population density simulation
          neighborhoods.forEach(hood => {
            heatmapPoints.push({
              location: new google.maps.LatLng(hood.center.lat, hood.center.lng),
              weight: hood.developmentScore / 10
            });
          });
          gradient = [
            'rgba(0, 255, 0, 0)',
            'rgba(0, 255, 0, 0.6)',
            'rgba(255, 255, 0, 0.8)',
            'rgba(255, 127, 0, 1)',
            'rgba(255, 0, 0, 1)'
          ];
          radius = 50;
          break;
        case 'risk':
          heatmapPoints = sites.filter(site => site.data.riskLevel === 'high').map(site => ({
            location: new google.maps.LatLng(site.position.lat, site.position.lng),
            weight: 5
          }));
          gradient = [
            'rgba(255, 0, 0, 0)',
            'rgba(255, 0, 0, 0.3)',
            'rgba(255, 0, 0, 0.6)',
            'rgba(255, 0, 0, 0.8)',
            'rgba(139, 0, 0, 1)'
          ];
          opacity = 0.4;
          break;
        case 'opportunities':
          heatmapPoints = sites.filter(site => site.data.priority === 'high' && site.data.riskLevel === 'low').map(site => ({
            location: new google.maps.LatLng(site.position.lat, site.position.lng),
            weight: site.value / 50000
          }));
          gradient = [
            'rgba(0, 255, 0, 0)',
            'rgba(0, 255, 0, 0.4)',
            'rgba(34, 197, 94, 0.6)',
            'rgba(22, 163, 74, 0.8)',
            'rgba(21, 128, 61, 1)'
          ];
          break;
      }

      if (heatmapPoints.length > 0) {
        heatmapRef.current = new google.maps.visualization.HeatmapLayer({
          data: heatmapPoints,
          map: mapRef.current,
          radius: radius,
          opacity: opacity,
          gradient: gradient
        });
        setCurrentHeatmapType(layerId);
      }
    };

    // Check for active heatmap layers
    const activeCostLayer = selectedLayers.find(l => l.id === 'costs')?.active;
    const activeDemographicsLayer = selectedLayers.find(l => l.id === 'demographics')?.active;
    const activeRiskLayer = selectedLayers.find(l => l.id === 'risk')?.active;
    const activeOpportunitiesLayer = selectedLayers.find(l => l.id === 'opportunities')?.active;

    if (activeCostLayer && window.google?.maps?.visualization) {
      updateHeatmapInternal('costs', 'cost');
    } else if (activeDemographicsLayer && window.google?.maps?.visualization) {
      updateHeatmapInternal('demographics', 'population');
    } else if (activeRiskLayer && window.google?.maps?.visualization) {
      updateHeatmapInternal('risk', 'risk');
    } else if (activeOpportunitiesLayer && window.google?.maps?.visualization) {
      updateHeatmapInternal('opportunities', 'opportunity');
    } else if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      setCurrentHeatmapType(null);
    }
  }, [sites, selectedLayers, neighborhoods])

  useEffect(() => {
    updateMarkers()
  }, [updateMarkers])

  useEffect(() => {
    updateHeatmap()
  }, [updateHeatmap])

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
        {/* Enhanced Header */}
        <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Map className="h-6 w-6 text-purple-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Houston Development Intelligence Map</h1>
              <div className="ml-6 flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-300 font-medium">Live Data</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Enhanced Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search neighborhoods, addresses..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-80"
                />
              </div>

              {/* Map Style Selector */}
              <select className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="satellite">Satellite</option>
                <option value="streets">Streets</option>
                <option value="terrain">Terrain</option>
                <option value="dark">Dark Mode</option>
              </select>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggle3DView}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    view3D ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  3D View
                </button>
                
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {showStats ? <EyeOff className="h-4 w-4 text-gray-300" /> : <Eye className="h-4 w-4 text-gray-300" />}
                </button>
                
                <button
                  onClick={captureScreenshot}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Camera className="h-4 w-4 text-gray-300" />
                </button>

                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <Share2 className="h-4 w-4 text-gray-300" />
                </button>

                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <Download className="h-4 w-4 text-gray-300" />
                </button>

                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <Maximize2 className="h-4 w-4 text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          {/* Map Container */}
          <div id="intelligence-map" className="absolute inset-0"></div>

          {/* Enhanced Layer Controls */}
          <motion.div
            initial={{ x: leftPanelCollapsed ? -280 : 0 }}
            animate={{ x: leftPanelCollapsed ? -280 : 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute top-4 left-4 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 transition-all ${leftPanelCollapsed ? 'w-20' : 'w-80'}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                {!leftPanelCollapsed && <h3 className="text-lg font-semibold text-white">Data Layers</h3>}
                <div className="flex items-center gap-2">
                  {!leftPanelCollapsed && <Layers className="h-5 w-5 text-gray-400" />}
                  <button 
                    onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    title={leftPanelCollapsed ? "Expand Panel" : "Collapse Panel"}
                  >
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${leftPanelCollapsed ? 'rotate-90' : '-rotate-90'}`} />
                  </button>
                  {!leftPanelCollapsed && (
                    <button className="p-1 hover:bg-gray-800 rounded">
                      <Settings className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
              
              {!leftPanelCollapsed && (
                <div className="space-y-3">
                  {selectedLayers.map((layer, index) => {
                    const Icon = layer.icon
                    const layerCount = layer.id === 'permits' ? 1247 : 
                                     layer.id === 'opportunities' ? 89 :
                                     layer.id === 'risk' ? 156 : 
                                     layer.id === 'infrastructure' ? 234 : null;
                    
                    return (
                      <motion.div
                        key={layer.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 rounded-lg cursor-pointer transition-all border ${
                          layer.active 
                            ? 'bg-gray-800 border-purple-500/50' 
                            : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
                        }`}
                        onClick={() => toggleLayer(layer.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-all ${layer.active ? 'scale-110' : ''}`} style={{ backgroundColor: layer.color + '20' }}>
                              <Icon className="h-4 w-4" style={{ color: layer.color }} />
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${layer.active ? 'text-white' : 'text-gray-300'}`}>
                                {layer.name}
                              </div>
                              {layerCount && (
                                <div className="text-xs text-gray-400">
                                  {layerCount.toLocaleString()} items
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {layer.active && (
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Toggle visibility logic
                              }}
                              className="p-1 hover:bg-gray-700 rounded"
                            >
                              {layer.active ? 
                                <Eye className="h-3 w-3 text-gray-300" /> : 
                                <EyeOff className="h-3 w-3 text-gray-500" />
                              }
                            </button>
                          </div>
                        </div>
                        
                        {layer.active && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-2 pt-2 border-t border-gray-700"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400">Opacity</span>
                              <span className="text-gray-300">{Math.round(layer.opacity * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={layer.opacity}
                              onChange={(e) => {
                                // Update opacity logic
                              }}
                              className="w-full mt-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* Collapsed State - Show quick layer toggles */}
              {leftPanelCollapsed && (
                <div className="space-y-2">
                  {selectedLayers.slice(0, 4).map((layer) => {
                    const Icon = layer.icon;
                    return (
                      <button
                        key={layer.id}
                        onClick={() => toggleLayer(layer.id)}
                        className={`w-full p-2 rounded-lg transition-all ${
                          layer.active ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                        title={layer.name}
                      >
                        <Icon className="h-4 w-4 text-white mx-auto" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Enhanced Time Controls */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">Time Range</h4>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span className="text-sm">{isPlaying ? 'Stop' : 'Play'}</span>
                    </button>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="current">Current</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="1y">Last Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                <h5 className="text-xs font-medium text-gray-400 mb-2">Live Metrics</h5>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-400">1,247</div>
                    <div className="text-xs text-gray-400">Permits</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">$2.4B</div>
                    <div className="text-xs text-gray-400">Value</div>
                  </div>
                </div>
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

          {/* Enhanced AI Insights Panel */}
          <motion.div
            initial={{ opacity: 0, x: rightPanelCollapsed ? 280 : 0 }}
            animate={{ opacity: 1, x: rightPanelCollapsed ? 280 : 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute top-4 right-4 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 transition-all ${rightPanelCollapsed ? 'w-20' : 'w-96'}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {!rightPanelCollapsed && <Brain className="h-5 w-5 text-purple-400" />}
                  {!rightPanelCollapsed && <h3 className="text-lg font-semibold text-white">AI Insights</h3>}
                  {!rightPanelCollapsed && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    title={rightPanelCollapsed ? "Expand AI Panel" : "Collapse AI Panel"}
                  >
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${rightPanelCollapsed ? '-rotate-90' : 'rotate-90'}`} />
                  </button>
                  {!rightPanelCollapsed && (
                    <button className="p-1 hover:bg-gray-800 rounded">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {!rightPanelCollapsed && (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {[
                  {
                    type: 'opportunity',
                    icon: Target,
                    title: 'Hot Zone Detected',
                    description: 'Cypress showing 47% increase in commercial permits this month',
                    trend: 'up',
                    color: 'text-green-400'
                  },
                  {
                    type: 'market',
                    icon: TrendingUp,
                    title: 'Market Timing',
                    description: 'Heights neighborhood ROI potential: 22-28% for mixed-use projects',
                    value: '25%',
                    color: 'text-blue-400'
                  },
                  {
                    type: 'alert',
                    icon: AlertCircle,
                    title: 'Risk Alert',
                    description: 'New flood mapping may impact 3 active developments in Braeswood',
                    trend: 'down',
                    color: 'text-red-400'
                  },
                  {
                    type: 'recommendation',
                    icon: Brain,
                    title: 'AI Recommendation',
                    description: '5.2 acres in East End, zoned for high-density residential',
                    value: '$2.1M',
                    color: 'text-purple-400'
                  }
                ].map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${insight.type === 'opportunity' ? 'bg-green-500/20' : insight.type === 'alert' ? 'bg-red-500/20' : insight.type === 'market' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                          <Icon className={`h-4 w-4 ${insight.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-white truncate">{insight.title}</h4>
                            {insight.trend && (
                              <div className="flex items-center">
                                {insight.trend === 'up' ? 
                                  <ArrowUp className="h-3 w-3 text-green-400" /> :
                                  <ArrowDown className="h-3 w-3 text-red-400" />
                                }
                              </div>
                            )}
                            {insight.value && (
                              <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300 flex-shrink-0">
                                {insight.value}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                </div>
              )}

              {!rightPanelCollapsed && (
                <div>
                {/* Fernando-X Chat Integration */}
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">Ask Fernando-X</span>
                  </div>
                  <div className="space-y-1">
                    <button className="w-full text-left p-2 text-xs text-gray-300 hover:bg-gray-800/50 rounded transition-colors">
                      "Show me highest ROI opportunities in this area"
                    </button>
                    <button className="w-full text-left p-2 text-xs text-gray-300 hover:bg-gray-800/50 rounded transition-colors">
                      "What's driving permit activity in Cypress?"
                    </button>
                    <button className="w-full text-left p-2 text-xs text-gray-300 hover:bg-gray-800/50 rounded transition-colors">
                      "Compare construction costs: Heights vs River Oaks"
                    </button>
                  </div>
                  <button className="w-full mt-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium text-white transition-colors">
                    Open Full Chat
                  </button>
                </div>
                </div>
              )}

              {/* Collapsed State - Show AI status */}
              {rightPanelCollapsed && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <div className="text-xs text-gray-400 text-center writing-mode-vertical-rl" style={{ writingMode: 'vertical-rl' }}>
                    AI Active
                  </div>
                </div>
              )}
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

          {/* Enhanced Map Controls */}
          <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
            <button className="p-3 bg-gray-900/90 hover:bg-gray-800 rounded-lg border border-gray-600 transition-colors">
              <ZoomIn className="h-5 w-5 text-white" />
            </button>
            <button className="p-3 bg-gray-900/90 hover:bg-gray-800 rounded-lg border border-gray-600 transition-colors">
              <ZoomOut className="h-5 w-5 text-white" />
            </button>
            <button className="p-3 bg-gray-900/90 hover:bg-gray-800 rounded-lg border border-gray-600 transition-colors">
              <Navigation className="h-5 w-5 text-white" />
            </button>
            <button className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <span className="text-white text-sm font-medium">3D</span>
            </button>
          </div>

          {/* Enhanced Timeline Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-700 px-6 py-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white font-medium">Development Timeline</span>
              </div>
              <div className="flex items-center gap-4">
                {[
                  { month: 'Jan', permits: 95, value: '$125M', active: false },
                  { month: 'Feb', permits: 88, value: '$142M', active: false },
                  { month: 'Mar', permits: 112, value: '$167M', active: false },
                  { month: 'Apr', permits: 134, value: '$189M', active: false },
                  { month: 'May', permits: 156, value: '$203M', active: false },
                  { month: 'Jun', permits: 147, value: '$198M', active: true }
                ].map((data, i) => (
                  <div key={data.month} className="text-center cursor-pointer hover:bg-gray-800/50 rounded p-2 transition-colors">
                    <div className="text-xs text-gray-400">{data.month}</div>
                    <div className={`w-12 h-6 rounded mt-1 flex items-center justify-center transition-colors ${
                      data.active ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}>
                      <span className="text-xs text-white font-medium">{data.permits}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{data.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
                </button>
              </div>
            </div>
          </div>

          {/* Heat Map Indicator */}
          {currentHeatmapType && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentHeatmapType === 'costs' ? 'bg-yellow-400' :
                  currentHeatmapType === 'demographics' ? 'bg-cyan-400' :
                  currentHeatmapType === 'risk' ? 'bg-red-400' :
                  'bg-green-400'
                }`} />
                <span className="text-sm text-white font-medium">
                  {currentHeatmapType === 'costs' ? 'Construction Cost Heat' :
                   currentHeatmapType === 'demographics' ? 'Population Density' :
                   currentHeatmapType === 'risk' ? 'Risk Assessment' :
                   'Investment Opportunities'} Active
                </span>
              </div>
            </div>
          )}

          {/* Neighborhood Scores Overlay */}
          <div className={`absolute ${currentHeatmapType ? 'top-32' : 'top-20'} left-1/2 -translate-x-1/2 flex space-x-2`}>
            {neighborhoods.slice(0, 4).map((hood, index) => (
              <motion.div
                key={hood.name}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700 cursor-pointer hover:bg-gray-800/70 transition-colors"
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