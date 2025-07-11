import { Redis } from 'ioredis'

let redis: Redis | null = null

export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    return null
  }

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          return null // Stop retrying
        }
        return Math.min(times * 200, 1000)
      },
      reconnectOnError: (err) => {
        const targetErrors = ['READONLY', 'ECONNREFUSED']
        return targetErrors.some(e => err.message.includes(e))
      }
    })

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    redis.on('connect', () => {
      console.log('Redis Client Connected')
    })
  }

  return redis
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient()
  if (!client) return null

  try {
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Redis GET error:', error)
    return null
  }
}

export async function cacheSet(
  key: string, 
  value: any, 
  ttlSeconds: number = 3600
): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Redis SET error:', error)
    return false
  }
}

export async function cacheDelete(key: string): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.del(key)
    return true
  } catch (error) {
    console.error('Redis DELETE error:', error)
    return false
  }
}

export async function cacheInvalidatePattern(pattern: string): Promise<number> {
  const client = getRedisClient()
  if (!client) return 0

  try {
    const keys = await client.keys(pattern)
    if (keys.length === 0) return 0
    
    const deleted = await client.del(...keys)
    return deleted
  } catch (error) {
    console.error('Redis pattern invalidation error:', error)
    return 0
  }
}