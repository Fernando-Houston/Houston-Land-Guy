// Cron Job Manager - Schedules automated data refreshes
import cron from 'node-cron'
import { dataRefreshManager } from './refresh-manager'

export interface CronJobConfig {
  name: string
  schedule: string
  task: () => Promise<void>
  enabled: boolean
}

export class CronManager {
  private jobs: Map<string, cron.ScheduledTask> = new Map()
  
  // Initialize all cron jobs
  async initialize() {
    console.log('🕐 Initializing cron jobs...')
    
    const jobConfigs: CronJobConfig[] = [
      {
        name: 'daily_market_trends',
        schedule: '0 6 * * *', // 6 AM daily
        task: async () => {
          console.log('Running daily market trends refresh...')
          await dataRefreshManager.refreshAllData()
        },
        enabled: true
      },
      {
        name: 'weekly_deep_refresh',
        schedule: '0 2 * * 0', // 2 AM Sunday
        task: async () => {
          console.log('Running weekly deep refresh...')
          await dataRefreshManager.refreshAllData(true) // Force refresh all
        },
        enabled: true
      },
      {
        name: 'hourly_permits_check',
        schedule: '0 * * * *', // Every hour
        task: async () => {
          console.log('Checking for new permits...')
          // This would check for new permits from Houston OpenData
        },
        enabled: false // Disabled by default
      }
    ]
    
    // Schedule all enabled jobs
    for (const config of jobConfigs) {
      if (config.enabled) {
        this.scheduleJob(config)
      }
    }
    
    console.log(`✅ Initialized ${this.jobs.size} cron jobs`)
  }
  
  // Schedule a single job
  private scheduleJob(config: CronJobConfig) {
    if (this.jobs.has(config.name)) {
      console.log(`Job ${config.name} already scheduled, skipping...`)
      return
    }
    
    const job = cron.schedule(config.schedule, config.task, {
      scheduled: true,
      timezone: 'America/Chicago' // Houston timezone
    })
    
    this.jobs.set(config.name, job)
    console.log(`✅ Scheduled job: ${config.name} (${config.schedule})`)
  }
  
  // Stop a job
  stopJob(name: string) {
    const job = this.jobs.get(name)
    if (job) {
      job.stop()
      this.jobs.delete(name)
      console.log(`⏹️  Stopped job: ${name}`)
    }
  }
  
  // Stop all jobs
  stopAll() {
    for (const [name, job] of this.jobs) {
      job.stop()
    }
    this.jobs.clear()
    console.log('⏹️  Stopped all cron jobs')
  }
  
  // Get job status
  getJobStatus(): Array<{ name: string, running: boolean }> {
    const status: Array<{ name: string, running: boolean }> = []
    
    for (const [name, job] of this.jobs) {
      status.push({
        name,
        running: true // node-cron doesn't expose running state directly
      })
    }
    
    return status
  }
}

export const cronManager = new CronManager()

// Auto-initialize if in production
if (process.env.NODE_ENV === 'production') {
  cronManager.initialize().catch(console.error)
}