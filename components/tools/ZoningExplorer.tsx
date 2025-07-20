'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, AlertCircle, Calendar, FileText, CheckCircle, 
  Clock, DollarSign, Building2, Home, Factory, Store,
  TrendingUp, ArrowRight, Filter, Search
} from 'lucide-react'
import { houstonDataService } from '@/lib/services/houston-data-service'

interface ZoningData {
  zone: string
  description: string
  allowedUses: string[]
  restrictions: string[]
  permitRequirements: string[]
  developmentStandards: {
    maxHeight: string
    setbacks: string
    parkingRatio: string
    lot Coverage: string
  }
  recentChanges?: string[]
}

interface RegulatoryUpdate {
  category: string
  currentStatus: string
  updates2025: string
  effectiveDate: string
  developmentImpact: string
}

export default function ZoningExplorer() {
  const [selectedZone, setSelectedZone] = useState<string>('all')
  const [regulatoryData, setRegulatoryData] = useState<RegulatoryUpdate[]>([])
  const [developmentTrends, setDevelopmentTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [regulatory, trends] = await Promise.all([
          houstonDataService.getRegulatoryData(),
          houstonDataService.getDevelopmentTrends()
        ])
        setRegulatoryData(regulatory)
        setDevelopmentTrends(trends)
      } catch (error) {
        console.error('Error loading zoning data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Houston zoning categories (Harris County has no traditional zoning)
  const zoningCategories = [
    {
      id: 'subdivision',
      name: 'Subdivision Ordinances',
      icon: Home,
      color: 'green',
      description: 'Harris County uses subdivision ordinances instead of traditional zoning',
      allowedUses: ['Single-family residential', 'Agricultural', 'Rural residential'],
      restrictions: ['Deed restrictions apply', 'Minimum lot sizes vary', 'Setback requirements'],
      impact: 'Flexibility but reliance on deed restrictions'
    },
    {
      id: 'deed-restrictions',
      name: 'Deed Restrictions',
      icon: FileText,
      color: 'blue',
      description: 'Private deed restrictions control land use in many areas',
      allowedUses: ['Varies by restriction', 'Residential communities', 'Commercial centers'],
      restrictions: ['HOA enforcement', 'Architectural review', 'Use limitations'],
      impact: 'No comprehensive land use planning'
    },
    {
      id: 'sb-840',
      name: 'Texas SB 840 (Sept 2025)',
      icon: Building2,
      color: 'purple',
      description: 'Commercial-to-residential conversion by right',
      allowedUses: ['Multifamily conversion', 'Mixed-use development', 'Streamlined approvals'],
      restrictions: ['Municipal restrictions limited', 'Building code compliance', 'Safety standards'],
      impact: 'Streamlined multifamily development in commercial zones'
    },
    {
      id: 'opportunity-zones',
      name: 'Opportunity Zones',
      icon: TrendingUp,
      color: 'orange',
      description: 'Tax incentive zones for development',
      allowedUses: ['Mixed-use projects', 'Industrial development', 'Housing projects'],
      restrictions: ['Capital gains deferral rules', '10-year hold requirement', 'Qualified investments'],
      impact: 'Tax benefits for long-term development'
    }
  ]

  const filteredRegulatory = regulatoryData.filter(item =>
    selectedZone === 'all' || 
    item.category.toLowerCase().includes(selectedZone.toLowerCase()) ||
    searchQuery === '' ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.updates2025.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Houston Zoning & Regulatory Explorer
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Harris County operates without traditional zoning, relying on subdivision ordinances and deed restrictions. 
          Explore regulatory changes and development opportunities including Texas SB 840 (Sept 2025).
        </p>
      </div>

      {/* Key Regulatory Updates Alert */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Major Regulatory Changes 2024-2025
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-purple-900">Texas SB 840</div>
                <div className="text-sm text-purple-700">Commercial-to-residential conversion by right (Sept 1, 2025)</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-green-900">30-Day Permit Pilot</div>
                <div className="text-sm text-green-700">Fast-track single-family permits (July 7, 2025)</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-orange-900">ETJ Opt-Out</div>
                <div className="text-sm text-orange-700">Developers can bypass city regulations in ETJ areas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search regulations, zones, or impacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="zoning">Zoning Laws</option>
          <option value="building">Building Codes</option>
          <option value="permit">Permitting</option>
          <option value="sb">Senate Bills</option>
        </select>
      </div>

      {/* Zoning Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {zoningCategories.map((zone, index) => {
          const IconComponent = zone.icon
          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
            >
              <div className={`p-3 bg-${zone.color}-100 rounded-lg w-fit mb-4`}>
                <IconComponent className={`h-6 w-6 text-${zone.color}-600`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{zone.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{zone.description}</p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Allowed Uses</div>
                {zone.allowedUses.slice(0, 2).map((use, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                    {use}
                  </div>
                ))}
              </div>
              <div className={`text-xs bg-${zone.color}-50 text-${zone.color}-700 px-2 py-1 rounded`}>
                {zone.impact}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Regulatory Data Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">2024-2025 Regulatory Changes</h3>
          <p className="text-gray-600 mt-1">
            Active regulatory updates affecting Houston development ({filteredRegulatory.length} items)
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2025 Updates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Development Impact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegulatory.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.category.includes('SB') && <Building2 className="h-4 w-4 text-purple-600 mr-2" />}
                      {item.category.includes('Permit') && <Clock className="h-4 w-4 text-blue-600 mr-2" />}
                      {item.category.includes('Code') && <FileText className="h-4 w-4 text-green-600 mr-2" />}
                      <div className="text-sm font-medium text-gray-900">{item.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{item.currentStatus}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.updates2025}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{item.effectiveDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{item.developmentImpact}</div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Development Trends Impact */}
      <div className="grid md:grid-cols-3 gap-6">
        {developmentTrends.slice(0, 3).map((trend, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{trend.category}</h3>
            </div>
            <div className="text-sm text-gray-600 mb-3">{trend.keyMetrics}</div>
            <div className="text-sm text-blue-600 font-medium mb-2">Focus: {trend.geographicFocus}</div>
            <div className="flex flex-wrap gap-1">
              {trend.keyPlayers.slice(0, 3).map((player: string, idx: number) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {player}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Need Regulatory Guidance?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Navigate Houston's unique regulatory environment with expert guidance on subdivision ordinances, 
          deed restrictions, and new legislation like Texas SB 840.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Schedule Consultation
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
          <button className="inline-flex items-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
            Download Regulatory Guide
          </button>
        </div>
      </div>
    </div>
  )
}