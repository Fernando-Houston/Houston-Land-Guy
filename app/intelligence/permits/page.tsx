'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, TrendingUp, MapPin, DollarSign, Calendar, 
  Filter, Download, RefreshCw, AlertCircle, Search,
  Home, Factory, Briefcase, TreePine
} from 'lucide-react'
import { PermitsDataService, type PermitData } from '@/lib/services/permits-data-service'

// PermitData interface is imported from permits-data-service
import { PropertyMap } from '@/components/maps/MapWrapper'
import { format, subDays } from 'date-fns'

const permitTypes = [
  { value: 'all', label: 'All Permits', icon: Building2 },
  { value: 'new_construction', label: 'New Construction', icon: Home },
  { value: 'commercial', label: 'Commercial', icon: Factory },
  { value: 'residential', label: 'Residential', icon: Home },
  { value: 'demolition', label: 'Demolition', icon: TreePine }
]

const dateRanges = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: '180', label: 'Last 6 months' }
]

export default function PermitTracker() {
  const [permits, setPermits] = useState<PermitData[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [permitType, setPermitType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalPermits: 0,
    totalValue: 0,
    avgValue: 0,
    topContractor: '',
    hotZones: [] as string[]
  })

  useEffect(() => {
    loadPermits()
  }, [dateRange, permitType])

  const loadPermits = async () => {
    setLoading(true)
    try {
      const dateFrom = subDays(new Date(), parseInt(dateRange)).toISOString().split('T')[0]
      
      // Use API route to fetch permits data
      const response = await fetch(`/api/permits?${new URLSearchParams({
        limit: '100',
        dateFrom,
        ...(permitType !== 'all' && { type: permitType }),
        ...(searchTerm && { search: searchTerm })
      })}`)
      
      if (response.ok) {
        const data = await response.json()
        setPermits(data.permits)
        setStats({
          totalPermits: data.stats.totalPermits,
          totalValue: data.stats.totalValue,
          avgValue: data.stats.avgValue,
          topContractor: data.stats.topContractor,
          hotZones: data.stats.hotZones
        })
      }
    } catch (error) {
      console.error('Error loading permits:', error)
    }
    setLoading(false)
  }

  // Search functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        loadPermits()
      }
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Permits are already filtered by the API when search term is provided
  const filteredPermits = permits

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }

  const exportData = () => {
    const csv = [
      ['Permit Number', 'Type', 'Address', 'Description', 'Value', 'Date', 'Contractor', 'Owner'],
      ...filteredPermits.map(p => [
        p.permitNumber,
        p.type,
        p.address,
        p.description || '',
        p.value.toString(),
        p.issuedDate,
        p.contractor || '',
        p.owner || ''
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `houston-permits-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 bg-opacity-20 backdrop-blur-sm rounded-full mb-6">
              <Building2 className="h-4 w-4 text-blue-300 mr-2" />
              <span className="text-sm font-medium text-blue-200">Real-Time Data</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Houston Permit Tracker
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Track building permits across Houston in real-time. Discover development 
              trends, identify opportunities, and stay ahead of the market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Permits</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPermits}</p>
                  <p className="text-xs text-gray-500 mt-1">Last {dateRange} days</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                  <p className="text-xs text-gray-500 mt-1">Construction value</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgValue)}</p>
                  <p className="text-xs text-gray-500 mt-1">Per permit</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Top Contractor</p>
                  <p className="text-lg font-bold text-gray-900 truncate">{stats.topContractor}</p>
                  <p className="text-xs text-gray-500 mt-1">Most active</p>
                </div>
                <Briefcase className="h-8 w-8 text-orange-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search address, contractor, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>

              {/* Permit Type */}
              <select
                value={permitType}
                onChange={(e) => setPermitType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {permitTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={loadPermits}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={exportData}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Hot Zones */}
          {stats.hotZones.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Hot Zones:</span>
              <div className="flex gap-2">
                {stats.hotZones.map((zone, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPermits.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No permits found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              {/* Map View */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Permit Locations</h3>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <PropertyMap
                    height="400px"
                    showSearch={false}
                    markers={filteredPermits
                      .filter(p => p.coordinates)
                      .slice(0, 50) // Limit to first 50 for performance
                      .map(p => ({
                        id: p.permitNumber,
                        position: { lat: p.coordinates!.lat, lng: p.coordinates!.lng },
                        title: p.type,
                        description: `${p.address} - ${formatCurrency(p.value)}`
                      }))}
                    zoom={11}
                  />
                </div>
              </div>

              {/* Table View */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Permit Details ({filteredPermits.length} results)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Permit #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contractor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPermits.slice(0, 20).map((permit) => (
                        <tr key={permit.permitNumber} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {permit.permitNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                              {permit.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                              {permit.address}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(permit.value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {permit.issuedDate ? format(new Date(permit.issuedDate), 'MMM d, yyyy') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {permit.contractor || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredPermits.length > 20 && (
                  <div className="px-6 py-4 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600">
                      Showing 20 of {filteredPermits.length} permits. Export to CSV to see all.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}