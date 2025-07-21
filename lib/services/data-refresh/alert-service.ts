// Alert Service - Sends notifications for significant market changes
import { MarketChange } from './market-trend-tracker'

export interface AlertConfig {
  email?: string
  webhook?: string
  slackChannel?: string
  minSignificance: 'low' | 'medium' | 'high'
  categories: string[]
}

export interface AlertResult {
  sent: boolean
  channel: 'email' | 'webhook' | 'slack' | 'console'
  timestamp: Date
  error?: string
}

export class AlertService {
  private config: AlertConfig
  
  constructor(config?: AlertConfig) {
    this.config = config || {
      minSignificance: 'medium',
      categories: ['all']
    }
  }
  
  // Send alerts for market changes
  async sendAlerts(changes: MarketChange[]): Promise<AlertResult[]> {
    const results: AlertResult[] = []
    
    // Filter changes based on significance
    const significantChanges = changes.filter(c => 
      this.isSignificantEnough(c.significance)
    )
    
    if (significantChanges.length === 0) {
      return results
    }
    
    // Format alert message
    const alertMessage = this.formatAlertMessage(significantChanges)
    
    // Send through available channels
    if (this.config.email) {
      results.push(await this.sendEmailAlert(alertMessage, significantChanges))
    }
    
    if (this.config.webhook) {
      results.push(await this.sendWebhookAlert(alertMessage, significantChanges))
    }
    
    if (this.config.slackChannel) {
      results.push(await this.sendSlackAlert(alertMessage, significantChanges))
    }
    
    // Always log to console
    results.push(await this.sendConsoleAlert(alertMessage, significantChanges))
    
    return results
  }
  
  // Format alert message
  private formatAlertMessage(changes: MarketChange[]): string {
    const header = `🚨 Houston Real Estate Market Alert - ${changes.length} Significant Changes Detected\n`
    const timestamp = `Generated: ${new Date().toLocaleString()}\n`
    const separator = '━'.repeat(50) + '\n'
    
    let message = header + timestamp + separator
    
    // Group by significance
    const high = changes.filter(c => c.significance === 'high')
    const medium = changes.filter(c => c.significance === 'medium')
    
    if (high.length > 0) {
      message += '\n⚠️  HIGH SIGNIFICANCE CHANGES:\n'
      high.forEach(change => {
        message += this.formatChange(change) + '\n'
      })
    }
    
    if (medium.length > 0) {
      message += '\n📊 MEDIUM SIGNIFICANCE CHANGES:\n'
      medium.forEach(change => {
        message += this.formatChange(change) + '\n'
      })
    }
    
    message += '\n' + separator
    message += 'Access the Houston Development Intelligence platform for detailed analysis.\n'
    
    return message
  }
  
  // Format individual change
  private formatChange(change: MarketChange): string {
    const direction = change.changePercent > 0 ? '📈' : '📉'
    const value = change.currentValue > 1000000 
      ? `$${(change.currentValue / 1000000).toFixed(1)}M` 
      : change.currentValue > 1000 
        ? `$${(change.currentValue / 1000).toFixed(1)}K`
        : `${change.currentValue}`
    
    return `${direction} ${change.metric}: ${value} (${change.changePercent > 0 ? '+' : ''}${change.changePercent.toFixed(1)}%)\n   ${change.description}`
  }
  
  // Send email alert (placeholder - would integrate with email service)
  private async sendEmailAlert(message: string, changes: MarketChange[]): Promise<AlertResult> {
    try {
      // In production, this would use a service like SendGrid or AWS SES
      console.log('📧 Email alert would be sent to:', this.config.email)
      
      return {
        sent: true,
        channel: 'email',
        timestamp: new Date()
      }
    } catch (error) {
      return {
        sent: false,
        channel: 'email',
        timestamp: new Date(),
        error: error.message
      }
    }
  }
  
  // Send webhook alert
  private async sendWebhookAlert(message: string, changes: MarketChange[]): Promise<AlertResult> {
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        alert_type: 'market_change',
        significance: changes[0]?.significance || 'medium',
        change_count: changes.length,
        message,
        changes: changes.map(c => ({
          metric: c.metric,
          previous: c.previousValue,
          current: c.currentValue,
          change_percent: c.changePercent,
          significance: c.significance
        }))
      }
      
      // In production, this would make an actual HTTP request
      console.log('🔔 Webhook alert would be sent to:', this.config.webhook)
      console.log('Payload preview:', JSON.stringify(payload, null, 2).substring(0, 200) + '...')
      
      return {
        sent: true,
        channel: 'webhook',
        timestamp: new Date()
      }
    } catch (error) {
      return {
        sent: false,
        channel: 'webhook',
        timestamp: new Date(),
        error: error.message
      }
    }
  }
  
  // Send Slack alert (placeholder - would integrate with Slack API)
  private async sendSlackAlert(message: string, changes: MarketChange[]): Promise<AlertResult> {
    try {
      // Format for Slack with blocks
      const slackBlocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 Houston Market Alert'
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${changes.length} significant changes detected*`
          }
        }
      ]
      
      // Add top changes
      changes.slice(0, 3).forEach(change => {
        slackBlocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${change.changePercent > 0 ? '📈' : '📉'} *${change.metric}*\n${change.description}`
          }
        })
      })
      
      console.log('💬 Slack alert would be sent to:', this.config.slackChannel)
      
      return {
        sent: true,
        channel: 'slack',
        timestamp: new Date()
      }
    } catch (error) {
      return {
        sent: false,
        channel: 'slack',
        timestamp: new Date(),
        error: error.message
      }
    }
  }
  
  // Send console alert (always available)
  private async sendConsoleAlert(message: string, changes: MarketChange[]): Promise<AlertResult> {
    console.log('\n' + '='.repeat(70))
    console.log(message)
    console.log('='.repeat(70) + '\n')
    
    return {
      sent: true,
      channel: 'console',
      timestamp: new Date()
    }
  }
  
  // Check if change meets significance threshold
  private isSignificantEnough(significance: 'low' | 'medium' | 'high'): boolean {
    const levels = { low: 1, medium: 2, high: 3 }
    return levels[significance] >= levels[this.config.minSignificance]
  }
  
  // Update alert configuration
  updateConfig(config: Partial<AlertConfig>) {
    this.config = { ...this.config, ...config }
  }
}

export const alertService = new AlertService()