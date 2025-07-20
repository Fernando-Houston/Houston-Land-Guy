'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AssistantPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to homepage where Fernando-X chat popup is available
    router.push('/')
  }, [router])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirecting to Fernando-X...</h2>
        <p className="text-gray-600">Taking you to the Intelligence Hub where Fernando-X is available</p>
      </div>
    </div>
  )
}