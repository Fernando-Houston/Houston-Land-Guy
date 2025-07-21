'use client';

import { Suspense } from 'react';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Simple loading component
function ZoningExplorerLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Zoning Explorer...</p>
      </div>
    </div>
  );
}

// Simplified zoning explorer component
function ZoningMapNew() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Houston Zoning Explorer</h1>
          <p className="text-gray-600 mt-2">Explore zoning information for Houston development projects</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg text-gray-700">Zoning Explorer is loading...</p>
          <p className="text-sm text-gray-500 mt-2">This tool provides detailed zoning information for Houston properties.</p>
        </div>
      </div>
    </div>
  );
}

export default function ZoningExplorerPage() {
  return (
    <Suspense fallback={<ZoningExplorerLoading />}>
      <ZoningMapNew />
    </Suspense>
  );
}