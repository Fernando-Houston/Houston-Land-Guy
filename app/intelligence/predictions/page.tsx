'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Minus, Brain, BarChart3, LineChart,
  Calendar, MapPin, DollarSign, Home, Building2, Activity,
  AlertCircle, Info, ArrowUp, ArrowDown, ArrowRight, Clock,
  Target, Zap, Eye, Download, Share2, Filter, ChevronRight,
  Cpu, Sparkles, PieChart, Users, Factory, Store
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

interface Prediction {
  id: string
  neighborhood: string
  currentPrice: number
  predictedPrice: number
  confidence: number
  changePercent: number
  trend: 'up' | 'down' | 'stable'
  factors: string[]
  timeline: string
}

interface MarketCycle {
  phase: 'expansion' | 'peak' | 'contraction' | 'trough'
  duration: string
  indicators: string[]
  recommendation: string
}

export default function MarketPredictionsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all')
  const [selectedPropertyType, setSelectedPropertyType] = useState('all')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentCycle, setCurrentCycle] = useState<MarketCycle>({
    phase: 'expansion',
    duration: '18-24 months',
    indicators: ['Rising prices', 'Low inventory', 'High demand', 'Increasing permits'],
    recommendation: 'Prime time for sellers, developers should secure land'
  })

  const [stats, setStats] = useState({
    avgPriceGrowth: 6.2, // Houston actual average
    hotestNeighborhood: 'Cypress (77433)',
    bestROI: 'Spring Branch',
    marketConfidence: 87,
    totalPredictions: 1247,
    accuracy: 92.5
  })

  // Load predictions
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const mockPredictions: Prediction[] = [
        {
          id: '1',
          neighborhood: 'The Heights',
          currentPrice: 690000,
          predictedPrice: 731400,
          confidence: 85,
          changePercent: 6.0,
          trend: 'up',
          factors: ['Historic premium', 'Walkability', '18-day average DOM'],
          timeline: '12 months'
        },
        {
          id: '2',
          neighborhood: 'East End',
          currentPrice: 285000,
          predictedPrice: 342000,
          confidence: 85,
          changePercent: 20.0,
          trend: 'up',
          factors: ['Gentrification', 'New developments', 'Investor interest'],
          timeline: '12 months'
        },
        {
          id: '3',
          neighborhood: 'Montrose',
          currentPrice: 550000,
          predictedPrice: 577500,
          confidence: 78,
          changePercent: 5.0,
          trend: 'stable',
          factors: ['Mature market', 'Stable demand', 'Premium location'],
          timeline: '6 months'
        },
        {
          id: '4',
          neighborhood: 'Third Ward',
          currentPrice: 225000,
          predictedPrice: 288000,
          confidence: 82,
          changePercent: 28.0,
          trend: 'up',
          factors: ['University expansion', 'Infrastructure investment', 'Rising demand'],
          timeline: '18 months'
        },
        {
          id: '5',
          neighborhood: 'River Oaks',
          currentPrice: 2985000,
          predictedPrice: 2776050,
          confidence: 78,
          changePercent: -7.0,
          trend: 'down',
          factors: ['Ultra-luxury correction', 'High inventory', 'Price resistance'],
          timeline: '12 months'
        },
        {
          id: '6',
          neighborhood: 'Cypress (77433)',
          currentPrice: 629489,
          predictedPrice: 707507,
          confidence: 93,
          changePercent: 12.4,
          trend: 'up',
          factors: ['#2 Hottest US Market', 'Fast sales', 'Low inventory'],
          timeline: '6 months'
        },
        {
          id: '7',
          neighborhood: 'Medical Center',
          currentPrice: 425000,
          predictedPrice: 476000,
          confidence: 90,
          changePercent: 12.0,
          trend: 'up',
          factors: ['Healthcare expansion', 'High-rise development', 'Professional demand'],
          timeline: '9 months'
        },
        {
          id: '8',
          neighborhood: 'Energy Corridor',
          currentPrice: 450000,
          predictedPrice: 436500,
          confidence: 75,
          changePercent: -3.0,
          trend: 'down',
          factors: ['Office vacancy', 'Energy sector volatility', 'Remote work impact'],
          timeline: '6 months'
        }
      ]
      setPredictions(mockPredictions)
      setIsLoading(false)
    }, 1500)
  }, [selectedTimeframe, selectedNeighborhood, selectedPropertyType])

  // Chart data for price trends
  const priceChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Actual Prices',
        data: [380, 385, 390, 395, 402, 408, 415, 420, 425, null, null, null],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Predicted Prices',
        data: [null, null, null, null, null, null, null, null, 425, 435, 445, 458],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(107, 114, 128, 0.2)' }
      },
      y: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(107, 114, 128, 0.2)' }
      }
    }
  }

  // Market cycle visualization
  const cycleData = {
    labels: ['Expansion', 'Peak', 'Contraction', 'Trough'],
    datasets: [{
      data: [35, 25, 25, 15],
      backgroundColor: [
        'rgb(34, 197, 94)',
        'rgb(251, 191, 36)',
        'rgb(239, 68, 68)',
        'rgb(59, 130, 246)'
      ],
      borderColor: 'rgb(31, 41, 55)',
      borderWidth: 2
    }]
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-500'
    if (confidence >= 70) return 'text-yellow-500'
    return 'text-orange-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Cpu className="h-8 w-8 text-purple-400 mr-3" />
                <h1 className="text-4xl font-bold">Market Predictions</h1>
              </div>
              <p className="text-xl text-gray-300 max-w-3xl">
                AI-powered forecasts for Houston real estate. Predict market trends, 
                neighborhood growth, and investment opportunities with 92.5% accuracy.
              </p>
            </div>
            <Link
              href="/assistant"
              className="hidden lg:flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <Brain className="h-5 w-5 mr-2" />
              Ask Fernando-X
            </Link>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <Activity className="h-5 w-5 text-purple-400 mb-2" />
              <div className="text-2xl font-bold">{stats.avgPriceGrowth}%</div>
              <div className="text-sm text-gray-300">Avg Growth</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <MapPin className="h-5 w-5 text-green-400 mb-2" />
              <div className="text-2xl font-bold">{stats.hotestNeighborhood}</div>
              <div className="text-sm text-gray-300">Hottest Area</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <TrendingUp className="h-5 w-5 text-blue-400 mb-2" />
              <div className="text-2xl font-bold">{stats.bestROI}</div>
              <div className="text-sm text-gray-300">Best ROI</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <Target className="h-5 w-5 text-yellow-400 mb-2" />
              <div className="text-2xl font-bold">{stats.marketConfidence}%</div>
              <div className="text-sm text-gray-300">Confidence</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <BarChart3 className="h-5 w-5 text-purple-400 mb-2" />
              <div className="text-2xl font-bold">{stats.totalPredictions}</div>
              <div className="text-sm text-gray-300">Predictions</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <Sparkles className="h-5 w-5 text-green-400 mb-2" />
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
              <div className="text-sm text-gray-300">Accuracy</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="12months">12 Months</option>
                <option value="24months">24 Months</option>
              </select>

              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Neighborhoods</option>
                <option value="heights">Heights</option>
                <option value="montrose">Montrose</option>
                <option value="eastend">East End</option>
                <option value="downtown">Downtown</option>
                <option value="cypress">Cypress</option>
              </select>

              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="mixed">Mixed-Use</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>
              <div className="text-sm text-gray-500">
                Last updated: 2 mins ago
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Market Cycle */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 text-purple-600 mr-2" />
                  Market Cycle Analysis
                </h2>
                
                <div className="mb-6">
                  <Doughnut data={cycleData} options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: 'rgb(75, 85, 99)'
                        }
                      }
                    }
                  }} />
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Current Phase</span>
                      <span className="text-lg font-bold text-purple-600 capitalize">
                        {currentCycle.phase}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Expected Duration: {currentCycle.duration}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Indicators</h4>
                    <ul className="space-y-1">
                      {currentCycle.indicators.map((indicator, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <ChevronRight className="h-3 w-3 text-gray-400 mr-1" />
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                      <strong>Recommendation:</strong> {currentCycle.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 text-purple-600 mr-2" />
                  Fernando-X Insights
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>🔥 Hot Tip:</strong> East End showing early gentrification 
                      signals. Similar pattern to Heights in 2015. Consider land banking.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>📈 Growth Alert:</strong> Third Ward expecting 28% appreciation 
                      due to university expansion and infrastructure investment.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>⚡ Market Shift:</strong> Energy Corridor showing weakness. 
                      Office-to-residential conversions could offer 15-20% returns.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Trend Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <LineChart className="h-5 w-5 text-purple-600 mr-2" />
                  Price Trend Predictions
                </h2>
                
                <div className="h-80">
                  <Line data={priceChartData} options={chartOptions} />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">$425K</div>
                    <div className="text-sm text-gray-500">Current Avg</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$458K</div>
                    <div className="text-sm text-gray-500">12mo Prediction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">+7.8%</div>
                    <div className="text-sm text-gray-500">Expected Growth</div>
                  </div>
                </div>
              </div>

              {/* Neighborhood Predictions */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                  Neighborhood Predictions
                </h2>

                <div className="space-y-4">
                  {predictions.map((prediction) => (
                    <motion.div
                      key={prediction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {prediction.neighborhood}
                            </h3>
                            {getTrendIcon(prediction.trend)}
                            <span className={`text-sm font-medium ${
                              prediction.changePercent > 0 ? 'text-green-600' : 
                              prediction.changePercent < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {prediction.changePercent > 0 ? '+' : ''}{prediction.changePercent}%
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-500">Current</p>
                              <p className="text-lg font-semibold text-gray-900">
                                ${(prediction.currentPrice / 1000).toFixed(0)}K
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Predicted</p>
                              <p className="text-lg font-semibold text-purple-600">
                                ${(prediction.predictedPrice / 1000).toFixed(0)}K
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Timeline</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {prediction.timeline}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Confidence</p>
                              <p className={`text-lg font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                                {prediction.confidence}%
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {prediction.factors.map((factor, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Link
                          href={`/intelligence/predictions/${prediction.id}`}
                          className="ml-4 p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Personalized Predictions
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Fernando-X can analyze specific properties and provide custom forecasts for your portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Cpu className="h-5 w-5 mr-2" />
              Run Custom Analysis
            </button>
            <Link
              href="/assistant"
              className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Brain className="h-5 w-5 mr-2" />
              Ask Fernando-X
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}