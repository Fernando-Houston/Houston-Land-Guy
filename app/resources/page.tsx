'use client'

import Link from 'next/link'
import { 
  ExternalLink, FileText, Calculator, Map, Building2, Users, 
  BookOpen, BarChart3, Gavel, DollarSign, TrendingUp, Home,
  AlertCircle, CheckCircle, Download, Globe
} from 'lucide-react'

export default function ResourcesPage() {
  const resourceCategories = [
    {
      title: "Development Tools & Calculators",
      icon: Calculator,
      color: "green",
      resources: [
        {
          name: "Houston Development ROI Calculator",
          description: "Calculate potential returns on Houston development projects with our advanced ROI tool",
          url: "/roi-calculator",
          type: "internal",
          featured: true
        },
        {
          name: "Construction Cost Estimator",
          description: "Estimate construction costs for various property types in Houston market",
          url: "https://www.rsmeans.com/",
          type: "external"
        },
        {
          name: "Development Pro Forma Templates",
          description: "Free Excel templates for development financial analysis",
          url: "https://www.adventuresincre.com/",
          type: "external"
        },
        {
          name: "Houston Development Cost Calculator",
          description: "Calculate total development costs including hard and soft costs",
          url: "/development-cost-calculator",
          type: "internal"
        }
      ]
    },
    {
      title: "Houston Regulatory Resources",
      icon: Gavel,
      color: "blue",
      resources: [
        {
          name: "Complete Guide to Houston Development Regulations",
          description: "Our comprehensive guide to Houston's no-zoning development regulations",
          url: "/blog/complete-guide-houston-development-regulations",
          type: "internal",
          featured: true
        },
        {
          name: "City of Houston Permitting Center",
          description: "Official portal for building permits and plan submissions",
          url: "https://www.houstonpermittingcenter.org/",
          type: "external"
        },
        {
          name: "Houston Planning & Development",
          description: "Official development standards, platting requirements, and ordinances",
          url: "https://www.houstontx.gov/planning/",
          type: "external"
        },
        {
          name: "Harris County Flood Control",
          description: "Floodplain maps and development requirements",
          url: "https://www.hcfcd.org/",
          type: "external"
        },
        {
          name: "Houston Public Works",
          description: "Infrastructure standards and requirements",
          url: "https://www.houstonpublicworks.org/",
          type: "external"
        }
      ]
    },
    {
      title: "Market Data & Research",
      icon: BarChart3,
      color: "purple",
      resources: [
        {
          name: "Houston Development Market Report Q1 2024",
          description: "Latest market analysis with $2.3B in permits and growth trends",
          url: "/blog/houston-development-market-report-q1-2024",
          type: "internal",
          featured: true
        },
        {
          name: "HAR.com Market Statistics",
          description: "Houston Association of Realtors market data and trends",
          url: "https://www.har.com/market-statistics",
          type: "external"
        },
        {
          name: "Greater Houston Partnership Data",
          description: "Economic data, demographics, and business statistics",
          url: "https://www.houston.org/houston-data",
          type: "external"
        },
        {
          name: "CoStar Market Analytics",
          description: "Commercial real estate market data and analytics",
          url: "https://www.costar.com/",
          type: "external"
        },
        {
          name: "Houston vs Austin Development Comparison",
          description: "Detailed comparison of Texas' top development markets",
          url: "/blog/houston-vs-austin-development-comparison",
          type: "internal"
        }
      ]
    },
    {
      title: "Mapping & GIS Resources",
      icon: Map,
      color: "orange",
      resources: [
        {
          name: "HCAD Property Search",
          description: "Harris County Appraisal District property information and maps",
          url: "https://www.hcad.org/",
          type: "external"
        },
        {
          name: "Houston GIS Portal",
          description: "City of Houston geographic information system",
          url: "https://cohgis-mycity.opendata.arcgis.com/",
          type: "external"
        },
        {
          name: "Google Earth Pro",
          description: "Free tool for site analysis and measurements",
          url: "https://www.google.com/earth/versions/#earth-pro",
          type: "external"
        },
        {
          name: "TxDOT Maps",
          description: "Texas transportation maps and traffic data",
          url: "https://www.txdot.gov/data-maps.html",
          type: "external"
        }
      ]
    },
    {
      title: "Industry Associations & Networks",
      icon: Users,
      color: "teal",
      resources: [
        {
          name: "Urban Land Institute Houston",
          description: "Premier organization for land use and real estate development professionals",
          url: "https://houston.uli.org/",
          type: "external"
        },
        {
          name: "Greater Houston Builders Association",
          description: "Trade association for residential construction industry",
          url: "https://www.ghba.org/",
          type: "external"
        },
        {
          name: "NAIOP Houston",
          description: "Commercial real estate development association",
          url: "https://www.naiophouston.org/",
          type: "external"
        },
        {
          name: "Houston Real Estate Council",
          description: "Coalition of real estate organizations",
          url: "https://www.houstonrec.org/",
          type: "external"
        }
      ]
    },
    {
      title: "Educational Resources",
      icon: BookOpen,
      color: "indigo",
      resources: [
        {
          name: "Rice University Real Estate Finance",
          description: "Certificate programs in real estate development and finance",
          url: "https://business.rice.edu/",
          type: "external"
        },
        {
          name: "UH Bauer Real Estate Center",
          description: "Research and education in real estate",
          url: "https://www.bauer.uh.edu/centers/real-estate/",
          type: "external"
        },
        {
          name: "Development Finance Initiative",
          description: "Free development finance training resources",
          url: "https://dfi.sog.unc.edu/",
          type: "external"
        },
        {
          name: "Houston Development Blog",
          description: "Expert insights and guides for Houston developers",
          url: "/blog",
          type: "internal"
        }
      ]
    },
    {
      title: "Financing & Investment",
      icon: DollarSign,
      color: "emerald",
      resources: [
        {
          name: "SBA 504 Loan Program",
          description: "Long-term, fixed-rate financing for real estate development",
          url: "https://www.sba.gov/funding-programs/loans/504-loans",
          type: "external"
        },
        {
          name: "Texas Capital Bank CRE",
          description: "Commercial real estate lending solutions",
          url: "https://www.texascapitalbank.com/",
          type: "external"
        },
        {
          name: "Houston Angel Network",
          description: "Angel investors for real estate ventures",
          url: "https://www.houstonangelnetwork.org/",
          type: "external"
        },
        {
          name: "Opportunity Zone Map",
          description: "Federal tax incentive zones in Houston",
          url: "https://opportunitydb.com/location/texas/houston/",
          type: "external"
        }
      ]
    },
    {
      title: "Environmental & Engineering",
      icon: AlertCircle,
      color: "red",
      resources: [
        {
          name: "Phase I ESA Providers",
          description: "Environmental site assessment consultants in Houston",
          url: "#",
          type: "directory"
        },
        {
          name: "TCEQ Resources",
          description: "Texas Commission on Environmental Quality regulations",
          url: "https://www.tceq.texas.gov/",
          type: "external"
        },
        {
          name: "Houston Drainage Requirements",
          description: "City of Houston drainage design manual",
          url: "https://www.houstonpublicworks.org/drainage-manual",
          type: "external"
        },
        {
          name: "Geotechnical Engineers Directory",
          description: "Licensed geotechnical consultants for Houston projects",
          url: "#",
          type: "directory"
        }
      ]
    }
  ]

  const featuredTools = [
    {
      title: "ROI Calculator",
      description: "Advanced calculator for Houston development projects",
      icon: Calculator,
      url: "/roi-calculator",
      color: "green"
    },
    {
      title: "Market Reports",
      description: "Latest Houston development market intelligence",
      icon: TrendingUp,
      url: "/blog",
      color: "blue"
    },
    {
      title: "Neighborhood Guides",
      description: "Detailed guides for key Houston submarkets",
      icon: Home,
      url: "/woodlands-development-land",
      color: "purple"
    },
    {
      title: "Consultation",
      description: "Get expert guidance on your development project",
      icon: Users,
      url: "/consultation",
      color: "orange"
    }
  ]

  const getIconComponent = (IconComponent: any, color: string) => {
    const colorClasses = {
      green: "text-green-600 bg-green-100",
      blue: "text-blue-600 bg-blue-100",
      purple: "text-purple-600 bg-purple-100",
      orange: "text-orange-600 bg-orange-100",
      teal: "text-teal-600 bg-teal-100",
      indigo: "text-indigo-600 bg-indigo-100",
      emerald: "text-emerald-600 bg-emerald-100",
      red: "text-red-600 bg-red-100"
    }
    
    return (
      <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.green}`}>
        <IconComponent className="h-6 w-6" />
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-green-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Houston Development <span className="gradient-text">Resources</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Essential tools, guides, and connections for successful real estate development in Houston. 
              Access regulatory resources, market data, calculators, and industry networks all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTools.map((tool, index) => (
                <div
                  key={tool.title}
                >
                  <Link 
                    href={tool.url}
                    className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
                  >
                    {getIconComponent(tool.icon, tool.color)}
                    <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {resourceCategories.map((category, categoryIndex) => (
              <div
                key={category.title}
              >
                <div className="flex items-center mb-8">
                  {getIconComponent(category.icon, category.color)}
                  <h2 className="ml-4 text-2xl font-bold text-gray-900">{category.title}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.resources.map((resource, index) => (
                    <div
                      key={resource.name}
                      className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
                        resource.featured ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex-1">{resource.name}</h3>
                        {resource.featured && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                      
                      {resource.type === 'internal' ? (
                        <Link 
                          href={resource.url}
                          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          View Resource
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      ) : resource.type === 'external' ? (
                        <a 
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          Visit Website
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center text-sm text-gray-500">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <Download className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Download Our Free Development Checklist
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Get our comprehensive Houston development checklist covering permits, regulations, 
                timelines, and best practices for successful projects.
              </p>
              <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-5 w-5 mr-2" />
                Download Free Checklist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Link Exchange Notice */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex items-start">
              <Globe className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Resource Partnership Opportunities
                </h3>
                <p className="text-gray-600 mb-4">
                  We're always looking to expand our resource directory with valuable tools and services 
                  for Houston developers. If you offer a service that benefits the Houston development 
                  community, we'd love to explore partnership opportunities.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Quality resources we're interested in include: development software, financial tools, 
                  engineering services, environmental consultants, legal services, and educational programs.
                </p>
                <Link 
                  href="/contact"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Submit Your Resource
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Need Personalized Development Guidance?
            </h2>
            <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
              Our experts can help you navigate Houston's development landscape and connect you 
              with the right resources for your specific project needs.
            </p>
            <div className="mt-8">
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-green-600 bg-white hover:bg-gray-50 transition-all shadow-lg"
              >
                Schedule Free Consultation
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}