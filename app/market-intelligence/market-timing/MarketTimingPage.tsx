'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Clock, TrendingUp, TrendingDown, AlertCircle, 
  Target, Activity, BarChart3, DollarSign, Calendar,
  ChevronUp, ChevronDown, Minus, ChevronRight, Building2
} from 'lucide-react'
import { MarketTiming, MarketMetrics, PermitActivity } from '@/lib/core-agents/types'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'
import Script from 'next/script'

interface MarketTimingPageProps {
  marketTiming: MarketTiming
  marketMetrics: MarketMetrics
  permitData: PermitActivity
  neighborhoodTimings: Array<{ name: string; timing: MarketTiming }>
}

export function MarketTimingPage({ 
  marketTiming, 
  marketMetrics, 
  permitData,
  neighborhoodTimings 
}: MarketTimingPageProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'Houston Market Timing Analysis',
    description: 'AI-powered market timing recommendations for Houston real estate investments',
    provider: {
      '@type': 'Organization',
      name: 'Houston Development Intelligence'
    },
    featureList: [
      'Real-time market analysis',
      'Buy/Sell/Hold recommendations',
      'Risk assessment',
      'Neighborhood-specific timing'
    ]
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY': return 'text-green-600 bg-green-100'
      case 'SELL': return 'text-red-600 bg-red-100'
      case 'HOLD': return 'text-yellow-600 bg-yellow-100'
      case 'WATCH': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'HIGH': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getScoreGrade = (score: number) => {
    if (score >= 80) return { grade: 'A', label: 'Excellent' }
    if (score >= 70) return { grade: 'B', label: 'Good' }
    if (score >= 60) return { grade: 'C', label: 'Fair' }
    if (score >= 50) return { grade: 'D', label: 'Below Average' }
    return { grade: 'F', label: 'Poor' }
  }

  const scoreGrade = getScoreGrade(marketTiming.score)

  return (
    <>
      <Script
        id="market-timing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/market-intelligence" 
              className="inline-flex items-center text-indigo-300 hover:text-indigo-200 font-medium mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Market Intelligence
            </Link>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 bg-opacity-20 backdrop-blur-sm rounded-full mb-6">
                <Activity className="h-4 w-4 text-indigo-300 mr-2" />
                <span className="text-sm font-medium text-indigo-200">AI-Powered Analysis</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Market Timing Analysis
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Data-driven recommendations for Houston real estate investments based on 
                current market conditions, trends, and predictive analytics
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Score and Recommendation */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <div className="relative inline-block">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, type: "spring" }}
                      className="w-48 h-48 bg-white rounded-full shadow-xl flex items-center justify-center"
                    >
                      <div>
                        <div className="text-6xl font-bold text-indigo-600">{marketTiming.score}</div>
                        <div className="text-lg text-gray-600">out of 100</div>
                      </div>
                    </motion.div>
                    <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg px-3 py-1">
                      <div className="text-2xl font-bold text-indigo-600">{scoreGrade.grade}</div>
                      <div className="text-xs text-gray-600">{scoreGrade.label}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Overall Market Recommendation
                  </h2>
                  
                  <div className="mb-6">
                    <span className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${getRecommendationColor(marketTiming.recommendation)}`}>
                      {marketTiming.recommendation === 'BUY' && <TrendingUp className="h-5 w-5 mr-2" />}
                      {marketTiming.recommendation === 'SELL' && <TrendingDown className="h-5 w-5 mr-2" />}
                      {marketTiming.recommendation === 'HOLD' && <Minus className="h-5 w-5 mr-2" />}
                      {marketTiming.recommendation}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <span className="text-gray-600 mr-2">Risk Level:</span>
                    <span className={`font-bold ${getRiskColor(marketTiming.riskLevel)}`}>
                      {marketTiming.riskLevel}
                    </span>
                  </div>
                  
                  <p className="text-gray-700">
                    Based on current market conditions, Houston real estate presents a{' '}
                    <strong>{marketTiming.recommendation.toLowerCase()}</strong> opportunity with{' '}
                    <strong>{marketTiming.riskLevel.toLowerCase()}</strong> risk factors.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Factors */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Market Timing Factors
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {Object.entries(marketTiming.factors).map(([factor, score], index) => {
                const isPositive = score >= 70
                const Icon = isPositive ? ChevronUp : score >= 50 ? Minus : ChevronDown
                
                return (
                  <motion.div
                    key={factor}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 text-center"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                      isPositive ? 'bg-green-100' : score >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isPositive ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                      {factor.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    
                    <div className="text-3xl font-bold text-gray-900 mb-1">{score}%</div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isPositive ? 'bg-green-600' : score >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Key Market Insights
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {marketTiming.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <AlertCircle className="h-5 w-5 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">{insight}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Neighborhood Timing */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Neighborhood-Specific Timing
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neighborhoodTimings.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{item.name}</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-indigo-600">{item.timing.score}</div>
                      <div className="text-sm text-gray-600">Market Score</div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(item.timing.recommendation)}`}>
                      {item.timing.recommendation}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Risk Level</span>
                      <span className={`font-medium ${getRiskColor(item.timing.riskLevel)}`}>
                        {item.timing.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price Trend</span>
                      <span className="font-medium text-gray-900">
                        {item.timing.factors.priceAppreciation}%
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/houston-neighborhoods/${item.name.toLowerCase()}/`}
                    className="mt-4 inline-flex items-center text-indigo-600 font-medium text-sm hover:text-indigo-700"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Metrics Summary */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Supporting Market Data
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${marketMetrics.averagePricePerSqFt}
                </div>
                <div className="text-sm text-gray-600 mb-2">Price Per Sq Ft</div>
                <div className={`text-sm font-medium ${marketMetrics.yearOverYearChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketMetrics.yearOverYearChange > 0 ? '+' : ''}{marketMetrics.yearOverYearChange}% YoY
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {marketMetrics.daysOnMarket}
                </div>
                <div className="text-sm text-gray-600 mb-2">Days on Market</div>
                <div className="text-sm font-medium text-blue-600">
                  {marketMetrics.inventoryMonths} months inventory
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
                <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {permitData.totalPermits}
                </div>
                <div className="text-sm text-gray-600 mb-2">Active Permits</div>
                <div className="text-sm font-medium text-purple-600">
                  ${(permitData.totalValue / 1000000).toFixed(1)}M value
                </div>
              </div>
            </div>
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
            <Target className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Get Personalized Investment Timing Analysis
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Receive customized market timing reports for your specific investment criteria 
              and target neighborhoods.
            </p>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
              <LeadCaptureForm 
                source="MARKET_TIMING" 
                className="space-y-4"
                buttonText="Get Timing Analysis"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}