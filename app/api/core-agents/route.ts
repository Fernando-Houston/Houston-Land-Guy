import { NextRequest, NextResponse } from 'next/server'
import { coreAgentsClient } from '@/lib/api/core-agents'
import { handleAPIError, APIError } from '@/lib/errors/api-error'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, params, useCache = true } = body
    
    if (!endpoint) {
      throw new APIError('Endpoint is required', 400, 'MISSING_ENDPOINT')
    }
    
    // Check cache if enabled
    if (useCache) {
      const cachedData = await prisma.coreAgentsCache.findFirst({
        where: {
          endpoint,
          params: params || {},
          expiresAt: { gt: new Date() }
        }
      })
      
      if (cachedData) {
        return NextResponse.json({
          data: cachedData.response,
          cached: true
        })
      }
    }
    
    // Make request to Core Agents
    let response
    switch (endpoint) {
      case 'market-intelligence':
        response = await coreAgentsClient.getMarketIntelligence(
          params.query,
          params.context
        )
        break
      case 'property-analysis':
        response = await coreAgentsClient.getPropertyAnalysis(
          params.address,
          params.additionalData
        )
        break
      case 'neighborhood-data':
        response = await coreAgentsClient.getNeighborhoodData(
          params.neighborhood
        )
        break
      case 'permit-data':
        response = await coreAgentsClient.getPermitData(params)
        break
      case 'demographics':
        response = await coreAgentsClient.getDemographics(
          params.location,
          params.radius
        )
        break
      case 'market-trends':
        response = await coreAgentsClient.getMarketTrends(params)
        break
      case 'roi-calculator':
        response = await coreAgentsClient.calculateROI(params)
        break
      default:
        throw new APIError('Invalid endpoint', 400, 'INVALID_ENDPOINT')
    }
    
    // Cache the response
    if (useCache) {
      await prisma.coreAgentsCache.create({
        data: {
          endpoint,
          params: params || {},
          response: response as any,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour cache
        }
      })
    }
    
    return NextResponse.json({
      data: response,
      cached: false
    })
  } catch (error) {
    return handleAPIError(error)
  }
}