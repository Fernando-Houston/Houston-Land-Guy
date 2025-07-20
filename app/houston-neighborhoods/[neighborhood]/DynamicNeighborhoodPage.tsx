'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, MapPin, TrendingUp, Users, School, Home, Building2, Download, Clock, Droplet, TreePine, DollarSign, Zap } from 'lucide-react'
import { NeighborhoodData, MarketMetrics, MarketTiming, PermitActivity } from '@/lib/core-agents/types'
import { MarketMetricsCard } from '@/components/market/MarketMetricsCard'
import { PermitActivityChart } from '@/components/market/PermitActivityChart'
import { DemographicsCard } from '@/components/market/DemographicsCard'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'
import { PropertyMap } from '@/components/maps/MapWrapper'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { houstonDataService } from '@/lib/services/houston-data-service'

interface DynamicNeighborhoodPageProps {
  neighborhoodData: NeighborhoodData
  marketMetrics: MarketMetrics
  marketTiming: MarketTiming
  permitData: PermitActivity
}

interface AreaInsights {
  market?: any
  environmental?: any
  tech?: any
  residential?: any
  commercial?: any
}

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
  
  return centers[slug] || { lat: 29.7604, lng: -95.3698 } // Default to Houston center
}

export function DynamicNeighborhoodPage({ 
  neighborhoodData, 
  marketMetrics, 
  marketTiming,
  permitData 
}: DynamicNeighborhoodPageProps) {
  const [areaInsights, setAreaInsights] = useState<AreaInsights>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadAreaData = async () => {
      try {
        const insights = await houstonDataService.getAreaInsights(neighborhoodData.name);
        setAreaInsights(insights);
      } catch (error) {
        console.error('Error loading area insights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAreaData();
  }, [neighborhoodData.name]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${neighborhoodData.name}, Houston, TX`,
    description: `${neighborhoodData.name} is a thriving neighborhood in Houston with a median home price of $${(neighborhoodData.medianHomePrice / 1000).toFixed(0)}K and ${neighborhoodData.growthRate}% annual growth rate.`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '29.7604',
      longitude: '-95.3698'
    },
    containedInPlace: {
      '@type': 'City',
      name: 'Houston',
      containedInPlace: {
        '@type': 'State',
        name: 'Texas'
      }
    },
    hasMap: `https://maps.google.com/?q=${neighborhoodData.name}+Houston+TX`
  }

  return (
    <React.Fragment>
      <Script
        id={`neighborhood-${neighborhoodData.slug}-jsonld`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/houston-neighborhoods" 
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Neighborhoods
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {neighborhoodData.name} Development Opportunities
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                  Discover premium development sites in one of Houston's most dynamic neighborhoods with 
                  <span className="font-semibold text-green-600"> {neighborhoodData.growthRate}% annual growth</span> and 
                  <span className="font-semibold text-green-600"> ${(neighborhoodData.medianHomePrice / 1000).toFixed(0)}K median home prices</span>.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">${neighborhoodData.pricePerSqFt}</div>
                    <div className="text-sm text-gray-600">Per Sq Ft</div>
                  </div>
                  <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{neighborhoodData.schoolRating}</div>
                    <div className="text-sm text-gray-600">School Rating</div>
                  </div>
                  <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{neighborhoodData.population.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Population</div>
                  </div>
                  <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">${(neighborhoodData.medianIncome / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-600">Median Income</div>
                  </div>
                </div>
                
                {/* Real Houston Data Insights */}
                {areaInsights.environmental && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Droplet className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-semibold text-blue-900">
                        Flood Zone: {areaInsights.environmental.floodZone} | Risk: {areaInsights.environmental.floodRisk}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-blue-800">
                      <span className="flex items-center">
                        <TreePine className="h-4 w-4 mr-1" />
                        {areaInsights.environmental.greenCertifications} Green Buildings
                      </span>
                      <span>AQI: {areaInsights.environmental.airQuality}</span>
                      {areaInsights.environmental.solarIncentives && (
                        <span className="flex items-center">
                          <Zap className="h-4 w-4 mr-1" />
                          Solar Incentives Available
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {areaInsights.tech && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-purple-900">
                        Tech Ecosystem Score: {areaInsights.tech.innovationScore}/100
                      </span>
                      <span className="text-sm text-purple-700">
                        ${(areaInsights.tech.vcFunding / 1000000).toFixed(0)}M VC Funding
                      </span>
                    </div>
                    <div className="text-sm text-purple-800">
                      {areaInsights.tech.techCompanies} Tech Companies | {areaInsights.tech.techWorkers.toLocaleString()} Tech Workers
                    </div>
                  </div>
                )}
                
                {areaInsights.residential && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Home className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-semibold text-green-900">
                        Residential Market Activity
                      </span>
                    </div>
                    <div className="text-sm text-green-800">
                      {areaInsights.residential.activeBuilders} Active Builders | 
                      {areaInsights.residential.newCommunities} New Communities | 
                      Top Builder: {areaInsights.residential.topBuilder}
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      Price Range: ${(areaInsights.residential.priceRangeLow / 1000).toFixed(0)}K - ${(areaInsights.residential.priceRangeHigh / 1000).toFixed(0)}K
                    </div>
                  </div>
                )}
                
                {areaInsights.commercial && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Building2 className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="text-sm font-semibold text-orange-900">
                        Commercial Market: {areaInsights.commercial.vacancyRate}% Vacancy
                      </span>
                    </div>
                    <div className="text-sm text-orange-800">
                      ${areaInsights.commercial.averageRent}/SF | 
                      {(areaInsights.commercial.underConstruction / 1000000).toFixed(1)}M SF Under Construction
                    </div>
                    {areaInsights.commercial.lendingRates && (
                      <div className="text-sm text-orange-700 mt-1">
                        Lending: Multifamily {areaInsights.commercial.lendingRates.multifamily} | 
                        Commercial {areaInsights.commercial.lendingRates.commercial}
                      </div>
                    )}
                  </div>
                )}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/consultation"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Schedule Consultation
                  </Link>
                  <button className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors">
                    <Download className="mr-2 h-4 w-4" />
                    Download Market Report
                  </button>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Market Timing Analysis</h3>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-green-600 mb-2">{marketTiming.score}/100</div>
                  <div className="text-lg font-semibold text-gray-900">
                    Recommendation: <span className="text-green-600">{marketTiming.recommendation}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(marketTiming.factors).map(([factor, score]) => (
                    <div key={factor} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {factor.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-10 text-right">{score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Market Data Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Real-Time {neighborhoodData.name} Market Intelligence
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Live data updated hourly from Houston MLS, permit databases, and demographic sources
              </p>
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <MarketMetricsCard metrics={marketMetrics} />
              <PermitActivityChart permitData={permitData} />
              <DemographicsCard demographics={neighborhoodData.demographics} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {neighborhoodData.name} Interactive Map
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore development opportunities, key landmarks, and infrastructure in {neighborhoodData.name}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <PropertyMap
                height="500px"
                showSearch={true}
                markers={[
                  {
                    id: 'center',
                    position: getNeighborhoodCenter(neighborhoodData.slug),
                    title: `${neighborhoodData.name} Center`,
                    description: `Median Price: $${(neighborhoodData.medianHomePrice / 1000).toFixed(0)}K`
                  }
                ]}
                center={getNeighborhoodCenter(neighborhoodData.slug)}
                zoom={13}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Neighborhood Overview */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Why Invest in {neighborhoodData.name}?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 not-prose mb-12">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  Location Advantages
                </h3>
                <ul className="space-y-2">
                  {neighborhoodData.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 text-green-600 mr-2" />
                  Major Employers
                </h3>
                <ul className="space-y-2">
                  {neighborhoodData.topEmployers.map((employer, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-700">{employer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {neighborhoodData.name} represents one of Houston's most compelling development opportunities, 
              combining <strong>strong population growth</strong> of {neighborhoodData.growthRate}% annually with 
              <strong> median household incomes</strong> of ${(neighborhoodData.medianIncome / 1000).toFixed(0)}K. 
              The area's strategic location in {neighborhoodData.county} County provides excellent access to major 
              employment centers while maintaining the suburban lifestyle that attracts families and professionals.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              With an average price per square foot of <strong>${neighborhoodData.pricePerSqFt}</strong> and 
              school ratings averaging <strong>{neighborhoodData.schoolRating}/10</strong>, {neighborhoodData.name} 
              offers an ideal balance of affordability and quality of life. The neighborhood's 
              <strong> {neighborhoodData.demographics.ownerOccupied}% owner-occupancy rate</strong> demonstrates 
              the stability and long-term investment potential of the area.
            </p>

            {/* Upcoming Developments */}
            {neighborhoodData.upcomingDevelopments.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 my-8 not-prose">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Upcoming Developments in {neighborhoodData.name}
                </h3>
                <div className="space-y-4">
                  {neighborhoodData.upcomingDevelopments.map((development, index) => (
                    <div key={index} className="bg-white bg-opacity-80 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{development.name}</h4>
                        <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          {development.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{development.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Size:</span>
                          <div className="font-semibold text-gray-900">{development.size}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Investment:</span>
                          <div className="font-semibold text-gray-900">
                            ${(development.investmentValue / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Developer:</span>
                          <div className="font-semibold text-gray-900">{development.developer}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Completion:</span>
                          <div className="font-semibold text-gray-900">{development.expectedCompletion}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investment Insights */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Investment Insights & Opportunities
            </h3>

            <div className="grid md:grid-cols-3 gap-6 not-prose mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Growth Potential</h4>
                <p className="text-3xl font-bold text-green-600 mb-1">{neighborhoodData.growthRate}%</p>
                <p className="text-sm text-gray-600">Annual appreciation rate</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Demographics</h4>
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {neighborhoodData.demographics.education.bachelors}%
                </p>
                <p className="text-sm text-gray-600">Bachelor's degree or higher</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <School className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                <p className="text-3xl font-bold text-purple-600 mb-1">{neighborhoodData.schoolRating}/10</p>
                <p className="text-sm text-gray-600">Average school rating</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              The combination of strong fundamentals, strategic location, and ongoing development activity 
              makes {neighborhoodData.name} an exceptional opportunity for developers and investors. 
              With <strong>{permitData.totalPermits} active development permits</strong> valued at 
              <strong> ${(permitData.totalValue / 1000000).toFixed(1)} million</strong>, the neighborhood 
              continues to attract significant investment across residential, commercial, and mixed-use projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Market Timing Insights */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Market Timing Analysis for {neighborhoodData.name}
            </h2>

            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-4">
                  <div className="text-4xl font-bold text-green-600">{marketTiming.score}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Market Recommendation: <span className="text-green-600">{marketTiming.recommendation}</span>
                </h3>
                <p className="text-gray-600">Risk Level: {marketTiming.riskLevel}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 mb-3">Key Market Insights:</h4>
                {marketTiming.insights.map((insight, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="ml-3 text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <p className="text-center text-gray-700">
                  Based on current market conditions, {neighborhoodData.name} presents a 
                  <span className="font-semibold"> {marketTiming.recommendation.toLowerCase()}</span> opportunity 
                  with {marketTiming.riskLevel.toLowerCase()} risk factors.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-white"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Get Exclusive {neighborhoodData.name} Development Opportunities
              </h2>
              <p className="text-lg mb-8 text-green-50">
                Access off-market properties and detailed investment analysis before they hit the public market
              </p>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <LeadCaptureForm 
                  source={`NEIGHBORHOOD_${neighborhoodData.slug.toUpperCase()}`} 
                  className="max-w-md mx-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Neighborhoods */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore Other Houston Neighborhoods</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['katy', 'sugar-land', 'woodlands', 'pearland'].map((area) => (
              <Link
                key={area}
                href={`/houston-neighborhoods/${area}/`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
              >
                <h3 className="font-semibold text-gray-900 capitalize">{area.replace('-', ' ')}</h3>
                <p className="text-sm text-gray-600 mt-1">View opportunities →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}