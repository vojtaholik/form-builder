"use client"

import { formatInTimeZone } from "date-fns-tz"
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
      <Table>
        <TableHeader className="bg-zinc-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Submitted At
            </TableHead>
            {formFields.map((field) => (
              <TableHead
                key={field.id}
                className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider"
              >
                {field.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => {
            const isNew = newSubmissionIds.has(submission.id)

            return (
              <TableRow
                key={submission.id}
                className={`transition-all duration-500 ${
                  isNew
                    ? "animate-[slideDown_0.3s_ease-out] bg-gradient-to-r from-green-50 to-transparent"
                    : ""
                }`}
              >
                <TableCell className="px-6 py-4 text-sm text-zinc-500">
                  {formatInTimeZone(
                    submission.submittedAt,
                    "UTC",
                    "MMM d, yyyy HH:mm:ss"
                  )}{" "}
                  UTC
                </TableCell>
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
                    <TableCell
                      key={field.id}
                      className="px-6 py-4 text-sm text-zinc-900"
                    >
                      {displayValue}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
