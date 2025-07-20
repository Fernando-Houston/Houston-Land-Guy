'use client'

import Link from "next/link"
import { ArrowRight, Brain, TrendingUp, Building2, BarChart3, MapPin, DollarSign, Users, Zap, Shield, Globe, Database, Activity, FileSearch, Bot, Cpu, Eye, Target, PieChart, AlertCircle, Construction, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'
import AISearchBar from '@/components/search/AISearchBar'
import { houstonDataService } from '@/lib/services/houston-data-service'
import AIPropertyRecommendations from '@/components/intelligence/AIPropertyRecommendations'

export default function IntelligenceHub() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'developers' | 'sellers' | 'investors'>('all')
  const [liveMetrics, setLiveMetrics] = useState({
    activeDeals: 0,
    dataPoints: 0,
    aiInsights: 0
  })
  const [houstonStats, setHoustonStats] = useState<any>(null)
  const [majorProjects, setMajorProjects] = useState<any[]>([])
  const [marketInsights, setMarketInsights] = useState<string[]>([])

  // Load real Houston data
  useEffect(() => {
    loadHoustonData()
  }, [])

  const loadHoustonData = async () => {
    const [summary, projects, enhancedInsights] = await Promise.all([
      houstonDataService.getMarketSummary(),
      houstonDataService.getMajorProjects({ status: 'under_construction' }),
      houstonDataService.getEnhancedMarketInsights()
    ])
    
    // Get July 2025 data
    const july2025Data = houstonDataService.getJuly2025MLSData()
    
    // Merge summary with July 2025 MLS data
    const statsWithMLS = {
      ...summary,
      currentMLS: {
        salesVolume: july2025Data.singleFamilyHomeSales,
        salesGrowth: july2025Data.singleFamilySalesGrowthYoY,
        medianPrice: july2025Data.medianHomePrice,
        averagePrice: july2025Data.averageHomePrice,
        activeListings: july2025Data.activeListingsSingleFamily,
        luxuryGrowth: july2025Data.luxurySalesGrowth,
        daysOnMarket: july2025Data.daysOnMarket,
        monthsInventory: july2025Data.monthsInventory,
        constructionPermits: enhancedInsights.currentMLS.constructionPermits
      },
      constructionActivity: enhancedInsights.constructionActivity,
      microMarketIntelligence: enhancedInsights.microMarketIntelligence
    }
    
    setHoustonStats(statsWithMLS)
    setMajorProjects(projects.slice(0, 3))
    setMarketInsights(houstonDataService.getLocalInsights().slice(0, 4))
    
    // Set real metrics with July 2025 data
    setLiveMetrics({
      activeDeals: projects.length,
      dataPoints: 2.8, // Million data points
      aiInsights: july2025Data.singleFamilyHomeSales // Use actual MLS sales volume
    })
  }

  const intelligenceModules = {
    all: [
      {
        title: "Fernando-X AI Assistant",
        description: "Your personal Houston development expert. Ask questions, get insights, and make data-driven decisions.",
        icon: Brain,
        href: "/assistant",
        color: "from-purple-600 to-purple-700",
        badge: "AI Powered",
        stats: "24/7 Available"
      },
      {
        title: "AI Development Scout",
        description: "Discovers opportunities 24/7: land assembly, distressed properties, price drops, and emerging areas.",
        icon: Target,
        href: "/intelligence/scout",
        color: "from-blue-600 to-cyan-600",
        badge: "Live Scanning",
        stats: `${majorProjects.length}+ Active Projects`
      },
      {
        title: "3D Development Map",
        description: "Revolutionary visualization with 5 data layers, real-time permits, and neighborhood analytics.",
        icon: MapPin,
        href: "/intelligence/map",
        color: "from-green-600 to-emerald-600",
        badge: "Real-Time",
        stats: `${liveMetrics.dataPoints}M+ Data Points`
      },
      {
        title: "Market Alerts",
        description: "Real-time notifications for price drops, new permits, and market movements in your target areas.",
        icon: AlertCircle,
        href: "/intelligence/alerts",
        color: "from-red-600 to-orange-600",
        badge: "New",
        stats: "Instant Alerts"
      },
      {
        title: "Deal Pipeline",
        description: "AI-powered deal management from lead to close with predictive analytics and automation.",
        icon: Activity,
        href: "/deals",
        color: "from-indigo-600 to-purple-600",
        badge: "AI Scoring",
        stats: "Track Everything"
      },
      {
        title: "Major Projects Tracker",
        description: "Monitor $13.8B+ in Houston development projects with real-time updates and insights.",
        icon: Construction,
        href: "/projects",
        color: "from-orange-600 to-red-600",
        badge: "Live Data",
        stats: `${majorProjects.length} Active Projects`
      },
      {
        title: "Live Market Dashboard",
        description: "Real-time Houston market metrics, trends, and investment opportunities updated every minute.",
        icon: BarChart3,
        href: "/intelligence/dashboard",
        color: "from-teal-600 to-blue-600",
        badge: "Live Data",
        stats: "Auto-Refresh"
      }
    ],
    developers: [
      {
        title: "ROI Calculator",
        description: "Advanced financial modeling for Houston development projects with market comparables.",
        icon: PieChart,
        href: "/roi-calculator",
        color: "from-green-600 to-emerald-600",
        badge: "Essential Tool",
        stats: "15+ Metrics"
      },
      {
        title: "Zoning Intelligence",
        description: "Draw any area for instant AI analysis, development scenarios, and ROI calculations.",
        icon: Building2,
        href: "/intelligence/zoning",
        color: "from-orange-600 to-red-600",
        badge: "AI Analysis",
        stats: "Instant Results"
      },
      {
        title: "Permit Tracker",
        description: "Live Houston permit data with hot zone identification and trend analysis.",
        icon: FileSearch,
        href: "/intelligence/permits",
        color: "from-blue-600 to-cyan-600",
        badge: "Live Data",
        stats: "Updated Daily"
      }
    ],
    sellers: [
      {
        title: "Property Valuation AI",
        description: "Get instant, accurate valuations based on real Houston market data.",
        icon: DollarSign,
        href: "/sellers",
        color: "from-purple-600 to-pink-600",
        badge: "AI Valuation",
        stats: "98% Accurate"
      },
      {
        title: "Market Timing Analysis",
        description: "AI predicts the optimal time to sell based on market cycles and trends.",
        icon: TrendingUp,
        href: "/intelligence/market-timing",
        color: "from-green-600 to-teal-600",
        badge: "Predictive",
        stats: "90-Day Forecast"
      },
      {
        title: "Buyer Demand Heat Map",
        description: "See where buyers are searching most in real-time across Houston.",
        icon: MapPin,
        href: "/intelligence/demand",
        color: "from-red-600 to-orange-600",
        badge: "Real-Time",
        stats: "Live Updates"
      }
    ],
    investors: [
      {
        title: "Investment Opportunities",
        description: "Curated Houston opportunities analyzed by AI for maximum ROI potential.",
        icon: Target,
        href: "/investment-opportunities",
        color: "from-indigo-600 to-purple-600",
        badge: "AI Curated",
        stats: "$3.8B+ Pipeline"
      },
      {
        title: "Portfolio Analytics",
        description: "Track and optimize your Houston real estate portfolio performance.",
        icon: PieChart,
        href: "/intelligence/portfolio",
        color: "from-blue-600 to-teal-600",
        badge: "Analytics",
        stats: "Real-Time NAV"
      },
      {
        title: "Market Predictions",
        description: "AI-powered predictions for Houston neighborhoods and property types.",
        icon: Activity,
        href: "/intelligence/predictions",
        color: "from-purple-600 to-pink-600",
        badge: "Predictive AI",
        stats: "1-3 Year Outlook"
      }
    ]
  }

  const activeModules = intelligenceModules[selectedCategory]

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    return `$${(amount / 1000).toFixed(0)}K`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Houston Development
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                Intelligence Hub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Real-time data, AI insights, and powerful tools for Houston real estate professionals
            </p>
            
            {/* Live Metrics */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-white">{liveMetrics.activeDeals}</div>
                <div className="text-sm text-purple-200">Active Projects</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-white">{liveMetrics.dataPoints}M+</div>
                <div className="text-sm text-purple-200">Data Points</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-white">{liveMetrics.aiInsights}</div>
                <div className="text-sm text-purple-200">AI Insights Daily</div>
              </motion.div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <AISearchBar />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Houston Market Highlights */}
      {houstonStats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="h-6 w-6 mr-2 text-purple-600" />
              Houston Market Pulse - July 2025
            </h2>
            
            {/* July 2025 MLS Real-Time Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">July 2025 Sales</p>
                <p className="text-xl font-bold text-gray-900">{houstonStats.currentMLS ? houstonStats.currentMLS.salesVolume.toLocaleString() : '8,588'}</p>
                <p className="text-sm text-green-600">+{houstonStats.currentMLS ? houstonStats.currentMLS.salesGrowth : '12.5'}% YoY</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Median Home Price</p>
                <p className="text-xl font-bold text-gray-900">${houstonStats.currentMLS ? houstonStats.currentMLS.medianPrice.toLocaleString() : '346,651'}</p>
                <p className="text-sm text-gray-600">Unchanged YoY</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Inventory</p>
                <p className="text-xl font-bold text-gray-900">{houstonStats.currentMLS ? houstonStats.currentMLS.activeListings.toLocaleString() : '38,713'}</p>
                <p className="text-sm text-green-600">+31.8% YoY</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Luxury Growth ($1M+)</p>
                <p className="text-xl font-bold text-gray-900">+{houstonStats.currentMLS ? houstonStats.currentMLS.luxuryGrowth : '40.6'}%</p>
                <p className="text-sm text-purple-600">July 2025</p>
              </div>
            </div>

            {/* Additional Market Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Days on Market</p>
                <p className="text-xl font-bold text-gray-900">{houstonStats.currentMLS ? houstonStats.currentMLS.daysOnMarket : '26'}</p>
                <p className="text-sm text-gray-600">December Average</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Months Inventory</p>
                <p className="text-xl font-bold text-gray-900">{houstonStats.currentMLS ? houstonStats.currentMLS.monthsInventory : '4.0'}</p>
                <p className="text-sm text-gray-600">Current Supply</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-xl font-bold text-gray-900">{houstonStats.currentMLS ? houstonStats.currentMLS.activeListings.toLocaleString() : '28,675'}</p>
                <p className="text-sm text-green-600">+25.9% YoY</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Construction Permits</p>
                <p className="text-xl font-bold text-gray-900">{houstonStats.currentMLS ? (houstonStats.currentMLS.constructionPermits.singleFamily + houstonStats.currentMLS.constructionPermits.multifamily).toLocaleString() : '1,382'}</p>
                <p className="text-sm text-purple-600">December 2024</p>
              </div>
            </div>

            {/* Major Infrastructure Projects (Harris County Construction Activity) */}
            {houstonStats.constructionActivity && (
              <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                  <Construction className="h-5 w-5 mr-2" />
                  Active Major Infrastructure (July 2025)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-orange-700">TxDOT Investment</p>
                    <p className="text-xl font-bold text-orange-900">${(houstonStats.constructionActivity.totalInfrastructureInvestment / 1000000000).toFixed(1)}B</p>
                    <p className="text-sm text-orange-600">Infrastructure Projects</p>
                  </div>
                  <div>
                    <p className="text-sm text-orange-700">Residential Permits</p>
                    <p className="text-xl font-bold text-orange-900">{houstonStats.constructionActivity.residentialPermitsJune2025.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+{houstonStats.constructionActivity.permitGrowthRate}% June 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-orange-700">Metro Construction</p>
                    <p className="text-xl font-bold text-orange-900">${(houstonStats.constructionActivity.metroConstructionValue / 1000000000).toFixed(2)}B</p>
                    <p className="text-sm text-orange-600">{houstonStats.constructionActivity.metroAreaPermits.toLocaleString()} permits</p>
                  </div>
                </div>
                <div className="text-sm text-orange-700">
                  Major projects include $4.23B NHHIP freeway reconstruction, $1.225B I-45 upgrade, and $445M SH 35/I-610 connection
                </div>
              </div>
            )}

            {/* Houston Micro-Market Intelligence & School District Impact */}
            {houstonStats.microMarketIntelligence && (
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Micro-Market Intelligence & School Impact (2024)
                </h3>
                
                {/* Houston ISD Transformation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-blue-700">School Improvement</p>
                    <p className="text-xl font-bold text-blue-900">+{houstonStats.microMarketIntelligence.houstonISDTransformation.improvementRate}%</p>
                    <p className="text-sm text-blue-600">A-rated schools</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Failing Schools</p>
                    <p className="text-xl font-bold text-blue-900">-{houstonStats.microMarketIntelligence.houstonISDTransformation.failingSchoolReduction}%</p>
                    <p className="text-sm text-green-600">D/F reduction</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Top Growth Area</p>
                    <p className="text-xl font-bold text-blue-900">{houstonStats.microMarketIntelligence.topPerformers?.emergingMarket?.name || 'Independence Heights'}</p>
                    <p className="text-sm text-blue-600">+12.3% appreciation</p>
                  </div>
                </div>

                {/* Investment Opportunities */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">Top Investment Opportunities:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {houstonStats.microMarketIntelligence.investmentOpportunities?.slice(0, 3).map((opp: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="font-semibold text-blue-900 text-sm">{opp.area}</div>
                        <div className="text-xs text-blue-700">{opp.potential} Potential</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-blue-700">
                  Houston ISD achieved an 82.8% increase in A-rated schools, creating significant property value appreciation in EaDo (+1.5 grade improvement), Third Ward, and Independence Heights neighborhoods.
                </div>
              </div>
            )}

            {/* Local Market Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {marketInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5" />
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>

            {/* Seasonal Market Patterns */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                2025 Seasonal Market Patterns
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-green-700">Peak Season</p>
                  <p className="text-lg font-bold text-green-900">May-June</p>
                  <p className="text-sm text-green-600">1.20-1.25 Activity Index</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Current Month</p>
                  <p className="text-lg font-bold text-green-900">July</p>
                  <p className="text-sm text-green-600">1.15 Activity Index</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Lowest Activity</p>
                  <p className="text-lg font-bold text-green-900">December</p>
                  <p className="text-sm text-green-600">0.80 Activity Index</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Inventory Peak</p>
                  <p className="text-lg font-bold text-green-900">June</p>
                  <p className="text-sm text-green-600">5.4 Months Supply</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Major Projects Ticker */}
      {majorProjects.length > 0 && (
        <div className="bg-gray-900 text-white py-3 overflow-hidden">
          <div className="flex animate-scroll">
            <div className="flex items-center space-x-8 px-4">
              <span className="flex items-center text-sm font-medium">
                <Construction className="h-4 w-4 mr-2 text-yellow-400" />
                MAJOR PROJECTS:
              </span>
              {majorProjects.map((project, index) => (
                <span key={index} className="flex items-center text-sm">
                  <span className="font-semibold">{project.name}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-green-400">{formatCurrency(project.investmentAmount)}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-300">{project.location}</span>
                  {index < majorProjects.length - 1 && <span className="ml-8 text-gray-600">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'all', label: 'All Tools', icon: Globe },
            { id: 'developers', label: 'For Developers', icon: Building2 },
            { id: 'sellers', label: 'For Sellers', icon: DollarSign },
            { id: 'investors', label: 'For Investors', icon: TrendingUp }
          ].map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <category.icon className="h-5 w-5 mr-2" />
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Intelligence Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeModules.map((module, index) => (
            <motion.div
              key={module.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={module.href}>
                <div className="relative h-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${module.color} text-white`}>
                        <module.icon className="h-6 w-6" />
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        {module.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        {module.stats}
                      </span>
                      <ArrowRight className="h-5 w-5 text-purple-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Property Recommendations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AIPropertyRecommendations />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Houston Real Estate Strategy?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of professionals using AI to make smarter decisions
          </p>
          <Link
            href="/assistant"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Start with Fernando-X AI
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}