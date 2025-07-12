'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowLeft, MapPin, TrendingUp, Clock, DollarSign, 
  AlertTriangle, Target, Filter, Download, ChevronRight,
  Building2, Home, Factory, Briefcase
} from 'lucide-react'
import { InvestmentOpportunity, MarketTiming } from '@/lib/core-agents/types'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'
import Script from 'next/script'

interface InvestmentOpportunitiesPageProps {
  opportunities: InvestmentOpportunity[]
  marketTiming: MarketTiming
}

export function InvestmentOpportunitiesPage({ opportunities, marketTiming }: InvestmentOpportunitiesPageProps) {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedROI, setSelectedROI] = useState<string>('all')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Houston Investment Opportunities',
    description: 'Curated list of Houston development investment opportunities',
    numberOfItems: opportunities.length,
    itemListElement: opportunities.map((opp, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: opp.title,
        description: opp.highlights.join('. '),
        price: {
          '@type': 'PriceSpecification',
          price: opp.price,
          priceCurrency: 'USD'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: opp.location,
          addressLocality: opp.neighborhood,
          addressRegion: 'TX',
          addressCountry: 'US'
        }
      }
    }))
  }

  const propertyTypes = ['all', 'Mixed-Use Development', 'Residential Subdivision', 'Office Development', 'Industrial Development']
  const roiRanges = [
    { id: 'all', label: 'All ROI' },
    { id: '20+', label: '20%+ ROI' },
    { id: '25+', label: '25%+ ROI' },
    { id: '30+', label: '30%+ ROI' }
  ]
  const neighborhoods = ['all', ...Array.from(new Set(opportunities.map(o => o.neighborhood)))]

  const filteredOpportunities = opportunities.filter(opp => {
    if (selectedType !== 'all' && opp.type !== selectedType) return false
    if (selectedNeighborhood !== 'all' && opp.neighborhood !== selectedNeighborhood) return false
    if (selectedROI !== 'all') {
      const roiThreshold = parseInt(selectedROI)
      if (opp.projectedROI < roiThreshold) return false
    }
    return true
  })

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'Mixed-Use Development': return Briefcase
      case 'Residential Subdivision': return Home
      case 'Office Development': return Building2
      case 'Industrial Development': return Factory
      default: return Building2
    }
  }

  return (
    <>
      <Script
        id="investment-opportunities-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-purple-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/market-intelligence" 
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Market Intelligence
            </Link>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Investment Opportunities
                </h1>
                <p className="text-xl text-gray-700">
                  Exclusive off-market development sites with detailed ROI analysis
                </p>
              </div>
              
              <div className="hidden md:block">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="text-sm text-gray-600 mb-1">Market Score</div>
                  <div className="text-3xl font-bold text-purple-600">{marketTiming.score}/100</div>
                  <div className="text-sm font-medium text-gray-900">{marketTiming.recommendation}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{opportunities.length}</div>
              <div className="text-sm text-gray-600">Active Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                ${(opportunities.reduce((sum, o) => sum + o.price, 0) / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {(opportunities.reduce((sum, o) => sum + o.projectedROI, 0) / opportunities.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Avg ROI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {opportunities.reduce((sum, o) => sum + o.size, 0).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Total Acres</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Opportunities */}
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
                <h2 className="text-lg font-semibold text-gray-900">Filter Opportunities</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ROI Range
                  </label>
                  <select
                    value={selectedROI}
                    onChange={(e) => setSelectedROI(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {roiRanges.map(range => (
                      <option key={range.id} value={range.id}>{range.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Neighborhood
                  </label>
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {neighborhoods.map(n => (
                      <option key={n} value={n}>
                        {n === 'all' ? 'All Neighborhoods' : n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Opportunities Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {filteredOpportunities.map((opp, index) => {
                const Icon = getPropertyIcon(opp.type)
                
                return (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                            <Icon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{opp.title}</h3>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              {opp.neighborhood}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{opp.projectedROI}%</div>
                          <div className="text-xs text-gray-600">Projected ROI</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600">Price</div>
                          <div className="font-bold text-gray-900">${(opp.price / 1000000).toFixed(1)}M</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600">Size</div>
                          <div className="font-bold text-gray-900">{opp.size} acres</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600">Timeline</div>
                          <div className="font-bold text-gray-900">{opp.timeline}</div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                          Investment Highlights
                        </h4>
                        <ul className="space-y-1">
                          {opp.highlights.slice(0, 3).map((highlight, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <span className="text-green-600 mr-2">✓</span>
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                          Risk Factors
                        </h4>
                        <ul className="space-y-1">
                          {opp.risks.slice(0, 2).map((risk, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <span className="text-orange-600 mr-2">•</span>
                              <span className="text-gray-700">{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <div className="text-sm text-gray-600">Min Investment</div>
                          <div className="font-bold text-gray-900">
                            ${(opp.minimumInvestment / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Target IRR</div>
                          <div className="font-bold text-gray-900">{opp.targetIRR}%</div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <button className="flex-1 mr-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                          Request Details
                        </button>
                        <button className="px-4 py-2 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No opportunities match your current filters.</p>
                <button
                  onClick={() => {
                    setSelectedType('all')
                    setSelectedROI('all')
                    setSelectedNeighborhood('all')
                  }}
                  className="mt-4 text-purple-600 font-medium hover:text-purple-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <Target className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Get Exclusive Access to Off-Market Opportunities
            </h2>
            <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Join our network of qualified investors and receive curated development 
              opportunities before they hit the public market.
            </p>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
              <LeadCaptureForm 
                source="INVESTMENT_OPPORTUNITIES" 
                className="space-y-4"
                buttonText="Get Investment Access"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}