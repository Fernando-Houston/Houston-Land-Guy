'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, TrendingDown, AlertCircle, DollarSign, MapPin, Clock, 
  Building2, Filter, Bell, Download, Share2, Eye, ArrowRight,
  Zap, Brain, Activity, Shield, CheckCircle, Home, Search,
  BarChart3, Calendar, Star, Bot, RefreshCw, TrendingUp,
  Users, Sparkles, AlertTriangle, Percent, Map
} from 'lucide-react'

interface Opportunity {
  id: string
  type: 'land_assembly' | 'distressed' | 'price_drop' | 'off_market' | 'foreclosure' | 'emerging_area'
  title: string
  location: string
  address: string
  price: number
  previousPrice?: number
  priceChange?: number
  size: string
  zoning: string
  potential: string
  score: number
  discovered: Date
  highlights: string[]
  aiInsight: string
  coordinates: { lat: number; lng: number }
  status: 'new' | 'hot' | 'urgent'
  riskLevel: 'low' | 'medium' | 'high'
  estimatedROI: string
  marketComps: number
  daysOnMarket?: number
  distressSignals?: string[]
}

export default function AIScoutPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'date' | 'roi'>('score')
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 })
  const [stats, setStats] = useState({
    totalFound: 247,
    avgDiscount: 18.5,
    hotDeals: 23,
    newToday: 12,
    totalValue: 142.8,
    successRate: 89
  })

  // Simulate real-time opportunity discovery
  useEffect(() => {
    // Initial load of opportunities
    const mockOpportunities: Opportunity[] = [
      {
        id: '001',
        type: 'land_assembly',
        title: 'Prime Corner Lot Assembly - Montrose District',
        location: 'Montrose',
        address: '1400-1420 Westheimer Rd',
        price: 2850000,
        size: '0.68 acres',
        zoning: 'Mixed-Use Urban',
        potential: '40-unit luxury apartments or 25,000 sqft retail',
        score: 95,
        discovered: new Date(Date.now() - 2 * 60 * 60 * 1000),
        highlights: [
          'Three contiguous parcels available',
          'One owner willing to sell all',
          'No deed restrictions',
          'Walk score 98'
        ],
        aiInsight: 'Fernando-X detected unusual listing pattern suggesting motivated seller. Similar assemblies in area sold for 40% more after development. High gentrification index.',
        coordinates: { lat: 29.7432, lng: -95.3905 },
        status: 'hot',
        riskLevel: 'low',
        estimatedROI: '45-55%',
        marketComps: 3,
        distressSignals: ['Multiple price reductions', 'Owner relocated']
      },
      {
        id: '002',
        type: 'price_drop',
        title: 'Medical District Development Site - 22% Price Cut',
        location: 'Texas Medical Center',
        address: '7800 Fannin St',
        price: 3200000,
        previousPrice: 4100000,
        priceChange: -22,
        size: '1.2 acres',
        zoning: 'TMC-Medical',
        potential: '60,000 sqft medical office or research facility',
        score: 92,
        discovered: new Date(Date.now() - 6 * 60 * 60 * 1000),
        highlights: [
          'Third price drop in 60 days',
          'Adjacent to new Metro line',
          'Pre-approved for 6 stories',
          'Seller financing available'
        ],
        aiInsight: 'AI analysis shows seller facing deadline pressure. Market comparables support immediate value at current price with 35% upside. TMC expansion plans favor this location.',
        coordinates: { lat: 29.7080, lng: -95.3990 },
        status: 'urgent',
        riskLevel: 'medium',
        estimatedROI: '32-38%',
        marketComps: 5,
        daysOnMarket: 180,
        distressSignals: ['Listing agent change', 'Tax deadline approaching']
      },
      {
        id: '003',
        type: 'distressed',
        title: 'Tax Lien Property - Prime Galleria Location',
        location: 'Galleria/Uptown',
        address: '5100 San Felipe St',
        price: 1800000,
        size: '0.45 acres',
        zoning: 'Commercial',
        potential: 'Boutique hotel, luxury retail, or office conversion',
        score: 88,
        discovered: new Date(Date.now() - 12 * 60 * 60 * 1000),
        highlights: [
          'Tax lien auction next week',
          'Property needs minimal work',
          'Prime corner location',
          'No environmental issues verified'
        ],
        aiInsight: 'Fernando-X identified this as undervalued by 35% based on recent Galleria transactions. Quick action required. Comparable properties trading at $450/sqft.',
        coordinates: { lat: 29.7519, lng: -95.4619 },
        status: 'urgent',
        riskLevel: 'medium',
        estimatedROI: '28-35%',
        marketComps: 8,
        distressSignals: ['Tax lien filed', 'Owner bankruptcy', 'Vacant 6+ months']
      },
      {
        id: '004',
        type: 'off_market',
        title: 'Off-Market Industrial Portfolio - Ship Channel',
        location: 'East Houston',
        address: 'Multiple Properties - Ship Channel Area',
        price: 8500000,
        size: '12.5 acres total',
        zoning: 'Heavy Industrial',
        potential: '200,000 sqft warehouse/distribution center',
        score: 90,
        discovered: new Date(Date.now() - 24 * 60 * 60 * 1000),
        highlights: [
          'Direct rail access included',
          'Foreign Trade Zone eligible',
          'Stable tenant base (8.5% cap)',
          'Environmental Phase I clear'
        ],
        aiInsight: 'AI detected ownership transfer patterns indicating portfolio liquidation. Industrial demand surge expected with Port Houston expansion. Below replacement cost.',
        coordinates: { lat: 29.7420, lng: -95.2750 },
        status: 'new',
        riskLevel: 'low',
        estimatedROI: '25-30%',
        marketComps: 4,
        distressSignals: ['Estate sale', 'Partner buyout needed']
      },
      {
        id: '005',
        type: 'emerging_area',
        title: 'Early Opportunity - Fifth Ward Transformation',
        location: 'Fifth Ward',
        address: '3200 Lyons Ave',
        price: 450000,
        size: '2.1 acres',
        zoning: 'Urban Development',
        potential: 'Mixed-use: 80+ units, 15k sqft retail',
        score: 85,
        discovered: new Date(),
        highlights: [
          'Opportunity Zone benefits',
          'Near new Metro station (2025)',
          'City incentives available',
          'Artist community growing'
        ],
        aiInsight: 'Fernando-X predicts 200% appreciation over 5 years based on development patterns. Similar to early EaDo opportunities. Major institutional investment nearby.',
        coordinates: { lat: 29.7749, lng: -95.3486 },
        status: 'new',
        riskLevel: 'high',
        estimatedROI: '60-80%',
        marketComps: 2,
        distressSignals: ['Area gentrification starting']
      },
      {
        id: '006',
        type: 'foreclosure',
        title: 'Bank-Owned Office Building - Downtown CBD',
        location: 'Downtown Houston',
        address: '800 Capitol St',
        price: 5200000,
        previousPrice: 8900000,
        priceChange: -42,
        size: '0.38 acres / 45,000 sqft',
        zoning: 'CBD-Commercial',
        potential: 'Conversion to 120 residential units or boutique hotel',
        score: 87,
        discovered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        highlights: [
          'Bank wants quick sale',
          'Conversion-ready structure',
          'Downtown living incentives apply',
          'Parking deck included'
        ],
        aiInsight: 'AI analysis shows perfect timing for office-to-residential conversion. City offering 380 agreements for conversions. Similar projects achieving $300/sqft sales.',
        coordinates: { lat: 29.7604, lng: -95.3632 },
        status: 'hot',
        riskLevel: 'medium',
        estimatedROI: '35-45%',
        marketComps: 6,
        daysOnMarket: 90,
        distressSignals: ['Foreclosure auction', 'Bank REO', 'Immediate sale needed']
      },
      {
        id: '007',
        type: 'emerging_area',
        title: 'Heights Adjacent Development Land',
        location: 'Near Heights',
        address: '2100 N Main St',
        price: 1250000,
        size: '0.82 acres',
        zoning: 'Urban Corridor',
        potential: '24 townhomes or mixed-use development',
        score: 89,
        discovered: new Date(Date.now() - 8 * 60 * 60 * 1000),
        highlights: [
          'No deed restrictions',
          'All utilities at site',
          'Heights spillover demand',
          'Corner lot with visibility'
        ],
        aiInsight: 'Fernando-X identifies this as next Heights expansion area. Similar lots selling for 50% more in 12 months. Infrastructure improvements planned by city.',
        coordinates: { lat: 29.7800, lng: -95.3700 },
        status: 'new',
        riskLevel: 'low',
        estimatedROI: '40-50%',
        marketComps: 7
      },
      {
        id: '008',
        type: 'distressed',
        title: 'Partnership Dissolution - Warehouse District',
        location: 'East Downtown',
        address: '1800 Commerce St',
        price: 3750000,
        previousPrice: 4500000,
        priceChange: -17,
        size: '1.5 acres',
        zoning: 'Light Industrial/Creative',
        potential: 'Creative office campus or 150 loft units',
        score: 91,
        discovered: new Date(Date.now() - 4 * 60 * 60 * 1000),
        highlights: [
          'Partnership dissolution sale',
          'Existing warehouse character',
          'EaDo development boom',
          'No environmental issues'
        ],
        aiInsight: 'Legal dissolution requires quick sale. Property undervalued due to partnership issues, not market conditions. EaDo seeing 25% annual appreciation.',
        coordinates: { lat: 29.7520, lng: -95.3520 },
        status: 'hot',
        riskLevel: 'low',
        estimatedROI: '35-42%',
        marketComps: 5,
        distressSignals: ['Legal requirement to sell', 'Partners in dispute']
      }
    ]

    setOpportunities(mockOpportunities)
    setFilteredOpportunities(mockOpportunities)

    // Simulate periodic scanning
    const scanInterval = setInterval(() => {
      setIsScanning(true)
      setTimeout(() => {
        setIsScanning(false)
        setLastScan(new Date())
        // Simulate finding new opportunities
        setStats(prev => ({
          ...prev,
          totalFound: prev.totalFound + Math.floor(Math.random() * 3),
          newToday: prev.newToday + Math.floor(Math.random() * 2)
        }))
      }, 3000)
    }, 30000) // Every 30 seconds

    return () => clearInterval(scanInterval)
  }, [])

  // Filter opportunities
  useEffect(() => {
    let filtered = [...opportunities]
    
    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(opp => opp.type === selectedType)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Price filter
    filtered = filtered.filter(opp => 
      opp.price >= priceRange.min && opp.price <= priceRange.max
    )

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score
        case 'price':
          return a.price - b.price
        case 'date':
          return b.discovered.getTime() - a.discovered.getTime()
        case 'roi':
          return parseInt(b.estimatedROI) - parseInt(a.estimatedROI)
        default:
          return 0
      }
    })

    setFilteredOpportunities(filtered)
  }, [opportunities, selectedType, sortBy, searchQuery, priceRange])

  const getTypeIcon = (type: Opportunity['type']) => {
    switch (type) {
      case 'land_assembly':
        return Building2
      case 'distressed':
        return AlertCircle
      case 'price_drop':
        return TrendingDown
      case 'off_market':
        return Eye
      case 'foreclosure':
        return Home
      case 'emerging_area':
        return Target
      default:
        return MapPin
    }
  }

  const getTypeColor = (type: Opportunity['type']) => {
    switch (type) {
      case 'land_assembly':
        return 'text-blue-600 bg-blue-100'
      case 'distressed':
        return 'text-orange-600 bg-orange-100'
      case 'price_drop':
        return 'text-red-600 bg-red-100'
      case 'off_market':
        return 'text-purple-600 bg-purple-100'
      case 'foreclosure':
        return 'text-yellow-600 bg-yellow-100'
      case 'emerging_area':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-blue-400 mr-3" />
                <h1 className="text-4xl font-bold">AI Development Scout</h1>
              </div>
              <p className="text-xl text-gray-300 max-w-3xl">
                Fernando-X continuously scans Houston's market to find hidden opportunities, 
                distressed properties, and off-market deals before they hit the MLS.
              </p>
            </div>
            <Link
              href="/assistant"
              className="hidden lg:flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Brain className="h-5 w-5 mr-2" />
              Ask Fernando-X
            </Link>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-blue-400" />
                {isScanning && <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />}
              </div>
              <div className="text-2xl font-bold">{stats.totalFound}</div>
              <div className="text-sm text-gray-300">Total Found</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <TrendingDown className="h-5 w-5 text-green-400 mb-2" />
              <div className="text-2xl font-bold">{stats.avgDiscount}%</div>
              <div className="text-sm text-gray-300">Avg Discount</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <Zap className="h-5 w-5 text-red-400 mb-2" />
              <div className="text-2xl font-bold">{stats.hotDeals}</div>
              <div className="text-sm text-gray-300">Hot Deals</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <Star className="h-5 w-5 text-yellow-400 mb-2" />
              <div className="text-2xl font-bold">{stats.newToday}</div>
              <div className="text-sm text-gray-300">New Today</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <DollarSign className="h-5 w-5 text-green-400 mb-2" />
              <div className="text-2xl font-bold">${stats.totalValue}M</div>
              <div className="text-sm text-gray-300">Total Value</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <Percent className="h-5 w-5 text-purple-400 mb-2" />
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="land_assembly">Land Assembly</option>
                <option value="distressed">Distressed</option>
                <option value="price_drop">Price Drops</option>
                <option value="off_market">Off-Market</option>
                <option value="foreclosure">Foreclosures</option>
                <option value="emerging_area">Emerging Areas</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="score">AI Score</option>
                <option value="price">Price: Low to High</option>
                <option value="date">Newest First</option>
                <option value="roi">Highest ROI</option>
              </select>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price Range */}
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-5 w-5 mr-2" />
                Price Range
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
                <Map className="h-5 w-5 mr-2" />
                Map View
              </button>
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5 mr-2" />
                Set Alerts
              </button>
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
              <div className="text-sm text-gray-500">
                Last scan: {formatTimeAgo(lastScan)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            <div className="grid gap-6">
              {filteredOpportunities.map((opportunity, index) => {
                const TypeIcon = getTypeIcon(opportunity.type)
                const typeColor = getTypeColor(opportunity.type)
                
                return (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          {/* Type Badge */}
                          <div className={`p-3 rounded-lg ${typeColor}`}>
                            <TypeIcon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {opportunity.title}
                              </h3>
                              {opportunity.status === 'hot' && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full animate-pulse">
                                  HOT
                                </span>
                              )}
                              {opportunity.status === 'urgent' && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                                  URGENT
                                </span>
                              )}
                              {opportunity.status === 'new' && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                  NEW
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {opportunity.location}
                              </span>
                              <span>{opportunity.size}</span>
                              <span>Zoning: {opportunity.zoning}</span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatTimeAgo(opportunity.discovered)}
                              </span>
                              {opportunity.daysOnMarket && (
                                <span className="text-orange-600">
                                  {opportunity.daysOnMarket} DOM
                                </span>
                              )}
                            </div>

                            <p className="text-gray-700 mb-4">{opportunity.address}</p>

                            {/* Price Info */}
                            <div className="flex items-center gap-6 mb-4">
                              <div>
                                <span className="text-3xl font-bold text-gray-900">
                                  ${(opportunity.price / 1000000).toFixed(2)}M
                                </span>
                                {opportunity.priceChange && (
                                  <span className="ml-2 text-sm font-semibold text-red-600">
                                    {opportunity.priceChange}% ↓
                                  </span>
                                )}
                              </div>
                              {opportunity.previousPrice && (
                                <div className="text-sm text-gray-500">
                                  <span className="line-through">
                                    ${(opportunity.previousPrice / 1000000).toFixed(2)}M
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center text-sm text-gray-600">
                                <BarChart3 className="h-4 w-4 mr-1" />
                                {opportunity.marketComps} comps
                              </div>
                            </div>

                            {/* AI Insight */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                              <div className="flex items-start">
                                <Bot className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-semibold text-blue-900 mb-1">
                                    Fernando-X Insight
                                  </p>
                                  <p className="text-sm text-blue-800">
                                    {opportunity.aiInsight}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Distress Signals */}
                            {opportunity.distressSignals && opportunity.distressSignals.length > 0 && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                <div className="flex items-start">
                                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-semibold text-yellow-900 mb-1">
                                      Distress Signals Detected
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {opportunity.distressSignals.map((signal, idx) => (
                                        <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                          {signal}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Highlights */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {opportunity.highlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  {highlight}
                                </div>
                              ))}
                            </div>

                            {/* Potential */}
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                Development Potential
                              </p>
                              <p className="text-sm text-gray-600">{opportunity.potential}</p>
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Score and Actions */}
                        <div className="text-right ml-6">
                          <div className="mb-4">
                            <div className="text-sm text-gray-500 mb-1">AI Score</div>
                            <div className="relative">
                              <div className="text-3xl font-bold text-blue-600">
                                {opportunity.score}
                              </div>
                              <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-yellow-500" />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="text-sm text-gray-500 mb-1">Est. ROI</div>
                            <div className="text-lg font-semibold text-green-600">
                              {opportunity.estimatedROI}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-sm text-gray-500 mb-1">Risk</div>
                            <div className={`text-sm font-medium ${
                              opportunity.riskLevel === 'low' ? 'text-green-600' :
                              opportunity.riskLevel === 'medium' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {opportunity.riskLevel.toUpperCase()}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Link
                              href={`/opportunities/${opportunity.id}`}
                              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              View Details
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Load More Opportunities
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Never Miss an Opportunity
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Set custom alerts and let Fernando-X notify you instantly when matching properties appear.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Bell className="h-5 w-5 mr-2" />
              Configure Alerts
            </button>
            <Link
              href="/assistant"
              className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Brain className="h-5 w-5 mr-2" />
              Ask Fernando-X
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}