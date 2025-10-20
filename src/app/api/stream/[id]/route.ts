import Redis from "ioredis"

// Prevents this route's response from being cached on Vercel
export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const encoder = new TextEncoder()
  const channel = `form:submissions:${id}`

  // Create a streaming response
  const customReadable = new ReadableStream({
    start(controller) {
      // Create Redis subscriber instance
      const redisUrl = process.env.KV_URL
      if (!redisUrl) {
        controller.error(new Error("KV_URL is not configured"))
        return
      }

      const redisSubscriber = new Redis(redisUrl)

      // Send initial connection confirmation
      controller.enqueue(
        encoder.encode(`: Connected to form ${id} submission stream\n\n`)
      )

      // Subscribe to specific form's submissions
      redisSubscriber.subscribe(channel, (err) => {
        if (err) {
          console.error("Redis subscription error:", err)
          controller.error(err)
        } else {
          console.log(`Successfully subscribed to ${channel}`)
        }
      })

      // Listen for new submissions from Redis
      redisSubscriber.on("message", (ch, message) => {
        if (ch === channel) {
          try {
            // Forward the message to the SSE client
            controller.enqueue(encoder.encode(`data: ${message}\n\n`))
          } catch (error) {
            console.error("Error forwarding message:", error)
          }
        }
      })

      // Handle Redis errors
      redisSubscriber.on("error", (err) => {
        console.error("Redis error:", err)
      })

      // Cleanup on client disconnect
      const cleanup = () => {
        redisSubscriber.unsubscribe(channel)
        redisSubscriber.quit()
      }

      // Handle stream cancellation
      return cleanup
    },
  })

  // Return the stream response and keep the connection alive
  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none",
    },
  })
}
