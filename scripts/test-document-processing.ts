import { DocumentProcessingAgent } from '../lib/agents/document-processing-agent'
import { createHash } from 'crypto'

async function testDocumentProcessing() {
  console.log('Testing Document Processing Agent...\n')
  
  const agent = new DocumentProcessingAgent()
  
  try {
    // Test 1: Mock permit document
    console.log('1. Testing permit document processing...')
    const permitText = `CITY OF HOUSTON
    Building Permit Application
    
    Permit Number: HP2024-001234
    Issue Date: January 15, 2024
    Expiration Date: July 14, 2024
    
    Property Address: 1234 Main Street, Houston, TX 77002
    Account Number: 0660640130020
    
    Owner: John Smith
    1234 Main Street
    Houston, TX 77002
    Phone: (713) 555-0100
    
    Contractor: ABC Construction LLC
    5678 Builder Lane
    Houston, TX 77056
    License: TX-12345
    Phone: (713) 555-0200
    
    Scope of Work: Construction of single-family residence. New construction of 2,500 sq ft 
    single-family home with attached 2-car garage. Foundation type: slab on grade. 
    Frame type: wood frame. Roof type: composition shingle.
    
    Project Value: $450,000
    Permit Fee: $2,500
    
    This permit expires 180 days from issue date.
    
    Approved by: Jane Doe, Plans Examiner
    Approval Date: January 15, 2024`
    
    const permitBuffer = Buffer.from(permitText)
    const permitMetadata = {
      id: 'permit-001',
      type: 'permit' as const,
      title: 'Building Permit HP2024-001234',
      uploadDate: new Date(),
      fileSize: permitBuffer.length,
      pageCount: 1,
      checksum: createHash('sha256').update(permitBuffer).digest('hex')
    }
    
    const permitResult = await agent.execute({
      id: 'test-permit',
      type: 'process',
      priority: 1,
      data: {
        action: 'processDocument',
        params: {
          buffer: permitBuffer,
          metadata: permitMetadata
        }
      }
    })
    
    if (permitResult.success) {
      console.log('✓ Permit processed successfully')
      console.log(`  - Dates found: ${permitResult.data.dates.length}`)
      console.log(`  - Amounts found: ${permitResult.data.amounts.length}`)
      console.log(`  - Parties found: ${permitResult.data.parties.length}`)
      console.log(`  - Confidence: ${(permitResult.data.confidence * 100).toFixed(1)}%`)
      console.log(`  - Summary: ${permitResult.data.summary.split('\n')[0]}`)
    }
    
    // Test 2: Extract permit data
    console.log('\n2. Testing permit data extraction...')
    const permitDataResult = await agent.execute({
      id: 'test-permit-extract',
      type: 'extract',
      priority: 1,
      data: {
        action: 'extractPermitData',
        params: {
          text: permitText,
          metadata: permitMetadata
        }
      }
    })
    
    if (permitDataResult.success) {
      const permitData = permitDataResult.data
      console.log('✓ Permit data extracted:')
      console.log(`  - Permit #: ${permitData.permitNumber}`)
      console.log(`  - Type: ${permitData.type}`)
      console.log(`  - Address: ${permitData.address}`)
      console.log(`  - Value: $${permitData.value?.toLocaleString()}`)
      console.log(`  - Owner: ${permitData.owner}`)
      console.log(`  - Contractor: ${permitData.contractor}`)
    }
    
    // Test 3: Mock contract document
    console.log('\n3. Testing contract analysis...')
    const contractText = `RESIDENTIAL PURCHASE AGREEMENT
    
    This Purchase Agreement ("Agreement") is entered into as of March 1, 2024 ("Effective Date")
    
    BETWEEN:
    Seller: Robert Johnson and Mary Johnson
    123 Oak Street, Houston, TX 77008
    
    AND:
    Buyer: Sarah Williams
    456 Pine Avenue, Houston, TX 77006
    
    PROPERTY: The real property located at 789 Elm Drive, Houston, TX 77019 ("Property")
    Legal Description: Lot 12, Block 5, River Oaks Subdivision, Harris County, Texas
    
    PURCHASE PRICE: The total purchase price for the Property is $875,000 (Eight Hundred 
    Seventy-Five Thousand Dollars).
    
    EARNEST MONEY: Buyer shall deposit $25,000 as earnest money within 3 days.
    
    CLOSING DATE: The closing shall occur on or before April 15, 2024.
    
    CONTINGENCIES:
    1. This Agreement is contingent upon Buyer obtaining financing in the amount of $700,000
    2. This Agreement is contingent upon a satisfactory property inspection
    3. This Agreement is contingent upon the Property appraising for at least the purchase price
    
    The Property is being sold in AS-IS condition.
    
    Executed this 1st day of March, 2024.`
    
    const contractResult = await agent.execute({
      id: 'test-contract',
      type: 'analyze',
      priority: 1,
      data: {
        action: 'analyzeContract',
        params: {
          text: contractText
        }
      }
    })
    
    if (contractResult.success) {
      const contractData = contractResult.data
      console.log('✓ Contract analyzed:')
      console.log(`  - Type: ${contractData.type}`)
      console.log(`  - Property: ${contractData.propertyAddress}`)
      console.log(`  - Purchase Price: $${contractData.purchasePrice?.toLocaleString()}`)
      console.log(`  - Parties: ${contractData.parties.length}`)
      console.log(`  - Terms: ${contractData.terms.length}`)
      contractData.terms.slice(0, 3).forEach(term => {
        console.log(`    • ${term}`)
      })
    }
    
    // Test 4: Document classification
    console.log('\n4. Testing document classification...')
    const documents = [
      { text: permitText, expected: 'permit' },
      { text: contractText, expected: 'contract' },
      { 
        text: 'WARRANTY DEED\n\nKnow all men by these presents that John Doe, Grantor, ' +
              'for valuable consideration, does hereby grant, sell and convey unto Jane Doe, Grantee...',
        expected: 'deed'
      },
      {
        text: 'PROPERTY INSPECTION REPORT\n\nInspector: Mike Inspector\n' +
              'Property: 123 Test St\n\nStructural: No deficiencies\nElectrical: Minor issues...',
        expected: 'inspection'
      }
    ]
    
    for (const doc of documents) {
      const classResult = await agent.execute({
        id: 'test-classify',
        type: 'classify',
        priority: 1,
        data: {
          action: 'classifyDocument',
          params: { text: doc.text }
        }
      })
      
      if (classResult.success) {
        const classification = classResult.data
        const correct = classification.type === doc.expected
        console.log(`${correct ? '✓' : '✗'} Classified as ${classification.type} ` +
                   `(confidence: ${(classification.confidence * 100).toFixed(0)}%) ` +
                   `- Expected: ${doc.expected}`)
      }
    }
    
    // Test 5: Key term extraction
    console.log('\n5. Testing key term extraction...')
    const sampleText = `This property is located in a TMU-R zoning district within the 
    City of Houston ETJ. The property is subject to deed restrictions and is located 
    in a TIRZ zone. Harris County Appraisal District values the property at $500,000.`
    
    const keyTerms = agent['extractKeyTerms'](sampleText)
    console.log('✓ Key terms found:')
    keyTerms.forEach(term => console.log(`  - ${term}`))
    
    // Test 6: Property extraction
    console.log('\n6. Testing property extraction...')
    const propertyText = `The subject properties are:
    1. 1234 Main Street, Houston, TX 77002 (Account #0660640130020)
    2. 5678 Westheimer Road, Suite 100, Houston, Texas 77056
    3. 910 Heights Boulevard, Houston, TX 77008 - Legal: Lot 5, Block 12, Heights Addition`
    
    const properties = agent['extractProperties'](propertyText)
    console.log(`✓ Found ${properties.length} properties:`)
    properties.forEach((prop, i) => {
      console.log(`  ${i + 1}. ${prop.address}`)
      if (prop.accountNumber) console.log(`     Account: ${prop.accountNumber}`)
      if (prop.legalDescription) console.log(`     Legal: ${prop.legalDescription}`)
    })
    
  } catch (error) {
    console.error('Error during testing:', error)
  }
}

// Run the test
testDocumentProcessing().catch(console.error)