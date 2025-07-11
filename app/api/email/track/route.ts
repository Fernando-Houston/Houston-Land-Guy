import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { LeadScoringService } from '@/lib/services/lead-scoring'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sequenceId = searchParams.get('id')
    const action = searchParams.get('action')
    
    if (!sequenceId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    
    const sequence = await prisma.emailSequence.findUnique({
      where: { id: sequenceId }
    })
    
    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })
    }
    
    switch (action) {
      case 'open':
        if (!sequence.openedAt) {
          await prisma.emailSequence.update({
            where: { id: sequenceId },
            data: { openedAt: new Date() }
          })
          
          await prisma.interaction.create({
            data: {
              leadId: sequence.leadId,
              type: 'email_opened',
              details: { sequenceId, timestamp: new Date().toISOString() }
            }
          })
          
          await LeadScoringService.updateLeadScore(sequence.leadId)
        }
        break
        
      case 'click':
        if (!sequence.clickedAt) {
          await prisma.emailSequence.update({
            where: { id: sequenceId },
            data: { clickedAt: new Date() }
          })
          
          await prisma.interaction.create({
            data: {
              leadId: sequence.leadId,
              type: 'email_clicked',
              details: { sequenceId, timestamp: new Date().toISOString() }
            }
          })
          
          await LeadScoringService.updateLeadScore(sequence.leadId)
        }
        break
    }
    
    // Return a 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    )
    
    return new NextResponse(pixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Email tracking error:', error)
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}