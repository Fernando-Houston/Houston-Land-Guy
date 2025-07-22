'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Building2,
  Percent,
  Shield,
  Target,
  CheckCircle,
  AlertTriangle,
  Download,
  Share2,
  Heart,
  Phone,
  Mail,
  Calculator,
  BarChart3,
  Info
} from 'lucide-react'

interface DealDetail {
  id: string
  title: string
  location: string
  neighborhood: string
  type: string
  price: number
  size: number
  projectedROI: number
  highlights: string[]
  risks: string[]
  timeline: string
  minimumInvestment: number
  targetIRR: number
  exitStrategy: string
  images: string[]
  actualProperty: boolean
  propertyData: {
    beds?: number
    baths?: number
    sqft?: number
    yearBuilt?: number
    zipCode?: string
    mlsNumber?: string
  }
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<DealDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadDealDetails()
  }, [params.id])

  const loadDealDetails = async () => {
    try {
      // Get all opportunities and find the specific one
      const response = await fetch('/api/investment-opportunities')
      const data = await response.json()
      const foundDeal = data.opportunities.find((opp: DealDetail) => opp.id === params.id)
      
      if (foundDeal) {
        setDeal(foundDeal)
      } else {
        router.push('/investment-opportunities/deals')
      }
    } catch (error) {
      console.error('Error loading deal details:', error)
      router.push('/investment-opportunities/deals')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Deal Not Found</h2>
          <p className="text-gray-600 mb-4">The investment opportunity you're looking for doesn't exist.</p>
          <Link
            href="/investment-opportunities/deals"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/investment-opportunities/deals"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Deals
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
                <div className="flex items-center mt-1 text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {deal.location}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Phone className="h-4 w-4 mr-2" />
                Contact Advisor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="aspect-video bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-900">
                  {deal.type}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-3xl font-bold mb-2">{deal.projectedROI}% Projected ROI</div>
                <div className="text-lg">{deal.neighborhood}</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'financials', label: 'Financials' },
                  { id: 'analysis', label: 'Market Analysis' },
                  { id: 'documents', label: 'Documents' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {deal.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Considerations</h3>
                    <div className="space-y-3">
                      {deal.risks.map((risk, index) => (
                        <div key={index} className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Exit Strategy</h3>
                    <p className="text-gray-700">{deal.exitStrategy}</p>
                  </div>

                  {deal.propertyData.mlsNumber && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {deal.propertyData.beds && (
                          <div>
                            <span className="text-gray-500">Bedrooms</span>
                            <div className="font-medium">{deal.propertyData.beds}</div>
                          </div>
                        )}
                        {deal.propertyData.baths && (
                          <div>
                            <span className="text-gray-500">Bathrooms</span>
                            <div className="font-medium">{deal.propertyData.baths}</div>
                          </div>
                        )}
                        {deal.propertyData.sqft && (
                          <div>
                            <span className="text-gray-500">Square Feet</span>
                            <div className="font-medium">{deal.propertyData.sqft.toLocaleString()}</div>
                          </div>
                        )}
                        {deal.propertyData.yearBuilt && (
                          <div>
                            <span className="text-gray-500">Year Built</span>
                            <div className="font-medium">{deal.propertyData.yearBuilt}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          ${(deal.price / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-gray-600">Total Investment</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {deal.projectedROI}%
                        </div>
                        <div className="text-gray-600">Projected ROI</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          ${(deal.minimumInvestment / 1000).toFixed(0)}K
                        </div>
                        <div className="text-gray-600">Minimum Investment</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {deal.targetIRR}%
                        </div>
                        <div className="text-gray-600">Target IRR</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Timeline</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-blue-900 font-medium">Expected Timeline: {deal.timeline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Analysis</h3>
                    <p className="text-gray-700 mb-6">
                      This investment opportunity is located in {deal.neighborhood}, one of Houston's growing markets. 
                      Our AI analysis indicates strong fundamentals and growth potential.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">Market Growth</div>
                        <div className="text-sm text-gray-600">Strong upward trend</div>
                      </div>
                      <div className="text-center">
                        <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">Development Activity</div>
                        <div className="text-sm text-gray-600">High construction volume</div>
                      </div>
                      <div className="text-center">
                        <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">Investment Grade</div>
                        <div className="text-sm text-gray-600">Institutional quality</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Documents</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Investment Memorandum', type: 'PDF', size: '2.4 MB' },
                        { name: 'Financial Projections', type: 'Excel', size: '1.2 MB' },
                        { name: 'Market Analysis Report', type: 'PDF', size: '3.1 MB' },
                        { name: 'Property Survey', type: 'PDF', size: '5.2 MB' }
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <Download className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.type} • {doc.size}</div>
                            </div>
                          </div>
                          <button className="text-green-600 hover:text-green-700 font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Advisor</h3>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
                <div className="font-medium text-gray-900">Houston Investment Team</div>
                <div className="text-sm text-gray-600">Commercial Real Estate</div>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule Call
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Quick Calculator */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Investment Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      placeholder="500,000"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Projected Return</span>
                    <span className="font-semibold text-green-600">{deal.projectedROI}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estimated Annual Return</span>
                    <span className="font-semibold text-gray-900">$91,500</span>
                  </div>
                </div>
                <Link
                  href="/roi-calculator"
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Full Calculator
                </Link>
              </div>
            </div>

            {/* Related Opportunities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Opportunities</h3>
              <div className="space-y-3">
                <Link href="/investment-opportunities/deals" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="font-medium text-gray-900 text-sm">Similar {deal.type} Deals</div>
                  <div className="text-xs text-gray-600 mt-1">3 opportunities available</div>
                </Link>
                <Link href="/investment-opportunities/deals" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="font-medium text-gray-900 text-sm">{deal.neighborhood} Properties</div>
                  <div className="text-xs text-gray-600 mt-1">5 opportunities available</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}