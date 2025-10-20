import { NextResponse } from "next/server"
import { z } from "zod"
import { createSubmission, getForm, getSubmissions, redis } from "@/lib/redis"
import type { SubmissionNotification } from "@/lib/types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

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

    const submissions = await getSubmissions(id, limit, offset)

    return NextResponse.json({
      success: true,
      data: submissions,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch submissions",
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check API key
    const apiKey = request.headers.get("x-api-key")
    if (apiKey !== process.env.SUBMIT_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing API key",
        },
        { status: 401 }
      )
    }

    // Get form
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

    // Parse request body
    const body = await request.json()

    // Build validation schema from form fields
    const validationSchema = z.object(
      form.fields.reduce((acc, field) => {
        let fieldSchema: z.ZodTypeAny = z.any()

        if (field.type === "text") {
          fieldSchema = z.string()
        } else if (field.type === "radio") {
          if (field.options && field.options.length > 0) {
            fieldSchema = z.enum(field.options as [string, ...string[]])
          } else {
            fieldSchema = z.string()
          }
        } else if (field.type === "multi") {
          if (field.options && field.options.length > 0) {
            fieldSchema = z.array(
              z.enum(field.options as [string, ...string[]])
            )
          } else {
            fieldSchema = z.array(z.string())
          }
        }

        if (field.required) {
          acc[field.id] = fieldSchema
        } else {
          acc[field.id] = fieldSchema.optional()
        }

        return acc
      }, {} as Record<string, z.ZodTypeAny>)
    )

    // Validate submission data
    const validationResult = validationSchema.safeParse(body)
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

    // Create submission
    const submittedAt = Date.now()
    const submissionId = await createSubmission(id, {
      formId: id,
      submittedAt,
      data: validationResult.data,
    })

    // Publish submission notification to Redis channel for real-time updates
    const notification: SubmissionNotification = {
      submissionId,
      formId: id,
      formTitle: form.title,
      submittedAt,
      data: validationResult.data,
    }

    try {
      const channel = `form:submissions:${id}`
      const result = await redis.publish(channel, JSON.stringify(notification))
      console.log(`Published to ${channel}, subscribers notified: ${result}`)
    } catch (error) {
      console.error("Failed to publish notification:", error)
      // Don't fail the submission if publish fails
    }

    return NextResponse.json({
      success: true,
      data: { id: submissionId },
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create submission",
      },
      { status: 500 }
    )
  }
}
