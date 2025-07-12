'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, DollarSign, Building2, Users, MapPin, 
  Calculator, FileText, BarChart3, ArrowRight, CheckCircle,
  Home, Briefcase, TreePine, Factory, ChevronRight, Clock,
  Plane, Ship, Car, AlertCircle, Award, Zap, Shield,
  ChevronDown
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// Comprehensive city data
const cityData = {
  houston: {
    name: "Houston",
    tagline: "The Development Capital",
    color: "green",
    metrics: {
      landCost: 125000,
      permitDays: 30,
      roi: 22,
      zoning: "None",
      population: "2.3M",
      growth: 100000,
      propertyTax: 2.17
    },
    advantages: [
      { icon: Building2, text: "No zoning restrictions" },
      { icon: Ship, text: "Major port access" },
      { icon: DollarSign, text: "Lower costs" },
      { icon: Clock, text: "Faster permits" }
    ]
  },
  dallas: {
    name: "Dallas",
    tagline: "North Texas Hub",
    color: "blue",
    metrics: {
      landCost: 140000,
      permitDays: 45,
      roi: 19,
      zoning: "Moderate",
      population: "1.3M",
      growth: 80000,
      propertyTax: 2.18
    }
  },
  austin: {
    name: "Austin",
    tagline: "Tech Capital",
    color: "purple",
    metrics: {
      landCost: 280000,
      permitDays: 90,
      roi: 18,
      zoning: "Strict",
      population: "1.0M",
      growth: 50000,
      propertyTax: 2.15
    }
  },
  sanAntonio: {
    name: "San Antonio",
    tagline: "Military City",
    color: "red",
    metrics: {
      landCost: 80000,
      permitDays: 35,
      roi: 17,
      zoning: "Moderate",
      population: "1.5M",
      growth: 40000,
      propertyTax: 2.45
    }
  },
  fortWorth: {
    name: "Fort Worth",
    tagline: "Cowtown",
    color: "yellow",
    metrics: {
      landCost: 95000,
      permitDays: 40,
      roi: 18,
      zoning: "Moderate",
      population: "0.9M",
      growth: 30000,
      propertyTax: 2.31
    }
  }
}

// Visual comparison components
const MetricBar = ({ value, maxValue, color = "green", label }: any) => {
  const percentage = (value / maxValue) * 100
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{value.toLocaleString()}</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color}-500`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

const ComparisonRadar = ({ city1, city2 }: any) => {
  // Simple visual comparison using bars
  const metrics = [
    { key: 'roi', label: 'ROI %', max: 25 },
    { key: 'permitSpeed', label: 'Permit Speed', max: 100, invert: true },
    { key: 'landAffordability', label: 'Affordability', max: 300000, invert: true },
    { key: 'growth', label: 'Growth Rate', max: 120000 }
  ]

  return (
    <div className="space-y-4">
      {metrics.map((metric) => {
        const value1 = metric.key === 'permitSpeed' ? city1.metrics.permitDays :
                      metric.key === 'landAffordability' ? city1.metrics.landCost :
                      metric.key === 'growth' ? city1.metrics.growth :
                      city1.metrics.roi
        
        const value2 = metric.key === 'permitSpeed' ? city2.metrics.permitDays :
                      metric.key === 'landAffordability' ? city2.metrics.landCost :
                      metric.key === 'growth' ? city2.metrics.growth :
                      city2.metrics.roi

        const displayValue1 = metric.invert ? metric.max - value1 : value1
        const displayValue2 = metric.invert ? metric.max - value2 : value2
        
        return (
          <div key={metric.key}>
            <p className="text-sm font-medium text-gray-700 mb-2">{metric.label}</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <MetricBar 
                  value={displayValue1} 
                  maxValue={metric.max} 
                  color="green" 
                  label={city1.name}
                />
              </div>
              <div className="text-xs text-gray-500">vs</div>
              <div className="flex-1">
                <MetricBar 
                  value={displayValue2} 
                  maxValue={metric.max} 
                  color="gray" 
                  label={city2.name}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function HoustonVsTexasPage() {
  const [selectedCity, setSelectedCity] = useState('dallas')
  const [showCalculator, setShowCalculator] = useState(false)

  const otherCities = Object.keys(cityData).filter(city => city !== 'houston')

  return (
    <>
      {/* Hero Section with Visual Impact */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.3'%3E%3Cpath d='M0 50h100M50 0v100'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Houston Dominates Texas Development
            </h1>
            <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
              See why Houston beats every major Texas city in development costs, ROI, and opportunities.
              <Link href="/blog/why-invest-in-houston-real-estate" className="text-green-400 hover:text-green-300 underline ml-2">
                Learn why you need to invest now →
              </Link>
            </p>
            
            {/* Quick Visual Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-4xl font-bold text-green-400">50%</div>
                <div className="text-sm mt-2">Lower than Austin</div>
              </div>
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-4xl font-bold text-green-400">3x</div>
                <div className="text-sm mt-2">Faster Permits</div>
              </div>
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-4xl font-bold text-green-400">Zero</div>
                <div className="text-sm mt-2">Zoning Laws</div>
              </div>
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-4xl font-bold text-green-400">22%</div>
                <div className="text-sm mt-2">Average ROI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Comparison Tool */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Interactive City Comparison
            </h2>
            <p className="text-lg text-gray-600">
              Select a city to see how Houston compares
            </p>
          </div>

          {/* City Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {otherCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCity === city
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                vs {cityData[city as keyof typeof cityData].name}
              </button>
            ))}
          </div>

          {/* Visual Comparison */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div 
              className="bg-white rounded-2xl p-8 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={selectedCity}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{cityData.houston.name}</h3>
                  <p className="text-green-600 font-semibold">{cityData.houston.tagline}</p>
                </div>
                <div className="text-5xl">🏆</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Land Cost/Acre</span>
                  <span className="font-bold text-green-600">${cityData.houston.metrics.landCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Permit Approval</span>
                  <span className="font-bold text-green-600">{cityData.houston.metrics.permitDays} days</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Average ROI</span>
                  <span className="font-bold text-green-600">{cityData.houston.metrics.roi}%</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Zoning</span>
                  <span className="font-bold text-green-600">{cityData.houston.metrics.zoning}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {cityData.houston.advantages.map((adv, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <adv.icon className="w-4 h-4 text-green-600" />
                    <span>{adv.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="bg-white rounded-2xl p-8 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={selectedCity + '-comparison'}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {cityData[selectedCity as keyof typeof cityData].name}
                  </h3>
                  <p className="text-gray-600 font-semibold">
                    {cityData[selectedCity as keyof typeof cityData].tagline}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Land Cost/Acre</span>
                  <span className="font-bold">
                    ${cityData[selectedCity as keyof typeof cityData].metrics.landCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Permit Approval</span>
                  <span className="font-bold">
                    {cityData[selectedCity as keyof typeof cityData].metrics.permitDays} days
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Average ROI</span>
                  <span className="font-bold">
                    {cityData[selectedCity as keyof typeof cityData].metrics.roi}%
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Zoning</span>
                  <span className="font-bold">
                    {cityData[selectedCity as keyof typeof cityData].metrics.zoning}
                  </span>
                </div>
              </div>

              {/* Houston Advantage Summary */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-semibold text-green-800 mb-2">Houston Advantages:</p>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• {Math.round(((cityData[selectedCity as keyof typeof cityData].metrics.landCost - cityData.houston.metrics.landCost) / cityData[selectedCity as keyof typeof cityData].metrics.landCost) * 100)}% lower land costs</li>
                  <li>• {Math.round(cityData[selectedCity as keyof typeof cityData].metrics.permitDays / cityData.houston.metrics.permitDays)}x faster permits</li>
                  <li>• {cityData.houston.metrics.roi - cityData[selectedCity as keyof typeof cityData].metrics.roi}% higher ROI</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Visual Comparison Chart */}
          <div 
            className="mt-12 bg-white rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold mb-6 text-center">Performance Comparison</h3>
            <ComparisonRadar 
              city1={cityData.houston} 
              city2={cityData[selectedCity as keyof typeof cityData]} 
            />
          </div>
        </div>
      </section>

      {/* Comprehensive Comparison Table */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Texas Cities Comparison
            </h2>
            <p className="text-lg text-gray-600">
              All metrics at a glance - Houston consistently leads
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-4 text-left">Metric</th>
                  <th className="px-6 py-4 text-center bg-green-600">Houston</th>
                  <th className="px-6 py-4 text-center">Dallas</th>
                  <th className="px-6 py-4 text-center">Austin</th>
                  <th className="px-6 py-4 text-center">San Antonio</th>
                  <th className="px-6 py-4 text-center">Fort Worth</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Land Cost/Acre</td>
                  <td className="px-6 py-4 text-center font-bold text-green-600">$125,000</td>
                  <td className="px-6 py-4 text-center">$140,000</td>
                  <td className="px-6 py-4 text-center">$280,000</td>
                  <td className="px-6 py-4 text-center">$80,000</td>
                  <td className="px-6 py-4 text-center">$95,000</td>
                </tr>
                <tr className="border-b bg-gray-50 hover:bg-gray-100">
                  <td className="px-6 py-4 font-medium">Permit Time</td>
                  <td className="px-6 py-4 text-center font-bold text-green-600">30 days</td>
                  <td className="px-6 py-4 text-center">45 days</td>
                  <td className="px-6 py-4 text-center">90 days</td>
                  <td className="px-6 py-4 text-center">35 days</td>
                  <td className="px-6 py-4 text-center">40 days</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Average ROI</td>
                  <td className="px-6 py-4 text-center font-bold text-green-600">22%</td>
                  <td className="px-6 py-4 text-center">19%</td>
                  <td className="px-6 py-4 text-center">18%</td>
                  <td className="px-6 py-4 text-center">17%</td>
                  <td className="px-6 py-4 text-center">18%</td>
                </tr>
                <tr className="border-b bg-gray-50 hover:bg-gray-100">
                  <td className="px-6 py-4 font-medium">Zoning Laws</td>
                  <td className="px-6 py-4 text-center font-bold text-green-600">None</td>
                  <td className="px-6 py-4 text-center">Moderate</td>
                  <td className="px-6 py-4 text-center">Strict</td>
                  <td className="px-6 py-4 text-center">Moderate</td>
                  <td className="px-6 py-4 text-center">Moderate</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Annual Growth</td>
                  <td className="px-6 py-4 text-center font-bold text-green-600">100K+</td>
                  <td className="px-6 py-4 text-center">80K</td>
                  <td className="px-6 py-4 text-center">50K</td>
                  <td className="px-6 py-4 text-center">40K</td>
                  <td className="px-6 py-4 text-center">30K</td>
                </tr>
                <tr className="border-b bg-gray-50 hover:bg-gray-100">
                  <td className="px-6 py-4 font-medium">Property Tax</td>
                  <td className="px-6 py-4 text-center font-bold text-green-600">2.17%</td>
                  <td className="px-6 py-4 text-center">2.18%</td>
                  <td className="px-6 py-4 text-center">2.15%</td>
                  <td className="px-6 py-4 text-center">2.45%</td>
                  <td className="px-6 py-4 text-center">2.31%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual Winner Indicators */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div 
              className="bg-green-50 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Best ROI</h3>
              <p className="text-3xl font-bold text-green-600">Houston</p>
              <p className="text-sm text-gray-600 mt-1">22% average returns</p>
            </div>
            
            <div 
              className="bg-green-50 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Zap className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Fastest Permits</h3>
              <p className="text-3xl font-bold text-green-600">Houston</p>
              <p className="text-sm text-gray-600 mt-1">30-day average</p>
            </div>
            
            <div 
              className="bg-green-50 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Most Flexible</h3>
              <p className="text-3xl font-bold text-green-600">Houston</p>
              <p className="text-sm text-gray-600 mt-1">No zoning restrictions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Cost Calculator */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Calculate Your Houston Advantage
            </h2>
            <p className="text-lg text-gray-600">
              See how much you save by choosing Houston
            </p>
          </div>

          <div 
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="w-full flex items-center justify-between text-left mb-6"
            >
              <h3 className="text-xl font-bold">Quick Savings Calculator</h3>
              <ChevronDown className={`w-6 h-6 transition-transform ${showCalculator ? 'rotate-180' : ''}`} />
            </button>

            {showCalculator && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Size (acres)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compare with
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                      <option>Dallas</option>
                      <option>Austin</option>
                      <option>San Antonio</option>
                      <option>Fort Worth</option>
                    </select>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-4">Estimated Savings in Houston:</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-green-600">$200K</p>
                      <p className="text-sm text-gray-600">Land Cost Savings</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">45 Days</p>
                      <p className="text-sm text-gray-600">Time Saved</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">+3%</p>
                      <p className="text-sm text-gray-600">Higher ROI</p>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/roi-calculator"
                  className="block w-full bg-green-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Get Detailed Analysis
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Advantages Summary */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Houston Wins Every Time
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Building2 className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">No Zoning = Freedom</h3>
              <p className="text-gray-600 text-sm">
                Only major US city without zoning. Build what the market needs, where it needs it.
                <Link href="/blog/why-invest-in-houston-real-estate#no-zoning" className="text-green-600 hover:text-green-700 font-semibold block mt-2">
                  Learn more →
                </Link>
              </p>
            </div>

            <div 
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Ship className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Port = Global Access</h3>
              <p className="text-gray-600 text-sm">
                2nd largest US port. No other Texas city offers international shipping advantages.
              </p>
            </div>

            <div 
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Highest Growth</h3>
              <p className="text-gray-600 text-sm">
                100K+ new residents annually. More than Austin & San Antonio combined.
              </p>
            </div>

            <div 
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <DollarSign className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Best Returns</h3>
              <p className="text-gray-600 text-sm">
                22% average ROI beats every Texas city. Lower costs + higher demand = profits.
                <Link href="/blog/why-invest-in-houston-real-estate" className="text-green-600 hover:text-green-700 font-semibold block mt-2">
                  See full analysis →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Numbers Don't Lie - Houston Wins
            </h2>
            <p className="text-xl mb-8 text-green-50">
              Lower costs. Faster permits. Better returns. No restrictions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/investment-opportunities"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                View Houston Properties
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/sellers"
                className="bg-green-700 text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-green-800 transition-colors inline-flex items-center justify-center"
              >
                Sell Your Land
                <DollarSign className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}