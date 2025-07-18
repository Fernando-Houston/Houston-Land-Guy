#!/usr/bin/env node

/**
 * Fernando-X AI Assistant Initialization Script
 * This script sets up the database and generates initial training data
 */

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'houston_development',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
})

async function initializeDatabase() {
  console.log('🔧 Initializing Fernando-X AI Assistant Database...')
  
  try {
    // Check if database exists
    const client = await pool.connect()
    console.log('✅ Database connection established')
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../lib/database/schema.sql')
    if (fs.existsSync(schemaPath)) {
      console.log('📋 Reading database schema...')
      const schema = fs.readFileSync(schemaPath, 'utf8')
      
      // Execute schema (split by semicolon for multiple statements)
      const statements = schema.split(';').filter(stmt => stmt.trim().length > 0)
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await client.query(statement)
          } catch (error) {
            // Ignore errors for existing tables/indexes
            if (!error.message.includes('already exists')) {
              console.warn('⚠️  Schema warning:', error.message)
            }
          }
        }
      }
      
      console.log('✅ Database schema initialized successfully')
    } else {
      console.warn('⚠️  Schema file not found, skipping database initialization')
    }
    
    client.release()
    
  } catch (error) {
    console.error('❌ Database initialization error:', error.message)
    console.log('💡 Make sure PostgreSQL is running and the database exists')
    console.log('   Create database with: createdb houston_development')
    return false
  }
  
  return true
}

async function generateInitialTrainingData() {
  console.log('🤖 Generating initial training data...')
  
  try {
    // Import the training system
    const { initializeTrainingSystem } = require('../lib/services/training-data-collector')
    
    // Initialize the training system
    await initializeTrainingSystem()
    
    console.log('✅ Training data generation completed')
    
  } catch (error) {
    console.error('❌ Training data generation error:', error.message)
    console.log('💡 Check your Perplexity API key and database connection')
    return false
  }
  
  return true
}

async function runHealthChecks() {
  console.log('🏥 Running health checks...')
  
  const checks = []
  
  // Database health check
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT COUNT(*) FROM training_examples')
    const count = parseInt(result.rows[0].count)
    checks.push({
      name: 'Database Connection',
      status: '✅ Healthy',
      details: `${count} training examples in database`
    })
    client.release()
  } catch (error) {
    checks.push({
      name: 'Database Connection',
      status: '❌ Failed',
      details: error.message
    })
  }
  
  // API key check
  checks.push({
    name: 'Perplexity API Key',
    status: process.env.PERPLEXITY_API_KEY ? '✅ Present' : '❌ Missing',
    details: process.env.PERPLEXITY_API_KEY ? 'API key configured' : 'Set PERPLEXITY_API_KEY in .env.local'
  })
  
  // Google Maps API check
  checks.push({
    name: 'Google Maps API Key',
    status: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '✅ Present' : '❌ Missing',
    details: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'API key configured' : 'Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local'
  })
  
  // Print health check results
  console.log('\n📊 Health Check Results:')
  console.log('========================')
  checks.forEach(check => {
    console.log(`${check.name}: ${check.status}`)
    console.log(`   ${check.details}`)
    console.log()
  })
  
  const allHealthy = checks.every(check => check.status.includes('✅'))
  return allHealthy
}

async function generateReport() {
  console.log('📈 Generating initialization report...')
  
  try {
    const client = await pool.connect()
    
    // Get training statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_examples,
        COUNT(CASE WHEN feedback = 'positive' THEN 1 END) as positive_feedback,
        COUNT(CASE WHEN feedback = 'negative' THEN 1 END) as negative_feedback,
        COUNT(CASE WHEN is_synthetic = true THEN 1 END) as synthetic_examples,
        AVG(confidence) as avg_confidence,
        COUNT(DISTINCT intent) as unique_intents
      FROM training_examples
    `
    
    const statsResult = await client.query(statsQuery)
    const stats = statsResult.rows[0]
    
    // Get intent distribution
    const intentQuery = `
      SELECT intent, COUNT(*) as count
      FROM training_examples
      GROUP BY intent
      ORDER BY count DESC
    `
    
    const intentResult = await client.query(intentQuery)
    const intentDistribution = intentResult.rows
    
    client.release()
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      database: {
        total_examples: parseInt(stats.total_examples),
        positive_feedback: parseInt(stats.positive_feedback),
        negative_feedback: parseInt(stats.negative_feedback),
        synthetic_examples: parseInt(stats.synthetic_examples),
        avg_confidence: parseFloat(stats.avg_confidence).toFixed(3),
        unique_intents: parseInt(stats.unique_intents)
      },
      intent_distribution: intentDistribution,
      recommendations: []
    }
    
    // Add recommendations
    if (report.database.avg_confidence < 0.8) {
      report.recommendations.push('Consider adding more high-quality training examples')
    }
    
    if (report.database.unique_intents < 10) {
      report.recommendations.push('Add training data for more diverse intents')
    }
    
    const lowCountIntents = intentDistribution.filter(intent => intent.count < 5)
    if (lowCountIntents.length > 0) {
      report.recommendations.push(`Add more examples for: ${lowCountIntents.map(i => i.intent).join(', ')}`)
    }
    
    // Save report
    const reportPath = path.join(__dirname, '../reports/initialization-report.json')
    const reportDir = path.dirname(reportPath)
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    
    console.log('✅ Initialization report generated')
    console.log(`📄 Report saved to: ${reportPath}`)
    
    // Print summary
    console.log('\n🎯 Summary:')
    console.log('==========')
    console.log(`Total Training Examples: ${report.database.total_examples}`)
    console.log(`Average Confidence: ${(parseFloat(report.database.avg_confidence) * 100).toFixed(1)}%`)
    console.log(`Unique Intents: ${report.database.unique_intents}`)
    console.log(`Synthetic Examples: ${report.database.synthetic_examples}`)
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:')
      report.recommendations.forEach(rec => console.log(`   • ${rec}`))
    }
    
  } catch (error) {
    console.error('❌ Report generation error:', error.message)
  }
}

async function main() {
  console.log('🚀 Fernando-X AI Assistant Initialization')
  console.log('===============================================')
  console.log(`Started at: ${new Date().toISOString()}`)
  console.log()
  
  // Step 1: Initialize database
  const dbInitialized = await initializeDatabase()
  if (!dbInitialized) {
    console.log('❌ Database initialization failed. Please check your PostgreSQL setup.')
    process.exit(1)
  }
  
  // Step 2: Generate training data
  const trainingGenerated = await generateInitialTrainingData()
  if (!trainingGenerated) {
    console.log('⚠️  Training data generation had issues. The assistant will still work with basic functionality.')
  }
  
  // Step 3: Run health checks
  const healthySystem = await runHealthChecks()
  
  // Step 4: Generate report
  await generateReport()
  
  // Final status
  console.log('\n🎉 Initialization Complete!')
  console.log('===========================')
  
  if (healthySystem) {
    console.log('✅ All systems are healthy and ready!')
    console.log('🔗 Access Fernando-X at: /assistant')
    console.log('📊 View training dashboard at: /admin/training-dashboard')
  } else {
    console.log('⚠️  Some systems have issues. Check the health report above.')
  }
  
  console.log('\n🔧 Next Steps:')
  console.log('1. Start the development server: npm run dev')
  console.log('2. Visit Fernando-X to test functionality')
  console.log('3. Monitor training performance in the dashboard')
  console.log('4. Consider setting up continuous learning in production')
  
  // Close database connection
  await pool.end()
}

// Run the initialization
main().catch(error => {
  console.error('❌ Fatal error during initialization:', error)
  process.exit(1)
})