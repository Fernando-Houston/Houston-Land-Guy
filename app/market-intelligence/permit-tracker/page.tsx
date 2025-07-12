import { Metadata } from 'next'
import { PermitTrackerPage } from './PermitTrackerPage'
import { coreAgentsClient } from '@/lib/core-agents/client'

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
  // Fetch permit data for different neighborhoods
  const neighborhoods = ['cypress', 'pearland', 'memorial', 'spring', 'katy']
  
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

  return (
    <PermitTrackerPage 
      totalPermitData={allPermits.data}
      neighborhoodPermits={neighborhoodPermits}
    />
  )
}