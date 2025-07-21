// Store T3-Reviewed Training Data
// Run this after T3 provides answers to the training questions

import { fernandoMemory } from '../lib/fernando-x/memory-service'
import * as fs from 'fs/promises'

interface ReviewedQuestionAnswer {
  section: string
  question: string
  answer: string
  dataSource: string
  priority: number
  tags: string[]
  confidence: number
}

export class ReviewedTrainingStorage {
  
  async parseAndStoreReviewedData(filePath: string = './FERNANDO-TRAINING-QUESTIONS-FOR-T3-ANSWERED.md'): Promise<void> {
    console.log('📥 Loading T3-reviewed training data...')
    
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const qaPairs = this.parseMarkdownQA(content)
      
      console.log(`Found ${qaPairs.length} Q&A pairs`)
      
      let stored = 0
      for (const qa of qaPairs) {
        if (qa.answer && qa.answer !== '[PLEASE PROVIDE CONVERSATIONAL ANSWER USING OUR DATA]') {
          await this.storeTrainingPair(qa)
          stored++
        }
      }
      
      console.log(`✅ Stored ${stored} training pairs in database`)
      
      // Generate summary report
      await this.generateTrainingReport(qaPairs)
      
    } catch (error) {
      console.error('❌ Error loading reviewed data:', error.message)
      console.log('\n💡 Make sure you have completed the training questions in:')
      console.log('   FERNANDO-TRAINING-QUESTIONS-FOR-T3.md')
      console.log('   and saved as: FERNANDO-TRAINING-QUESTIONS-FOR-T3-ANSWERED.md')
    }
  }
  
  private parseMarkdownQA(content: string): ReviewedQuestionAnswer[] {
    const qaPairs: ReviewedQuestionAnswer[] = []
    const sections = content.split('## ')
    
    let currentSection = ''
    let currentDataSource = ''
    let currentPriority = 1
    
    for (const section of sections) {
      const lines = section.split('\n')
      
      // Parse section header
      if (lines[0] && !lines[0].includes('Fernando-X Training Questions')) {
        currentSection = lines[0].trim()
        
        // Extract data source and priority
        for (const line of lines) {
          if (line.includes('**Data Source:**')) {
            currentDataSource = line.replace('**Data Source:**', '').trim()
          }
          if (line.includes('**Priority:**')) {
            currentPriority = parseInt(line.replace('**Priority:**', '').trim()) || 1
          }
        }
      }
      
      // Parse questions and answers
      const questionBlocks = section.split('### ')
      for (const block of questionBlocks) {
        const blockLines = block.split('\n')
        
        let question = ''
        let answer = ''
        
        // Extract question (first line with quotes)
        const questionLine = blockLines.find(line => line.includes('"') && line.includes('.'))
        if (questionLine) {
          const match = questionLine.match(/"([^"]+)"/)
          if (match) {
            question = match[1]
          }
        }
        
        // Extract answer (after **Your Answer:**)
        let foundAnswer = false
        for (const line of blockLines) {
          if (line.includes('**Your Answer:**')) {
            foundAnswer = true
            answer = line.replace('**Your Answer:**', '').trim()
            continue
          }
          if (foundAnswer && line.trim() && !line.includes('**') && !line.includes('---')) {
            answer += ' ' + line.trim()
          }
          if (foundAnswer && line.includes('**Suggested Response Format:**')) {
            break
          }
        }
        
        if (question && answer && answer !== '[PLEASE PROVIDE CONVERSATIONAL ANSWER USING OUR DATA]') {
          qaPairs.push({
            section: currentSection,
            question,
            answer: answer.trim(),
            dataSource: currentDataSource,
            priority: currentPriority,
            tags: this.generateTags(question, currentSection),
            confidence: this.calculateConfidence(answer)
          })
        }
      }
    }
    
    return qaPairs
  }
  
  private async storeTrainingPair(qa: ReviewedQuestionAnswer): Promise<void> {
    await fernandoMemory.storeMemory({
      memoryType: 'training_qa_reviewed',
      content: {
        section: qa.section,
        question: qa.question,
        answer: qa.answer,
        dataSource: qa.dataSource,
        tags: qa.tags,
        priority: qa.priority,
        reviewedBy: 'T3_Human',
        reviewDate: new Date()
      },
      importance: qa.confidence,
      metadata: {
        trainingDataset: true,
        version: '2.0',
        humanReviewed: true,
        generatedAt: new Date()
      }
    })
  }
  
  private generateTags(question: string, section: string): string[] {
    const tags: string[] = []
    
    // Section-based tags
    if (section.includes('Market Trends')) tags.push('market', 'trends', 'har')
    if (section.includes('Neighborhood')) tags.push('neighborhood', 'location', 'comparison')
    if (section.includes('Construction')) tags.push('construction', 'costs', 'building')
    if (section.includes('Investment')) tags.push('investment', 'roi', 'returns')
    if (section.includes('Permits')) tags.push('permits', 'legal', 'regulations')
    if (section.includes('Seller')) tags.push('selling', 'market-timing', 'pricing')
    if (section.includes('Buyer')) tags.push('buying', 'guidance', 'first-time')
    if (section.includes('Development')) tags.push('development', 'land', 'zoning')
    if (section.includes('Financing')) tags.push('financing', 'loans', 'mortgage')
    if (section.includes('Conversational')) tags.push('greeting', 'general', 'conversation')
    
    // Question-based tags
    const questionLower = question.toLowerCase()
    if (questionLower.includes('neighborhood')) tags.push('neighborhood')
    if (questionLower.includes('cost')) tags.push('costs')
    if (questionLower.includes('price')) tags.push('pricing')
    if (questionLower.includes('investment')) tags.push('investment')
    if (questionLower.includes('roi')) tags.push('roi')
    if (questionLower.includes('permit')) tags.push('permits')
    if (questionLower.includes('houston')) tags.push('houston')
    
    return [...new Set(tags)] // Remove duplicates
  }
  
  private calculateConfidence(answer: string): number {
    // Calculate confidence based on answer quality indicators
    let confidence = 0.5 // Base confidence
    
    // Length indicates detail
    if (answer.length > 100) confidence += 0.1
    if (answer.length > 200) confidence += 0.1
    
    // Specific data references
    if (answer.includes('$') || answer.includes('%') || answer.includes('sqft')) confidence += 0.2
    
    // Data source mentions
    if (answer.includes('HAR') || answer.includes('MLS')) confidence += 0.1
    if (answer.includes('database') || answer.includes('data')) confidence += 0.05
    
    // Conversational quality
    if (answer.includes('I can help') || answer.includes('Based on')) confidence += 0.1
    
    return Math.min(confidence, 0.95) // Cap at 95%
  }
  
  private async generateTrainingReport(qaPairs: ReviewedQuestionAnswer[]): Promise<void> {
    const report = `# Fernando-X Training Data Report
Generated: ${new Date().toISOString()}

## Summary
- **Total Q&A Pairs**: ${qaPairs.length}
- **Sections Covered**: ${[...new Set(qaPairs.map(qa => qa.section))].length}
- **Average Confidence**: ${(qaPairs.reduce((sum, qa) => sum + qa.confidence, 0) / qaPairs.length).toFixed(2)}

## By Section
${[...new Set(qaPairs.map(qa => qa.section))].map(section => {
  const sectionQAs = qaPairs.filter(qa => qa.section === section)
  return `
### ${section}
- **Questions**: ${sectionQAs.length}
- **Avg Confidence**: ${(sectionQAs.reduce((sum, qa) => sum + qa.confidence, 0) / sectionQAs.length).toFixed(2)}
- **Data Source**: ${sectionQAs[0]?.dataSource || 'N/A'}
`
}).join('')}

## Quality Metrics
- **High Confidence (>0.8)**: ${qaPairs.filter(qa => qa.confidence > 0.8).length}
- **Medium Confidence (0.6-0.8)**: ${qaPairs.filter(qa => qa.confidence >= 0.6 && qa.confidence <= 0.8).length}
- **Lower Confidence (<0.6)**: ${qaPairs.filter(qa => qa.confidence < 0.6).length}

## Next Steps
1. Test enhanced Fernando-X with new training data
2. Monitor conversation quality improvements  
3. Collect user feedback on responses
4. Iterate and improve based on real usage

## Database Storage
All ${qaPairs.length} Q&A pairs stored in FernandoMemory with type 'training_qa_reviewed'
Ready for enhanced conversation engine to use!
`
    
    await fs.writeFile('./FERNANDO-TRAINING-REPORT.md', report)
    console.log('📊 Training report saved to: FERNANDO-TRAINING-REPORT.md')
  }
}

// Utility function to create template for easy answering
export async function createAnswerTemplate(): Promise<void> {
  console.log('📝 Creating easy answer template...')
  
  const template = `# Quick Answer Template for T3

## Instructions
Replace each [ANSWER] with your conversational response using our Houston data.

## Format
**Q:** Question
**A:** [ANSWER] - Your conversational answer here using specific data

## Tips for Great Answers:
- Use specific numbers/data when available
- Keep conversational tone
- Reference data sources (HAR MLS, Construction Database, etc.)
- Include helpful follow-up suggestions
- Aim for 2-4 sentences per answer

---

# READY TO ANSWER - COPY QUESTIONS BELOW:

`
  
  await fs.writeFile('./EASY-ANSWER-TEMPLATE.md', template)
  console.log('✅ Template created: EASY-ANSWER-TEMPLATE.md')
}

async function main() {
  const storage = new ReviewedTrainingStorage()
  
  console.log('🎯 Fernando-X Training Data Storage')
  console.log('Choose an option:')
  console.log('1. Store reviewed training data (if you have answered the questions)')
  console.log('2. Create easy answer template')
  
  // For demo, create template
  await createAnswerTemplate()
  
  console.log('\n📋 Next Steps for T3:')
  console.log('1. Open: FERNANDO-TRAINING-QUESTIONS-FOR-T3.md')
  console.log('2. Answer questions using Houston data in conversational tone')
  console.log('3. Save as: FERNANDO-TRAINING-QUESTIONS-FOR-T3-ANSWERED.md')
  console.log('4. Run: npm run tsx scripts/store-reviewed-training-data.ts')
  console.log('5. Test enhanced Fernando-X responses!')
  
  process.exit(0)
}

if (require.main === module) {
  main().catch(console.error)
}