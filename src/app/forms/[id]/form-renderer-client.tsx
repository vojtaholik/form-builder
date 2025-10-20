"use client"

import { useState } from "react"
import { FormRenderer } from "@/components/form-renderer"
import type { FormSchema } from "@/lib/types"

export function FormRendererClient({ form }: { form: FormSchema }) {
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (data: Record<string, unknown>) => {
    const response = await fetch(`/api/forms/${form.id}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to submit form")
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <>
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Form submitted successfully!
        </div>
      )}
      <FormRenderer form={form} onSubmit={handleSubmit} />
    </>
  )
}
