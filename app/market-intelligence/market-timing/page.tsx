import { Metadata } from 'next'
import { MarketTimingPage } from './MarketTimingPage'
import { coreAgentsClient } from '@/lib/core-agents/client'

export const metadata: Metadata = {
  title: 'Houston Market Timing Analysis | Buy, Sell, Hold Recommendations',
  description: 'AI-powered market timing analysis for Houston real estate. Get data-driven buy, sell, or hold recommendations based on current market conditions.',
  keywords: 'houston market timing, houston real estate timing, when to buy houston property, houston market analysis',
  openGraph: {
    title: 'Houston Market Timing Analysis | AI-Powered Recommendations',
    description: 'Get data-driven buy, sell, or hold recommendations for Houston real estate.',
    url: 'https://houstonlandguy.com/market-intelligence/market-timing/',
    siteName: 'Houston Development Intelligence',
    type: 'website',
  },
  alternates: {
    canonical: 'https://houstonlandguy.com/market-intelligence/market-timing/',
  },
}

export default async function MarketTiming() {
  const [marketTiming, marketMetrics, permitData] = await Promise.all([
    coreAgentsClient.getMarketTiming(),
    coreAgentsClient.getMarketMetrics(),
    coreAgentsClient.getPermitData({})
  ])

  // Get timing for different neighborhoods
  const neighborhoodTimings = await Promise.all([
    { name: 'Cypress', timing: await coreAgentsClient.getMarketTiming() },
    { name: 'Pearland', timing: await coreAgentsClient.getMarketTiming() },
    { name: 'Memorial', timing: await coreAgentsClient.getMarketTiming() },
    { name: 'Spring', timing: await coreAgentsClient.getMarketTiming() },
    { name: 'Katy', timing: await coreAgentsClient.getMarketTiming() }
  ])

  return (
    <MarketTimingPage 
      marketTiming={marketTiming.data}
      marketMetrics={marketMetrics.data}
      permitData={permitData.data}
      neighborhoodTimings={neighborhoodTimings.map(n => ({ name: n.name, timing: n.timing.data }))}
    />
  )
}