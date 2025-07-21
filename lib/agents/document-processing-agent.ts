import { BaseAgent, AgentTask, AgentResult } from './base-agent'
import { DataAccuracyAgent } from './data-accuracy-agent'
import { PrismaClient } from '@prisma/client'

// PDF parsing will be mocked for now - in production use pdf-parse or similar
let pdfParse: any

const prisma = new PrismaClient()

interface DocumentMetadata {
  id: string
  type: 'permit' | 'contract' | 'deed' | 'inspection' | 'appraisal' | 'other'
  title: string
  uploadDate: Date
  fileSize: number
  pageCount: number
  propertyId?: string
  accountNumber?: string
  address?: string
  checksum: string
}

interface ExtractedData {
  dates: Array<{ type: string; date: Date }>
  amounts: Array<{ type: string; amount: number; currency: string }>
  parties: Array<{ role: string; name: string; address?: string }>
  properties: Array<{ address: string; accountNumber?: string; legalDescription?: string }>
  keyTerms: string[]
  summary: string
  confidence: number
}

interface PermitData {
  permitNumber: string
  type: string
  status: string
  issueDate?: Date
  expirationDate?: Date
  address: string
  value?: number
  description: string
  contractor?: string
  owner?: string
}

interface ContractData {
  type: 'purchase' | 'lease' | 'construction' | 'service'
  executionDate?: Date
  effectiveDate?: Date
  expirationDate?: Date
  parties: Array<{ role: string; name: string }>
  propertyAddress?: string
  purchasePrice?: number
  leaseAmount?: number
  terms: string[]
}

export class DocumentProcessingAgent extends BaseAgent {
  private dataAccuracyAgent: DataAccuracyAgent
  private documentCache: Map<string, ExtractedData>
  
  // Common patterns for data extraction
  private patterns = {
    date: /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})\b/g,
    amount: /\$[\d,]+\.?\d*|USD\s*[\d,]+\.?\d*/g,
    permitNumber: /[A-Z]{1,3}[-\s]?\d{4,}-?\d{3,}/g,
    address: /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|boulevard|blvd)\.?\s*,?\s*[\w\s]*,?\s*(?:TX|Texas)\s+\d{5}/gi,
    accountNumber: /(?:account|acct|parcel)[\s#:]*([A-Z0-9-]+)/gi,
    phone: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  }
  
  // Houston-specific terms
  private houstonTerms = {
    permits: ['COH', 'City of Houston', 'Harris County', 'HCAD', 'building permit', 'construction permit'],
    zones: ['TMU-R', 'C-1', 'C-2', 'SUP', 'TIRZ', 'ETJ', 'MUD'],
    entities: ['Houston Public Works', 'Planning & Development', 'Harris County Appraisal District'],
    propertyTypes: ['single-family', 'multi-family', 'commercial', 'industrial', 'mixed-use']
  }

  constructor() {
    super('DocumentProcessingAgent', {
      maxConcurrent: 3,
      timeout: 60000, // 1 minute for large PDFs
      retryAttempts: 2
    })
    
    this.dataAccuracyAgent = new DataAccuracyAgent()
    this.documentCache = new Map()
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    const { action, params } = task.data || task
    
    try {
      let result: any
      
      switch (action) {
        case 'processDocument':
          result = await this.processDocument(params.buffer, params.metadata)
          break
        case 'extractPermitData':
          result = await this.extractPermitData(params.text, params.metadata)
          break
        case 'analyzeContract':
          result = await this.analyzeContract(params.text, params.metadata)
          break
        case 'classifyDocument':
          result = await this.classifyDocument(params.text)
          break
        case 'searchDocuments':
          result = await this.searchDocuments(params.query, params.filters)
          break
        case 'linkToProperty':
          result = await this.linkDocumentToProperty(params.documentId, params.propertyId)
          break
        default:
          throw new Error(`Unknown action: ${action}`)
      }
      
      return {
        taskId: task.id,
        agentName: this.name,
        success: true,
        data: result,
        executionTime: 0,
        confidence: result.confidence || 0.8
      }
    } catch (error) {
      return {
        taskId: task.id,
        agentName: this.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: 0
      }
    }
  }

  async processDocument(buffer: Buffer, metadata: DocumentMetadata): Promise<ExtractedData> {
    try {
      // Check cache first
      if (this.documentCache.has(metadata.checksum)) {
        return this.documentCache.get(metadata.checksum)!
      }
      
      // Extract text from PDF (using mock for now)
      const pdfData = await this.parsePDF(buffer)
      const text = pdfData.text
      
      // Update metadata
      metadata.pageCount = pdfData.numpages
      
      // Classify document type
      const classification = await this.classifyDocument(text)
      metadata.type = classification.type
      
      // Extract structured data
      const extractedData: ExtractedData = {
        dates: this.extractDates(text),
        amounts: this.extractAmounts(text),
        parties: this.extractParties(text),
        properties: this.extractProperties(text),
        keyTerms: this.extractKeyTerms(text),
        summary: await this.generateSummary(text, classification.type),
        confidence: 0.85
      }
      
      // Validate extracted data
      const validation = await this.validateExtractedData(extractedData)
      extractedData.confidence = validation.confidence
      
      // Cache the results
      this.documentCache.set(metadata.checksum, extractedData)
      
      // Store in database
      await this.storeDocument(metadata, extractedData)
      
      return extractedData
    } catch (error) {
      console.error('Error processing document:', error)
      throw error
    }
  }

  private extractDates(text: string): Array<{ type: string; date: Date }> {
    const dates: Array<{ type: string; date: Date }> = []
    const matches = text.match(this.patterns.date) || []
    
    const dateKeywords = {
      'issue': ['issued', 'issue date', 'date issued'],
      'effective': ['effective', 'effective date', 'commencement'],
      'expiration': ['expires', 'expiration', 'valid until'],
      'execution': ['executed', 'signed', 'dated'],
      'closing': ['closing', 'closing date', 'settlement']
    }
    
    matches.forEach(match => {
      const date = this.parseDate(match)
      if (date) {
        // Find context around the date
        const index = text.indexOf(match)
        const context = text.substring(Math.max(0, index - 50), Math.min(text.length, index + 50))
        
        let dateType = 'other'
        for (const [type, keywords] of Object.entries(dateKeywords)) {
          if (keywords.some(keyword => context.toLowerCase().includes(keyword))) {
            dateType = type
            break
          }
        }
        
        dates.push({ type: dateType, date })
      }
    })
    
    return dates
  }

  private extractAmounts(text: string): Array<{ type: string; amount: number; currency: string }> {
    const amounts: Array<{ type: string; amount: number; currency: string }> = []
    const matches = text.match(this.patterns.amount) || []
    
    const amountKeywords = {
      'purchase': ['purchase price', 'sale price', 'consideration'],
      'lease': ['rent', 'monthly rent', 'lease amount'],
      'construction': ['construction cost', 'project cost', 'contract amount'],
      'permit': ['permit fee', 'valuation', 'project value'],
      'tax': ['tax', 'assessed value', 'taxable value']
    }
    
    matches.forEach(match => {
      const amount = this.parseAmount(match)
      if (amount > 0) {
        const index = text.indexOf(match)
        const context = text.substring(Math.max(0, index - 50), Math.min(text.length, index + 50))
        
        let amountType = 'other'
        for (const [type, keywords] of Object.entries(amountKeywords)) {
          if (keywords.some(keyword => context.toLowerCase().includes(keyword))) {
            amountType = type
            break
          }
        }
        
        amounts.push({ type: amountType, amount, currency: 'USD' })
      }
    })
    
    return amounts
  }

  private extractParties(text: string): Array<{ role: string; name: string; address?: string }> {
    const parties: Array<{ role: string; name: string; address?: string }> = []
    
    // Common party patterns
    const partyPatterns = [
      /(?:Owner|Applicant|Contractor|Developer|Seller|Buyer|Lessor|Lessee|Landlord|Tenant):\s*([A-Z][A-Za-z\s,.'&-]+?)(?:\n|$)/g,
      /(?:between|by and between)\s+([A-Z][A-Za-z\s,.'&-]+?)\s+(?:and|,)/g,
      /(?:Name|Company|Entity):\s*([A-Z][A-Za-z\s,.'&-]+?)(?:\n|$)/g
    ]
    
    const roleKeywords = {
      'owner': ['owner', 'property owner', 'homeowner'],
      'buyer': ['buyer', 'purchaser', 'grantee'],
      'seller': ['seller', 'grantor', 'vendor'],
      'contractor': ['contractor', 'builder', 'developer'],
      'tenant': ['tenant', 'lessee', 'renter'],
      'landlord': ['landlord', 'lessor', 'property manager']
    }
    
    partyPatterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        const name = match[1].trim()
        if (name.length > 3 && name.length < 100) {
          // Determine role
          let role = 'party'
          const context = text.substring(Math.max(0, match.index - 50), match.index + match[0].length)
          
          for (const [roleType, keywords] of Object.entries(roleKeywords)) {
            if (keywords.some(keyword => context.toLowerCase().includes(keyword))) {
              role = roleType
              break
            }
          }
          
          // Try to find associated address
          const addressMatch = text.substring(match.index, Math.min(text.length, match.index + 200))
            .match(this.patterns.address)
          
          parties.push({
            role,
            name,
            address: addressMatch ? addressMatch[0] : undefined
          })
        }
      }
    })
    
    // Remove duplicates
    return Array.from(new Map(parties.map(p => [`${p.role}-${p.name}`, p])).values())
  }

  private extractProperties(text: string): Array<{ address: string; accountNumber?: string; legalDescription?: string }> {
    const properties: Array<{ address: string; accountNumber?: string; legalDescription?: string }> = []
    
    // Extract addresses
    const addressMatches = text.match(this.patterns.address) || []
    
    addressMatches.forEach(address => {
      const property: any = { address: address.trim() }
      
      // Look for account number near the address
      const index = text.indexOf(address)
      const nearbyText = text.substring(Math.max(0, index - 200), Math.min(text.length, index + 200))
      
      const accountMatch = nearbyText.match(this.patterns.accountNumber)
      if (accountMatch) {
        property.accountNumber = accountMatch[1]
      }
      
      // Look for legal description
      const legalMatch = nearbyText.match(/(?:legal description|lot|block|subdivision)[:.\s]+([^.]+\.)/i)
      if (legalMatch) {
        property.legalDescription = legalMatch[1].trim()
      }
      
      properties.push(property)
    })
    
    return properties
  }

  private extractKeyTerms(text: string): string[] {
    const keyTerms: Set<string> = new Set()
    
    // Houston-specific terms
    Object.values(this.houstonTerms).flat().forEach(term => {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        keyTerms.add(term)
      }
    })
    
    // Legal and real estate terms
    const importantTerms = [
      'deed', 'title', 'easement', 'encumbrance', 'lien',
      'covenant', 'restriction', 'zoning', 'variance', 'setback',
      'right-of-way', 'mineral rights', 'survey', 'plat',
      'escrow', 'closing', 'warranty', 'as-is', 'contingency'
    ]
    
    importantTerms.forEach(term => {
      if (text.toLowerCase().includes(term)) {
        keyTerms.add(term)
      }
    })
    
    return Array.from(keyTerms)
  }

  private async generateSummary(text: string, documentType: string): Promise<string> {
    // For now, create a basic summary. In production, this could use an LLM
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
    const keyData = {
      dates: this.extractDates(text),
      amounts: this.extractAmounts(text),
      parties: this.extractParties(text),
      properties: this.extractProperties(text)
    }
    
    let summary = `${documentType.toUpperCase()} DOCUMENT SUMMARY:\n`
    
    if (keyData.properties.length > 0) {
      summary += `Property: ${keyData.properties[0].address}\n`
    }
    
    if (keyData.parties.length > 0) {
      const mainParties = keyData.parties.slice(0, 3)
      summary += `Parties: ${mainParties.map(p => `${p.name} (${p.role})`).join(', ')}\n`
    }
    
    if (keyData.amounts.length > 0) {
      const mainAmount = keyData.amounts.reduce((max, curr) => 
        curr.amount > max.amount ? curr : max
      )
      summary += `Amount: $${mainAmount.amount.toLocaleString()} (${mainAmount.type})\n`
    }
    
    if (keyData.dates.length > 0) {
      const effectiveDate = keyData.dates.find(d => d.type === 'effective') || keyData.dates[0]
      summary += `Date: ${effectiveDate.date.toLocaleDateString()}\n`
    }
    
    // Add first meaningful sentence
    const firstSentence = sentences.find(s => 
      s.length > 50 && !s.includes('Page') && !s.match(/^\d+$/)
    )
    if (firstSentence) {
      summary += `\nDescription: ${firstSentence.trim()}`
    }
    
    return summary
  }

  async extractPermitData(text: string, metadata?: DocumentMetadata): Promise<PermitData> {
    const permitData: Partial<PermitData> = {}
    
    // Extract permit number
    const permitMatch = text.match(this.patterns.permitNumber)
    if (permitMatch) {
      permitData.permitNumber = permitMatch[0]
    }
    
    // Extract permit type
    const permitTypes = [
      'Building', 'Electrical', 'Plumbing', 'Mechanical',
      'Demolition', 'Sign', 'Driveway', 'Tree Removal'
    ]
    
    permitTypes.forEach(type => {
      if (text.includes(type + ' Permit')) {
        permitData.type = type
      }
    })
    
    // Extract dates
    const dates = this.extractDates(text)
    const issueDate = dates.find(d => d.type === 'issue')
    const expirationDate = dates.find(d => d.type === 'expiration')
    
    if (issueDate) permitData.issueDate = issueDate.date
    if (expirationDate) permitData.expirationDate = expirationDate.date
    
    // Extract address
    const properties = this.extractProperties(text)
    if (properties.length > 0) {
      permitData.address = properties[0].address
    }
    
    // Extract value
    const amounts = this.extractAmounts(text)
    const permitValue = amounts.find(a => a.type === 'permit' || a.type === 'construction')
    if (permitValue) {
      permitData.value = permitValue.amount
    }
    
    // Extract parties
    const parties = this.extractParties(text)
    const owner = parties.find(p => p.role === 'owner')
    const contractor = parties.find(p => p.role === 'contractor')
    
    if (owner) permitData.owner = owner.name
    if (contractor) permitData.contractor = contractor.name
    
    // Extract description
    const descMatch = text.match(/(?:description|scope of work|work to be performed)[:.\s]+([^.]+\.)/i)
    if (descMatch) {
      permitData.description = descMatch[1].trim()
    }
    
    // Determine status
    if (text.toLowerCase().includes('approved')) {
      permitData.status = 'approved'
    } else if (text.toLowerCase().includes('issued')) {
      permitData.status = 'issued'
    } else if (text.toLowerCase().includes('pending')) {
      permitData.status = 'pending'
    } else {
      permitData.status = 'unknown'
    }
    
    return permitData as PermitData
  }

  async analyzeContract(text: string, metadata?: DocumentMetadata): Promise<ContractData> {
    const contractData: Partial<ContractData> = {}
    
    // Determine contract type
    if (text.toLowerCase().includes('purchase agreement') || 
        text.toLowerCase().includes('sales contract')) {
      contractData.type = 'purchase'
    } else if (text.toLowerCase().includes('lease agreement') || 
               text.toLowerCase().includes('rental agreement')) {
      contractData.type = 'lease'
    } else if (text.toLowerCase().includes('construction contract')) {
      contractData.type = 'construction'
    } else {
      contractData.type = 'service'
    }
    
    // Extract dates
    const dates = this.extractDates(text)
    const executionDate = dates.find(d => d.type === 'execution')
    const effectiveDate = dates.find(d => d.type === 'effective')
    const expirationDate = dates.find(d => d.type === 'expiration')
    
    if (executionDate) contractData.executionDate = executionDate.date
    if (effectiveDate) contractData.effectiveDate = effectiveDate.date
    if (expirationDate) contractData.expirationDate = expirationDate.date
    
    // Extract parties
    contractData.parties = this.extractParties(text)
    
    // Extract property address
    const properties = this.extractProperties(text)
    if (properties.length > 0) {
      contractData.propertyAddress = properties[0].address
    }
    
    // Extract amounts
    const amounts = this.extractAmounts(text)
    if (contractData.type === 'purchase') {
      const purchaseAmount = amounts.find(a => a.type === 'purchase')
      if (purchaseAmount) contractData.purchasePrice = purchaseAmount.amount
    } else if (contractData.type === 'lease') {
      const leaseAmount = amounts.find(a => a.type === 'lease')
      if (leaseAmount) contractData.leaseAmount = leaseAmount.amount
    }
    
    // Extract key terms
    contractData.terms = this.extractContractTerms(text)
    
    return contractData as ContractData
  }

  private extractContractTerms(text: string): string[] {
    const terms: string[] = []
    
    // Common contract clauses
    const clausePatterns = [
      /(?:contingenc(?:y|ies)):\s*([^.]+\.)/gi,
      /(?:warranty|warranties):\s*([^.]+\.)/gi,
      /(?:condition|conditions):\s*([^.]+\.)/gi,
      /(?:covenant|covenants):\s*([^.]+\.)/gi,
      /(?:default|breach):\s*([^.]+\.)/gi
    ]
    
    clausePatterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        terms.push(match[1].trim())
      }
    })
    
    // Special conditions
    if (text.toLowerCase().includes('as-is')) {
      terms.push('Property sold AS-IS')
    }
    
    if (text.toLowerCase().includes('financing contingency')) {
      terms.push('Subject to financing contingency')
    }
    
    if (text.toLowerCase().includes('inspection contingency')) {
      terms.push('Subject to inspection contingency')
    }
    
    return terms
  }

  async classifyDocument(text: string): Promise<{ type: DocumentMetadata['type']; confidence: number }> {
    const classifications: Array<{ type: DocumentMetadata['type']; score: number }> = []
    const lowerText = text.toLowerCase()
    
    // Permit indicators
    const permitScore = this.calculateTypeScore(text, [
      'permit', 'city of houston', 'building department',
      'inspection', 'approved plans', 'permit number',
      'construction value', 'scope of work', 'permit fee',
      'issue date', 'expiration', 'plans examiner'
    ])
    classifications.push({ type: 'permit', score: permitScore })
    
    // Contract indicators
    const contractScore = this.calculateTypeScore(text, [
      'agreement', 'contract', 'parties', 'whereas',
      'consideration', 'terms and conditions', 'governing law',
      'executed', 'witness', 'notary'
    ])
    classifications.push({ type: 'contract', score: contractScore })
    
    // Deed indicators
    const deedScore = this.calculateTypeScore(text, [
      'deed', 'grantor', 'grantee', 'convey',
      'warranty', 'quitclaim', 'property description',
      'recording', 'county clerk'
    ])
    classifications.push({ type: 'deed', score: deedScore })
    
    // Inspection indicators
    const inspectionScore = this.calculateTypeScore(text, [
      'inspection', 'inspector', 'deficiencies',
      'code compliance', 'safety', 'structural',
      'electrical', 'plumbing', 'HVAC'
    ])
    classifications.push({ type: 'inspection', score: inspectionScore })
    
    // Appraisal indicators
    const appraisalScore = this.calculateTypeScore(text, [
      'appraisal', 'appraiser', 'market value',
      'comparable sales', 'adjustment', 'valuation',
      'property condition', 'neighborhood analysis'
    ])
    classifications.push({ type: 'appraisal', score: appraisalScore })
    
    // Find highest scoring type
    const bestMatch = classifications.reduce((max, curr) => 
      curr.score > max.score ? curr : max
    )
    
    // If no strong match, classify as 'other'
    if (bestMatch.score < 0.3) {
      return { type: 'other', confidence: 0.5 }
    }
    
    return {
      type: bestMatch.type,
      confidence: Math.min(bestMatch.score * 1.5, 0.95) // Scale up but cap at 95%
    }
  }

  private calculateTypeScore(text: string, keywords: string[]): number {
    const lowerText = text.toLowerCase()
    let matchedKeywords = 0
    let totalScore = 0
    
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchedKeywords++
        // Give more weight to exact matches
        const occurrences = (lowerText.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
        totalScore += Math.min(occurrences * 0.2, 1.0)
      }
    })
    
    // Score based on percentage of keywords matched and their frequency
    const keywordMatchRatio = matchedKeywords / keywords.length
    const avgScore = totalScore / keywords.length
    
    return Math.min(keywordMatchRatio * 0.6 + avgScore * 0.4, 1.0)
  }

  private parseDate(dateStr: string): Date | null {
    try {
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return date
      }
    } catch {
      // Try alternative parsing
    }
    
    // Try MM/DD/YYYY or MM-DD-YYYY
    const usDateMatch = dateStr.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/)
    if (usDateMatch) {
      const [_, month, day, year] = usDateMatch
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    
    return null
  }

  private parseAmount(amountStr: string): number {
    const cleaned = amountStr.replace(/[$,USD\s]/g, '')
    const amount = parseFloat(cleaned)
    return isNaN(amount) ? 0 : amount
  }

  private async validateExtractedData(data: ExtractedData): Promise<{ confidence: number }> {
    let totalConfidence = 0
    let validations = 0
    
    // Validate dates
    if (data.dates.length > 0) {
      const dateValidation = data.dates.every(d => {
        const year = d.date.getFullYear()
        return year >= 1900 && year <= new Date().getFullYear() + 5
      })
      totalConfidence += dateValidation ? 0.9 : 0.5
      validations++
    }
    
    // Validate amounts
    if (data.amounts.length > 0) {
      const amountValidation = await this.dataAccuracyAgent.execute({
        data: {
          action: 'validateProperty',
          params: {
            propertyData: {
              marketValue: Math.max(...data.amounts.map(a => a.amount))
            }
          }
        },
        id: 'doc-validation',
        type: 'validation',
        priority: 1
      })
      
      totalConfidence += amountValidation.data?.overallConfidence || 0.7
      validations++
    }
    
    // Validate addresses
    if (data.properties.length > 0) {
      const addressValidation = data.properties.every(p => 
        p.address.includes('Houston') || p.address.includes('TX') || p.address.includes('Texas')
      )
      totalConfidence += addressValidation ? 0.95 : 0.6
      validations++
    }
    
    // Validate parties
    if (data.parties.length > 0) {
      const partyValidation = data.parties.every(p => 
        p.name.length > 2 && p.name.length < 100 && !p.name.match(/^\d+$/)
      )
      totalConfidence += partyValidation ? 0.9 : 0.7
      validations++
    }
    
    return {
      confidence: validations > 0 ? totalConfidence / validations : 0.5
    }
  }

  private async storeDocument(metadata: DocumentMetadata, extractedData: ExtractedData): Promise<void> {
    try {
      // Check if Prisma client is properly initialized
      if (!prisma || !prisma.document) {
        console.log('Database not available - skipping document storage')
        return
      }
      
      // Store document metadata
      await prisma.document.create({
        data: {
          id: metadata.id,
          type: metadata.type,
          title: metadata.title,
          uploadDate: metadata.uploadDate,
          fileSize: metadata.fileSize,
          pageCount: metadata.pageCount,
          checksum: metadata.checksum,
          summary: extractedData.summary,
          keyTerms: extractedData.keyTerms,
          confidence: extractedData.confidence,
          propertyId: metadata.propertyId,
          accountNumber: metadata.accountNumber,
          address: metadata.address,
          extractedDates: JSON.stringify(extractedData.dates),
          extractedAmounts: JSON.stringify(extractedData.amounts),
          extractedParties: JSON.stringify(extractedData.parties),
          extractedProperties: JSON.stringify(extractedData.properties)
        }
      })
    } catch (error) {
      // In development, we'll continue without database storage
      if (process.env.NODE_ENV !== 'test') {
        console.error('Error storing document:', error)
      }
    }
  }

  async searchDocuments(query: string, filters?: {
    type?: DocumentMetadata['type']
    propertyId?: string
    dateRange?: { start: Date; end: Date }
    minConfidence?: number
  }): Promise<any[]> {
    try {
      const where: any = {}
      
      if (filters?.type) {
        where.type = filters.type
      }
      
      if (filters?.propertyId) {
        where.propertyId = filters.propertyId
      }
      
      if (filters?.dateRange) {
        where.uploadDate = {
          gte: filters.dateRange.start,
          lte: filters.dateRange.end
        }
      }
      
      if (filters?.minConfidence) {
        where.confidence = { gte: filters.minConfidence }
      }
      
      // Add text search
      if (query) {
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { keyTerms: { hasSome: [query] } }
        ]
      }
      
      const documents = await prisma.document.findMany({
        where,
        orderBy: { uploadDate: 'desc' },
        take: 50
      })
      
      return documents
    } catch (error) {
      console.error('Error searching documents:', error)
      return []
    }
  }

  async linkDocumentToProperty(documentId: string, propertyId: string): Promise<boolean> {
    try {
      await prisma.document.update({
        where: { id: documentId },
        data: { propertyId }
      })
      return true
    } catch (error) {
      console.error('Error linking document to property:', error)
      return false
    }
  }

  // Parse PDF - uses mock for now, real implementation would use pdf-parse
  private async parsePDF(buffer: Buffer): Promise<{ text: string; numpages: number }> {
    // If buffer contains text, use it directly
    const text = buffer.toString('utf8')
    
    // Check if it's already text content (not a real PDF)
    if (text.includes('CITY OF HOUSTON') || text.includes('CONTRACT') || text.includes('DEED')) {
      return {
        text,
        numpages: Math.ceil(text.length / 3000) // Estimate pages
      }
    }
    
    // Otherwise return mock PDF content
    return {
      text: `CITY OF HOUSTON
      Building Permit Application
      
      Permit Number: HP2024-001234
      Issue Date: January 15, 2024
      
      Property Address: 1234 Main Street, Houston, TX 77002
      
      Owner: John Smith
      1234 Main Street
      Houston, TX 77002
      
      Contractor: ABC Construction LLC
      5678 Builder Lane
      Houston, TX 77056
      License: TX-12345
      
      Scope of Work: Construction of single-family residence
      
      Project Value: $450,000
      Permit Fee: $2,500
      
      This permit expires 180 days from issue date.
      
      Approved by: Jane Doe, Plans Examiner
      `,
      numpages: 1
    }
  }
}

export default DocumentProcessingAgent