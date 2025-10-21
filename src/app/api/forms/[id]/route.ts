import { NextResponse } from "next/server"
import { rateLimit, readLimiter } from "@/lib/ratelimit"
import { getForm } from "@/lib/redis"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimitResponse = await rateLimit(request, readLimiter)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { id } = await params
    const form = await getForm(id)

    if (!form) {
      return NextResponse.json(
        {
          success: false,
          error: "Form not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: form,
    })
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch form",
      },
      { status: 500 }
    )
  }
}
