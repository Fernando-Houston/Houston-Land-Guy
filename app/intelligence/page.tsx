'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Building2, DollarSign, MapPin, Calendar,
  BarChart3, FileText, Bell, ArrowRight, Clock, Users,
  Activity, Briefcase, ChevronRight, AlertCircle, Sparkles, Brain, Zap
} from 'lucide-react'
import { getMarketIntelligence, type MarketIntelligence } from '@/lib/services/data-intelligence'
import { format } from 'date-fns'

const intelligenceModules = [
  {
    title: 'AI Development Scout',
    description: '24/7 AI assistant finding opportunities: land assembly, distressed properties, competitor tracking',
    icon: Brain,
    href: '/intelligence/scout',
    color: 'purple',
    stats: { label: 'Opportunities', value: '156' },
    available: true,
    featured: true,
    isNew: true
  },
  {
    title: '3D Development Map',
    description: 'Revolutionary 3D visualization with real-time data layers and AI insights',
    icon: MapPin,
    href: '/intelligence/map',
    color: 'indigo',
    stats: { label: 'Data Layers', value: '5' },
    available: true,
    isNew: true
  },
  {
    title: 'Zoning AI',
    description: 'Draw areas for instant AI-powered development analysis and scenarios',
    icon: Building2,
    href: '/intelligence/zoning',
    color: 'orange',
    stats: { label: 'ROI Analysis', value: 'Instant' },
    available: true,
    isNew: true
  },
  {
    title: 'Permit Tracker',
    description: 'Real-time building permits across Houston with heat maps',
    icon: Building2,
    href: '/intelligence/permits',
    color: 'blue',
    stats: { label: 'Active Permits', value: '2,847' },
    available: true
  },
  {
    title: 'Cost Database',
    description: 'Real construction costs from actual Houston projects',
    icon: DollarSign,
    href: '/intelligence/costs',
    color: 'green',
    stats: { label: 'Per SqFt', value: '$115-165' },
    available: true
  },
  {
    title: 'Opportunity Finder',
    description: 'AI-powered search for off-market deals and development sites',
    icon: Briefcase,
    href: '/opportunity-finder',
    color: 'teal',
    stats: { label: 'Active Deals', value: '156' },
    available: true
  }
]

export default function IntelligencePage() {
  const [marketInsight, setMarketInsight] = useState<MarketIntelligence | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarketInsight()
  }, [])

  const loadMarketInsight = async () => {
    try {
      const insight = await getMarketIntelligence('development trends and opportunities')
      setMarketInsight(insight)
    } catch (error) {
      console.error('Error loading market insight:', error)
    }
    setLoading(false)
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 bg-opacity-20 backdrop-blur-sm rounded-full mb-6">
              <TrendingUp className="h-4 w-4 text-indigo-300 mr-2" />
              <span className="text-sm font-medium text-indigo-200">Powered by AI + Real Data</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Houston Development Intelligence
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The most comprehensive data platform for Houston developers. 
              Real-time insights, AI analysis, and exclusive opportunities.
            </p>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">$4.8B</div>
                <div className="text-sm text-gray-300">Monthly Permits</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">2,847</div>
                <div className="text-sm text-gray-300">Active Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">88</div>
                <div className="text-sm text-gray-300">Neighborhoods</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-300">Updates</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Insight Banner */}
      {marketInsight && (
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-white mr-3 animate-pulse" />
                <div>
                  <p className="text-white font-medium">Today's Market Insight</p>
                  <p className="text-indigo-100 text-sm">{marketInsight.summary}</p>
                </div>
              </div>
              <Clock className="h-5 w-5 text-indigo-200" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Intelligence Modules Grid */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intelligenceModules.map((module, index) => {
              const Icon = module.icon
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600 border-blue-200',
                green: 'bg-green-100 text-green-600 border-green-200',
                purple: 'bg-purple-100 text-purple-600 border-purple-200',
                orange: 'bg-orange-100 text-orange-600 border-orange-200',
                indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
                teal: 'bg-teal-100 text-teal-600 border-teal-200'
              }
              
              return (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={module.featured ? 'lg:col-span-2' : ''}
                >
                  <Link href={module.href}>
                    <div className={`relative bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all cursor-pointer h-full ${
                      module.featured 
                        ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      {module.isNew && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          NEW
                        </div>
                      )}
                      {module.featured && (
                        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          FEATURED
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${colorClasses[module.color as keyof typeof colorClasses]}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {module.available && (
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{module.stats.value}</div>
                            <div className="text-xs text-gray-500">{module.stats.label}</div>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                      
                      <div className="flex items-center text-sm font-medium">
                        {module.available ? (
                          <>
                            <span className={`${module.color === 'blue' ? 'text-blue-600' : 
                              module.color === 'green' ? 'text-green-600' :
                              module.color === 'purple' ? 'text-purple-600' :
                              module.color === 'orange' ? 'text-orange-600' :
                              module.color === 'indigo' ? 'text-indigo-600' :
                              'text-teal-600'}`}>
                              Access Now
                            </span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <span className="text-gray-400">Coming Soon</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Intelligence Updates */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Latest Intelligence Updates
              </h2>
              <p className="text-lg text-gray-600">
                Real-time updates from our data sources and AI analysis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Permit Activity */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Permit Activity</h3>
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-blue-100">
                    <span className="text-sm text-gray-700">New Commercial Permits</span>
                    <span className="font-semibold text-gray-900">47</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-blue-100">
                    <span className="text-sm text-gray-700">Residential Permits</span>
                    <span className="font-semibold text-gray-900">182</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">Total Value</span>
                    <span className="font-semibold text-green-600">$127.4M</span>
                  </div>
                </div>
                <Link href="/intelligence/permits" className="inline-flex items-center text-blue-600 font-medium mt-4 hover:text-blue-700">
                  View All Permits
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {/* Market Trends */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Market Trends</h3>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-green-100">
                    <span className="text-sm text-gray-700">Avg Construction Cost/SqFt</span>
                    <span className="font-semibold text-gray-900">$142</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-green-100">
                    <span className="text-sm text-gray-700">YoY Permit Growth</span>
                    <span className="font-semibold text-green-600">+18%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">Hot Neighborhood</span>
                    <span className="font-semibold text-gray-900">Cypress</span>
                  </div>
                </div>
                <Link href="/intelligence/map" className="inline-flex items-center text-green-600 font-medium mt-4 hover:text-green-700">
                  View 3D Map
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* AI Insights */}
            {marketInsight && marketInsight.keyInsights.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
                </div>
                <ul className="space-y-2">
                  {marketInsight.keyInsights.slice(0, 3).map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span className="text-sm text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <Bell className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Never Miss an Opportunity
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Set up custom alerts for permits, market changes, and new opportunities 
              matching your investment criteria.
            </p>
            <Link
              href="/consultation"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Set Up Intelligence Alerts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}