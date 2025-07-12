import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { coreAgentsClient } from '@/lib/api/core-agents'
import { handleAPIError } from '@/lib/errors/api-error'
import { z } from 'zod'

const marketIntelligenceSchema = z.object({
  neighborhoods: z.array(z.string()).min(1),
  dataTypes: z.array(z.enum(['permits', 'trends', 'demographics', 'opportunities'])).optional(),
  timeframe: z.enum(['current', '3months', '6months', '1year']).optional(),
  useCache: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = marketIntelligenceSchema.parse(body)
    const { neighborhoods, dataTypes = ['permits', 'trends', 'demographics'], timeframe = 'current', useCache = true } = validatedData
    
    const results: Record<string, any> = {}
    
    for (const neighborhood of neighborhoods) {
      const neighborhoodData: Record<string, any> = {}
      
      // Check cache for each data type (with database fallback)
      for (const dataType of dataTypes) {
        let cached = null
        
        if (useCache) {
          try {
            cached = await prisma.marketData.findFirst({
              where: {
                neighborhood,
                dataType,
                lastUpdated: {
                  gt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hour cache
                }
              }
            })
          } catch (dbError) {
            console.warn('Database connection failed, skipping cache check:', dbError)
            // Continue without cache
          }
          
          if (cached) {
            neighborhoodData[dataType] = cached.data
            continue
          }
        }
        
        // Fetch fresh data based on type
        try {
          let freshData
          
          switch (dataType) {
            case 'permits':
              freshData = await coreAgentsClient.getPermitData({
                location: neighborhood,
                dateRange: getDateRange(timeframe)
              })
              break
              
            case 'trends':
              freshData = await coreAgentsClient.getMarketTrends({
                neighborhoods: [neighborhood],
                timeframe,
                metrics: ['price', 'inventory', 'demand', 'construction']
              })
              break
              
            case 'demographics':
              freshData = await coreAgentsClient.getDemographics(neighborhood)
              break
              
            case 'opportunities':
              freshData = await coreAgentsClient.getMarketIntelligence(
                `What are the best development opportunities in ${neighborhood}?`,
                { timeframe, includeAnalysis: true }
              )
              break
          }
          
          // Cache the fresh data (with database fallback)
          try {
            await prisma.marketData.upsert({
              where: {
                neighborhood_dataType: {
                  neighborhood,
                  dataType
                }
              },
              update: {
                data: freshData as any,
                source: 'core_agents',
                lastUpdated: new Date()
              },
              create: {
                neighborhood,
                dataType,
                data: freshData as any,
                source: 'core_agents'
              }
            })
          } catch (dbError) {
            console.warn('Failed to cache data in database:', dbError)
            // Continue without caching
          }
          
          neighborhoodData[dataType] = freshData
        } catch (error) {
          console.error(`Failed to fetch ${dataType} for ${neighborhood}:`, error)
          neighborhoodData[dataType] = { error: 'Failed to fetch data' }
        }
      }
      
      results[neighborhood] = neighborhoodData
    }
    
    return NextResponse.json({
      data: results,
      metadata: {
        neighborhoods: neighborhoods.length,
        dataTypes,
        timeframe,
        timestamp: new Date().toISOString()
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

function getDateRange(timeframe: string): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()
  
  switch (timeframe) {
    case '3months':
      start.setMonth(start.getMonth() - 3)
      break
    case '6months':
      start.setMonth(start.getMonth() - 6)
      break
    case '1year':
      start.setFullYear(start.getFullYear() - 1)
      break
    default:
      start.setMonth(start.getMonth() - 1) // Default to 1 month
  }
  
  return { start, end }
}