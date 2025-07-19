'use client'

import Link from "next/link"
import { ArrowRight, Building2, Calculator, TrendingUp, FileSearch, DollarSign, Users, Map, Zap, BarChart3, Target, Database, Brain, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'

export default function DeveloperIntelligence() {
  const [metrics, setMetrics] = useState({
    activeProjects: 342,
    avgROI: 22.5,
    permitApprovals: 89
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeProjects: prev.activeProjects + Math.floor(Math.random() * 3),
        avgROI: +(prev.avgROI + (Math.random() * 0.2 - 0.1)).toFixed(1),
        permitApprovals: prev.permitApprovals + (Math.random() > 0.5 ? 1 : 0)
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const tools = [
    {
      title: "ROI Calculator",
      description: "Advanced financial modeling with Houston-specific metrics. Calculate returns with precision.",
      icon: Calculator,
      href: "/roi-calculator",
      color: "from-green-600 to-emerald-600",
      features: ["Cash flow analysis", "Tax calculations", "Market comparables", "Risk assessment"],
      stats: "15+ financial metrics"
    },
    {
      title: "AI Development Scout",
      description: "24/7 AI agent finding opportunities: land assemblies, distressed properties, and emerging areas.",
      icon: Target,
      href: "/intelligence/scout",
      color: "from-blue-600 to-cyan-600",
      features: ["Automated discovery", "Price drop alerts", "Off-market deals", "Opportunity scoring"],
      stats: "247+ active opportunities"
    },
    {
      title: "Zoning Intelligence",
      description: "Draw any area for instant AI analysis. Get development scenarios and ROI projections.",
      icon: Map,
      href: "/intelligence/zoning",
      color: "from-purple-600 to-indigo-600",
      features: ["Interactive mapping", "Zoning overlays", "Use recommendations", "Density analysis"],
      stats: "Instant AI analysis"
    },
    {
      title: "Permit Tracker",
      description: "Live Houston permit data with hot zone identification and competitor tracking.",
      icon: FileSearch,
      href: "/intelligence/permits",
      color: "from-orange-600 to-red-600",
      features: ["Real-time updates", "Heat mapping", "Trend analysis", "Approval rates"],
      stats: "Updated daily"
    },
    {
      title: "Cost Intelligence",
      description: "Real construction costs from actual Houston projects. AI-powered estimates by trade.",
      icon: DollarSign,
      href: "/intelligence/costs",
      color: "from-teal-600 to-cyan-600",
      features: ["Trade breakdowns", "Material tracking", "Labor costs", "Inflation adjustments"],
      stats: "$483M+ analyzed"
    },
    {
      title: "Development Timeline",
      description: "AI-optimized project scheduling with permit predictions and critical path analysis.",
      icon: Clock,
      href: "/houston-development-timeline",
      color: "from-indigo-600 to-purple-600",
      features: ["Gantt charts", "Milestone tracking", "Resource planning", "Delay predictions"],
      stats: "60-second generation"
    }
  ]

  const insights = [
    {
      icon: TrendingUp,
      title: "Market Trends",
      value: `+${metrics.avgROI}%`,
      label: "Avg Developer ROI",
      trend: "up"
    },
    {
      icon: Building2,
      title: "Active Projects",
      value: metrics.activeProjects,
      label: "In Houston Metro",
      trend: "up"
    },
    {
      icon: Zap,
      title: "Permit Success",
      value: `${metrics.permitApprovals}%`,
      label: "Approval Rate",
      trend: "stable"
    },
    {
      icon: Database,
      title: "Data Points",
      value: "1.2M+",
      label: "Analyzed Daily",
      trend: "up"
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 min-h-[60vh]">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, blue 0%, transparent 50%), radial-gradient(circle at 80% 80%, cyan 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Building2 className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Developer Intelligence Platform</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Developer
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                Intelligence Suite
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 lg:text-2xl font-light"
            >
              AI-powered tools and real-time analytics designed specifically for Houston developers.
              <span className="block mt-2">Make smarter decisions, faster.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0"
            >
              <Link
                href="/assistant"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-xl"
              >
                <Brain className="mr-2 h-5 w-5" />
                Ask Fernando-X
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/roi-calculator"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
              >
                <Calculator className="mr-2 h-5 w-5" />
                ROI Calculator
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
                  <insight.icon className="h-5 w-5 text-blue-400" />
                  <span className={`text-xs font-medium ${
                    insight.trend === 'up' ? 'text-green-400' : 
                    insight.trend === 'down' ? 'text-red-400' : 'text-gray-400'
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

      {/* Developer Tools Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Intelligence Tools for Developers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Purpose-built for Houston's unique market dynamics
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

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {tool.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {tool.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-blue-600 font-medium">
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
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
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
              Powered by Fernando-X AI
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Get instant answers about development feasibility, costs, timelines, and ROI. 
              Fernando-X is trained specifically on Houston market data.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Ask Fernando-X anything about:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start">
                  <BarChart3 className="h-5 w-5 text-blue-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Development costs by neighborhood</span>
                </div>
                <div className="flex items-start">
                  <Map className="h-5 w-5 text-blue-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Best areas for your project type</span>
                </div>
                <div className="flex items-start">
                  <FileSearch className="h-5 w-5 text-blue-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Permit requirements and timelines</span>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-blue-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Recommended contractors and vendors</span>
                </div>
              </div>
            </div>

            <Link
              href="/assistant"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-blue-900 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Start Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Accelerate Your Development Success?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join Houston's most successful developers using our intelligence platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Get Free Consultation
            </Link>
            <Link
              href="/roi-calculator"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Try ROI Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}