#!/usr/bin/env node
// Start the weekly refresh cron jobs
import { cronManager } from '../lib/services/data-refresh/cron-manager'

async function startCronJobs() {
  console.log('🚀 Starting Houston Development Intelligence Cron Jobs')
  console.log('===================================================\n')
  
  try {
    // Initialize cron manager
    await cronManager.initialize()
    
    console.log('\n✅ Cron jobs started successfully!')
    console.log('\n📅 Active Schedule:')
    console.log('  • Monday 6 AM: Housing Inventory & Transactions')
    console.log('  • Wednesday 6 AM: Permits & Development Projects')
    console.log('  • Friday 6 AM: Interest Rates & Rental Market')
    
    console.log('\n💡 To stop cron jobs, run: npm run cron:stop')
    console.log('📊 To check status, run: npm run cron:status')
    
    // Keep process running
    console.log('\n⏳ Cron jobs running... Press Ctrl+C to stop.')
    
  } catch (error) {
    console.error('❌ Error starting cron jobs:', error)
    process.exit(1)
  }
}

startCronJobs().catch(console.error)

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping cron jobs...')
  cronManager.stopAll()
  console.log('✅ Cron jobs stopped.')
  process.exit(0)
})