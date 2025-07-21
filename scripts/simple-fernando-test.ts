#!/usr/bin/env npx tsx
// Simple Fernando-X functionality test
import FernandoX from '../lib/fernando-x'

async function testFernandoSimple() {
  console.log('🤖 Simple Fernando-X Database Test\n')
  
  const fernando = new FernandoX()
  
  const testQueries = [
    "How many developers are in Houston?",
    "What properties are available for investment?", 
    "Tell me about Houston neighborhoods",
    "What's the construction activity like?",
    "Show me market trends"
  ]
  
  let passed = 0
  let total = testQueries.length
  
  for (const [i, query] of testQueries.entries()) {
    console.log(`\n${i + 1}. Testing: "${query}"`)
    console.log('─'.repeat(50))
    
    try {
      const response = await fernando.processQuery({ text: query, context: { sessionId: 'test-session' }})
      
      // Check if response is substantive and not an error
      if (response.text && response.text.length > 30 && !response.text.includes('I apologize, but I encountered an error')) {
        console.log('✅ PASSED - Got substantive response')
        console.log(`   Response preview: "${response.text.substring(0, 80)}..."`)
        passed++
      } else {
        console.log('❌ FAILED - Poor or error response')
        console.log(`   Response: "${response.text || JSON.stringify(response)}"`)
      }
      
    } catch (error) {
      console.log('❌ FAILED - Exception thrown')
      console.log(`   Error: ${error.message}`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('🎯 FERNANDO-X TEST RESULTS')
  console.log('='.repeat(50))
  console.log(`✅ Passed: ${passed}/${total} (${Math.round(passed/total*100)}%)`)
  
  if (passed >= 4) {
    console.log('\n🎉 Fernando-X is working well!')
  } else if (passed >= 2) {
    console.log('\n⚠️ Fernando-X has some issues but basic functionality works')
  } else {
    console.log('\n🚨 Fernando-X needs major fixes')
  }
  
  return { passed, total }
}

if (require.main === module) {
  testFernandoSimple()
    .then((result) => {
      process.exit(result.passed >= 3 ? 0 : 1)
    })
    .catch((error) => {
      console.error('💥 Test failed:', error)
      process.exit(1)
    })
}

export { testFernandoSimple }