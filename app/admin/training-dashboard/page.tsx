'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, TrendingUp, Users, MessageSquare, Target, 
  AlertCircle, CheckCircle, BarChart3, Database,
  Download, RefreshCw, Settings, Eye
} from 'lucide-react'

interface TrainingStats {
  totalExamples: number
  avgConfidence: number
  intentDistribution: Record<string, number>
  recentFeedback: { positive: number; negative: number }
  recommendations: string[]
}

interface TrainingExample {
  id: string
  query: string
  intent: string
  response: string
  confidence: number
  feedback?: string
  timestamp: Date
  isSynthetic: boolean
}

export default function TrainingDashboard() {
  const [stats, setStats] = useState<TrainingStats | null>(null)
  const [examples, setExamples] = useState<TrainingExample[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    loadTrainingData()
  }, [])

  const loadTrainingData = async () => {
    setIsLoading(true)
    try {
      // In production, these would be API calls
      const mockStats: TrainingStats = {
        totalExamples: 1247,
        avgConfidence: 0.87,
        intentDistribution: {
          'property_search': 234,
          'roi_calculation': 189,
          'permitting_inquiry': 156,
          'cost_inquiry': 143,
          'financing_inquiry': 132,
          'contractor_inquiry': 98,
          'neighborhood_inquiry': 156,
          'zoning_inquiry': 87,
          'market_analysis': 76,
          'general_inquiry': 176
        },
        recentFeedback: { positive: 892, negative: 78 },
        recommendations: [
          'Add more training examples for zoning_inquiry intent',
          'Improve confidence scores for financing_inquiry responses',
          'Review negative feedback for property_search queries'
        ]
      }

      const mockExamples: TrainingExample[] = [
        {
          id: '1',
          query: 'Find me 5 acres in Heights under $2M',
          intent: 'property_search',
          response: 'The Heights offers excellent opportunities for development...',
          confidence: 0.94,
          feedback: 'positive',
          timestamp: new Date(),
          isSynthetic: false
        },
        {
          id: '2',
          query: 'What ROI can I expect from apartments in Midtown?',
          intent: 'roi_calculation',
          response: 'Midtown apartment development typically delivers 22-26% ROI...',
          confidence: 0.91,
          timestamp: new Date(),
          isSynthetic: false
        },
        {
          id: '3',
          query: 'How long do permits take for mixed-use development?',
          intent: 'permitting_inquiry',
          response: 'Mixed-use permits in Houston typically take 6-8 months...',
          confidence: 0.88,
          feedback: 'positive',
          timestamp: new Date(),
          isSynthetic: true
        }
      ]

      setStats(mockStats)
      setExamples(mockExamples)
    } catch (error) {
      console.error('Error loading training data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateReport = async () => {
    // In production, call continuous learning system
    console.log('Generating performance report...')
  }

  const exportTrainingData = () => {
    // In production, export actual training data
    const data = {
      stats,
      examples,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `training-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800'
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading training dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fernando-X Training Dashboard</h1>
                <p className="text-sm text-gray-600">Monitor and improve AI assistant performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadTrainingData}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={generateReport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </button>
              <button
                onClick={exportTrainingData}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Examples</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalExamples.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className={`text-2xl font-bold ${getConfidenceColor(stats?.avgConfidence || 0)}`}>
                  {((stats?.avgConfidence || 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Positive Feedback</p>
                <p className="text-2xl font-bold text-green-600">{stats?.recentFeedback.positive}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Negative Feedback</p>
                <p className="text-2xl font-bold text-red-600">{stats?.recentFeedback.negative}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Intent Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Intent Distribution</h3>
            <div className="space-y-3">
              {Object.entries(stats?.intentDistribution || {}).map(([intent, count]) => (
                <div key={intent} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-600 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {intent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-900 mr-2">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(count / (stats?.totalExamples || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {stats?.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Training Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Training Examples</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center px-3 py-1 text-sm text-purple-600 hover:text-purple-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                {showDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Query
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {examples.map((example) => (
                  <tr key={example.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {example.query}
                      </div>
                      {showDetails && (
                        <div className="mt-2 text-xs text-gray-500 max-w-md">
                          Response: {example.response.substring(0, 100)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {example.intent.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceBadge(example.confidence)}`}>
                        {(example.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {example.feedback ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          example.feedback === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {example.feedback}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No feedback</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        example.isSynthetic ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {example.isSynthetic ? 'Synthetic' : 'Real'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}