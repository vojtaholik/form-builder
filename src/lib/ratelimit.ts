import { Ratelimit } from "@upstash/ratelimit"
import { NextResponse } from "next/server"
import { redis } from "./redis"

// Rate limiters using sliding window algorithm
export const writeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/write",
})

export const readLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/read",
})

/**
 * Extract client IP from request headers
 */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIp) {
    return realIp
  }

  // Fallback to a default identifier
  return "unknown"
}

/**
 * Rate limit middleware helper
 */
export async function rateLimit(
  request: Request,
  limiter: Ratelimit
): Promise<NextResponse | null> {
  const identifier = getClientIp(request)
  const { success, reset } = await limiter.limit(identifier)

  if (!success) {
    const now = Date.now()
    const retryAfter = Math.floor((reset - now) / 1000)

    return NextResponse.json(
      {
        success: false,
        error: "Rate limit exceeded",
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
        },
      }
    )
  }

  return null
}
