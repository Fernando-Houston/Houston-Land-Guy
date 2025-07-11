import { prisma } from '@/lib/db/prisma'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  delay: number // hours after lead creation
}

export class LeadNurturingService {
  // Email templates for different lead sources
  private static readonly EMAIL_SEQUENCES: Record<string, EmailTemplate[]> = {
    ROI_CALCULATOR: [
      {
        id: 'roi_welcome',
        name: 'ROI Calculator Welcome',
        subject: 'Your Houston Development ROI Analysis',
        content: 'Thank you for using our ROI calculator...',
        delay: 0 // Immediate
      },
      {
        id: 'roi_tips',
        name: 'ROI Maximization Tips',
        subject: '5 Ways to Improve Your Houston Development ROI',
        content: 'Based on your recent analysis...',
        delay: 48 // 2 days
      },
      {
        id: 'roi_consultation',
        name: 'ROI Consultation Offer',
        subject: 'Free Consultation: Maximize Your Houston Investment',
        content: 'Our experts can help you achieve even better returns...',
        delay: 168 // 7 days
      }
    ],
    MARKET_REPORT: [
      {
        id: 'market_welcome',
        name: 'Market Report Welcome',
        subject: 'Your Houston Market Intelligence Report',
        content: 'Here\'s your personalized market analysis...',
        delay: 0
      },
      {
        id: 'market_trends',
        name: 'Weekly Market Trends',
        subject: 'This Week\'s Houston Development Opportunities',
        content: 'New opportunities in your areas of interest...',
        delay: 168 // Weekly
      }
    ],
    NEWSLETTER: [
      {
        id: 'newsletter_welcome',
        name: 'Newsletter Welcome',
        subject: 'Welcome to Houston Development Intelligence',
        content: 'You\'re now part of our exclusive community...',
        delay: 0
      }
    ]
  }

  static async enrollLeadInSequence(leadId: string, source: string): Promise<void> {
    const sequence = this.EMAIL_SEQUENCES[source]
    if (!sequence) return

    // Create email sequence entries
    for (const template of sequence) {
      const scheduledFor = new Date()
      scheduledFor.setHours(scheduledFor.getHours() + template.delay)

      await prisma.emailSequence.create({
        data: {
          leadId,
          templateId: template.id,
          status: 'PENDING',
          // In production, you'd set scheduledFor and process with a job queue
        }
      })
    }
  }

  static async sendEmail(emailSequenceId: string): Promise<void> {
    const emailSequence = await prisma.emailSequence.findUnique({
      where: { id: emailSequenceId },
      include: { lead: true }
    })

    if (!emailSequence) return

    try {
      // TODO: Integrate with email service (Resend, SendGrid, etc.)
      // For now, we'll just mark it as sent
      
      await prisma.emailSequence.update({
        where: { id: emailSequenceId },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      })

      // Track interaction
      await prisma.interaction.create({
        data: {
          leadId: emailSequence.leadId,
          type: 'email_sent',
          details: {
            templateId: emailSequence.templateId,
            timestamp: new Date().toISOString()
          }
        }
      })
    } catch (error) {
      await prisma.emailSequence.update({
        where: { id: emailSequenceId },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      })
    }
  }

  static async trackEmailOpen(emailSequenceId: string): Promise<void> {
    const emailSequence = await prisma.emailSequence.update({
      where: { id: emailSequenceId },
      data: { openedAt: new Date() }
    })

    await prisma.interaction.create({
      data: {
        leadId: emailSequence.leadId,
        type: 'email_opened',
        details: {
          emailSequenceId,
          timestamp: new Date().toISOString()
        }
      }
    })

    // Update lead score
    const { LeadScoringService } = await import('./lead-scoring')
    await LeadScoringService.updateLeadScore(emailSequence.leadId)
  }

  static async trackEmailClick(emailSequenceId: string): Promise<void> {
    const emailSequence = await prisma.emailSequence.update({
      where: { id: emailSequenceId },
      data: { clickedAt: new Date() }
    })

    await prisma.interaction.create({
      data: {
        leadId: emailSequence.leadId,
        type: 'email_clicked',
        details: {
          emailSequenceId,
          timestamp: new Date().toISOString()
        }
      }
    })

    // Update lead score
    const { LeadScoringService } = await import('./lead-scoring')
    await LeadScoringService.updateLeadScore(emailSequence.leadId)
  }
}