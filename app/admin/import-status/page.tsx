'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, RefreshCw, CheckCircle, AlertCircle, 
  Clock, TrendingUp, Users, Building2, Home, 
  FileText, DollarSign, MapPin, BarChart3
} from 'lucide-react'

interface DatabaseStats {
  developers: number
  projects: number
  properties: number
  neighborhoods: number
  marketMetrics: number
  constructionCosts: number
  permits: number
  harReports: number
  harNeighborhoods: number
  marketIntelligence: number
  total: number
}

export default function ImportStatusPage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/database-counts')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100))
  }

  const getStatusIcon = (current: number, target: number) => {
    const progress = getProgress(current, target)
    if (progress >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (progress >= 50) return <Clock className="h-5 w-5 text-yellow-600" />
    return <AlertCircle className="h-5 w-5 text-red-600" />
  }

  const dataTargets = [
    { key: 'neighborhoods', label: 'Neighborhoods', target: 100, icon: Home, critical: true },
    { key: 'marketMetrics', label: 'Market Metrics', target: 24, icon: TrendingUp, critical: true },
    { key: 'permits', label: 'Permits', target: 1000, icon: FileText, critical: true },
    { key: 'constructionCosts', label: 'Construction Costs', target: 100, icon: DollarSign, critical: true },
    { key: 'developers', label: 'Developers', target: 50, icon: Users },
    { key: 'projects', label: 'Projects', target: 100, icon: Building2 },
    { key: 'properties', label: 'Properties', target: 1000, icon: Home },
  ]

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading database statistics...</p>
        </div>
      </div>
    )
  }

  const overallProgress = stats ? Math.round((stats.total / 5000) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Import Status Monitor</h1>
                <p className="text-sm text-gray-600">Terminal 2 & 3 Data Import Progress</p>
              </div>
            </div>
            <button
              onClick={fetchStats}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <span className="text-green-600">Auto-refresh every 30 seconds</span>
          </div>
        </div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress to 5,000 Records</h2>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{stats?.total || 0} records</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-600 to-purple-700 h-4 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Target: 5,000 records for full platform functionality
          </p>
        </motion.div>

        {/* Critical Data Gaps */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Critical Data Gaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataTargets
              .filter(item => item.critical && stats && stats[item.key as keyof DatabaseStats] < item.target * 0.5)
              .map(item => (
                <div key={item.key} className="flex items-center justify-between bg-white rounded-lg p-4">
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">
                        {stats?.[item.key as keyof DatabaseStats] || 0} / {item.target}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {getProgress(stats?.[item.key as keyof DatabaseStats] || 0, item.target)}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Data Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataTargets.map((item, index) => {
            const current = stats?.[item.key as keyof DatabaseStats] || 0
            const progress = getProgress(current, item.target)
            
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <item.icon className="h-6 w-6 text-gray-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
                  </div>
                  {getStatusIcon(current, item.target)}
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{current} records</span>
                    <span>Target: {item.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        progress >= 80 ? 'bg-green-600' :
                        progress >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <span className={`text-3xl font-bold ${
                    progress >= 80 ? 'text-green-600' :
                    progress >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {progress}%
                  </span>
                  <p className="text-sm text-gray-600">complete</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Terminal Instructions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Terminal 2 Tasks</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Import neighborhoods (Priority 1)</li>
              <li>• Import market metrics (Priority 2)</li>
              <li>• Import permits (Priority 3)</li>
              <li>• Run: npm run import:neighborhoods</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Terminal 3 Tasks</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Import construction costs</li>
              <li>• Import demographics</li>
              <li>• Validate data quality</li>
              <li>• Run: npm run import:construction-costs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}