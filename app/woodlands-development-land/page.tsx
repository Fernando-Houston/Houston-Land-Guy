'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, TrendingUp, Building2, DollarSign, Users, CheckCircle } from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

export default function WoodlandsDevelopmentPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-700 to-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ duration: 1 }}
        />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <motion.div 
              className="mb-12 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                The Woodlands Development Land
                <motion.span 
                  className="block text-3xl sm:text-4xl lg:text-5xl text-green-300 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Premium Investment Opportunities
                </motion.span>
              </h1>
              <motion.p 
                className="mt-6 text-lg text-gray-100 lg:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Discover exclusive <strong>Woodlands development opportunities</strong> in one of Houston&apos;s most prestigious master-planned communities. 
                Access <strong>Woodlands commercial real estate</strong> and prime <strong>development sites</strong> with unmatched growth potential 
                in Montgomery County&apos;s premier location.
              </motion.p>
              
              {/* The Woodlands Stats */}
              <motion.div 
                className="mt-8 grid grid-cols-2 gap-6 sm:flex sm:items-center sm:gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold">28,000+</div>
                  <div className="text-sm opacity-90">Acres Master-Planned</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold">120,000+</div>
                  <div className="text-sm opacity-90">Residents</div>
                </div>
                <div className="text-white col-span-2 sm:col-span-1">
                  <div className="text-3xl sm:text-4xl font-bold">$200M+</div>
                  <div className="text-sm opacity-90">Annual Development Value</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/roi-calculator"
                    className="cta-primary w-full sm:w-auto inline-flex items-center justify-center"
                  >
                    Calculate Woodlands ROI
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#opportunities"
                    className="cta-secondary w-full sm:w-auto inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                  >
                    View Development Sites
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="feature-card shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Exclusive Woodlands Market Report
                </h3>
                <p className="text-gray-600">
                  Comprehensive analysis of The Woodlands development opportunities and market trends
                </p>
              </div>
              <LeadCaptureForm source="WOODLANDS_HERO" />
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    <span>30+ years Woodlands expertise</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Woodlands Development Overview */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why The Woodlands for <span className="gradient-text">Development Investment</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              The Woodlands represents the pinnacle of <strong>Houston area development opportunities</strong>. 
              As one of America&apos;s premier master-planned communities, it offers unparalleled infrastructure, 
              established market demand, and consistent appreciation for <strong>Woodlands real estate development</strong> projects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Consistent Market Growth",
                description: "The Woodlands has shown 15+ years of consistent property value appreciation, with commercial development projects achieving 12-18% IRR annually.",
                stats: "12-18% IRR"
              },
              {
                icon: Building2,
                title: "Master-Planned Infrastructure", 
                description: "Complete infrastructure including utilities, transportation networks, and community amenities reduces development risk and timeline.",
                stats: "28,000 Acres"
              },
              {
                icon: Users,
                title: "Established Market Demand",
                description: "120,000+ residents and 65,000+ jobs create consistent demand for residential, commercial, and mixed-use development.",
                stats: "120K+ Residents"
              },
              {
                icon: DollarSign,
                title: "Premium Market Position", 
                description: "Woodlands properties command premium pricing with median home values 40% above Houston average, supporting high-end development.",
                stats: "40% Premium"
              },
              {
                icon: MapPin,
                title: "Strategic Location",
                description: "Prime location between Houston and Conroe with direct access to major employment centers, airports, and transportation corridors.",
                stats: "30 Miles to Downtown"
              },
              {
                icon: CheckCircle,
                title: "Regulatory Clarity",
                description: "Established development guidelines and streamlined approval processes through The Woodlands Development Company partnerships.",
                stats: "Streamlined Approvals"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <div className="text-green-600 font-semibold text-sm">{feature.stats}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Opportunities Section */}
      <section id="opportunities" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Current <span className="gradient-text">Woodlands Development Opportunities</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Exclusive access to premium <strong>Woodlands development sites</strong> and <strong>builder lots</strong> 
              currently available for qualified developers and investors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Available Development Categories
              </h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Commercial Development Sites</h4>
                  <p className="text-gray-600">
                    Prime <strong>Woodlands commercial real estate</strong> opportunities including retail, office, 
                    and mixed-use development sites in high-traffic corridors.
                  </p>
                  <div className="mt-2 text-green-600 font-medium">5-15 acre parcels • $2M-$8M range</div>
                </div>

                <div className="border-l-4 border-emerald-500 pl-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Residential Builder Lots</h4>
                  <p className="text-gray-600">
                    Premium <strong>Woodlands builder lots</strong> in established and emerging neighborhoods, 
                    perfect for custom home builders and residential developers.
                  </p>
                  <div className="mt-2 text-green-600 font-medium">0.25-2 acre lots • $150K-$500K range</div>
                </div>

                <div className="border-l-4 border-teal-500 pl-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Mixed-Use Development</h4>
                  <p className="text-gray-600">
                    Strategic mixed-use opportunities combining residential, retail, and office components 
                    in prime Woodlands locations.
                  </p>
                  <div className="mt-2 text-green-600 font-medium">3-25 acre sites • $5M-$20M range</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Get Exclusive Woodlands Opportunities
              </h3>
              <p className="text-gray-600 mb-6">
                Access our private inventory of <strong>Woodlands development land</strong> and 
                off-market opportunities not available through traditional channels.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Pre-market property alerts</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Exclusive developer network access</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Complete feasibility analysis</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Direct seller negotiations</span>
                </div>
              </div>

              <LeadCaptureForm source="WOODLANDS_OPPORTUNITIES" />
            </motion.div>
          </div>
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
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Invest in Woodlands Development?
            </h2>
            <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
              Join successful developers who have generated exceptional returns through strategic 
              <strong> Woodlands development investments</strong>
            </p>
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-green-600 bg-white hover:bg-gray-50 transition-all shadow-lg"
                >
                  Schedule Woodlands Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/roi-calculator"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-semibold rounded-lg text-white bg-transparent hover:bg-white hover:text-green-600 transition-all"
                >
                  Try Woodlands ROI Calculator
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}