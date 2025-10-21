import { NextResponse } from "next/server"
import { rateLimit, writeLimiter } from "@/lib/ratelimit"
import { createForm } from "@/lib/redis"
import { FormSchema } from "@/lib/types"

export async function POST(request: Request) {
  // Rate limiting
  const rateLimitResponse = await rateLimit(request, writeLimiter)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const body = await request.json()

    // Validate with Zod
    const validationResult = FormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    await createForm(validationResult.data)

    return NextResponse.json({
      success: true,
      data: validationResult.data,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create form",
      },
      { status: 500 }
    )
  }
}
