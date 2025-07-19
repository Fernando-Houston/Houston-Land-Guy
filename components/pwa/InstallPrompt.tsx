'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smartphone, X, Download, Share, ChevronRight,
  Home, Zap, Bell, Wifi, WifiOff
} from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineReady, setShowOfflineReady] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if install was previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
      return // Don't show for 7 days after dismissal
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Handle online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineReady(false)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineReady(true)
      setTimeout(() => setShowOfflineReady(false), 5000)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered:', registration)
      }).catch(error => {
        console.error('Service Worker registration failed:', error)
      })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        console.log('PWA installed')
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Install failed:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

  return (
    <>
      {/* Install Prompt */}
      <AnimatePresence>
        {showPrompt && !isInstalled && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe"
          >
            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Smartphone className="h-6 w-6 mr-3" />
                    <h3 className="text-lg font-semibold">Install Houston Intelligence</h3>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-purple-100 text-sm">
                  Get instant access, offline support, and real-time notifications
                </p>
              </div>

              <div className="p-6">
                {/* Benefits */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <Home className="h-4 w-4 text-purple-600 mr-2" />
                    <span>Home Screen Access</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-purple-600 mr-2" />
                    <span>Lightning Fast</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Bell className="h-4 w-4 text-purple-600 mr-2" />
                    <span>Push Notifications</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <WifiOff className="h-4 w-4 text-purple-600 mr-2" />
                    <span>Works Offline</span>
                  </div>
                </div>

                {/* Install Instructions */}
                {isIOS ? (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700 mb-2">To install on iOS:</p>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <span className="mr-2">1.</span>
                        Tap the <Share className="inline h-4 w-4 mx-1" /> share button
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2.</span>
                        Select "Add to Home Screen"
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3.</span>
                        Tap "Add" to install
                      </li>
                    </ol>
                  </div>
                ) : (
                  <button
                    onClick={handleInstall}
                    className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors mb-4"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Install App
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </button>
                )}

                <button
                  onClick={handleDismiss}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Ready Notification */}
      <AnimatePresence>
        {showOfflineReady && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50"
          >
            <div className="bg-gray-900 text-white rounded-lg shadow-lg p-4 flex items-center">
              <WifiOff className="h-5 w-5 text-yellow-400 mr-3" />
              <div className="flex-1">
                <p className="font-medium">You're offline</p>
                <p className="text-sm text-gray-300">
                  But don't worry, the app works offline!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Status Indicator */}
      <div className={`fixed bottom-4 right-4 z-40 transition-opacity ${isOnline ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-gray-900 text-white rounded-full px-3 py-1 text-xs flex items-center">
          <WifiOff className="h-3 w-3 mr-1" />
          Offline Mode
        </div>
      </div>
    </>
  )
}