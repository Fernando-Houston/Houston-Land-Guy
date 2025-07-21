'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, DollarSign, Map, Building, TrendingUp,
  Shield, Trees, Hammer, Search, Filter, Download, Eye,
  AlertCircle, CheckCircle, Clock, ChevronRight, X,
  BarChart3, PieChart, FileSearch, Layers, Brain
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface DocumentAnalysisResult {
  id: string
  fileName: string
  fileType: string
  status: string
  summary: string
  keyInsights: string[]
  extractedData: any
  risks: any[]
  opportunities: any[]
  confidence: number
  analyzedAt: Date
}

const documentTypeIcons: Record<string, any> = {
  'Purchase Agreement': FileText,
  'Site Survey': Map,
  'Financial Proforma': DollarSign,
  'Zoning Report': Building,
  'Market Analysis': TrendingUp,
  'Environmental Report': Trees,
  'Title Report': Shield,
  'Construction Plans': Hammer
}

export default function DocumentAnalysisDashboard() {
  const [analyses, setAnalyses] = useState<DocumentAnalysisResult[]>([])
  const [selectedAnalysis, setSelectedAnalysis] = useState<DocumentAnalysisResult | null>(null)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState<'upload' | 'results' | 'compare'>('upload')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[file.name] || 0
          if (current >= 100) {
            clearInterval(progressInterval)
            return prev
          }
          return { ...prev, [file.name]: current + 10 }
        })
      }, 200)

      try {
        // Analyze document
        // Mock document analysis
        const mockAnalysis: DocumentAnalysisResult = {
          id: Date.now().toString(),
          fileName: file.name,
          fileType: file.type === 'application/pdf' ? 'Purchase Agreement' : 'Market Analysis',
          status: 'completed',
          summary: `Analysis of ${file.name} completed. Document appears to be a valid real estate document with key terms and conditions identified.`,
          keyInsights: [
            'Property value: $750,000',
            'Closing date: 30 days',
            'Contingencies: Financing and inspection',
            'Earnest money: $25,000'
          ],
          extractedData: {
            propertyAddress: '123 Main St, Houston, TX',
            purchasePrice: 750000,
            closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            buyerName: 'John Doe',
            sellerName: 'Jane Smith'
          },
          risks: [
            { type: 'financial', description: 'High leverage ratio', severity: 'medium' },
            { type: 'legal', description: 'Title concerns noted', severity: 'low' }
          ],
          opportunities: [
            { type: 'appreciation', description: 'Area showing strong growth', impact: 'high' },
            { type: 'development', description: 'Zoning allows mixed-use', impact: 'medium' }
          ],
          confidence: 0.92,
          analyzedAt: new Date()
        }
        const analysis = mockAnalysis
        
        setAnalyses(prev => [...prev, analysis])
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
        
        // Clean up progress after animation
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[file.name]
            return newProgress
          })
        }, 1000)
      } catch (error) {
        console.error('Error analyzing document:', error)
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[file.name]
          return newProgress
        })
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
  })

  const handleCompareDocuments = async () => {
    if (selectedForCompare.length < 2) return
    
    try {
      // Mock document comparison
      const mockComparison = {
        similarities: [
          'Both properties in same zip code',
          'Similar square footage',
          'Comparable pricing structures'
        ],
        differences: [
          'Different closing timelines',
          'Varying contingency clauses',
          'Different earnest money amounts'
        ],
        recommendations: [
          'Consider negotiating price based on comparison',
          'Review contingency differences carefully',
          'Align closing dates if possible'
        ]
      }
      const comparison = mockComparison
      // Previously used: await documentAnalysis.compareDocuments(selectedForCompare, 'similar')
      console.log('Comparison results:', comparison)
      // Handle comparison results
    } catch (error) {
      console.error('Error comparing documents:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'analyzing': return 'text-blue-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />
      case 'analyzing': return <Clock className="h-5 w-5 animate-spin" />
      case 'failed': return <AlertCircle className="h-5 w-5" />
      default: return <Clock className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const renderUploadSection = () => (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop documents'}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          or click to browse files
        </p>
        <p className="text-xs text-gray-500">
          Supports PDF, Word, Excel, and PowerPoint files
        </p>
      </div>

      {/* Upload Progress */}
      {Object.entries(uploadProgress).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Uploading & Analyzing</h3>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{fileName}</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Types */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Document Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(documentTypeIcons).map(([type, Icon]) => (
            <div key={type} className="flex items-center space-x-2 text-sm text-gray-700">
              <Icon className="h-4 w-4 text-purple-600" />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderResultsSection = () => (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Analysis Results ({analyses.length})
        </h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              compareMode
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Layers className="h-4 w-4 inline mr-2" />
            Compare
          </button>
          {compareMode && selectedForCompare.length >= 2 && (
            <button
              onClick={handleCompareDocuments}
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Compare Selected ({selectedForCompare.length})
            </button>
          )}
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {analyses.map(analysis => {
          const Icon = documentTypeIcons[analysis.fileType] || FileText
          const isSelected = selectedForCompare.includes(analysis.id)

          return (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-all ${
                isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                if (compareMode) {
                  setSelectedForCompare(prev =>
                    isSelected
                      ? prev.filter(id => id !== analysis.id)
                      : [...prev, analysis.id]
                  )
                } else {
                  setSelectedAnalysis(analysis)
                }
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{analysis.fileName}</h4>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                      <span>{analysis.fileType}</span>
                      <span>•</span>
                      <span className={`flex items-center ${getStatusColor(analysis.status)}`}>
                        {getStatusIcon(analysis.status)}
                        <span className="ml-1 capitalize">{analysis.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Confidence</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {(analysis.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{analysis.summary}</p>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{analysis.keyInsights.length}</p>
                  <p className="text-xs text-gray-600">Key Insights</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{analysis.risks.length}</p>
                  <p className="text-xs text-gray-600">Risks Found</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analysis.opportunities.length}</p>
                  <p className="text-xs text-gray-600">Opportunities</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View Details
                  <ChevronRight className="h-4 w-4 inline ml-1" />
                </button>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  const renderDetailModal = () => {
    if (!selectedAnalysis) return null

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedAnalysis(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedAnalysis.fileName}</h2>
              <p className="text-sm text-gray-600 mt-1">{selectedAnalysis.fileType}</p>
            </div>
            <button
              onClick={() => setSelectedAnalysis(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
              <p className="text-gray-700">{selectedAnalysis.summary}</p>
            </div>

            {/* Key Insights */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h3>
              <ul className="space-y-2">
                {selectedAnalysis.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extracted Data */}
            {Object.keys(selectedAnalysis.extractedData).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Extracted Data</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedAnalysis.extractedData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Risks */}
            {selectedAnalysis.risks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Identified Risks</h3>
                <div className="space-y-3">
                  {selectedAnalysis.risks.map((risk, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getSeverityColor(risk.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{risk.type}</h4>
                        <span className="text-xs font-medium uppercase">{risk.severity}</span>
                      </div>
                      <p className="text-sm mb-2">{risk.description}</p>
                      {risk.mitigation && (
                        <p className="text-sm italic">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunities */}
            {selectedAnalysis.opportunities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Opportunities</h3>
                <div className="space-y-3">
                  {selectedAnalysis.opportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">{opportunity.type}</h4>
                      <p className="text-sm text-green-800 mb-2">{opportunity.description}</p>
                      {opportunity.actionItems && (
                        <ul className="text-sm text-green-700 space-y-1">
                          {opportunity.actionItems.map((item: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Intelligence</h1>
        <p className="text-gray-600">AI-powered document analysis and data extraction</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'upload'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Documents
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'results'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileSearch className="h-4 w-4 mr-2" />
          Analysis Results ({analyses.length})
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'compare'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layers className="h-4 w-4 mr-2" />
          Compare & Report
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'upload' && renderUploadSection()}
        {activeTab === 'results' && renderResultsSection()}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAnalysis && renderDetailModal()}
      </AnimatePresence>
    </div>
  )
}