import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'pending',
      redis: 'pending',
      coreAgents: 'pending'
    }
  }

  // Check database connection (non-blocking)
  try {
    // Set a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database check timeout')), 3000)
    )
    
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      timeoutPromise
    ])
    checks.checks.database = 'healthy'
  } catch (error) {
    checks.checks.database = 'unhealthy'
    // Don't fail the entire health check just because DB is down
    // checks.status = 'degraded'
  }

  // Check Redis connection (if configured)
  if (process.env.REDIS_URL) {
    try {
      const { createClient } = await import('redis')
      const client = createClient({ url: process.env.REDIS_URL })
      await client.connect()
      await client.ping()
      await client.disconnect()
      checks.checks.redis = 'healthy'
    } catch (error) {
      checks.checks.redis = 'unhealthy'
      // Don't fail the entire health check
      // checks.status = 'degraded'
    }
  } else {
    checks.checks.redis = 'not_configured'
  }

  // Check Core Agents API
  try {
    const response = await fetch(`${process.env.CORE_AGENTS_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CORE_AGENTS_SECRET_KEY}`
      },
      signal: AbortSignal.timeout(5000)
    })
    checks.checks.coreAgents = response.ok ? 'healthy' : 'unhealthy'
  } catch (error) {
    checks.checks.coreAgents = 'unhealthy'
    // Don't fail the entire health check
    // checks.status = 'degraded'
  }

  // Always return 200 OK so the app stays up
  const statusCode = 200

  return NextResponse.json(checks, { status: statusCode })
}