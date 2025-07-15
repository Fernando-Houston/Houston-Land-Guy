'use client'

import dynamic from 'next/dynamic'

export const PropertyMap = dynamic(
  () => import('./PropertyMapNew').then(mod => mod.PropertyMapNew),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
)