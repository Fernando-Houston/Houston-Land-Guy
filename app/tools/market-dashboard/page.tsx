'use client';

import dynamic from 'next/dynamic';

const MarketIntelligenceDashboard = dynamic(
  () => import('@/src/components/dashboard/MarketIntelligenceDashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading Market Intelligence Dashboard...</p>
        </div>
      </div>
    )
  }
);

export default function MarketDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MarketIntelligenceDashboard />
    </div>
  );
}