import { NextResponse } from "next/server"
import { getAllFormIds } from "@/lib/redis"

export async function GET() {
  try {
    const formIds = await getAllFormIds()
    return NextResponse.json({
      success: true,
      data: formIds,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch forms",
      },
      { status: 500 },
    )
  }
}
