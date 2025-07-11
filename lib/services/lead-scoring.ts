import { prisma } from '@/lib/db/prisma'

interface ScoringFactors {
  baseScore: number
  interactionScore: number
  engagementScore: number
  intentScore: number
  budgetScore: number
}

export class LeadScoringService {
  private static readonly SCORING_WEIGHTS = {
    EMAIL_OPENED: 5,
    EMAIL_CLICKED: 10,
    TOOL_USED: 15,
    FORM_SUBMITTED: 20,
    CONSULTATION_SCHEDULED: 30,
    MULTIPLE_TOOLS_USED: 25,
    HIGH_BUDGET: 20,
    URGENT_TIMELINE: 15,
  }

  static async calculateLeadScore(leadId: string): Promise<number> {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        interactions: true,
        calculatorResults: true,
      }
    })

    if (!lead) return 0

    const factors = this.calculateScoringFactors(lead)
    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0)
    
    // Cap at 100
    return Math.min(totalScore, 100)
  }

  private static calculateScoringFactors(lead: any): ScoringFactors {
    const factors: ScoringFactors = {
      baseScore: 10, // Base score for creating a lead
      interactionScore: 0,
      engagementScore: 0,
      intentScore: 0,
      budgetScore: 0,
    }

    // Interaction scoring
    const interactionTypes = lead.interactions.map((i: any) => i.type)
    
    if (interactionTypes.includes('email_opened')) {
      factors.interactionScore += this.SCORING_WEIGHTS.EMAIL_OPENED
    }
    
    if (interactionTypes.includes('email_clicked')) {
      factors.interactionScore += this.SCORING_WEIGHTS.EMAIL_CLICKED
    }
    
    if (interactionTypes.includes('tool_used')) {
      factors.interactionScore += this.SCORING_WEIGHTS.TOOL_USED
    }
    
    if (interactionTypes.includes('consultation_scheduled')) {
      factors.interactionScore += this.SCORING_WEIGHTS.CONSULTATION_SCHEDULED
    }

    // Engagement scoring (multiple tool usage)
    if (lead.calculatorResults.length > 1) {
      factors.engagementScore += this.SCORING_WEIGHTS.MULTIPLE_TOOLS_USED
    }

    // Intent scoring based on timeline
    if (lead.timeline === 'immediate' || lead.timeline === '0-3 months') {
      factors.intentScore += this.SCORING_WEIGHTS.URGENT_TIMELINE
    }

    // Budget scoring
    if (lead.budgetMax && lead.budgetMax > 1000000) {
      factors.budgetScore += this.SCORING_WEIGHTS.HIGH_BUDGET
    }

    return factors
  }

  static async updateLeadScore(leadId: string): Promise<void> {
    const score = await this.calculateLeadScore(leadId)
    
    await prisma.lead.update({
      where: { id: leadId },
      data: { score }
    })
  }

  static async qualifyLead(leadId: string): Promise<boolean> {
    const score = await this.calculateLeadScore(leadId)
    
    // Qualify if score is above 50
    if (score > 50) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { 
          status: 'QUALIFIED',
          score 
        }
      })
      
      return true
    }
    
    return false
  }
}