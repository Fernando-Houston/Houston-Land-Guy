'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, TrendingUp, Building2, DollarSign, Users, CheckCircle, Star } from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

export default function KatyDevelopmentPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-700 to-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ duration: 1 }}
        />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
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
              <div className="flex items-center mb-4">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="text-green-200 font-medium">Top Growth Market 2024</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Katy Texas Land Development
                <motion.span 
                  className="block text-3xl sm:text-4xl lg:text-5xl text-green-300 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Prime Development Opportunities
                </motion.span>
              </h1>
              <motion.p 
                className="mt-6 text-lg text-gray-100 lg:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Capitalize on <strong>Katy Texas land development</strong> in one of America&apos;s fastest-growing suburbs. 
                Access exclusive <strong>Katy development opportunities</strong> and <strong>commercial real estate</strong> in 
                Fort Bend County&apos;s most sought-after location with top-rated schools and master-planned communities.
              </motion.p>
              
              {/* Katy Market Stats */}
              <motion.div 
                className="mt-8 grid grid-cols-2 gap-6 sm:flex sm:items-center sm:gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold">25%</div>
                  <div className="text-sm opacity-90">5-Year Growth Rate</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold">400,000+</div>
                  <div className="text-sm opacity-90">Metro Population</div>
                </div>
                <div className="text-white col-span-2 sm:col-span-1">
                  <div className="text-3xl sm:text-4xl font-bold">#1</div>
                  <div className="text-sm opacity-90">Texas School Districts</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div>
                  <Link
                    href="/roi-calculator"
                    className="cta-primary w-full sm:w-auto inline-flex items-center justify-center"
                  >
                    Calculate Katy ROI
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                <div>
                  <Link
                    href="#development-sites"
                    className="cta-secondary w-full sm:w-auto inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                  >
                    View Katy Development Sites
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
                  Exclusive Katy Market Intelligence
                </h3>
                <p className="text-gray-600">
                  Get insider access to Katy development trends, growth projections, and investment opportunities
                </p>
              </div>
              <LeadCaptureForm source="KATY_HERO" />
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    <span>20+ years Katy market expertise</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Katy Development Market Overview */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Katy is the <span className="gradient-text">Next Houston Development Hotspot</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              <strong>Katy development opportunities</strong> represent some of the highest-growth potential in the Houston metro area. 
              With exceptional schools, family-friendly communities, and strategic corporate relocations, 
              <strong>Katy real estate investment</strong> delivers consistent returns for forward-thinking developers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Explosive Population Growth",
                description: "Katy area population has grown 25% in 5 years, with projections showing continued 4-6% annual growth through 2030.",
                stats: "25% Growth Rate",
                highlight: true
              },
              {
                icon: Star,
                title: "Top-Rated School Districts", 
                description: "Katy ISD consistently ranks #1 in Texas, driving family migration and supporting premium residential development demand.",
                stats: "#1 in Texas"
              },
              {
                icon: Building2,
                title: "Corporate Headquarters Hub",
                description: "Major corporations like Igloo, Academy Sports, and BP America have established headquarters, creating employment demand.",
                stats: "50K+ New Jobs"
              },
              {
                icon: DollarSign,
                title: "Strong Economic Fundamentals", 
                description: "Median household income 40% above Texas average with low unemployment supporting commercial and residential development.",
                stats: "$85K Median Income"
              },
              {
                icon: MapPin,
                title: "Strategic West Houston Location",
                description: "Prime access to Energy Corridor, Galleria, and Bush Intercontinental Airport via major highways and Grand Parkway.",
                stats: "3 Major Highways"
              },
              {
                icon: Users,
                title: "Master-Planned Community Model",
                description: "Proven master-planned development success with multiple communities showing sustained appreciation and demand.",
                stats: "15+ Communities"
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`feature-card group ${feature.highlight ? 'ring-2 ring-green-500' : ''}`}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <div className="text-emerald-600 font-semibold text-sm">{feature.stats}</div>
                {feature.highlight && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Top Growth Market
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Katy Development Sites */}
      <section id="development-sites" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Available <span className="gradient-text">Katy Development Sites</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Premium <strong>Katy development sites</strong> and <strong>land investment</strong> opportunities 
              strategically located in high-growth corridors with established infrastructure and market demand.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Current Katy Development Categories
              </h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Residential Master-Planned</h4>
                  <p className="text-gray-600">
                    Large-scale <strong>Katy residential development</strong> opportunities for master-planned communities 
                    capitalizing on family migration and school district demand.
                  </p>
                  <div className="mt-2 text-emerald-600 font-medium">100-500 acre sites • $10M-$50M range</div>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Commercial Development</h4>
                  <p className="text-gray-600">
                    Strategic <strong>Katy commercial real estate</strong> sites along major corridors including 
                    retail, office, and mixed-use development opportunities.
                  </p>
                  <div className="mt-2 text-emerald-600 font-medium">5-25 acre parcels • $3M-$15M range</div>
                </div>

                <div className="border-l-4 border-teal-500 pl-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Industrial & Logistics</h4>
                  <p className="text-gray-600">
                    West Houston industrial development sites with Grand Parkway and highway access, 
                    perfect for distribution and manufacturing facilities.
                  </p>
                  <div className="mt-2 text-emerald-600 font-medium">10-100 acre sites • $2M-$25M range</div>
                </div>
              </div>
            </motion.div>

            <div className="feature-card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Access Exclusive Katy Opportunities
              </h3>
              <p className="text-gray-600 mb-6">
                Get first access to <strong>Katy land development</strong> opportunities and off-market deals 
                before they hit the public market.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span>Pre-market Katy development alerts</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span>School district impact analysis</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span>Infrastructure development timeline</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span>Population growth projections</span>
                </div>
              </div>

              <LeadCaptureForm source="KATY_DEVELOPMENT_SITES" />
            </motion.div>
          </div>

          {/* Success Stories */}
          <div className="bg-emerald-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Katy Development Success Stories
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">22% IRR</div>
                <div className="text-gray-700 font-medium mb-2">Cinco Ranch Extension</div>
                <div className="text-sm text-gray-600">350-home master-planned community completed in 18 months</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">$8.5M</div>
                <div className="text-gray-700 font-medium mb-2">Katy Commercial Plaza</div>
                <div className="text-sm text-gray-600">Mixed-use development with 95% pre-leasing before completion</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">18 Months</div>
                <div className="text-gray-700 font-medium mb-2">Average Timeline</div>
                <div className="text-sm text-gray-600">From land acquisition to certificate of occupancy</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Capitalize on Katy&apos;s Growth?
            </h2>
            <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
              Join successful developers who are building the future of Katy with strategic 
              <strong> land development investments</strong>
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-emerald-600 bg-white hover:bg-gray-50 transition-all shadow-lg"
                >
                  Schedule Katy Market Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/roi-calculator"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-semibold rounded-lg text-white bg-transparent hover:bg-white hover:text-emerald-600 transition-all"
                >
                  Calculate Katy Development ROI
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}