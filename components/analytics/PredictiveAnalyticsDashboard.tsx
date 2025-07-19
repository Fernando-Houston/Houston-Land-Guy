'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Calendar, BarChart3, LineChart, Target,
  DollarSign, Building2, AlertCircle, Zap, Clock,
  ChevronRight, Download, Share2, Brain, Activity
} from 'lucide-react'
import { predictiveAnalytics } from '@/lib/services/predictive-analytics'
import { Line, Bar, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
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
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PropertyPrediction {
  propertyId: string
  address?: string
  currentValue: number
  predictions: {
    '30days': { value: number; confidence: number; change: number }
    '90days': { value: number; confidence: number; change: number }
    '180days': { value: number; confidence: number; change: number }
    '1year': { value: number; confidence: number; change: number }
    '3years': { value: number; confidence: number; change: number }
  }
  factors: {
    name: string
    impact: 'positive' | 'negative' | 'neutral'
    weight: number
    description: string
  }[]
}

interface MarketForecast {
  area: string
  currentMetrics: {
    medianPrice: number
    inventory: number
    daysOnMarket: number
    pricePerSqft: number
  }
  forecast: {
    shortTerm: {
      priceChange: number
      demandLevel: string
      supplyLevel: string
      recommendation: string
    }
    mediumTerm: {
      priceChange: number
      marketCondition: string
      opportunities: string[]
    }
    longTerm: {
      priceChange: number
      growthPotential: string
      risks: string[]
    }
  }
  confidence: number
}

export default function PredictiveAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'property' | 'market' | 'investment'>('property')
  const [propertyPrediction, setPropertyPrediction] = useState<PropertyPrediction | null>(null)
  const [marketForecast, setMarketForecast] = useState<MarketForecast | null>(null)
  const [investmentScenarios, setInvestmentScenarios] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30days' | '90days' | '180days' | '1year' | '3years'>('1year')

  useEffect(() => {
    fetchPredictiveData()
  }, [])

  const fetchPredictiveData = async () => {
    setLoading(true)
    try {
      // Fetch property prediction
      const prediction = await predictiveAnalytics.predictPropertyValue('demo-property')
      setPropertyPrediction({
        ...prediction,
        address: '1234 Main St, Houston, TX 77001'
      })

      // Fetch market forecast
      const forecast = await predictiveAnalytics.forecastMarket('Houston', '1year')
      setMarketForecast(forecast)

      // Generate investment scenarios
      const scenarios = await predictiveAnalytics.generateInvestmentScenarios({
        budget: 1000000,
        riskTolerance: 'moderate',
        timeHorizon: '5years',
        goals: ['appreciation', 'cash flow', 'diversification']
      })
      setInvestmentScenarios(scenarios)
    } catch (error) {
      console.error('Error fetching predictive data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getValueChangeColor = (change: number) => {
    if (change > 5) return 'text-green-600'
    if (change > 0) return 'text-green-500'
    if (change === 0) return 'text-gray-600'
    if (change > -5) return 'text-orange-500'
    return 'text-red-600'
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'negative': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const renderPropertyPrediction = () => {
    if (!propertyPrediction) return null

    const timeframes = ['30days', '90days', '180days', '1year', '3years'] as const
    const prediction = propertyPrediction.predictions[selectedTimeframe]

    // Chart data
    const chartData = {
      labels: timeframes.map(tf => {
        const labels = {
          '30days': '30 Days',
          '90days': '90 Days',
          '180days': '6 Months',
          '1year': '1 Year',
          '3years': '3 Years'
        }
        return labels[tf]
      }),
      datasets: [{
        label: 'Predicted Value',
        data: timeframes.map(tf => propertyPrediction.predictions[tf].value),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed.y
              const change = ((value - propertyPrediction.currentValue) / propertyPrediction.currentValue) * 100
              return [
                `Value: $${value.toLocaleString()}`,
                `Change: ${change > 0 ? '+' : ''}${change.toFixed(1)}%`
              ]
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (value: any) => `$${(value / 1000).toFixed(0)}k`
          }
        }
      }
    }

    return (
      <div className="space-y-6">
        {/* Property Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Property Value Prediction</h3>
              <p className="text-sm text-gray-600 mt-1">{propertyPrediction.address}</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${propertyPrediction.currentValue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Predicted Value ({selectedTimeframe})</p>
              <p className="text-2xl font-bold text-purple-600">
                ${prediction.value.toLocaleString()}
              </p>
              <p className={`text-sm font-medium ${getValueChangeColor(prediction.change)} mt-1`}>
                {prediction.change > 0 ? '+' : ''}{prediction.change.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
              <div className="flex items-center mt-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {(prediction.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex space-x-2 mb-6">
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === tf
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tf === '30days' && '30 Days'}
                {tf === '90days' && '90 Days'}
                {tf === '180days' && '6 Months'}
                {tf === '1year' && '1 Year'}
                {tf === '3years' && '3 Years'}
              </button>
            ))}
          </div>

          {/* Value Prediction Chart */}
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Impact Factors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Factors</h3>
          <div className="space-y-3">
            {propertyPrediction.factors.map((factor, index) => (
              <div key={index} className="flex items-start space-x-3">
                {getImpactIcon(factor.impact)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{factor.name}</p>
                    <span className="text-sm text-gray-600">
                      {(factor.weight * 100).toFixed(0)}% weight
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Brain className="h-6 w-6 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Prediction Methodology</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {propertyPrediction.methodology.map((method, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderMarketForecast = () => {
    if (!marketForecast) return null

    const radarData = {
      labels: ['Price Growth', 'Demand', 'Supply', 'Market Health', 'Investment Score'],
      datasets: [{
        label: marketForecast.area,
        data: [
          marketForecast.forecast.longTerm.priceChange,
          marketForecast.forecast.shortTerm.demandLevel === 'very_high' ? 90 : 75,
          marketForecast.forecast.shortTerm.supplyLevel === 'scarce' ? 90 : 60,
          85,
          88
        ],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.2)'
      }]
    }

    const radarOptions = {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100
        }
      }
    }

    return (
      <div className="space-y-6">
        {/* Market Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Market Forecast</h3>
              <p className="text-sm text-gray-600 mt-1">{marketForecast.area} Metro Area</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="h-4 w-4" />
              <span>{marketForecast.confidence * 100}% confidence</span>
            </div>
          </div>

          {/* Current Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Median Price</p>
              <p className="text-xl font-bold text-gray-900">
                ${(marketForecast.currentMetrics.medianPrice / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Inventory</p>
              <p className="text-xl font-bold text-gray-900">
                {marketForecast.currentMetrics.inventory}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Days on Market</p>
              <p className="text-xl font-bold text-gray-900">
                {marketForecast.currentMetrics.daysOnMarket}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Price/sqft</p>
              <p className="text-xl font-bold text-gray-900">
                ${marketForecast.currentMetrics.pricePerSqft}
              </p>
            </div>
          </div>

          {/* Market Health Radar */}
          <div className="h-64">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Forecast Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Short Term */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">3-6 Months</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Price Change</p>
                <p className={`text-xl font-bold ${getValueChangeColor(marketForecast.forecast.shortTerm.priceChange)}`}>
                  +{marketForecast.forecast.shortTerm.priceChange}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Market Conditions</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    {marketForecast.forecast.shortTerm.demandLevel} demand
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                    {marketForecast.forecast.shortTerm.supplyLevel} supply
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-700">
                  {marketForecast.forecast.shortTerm.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Medium Term */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">6-12 Months</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Price Change</p>
                <p className={`text-xl font-bold ${getValueChangeColor(marketForecast.forecast.mediumTerm.priceChange)}`}>
                  +{marketForecast.forecast.mediumTerm.priceChange}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Market Type</p>
                <p className="text-sm font-medium text-gray-900 capitalize mt-1">
                  {marketForecast.forecast.mediumTerm.marketCondition} market
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Opportunities</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {marketForecast.forecast.mediumTerm.opportunities.map((opp, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="h-3 w-3 text-purple-600 mt-0.5 mr-1" />
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Long Term */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">1-3 Years</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Price Change</p>
                <p className={`text-xl font-bold ${getValueChangeColor(marketForecast.forecast.longTerm.priceChange)}`}>
                  +{marketForecast.forecast.longTerm.priceChange}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Growth Potential</p>
                <p className="text-sm font-medium text-gray-900 capitalize mt-1">
                  {marketForecast.forecast.longTerm.growthPotential}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Risk Factors</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {marketForecast.forecast.longTerm.risks.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5 mr-1" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderInvestmentScenarios = () => {
    if (!investmentScenarios) return null

    const barData = {
      labels: investmentScenarios.scenarios.map((s: any) => s.name),
      datasets: [
        {
          label: '1 Year',
          data: investmentScenarios.scenarios.map((s: any) => s.projectedReturns['1year']),
          backgroundColor: 'rgba(147, 51, 234, 0.8)'
        },
        {
          label: '3 Years',
          data: investmentScenarios.scenarios.map((s: any) => s.projectedReturns['3years']),
          backgroundColor: 'rgba(99, 102, 241, 0.8)'
        },
        {
          label: '5 Years',
          data: investmentScenarios.scenarios.map((s: any) => s.projectedReturns['5years']),
          backgroundColor: 'rgba(59, 130, 246, 0.8)'
        }
      ]
    }

    const barOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${context.parsed.y}% return`
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (value: any) => `${value}%`
          }
        }
      }
    }

    return (
      <div className="space-y-6">
        {/* Investment Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Scenarios</h3>
          
          {/* Return Projections Chart */}
          <div className="h-64 mb-6">
            <Bar data={barData} options={barOptions} />
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {investmentScenarios.scenarios.map((scenario: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{scenario.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
                
                {/* Risk/Liquidity Meters */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Risk Level</span>
                      <span className="font-medium">{scenario.risk}/10</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          scenario.risk <= 3 ? 'bg-green-500' :
                          scenario.risk <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${scenario.risk * 10}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Liquidity</span>
                      <span className="font-medium">{scenario.liquidity}/10</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${scenario.liquidity * 10}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Allocation */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Portfolio Allocation</p>
                  {Object.entries(scenario.allocation).map(([asset, percentage]: [string, any]) => (
                    <div key={asset} className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{asset}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-start space-x-3">
            <Brain className="h-6 w-6 mt-1" />
            <div>
              <h4 className="font-semibold mb-2">AI Investment Recommendation</h4>
              <p className="text-purple-100">
                {investmentScenarios.recommendation}
              </p>
              <button className="mt-4 inline-flex items-center px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors">
                Get Detailed Analysis
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Predictive Analytics</h1>
        <p className="text-gray-600">AI-powered predictions and market forecasting</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('property')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'property'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Property Predictions
        </button>
        <button
          onClick={() => setActiveTab('market')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'market'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <LineChart className="h-4 w-4 mr-2" />
          Market Forecast
        </button>
        <button
          onClick={() => setActiveTab('investment')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'investment'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Investment Scenarios
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'property' && renderPropertyPrediction()}
          {activeTab === 'market' && renderMarketForecast()}
          {activeTab === 'investment' && renderInvestmentScenarios()}
        </motion.div>
      )}
    </div>
  )
}