"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormBuilder } from "@/components/form-builder"
import { Button } from "@/components/ui/button"
import { generateFormId } from "@/lib/utils"

export default function NewFormPage() {
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
    const form = {
      id: generateFormId(formData.title),
      ...formData,
      createdAt: Date.now(),
    }

    const response = await fetch("/api/forms/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      throw new Error("Failed to create form")
    }

    router.push(`/forms/${form.id}`)
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto lg:grid gap-5 flex flex-col-reverse grid-cols-12 lg:py-10 py-5 px-4 max-w-7xl">
        <div className="mb-8 col-span-2 flex lg:items-start flex-col items-center">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forms
            </Link>
          </Button>
        </div>

        <div className="col-span-8">
          <div className="flex flex-col mb-5">
            <h1 className="lg:text-4xl text-2xl font-bold lg:mb-2">
              Create New Form
            </h1>
            <p className="text-zinc-600">
              Build your form by adding fields and configuring options
            </p>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <FormBuilder onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
  )
}
