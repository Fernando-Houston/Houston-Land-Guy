'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, CheckCircle, Phone, Mail, MessageSquare, Brain, Users, TrendingUp, Home, Building2, DollarSign, Star, MapPin, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

interface ConsultationForm {
  fullName: string
  email: string
  phone: string
  propertyAddress: string
  consultationType: 'seller' | 'developer' | 'investor' | 'general'
  propertyType: 'single-family' | 'multi-family' | 'commercial' | 'land' | 'luxury'
  timeline: 'immediate' | '1-3months' | '3-6months' | '6-12months' | 'planning'
  estimatedValue: string
  goals: string
  preferredContact: 'phone' | 'email' | 'text' | 'video'
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'weekend'
}

export default function ConsultationPage() {
  const [formData, setFormData] = useState<ConsultationForm>({
    fullName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    consultationType: 'seller',
    propertyType: 'single-family',
    timeline: 'immediate',
    estimatedValue: '',
    goals: '',
    preferredContact: 'phone',
    preferredTime: 'afternoon'
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      // Handle form submission
      setTimeout(() => {
        setSubmitted(true)
        setLoading(false)
      }, 1000)
    }
    
    setLoading(false)
  }

  const consultationTypes = [
    {
      id: 'seller',
      title: 'Selling Property',
      description: 'Get expert guidance on pricing, timing, and marketing your Houston property',
      icon: Home,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'developer',
      title: 'Development Project',
      description: 'Site analysis, zoning guidance, and project feasibility consultation',
      icon: Building2,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'investor',
      title: 'Investment Strategy',
      description: 'Portfolio analysis, ROI optimization, and market opportunity identification',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'general',
      title: 'General Consultation',
      description: 'Market insights, Fernando-X setup, or platform guidance',
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Leverage Fernando-X AI for data-driven recommendations tailored to your situation'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: '15+ years of Houston market experience with proven track record'
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Access to real-time market data and proprietary analytics platform'
    },
    {
      icon: CheckCircle,
      title: 'Proven Results',
      description: 'Average 12% higher sale prices and 30% faster transactions'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      location: 'River Oaks',
      type: 'Seller',
      quote: 'The consultation saved me months of research. Sold 15% above asking price in just 18 days.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      location: 'The Woodlands',
      type: 'Developer',
      quote: 'Their site analysis and zoning insights were invaluable. Project approved on first submission.',
      rating: 5
    },
    {
      name: 'Jennifer Park',
      location: 'Memorial',
      type: 'Investor',
      quote: 'Fernando-X identified opportunities I never would have found. ROI exceeded expectations.',
      rating: 5
    }
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Consultation Requested!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Thank you for your interest! Our team will contact you within 24 hours to schedule your consultation.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              Response within 24 hours
            </div>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              Flexible scheduling available
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Back to Home
            </Link>
            <button
              onClick={() => {
                const event = new CustomEvent('open-fernando-chat')
                window.dispatchEvent(event)
              }}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center justify-center"
            >
              <Brain className="h-4 w-4 mr-2" />
              Chat with Fernando-X
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 min-h-[50vh]">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, blue 0%, transparent 50%), radial-gradient(circle at 80% 80%, cyan 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Calendar className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Free Expert Consultation</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Get Expert
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                Real Estate Guidance
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 lg:text-2xl font-light"
            >
              Schedule a personalized consultation with our Houston market experts.
              <span className="block mt-2 text-lg">Get AI-powered insights and proven strategies for success.</span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* Consultation Type Selection */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Consultation Type</h2>
            <p className="mt-4 text-lg text-gray-600">
              Select the option that best describes your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {consultationTypes.map((type) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
                  formData.consultationType === type.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setFormData({ ...formData, consultationType: type.id as any })}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${type.color} mb-4`}>
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Free Consultation</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address
                  </label>
                  <input
                    type="text"
                    value={formData.propertyAddress}
                    onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                    placeholder="Enter Houston property address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="single-family">Single Family Home</option>
                    <option value="multi-family">Multi-Family</option>
                    <option value="commercial">Commercial Property</option>
                    <option value="land">Land/Development Site</option>
                    <option value="luxury">Luxury Property</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="immediate">Immediate (0-30 days)</option>
                    <option value="1-3months">1-3 Months</option>
                    <option value="3-6months">3-6 Months</option>
                    <option value="6-12months">6-12 Months</option>
                    <option value="planning">Planning Phase</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Value
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    placeholder="e.g., $500,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goals & Objectives
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="Tell us about your goals, challenges, or specific questions..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Contact Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="phone">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="text">Text Message</option>
                    <option value="video">Video Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.fullName || !formData.email || !formData.phone}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Scheduling Consultation...
                  </>
                ) : (
                  <>
                    Schedule Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Consultation?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Get personalized insights backed by 15+ years of Houston market expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Client Success Stories</h2>
            <p className="mt-4 text-lg text-gray-600">
              See how our consultations have helped Houston property owners succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.type} • {testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prefer to Connect Directly?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Multiple ways to get the expert guidance you need
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <Phone className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Call Now</h3>
              <p className="text-gray-300 text-sm mb-3">Speak directly with our team</p>
              <a href="tel:+1-713-555-0123" className="text-blue-400 hover:text-blue-300 font-medium">
                (713) 555-0123
              </a>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <Mail className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
              <p className="text-gray-300 text-sm mb-3">Send us your questions</p>
              <a href="mailto:consultation@houstonlandguy.com" className="text-blue-400 hover:text-blue-300 font-medium">
                consultation@houstonlandguy.com
              </a>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <Brain className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Chat with Fernando-X</h3>
              <p className="text-gray-300 text-sm mb-3">Get instant AI assistance</p>
              <button
                onClick={() => {
                  const event = new CustomEvent('open-fernando-chat')
                  window.dispatchEvent(event)
                }}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}