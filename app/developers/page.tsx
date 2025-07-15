'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Building2, TrendingUp, DollarSign, MapPin, Clock, Shield, 
  CheckCircle, ArrowRight, Download, Calendar, Phone, Mail,
  Calculator, FileText, Users, BarChart3, Star, ChevronRight,
  Lightbulb, Award, Target, Filter, Search
} from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'
import { PropertyMap } from '@/components/maps/MapWrapper'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Enhanced property data with SEO keywords
const featuredOpportunities = [
  {
    id: 1,
    title: "Premier Mixed-Use Development Site - Katy",
    location: "Katy, TX 77494",
    acreage: "10.5 acres",
    price: "$3.2M",
    pricePerAcre: "$304,761",
    zoning: "Commercial/Mixed-Use",
    potential: "150+ luxury apartments or 200K sq ft retail",
    highlights: ["Grand Parkway frontage", "Katy ISD schools", "All utilities available"],
    type: "Mixed-Use",
    status: "exclusive"
  },
  {
    id: 2,
    title: "Medical Office Development - The Woodlands",
    location: "The Woodlands, TX 77380",
    acreage: "2.8 acres",
    price: "$1.8M",
    pricePerAcre: "$642,857",
    zoning: "Medical/Professional",
    potential: "35,000 sq ft medical plaza",
    highlights: ["Adjacent to Memorial Hermann", "High traffic count", "Established medical corridor"],
    type: "Medical",
    status: "new"
  },
  {
    id: 3,
    title: "Urban Townhome Development - Montrose",
    location: "Houston, TX 77006",
    acreage: "0.82 acres",
    price: "$2.4M",
    pricePerAcre: "$2,926,829",
    zoning: "Urban Residential",
    potential: "16-20 luxury townhomes",
    highlights: ["Walk score 95", "No deed restrictions", "Minutes to downtown"],
    type: "Residential",
    status: "hot"
  },
  {
    id: 4,
    title: "Industrial Flex Space - East Houston",
    location: "Houston, TX 77020",
    acreage: "5.2 acres",
    price: "$1.6M",
    pricePerAcre: "$307,692",
    zoning: "Light Industrial",
    potential: "60,000 sq ft warehouse/flex",
    highlights: ["Rail adjacent", "10 min to Port Houston", "Foreign Trade Zone"],
    type: "Industrial",
    status: "exclusive"
  },
  {
    id: 5,
    title: "Master-Planned Community Phase - Sugar Land",
    location: "Sugar Land, TX 77479",
    acreage: "42 acres",
    price: "$8.4M",
    pricePerAcre: "$200,000",
    zoning: "Planned Development",
    potential: "200+ single-family homes",
    highlights: ["Fort Bend ISD", "Existing infrastructure", "HOA approved plans"],
    type: "Residential",
    status: "new"
  },
  {
    id: 6,
    title: "Retail Power Center Site - Cypress",
    location: "Cypress, TX 77429",
    acreage: "8.3 acres",
    price: "$4.1M",
    pricePerAcre: "$493,975",
    zoning: "Commercial Retail",
    potential: "80,000 sq ft shopping center",
    highlights: ["290 frontage", "200K population in 5 miles", "No competition nearby"],
    type: "Retail",
    status: "hot"
  }
]

// Developer testimonials for social proof
const testimonials = [
  {
    name: "David Chen",
    company: "Apex Development Group",
    project: "Katy Master-Planned Community",
    quote: "Houston Development Intelligence found us an off-market 45-acre site that perfectly fit our criteria. Their market knowledge saved us 6 months and $2M.",
    rating: 5,
    image: "/developer-1.jpg"
  },
  {
    name: "Sarah Martinez",
    company: "Urban Living Partners",
    project: "Montrose Townhome Development",
    quote: "The due diligence package was incredibly thorough. They identified deed restriction issues that would have killed our project. True professionals.",
    rating: 5,
    image: "/developer-2.jpg"
  },
  {
    name: "Robert Thompson",
    company: "Gulf Coast Commercial",
    project: "Woodlands Medical Plaza",
    quote: "15 years of working together. They've sourced over $50M in development sites for us. No one knows Houston land better.",
    rating: 5,
    image: "/developer-3.jpg"
  }
]

// Helper function to get coordinates based on location
function getPropertyCoordinates(location: string): { lat: number; lng: number } {
  const locationMap: Record<string, { lat: number; lng: number }> = {
    'Katy, TX 77494': { lat: 29.7858, lng: -95.8245 },
    'The Woodlands, TX 77380': { lat: 30.1658, lng: -95.4613 },
    'Houston, TX 77006': { lat: 29.7373, lng: -95.3903 },
    'Houston, TX 77020': { lat: 29.7794, lng: -95.3271 },
    'Sugar Land, TX 77479': { lat: 29.5994, lng: -95.6348 },
    'Cypress, TX 77429': { lat: 29.9691, lng: -95.6972 }
  }
  
  return locationMap[location] || { lat: 29.7604, lng: -95.3698 }
}

export default function DevelopersPage() {
  const [metrics, setMetrics] = useState({
    years: 0,
    transactions: 0,
    properties: 0,
    success: 0
  })
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Animated counter effect
  useEffect(() => {
    const duration = 2000
    const steps = 50
    const interval = duration / steps

    const incrementMetrics = () => {
      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        setMetrics({
          years: Math.floor((15 * currentStep) / steps),
          transactions: Math.floor((483 * currentStep) / steps),
          properties: Math.floor((1200 * currentStep) / steps),
          success: Math.floor((95 * currentStep) / steps)
        })
        
        if (currentStep >= steps) {
          clearInterval(timer)
          setMetrics({ years: 15, transactions: 483, properties: 1200, success: 95 })
        }
      }, interval)
    }

    incrementMetrics()
  }, [])

  // Filter opportunities
  const filteredOpportunities = featuredOpportunities.filter(opp => {
    const matchesType = selectedType === 'all' || opp.type === selectedType
    const matchesSearch = searchQuery === '' || 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <>
      {/* SEO-Optimized Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          {/* Breadcrumbs for SEO */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                <span className="text-white">Developers</span>
              </li>
            </ol>
          </nav>

          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Houston Land Development 
              <span className="block text-green-400 mt-2">Partner & Acquisition Expert</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Exclusive off-market land deals • Comprehensive due diligence • 15+ years local expertise
              <span className="block mt-2">Trusted by 500+ developers with $483M+ in successful transactions</span>
            </p>
            
            {/* Enhanced Trust badges */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mb-10"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                <Shield className="w-5 h-5 text-green-400" />
                <span>Licensed Texas Broker</span>
              </motion.div>
              <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                <Award className="w-5 h-5 text-green-400" />
                <span>HAR Top Producer</span>
              </motion.div>
              <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                <Users className="w-5 h-5 text-green-400" />
                <span>500+ Developer Network</span>
              </motion.div>
              <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                <Clock className="w-5 h-5 text-green-400" />
                <span>24-Hour Response</span>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <a href="#opportunities" className="cta-primary inline-flex items-center justify-center">
                View Off-Market Opportunities
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a href="#contact" className="cta-secondary bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                Schedule Strategy Call
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section with Schema */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">{metrics.years}+</div>
              <div className="text-gray-600 mt-2">Years Houston Experience</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">${metrics.transactions}M+</div>
              <div className="text-gray-600 mt-2">Total Transactions</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">{metrics.properties}+</div>
              <div className="text-gray-600 mt-2">Sites Analyzed</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">{metrics.success}%</div>
              <div className="text-gray-600 mt-2">Deal Success Rate</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Houston Development Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From land acquisition to project completion, we're your strategic partner in Houston real estate development
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: MapPin,
                title: "Off-Market Land Sourcing",
                description: "Exclusive access to pocket listings, distressed properties, and direct owner relationships across Harris County.",
                keywords: ["off-market land", "Houston pocket listings", "exclusive properties"]
              },
              {
                icon: Calculator,
                title: "Development Analysis",
                description: "Comprehensive feasibility studies, ROI projections, and highest & best use analysis for every site.",
                keywords: ["feasibility study", "ROI analysis", "development pro forma"]
              },
              {
                icon: FileText,
                title: "Due Diligence Package",
                description: "Complete property research: deed restrictions, flood zones, utilities, environmental, and entitlements.",
                keywords: ["due diligence", "deed restrictions", "property research"]
              },
              {
                icon: Building2,
                title: "Entitlement Navigation",
                description: "Expert guidance through Houston's unique no-zoning regulations and permit processes.",
                keywords: ["Houston permits", "development regulations", "entitlements"]
              },
              {
                icon: Users,
                title: "Developer Network",
                description: "Connect with pre-vetted architects, engineers, contractors, and capital partners.",
                keywords: ["development team", "Houston contractors", "capital partners"]
              },
              {
                icon: TrendingUp,
                title: "Market Intelligence",
                description: "Data-driven insights on Houston's hottest neighborhoods and emerging development corridors.",
                keywords: ["market analysis", "Houston growth areas", "development trends"]
              }
            ].map((service, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={fadeInUp}
              >
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.keywords.map((keyword, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Featured Opportunities with Filtering */}
      <section id="opportunities" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Exclusive Houston Development Sites
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Off-market opportunities in Houston's fastest-growing submarkets
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Mixed-Use">Mixed-Use</option>
              <option value="Medical">Medical</option>
              <option value="Industrial">Industrial</option>
              <option value="Retail">Retail</option>
            </select>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {filteredOpportunities.map((property) => (
              <motion.div 
                key={property.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                variants={fadeInUp}
              >
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      property.status === 'exclusive' ? 'bg-purple-500 text-white' :
                      property.status === 'new' ? 'bg-green-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {property.status === 'exclusive' ? 'Exclusive' :
                       property.status === 'new' ? 'New Listing' : 'Hot Deal'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded">
                    {property.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-gray-500 text-sm">Size</span>
                      <p className="font-semibold">{property.acreage}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Price</span>
                      <p className="font-semibold text-green-600">{property.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Zoning</span>
                      <p className="font-semibold text-sm">{property.zoning}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">$/Acre</span>
                      <p className="font-semibold text-sm">{property.pricePerAcre}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-gray-500 text-sm">Development Potential</span>
                    <p className="font-medium text-green-600">{property.potential}</p>
                  </div>

                  <div className="space-y-1 mb-4">
                    {property.highlights.map((highlight, idx) => (
                      <p key={idx} className="text-sm text-gray-600 flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                        {highlight}
                      </p>
                    ))}
                  </div>
                  
                  <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                    Request Full Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              + 20 more off-market opportunities available to qualified developers
            </p>
            <Link 
              href="/investment-opportunities"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-lg"
            >
              View All Properties
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Property Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Development Sites Across Houston
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Interactive map showing current development opportunities in Houston's hottest submarkets
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <PropertyMap
                height="600px"
                showSearch={true}
                markers={filteredOpportunities.map(opp => ({
                  id: opp.id.toString(),
                  position: getPropertyCoordinates(opp.location),
                  title: opp.title,
                  description: `${opp.acreage} • ${opp.price} • ${opp.zoning}`
                }))}
                zoom={10}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Houston's Top Developers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See why 500+ developers choose us for their Houston land acquisition needs
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 rounded-xl p-8"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                  <p className="text-sm text-green-600">{testimonial.project}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Developer Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Free Houston Development Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential tools and guides for successful Houston development projects
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "2024 Houston Development Guide",
                type: "PDF Guide (47 pages)",
                icon: FileText,
                description: "Complete guide to regulations, permits, and best practices",
                link: "/resources"
              },
              {
                title: "Development ROI Calculator",
                type: "Interactive Tool",
                icon: Calculator,
                description: "Calculate returns for any Houston development project",
                link: "/roi-calculator"
              },
              {
                title: "Houston Zoning Map",
                type: "Interactive Map",
                icon: MapPin,
                description: "Deed restrictions and development zones by neighborhood",
                link: "/resources"
              },
              {
                title: "Q1 2024 Market Report",
                type: "Market Analysis",
                icon: BarChart3,
                description: "$2.3B in permits, hottest submarkets, and trends",
                link: "/blog/houston-development-market-report-q1-2024"
              }
            ].map((resource, index) => (
              <motion.div 
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                variants={fadeInUp}
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <resource.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                <p className="text-sm text-green-600 mb-3">{resource.type}</p>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <Link 
                  href={resource.link}
                  className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Access Resource
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section for Schema */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Developer FAQs
            </h2>
            
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How do you find off-market development sites?
                </h3>
                <p className="text-gray-600">
                  We leverage 15+ years of relationships with landowners, estates, and institutions. 
                  Our network includes exclusive pocket listings, distressed properties, and direct 
                  owner connections across Harris County. We also use proprietary data analysis to 
                  identify undervalued sites before they hit the market.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What size projects do you typically work with?
                </h3>
                <p className="text-gray-600">
                  We work with projects from 5-acre residential developments to 100+ acre master-planned 
                  communities. Our sweet spot is 10-50 acre sites for residential, commercial, and 
                  mixed-use developments. We've successfully closed deals from $500K to $25M+.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Do you co-invest or partner on deals?
                </h3>
                <p className="text-gray-600">
                  Yes, we offer various partnership structures including joint ventures, co-investments, 
                  and traditional fee-based acquisition services. We can also connect you with our 
                  network of capital partners for larger projects. Each deal is structured based on 
                  the specific opportunity and developer needs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Find Your Next Houston Development Site?
              </h2>
              <p className="text-xl mb-8 text-green-50">
                Schedule a confidential consultation to discuss your development criteria and 
                review current off-market opportunities.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Direct Line</h3>
                    <p className="text-green-50">(713) 555-LAND</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-green-50">developers@houstonlandguy.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Office</h3>
                    <p className="text-green-50">1000 Main Street, Suite 2300<br />Houston, Texas 77002</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Why Partner With Houston Development Intelligence?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span className="text-green-50">Exclusive off-market deal flow</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span className="text-green-50">15+ years Houston market expertise</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span className="text-green-50">Complete due diligence packages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span className="text-green-50">$483M+ in closed transactions</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 text-gray-900"
            >
              <h3 className="text-2xl font-bold mb-6">Developer Inquiry Form</h3>
              <LeadCaptureForm 
                source="DEVELOPERS_PAGE" 
                buttonText="Send Developer Inquiry"
                showProjectDetails={true}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}