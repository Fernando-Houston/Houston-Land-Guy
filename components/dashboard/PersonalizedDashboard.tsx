'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  BarChart3, TrendingUp, MapPin, Heart, Search, Bell,
  DollarSign, Home, Building2, Activity, Eye, Plus,
  Settings, Download, Share2, Filter, Calendar,
  Target, Zap, Brain, Star, ArrowRight, Clock,
  AlertCircle, CheckCircle, Users, PieChart
} from 'lucide-react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface DashboardWidget {
  id: string
  title: string
  type: 'metric' | 'chart' | 'list' | 'map' | 'activity'
  size: 'small' | 'medium' | 'large'
  data: any
  component: React.ComponentType<any>
}

interface UserMetrics {
  portfolioValue: number
  portfolioChange: number
  watchlistCount: number
  savedSearches: number
  totalViews: number
  recentActivity: Array<{
    type: string
    description: string
    timestamp: Date
  }>
}

interface Recommendation {
  id: string
  type: 'property' | 'neighborhood' | 'market_insight' | 'opportunity'
  title: string
  description: string
  confidence: number
  data: any
  action: {
    label: string
    href: string
  }
}

export default function PersonalizedDashboard() {
  const { data: session } = useSession()
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    portfolioValue: 0,
    portfolioChange: 0,
    watchlistCount: 0,
    savedSearches: 0,
    totalViews: 0,
    recentActivity: []
  })
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      loadDashboardData()
    }
  }, [session, selectedTimeframe])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Load user metrics
      const metricsResponse = await fetch(`/api/dashboard/metrics?timeframe=${selectedTimeframe}`)
      const metrics = await metricsResponse.json()
      setUserMetrics(metrics)

      // Load personalized recommendations
      const recommendationsResponse = await fetch('/api/dashboard/recommendations')
      const recs = await recommendationsResponse.json()
      setRecommendations(recs)

      // Load dashboard widgets based on user preferences
      const widgetsResponse = await fetch('/api/dashboard/widgets')
      const widgetData = await widgetsResponse.json()
      setWidgets(widgetData)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Load mock data for demo
      loadMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockData = () => {
    setUserMetrics({
      portfolioValue: 2850000,
      portfolioChange: 12.5,
      watchlistCount: 15,
      savedSearches: 8,
      totalViews: 142,
      recentActivity: [
        { type: 'property_view', description: 'Viewed property in Heights', timestamp: new Date() },
        { type: 'search', description: 'Searched for commercial properties', timestamp: new Date() },
        { type: 'analysis', description: 'Ran ROI analysis', timestamp: new Date() }
      ]
    })

    setRecommendations([
      {
        id: '1',
        type: 'property',
        title: 'New Property Match in Heights',
        description: '3BR/2BA home matching your criteria just listed at $425K',
        confidence: 92,
        data: { propertyId: 'prop123', price: 425000 },
        action: { label: 'View Property', href: '/properties/prop123' }
      },
      {
        id: '2',
        type: 'neighborhood',
        title: 'East End Showing Strong Growth',
        description: 'Based on your investment strategy, consider exploring East End opportunities',
        confidence: 85,
        data: { neighborhood: 'East End', growth: 18.5 },
        action: { label: 'Explore Area', href: '/neighborhoods/east-end' }
      },
      {
        id: '3',
        type: 'market_insight',
        title: 'Commercial Properties Trending Up',
        description: 'Commercial real estate showing 15% growth, matching your diversification goals',
        confidence: 78,
        data: { segment: 'commercial', growth: 15.2 },
        action: { label: 'View Analysis', href: '/intelligence/predictions' }
      }
    ])
  }

  const portfolioChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [2400, 2520, 2650, 2720, 2800, 2850],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const watchlistChartData = {
    labels: ['Residential', 'Commercial', 'Land', 'Mixed-Use'],
    datasets: [{
      data: [8, 4, 2, 1],
      backgroundColor: [
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
        'rgb(249, 115, 22)',
        'rgb(168, 85, 247)'
      ]
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'rgb(107, 114, 128)' }
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(107, 114, 128, 0.1)' }
      },
      y: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(107, 114, 128, 0.1)' }
      }
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">Access your personalized dashboard and portfolio tracking</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {session.user.name}
              </h1>
              <p className="text-gray-600">
                Your personalized Houston real estate intelligence dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Link
                href="/settings/dashboard"
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(userMetrics.portfolioValue / 1000000).toFixed(2)}M
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{userMetrics.portfolioChange}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Watchlist</p>
                <p className="text-2xl font-bold text-gray-900">{userMetrics.watchlistCount}</p>
                <p className="text-sm text-gray-500">Properties tracked</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Searches</p>
                <p className="text-2xl font-bold text-gray-900">{userMetrics.savedSearches}</p>
                <p className="text-sm text-gray-500">Active alerts</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{userMetrics.totalViews}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Performance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Portfolio Performance</h2>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-gray-900">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="h-64">
                <Line data={portfolioChartData} options={chartOptions} />
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 text-purple-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Fernando-X Recommendations</h2>
                </div>
                <Link
                  href="/assistant"
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Ask Fernando-X
                </Link>
              </div>
              
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {rec.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                        <Link
                          href={rec.action.href}
                          className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          {rec.action.label}
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                      <div className="ml-4">
                        {rec.type === 'property' && <Home className="h-5 w-5 text-gray-400" />}
                        {rec.type === 'neighborhood' && <MapPin className="h-5 w-5 text-gray-400" />}
                        {rec.type === 'market_insight' && <BarChart3 className="h-5 w-5 text-gray-400" />}
                        {rec.type === 'opportunity' && <Target className="h-5 w-5 text-gray-400" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {userMetrics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Activity className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Watchlist Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Watchlist Breakdown</h3>
              <div className="h-48">
                <Doughnut 
                  data={watchlistChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: 'rgb(107, 114, 128)' }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/intelligence/scout"
                  className="flex items-center w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Target className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-blue-900 font-medium">Find New Opportunities</span>
                </Link>
                
                <Link
                  href="/intelligence/map"
                  className="flex items-center w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <MapPin className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-green-900 font-medium">Explore Market Map</span>
                </Link>
                
                <Link
                  href="/roi-calculator"
                  className="flex items-center w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-purple-900 font-medium">Calculate ROI</span>
                </Link>
                
                <Link
                  href="/assistant"
                  className="flex items-center w-full p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <Brain className="h-5 w-5 text-orange-600 mr-3" />
                  <span className="text-orange-900 font-medium">Ask Fernando-X</span>
                </Link>
              </div>
            </div>

            {/* Market Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Market Alerts</h3>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Price Drop Alert</p>
                    <p className="text-xs text-yellow-700">Property in Heights reduced by 8%</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">New Match Found</p>
                    <p className="text-xs text-green-700">3 properties match your saved search</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Market Update</p>
                    <p className="text-xs text-blue-700">Montrose showing strong appreciation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}