'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  TrendingUp, DollarSign, Building2, Users, MapPin, 
  Calculator, CheckCircle, ArrowRight, Globe, Ship,
  Zap, Shield, Clock, BarChart3, Award, Target,
  Lightbulb, ChevronRight, AlertCircle, Home
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// Key investment reasons with data
const investmentReasons = [
  {
    icon: Building2,
    title: "Zero Zoning Restrictions",
    stat: "100%",
    description: "Complete development freedom - the only major US city without traditional zoning",
    impact: "Build what the market needs, where it needs it"
  },
  {
    icon: TrendingUp,
    title: "Highest ROI in Texas",
    stat: "22%",
    description: "Average annual returns beat every major Texas city",
    impact: "Your money works harder in Houston"
  },
  {
    icon: Users,
    title: "Explosive Population Growth",
    stat: "100K+",
    description: "New residents annually - more than Austin & San Antonio combined",
    impact: "Constant demand for new development"
  },
  {
    icon: Clock,
    title: "Fastest Permit Approvals",
    stat: "30 days",
    description: "3x faster than Austin, 33% faster than Dallas",
    impact: "Start generating returns sooner"
  },
  {
    icon: Ship,
    title: "Global Port Access",
    stat: "#2 US Port",
    description: "Direct international trade advantages no other Texas city offers",
    impact: "$300B annual economic impact"
  },
  {
    icon: DollarSign,
    title: "Lower Entry Costs",
    stat: "30-50%",
    description: "Less expensive than Austin, competitive with all Texas markets",
    impact: "More opportunities per investment dollar"
  }
]

// Success metrics
const houstonMetrics = {
  gdp: "$534 Billion",
  jobs: "3.2 Million",
  companies: "5,000+ Energy Cos",
  cranes: "40+ Active",
  developments: "$10B+ Pipeline",
  fortune500: "24 Headquarters"
}

// Investment opportunities by type
const opportunityTypes = [
  {
    type: "Residential Development",
    demand: "Extreme",
    roi: "18-25%",
    examples: ["Master-planned communities", "Townhome projects", "Luxury apartments"],
    hotSpots: ["The Woodlands", "Katy", "Sugar Land"]
  },
  {
    type: "Commercial/Retail",
    demand: "High",
    roi: "15-22%",
    examples: ["Strip centers", "Mixed-use", "Entertainment districts"],
    hotSpots: ["Energy Corridor", "Galleria", "Downtown"]
  },
  {
    type: "Industrial/Logistics",
    demand: "Very High",
    roi: "20-28%",
    examples: ["Warehouses", "Distribution centers", "Manufacturing"],
    hotSpots: ["East Houston", "Pasadena", "Port area"]
  },
  {
    type: "Medical/Office",
    demand: "High",
    roi: "16-20%",
    examples: ["Medical plazas", "Tech offices", "Co-working spaces"],
    hotSpots: ["Medical Center", "Woodlands", "Sugar Land"]
  }
]

export default function WhyInvestHoustonPage() {
  return (
    <article className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                <Link href="/blog" className="text-gray-300 hover:text-white">Blog</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                <span className="text-white">Why Invest in Houston</span>
              </li>
            </ol>
          </nav>

          <div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Why You Need to Invest in Houston Real Estate Now
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              The data is undeniable: Houston offers the best risk-adjusted returns, 
              fastest growth, and most developer-friendly environment in America.
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <span>By Houston Development Intelligence</span>
              <span>•</span>
              <span>January 15, 2025</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section className="bg-green-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {Object.entries(houstonMetrics).map(([key, value]) => (
              <div key={key}>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm opacity-90 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xl font-semibold text-gray-900 mb-6">
            If you're looking for the best real estate investment market in America, 
            the answer isn't New York, Los Angeles, or even Austin. It's Houston.
          </p>
          
          <p className="text-gray-700 mb-6">
            While other markets grab headlines with sky-high prices and restrictive regulations, 
            Houston quietly delivers something far more valuable: <strong>consistent 22% annual returns</strong> with 
            unmatched development freedom and explosive growth fundamentals.
          </p>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 my-8">
            <p className="font-semibold text-gray-900 mb-2">The Bottom Line:</p>
            <p className="text-gray-700">
              Houston adds 100,000+ residents annually, has zero zoning restrictions, 
              offers 30-day permit approvals, and delivers the highest ROI in Texas. 
              No other major US city combines these advantages.
            </p>
          </div>
        </div>

        {/* 6 Reasons Section */}
        <div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            6 Reasons Houston Dominates Real Estate Investment
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {investmentReasons.map((reason, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <reason.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{reason.title}</h3>
                      <span className="text-2xl font-bold text-green-600">{reason.stat}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{reason.description}</p>
                    <p className="text-sm font-semibold text-green-700">
                      → {reason.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Zoning Deep Dive */}
        <div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            The Secret Weapon: No Zoning Laws
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Houston is the only major American city without traditional zoning laws. 
              This isn't a bug—it's the feature that creates unparalleled investment opportunities.
            </p>

            <div className="bg-gray-50 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What This Means for Investors:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Adaptive Development:</strong> Convert office to residential when market shifts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Mixed-Use Freedom:</strong> Combine retail, office, and residential in one project</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Fast Pivots:</strong> Respond to market demands without rezoning battles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Innovation:</strong> Create new development concepts impossible elsewhere</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700">
              <Link href="/houston-vs-texas" className="text-green-600 hover:text-green-700 font-semibold">
                Compare this to Austin's strict zoning
              </Link> where changing use requires months of hearings, or Dallas where mixed-use faces numerous restrictions. 
              In Houston, if the market wants it and you can build it safely, you can do it.
            </p>
          </div>
        </div>

        {/* Population Growth */}
        <div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            100,000+ New Residents Every Year
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Where They're Coming From:</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>California</span>
                  <span className="font-semibold">28%</span>
                </li>
                <li className="flex justify-between">
                  <span>New York/Northeast</span>
                  <span className="font-semibold">22%</span>
                </li>
                <li className="flex justify-between">
                  <span>International</span>
                  <span className="font-semibold">20%</span>
                </li>
                <li className="flex justify-between">
                  <span>Other Texas Cities</span>
                  <span className="font-semibold">18%</span>
                </li>
                <li className="flex justify-between">
                  <span>Midwest</span>
                  <span className="font-semibold">12%</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What They Need:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Home className="w-5 h-5 text-blue-600 mr-3" />
                  <span>40,000+ new homes annually</span>
                </li>
                <li className="flex items-center">
                  <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                  <span>5M+ sq ft office space</span>
                </li>
                <li className="flex items-center">
                  <DollarSign className="w-5 h-5 text-blue-600 mr-3" />
                  <span>$10B+ in retail spending</span>
                </li>
                <li className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <span>Endless service demands</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700">
            This isn't a temporary boom—it's sustained growth driven by job creation, 
            affordable living, and business-friendly policies. Every new resident needs 
            housing, shopping, services, and employment spaces. That's your opportunity.
          </p>
        </div>

        {/* Investment Opportunities */}
        <div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Where to Invest: Opportunities by Sector
          </h2>

          <div className="space-y-6">
            {opportunityTypes.map((opp, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{opp.type}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">
                        Demand: <span className={`font-semibold ${
                          opp.demand === 'Extreme' ? 'text-red-600' : 
                          opp.demand === 'Very High' ? 'text-orange-600' : 'text-green-600'
                        }`}>{opp.demand}</span>
                      </span>
                      <span className="text-sm">
                        ROI Range: <span className="font-semibold text-green-600">{opp.roi}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Best For:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {opp.examples.map((example, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Hot Spots:</p>
                    <div className="flex flex-wrap gap-2">
                      {opp.hotSpots.map((spot, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {spot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Advantages */}
        <div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Global City Advantages
          </h2>
          
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Ship className="w-6 h-6 text-blue-600 mr-3" />
                  Port of Houston
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 2nd largest port in US</li>
                  <li>• $300B annual economic impact</li>
                  <li>• Direct Asia/Europe connections</li>
                  <li>• Drives industrial demand</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-6 h-6 text-green-600 mr-3" />
                  Energy Capital
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 5,000+ energy companies</li>
                  <li>• Global headquarters hub</li>
                  <li>• Renewable energy boom</li>
                  <li>• High-paying job creation</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-gray-700">
            No other Texas city—not even Dallas—offers these global economic drivers. 
            Austin may have tech, but Houston has energy, healthcare, aerospace, and 
            international trade all driving demand for development.
          </p>
        </div>

        {/* Timing Section */}
        <div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why Now is the Perfect Time
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Interest Rates Stabilizing</h3>
                <p className="text-gray-700">
                  After the recent hikes, rates are stabilizing, creating a perfect entry window 
                  before the next growth cycle accelerates prices.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Corporate Relocations Accelerating</h3>
                <p className="text-gray-700">
                  Major companies continue moving to Houston from high-tax states, 
                  bringing thousands of high-income employees needing housing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Infrastructure Investments</h3>
                <p className="text-gray-700">
                  $10B+ in infrastructure projects underway, including highway expansions 
                  and flood mitigation, opening new development corridors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  <Link href="/houston-vs-texas" className="text-green-600 hover:text-green-700">
                    Other Texas Cities Hitting Limits
                  </Link>
                </h3>
                <p className="text-gray-700">
                  Austin's astronomical prices and Dallas's slower growth make Houston 
                  the clear choice for value and upside potential.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Mitigation */}
        <div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Addressing the Concerns
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    "What about flooding?"
                  </h3>
                  <p className="text-gray-700">
                    Houston has invested $2.5B in flood mitigation since 2018. New developments 
                    require modern drainage. Smart investors focus on areas with updated infrastructure 
                    and proper elevation—our team knows exactly where.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    "Is it too spread out?"
                  </h3>
                  <p className="text-gray-700">
                    Houston's size is an advantage—it means more opportunities and diverse submarkets. 
                    Each area has its own dynamics, allowing investors to diversify within one metro.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    "What if oil prices crash?"
                  </h3>
                  <p className="text-gray-700">
                    Houston's economy is far more diverse than people realize. Healthcare, aerospace, 
                    technology, and logistics now drive more job growth than traditional energy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Invest in Houston's Future?
            </h2>
            <p className="text-xl mb-8 text-green-50">
              Join 500+ successful developers and investors who've discovered Houston's advantages
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/investment-opportunities"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                View Current Opportunities
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/roi-calculator"
                className="bg-green-700 text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-green-800 transition-colors inline-flex items-center justify-center"
              >
                Calculate Your ROI
                <Calculator className="ml-2 w-5 h-5" />
              </Link>
            </div>

            <p className="mt-8 text-sm text-green-100">
              Or call us directly: (713) 555-LAND
            </p>
          </div>
        </div>

        {/* Conclusion */}
        <div 
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The Verdict is Clear
          </h2>
          
          <p className="text-gray-700 mb-6">
            Houston isn't just another investment market—it's THE investment market for 
            developers and investors who want maximum returns with minimum restrictions.
          </p>

          <p className="text-gray-700 mb-6">
            While other cities make headlines, Houston makes millionaires. The combination 
            of no zoning, massive growth, global economic drivers, and development freedom 
            creates opportunities you simply can't find anywhere else.
          </p>

          <p className="text-gray-700 font-semibold">
            The only question isn't whether to invest in Houston—it's how quickly you can 
            get started before the best opportunities are gone.
          </p>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link 
              href="/blog/houston-development-market-report-q1-2024"
              className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-green-600 mb-1">
                Houston Development Market Report Q1 2024
              </h4>
              <p className="text-sm text-gray-600">Latest data and trends</p>
            </Link>
            <Link 
              href="/houston-vs-texas"
              className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-green-600 mb-1">
                Houston vs Other Texas Cities
              </h4>
              <p className="text-sm text-gray-600">Detailed comparison guide</p>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}