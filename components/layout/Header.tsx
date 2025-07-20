'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Calculator, TrendingUp, Briefcase, Info, Phone, FileText, Building2, DollarSign, Home, Brain, Activity, Users } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'

const navigation = [
  { 
    name: 'Intelligence Hub', 
    href: '/', 
    icon: TrendingUp,
    highlight: true
  },
  { name: 'Live Dashboard', href: '/intelligence/dashboard', icon: Activity },
  { name: 'Fernando-X', href: '/assistant', icon: Brain },
  { 
    name: 'Developer Intel', 
    href: '/developers', 
    icon: Building2,
    subItems: [
      { name: 'ROI Calculator', href: '/roi-calculator' },
      { name: 'AI Scout', href: '/intelligence/scout' },
      { name: 'Zoning Intelligence', href: '/intelligence/zoning' },
      { name: 'Permit Tracker', href: '/intelligence/permits' },
      { name: 'Cost Database', href: '/intelligence/costs' },
      { name: 'Development Tools', href: '/developers' },
      { name: 'Document Analysis', href: '/intelligence/documents' }
    ]
  },
  { 
    name: 'Seller Intel', 
    href: '/sellers', 
    icon: Home,
    subItems: [
      { name: 'Property Valuation', href: '/sellers' },
      { name: '3D Market Map', href: '/intelligence/map' },
      { name: 'Market Timing', href: '/intelligence/market-timing' },
      { name: 'Buyer Demand', href: '/intelligence/demand' }
    ]
  },
  { 
    name: 'Investor Intel', 
    href: '/investment-opportunities', 
    icon: DollarSign,
    subItems: [
      { name: 'Opportunities', href: '/investment-opportunities' },
      { name: 'Market Predictions', href: '/intelligence/predictions' },
      { name: 'Predictive Analytics', href: '/intelligence/analytics' },
      { name: 'Portfolio Analytics', href: '/intelligence/portfolio' },
      { name: 'ROI Analysis', href: '/roi-calculator' }
    ]
  },
  { 
    name: 'Tools', 
    href: '/tools', 
    icon: Calculator,
    subItems: [
      { name: 'Cost Calculator', href: '/development-cost-calculator' },
      { name: 'Neighborhood Comparison', href: '/neighborhood-comparison' },
      { name: 'Opportunity Finder', href: '/opportunity-finder' },
      { name: 'Document Analysis', href: '/intelligence/documents' }
    ]
  },
  { name: 'Community', href: '/social', icon: Users },
  { name: 'About', href: '/about', icon: Info },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 bg-white transition-all duration-300",
        scrolled ? "shadow-md" : "shadow-sm"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Logo variant="auto" showText={false} />
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const hasSubItems = item.subItems && item.subItems.length > 0
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                    onMouseEnter={() => hasSubItems && setOpenDropdown(item.name)}
                    onMouseLeave={() => hasSubItems && setOpenDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors relative group flex items-center",
                        item.highlight ? "text-purple-600 font-semibold" : "",
                        isActive ? (item.highlight ? "text-purple-700" : "text-green-600") : (item.highlight ? "text-purple-600 hover:text-purple-700" : "text-gray-700 hover:text-green-600")
                      )}
                    >
                      {item.name}
                      {hasSubItems && (
                        <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                      {isActive && !hasSubItems && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600"
                          layoutId="navbar-indicator"
                        />
                      )}
                    </Link>
                    
                    {hasSubItems && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <Link
                  href="/join"
                  className="relative inline-block overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  {/* Animated wave background */}
                  <span className="absolute inset-0 w-full h-full">
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute -top-1 -left-1 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white to-transparent opacity-30 -skew-x-12 translate-x-[-200%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </span>
                  <span className="relative flex items-center">
                    Join Now
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
          
          <div className="md:hidden">
            <motion.button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="space-y-1 px-2 pb-3 pt-2 bg-white border-t border-gray-100">
              {navigation.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const hasSubItems = item.subItems && item.subItems.length > 0
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors",
                        isActive 
                          ? "bg-green-50 text-green-600" 
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                      onClick={() => !hasSubItems && setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                    
                    {hasSubItems && (
                      <div className="ml-8 space-y-1 mt-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navigation.length * 0.1 }}
              >
                <Link
                  href="/join"
                  className="relative inline-flex items-center w-full justify-center overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-base font-semibold text-white mt-4 group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="absolute inset-0 w-full h-full">
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute -top-1 -left-1 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white to-transparent opacity-30 -skew-x-12 translate-x-[-200%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </span>
                  <span className="relative flex items-center">
                    Join Now
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}