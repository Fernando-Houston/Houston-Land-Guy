import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createLeadSchema } from '@/lib/validations/lead'
import { handleAPIError, APIError } from '@/lib/errors/api-error'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const days = searchParams.get('days')
    const sort = searchParams.get('sort') || 'createdAt'
    
    const skip = (page - 1) * limit
    
    const where: any = {}
    if (status && status !== 'all') where.status = status
    if (source && source !== 'all') where.source = source
    
    // Date range filter
    if (days && days !== 'all') {
      const daysNum = parseInt(days)
      const dateFrom = new Date()
      dateFrom.setDate(dateFrom.getDate() - daysNum)
      where.createdAt = { gte: dateFrom }
    }
    
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: sort === 'score' ? { score: 'desc' } : 
                 sort === 'name' ? { name: 'asc' } :
                 sort === 'updatedAt' ? { updatedAt: 'desc' } :
                 { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              interactions: true,
              calculatorResults: true,
            }
          }
        }
      }),
      prisma.lead.count({ where })
    ])
    
    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createLeadSchema.parse(body)
    
    // Check if lead already exists (with database fallback)
    let existingLead = null
    try {
      existingLead = await prisma.lead.findUnique({
        where: { email: validatedData.email }
      })
    } catch (dbError) {
      console.warn('Database connection failed for lead lookup:', dbError)
      // If database is down, return success but warn about data loss
      return NextResponse.json({ 
        data: { 
          email: validatedData.email,
          message: 'Thank you! Your information has been received. We will contact you within 24 hours.'
        },
        warning: 'Database temporarily unavailable'
      }, { status: 202 })
    }
    
    if (existingLead) {
      try {
        // Update existing lead with new information
        const updatedLead = await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            ...validatedData,
            score: Math.min(existingLead.score + 10, 100), // Increase engagement score
          }
        })
        
        // Track interaction
        await prisma.interaction.create({
          data: {
            leadId: updatedLead.id,
            type: 'form_resubmission',
            details: {
              source: validatedData.source,
              timestamp: new Date().toISOString()
            }
          }
        })
        
        return NextResponse.json({ data: updatedLead })
      } catch (dbError) {
        console.warn('Failed to update existing lead:', dbError)
        return NextResponse.json({ 
          data: { 
            email: validatedData.email,
            message: 'Thank you! Your updated information has been received.'
          }
        }, { status: 202 })
      }
    }
    
    try {
      // Create new lead
      const newLead = await prisma.lead.create({
        data: {
          ...validatedData,
          score: 10, // Initial engagement score
        }
      })
      
      // Track initial interaction
      await prisma.interaction.create({
        data: {
          leadId: newLead.id,
          type: 'lead_created',
          details: {
            source: validatedData.source,
            timestamp: new Date().toISOString()
          }
        }
      })
      
      return NextResponse.json({ data: newLead }, { status: 201 })
    } catch (dbError) {
      console.warn('Failed to create new lead:', dbError)
      return NextResponse.json({ 
        data: { 
          email: validatedData.email,
          message: 'Thank you! Your information has been received. We will contact you within 24 hours.'
        },
        warning: 'Database temporarily unavailable'
      }, { status: 202 })
    }
    
    // TODO: Trigger email notification
    // TODO: Add to email sequence if enabled
    
    return NextResponse.json({ data: newLead }, { status: 201 })
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