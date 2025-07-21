#!/usr/bin/env node
import dotenv from 'dotenv'
import path from 'path'
import { VisualIntelligenceAgent } from '../lib/agents/visual-intelligence-agent-v2'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Test images - replace with actual property images if available
const TEST_IMAGES = {
  property: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
  construction: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
  satellite: 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=800',
  document: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800'
}

async function testReplicateIntegration() {
  console.log('🚀 Testing Replicate Integration for Visual Intelligence Agent\n')
  
  // Check environment variables
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('❌ Error: REPLICATE_API_TOKEN not found in environment variables')
    console.error('Please ensure .env.local contains: REPLICATE_API_TOKEN=your_token_here')
    process.exit(1)
  }
  
  console.log('✅ REPLICATE_API_TOKEN found')
  console.log(`✅ USE_REPLICATE: ${process.env.USE_REPLICATE}`)
  console.log('')
  
  const agent = new VisualIntelligenceAgent()
  
  try {
    // Test 1: Property Photo Analysis
    console.log('📸 Test 1: Analyzing Property Photo...')
    console.log(`Image URL: ${TEST_IMAGES.property}`)
    
    const propertyAnalysis = await agent.analyzePropertyPhoto(TEST_IMAGES.property)
    
    console.log('\n✅ Property Analysis Results:')
    console.log(`- Condition Score: ${propertyAnalysis.conditionScore}/10`)
    console.log(`- Features Found: ${propertyAnalysis.features.join(', ')}`)
    console.log(`- Issues Detected: ${propertyAnalysis.issues.length > 0 ? propertyAnalysis.issues.join(', ') : 'None'}`)
    console.log(`- Renovation Estimate: $${propertyAnalysis.renovationEstimate.toLocaleString()}`)
    console.log(`- Description Preview: ${propertyAnalysis.description.substring(0, 200)}...`)
    
    // Test 2: Construction Detection
    console.log('\n\n🏗️ Test 2: Detecting Construction Activity...')
    console.log(`Image URL: ${TEST_IMAGES.construction}`)
    
    const constructionResult = await agent.detectConstruction(TEST_IMAGES.construction)
    
    console.log('\n✅ Construction Detection Results:')
    console.log(`- Construction Detected: ${constructionResult.hasConstruction ? 'Yes' : 'No'}`)
    console.log(`- Construction Types: ${constructionResult.constructionType.join(', ')}`)
    console.log(`- Equipment Detected: ${constructionResult.equipmentDetected.join(', ')}`)
    console.log(`- Confidence Score: ${(constructionResult.confidenceScore * 100).toFixed(1)}%`)
    
    // Test 3: Satellite Image Analysis
    console.log('\n\n🛰️ Test 3: Analyzing Satellite/Aerial Image...')
    console.log(`Image URL: ${TEST_IMAGES.satellite}`)
    
    const satelliteAnalysis = await agent.analyzeSatelliteImage(TEST_IMAGES.satellite)
    
    console.log('\n✅ Satellite Analysis Results:')
    console.log(`- Land Use: ${satelliteAnalysis.landUse}`)
    console.log(`- Vegetation Coverage: ${satelliteAnalysis.vegetationCoverage}%`)
    console.log(`- Development Stage: ${satelliteAnalysis.developmentStage}`)
    console.log(`- Changes Detected: ${satelliteAnalysis.changesDetected ? 'Yes' : 'No'}`)
    
    // Test 4: Document OCR
    console.log('\n\n📄 Test 4: Extracting Text from Document...')
    console.log(`Image URL: ${TEST_IMAGES.document}`)
    
    const ocrResult = await agent.performDocumentOCR(TEST_IMAGES.document)
    
    console.log('\n✅ OCR Results:')
    console.log(`- Text Length: ${ocrResult.text.length} characters`)
    console.log(`- Text Preview: ${ocrResult.text.substring(0, 200)}...`)
    if (ocrResult.permitNumber) {
      console.log(`- Permit Number: ${ocrResult.permitNumber}`)
    }
    if (ocrResult.issueDate) {
      console.log(`- Issue Date: ${ocrResult.issueDate}`)
    }
    
    // Test 5: Parallel Processing
    console.log('\n\n⚡ Test 5: Testing Parallel Image Processing...')
    console.log('Processing 3 property images in parallel...')
    
    const startTime = Date.now()
    const parallelResults = await agent.processMultipleImages(
      [TEST_IMAGES.property, TEST_IMAGES.construction, TEST_IMAGES.satellite],
      'property'
    )
    const processingTime = Date.now() - startTime
    
    console.log(`\n✅ Processed ${parallelResults.length} images in ${processingTime}ms`)
    console.log(`Average time per image: ${(processingTime / parallelResults.length).toFixed(0)}ms`)
    
    console.log('\n\n✨ All tests completed successfully!')
    console.log('\nNOTE: To enable real Replicate API calls:')
    console.log('1. Ensure REPLICATE_API_TOKEN is set in .env.local')
    console.log('2. Set USE_REPLICATE=true in .env.local')
    console.log('3. Use actual property/construction images for better results')
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error)
    console.error('\nTroubleshooting:')
    console.error('1. Check if REPLICATE_API_TOKEN is correctly set')
    console.error('2. Ensure you have internet connectivity')
    console.error('3. Verify the test image URLs are accessible')
    console.error('4. Check Replicate API status at https://status.replicate.com')
  }
}

// Run the test
testReplicateIntegration().catch(console.error)