'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Home, DollarSign, Activity, MapPin } from 'lucide-react';

interface HeatMapData {
  zipCode: string;
  neighborhood: string;
  avgPrice: number;
  priceChange: number;
  activity: 'low' | 'medium' | 'high' | 'hot';
  inventory: number;
  daysOnMarket: number;
  coordinates: { x: number; y: number };
}

export default function MarketHeatMap() {
  const [selectedZip, setSelectedZip] = useState<string | null>(null);
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock Houston market data with coordinates for positioning
    const mockData: HeatMapData[] = [
      {
        zipCode: '77019',
        neighborhood: 'River Oaks',
        avgPrice: 2850000,
        priceChange: 8.2,
        activity: 'hot',
        inventory: 8.5,
        daysOnMarket: 45,
        coordinates: { x: 35, y: 45 }
      },
      {
        zipCode: '77024',
        neighborhood: 'Memorial',
        avgPrice: 1250000,
        priceChange: 12.1,
        activity: 'hot',
        inventory: 12.3,
        daysOnMarket: 28,
        coordinates: { x: 25, y: 35 }
      },
      {
        zipCode: '77008',
        neighborhood: 'The Heights',
        avgPrice: 485000,
        priceChange: 15.3,
        activity: 'hot',
        inventory: 18.2,
        daysOnMarket: 22,
        coordinates: { x: 45, y: 25 }
      },
      {
        zipCode: '77005',
        neighborhood: 'Rice Village',
        avgPrice: 725000,
        priceChange: 6.8,
        activity: 'high',
        inventory: 15.1,
        daysOnMarket: 35,
        coordinates: { x: 40, y: 55 }
      },
      {
        zipCode: '77027',
        neighborhood: 'Midtown',
        avgPrice: 420000,
        priceChange: 9.1,
        activity: 'high',
        inventory: 22.4,
        daysOnMarket: 31,
        coordinates: { x: 50, y: 50 }
      },
      {
        zipCode: '77098',
        neighborhood: 'Montrose',
        avgPrice: 385000,
        priceChange: 11.2,
        activity: 'high',
        inventory: 19.8,
        daysOnMarket: 26,
        coordinates: { x: 42, y: 48 }
      },
      {
        zipCode: '77030',
        neighborhood: 'Medical Center',
        avgPrice: 315000,
        priceChange: 5.4,
        activity: 'medium',
        inventory: 28.5,
        daysOnMarket: 42,
        coordinates: { x: 48, y: 60 }
      },
      {
        zipCode: '77056',
        neighborhood: 'Galleria',
        avgPrice: 465000,
        priceChange: 7.3,
        activity: 'medium',
        inventory: 24.1,
        daysOnMarket: 38,
        coordinates: { x: 30, y: 40 }
      },
      {
        zipCode: '77025',
        neighborhood: 'Bellaire',
        avgPrice: 395000,
        priceChange: 4.2,
        activity: 'medium',
        inventory: 31.2,
        daysOnMarket: 45,
        coordinates: { x: 35, y: 65 }
      },
      {
        zipCode: '77007',
        neighborhood: 'Near Northside',
        avgPrice: 285000,
        priceChange: 13.8,
        activity: 'high',
        inventory: 16.7,
        daysOnMarket: 29,
        coordinates: { x: 52, y: 30 }
      },
      {
        zipCode: '77092',
        neighborhood: 'Northwest',
        avgPrice: 245000,
        priceChange: 2.1,
        activity: 'low',
        inventory: 45.3,
        daysOnMarket: 58,
        coordinates: { x: 20, y: 20 }
      },
      {
        zipCode: '77081',
        neighborhood: 'Southwest',
        avgPrice: 195000,
        priceChange: -1.2,
        activity: 'low',
        inventory: 52.1,
        daysOnMarket: 67,
        coordinates: { x: 15, y: 70 }
      }
    ];

    setTimeout(() => {
      setHeatMapData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'hot':
        return 'bg-red-500 shadow-red-300';
      case 'high':
        return 'bg-orange-500 shadow-orange-300';
      case 'medium':
        return 'bg-yellow-500 shadow-yellow-300';
      case 'low':
        return 'bg-blue-500 shadow-blue-300';
      default:
        return 'bg-gray-500 shadow-gray-300';
    }
  };

  const getActivitySize = (activity: string) => {
    switch (activity) {
      case 'hot':
        return 'w-4 h-4';
      case 'high':
        return 'w-3 h-3';
      case 'medium':
        return 'w-2.5 h-2.5';
      case 'low':
        return 'w-2 h-2';
      default:
        return 'w-2 h-2';
    }
  };

  const selectedData = selectedZip ? heatMapData.find(item => item.zipCode === selectedZip) : null;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Market Activity Heat Map
            </h3>
            <p className="text-sm text-gray-600">Real-time Houston market activity by neighborhood</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              <span>Hot</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
              <span>High</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heat Map Visualization */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-80 overflow-hidden border border-gray-200">
              {/* Houston Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-30"></div>
              
              {/* Map Points */}
              {heatMapData.map((item) => (
                <button
                  key={item.zipCode}
                  onClick={() => setSelectedZip(item.zipCode === selectedZip ? null : item.zipCode)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg hover:scale-110 transition-all cursor-pointer z-10 ${getActivityColor(item.activity)} ${getActivitySize(item.activity)}`}
                  style={{
                    left: `${item.coordinates.x}%`,
                    top: `${item.coordinates.y}%`
                  }}
                  title={`${item.neighborhood} - $${item.avgPrice.toLocaleString()}`}
                >
                  {item.zipCode === selectedZip && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {item.neighborhood}
                    </div>
                  )}
                </button>
              ))}
              
              {/* Map Labels */}
              <div className="absolute top-4 left-4 text-xs text-gray-600 font-medium bg-white px-2 py-1 rounded shadow">
                Houston Metro
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                Click dots for details
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="space-y-4">
            {selectedData ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedData.neighborhood}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Zip Code</span>
                    <span className="font-medium">{selectedData.zipCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Price</span>
                    <span className="font-medium">${selectedData.avgPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price Change</span>
                    <span className={`font-medium flex items-center ${selectedData.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedData.priceChange > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {selectedData.priceChange > 0 ? '+' : ''}{selectedData.priceChange.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Activity Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedData.activity === 'hot' ? 'bg-red-100 text-red-800' :
                      selectedData.activity === 'high' ? 'bg-orange-100 text-orange-800' :
                      selectedData.activity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedData.activity.charAt(0).toUpperCase() + selectedData.activity.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Inventory</span>
                    <span className="font-medium">{selectedData.inventory} months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg DOM</span>
                    <span className="font-medium">{selectedData.daysOnMarket} days</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click on a neighborhood dot to view detailed market data</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <Home className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-600 font-medium">Hot Markets</p>
                <p className="text-lg font-bold text-blue-900">
                  {heatMapData.filter(item => item.activity === 'hot').length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-green-600 font-medium">Avg Price</p>
                <p className="text-lg font-bold text-green-900">
                  ${Math.round(heatMapData.reduce((sum, item) => sum + item.avgPrice, 0) / heatMapData.length / 1000)}K
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}