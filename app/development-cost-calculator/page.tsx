'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Calculator, DollarSign, Building2, Home, Warehouse, Store, 
  TrendingUp, FileText, Download, Info, CheckCircle, AlertCircle 
} from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

interface CostBreakdown {
  landCost: number
  hardCosts: number
  softCosts: number
  financingCosts: number
  contingency: number
  totalCost: number
  costPerSqFt: number
  costPerUnit?: number
}

export default function DevelopmentCostCalculator() {
  const [projectType, setProjectType] = useState<string>('residential')
  const [sqFootage, setSqFootage] = useState<string>('')
  const [units, setUnits] = useState<string>('')
  const [landPrice, setLandPrice] = useState<string>('')
  const [quality, setQuality] = useState<string>('standard')
  const [showResults, setShowResults] = useState(false)
  const [breakdown, setBreakdown] = useState<CostBreakdown | null>(null)

  // Houston-specific construction costs per sq ft (2024)
  const constructionCosts = {
    residential: {
      economy: 120,
      standard: 145,
      premium: 185,
      luxury: 250
    },
    multifamily: {
      economy: 110,
      standard: 135,
      premium: 165,
      luxury: 195
    },
    office: {
      economy: 140,
      standard: 180,
      premium: 220,
      luxury: 280
    },
    retail: {
      economy: 100,
      standard: 130,
      premium: 160,
      luxury: 200
    },
    industrial: {
      economy: 45,
      standard: 65,
      premium: 85,
      luxury: 110
    }
  }

  const softCostPercentages = {
    residential: 0.25,
    multifamily: 0.28,
    office: 0.30,
    retail: 0.27,
    industrial: 0.22
  }

  const financingCostPercentages = {
    residential: 0.08,
    multifamily: 0.10,
    office: 0.12,
    retail: 0.10,
    industrial: 0.08
  }

  const calculateCosts = () => {
    const sqFt = parseFloat(sqFootage) || 0
    const unitCount = parseFloat(units) || 0
    const land = parseFloat(landPrice) || 0

    if (sqFt === 0) return

    const hardCostPerSqFt = constructionCosts[projectType][quality]
    const hardCosts = sqFt * hardCostPerSqFt
    const softCosts = hardCosts * softCostPercentages[projectType]
    const subtotal = land + hardCosts + softCosts
    const financingCosts = subtotal * financingCostPercentages[projectType]
    const contingency = (hardCosts + softCosts) * 0.10 // 10% contingency
    const totalCost = subtotal + financingCosts + contingency

    const costBreakdown: CostBreakdown = {
      landCost: land,
      hardCosts,
      softCosts,
      financingCosts,
      contingency,
      totalCost,
      costPerSqFt: totalCost / sqFt,
      costPerUnit: unitCount > 0 ? totalCost / unitCount : undefined
    }

    setBreakdown(costBreakdown)
    setShowResults(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (amount: number, total: number) => {
    return ((amount / total) * 100).toFixed(1)
  }

  const projectTypeInfo = {
    residential: {
      icon: Home,
      label: "Single-Family Residential",
      description: "Custom homes, spec homes, and residential subdivisions"
    },
    multifamily: {
      icon: Building2,
      label: "Multifamily",
      description: "Apartments, condos, townhomes, and mixed-use residential"
    },
    office: {
      icon: Building2,
      label: "Office/Commercial",
      description: "Class A/B office buildings, medical offices, flex space"
    },
    retail: {
      icon: Store,
      label: "Retail/Mixed-Use",
      description: "Shopping centers, restaurants, entertainment venues"
    },
    industrial: {
      icon: Warehouse,
      label: "Industrial/Warehouse",
      description: "Distribution centers, manufacturing, flex industrial"
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-green-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Houston Development <span className="gradient-text">Cost Calculator</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Get accurate cost estimates for your Houston development project. Our calculator uses 
              current 2024 construction costs specific to the Harris County market, including hard costs, 
              soft costs, and financing estimates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Calculate Your Development Costs</h2>
              
              {/* Project Type Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Project Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Object.entries(projectTypeInfo).map(([type, info]) => {
                    const Icon = info.icon
                    return (
                      <button
                        key={type}
                        onClick={() => setProjectType(type)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          projectType === type
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${
                          projectType === type ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <div className="text-xs font-medium text-gray-900">{info.label}</div>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {projectTypeInfo[projectType].description}
                </p>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="sqFootage" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Square Footage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="sqFootage"
                      value={sqFootage}
                      onChange={(e) => setSqFootage(e.target.value)}
                      className="form-input w-full pl-10"
                      placeholder="Enter square footage"
                    />
                    <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {(projectType === 'residential' || projectType === 'multifamily') && (
                  <div>
                    <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Units (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="units"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        className="form-input w-full pl-10"
                        placeholder="Enter number of units"
                      />
                      <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="landPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Land Cost
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="landPrice"
                      value={landPrice}
                      onChange={(e) => setLandPrice(e.target.value)}
                      className="form-input w-full pl-10"
                      placeholder="Enter land cost"
                    />
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
                    Construction Quality
                  </label>
                  <select
                    id="quality"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="form-input w-full"
                  >
                    <option value="economy">Economy</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculateCosts}
                disabled={!sqFootage}
                className="w-full cta-primary"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Development Costs
              </button>
            </div>

            {/* Results Section */}
            {showResults && breakdown && (
              <motion.div 
                className="mt-8 bg-white rounded-2xl shadow-lg p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Cost Breakdown</h3>
                
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(breakdown.totalCost)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Project Cost</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 text-center">
                    <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(breakdown.costPerSqFt)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Per Square Foot</div>
                  </div>
                  
                  {breakdown.costPerUnit && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 text-center">
                      <Home className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-gray-900">
                        {formatCurrency(breakdown.costPerUnit)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Per Unit</div>
                    </div>
                  )}
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Detailed Cost Analysis</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <span className="font-medium text-gray-900">Land Cost</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({formatPercentage(breakdown.landCost, breakdown.totalCost)}%)
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(breakdown.landCost)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <span className="font-medium text-gray-900">Hard Costs</span>
                        <span className="ml-2 text-sm text-gray-500">
                          (Construction - {formatPercentage(breakdown.hardCosts, breakdown.totalCost)}%)
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(breakdown.hardCosts)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <span className="font-medium text-gray-900">Soft Costs</span>
                        <span className="ml-2 text-sm text-gray-500">
                          (Design, Permits, Legal - {formatPercentage(breakdown.softCosts, breakdown.totalCost)}%)
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(breakdown.softCosts)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <span className="font-medium text-gray-900">Financing Costs</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({formatPercentage(breakdown.financingCosts, breakdown.totalCost)}%)
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(breakdown.financingCosts)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <span className="font-medium text-gray-900">Contingency</span>
                        <span className="ml-2 text-sm text-gray-500">
                          (10% - {formatPercentage(breakdown.contingency, breakdown.totalCost)}%)
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(breakdown.contingency)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-lg font-bold text-gray-900">Total Project Cost</span>
                      <span className="text-lg font-bold text-green-600">{formatCurrency(breakdown.totalCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="mt-8 flex items-center justify-center">
                  <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="h-5 w-5 mr-2" />
                    Download Cost Report
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Cost Factors Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Houston Development Cost Factors</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Hard Costs</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Direct construction costs including materials and labor. Houston's costs are 15-25% 
                  lower than Austin due to land availability and labor market.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Site work and utilities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Foundation and structure</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>MEP systems</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Finishes and fixtures</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Soft Costs</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Non-construction expenses typically 20-30% of hard costs. Houston's streamlined 
                  permitting reduces these costs.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Architecture and engineering</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Permits and fees</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Legal and accounting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Marketing and leasing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Market Factors</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Houston-specific factors that impact development costs and timelines in 2024.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Flood mitigation requirements</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Hurricane-resistant design</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Energy code compliance</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Labor availability</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Important Disclaimer</h4>
                <p className="text-sm text-gray-700">
                  This calculator provides estimates based on average Houston market conditions and should 
                  be used for preliminary planning only. Actual costs will vary based on specific site 
                  conditions, design requirements, market timing, and contractor selection. We recommend 
                  consulting with local development professionals for detailed project budgeting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Need a Detailed Development Analysis?
              </h3>
              <p className="text-gray-600">
                Get personalized cost estimates and ROI projections for your specific Houston project
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <LeadCaptureForm source="COST_CALCULATOR" />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}