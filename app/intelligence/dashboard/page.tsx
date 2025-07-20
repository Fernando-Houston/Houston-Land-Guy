'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Brain, TrendingUp, Building2, MapPin, DollarSign,
  BarChart3, Activity, Target, Zap, ArrowRight,
  Home, Clock, Users, Globe, ChevronRight
} from 'lucide-react'
import LiveMarketDashboard from '@/components/intelligence/LiveMarketDashboard'

export default function IntelligenceDashboardPage() {
  const [activeTab, setActiveTab] = useState('market')

  const quickActions = [
    {
      title: 'Ask Fernando-X',
      description: 'Get instant AI insights',
      icon: Brain,
      href: '/assistant',
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Find Opportunities',
      description: 'Discover new deals',
      icon: Target,
      href: '/intelligence/scout',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      title: 'View 3D Map',
      description: 'Explore properties',
      icon: MapPin,
      href: '/intelligence/map',
      color: 'from-green-600 to-emerald-600'
    },
    {
      title: 'ROI Calculator',
      description: 'Analyze returns',
      icon: DollarSign,
      href: '/roi-calculator',
      color: 'from-orange-600 to-amber-600'
    }
  ]

  const stats = [
    { label: 'Major Projects', value: '$13.8B', change: '8 Active', icon: Building2 },
    { label: 'Hottest ZIP', value: '77433', change: 'Cypress', icon: MapPin },
    { label: 'Top Developer', value: 'D.R. Horton', change: '326 permits', icon: Users },
    { label: 'Best ROI', value: '18.3%', change: 'Spring Branch', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Houston Intelligence Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real-time market analytics powered by AI and comprehensive data analysis
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-purple-400" />
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <div className="relative p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                  <ChevronRight className="absolute bottom-4 right-4 h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('market')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'market'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Market Overview
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'trends'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trends Analysis
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'opportunities'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'market' && <LiveMarketDashboard />}
        
        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Market Trends Analysis
              </h2>
              <p className="text-gray-600">
                Detailed trend analysis coming soon...
              </p>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'opportunities' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Investment Opportunities
              </h2>
              <p className="text-gray-600">
                Curated opportunities coming soon...
              </p>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Market Reports
              </h2>
              <p className="text-gray-600">
                Downloadable reports coming soon...
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* AI Assistant CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-white text-center"
        >
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-3">
            Need Help Understanding the Data?
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Fernando-X AI can analyze any aspect of this dashboard and provide personalized insights for your specific needs
          </p>
          <Link
            href="/assistant"
            className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
          >
            Ask Fernando-X
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}