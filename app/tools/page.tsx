import Link from 'next/link'
import { Calculator, TrendingUp, Building2, DollarSign, Calendar } from 'lucide-react'

const tools = [
  {
    name: 'ROI Calculator',
    description: 'Calculate potential returns on Houston development projects',
    href: '/roi-calculator',
    icon: Calculator,
    available: true,
    gradient: 'from-blue-400 to-indigo-600',
    lightGradient: 'from-blue-50 to-indigo-50',
  },
  {
    name: 'Market Dashboard',
    description: 'Real-time market data and trends for Houston neighborhoods',
    href: '/tools/market-dashboard',
    icon: TrendingUp,
    available: true,
    gradient: 'from-purple-400 to-pink-600',
    lightGradient: 'from-purple-50 to-pink-50',
  },
  {
    name: 'Zoning Explorer',
    description: 'Interactive zoning maps and regulation lookup',
    href: '/tools/zoning-explorer',
    icon: Building2,
    available: true,
    gradient: 'from-teal-400 to-cyan-600',
    lightGradient: 'from-teal-50 to-cyan-50',
  },
  {
    name: 'Financing Calculator',
    description: 'Compare financing options and estimate monthly payments',
    href: '/tools/financing-calculator',
    icon: DollarSign,
    available: true,
    gradient: 'from-green-400 to-emerald-600',
    lightGradient: 'from-green-50 to-emerald-50',
  },
  {
    name: 'Development Timeline',
    description: 'Create Gantt charts for project planning with Houston-specific phases',
    href: '/tools/development-timeline',
    icon: Calendar,
    available: true,
    gradient: 'from-orange-400 to-red-600',
    lightGradient: 'from-orange-50 to-red-50',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Development Tools
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful calculators and analysis tools designed for Houston developers
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <div
              key={tool.name}
              className={`relative group transform transition-all duration-300 hover:scale-105 ${
                tool.available ? '' : 'opacity-75'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${tool.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              
              <div className={`relative h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100`}>
                {!tool.available && (
                  <div className="absolute top-4 right-4 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 z-10">
                    Coming Soon
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${tool.gradient}`} />
                
                <div className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.lightGradient} mb-6`}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                      <tool.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  {tool.available ? (
                    <Link
                      href={tool.href}
                      className={`inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r ${tool.gradient} text-white font-medium hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5`}
                    >
                      Try it now
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center text-gray-400 font-medium">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Custom Analysis?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our AI assistant Fernando-X can help you with advanced analysis and custom calculations
            </p>
            <Link
              href="/assistant"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
            >
              Ask Fernando-X
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}