'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Brain, Target, TrendingUp, MapPin, Home, DollarSign,
  Star, Clock, AlertCircle, ChevronRight, Filter,
  BarChart3, Heart, Eye, Calendar, Sparkles, Zap, Building2
} from 'lucide-react'
interface PropertyRecommendation {
  id: string
  property: {
    id: string
    address: string
    neighborhood: string
    price: number
    bedrooms: number
    bathrooms: number
    sqft: number
    type: string
    imageUrl?: string
  }
  score: number
  reasons: string[]
  matchedCriteria: string[]
  potentialROI?: number
  marketTrend?: 'rising' | 'stable' | 'declining'
}

interface AIPropertyRecommendationsProps {
  userId?: string
  onPropertyClick?: (property: any) => void
}

export default function AIPropertyRecommendations({ 
  userId = 'demo-user',
  onPropertyClick 
}: AIPropertyRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchRecommendations()
  }, [userId, selectedCategory])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          category: selectedCategory,
          limit: 10
        })
      })
      
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      // Use mock data for demo
      setRecommendations(getMockRecommendations())
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProperty = (propertyId: string) => {
    const newSaved = new Set(savedProperties)
    if (newSaved.has(propertyId)) {
      newSaved.delete(propertyId)
    } else {
      newSaved.add(propertyId)
    }
    setSavedProperties(newSaved)
  }

  const categories = [
    { id: 'all', label: 'All Recommendations', icon: Sparkles },
    { id: 'investment', label: 'Best ROI', icon: TrendingUp },
    { id: 'development', label: 'Development', icon: Building2 },
    { id: 'trending', label: 'Trending Now', icon: Zap }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Fernando-X is analyzing properties for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="h-6 w-6 text-purple-600 mr-2" />
            AI Property Recommendations
          </h2>
          <p className="text-gray-600 mt-1">
            Personalized properties selected by Fernando-X based on your preferences
          </p>
        </div>
        <button className="p-2 text-gray-600 hover:text-gray-900">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.label}
            </button>
          )
        })}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              {/* Property Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                {rec.property.imageUrl ? (
                  <img 
                    src={rec.property.imageUrl} 
                    alt={rec.property.address}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {/* Match Score Badge */}
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  {rec.matchScore}% Match
                </div>

                {/* Save Button */}
                <button
                  onClick={() => handleSaveProperty(rec.property.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${
                      savedProperties.has(rec.property.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>

                {/* Price */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg">
                  <span className="text-xl font-bold">
                    ${rec.property.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {rec.property.address}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {rec.property.propertyType} • {rec.property.size}
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="mb-4 space-y-2">
                  {rec.reasoning.slice(0, 2).map((reason, idx) => (
                    <div key={idx} className="flex items-start text-sm">
                      <Sparkles className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center text-green-700 text-xs font-medium mb-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Investment
                    </div>
                    <p className="text-sm text-green-900 font-semibold">
                      {rec.insights.investmentPotential}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center text-blue-700 text-xs font-medium mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Timing
                    </div>
                    <p className="text-sm text-blue-900 font-semibold">
                      {rec.insights.marketTiming}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={rec.actions[0].href || '#'}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <button 
                      className="p-2 text-gray-600 hover:text-gray-900"
                      onClick={() => onPropertyClick?.(rec.property)}
                    >
                      <BarChart3 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{Math.round(rec.confidence * 100)}% confidence</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {recommendations.length > 0 && (
        <div className="text-center pt-6">
          <button className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Load More Recommendations
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

function getMockRecommendations(): PropertyRecommendation[] {
  return [
    {
      id: 'rec-1',
      property: {
        id: 'prop-1',
        address: '15234 Cypress Woods Dr, Cypress, TX 77433',
        price: 345000,
        propertyType: 'Single Family',
        size: '3,450 sqft',
        coordinates: { lat: 29.9691, lng: -95.6972 },
        features: ['Pool', 'Updated Kitchen', '3-Car Garage', 'Cy-Fair ISD']
      },
      matchScore: 94,
      reasoning: [
        'Cypress showing 9.8% YoY appreciation - hottest market in Houston',
        'Excellent Cy-Fair schools with 9/10 ratings',
        'Only 1.2 months inventory in 77433 ZIP code',
        'Average days on market: 8 days in this area'
      ],
      insights: {
        marketTiming: 'Hot seller\'s market - act fast',
        investmentPotential: '9.8% annual appreciation',
        riskAssessment: 'Low risk - high demand area',
        comparableAnalysis: 'Priced at market median $345K'
      },
      actions: [
        { label: 'View Details', type: 'view', href: '/properties/prop-1' },
        { label: 'Calculate ROI', type: 'analyze' }
      ],
      confidence: 0.94,
      timestamp: new Date()
    },
    {
      id: 'rec-2',
      property: {
        id: 'prop-2',
        address: '8901 Memorial Dr, Houston, TX 77024',
        price: 875000,
        propertyType: 'Single Family',
        size: '4,200 sqft',
        coordinates: { lat: 29.7805, lng: -95.5505 },
        features: ['Memorial neighborhood', 'Recent renovation', 'Large lot', 'Spring Branch ISD']
      },
      matchScore: 91,
      reasoning: [
        'Memorial area showing stable 4.5% YoY growth',
        'Premium location with mature trees',
        'Spring Branch ISD highly rated schools',
        '3.2 months inventory provides negotiation opportunity'
      ],
      insights: {
        marketTiming: 'Balanced market conditions',
        investmentPotential: '4.5% appreciation + rental potential',
        riskAssessment: 'Very low risk - established area',
        comparableAnalysis: 'Median price $875K for Memorial'
      },
      actions: [
        { label: 'View Details', type: 'view', href: '/properties/prop-2' },
        { label: 'Schedule Tour', type: 'schedule' }
      ],
      confidence: 0.91,
      timestamp: new Date()
    },
    {
      id: 'rec-3',
      property: {
        id: 'prop-3',
        address: '1234 Heights Blvd, Houston, TX 77007',
        price: 685000,
        propertyType: 'Townhome',
        size: '2,800 sqft',
        coordinates: { lat: 29.7805, lng: -95.3988 },
        features: ['The Heights', 'Walkable', 'New Construction', 'Rooftop deck']
      },
      matchScore: 88,
      reasoning: [
        'The Heights hottest urban market - 7.2% YoY growth',
        'Only 18 days average on market',
        'Walking distance to restaurants and shops',
        'Strong millennial buyer demand'
      ],
      insights: {
        marketTiming: 'Extremely hot market',
        investmentPotential: '7.2% appreciation',
        riskAssessment: 'Low risk - high demand',
        comparableAnalysis: '$265 per sqft market rate'
      },
      actions: [
        { label: 'View Details', type: 'view', href: '/properties/prop-3' },
        { label: 'View Comps', type: 'analyze' }
      ],
      confidence: 0.88,
      timestamp: new Date()
    },
    {
      id: 'rec-4',
      property: {
        id: 'prop-4',
        address: '500 Crawford St, Houston, TX 77002',
        price: 425000,
        propertyType: 'Condo',
        size: '1,650 sqft',
        coordinates: { lat: 29.7604, lng: -95.3698 },
        features: ['Downtown', 'High-rise', 'City views', 'Walk to Discovery Green']
      },
      matchScore: 85,
      reasoning: [
        'Downtown experiencing revitalization',
        'Walking distance to major employers',
        'New developments increasing area value',
        'Strong rental demand from professionals'
      ],
      insights: {
        marketTiming: 'Emerging opportunity',
        investmentPotential: 'High rental yield potential',
        riskAssessment: 'Moderate - dependent on downtown growth',
        comparableAnalysis: 'Competitive downtown pricing'
      },
      actions: [
        { label: 'View Details', type: 'view', href: '/properties/prop-4' },
        { label: 'Rental Analysis', type: 'analyze' }
      ],
      confidence: 0.85,
      timestamp: new Date()
    }
  ]
}