'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, TrendingUp, Building2, DollarSign, Users, CheckCircle, Award, Briefcase } from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

export default function SugarLandDevelopmentPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-700 to-gray-900 opacity-95" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div className="mb-12 lg:mb-0">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="text-teal-200 font-medium">Most Affluent Houston Suburb</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Sugar Land Development Sites
                <span className="block text-3xl sm:text-4xl lg:text-5xl text-teal-300 mt-2">
                  Premium Commercial Opportunities
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-100 lg:text-xl">
                Discover exclusive <strong>Sugar Land development opportunities</strong> in Houston&apos;s most affluent suburb. 
                Premium <strong>Sugar Land commercial real estate</strong> and <strong>investment properties</strong> in a market 
                known for corporate headquarters, medical facilities, and high-end retail development.
              </p>
              
              {/* Sugar Land Market Stats */}
              <div className="mt-8 grid grid-cols-2 gap-6 sm:flex sm:items-center sm:gap-8">
                <div className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold">$110K+</div>
                  <div className="text-sm opacity-90">Median Income</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold">50+</div>
                  <div className="text-sm opacity-90">Corporate HQs</div>
                </div>
                <div className="text-white col-span-2 sm:col-span-1">
                  <div className="text-3xl sm:text-4xl font-bold">A+</div>
                  <div className="text-sm opacity-90">Business Climate</div>
                </div>
              </div>
              
              <div className="mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div>
                  <Link
                    href="/roi-calculator"
                    className="cta-primary w-full sm:w-auto inline-flex items-center justify-center"
                  >
                    Calculate Sugar Land ROI
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                <div>
                  <Link
                    href="#commercial-opportunities"
                    className="cta-secondary w-full sm:w-auto inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                  >
                    View Commercial Sites
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="feature-card shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Sugar Land Investment Analysis
                </h3>
                <p className="text-gray-600">
                  Get exclusive Sugar Land commercial development insights and investment opportunities
                </p>
              </div>
              <LeadCaptureForm source="SUGAR_LAND_HERO" />
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    <span>Fortune 500 market expertise</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sugar Land Market Advantages */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Sugar Land for <span className="gradient-text">Commercial Development</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              <strong>Sugar Land development opportunities</strong> offer unmatched potential for commercial and mixed-use projects. 
              Home to major corporations, world-class medical facilities, and affluent demographics, 
              <strong>Sugar Land commercial development</strong> delivers premium returns for sophisticated investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: "Corporate Hub Excellence",
                description: "Home to 50+ corporate headquarters including Fluor, Nalco Champion, and CVR Energy, creating consistent commercial demand.",
                stats: "50+ HQs",
                highlight: true
              },
              {
                icon: DollarSign,
                title: "Highest Income Demographics", 
                description: "Median household income exceeds $110,000, supporting premium retail, dining, and professional services development.",
                stats: "$110K+ Income"
              },
              {
                icon: Building2,
                title: "Medical Center Growth",
                description: "Sugar Land Medical Center expansion creates opportunities for medical office buildings and supporting commercial development.",
                stats: "1M+ Sq Ft Medical"
              },
              {
                icon: Award,
                title: "Award-Winning Planning", 
                description: "Master-planned development with established infrastructure, reducing development risk and accelerating project timelines.",
                stats: "A+ Infrastructure"
              },
              {
                icon: MapPin,
                title: "Strategic Houston Access",
                description: "Prime location with easy access to Houston CBD, Texas Medical Center, and Bush Intercontinental via US-59 and Beltway 8.",
                stats: "20 Min to Downtown"
              },
              {
                icon: TrendingUp,
                title: "Sustained Value Growth",
                description: "Commercial property values have appreciated 8-12% annually, with Class A office commanding premium rents.",
                stats: "12% Annual Growth"
              }
            ].map((feature, index) => (
              <div>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <div className="text-teal-600 font-semibold text-sm">{feature.stats}</div>
                {feature.highlight && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      Premium Market
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Development Opportunities */}
      <section id="commercial-opportunities" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Current <span className="gradient-text">Sugar Land Commercial Opportunities</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Premium <strong>Sugar Land commercial development</strong> sites and <strong>investment properties</strong> 
              in prime locations with established corporate presence and affluent demographics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Sugar Land Development Categories
              </h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-teal-500 pl-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Class A Office Development</h4>
                  <p className="text-gray-600">
                    Corporate office <strong>Sugar Land commercial real estate</strong> opportunities in established 
                    business parks with Fortune 500 neighbors and premium amenities.
                  </p>
                  <div className="mt-2 text-teal-600 font-medium">2-10 acre sites • $5M-$25M range</div>
                </div>

                <div className="border-l-4 border-emerald-500 pl-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Medical Office Buildings</h4>
                  <p className="text-gray-600">
                    Healthcare development sites near Sugar Land Medical Center and Methodist Hospital, 
                    ideal for specialty clinics and medical professional buildings.
                  </p>
                  <div className="mt-2 text-teal-600 font-medium">1-5 acre parcels • $3M-$15M range</div>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Upscale Retail & Mixed-Use</h4>
                  <p className="text-gray-600">
                    Premium retail and mixed-use <strong>Sugar Land development sites</strong> in high-traffic 
                    corridors serving affluent residents and corporate employees.
                  </p>
                  <div className="mt-2 text-teal-600 font-medium">3-15 acre sites • $8M-$30M range</div>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Exclusive Sugar Land Opportunities
              </h3>
              <p className="text-gray-600 mb-6">
                Access off-market <strong>Sugar Land investment properties</strong> and development sites 
                before they become publicly available.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-teal-500 mr-3" />
                  <span>Corporate campus opportunities</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-teal-500 mr-3" />
                  <span>Medical facility development sites</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-teal-500 mr-3" />
                  <span>Premium retail locations</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-teal-500 mr-3" />
                  <span>Mixed-use development parcels</span>
                </div>
              </div>

              <LeadCaptureForm source="SUGAR_LAND_COMMERCIAL" />
            </div>
          </div>

          {/* Success Metrics */}
          <div className="bg-teal-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Sugar Land Development Success Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">95%</div>
                <div className="text-gray-700 font-medium mb-2">Occupancy Rate</div>
                <div className="text-sm text-gray-600">Class A office properties maintain highest occupancy in Houston metro</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">$32/SF</div>
                <div className="text-gray-700 font-medium mb-2">Average Office Rent</div>
                <div className="text-sm text-gray-600">Premium rents 25% above Houston average for Class A space</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">18% IRR</div>
                <div className="text-gray-700 font-medium mb-2">Average Returns</div>
                <div className="text-sm text-gray-600">Commercial development projects averaging 18% internal rate of return</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sugar Land Business Environment */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sugar Land&apos;s <span className="gradient-text">Business-Friendly Environment</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Major Employers & Corporate Presence</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Fluor Corporation</h4>
                    <p className="text-sm text-gray-600">Global engineering & construction headquarters</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Nalco Champion</h4>
                    <p className="text-sm text-gray-600">Energy services global operations center</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">CVR Energy</h4>
                    <p className="text-sm text-gray-600">Petroleum refining headquarters</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Methodist Sugar Land Hospital</h4>
                    <p className="text-sm text-gray-600">321-bed full-service hospital campus</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Development Incentives</h3>
              
              <div className="bg-teal-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-3">Sugar Land Economic Development</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-teal-500 mr-2 mt-0.5" />
                    <span>Tax abatements for qualifying commercial projects</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-teal-500 mr-2 mt-0.5" />
                    <span>Fast-track permitting for corporate developments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-teal-500 mr-2 mt-0.5" />
                    <span>Infrastructure support for major employers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-teal-500 mr-2 mt-0.5" />
                    <span>Foreign Trade Zone advantages</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-700" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Develop in Sugar Land?
            </h2>
            <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
              Join Fortune 500 companies and successful developers in Sugar Land&apos;s 
              <strong> premium commercial market</strong>
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <div>
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-teal-600 bg-white hover:bg-gray-50 transition-all shadow-lg"
                >
                  Schedule Sugar Land Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div>
                <Link
                  href="/roi-calculator"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-semibold rounded-lg text-white bg-transparent hover:bg-white hover:text-teal-600 transition-all"
                >
                  Calculate Commercial ROI
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}