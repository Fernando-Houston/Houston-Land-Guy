// Comprehensive Fernando-X Training Question Generator
// Creates 20 questions per section based on our Houston data

import { fernandoMemory } from '../lib/fernando-x/memory-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TrainingSection {
  name: string
  description: string
  questions: string[]
  dataSource: string
  priority: number
}

export class ComprehensiveTrainingGenerator {
  
  async generateAllSections(): Promise<void> {
    console.log('🎯 Generating Comprehensive Training Questions (20 per section)')
    
    const sections = [
      await this.generateMarketTrendsQuestions(),
      await this.generateNeighborhoodQuestions(), 
      await this.generateConstructionCostQuestions(),
      await this.generateInvestmentROIQuestions(),
      await this.generatePermitsLegalQuestions(),
      await this.generateSellerAdviceQuestions(),
      await this.generateBuyerGuidanceQuestions(),
      await this.generateDevelopmentQuestions(),
      await this.generateFinancingQuestions(),
      await this.generateConversationalFlowQuestions()
    ]
    
    let totalQuestions = 0
    
    for (const section of sections) {
      console.log(`\n📊 ${section.name} (${section.questions.length} questions)`)
      console.log(`   Data Source: ${section.dataSource}`)
      console.log(`   Priority: ${section.priority}`)
      
      // Display first 5 questions as preview
      console.log('   Sample Questions:')
      section.questions.slice(0, 5).forEach((q, i) => {
        console.log(`   ${i + 1}. ${q}`)
      })
      
      totalQuestions += section.questions.length
    }
    
    console.log(`\n✅ Generated ${totalQuestions} total training questions across ${sections.length} sections`)
    console.log('\n📝 Next Steps:')
    console.log('1. Review and approve questions')
    console.log('2. T3 (you) provides answers using conversation flow')
    console.log('3. Store approved Q&A pairs in database')
    console.log('4. Test enhanced Fernando-X responses')
    
    // Save to file for T3 review
    await this.saveQuestionsForReview(sections)
  }
  
  private async generateMarketTrendsQuestions(): Promise<TrainingSection> {
    // Get real market data for context
    const latestReport = await prisma.harMlsReport.findFirst({
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    })
    
    return {
      name: 'Houston Market Trends & Analytics',
      description: 'Questions about current market conditions, pricing trends, and sales analytics',
      dataSource: 'HAR MLS Reports, Market Metrics',
      priority: 1,
      questions: [
        'What are the current Houston real estate market trends?',
        'How have home prices changed in Houston this year?',
        'Which Houston neighborhoods are seeing the most price appreciation?',
        'Is it a buyer\'s or seller\'s market in Houston right now?',
        'What\'s the average days on market for Houston homes?',
        'How does Houston\'s market compare to other Texas cities?',
        'What price range has the most activity in Houston?',
        'Are luxury homes selling well in Houston?',
        'What\'s driving Houston\'s real estate market growth?',
        'How many homes sold in Houston last month?',
        'What\'s the median home price in Houston?',
        'Are home prices expected to continue rising in Houston?',
        'Which Houston submarkets are performing best?',
        'How has inventory levels changed in Houston?',
        'What\'s the price per square foot trend in Houston?',
        'Are there seasonal patterns in Houston real estate?',
        'How do interest rates affect Houston\'s market?',
        'What\'s the absorption rate in Houston neighborhoods?',
        'Are cash buyers common in Houston?',
        'What market indicators should Houston investors watch?'
      ]
    }
  }
  
  private async generateNeighborhoodQuestions(): Promise<TrainingSection> {
    // Get neighborhood data for context
    const neighborhoods = await prisma.harNeighborhoodData.findMany({
      take: 10,
      orderBy: { totalSales: 'desc' }
    })
    
    return {
      name: 'Neighborhood Analysis & Comparisons',
      description: 'Detailed questions about specific Houston neighborhoods and areas',
      dataSource: 'HAR Neighborhood Data, Demographics, Quality of Life',
      priority: 1,
      questions: [
        'Tell me about The Heights real estate market',
        'How does Montrose compare to River Oaks for investment?',
        'What\'s the best family neighborhood in Houston?',
        'Which Houston neighborhoods have the best schools?',
        'Where should young professionals buy in Houston?',
        'What are the most affordable Houston neighborhoods?',
        'Which areas have the highest rental yields?',
        'Tell me about Katy vs Sugar Land for families',
        'What\'s happening in the Museum District real estate market?',
        'Which Houston neighborhoods are gentrifying?',
        'Where are the best walkable neighborhoods in Houston?',
        'What about Memorial area real estate trends?',
        'Which suburbs offer the best value?',
        'Tell me about Inner Loop vs Outer Loop investing',
        'What neighborhoods have the shortest commutes downtown?',
        'Which areas are seeing new construction?',
        'Where do most tech workers live in Houston?',
        'What about West University vs Bellaire?',
        'Which neighborhoods have the best restaurants and nightlife?',
        'What are the up-and-coming Houston neighborhoods?'
      ]
    }
  }
  
  private async generateConstructionCostQuestions(): Promise<TrainingSection> {
    return {
      name: 'Construction Costs & Building',
      description: 'Questions about construction costs, materials, labor, and building processes',
      dataSource: 'Construction Cost Database, Cost Analysis, ConstructionCostDP5',
      priority: 1,
      questions: [
        'What does it cost to build a house in Houston?',
        'How much are construction materials in Houston?',
        'What are current labor costs for Houston construction?',
        'How much does concrete cost in Houston?',
        'What\'s the cost per square foot for luxury construction?',
        'How do Houston construction costs compare to other cities?',
        'What factors affect construction costs in Houston?',
        'How much extra does it cost to build during hurricane season?',
        'What are typical foundation costs in Houston clay soil?',
        'How much do Houston building permits cost?',
        'What\'s the cost difference between slab and pier foundation?',
        'How much does it cost to build a custom home in River Oaks?',
        'What are commercial construction costs per square foot?',
        'How much do skilled contractors charge in Houston?',
        'What\'s the cost to build a duplex in Houston?',
        'How much have construction costs increased this year?',
        'What\'s the most expensive part of building in Houston?',
        'How long does construction take in Houston?',
        'What are the hidden costs of building in Houston?',
        'How much should I budget for cost overruns?'
      ]
    }
  }
  
  private async generateInvestmentROIQuestions(): Promise<TrainingSection> {
    return {
      name: 'Investment Analysis & ROI',
      description: 'Questions about real estate investment strategies, returns, and analysis',
      dataSource: 'Market Intelligence, ROI Calculations, Investment Metrics',
      priority: 1,
      questions: [
        'What\'s a good ROI for Houston rental properties?',
        'How do I calculate cap rates in Houston?',
        'Which Houston neighborhoods have the best cash flow?',
        'What\'s the average rental yield in Houston?',
        'Should I buy and hold or flip in Houston?',
        'How much money do I need to start investing in Houston?',
        'What are the best Houston properties for first-time investors?',
        'How do I analyze a Houston duplex investment?',
        'What renovation costs should I expect for Houston properties?',
        'Where can I find the best deals in Houston?',
        'How do Houston property taxes affect ROI?',
        'What\'s the 1% rule in Houston real estate?',
        'Should I invest in single-family or multi-family in Houston?',
        'How do I find good tenants in Houston?',
        'What are the best Houston submarkets for appreciation?',
        'How much cash flow should I expect from Houston rentals?',
        'What are the risks of investing in Houston real estate?',
        'How do I evaluate Houston commercial real estate?',
        'What about short-term rental investments in Houston?',
        'How do I build a Houston real estate portfolio?'
      ]
    }
  }
  
  private async generatePermitsLegalQuestions(): Promise<TrainingSection> {
    return {
      name: 'Permits, Legal & Regulations',
      description: 'Questions about building permits, zoning, regulations, and legal requirements',
      dataSource: 'Construction Activity, Permit Database, Legal Requirements',
      priority: 2,
      questions: [
        'What permits do I need to build in Houston?',
        'How long does the Houston permit process take?',
        'What are Houston\'s zoning restrictions?',
        'Do I need a permit for a Houston home addition?',
        'What are Houston\'s building codes?',
        'How much do electrical permits cost in Houston?',
        'What about Houston flood plain regulations?',
        'Do I need permits for Houston bathroom renovations?',
        'What are Houston\'s setback requirements?',
        'How do I get a Houston demolition permit?',
        'What permits are needed for Houston commercial buildings?',
        'What are Houston\'s height restrictions?',
        'Do I need permits for Houston driveway work?',
        'What about Houston historic district regulations?',
        'How do I appeal a Houston permit denial?',
        'What are Houston\'s parking requirements?',
        'Do I need permits for Houston fence installation?',
        'What about Houston business license requirements?',
        'How do Houston deed restrictions work?',
        'What are the penalties for unpermitted Houston work?'
      ]
    }
  }
  
  private async generateSellerAdviceQuestions(): Promise<TrainingSection> {
    return {
      name: 'Seller Guidance & Market Timing',
      description: 'Questions for homeowners looking to sell their Houston properties',
      dataSource: 'HAR MLS Reports, Market Timing Analysis, Seller Metrics',
      priority: 1,
      questions: [
        'Should I sell my Houston house now or wait?',
        'How do I price my Houston home correctly?',
        'What improvements add value to Houston homes?',
        'How long will it take to sell my Houston house?',
        'What are the costs of selling a house in Houston?',
        'Should I use a Houston realtor or sell myself?',
        'What\'s the best time of year to sell in Houston?',
        'How do I prepare my Houston home for sale?',
        'What buyers are looking for in Houston homes?',
        'Should I stage my Houston home?',
        'How do Houston closing costs work?',
        'What about capital gains tax on my Houston home?',
        'Should I sell before buying my next Houston home?',
        'How do I handle multiple offers on my Houston property?',
        'What if my Houston home doesn\'t sell quickly?',
        'Should I consider a Houston cash buyer?',
        'What about selling to a Houston iBuyer?',
        'How do I market my unique Houston property?',
        'What disclosures are required in Houston?',
        'How do I negotiate the best Houston sale price?'
      ]
    }
  }
  
  private async generateBuyerGuidanceQuestions(): Promise<TrainingSection> {
    return {
      name: 'Buyer Guidance & Home Search',
      description: 'Questions for people looking to buy homes in Houston',
      dataSource: 'Market Analysis, Buyer Trends, Property Search',
      priority: 1,
      questions: [
        'How much house can I afford in Houston?',
        'What should first-time buyers know about Houston?',
        'Where should I look for homes in Houston?',
        'How do I get pre-approved for a Houston mortgage?',
        'What are closing costs for Houston buyers?',
        'Should I buy new construction or existing in Houston?',
        'How do I find the right Houston realtor?',
        'What questions should I ask about Houston properties?',
        'How do Houston property taxes work?',
        'What about Houston HOA fees and restrictions?',
        'Should I get a Houston home inspection?',
        'How do I negotiate a Houston home purchase?',
        'What about Houston flood insurance requirements?',
        'How long does it take to close on a Houston home?',
        'Should I buy a fixer-upper in Houston?',
        'What about Houston new home warranties?',
        'How do I research Houston schools and neighborhoods?',
        'What red flags should I watch for in Houston homes?',
        'Should I waive contingencies in Houston\'s market?',
        'How do I handle bidding wars in Houston?'
      ]
    }
  }
  
  private async generateDevelopmentQuestions(): Promise<TrainingSection> {
    return {
      name: 'Development & Land Use',
      description: 'Questions about development projects, land acquisition, and large-scale building',
      dataSource: 'Development Projects, Land Analysis, Zoning Data',
      priority: 2,
      questions: [
        'Is this Houston land suitable for development?',
        'What are Houston\'s development regulations?',
        'How do I research Houston zoning for development?',
        'What are the steps to develop Houston land?',
        'How much does Houston land cost for development?',
        'What about Houston impact fees for development?',
        'How do I get Houston land rezoned?',
        'What are Houston\'s subdivision requirements?',
        'How do I analyze Houston development feasibility?',
        'What permits are needed for Houston subdivisions?',
        'How long does Houston development approval take?',
        'What about Houston utility connections for development?',
        'How do I finance Houston development projects?',
        'What are Houston\'s affordable housing requirements?',
        'Should I partner with Houston developers?',
        'What about Houston environmental impact studies?',
        'How do I market Houston development projects?',
        'What are Houston\'s density restrictions?',
        'How do I handle Houston development opposition?',
        'What exit strategies work for Houston developments?'
      ]
    }
  }
  
  private async generateFinancingQuestions(): Promise<TrainingSection> {
    return {
      name: 'Financing & Lending',
      description: 'Questions about mortgages, loans, and financing options in Houston',
      dataSource: 'Financing Data, Lending Trends, Interest Rates',
      priority: 2,
      questions: [
        'What are current Houston mortgage rates?',
        'Which Houston lenders offer the best rates?',
        'How do I qualify for a Houston jumbo loan?',
        'What about Houston FHA and VA loans?',
        'How do I finance Houston investment properties?',
        'What are Houston down payment assistance programs?',
        'Should I get a fixed or adjustable rate in Houston?',
        'How do I improve my credit for Houston home buying?',
        'What about Houston construction-to-permanent loans?',
        'How do hard money lenders work in Houston?',
        'What are Houston portfolio lender options?',
        'How do I refinance my Houston home?',
        'What about Houston HELOC options?',
        'Should I pay points on my Houston mortgage?',
        'How do I compare Houston lender offers?',
        'What documents do Houston lenders require?',
        'How long does Houston mortgage approval take?',
        'What about Houston private money lenders?',
        'How do I finance Houston fix-and-flip projects?',
        'What are Houston commercial lending options?'
      ]
    }
  }
  
  private async generateConversationalFlowQuestions(): Promise<TrainingSection> {
    return {
      name: 'Conversational Flow & General',
      description: 'Natural conversation starters, greetings, and general Houston real estate questions',
      dataSource: 'Conversational Patterns, User Interactions',
      priority: 1,
      questions: [
        'Hi Fernando, I need help with Houston real estate',
        'What can you tell me about Houston real estate?',
        'I\'m new to Houston, where should I start?',
        'Can you help me understand the Houston market?',
        'I\'m thinking about moving to Houston',
        'What makes Houston a good place to invest?',
        'How is Houston\'s economy affecting real estate?',
        'What should I know about Houston before buying?',
        'Can you compare Houston to other Texas cities?',
        'What are Houston\'s best features for homebuyers?',
        'I heard Houston has no zoning, what does that mean?',
        'How does Houston weather affect real estate?',
        'What about Houston\'s job market and real estate?',
        'Is Houston a good place to raise a family?',
        'What are Houston\'s transportation options?',
        'How diverse is Houston\'s real estate market?',
        'What should I expect from Houston real estate?',
        'Can you explain Houston\'s different areas?',
        'What\'s unique about Houston real estate?',
        'How can I learn more about Houston properties?'
      ]
    }
  }
  
  private async saveQuestionsForReview(sections: TrainingSection[]): Promise<void> {
    const content = `# Fernando-X Training Questions for T3 Review
    
## Instructions for T3 (Human Trainer)
Please provide conversational, data-driven answers for each question using our Houston database. 

**Answer Guidelines:**
- Use natural, conversational tone
- Reference specific data when possible (HAR MLS, construction costs, neighborhood stats)
- Keep answers 2-4 sentences for natural flow
- Include follow-up suggestions when relevant
- Cite data sources (HAR MLS, Construction Database, etc.)

---

${sections.map(section => `
## ${section.name}
**Data Source:** ${section.dataSource}
**Priority:** ${section.priority}
**Description:** ${section.description}

${section.questions.map((q, i) => `
### ${i + 1}. "${q}"
**Your Answer:** [PLEASE PROVIDE CONVERSATIONAL ANSWER USING OUR DATA]

**Suggested Response Format:**
- Start with direct answer
- Include specific Houston data/numbers when available  
- Reference data source
- End with helpful follow-up suggestion

---`).join('')}
`).join('')}

## Next Steps After Completion:
1. Review all answers for accuracy and tone
2. Run: \`npm run tsx scripts/store-reviewed-training-data.ts\`
3. Test enhanced Fernando-X with new training data
4. Monitor conversation quality improvements
`
    
    const fs = require('fs').promises
    await fs.writeFile('./FERNANDO-TRAINING-QUESTIONS-FOR-T3.md', content)
    console.log('\n📝 Questions saved to: FERNANDO-TRAINING-QUESTIONS-FOR-T3.md')
    console.log('👨‍💻 Ready for T3 (human) to provide conversational answers!')
  }
}

async function main() {
  const generator = new ComprehensiveTrainingGenerator()
  await generator.generateAllSections()
  
  console.log('\n🎯 Summary:')
  console.log('✅ 200 comprehensive training questions generated')
  console.log('✅ 10 sections covering all Houston real estate topics')
  console.log('✅ Questions saved for T3 human review and answers')
  console.log('✅ Ready to create conversational training dataset')
  
  process.exit(0)
}

if (require.main === module) {
  main().catch(console.error)
}