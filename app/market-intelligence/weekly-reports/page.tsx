import { Metadata } from 'next'
import { WeeklyReportsPage } from './WeeklyReportsPage'
import { coreAgentsClient } from '@/lib/core-agents/client'

export const metadata: Metadata = {
  title: 'Weekly Houston Market Reports | Development Intelligence',
  description: 'Access comprehensive weekly Houston development market reports with permit analysis, investment opportunities, and neighborhood insights.',
  keywords: 'houston weekly market report, houston development report, houston real estate analysis, market intelligence houston',
  openGraph: {
    title: 'Weekly Houston Market Reports | Development Intelligence',
    description: 'Comprehensive weekly Houston development reports with data-driven insights.',
    url: 'https://houstonlandguy.com/market-intelligence/weekly-reports/',
    siteName: 'Houston Development Intelligence',
    type: 'website',
  },
  alternates: {
    canonical: 'https://houstonlandguy.com/market-intelligence/weekly-reports/',
  },
}

export default async function WeeklyReports() {
  const [currentReport, marketMetrics, permitData] = await Promise.all([
    coreAgentsClient.getWeeklyMarketReport(),
    coreAgentsClient.getMarketMetrics(),
    coreAgentsClient.getPermitData({})
  ])

  // Generate last 8 weeks of reports
  const recentReports = Array.from({ length: 8 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (i * 7))
    return {
      id: `wmr-${date.toISOString().split('T')[0]}`,
      date,
      title: `Houston Market Report - Week ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      summary: 'Weekly analysis of Houston development market trends and opportunities.'
    }
  })

  return (
    <WeeklyReportsPage 
      currentReport={currentReport.data}
      recentReports={recentReports}
      marketMetrics={marketMetrics.data}
      permitData={permitData.data}
    />
  )
}