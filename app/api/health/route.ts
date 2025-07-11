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

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.checks.database = 'healthy'
  } catch (error) {
    checks.checks.database = 'unhealthy'
    checks.status = 'degraded'
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
      checks.status = 'degraded'
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
    checks.status = 'degraded'
  }

  const statusCode = checks.status === 'ok' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}