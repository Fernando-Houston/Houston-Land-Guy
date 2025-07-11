import { PrismaClient } from '@prisma/client'
import { LeadScoringService } from '../lib/services/lead-scoring'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create sample leads
  const leads = [
    {
      email: 'john.builder@example.com',
      name: 'John Builder',
      phone: '(713) 555-0101',
      company: 'Builder Pro LLC',
      source: 'ROI_CALCULATOR' as const,
      neighborhoods: ['River Oaks', 'Heights'],
      projectTypes: ['SINGLE_FAMILY', 'TOWNHOME'] as const[],
      budgetMin: 500000,
      budgetMax: 1500000,
      timeline: '0-3 months',
      message: 'Looking for infill development opportunities'
    },
    {
      email: 'sarah.investor@example.com',
      name: 'Sarah Investor',
      phone: '(832) 555-0202',
      source: 'MARKET_REPORT' as const,
      neighborhoods: ['Montrose', 'Midtown'],
      projectTypes: ['MULTI_FAMILY', 'MIXED_USE'] as const[],
      budgetMin: 2000000,
      budgetMax: 5000000,
      timeline: '3-6 months'
    },
    {
      email: 'mike.developer@example.com',
      name: 'Mike Developer',
      phone: '(281) 555-0303',
      company: 'Urban Development Partners',
      source: 'HERO_FORM' as const,
      neighborhoods: ['East End', 'Third Ward'],
      projectTypes: ['TOWNHOME', 'CONDO'] as const[],
      budgetMin: 1000000,
      budgetMax: 3000000,
      timeline: 'immediate',
      message: 'Need help with zoning and permits'
    },
    {
      email: 'lisa.contractor@example.com',
      name: 'Lisa Contractor',
      source: 'NEWSLETTER' as const,
      neighborhoods: ['Katy', 'Sugar Land'],
      projectTypes: ['SINGLE_FAMILY'] as const[],
      budgetMin: 300000,
      budgetMax: 800000,
      timeline: '6-12 months'
    },
    {
      email: 'robert.architect@example.com',
      name: 'Robert Architect',
      phone: '(346) 555-0505',
      company: 'Modern Design Studio',
      source: 'CONSULTATION_FORM' as const,
      neighborhoods: ['Museum District', 'Upper Kirby'],
      projectTypes: ['MIXED_USE', 'COMMERCIAL'] as const[],
      budgetMin: 3000000,
      budgetMax: 10000000,
      timeline: '0-3 months',
      message: 'Partnership opportunity for luxury development'
    }
  ]

  // Create leads
  for (const leadData of leads) {
    const lead = await prisma.lead.create({
      data: leadData
    })
    console.log(`✅ Created lead: ${lead.name} (${lead.email})`)

    // Add some interactions
    await prisma.interaction.create({
      data: {
        leadId: lead.id,
        type: 'lead_created',
        details: { source: lead.source, timestamp: new Date().toISOString() }
      }
    })

    // Add calculator results for some leads
    if (leadData.source === 'ROI_CALCULATOR') {
      const calculatorResult = await prisma.calculatorResult.create({
        data: {
          leadId: lead.id,
          calculatorType: 'roi',
          inputs: {
            purchasePrice: 400000,
            renovationCost: 150000,
            holdingPeriod: 12,
            propertyType: 'single_family',
            location: leadData.neighborhoods[0],
            squareFeet: 2500
          },
          roi: 0.35,
          totalCost: 550000,
          projectedProfit: 192500,
          timeline: '12 months',
          risks: [
            { category: 'market', level: 'medium', description: 'Rising interest rates' },
            { category: 'construction', level: 'low', description: 'Material costs stabilizing' }
          ],
          completed: true
        }
      })
      console.log(`  📊 Added ROI calculation for ${lead.name}`)

      await prisma.interaction.create({
        data: {
          leadId: lead.id,
          type: 'tool_used',
          details: { tool: 'roi_calculator', resultId: calculatorResult.id }
        }
      })
    }

    // Update lead score
    await LeadScoringService.updateLeadScore(lead.id)
  }

  // Create sample market data
  const neighborhoods = ['River Oaks', 'Heights', 'Montrose', 'Midtown', 'East End']
  
  for (const neighborhood of neighborhoods) {
    // Permits data
    await prisma.marketData.create({
      data: {
        neighborhood,
        dataType: 'permits',
        data: {
          active: Math.floor(Math.random() * 50) + 10,
          recent: [
            {
              permitNumber: `2024-${Math.random().toString(36).substr(2, 9)}`,
              type: 'New Construction',
              address: `${Math.floor(Math.random() * 9999)} Main St`,
              value: Math.floor(Math.random() * 500000) + 200000,
              issuedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        source: 'seed_data'
      }
    })

    // Trends data
    await prisma.marketData.create({
      data: {
        neighborhood,
        dataType: 'trends',
        data: {
          priceGrowth: (Math.random() * 10 + 5).toFixed(1),
          inventoryLevel: Math.floor(Math.random() * 100) + 50,
          daysOnMarket: Math.floor(Math.random() * 30) + 15,
          demandScore: (Math.random() * 5 + 5).toFixed(1)
        },
        source: 'seed_data'
      }
    })

    // Demographics data
    await prisma.marketData.create({
      data: {
        neighborhood,
        dataType: 'demographics',
        data: {
          population: Math.floor(Math.random() * 50000) + 20000,
          medianIncome: Math.floor(Math.random() * 50000) + 75000,
          medianAge: Math.floor(Math.random() * 10) + 30,
          growthRate: (Math.random() * 3 + 1).toFixed(1)
        },
        source: 'seed_data'
      }
    })

    console.log(`📍 Created market data for ${neighborhood}`)
  }

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })