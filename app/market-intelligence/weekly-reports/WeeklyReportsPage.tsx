'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Download, Calendar, TrendingUp, Building2, MapPin, FileText, Clock } from 'lucide-react'
import { MarketReport, MarketMetrics, PermitActivity } from '@/lib/core-agents/types'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'
import Script from 'next/script'

interface WeeklyReportsPageProps {
  currentReport: MarketReport
  recentReports: Array<{
    id: string
    date: Date
    title: string
    summary: string
  }>
  marketMetrics: MarketMetrics
  permitData: PermitActivity
}

export function WeeklyReportsPage({ 
  currentReport, 
  recentReports, 
  marketMetrics,
  permitData 
}: WeeklyReportsPageProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: currentReport.title,
    datePublished: currentReport.date,
    dateModified: currentReport.date,
    author: {
      '@type': 'Organization',
      name: 'Houston Development Intelligence'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Houston Development Intelligence',
      logo: {
        '@type': 'ImageObject',
        url: 'https://houstonlandguy.com/logo.png'
      }
    },
    description: currentReport.summary,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://houstonlandguy.com/market-intelligence/weekly-reports/'
    }
  }

  return (
    <>
      <Script
        id="weekly-reports-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-green-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/market-intelligence" 
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Market Intelligence
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Weekly Market Reports
            </h1>
            <p className="text-xl text-gray-700">
              Comprehensive Houston development market analysis updated every Monday
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current Report */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-white mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-full mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      {new Date(currentReport.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{currentReport.title}</h2>
                </div>
                <button className="hidden md:flex items-center px-6 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>

              <p className="text-lg text-green-50 mb-8">{currentReport.summary}</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <TrendingUp className="h-6 w-6 text-green-300 mb-2" />
                  <div className="text-2xl font-bold">
                    ${(currentReport.keyMetrics.totalPermitValue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-green-200">Permit Value</div>
                </div>
                
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <Building2 className="h-6 w-6 text-green-300 mb-2" />
                  <div className="text-2xl font-bold">{currentReport.keyMetrics.permitCount}</div>
                  <div className="text-sm text-green-200">New Permits</div>
                </div>
                
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <TrendingUp className="h-6 w-6 text-green-300 mb-2" />
                  <div className="text-2xl font-bold">{currentReport.keyMetrics.avgROI}%</div>
                  <div className="text-sm text-green-200">Avg ROI</div>
                </div>
                
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <TrendingUp className="h-6 w-6 text-green-300 mb-2" />
                  <div className="text-2xl font-bold">+{currentReport.keyMetrics.growthRate}%</div>
                  <div className="text-sm text-green-200">Growth Rate</div>
                </div>
                
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <MapPin className="h-6 w-6 text-green-300 mb-2" />
                  <div className="text-lg font-bold">Top Areas</div>
                  <div className="text-xs text-green-200">
                    {currentReport.keyMetrics.topNeighborhoods.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>

              <button className="md:hidden flex items-center px-6 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors mt-6">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>

            {/* Report Content */}
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Market Analysis</h3>
              
              <div className="grid md:grid-cols-2 gap-8 not-prose mb-12">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Key Market Trends</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-700">
                        Residential permits up <strong>15%</strong> YoY, driven by single-family homes
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-700">
                        Industrial development surging with <strong>28%</strong> growth in warehouse permits
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-700">
                        Average days on market decreased to <strong>{marketMetrics.daysOnMarket}</strong> days
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-700">
                        Price per square foot reached <strong>${marketMetrics.averagePricePerSqFt}</strong>
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Investment Highlights</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">
                        Master-planned communities showing <strong>22.4%</strong> average ROI
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">
                        Strong corporate relocations driving office demand
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">
                        Infrastructure investments opening new corridors
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">
                        Interest rate environment improving for developers
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Neighborhood Spotlight</h3>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 not-prose mb-12">
                <h4 className="font-bold text-gray-900 mb-4">This Week&apos;s Top Performing Areas</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {currentReport.keyMetrics.topNeighborhoods.map((neighborhood) => (
                    <Link
                      key={neighborhood}
                      href={`/houston-neighborhoods/${neighborhood.toLowerCase().replace(' ', '-')}/`}
                      className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h5 className="font-semibold text-gray-900 mb-2">{neighborhood}</h5>
                      <p className="text-sm text-gray-600">
                        View detailed market analysis →
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Looking Ahead</h3>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                The Houston development market continues to show strong fundamentals heading into 
                {' '}{currentReport.quarter} {currentReport.year}. With sustained population growth, 
                diversifying economy, and strategic infrastructure investments, we expect continued 
                opportunities across residential, commercial, and mixed-use sectors.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Key areas to watch include the northern suburbs along the Grand Parkway, eastern 
                industrial corridors near the Port of Houston, and urban infill opportunities in 
                the Inner Loop. Developers should position themselves now to capitalize on these 
                emerging opportunities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Previous Reports</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {recentReports.slice(1).map((report) => (
              <motion.div
                key={report.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {report.date.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm mb-4">{report.summary}</p>
                <button className="text-green-600 font-medium text-sm hover:text-green-700">
                  Download Report →
                </button>
              </motion.div>
            ))}
          </div>
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
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Never Miss a Market Update
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get weekly reports delivered to your inbox with exclusive insights and opportunities
              </p>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <LeadCaptureForm 
                  source="WEEKLY_REPORTS" 
                  className="max-w-md mx-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}