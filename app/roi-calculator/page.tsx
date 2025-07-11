'use client'

import dynamic from 'next/dynamic'
import Head from 'next/head'

// Dynamically import the ROI Calculator V2 to avoid SSR issues with Google Maps
const ROICalculator = dynamic(
  () => import('@/src/components/calculators/ROICalculatorV2'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Houston Development ROI Calculator...</p>
        </div>
      </div>
    )
  }
)

export default function ROICalculatorPage() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Houston Development ROI Calculator",
              "description": "Calculate potential returns for Houston land development projects with real-time market data",
              "url": "https://houstonlandguy.com/roi-calculator/",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Houston real estate market analysis",
                "Development cost calculations", 
                "ROI projections",
                "Harris County property evaluation",
                "Investment timeline planning"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Real Estate Developers, Builders, Investors"
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        {/* SEO Content Section - Hidden but crawlable */}
        <div className="sr-only">
          <h1>Houston Development ROI Calculator - Calculate Your Land Investment Returns</h1>
          <p>
            Use our advanced Houston land development ROI calculator to analyze potential returns 
            for your Harris County property investments. Get instant calculations for development 
            costs, market projections, and investment timelines specific to Houston real estate market conditions.
          </p>
          <h2>Houston Real Estate Investment Analysis Features</h2>
          <ul>
            <li>Real-time Houston market data integration</li>
            <li>Harris County zoning and development cost analysis</li>
            <li>Houston builder lots and development site evaluation</li>
            <li>Construction cost estimation for Houston projects</li>
            <li>Market timing and investment strategy recommendations</li>
          </ul>
        </div>
        
        <ROICalculator />
      </div>
    </>
  )
}