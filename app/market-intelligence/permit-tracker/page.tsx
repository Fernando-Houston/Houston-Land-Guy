import { Metadata } from 'next'
import { PermitTrackerPage } from './PermitTrackerPage'
import { coreAgentsClient } from '@/lib/core-agents/client'
import { houstonDataService } from '@/lib/services/houston-data-service'

export const metadata: Metadata = {
  title: 'Houston Development Permit Tracker | Real-Time Construction Activity',
  description: 'Track real-time development permits across Houston neighborhoods. Monitor residential, commercial, and industrial construction activity updated hourly.',
  keywords: 'houston permit tracker, houston construction permits, houston development activity, building permits houston',
  openGraph: {
    title: 'Houston Development Permit Tracker | Real-Time Activity',
    description: 'Monitor real-time development permits and construction activity across Houston.',
    url: 'https://houstonlandguy.com/market-intelligence/permit-tracker/',
    siteName: 'Houston Development Intelligence',
    type: 'website',
  },
  alternates: {
    canonical: 'https://houstonlandguy.com/market-intelligence/permit-tracker/',
  },
}

export default async function PermitTracker() {
  // Fetch real Houston permit data and development trends
  const [developmentTrends, topDevelopers, recentPermits, marketSummary] = await Promise.all([
    houstonDataService.getDevelopmentTrends(),
    houstonDataService.getTopDevelopers(10),
    houstonDataService.getRecentPermits(20),
    houstonDataService.getMarketSummary()
  ])
  
  // Get residential permit trend
  const residentialTrend = developmentTrends.find(t => t.category === 'Residential Permits')
  const commercialTrend = developmentTrends.find(t => t.category === 'Commercial Construction')
  
  // Fetch permit data for different neighborhoods
  const neighborhoods = marketSummary.hottestZipCodes.slice(0, 5).map(zip => {
    // Map zip codes to neighborhood slugs
    const zipToSlug: Record<string, string> = {
      '77433': 'cypress',
      '77494': 'katy', 
      '77007': 'heights',
      '77006': 'montrose',
      '77024': 'memorial'
    }
    return zipToSlug[zip] || 'houston'
  })
  
  const permitDataPromises = neighborhoods.map(async (neighborhood) => {
    const [data, neighborhoodInfo] = await Promise.all([
      coreAgentsClient.getPermitData({ location: neighborhood }),
      coreAgentsClient.getNeighborhoodData(neighborhood)
    ])
    return {
      neighborhood: neighborhoodInfo.data.name,
      slug: neighborhood,
      permitData: data.data
    }
  })
  
  const [allPermits, neighborhoodPermits] = await Promise.all([
    coreAgentsClient.getPermitData({}),
    Promise.all(permitDataPromises)
  ])
  
  // Enhance permit data with real Houston data
  const enhancedPermitData = {
    ...allPermits.data,
    insights: [
      residentialTrend?.keyMetrics || 'Houston led nation with 46,269 permits in 2023',
      commercialTrend?.keyMetrics || '$43.8B in contracts awarded in 2024 (+31% YoY)',
      `Top builders: ${topDevelopers.slice(0, 3).map(d => d.name).join(', ')}`,
      `Hottest markets: ${marketSummary.hottestZipCodes.slice(0, 3).join(', ')}`
    ],
    topDevelopers,
    recentPermits,
    developmentTrends
  }

  return (
    <PermitTrackerPage 
      totalPermitData={enhancedPermitData}
      neighborhoodPermits={neighborhoodPermits}
    />
  )
}