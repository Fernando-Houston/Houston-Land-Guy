'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Activity, TrendingUp, Building2, Home, Users, DollarSign, Brain, BarChart3, Map, FileText, Calculator } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const router = useRouter()

  // Auto-redirect option - uncomment if you prefer to redirect immediately
  // useEffect(() => {
  //   router.replace('/intelligence')
  // }, [router])

  const dashboardOptions = [
    {
      title: 'Live Intelligence Dashboard',
      description: 'Real-time market data, analytics, and AI insights',
      href: '/intelligence',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      features: ['Live market metrics', 'AI predictions', 'Investment opportunities'],
      primary: true
    },
    {
      title: 'Seller Intelligence Suite',
      description: 'Property valuation, market timing, and buyer demand tools',
      href: '/sellers',
      icon: Home,
      color: 'from-teal-500 to-teal-600',
      features: ['Property valuation', 'Market timing', 'Buyer demand heat map']
    },
    {
      title: 'Developer Tools',
      description: 'Site analysis, zoning intelligence, and ROI calculators',
      href: '/developers',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      features: ['ROI calculator', 'Zoning intelligence', 'Development pipeline']
    },
    {
      title: 'Investment Opportunities',
      description: 'AI-curated investment opportunities and portfolio analytics',
      href: '/investment-opportunities',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      features: ['Opportunity finder', 'Portfolio analytics', 'Market predictions']
    },
    {
      title: 'Fernando-X AI Assistant',
      description: '24/7 AI assistant with Houston market expertise',
      href: '/assistant',
      icon: Brain,
      color: 'from-orange-500 to-orange-600',
      features: ['Natural language queries', 'Market insights', 'Personalized recommendations']
    },
    {
      title: 'Community & Social',
      description: 'Connect with Houston real estate professionals',
      href: '/social',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      features: ['Professional network', 'Market discussions', 'Deal sharing']
    }
  ]

  const quickActions = [
    {
      title: 'Get Property Valuation',
      href: '/sellers/valuation',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Calculate ROI',
      href: '/roi-calculator',
      icon: Calculator,
      color: 'bg-blue-500'
    },
    {
      title: 'View 3D Map',
      href: '/intelligence/map',
      icon: Map,
      color: 'bg-purple-500'
    },
    {
      title: 'Schedule Consultation',
      href: '/consultation',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 min-h-[40vh]">
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

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full mb-6"
            >
              <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Houston Intelligence Hub</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Your Houston
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                Command Center
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 lg:text-2xl font-light"
            >
              Access all your Houston real estate intelligence tools from one central dashboard.
              <span className="block mt-2 text-lg">Choose your path to success.</span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{action.title}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dashboard Options */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Dashboard</h2>
            <p className="mt-4 text-lg text-gray-600">
              Select the tool suite that matches your role and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dashboardOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${option.primary ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <Link
                  href={option.href}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full block"
                >
                  {option.primary && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} text-white group-hover:scale-110 transition-transform`}>
                        <option.icon className="h-7 w-7" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {option.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {option.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-blue-600 font-medium">
                      Access Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Placeholder */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Dashboard</h2>
              <div className="flex items-center text-sm text-blue-600">
                <Activity className="h-4 w-4 mr-1" />
                Live Data
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Your personalized Houston real estate intelligence center. Access AI-powered tools, 
              real-time market data, and expert insights all in one place.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">2,952</div>
                <div className="text-sm text-gray-600">Database Records</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-1">580</div>
                <div className="text-sm text-gray-600">Active Buyers</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">AI Assistant</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                href="/intelligence"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Activity className="h-5 w-5 mr-2" />
                Go to Live Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={() => {
                  const event = new CustomEvent('open-fernando-chat')
                  window.dispatchEvent(event)
                }}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Brain className="h-5 w-5 mr-2" />
                Chat with Fernando-X
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}