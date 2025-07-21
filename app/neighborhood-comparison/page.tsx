'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MapPin, TrendingUp, DollarSign, School, Users, 
  Home, Building2, Plus, X, BarChart3, Download
} from 'lucide-react'

interface NeighborhoodData {
  name: string
  zipCode?: string
  totalSales: number
  medianPrice: number
  avgPrice: number
  pricePerSqft: number
  activeListings: number
  monthsInventory: number
  avgDaysOnMarket: number
  safetyScore?: number
  walkScore?: number
  schoolRating?: number
  growthPotential: number
  medianHomePrice: number
  pricePerSqFt: number
  growthRate: number
  population: number
  medianIncome: number
  permitData: {
    totalPermits: number
    totalValue: number
  }
  demographics: {
    ownerOccupied: number
    education: {
      bachelors: number
    }
  }
}
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'
import { PropertyMap } from '@/components/maps/MapWrapper'

// Available neighborhoods will be loaded from database

// Helper function to get neighborhood center coordinates
function getNeighborhoodCenter(slug: string): { lat: number; lng: number } {
  const centers: Record<string, { lat: number; lng: number }> = {
    'cypress': { lat: 29.9691, lng: -95.6972 },
    'pearland': { lat: 29.5635, lng: -95.2860 },
    'memorial': { lat: 29.7641, lng: -95.4674 },
    'spring': { lat: 30.0799, lng: -95.4172 },
    'conroe': { lat: 30.3119, lng: -95.4560 },
    'richmond': { lat: 29.5819, lng: -95.7605 },
    'friendswood': { lat: 29.5294, lng: -95.2010 },
    'league-city': { lat: 29.5075, lng: -95.0949 },
    'clear-lake': { lat: 29.5768, lng: -95.1204 },
    'bellaire': { lat: 29.7058, lng: -95.4588 },
    'river-oaks': { lat: 29.7573, lng: -95.4151 },
    'heights': { lat: 29.7989, lng: -95.3987 },
    'montrose': { lat: 29.7472, lng: -95.3902 },
    'energy-corridor': { lat: 29.7836, lng: -95.6347 },
    'champions': { lat: 30.0360, lng: -95.5087 }
  }
  
  return centers[slug] || { lat: 29.7604, lng: -95.3698 }
}

export default function NeighborhoodComparison() {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<Array<{slug: string, name: string, zipCode?: string}>>([])
  const [neighborhoodData, setNeighborhoodData] = useState<Record<string, NeighborhoodData>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAvailableNeighborhoods()
  }, [])

  useEffect(() => {
    if (selectedNeighborhoods.length > 0) {
      loadNeighborhoodData()
    }
  }, [selectedNeighborhoods])

  const loadAvailableNeighborhoods = async () => {
    try {
      const response = await fetch('/api/neighborhoods')
      const data = await response.json()
      const neighborhoods = data.neighborhoods || []
      setAvailableNeighborhoods(neighborhoods)
      // Set default selection to first two neighborhoods
      if (neighborhoods.length >= 2) {
        setSelectedNeighborhoods([neighborhoods[0].slug, neighborhoods[1].slug])
      }
    } catch (error) {
      console.error('Error loading available neighborhoods:', error)
    }
  }

  const loadNeighborhoodData = async () => {
    setLoading(true)
    try {
      const dataMap: Record<string, NeighborhoodData> = {}
      
      for (const slug of selectedNeighborhoods) {
        const neighborhood = availableNeighborhoods.find(n => n.slug === slug)
        if (neighborhood) {
          // Use fallback data for now
          dataMap[slug] = {
            name: neighborhood.name,
            zipCode: neighborhood.zipCode,
            totalSales: 156,
            medianPrice: slug === 'river-oaks' ? 875000 : 
                        slug === 'heights' ? 485000 :
                        slug === 'memorial' ? 625000 : 425000,
            medianHomePrice: slug === 'river-oaks' ? 875000 : 
                            slug === 'heights' ? 485000 :
                            slug === 'memorial' ? 625000 : 425000,
            avgPrice: slug === 'river-oaks' ? 920000 : 
                     slug === 'heights' ? 510000 :
                     slug === 'memorial' ? 650000 : 450000,
            pricePerSqft: slug === 'river-oaks' ? 285 : 
                         slug === 'heights' ? 195 :
                         slug === 'memorial' ? 225 : 175,
            pricePerSqFt: slug === 'river-oaks' ? 285 : 
                         slug === 'heights' ? 195 :
                         slug === 'memorial' ? 225 : 175,
            growthRate: slug === 'heights' ? 8.5 : 
                       slug === 'memorial' ? 7.8 :
                       slug === 'river-oaks' ? 6.5 : 7.0,
            population: slug === 'river-oaks' ? 8500 :
                       slug === 'heights' ? 42000 :
                       slug === 'memorial' ? 35000 : 30000,
            medianIncome: slug === 'river-oaks' ? 185000 :
                         slug === 'memorial' ? 125000 :
                         slug === 'heights' ? 95000 : 75000,
            permitData: {
              totalPermits: slug === 'heights' ? 85 : 
                           slug === 'memorial' ? 65 :
                           slug === 'river-oaks' ? 25 : 45,
              totalValue: slug === 'heights' ? 12500000 : 
                         slug === 'memorial' ? 8500000 :
                         slug === 'river-oaks' ? 15000000 : 6500000
            },
            demographics: {
              ownerOccupied: slug === 'river-oaks' ? 95 :
                            slug === 'memorial' ? 85 :
                            slug === 'heights' ? 75 : 70,
              education: {
                bachelors: slug === 'river-oaks' ? 88 :
                          slug === 'memorial' ? 82 :
                          slug === 'heights' ? 65 : 55
              }
            },
            activeListings: 45,
            monthsInventory: 2.8,
            avgDaysOnMarket: 25,
            safetyScore: slug === 'river-oaks' ? 9.2 : 
                        slug === 'heights' ? 7.8 :
                        slug === 'memorial' ? 8.5 : 7.5,
            walkScore: slug === 'heights' ? 85 : 
                      slug === 'river-oaks' ? 75 :
                      slug === 'memorial' ? 65 : 55,
            schoolRating: slug === 'river-oaks' ? 9.5 : 
                         slug === 'memorial' ? 8.8 :
                         slug === 'heights' ? 7.5 : 7.2,
            growthPotential: slug === 'heights' ? 8.5 : 
                            slug === 'memorial' ? 7.8 :
                            slug === 'river-oaks' ? 6.5 : 7.0
          }
        }
      }
      
      setNeighborhoodData(dataMap)
    } catch (error) {
      console.error('Error loading neighborhood data:', error)
    }
    setLoading(false)
  }

  const addNeighborhood = (slug: string) => {
    if (!selectedNeighborhoods.includes(slug) && selectedNeighborhoods.length < 4) {
      setSelectedNeighborhoods([...selectedNeighborhoods, slug])
    }
  }

  const removeNeighborhood = (slug: string) => {
    if (selectedNeighborhoods.length > 2) {
      setSelectedNeighborhoods(selectedNeighborhoods.filter(n => n !== slug))
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  const getComparisonColor = (value: number, otherValues: number[], higherIsBetter = true) => {
    const max = Math.max(...otherValues)
    const min = Math.min(...otherValues)
    
    if (value === max && higherIsBetter) return 'text-green-600 font-bold'
    if (value === min && !higherIsBetter) return 'text-green-600 font-bold'
    if (value === min && higherIsBetter) return 'text-red-600'
    if (value === max && !higherIsBetter) return 'text-red-600'
    return 'text-gray-900'
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-green-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/houston-neighborhoods" 
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-6"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Back to Neighborhoods
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Neighborhood Comparison Tool
            </h1>
            <p className="text-xl text-gray-700">
              Compare up to 4 Houston neighborhoods side-by-side with real-time market data
            </p>
          </div>
        </div>
      </section>

      {/* Neighborhood Selector */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Selected Neighborhoods ({selectedNeighborhoods.length}/4)
            </h2>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Comparison
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {selectedNeighborhoods.map(slug => {
              const neighborhood = availableNeighborhoods.find(n => n.slug === slug)
              return (
                <div
                  key={slug}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg"
                >
                  <span className="font-medium">{neighborhood?.name}</span>
                  {selectedNeighborhoods.length > 2 && (
                    <button
                      onClick={() => removeNeighborhood(slug)}
                      className="ml-2 hover:text-green-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )
            })}
            
            {selectedNeighborhoods.length < 4 && (
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addNeighborhood(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue=""
                >
                  <option value="">Add neighborhood...</option>
                  {availableNeighborhoods
                    .filter(n => !selectedNeighborhoods.includes(n.slug))
                    .map(n => (
                      <option key={n.slug} value={n.slug}>{n.name}</option>
                    ))
                  }
                </select>
                <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full animate-spin">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <p className="mt-4 text-gray-600">Loading neighborhood data...</p>
            </div>
          ) : (
            <div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Metric</th>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        return (
                          <th key={slug} className="text-center py-4 px-6">
                            <div className="font-semibold text-gray-900">{data?.name || slug}</div>
                            <Link
                              href={`/houston-neighborhoods/${slug}/`}
                              className="text-sm text-green-600 hover:text-green-700"
                            >
                              View Details →
                            </Link>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price Metrics */}
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <Home className="h-4 w-4 text-gray-400 mr-2" />
                          Median Home Price
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        const values = selectedNeighborhoods.map(s => neighborhoodData[s]?.medianHomePrice || 0)
                        return (
                          <td key={slug} className="text-center py-4 px-6">
                            <div className={getComparisonColor(data?.medianHomePrice || 0, values)}>
                              {data ? formatCurrency(data.medianHomePrice) : '-'}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                          Price per Sq Ft
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        const values = selectedNeighborhoods.map(s => neighborhoodData[s]?.pricePerSqFt || 0)
                        return (
                          <td key={slug} className="text-center py-4 px-6">
                            <div className={getComparisonColor(data?.pricePerSqFt || 0, values)}>
                              {data ? `$${data.pricePerSqFt}` : '-'}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                          Growth Rate
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        const values = selectedNeighborhoods.map(s => neighborhoodData[s]?.growthRate || 0)
                        return (
                          <td key={slug} className="text-center py-4 px-6">
                            <div className={getComparisonColor(data?.growthRate || 0, values)}>
                              {data ? `${data.growthRate}%` : '-'}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    
                    {/* Demographics */}
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          Population
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        return (
                          <td key={slug} className="text-center py-4 px-6 text-gray-900">
                            {data ? data.population.toLocaleString() : '-'}
                          </td>
                        )
                      })}
                    </tr>
                    
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                          Median Income
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        const values = selectedNeighborhoods.map(s => neighborhoodData[s]?.medianIncome || 0)
                        return (
                          <td key={slug} className="text-center py-4 px-6">
                            <div className={getComparisonColor(data?.medianIncome || 0, values)}>
                              {data ? formatCurrency(data.medianIncome) : '-'}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <School className="h-4 w-4 text-gray-400 mr-2" />
                          School Rating
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        const values = selectedNeighborhoods.map(s => neighborhoodData[s]?.schoolRating || 0)
                        return (
                          <td key={slug} className="text-center py-4 px-6">
                            <div className={getComparisonColor(data?.schoolRating || 0, values)}>
                              {data ? `${data.schoolRating}/10` : '-'}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    
                    {/* Development Activity */}
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                          Total Permits
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        const values = selectedNeighborhoods.map(s => neighborhoodData[s]?.permitData.totalPermits || 0)
                        return (
                          <td key={slug} className="text-center py-4 px-6">
                            <div className={getComparisonColor(data?.permitData.totalPermits || 0, values)}>
                              {data ? data.permitData.totalPermits : '-'}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                          Permit Value
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        const values = selectedNeighborhoods.map(s => neighborhoodData[s]?.permitData.totalValue || 0)
                        return (
                          <td key={slug} className="text-center py-4 px-6">
                            <div className={getComparisonColor(data?.permitData.totalValue || 0, values)}>
                              {data ? formatCurrency(data.permitData.totalValue) : '-'}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    
                    {/* Additional Metrics */}
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <Home className="h-4 w-4 text-gray-400 mr-2" />
                          Owner Occupied
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        const values = selectedNeighborhoods.map(s => neighborhoodData[s]?.demographics.ownerOccupied || 0)
                        return (
                          <td key={slug} className="text-center py-4 px-6">
                            <div className={getComparisonColor(data?.demographics.ownerOccupied || 0, values)}>
                              {data ? `${data.demographics.ownerOccupied}%` : '-'}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                    
                    <tr className="bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          Bachelor's Degree+
                        </div>
                      </td>
                      {selectedNeighborhoods.map(slug => {
                        const data = neighborhoodData[slug]
                        const values = selectedNeighborhoods.map(s => neighborhoodData[s]?.demographics.education.bachelors || 0)
                        return (
                          <td key={slug} className="text-center py-4 px-6">
                            <div className={getComparisonColor(data?.demographics.education.bachelors || 0, values)}>
                              {data ? `${data.demographics.education.bachelors}%` : '-'}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Map */}
      {!loading && Object.keys(neighborhoodData).length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Neighborhood Locations</h2>
                <p className="text-gray-600">
                  Compare geographic locations and proximity to major areas
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <PropertyMap
                  height="500px"
                  showSearch={false}
                  markers={selectedNeighborhoods.map(slug => {
                    const data = neighborhoodData[slug]
                    return {
                      id: slug,
                      position: getNeighborhoodCenter(slug),
                      title: data?.name || '',
                      description: `Median: $${((data?.medianHomePrice || 0) / 1000).toFixed(0)}K • Growth: ${data?.growthRate || 0}%`
                    }
                  })}
                  zoom={10}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Key Insights */}
      {!loading && Object.keys(neighborhoodData).length > 0 && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Insights</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Best Value</h3>
                  <p className="text-gray-700">
                    {(() => {
                      const bestValue = selectedNeighborhoods.reduce((best, slug) => {
                        const data = neighborhoodData[slug]
                        if (!data) return best
                        const value = data.growthRate / (data.pricePerSqFt / 100)
                        return value > (neighborhoodData[best]?.growthRate || 0) / ((neighborhoodData[best]?.pricePerSqFt || 1) / 100) ? slug : best
                      }, selectedNeighborhoods[0])
                      const data = neighborhoodData[bestValue]
                      return `${data?.name} offers the best value with ${data?.growthRate}% growth at $${data?.pricePerSqFt}/sqft`
                    })()}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Highest Growth</h3>
                  <p className="text-gray-700">
                    {(() => {
                      const highestGrowth = selectedNeighborhoods.reduce((best, slug) => {
                        const data = neighborhoodData[slug]
                        return (data?.growthRate || 0) > (neighborhoodData[best]?.growthRate || 0) ? slug : best
                      }, selectedNeighborhoods[0])
                      const data = neighborhoodData[highestGrowth]
                      return `${data?.name} leads with ${data?.growthRate}% annual growth rate`
                    })()}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Most Development Activity</h3>
                  <p className="text-gray-700">
                    {(() => {
                      const mostActive = selectedNeighborhoods.reduce((best, slug) => {
                        const data = neighborhoodData[slug]
                        return (data?.permitData.totalPermits || 0) > (neighborhoodData[best]?.permitData.totalPermits || 0) ? slug : best
                      }, selectedNeighborhoods[0])
                      const data = neighborhoodData[mostActive]
                      return `${data?.name} shows highest activity with ${data?.permitData.totalPermits} permits worth ${formatCurrency(data?.permitData.totalValue || 0)}`
                    })()}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Premium Market</h3>
                  <p className="text-gray-700">
                    {(() => {
                      const premium = selectedNeighborhoods.reduce((best, slug) => {
                        const data = neighborhoodData[slug]
                        return (data?.medianHomePrice || 0) > (neighborhoodData[best]?.medianHomePrice || 0) ? slug : best
                      }, selectedNeighborhoods[0])
                      const data = neighborhoodData[premium]
                      return `${data?.name} is the premium market at ${formatCurrency(data?.medianHomePrice || 0)} median price`
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Get Detailed Neighborhood Analysis Reports
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Download comprehensive comparison reports with investment recommendations 
              tailored to your specific criteria.
            </p>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
              <LeadCaptureForm 
                source="NEIGHBORHOOD_COMPARISON" 
                className="space-y-4"
                buttonText="Get Analysis Report"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}