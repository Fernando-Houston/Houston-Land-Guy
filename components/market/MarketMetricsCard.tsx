'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Home, Clock, DollarSign, BarChart3 } from 'lucide-react'
import { MarketMetrics } from '@/lib/core-agents/types'

interface MarketMetricsCardProps {
  metrics: MarketMetrics
  className?: string
}

export function MarketMetricsCard({ metrics, className = '' }: MarketMetricsCardProps) {
  const isPositiveChange = metrics.yearOverYearChange > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Current Market Metrics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className={`text-sm font-medium ${isPositiveChange ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {metrics.yearOverYearChange}%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${metrics.averagePricePerSqFt}</div>
          <div className="text-sm text-gray-600">Per Sq Ft</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Home className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${(metrics.medianPrice / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Median Price</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.daysOnMarket}</div>
          <div className="text-sm text-gray-600">Days on Market</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.activeListings.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Active Listings</div>
        </div>
        
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.inventoryMonths}</div>
          <div className="text-sm text-gray-600">Months Inventory</div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{(metrics.listToSoldRatio * 100).toFixed(0)}%</div>
          <div className="text-sm text-gray-600">List to Sold</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">New Listings: {metrics.newListings.toLocaleString()}</span>
          <span className="text-gray-600">Sold Properties: {metrics.soldProperties.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  )
}