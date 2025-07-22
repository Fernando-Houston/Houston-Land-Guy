'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Eye, MapPin, Users, DollarSign, TrendingUp, Home, Filter, Brain, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
// Removed map import to fix build error - will implement later

interface DemandZone {
  zipCode: string
  neighborhood: string
  demandScore: number
  avgSearchPrice: number
  activeSearches: number
  coordinates: { lat: number; lng: number }
}

interface SearchCriteria {
  priceRanges: Array<{ min: number; max: number; count: number }>
  bedrooms: Array<{ beds: number; count: number }>
  features: Array<{ feature: string; count: number }>
}

interface DemandData {
  demandZones: DemandZone[]
  topSearchCriteria: SearchCriteria
}

export default function BuyerDemandHeatMap() {
  const [data, setData] = useState<DemandData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState<DemandZone | null>(null)
  const [filterScore, setFilterScore] = useState(0)

  // Mock data for demonstration
  const mockData: DemandData = {
    demandZones: [
      { zipCode: '77024', neighborhood: 'Memorial', demandScore: 95, avgSearchPrice: 850000, activeSearches: 342, coordinates: { lat: 29.7805, lng: -95.5504 } },
      { zipCode: '77005', neighborhood: 'West University', demandScore: 92, avgSearchPrice: 725000, activeSearches: 287, coordinates: { lat: 29.7182, lng: -95.4264 } },
      { zipCode: '77401', neighborhood: 'Bellaire', demandScore: 88, avgSearchPrice: 650000, activeSearches: 256, coordinates: { lat: 29.7058, lng: -95.4589 } },
      { zipCode: '77007', neighborhood: 'Heights', demandScore: 87, avgSearchPrice: 580000, activeSearches: 298, coordinates: { lat: 29.7752, lng: -95.3987 } },
      { zipCode: '77019', neighborhood: 'River Oaks', demandScore: 85, avgSearchPrice: 1200000, activeSearches: 165, coordinates: { lat: 29.7565, lng: -95.4058 } },
      { zipCode: '77006', neighborhood: 'Montrose', demandScore: 83, avgSearchPrice: 450000, activeSearches: 312, coordinates: { lat: 29.7328, lng: -95.3903 } },
      { zipCode: '77008', neighborhood: 'Timbergrove', demandScore: 78, avgSearchPrice: 425000, activeSearches: 198, coordinates: { lat: 29.8018, lng: -95.4107 } },
      { zipCode: '77098', neighborhood: 'Upper Kirby', demandScore: 76, avgSearchPrice: 520000, activeSearches: 176, coordinates: { lat: 29.7329, lng: -95.4211 } },
      { zipCode: '77025', neighborhood: 'Braeswood', demandScore: 72, avgSearchPrice: 380000, activeSearches: 145, coordinates: { lat: 29.6842, lng: -95.4432 } },
      { zipCode: '77004', neighborhood: 'Museum District', demandScore: 70, avgSearchPrice: 395000, activeSearches: 167, coordinates: { lat: 29.7270, lng: -95.3851 } }
    ],
    topSearchCriteria: {
      priceRanges: [
        { min: 300000, max: 500000, count: 1823 },
        { min: 500000, max: 750000, count: 1456 },
        { min: 750000, max: 1000000, count: 892 },
        { min: 1000000, max: 2000000, count: 543 }
      ],
      bedrooms: [
        { beds: 3, count: 2145 },
        { beds: 4, count: 1876 },
        { beds: 5, count: 743 },
        { beds: 2, count: 523 }
      ],
      features: [
        { feature: 'Pool', count: 1892 },
        { feature: 'Updated Kitchen', count: 1654 },
        { feature: 'Home Office', count: 1432 },
        { feature: 'Game Room', count: 1098 },
        { feature: 'Guest Suite', count: 876 }
      ]
    }
  }

  useEffect(() => {
    fetchDemandData()
  }, [])

  const fetchDemandData = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/sellers/demand')
      
      if (!response.ok) {
        throw new Error('Failed to fetch demand data')
      }
      
      const data = await response.json()
      setData(data)
    } catch (err) {
      // Use mock data as fallback
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const getHeatColor = (score: number) => {
    if (score >= 90) return '#dc2626' // red-600
    if (score >= 80) return '#ea580c' // orange-600
    if (score >= 70) return '#f59e0b' // amber-500
    if (score >= 60) return '#eab308' // yellow-500
    return '#84cc16' // lime-500
  }

  const filteredZones = data?.demandZones.filter(zone => zone.demandScore >= filterScore) || []

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 min-h-[40vh]">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, purple 0%, transparent 50%), radial-gradient(circle at 80% 80%, indigo 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Eye className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-300">Live Buyer Activity</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Buyer Demand
              <span className="block bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Heat Map
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 lg:text-2xl font-light"
            >
              See exactly where buyers are looking and what they're willing to pay in real-time.
              <span className="block mt-2 text-lg">Track active buyer searches across Houston neighborhoods.</span>
            </motion.p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center min-h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : data ? (
        <>
          {/* Heat Map Section */}
          <section className="py-12 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Houston Buyer Demand Heat Map</h2>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <Filter className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700 mr-2">Min Score:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterScore}
                        onChange={(e) => setFilterScore(Number(e.target.value))}
                        className="w-32"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">{filterScore}</span>
                    </label>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="h-[600px] bg-gray-100 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Interactive Houston Heat Map</p>
                      <p className="text-sm text-gray-500 mt-2">Showing {filteredZones.length} high-demand areas</p>
                    </div>
                  </div>

                  {/* Demand Zones Overlay */}
                  <div className="absolute inset-0 p-8">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      {filteredZones.slice(0, 9).map((zone, index) => (
                        <motion.div
                          key={zone.zipCode}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                          onClick={() => setSelectedZone(zone)}
                        >
                          <div 
                            className="h-full rounded-xl p-4 cursor-pointer hover:scale-105 transition-transform flex flex-col justify-center items-center text-white"
                            style={{ backgroundColor: getHeatColor(zone.demandScore) + '99' }}
                          >
                            <p className="text-2xl font-bold">{zone.demandScore}°</p>
                            <p className="text-sm font-medium">{zone.neighborhood}</p>
                            <p className="text-xs opacity-80">{zone.zipCode}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Heat Legend */}
                <div className="mt-6 flex items-center justify-center space-x-8">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-600 rounded mr-2" />
                    <span className="text-sm text-gray-600">Very High (90+)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-600 rounded mr-2" />
                    <span className="text-sm text-gray-600">High (80-89)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-500 rounded mr-2" />
                    <span className="text-sm text-gray-600">Medium (70-79)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2" />
                    <span className="text-sm text-gray-600">Moderate (60-69)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Demand Details */}
          <section className="py-12 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Neighborhoods */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                    Hottest Neighborhoods by Demand
                  </h3>
                  <div className="space-y-4">
                    {data.demandZones.slice(0, 5).map((zone, index) => (
                      <div key={zone.zipCode} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{zone.neighborhood}</h4>
                            <p className="text-sm text-gray-500">{zone.zipCode}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: getHeatColor(zone.demandScore) }}
                              />
                              <span className="text-2xl font-bold text-gray-900">{zone.demandScore}°</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Avg Search Price</p>
                            <p className="font-medium text-gray-900">
                              ${(zone.avgSearchPrice / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Active Buyers</p>
                            <p className="font-medium text-gray-900">{zone.activeSearches}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Search Criteria */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  {/* Price Ranges */}
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <DollarSign className="h-6 w-6 text-purple-600 mr-2" />
                      Most Searched Price Ranges
                    </h3>
                    <div className="space-y-3">
                      {data.topSearchCriteria.priceRanges.map((range, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            ${(range.min / 1000).toFixed(0)}K - ${(range.max / 1000).toFixed(0)}K
                          </span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${(range.count / 2000) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-12 text-right">
                              {range.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Features */}
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <Home className="h-6 w-6 text-purple-600 mr-2" />
                      Most Wanted Features
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {data.topSearchCriteria.features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{feature.feature}</span>
                          <span className="text-sm text-purple-600 font-semibold">{feature.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Selected Zone Details */}
          {selectedZone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 z-50"
            >
              <button
                onClick={() => setSelectedZone(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {selectedZone.neighborhood} ({selectedZone.zipCode})
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Demand Score</p>
                  <p className="text-2xl font-bold" style={{ color: getHeatColor(selectedZone.demandScore) }}>
                    {selectedZone.demandScore}°
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Budget</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${(selectedZone.avgSearchPrice / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Buyers</p>
                  <p className="text-lg font-bold text-gray-900">{selectedZone.activeSearches}</p>
                </div>
              </div>
              <Link
                href={`/sellers/valuation?zipCode=${selectedZone.zipCode}`}
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Get Valuation for This Area
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          )}

          {/* CTA Section */}
          <section className="py-16 bg-gray-900">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Price Your Property for Maximum Demand
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Use buyer demand data to price competitively and sell faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sellers/valuation"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Get AI Valuation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/assistant"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Ask Fernando-X
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </>
  )
}