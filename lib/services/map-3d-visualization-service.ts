import { houstonDataService } from './houston-data-service';

// 3D Visualization Types
export interface Visualization3DConfig {
  type: 'heatTower' | 'constructionTimeLapse' | 'roiTopography' | 'schoolImpact' | 'gentrificationLayers' | 'marketPulse';
  enabled: boolean;
  opacity?: number;
  animationSpeed?: number;
  colorScheme?: string;
}

export interface HeatTowerData {
  neighborhood: string;
  coordinates: [number, number];
  height: number; // Based on median home value
  color: string; // Based on YoY change
  value: number;
  change: number;
  tooltip: string;
}

export interface ConstructionActivityData {
  location: [number, number];
  type: 'residential' | 'commercial' | 'multiFamily' | 'mixedUse';
  permits: number;
  date: string;
  height: number;
  color: string;
}

export interface ROITopographyData {
  grid: number[][];
  colorScale: string[];
  contourLevels: number[];
  peaks: Array<{
    location: [number, number];
    roi: number;
    capRate: number;
    neighborhood: string;
  }>;
}

export interface SchoolImpactZone {
  school: string;
  rating: string;
  location: [number, number];
  impactRadius: number;
  bubbleSize: number;
  correlationStrength: number;
  affectedValue: number;
}

export interface MarketPulse {
  id: string;
  location: [number, number];
  value: number;
  type: 'newListing' | 'sale' | 'priceChange';
  timestamp: number;
  intensity: number;
}

class Map3DVisualizationService {
  // Get Property Value Heat Towers
  getPropertyValueHeatTowers(): HeatTowerData[] {
    const neighborhoodData = houstonDataService.getNeighborhoodSpecificData();
    const microMarketData = houstonDataService.getMicroMarketIntelligence();
    
    const towers: HeatTowerData[] = [];
    
    // Heights neighborhood
    towers.push({
      neighborhood: 'Heights',
      coordinates: [-95.3978, 29.8028],
      height: this.normalizeValue(615000, 200000, 900000, 20, 100),
      color: this.getChangeColor(3.2),
      value: 615000,
      change: 3.2,
      tooltip: 'Heights: $615K median, +3.2% YoY, 38 days on market'
    });
    
    // Montrose
    towers.push({
      neighborhood: 'Montrose',
      coordinates: [-95.3906, 29.7452],
      height: this.normalizeValue(543000, 200000, 900000, 20, 100),
      color: this.getChangeColor(-6.6),
      value: 543000,
      change: -6.6,
      tooltip: 'Montrose: $543K median, -6.6% YoY, Mixed-use development'
    });
    
    // EaDo/East End
    towers.push({
      neighborhood: 'EaDo',
      coordinates: [-95.3494, 29.7523],
      height: this.normalizeValue(350000, 200000, 900000, 20, 100),
      color: this.getChangeColor(2.5),
      value: 350000,
      change: 2.5,
      tooltip: 'EaDo: $350K median, +2.5% YoY, Very High gentrification risk'
    });
    
    // Third Ward
    towers.push({
      neighborhood: 'Third Ward',
      coordinates: [-95.3615, 29.7305],
      height: this.normalizeValue(296313, 200000, 900000, 20, 100),
      color: this.getChangeColor(-2.2),
      value: 296313,
      change: -2.2,
      tooltip: 'Third Ward: $296K median, -2.2% YoY, Displacement concerns'
    });
    
    // The Woodlands
    towers.push({
      neighborhood: 'The Woodlands',
      coordinates: [-95.4564, 30.1658],
      height: this.normalizeValue(600994, 200000, 900000, 20, 100),
      color: this.getChangeColor(5.1),
      value: 600994,
      change: 5.1,
      tooltip: 'The Woodlands: $601K median, +5.1% YoY, 61 days on market'
    });
    
    // River Oaks (luxury area)
    towers.push({
      neighborhood: 'River Oaks',
      coordinates: [-95.4265, 29.7565],
      height: this.normalizeValue(850000, 200000, 900000, 20, 100),
      color: this.getChangeColor(8.5),
      value: 850000,
      change: 8.5,
      tooltip: 'River Oaks: $850K median, +8.5% YoY, Luxury market stable'
    });
    
    return towers;
  }
  
  // Get Construction Activity Time-Lapse Data
  getConstructionActivityTimeLapse(month: string): ConstructionActivityData[] {
    const constructionData = houstonDataService.getConstructionActivity();
    const activities: ConstructionActivityData[] = [];
    
    // Downtown high-rise corridor
    activities.push({
      location: [-95.3698, 29.7604],
      type: 'commercial',
      permits: 89,
      date: month,
      height: 60,
      color: '#2563eb'
    });
    
    // Heights residential boom
    activities.push({
      location: [-95.3978, 29.8028],
      type: 'residential',
      permits: 180,
      date: month,
      height: 40,
      color: '#10b981'
    });
    
    // EaDo mixed-use development
    activities.push({
      location: [-95.3494, 29.7523],
      type: 'mixedUse',
      permits: 34,
      date: month,
      height: 50,
      color: '#8b5cf6'
    });
    
    // Multi-family near Medical Center
    activities.push({
      location: [-95.4019, 29.7108],
      type: 'multiFamily',
      permits: 412,
      date: month,
      height: 45,
      color: '#f59e0b'
    });
    
    return activities;
  }
  
  // Get ROI Topography
  getROITopography(): ROITopographyData {
    const capRates = houstonDataService.getCapRates();
    const roiData = houstonDataService.getROICalculator();
    
    // Generate topography grid (simplified for demo)
    const gridSize = 50;
    const grid: number[][] = [];
    
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        // Create realistic ROI terrain
        const baseROI = 8;
        const variation = Math.sin(i * 0.1) * Math.cos(j * 0.1) * 4;
        const noise = Math.random() * 2 - 1;
        grid[i][j] = baseROI + variation + noise;
      }
    }
    
    return {
      grid,
      colorScale: ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981'],
      contourLevels: [6, 8, 10, 12, 14, 16],
      peaks: [
        {
          location: [-95.3494, 29.7523], // EaDo
          roi: 15.2,
          capRate: 7.8,
          neighborhood: 'EaDo - Highest ROI'
        },
        {
          location: [-95.3978, 29.8028], // Heights
          roi: 12.5,
          capRate: 6.5,
          neighborhood: 'Heights - Strong Returns'
        },
        {
          location: [-95.3615, 29.7305], // Third Ward
          roi: 14.1,
          capRate: 8.2,
          neighborhood: 'Third Ward - Value Play'
        }
      ]
    };
  }
  
  // Get School District Impact Zones
  getSchoolImpactZones(): SchoolImpactZone[] {
    const schoolData = houstonDataService.getSchoolImpactData();
    
    return [
      {
        school: 'Heights HS',
        rating: 'B',
        location: [-95.3978, 29.8028],
        impactRadius: 2.5,
        bubbleSize: 80,
        correlationStrength: 0.85,
        affectedValue: 50000
      },
      {
        school: 'Montrose Elementary',
        rating: 'A',
        location: [-95.3906, 29.7452],
        impactRadius: 1.8,
        bubbleSize: 90,
        correlationStrength: 0.92,
        affectedValue: 75000
      },
      {
        school: 'Lanier MS',
        rating: 'B',
        location: [-95.3800, 29.7400],
        impactRadius: 2.0,
        bubbleSize: 75,
        correlationStrength: 0.78,
        affectedValue: 40000
      },
      {
        school: 'River Oaks Elementary',
        rating: 'A',
        location: [-95.4265, 29.7565],
        impactRadius: 3.0,
        bubbleSize: 100,
        correlationStrength: 0.95,
        affectedValue: 100000
      }
    ];
  }
  
  // Get Real-Time Market Pulses
  getMarketPulses(): MarketPulse[] {
    const july2025Data = houstonDataService.getJuly2025MLSData();
    const currentTimestamp = Date.now();
    
    // Simulate real-time market activity
    const pulses: MarketPulse[] = [];
    
    // New luxury listing in River Oaks
    pulses.push({
      id: 'pulse-1',
      location: [-95.4265 + Math.random() * 0.01, 29.7565 + Math.random() * 0.01],
      value: 1250000,
      type: 'newListing',
      timestamp: currentTimestamp - 300000,
      intensity: 0.9
    });
    
    // Mid-range sale in Heights
    pulses.push({
      id: 'pulse-2',
      location: [-95.3978 + Math.random() * 0.01, 29.8028 + Math.random() * 0.01],
      value: 615000,
      type: 'sale',
      timestamp: currentTimestamp - 600000,
      intensity: 0.7
    });
    
    // Price reduction in Montrose
    pulses.push({
      id: 'pulse-3',
      location: [-95.3906 + Math.random() * 0.01, 29.7452 + Math.random() * 0.01],
      value: 485000,
      type: 'priceChange',
      timestamp: currentTimestamp - 900000,
      intensity: 0.5
    });
    
    return pulses;
  }
  
  // Gentrification Risk Layers
  getGentrificationLayers() {
    const microMarket = houstonDataService.getMicroMarketIntelligence();
    
    return {
      layers: [
        {
          name: 'Current Values',
          data: [
            { area: 'EaDo', risk: 0.95, opacity: 0.3, color: '#ef4444' },
            { area: 'Third Ward', risk: 0.75, opacity: 0.25, color: '#f59e0b' },
            { area: 'Independence Heights', risk: 0.80, opacity: 0.28, color: '#f97316' },
            { area: 'Magnolia Park', risk: 0.60, opacity: 0.20, color: '#fbbf24' }
          ]
        },
        {
          name: 'Development Pressure',
          data: [
            { area: 'EaDo', pressure: 0.90, opacity: 0.4, color: '#dc2626' },
            { area: 'Heights', pressure: 0.85, opacity: 0.35, color: '#ea580c' },
            { area: 'Montrose', pressure: 0.70, opacity: 0.25, color: '#f97316' }
          ]
        },
        {
          name: 'Displacement Risk',
          data: [
            { area: 'Third Ward', risk: 0.85, opacity: 0.5, color: '#b91c1c' },
            { area: 'Acres Homes', risk: 0.65, opacity: 0.3, color: '#dc2626' },
            { area: 'Independence Heights', risk: 0.75, opacity: 0.4, color: '#dc2626' }
          ]
        }
      ]
    };
  }
  
  // Helper functions
  private normalizeValue(value: number, min: number, max: number, minHeight: number, maxHeight: number): number {
    return minHeight + ((value - min) / (max - min)) * (maxHeight - minHeight);
  }
  
  private getChangeColor(change: number): string {
    if (change > 10) return '#059669'; // Dark green
    if (change > 5) return '#10b981'; // Green
    if (change > 0) return '#34d399'; // Light green
    if (change > -5) return '#fbbf24'; // Yellow
    if (change > -10) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }
  
  // Animation helpers
  getAnimationConfig(type: string) {
    switch (type) {
      case 'pulse':
        return {
          duration: 2000,
          easing: 'easeInOutSine',
          repeat: true,
          scale: [1, 1.5, 1]
        };
      case 'tower':
        return {
          duration: 1000,
          easing: 'easeOutElastic',
          delay: (index: number) => index * 100
        };
      case 'wave':
        return {
          duration: 3000,
          easing: 'linear',
          repeat: true,
          phase: Math.PI * 2
        };
      default:
        return {};
    }
  }
}

export const map3DVisualizationService = new Map3DVisualizationService();