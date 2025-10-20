"use client"

import { useRouter } from "next/navigation"
import { FormBuilder } from "@/components/form-builder"
import type { FormSchema } from "@/lib/types"

export function FormBuilderClient({ form }: { form: FormSchema }) {
  const router = useRouter()

  const handleSave = async (formData: {
    title: string
    description?: string
    fields: Array<{
      id: string
      label: string
      type: "text" | "radio" | "multi"
      required: boolean
      options?: string[]
      placeholder?: string
    }>
  }) => {
    const updatedForm = {
      ...form,
      ...formData,
    }

    const response = await fetch(`/api/forms/${form.id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedForm),
    })

    if (!response.ok) {
      throw new Error("Failed to update form")
    }

    router.push(`/forms/${form.id}`)
  }

  return <FormBuilder initialForm={form} onSave={handleSave} />
}
