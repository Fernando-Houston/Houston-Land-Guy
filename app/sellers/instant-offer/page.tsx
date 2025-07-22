'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, DollarSign, Clock, Shield, Users, CheckCircle, Home, AlertCircle, Loader2, TrendingUp, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

interface PropertyDetails {
  address: string
  bedrooms: number
  bathrooms: number
  sqft: number
  yearBuilt: number
  condition: 'excellent' | 'good' | 'fair' | 'needs-work'
}

interface CashOffer {
  buyerId: string
  buyerName: string
  buyerType: string
  offerAmount: number
  closingDays: number
  contingencies: string[]
  proofOfFunds: boolean
  expiresIn: number // hours
}

interface OfferResult {
  instantEstimate: {
    low: number
    mid: number
    high: number
  }
  cashOffers: CashOffer[]
  marketComparison: {
    vsListPrice: number
    vsRecentSales: number
  }
  totalBuyers: number
}

export default function InstantOfferEngine() {
  const [property, setProperty] = useState<PropertyDetails>({
    address: '',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2000,
    yearBuilt: 2000,
    condition: 'good'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<OfferResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/sellers/instant-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property)
      })
      
      if (!response.ok) {
        throw new Error('Failed to get offers')
      }
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Using demo data. Connect to see real cash offers.')
      // Mock data for demonstration
      setResult({
        instantEstimate: {
          low: 385000,
          mid: 425000,
          high: 465000
        },
        cashOffers: [
          {
            buyerId: '1',
            buyerName: 'Houston Property Investors LLC',
            buyerType: 'Investment Firm',
            offerAmount: 405000,
            closingDays: 14,
            contingencies: ['Property Inspection'],
            proofOfFunds: true,
            expiresIn: 48
          },
          {
            buyerId: '2',
            buyerName: 'Quick Home Buyers TX',
            buyerType: 'Cash Buyer Network',
            offerAmount: 395000,
            closingDays: 7,
            contingencies: [],
            proofOfFunds: true,
            expiresIn: 24
          },
          {
            buyerId: '3',
            buyerName: 'Memorial Real Estate Group',
            buyerType: 'Local Developer',
            offerAmount: 415000,
            closingDays: 21,
            contingencies: ['Title Clear', 'Survey'],
            proofOfFunds: true,
            expiresIn: 72
          }
        ],
        marketComparison: {
          vsListPrice: -2.5,
          vsRecentSales: 1.2
        },
        totalBuyers: 527
      })
    } finally {
      setLoading(false)
    }
  }

  const getBuyerTypeColor = (type: string) => {
    switch (type) {
      case 'Investment Firm':
        return 'bg-blue-100 text-blue-800'
      case 'Cash Buyer Network':
        return 'bg-green-100 text-green-800'
      case 'Local Developer':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 min-h-[40vh]">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, green 0%, transparent 50%), radial-gradient(circle at 80% 80%, emerald 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full mb-6"
            >
              <DollarSign className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-300">500+ Active Buyers</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Instant Offer
              <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Engine
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 lg:text-2xl font-light"
            >
              Get competitive cash offers from our network of pre-qualified Houston buyers.
              <span className="block mt-2 text-lg">No obligations. 48-hour response. Multiple offers.</span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* Property Form */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Instant Cash Offers</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address
                </label>
                <input
                  type="text"
                  value={property.address}
                  onChange={(e) => setProperty({ ...property, address: e.target.value })}
                  placeholder="Enter your Houston property address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={property.bedrooms}
                    onChange={(e) => setProperty({ ...property, bedrooms: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <select
                    value={property.bathrooms}
                    onChange={(e) => setProperty({ ...property, bathrooms: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <input
                    type="number"
                    value={property.sqft}
                    onChange={(e) => setProperty({ ...property, sqft: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="500"
                    max="10000"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !property.address}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Getting Offers...
                  </>
                ) : (
                  <>
                    Get Instant Offers
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Instant Estimate */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Your Instant Cash Offer Range
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Low Offer</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${result.instantEstimate.low.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-green-700 font-medium mb-2">Expected Offers</p>
                    <p className="text-4xl font-bold text-green-700">
                      ${result.instantEstimate.mid.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">High Offer</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${result.instantEstimate.high.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cash Offers */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Cash Offers from Pre-Qualified Buyers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.cashOffers.map((offer, index) => (
                    <motion.div
                      key={offer.buyerId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{offer.buyerName}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBuyerTypeColor(offer.buyerType)} mt-1`}>
                            {offer.buyerType}
                          </span>
                        </div>
                        {offer.proofOfFunds && (
                          <div className="flex items-center text-green-600">
                            <Shield className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Offer Amount</span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${offer.offerAmount.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Closing Time</span>
                          <span className="font-medium text-gray-900">{offer.closingDays} days</span>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Expires in {offer.expiresIn}h</span>
                            <button className="text-sm font-medium text-green-600 hover:text-green-700">
                              Contact Buyer →
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Get cash offers in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Home className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Enter Property Details</h3>
              <p className="text-gray-600">
                Provide basic information about your Houston property
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Receive Multiple Offers</h3>
              <p className="text-gray-600">
                Get competitive offers from 500+ pre-qualified buyers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Choose Your Best Offer</h3>
              <p className="text-gray-600">
                Accept an offer and close on your timeline
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}