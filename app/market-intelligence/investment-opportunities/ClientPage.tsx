'use client'

import { useState, useEffect } from 'react'
import { InvestmentOpportunitiesPage } from './InvestmentOpportunitiesPage'

export default function InvestmentOpportunitiesClientPage() {
  const [opportunities, setOpportunities] = useState([])
  const [marketTiming, setMarketTiming] = useState({
    currentPhase: 'Growth',
    score: 85,
    recommendation: 'Strong Buy',
    indicators: {
      inventory: 3.2,
      priceGrowth: 8.5,
      absorption: 85,
      construction: 'High Activity'
    },
    analysis: 'Houston market shows strong fundamentals with low inventory and steady price appreciation.'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/investment-opportunities')
      const data = await response.json()
      
      setOpportunities(data.opportunities || [])
      if (data.marketTiming) {
        setMarketTiming(data.marketTiming)
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investment opportunities...</p>
        </div>
      </div>
    )
  }

  return (
    <InvestmentOpportunitiesPage 
      opportunities={opportunities}
      marketTiming={marketTiming}
    />
  )
}