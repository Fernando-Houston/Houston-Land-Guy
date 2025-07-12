import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DynamicNeighborhoodPage } from './DynamicNeighborhoodPage'
import { coreAgentsClient } from '@/lib/core-agents/client'

const neighborhoods = [
  'cypress', 'pearland', 'memorial', 'spring', 'conroe',
  'richmond', 'friendswood', 'league-city', 'clear-lake',
  'bellaire', 'river-oaks', 'heights', 'montrose',
  'energy-corridor', 'champions'
]

export async function generateStaticParams() {
  return neighborhoods.map((neighborhood) => ({
    neighborhood,
  }))
}

export async function generateMetadata({ params }: { params: { neighborhood: string } }): Promise<Metadata> {
  const response = await coreAgentsClient.getNeighborhoodData(params.neighborhood)
  
  if (!response.success) {
    return {
      title: 'Neighborhood Not Found | Houston Development Intelligence',
      description: 'The requested neighborhood page could not be found.'
    }
  }

  const data = response.data
  
  return {
    title: `${data.name} Development Opportunities | Real Estate Investment Houston`,
    description: `Discover exclusive ${data.name} development opportunities. Median price $${(data.medianHomePrice / 1000).toFixed(0)}K, ${data.growthRate}% growth rate. Premium commercial real estate and residential development sites.`,
    keywords: `${data.name.toLowerCase()} development, ${data.name.toLowerCase()} real estate, ${data.name.toLowerCase()} investment, houston ${data.name.toLowerCase()}, ${data.name.toLowerCase()} land development, ${data.name.toLowerCase()} property investment`,
    openGraph: {
      title: `${data.name} Development Opportunities | Houston Real Estate Investment`,
      description: `Exclusive ${data.name} development opportunities with ${data.growthRate}% annual growth. Commercial and residential sites available.`,
      url: `https://houstonlandguy.com/houston-neighborhoods/${params.neighborhood}/`,
      siteName: 'Houston Development Intelligence',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `/images/${params.neighborhood}-aerial.jpg`,
          width: 1200,
          height: 630,
          alt: `${data.name} development opportunities aerial view`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} Development Opportunities | Houston`,
      description: `Discover ${data.name} development sites with ${data.growthRate}% growth rate.`,
      images: [`/images/${params.neighborhood}-aerial.jpg`],
    },
    alternates: {
      canonical: `https://houstonlandguy.com/houston-neighborhoods/${params.neighborhood}/`,
    },
  }
}

export default async function NeighborhoodPage({ params }: { params: { neighborhood: string } }) {
  if (!neighborhoods.includes(params.neighborhood)) {
    notFound()
  }

  const [neighborhoodData, marketMetrics, marketTiming, permitData] = await Promise.all([
    coreAgentsClient.getNeighborhoodData(params.neighborhood),
    coreAgentsClient.getMarketMetrics(),
    coreAgentsClient.getMarketTiming(),
    coreAgentsClient.getPermitData({ location: params.neighborhood })
  ])

  if (!neighborhoodData.success) {
    notFound()
  }

  return (
    <DynamicNeighborhoodPage 
      neighborhoodData={neighborhoodData.data}
      marketMetrics={marketMetrics.data}
      marketTiming={marketTiming.data}
      permitData={permitData.data}
    />
  )
}