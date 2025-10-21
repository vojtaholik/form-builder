import { NextResponse } from "next/server"
import { rateLimit, readLimiter } from "@/lib/ratelimit"
import { getAllFormIds } from "@/lib/redis"

export async function GET(request: Request) {
  // Rate limiting
  const rateLimitResponse = await rateLimit(request, readLimiter)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const formIds = await getAllFormIds()
    return NextResponse.json({
      success: true,
      data: formIds,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch forms",
      },
      { status: 500 }
    )
  }
}
