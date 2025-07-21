#!/usr/bin/env npx tsx
// Test Fernando-X training data integration
import { fernandoMemory } from '../lib/fernando-x/memory-service'

async function testFernandoTraining() {
  console.log('🎓 Testing Fernando-X Training Data Integration\n')
  
  // Test queries that should match training data
  const testQueries = [
    "What are Houston property taxes like?",
    "How do I buy a home in Houston?", 
    "What neighborhoods are best for families?",
    "What should I know about Houston flooding?",
    "How much does it cost to build in Houston?"
  ]
  
  let totalMatches = 0
  let goodMatches = 0
  
  for (const [i, query] of testQueries.entries()) {
    console.log(`${i + 1}. Testing: "${query}"`)
    console.log('─'.repeat(60))
    
    try {
      const results = await fernandoMemory.searchTrainingData(query, 2)
      
      if (results.length > 0) {
        totalMatches++
        const topResult = results[0]
        
        console.log(`✅ Found ${results.length} training matches`)
        console.log(`📊 Top match confidence: ${(topResult.confidence * 100).toFixed(1)}%`)
        console.log(`❓ Training question: "${topResult.question}"`)
        console.log(`💡 Answer preview: "${topResult.answer.substring(0, 150)}..."`)
        
        if (topResult.confidence > 0.5) {
          goodMatches++
          console.log(`✅ HIGH CONFIDENCE MATCH - Fernando will use this!`)
        } else {
          console.log(`⚠️ LOW CONFIDENCE - Fernando will try other methods`)
        }
      } else {
        console.log(`❌ No training matches found`)
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`)
    }
    
    console.log('')
  }
  
  console.log('='.repeat(60))
  console.log('🎯 TRAINING DATA TEST RESULTS')
  console.log('='.repeat(60))
  console.log(`📊 Total queries with matches: ${totalMatches}/${testQueries.length}`)
  console.log(`✅ High-confidence matches: ${goodMatches}/${testQueries.length}`)
  console.log(`📈 Success rate: ${Math.round(goodMatches/testQueries.length*100)}%`)
  
  if (goodMatches >= testQueries.length * 0.8) {
    console.log('\n🎉 Fernando-X training integration is EXCELLENT!')
  } else if (goodMatches >= testQueries.length * 0.5) {
    console.log('\n⚠️ Fernando-X training integration is PARTIAL')
  } else {
    console.log('\n🚨 Fernando-X training integration NEEDS WORK')
  }
  
  return { totalMatches, goodMatches, total: testQueries.length }
}

if (require.main === module) {
  testFernandoTraining()
    .then((results) => {
      process.exit(results.goodMatches >= results.total * 0.5 ? 0 : 1)
    })
    .catch((error) => {
      console.error('💥 Test failed:', error)
      process.exit(1)
    })
}

export { testFernandoTraining }