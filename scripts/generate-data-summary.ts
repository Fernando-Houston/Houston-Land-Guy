import { PrismaClient } from '@prisma/client'
import { dataValidationService } from '../lib/services/data-validation-service'
import { dataRelationshipService } from '../lib/services/data-relationships'
import { getIntegratedData } from '../lib/fernando-x-data'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

interface DataSummary {
  timestamp: string
  totalDataPoints: number
  breakdown: {
    entity: string
    recordCount: number
    fieldsPerRecord: number
    totalFields: number
    sampleRecord?: any
  }[]
  validation: any
  relationships: any
  dataQuality: {
    overallScore: number
    issues: number
    recommendations: string[]
  }
}

async function generateDataSummary(): Promise<DataSummary> {
  console.log('Generating comprehensive data summary...\n')
  
  try {
    // 1. Count all entities
    console.log('1. Counting all database entities...')
    const entityCounts = await countAllEntities()
    
    // 2. Calculate total data points
    console.log('2. Calculating total data points...')
    const breakdown = await calculateDataPointBreakdown()
    const totalDataPoints = breakdown.reduce((sum, item) => sum + item.totalFields, 0)
    
    // 3. Run validation
    console.log('3. Running data validation...')
    const validation = await dataValidationService.validateAllData()
    
    // 4. Get relationship summary
    console.log('4. Analyzing data relationships...')
    const relationships = await dataRelationshipService.getAllRelationshipsSummary()
    
    // 5. Get integrated data stats
    console.log('5. Getting integrated data statistics...')
    const integratedData = await getIntegratedData()
    
    // 6. Generate recommendations
    const recommendations = generateRecommendations(validation, relationships)
    
    const summary: DataSummary = {
      timestamp: new Date().toISOString(),
      totalDataPoints,
      breakdown,
      validation: {
        summary: validation.summary,
        totalIssues: validation.issues.length,
        overallQualityScore: validation.overallQualityScore
      },
      relationships,
      dataQuality: {
        overallScore: validation.overallQualityScore,
        issues: validation.issues.length,
        recommendations
      }
    }
    
    return summary
  } catch (error) {
    console.error('Error generating data summary:', error)
    throw error
  }
}

async function countAllEntities() {
  const counts = await Promise.all([
    prisma.developer.count(),
    prisma.project.count(),
    prisma.permit.count(),
    prisma.neighborhood.count(),
    prisma.demographic.count(),
    prisma.marketData.count(),
    prisma.employer.count(),
    prisma.property.count(),
    prisma.infrastructureProject.count(),
    prisma.economicIndicator.count(),
    prisma.document.count(),
    prisma.hCADProperty.count()
  ])
  
  return {
    developers: counts[0],
    projects: counts[1],
    permits: counts[2],
    neighborhoods: counts[3],
    demographics: counts[4],
    marketData: counts[5],
    employers: counts[6],
    properties: counts[7],
    infrastructureProjects: counts[8],
    economicIndicators: counts[9],
    documents: counts[10],
    hcadProperties: counts[11]
  }
}

async function calculateDataPointBreakdown() {
  const breakdown = []
  
  // Developers
  const developerSample = await prisma.developer.findFirst()
  const developerFields = developerSample ? Object.keys(developerSample).length : 10
  const developerCount = await prisma.developer.count()
  breakdown.push({
    entity: 'Developers',
    recordCount: developerCount,
    fieldsPerRecord: developerFields,
    totalFields: developerCount * developerFields,
    sampleRecord: developerSample
  })
  
  // Projects
  const projectSample = await prisma.project.findFirst()
  const projectFields = projectSample ? Object.keys(projectSample).length : 15
  const projectCount = await prisma.project.count()
  breakdown.push({
    entity: 'Projects',
    recordCount: projectCount,
    fieldsPerRecord: projectFields,
    totalFields: projectCount * projectFields,
    sampleRecord: projectSample
  })
  
  // Permits
  const permitSample = await prisma.permit.findFirst()
  const permitFields = permitSample ? Object.keys(permitSample).length : 12
  const permitCount = await prisma.permit.count()
  breakdown.push({
    entity: 'Permits',
    recordCount: permitCount,
    fieldsPerRecord: permitFields,
    totalFields: permitCount * permitFields,
    sampleRecord: permitSample
  })
  
  // Neighborhoods
  const neighborhoodSample = await prisma.neighborhood.findFirst()
  const neighborhoodFields = neighborhoodSample ? Object.keys(neighborhoodSample).length : 8
  const neighborhoodCount = await prisma.neighborhood.count()
  breakdown.push({
    entity: 'Neighborhoods',
    recordCount: neighborhoodCount,
    fieldsPerRecord: neighborhoodFields,
    totalFields: neighborhoodCount * neighborhoodFields,
    sampleRecord: neighborhoodSample
  })
  
  // Demographics
  const demographicSample = await prisma.demographic.findFirst()
  const demographicFields = demographicSample ? Object.keys(demographicSample).length : 20
  const demographicCount = await prisma.demographic.count()
  breakdown.push({
    entity: 'Demographics',
    recordCount: demographicCount,
    fieldsPerRecord: demographicFields,
    totalFields: demographicCount * demographicFields,
    sampleRecord: demographicSample
  })
  
  // Market Data
  const marketDataSample = await prisma.marketData.findFirst()
  const marketDataFields = marketDataSample ? Object.keys(marketDataSample).length : 15
  const marketDataCount = await prisma.marketData.count()
  breakdown.push({
    entity: 'Market Data',
    recordCount: marketDataCount,
    fieldsPerRecord: marketDataFields,
    totalFields: marketDataCount * marketDataFields,
    sampleRecord: marketDataSample
  })
  
  // Employers
  const employerSample = await prisma.employer.findFirst()
  const employerFields = employerSample ? Object.keys(employerSample).length : 8
  const employerCount = await prisma.employer.count()
  breakdown.push({
    entity: 'Employers',
    recordCount: employerCount,
    fieldsPerRecord: employerFields,
    totalFields: employerCount * employerFields,
    sampleRecord: employerSample
  })
  
  // Properties
  const propertySample = await prisma.property.findFirst()
  const propertyFields = propertySample ? Object.keys(propertySample).length : 25
  const propertyCount = await prisma.property.count()
  breakdown.push({
    entity: 'Properties',
    recordCount: propertyCount,
    fieldsPerRecord: propertyFields,
    totalFields: propertyCount * propertyFields,
    sampleRecord: propertySample
  })
  
  // Infrastructure Projects
  const infraSample = await prisma.infrastructureProject.findFirst()
  const infraFields = infraSample ? Object.keys(infraSample).length : 10
  const infraCount = await prisma.infrastructureProject.count()
  breakdown.push({
    entity: 'Infrastructure Projects',
    recordCount: infraCount,
    fieldsPerRecord: infraFields,
    totalFields: infraCount * infraFields,
    sampleRecord: infraSample
  })
  
  // Economic Indicators
  const econSample = await prisma.economicIndicator.findFirst()
  const econFields = econSample ? Object.keys(econSample).length : 15
  const econCount = await prisma.economicIndicator.count()
  breakdown.push({
    entity: 'Economic Indicators',
    recordCount: econCount,
    fieldsPerRecord: econFields,
    totalFields: econCount * econFields,
    sampleRecord: econSample
  })
  
  // Documents
  const docCount = await prisma.document.count()
  breakdown.push({
    entity: 'Documents',
    recordCount: docCount,
    fieldsPerRecord: 20,
    totalFields: docCount * 20
  })
  
  // HCAD Properties
  const hcadCount = await prisma.hCADProperty.count()
  breakdown.push({
    entity: 'HCAD Properties',
    recordCount: hcadCount,
    fieldsPerRecord: 30,
    totalFields: hcadCount * 30
  })
  
  return breakdown
}

function generateRecommendations(validation: any, relationships: any): string[] {
  const recommendations = []
  
  // Based on validation results
  if (validation.overallQualityScore < 0.8) {
    recommendations.push('Data quality score is below 80%. Review and clean data issues.')
  }
  
  if (validation.issues.length > 100) {
    recommendations.push(`Found ${validation.issues.length} data issues. Prioritize fixing critical relationships.`)
  }
  
  // Based on relationship completeness
  const devProjectCompleteness = parseFloat(relationships.relationships.completeness['developer-project'])
  if (devProjectCompleteness < 90) {
    recommendations.push(`Only ${devProjectCompleteness}% of projects have associated developers. Link orphaned projects.`)
  }
  
  const projectPermitCompleteness = parseFloat(relationships.relationships.completeness['project-permit'])
  if (projectPermitCompleteness < 80) {
    recommendations.push(`Only ${projectPermitCompleteness}% of permits are linked to projects. Review permit assignments.`)
  }
  
  // General recommendations
  recommendations.push('Run weekly data validation to maintain quality.')
  recommendations.push('Set up automated alerts for data anomalies.')
  recommendations.push('Review and update demographic data quarterly.')
  
  return recommendations
}

async function generateReport(summary: DataSummary): Promise<string> {
  let report = '# Houston Development Intelligence - Data Summary Report\n\n'
  report += `Generated: ${new Date(summary.timestamp).toLocaleString()}\n\n`
  
  // Executive Summary
  report += '## Executive Summary\n\n'
  report += `- **Total Data Points**: ${summary.totalDataPoints.toLocaleString()}\n`
  report += `- **Data Quality Score**: ${(summary.dataQuality.overallScore * 100).toFixed(1)}%\n`
  report += `- **Total Issues Found**: ${summary.dataQuality.issues}\n`
  report += `- **System Health**: ${(summary.relationships.healthScore * 100).toFixed(1)}%\n\n`
  
  // Data Breakdown
  report += '## Data Breakdown\n\n'
  report += '| Entity | Records | Fields/Record | Total Fields |\n'
  report += '|--------|---------|---------------|-------------|\n'
  
  summary.breakdown.forEach(item => {
    report += `| ${item.entity} | ${item.recordCount.toLocaleString()} | ${item.fieldsPerRecord} | ${item.totalFields.toLocaleString()} |\n`
  })
  
  report += `\n**Grand Total**: ${summary.totalDataPoints.toLocaleString()} data points\n\n`
  
  // Validation Results
  report += '## Data Validation Results\n\n'
  
  if (summary.validation.summary) {
    for (const [entity, result] of Object.entries(summary.validation.summary)) {
      const r = result as any
      report += `### ${r.entity}\n`
      report += `- Total Records: ${r.totalRecords}\n`
      report += `- Valid: ${r.validRecords} (${((r.validRecords/r.totalRecords)*100).toFixed(1)}%)\n`
      report += `- Invalid: ${r.invalidRecords}\n`
      report += `- Duplicates: ${r.duplicates}\n`
      report += `- Orphaned: ${r.orphanedRecords}\n`
      report += `- Quality Score: ${(r.dataQualityScore * 100).toFixed(1)}%\n\n`
    }
  }
  
  // Relationship Analysis
  report += '## Data Relationships\n\n'
  report += '### Entity Counts\n'
  for (const [entity, count] of Object.entries(summary.relationships.entities)) {
    report += `- ${entity}: ${count}\n`
  }
  
  report += '\n### Relationship Completeness\n'
  for (const [rel, completeness] of Object.entries(summary.relationships.relationships.completeness)) {
    report += `- ${rel}: ${completeness}\n`
  }
  
  // Recommendations
  report += '\n## Recommendations\n\n'
  summary.dataQuality.recommendations.forEach((rec, i) => {
    report += `${i + 1}. ${rec}\n`
  })
  
  // Data Sample
  report += '\n## Sample Records\n\n'
  const samples = summary.breakdown.filter(b => b.sampleRecord).slice(0, 3)
  samples.forEach(sample => {
    report += `### ${sample.entity} Sample\n`
    report += '```json\n'
    report += JSON.stringify(sample.sampleRecord, null, 2)
    report += '\n```\n\n'
  })
  
  return report
}

// Main execution
async function main() {
  try {
    console.log('Houston Development Intelligence - Data Summary Generator\n')
    console.log('=' .repeat(50) + '\n')
    
    // Generate summary
    const summary = await generateDataSummary()
    
    // Generate report
    console.log('\n6. Generating report...')
    const report = await generateReport(summary)
    
    // Save report
    const reportPath = path.join(process.cwd(), 'DATA_SUMMARY_REPORT.md')
    await fs.writeFile(reportPath, report)
    console.log(`\n✅ Report saved to: ${reportPath}`)
    
    // Save JSON summary
    const jsonPath = path.join(process.cwd(), 'data-summary.json')
    await fs.writeFile(jsonPath, JSON.stringify(summary, null, 2))
    console.log(`✅ JSON summary saved to: ${jsonPath}`)
    
    // Print summary to console
    console.log('\n' + '=' .repeat(50))
    console.log('SUMMARY RESULTS')
    console.log('=' .repeat(50))
    console.log(`Total Data Points: ${summary.totalDataPoints.toLocaleString()}`)
    console.log(`Data Quality Score: ${(summary.dataQuality.overallScore * 100).toFixed(1)}%`)
    console.log(`Total Issues: ${summary.dataQuality.issues}`)
    console.log('\nTop Entities by Data Points:')
    
    summary.breakdown
      .sort((a, b) => b.totalFields - a.totalFields)
      .slice(0, 5)
      .forEach(item => {
        console.log(`  - ${item.entity}: ${item.totalFields.toLocaleString()} fields (${item.recordCount} records)`)
      })
    
    console.log('\nRecommendations:')
    summary.dataQuality.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { generateDataSummary, generateReport }