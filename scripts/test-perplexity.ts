#!/usr/bin/env node
// Test Perplexity API directly
import fetch from 'node-fetch'

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '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'

async function testPerplexityAPI() {
  console.log('🧪 Testing Perplexity API...\n')
  
  const models = [
    'sonar',
    'sonar-reasoning',
    'sonar-deep-research'
  ]
  
  for (const model of models) {
    console.log(`Testing model: ${model}`)
    
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'What is the current median home price in Houston, Texas?'
            }
          ],
          temperature: 0.2,
          max_tokens: 100
        }),
      })
      
      const responseText = await response.text()
      
      if (response.ok) {
        console.log('✅ Success!')
        const data = JSON.parse(responseText)
        console.log('Response:', data.choices[0].message.content.substring(0, 100) + '...\n')
        break
      } else {
        console.log(`❌ Error ${response.status}: ${responseText}\n`)
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`)
    }
  }
}

testPerplexityAPI().catch(console.error)