import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { coreAgentsClient } from '@/lib/api/core-agents'
import { handleAPIError } from '@/lib/errors/api-error'
import { z } from 'zod'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const roiCalculatorSchema = z.object({
  purchasePrice: z.number().positive(),
  renovationCost: z.number().min(0),
  holdingPeriod: z.number().positive(),
  propertyType: z.string(),
  location: z.string(),
  squareFeet: z.number().positive(),
  bedroomsBathrooms: z.object({
    bedrooms: z.number().int().positive(),
    bathrooms: z.number().positive()
  }).optional(),
  leadId: z.string().optional(),
  sessionId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = roiCalculatorSchema.parse(body)
    
    const startTime = Date.now()
    
    // Call Core Agents API for ROI calculation
    const roiResult = await coreAgentsClient.calculateROI({
      purchasePrice: validatedData.purchasePrice,
      renovationCost: validatedData.renovationCost,
      location: validatedData.location,
      propertyType: validatedData.propertyType,
      additionalFactors: {
        holdingPeriod: validatedData.holdingPeriod,
        squareFeet: validatedData.squareFeet,
        bedroomsBathrooms: validatedData.bedroomsBathrooms
      }
    })
    
    const duration = Date.now() - startTime
    
    // Save calculator result
    const calculatorResult = await prisma.calculatorResult.create({
      data: {
        leadId: validatedData.leadId,
        calculatorType: 'roi',
        inputs: validatedData as any,
        roi: roiResult.result.roi,
        totalCost: roiResult.result.totalCost,
        projectedProfit: roiResult.result.projectedProfit,
        timeline: roiResult.result.timeline,
        risks: roiResult.result.risks,
        sessionId: validatedData.sessionId,
        completed: true
      }
    })
    
    // Track tool usage
    if (validatedData.leadId) {
      await prisma.interaction.create({
        data: {
          leadId: validatedData.leadId,
          type: 'tool_used',
          details: {
            tool: 'roi_calculator',
            duration,
            resultId: calculatorResult.id
          }
        }
      })
      
      // Update lead score
      await prisma.lead.update({
        where: { id: validatedData.leadId },
        data: {
          score: { increment: 15 } // High-value interaction
        }
      })
    }
    
    return NextResponse.json({
      data: {
        ...roiResult.result,
        calculatorResultId: calculatorResult.id,
        recommendations: roiResult.recommendations,
        analysis: roiResult.analysis
      }
    })
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