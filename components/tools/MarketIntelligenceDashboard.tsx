'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Building2, 
  Users, 
  MapPin, 
  AlertCircle,
  Loader2,
  BarChart3,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/utils/api-client'

interface MarketData {
  neighborhood: string
  permits: {
    total: number
    residential: number
    commercial: number
    trend: number
  }
  demographics: {
    population: number
    medianIncome: number
    growthRate: number
  }
  trends: {
    averagePrice: number
    priceChange: number
    daysOnMarket: number
    inventory: number
  }
  opportunities: {
    score: number
    factors: string[]
  }
}

interface DashboardProps {
  neighborhoods?: string[]
  className?: string
}

export function MarketIntelligenceDashboard({ neighborhoods = ['Houston Heights', 'Montrose', 'River Oaks'], className }: DashboardProps) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(neighborhoods[0])
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMarketData()
  }, [neighborhoods])

  const fetchMarketData = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiClient.post('/api/intelligence/market', {
        neighborhoods,
        dataTypes: ['permits', 'trends', 'demographics', 'opportunities'],
        timeframe: 'current',
      })
      
      // Transform the API response into our MarketData format
      const transformedData: Record<string, MarketData> = {}
      
      for (const neighborhood of neighborhoods) {
        const apiData = data as { data: Record<string, any> }
        transformedData[neighborhood] = {
          neighborhood,
          permits: apiData.data[neighborhood]?.permits || {
            total: 0,
            residential: 0,
            commercial: 0,
            trend: 0,
          },
          demographics: apiData.data[neighborhood]?.demographics || {
            population: 0,
            medianIncome: 0,
            growthRate: 0,
          },
          trends: apiData.data[neighborhood]?.trends || {
            averagePrice: 0,
            priceChange: 0,
            daysOnMarket: 0,
            inventory: 0,
          },
          opportunities: apiData.data[neighborhood]?.opportunities || {
            score: 0,
            factors: [],
          },
        }
      }

      setMarketData(transformedData)
    } catch (err) {
      console.error('Error fetching market data:', err)
      setError('Unable to load market data. Please try again later.')
      toast.error('Failed to load market intelligence data')
    } finally {
      setLoading(false)
    }
  }

  const currentData = marketData[selectedNeighborhood]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading market intelligence...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={fetchMarketData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Neighborhood Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-3">Select Neighborhood</h3>
        <div className="flex flex-wrap gap-2">
          {neighborhoods.map((neighborhood) => (
            <motion.button
              key={neighborhood}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedNeighborhood(neighborhood)}
              className={cn(
                'px-4 py-2 rounded-md font-medium transition-colors',
                selectedNeighborhood === neighborhood
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {neighborhood}
            </motion.button>
          ))}
        </div>
      </div>

      {currentData && (
        <motion.div
          key={selectedNeighborhood}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Permits Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Building Permits</h4>
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentData.permits.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total this year</p>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Residential</span>
                <span className="font-medium">{currentData.permits.residential}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Commercial</span>
                <span className="font-medium">{currentData.permits.commercial}</span>
              </div>
            </div>
            <div className={cn(
              'mt-4 text-sm font-medium flex items-center',
              currentData.permits.trend > 0 ? 'text-green-600' : 'text-red-600'
            )}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {currentData.permits.trend > 0 ? '+' : ''}{currentData.permits.trend}% vs last year
            </div>
          </motion.div>

          {/* Demographics Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Demographics</h4>
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {currentData.demographics.population.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Population</p>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Median Income</span>
                <span className="font-medium">
                  ${currentData.demographics.medianIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Growth Rate</span>
                <span className={cn(
                  'font-medium',
                  currentData.demographics.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {currentData.demographics.growthRate > 0 ? '+' : ''}{currentData.demographics.growthRate}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Market Trends Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Market Trends</h4>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${(currentData.trends.averagePrice / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600 mt-1">Avg. Property Price</p>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price Change</span>
                <span className={cn(
                  'font-medium',
                  currentData.trends.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {currentData.trends.priceChange > 0 ? '+' : ''}{currentData.trends.priceChange}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Days on Market</span>
                <span className="font-medium">{currentData.trends.daysOnMarket}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Inventory</span>
                <span className="font-medium">{currentData.trends.inventory} homes</span>
              </div>
            </div>
          </motion.div>

          {/* Opportunity Score Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Opportunity Score</h4>
              <MapPin className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentData.opportunities.score}/100</p>
            <p className="text-sm text-gray-600 mt-1">Development Potential</p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentData.opportunities.score}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={cn(
                    'h-2 rounded-full',
                    currentData.opportunities.score >= 70 ? 'bg-green-500' :
                    currentData.opportunities.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  )}
                />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              {currentData.opportunities.factors.slice(0, 3).map((factor, index) => (
                <p key={index} className="text-xs text-gray-600">• {factor}</p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 rounded-lg p-6 text-center"
      >
        <Home className="h-8 w-8 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Want detailed analysis for your project?
        </h3>
        <p className="text-gray-600 mb-4">
          Get personalized insights and recommendations for your specific development needs.
        </p>
        <button
          onClick={() => window.location.href = '/consultation'}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Schedule Consultation
        </button>
      </motion.div>
    </div>
  )
}