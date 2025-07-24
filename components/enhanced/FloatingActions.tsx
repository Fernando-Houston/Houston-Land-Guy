'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Brain, 
  Calculator, 
  Eye, 
  Bookmark, 
  Phone, 
  Download, 
  BarChart3, 
  Target,
  DollarSign,
  Calendar,
  X
} from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  color: string
}

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false)
  const [actions, setActions] = useState<QuickAction[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const contextualActions = getContextualActions(pathname)
    setActions(contextualActions)
  }, [pathname])

  const getContextualActions = (path: string): QuickAction[] => {
    // Homepage actions
    if (path === '/') {
      return [
        {
          id: 'fernando',
          label: 'Ask Fernando-X',
          icon: Brain,
          onClick: () => {
            const event = new CustomEvent('open-fernando-chat')
            window.dispatchEvent(event)
            setIsOpen(false)
          },
          color: 'from-purple-500 to-purple-600'
        },
        {
          id: 'deals',
          label: 'View Deals',
          icon: DollarSign,
          href: '/investment-opportunities/deals',
          color: 'from-green-500 to-green-600'
        },
        {
          id: 'calculator',
          label: 'ROI Calculator',
          icon: Calculator,
          href: '/roi-calculator',
          color: 'from-blue-500 to-blue-600'
        }
      ]
    }

    // Investment opportunities pages
    if (path.includes('/investment-opportunities')) {
      return [
        {
          id: 'fernando',
          label: 'Ask Fernando-X',
          icon: Brain,
          onClick: () => {
            const event = new CustomEvent('open-fernando-chat')
            window.dispatchEvent(event)
            setIsOpen(false)
          },
          color: 'from-purple-500 to-purple-600'
        },
        {
          id: 'save',
          label: 'Save Property',
          icon: Bookmark,
          onClick: () => {
            // Add to saved properties
            const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]')
            // Property would be passed via context in real implementation
            console.log('Property saved!')
            setIsOpen(false)
          },
          color: 'from-yellow-500 to-yellow-600'
        },
        {
          id: 'compare',
          label: 'Compare',
          icon: BarChart3,
          href: '/compare',
          color: 'from-indigo-500 to-indigo-600'
        },
        {
          id: 'contact',
          label: 'Contact Advisor',
          icon: Phone,
          onClick: () => {
            // Open contact modal or redirect
            window.open('tel:+1-713-555-0123', '_self')
            setIsOpen(false)
          },
          color: 'from-emerald-500 to-emerald-600'
        }
      ]
    }

    // Deal detail pages
    if (path.includes('/deals/') && path.split('/').length > 3) {
      return [
        {
          id: 'contact',
          label: 'Contact Advisor',
          icon: Phone,
          onClick: () => {
            window.open('tel:+1-713-555-0123', '_self')
            setIsOpen(false)
          },
          color: 'from-emerald-500 to-emerald-600'
        },
        {
          id: 'download',
          label: 'Download Info',
          icon: Download,
          onClick: () => {
            // Trigger download
            console.log('Downloading property information...')
            setIsOpen(false)
          },
          color: 'from-blue-500 to-blue-600'
        },
        {
          id: 'schedule',
          label: 'Schedule Call',
          icon: Calendar,
          href: '/consultation',
          color: 'from-purple-500 to-purple-600'
        }
      ]
    }

    // Developer pages
    if (path.includes('/developers') || path.includes('/intelligence')) {
      return [
        {
          id: 'fernando',
          label: 'Ask Fernando-X',
          icon: Brain,
          onClick: () => {
            const event = new CustomEvent('open-fernando-chat')
            window.dispatchEvent(event)
            setIsOpen(false)
          },
          color: 'from-purple-500 to-purple-600'
        },
        {
          id: 'calculator',
          label: 'Cost Calculator',
          icon: Calculator,
          href: '/development-cost-calculator',
          color: 'from-blue-500 to-blue-600'
        },
        {
          id: 'scout',
          label: 'AI Scout',
          icon: Target,
          href: '/intelligence/scout',
          color: 'from-green-500 to-green-600'
        }
      ]
    }

    // Seller pages
    if (path.includes('/sellers')) {
      return [
        {
          id: 'valuation',
          label: 'Get Valuation',
          icon: DollarSign,
          href: '/sellers',
          color: 'from-green-500 to-green-600'
        },
        {
          id: 'timeline',
          label: 'Market Timing',
          icon: BarChart3,
          href: '/market-intelligence/market-timing',
          color: 'from-blue-500 to-blue-600'
        },
        {
          id: 'contact',
          label: 'Contact Agent',
          icon: Phone,
          onClick: () => {
            window.open('tel:+1-713-555-0123', '_self')
            setIsOpen(false)
          },
          color: 'from-purple-500 to-purple-600'
        }
      ]
    }

    // Default actions for other pages
    return [
      {
        id: 'fernando',
        label: 'Ask Fernando-X',
        icon: Brain,
        onClick: () => {
          const event = new CustomEvent('open-fernando-chat')
          window.dispatchEvent(event)
          setIsOpen(false)
        },
        color: 'from-purple-500 to-purple-600'
      },
      {
        id: 'deals',
        label: 'View Deals',
        icon: Eye,
        href: '/investment-opportunities/deals',
        color: 'from-green-500 to-green-600'
      }
    ]
  }

  const handleActionClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick()
    }
  }

  if (actions.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center"
              >
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg mr-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {action.label}
                </div>
                {action.href ? (
                  <Link
                    href={action.href}
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110`}
                    onClick={() => setIsOpen(false)}
                  >
                    <action.icon className="w-5 h-5" />
                  </Link>
                ) : (
                  <button
                    onClick={() => handleActionClick(action)}
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110`}
                  >
                    <action.icon className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 ${
          isOpen ? 'rotate-45' : 'hover:scale-110'
        }`}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: isOpen ? 1 : 1.1 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}