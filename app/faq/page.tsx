'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { HelpCircle, ChevronDown, Search, Building2, DollarSign, FileText, MapPin, TrendingUp, Clock, Home, AlertCircle } from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

interface FAQItem {
  question: string
  answer: string
  category: string
  icon: any
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<number[]>([])

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'regulations', label: 'Regulations & Permits', icon: FileText },
    { id: 'costs', label: 'Costs & Financing', icon: DollarSign },
    { id: 'locations', label: 'Locations & Markets', icon: MapPin },
    { id: 'process', label: 'Development Process', icon: Building2 },
    { id: 'roi', label: 'ROI & Investment', icon: TrendingUp },
  ]

  const faqs: FAQItem[] = [
    // Regulations & Permits
    {
      question: "How does Houston's no-zoning policy affect development?",
      answer: "Houston's lack of traditional zoning provides developers with unprecedented flexibility in land use decisions. Instead of zoning, development is regulated through deed restrictions, city ordinances, and building codes. This allows for mixed-use developments, faster approvals, and market-driven land use. The result is lower development costs, higher ROI, and the ability to respond quickly to market demands. However, developers must still carefully research deed restrictions and comply with city ordinances regarding setbacks, parking, and infrastructure.",
      category: "regulations",
      icon: FileText
    },
    {
      question: "What permits are required for Houston development projects?",
      answer: "Houston development requires several permits depending on project type: Building Permit (new construction, alterations), Plat Application (subdivisions), Site Development Permit (commercial projects), Driveway/Sidewalk Permit, Storm Sewer Connection, Water/Wastewater Taps, Tree Removal Permit (if applicable), and Sign Permits. Special permits may be needed for floodplain development, historic districts, or TIRZ areas. The Houston Permitting Center provides a one-stop shop for most permits, streamlining the process.",
      category: "regulations",
      icon: FileText
    },
    {
      question: "How long does the Houston development permit process take?",
      answer: "Houston's permit process typically takes 4-8 weeks for standard projects and 8-16 weeks for complex developments. The timeline includes: Pre-application meeting (1-2 weeks), Plan submission (same day), Initial review (10-15 business days), Corrections/resubmittal (5-10 business days), and Permit issuance (1-2 business days). Houston's process is significantly faster than cities with traditional zoning, which can take 3-6 months or longer. Expedited review is available for an additional fee.",
      category: "regulations",
      icon: Clock
    },
    {
      question: "What are deed restrictions and how do they impact development?",
      answer: "Deed restrictions are private agreements that control land use within specific areas, functioning as Houston's primary land use control mechanism. They can dictate permitted uses (residential, commercial), minimum lot sizes, building setbacks, architectural standards, height restrictions, and parking requirements. Deed restrictions are often more restrictive than zoning and are enforced through civil litigation. Always conduct thorough deed restriction research before purchasing property, as violations can result in lawsuits and forced modifications to development plans.",
      category: "regulations",
      icon: FileText
    },
    {
      question: "Are there any environmental regulations specific to Houston?",
      answer: "Yes, Houston has several environmental considerations: Floodplain regulations require elevation 1-2 feet above base flood elevation, drainage and detention requirements for stormwater management, tree preservation ordinances in certain areas, and coastal area regulations. The city has strengthened these requirements post-Hurricane Harvey. Environmental site assessments (Phase I ESA) are recommended for all commercial properties. TCEQ regulations apply for air quality and contamination issues.",
      category: "regulations",
      icon: AlertCircle
    },

    // Costs & Financing
    {
      question: "What are typical development costs in Houston?",
      answer: "Development costs in Houston vary by project type but are generally 15-25% lower than other major Texas cities. Current averages include: Single-family residential: $145-185/sq ft (standard to premium), Multifamily: $135-165/sq ft, Office: $180-220/sq ft, Retail/Mixed-use: $130-160/sq ft, Industrial/Warehouse: $65-85/sq ft. These are hard costs only. Add 20-30% for soft costs (design, permits, legal) and 8-12% for financing costs. Land costs vary widely: suburban $15,000-45,000/acre, urban infill $200,000-800,000/acre.",
      category: "costs",
      icon: DollarSign
    },
    {
      question: "How much does land cost in Houston compared to other Texas cities?",
      answer: "Houston land costs are significantly lower than Austin and moderately lower than Dallas. Typical Houston prices: Suburban development land: $15,000-45,000/acre (vs. Austin $35,000-85,000), Urban infill: $200,000-800,000/acre (vs. Austin $500,000-2,000,000), Prime commercial: $30-60/sq ft (vs. Austin $60-150), Industrial: $3-8/sq ft (vs. Austin $8-20). Houston offers 35-50% savings on land acquisition compared to Austin, contributing to superior development ROI. The abundance of developable land and no zoning restrictions help maintain competitive pricing.",
      category: "costs",
      icon: DollarSign
    },
    {
      question: "What financing options are available for Houston development?",
      answer: "Houston developers have access to various financing options: Traditional bank construction loans (70-80% LTC), SBA 504 loans for owner-occupied commercial projects, Private equity and joint ventures, Opportunity Zone investments in designated areas, PACE financing for energy-efficient projects, TIF/TIRZ funding in special districts, and Crowdfunding for smaller projects. Houston's strong banking sector and development-friendly environment often result in competitive rates and terms. Many local and regional banks specialize in development financing.",
      category: "costs",
      icon: DollarSign
    },
    {
      question: "What are soft costs and how much should I budget?",
      answer: "Soft costs are non-construction expenses typically representing 20-30% of hard costs. Major categories include: Architecture/Engineering (5-10% of hard costs), Permits and fees (2-4%), Legal and accounting (2-3%), Marketing and leasing (2-4%), Construction loan interest (4-8%), Insurance and taxes during construction (2-3%), Developer fees (3-5%). Houston's streamlined permitting and no zoning reduce soft costs compared to other markets. Budget 25% of hard costs for typical projects, 30% for complex or luxury developments.",
      category: "costs",
      icon: DollarSign
    },

    // Locations & Markets
    {
      question: "What are the best areas for development in Houston?",
      answer: "Top Houston development areas vary by project type: Residential: The Woodlands, Katy, Sugar Land, Cypress, Pearland; Commercial/Office: Energy Corridor, Galleria/Uptown, Downtown, Texas Medical Center; Industrial: East Houston (near port), Northwest Houston (near airport), Fort Bend County; Mixed-Use/Urban: Montrose, Heights, Midtown, East Downtown (EaDo). Each area offers unique advantages - The Woodlands for master-planned communities, Katy for growing families, Sugar Land for corporate campuses, and inner-loop neighborhoods for urban infill projects.",
      category: "locations",
      icon: MapPin
    },
    {
      question: "Which Houston suburbs are experiencing the fastest growth?",
      answer: "The fastest-growing Houston suburbs include: Katy/Fulshear (west) - 4.2% annual growth, driven by excellent schools and Grand Parkway access; Cypress/Bridgeland (northwest) - 3.8% growth with major master-planned communities; Pearland/Friendswood (south) - 3.5% growth, proximity to Medical Center and NASA; The Woodlands/Conroe (north) - 3.3% growth, corporate relocations and high-end residential; Richmond/Rosenberg (southwest) - 4.5% growth, affordable land and new infrastructure. These areas offer prime opportunities for residential and retail development.",
      category: "locations",
      icon: TrendingUp
    },
    {
      question: "How do I evaluate a potential development site in Houston?",
      answer: "Key factors for site evaluation include: 1) Deed restrictions and development constraints, 2) Flood zone designation and drainage requirements, 3) Utility availability and capacity, 4) Traffic patterns and accessibility, 5) Demographics and market demand within 3-5 mile radius, 6) Competition and absorption rates, 7) Future infrastructure plans (check TxDOT and city projects), 8) School district quality (for residential), 9) Employment centers proximity, 10) Environmental concerns (Phase I ESA recommended). Use HCAD for property data, city GIS for constraints, and market reports for demand analysis.",
      category: "locations",
      icon: MapPin
    },

    // Development Process
    {
      question: "What is the typical timeline for a Houston development project?",
      answer: "Typical Houston development timelines: Due Diligence: 30-60 days; Design & Engineering: 60-120 days; Permitting: 30-60 days (faster than most cities); Financing: 45-90 days (can overlap with design); Construction: 6-24 months depending on project type (Single-family: 6-8 months, Multifamily: 12-18 months, Commercial: 10-16 months, Industrial: 8-12 months); Marketing/Leasing: Begins 3-6 months before completion. Total timeline from land acquisition to completion: 12-36 months. Houston's streamlined processes typically save 3-6 months compared to other major markets.",
      category: "process",
      icon: Clock
    },
    {
      question: "Do I need local partners for Houston development?",
      answer: "While not legally required, local partners provide significant advantages: Understanding of deed restrictions and neighborhood dynamics, relationships with city officials and permitting staff, knowledge of qualified contractors and subcontractors, familiarity with drainage and flooding issues, established lender relationships, market intelligence on pricing and absorption. Local partners can reduce timeline by 20-30% and help avoid costly mistakes. Consider partnering with local developers, brokers, or consultants who know the specific submarkets you're targeting.",
      category: "process",
      icon: Building2
    },
    {
      question: "What are common mistakes to avoid in Houston development?",
      answer: "Common Houston development mistakes include: 1) Ignoring deed restrictions (can kill projects), 2) Underestimating flood mitigation costs, 3) Not researching utility capacity early, 4) Assuming no zoning means no regulations, 5) Poor site selection without traffic analysis, 6) Underestimating Houston's size and commute patterns, 7) Not accounting for hurricane-resistant design costs, 8) Ignoring local neighborhood opposition, 9) Insufficient parking (despite some areas having no minimums), 10) Not leveraging Houston's business-friendly environment fully. Working with experienced local professionals helps avoid these pitfalls.",
      category: "process",
      icon: AlertCircle
    },

    // ROI & Investment
    {
      question: "What ROI can I expect on Houston development projects?",
      answer: "Houston development projects average 18.2% IRR across all property types, significantly higher than state and national averages. By property type: Master-planned residential: 20-25% IRR, Industrial/Logistics: 18-22% IRR, Build-to-rent single-family: 18-20% IRR, Mixed-use development: 16-18% IRR, Multifamily: 14-17% IRR, Retail/Commercial: 12-15% IRR. These returns are approximately 24% higher than Austin due to lower land costs, reduced regulations, and faster execution. Factors affecting ROI include location, timing, execution quality, and market conditions.",
      category: "roi",
      icon: TrendingUp
    },
    {
      question: "How does Houston development ROI compare to other Texas markets?",
      answer: "Houston consistently delivers superior returns compared to other Texas markets: Houston average: 18.2% IRR, Austin: 14.7% IRR, Dallas: 16.1% IRR, San Antonio: 15.3% IRR. Houston's advantages include 35-50% lower land costs than Austin, no zoning restrictions allowing flexible development, faster permitting (4-8 weeks vs 3-6 months), lower construction costs, larger market with diverse economy, and better cash flow due to lower operating costs. The main trade-off is Austin's potential for higher appreciation, but Houston's cash flow and total returns typically outperform.",
      category: "roi",
      icon: TrendingUp
    },
    {
      question: "What factors drive Houston's strong development returns?",
      answer: "Several factors contribute to Houston's superior development returns: 1) Population growth of 100,000+ annually creating constant demand, 2) Diverse economy reducing market volatility, 3) Business-friendly environment with no state income tax, 4) Lower regulatory burden reducing costs and timeline, 5) Abundant land supply keeping prices competitive, 6) Major infrastructure investments improving accessibility, 7) Corporate relocations driving commercial demand, 8) Port of Houston supporting industrial growth, 9) Energy sector providing high-paying jobs, 10) Cultural diversity attracting international investment. These fundamentals support long-term appreciation and stable cash flows.",
      category: "roi",
      icon: TrendingUp
    },
    {
      question: "When is the best time to develop in Houston?",
      answer: "Houston's development market offers opportunities throughout the cycle, but optimal timing considers: Current favorable conditions (2024): stabilized construction costs, strong population growth, diversified economy beyond oil, anticipated interest rate decreases. Best entry points: During oil price dips (contrarian opportunity), After major weather events (reconstruction demand), Before major infrastructure completion, Early in neighborhood gentrification. Houston's diverse economy means different sectors peak at different times. Industrial and multifamily remain strong, while office depends on oil prices and corporate growth. The key is matching product type to market timing.",
      category: "roi",
      icon: Clock
    }
  ]

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
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
                <HelpCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Get expert answers to common questions about Houston real estate development, 
              from regulations and permits to costs and ROI expectations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No questions found matching your search.</p>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => {
                const Icon = faq.icon
                const isOpen = openItems.includes(index)
                
                return (
                  <motion.div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-4 ${
                          isOpen ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            isOpen ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <h3 className="text-left font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Need More Detailed Information?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/blog/complete-guide-houston-development-regulations" className="group">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <FileText className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    Development Regulations Guide
                  </h3>
                  <p className="text-sm text-gray-600">
                    Complete guide to Houston's unique no-zoning regulations and permit requirements
                  </p>
                </div>
              </Link>
              
              <Link href="/development-cost-calculator" className="group">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    Cost Calculator
                  </h3>
                  <p className="text-sm text-gray-600">
                    Calculate accurate development costs for your Houston project
                  </p>
                </div>
              </Link>
              
              <Link href="/roi-calculator" className="group">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    ROI Calculator
                  </h3>
                  <p className="text-sm text-gray-600">
                    Analyze potential returns on Houston development opportunities
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
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
                Still Have Questions?
              </h3>
              <p className="text-gray-600">
                Get personalized answers from our Houston development experts
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <LeadCaptureForm source="FAQ_PAGE" />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}