import { z } from "zod"

export const FieldType = z.enum(["text", "radio", "multi"])
export type FieldType = z.infer<typeof FieldType>

export const FieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: FieldType,
  required: z.boolean().default(false),
  // radio & multi need options
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
})

export type FieldSchema = z.infer<typeof FieldSchema>

export const FormSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(FieldSchema).min(1),
  createdAt: z.number(),
})
export type FormSchema = z.infer<typeof FormSchema>

export const SubmissionSchema = z.object({
  formId: z.string(),
  submittedAt: z.number(),
  data: z.record(z.any(), z.any()),
})
export type Submission = z.infer<typeof SubmissionSchema>

export type SubmissionWithId = Submission & { id: string }

// Real-time submission notification type
export type SubmissionNotification = {
  submissionId: string
  formId: string
  formTitle: string
  submittedAt: number
  data: Record<string, unknown>
}

// API Response types
export type ApiResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }
