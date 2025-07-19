'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader2, Camera, Layers, Navigation, Maximize2 } from 'lucide-react'

interface Map3DProps {
  center: { lat: number; lng: number }
  zoom: number
  layers: any[]
  properties: any[]
  viewMode: '3d' | '2d'
  onPropertyClick: (property: any) => void
}

interface DroneImagery {
  id: string
  coordinates: { lat: number; lng: number }
  imageUrl: string
  captureDate: string
  altitude: number
  resolution: string
}

export default function Map3D({ center, zoom, layers, properties, viewMode, onPropertyClick }: Map3DProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [threeDEnabled, setThreeDEnabled] = useState(false)
  const [droneImagery, setDroneImagery] = useState<DroneImagery[]>([])
  const [selectedImagery, setSelectedImagery] = useState<DroneImagery | null>(null)
  const [mapLayers, setMapLayers] = useState<google.maps.Data[]>([])
  const markersRef = useRef<google.maps.Marker[]>([])
  const heatmapsRef = useRef<google.maps.visualization.HeatmapLayer[]>([])

  // Load drone imagery data
  useEffect(() => {
    loadDroneImagery()
  }, [])

  const loadDroneImagery = async () => {
    try {
      // Mock drone imagery data - in production this would come from drone service API
      const mockImagery: DroneImagery[] = [
        {
          id: 'drone_1',
          coordinates: { lat: 29.7604, lng: -95.3698 },
          imageUrl: '/api/drone-imagery/downtown-2024-01.jpg',
          captureDate: '2024-01-15',
          altitude: 400,
          resolution: '4K'
        },
        {
          id: 'drone_2',
          coordinates: { lat: 29.7432, lng: -95.3905 },
          imageUrl: '/api/drone-imagery/montrose-2024-01.jpg',
          captureDate: '2024-01-10',
          altitude: 350,
          resolution: '4K'
        }
      ]
      setDroneImagery(mockImagery)
    } catch (error) {
      console.error('Error loading drone imagery:', error)
    }
  }

  const initializeMap = useCallback(() => {
    if (!window.google || !mapRef.current) return

    // Enhanced map options with photorealistic 3D
    const mapOptions: google.maps.MapOptions = {
      center,
      zoom,
      mapTypeId: viewMode === '3d' ? 'satellite' : 'roadmap',
      tilt: viewMode === '3d' ? 45 : 0,
      heading: 0,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
      },
      fullscreenControl: true,
      streetViewControl: true,
      rotateControl: viewMode === '3d',
      scaleControl: true,
      zoomControl: true,
      gestureHandling: 'greedy',
      styles: viewMode === '2d' ? [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ] : undefined
    }

    // Initialize map with enhanced features
    const map = new google.maps.Map(mapRef.current, {
      ...mapOptions,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_3D_MAP_ID || 'houston-3d-intelligence'
    })

    setMapInstance(map)
    setIsLoading(false)

    // Enable 3D buildings and photorealistic imagery
    if (viewMode === '3d') {
      enableAdvanced3DFeatures(map)
    }

    // Add custom controls
    addCustomControls(map)

    // Load property markers
    loadPropertyMarkers(map)

    // Load heat map layers
    loadHeatMapLayers(map)

    // Add drone imagery overlays
    addDroneImageryOverlays(map)

    // Add building height data
    if (viewMode === '3d') {
      addBuildingHeightData(map)
    }

  }, [center, zoom, viewMode, properties, layers])

  useEffect(() => {
    initializeMap()
  }, [initializeMap])

  const enableAdvanced3DFeatures = (map: google.maps.Map) => {
    // Enable photorealistic 3D tiles
    map.setOptions({
      renderingType: google.maps.RenderingType.VECTOR,
      isFractionalZoomEnabled: true
    })

    // Add 3D building layer
    const buildingLayer = new google.maps.Data()
    buildingLayer.setMap(map)
    buildingLayer.setStyle({
      fillColor: 'rgba(70, 130, 180, 0.8)',
      strokeColor: 'rgba(70, 130, 180, 1)',
      strokeWeight: 2,
      fillOpacity: 0.6
    })

    setThreeDEnabled(true)
  }

  const addCustomControls = (map: google.maps.Map) => {
    // 3D/2D Toggle Control
    const toggle3DControl = document.createElement('div')
    toggle3DControl.style.backgroundColor = '#fff'
    toggle3DControl.style.border = '2px solid #fff'
    toggle3DControl.style.borderRadius = '3px'
    toggle3DControl.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)'
    toggle3DControl.style.cursor = 'pointer'
    toggle3DControl.style.marginBottom = '22px'
    toggle3DControl.style.textAlign = 'center'
    toggle3DControl.title = 'Toggle 3D View'
    toggle3DControl.innerHTML = viewMode === '3d' ? '2D' : '3D'

    // Layer Control
    const layerControl = document.createElement('div')
    layerControl.style.backgroundColor = '#fff'
    layerControl.style.border = '2px solid #fff'
    layerControl.style.borderRadius = '3px'
    layerControl.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)'
    layerControl.style.cursor = 'pointer'
    layerControl.style.marginBottom = '22px'
    layerControl.style.textAlign = 'center'
    layerControl.innerHTML = '<div style="padding: 6px;">Layers</div>'

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggle3DControl)
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(layerControl)
  }

  const loadPropertyMarkers = (map: google.maps.Map) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    properties.forEach(property => {
      const marker = new google.maps.Marker({
        position: { lat: property.coordinates[0], lng: property.coordinates[1] },
        map: map,
        title: property.address,
        icon: {
          url: getCustomMarkerIcon(property.type),
          scaledSize: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(20, 40)
        },
        animation: google.maps.Animation.DROP
      })

      // Enhanced info window with property details
      const infoWindow = new google.maps.InfoWindow({
        content: createPropertyInfoWindow(property)
      })

      marker.addListener('click', () => {
        // Close other info windows
        markersRef.current.forEach(m => {
          const existingInfoWindow = (m as any).infoWindow
          if (existingInfoWindow) existingInfoWindow.close()
        })
        
        infoWindow.open(map, marker)
        onPropertyClick(property)
      })

      // Store info window reference
      ;(marker as any).infoWindow = infoWindow
      markersRef.current.push(marker)
    })
  }

  const loadHeatMapLayers = (map: google.maps.Map) => {
    // Clear existing heatmaps
    heatmapsRef.current.forEach(heatmap => heatmap.setMap(null))
    heatmapsRef.current = []

    layers.forEach(layer => {
      if (!layer.active) return

      let heatmapData: google.maps.visualization.WeightedLocation[] = []
      let gradient: string[] = []

      switch (layer.id) {
        case 'permits':
          heatmapData = properties.map(p => ({
            location: new google.maps.LatLng(p.coordinates[0], p.coordinates[1]),
            weight: p.price / 100000
          }))
          gradient = [
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
          break
        case 'sales':
          // Sales heat map with different color scheme
          heatmapData = properties.map(p => ({
            location: new google.maps.LatLng(p.coordinates[0], p.coordinates[1]),
            weight: p.price / 200000
          }))
          gradient = [
            'rgba(0, 255, 0, 0)',
            'rgba(0, 255, 0, 1)',
            'rgba(127, 255, 0, 1)',
            'rgba(255, 255, 0, 1)',
            'rgba(255, 127, 0, 1)',
            'rgba(255, 0, 0, 1)'
          ]
          break
        case 'demographics':
          // Demographics heat map
          heatmapData = generateDemographicsHeatmap()
          gradient = [
            'rgba(138, 43, 226, 0)',
            'rgba(138, 43, 226, 1)',
            'rgba(75, 0, 130, 1)',
            'rgba(255, 0, 255, 1)'
          ]
          break
      }

      if (heatmapData.length > 0) {
        const heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: map,
          radius: getHeatmapRadius(layer.id),
          opacity: layer.opacity,
          gradient: gradient
        })

        heatmapsRef.current.push(heatmap)
      }
    })
  }

  const addDroneImageryOverlays = (map: google.maps.Map) => {
    droneImagery.forEach(imagery => {
      // Add drone imagery markers
      const droneMarker = new google.maps.Marker({
        position: imagery.coordinates,
        map: map,
        icon: {
          url: '/icons/drone-marker.svg',
          scaledSize: new google.maps.Size(30, 30)
        },
        title: `Drone imagery - ${imagery.captureDate}`
      })

      droneMarker.addListener('click', () => {
        setSelectedImagery(imagery)
        showDroneImageryModal(imagery)
      })
    })
  }

  const addBuildingHeightData = (map: google.maps.Map) => {
    // Add building height visualization (mock data)
    const buildingData = [
      { lat: 29.7604, lng: -95.3698, height: 75 }, // JPMorgan Chase Tower
      { lat: 29.7589, lng: -95.3677, height: 64 }, // Wells Fargo Plaza
      { lat: 29.7576, lng: -95.3694, height: 53 }  // Williams Tower
    ]

    buildingData.forEach(building => {
      const marker = new google.maps.Marker({
        position: { lat: building.lat, lng: building.lng },
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: building.height / 5,
          fillColor: '#FF6B6B',
          fillOpacity: 0.6,
          strokeColor: '#FF6B6B',
          strokeWeight: 2
        },
        title: `Building height: ${building.height} floors`
      })
    })
  }

  const generateDemographicsHeatmap = (): google.maps.visualization.WeightedLocation[] => {
    // Generate mock demographics data
    const houstonBounds = {
      north: 29.8,
      south: 29.7,
      east: -95.3,
      west: -95.5
    }

    const points: google.maps.visualization.WeightedLocation[] = []
    for (let i = 0; i < 100; i++) {
      const lat = houstonBounds.south + Math.random() * (houstonBounds.north - houstonBounds.south)
      const lng = houstonBounds.west + Math.random() * (houstonBounds.east - houstonBounds.west)
      points.push({
        location: new google.maps.LatLng(lat, lng),
        weight: Math.random() * 100
      })
    }
    return points
  }

  const getCustomMarkerIcon = (propertyType: string): string => {
    const iconMap: Record<string, string> = {
      residential: '/icons/house-marker.svg',
      commercial: '/icons/building-marker.svg',
      industrial: '/icons/factory-marker.svg',
      land: '/icons/land-marker.svg'
    }
    return iconMap[propertyType] || '/icons/default-marker.svg'
  }

  const getHeatmapRadius = (layerId: string): number => {
    const radiusMap: Record<string, number> = {
      permits: 50,
      sales: 40,
      demographics: 60,
      development: 45,
      transportation: 35
    }
    return radiusMap[layerId] || 40
  }

  const createPropertyInfoWindow = (property: any): string => {
    return `
      <div style="padding: 12px; max-width: 300px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${property.address}</h3>
        <div style="margin-bottom: 8px;">
          <strong>Price:</strong> $${property.price.toLocaleString()}
        </div>
        <div style="margin-bottom: 8px;">
          <strong>Type:</strong> ${property.type}
        </div>
        <div style="margin-bottom: 8px;">
          <strong>Size:</strong> ${property.size}
        </div>
        ${property.details?.zoning ? `<div style="margin-bottom: 8px;"><strong>Zoning:</strong> ${property.details.zoning}</div>` : ''}
        <button 
          onclick="window.location.href='/properties/${property.id}'" 
          style="padding: 8px 16px; background: #3B82F6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;"
        >
          View Details
        </button>
      </div>
    `
  }

  const showDroneImageryModal = (imagery: DroneImagery) => {
    // Implementation for drone imagery modal
    console.log('Show drone imagery:', imagery)
  }

  const getPropertyColor = (type: string) => {
    const colors: Record<string, string> = {
      residential: '#10B981',
      commercial: '#3B82F6',
      industrial: '#6366F1',
      land: '#F59E0B'
    }
    return colors[type] || '#6B7280'
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading enhanced 3D map...</p>
          <p className="text-gray-400 text-sm mt-2">Initializing photorealistic imagery and 3D buildings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Enhanced Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Live Data</span>
          </div>
          {threeDEnabled && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>3D Enhanced</span>
            </div>
          )}
          {droneImagery.length > 0 && (
            <div className="flex items-center">
              <Camera className="w-3 h-3 mr-1 text-purple-600" />
              <span>{droneImagery.length} Drone Views</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Type Controls */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
        <div className="flex space-x-2">
          <button 
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            title="Satellite View"
          >
            Satellite
          </button>
          <button 
            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            title="Street View"
          >
            Street
          </button>
          <button 
            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            title="Terrain View"
          >
            Terrain
          </button>
        </div>
      </div>

      {/* Drone Imagery Modal */}
      {selectedImagery && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Drone Imagery - {selectedImagery.captureDate}
                </h3>
                <button 
                  onClick={() => setSelectedImagery(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <img 
                src={selectedImagery.imageUrl} 
                alt="Drone imagery"
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  // Fallback for missing drone images
                  e.currentTarget.src = '/images/drone-placeholder.jpg'
                }}
              />
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Altitude:</strong> {selectedImagery.altitude}ft
                </div>
                <div>
                  <strong>Resolution:</strong> {selectedImagery.resolution}
                </div>
                <div>
                  <strong>Captured:</strong> {selectedImagery.captureDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}