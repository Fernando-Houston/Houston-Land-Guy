'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  DollarSign, Clock, Shield, CheckCircle, ArrowRight, Phone, Mail,
  MapPin, Calculator, FileText, TrendingUp, Users, Home, Building,
  TreePine, Factory, Briefcase, AlertCircle, Star, ChevronRight,
  Zap, HandshakeIcon, FileCheck, Banknote
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

// Property types we buy
const propertyTypes = [
  {
    icon: TreePine,
    title: "Vacant Land",
    description: "Undeveloped parcels, raw land, agricultural property",
    keywords: ["vacant land Houston", "sell raw land", "undeveloped property"]
  },
  {
    icon: Building,
    title: "Development Sites",
    description: "Entitled land, platted lots, subdivision tracts",
    keywords: ["development land Houston", "sell entitled property", "subdivision land"]
  },
  {
    icon: Factory,
    title: "Commercial Property",
    description: "Retail, office, industrial, warehouse properties",
    keywords: ["sell commercial property Houston", "industrial land", "retail property"]
  },
  {
    icon: Home,
    title: "Distressed Properties",
    description: "Tax liens, foreclosures, probate, title issues",
    keywords: ["distressed property Houston", "tax lien property", "probate land"]
  },
  {
    icon: Briefcase,
    title: "Estate Sales",
    description: "Inherited property, family estates, partnership buyouts",
    keywords: ["estate property Houston", "inherited land", "sell family property"]
  },
  {
    icon: AlertCircle,
    title: "Problem Properties",
    description: "Environmental issues, deed restrictions, access problems",
    keywords: ["problem property Houston", "environmental cleanup", "deed issues"]
  }
]

// Seller testimonials
const testimonials = [
  {
    name: "Maria Rodriguez",
    location: "Spring, TX",
    situation: "Inherited 12 acres",
    quote: "I inherited land from my father but lived out of state. Houston Development Intelligence handled everything remotely and closed in 10 days. The cash offer was more than I expected!",
    rating: 5,
    soldPrice: "$480,000",
    timeToClose: "10 days"
  },
  {
    name: "John Peterson",
    location: "Katy, TX",
    situation: "Tax lien on commercial lot",
    quote: "Had a tax lien that was growing daily. They paid off the lien at closing and still gave me a fair price. Saved me from losing the property entirely.",
    rating: 5,
    soldPrice: "$1.2M",
    timeToClose: "14 days"
  },
  {
    name: "The Williams Family",
    location: "Cypress, TX",
    situation: "Partnership dissolution",
    quote: "Our family partnership needed to dissolve quickly. They bought all 3 parcels in one transaction, making it simple for everyone to move forward.",
    rating: 5,
    soldPrice: "$2.8M",
    timeToClose: "21 days"
  }
]

// Selling process steps
const sellingProcess = [
  {
    step: 1,
    title: "Submit Property Info",
    description: "Fill out our simple form or call us directly",
    icon: FileText,
    time: "2 minutes"
  },
  {
    step: 2,
    title: "Get Free Valuation",
    description: "Receive property analysis within 24 hours",
    icon: Calculator,
    time: "24 hours"
  },
  {
    step: 3,
    title: "Receive Cash Offer",
    description: "Fair, no-obligation offer within 48 hours",
    icon: DollarSign,
    time: "48 hours"
  },
  {
    step: 4,
    title: "Choose Closing Date",
    description: "Close in 7-30 days on your schedule",
    icon: Clock,
    time: "Your choice"
  },
  {
    step: 5,
    title: "Get Your Cash",
    description: "Wire transfer or cashier's check at closing",
    icon: Banknote,
    time: "Same day"
  }
]

export default function SellersPage() {
  const [metrics, setMetrics] = useState({
    purchased: 0,
    totalValue: 0,
    avgDays: 0,
    satisfaction: 0
  })
  const [propertyValue, setPropertyValue] = useState('')
  const [acreage, setAcreage] = useState('')
  const [estimatedValue, setEstimatedValue] = useState(0)

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
          purchased: Math.floor((523 * currentStep) / steps),
          totalValue: Math.floor((483 * currentStep) / steps),
          avgDays: Math.floor((14 * currentStep) / steps),
          satisfaction: Math.floor((98 * currentStep) / steps)
        })
        
        if (currentStep >= steps) {
          clearInterval(timer)
          setMetrics({ purchased: 523, totalValue: 483, avgDays: 14, satisfaction: 98 })
        }
      }, interval)
    }

    incrementMetrics()
  }, [])

  // Simple property value calculator
  const calculateEstimate = () => {
    if (acreage && parseFloat(acreage) > 0) {
      const acres = parseFloat(acreage)
      const basePrice = 50000 // Base price per acre
      const estimate = acres * basePrice * (1 + Math.random() * 0.5) // Add some variance
      setEstimatedValue(Math.round(estimate))
    }
  }

  return (
    <>
      {/* SEO-Optimized Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-green-100 hover:text-white">Home</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-2 text-green-200" />
                <span className="text-white">Sell Your Land</span>
              </li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Sell Your Houston Land for 
                <span className="block text-yellow-300 mt-2">Top Dollar Cash</span>
              </h1>
              <p className="text-xl text-green-50 mb-8">
                Get a fair cash offer in 48 hours. Close in as little as 7 days.
                <span className="block mt-2">No repairs. No commissions. No hassles.</span>
              </p>
              
              {/* Trust badges */}
              <motion.div 
                className="grid grid-cols-2 gap-4 mb-8"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>$483M+ in Purchases</span>
                </motion.div>
                <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>500+ Properties Bought</span>
                </motion.div>
                <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>7-Day Closing Available</span>
                </motion.div>
                <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>No Fees or Commissions</span>
                </motion.div>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <a href="#valuation" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center">
                  Get Free Property Valuation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a href="tel:713-555-5263" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors inline-flex items-center justify-center">
                  <Phone className="mr-2 w-5 h-5" />
                  (713) 555-LAND
                </a>
              </motion.div>
            </motion.div>

            {/* Quick valuation form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 text-gray-900 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Get Your Cash Offer Today</h2>
              <LeadCaptureForm 
                source="SELLERS_HERO" 
                buttonText="Get My Cash Offer"
                showPropertyDetails={true}
              />
            </motion.div>
          </div>
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
              <div className="text-4xl md:text-5xl font-bold text-green-600">{metrics.purchased}+</div>
              <div className="text-gray-600 mt-2">Properties Purchased</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">${metrics.totalValue}M+</div>
              <div className="text-gray-600 mt-2">Total Purchases</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">{metrics.avgDays}</div>
              <div className="text-gray-600 mt-2">Avg Days to Close</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-green-600">{metrics.satisfaction}%</div>
              <div className="text-gray-600 mt-2">Seller Satisfaction</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Property Types We Buy */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We Buy All Types of Houston Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No matter your situation or property condition, we'll make you a fair cash offer
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {propertyTypes.map((type, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                variants={fadeInUp}
              >
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <type.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="flex flex-wrap gap-2">
                  {type.keywords.map((keyword, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-700 font-semibold mb-4">
              Don't see your property type? We buy those too!
            </p>
            <a href="#contact" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-lg">
              Tell us about your property
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Selling Process */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 5-Step Selling Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From first contact to cash in hand - we make selling your Houston property easy
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-5 gap-6"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {sellingProcess.map((process, index) => (
              <motion.div 
                key={index}
                className="relative"
                variants={fadeInUp}
              >
                <div className="bg-white rounded-xl p-6 shadow-lg text-center h-full">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {process.step}
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 mt-2">
                    <process.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{process.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{process.description}</p>
                  <p className="text-xs text-green-600 font-semibold">{process.time}</p>
                </div>
                {index < sellingProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Instant Valuation Calculator */}
      <section id="valuation" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Instant Property Value Estimator
              </h2>
              <p className="text-lg text-gray-600">
                Get a rough estimate of your property's value in seconds
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Location (ZIP Code)
                </label>
                <input
                  type="text"
                  placeholder="77001"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approximate Acreage
                </label>
                <input
                  type="number"
                  placeholder="5.5"
                  value={acreage}
                  onChange={(e) => setAcreage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={calculateEstimate}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Calculate Estimated Value
              </button>

              {estimatedValue > 0 && (
                <motion.div 
                  className="mt-6 p-6 bg-green-50 rounded-lg text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm text-gray-600 mb-2">Estimated Property Value Range</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${(estimatedValue * 0.8).toLocaleString()} - ${(estimatedValue * 1.2).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    *This is a rough estimate. Get a precise offer in 48 hours.
                  </p>
                  <a href="#contact" className="inline-flex items-center mt-4 text-green-600 hover:text-green-700 font-semibold">
                    Get Exact Cash Offer
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recent Houston Seller Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real sellers, real results - see why Houston landowners trust us
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
                className="bg-white rounded-xl p-8 shadow-lg"
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
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                  <p className="text-sm text-green-600 font-semibold mt-2">{testimonial.situation}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Sale Price:</span>
                      <p className="font-semibold text-green-600">{testimonial.soldPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Closed in:</span>
                      <p className="font-semibold">{testimonial.timeToClose}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Houston Sellers Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference of working with Houston's premier land buyers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast Closing</h3>
                  <p className="text-gray-600">Close in as little as 7 days or on your timeline. No waiting months for buyer financing.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">All Cash Offers</h3>
                  <p className="text-gray-600">No financing contingencies or delays. Get your money fast via wire or cashier's check.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  <HandshakeIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Commissions or Fees</h3>
                  <p className="text-gray-600">Keep 100% of the sale price. We even cover all closing costs.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">We Handle Everything</h3>
                  <p className="text-gray-600">Title issues, liens, probate - our team handles all complications at no cost to you.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  <FileCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">As-Is Purchase</h3>
                  <p className="text-gray-600">No cleanup, repairs, or improvements needed. We buy in any condition.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">15+ Years Experience</h3>
                  <p className="text-gray-600">Houston's trusted land buyers with $483M+ in successful transactions.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How quickly can you close on my Houston property?
                </h3>
                <p className="text-gray-600">
                  We can close in as little as 7 days for cash purchases. Our typical closing timeline 
                  is 14-21 days, but we work with your schedule. We handle all paperwork and can even 
                  arrange remote closing for out-of-state sellers.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What types of properties do you buy in Houston?
                </h3>
                <p className="text-gray-600">
                  We buy all types: vacant land, development sites, commercial properties, industrial land, 
                  distressed properties, estate sales, and properties with title issues. From small lots 
                  to large acreage - no property is too big or too small.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Do I need to make repairs or clear the land?
                </h3>
                <p className="text-gray-600">
                  No! We buy properties as-is. Whether your land needs clearing, has environmental issues, 
                  or requires major work, we'll make you a fair cash offer based on its current condition. 
                  Save time and money - sell as-is.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How do you determine your offer price?
                </h3>
                <p className="text-gray-600">
                  We consider location, size, zoning, development potential, market conditions, and 
                  comparable sales. Our 15+ years of Houston market experience ensures you get a fair 
                  offer that reflects your property's true value, not lowball investor pricing.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Are there any fees or commissions?
                </h3>
                <p className="text-gray-600">
                  Absolutely not! Unlike traditional real estate sales, there are no commissions, fees, 
                  or hidden costs. The price we offer is exactly what you receive at closing. We even 
                  cover all closing costs, title work, and legal fees.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Sell Your Houston Property?
              </h2>
              <p className="text-xl mb-8 text-gray-300">
                Get your no-obligation cash offer today. Join 500+ satisfied Houston property sellers 
                who chose the easy way to sell.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-4 flex-shrink-0 mt-1 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Call or Text Now</h3>
                    <p className="text-gray-300">(713) 555-LAND</p>
                    <p className="text-sm text-gray-400">Available 7 days a week</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 flex-shrink-0 mt-1 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-300">sellers@houstonlandguy.com</p>
                    <p className="text-sm text-gray-400">Response within 2 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 flex-shrink-0 mt-1 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Office</h3>
                    <p className="text-gray-300">1000 Main Street, Suite 2300<br />Houston, Texas 77002</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-green-600/20 rounded-lg border border-green-500/30">
                <h3 className="font-semibold text-lg mb-3 text-green-400">Our Promise to You:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span className="text-gray-300">Fair cash offer within 48 hours</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span className="text-gray-300">No obligation to accept</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span className="text-gray-300">Close on your timeline</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span className="text-gray-300">Zero fees or commissions</span>
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
              <h3 className="text-2xl font-bold mb-6">Get Your Cash Offer</h3>
              <LeadCaptureForm 
                source="SELLERS_FOOTER" 
                buttonText="Get My Cash Offer Now"
                showPropertyDetails={true}
                showUrgency={true}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}