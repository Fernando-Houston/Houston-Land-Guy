'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface DataQualityIssue {
  table: string
  field: string
  issue: string
  severity: 'critical' | 'warning' | 'info'
  count: number
  example?: any
}

export default function DataQualityPage() {
  const [issues, setIssues] = useState<DataQualityIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  useEffect(() => {
    checkDataQuality()
  }, [])

  const checkDataQuality = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/data-quality')
      if (response.ok) {
        const data = await response.json()
        setIssues(data.issues)
        setLastCheck(new Date())
      }
    } catch (error) {
      console.error('Error checking data quality:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <CheckCircle className="h-5 w-5 text-blue-600" />
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking data quality...</p>
        </div>
      </div>
    )
  }

  const criticalIssues = issues.filter(i => i.severity === 'critical')
  const warningIssues = issues.filter(i => i.severity === 'warning')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Quality Monitor</h1>
              <p className="text-sm text-gray-600 mt-1">
                Last checked: {lastCheck.toLocaleString()}
              </p>
            </div>
            <button
              onClick={checkDataQuality}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-check
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{criticalIssues.length}</div>
              <div className="text-sm text-red-800">Critical Issues</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">{warningIssues.length}</div>
              <div className="text-sm text-yellow-800">Warnings</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {issues.length === 0 ? '✓' : issues.length}
              </div>
              <div className="text-sm text-green-800">Total Issues</div>
            </div>
          </div>
        </div>

        {/* Issues List */}
        {issues.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-900">No Data Quality Issues Found!</h2>
            <p className="text-green-700 mt-2">All data appears to be properly formatted.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`border rounded-lg p-6 ${getSeverityBg(issue.severity)}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {getSeverityIcon(issue.severity)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {issue.table}.{issue.field}
                    </h3>
                    <p className="text-gray-700 mt-1">{issue.issue}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <span className="font-medium">Affected records:</span>
                      <span className="ml-2">{issue.count}</span>
                    </div>
                    {issue.example && (
                      <div className="mt-3 bg-white bg-opacity-50 rounded p-3">
                        <p className="text-sm font-medium text-gray-700">Example:</p>
                        <pre className="text-xs text-gray-600 mt-1">
                          {JSON.stringify(issue.example, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fix Instructions */}
        {issues.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Fix</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• For $0 prices: Re-import data with correct price fields mapped</p>
              <p>• For missing ZIP codes: Update neighborhood data with ZIP code mapping</p>
              <p>• For null values: Ensure import scripts handle missing data properly</p>
              <p>• Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run import:fix-failed</code></p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}