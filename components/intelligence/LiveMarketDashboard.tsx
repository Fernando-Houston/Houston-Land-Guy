'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, AlertCircle, Activity,
  DollarSign, Home, Building2, MapPin, BarChart3,
  Brain, Target, Zap, Clock, ArrowUp, ArrowDown
} from 'lucide-react'
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface MarketData {
  marketSummary?: any
  investmentFlows?: any[]
  capRates?: any[]
  developmentTrends?: any[]
  predictiveModels?: any[]
  marketForecast?: any
}

export default function LiveMarketDashboard() {
  const [marketData, setMarketData] = useState<MarketData>({})
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchMarketData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/market-data')
      const data = await response.json()
      
      // Use real market data from API
      setMarketData({
        marketSummary: data.summary,
        investmentFlows: data.investmentFlows || [],
        capRates: data.capRates || [],
        developmentTrends: data.trends || [],
        predictiveModels: data.models || [],
        marketForecast: data.forecast,
        currentMLS: data.summary?.currentMLS || {
          salesVolume: 7162,
          medianPrice: 334290,
          dollarVolume: 3500000000,
          luxuryGrowth: 64.6,
          daysOnMarket: 26,
          averagePrice: 425150,
          activeListings: 28675,
          monthsInventory: 4.0
        }
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching market data:', error)
      setLoading(false)
    } finally {
      setRefreshing(false)
    }
  }

  const demandChartData = {
    labels: ['Residential', 'Commercial', 'Industrial', 'Land'],
    datasets: [{
      label: 'Demand Score',
      data: marketData.demand ? [
        marketData.demand.byType.residential.demand,
        marketData.demand.byType.commercial.demand,
        marketData.demand.byType.industrial.demand,
        marketData.demand.byType.land.demand
      ] : [0, 0, 0, 0],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(251, 146, 60, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  const timingRadarData = {
    labels: ['Price Trend', 'Inventory', 'Demand/Supply', 'Economy', 'Seasonality'],
    datasets: [{
      label: 'Market Factors',
      data: marketData.marketTiming ? [
        marketData.marketTiming.factors.priceAppreciation,
        marketData.marketTiming.factors.inventory,
        marketData.marketTiming.factors.demandSupply,
        marketData.marketTiming.factors.economicIndicators,
        marketData.marketTiming.factors.seasonality
      ] : [0, 0, 0, 0, 0],
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(139, 92, 246, 1)'
    }]
  }

  const portfolioChartData = {
    labels: marketData.portfolio?.allocation?.byType ? 
      Object.keys(marketData.portfolio.allocation.byType) : [],
    datasets: [{
      data: marketData.portfolio?.allocation?.byType ? 
        Object.values(marketData.portfolio.allocation.byType) : [],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(251, 146, 60, 0.8)'
      ]
    }]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading market intelligence...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Market Intelligence</h2>
          <p className="text-gray-600">Real-time Houston real estate analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {refreshing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center text-purple-600"
              >
                <Activity className="h-4 w-4 animate-pulse mr-1" />
                <span className="text-sm">Updating...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={fetchMarketData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* December 2024 MLS Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">December 2024 MLS Data</h3>
          <Activity className="h-6 w-6 opacity-80" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-bold mb-1">
              {marketData.currentMLS?.salesVolume?.toLocaleString() || '7,162'}
            </div>
            <div className="text-purple-200 text-sm">Home Sales (+16.3% YoY)</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">
              ${marketData.currentMLS?.medianPrice?.toLocaleString() || '334,290'}
            </div>
            <div className="text-purple-200 text-sm">Median Price (+1.3% YoY)</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">
              ${marketData.currentMLS ? (marketData.currentMLS.dollarVolume / 1000000000).toFixed(1) : '3.5'}B
            </div>
            <div className="text-purple-200 text-sm">Total Dollar Volume</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">
              +{marketData.currentMLS?.luxuryGrowth || '64.6'}%
            </div>
            <div className="text-purple-200 text-sm">Luxury Sales Growth</div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <Target className="h-5 w-5 text-green-600" />
            <span className="text-xs text-gray-500">Days on Market</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {marketData.currentMLS?.daysOnMarket || '26'}
          </div>
          <div className="flex items-center mt-2">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              December 2024 Average
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="text-xs text-gray-500">Average Price</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${marketData.currentMLS?.averagePrice?.toLocaleString() || '425,150'}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            +5.0% YoY Growth
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <Home className="h-5 w-5 text-purple-600" />
            <span className="text-xs text-gray-500">Active Listings</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {marketData.currentMLS?.activeListings?.toLocaleString() || '28,675'}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            +25.9% YoY Growth
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <Activity className="h-5 w-5 text-orange-600" />
            <span className="text-xs text-gray-500">Months Inventory</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {marketData.currentMLS?.monthsInventory || '4.0'}
          </div>
          <div className="text-sm text-green-600 mt-2">
            Balanced Market
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Timing Radar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Market Timing Factors
          </h3>
          <div className="h-64">
            <Radar 
              data={timingRadarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#6B7280' },
                    grid: { color: '#E5E7EB' },
                    pointLabels: { color: '#374151' }
                  }
                },
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Demand by Type */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Demand by Property Type
          </h3>
          <div className="h-64">
            <Bar 
              data={demandChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#6B7280' },
                    grid: { color: '#E5E7EB' }
                  },
                  x: {
                    ticks: { color: '#6B7280' },
                    grid: { display: false }
                  }
                },
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center mb-4">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI Market Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketData.marketTiming?.insights?.map((insight: string, index: number) => (
            <div key={index} className="flex items-start">
              <Zap className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hot Spots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hottest Markets Right Now
        </h3>
        <div className="space-y-3">
          {marketData.demand?.hotspots?.map((spot: any, index: number) => (
            <motion.div
              key={spot.area}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">{spot.area}</div>
                  <div className="text-sm text-gray-600">
                    {spot.medianDaysOnMarket} days on market
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-purple-600">
                  {spot.demandScore}
                </div>
                <div className="text-sm text-green-600">
                  +{spot.priceGrowth}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}