'use client';

import { Suspense } from 'react';

// Force dynamic rendering to avoid SSG database connection issues
export const dynamic = 'force-dynamic';

// Simple loading component
function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p className="mt-4 text-gray-600">Loading Market Intelligence Dashboard...</p>
      </div>
    </div>
  );
}

// Simplified dashboard component to avoid SSG issues
function MarketIntelligenceDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Market Intelligence Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time Houston market data and insights</p>
        <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-700">Dashboard is loading...</p>
          <p className="text-sm text-gray-500 mt-2">This page provides comprehensive market analysis and insights.</p>
        </div>
      </div>
    </div>
  );
}

export default function MarketDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<DashboardLoading />}>
        <MarketIntelligenceDashboard />
      </Suspense>
    </div>
  );
}