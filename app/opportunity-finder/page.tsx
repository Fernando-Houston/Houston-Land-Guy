'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, Filter, MapPin, DollarSign, TrendingUp, 
  Building2, Home, Factory, Briefcase, Target,
  ChevronRight, Download, Bell
} from 'lucide-react'
import { coreAgentsClient } from '@/lib/core-agents/client'
import { InvestmentOpportunity } from '@/lib/core-agents/types'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

interface SearchCriteria {
  priceMin: number
  priceMax: number
  sizeMin: number
  sizeMax: number
  roiMin: number
  propertyTypes: string[]
  neighborhoods: string[]
  timeline: string
}

const defaultCriteria: SearchCriteria = {
  priceMin: 0,
  priceMax: 50000000,
  sizeMin: 0,
  sizeMax: 1000,
  roiMin: 15,
  propertyTypes: [],
  neighborhoods: [],
  timeline: 'all'
}

export default function OpportunityFinder() {
  const [criteria, setCriteria] = useState<SearchCriteria>(defaultCriteria)
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const propertyTypes = [
    { id: 'residential', name: 'Residential Subdivision', icon: Home },
    { id: 'mixed-use', name: 'Mixed-Use Development', icon: Briefcase },
    { id: 'office', name: 'Office Development', icon: Building2 },
    { id: 'industrial', name: 'Industrial Development', icon: Factory }
  ]

  const neighborhoods = [
    'Cypress', 'Pearland', 'Memorial', 'Spring', 'Katy',
    'Sugar Land', 'The Woodlands', 'Energy Corridor', 'Clear Lake'
  ]

  const timelines = [
    { id: 'all', label: 'All Timelines' },
    { id: '24', label: 'Under 24 months' },
    { id: '36', label: 'Under 36 months' },
    { id: '48', label: 'Under 48 months' }
  ]

  const searchOpportunities = async () => {
    setLoading(true)
    setSearched(true)
    
    try {
      const response = await coreAgentsClient.getInvestmentOpportunities()
      
      // Filter based on criteria
      const filtered = response.data.filter(opp => {
        if (opp.price < criteria.priceMin || opp.price > criteria.priceMax) return false
        if (opp.size < criteria.sizeMin || opp.size > criteria.sizeMax) return false
        if (opp.projectedROI < criteria.roiMin) return false
        
        if (criteria.propertyTypes.length > 0) {
          const typeMatch = criteria.propertyTypes.some(type => 
            opp.type.toLowerCase().includes(type.toLowerCase())
          )
          if (!typeMatch) return false
        }
        
        if (criteria.neighborhoods.length > 0) {
          const neighborhoodMatch = criteria.neighborhoods.some(n => 
            opp.neighborhood.toLowerCase() === n.toLowerCase()
          )
          if (!neighborhoodMatch) return false
        }
        
        if (criteria.timeline !== 'all') {
          const months = parseInt(opp.timeline)
          const maxMonths = parseInt(criteria.timeline)
          if (months > maxMonths) return false
        }
        
        return true
      })
      
      setOpportunities(filtered)
    } catch (error) {
      console.error('Error searching opportunities:', error)
    }
    
    setLoading(false)
  }

  const updateCriteria = (field: keyof SearchCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [field]: value }))
  }

  const togglePropertyType = (type: string) => {
    setCriteria(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }))
  }

  const toggleNeighborhood = (neighborhood: string) => {
    setCriteria(prev => ({
      ...prev,
      neighborhoods: prev.neighborhoods.includes(neighborhood)
        ? prev.neighborhoods.filter(n => n !== neighborhood)
        : [...prev.neighborhoods, neighborhood]
    }))
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 bg-opacity-20 backdrop-blur-sm rounded-full mb-6">
              <Target className="h-4 w-4 text-purple-300 mr-2" />
              <span className="text-sm font-medium text-purple-200">AI-Powered Search</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Development Opportunity Finder
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Search Houston's exclusive off-market development opportunities 
              with advanced filtering and AI-powered recommendations
            </p>
          </div>
        </div>
      </section>

      {/* Search Criteria */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <Filter className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Search Criteria</h2>
            </div>

            {/* Price Range */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Price
                </label>
                <select
                  value={criteria.priceMin}
                  onChange={(e) => updateCriteria('priceMin', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="0">No Minimum</option>
                  <option value="1000000">$1M</option>
                  <option value="2500000">$2.5M</option>
                  <option value="5000000">$5M</option>
                  <option value="10000000">$10M</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Price
                </label>
                <select
                  value={criteria.priceMax}
                  onChange={(e) => updateCriteria('priceMax', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="50000000">No Maximum</option>
                  <option value="5000000">$5M</option>
                  <option value="10000000">$10M</option>
                  <option value="25000000">$25M</option>
                  <option value="50000000">$50M</option>
                </select>
              </div>
            </div>

            {/* Size Range */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Size (acres)
                </label>
                <input
                  type="number"
                  value={criteria.sizeMin}
                  onChange={(e) => updateCriteria('sizeMin', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Size (acres)
                </label>
                <input
                  type="number"
                  value={criteria.sizeMax}
                  onChange={(e) => updateCriteria('sizeMax', parseFloat(e.target.value) || 1000)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1000"
                />
              </div>
            </div>

            {/* ROI and Timeline */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum ROI (%)
                </label>
                <input
                  type="number"
                  value={criteria.roiMin}
                  onChange={(e) => updateCriteria('roiMin', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="15"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Development Timeline
                </label>
                <select
                  value={criteria.timeline}
                  onChange={(e) => updateCriteria('timeline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {timelines.map(timeline => (
                    <option key={timeline.id} value={timeline.id}>{timeline.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property Types */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {propertyTypes.map(type => {
                  const Icon = type.icon
                  const isSelected = criteria.propertyTypes.includes(type.id)
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => togglePropertyType(type.id)}
                      className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Neighborhoods */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neighborhoods
              </label>
              <div className="flex flex-wrap gap-2">
                {neighborhoods.map(neighborhood => {
                  const isSelected = criteria.neighborhoods.includes(neighborhood)
                  
                  return (
                    <button
                      key={neighborhood}
                      onClick={() => toggleNeighborhood(neighborhood)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {neighborhood}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCriteria(defaultCriteria)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Reset Filters
              </button>
              
              <button
                onClick={searchOpportunities}
                disabled={loading}
                className="flex items-center px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search Opportunities
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searched && (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {opportunities.length} Opportunities Found
              </h2>
              
              {opportunities.length > 0 && (
                <div className="flex items-center gap-4">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </button>
                  <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Bell className="h-4 w-4 mr-2" />
                    Save Search
                  </button>
                </div>
              )}
            </div>

            {opportunities.length === 0 ? (
              <div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-xl shadow-sm"
              >
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No opportunities match your criteria
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters to see more results
                </p>
                <button
                  onClick={() => setCriteria(defaultCriteria)}
                  className="text-purple-600 font-medium hover:text-purple-700"
                >
                  Reset filters and search again
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {opportunities.map((opp, index) => (
                  <div
                    key={opp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{opp.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {opp.neighborhood}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{opp.projectedROI}%</div>
                          <div className="text-xs text-gray-600">Projected ROI</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Price</div>
                          <div className="font-bold text-gray-900">{formatCurrency(opp.price)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Size</div>
                          <div className="font-bold text-gray-900">{opp.size} acres</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Type</div>
                          <div className="font-bold text-gray-900">{opp.type}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <h4 className="font-semibold text-gray-900">Key Highlights:</h4>
                        <ul className="space-y-1">
                          {opp.highlights.slice(0, 2).map((highlight, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <span className="text-green-600 mr-2">✓</span>
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          Min. Investment: {formatCurrency(opp.minimumInvestment)}
                        </div>
                        <Link
                          href={`/market-intelligence/investment-opportunities#${opp.id}`}
                          className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <Bell className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Get Notified of New Opportunities
            </h2>
            <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Set up custom alerts and be the first to know when properties 
              matching your criteria become available.
            </p>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
              <LeadCaptureForm 
                source="OPPORTUNITY_FINDER" 
                className="space-y-4"
                buttonText="Set Up Alerts"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}