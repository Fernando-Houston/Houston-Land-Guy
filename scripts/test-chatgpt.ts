// Test ChatGPT integration
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') })

import { chatGPTEngine } from '../lib/fernando-x/chatgpt-engine'

async function testChatGPT() {
  console.log('Testing ChatGPT integration...\n')
  
  const testMessages = [
    {
      message: "I only have $200K to invest in Houston real estate",
      sessionId: "test-session-1"
    },
    {
      message: "What areas would you recommend for that budget?",
      sessionId: "test-session-1",
      history: [
        { role: 'user', content: "I only have $200K to invest in Houston real estate" },
        { role: 'assistant', content: "With $200K, you have several good options in Houston..." }
      ]
    },
    {
      message: "Tell me about building costs in Houston",
      sessionId: "test-session-2"
    }
  ]
  
  for (const test of testMessages) {
    console.log(`\nUSER: ${test.message}`)
    console.log('---')
    
    try {
      const response = await chatGPTEngine.generateResponse(
        test.message,
        test.sessionId,
        test.history || []
      )
      
      console.log(`FERNANDO (ChatGPT): ${response.response}`)
      console.log(`\nConfidence: ${response.confidence}`)
      console.log(`Sources: ${response.sources.join(', ')}`)
      
      if (response.suggestedActions && response.suggestedActions.length > 0) {
        console.log('\nSuggested Actions:')
        response.suggestedActions.forEach(action => {
          console.log(`- ${action.label}: ${action.action}`)
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
    
    console.log('\n' + '='.repeat(80))
  }
}

// Run the test
testChatGPT().catch(console.error)