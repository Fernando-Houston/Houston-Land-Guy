'use client'

import dynamic from 'next/dynamic'

// Dynamically import the ROI Calculator V2 to avoid SSR issues with Google Maps
const ROICalculator = dynamic(
  () => import('@/src/components/calculators/ROICalculatorV2'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading ROI Calculator...</p>
        </div>
      </div>
    )
  }
)

export default function ROICalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <ROICalculator />
    </div>
  )
}