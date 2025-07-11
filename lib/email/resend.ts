import { Resend } from 'resend'
import { prisma } from '@/lib/db/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

export class EmailService {
  static async sendEmail(template: EmailTemplate) {
    try {
      const { data, error } = await resend.emails.send({
        from: template.from || process.env.EMAIL_FROM || 'Houston Land Guy <noreply@houstonlandguy.com>',
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
        reply_to: template.replyTo
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Email send error:', error)
      throw error
    }
  }

  static async sendWelcomeEmail(lead: any) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f7fafc; }
            .button { background-color: #2b6cb0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Houston Development Intelligence</h1>
            </div>
            <div class="content">
              <h2>Hi ${lead.name || 'there'},</h2>
              <p>Thank you for joining Houston Development Intelligence. We're excited to help you discover the best development opportunities in Houston.</p>
              
              <h3>What's Next?</h3>
              <ul>
                <li>Explore our ROI Calculator to analyze potential investments</li>
                <li>Access exclusive market intelligence reports</li>
                <li>Get personalized recommendations based on your interests</li>
              </ul>
              
              <p>Our team of experts is here to help you succeed in Houston's dynamic real estate market.</p>
              
              <a href="https://houstonlandguy.com/tools/roi-calculator" class="button">Start ROI Analysis</a>
            </div>
            <div class="footer">
              <p>Houston Development Intelligence | houstonlandguy.com</p>
              <p>You're receiving this because you signed up at houstonlandguy.com</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: lead.email,
      subject: 'Welcome to Houston Development Intelligence',
      html,
      text: `Welcome to Houston Development Intelligence! Thank you for joining us. Visit https://houstonlandguy.com to get started.`
    })
  }

  static async sendROIResultsEmail(lead: any, roiData: any) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f7fafc; }
            .results { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .metric:last-child { border-bottom: none; }
            .button { background-color: #2b6cb0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your ROI Analysis Results</h1>
            </div>
            <div class="content">
              <h2>Hi ${lead.name || 'there'},</h2>
              <p>Here are the results of your ROI analysis:</p>
              
              <div class="results">
                <div class="metric">
                  <strong>Total Investment:</strong>
                  <span>$${roiData.totalCost.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <strong>Projected Profit:</strong>
                  <span>$${roiData.projectedProfit.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <strong>ROI Percentage:</strong>
                  <span>${(roiData.roi * 100).toFixed(1)}%</span>
                </div>
                <div class="metric">
                  <strong>Timeline:</strong>
                  <span>${roiData.timeline}</span>
                </div>
              </div>
              
              <h3>Want to maximize your returns?</h3>
              <p>Our experts can help you optimize this investment and identify even better opportunities.</p>
              
              <a href="https://houstonlandguy.com/consultation" class="button">Schedule Free Consultation</a>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: lead.email,
      subject: 'Your Houston Development ROI Analysis',
      html
    })
  }

  static async sendMarketReportEmail(lead: any, reportData: any) {
    const neighborhoods = Object.keys(reportData.data)
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f7fafc; }
            .neighborhood { background-color: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
            .neighborhood h4 { color: #1a365d; margin-bottom: 10px; }
            .stat { display: inline-block; margin-right: 20px; }
            .button { background-color: #2b6cb0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Houston Market Intelligence Report</h1>
            </div>
            <div class="content">
              <h2>Hi ${lead.name || 'there'},</h2>
              <p>Here's your customized market intelligence report for ${neighborhoods.join(', ')}:</p>
              
              ${neighborhoods.map(neighborhood => `
                <div class="neighborhood">
                  <h4>${neighborhood}</h4>
                  <div class="stats">
                    ${reportData.data[neighborhood].permits ? `
                      <div class="stat">
                        <strong>Active Permits:</strong> ${reportData.data[neighborhood].permits.length}
                      </div>
                    ` : ''}
                    ${reportData.data[neighborhood].trends ? `
                      <div class="stat">
                        <strong>Growth Rate:</strong> ${reportData.data[neighborhood].trends.growth}%
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
              
              <p>Want detailed insights and personalized recommendations?</p>
              
              <a href="https://houstonlandguy.com/market-intelligence" class="button">View Full Report</a>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: lead.email,
      subject: `Market Intelligence: ${neighborhoods.join(', ')}`,
      html
    })
  }

  static async processEmailSequence(sequenceId: string) {
    const sequence = await prisma.emailSequence.findUnique({
      where: { id: sequenceId },
      include: { lead: true }
    })

    if (!sequence || sequence.status !== 'PENDING') return

    try {
      // Get template based on templateId
      let emailData
      
      switch (sequence.templateId) {
        case 'roi_welcome':
          emailData = await this.sendWelcomeEmail(sequence.lead)
          break
        case 'roi_tips':
          // TODO: Implement ROI tips email template
          break
        case 'roi_consultation':
          // TODO: Implement consultation offer email template
          break
        default:
          throw new Error(`Unknown template: ${sequence.templateId}`)
      }

      await prisma.emailSequence.update({
        where: { id: sequenceId },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      })

      return emailData
    } catch (error) {
      await prisma.emailSequence.update({
        where: { id: sequenceId },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      })
      throw error
    }
  }
}