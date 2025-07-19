import { fernandoXAI } from './ai-service'

export interface DocumentAnalysis {
  id: string
  fileName: string
  fileType: string
  uploadedAt: Date
  analyzedAt: Date
  status: 'pending' | 'analyzing' | 'completed' | 'failed'
  summary: string
  keyInsights: string[]
  extractedData: {
    propertyDetails?: {
      address?: string
      lotSize?: string
      zoning?: string
      currentUse?: string
      proposedUse?: string
      sqft?: number
      units?: number
    }
    financials?: {
      purchasePrice?: number
      developmentCost?: number
      projectedRevenue?: number
      roi?: number
      irr?: number
      capRate?: number
    }
    legalInfo?: {
      restrictions?: string[]
      easements?: string[]
      liens?: string[]
      permits?: string[]
    }
    timeline?: {
      acquisitionDate?: string
      developmentStart?: string
      completionDate?: string
      phases?: { name: string; duration: string }[]
    }
  }
  risks: {
    type: string
    severity: 'low' | 'medium' | 'high'
    description: string
    mitigation?: string
  }[]
  opportunities: {
    type: string
    potential: 'low' | 'medium' | 'high'
    description: string
    actionItems?: string[]
  }[]
  recommendations: string[]
  confidence: number
}

export interface DocumentType {
  name: string
  extensions: string[]
  icon: string
  category: 'legal' | 'financial' | 'planning' | 'market' | 'technical'
}

export interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: {
    name: string
    type: 'text' | 'number' | 'date' | 'select' | 'array'
    required: boolean
    options?: string[]
  }[]
}

class DocumentAnalysisService {
  private analyses: Map<string, DocumentAnalysis> = new Map()
  
  // Document Types
  private documentTypes: DocumentType[] = [
    {
      name: 'Purchase Agreement',
      extensions: ['.pdf', '.docx'],
      icon: 'FileText',
      category: 'legal'
    },
    {
      name: 'Site Survey',
      extensions: ['.pdf', '.dwg', '.dxf'],
      icon: 'Map',
      category: 'technical'
    },
    {
      name: 'Financial Proforma',
      extensions: ['.xlsx', '.xls', '.pdf'],
      icon: 'DollarSign',
      category: 'financial'
    },
    {
      name: 'Zoning Report',
      extensions: ['.pdf', '.docx'],
      icon: 'Building',
      category: 'planning'
    },
    {
      name: 'Market Analysis',
      extensions: ['.pdf', '.pptx', '.docx'],
      icon: 'TrendingUp',
      category: 'market'
    },
    {
      name: 'Environmental Report',
      extensions: ['.pdf', '.docx'],
      icon: 'Trees',
      category: 'technical'
    },
    {
      name: 'Title Report',
      extensions: ['.pdf'],
      icon: 'Shield',
      category: 'legal'
    },
    {
      name: 'Construction Plans',
      extensions: ['.pdf', '.dwg', '.revit'],
      icon: 'Hammer',
      category: 'technical'
    }
  ]
  
  async analyzeDocument(
    file: File,
    documentType?: string,
    context?: {
      projectId?: string
      propertyId?: string
      additionalInfo?: Record<string, any>
    }
  ): Promise<DocumentAnalysis> {
    const analysisId = `doc-${Date.now()}`
    
    // Create initial analysis record
    const analysis: DocumentAnalysis = {
      id: analysisId,
      fileName: file.name,
      fileType: documentType || this.detectDocumentType(file.name),
      uploadedAt: new Date(),
      analyzedAt: new Date(),
      status: 'analyzing',
      summary: '',
      keyInsights: [],
      extractedData: {},
      risks: [],
      opportunities: [],
      recommendations: [],
      confidence: 0
    }
    
    this.analyses.set(analysisId, analysis)
    
    try {
      // Simulate document processing
      const processedData = await this.processDocument(file, analysis.fileType)
      
      // AI analysis
      const aiAnalysis = await fernandoXAI.analyzeDocument({
        content: processedData.text,
        documentType: analysis.fileType,
        context
      })
      
      // Update analysis with AI results
      analysis.summary = aiAnalysis.summary
      analysis.keyInsights = aiAnalysis.keyInsights
      analysis.extractedData = this.extractStructuredData(processedData.text, analysis.fileType)
      analysis.risks = this.identifyRisks(processedData.text, analysis.fileType)
      analysis.opportunities = this.identifyOpportunities(processedData.text, analysis.fileType)
      analysis.recommendations = aiAnalysis.recommendations
      analysis.confidence = aiAnalysis.confidence
      analysis.status = 'completed'
      
      this.analyses.set(analysisId, analysis)
      return analysis
    } catch (error) {
      analysis.status = 'failed'
      this.analyses.set(analysisId, analysis)
      throw error
    }
  }
  
  async compareDocuments(
    documentIds: string[],
    comparisonType: 'version' | 'similar' | 'conflicting'
  ): Promise<{
    similarities: string[]
    differences: string[]
    conflicts?: string[]
    recommendation: string
  }> {
    const documents = documentIds.map(id => this.analyses.get(id)).filter(Boolean)
    
    if (documents.length < 2) {
      throw new Error('At least 2 documents required for comparison')
    }
    
    // Perform comparison based on type
    if (comparisonType === 'version') {
      return this.compareVersions(documents as DocumentAnalysis[])
    } else if (comparisonType === 'similar') {
      return this.findSimilarities(documents as DocumentAnalysis[])
    } else {
      return this.findConflicts(documents as DocumentAnalysis[])
    }
  }
  
  async generateReport(
    analysisIds: string[],
    reportType: 'executive' | 'detailed' | 'risk' | 'opportunity'
  ): Promise<{
    title: string
    sections: {
      heading: string
      content: string
      data?: any
    }[]
    charts?: {
      type: 'pie' | 'bar' | 'line'
      data: any
      title: string
    }[]
  }> {
    const analyses = analysisIds.map(id => this.analyses.get(id)).filter(Boolean) as DocumentAnalysis[]
    
    if (analyses.length === 0) {
      throw new Error('No analyses found')
    }
    
    switch (reportType) {
      case 'executive':
        return this.generateExecutiveReport(analyses)
      case 'detailed':
        return this.generateDetailedReport(analyses)
      case 'risk':
        return this.generateRiskReport(analyses)
      case 'opportunity':
        return this.generateOpportunityReport(analyses)
      default:
        return this.generateExecutiveReport(analyses)
    }
  }
  
  async extractDataFromMultiple(
    files: File[],
    extractionTemplate?: DocumentTemplate
  ): Promise<{
    aggregatedData: Record<string, any>
    individualResults: {
      fileName: string
      extractedData: Record<string, any>
      confidence: number
    }[]
  }> {
    const results = await Promise.all(
      files.map(async file => {
        const analysis = await this.analyzeDocument(file)
        return {
          fileName: file.name,
          extractedData: analysis.extractedData,
          confidence: analysis.confidence
        }
      })
    )
    
    // Aggregate data
    const aggregatedData = this.aggregateExtractedData(results)
    
    return {
      aggregatedData,
      individualResults: results
    }
  }
  
  async searchDocuments(
    query: string,
    filters?: {
      documentType?: string[]
      dateRange?: { start: Date; end: Date }
      tags?: string[]
      minConfidence?: number
    }
  ): Promise<DocumentAnalysis[]> {
    let results = Array.from(this.analyses.values())
    
    // Apply filters
    if (filters?.documentType) {
      results = results.filter(doc => filters.documentType!.includes(doc.fileType))
    }
    
    if (filters?.dateRange) {
      results = results.filter(doc => 
        doc.uploadedAt >= filters.dateRange!.start &&
        doc.uploadedAt <= filters.dateRange!.end
      )
    }
    
    if (filters?.minConfidence) {
      results = results.filter(doc => doc.confidence >= filters.minConfidence!)
    }
    
    // Search in content
    if (query) {
      results = results.filter(doc => {
        const searchText = `${doc.summary} ${doc.keyInsights.join(' ')} ${JSON.stringify(doc.extractedData)}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      })
    }
    
    return results
  }
  
  // Helper methods
  private detectDocumentType(fileName: string): string {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
    
    for (const docType of this.documentTypes) {
      if (docType.extensions.includes(extension)) {
        return docType.name
      }
    }
    
    return 'Unknown Document'
  }
  
  private async processDocument(file: File, documentType: string): Promise<{ text: string; metadata: any }> {
    // In production, this would use OCR, PDF parsing, etc.
    // For now, simulate processing
    return {
      text: `Processed content of ${file.name}`,
      metadata: {
        pages: Math.floor(Math.random() * 50) + 1,
        processedAt: new Date()
      }
    }
  }
  
  private extractStructuredData(text: string, documentType: string): DocumentAnalysis['extractedData'] {
    // Mock data extraction based on document type
    switch (documentType) {
      case 'Purchase Agreement':
        return {
          propertyDetails: {
            address: '123 Main St, Houston, TX 77001',
            lotSize: '10,000 sqft',
            currentUse: 'Vacant Land',
            proposedUse: 'Mixed-Use Development'
          },
          financials: {
            purchasePrice: 2500000,
            developmentCost: 8000000,
            projectedRevenue: 15000000,
            roi: 42.8
          }
        }
      case 'Financial Proforma':
        return {
          financials: {
            purchasePrice: 3000000,
            developmentCost: 12000000,
            projectedRevenue: 22000000,
            roi: 46.7,
            irr: 18.5,
            capRate: 7.2
          }
        }
      case 'Zoning Report':
        return {
          propertyDetails: {
            zoning: 'C-2 Commercial',
            sqft: 45000,
            units: 150
          },
          legalInfo: {
            restrictions: ['Height limit: 75 feet', 'Setback: 20 feet'],
            permits: ['Building permit required', 'Special use permit for residential']
          }
        }
      default:
        return {}
    }
  }
  
  private identifyRisks(text: string, documentType: string): DocumentAnalysis['risks'] {
    // Mock risk identification
    const commonRisks = [
      {
        type: 'Market Risk',
        severity: 'medium' as const,
        description: 'Potential oversupply in the area could impact returns',
        mitigation: 'Phase development to match market absorption'
      },
      {
        type: 'Regulatory Risk',
        severity: 'low' as const,
        description: 'Zoning changes could affect development plans',
        mitigation: 'Secure entitlements early in the process'
      },
      {
        type: 'Financial Risk',
        severity: 'medium' as const,
        description: 'Interest rate fluctuations could impact project feasibility',
        mitigation: 'Lock in financing terms or use interest rate hedges'
      }
    ]
    
    return commonRisks.slice(0, Math.floor(Math.random() * 3) + 1)
  }
  
  private identifyOpportunities(text: string, documentType: string): DocumentAnalysis['opportunities'] {
    // Mock opportunity identification
    return [
      {
        type: 'Development Opportunity',
        potential: 'high',
        description: 'Site allows for higher density than currently utilized',
        actionItems: ['Apply for density bonus', 'Redesign to maximize FAR']
      },
      {
        type: 'Market Timing',
        potential: 'medium',
        description: 'Growing demand in the area presents favorable conditions',
        actionItems: ['Accelerate development timeline', 'Pre-lease to secure tenants']
      }
    ]
  }
  
  private compareVersions(documents: DocumentAnalysis[]): any {
    // Sort by date
    documents.sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime())
    
    return {
      similarities: [
        'Property address remains consistent',
        'Development concept unchanged',
        'Target market demographics similar'
      ],
      differences: [
        'Purchase price increased by 10% in latest version',
        'Development timeline extended by 6 months',
        'Added affordable housing component'
      ],
      recommendation: 'Latest version reflects market conditions and regulatory requirements. Proceed with updated terms.'
    }
  }
  
  private findSimilarities(documents: DocumentAnalysis[]): any {
    return {
      similarities: [
        'All properties located in high-growth corridors',
        'Similar development cost per square foot',
        'Comparable projected returns'
      ],
      differences: [
        'Varying lot sizes and configurations',
        'Different zoning classifications',
        'Timeline variations of 3-6 months'
      ],
      recommendation: 'Properties show consistent investment profile. Consider portfolio approach for better terms.'
    }
  }
  
  private findConflicts(documents: DocumentAnalysis[]): any {
    return {
      similarities: ['Same property referenced'],
      differences: [
        'Conflicting ownership claims',
        'Different recorded easements'
      ],
      conflicts: [
        'Title report shows different owner than purchase agreement',
        'Survey conflicts with recorded plat'
      ],
      recommendation: 'Resolve title issues before proceeding. Recommend title insurance and legal review.'
    }
  }
  
  private generateExecutiveReport(analyses: DocumentAnalysis[]): any {
    return {
      title: 'Executive Summary - Document Analysis',
      sections: [
        {
          heading: 'Overview',
          content: `Analyzed ${analyses.length} documents with an average confidence of ${
            (analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length * 100).toFixed(1)
          }%`
        },
        {
          heading: 'Key Findings',
          content: analyses.flatMap(a => a.keyInsights).slice(0, 5).join('\n')
        },
        {
          heading: 'Risk Summary',
          content: `Identified ${analyses.reduce((sum, a) => sum + a.risks.length, 0)} total risks across all documents`,
          data: {
            high: analyses.flatMap(a => a.risks).filter(r => r.severity === 'high').length,
            medium: analyses.flatMap(a => a.risks).filter(r => r.severity === 'medium').length,
            low: analyses.flatMap(a => a.risks).filter(r => r.severity === 'low').length
          }
        },
        {
          heading: 'Recommendations',
          content: analyses.flatMap(a => a.recommendations).slice(0, 3).join('\n')
        }
      ],
      charts: [
        {
          type: 'pie',
          title: 'Risk Distribution',
          data: {
            labels: ['High', 'Medium', 'Low'],
            values: [
              analyses.flatMap(a => a.risks).filter(r => r.severity === 'high').length,
              analyses.flatMap(a => a.risks).filter(r => r.severity === 'medium').length,
              analyses.flatMap(a => a.risks).filter(r => r.severity === 'low').length
            ]
          }
        }
      ]
    }
  }
  
  private generateDetailedReport(analyses: DocumentAnalysis[]): any {
    return {
      title: 'Detailed Document Analysis Report',
      sections: analyses.map(analysis => ({
        heading: analysis.fileName,
        content: analysis.summary,
        data: {
          insights: analysis.keyInsights,
          extractedData: analysis.extractedData,
          risks: analysis.risks,
          opportunities: analysis.opportunities,
          recommendations: analysis.recommendations
        }
      }))
    }
  }
  
  private generateRiskReport(analyses: DocumentAnalysis[]): any {
    const allRisks = analyses.flatMap(a => a.risks)
    const groupedRisks = allRisks.reduce((acc, risk) => {
      if (!acc[risk.type]) acc[risk.type] = []
      acc[risk.type].push(risk)
      return acc
    }, {} as Record<string, typeof allRisks>)
    
    return {
      title: 'Comprehensive Risk Analysis',
      sections: Object.entries(groupedRisks).map(([type, risks]) => ({
        heading: type,
        content: `${risks.length} risks identified`,
        data: risks
      }))
    }
  }
  
  private generateOpportunityReport(analyses: DocumentAnalysis[]): any {
    const allOpportunities = analyses.flatMap(a => a.opportunities)
    
    return {
      title: 'Opportunity Analysis Report',
      sections: [
        {
          heading: 'High Potential Opportunities',
          content: 'Opportunities with highest potential for returns',
          data: allOpportunities.filter(o => o.potential === 'high')
        },
        {
          heading: 'Action Plan',
          content: 'Recommended actions to capitalize on opportunities',
          data: allOpportunities.flatMap(o => o.actionItems || [])
        }
      ]
    }
  }
  
  private aggregateExtractedData(results: any[]): Record<string, any> {
    // Aggregate financial data
    const financials = results
      .map(r => r.extractedData.financials)
      .filter(Boolean)
    
    if (financials.length > 0) {
      return {
        totalInvestment: financials.reduce((sum, f) => sum + (f.purchasePrice || 0), 0),
        totalDevelopmentCost: financials.reduce((sum, f) => sum + (f.developmentCost || 0), 0),
        averageROI: financials.reduce((sum, f) => sum + (f.roi || 0), 0) / financials.length,
        documentCount: results.length
      }
    }
    
    return {
      documentCount: results.length,
      extractedDataPoints: results.reduce((sum, r) => 
        sum + Object.keys(r.extractedData).length, 0
      )
    }
  }
}

export const documentAnalysis = new DocumentAnalysisService()
export default DocumentAnalysisService