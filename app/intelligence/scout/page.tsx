'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, Search, Bell, Filter, MapPin, DollarSign, 
  TrendingUp, AlertTriangle, Building2, Users, Clock,
  ChevronRight, Star, Zap, Target, Eye, Settings,
  Download, Share2, Calendar, BarChart3, CheckCircle,
  XCircle, Info, ArrowRight, Sparkles
} from 'lucide-react'
import { 
  runDevelopmentScout, 
  type ScoutOpportunity, 
  type ScoutCriteria,
  type DistressSignal 
} from '@/lib/services/ai-scout'
import { PropertyMap } from '@/components/maps/MapWrapper'
import { format } from 'date-fns'

const opportunityTypeConfig = {
  land_assembly: { 
    icon: Building2, 
    color: 'purple', 
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  distressed: { 
    icon: AlertTriangle, 
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  competitor_activity: { 
    icon: Users, 
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  price_drop: { 
    icon: TrendingUp, 
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  emerging_area: { 
    icon: Sparkles, 
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200'
  }
}

const defaultCriteria: ScoutCriteria = {
  targetPrice: { min: 100000, max: 5000000 },
  targetSize: { min: 0.5, max: 50 },
  minROI: 15,
  maxHoldPeriod: 36,
  opportunityTypes: ['land_assembly', 'distressed', 'competitor_activity', 'price_drop', 'emerging_area']
}

export default function AIScoutPage() {
  const [opportunities, setOpportunities] = useState<ScoutOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [criteria, setCriteria] = useState<ScoutCriteria>(defaultCriteria)
  const [selectedOpportunity, setSelectedOpportunity] = useState<ScoutOpportunity | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [savedSearches, setSavedSearches] = useState<Array<{id: string, name: string, criteria: ScoutCriteria}>>([])
  const [alerts, setAlerts] = useState(true)

  useEffect(() => {
    runScout()
  }, [])

  const runScout = async () => {
    setLoading(true)
    try {
      const results = await runDevelopmentScout(criteria)
      setOpportunities(results)
    } catch (error) {
      console.error('Error running scout:', error)
    }
    setLoading(false)
  }

  const handleCriteriaChange = (newCriteria: Partial<ScoutCriteria>) => {
    setCriteria(prev => ({ ...prev, ...newCriteria }))
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getTimeframeLabel = (timeframe: string) => {
    const labels = {
      immediate: { text: 'Act Now', color: 'text-red-600 bg-red-50' },
      short_term: { text: '1-3 Months', color: 'text-yellow-600 bg-yellow-50' },
      long_term: { text: '3+ Months', color: 'text-blue-600 bg-blue-50' }
    }
    return labels[timeframe as keyof typeof labels] || labels.long_term
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 bg-opacity-20 backdrop-blur-sm rounded-full mb-6">
              <Brain className="h-4 w-4 text-purple-300 mr-2" />
              <span className="text-sm font-medium text-purple-200">AI-Powered Scout</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Development Scout AI
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your 24/7 intelligent assistant finding the best development opportunities 
              before they hit the market.
            </p>

            {/* Quick Stats */}
            <div className="mt-8 flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{opportunities.length}</div>
                <div className="text-sm text-gray-300">Active Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {opportunities.filter(o => o.score >= 8).length}
                </div>
                <div className="text-sm text-gray-300">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {formatCurrency(
                    opportunities.reduce((sum, o) => sum + o.financials.totalInvestment, 0)
                  )}
                </div>
                <div className="text-sm text-gray-300">Total Value</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Controls Bar */}
      <section className="bg-white border-b sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Left Side - View Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['grid', 'map', 'list'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === mode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {Object.keys(criteria).length > 0 && (
                  <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setAlerts(!alerts)}
                className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                  alerts 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bell className="h-4 w-4 mr-2" />
                {alerts ? 'Alerts On' : 'Alerts Off'}
              </button>
              
              <button
                onClick={runScout}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Scouting...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Run Scout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      <AnimatePresence>
        {filterOpen && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 border-b overflow-hidden"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid md:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={criteria.targetPrice?.min || ''}
                      onChange={(e) => handleCriteriaChange({
                        targetPrice: { 
                          ...criteria.targetPrice, 
                          min: parseInt(e.target.value) || 0 
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={criteria.targetPrice?.max || ''}
                      onChange={(e) => handleCriteriaChange({
                        targetPrice: { 
                          ...criteria.targetPrice, 
                          max: parseInt(e.target.value) || 0 
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Size Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size (Acres)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={criteria.targetSize?.min || ''}
                      onChange={(e) => handleCriteriaChange({
                        targetSize: { 
                          ...criteria.targetSize, 
                          min: parseFloat(e.target.value) || 0 
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={criteria.targetSize?.max || ''}
                      onChange={(e) => handleCriteriaChange({
                        targetSize: { 
                          ...criteria.targetSize, 
                          max: parseFloat(e.target.value) || 0 
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Min ROI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum ROI (%)
                  </label>
                  <input
                    type="number"
                    value={criteria.minROI || ''}
                    onChange={(e) => handleCriteriaChange({ 
                      minROI: parseInt(e.target.value) || 0 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {/* Max Hold Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Hold Period (Months)
                  </label>
                  <input
                    type="number"
                    value={criteria.maxHoldPeriod || ''}
                    onChange={(e) => handleCriteriaChange({ 
                      maxHoldPeriod: parseInt(e.target.value) || 0 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Opportunity Types */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opportunity Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(opportunityTypeConfig).map(([type, config]) => {
                    const Icon = config.icon
                    const isSelected = criteria.opportunityTypes?.includes(type as any)
                    
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          const types = criteria.opportunityTypes || []
                          handleCriteriaChange({
                            opportunityTypes: isSelected
                              ? types.filter(t => t !== type)
                              : [...types, type as any]
                          })
                        }}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? `${config.bgColor} ${config.textColor} ${config.borderColor} border`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-1.5" />
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setCriteria(defaultCriteria)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => {
                    setFilterOpen(false)
                    runScout()
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Apply & Search
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-pulse" />
                <p className="text-lg text-gray-600">AI Scout analyzing market data...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-20">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
              <button
                onClick={() => setCriteria(defaultCriteria)}
                className="text-purple-600 font-medium hover:text-purple-700"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              {/* View Modes */}
              {viewMode === 'grid' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {opportunities.map((opportunity) => {
                    const typeConfig = opportunityTypeConfig[opportunity.type]
                    const Icon = typeConfig.icon
                    const timeframe = getTimeframeLabel(opportunity.timeframe)
                    
                    return (
                      <motion.div
                        key={opportunity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedOpportunity(opportunity)}
                      >
                        {/* Score Badge */}
                        <div className="relative">
                          <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-sm font-bold text-white ${
                            opportunity.score >= 8 ? 'bg-green-500' :
                            opportunity.score >= 6 ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}>
                            {opportunity.score.toFixed(1)}
                          </div>
                          
                          {/* Type Header */}
                          <div className={`px-6 pt-6 pb-4 ${typeConfig.bgColor}`}>
                            <div className="flex items-center">
                              <Icon className={`h-6 w-6 ${typeConfig.textColor} mr-2`} />
                              <span className={`text-sm font-medium ${typeConfig.textColor}`}>
                                {opportunity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mt-2">
                              {opportunity.title}
                            </h3>
                          </div>
                        </div>

                        <div className="p-6">
                          {/* Location */}
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {opportunity.location.neighborhood}
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {opportunity.description}
                          </p>

                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500">Investment</div>
                              <div className="font-semibold text-gray-900">
                                {formatCurrency(opportunity.financials.totalInvestment)}
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500">Potential ROI</div>
                              <div className="font-semibold text-green-600">
                                {opportunity.financials.potentialROI}%
                              </div>
                            </div>
                          </div>

                          {/* Timeframe */}
                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${timeframe.color}`}>
                              {timeframe.text}
                            </span>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {viewMode === 'map' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: '600px' }}>
                  <PropertyMap
                    height="100%"
                    showSearch={false}
                    markers={opportunities.map(opp => ({
                      id: opp.id,
                      position: opp.location.coordinates,
                      title: opp.title,
                      description: `${opp.type} - ${formatCurrency(opp.financials.totalInvestment)} - ${opp.financials.potentialROI}% ROI`
                    }))}
                    zoom={11}
                  />
                </div>
              )}

              {viewMode === 'list' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Opportunity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Investment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ROI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {opportunities.map((opportunity) => {
                        const typeConfig = opportunityTypeConfig[opportunity.type]
                        const Icon = typeConfig.icon
                        
                        return (
                          <tr key={opportunity.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {opportunity.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {opportunity.parcels.length} parcels
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Icon className={`h-5 w-5 ${typeConfig.textColor} mr-2`} />
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeConfig.bgColor} ${typeConfig.textColor}`}>
                                  {opportunity.type.replace('_', ' ')}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {opportunity.location.neighborhood}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(opportunity.financials.totalInvestment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-green-600">
                                {opportunity.financials.potentialROI}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-lg font-bold ${getScoreColor(opportunity.score)}`}>
                                {opportunity.score.toFixed(1)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => setSelectedOpportunity(opportunity)}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Opportunity Detail Modal */}
      <AnimatePresence>
        {selectedOpportunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOpportunity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${opportunityTypeConfig[selectedOpportunity.type].bgColor} mr-3`}>
                      {(() => {
                        const Icon = opportunityTypeConfig[selectedOpportunity.type].icon
                        return <Icon className={`h-6 w-6 ${opportunityTypeConfig[selectedOpportunity.type].textColor}`} />
                      })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedOpportunity.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedOpportunity.location.address}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOpportunity(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Score and Timeframe */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(selectedOpportunity.score)}`}>
                        {selectedOpportunity.score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">Priority Score</div>
                    </div>
                    <div className="h-12 w-px bg-gray-300" />
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getTimeframeLabel(selectedOpportunity.timeframe).color
                      }`}>
                        {getTimeframeLabel(selectedOpportunity.timeframe).text}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Overview</h3>
                  <p className="text-gray-600">{selectedOpportunity.description}</p>
                </div>

                {/* Financial Summary */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Total Investment</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedOpportunity.financials.totalInvestment)}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Estimated Value</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedOpportunity.financials.estimatedValue)}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Potential ROI</div>
                    <div className="text-lg font-bold text-purple-600">
                      {selectedOpportunity.financials.potentialROI}%
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Hold Period</div>
                    <div className="text-lg font-bold text-blue-600">
                      {selectedOpportunity.financials.holdPeriod}
                    </div>
                  </div>
                </div>

                {/* Parcels */}
                {selectedOpportunity.parcels.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Properties ({selectedOpportunity.parcels.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedOpportunity.parcels.map((parcel, index) => (
                        <div key={parcel.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{parcel.address}</div>
                            <div className="text-sm text-gray-600">
                              {parcel.size} acres • {parcel.currentUse}
                              {parcel.owner && ` • ${parcel.owner}`}
                            </div>
                          </div>
                          {parcel.askingPrice && (
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {formatCurrency(parcel.askingPrice)}
                              </div>
                              <div className="text-xs text-gray-500">Asking</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 text-purple-600 mr-1" />
                      AI Insights
                    </h3>
                    <ul className="space-y-2">
                      {selectedOpportunity.insights.map((insight, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1" />
                      Risk Factors
                    </h3>
                    <ul className="space-y-2">
                      {selectedOpportunity.risks.map((risk, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <Info className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Items */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Recommended Actions</h3>
                  <div className="space-y-2">
                    {selectedOpportunity.actionItems.map((action, index) => (
                      <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700 flex-1">{action}</span>
                        <ChevronRight className="h-4 w-4 text-purple-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Points */}
                {Object.keys(selectedOpportunity.dataPoints).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Data Points</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(selectedOpportunity.dataPoints).map(([key, value]) => (
                        <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500">{key}</div>
                          <div className="font-semibold text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Save for Later
                  </button>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Run Feasibility Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}