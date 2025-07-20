'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, DollarSign, Clock, TrendingUp, FileText, Phone,
  Mail, Calendar, CheckCircle, AlertCircle, ChevronRight,
  Plus, Filter, Download, BarChart3, Target, Briefcase,
  Home, Building2, MapPin, Star, ArrowRight, MoreVertical
} from 'lucide-react'
import { dealFlow } from '@/lib/services/deal-flow'
import type { Deal, DealMetrics } from '@/lib/services/deal-flow'

interface DealStage {
  id: Deal['status']
  name: string
  color: string
  icon: any
}

const stages: DealStage[] = [
  { id: 'lead', name: 'Leads', color: 'bg-gray-500', icon: Users },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-500', icon: CheckCircle },
  { id: 'negotiating', name: 'Negotiating', color: 'bg-yellow-500', icon: FileText },
  { id: 'under_contract', name: 'Under Contract', color: 'bg-purple-500', icon: FileText },
  { id: 'closing', name: 'Closing', color: 'bg-green-500', icon: Calendar },
  { id: 'closed', name: 'Closed', color: 'bg-green-700', icon: CheckCircle }
]

export default function DealPipeline() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [metrics, setMetrics] = useState<DealMetrics | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [filter, setFilter] = useState<'all' | 'buyer' | 'seller' | 'investor'>('all')
  const [view, setView] = useState<'pipeline' | 'list' | 'analytics'>('pipeline')
  const [forecast, setForecast] = useState<any>(null)
  
  // Mock user ID
  const userId = 'user-123'

  useEffect(() => {
    loadData()
  }, [filter])

  const loadData = async () => {
    // Load deals
    const filters = filter === 'all' ? undefined : { clientType: filter as any }
    const userDeals = await dealFlow.getDeals(userId, filters)
    setDeals(userDeals)
    
    // Load metrics
    const userMetrics = await dealFlow.getDealMetrics(userId)
    setMetrics(userMetrics)
    
    // Load forecast
    const userForecast = await dealFlow.getForecast(userId)
    setForecast(userForecast)
  }

  const handleMoveDeal = async (dealId: string, newStatus: Deal['status']) => {
    await dealFlow.moveToStage(userId, dealId, newStatus)
    loadData()
  }

  const handleCreateDeal = async () => {
    // In production, this would open a form
    const newDeal = await dealFlow.createDeal(userId, {
      property: {
        address: '123 Main St, Houston, TX',
        price: 500000,
        type: 'residential'
      },
      client: {
        id: 'client-' + Date.now(),
        name: 'John Doe',
        email: 'john@example.com',
        type: 'buyer',
        prequalified: true,
        budget: 550000
      }
    }, 'residential')
    
    setDeals([newDeal, ...deals])
  }

  const getDealsByStage = (stageId: Deal['status']) => {
    return deals.filter(deal => deal.status === stageId)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderPipelineView = () => (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[1200px]">
        <div className="grid grid-cols-6 gap-4">
          {stages.map(stage => {
            const stageDeals = getDealsByStage(stage.id)
            const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.property.price || 0), 0)
            
            return (
              <div key={stage.id} className="bg-gray-50 rounded-lg p-4">
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <h3 className="font-medium text-gray-900">{stage.name}</h3>
                    <span className="text-sm text-gray-500">({stageDeals.length})</span>
                  </div>
                  <stage.icon className="h-4 w-4 text-gray-400" />
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {formatCurrency(stageValue)}
                </p>
                
                {/* Deals */}
                <div className="space-y-2">
                  {stageDeals.map(deal => (
                    <motion.div
                      key={deal.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedDeal(deal)}
                    >
                      {/* Deal Score Badge */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            deal.score >= 80 ? 'bg-green-100 text-green-700' :
                            deal.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {deal.score}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                              {deal.client.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {deal.client.type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle menu
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                      
                      {/* Property Info */}
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {deal.property.address}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatCurrency(deal.property.price || 0)}
                        </p>
                      </div>
                      
                      {/* AI Insights */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          Win: {deal.aiInsights.winProbability}%
                        </span>
                        {deal.timeline.expectedClose && (
                          <span className="text-gray-500">
                            Close: {new Date(deal.timeline.expectedClose).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {/* Next Action */}
                      {deal.aiInsights.nextBestAction && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-purple-600 flex items-center">
                            <Target className="h-3 w-3 mr-1" />
                            {deal.aiInsights.nextBestAction}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {/* Drop Zone for dragging deals */}
                {stage.id !== 'closed' && stage.id !== 'dead' && (
                  <div className="mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-xs text-gray-400">
                    Drop deal here
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => {
    if (!metrics || !forecast) return null

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Volume</h3>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics.totalVolume)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {metrics.closedDeals} closed deals
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pipeline Value</h3>
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics.pipeline.value)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {metrics.pipeline.count} active deals
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Avg Deal Size</h3>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics.averageDealSize)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Per transaction
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(metrics.conversionRate * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Lead to close
            </p>
          </div>
        </div>

        {/* Pipeline by Stage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline by Stage</h3>
          <div className="space-y-3">
            {Object.entries(metrics.pipeline.byStage).map(([stage, data]) => {
              const percentage = (data.value / metrics.pipeline.value) * 100
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {stage.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-gray-600">
                      {data.count} deals • {formatCurrency(data.value)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Revenue Forecast */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Forecast</h3>
            <div className="text-sm text-gray-600">
              Confidence: {forecast.confidence}%
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Expected Revenue (3 months)</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(forecast.expectedRevenue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected Deals</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(forecast.expectedDeals)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            {forecast.breakdown.map((month: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{month.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{month.deals} deals</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(month.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderDealDetail = () => {
    if (!selectedDeal) return null

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedDeal(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Deal Header */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedDeal.client.name}</h2>
                <p className="text-gray-600 mt-1">{selectedDeal.property.address}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    stages.find(s => s.id === selectedDeal.status)?.color || 'bg-gray-500'
                  } text-white`}>
                    {selectedDeal.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-gray-600">
                    Score: {selectedDeal.score}/100
                  </span>
                  <span className="text-sm text-gray-600">
                    Win Probability: {selectedDeal.aiInsights.winProbability}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Deal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* AI Insights */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                AI Insights & Recommendations
              </h3>
              <div className="space-y-2">
                <p className="text-purple-800">
                  <strong>Next Best Action:</strong> {selectedDeal.aiInsights.nextBestAction}
                </p>
                {selectedDeal.aiInsights.recommendations.length > 0 && (
                  <div>
                    <strong className="text-purple-800">Recommendations:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {selectedDeal.aiInsights.recommendations.map((rec, i) => (
                        <li key={i} className="text-purple-700 text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedDeal.aiInsights.riskFactors.length > 0 && (
                  <div>
                    <strong className="text-purple-800">Risk Factors:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {selectedDeal.aiInsights.riskFactors.map((risk, i) => (
                        <li key={i} className="text-orange-700 text-sm">{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Tasks */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Tasks</h3>
              <div className="space-y-2">
                {selectedDeal.tasks.map(task => (
                  <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => dealFlow.completeTask(userId, selectedDeal.id, task.id)}
                      className="h-4 w-4 text-purple-600 rounded border-gray-300"
                    />
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <span className="text-sm text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Communications */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Communications</h3>
              <div className="space-y-3">
                {selectedDeal.communications.slice(0, 5).map(comm => (
                  <div key={comm.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {comm.type === 'email' ? <Mail className="h-5 w-5 text-gray-400 mt-0.5" /> :
                     comm.type === 'call' ? <Phone className="h-5 w-5 text-gray-400 mt-0.5" /> :
                     <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{comm.subject || comm.type}</p>
                      <p className="text-sm text-gray-600">{comm.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comm.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedDeal.documents.map(doc => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {doc.signedAt ? 'Signed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deal Pipeline</h1>
            <p className="text-gray-600 mt-2">AI-powered deal management and tracking</p>
          </div>
          <button
            onClick={handleCreateDeal}
            className="flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Deal
          </button>
        </div>

        {/* View Selector */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('pipeline')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                view === 'pipeline'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pipeline View
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                view === 'list'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                view === 'analytics'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Clients</option>
              <option value="buyer">Buyers</option>
              <option value="seller">Sellers</option>
              <option value="investor">Investors</option>
            </select>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'pipeline' && renderPipelineView()}
      {view === 'analytics' && renderAnalytics()}

      {/* Deal Detail Modal */}
      <AnimatePresence>
        {selectedDeal && renderDealDetail()}
      </AnimatePresence>
    </div>
  )
}