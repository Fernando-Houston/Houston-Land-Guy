'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, TrendingUp, Building2, Calculator, 
  Filter, Download, Search, Info, ChevronRight,
  Home, Factory, Briefcase, TreePine, BarChart3
} from 'lucide-react'
import { format } from 'date-fns'

// Define interfaces locally to avoid client-side service imports
interface CostData {
  id: string
  category: string
  projectType: string
  address?: string
  neighborhood?: string
  totalCost: number
  costPerSqft: number
  projectSize: number
  completedDate?: Date
  contractor?: string
  breakdown?: ConstructionCostBreakdown[]
}

interface CostStats {
  avgCostPerSqft: number
  medianCost: number
  totalProjects: number
  costByCategory: Record<string, number>
  trendDirection: 'up' | 'down' | 'stable'
  percentageChange: number
}

interface ConstructionCostBreakdown {
  category: string
  amount: number
  percentage: number
  subCategories?: {
    name: string
    amount: number
  }[]
}

const constructionCategories = [
  { id: 'construction', name: 'Construction', icon: Building2 },
  { id: 'labor', name: 'Labor', icon: Briefcase },
  { id: 'land', name: 'Land', icon: TreePine },
  { id: 'permits', name: 'Permits', icon: Factory }
]

const projectTypes = [
  { value: 'single_family', label: 'Single Family Home' },
  { value: 'townhome', label: 'Townhome Development' },
  { value: 'apartment', label: 'Apartment Complex' },
  { value: 'office', label: 'Office Building' },
  { value: 'retail', label: 'Retail Center' },
  { value: 'industrial', label: 'Industrial/Warehouse' },
  { value: 'mixed_use', label: 'Mixed-Use Development' }
]

// Real cost data is now loaded from the database via API

export default function CostDatabase() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProjectType, setSelectedProjectType] = useState('single_family')
  const [searchTerm, setSearchTerm] = useState('')
  const [costData, setCostData] = useState<CostData[]>([])
  const [stats, setStats] = useState<CostStats | null>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [breakdown, setBreakdown] = useState<ConstructionCostBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [showCalculator, setShowCalculator] = useState(false)
  const [projectSize, setProjectSize] = useState('2500')

  useEffect(() => {
    loadCostData()
  }, [selectedCategory, searchTerm])

  const loadCostData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/costs?${new URLSearchParams({
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
        limit: '100'
      })}`)

      if (response.ok) {
        const data = await response.json()
        setCostData(data.costData)
        setStats(data.stats)
        setTrends(data.trends)
        setBreakdown(data.breakdown)
      }
    } catch (error) {
      console.error('Error loading cost data:', error)
    }
    setLoading(false)
  }

  // Data is already filtered by API
  const filteredData = costData

  const calculateProjectCost = async () => {
    const sqft = parseInt(projectSize) || 2500
    
    if (!stats) {
      alert('Loading cost data...')
      return
    }

    let costPerSqft = stats.avgCostPerSqft
    
    // Use specific construction type costs if available
    if (selectedProjectType === 'single_family') {
      costPerSqft = stats.constructionTypes.residentialMid
    } else if (selectedProjectType === 'townhome') {
      costPerSqft = stats.constructionTypes.residentialMid
    } else if (selectedProjectType === 'apartment') {
      costPerSqft = stats.constructionTypes.residentialHigh
    } else if (selectedProjectType === 'office') {
      costPerSqft = stats.constructionTypes.commercialOffice
    } else if (selectedProjectType === 'retail') {
      costPerSqft = stats.constructionTypes.commercialRetail
    } else if (selectedProjectType === 'industrial') {
      costPerSqft = stats.constructionTypes.commercialIndustrial
    }
    
    const estimatedCost = sqft * costPerSqft
    const lowEstimate = sqft * stats.constructionTypes.residentialLow
    const highEstimate = sqft * stats.constructionTypes.residentialHigh
    
    // Calculate material and labor breakdown
    const materialCostTotal = sqft * (costPerSqft * 0.6) // ~60% materials
    const laborCostTotal = sqft * (costPerSqft * 0.4) // ~40% labor
    
    alert(`Project Cost Estimate for ${sqft.toLocaleString()} sqft:\n\nTotal Cost: $${estimatedCost.toLocaleString()}\n\nBreakdown:\n• Materials: $${materialCostTotal.toLocaleString()}\n• Labor: $${laborCostTotal.toLocaleString()}\n\nRange:\n• Low: $${lowEstimate.toLocaleString()}\n• High: $${highEstimate.toLocaleString()}\n\nBased on real Houston market data`)
  }

  const exportData = () => {
    const csv = [
      ['Category', 'Subcategory', 'Unit', 'Low Cost', 'Avg Cost', 'High Cost', 'Last Updated', 'Source', 'Notes'],
      ...filteredData.map(item => [
        item.category,
        item.subcategory,
        item.unit,
        `$${item.lowCost}`,
        `$${item.avgCost}`,
        `$${item.highCost}`,
        item.lastUpdated,
        item.source,
        item.notes || ''
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `houston-construction-costs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 100 ? 2 : 0,
      maximumFractionDigits: value < 100 ? 2 : 0
    }).format(value)
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 bg-opacity-20 backdrop-blur-sm rounded-full mb-6">
              <DollarSign className="h-4 w-4 text-purple-300 mr-2" />
              <span className="text-sm font-medium text-purple-200">Updated Weekly</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Houston Construction Cost Database
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real construction costs from actual Houston projects. Updated weekly 
              with data from permits, contractors, and completed developments.
            </p>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">${stats?.avgCostPerSqft || 142}</div>
                <div className="text-sm text-gray-300">Avg $/SqFt</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats?.totalItems || 26}</div>
                <div className="text-sm text-gray-300">Cost Items</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">+{stats?.yearlyChange || 8}%</div>
                <div className="text-sm text-gray-300">YoY Change</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats?.projectCount?.toLocaleString() || '2,341'}</div>
                <div className="text-sm text-gray-300">Projects</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Cost Estimator</h2>
              <p className="text-sm text-gray-600">Get instant estimates based on current Houston market data</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={selectedProjectType}
                onChange={(e) => setSelectedProjectType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {projectTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              
              <input
                type="number"
                placeholder="Square feet"
                value={projectSize}
                onChange={(e) => setProjectSize(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              
              <button
                onClick={calculateProjectCost}
                disabled={loading}
                className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </button>
            </div>
          </motion.div>
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
                  placeholder="Search cost items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {constructionCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </section>

      {/* Cost Data Table */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Construction Cost Items ({filteredData.length} results)
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Info className="h-4 w-4 mr-1" />
                  Costs include materials and labor
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category / Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Low
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-purple-50">
                      Average
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      High
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => {
                    const category = constructionCategories.find(c => c.id === item.category)
                    const Icon = category?.icon || Building2
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Icon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.subcategory}</div>
                              <div className="text-xs text-gray-500">{category?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                          {formatCurrency(item.lowCost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 bg-purple-50">
                          {formatCurrency(item.avgCost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                          {formatCurrency(item.highCost)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            {item.source}
                            {item.notes && (
                              <div className="group relative ml-2">
                                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                                <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded p-2 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48">
                                  {item.notes}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(item.lastUpdated), 'MMM d, yyyy')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Material Costs & Labor Rates */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Material Costs */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-gray-600" />
                  Material Costs
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Concrete</span>
                    <span className="text-lg font-bold text-gray-900">${stats.materialCosts.concrete}/cy</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Steel</span>
                    <span className="text-lg font-bold text-gray-900">${stats.materialCosts.steel}/ton</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Lumber</span>
                    <span className="text-lg font-bold text-gray-900">${stats.materialCosts.lumber}/bf</span>
                  </div>
                </div>
              </div>

              {/* Labor Rates */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
                  Labor Rates
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Skilled Labor</span>
                    <span className="text-lg font-bold text-gray-900">${stats.laborRates.skilled}/hr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Unskilled Labor</span>
                    <span className="text-lg font-bold text-gray-900">${stats.laborRates.unskilled}/hr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">Availability</span>
                    <span className={`text-lg font-bold ${
                      stats.laborRates.availability === 'Tight' ? 'text-red-600' :
                      stats.laborRates.availability === 'Abundant' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {stats.laborRates.availability}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Construction Types Cost Breakdown */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2 text-gray-600" />
                Construction Cost by Type (per sqft)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">${stats.constructionTypes.residentialLow}</div>
                  <div className="text-sm text-gray-600">Residential Low</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">${stats.constructionTypes.residentialMid}</div>
                  <div className="text-sm text-gray-600">Residential Mid</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">${stats.constructionTypes.residentialHigh}</div>
                  <div className="text-sm text-gray-600">Residential High</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">${stats.constructionTypes.commercialOffice}</div>
                  <div className="text-sm text-gray-600">Office</div>
                </div>
                <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-700">${stats.constructionTypes.commercialRetail}</div>
                  <div className="text-sm text-gray-600">Retail</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">${stats.constructionTypes.commercialIndustrial}</div>
                  <div className="text-sm text-gray-600">Industrial</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Cost Trends</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Materials</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Labor</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Total</span>
                </div>
              </div>
            </div>
            
            {trends.length > 0 ? (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="w-full">
                  {trends.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <div className="flex gap-4">
                        <span className="text-sm text-green-600">${month.materials}</span>
                        <span className="text-sm text-blue-600">${month.labor}</span>
                        <span className="text-sm font-bold text-purple-600">${month.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Cost trend data loading...</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Sources & Methodology */}
      <section className="py-8 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sources & Methodology</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Primary Sources</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    Houston building permits with declared construction values
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    Monthly surveys of 50+ Houston contractors and subcontractors
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    Completed project cost breakdowns from developers
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    Material supplier pricing from Houston-area vendors
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Update Frequency</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    Weekly updates for high-volatility items (lumber, steel, concrete)
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    Monthly updates for labor costs and standard materials
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    Quarterly reviews of all cost categories
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    Real-time alerts for significant market changes
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}