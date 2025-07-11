'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Phone, Mail, Globe, Clock, CheckCircle, ExternalLink, Building2, Star } from 'lucide-react'

export default function LocalCitationsPage() {
  const businessInfo = {
    name: "Houston Development Intelligence",
    altName: "Houston Land Guy",
    address: "1000 Main Street, Suite 2300",
    city: "Houston",
    state: "TX",
    zip: "77002",
    country: "United States",
    phone: "(713) 555-LAND",
    email: "info@houstonlandguy.com",
    website: "https://houstonlandguy.com",
    hours: "Monday-Friday: 8:00 AM - 6:00 PM CST",
    description: "Premier Houston development intelligence platform providing exclusive land development opportunities, market analysis, and investment insights for real estate developers and investors in Harris County.",
    categories: [
      "Real Estate Development",
      "Land Development Consultant",
      "Real Estate Investment Service",
      "Commercial Real Estate Agency",
      "Property Development Company"
    ]
  }

  const citations = [
    {
      name: "Google Business Profile",
      icon: "🔍",
      status: "verified",
      importance: "critical",
      description: "Essential for local search visibility and Google Maps",
      url: "https://www.google.com/business/",
      features: ["Reviews", "Photos", "Posts", "Q&A", "Messaging"]
    },
    {
      name: "Bing Places for Business",
      icon: "🅱️",
      status: "verified",
      importance: "high",
      description: "Important for Bing search results and maps",
      url: "https://www.bingplaces.com/",
      features: ["Business info", "Photos", "Categories"]
    },
    {
      name: "Apple Maps Connect",
      icon: "🍎",
      status: "pending",
      importance: "high",
      description: "Critical for iOS users and Siri searches",
      url: "https://mapsconnect.apple.com/",
      features: ["Indoor maps", "Place cards", "Reviews"]
    },
    {
      name: "Yelp for Business",
      icon: "⭐",
      status: "verified",
      importance: "medium",
      description: "Popular review platform for local businesses",
      url: "https://biz.yelp.com/",
      features: ["Reviews", "Photos", "Check-ins"]
    },
    {
      name: "Facebook Business Page",
      icon: "📘",
      status: "verified",
      importance: "high",
      description: "Social media presence and local discovery",
      url: "https://www.facebook.com/business/",
      features: ["Posts", "Events", "Reviews", "Messenger"]
    },
    {
      name: "LinkedIn Company Page",
      icon: "💼",
      status: "verified",
      importance: "high",
      description: "Professional networking and B2B visibility",
      url: "https://www.linkedin.com/company/",
      features: ["Updates", "Jobs", "Employee advocacy"]
    },
    {
      name: "Houston Business Directory",
      icon: "🏢",
      status: "verified",
      importance: "medium",
      description: "Local Houston business directory",
      url: "#",
      features: ["Local listings", "Categories", "Contact info"]
    },
    {
      name: "Chamber of Commerce",
      icon: "🤝",
      status: "verified",
      importance: "high",
      description: "Greater Houston Partnership member listing",
      url: "https://www.houston.org/",
      features: ["Member directory", "Events", "Networking"]
    },
    {
      name: "BBB Business Profile",
      icon: "🛡️",
      status: "pending",
      importance: "medium",
      description: "Better Business Bureau accreditation",
      url: "https://www.bbb.org/",
      features: ["Accreditation", "Reviews", "Complaints"]
    },
    {
      name: "Foursquare Business",
      icon: "📍",
      status: "pending",
      importance: "low",
      description: "Location-based discovery platform",
      url: "https://foursquare.com/business/",
      features: ["Check-ins", "Tips", "Photos"]
    },
    {
      name: "Nextdoor Business",
      icon: "🏘️",
      status: "pending",
      importance: "medium",
      description: "Neighborhood-focused platform",
      url: "https://business.nextdoor.com/",
      features: ["Local recommendations", "Neighborhood posts"]
    },
    {
      name: "HAR.com Business",
      icon: "🏠",
      status: "verified",
      importance: "critical",
      description: "Houston Association of Realtors directory",
      url: "https://www.har.com/",
      features: ["Agent directory", "Property listings", "Market data"]
    }
  ]

  const importanceLevels = {
    critical: { color: "text-red-600", bg: "bg-red-50", label: "Critical" },
    high: { color: "text-orange-600", bg: "bg-orange-50", label: "High Priority" },
    medium: { color: "text-yellow-600", bg: "bg-yellow-50", label: "Medium Priority" },
    low: { color: "text-gray-600", bg: "bg-gray-50", label: "Low Priority" }
  }

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
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Local Business <span className="gradient-text">Citations</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Find Houston Development Intelligence across major business directories and local citation 
              sources. Our verified business listings ensure accurate information for clients searching 
              for Houston's premier development intelligence platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Business Information */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Official Business Information</h2>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Building2 className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{businessInfo.name}</p>
                        <p className="text-sm text-gray-600">DBA: {businessInfo.altName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-gray-700">{businessInfo.address}</p>
                        <p className="text-gray-700">{businessInfo.city}, {businessInfo.state} {businessInfo.zip}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-green-600 mr-3" />
                      <p className="text-gray-700">{businessInfo.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-green-600 mr-3" />
                      <p className="text-gray-700">{businessInfo.email}</p>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-green-600 mr-3" />
                      <p className="text-gray-700">{businessInfo.website}</p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-600 mr-3" />
                      <p className="text-gray-700">{businessInfo.hours}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Description</h3>
                  <p className="text-gray-700 mb-6">{businessInfo.description}</p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Service Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {businessInfo.categories.map((category, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-green-700 border border-green-200"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Citation Directory */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Directory Listings</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our business is listed on major directories to ensure clients can find accurate information 
                about Houston Development Intelligence across all platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {citations.map((citation, index) => (
                <motion.div
                  key={citation.name}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{citation.icon}</span>
                      <h3 className="font-semibold text-gray-900">{citation.name}</h3>
                    </div>
                    {citation.status === 'verified' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{citation.description}</p>
                  
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${importanceLevels[citation.importance].bg} ${importanceLevels[citation.importance].color}`}>
                      {importanceLevels[citation.importance].label}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {citation.features.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${citation.status === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {citation.status === 'verified' ? 'Verified Listing' : 'Pending Setup'}
                    </span>
                    {citation.url !== '#' && (
                      <a 
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
                      >
                        Visit
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEO Benefits */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Local Citations Matter</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Local SEO Authority</h3>
                <p className="text-gray-600">
                  Consistent NAP (Name, Address, Phone) across directories builds local search authority 
                  and improves rankings for Houston development searches.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust & Credibility</h3>
                <p className="text-gray-600">
                  Verified business listings with consistent information build trust with potential 
                  clients researching development partners.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Online Visibility</h3>
                <p className="text-gray-600">
                  Multiple citation sources increase chances of being found by developers and investors 
                  searching for Houston land opportunities.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NAP Consistency Notice */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Important: NAP Consistency</h3>
            <p className="text-gray-700 mb-4">
              To maintain local SEO authority, please ensure all references to Houston Development Intelligence 
              use the exact business information listed above. Consistency across all platforms is crucial for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Search engine trust and ranking signals</li>
              <li>Accurate business information for clients</li>
              <li>Professional brand representation</li>
              <li>Local map pack visibility</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Found an Incorrect Listing?
            </h2>
            <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
              Help us maintain accurate business information across all platforms. If you find an 
              incorrect or outdated listing, please let us know.
            </p>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-green-600 bg-white hover:bg-gray-50 transition-all shadow-lg"
              >
                Report Incorrect Listing
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}