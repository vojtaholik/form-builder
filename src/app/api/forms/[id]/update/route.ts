import { NextResponse } from "next/server"
import { getForm, updateForm } from "@/lib/redis"
import { FormSchema } from "@/lib/types"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if form exists
    const existing = await getForm(id)
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Form not found",
        },
        { status: 404 },
      )
    }

    // Validate with Zod
    const validationResult = FormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 },
      )
    }

    await updateForm(validationResult.data)

    return NextResponse.json({
      success: true,
      data: validationResult.data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update form",
      },
      { status: 500 },
    )
  }
}
