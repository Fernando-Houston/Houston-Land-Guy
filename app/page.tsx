'use client'

import Link from "next/link"
import { ArrowRight, Brain, TrendingUp, Building2, BarChart3, MapPin, DollarSign, Users, Zap, Shield, Globe, Database, Activity, FileSearch, Bot, Cpu, Eye, Target, PieChart } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'
import AISearchBar from '@/components/search/AISearchBar'

export default function IntelligenceHub() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'developers' | 'sellers' | 'investors'>('all')
  const [liveMetrics, setLiveMetrics] = useState({
    activeDeals: 247,
    dataPoints: 1.2,
    aiInsights: 892
  })

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeDeals: prev.activeDeals + Math.floor(Math.random() * 3),
        dataPoints: +(prev.dataPoints + Math.random() * 0.1).toFixed(1),
        aiInsights: prev.aiInsights + Math.floor(Math.random() * 5)
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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
        stats: "247+ Active Opportunities"
      },
      {
        title: "3D Development Map",
        description: "Revolutionary visualization with 5 data layers, real-time permits, and neighborhood analytics.",
        icon: MapPin,
        href: "/intelligence/map",
        color: "from-green-600 to-emerald-600",
        badge: "Real-Time",
        stats: "1.2M+ Data Points"
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
        color: "from-teal-600 to-blue-600",
        badge: "Live Data",
        stats: "Updated Daily"
      },
      {
        title: "Cost Intelligence",
        description: "Real construction costs from actual Houston projects with AI-powered estimates.",
        icon: DollarSign,
        href: "/intelligence/costs",
        color: "from-indigo-600 to-purple-600",
        badge: "Market Data",
        stats: "$483M+ Analyzed"
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
        title: "Development Feasibility",
        description: "Instant feasibility reports with construction costs, timelines, and profit projections.",
        icon: BarChart3,
        href: "/intelligence/feasibility",
        color: "from-blue-600 to-indigo-600",
        badge: "Coming Soon",
        stats: "60-Second Reports"
      },
      {
        title: "Contractor Network",
        description: "Vetted Houston contractors, architects, and development professionals.",
        icon: Users,
        href: "/developers",
        color: "from-purple-600 to-pink-600",
        badge: "Verified",
        stats: "200+ Professionals"
      }
    ],
    sellers: [
      {
        title: "Property Valuation AI",
        description: "Instant property valuations using AI and comparable sales analysis.",
        icon: Bot,
        href: "/sellers",
        color: "from-teal-600 to-cyan-600",
        badge: "AI Valuation",
        stats: "98% Accuracy"
      },
      {
        title: "Market Timing Analysis",
        description: "Know the perfect time to sell with predictive market analytics.",
        icon: TrendingUp,
        href: "/intelligence/market-timing",
        color: "from-orange-600 to-red-600",
        badge: "Predictive",
        stats: "Market Trends"
      },
      {
        title: "Buyer Demand Heat Map",
        description: "See where buyers are looking and what they're willing to pay.",
        icon: Eye,
        href: "/intelligence/demand",
        color: "from-indigo-600 to-purple-600",
        badge: "Real-Time",
        stats: "Active Buyers"
      }
    ],
    investors: [
      {
        title: "Investment Opportunities",
        description: "Curated Houston investment properties with detailed ROI analysis.",
        icon: DollarSign,
        href: "/investment-opportunities",
        color: "from-green-600 to-teal-600",
        badge: "High ROI",
        stats: "22%+ Returns"
      },
      {
        title: "Market Predictions",
        description: "AI-powered market forecasts for Houston neighborhoods and property types.",
        icon: Cpu,
        href: "/intelligence/predictions",
        color: "from-purple-600 to-indigo-600",
        badge: "AI Forecast",
        stats: "85% Accuracy"
      },
      {
        title: "Portfolio Analytics",
        description: "Track and optimize your Houston real estate portfolio performance.",
        icon: PieChart,
        href: "/intelligence/portfolio",
        color: "from-blue-600 to-cyan-600",
        badge: "Coming Soon",
        stats: "Full Analytics"
      }
    ]
  }

  const displayModules = selectedCategory === 'all' 
    ? intelligenceModules.all 
    : [...intelligenceModules.all.slice(0, 3), ...intelligenceModules[selectedCategory]]

  return (
    <>
      {/* Hero Section - Intelligence Hub */}
      <section className="relative overflow-hidden bg-gray-950 min-h-[85vh]">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, purple 0%, transparent 50%), radial-gradient(circle at 80% 80%, cyan 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Live Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-6 mb-8"
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Activity className="h-4 w-4 text-green-400 mr-2 animate-pulse" />
                <span className="text-sm text-white">{liveMetrics.activeDeals} Active Deals</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Database className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-sm text-white">{liveMetrics.dataPoints}M+ Data Points</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Brain className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-sm text-white">{liveMetrics.aiInsights} AI Insights/Day</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Houston Development
                <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                  Intelligence Hub
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 lg:text-2xl font-light">
                Real-time market intelligence powered by <span className="text-purple-400 font-semibold">Fernando-X AI</span> and advanced analytics.
                <span className="block mt-2">Make data-driven decisions with confidence.</span>
              </p>
            </motion.div>

            {/* Intelligence Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                All Intelligence
              </button>
              <button
                onClick={() => setSelectedCategory('developers')}
                className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === 'developers'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                Developer Intel
              </button>
              <button
                onClick={() => setSelectedCategory('sellers')}
                className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === 'sellers'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                Seller Intel
              </button>
              <button
                onClick={() => setSelectedCategory('investors')}
                className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === 'investors'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                Investor Intel
              </button>
            </motion.div>

            {/* AI Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <AISearchBar />
            </motion.div>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0"
            >
              <Link
                href="/assistant"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-full hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-xl"
              >
                <Brain className="mr-2 h-5 w-5" />
                Ask Fernando-X
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/intelligence/scout"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
              >
                <Zap className="mr-2 h-5 w-5" />
                AI Scout
              </Link>
              <Link
                href="/intelligence/map"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
              >
                <MapPin className="mr-2 h-5 w-5" />
                3D Map
              </Link>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 flex flex-wrap justify-center items-center gap-6"
            >
              <div className="flex items-center text-white/80">
                <Shield className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-sm">Bank-Grade Security</span>
              </div>
              <div className="flex items-center text-white/80">
                <Globe className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-sm">Real-Time Data</span>
              </div>
              <div className="flex items-center text-white/80">
                <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-sm">AI-Powered</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intelligence Modules Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Intelligence Modules
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive tools and insights for Houston real estate professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayModules.map((module, index) => (
              <motion.div
                key={module.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={module.href}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  {/* Content */}
                  <div className="relative p-6">
                    {/* Badge */}
                    {module.badge && (
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${module.color} text-white`}>
                          {module.badge}
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <module.icon className="h-7 w-7" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {module.description}
                    </p>

                    {/* Stats */}
                    {module.stats && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Activity className="h-4 w-4 mr-1" />
                        {module.stats}
                      </div>
                    )}

                    {/* Arrow */}
                    <div className="absolute bottom-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                      <ArrowRight className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fernando-X CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                y: '-100%',
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

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
              Meet Fernando-X
            </h2>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Your AI-powered Houston development expert. Available 24/7 to answer questions, 
              analyze opportunities, and provide market insights.
            </p>

            <Link
              href="/assistant"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Start Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <div className="mt-8 flex justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Houston Neighborhoods</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm">Always Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm">Accuracy Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}