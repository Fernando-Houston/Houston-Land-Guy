import { NextResponse } from 'next/server'
import { processServerQuery } from '@/lib/fernando-x/server-processor'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('🌐 API: Fernando-X request received:', {
      text: body.text,
      hasImages: !!body.images,
      sessionId: body.context?.sessionId,
      chatGPTEnabled: !!process.env.OPENAI_API_KEY,
      apiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'NOT SET'
    })
    
    // Process query on server side
    const response = await processServerQuery({
      text: body.text,
      voice: body.voice,
      images: body.images,
      context: body.context
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Fernando-X API error:', error)
    return NextResponse.json(
      { 
        text: "I apologize, I'm having technical difficulties. Please try again or ask a different question.",
        confidence: 0.5,
        sources: ['Error Handler']
      },
      { status: 500 }
    )
  }
}