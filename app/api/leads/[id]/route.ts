import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { updateLeadSchema } from '@/lib/validations/lead'
import { handleAPIError, APIError } from '@/lib/errors/api-error'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        calculatorResults: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!lead) {
      throw new APIError('Lead not found', 404, 'LEAD_NOT_FOUND')
    }
    
    return NextResponse.json({ data: lead })
  } catch (error) {
    return handleAPIError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = updateLeadSchema.parse(body)
    
    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id: params.id }
    })
    
    if (!existingLead) {
      throw new APIError('Lead not found', 404, 'LEAD_NOT_FOUND')
    }
    
    // Update lead
    const updatedLead = await prisma.lead.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    })
    
    // Track status change if applicable
    if (validatedData.status && validatedData.status !== existingLead.status) {
      await prisma.interaction.create({
        data: {
          leadId: params.id,
          type: 'status_changed',
          details: {
            from: existingLead.status,
            to: validatedData.status,
            timestamp: new Date().toISOString()
          }
        }
      })
    }
    
    return NextResponse.json({ data: updatedLead })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return handleAPIError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id: params.id }
    })
    
    if (!existingLead) {
      throw new APIError('Lead not found', 404, 'LEAD_NOT_FOUND')
    }
    
    // Delete lead (cascades to related records)
    await prisma.lead.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Lead deleted successfully' })
  } catch (error) {
    return handleAPIError(error)
  }
}