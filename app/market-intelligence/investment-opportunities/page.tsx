import { Metadata } from 'next'
import InvestmentOpportunitiesClientPage from './ClientPage'

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

export default function InvestmentOpportunities() {
  return <InvestmentOpportunitiesClientPage />
}