import { Redis } from "@upstash/redis"
import type { FormSchema, Submission, SubmissionWithId } from "./types"

export const redis = Redis.fromEnv()

// Form operations
export async function createForm(form: FormSchema): Promise<void> {
  await redis.set(`form:${form.id}`, form)
  await redis.sadd("form_ids", form.id)
}

export async function getForm(id: string): Promise<FormSchema | null> {
  return await redis.get<FormSchema>(`form:${id}`)
}

export async function updateForm(form: FormSchema): Promise<void> {
  await redis.set(`form:${form.id}`, form)
}

export async function deleteForm(id: string): Promise<void> {
  // Get all submission IDs for this form
  const submissionIds = await redis.zrange<string[]>(
    `submission_ids:${id}`,
    0,
    -1
  )

  // Delete all submissions
  if (submissionIds && submissionIds.length > 0) {
    const submissionKeys = submissionIds.map(
      (subId) => `submission:${id}:${subId}`
    )
    await redis.del(...submissionKeys)
  }

  // Delete the submission index
  await redis.del(`submission_ids:${id}`)

  // Delete the form itself
  await redis.del(`form:${id}`)
  await redis.srem("form_ids", id)
}

export async function getAllFormIds(): Promise<string[]> {
  const ids = await redis.smembers("form_ids")
  return ids as string[]
}

export async function getAllForms(): Promise<FormSchema[]> {
  const ids = await getAllFormIds()
  if (ids.length === 0) return []

  const forms = await Promise.all(ids.map((id) => getForm(id)))

  return forms
    .filter((f): f is FormSchema => f !== null)
    .sort((a, b) => b.createdAt - a.createdAt)
}

// Submission operations
export async function createSubmission(
  formId: string,
  submission: Submission
): Promise<string> {
  const id = crypto.randomUUID()
  await redis.set(`submission:${formId}:${id}`, submission)
  await redis.zadd(`submission_ids:${formId}`, {
    score: submission.submittedAt,
    member: id,
  })
  return id
}

export async function getSubmission(
  formId: string,
  id: string
): Promise<SubmissionWithId | null> {
  const submission = await redis.get<Submission>(`submission:${formId}:${id}`)
  if (!submission) return null
  return { ...submission, id }
}

export async function getSubmissions(
  formId: string,
  limit = 20,
  offset = 0
): Promise<SubmissionWithId[]> {
  // Get IDs sorted by timestamp (newest first)
  const ids = await redis.zrange<string[]>(
    `submission_ids:${formId}`,
    offset,
    offset + limit - 1,
    {
      rev: true,
    }
  )

  if (!ids || ids.length === 0) return []

  const submissions = await Promise.all(
    ids.map((id) => getSubmission(formId, id))
  )

  return submissions.filter((s): s is SubmissionWithId => s !== null)
}

export async function getSubmissionCount(formId: string): Promise<number> {
  return (await redis.zcard(`submission_ids:${formId}`)) || 0
}
