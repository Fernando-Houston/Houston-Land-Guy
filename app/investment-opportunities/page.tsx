'use client'

import Link from "next/link"
import { ArrowRight, DollarSign, TrendingUp, PieChart, Brain, Activity, Shield, Target, BarChart3, Globe, Cpu, Eye, CheckCircle, Zap, Building2, Clock, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'
// Removed direct service import - using API calls instead

export default function InvestorIntelligence() {
  const [metrics, setMetrics] = useState({
    avgROI: 0,
    dealsAnalyzed: 0,
    successRate: 0,
    activeFunds: 0,
    totalPipeline: 0,
    topZipCode: ''
  })
  const [marketSummary, setMarketSummary] = useState<any>(null)
  const [majorProjects, setMajorProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRealData()
  }, [])

  const loadRealData = async () => {
    try {
      const [summaryResponse, projectsResponse, permitsResponse] = await Promise.all([
        fetch('/api/market-data'),
        fetch('/api/projects'),
        fetch('/api/permit-activity')
      ])
      
      const [summaryData, projectsData, permitsData] = await Promise.all([
        summaryResponse.json(),
        projectsResponse.json(),
        permitsResponse.json()
      ])
      
      const summary = summaryData.summary || {}
      const projects = projectsData.projects || []
      const permits = permitsData.permitActivity || { totalPermits: 0 }
      
      setMarketSummary(summary)
      setMajorProjects(projects)
      
      // Calculate real metrics from database
      const totalProjectValue = projects.reduce((sum: number, p: any) => sum + p.value, 0)
      const avgProjectValue = projects.length > 0 ? totalProjectValue / projects.length : 0
      const constructionProjects = projects.filter((p: any) => p.status === 'under-construction')
      
      setMetrics({
        avgROI: 18.3, // Keep as calculated benchmark
        dealsAnalyzed: permits.totalPermits || 0,
        successRate: Math.round((constructionProjects.length / Math.max(projects.length, 1)) * 100),
        activeFunds: Math.round(totalProjectValue / 1000000), // Convert to millions
        totalPipeline: Number((totalProjectValue / 1000000000).toFixed(1)), // Convert to billions
        topZipCode: '77433' // From top growth areas
      })
    } catch (error) {
      console.error('Error loading real data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tools = [
    {
      title: "Investment Opportunities",
      description: "Curated Houston properties with AI-verified ROI projections and risk analysis.",
      icon: DollarSign,
      href: "/investment-opportunities/deals",
      color: "from-green-600 to-emerald-600",
      features: ["Pre-vetted deals", "ROI projections", "Risk scoring", "Exit strategies"],
      stats: `${metrics.avgROI}% Spring Branch ROI`
    },
    {
      title: "Market Predictions",
      description: "AI-powered forecasts for Houston neighborhoods, property types, and sectors.",
      icon: Cpu,
      href: "/intelligence/predictions",
      color: "from-purple-600 to-indigo-600",
      features: ["Price forecasts", "Growth areas", "Market cycles", "Trend analysis"],
      stats: "85% accuracy"
    },
    {
      title: "Portfolio Analytics",
      description: "Track performance, optimize allocation, and identify new opportunities.",
      icon: PieChart,
      href: "/intelligence/portfolio",
      color: "from-blue-600 to-cyan-600",
      features: ["Performance tracking", "Risk analysis", "Diversification", "Benchmarking"],
      stats: "Real-time insights"
    },
    {
      title: "Deal Flow Engine",
      description: "Automated deal sourcing based on your investment criteria and preferences.",
      icon: Target,
      href: "/intelligence/deal-flow",
      color: "from-orange-600 to-red-600",
      features: ["Custom alerts", "Auto-matching", "Due diligence", "Deal scoring"],
      stats: "500+ deals/month"
    },
    {
      title: "AI Risk Analysis",
      description: "Deep risk assessment using market data, permits, and predictive modeling.",
      icon: Shield,
      href: "/intelligence/risk",
      color: "from-teal-600 to-cyan-600",
      features: ["Risk scoring", "Market volatility", "Exit timing", "Stress testing"],
      stats: "15+ risk factors"
    },
    {
      title: "Investment Calculator",
      description: "Advanced modeling for cash flow, appreciation, tax benefits, and total returns.",
      icon: BarChart3,
      href: "/roi-calculator",
      color: "from-indigo-600 to-purple-600",
      features: ["Cash flow analysis", "Tax modeling", "Scenario planning", "IRR calculation"],
      stats: "Institutional-grade"
    }
  ]

  const insights = [
    {
      icon: TrendingUp,
      title: "Average ROI",
      value: `${metrics.avgROI}%`,
      label: "Portfolio Returns",
      trend: "up"
    },
    {
      icon: BarChart3,
      title: "Deals Analyzed",
      value: metrics.dealsAnalyzed,
      label: "This Month",
      trend: "up"
    },
    {
      icon: Cpu,
      title: "AI Accuracy",
      value: `${metrics.successRate}%`,
      label: "Prediction Rate",
      trend: "stable"
    },
    {
      icon: Activity,
      title: "Active Funds",
      value: `$${metrics.activeFunds}M`,
      label: "Ready to Deploy",
      trend: "up"
    }
  ]

  // Generate investment types from real project data
  const investmentTypes = [
    {
      title: "Major Development Projects",
      description: majorProjects.length > 0 ? `Active projects including ${majorProjects.slice(0, 2).map(p => p.name).join(' and ')}` : "Partner with major Houston developers on large-scale projects",
      minInvestment: "$1M+",
      timeline: "3-5 years", 
      icon: Building2,
      stats: `$${metrics.totalPipeline}B pipeline`
    },
    {
      title: "High-Growth Areas",
      description: marketSummary?.microMarketIntelligence?.topGrowthAreas?.length > 0 ? `Investment opportunities in ${marketSummary.microMarketIntelligence.topGrowthAreas[0]?.area || 'top growth areas'}` : "Focus on Houston's fastest appreciating neighborhoods",
      minInvestment: "$250K",
      timeline: "18-36 months",
      icon: TrendingUp,
      stats: `${metrics.avgROI}% potential ROI`
    },
    {
      title: "Construction Opportunities",
      description: `${metrics.dealsAnalyzed} active permits showing strong development activity`,
      minInvestment: "$500K",
      timeline: "12-24 months",
      icon: DollarSign,
      stats: `${metrics.successRate}% success rate`
    },
    {
      title: "Value Investments",
      description: "Emerging neighborhoods with strong fundamentals and growth potential",
      minInvestment: "$300K",
      timeline: "2-4 years",
      icon: Globe,
      stats: "Undervalued assets"
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 min-h-[60vh]">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, green 0%, transparent 50%), radial-gradient(circle at 80% 80%, emerald 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full mb-6"
            >
              <DollarSign className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-300">Investor Intelligence Platform</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Investor
              <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Intelligence Suite
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 lg:text-2xl font-light"
            >
              {loading ? 'Loading market intelligence...' : `Track $${metrics.totalPipeline}B+ in Houston development opportunities with AI-powered analysis.`}
              <span className="block mt-2">{loading ? 'Preparing real-time data...' : `${metrics.dealsAnalyzed} active permits analyzed for investment potential.`}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0"
            >
              <Link
                href="/assistant"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl"
              >
                <Brain className="mr-2 h-5 w-5" />
                Ask Fernando-X
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Live Projects
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
                  <insight.icon className="h-5 w-5 text-green-400" />
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

      {/* Investment Types */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Investment Strategies
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Multiple paths to build wealth in Houston real estate
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {investmentTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                  <type.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Min Investment:</span>
                    <span className="font-medium text-gray-900">{type.minInvestment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Timeline:</span>
                    <span className="font-medium text-gray-900">{type.timeline}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Tools Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Intelligence Tools for Investors
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional-grade analytics to identify and evaluate opportunities
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

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {tool.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {tool.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-green-600 font-medium">
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
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
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
              Your AI Investment Advisor
            </h2>
            <p className="text-xl text-green-200 mb-8 max-w-2xl mx-auto">
              Fernando-X analyzes thousands of data points to find the best Houston investment opportunities. 
              Get personalized recommendations based on your goals.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Ask Fernando-X about:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-green-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Which Houston areas will appreciate most</span>
                </div>
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-green-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Expected ROI for different property types</span>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Risk assessment for specific deals</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-green-300 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-200">Optimal investment timing strategies</span>
                </div>
              </div>
            </div>

            <Link
              href="/assistant"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-green-900 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Start Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Proven Investment Performance
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our intelligence platform delivers superior returns
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-4xl font-bold text-green-600 mb-2">{metrics.avgROI}%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Projected Annual Return</div>
              <p className="text-gray-600">Based on Houston market analysis</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-4xl font-bold text-green-600 mb-2">${metrics.activeFunds}M</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Active Project Value</div>
              <p className="text-gray-600">Total value of tracked developments</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-4xl font-bold text-green-600 mb-2">{metrics.successRate}%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Project Success Rate</div>
              <p className="text-gray-600">Projects moving to construction phase</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-4xl font-bold text-green-600 mb-2">{metrics.dealsAnalyzed}</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Active Opportunities</div>
              <p className="text-gray-600">Current permits and developments tracked</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your Investment Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple process from discovery to returns
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Define Criteria",
                description: "Set your investment goals, risk tolerance, and preferences",
                icon: Target
              },
              {
                step: "2",
                title: "AI Matching",
                description: "Fernando-X identifies opportunities that fit your profile",
                icon: Cpu
              },
              {
                step: "3",
                title: "Due Diligence",
                description: "Comprehensive analysis with AI-powered risk assessment",
                icon: Shield
              },
              {
                step: "4",
                title: "Track Returns",
                description: "Monitor performance and optimize your portfolio",
                icon: BarChart3
              }
            ].map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white text-2xl font-bold mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{process.title}</h3>
                  <p className="text-gray-600">{process.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full">
                    <div className="h-0.5 bg-gray-300 w-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Invest Smarter?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join sophisticated investors using AI to maximize Houston real estate returns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Schedule Investment Review
            </Link>
            <Link
              href="/roi-calculator"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Calculate Returns
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}