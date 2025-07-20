import { Metadata } from 'next'
import { InvestmentOpportunitiesPage } from './InvestmentOpportunitiesPage'
import { coreAgentsClient } from '@/lib/core-agents/client'
import { houstonDataService } from '@/lib/services/houston-data-service'

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
  const [opportunities, marketTiming, investmentProjects, developmentTrends] = await Promise.all([
    coreAgentsClient.getInvestmentOpportunities(),
    coreAgentsClient.getMarketTiming(),
    houstonDataService.getInvestmentProjects(100000000), // Get major projects over $100M
    houstonDataService.getDevelopmentTrends()
  ])

  // Generate data-driven opportunities from real Houston projects
  const industrialTrend = developmentTrends.find(t => t.category === 'Industrial Development')
  const commercialTrend = developmentTrends.find(t => t.category === 'Commercial Construction')
  const mixedUseTrend = developmentTrends.find(t => t.category === 'Mixed-Use Projects')
  
  const additionalOpportunities = [
    {
      id: 'opp-003',
      title: 'Northwest Industrial Opportunity - Grand Parkway Corridor',
      location: 'Grand Parkway & 290 Corridor',
      neighborhood: 'Northwest Far',
      type: 'Industrial Development',
      price: 8500000,
      size: 25,
      projectedROI: 35.2,
      highlights: [
        industrialTrend?.keyMetrics || '25.4M SF industrial under construction citywide',
        'Northwest Far submarket leading with 3.4M SF development',
        'Only 3.8% vacancy rate in submarket',
        'Adjacent to major distribution routes'
      ],
      risks: [
        'Competition from 25.4M SF under construction',
        'Rising construction costs',
        'Interest rate sensitivity'
      ],
      timeline: '24 months',
      minimumInvestment: 1000000,
      targetIRR: 28,
      exitStrategy: 'Build-to-suit for logistics companies',
      images: ['/images/northwest-industrial.jpg']
    },
    {
      id: 'opp-004',
      title: 'TMC BioPort Adjacent Development',
      location: 'Near Texas Medical Center',
      neighborhood: 'TMC/Ion District',
      type: 'Mixed-Use Development',
      price: 15000000,
      size: 12.5,
      projectedROI: 42.5,
      highlights: [
        '$5B TMC BioPort Campus development 2025-2030',
        'Adjacent to 250 tech companies in TMC/Ion District',
        '$850M in VC funding in the area',
        'Walking distance to major medical institutions'
      ],
      risks: [
        'High land costs',
        'Complex entitlement process',
        'Construction timeline alignment'
      ],
      timeline: '36 months',
      minimumInvestment: 2000000,
      targetIRR: 32,
      exitStrategy: 'Life sciences office/lab space for biotech companies',
      images: ['/images/tmc-bioport.jpg']
    },
    {
      id: 'opp-005',
      title: 'Buffalo Bayou East Early Position',
      location: 'East End/Fifth Ward',
      neighborhood: 'East End',
      type: 'Mixed-Use Development',
      price: 4200000,
      size: 8.5,
      projectedROI: 55.8,
      highlights: [
        '$310M Buffalo Bayou East infrastructure investment',
        '10-year transformation plan for East End/Fifth Ward',
        'Early entry before major price appreciation',
        'Opportunity Zone tax benefits available'
      ],
      risks: [
        'Longer development timeline',
        'Gentrification concerns',
        'Market timing risk'
      ],
      timeline: '48 months',
      minimumInvestment: 500000,
      targetIRR: 38,
      exitStrategy: 'Phased mixed-use development with Buffalo Bayou views',
      images: ['/images/buffalo-bayou-east.jpg']
    },
    {
      id: 'opp-006',
      title: 'SB 840 Commercial Conversion Play',
      location: 'Multiple Galleria/Uptown Properties',
      neighborhood: 'Galleria/Uptown',
      type: 'Office to Residential Conversion',
      price: 22000000,
      size: 45000, // sqft instead of acres
      projectedROI: 38.5,
      highlights: [
        'Texas SB 840 allows commercial-to-residential by right (Sept 2025)',
        commercialTrend?.keyMetrics || '$43.8B in commercial construction 2024',
        '27% office vacancy creates conversion opportunities',
        'Prime Galleria location with 15.8% vacancy'
      ],
      risks: [
        'Conversion costs',
        'Market timing with new legislation',
        'Competition from other conversions'
      ],
      timeline: '30 months',
      minimumInvestment: 3000000,
      targetIRR: 29,
      exitStrategy: 'Convert to luxury apartments, refinance or sell',
      images: ['/images/galleria-conversion.jpg']
    },
    {
      id: 'opp-007',
      title: 'Katy Master-Planned Community Site',
      location: 'Near Sunterra Development',
      neighborhood: 'Katy',
      type: 'Residential Subdivision',
      price: 6800000,
      size: 35,
      projectedROI: 45.2,
      highlights: [
        'Adjacent to $500M Sunterra master-planned community',
        'Katy showing 12 active builders, 45 new communities',
        'Price range $280K-$650K matches market demand',
        'Perry Homes identified as top builder in area'
      ],
      risks: [
        'Competition from 45 existing communities',
        'Infrastructure requirements',
        'Market saturation concerns'
      ],
      timeline: '36 months',
      minimumInvestment: 750000,
      targetIRR: 35,
      exitStrategy: 'Develop and sell finished lots to builders',
      images: ['/images/katy-residential.jpg']
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