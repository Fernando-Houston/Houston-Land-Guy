import { Metadata } from 'next'
import { InvestmentOpportunitiesPage } from './InvestmentOpportunitiesPage'
import { coreAgentsClient } from '@/lib/core-agents/client'

export const metadata: Metadata = {
  title: 'Houston Investment Opportunities | Off-Market Development Sites',
  description: 'Discover exclusive Houston development opportunities with detailed ROI analysis. Access off-market properties before they hit the public market.',
  keywords: 'houston investment opportunities, houston development sites, off-market properties houston, houston real estate investment',
  openGraph: {
    title: 'Exclusive Houston Investment Opportunities | Development Sites',
    description: 'Access off-market Houston development opportunities with ROI analysis.',
    url: 'https://houstonlandguy.com/market-intelligence/investment-opportunities/',
    siteName: 'Houston Development Intelligence',
    type: 'website',
  },
  alternates: {
    canonical: 'https://houstonlandguy.com/market-intelligence/investment-opportunities/',
  },
}

export default async function InvestmentOpportunities() {
  const [opportunities, marketTiming] = await Promise.all([
    coreAgentsClient.getInvestmentOpportunities(),
    coreAgentsClient.getMarketTiming()
  ])

  // Generate additional opportunities
  const additionalOpportunities = [
    {
      id: 'opp-003',
      title: 'Memorial Area Office Development',
      location: '14520 Memorial Drive',
      neighborhood: 'Memorial',
      type: 'Office Development',
      price: 6800000,
      size: 8.2,
      projectedROI: 21.5,
      highlights: [
        'Prime Memorial location',
        'Existing office zoning',
        'Adjacent to major employers',
        'Easy highway access'
      ],
      risks: [
        'Office market softness',
        'Competition from existing inventory',
        'Higher construction costs'
      ],
      timeline: '30 months',
      minimumInvestment: 750000,
      targetIRR: 19,
      exitStrategy: 'Long-term hold or sale to REIT',
      images: ['/images/memorial-office.jpg']
    },
    {
      id: 'opp-004',
      title: 'Spring Industrial Park',
      location: '23456 Spring Cypress Road',
      neighborhood: 'Spring',
      type: 'Industrial Development',
      price: 5200000,
      size: 22,
      projectedROI: 26.8,
      highlights: [
        'Growing industrial corridor',
        'Rail access available',
        'Large parcel for warehouse development',
        'Strong rental demand'
      ],
      risks: [
        'Environmental assessment needed',
        'Infrastructure improvements required',
        'Market saturation risk'
      ],
      timeline: '24 months',
      minimumInvestment: 500000,
      targetIRR: 23,
      exitStrategy: 'Build and lease to logistics companies',
      images: ['/images/spring-industrial.jpg']
    },
    {
      id: 'opp-005',
      title: 'Energy Corridor Mixed-Use',
      location: '1234 Eldridge Parkway',
      neighborhood: 'Energy Corridor',
      type: 'Mixed-Use Development',
      price: 12500000,
      size: 15.5,
      projectedROI: 29.2,
      highlights: [
        'Prime Energy Corridor location',
        'Walking distance to major employers',
        'Mixed-use zoning approved',
        'High-income demographics'
      ],
      risks: [
        'Complex development process',
        'Higher initial investment',
        'Energy sector dependency'
      ],
      timeline: '42 months',
      minimumInvestment: 1500000,
      targetIRR: 26,
      exitStrategy: 'Phased development and sale',
      images: ['/images/energy-corridor-mixed.jpg']
    }
  ]

  const allOpportunities = [...opportunities.data, ...additionalOpportunities]

  return (
    <InvestmentOpportunitiesPage 
      opportunities={allOpportunities}
      marketTiming={marketTiming.data}
    />
  )
}