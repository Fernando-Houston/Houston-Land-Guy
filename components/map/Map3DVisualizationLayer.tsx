'use client'

import React, { useEffect, useRef, useState } from 'react';
type Visualization3DConfig = {
  type: 'heatTower' | 'constructionTimeLapse' | 'roiTopography' | 'schoolImpact' | 'gentrificationLayers' | 'marketPulse'
};

interface Map3DVisualizationLayerProps {
  map: any; // Mapbox GL instance
  activeVisualization: Visualization3DConfig['type'] | null;
}

export const Map3DVisualizationLayer: React.FC<Map3DVisualizationLayerProps> = ({ map, activeVisualization }) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    if (!map || !activeVisualization) return;
    
    // Clear existing 3D layers
    clearAllLayers();
    
    switch (activeVisualization) {
      case 'heatTower':
        renderPropertyValueHeatTowers();
        break;
      case 'constructionTimeLapse':
        renderConstructionTimeLapse();
        break;
      case 'roiTopography':
        renderROITopography();
        break;
      case 'schoolImpact':
        renderSchoolImpactZones();
        break;
      case 'gentrificationLayers':
        renderGentrificationLayers();
        break;
      case 'marketPulse':
        renderMarketPulses();
        break;
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearAllLayers();
    };
  }, [map, activeVisualization]);
  
  const clearAllLayers = () => {
    const layersToRemove = [
      'heat-towers', 'heat-towers-labels',
      'construction-activity', 'construction-labels',
      'roi-topography', 'roi-contours', 'roi-peaks',
      'school-zones', 'school-labels',
      'gentrification-base', 'gentrification-pressure', 'gentrification-risk',
      'market-pulses', 'market-pulse-rings'
    ];
    
    layersToRemove.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(layerId)) {
        map.removeSource(layerId);
      }
    });
  };
  
  const renderPropertyValueHeatTowers = () => {
    // Mock data for property value heat towers
    const towers = [
      { neighborhood: 'River Oaks', coordinates: [-95.4151, 29.7573], height: 300, value: 875000, change: 6.5, color: '#10b981', tooltip: 'River Oaks: $875K median, +6.5% YoY' },
      { neighborhood: 'Heights', coordinates: [-95.3987, 29.7989], height: 200, value: 485000, change: 8.5, color: '#22c55e', tooltip: 'Heights: $485K median, +8.5% YoY' },
      { neighborhood: 'Memorial', coordinates: [-95.4674, 29.7641], height: 250, value: 625000, change: 7.8, color: '#16a34a', tooltip: 'Memorial: $625K median, +7.8% YoY' },
      { neighborhood: 'Montrose', coordinates: [-95.3902, 29.7472], height: 180, value: 425000, change: 5.5, color: '#84cc16', tooltip: 'Montrose: $425K median, +5.5% YoY' }
    ];
    
    // Create 3D extrusions for each neighborhood
    const features = towers.map(tower => ({
      type: 'Feature',
      properties: {
        height: tower.height,
        color: tower.color,
        name: tower.neighborhood,
        value: tower.value,
        change: tower.change,
        tooltip: tower.tooltip
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [tower.coordinates[0] - 0.01, tower.coordinates[1] - 0.01],
          [tower.coordinates[0] + 0.01, tower.coordinates[1] - 0.01],
          [tower.coordinates[0] + 0.01, tower.coordinates[1] + 0.01],
          [tower.coordinates[0] - 0.01, tower.coordinates[1] + 0.01],
          [tower.coordinates[0] - 0.01, tower.coordinates[1] - 0.01]
        ]]
      }
    }));
    
    map.addSource('heat-towers', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features
      }
    });
    
    map.addLayer({
      id: 'heat-towers',
      type: 'fill-extrusion',
      source: 'heat-towers',
      paint: {
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.8,
        'fill-extrusion-vertical-gradient': true
      }
    });
    
    // Add labels
    map.addLayer({
      id: 'heat-towers-labels',
      type: 'symbol',
      source: 'heat-towers',
      layout: {
        'text-field': ['concat', ['get', 'name'], '\n$', ['to-string', ['get', 'value']], '\n', ['to-string', ['get', 'change']], '%'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-anchor': 'bottom',
        'text-offset': [0, -2]
      },
      paint: {
        'text-color': '#000000',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2
      }
    });
    
    // Add hover effect
    let hoveredTowerId: string | null = null;
    
    map.on('mousemove', 'heat-towers', (e: any) => {
      if (e.features.length > 0) {
        if (hoveredTowerId !== null) {
          map.setFeatureState({ source: 'heat-towers', id: hoveredTowerId }, { hover: false });
        }
        hoveredTowerId = e.features[0].id;
        map.setFeatureState({ source: 'heat-towers', id: hoveredTowerId }, { hover: true });
        
        // Show tooltip
        const tooltip = e.features[0].properties.tooltip;
        // Implementation would show custom tooltip at cursor position
      }
    });
  };
  
  const renderConstructionTimeLapse = () => {
    const months = ['2024-01', '2024-04', '2024-07', '2024-10', '2025-01', '2025-07'];
    let currentMonth = 0;
    
    const animate = () => {
      // Mock construction activities data
      const mockActivities = [
        { id: 1, coordinates: [-95.4151, 29.7573], type: 'residential', phase: 'foundation', height: 20, color: '#3b82f6' },
        { id: 2, coordinates: [-95.3987, 29.7989], type: 'commercial', phase: 'framing', height: 50, color: '#10b981' },
        { id: 3, coordinates: [-95.4674, 29.7641], type: 'mixed-use', phase: 'finishing', height: 100, color: '#f59e0b' }
      ];
      const activities = currentMonth < 6 ? mockActivities.slice(0, 2) : mockActivities;
      
      const features = activities.map((activity, index) => ({
        type: 'Feature',
        id: index,
        properties: {
          height: activity.height * (currentMonth + 1) / months.length,
          color: activity.color,
          type: activity.type,
          permits: activity.permits
        },
        geometry: {
          type: 'Point',
          coordinates: activity.location
        }
      }));
      
      if (map.getSource('construction-activity')) {
        map.getSource('construction-activity').setData({
          type: 'FeatureCollection',
          features
        });
      } else {
        map.addSource('construction-activity', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features
          }
        });
        
        map.addLayer({
          id: 'construction-activity',
          type: 'circle',
          source: 'construction-activity',
          paint: {
            'circle-radius': {
              base: 1.75,
              stops: [[12, 5], [22, 180]]
            },
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.7,
            'circle-pitch-alignment': 'map'
          }
        });
      }
      
      currentMonth = (currentMonth + 1) % months.length;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  const renderROITopography = () => {
    // Mock ROI topography data
    const topography = [];
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        topography.push({
          coordinates: [-95.4 + (i * 0.002), 29.7 + (j * 0.002)],
          roi: Math.sin(i * 0.1) * Math.cos(j * 0.1) * 15 + 10,
          color: `hsl(${120 - (Math.random() * 60)}, 70%, 50%)`
        });
      }
    }
    
    // Create contour lines
    const contourFeatures = topography.contourLevels.map(level => ({
      type: 'Feature',
      properties: { level },
      geometry: {
        type: 'LineString',
        coordinates: generateContourLine(level, topography.grid)
      }
    }));
    
    map.addSource('roi-contours', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: contourFeatures
      }
    });
    
    map.addLayer({
      id: 'roi-contours',
      type: 'line',
      source: 'roi-contours',
      paint: {
        'line-color': {
          property: 'level',
          stops: topography.contourLevels.map((level, i) => [level, topography.colorScale[i]])
        },
        'line-width': 2,
        'line-opacity': 0.7
      }
    });
    
    // Add ROI peaks
    const peakFeatures = topography.peaks.map(peak => ({
      type: 'Feature',
      properties: {
        roi: peak.roi,
        capRate: peak.capRate,
        neighborhood: peak.neighborhood
      },
      geometry: {
        type: 'Point',
        coordinates: peak.location
      }
    }));
    
    map.addSource('roi-peaks', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: peakFeatures
      }
    });
    
    map.addLayer({
      id: 'roi-peaks',
      type: 'symbol',
      source: 'roi-peaks',
      layout: {
        'icon-image': 'mountain-15',
        'text-field': ['concat', ['get', 'neighborhood'], '\nROI: ', ['to-string', ['get', 'roi']], '%'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-anchor': 'top',
        'text-offset': [0, 1]
      },
      paint: {
        'text-color': '#22c55e',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2
      }
    });
  };
  
  const renderSchoolImpactZones = () => {
    // Mock school impact zones
    const zones = [
      { id: 1, name: 'River Oaks Elementary', coordinates: [-95.4151, 29.7573], rating: 9.5, impactRadius: 0.02, color: '#10b981' },
      { id: 2, name: 'Heights High School', coordinates: [-95.3987, 29.7989], rating: 8.0, impactRadius: 0.015, color: '#22c55e' },
      { id: 3, name: 'Memorial Middle School', coordinates: [-95.4674, 29.7641], rating: 8.8, impactRadius: 0.018, color: '#16a34a' }
    ];
    
    const features = zones.map(zone => ({
      type: 'Feature',
      properties: {
        school: zone.school,
        rating: zone.rating,
        impact: zone.affectedValue,
        correlation: zone.correlationStrength,
        size: zone.bubbleSize
      },
      geometry: {
        type: 'Point',
        coordinates: zone.location
      }
    }));
    
    map.addSource('school-zones', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features
      }
    });
    
    // Animated bubble effect
    let step = 0;
    const animateBubbles = () => {
      step = (step + 1) % 100;
      const scale = 1 + Math.sin(step * 0.05) * 0.1;
      
      map.setPaintProperty('school-zones', 'circle-radius', {
        property: 'size',
        type: 'exponential',
        stops: [[0, 0], [100, 100 * scale]]
      });
      
      animationRef.current = requestAnimationFrame(animateBubbles);
    };
    
    map.addLayer({
      id: 'school-zones',
      type: 'circle',
      source: 'school-zones',
      paint: {
        'circle-radius': ['get', 'size'],
        'circle-color': {
          property: 'rating',
          type: 'categorical',
          stops: [['A', '#22c55e'], ['B', '#3b82f6'], ['C', '#f59e0b'], ['D', '#ef4444']]
        },
        'circle-opacity': 0.3,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });
    
    animateBubbles();
  };
  
  const renderGentrificationLayers = () => {
    // Mock gentrification layers
    const layers = [
      {
        id: 'east-downtown',
        coordinates: [[-95.35, 29.74], [-95.34, 29.74], [-95.34, 29.75], [-95.35, 29.75], [-95.35, 29.74]],
        gentrificationScore: 0.7,
        displacementRisk: 0.6,
        medianIncomeChange: 45,
        rentChange: 38
      },
      {
        id: 'third-ward',
        coordinates: [[-95.36, 29.72], [-95.35, 29.72], [-95.35, 29.73], [-95.36, 29.73], [-95.36, 29.72]],
        gentrificationScore: 0.8,
        displacementRisk: 0.7,
        medianIncomeChange: 52,
        rentChange: 45
      }
    ];
    
    // Render each layer with different opacity and effects
    layers.layers.forEach((layer, index) => {
      const features = layer.data.map(area => ({
        type: 'Feature',
        properties: {
          ...area,
          layerName: layer.name
        },
        geometry: {
          type: 'Polygon',
          coordinates: getNeighborhoodBoundaries(area.area)
        }
      }));
      
      const layerId = `gentrification-${layer.name.toLowerCase().replace(' ', '-')}`;
      
      map.addSource(layerId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        }
      });
      
      map.addLayer({
        id: layerId,
        type: 'fill',
        source: layerId,
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': ['get', 'opacity']
        }
      });
    });
  };
  
  const renderMarketPulses = () => {
    // Mock market pulses
    const pulses = [
      { id: 1, coordinates: [-95.4151, 29.7573], intensity: 0.9, color: '#ef4444', activityLevel: 'Very High' },
      { id: 2, coordinates: [-95.3987, 29.7989], intensity: 0.8, color: '#f59e0b', activityLevel: 'High' },
      { id: 3, coordinates: [-95.4674, 29.7641], intensity: 0.7, color: '#10b981', activityLevel: 'Moderate' },
      { id: 4, coordinates: [-95.3902, 29.7472], intensity: 0.6, color: '#3b82f6', activityLevel: 'Stable' }
    ];
    let pulseStep = 0;
    
    const animatePulses = () => {
      pulseStep += 0.05;
      
      pulses.forEach(pulse => {
        const age = (Date.now() - pulse.timestamp) / 1000000;
        const radius = 20 + age * 50;
        const opacity = Math.max(0, pulse.intensity - age * 0.1);
        
        if (!map.getSource(pulse.id)) {
          map.addSource(pulse.id, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: pulse.location
              }
            }
          });
          
          map.addLayer({
            id: pulse.id,
            type: 'circle',
            source: pulse.id,
            paint: {
              'circle-radius': radius,
              'circle-color': pulse.type === 'newListing' ? '#3b82f6' : 
                             pulse.type === 'sale' ? '#22c55e' : '#f59e0b',
              'circle-opacity': opacity,
              'circle-blur': 0.5
            }
          });
        } else {
          map.setPaintProperty(pulse.id, 'circle-radius', radius);
          map.setPaintProperty(pulse.id, 'circle-opacity', opacity);
        }
      });
      
      animationRef.current = requestAnimationFrame(animatePulses);
    };
    
    animatePulses();
  };
  
  // Helper functions
  const generateContourLine = (level: number, grid: number[][]): number[][] => {
    // Simplified contour generation - in real implementation use marching squares
    const points: number[][] = [];
    const step = 0.01;
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const lat = 29.7604 + Math.sin(angle) * level * step;
      const lng = -95.3698 + Math.cos(angle) * level * step;
      points.push([lng, lat]);
    }
    return points;
  };
  
  const getNeighborhoodBoundaries = (area: string): number[][][] => {
    // Simplified boundaries - in real implementation use actual GeoJSON data
    const boundaries: { [key: string]: number[][][] } = {
      'EaDo': [[
        [-95.3594, 29.7623], [-95.3394, 29.7623],
        [-95.3394, 29.7423], [-95.3594, 29.7423],
        [-95.3594, 29.7623]
      ]],
      'Third Ward': [[
        [-95.3715, 29.7405], [-95.3515, 29.7405],
        [-95.3515, 29.7205], [-95.3715, 29.7205],
        [-95.3715, 29.7405]
      ]],
      'Heights': [[
        [-95.4078, 29.8128], [-95.3878, 29.8128],
        [-95.3878, 29.7928], [-95.4078, 29.7928],
        [-95.4078, 29.8128]
      ]]
    };
    return boundaries[area] || [[]];
  };
  
  return null; // This component manages map layers directly
};