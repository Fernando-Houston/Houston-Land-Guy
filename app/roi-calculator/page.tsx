'use client'

import Head from 'next/head'
import { Suspense } from 'react'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Simple loading component
function ROICalculatorLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading Houston Development ROI Calculator...</p>
      </div>
    </div>
  );
}

// Simplified ROI calculator component
function ROICalculator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Houston Development ROI Calculator</h1>
          <p className="text-gray-600 mt-2">Calculate your return on investment for Houston development projects</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg text-gray-700">ROI Calculator is loading...</p>
          <p className="text-sm text-gray-500 mt-2">This tool helps analyze investment opportunities in Houston real estate development.</p>
        </div>
      </div>
    </div>
  );
}

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
      
      <Suspense fallback={<ROICalculatorLoading />}>
        <ROICalculator />
      </Suspense>
    </>
  )
}