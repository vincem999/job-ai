import { defineEventHandler, getRequestIP, getRequestURL } from 'h3'
import { createAppError } from '../utils/errorHandler'

// In-memory store for rate limiting (for development)
// In production, consider using Redis or another persistent store
interface RateLimitData {
  count: number
  resetTime: number
  banUntil?: number
}

const rateLimitStore = new Map<string, RateLimitData>()

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // requests per window
  banDurationMs: 60 * 60 * 1000, // 1 hour ban
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  keyGenerator: (ip: string) => `rate_limit:${ip}`,
  message: 'Too many requests, please try again later.',
  headers: true
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Only apply rate limiting to API routes
  if (!url.pathname.startsWith('/api/')) {
    return
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const key = RATE_LIMIT_CONFIG.keyGenerator(ip)
  const now = Date.now()

  // Get existing rate limit data
  let rateLimitData = rateLimitStore.get(key)

  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up on each request
    cleanupExpiredEntries()
  }

  // Check if IP is currently banned
  if (rateLimitData?.banUntil && now < rateLimitData.banUntil) {
    if (RATE_LIMIT_CONFIG.headers) {
      const retryAfter = Math.ceil((rateLimitData.banUntil - now) / 1000)
      event.node.res.setHeader('Retry-After', retryAfter.toString())
      event.node.res.setHeader('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString())
      event.node.res.setHeader('X-RateLimit-Remaining', '0')
      event.node.res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitData.banUntil / 1000).toString())
    }

    throw createAppError.rateLimit(Math.ceil((rateLimitData.banUntil - now) / 1000))
  }

  // Clear expired ban and reset window
  if (rateLimitData?.banUntil && now >= rateLimitData.banUntil) {
    rateLimitData = {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    }
  }
  // Initialize or reset window if needed
  else if (!rateLimitData || now >= rateLimitData.resetTime) {
    rateLimitData = {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    }
  } else {
    rateLimitData.count++
  }

  // Update store
  rateLimitStore.set(key, rateLimitData)

  // Set rate limit headers
  if (RATE_LIMIT_CONFIG.headers) {
    event.node.res.setHeader('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString())
    event.node.res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_CONFIG.maxRequests - rateLimitData.count).toString())
    event.node.res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitData.resetTime / 1000).toString())
  }

  // Check if limit exceeded
  if (rateLimitData.count > RATE_LIMIT_CONFIG.maxRequests) {
    // Apply ban
    rateLimitData.banUntil = now + RATE_LIMIT_CONFIG.banDurationMs
    rateLimitStore.set(key, rateLimitData)

    if (RATE_LIMIT_CONFIG.headers) {
      const retryAfter = Math.ceil(RATE_LIMIT_CONFIG.banDurationMs / 1000)
      event.node.res.setHeader('Retry-After', retryAfter.toString())
      event.node.res.setHeader('X-RateLimit-Remaining', '0')
    }

    throw createAppError.rateLimit(Math.ceil(RATE_LIMIT_CONFIG.banDurationMs / 1000))
  }
})

// Cleanup function to remove expired entries
function cleanupExpiredEntries() {
  const now = Date.now()
  const keysToDelete: string[] = []

  for (const [key, data] of rateLimitStore.entries()) {
    // Remove if ban expired and window expired
    if ((!data.banUntil || now >= data.banUntil) && now >= data.resetTime) {
      keysToDelete.push(key)
    }
  }

  keysToDelete.forEach(key => rateLimitStore.delete(key))

  if (keysToDelete.length > 0) {
    console.log(`[Rate Limit] Cleaned up ${keysToDelete.length} expired entries`)
  }
}

// Export configuration for testing and customization
export { RATE_LIMIT_CONFIG }