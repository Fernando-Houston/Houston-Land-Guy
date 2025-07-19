'use client'

import { WifiOff, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const checkConnection = () => {
      setIsOnline(navigator.onLine)
    }

    checkConnection()
    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)

    return () => {
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = '/'
    }
  }

  if (isOnline) {
    // Redirect if back online
    window.location.href = '/'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-6">
          <WifiOff className="h-10 w-10 text-gray-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          You're Offline
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Home
          </Link>
        </div>

        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h2 className="font-semibold text-gray-900 mb-2">
            Available Offline Features
          </h2>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              View previously loaded properties
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              Access saved calculations
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              Review your portfolio data
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              Browse cached market reports
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}