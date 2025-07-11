import Link from 'next/link'
import { Calculator, TrendingUp, Building2, DollarSign } from 'lucide-react'

const tools = [
  {
    name: 'ROI Calculator',
    description: 'Calculate potential returns on Houston development projects',
    href: '/roi-calculator',
    icon: Calculator,
    available: true,
  },
  {
    name: 'Market Dashboard',
    description: 'Real-time market data and trends for Houston neighborhoods',
    href: '/tools/market-dashboard',
    icon: TrendingUp,
    available: false,
  },
  {
    name: 'Zoning Explorer',
    description: 'Interactive zoning maps and regulation lookup',
    href: '/tools/zoning-explorer',
    icon: Building2,
    available: false,
  },
  {
    name: 'Financing Calculator',
    description: 'Compare financing options and estimate monthly payments',
    href: '/tools/financing-calculator',
    icon: DollarSign,
    available: false,
  },
]

export default function ToolsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Development Tools
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Powerful calculators and analysis tools designed for Houston developers
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={`relative rounded-lg border ${
                tool.available ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50'
              } p-8 shadow-sm hover:shadow-lg transition-shadow`}
            >
              {!tool.available && (
                <div className="absolute top-4 right-4 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  Coming Soon
                </div>
              )}
              <div className="flex items-center">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  tool.available ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <tool.icon className={`h-6 w-6 ${
                    tool.available ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">{tool.name}</h3>
              </div>
              <p className="mt-4 text-gray-600">{tool.description}</p>
              {tool.available ? (
                <Link
                  href={tool.href}
                  className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  Try it now →
                </Link>
              ) : (
                <span className="mt-6 inline-flex items-center text-gray-400">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}