import { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, TrendingUp, Home, Users, School, DollarSign, ArrowRight } from 'lucide-react'
import { coreAgentsClient } from '@/lib/core-agents/client'

export const metadata: Metadata = {
  title: 'Houston Neighborhoods Development Guide | Real Estate Investment by Area',
  description: 'Explore development opportunities across 15+ Houston neighborhoods. Compare real-time market data, demographics, permit activity, and investment potential by area.',
  keywords: 'houston neighborhoods, houston real estate by area, houston development map, neighborhood comparison houston, houston investment areas, houston suburbs development',
  openGraph: {
    title: 'Houston Neighborhoods Development Guide | Investment Opportunities by Area',
    description: 'Compare development opportunities across Houston neighborhoods with real-time market data and investment insights.',
    url: 'https://houstonlandguy.com/houston-neighborhoods/',
    siteName: 'Houston Development Intelligence',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://houstonlandguy.com/houston-neighborhoods/',
  },
}

const neighborhoods = [
  { slug: 'cypress', name: 'Cypress', highlight: 'Fastest Growing' },
  { slug: 'pearland', name: 'Pearland', highlight: 'Top Schools' },
  { slug: 'memorial', name: 'Memorial', highlight: 'Premium Market' },
  { slug: 'spring', name: 'Spring', highlight: 'Affordable Growth' },
  { slug: 'conroe', name: 'Conroe', highlight: 'Emerging Market' },
  { slug: 'richmond', name: 'Richmond', highlight: 'Master-Planned' },
  { slug: 'friendswood', name: 'Friendswood', highlight: 'Family Friendly' },
  { slug: 'league-city', name: 'League City', highlight: 'Waterfront Living' },
  { slug: 'clear-lake', name: 'Clear Lake', highlight: 'NASA Area' },
  { slug: 'bellaire', name: 'Bellaire', highlight: 'Urban Luxury' },
  { slug: 'river-oaks', name: 'River Oaks', highlight: 'Ultra Premium' },
  { slug: 'heights', name: 'The Heights', highlight: 'Historic Charm' },
  { slug: 'montrose', name: 'Montrose', highlight: 'Urban Core' },
  { slug: 'energy-corridor', name: 'Energy Corridor', highlight: 'Corporate Hub' },
  { slug: 'champions', name: 'Champions', highlight: 'Established Value' }
]

async function NeighborhoodGrid() {
  // Fetch data for all neighborhoods
  const neighborhoodDataPromises = neighborhoods.map(n => 
    coreAgentsClient.getNeighborhoodData(n.slug)
  )
  
  const results = await Promise.all(neighborhoodDataPromises)
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {neighborhoods.map((neighborhood, index) => {
        const data = results[index]?.data
        
        if (!data) return null
        
        return (
          <motion.div
            key={neighborhood.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Link href={`/houston-neighborhoods/${neighborhood.slug}/`}>
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {neighborhood.name}
                      </h3>
                      <span className="inline-block mt-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {neighborhood.highlight}
                      </span>
                    </div>
                    <MapPin className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <Home className="h-4 w-4 mr-1" />
                        Median Price
                      </div>
                      <div className="font-bold text-gray-900">
                        ${(data.medianHomePrice / 1000).toFixed(0)}K
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Growth Rate
                      </div>
                      <div className="font-bold text-green-600">
                        +{data.growthRate}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Price/Sq Ft
                      </span>
                      <span className="font-medium text-gray-900">${data.pricePerSqFt}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Population
                      </span>
                      <span className="font-medium text-gray-900">{data.population.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <School className="h-3 w-3 mr-1" />
                        Schools
                      </span>
                      <span className="font-medium text-gray-900">{data.schoolRating}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-green-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function HoustonNeighborhoodsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Houston Neighborhoods Development Guide
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Explore real-time market data, demographics, and investment opportunities across 
              Houston's fastest-growing neighborhoods. Updated hourly with live MLS and permit data.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/market-intelligence"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                View Market Intelligence Hub
              </Link>
              <Link
                href="/neighborhood-comparison"
                className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors"
              >
                Compare Neighborhoods
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">15+</div>
              <div className="text-sm text-gray-600">Active Neighborhoods</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">$2.3B</div>
              <div className="text-sm text-gray-600">Q1 2025 Permits</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">5.2%</div>
              <div className="text-sm text-gray-600">Avg Growth Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">Live</div>
              <div className="text-sm text-gray-600">Market Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhood Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NeighborhoodGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Get Neighborhood-Specific Investment Reports
            </h2>
            <p className="text-lg text-green-50 mb-8 max-w-2xl mx-auto">
              Download detailed market analysis reports for any Houston neighborhood including 
              demographics, permit data, and investment projections.
            </p>
            <Link
              href="/consultation"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors"
            >
              Get Your Custom Report
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}