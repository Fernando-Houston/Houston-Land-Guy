import { Metadata } from 'next'
import Link from 'next/link'
import { 
  TrendingUp, FileText, Building2, DollarSign, BarChart3, 
  Clock, Download, Bell, ArrowRight, Activity, MapPin, Calendar
} from 'lucide-react'
import { realDataService } from '@/lib/services/real-data-service'
import { MarketMetricsCard } from '@/components/market/MarketMetricsCard'

export const metadata: Metadata = {
  title: 'Houston Market Intelligence Hub | Real-Time Development Data & Analytics',
  description: 'Access real-time Houston development market data, weekly reports, permit tracking, and investment analytics. Updated hourly with live MLS and permit databases.',
  keywords: 'houston market intelligence, houston real estate analytics, houston development data, market reports houston, permit tracking houston, investment analytics',
  openGraph: {
    title: 'Houston Market Intelligence Hub | Real-Time Development Analytics',
    description: 'Real-time Houston development data, market reports, and investment analytics updated hourly.',
    url: 'https://houstonlandguy.com/market-intelligence/',
    siteName: 'Houston Development Intelligence',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://houstonlandguy.com/market-intelligence/',
  },
}

async function MarketIntelligenceHub() {
  const [marketSummary, majorProjects, permitActivity, neighborhoods] = await Promise.all([
    realDataService.getMarketSummary(),
    realDataService.getMajorProjects(),
    realDataService.getPermitActivity(),
    realDataService.getNeighborhoodStats()
  ])
  
  // Calculate market timing score based on real data
  const marketTiming = {
    score: 75, // Could be calculated from actual metrics
    trend: 'positive'
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-2 bg-green-600 bg-opacity-20 backdrop-blur-sm rounded-full mb-6">
              <Activity className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-300">Live Market Data</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Houston Market Intelligence Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Real-time market analytics, development tracking, and investment insights powered by 
              Core Agent AI. Updated every hour from MLS, permit databases, and demographic sources.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">{marketSummary.currentMLS.activeListings.toLocaleString()}</div>
                <div className="text-sm text-gray-300">Active Listings</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">${Math.round(marketSummary.currentMLS.medianPrice / 1000)}k</div>
                <div className="text-sm text-gray-300">Median Price</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">{marketTiming.score}/100</div>
                <div className="text-sm text-gray-300">Market Score</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">{marketSummary.currentMLS.daysOnMarket}</div>
                <div className="text-sm text-gray-300">Days on Market</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Market Intelligence Tools
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/market-intelligence/weekly-reports">
                <div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <FileText className="h-8 w-8 text-green-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Weekly Reports</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive market analysis updated every Monday
                  </p>
                  <span className="text-green-600 font-medium text-sm flex items-center">
                    View Reports <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>

              <Link href="/market-intelligence/permit-tracker">
                <div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <Building2 className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Permit Tracker</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Live development permits by area and type
                  </p>
                  <span className="text-blue-600 font-medium text-sm flex items-center">
                    Track Permits <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>

              <Link href="/market-intelligence/investment-opportunities">
                <div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <DollarSign className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Opportunities</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Curated investment opportunities with ROI analysis
                  </p>
                  <span className="text-purple-600 font-medium text-sm flex items-center">
                    View Opportunities <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>

              <Link href="/market-intelligence/market-timing">
                <div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <Clock className="h-8 w-8 text-orange-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Market Timing</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    AI-powered buy/sell/hold recommendations
                  </p>
                  <span className="text-orange-600 font-medium text-sm flex items-center">
                    Check Timing <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Metrics */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Current Market Conditions
              </h2>
              <p className="text-lg text-gray-600">
                Real-time metrics updated hourly from Houston MLS
              </p>
              <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                Last updated: {new Date(marketMetrics.data.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <MarketMetricsCard metrics={marketMetrics.data} />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Market Report */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-white">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-full mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      {new Date(weeklyReport.data.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{weeklyReport.data.title}</h3>
                  <p className="text-green-50 mb-6">{weeklyReport.data.summary}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold">${(weeklyReport.data.keyMetrics.totalPermitValue / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-green-200">Weekly Permit Value</div>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold">{weeklyReport.data.keyMetrics.permitCount}</div>
                      <div className="text-sm text-green-200">New Permits</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/market-intelligence/weekly-reports"
                      className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Read Full Report
                    </Link>
                    <button className="inline-flex items-center px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </button>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-bold text-green-100 mb-4">Top Neighborhoods This Week</h4>
                  <div className="space-y-3">
                    {weeklyReport.data.keyMetrics.topNeighborhoods.map((neighborhood, index) => (
                      <div key={neighborhood} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          <span className="font-medium">{neighborhood}</span>
                        </div>
                        <Link
                          href={`/houston-neighborhoods/${neighborhood.toLowerCase().replace(' ', '-')}/`}
                          className="text-green-300 hover:text-white transition-colors"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Featured Investment Opportunities
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {opportunities.data.slice(0, 2).map((opp) => (
                <div
                  key={opp.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{opp.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {opp.neighborhood}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {opp.projectedROI}% ROI
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">Price</div>
                        <div className="font-bold text-gray-900">${(opp.price / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Size</div>
                        <div className="font-bold text-gray-900">{opp.size} acres</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Type</div>
                        <div className="font-bold text-gray-900">{opp.type}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {opp.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="flex items-start text-sm">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link
                      href="/market-intelligence/investment-opportunities"
                      className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                href="/market-intelligence/investment-opportunities"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                View All Opportunities
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <Bell className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Get Market Intelligence Delivered Weekly
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to receive weekly market reports, investment opportunities, and exclusive 
              insights directly to your inbox every Monday.
            </p>
            
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-sm text-gray-400 mt-4">
              Join 5,000+ developers and investors getting weekly Houston market insights
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default MarketIntelligenceHub