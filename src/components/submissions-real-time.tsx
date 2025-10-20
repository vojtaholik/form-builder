"use client"

import { useEffect, useState } from "react"
import type {
  FieldSchema,
  SubmissionNotification,
  SubmissionWithId,
} from "@/lib/types"

interface SubmissionsRealTimeProps {
  formId: string
  initialSubmissions: SubmissionWithId[]
  formFields: FieldSchema[]
}

export function SubmissionsRealTime({
  formId,
  initialSubmissions,
  formFields,
}: SubmissionsRealTimeProps) {
  const [submissions, setSubmissions] =
    useState<SubmissionWithId[]>(initialSubmissions)
  const [newSubmissionIds, setNewSubmissionIds] = useState<Set<string>>(
    new Set()
  )

  useEffect(() => {
    // Function to connect to the SSE API and handle reconnection
    const connectToStream = () => {
      const eventSource = new EventSource(`/api/stream/${formId}`)

      eventSource.addEventListener("message", (event) => {
        try {
          const notification: SubmissionNotification = JSON.parse(event.data)

          // Create a new submission with the ID
          const newSubmission: SubmissionWithId = {
            id: notification.submissionId,
            formId: notification.formId,
            submittedAt: notification.submittedAt,
            data: notification.data,
          }

          // Prepend the new submission to the list
          setSubmissions((prev) => [newSubmission, ...prev])

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
  }, [formId])

  if (submissions.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Submitted At
              </th>
              {formFields.map((field) => (
                <th
                  key={field.id}
                  className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                >
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {submissions.map((submission) => {
              const isNew = newSubmissionIds.has(submission.id)

              return (
                <tr
                  key={submission.id}
                  className={`hover:bg-zinc-50 transition-all duration-500 ${
                    isNew
                      ? "animate-[slideDown_0.3s_ease-out] bg-gradient-to-r from-green-50 to-transparent"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </td>
                  {formFields.map((field) => {
                    const value = submission.data[field.id]
                    let displayValue = "-"

                    if (value !== undefined && value !== null) {
                      if (Array.isArray(value)) {
                        displayValue = value.join(", ")
                      } else {
                        displayValue = String(value)
                      }
                    }

                    return (
                      <td
                        key={field.id}
                        className="px-6 py-4 text-sm text-zinc-900"
                      >
                        {displayValue}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
