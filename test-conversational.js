// Test conversational Fernando-X responses
import { conversationalFernando } from './lib/fernando-x/conversational-response.js'

async function testConversationalResponses() {
  console.log('Testing Conversational Fernando-X...\n')
  
  const testCases = [
    {
      message: "I only have $200K to invest",
      sessionId: "test-session-1"
    },
    {
      message: "What else can I do with that budget?",
      sessionId: "test-session-1"
    },
    {
      message: "I'm looking to build a house",
      sessionId: "test-session-2"
    },
    {
      message: "yes please",
      sessionId: "test-session-2"
    },
    {
      message: "Tell me about Katy",
      sessionId: "test-session-3"
    },
    {
      message: "What's the best area for my budget?",
      sessionId: "test-session-4"
    }
  ]
  
  for (const test of testCases) {
    console.log(`USER: ${test.message}`)
    const response = await conversationalFernando.getResponse(test.message, test.sessionId)
    console.log(`FERNANDO: ${response}\n`)
    console.log('---\n')
  }
}

testConversationalResponses().catch(console.error)