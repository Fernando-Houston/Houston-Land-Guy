'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowLeft, Building2, Home, Factory, Briefcase, 
  TrendingUp, MapPin, Calendar, Filter, Download, 
  Clock, AlertCircle 
} from 'lucide-react'
import { PermitActivity } from '@/lib/core-agents/types'
import { PermitActivityChart } from '@/components/market/PermitActivityChart'
import Script from 'next/script'

interface PermitTrackerPageProps {
  totalPermitData: PermitActivity
  neighborhoodPermits: Array<{
    neighborhood: string
    slug: string
    permitData: PermitActivity
  }>
}

export function PermitTrackerPage({ totalPermitData, neighborhoodPermits }: PermitTrackerPageProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'residential' | 'commercial' | 'industrial' | 'mixedUse'>('all')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Houston Development Permit Tracker',
    description: 'Real-time tracking of development permits across Houston neighborhoods',
    creator: {
      '@type': 'Organization',
      name: 'Houston Development Intelligence'
    },
    dateModified: new Date().toISOString(),
    temporalCoverage: '2025/..',
    spatialCoverage: {
      '@type': 'Place',
      name: 'Houston, Texas'
    }
  }

  const permitTypes = [
    { id: 'all', name: 'All Types', icon: Building2, color: 'gray' },
    { id: 'residential', name: 'Residential', icon: Home, color: 'green' },
    { id: 'commercial', name: 'Commercial', icon: Building2, color: 'blue' },
    { id: 'industrial', name: 'Industrial', icon: Factory, color: 'purple' },
    { id: 'mixedUse', name: 'Mixed-Use', icon: Briefcase, color: 'orange' }
  ]

  const getFilteredData = () => {
    let data = selectedNeighborhood === 'all' 
      ? totalPermitData 
      : neighborhoodPermits.find(n => n.slug === selectedNeighborhood)?.permitData || totalPermitData

    if (selectedType === 'all') return data

    // Filter permit data based on selected type
    const filteredData = { ...data }
    const types = ['residential', 'commercial', 'industrial', 'mixedUse']
    
    types.forEach(type => {
      if (type !== selectedType) {
        filteredData[type as keyof typeof filteredData] = { count: 0, value: 0 }
      }
    })

    return filteredData
  }

  const filteredData = getFilteredData()

  return (
    <>
      <Script
        id="permit-tracker-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/market-intelligence" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Market Intelligence
            </Link>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Development Permit Tracker
                </h1>
                <p className="text-xl text-gray-700">
                  Real-time construction activity across Houston neighborhoods
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  Updated: {new Date().toLocaleTimeString()}
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center"
            >
              <div className="text-3xl font-bold text-green-600">{totalPermitData.totalPermits}</div>
              <div className="text-sm text-gray-600">Total Permits</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center"
            >
              <div className="text-3xl font-bold text-blue-600">
                ${(totalPermitData.totalValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 text-center"
            >
              <div className="text-3xl font-bold text-purple-600">
                {totalPermitData.residential.count}
              </div>
              <div className="text-sm text-gray-600">Residential</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 text-center"
            >
              <div className="text-3xl font-bold text-orange-600">
                {totalPermitData.commercial.count}
              </div>
              <div className="text-sm text-gray-600">Commercial</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters and Main Content */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Filter Permits</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permit Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {permitTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id as any)}
                          className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                            selectedType === type.id
                              ? `bg-${type.color}-600 text-white`
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={{
                            backgroundColor: selectedType === type.id ? `var(--${type.color}-600)` : undefined
                          }}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {type.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Neighborhood
                  </label>
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Neighborhoods</option>
                    {neighborhoodPermits.map((n) => (
                      <option key={n.slug} value={n.slug}>{n.neighborhood}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Permit Activity Chart */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <PermitActivityChart permitData={filteredData} />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Permit Trends</h3>
                
                <div className="space-y-4">
                  {filteredData.monthlyTrend.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                            month: 'long',
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-gray-600">{month.count} permits</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          ${(month.value / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-gray-600">
                          {index > 0 && month.value > filteredData.monthlyTrend[index - 1].value ? (
                            <span className="text-green-600 flex items-center justify-end">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {((month.value - filteredData.monthlyTrend[index - 1].value) / filteredData.monthlyTrend[index - 1].value * 100).toFixed(1)}%
                            </span>
                          ) : index > 0 ? (
                            <span className="text-red-600">
                              {((month.value - filteredData.monthlyTrend[index - 1].value) / filteredData.monthlyTrend[index - 1].value * 100).toFixed(1)}%
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Top Projects */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Major Projects Under Review</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Project</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Value</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Size</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.topProjects.map((project, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{project.address}</div>
                            <div className="text-sm text-gray-600">{project.developer}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {project.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          ${(project.value / 1000000).toFixed(1)}M
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {project.sqft.toLocaleString()} sq ft
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {project.expectedCompletion}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Neighborhood Breakdown */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Permits by Neighborhood</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {neighborhoodPermits.map((item) => (
                  <motion.div
                    key={item.slug}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.neighborhood}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.permitData.totalPermits} total permits
                        </p>
                      </div>
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Value</span>
                        <span className="font-medium text-gray-900">
                          ${(item.permitData.totalValue / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Residential</span>
                        <span className="font-medium text-gray-900">{item.permitData.residential.count}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Commercial</span>
                        <span className="font-medium text-gray-900">{item.permitData.commercial.count}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/houston-neighborhoods/${item.slug}/`}
                      className="text-blue-600 font-medium text-sm hover:text-blue-700"
                    >
                      View Neighborhood Details →
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alert Banner */}
      <section className="py-8 bg-blue-50 border-t border-blue-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Permit data is sourced from Houston's public databases and updated every 6 hours. 
              For the most recent information on specific projects, contact our team.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}