'use client'

import { WifiOff, Home, RefreshCw, Brain, Calculator, BarChart3, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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

  const offlineFeatures = [
    {
      icon: Brain,
      title: 'Fernando-X Assistant',
      description: 'Basic AI assistance available offline',
      link: '/assistant',
      available: true
    },
    {
      icon: Calculator,
      title: 'ROI Calculator',
      description: 'Calculate investment returns offline',
      link: '/roi-calculator',
      available: true
    },
    {
      icon: DollarSign,
      title: 'Cached Deals',
      description: 'View previously loaded investment opportunities',
      link: '/investment-opportunities/deals',
      available: true
    },
    {
      icon: BarChart3,
      title: 'Property Comparison',
      description: 'Compare saved properties side-by-side',
      link: '/compare',
      available: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            scale: { repeat: Infinity, duration: 2 },
            rotate: { repeat: Infinity, duration: 0.5 }
          }}
          className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-8"
        >
          <WifiOff className="h-12 w-12 text-red-600" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
          Don't worry - Houston Development Intelligence still works offline! Many features remain available while you're disconnected.
        </p>

        <div className="space-y-3 mb-12">
          <motion.button
            onClick={handleRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full max-w-sm mx-auto block px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2 inline" />
            Try Again
          </motion.button>
          
          <Link
            href="/"
            className="w-full max-w-sm mx-auto block px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Home className="h-5 w-5 mr-2 inline" />
            Go to Home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Offline Features
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {offlineFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-left"
              >
                <Link 
                  href={feature.link}
                  className="block p-4 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Your data is automatically cached for offline access. 
              All calculations and previously viewed content remain fully functional without an internet connection.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}