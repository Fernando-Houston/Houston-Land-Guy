'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Calendar, DollarSign, Clock, AlertCircle, ChevronUp, ChevronDown, Activity, Target, Brain } from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface MarketTimingData {
  currentTrend: 'rising' | 'stable' | 'declining'
  bestMonthsToSell: string[]
  worstMonthsToSell: string[]
  priceProjection: {
    '30days': number
    '60days': number
    '90days': number
  }
  seasonalData: Array<{
    month: string
    avgSalePrice: number
    avgDaysOnMarket: number
    salesVolume: number
  }>
  recommendation: string
  confidenceScore: number
}

export default function MarketTimingAnalysis() {
  const [zipCode, setZipCode] = useState('')
  const [data, setData] = useState<MarketTimingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock data for demonstration
  const mockData: MarketTimingData = {
    currentTrend: 'rising',
    bestMonthsToSell: ['March', 'April', 'May', 'June'],
    worstMonthsToSell: ['November', 'December', 'January'],
    priceProjection: {
      '30days': 2.1,
      '60days': 3.8,
      '90days': 5.2
    },
    seasonalData: [
      { month: 'Jan', avgSalePrice: 385000, avgDaysOnMarket: 65, salesVolume: 342 },
      { month: 'Feb', avgSalePrice: 390000, avgDaysOnMarket: 58, salesVolume: 398 },
      { month: 'Mar', avgSalePrice: 405000, avgDaysOnMarket: 45, salesVolume: 512 },
      { month: 'Apr', avgSalePrice: 415000, avgDaysOnMarket: 38, salesVolume: 587 },
      { month: 'May', avgSalePrice: 425000, avgDaysOnMarket: 32, salesVolume: 623 },
      { month: 'Jun', avgSalePrice: 420000, avgDaysOnMarket: 35, salesVolume: 598 },
      { month: 'Jul', avgSalePrice: 415000, avgDaysOnMarket: 40, salesVolume: 545 },
      { month: 'Aug', avgSalePrice: 410000, avgDaysOnMarket: 42, salesVolume: 523 },
      { month: 'Sep', avgSalePrice: 405000, avgDaysOnMarket: 48, salesVolume: 478 },
      { month: 'Oct', avgSalePrice: 395000, avgDaysOnMarket: 55, salesVolume: 423 },
      { month: 'Nov', avgSalePrice: 385000, avgDaysOnMarket: 62, salesVolume: 367 },
      { month: 'Dec', avgSalePrice: 380000, avgDaysOnMarket: 68, salesVolume: 298 }
    ],
    recommendation: "Based on current market trends, the optimal time to list your property is in the next 30-45 days. Spring market shows 12% higher prices and 35% faster sales.",
    confidenceScore: 87
  }

  useEffect(() => {
    // Load data on mount
    fetchMarketTiming()
  }, [])

  const fetchMarketTiming = async (zip?: string) => {
    setLoading(true)
    setError('')
    
    try {
      const url = zip ? `/api/sellers/market-timing?zipCode=${zip}` : '/api/sellers/market-timing'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch market timing data')
      }
      
      const data = await response.json()
      setData(data)
    } catch (err) {
      setError('Using demo data. Connect to see your area\'s specific timing.')
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (zipCode) {
      fetchMarketTiming(zipCode)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <ChevronUp className="h-6 w-6 text-green-500" />
      case 'declining':
        return <ChevronDown className="h-6 w-6 text-red-500" />
      default:
        return <Activity className="h-6 w-6 text-blue-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-green-600 bg-green-50'
      case 'declining':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-orange-900/20 to-gray-900 min-h-[40vh]">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, orange 0%, transparent 50%), radial-gradient(circle at 80% 80%, red 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center px-4 py-2 bg-orange-500/20 backdrop-blur-sm rounded-full mb-6"
            >
              <TrendingUp className="h-5 w-5 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-300">AI Market Predictions</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Market Timing
              <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
                Analysis Engine
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 lg:text-2xl font-light"
            >
              Know the perfect time to sell. AI predicts market peaks and buyer demand cycles.
              <span className="block mt-2 text-lg">Sell 30% faster with optimal timing.</span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* ZIP Code Filter */}
      <section className="py-8 bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleZipSubmit} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter ZIP code for specific area (optional)"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Update Analysis
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : data ? (
        <>
          {/* Current Market Status */}
          <section className="py-12 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Current Market Status</h2>
                  <div className={`flex items-center px-4 py-2 rounded-full ${getTrendColor(data.currentTrend)}`}>
                    {getTrendIcon(data.currentTrend)}
                    <span className="ml-2 font-medium capitalize">{data.currentTrend} Market</span>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="flex items-start">
                    <Target className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">AI Recommendation</h3>
                      <p className="text-gray-700">{data.recommendation}</p>
                      <div className="mt-3 flex items-center">
                        <div className="text-sm text-gray-600">Confidence Score:</div>
                        <div className="ml-3 flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full"
                              style={{ width: `${data.confidenceScore}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700">{data.confidenceScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Projections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">30 Day Projection</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.priceProjection['30days'] > 0 ? '+' : ''}{data.priceProjection['30days']}%
                    </p>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                    <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                    <p className="text-sm text-orange-700 font-medium mb-2">60 Day Projection</p>
                    <p className="text-3xl font-bold text-orange-700">
                      {data.priceProjection['60days'] > 0 ? '+' : ''}{data.priceProjection['60days']}%
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">90 Day Projection</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.priceProjection['90days'] > 0 ? '+' : ''}{data.priceProjection['90days']}%
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Seasonal Patterns */}
          <section className="py-12 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 text-center">Seasonal Market Patterns</h2>

                {/* Price Trends Chart */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Average Sale Price by Month</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.seasonalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <Tooltip 
                          formatter={(value: number) => `$${value.toLocaleString()}`}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="avgSalePrice" 
                          stroke="#ea580c" 
                          fill="#fed7aa" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Days on Market Chart */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Days on Market by Month</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.seasonalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgDaysOnMarket" fill="#ea580c" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Best/Worst Months */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <ChevronUp className="h-6 w-6 text-green-600 mr-2" />
                      Best Months to Sell
                    </h3>
                    <div className="space-y-3">
                      {data.bestMonthsToSell.map((month, index) => (
                        <div key={month} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="font-medium text-gray-900">{month}</span>
                          <span className="text-sm text-green-600">#{index + 1} Best</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <ChevronDown className="h-6 w-6 text-red-600 mr-2" />
                      Challenging Months
                    </h3>
                    <div className="space-y-3">
                      {data.worstMonthsToSell.map((month, index) => (
                        <div key={month} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="font-medium text-gray-900">{month}</span>
                          <span className="text-sm text-red-600">Slower Sales</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gray-900">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Time Your Sale Perfectly?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Get personalized timing recommendations from Fernando-X AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Get Timing Strategy
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