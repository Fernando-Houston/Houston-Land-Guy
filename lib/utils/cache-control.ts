// Cache control utilities to prevent stale content

export const getCacheBustingHeaders = () => ({
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
})

export const getVersionedUrl = (url: string): string => {
  const timestamp = new Date().getTime()
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}v=${timestamp}`
}

// Add to fetch requests to prevent caching
export const fetchWithNoCache = (url: string, options: RequestInit = {}) => {
  return fetch(getVersionedUrl(url), {
    ...options,
    headers: {
      ...options.headers,
      ...getCacheBustingHeaders(),
    },
    cache: 'no-store' as RequestCache,
  })
}

// Force page reload with cache bypass
export const forceReload = () => {
  if (typeof window !== 'undefined') {
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    
    // Force reload bypassing cache
    window.location.reload()
  }
}

// Add meta tags to prevent caching
export const addNoCacheMetaTags = () => {
  if (typeof document !== 'undefined') {
    const metaTags = [
      { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
      { 'http-equiv': 'Pragma', content: 'no-cache' },
      { 'http-equiv': 'Expires', content: '0' },
    ]
    
    metaTags.forEach(tag => {
      const meta = document.createElement('meta')
      Object.entries(tag).forEach(([key, value]) => {
        meta.setAttribute(key, value)
      })
      document.head.appendChild(meta)
    })
  }
}