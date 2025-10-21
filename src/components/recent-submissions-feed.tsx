"use client"

import { formatInTimeZone } from "date-fns-tz"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { SubmissionNotification } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card"

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
    <section className="lg:col-span-4 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Submissions</h2>
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
      <div className="p-5 rounded-xl shadow-inner bg-muted ring-1 ring-border">
        <div className="flex flex-col gap-2">
          {submissions.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              Waiting for new submissions...
            </p>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {submissions.map((submission) => {
                  const isNew = newSubmissionIds.has(submission.id)

                  return (
                    <motion.div
                      layout
                      key={submission.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 1,
                      }}
                    >
                      <Link href={`/forms/${submission.formId}/submissions`}>
                        <Card
                          className={cn(
                            "hover:shadow-md transition-all duration-150",
                            {
                              "bg-gradient-to-r from-emerald-50 to-card border-emerald-200":
                                isNew,
                            }
                          )}
                        >
                          <CardContent>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0 ">
                                <CardTitle className="truncate mb-1">
                                  {submission.formTitle}
                                </CardTitle>
                                <CardDescription>
                                  {formatInTimeZone(
                                    submission.submittedAt,
                                    "UTC",
                                    "MMM d, yyyy HH:mm"
                                  )}{" "}
                                  UTC
                                </CardDescription>
                              </div>
                              {isNew && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  New
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
