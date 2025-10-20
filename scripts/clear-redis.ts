import { Redis } from "@upstash/redis"
import { config } from "dotenv"

// Load environment variables
config({ path: [".env.local", ".env"] })

async function clearRedis() {
  const redis = Redis.fromEnv()

  console.log("🔥 Nuking all Redis keys...")

  try {
    // Get all keys
    const keys = await redis.keys("*")

    if (!keys || keys.length === 0) {
      console.log("✨ Redis is already empty, nothing to nuke")
      return
    }

    console.log(`💀 Found ${keys.length} keys to delete`)

    // Delete all keys
    if (keys.length > 0) {
      await redis.del(...keys)
    }

    console.log(`✅ Successfully deleted ${keys.length} keys`)
  } catch (error) {
    console.error("❌ Failed to clear Redis:", error)
    process.exit(1)
  }
}

clearRedis()
