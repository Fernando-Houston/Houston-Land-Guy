'use client';

import dynamic from 'next/dynamic';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const ZoningMapNew = dynamic(() => import('./ZoningMapNew'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Zoning Explorer...</p>
      </div>
    </div>
  )
});

export default function ZoningExplorerPage() {
  return <ZoningMapNew />;
}