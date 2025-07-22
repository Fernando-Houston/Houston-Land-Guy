'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Shield, 
  Target, 
  BarChart3, 
  Eye,
  Filter,
  SortDesc,
  Download,
  Bookmark,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Building2,
  Activity,
  Calendar,
  Percent
} from 'lucide-react'

interface InvestmentOpportunity {
  id: string
  title: string
  location: string
  neighborhood: string
  type: string
  price: number
  size: number
  projectedROI: number
  highlights: string[]
  risks: string[]
  timeline: string
  minimumInvestment: number
  targetIRR: number
  exitStrategy: string
  images: string[]
  actualProperty: boolean
  propertyData: {
    beds?: number
    baths?: number
    sqft?: number
    yearBuilt?: number
    zipCode?: string
    mlsNumber?: string
  }
}

interface MarketTiming {
  currentPhase: string
  indicators: {
    inventory: number
    priceGrowth: number
    absorption: number
    construction: string
  }
  recommendation: string
  analysis: string
}

interface DealsData {
  opportunities: InvestmentOpportunity[]
  total: number
  marketTiming: MarketTiming
}

export default function InvestmentDealsPage() {
  const [dealsData, setDealsData] = useState<DealsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    priceRange: 'all',
    roi: 'all'
  })
  const [sortBy, setSortBy] = useState('roi')
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      const response = await fetch('/api/investment-opportunities')
      const data = await response.json()
      setDealsData(data)
    } catch (error) {
      console.error('Error loading investment deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedDeals = dealsData?.opportunities?.filter((deal) => {
    if (selectedFilters.type !== 'all' && !deal.type.toLowerCase().includes(selectedFilters.type)) {
      return false
    }
    if (selectedFilters.priceRange !== 'all') {
      const price = deal.price
      switch (selectedFilters.priceRange) {
        case 'under-1m':
          return price < 1000000
        case '1m-5m':
          return price >= 1000000 && price < 5000000
        case '5m-10m':
          return price >= 5000000 && price < 10000000
        case 'over-10m':
          return price >= 10000000
        default:
          return true
      }
    }
    if (selectedFilters.roi !== 'all') {
      const roi = deal.projectedROI
      switch (selectedFilters.roi) {
        case 'high':
          return roi >= 20
        case 'medium':
          return roi >= 15 && roi < 20
        case 'conservative':
          return roi < 15
        default:
          return true
      }
    }
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return b.projectedROI - a.projectedROI
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'timeline':
        return a.timeline.localeCompare(b.timeline)
      default:
        return 0
    }
  }) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investment opportunities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investment Opportunities</h1>
              <p className="mt-2 text-gray-600">
                {dealsData?.total || 0} curated deals with AI-verified ROI projections
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/assistant"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Target className="h-4 w-4 mr-2" />
                Ask Fernando-X
              </Link>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Timing Banner */}
      {dealsData?.marketTiming && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-3" />
                <div>
                  <span className="font-semibold">Market Phase: {dealsData.marketTiming.currentPhase}</span>
                  <span className="mx-3">•</span>
                  <span>Recommendation: {dealsData.marketTiming.recommendation}</span>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div>Inventory: {dealsData.marketTiming.indicators.inventory} months</div>
                <div>Growth: {dealsData.marketTiming.indicators.priceGrowth}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={selectedFilters.type}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
                <option value="industrial">Industrial</option>
                <option value="mixed-use">Mixed-Use</option>
                <option value="land">Raw Land</option>
              </select>

              <select
                value={selectedFilters.priceRange}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="all">All Prices</option>
                <option value="under-1m">Under $1M</option>
                <option value="1m-5m">$1M - $5M</option>
                <option value="5m-10m">$5M - $10M</option>
                <option value="over-10m">Over $10M</option>
              </select>

              <select
                value={selectedFilters.roi}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, roi: e.target.value }))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="all">All ROI</option>
                <option value="high">High (&gt;20%)</option>
                <option value="medium">Medium (15-20%)</option>
                <option value="conservative">Conservative (&lt;15%)</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <SortDesc className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="roi">Highest ROI</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="timeline">Timeline</option>
                </select>
              </div>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewType('grid')}
                  className={`px-3 py-1 rounded text-sm ${viewType === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`px-3 py-1 rounded text-sm ${viewType === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAndSortedDeals.length} of {dealsData?.total || 0} investment opportunities
          </div>
        </div>

        {/* Deals Grid/List */}
        {filteredAndSortedDeals.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals match your criteria</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more opportunities</p>
            <button
              onClick={() => setSelectedFilters({ type: 'all', priceRange: 'all', roi: 'all' })}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={viewType === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredAndSortedDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  viewType === 'list' ? 'flex' : ''
                }`}
              >
                {viewType === 'grid' ? (
                  <>
                    {/* Grid View */}
                    <div className="aspect-video bg-gradient-to-br from-green-500 to-emerald-600 relative">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                          {deal.type}
                        </span>
                        <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                          <Bookmark className="h-4 w-4 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{deal.neighborhood}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {deal.title}
                        </h3>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-green-600">
                            {deal.projectedROI}%
                          </div>
                          <div className="text-xs text-gray-500">Projected ROI</div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Investment</span>
                          <span className="font-medium">${(deal.price / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Min. Investment</span>
                          <span className="font-medium">${(deal.minimumInvestment / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Timeline</span>
                          <span className="font-medium">{deal.timeline}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Target IRR</span>
                          <span className="font-medium">{deal.targetIRR}%</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Key Highlights</h4>
                        <div className="space-y-1">
                          {deal.highlights.slice(0, 2).map((highlight, idx) => (
                            <div key={idx} className="flex items-start text-sm text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Link
                          href={`/investment-opportunities/deals/${deal.id}`}
                          className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className="w-48 bg-gradient-to-br from-green-500 to-emerald-600 relative flex-shrink-0">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 left-4 right-4">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900">
                          {deal.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {deal.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-4">
                            <MapPin className="h-4 w-4 mr-1" />
                            {deal.neighborhood}
                            <span className="mx-2">•</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            {deal.timeline}
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Price</span>
                              <div className="font-medium">${(deal.price / 1000000).toFixed(1)}M</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Min. Investment</span>
                              <div className="font-medium">${(deal.minimumInvestment / 1000).toFixed(0)}K</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Projected ROI</span>
                              <div className="font-medium text-green-600">{deal.projectedROI}%</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Target IRR</span>
                              <div className="font-medium">{deal.targetIRR}%</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 ml-6">
                          <button className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                            <Bookmark className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/investment-opportunities/deals/${deal.id}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium inline-flex items-center"
                          >
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredAndSortedDeals.length > 0 && filteredAndSortedDeals.length < (dealsData?.total || 0) && (
          <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Opportunities
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help Finding the Right Investment?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Our AI-powered investment advisor can help you identify opportunities that match your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assistant"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              <Target className="h-5 w-5 mr-2" />
              Ask Fernando-X
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}