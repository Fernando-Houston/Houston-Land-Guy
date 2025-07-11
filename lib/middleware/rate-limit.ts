import { getRedisClient } from '@/lib/cache/redis'

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
}

export class RateLimiter {
  private static async getRateLimitWithRedis(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    const redis = getRedisClient()
    if (!redis) {
      // Fallback to allowing requests if Redis is not available
      return { allowed: true, limit, remaining: limit, resetTime: Date.now() + windowMs }
    }

    const now = Date.now()
    const window = Math.floor(now / windowMs)
    const redisKey = `ratelimit:${key}:${window}`

    try {
      const pipeline = redis.pipeline()
      pipeline.incr(redisKey)
      pipeline.expire(redisKey, Math.ceil(windowMs / 1000))
      
      const results = await pipeline.exec()
      const count = results?.[0]?.[1] as number || 1

      return {
        allowed: count <= limit,
        limit,
        remaining: Math.max(0, limit - count),
        resetTime: (window + 1) * windowMs
      }
    } catch (error) {
      console.error('Redis rate limit error:', error)
      // Fallback to allowing requests on error
      return { allowed: true, limit, remaining: limit, resetTime: now + windowMs }
    }
  }

  static async checkLimit(
    identifier: string,
    endpoint: string,
    limit: number = 60,
    windowMs: number = 60000
  ): Promise<RateLimitResult> {
    const key = `${identifier}:${endpoint}`
    return this.getRateLimitWithRedis(key, limit, windowMs)
  }

  static async checkApiKeyLimit(
    apiKey: string,
    limit: number = 1000,
    windowMs: number = 3600000 // 1 hour
  ): Promise<RateLimitResult> {
    const key = `apikey:${apiKey}`
    return this.getRateLimitWithRedis(key, limit, windowMs)
  }
}