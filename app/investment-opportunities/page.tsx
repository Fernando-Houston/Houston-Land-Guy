'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  TrendingUp, DollarSign, Building2, MapPin, Clock, Users,
  BarChart3, Shield, Download, CheckCircle, Star, Filter,
  ArrowRight, FileText, Calculator, Briefcase, Target
} from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'
import { PropertyMap } from '@/components/maps/MapWrapper'

interface InvestmentOpportunity {
  id: string
  title: string
  location: string
  type: string
  investmentRange: string
  targetROI: string
  timeline: string
  status: 'active' | 'funded' | 'coming-soon'
  highlights: string[]
  minimumInvestment: number
}

// Helper function to get coordinates for investment locations
function getInvestmentLocation(location: string): { lat: number; lng: number } {
  const locationMap: Record<string, { lat: number; lng: number }> = {
    'The Woodlands': { lat: 30.1658, lng: -95.4613 },
    'Katy': { lat: 29.7858, lng: -95.8245 },
    'East Houston': { lat: 29.7794, lng: -95.3271 },
    'Sugar Land': { lat: 29.5994, lng: -95.6348 },
    'Inner Loop': { lat: 29.7472, lng: -95.3902 }
  }
  
  return locationMap[location] || { lat: 29.7604, lng: -95.3698 }
}

export default function InvestmentOpportunitiesPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

  const opportunities: InvestmentOpportunity[] = [
    {
      id: '001',
      title: 'Woodlands Medical Plaza Development',
      location: 'The Woodlands',
      type: 'Medical Office',
      investmentRange: '$2.5M - $4M',
      targetROI: '22-25%',
      timeline: '24 months',
      status: 'active',
      highlights: [
        '45,000 sq ft medical office complex',
        'Pre-leased 60% to major healthcare system',
        'Adjacent to new hospital expansion'
      ],
      minimumInvestment: 100000
    },
    {
      id: '002',
      title: 'Katy Master-Planned Community Phase II',
      location: 'Katy',
      type: 'Residential',
      investmentRange: '$5M - $8M',
      targetROI: '24-28%',
      timeline: '36 months',
      status: 'active',
      highlights: [
        '320 single-family lots',
        'Top-rated Katy ISD schools',
        'Phase I sold out in 18 months'
      ],
      minimumInvestment: 250000
    },
    {
      id: '003',
      title: 'East Houston Industrial Park',
      location: 'East Houston',
      type: 'Industrial',
      investmentRange: '$3M - $5M',
      targetROI: '20-23%',
      timeline: '18 months',
      status: 'active',
      highlights: [
        '150,000 sq ft distribution facility',
        '10 minutes from Port of Houston',
        'Rail-served site'
      ],
      minimumInvestment: 150000
    },
    {
      id: '004',
      title: 'Sugar Land Corporate Campus',
      location: 'Sugar Land',
      type: 'Office',
      investmentRange: '$6M - $10M',
      targetROI: '18-21%',
      timeline: '30 months',
      status: 'coming-soon',
      highlights: [
        'Class A office development',
        'Energy sector tenant focus',
        'LEED Gold certification planned'
      ],
      minimumInvestment: 500000
    }
  ]

  const performanceMetrics = {
    totalDeployed: '$483M+',
    avgReturns: '18.2%',
    activeProjects: '12',
    investorCount: '147'
  }

  const investmentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Medical Office', label: 'Medical Office' },
    { value: 'Office', label: 'Office' },
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Mixed-Use', label: 'Mixed-Use' }
  ]

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'The Woodlands', label: 'The Woodlands' },
    { value: 'Katy', label: 'Katy' },
    { value: 'Sugar Land', label: 'Sugar Land' },
    { value: 'East Houston', label: 'East Houston' },
    { value: 'Inner Loop', label: 'Inner Loop' }
  ]

  const filteredOpportunities = opportunities.filter(opp => {
    const typeMatch = selectedType === 'all' || opp.type === selectedType
    const locationMatch = selectedLocation === 'all' || opp.location === selectedLocation
    return typeMatch && locationMatch
  })

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-green-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Houston Development <span className="gradient-text">Investment Opportunities</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Access exclusive, pre-vetted development projects in Houston's fastest-growing markets. 
              Join sophisticated investors earning 18%+ returns through strategic land development partnerships.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link 
                href="#opportunities"
                className="cta-primary"
              >
                View Current Opportunities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors">
                <Download className="h-5 w-5 mr-2" />
                Download Investment Guide
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{performanceMetrics.totalDeployed}</div>
              <div className="text-sm text-gray-600 mt-1">Capital Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{performanceMetrics.avgReturns}</div>
              <div className="text-sm text-gray-600 mt-1">Average IRR</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{performanceMetrics.activeProjects}</div>
              <div className="text-sm text-gray-600 mt-1">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{performanceMetrics.investorCount}</div>
              <div className="text-sm text-gray-600 mt-1">Investor Partners</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section id="opportunities" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Investment Opportunities</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Pre-vetted development projects with strong fundamentals and experienced operating partners
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="form-input py-2"
                >
                  {investmentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="form-input py-2"
                >
                  {locations.map(location => (
                    <option key={location.value} value={location.value}>{location.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Opportunity Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{opportunity.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {opportunity.location}
                          </span>
                          <span className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {opportunity.type}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        opportunity.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : opportunity.status === 'funded'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {opportunity.status === 'active' ? 'Accepting Investors' : 
                         opportunity.status === 'funded' ? 'Fully Funded' : 'Coming Soon'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Target ROI</div>
                        <div className="text-xl font-bold text-green-600">{opportunity.targetROI}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Timeline</div>
                        <div className="text-xl font-bold text-blue-600">{opportunity.timeline}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Investment Range</div>
                      <div className="text-lg font-semibold text-gray-900">{opportunity.investmentRange}</div>
                      <div className="text-sm text-gray-600">Min. Investment: ${opportunity.minimumInvestment.toLocaleString()}</div>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-700 mb-2">Key Highlights</div>
                      <ul className="space-y-1">
                        {opportunity.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {opportunity.status === 'active' && (
                      <button className="w-full cta-primary">
                        Request Investment Details
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Map */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Investment Properties Map</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore investment opportunities across Houston's prime development corridors
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <PropertyMap
                height="500px"
                showSearch={true}
                markers={filteredOpportunities.map(opp => ({
                  id: opp.id,
                  position: getInvestmentLocation(opp.location),
                  title: opp.title,
                  description: `${opp.type} • ${opp.investmentRange} • ${opp.targetROI} ROI`
                }))}
                zoom={10}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Investment Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Initial Consultation</h3>
                <p className="text-sm text-gray-600">
                  Discuss your investment goals and review current opportunities
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Due Diligence</h3>
                <p className="text-sm text-gray-600">
                  Review detailed project information, financials, and projections
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Investment Structure</h3>
                <p className="text-sm text-gray-600">
                  Finalize investment terms, structure, and legal documentation
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-600">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Active Management</h3>
                <p className="text-sm text-gray-600">
                  Regular updates and distributions throughout the project lifecycle
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Track Record */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Proven Track Record</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Successful Exits</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">Cypress Creek Business Park</h4>
                        <p className="text-sm text-gray-600">Industrial Development - 2023 Exit</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">26.4% IRR</div>
                        <div className="text-sm text-gray-600">2.2x Multiple</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">Katy Commons Retail Center</h4>
                        <p className="text-sm text-gray-600">Retail Development - 2023 Exit</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">19.8% IRR</div>
                        <div className="text-sm text-gray-600">1.8x Multiple</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">Woodlands Medical Pavilion</h4>
                        <p className="text-sm text-gray-600">Medical Office - 2022 Exit</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">22.1% IRR</div>
                        <div className="text-sm text-gray-600">2.0x Multiple</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Why Houston Development?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">No State Income Tax</h4>
                      <p className="text-sm text-gray-600">Maximize your investment returns</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Population Growth</h4>
                      <p className="text-sm text-gray-600">100,000+ new residents annually</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">No Zoning Restrictions</h4>
                      <p className="text-sm text-gray-600">Flexible development opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Diverse Economy</h4>
                      <p className="text-sm text-gray-600">Beyond oil & gas - healthcare, tech, aerospace</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Lower Development Costs</h4>
                      <p className="text-sm text-gray-600">35-50% lower land costs than Austin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Criteria */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Investment Criteria</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                <Target className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Minimum Investment</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">$100,000</p>
                <p className="text-sm text-gray-600">
                  Varies by project type and structure. Some opportunities available at $50K.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                <Briefcase className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Investor Type</h3>
                <p className="text-sm text-gray-600">
                  Accredited investors, family offices, institutions, and qualified purchasers
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <Clock className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Investment Timeline</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">18-36 Months</p>
                <p className="text-sm text-gray-600">
                  Most projects complete within 2-3 years with regular distributions
                </p>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Deal Structures We Offer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Joint Ventures</h4>
                  <p className="text-sm text-gray-600">
                    Partner directly in development projects with profit sharing based on contribution
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Preferred Equity</h4>
                  <p className="text-sm text-gray-600">
                    Fixed preferred returns with upside participation in project success
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Syndications</h4>
                  <p className="text-sm text-gray-600">
                    Pool investments for larger projects with professional management
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Debt Investments</h4>
                  <p className="text-sm text-gray-600">
                    Secured lending opportunities with fixed returns and asset backing
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investor Resources */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Investor Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/roi-calculator" className="group">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <Calculator className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    ROI Calculator
                  </h3>
                  <p className="text-sm text-gray-600">
                    Calculate potential returns on Houston development investments
                  </p>
                </div>
              </Link>
              
              <Link href="/blog/houston-development-market-report-q1-2024" className="group">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <BarChart3 className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    Market Reports
                  </h3>
                  <p className="text-sm text-gray-600">
                    Latest Houston development market analysis and trends
                  </p>
                </div>
              </Link>
              
              <div className="group cursor-pointer">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <FileText className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    Investment Guide
                  </h3>
                  <p className="text-sm text-gray-600">
                    Download our comprehensive Houston investment guide
                  </p>
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <Shield className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    Due Diligence Checklist
                  </h3>
                  <p className="text-sm text-gray-600">
                    Essential checklist for evaluating development deals
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Investors Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The team's local expertise and track record gave us confidence to invest. Our Katy 
                  project delivered 24% IRR, exceeding projections."
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-gray-600">Family Office Investor</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Transparent communication and detailed reporting throughout the project. The Woodlands 
                  medical office investment performed exactly as modeled."
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Sarah Williams</div>
                  <div className="text-gray-600">Accredited Investor</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "We've partnered on 3 Houston projects now. The deal flow quality and execution have 
                  been consistently excellent."
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Robert Martinez</div>
                  <div className="text-gray-600">Private Equity Partner</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to Explore Investment Opportunities?
              </h3>
              <p className="text-gray-600">
                Schedule a confidential consultation to discuss your investment goals and review current opportunities
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <LeadCaptureForm source="INVESTMENT_OPPORTUNITIES" />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Or call us directly at{' '}
                <a href="tel:713-555-LAND" className="font-semibold text-green-600 hover:text-green-700">
                  (713) 555-LAND
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}