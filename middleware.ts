import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/leads': { windowMs: 60000, max: 30 }, // 30 requests per minute
  '/api/tools': { windowMs: 60000, max: 20 }, // 20 requests per minute
  '/api/intelligence': { windowMs: 60000, max: 10 }, // 10 requests per minute
  '/api/core-agents': { windowMs: 60000, max: 15 }, // 15 requests per minute
  '/api/auth': { windowMs: 60000, max: 10 }, // 10 requests per minute for auth endpoints
  'default': { windowMs: 60000, max: 60 } // 60 requests per minute default
}

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/portfolio',
  '/saved-searches',
  '/watchlist',
  '/analytics',
  '/api/user',
  '/api/portfolio',
  '/api/saved-searches',
  '/api/preferences',
  '/api/watchlist'
]

// Public auth routes that don't require authentication
const PUBLIC_AUTH_ROUTES = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-request',
  '/auth/error',
  '/api/auth/signup',
  '/api/auth/forgot-password'
]

// Admin-only routes
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin'
]

// In-memory store for development (use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )
  
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  const isAdminRoute = ADMIN_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // Handle authentication for protected routes
  if (isProtectedRoute || isAdminRoute) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      // Redirect to signin for web routes, return 401 for API routes
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Authentication required', code: 'UNAUTHORIZED' },
          { status: 401 }
        )
      } else {
        const url = new URL('/auth/signin', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }
    }

    // Check admin access
    if (isAdminRoute && token.role !== 'ADMIN') {
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Admin access required', code: 'FORBIDDEN' },
          { status: 403 }
        )
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (isPublicAuthRoute && !pathname.startsWith('/api')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Apply rate limiting to API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Skip rate limiting for health checks
  if (pathname === '/api/health') {
    return NextResponse.next()
  }

  // Get client identifier (IP in production, use x-forwarded-for header)
  const clientId = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'anonymous'

  // Find matching rate limit rule
  const path = pathname
  let rateLimit = RATE_LIMITS.default
  
  for (const [route, limit] of Object.entries(RATE_LIMITS)) {
    if (route !== 'default' && path.startsWith(route)) {
      rateLimit = limit
      break
    }
  }

  // Create rate limit key
  const key = `${clientId}:${path}`
  const now = Date.now()

  // Check rate limit
  const clientData = requestCounts.get(key)
  
  if (!clientData || now > clientData.resetTime) {
    // New window
    requestCounts.set(key, {
      count: 1,
      resetTime: now + rateLimit.windowMs
    })
  } else {
    // Existing window
    if (clientData.count >= rateLimit.max) {
      // Rate limit exceeded
      return NextResponse.json(
        {
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString(),
            'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString()
          }
        }
      )
    }
    
    // Increment count
    clientData.count++
    requestCounts.set(key, clientData)
  }

  // Add rate limit headers to response
  const response = NextResponse.next()
  const currentData = requestCounts.get(key)!
  
  response.headers.set('X-RateLimit-Limit', rateLimit.max.toString())
  response.headers.set('X-RateLimit-Remaining', (rateLimit.max - currentData.count).toString())
  response.headers.set('X-RateLimit-Reset', new Date(currentData.resetTime).toISOString())

  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    const cutoff = now - 300000 // 5 minutes ago
    requestCounts.forEach((v, k) => {
      if (v.resetTime < cutoff) {
        requestCounts.delete(k)
      }
    })
  }

  return response
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Always run for API routes
    '/api/:path*'
  ]
}