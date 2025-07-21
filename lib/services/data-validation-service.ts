import { PrismaClient } from '@prisma/client'
import { DataAccuracyAgent } from '../agents/data-accuracy-agent'

const prisma = new PrismaClient()
const dataAccuracyAgent = new DataAccuracyAgent()

interface ValidationResult {
  entity: string
  totalRecords: number
  validRecords: number
  invalidRecords: number
  duplicates: number
  orphanedRecords: number
  crossReferenceIssues: string[]
  dataQualityScore: number
}

interface DataRelationshipIssue {
  type: 'missing_reference' | 'orphaned_record' | 'data_mismatch' | 'duplicate'
  sourceTable: string
  targetTable: string
  recordId: string
  details: string
}

export class DataValidationService {
  private validationResults: Map<string, ValidationResult> = new Map()
  private relationshipIssues: DataRelationshipIssue[] = []
  
  // Validate all imported data
  async validateAllData(): Promise<{
    summary: Record<string, ValidationResult>
    issues: DataRelationshipIssue[]
    overallQualityScore: number
  }> {
    console.log('Starting comprehensive data validation...')
    
    // Validate each data type
    await this.validateDevelopers()
    await this.validateProjects()
    await this.validatePermits()
    await this.validateNeighborhoods()
    await this.validateDemographics()
    await this.validateMarketData()
    await this.validateEmployers()
    await this.validatePropertyData()
    
    // Cross-reference validation
    await this.validateCrossReferences()
    
    // Calculate overall quality score
    const overallQualityScore = this.calculateOverallQualityScore()
    
    return {
      summary: Object.fromEntries(this.validationResults),
      issues: this.relationshipIssues,
      overallQualityScore
    }
  }
  
  // Validate Developers
  private async validateDevelopers(): Promise<void> {
    try {
      const developers = await prisma.developer.findMany({
        include: {
          projects: true
        }
      })
      
      let validCount = 0
      let invalidCount = 0
      let duplicates = 0
      let orphaned = 0
      const issues: string[] = []
      
      // Check for duplicates
      const nameMap = new Map<string, number>()
      
      for (const developer of developers) {
        // Check for duplicate names
        const nameLower = developer.name.toLowerCase()
        if (nameMap.has(nameLower)) {
          duplicates++
          this.relationshipIssues.push({
            type: 'duplicate',
            sourceTable: 'Developer',
            targetTable: 'Developer',
            recordId: developer.id,
            details: `Duplicate developer name: ${developer.name}`
          })
        } else {
          nameMap.set(nameLower, 1)
        }
        
        // Validate required fields
        const validation = await this.validateDeveloperData(developer)
        if (validation.isValid) {
          validCount++
        } else {
          invalidCount++
          issues.push(...validation.issues)
        }
        
        // Check for orphaned developers (no projects)
        if (!developer.projects || developer.projects.length === 0) {
          orphaned++
        }
      }
      
      this.validationResults.set('developers', {
        entity: 'Developers',
        totalRecords: developers.length,
        validRecords: validCount,
        invalidRecords: invalidCount,
        duplicates,
        orphanedRecords: orphaned,
        crossReferenceIssues: issues,
        dataQualityScore: this.calculateQualityScore(validCount, developers.length, duplicates, orphaned)
      })
    } catch (error) {
      console.error('Error validating developers:', error)
    }
  }
  
  // Validate Projects
  private async validateProjects(): Promise<void> {
    try {
      const projects = await prisma.project.findMany({
        include: {
          developer: true,
          permits: true
        }
      })
      
      let validCount = 0
      let invalidCount = 0
      let duplicates = 0
      let orphaned = 0
      const issues: string[] = []
      
      const projectMap = new Map<string, number>()
      
      for (const project of projects) {
        // Check for duplicates
        const projectKey = `${project.name}-${project.address}`.toLowerCase()
        if (projectMap.has(projectKey)) {
          duplicates++
          this.relationshipIssues.push({
            type: 'duplicate',
            sourceTable: 'Project',
            targetTable: 'Project',
            recordId: project.id,
            details: `Duplicate project: ${project.name} at ${project.address}`
          })
        } else {
          projectMap.set(projectKey, 1)
        }
        
        // Validate project data
        const validation = await this.validateProjectData(project)
        if (validation.isValid) {
          validCount++
        } else {
          invalidCount++
          issues.push(...validation.issues)
        }
        
        // Check for missing developer reference
        if (!project.developer) {
          orphaned++
          this.relationshipIssues.push({
            type: 'missing_reference',
            sourceTable: 'Project',
            targetTable: 'Developer',
            recordId: project.id,
            details: `Project "${project.name}" has no associated developer`
          })
        }
      }
      
      this.validationResults.set('projects', {
        entity: 'Projects',
        totalRecords: projects.length,
        validRecords: validCount,
        invalidRecords: invalidCount,
        duplicates,
        orphanedRecords: orphaned,
        crossReferenceIssues: issues,
        dataQualityScore: this.calculateQualityScore(validCount, projects.length, duplicates, orphaned)
      })
    } catch (error) {
      console.error('Error validating projects:', error)
    }
  }
  
  // Validate Permits
  private async validatePermits(): Promise<void> {
    try {
      const permits = await prisma.permit.findMany({
        include: {
          project: true
        }
      })
      
      let validCount = 0
      let invalidCount = 0
      let duplicates = 0
      let orphaned = 0
      const issues: string[] = []
      
      const permitNumbers = new Set<string>()
      
      for (const permit of permits) {
        // Check for duplicate permit numbers
        if (permitNumbers.has(permit.permitNumber)) {
          duplicates++
          this.relationshipIssues.push({
            type: 'duplicate',
            sourceTable: 'Permit',
            targetTable: 'Permit',
            recordId: permit.id,
            details: `Duplicate permit number: ${permit.permitNumber}`
          })
        } else {
          permitNumbers.add(permit.permitNumber)
        }
        
        // Validate permit data
        const validation = await this.validatePermitData(permit)
        if (validation.isValid) {
          validCount++
        } else {
          invalidCount++
          issues.push(...validation.issues)
        }
        
        // Check for orphaned permits
        if (!permit.project) {
          orphaned++
          this.relationshipIssues.push({
            type: 'orphaned_record',
            sourceTable: 'Permit',
            targetTable: 'Project',
            recordId: permit.id,
            details: `Permit ${permit.permitNumber} has no associated project`
          })
        }
      }
      
      this.validationResults.set('permits', {
        entity: 'Permits',
        totalRecords: permits.length,
        validRecords: validCount,
        invalidRecords: invalidCount,
        duplicates,
        orphanedRecords: orphaned,
        crossReferenceIssues: issues,
        dataQualityScore: this.calculateQualityScore(validCount, permits.length, duplicates, orphaned)
      })
    } catch (error) {
      console.error('Error validating permits:', error)
    }
  }
  
  // Validate Neighborhoods
  private async validateNeighborhoods(): Promise<void> {
    try {
      const neighborhoods = await prisma.neighborhood.findMany({
        include: {
          demographics: true,
          marketData: true
        }
      })
      
      let validCount = 0
      let invalidCount = 0
      let missingDemographics = 0
      let missingMarketData = 0
      const issues: string[] = []
      
      for (const neighborhood of neighborhoods) {
        // Validate neighborhood data
        const validation = await this.validateNeighborhoodData(neighborhood)
        if (validation.isValid) {
          validCount++
        } else {
          invalidCount++
          issues.push(...validation.issues)
        }
        
        // Check for missing demographics
        if (!neighborhood.demographics || neighborhood.demographics.length === 0) {
          missingDemographics++
          issues.push(`Neighborhood "${neighborhood.name}" has no demographic data`)
        }
        
        // Check for missing market data
        if (!neighborhood.marketData || neighborhood.marketData.length === 0) {
          missingMarketData++
          issues.push(`Neighborhood "${neighborhood.name}" has no market data`)
        }
      }
      
      this.validationResults.set('neighborhoods', {
        entity: 'Neighborhoods',
        totalRecords: neighborhoods.length,
        validRecords: validCount,
        invalidRecords: invalidCount,
        duplicates: 0,
        orphanedRecords: missingDemographics + missingMarketData,
        crossReferenceIssues: issues,
        dataQualityScore: this.calculateQualityScore(validCount, neighborhoods.length, 0, missingDemographics + missingMarketData)
      })
    } catch (error) {
      console.error('Error validating neighborhoods:', error)
    }
  }
  
  // Validate Demographics
  private async validateDemographics(): Promise<void> {
    try {
      const demographics = await prisma.demographic.findMany({
        include: {
          neighborhood: true
        }
      })
      
      let validCount = 0
      let invalidCount = 0
      let orphaned = 0
      const issues: string[] = []
      
      for (const demo of demographics) {
        // Validate demographic data
        const validation = await this.validateDemographicData(demo)
        if (validation.isValid) {
          validCount++
        } else {
          invalidCount++
          issues.push(...validation.issues)
        }
        
        // Check for orphaned demographics
        if (!demo.neighborhood) {
          orphaned++
          this.relationshipIssues.push({
            type: 'orphaned_record',
            sourceTable: 'Demographic',
            targetTable: 'Neighborhood',
            recordId: demo.id,
            details: `Demographic record has no associated neighborhood`
          })
        }
        
        // Validate data ranges
        if (demo.population && demo.population < 0) {
          issues.push(`Invalid population value: ${demo.population}`)
        }
        if (demo.medianIncome && demo.medianIncome < 0) {
          issues.push(`Invalid median income: ${demo.medianIncome}`)
        }
      }
      
      this.validationResults.set('demographics', {
        entity: 'Demographics',
        totalRecords: demographics.length,
        validRecords: validCount,
        invalidRecords: invalidCount,
        duplicates: 0,
        orphanedRecords: orphaned,
        crossReferenceIssues: issues,
        dataQualityScore: this.calculateQualityScore(validCount, demographics.length, 0, orphaned)
      })
    } catch (error) {
      console.error('Error validating demographics:', error)
    }
  }
  
  // Validate Market Data
  private async validateMarketData(): Promise<void> {
    try {
      const marketData = await prisma.marketData.findMany({
        include: {
          neighborhood: true
        }
      })
      
      let validCount = 0
      let invalidCount = 0
      let orphaned = 0
      let anomalies = 0
      const issues: string[] = []
      
      for (const market of marketData) {
        // Validate market data
        const validation = await this.validateMarketDataRecord(market)
        if (validation.isValid) {
          validCount++
        } else {
          invalidCount++
          issues.push(...validation.issues)
        }
        
        // Check for orphaned market data
        if (!market.neighborhood) {
          orphaned++
          this.relationshipIssues.push({
            type: 'orphaned_record',
            sourceTable: 'MarketData',
            targetTable: 'Neighborhood',
            recordId: market.id,
            details: `Market data record has no associated neighborhood`
          })
        }
        
        // Detect anomalies using Data Accuracy Agent
        const anomalyCheck = await dataAccuracyAgent.execute({
          action: 'detectAnomalies',
          params: {
            dataset: [market],
            field: 'medianPrice'
          }
        })
        
        if (anomalyCheck.length > 0) {
          anomalies++
          issues.push(`Price anomaly detected: ${market.medianPrice}`)
        }
      }
      
      this.validationResults.set('marketData', {
        entity: 'Market Data',
        totalRecords: marketData.length,
        validRecords: validCount,
        invalidRecords: invalidCount,
        duplicates: 0,
        orphanedRecords: orphaned,
        crossReferenceIssues: issues,
        dataQualityScore: this.calculateQualityScore(validCount, marketData.length, 0, orphaned + anomalies)
      })
    } catch (error) {
      console.error('Error validating market data:', error)
    }
  }
  
  // Validate Employers
  private async validateEmployers(): Promise<void> {
    try {
      const employers = await prisma.employer.findMany()
      
      let validCount = 0
      let invalidCount = 0
      const issues: string[] = []
      
      for (const employer of employers) {
        // Validate employer data
        if (employer.name && employer.employeeCount && employer.employeeCount > 0) {
          validCount++
        } else {
          invalidCount++
          if (!employer.name) issues.push(`Employer ${employer.id} missing name`)
          if (!employer.employeeCount || employer.employeeCount <= 0) {
            issues.push(`Employer ${employer.name} has invalid employee count`)
          }
        }
        
        // Validate industry classification
        if (!employer.industry) {
          issues.push(`Employer ${employer.name} missing industry classification`)
        }
      }
      
      this.validationResults.set('employers', {
        entity: 'Employers',
        totalRecords: employers.length,
        validRecords: validCount,
        invalidRecords: invalidCount,
        duplicates: 0,
        orphanedRecords: 0,
        crossReferenceIssues: issues,
        dataQualityScore: this.calculateQualityScore(validCount, employers.length, 0, 0)
      })
    } catch (error) {
      console.error('Error validating employers:', error)
    }
  }
  
  // Validate Property Data
  private async validatePropertyData(): Promise<void> {
    try {
      const properties = await prisma.property.findMany()
      
      let validCount = 0
      let invalidCount = 0
      let duplicates = 0
      const issues: string[] = []
      
      const addressMap = new Map<string, number>()
      
      for (const property of properties) {
        // Check for duplicate addresses
        const addressKey = `${property.address}-${property.city}-${property.zipCode}`.toLowerCase()
        if (addressMap.has(addressKey)) {
          duplicates++
          this.relationshipIssues.push({
            type: 'duplicate',
            sourceTable: 'Property',
            targetTable: 'Property',
            recordId: property.id,
            details: `Duplicate property address: ${property.address}`
          })
        } else {
          addressMap.set(addressKey, 1)
        }
        
        // Validate property data
        const validation = await dataAccuracyAgent.execute({
          action: 'validateProperty',
          params: {
            propertyData: {
              marketValue: property.marketValue,
              buildingArea: property.buildingArea,
              yearBuilt: property.yearBuilt,
              zipCode: property.zipCode
            }
          }
        })
        
        if (validation.overallValid) {
          validCount++
        } else {
          invalidCount++
          validation.validations.forEach((v: any) => {
            if (!v.isValid) {
              issues.push(`Property ${property.id}: ${v.issues.join(', ')}`)
            }
          })
        }
      }
      
      this.validationResults.set('properties', {
        entity: 'Properties',
        totalRecords: properties.length,
        validRecords: validCount,
        invalidRecords: invalidCount,
        duplicates,
        orphanedRecords: 0,
        crossReferenceIssues: issues,
        dataQualityScore: this.calculateQualityScore(validCount, properties.length, duplicates, 0)
      })
    } catch (error) {
      console.error('Error validating properties:', error)
    }
  }
  
  // Cross-reference validation
  private async validateCrossReferences(): Promise<void> {
    // Validate Developer -> Project relationships
    const projectsWithoutDeveloper = await prisma.project.count({
      where: { developerId: null }
    })
    
    if (projectsWithoutDeveloper > 0) {
      this.relationshipIssues.push({
        type: 'missing_reference',
        sourceTable: 'Project',
        targetTable: 'Developer',
        recordId: 'multiple',
        details: `${projectsWithoutDeveloper} projects have no associated developer`
      })
    }
    
    // Validate Project -> Permit relationships
    const permitsWithoutProject = await prisma.permit.count({
      where: { projectId: null }
    })
    
    if (permitsWithoutProject > 0) {
      this.relationshipIssues.push({
        type: 'missing_reference',
        sourceTable: 'Permit',
        targetTable: 'Project',
        recordId: 'multiple',
        details: `${permitsWithoutProject} permits have no associated project`
      })
    }
    
    // Validate Neighborhood -> Demographics relationships
    const demographicsWithoutNeighborhood = await prisma.demographic.count({
      where: { neighborhoodId: null }
    })
    
    if (demographicsWithoutNeighborhood > 0) {
      this.relationshipIssues.push({
        type: 'missing_reference',
        sourceTable: 'Demographic',
        targetTable: 'Neighborhood',
        recordId: 'multiple',
        details: `${demographicsWithoutNeighborhood} demographic records have no neighborhood`
      })
    }
    
    // Validate data consistency
    await this.validateDataConsistency()
  }
  
  // Validate data consistency across tables
  private async validateDataConsistency(): Promise<void> {
    // Check if project values match permit values
    const projects = await prisma.project.findMany({
      include: { permits: true }
    })
    
    for (const project of projects) {
      if (project.permits && project.permits.length > 0) {
        const totalPermitValue = project.permits.reduce((sum, permit) => 
          sum + (permit.value || 0), 0
        )
        
        if (project.value && Math.abs(project.value - totalPermitValue) > project.value * 0.1) {
          this.relationshipIssues.push({
            type: 'data_mismatch',
            sourceTable: 'Project',
            targetTable: 'Permit',
            recordId: project.id,
            details: `Project value ($${project.value}) differs significantly from total permit values ($${totalPermitValue})`
          })
        }
      }
    }
  }
  
  // Helper validation methods
  private async validateDeveloperData(developer: any): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = []
    
    if (!developer.name || developer.name.trim().length === 0) {
      issues.push('Missing developer name')
    }
    
    if (!developer.type) {
      issues.push('Missing developer type')
    }
    
    if (developer.projectCount && developer.projectCount < 0) {
      issues.push('Invalid project count')
    }
    
    return { isValid: issues.length === 0, issues }
  }
  
  private async validateProjectData(project: any): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = []
    
    if (!project.name || project.name.trim().length === 0) {
      issues.push('Missing project name')
    }
    
    if (!project.type) {
      issues.push('Missing project type')
    }
    
    if (!project.status) {
      issues.push('Missing project status')
    }
    
    if (project.value && project.value < 0) {
      issues.push('Invalid project value')
    }
    
    if (!project.address) {
      issues.push('Missing project address')
    }
    
    return { isValid: issues.length === 0, issues }
  }
  
  private async validatePermitData(permit: any): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = []
    
    if (!permit.permitNumber) {
      issues.push('Missing permit number')
    }
    
    if (!permit.type) {
      issues.push('Missing permit type')
    }
    
    if (!permit.status) {
      issues.push('Missing permit status')
    }
    
    if (permit.value && permit.value < 0) {
      issues.push('Invalid permit value')
    }
    
    return { isValid: issues.length === 0, issues }
  }
  
  private async validateNeighborhoodData(neighborhood: any): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = []
    
    if (!neighborhood.name) {
      issues.push('Missing neighborhood name')
    }
    
    if (!neighborhood.boundaries) {
      issues.push('Missing neighborhood boundaries')
    }
    
    return { isValid: issues.length === 0, issues }
  }
  
  private async validateDemographicData(demographic: any): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = []
    
    if (!demographic.year) {
      issues.push('Missing demographic year')
    }
    
    if (demographic.population && demographic.population < 0) {
      issues.push('Invalid population value')
    }
    
    if (demographic.medianIncome && demographic.medianIncome < 0) {
      issues.push('Invalid median income')
    }
    
    return { isValid: issues.length === 0, issues }
  }
  
  private async validateMarketDataRecord(market: any): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = []
    
    if (!market.date) {
      issues.push('Missing market data date')
    }
    
    if (market.medianPrice && market.medianPrice < 0) {
      issues.push('Invalid median price')
    }
    
    if (market.inventoryMonths && market.inventoryMonths < 0) {
      issues.push('Invalid inventory months')
    }
    
    return { isValid: issues.length === 0, issues }
  }
  
  // Calculate quality score for an entity
  private calculateQualityScore(valid: number, total: number, duplicates: number, orphaned: number): number {
    if (total === 0) return 0
    
    const validRatio = valid / total
    const duplicateRatio = duplicates / total
    const orphanedRatio = orphaned / total
    
    // Quality score formula: 70% valid records, 15% penalty for duplicates, 15% penalty for orphans
    const score = (validRatio * 0.7) - (duplicateRatio * 0.15) - (orphanedRatio * 0.15)
    
    return Math.max(0, Math.min(1, score))
  }
  
  // Calculate overall quality score
  private calculateOverallQualityScore(): number {
    const scores = Array.from(this.validationResults.values()).map(r => r.dataQualityScore)
    
    if (scores.length === 0) return 0
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length
  }
  
  // Generate validation report
  async generateValidationReport(): Promise<string> {
    const results = await this.validateAllData()
    
    let report = '# Data Validation Report\n\n'
    report += `Generated: ${new Date().toISOString()}\n\n`
    report += `## Overall Data Quality Score: ${(results.overallQualityScore * 100).toFixed(1)}%\n\n`
    
    // Summary table
    report += '## Entity Summary\n\n'
    report += '| Entity | Total | Valid | Invalid | Duplicates | Orphaned | Quality Score |\n'
    report += '|--------|-------|-------|---------|------------|----------|---------------|\n'
    
    for (const [key, result] of Object.entries(results.summary)) {
      report += `| ${result.entity} | ${result.totalRecords} | ${result.validRecords} | `
      report += `${result.invalidRecords} | ${result.duplicates} | ${result.orphanedRecords} | `
      report += `${(result.dataQualityScore * 100).toFixed(1)}% |\n`
    }
    
    // Issues section
    if (results.issues.length > 0) {
      report += '\n## Relationship Issues\n\n'
      
      const issuesByType = results.issues.reduce((acc, issue) => {
        if (!acc[issue.type]) acc[issue.type] = []
        acc[issue.type].push(issue)
        return acc
      }, {} as Record<string, DataRelationshipIssue[]>)
      
      for (const [type, issues] of Object.entries(issuesByType)) {
        report += `### ${type.replace('_', ' ').toUpperCase()}\n\n`
        issues.slice(0, 10).forEach(issue => {
          report += `- ${issue.details}\n`
        })
        if (issues.length > 10) {
          report += `- ... and ${issues.length - 10} more\n`
        }
        report += '\n'
      }
    }
    
    return report
  }
}

export const dataValidationService = new DataValidationService()