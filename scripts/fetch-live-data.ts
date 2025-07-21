#!/usr/bin/env node
// Fetch live Houston market data using Perplexity API
import { PrismaClient } from '@prisma/client'
import { queryPerplexity } from '../lib/services/data-intelligence'

const prisma = new PrismaClient()

async function fetchLiveData() {
  console.log('🔍 Houston Development Intelligence - Fetching Live Market Data')
  console.log('===========================================================\n')
  
  try {
    // 1. Test API connection
    console.log('🤖 Testing Perplexity API...')
    const testResponse = await queryPerplexity('What is the current date?')
    console.log('✅ API Connected!\n')
    
    // 2. Fetch current Houston market data
    const queries = [
      {
        query: 'What is the current median home price in Houston Texas by neighborhood in 2025? List the top 10 neighborhoods with prices.',
        category: 'Home Prices'
      },
      {
        query: 'What are the current rental rates for apartments in Houston Texas in 2025? Include average rent for 1BR, 2BR, and 3BR units.',
        category: 'Rental Market'
      },
      {
        query: 'What major real estate development projects were announced in Houston Texas in 2025? Include project names, developers, and investment amounts.',
        category: 'Development Projects'
      },
      {
        query: 'What is the current housing inventory and days on market in Houston Texas? Include data by area if available.',
        category: 'Market Inventory'
      },
      {
        query: 'What are the latest employment and job growth statistics for Houston Texas in 2025?',
        category: 'Employment'
      }
    ]
    
    console.log('📊 Fetching market data...\n')
    
    for (const { query, category } of queries) {
      console.log(`\n🔄 Fetching: ${category}`)
      console.log('─'.repeat(50))
      
      try {
        const response = await queryPerplexity(query)
        console.log(response)
        
        // Extract key numbers from response
        const numbers = response.match(/\$?\d{1,3}(?:,\d{3})*(?:\.\d+)?%?/g) || []
        console.log(`\n📈 Extracted values: ${numbers.slice(0, 5).join(', ')}`)
        
      } catch (error) {
        console.error(`❌ Error fetching ${category}:`, error.message)
      }
    }
    
    // 3. Fetch specific neighborhood data
    console.log('\n\n🏘️  Fetching Neighborhood-Specific Data...')
    console.log('─'.repeat(50))
    
    const neighborhoods = ['River Oaks', 'Heights', 'Montrose', 'Downtown', 'Galleria', 'Memorial']
    
    for (const neighborhood of neighborhoods) {
      console.log(`\n📍 ${neighborhood}:`)
      
      try {
        const query = `What is the current real estate market data for ${neighborhood} Houston Texas? Include median home price, average rent, and market trends.`
        const response = await queryPerplexity(query)
        
        // Show first 200 characters
        console.log(response.substring(0, 200) + '...')
        
      } catch (error) {
        console.error(`Error: ${error.message}`)
      }
    }
    
    console.log('\n\n✅ Live data fetch completed!')
    console.log('\nNote: To store this data in the database, you would need to:')
    console.log('1. Parse the responses to extract structured data')
    console.log('2. Map to appropriate database tables')
    console.log('3. Use the data refresh system to automate this process')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fetchLiveData().catch(console.error)