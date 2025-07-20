import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, TrendingUp, Home, Users, School, DollarSign, ArrowRight } from 'lucide-react'
import { coreAgentsClient } from '@/lib/core-agents/client'
import { houstonDataService } from '@/lib/services/houston-data-service'

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
  { slug: 'cypress', name: 'Cypress', zipCode: '77433', highlight: '9.8% YoY Growth' },
  { slug: 'katy', name: 'Katy', zipCode: '77494', highlight: '8.9% YoY Growth' },
  { slug: 'heights', name: 'The Heights', zipCode: '77007', highlight: '18 Day DOM' },
  { slug: 'memorial', name: 'Memorial', zipCode: '77024', highlight: 'Premium Market' },
  { slug: 'montrose', name: 'Montrose', zipCode: '77006', highlight: '5.8% YoY Growth' },
  { slug: 'river-oaks', name: 'River Oaks', zipCode: '77019', highlight: 'Ultra Luxury $2.85M' },
  { slug: 'sugar-land', name: 'Sugar Land', zipCode: '77479', highlight: '6.2% YoY Growth' },
  { slug: 'woodlands', name: 'The Woodlands', zipCode: '77381', highlight: '52 New Communities' },
  { slug: 'galleria', name: 'Galleria', zipCode: '77056', highlight: 'Urban Core' },
  { slug: 'energy-corridor', name: 'Energy Corridor', zipCode: '77077', highlight: '5.5% YoY Growth' },
  { slug: 'pearland', name: 'Pearland', zipCode: '77584', highlight: '22 Communities' },
  { slug: 'spring', name: 'Spring', zipCode: '77379', highlight: 'Affordable Growth' },
  { slug: 'clear-lake', name: 'Clear Lake', zipCode: '77062', highlight: 'NASA Area' },
  { slug: 'bellaire', name: 'Bellaire', zipCode: '77401', highlight: 'Top Schools' },
  { slug: 'west-university', name: 'West University', zipCode: '77005', highlight: 'Stable Luxury' }
]

async function NeighborhoodGrid() {
  // Fetch market summary for hot markets
  const marketSummary = await houstonDataService.getMarketSummary()
  
  // Fetch data for all neighborhoods
  const neighborhoodDataPromises = neighborhoods.map(async (n) => {
    const [apiData, marketData] = await Promise.all([
      coreAgentsClient.getNeighborhoodData(n.slug),
      houstonDataService.getMarketData(n.zipCode)
    ])
    return { apiData, marketData }
  })
  
  const results = await Promise.all(neighborhoodDataPromises)
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {neighborhoods.map((neighborhood, index) => {
        const { apiData, marketData } = results[index]
        const data = apiData?.data
        
        // Use real market data if available, fall back to API data
        const medianPrice = marketData?.medianPrice || data?.medianHomePrice || 0
        const growthRate = marketData?.yearOverYearChange || data?.growthRate || 0
        const pricePerSqft = marketData?.pricePerSqft || data?.pricePerSqFt || 0
        const daysOnMarket = marketData?.daysOnMarket || 30
        const marketStatus = marketData?.marketStatus || 'stable'
        
        if (!data) return null
        
        return (
          <div
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
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          {neighborhood.highlight}
                        </span>
                        {marketStatus === 'hot' && (
                          <span className="inline-block text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">
                            HOT
                          </span>
                        )}
                      </div>
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
                        ${(medianPrice / 1000).toFixed(0)}K
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Growth Rate
                      </div>
                      <div className="font-bold text-green-600">
                        {growthRate > 0 ? '+' : ''}{growthRate}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Price/Sq Ft
                      </span>
                      <span className="font-medium text-gray-900">${pricePerSqft}</span>
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
                    {marketData && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">DOM</span>
                        <span className="font-medium text-gray-900">{daysOnMarket} days</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-green-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
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
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Houston Neighborhoods Development Guide
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Explore real-time market data across Houston's $43.8B construction market (+31% YoY). 
              Featuring hot markets like Cypress (9.8% growth), Katy (8.9%), and The Heights (18-day DOM).
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
          </div>
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
              <div className="text-3xl font-bold text-green-600">$43.8B</div>
              <div className="text-sm text-gray-600">2024 Construction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">6.4%</div>
              <div className="text-sm text-gray-600">Avg YoY Growth</div>
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
          <div
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
          </div>
        </div>
      </section>
    </>
  )
}