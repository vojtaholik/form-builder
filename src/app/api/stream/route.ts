import Redis from "ioredis"

// Prevents this route's response from being cached on Vercel
export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()

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
      controller.enqueue(encoder.encode(`: Connected to submission stream\n\n`))

      // Subscribe to all form submissions using pattern
      redisSubscriber.psubscribe("form:submissions:*", (err) => {
        if (err) {
          console.error("Redis subscription error:", err)
          controller.error(err)
        } else {
          console.log("Successfully subscribed to form:submissions:*")
        }
      })

      // Listen for new submissions from Redis
      redisSubscriber.on("pmessage", (_pattern, _channel, message) => {
        try {
          // Forward the message to the SSE client
          controller.enqueue(encoder.encode(`data: ${message}\n\n`))
        } catch (error) {
          console.error("Error forwarding message:", error)
        }
      })

      // Handle Redis errors
      redisSubscriber.on("error", (err) => {
        console.error("Redis error:", err)
      })

      // Cleanup on client disconnect
      const cleanup = () => {
        redisSubscriber.punsubscribe("form:submissions:*")
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
