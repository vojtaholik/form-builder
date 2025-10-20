"use client"

import { formatInTimeZone } from "date-fns-tz"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { SubmissionNotification } from "@/lib/types"

interface RecentSubmission {
  id: string
  formId: string
  formTitle: string
  submittedAt: number
}

export function RecentSubmissionsFeed() {
  const [submissions, setSubmissions] = useState<RecentSubmission[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [newSubmissionIds, setNewSubmissionIds] = useState<Set<string>>(
    new Set()
  )

  useEffect(() => {
    // Function to connect to the SSE API and handle reconnection
    const connectToStream = () => {
      const eventSource = new EventSource("/api/stream")

      eventSource.addEventListener("open", () => {
        setIsConnected(true)
      })

      eventSource.addEventListener("message", (event) => {
        try {
          const notification: SubmissionNotification = JSON.parse(event.data)

          const newSubmission: RecentSubmission = {
            id: notification.submissionId,
            formId: notification.formId,
            formTitle: notification.formTitle,
            submittedAt: notification.submittedAt,
          }

          // Prepend new submission and keep only last 10
          setSubmissions((prev) => [newSubmission, ...prev].slice(0, 10))

          // Track this as a new submission for animation
          setNewSubmissionIds((prev) =>
            new Set(prev).add(notification.submissionId)
          )

          // Remove the highlight after 3 seconds
          setTimeout(() => {
            setNewSubmissionIds((prev) => {
              const next = new Set(prev)
              next.delete(notification.submissionId)
              return next
            })
          }, 3000)
        } catch (error) {
          console.error("Error parsing SSE message:", error)
        }
      })

      // Handle errors and reconnect
      eventSource.addEventListener("error", () => {
        setIsConnected(false)
        eventSource.close()
        setTimeout(connectToStream, 1)
      })

      return eventSource
    }

    const eventSource = connectToStream()

    // Cleanup on component unmount
    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Submissions</h2>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-zinc-300"
            }`}
          />
          <span className="text-xs text-zinc-500">
            {isConnected ? "Live" : "Connecting..."}
          </span>
        </div>
      </div>

      {submissions.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-8">
          Waiting for new submissions...
        </p>
      ) : (
        <div className="space-y-2">
          {submissions.map((submission) => {
            const isNew = newSubmissionIds.has(submission.id)

            return (
              <Link
                key={submission.id}
                href={`/forms/${submission.formId}/submissions`}
                className={`block p-3 rounded-lg border hover:border-zinc-400 transition-all duration-500 ${
                  isNew
                    ? "animate-[slideDown_0.3s_ease-out] bg-gradient-to-r from-green-50 to-transparent border-green-200"
                    : "border-zinc-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {submission.formTitle}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatInTimeZone(
                        submission.submittedAt,
                        "UTC",
                        "MMM d, yyyy HH:mm"
                      )}{" "}
                      UTC
                    </p>
                  </div>
                  {isNew && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      New
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
