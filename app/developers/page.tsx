'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Building2, TrendingUp, DollarSign, MapPin, Clock, Shield, 
  CheckCircle, ArrowRight, Download, Calendar, Phone, Mail,
  Calculator, FileText, Users, BarChart3
} from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

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

// Mock data for opportunities - would come from API
const featuredOpportunities = [
  {
    id: 1,
    title: "10-Acre Development Site - Katy",
    location: "Katy, TX 77494",
    acreage: "10 acres",
    zoning: "Commercial/Mixed-Use",
    price: "Contact for pricing",
    potential: "150+ residential units or 200K sq ft commercial",
    image: "/api/placeholder/400/300"
  },
  {
    id: 2,
    title: "Prime Corner Lot - The Woodlands",
    location: "The Woodlands, TX 77380",
    acreage: "2.5 acres",
    zoning: "Retail/Office",
    price: "Contact for pricing",
    potential: "20K sq ft retail center",
    image: "/api/placeholder/400/300"
  },
  {
    id: 3,
    title: "Infill Opportunity - Montrose",
    location: "Houston, TX 77006",
    acreage: "0.75 acres",
    zoning: "Urban Mixed-Use",
    price: "Contact for pricing",
    potential: "30 luxury townhomes",
    image: "/api/placeholder/400/300"
  }
]

export default function DevelopersPage() {
  const [metrics, setMetrics] = useState({
    years: 0,
    transactions: 0,
    properties: 0,
    success: 0
  })

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

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Houston's Premier 
              <span className="block text-green-400 mt-2">Land Partner</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              From sourcing hidden opportunities to closing the deal, we handle every step—saving you time 
              and giving you exclusive access to off-market properties.
            </p>
            
            {/* Trust badges */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mb-10"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                <Shield className="w-5 h-5 text-green-400" />
                <span>Licensed & Insured</span>
              </motion.div>
              <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                <Users className="w-5 h-5 text-green-400" />
                <span>500+ Developer Partners</span>
              </motion.div>
              <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                <Clock className="w-5 h-5 text-green-400" />
                <span>48-Hour Response</span>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <a href="#opportunities" className="cta-primary inline-flex items-center justify-center">
                View Current Opportunities
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a href="#contact" className="cta-secondary bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                Schedule Consultation
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
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
              <div className="text-gray-600 mt-2">Years Experience</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">${metrics.transactions}M+</div>
              <div className="text-gray-600 mt-2">In Transactions</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">{metrics.properties}+</div>
              <div className="text-gray-600 mt-2">Properties Analyzed</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">{metrics.success}%</div>
              <div className="text-gray-600 mt-2">Success Rate</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Development Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just land brokers—we're your strategic partners in Houston development.
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
                title: "Off-Market Sourcing",
                description: "Access exclusive properties before they hit the market through our extensive network."
              },
              {
                icon: Calculator,
                title: "Financial Analysis",
                description: "Comprehensive ROI calculations and feasibility studies for every opportunity."
              },
              {
                icon: FileText,
                title: "Due Diligence",
                description: "Complete property research including zoning, permits, and development restrictions."
              },
              {
                icon: Building2,
                title: "Entitlement Support",
                description: "Navigate Houston's unique development landscape with expert guidance."
              },
              {
                icon: Users,
                title: "Partner Network",
                description: "Connect with architects, contractors, and financing partners."
              },
              {
                icon: TrendingUp,
                title: "Market Intelligence",
                description: "Data-driven insights on emerging neighborhoods and development trends."
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
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section id="opportunities" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Development Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exclusive off-market properties ready for development
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-12"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredOpportunities.map((property) => (
              <motion.div 
                key={property.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                variants={fadeInUp}
              >
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Off-Market
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Size:</span>
                      <span className="font-medium">{property.acreage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Zoning:</span>
                      <span className="font-medium">{property.zoning}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Potential:</span>
                      <span className="font-medium text-green-600">{property.potential}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors">
                    Request Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Link 
              href="/properties"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
            >
              View All Properties
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Developer Resources */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Developer Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Free tools and guides to accelerate your development projects
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
                title: "Houston Development Guide 2024",
                type: "PDF Guide",
                icon: FileText,
                description: "Comprehensive guide to Houston's development landscape"
              },
              {
                title: "ROI Calculator",
                type: "Interactive Tool",
                icon: Calculator,
                description: "Calculate potential returns on any development project"
              },
              {
                title: "Zoning Map",
                type: "Interactive Map",
                icon: MapPin,
                description: "Explore Houston's development zones and regulations"
              },
              {
                title: "Market Report Q1 2024",
                type: "Market Analysis",
                icon: BarChart3,
                description: "Latest trends and opportunities in Houston real estate"
              }
            ].map((resource, index) => (
              <motion.div 
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                variants={fadeInUp}
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <resource.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                <p className="text-sm text-green-600 mb-3">{resource.type}</p>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <button className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
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
                Partner Inquiry
              </h2>
              <p className="text-xl mb-8 text-green-50">
                Ready to explore exclusive development opportunities? Let's discuss your next project.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                    <p className="text-green-50">(713) 828-3701</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-green-50">contact@houstonlandguy.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Office</h3>
                    <p className="text-green-50">3302 Canal St.<br />Houston, Texas 77003</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Why Partner With Us?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span className="text-green-50">Exclusive off-market opportunities</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span className="text-green-50">Complete due diligence support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span className="text-green-50">Trusted by 500+ developers</span>
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
              <h3 className="text-2xl font-bold mb-6">Get Started</h3>
              <LeadCaptureForm 
                source="DEVELOPERS_PAGE" 
                buttonText="Send Inquiry"
                showProjectDetails={true}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}