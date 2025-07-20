'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Brain, Sparkles, MapPin, Home, DollarSign,
  TrendingUp, Building2, Filter, X, Loader2,
  Calendar, Target, Zap, ChevronRight, Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchSuggestion {
  id: string
  type: 'property' | 'area' | 'insight' | 'question'
  title: string
  subtitle?: string
  icon: any
  action: () => void
}

interface AISearchBarProps {
  placeholder?: string
  onSearch?: (query: string, filters?: any) => void
  className?: string
}

export default function AISearchBar({ 
  placeholder = "Ask Fernando-X anything about Houston real estate...",
  onSearch,
  className = ""
}: AISearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounce = setTimeout(() => {
        generateSuggestions(query)
      }, 300)
      return () => clearTimeout(delayDebounce)
    } else {
      setSuggestions([])
      setAiInsight(null)
    }
  }, [query])

  const generateSuggestions = async (searchQuery: string) => {
    setLoading(true)
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Generate intelligent suggestions based on query
      const suggestions = getAISuggestions(searchQuery)
      setSuggestions(suggestions)
      
      // Generate AI insight
      if (searchQuery.includes('invest') || searchQuery.includes('roi')) {
        setAiInsight('Based on current market conditions, Cypress and Katy show the highest ROI potential with 18-22% projected returns')
      } else if (searchQuery.includes('develop')) {
        setAiInsight('East End and Third Ward are emerging development hotspots with new zoning allowances')
      } else if (searchQuery.includes('price') || searchQuery.includes('value')) {
        setAiInsight('Houston home values have increased 8.5% YoY, with luxury properties seeing 12% gains')
      }
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAISuggestions = (searchQuery: string): SearchSuggestion[] => {
    const query = searchQuery.toLowerCase()
    const suggestions: SearchSuggestion[] = []

    // Natural language understanding
    if (query.includes('best') && (query.includes('invest') || query.includes('roi'))) {
      suggestions.push({
        id: 'ai-1',
        type: 'insight',
        title: 'Best Investment Areas in Houston',
        subtitle: 'AI-analyzed neighborhoods with highest returns',
        icon: TrendingUp,
        action: () => router.push('/intelligence/scout?filter=high-roi')
      })
    }

    if (query.includes('under') && query.includes('500k')) {
      suggestions.push({
        id: 'ai-2',
        type: 'property',
        title: 'Properties Under $500K',
        subtitle: '234 properties found in your criteria',
        icon: Home,
        action: () => router.push('/properties?maxPrice=500000')
      })
    }

    if (query.includes('school') || query.includes('family')) {
      suggestions.push({
        id: 'ai-3',
        type: 'area',
        title: 'Top School Districts',
        subtitle: 'Cypress-Fairbanks, Katy ISD, Spring Branch',
        icon: MapPin,
        action: () => router.push('/neighborhoods?amenity=schools')
      })
    }

    if (query.includes('commercial') || query.includes('office')) {
      suggestions.push({
        id: 'ai-4',
        type: 'property',
        title: 'Commercial Properties',
        subtitle: 'Office spaces, retail, warehouses',
        icon: Building2,
        action: () => router.push('/properties?type=commercial')
      })
    }

    // Smart questions
    suggestions.push({
      id: 'q-1',
      type: 'question',
      title: `Find properties similar to "${query}"`,
      icon: Search,
      action: () => handleSearch(query)
    })

    if (query.length > 5) {
      suggestions.push({
        id: 'q-2',
        type: 'question',
        title: 'Ask Fernando-X for detailed analysis',
        icon: Brain,
        action: () => router.push(`/assistant?q=${encodeURIComponent(query)}`)
      })
    }

    return suggestions.slice(0, 6)
  }

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (!finalQuery.trim()) return

    // Save to recent searches
    const updated = [finalQuery, ...recentSearches.filter(s => s !== finalQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Execute search
    if (onSearch) {
      onSearch(finalQuery)
    } else {
      router.push(`/search?q=${encodeURIComponent(finalQuery)}`)
    }
    
    setIsOpen(false)
    setQuery('')
  }

  const popularSearches = [
    { icon: Target, text: 'Investment properties under $600K' },
    { icon: MapPin, text: 'Best neighborhoods for families' },
    { icon: TrendingUp, text: 'Highest ROI areas' },
    { icon: Building2, text: 'Commercial development opportunities' }
  ]

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
          <Search className="h-5 w-5 text-gray-400" />
          {loading && (
            <Loader2 className="h-4 w-4 text-purple-600 animate-spin ml-2" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
        />
        
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* AI Insight */}
            {aiInsight && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
                <div className="flex items-start">
                  <Brain className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-purple-900 font-medium">AI Insight</p>
                    <p className="text-sm text-purple-700 mt-1">{aiInsight}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((suggestion) => {
                  const Icon = suggestion.icon
                  return (
                    <button
                      key={suggestion.id}
                      onClick={suggestion.action}
                      className="w-full px-4 py-3 hover:bg-gray-50 flex items-center transition-colors"
                    >
                      <div className={`p-2 rounded-lg mr-3 ${
                        suggestion.type === 'insight' ? 'bg-purple-100' :
                        suggestion.type === 'area' ? 'bg-green-100' :
                        suggestion.type === 'property' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          suggestion.type === 'insight' ? 'text-purple-600' :
                          suggestion.type === 'area' ? 'text-green-600' :
                          suggestion.type === 'property' ? 'text-blue-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {suggestion.title}
                        </p>
                        {suggestion.subtitle && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {suggestion.subtitle}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="p-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Recent Searches
                    </p>
                    <div className="space-y-2">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSearch(search)}
                          className="flex items-center text-sm text-gray-700 hover:text-purple-600 transition-colors"
                        >
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Popular Searches
                  </p>
                  <div className="space-y-2">
                    {popularSearches.map((search, idx) => {
                      const Icon = search.icon
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setQuery(search.text)
                            handleSearch(search.text)
                          }}
                          className="flex items-center text-sm text-gray-700 hover:text-purple-600 transition-colors"
                        >
                          <Icon className="h-4 w-4 mr-2 text-gray-400" />
                          {search.text}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* AI Assistant CTA */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => router.push('/assistant')}
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Brain className="h-5 w-5 mr-2" />
                    Ask Fernando-X for help
                    <Sparkles className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}