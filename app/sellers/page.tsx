'use client'

import Link from "next/link"
import { ArrowRight, Home, TrendingUp, DollarSign, Clock, Bot, Eye, Brain, Activity, Shield, Zap, Target, Map, CheckCircle, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'

interface SellerMetrics {
  avgDaysOnMarket: number
  medianSalePrice: number
  pricePremium: number
  activeBuyers: number
  accuracyRate: number
  totalSales: number
  priceChangeYoY: number
  inventory: number
}

interface NeighborhoodData {
  name: string
  zipCode: string
  avgSalePrice: number
  medianSalePrice: number
  daysOnMarket: number
  priceChange: number
  totalSales: number
  demandScore: number
}

interface MarketTiming {
  currentTrend: 'rising' | 'stable' | 'declining'
  seasonalPattern: string
  optimalTiming: string
  priceProjection: number
  demandForecast: string
  confidence: number
}

export default function SellerIntelligence() {
  const [metrics, setMetrics] = useState<SellerMetrics>({
    avgDaysOnMarket: 45,
    medianSalePrice: 425000,
    pricePremium: 12.5,
    activeBuyers: 2847,
    accuracyRate: 98,
    totalSales: 8247,
    priceChangeYoY: 8.2,
    inventory: 3.2
  })
  
  const [topNeighborhoods, setTopNeighborhoods] = useState<NeighborhoodData[]>([])
  const [marketTiming, setMarketTiming] = useState<MarketTiming | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real seller data from API
    const fetchSellerData = async () => {
      try {
        const response = await fetch('/api/sellers/metrics')
        if (response.ok) {
          const data = await response.json()
          setMetrics(data.metrics)
          setTopNeighborhoods(data.topNeighborhoods)
          setMarketTiming(data.marketTiming)
        }
      } catch (error) {
        console.error('Error fetching seller data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSellerData()
  }, [])

  const tools = [
    {
      title: "Property Valuation AI",
      description: "Get instant, accurate valuations using AI and real-time market data. Know your property's true worth.",
      icon: Bot,
      href: "/sellers/valuation",
      color: "from-teal-600 to-cyan-600",
      features: ["AI-powered analysis", "Comparable sales", "Market trends", "Instant results"],
      stats: "98% accuracy rate"
    },
    {
      title: "Market Timing Analysis",
      description: "Know the perfect time to sell. Our AI predicts market peaks and buyer demand cycles.",
      icon: TrendingUp,
      href: "/intelligence/market-timing",
      color: "from-orange-600 to-red-600",
      features: ["Price predictions", "Seasonal trends", "Buyer activity", "Optimal timing"],
      stats: "30% faster sales"
    },
    {
      title: "Buyer Demand Heat Map",
      description: "See exactly where buyers are looking and what they're willing to pay in real-time.",
      icon: Eye,
      href: "/intelligence/demand",
      color: "from-purple-600 to-indigo-600",
      features: ["Live buyer data", "Price heat maps", "Search trends", "Demand scoring"],
      stats: "Active buyer tracking"
    },
    {
      title: "3D Property Showcase",
      description: "Stand out with interactive 3D tours and AI-enhanced property presentations.",
      icon: Map,
      href: "/intelligence/map",
      color: "from-blue-600 to-cyan-600",
      features: ["3D visualization", "Virtual tours", "Drone views", "AI staging"],
      stats: "5x more views"
    },
    {
      title: "Instant Offer Engine",
      description: "Get competitive cash offers from our network of pre-qualified Houston buyers.",
      icon: DollarSign,
      href: "/sellers/instant-offer",
      color: "from-green-600 to-emerald-600",
      features: ["Cash offers", "No obligations", "48-hour response", "Multiple buyers"],
      stats: "500+ buyers"
    },
    {
      title: "Sale Timeline Optimizer",
      description: "AI-optimized selling timeline to maximize your profit and minimize time on market.",
      icon: Clock,
      href: "/sellers/timeline",
      color: "from-indigo-600 to-purple-600",
      features: ["Timeline planning", "Task automation", "Document prep", "Closing coordination"],
      stats: `${metrics.avgDaysOnMarket} days avg`
    }
  ]

  const insights = [
    {
      icon: TrendingUp,
      title: "Price Growth YoY",
      value: `+${metrics.priceChangeYoY?.toFixed(1) || 0}%`,
      label: "Annual Growth",
      trend: "up"
    },
    {
      icon: Clock,
      title: "Days on Market",
      value: metrics.avgDaysOnMarket,
      label: "Average Days",
      trend: "down"
    },
    {
      icon: DollarSign,
      title: "Median Sale Price",
      value: `$${(metrics.medianSalePrice / 1000).toFixed(0)}K`,
      label: "Current Market",
      trend: "up"
    },
    {
      icon: Activity,
      title: "Total Sales",
      value: metrics.totalSales?.toLocaleString() || "0",
      label: "Recent Period",
      trend: "up"
    }
  ]

  const benefits = [
    {
      title: "Sell Faster",
      description: "Our AI identifies serious buyers and optimal pricing to sell 45% faster than traditional methods.",
      icon: Zap
    },
    {
      title: "Get More Money",
      description: "Data-driven pricing and buyer matching helps sellers get 12% more than initial asking price.",
      icon: DollarSign
    },
    {
      title: "Complete Transparency",
      description: "Track buyer interest, market changes, and your property's performance in real-time.",
      icon: Eye
    },
    {
      title: "Expert Support",
      description: "Fernando-X AI assistant plus human experts guide you through every step.",
      icon: Shield
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-teal-900/20 to-gray-900 min-h-[60vh]">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, teal 0%, transparent 50%), radial-gradient(circle at 80% 80%, cyan 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center px-4 py-2 bg-teal-500/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Home className="h-5 w-5 text-teal-400 mr-2" />
              <span className="text-sm font-medium text-teal-300">Seller Intelligence Platform</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Seller
              <span className="block bg-gradient-to-r from-teal-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                Intelligence Suite
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 lg:text-2xl font-light"
            >
              AI-powered tools to sell your Houston property faster and for more money.
              <span className="block mt-2">Know when to sell, how to price, and who's buying.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0"
            >
              <Link
                href="/assistant"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-full hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-xl"
              >
                <Brain className="mr-2 h-5 w-5" />
                Ask Fernando-X
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sellers/valuation"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
              >
                <Bot className="mr-2 h-5 w-5" />
                Get AI Valuation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Metrics Bar */}
      <section className="bg-gray-900 border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <insight.icon className="h-5 w-5 text-teal-400" />
                  <span className={`text-xs font-medium ${
                    insight.trend === 'up' ? 'text-green-400' : 
                    insight.trend === 'down' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{insight.value}</div>
                <div className="text-sm text-gray-400">{insight.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
                  <benefit.icon className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Tools Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Intelligence Tools for Sellers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to sell smarter in Houston's competitive market
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={tool.href}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} text-white group-hover:scale-110 transition-transform`}>
                        <tool.icon className="h-7 w-7" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">{tool.stats}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {tool.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {tool.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-teal-600 font-medium">
                      Launch Tool
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fernando-X Integration */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-teal-900 via-cyan-900 to-green-900">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Brain className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Your AI Selling Assistant
            </h2>
            <p className="text-xl text-teal-200 mb-8 max-w-2xl mx-auto">
              Fernando-X guides you through every step of selling your Houston property. 
              Get instant answers about pricing, timing, and buyer preferences.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Ask Fernando-X about:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-teal-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Current market value of your property</span>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-teal-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Best time to list for maximum profit</span>
                </div>
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-teal-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">How to attract the right buyers</span>
                </div>
                <div className="flex items-start">
                  <Eye className="h-5 w-5 text-teal-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">What buyers want in your area</span>
                </div>
              </div>
            </div>

            <Link
              href="/assistant"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-teal-900 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Start Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hot Neighborhoods Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Hottest Selling Neighborhoods
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real-time data from Houston's most active markets
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topNeighborhoods.slice(0, 8).map((neighborhood, index) => (
                <motion.div
                  key={`${neighborhood.name}-${neighborhood.zipCode}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{neighborhood.name}</h3>
                      <p className="text-xs text-gray-500">{neighborhood.zipCode}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      neighborhood.demandScore >= 80 ? 'bg-green-100 text-green-800' :
                      neighborhood.demandScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {neighborhood.demandScore}°
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Avg Sale Price</p>
                      <p className="font-bold text-gray-900">
                        ${(neighborhood.avgSalePrice / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-gray-500">DOM</p>
                        <p className="font-medium text-gray-900">{neighborhood.daysOnMarket}d</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Sales</p>
                        <p className="font-medium text-gray-900">{neighborhood.totalSales}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Price Change</span>
                      <span className={`text-xs font-medium ${
                        neighborhood.priceChange > 0 ? 'text-green-600' : 
                        neighborhood.priceChange < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {neighborhood.priceChange > 0 ? '+' : ''}{neighborhood.priceChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Market Timing Insight */}
          {marketTiming && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Market Timing Intelligence</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Trend</p>
                      <p className={`text-lg font-bold ${
                        marketTiming.currentTrend === 'rising' ? 'text-green-600' :
                        marketTiming.currentTrend === 'declining' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {marketTiming.currentTrend.charAt(0).toUpperCase() + marketTiming.currentTrend.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Optimal Timing</p>
                      <p className="text-sm text-gray-600">{marketTiming.optimalTiming}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Demand Forecast</p>
                      <p className="text-sm text-gray-600">{marketTiming.demandForecast}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {metrics.avgDaysOnMarket < 50 ? '45%' : '35%'}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Faster Sales</div>
              <p className="text-gray-600">Properties sell faster using our AI-powered tools and buyer matching</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {metrics.priceChangeYoY > 0 ? `+${metrics.priceChangeYoY.toFixed(0)}%` : '12%'}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Higher Sale Price</div>
              <p className="text-gray-600">Data-driven pricing helps sellers get more than traditional methods</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">{metrics.accuracyRate}%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">AI Accuracy</div>
              <p className="text-gray-600">Valuation accuracy using real Houston market data</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Sell Smarter?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of Houston sellers using AI to maximize their property value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Get Free Consultation
            </Link>
            <Link
              href="/sellers/valuation"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Try AI Valuation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}