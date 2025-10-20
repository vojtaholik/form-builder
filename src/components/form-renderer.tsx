"use client"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormSchema } from "@/lib/types"

interface FormRendererProps {
  form: FormSchema
  onSubmit: (data: Record<string, unknown>) => Promise<void>
}

export function FormRenderer({ form, onSubmit }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // Build validation schema from form fields
  const validationSchema = z.object(
    form.fields.reduce(
      (acc, field) => {
        let fieldSchema: z.ZodTypeAny = z.any()

        if (field.type === "text") {
          fieldSchema = z.string().min(1, "This field is required")
        } else if (field.type === "radio") {
          if (field.options && field.options.length > 0) {
            fieldSchema = z.enum(field.options as [string, ...string[]], {
              message: "Please select an option",
            })
          } else {
            fieldSchema = z.string().min(1, "Please select an option")
          }
        } else if (field.type === "multi") {
          fieldSchema = z
            .array(z.string())
            .min(1, "Please select at least one option")
        }

        if (!field.required) {
          fieldSchema = fieldSchema.optional()
        }

        acc[field.id] = fieldSchema
        return acc
      },
      {} as Record<string, z.ZodTypeAny>,
    ),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate
    const result = validationSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      for (const error of result.error.issues) {
        const field = error.path[0] as string
        newErrors[field] = error.message
      }
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(result.data)
      setFormData({})
      setErrors({})
    } catch (error) {
      alert("Failed to submit form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const updateField = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const toggleMultiOption = (fieldId: string, option: string) => {
    const current = (formData[fieldId] as string[]) || []
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option]
    updateField(fieldId, updated)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {form.fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {field.type === "text" && (
            <Input
              id={field.id}
              value={(formData[field.id] as string) || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
          )}

          {field.type === "radio" && (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`${field.id}-${option}`}
                    name={field.id}
                    value={option}
                    checked={formData[field.id] === option}
                    onChange={(e) => updateField(field.id, e.target.value)}
                    className="w-4 h-4"
                  />
                  <Label
                    htmlFor={`${field.id}-${option}`}
                    className="font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {field.type === "multi" && (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={((formData[field.id] as string[]) || []).includes(
                      option,
                    )}
                    onCheckedChange={() => toggleMultiOption(field.id, option)}
                  />
                  <Label
                    htmlFor={`${field.id}-${option}`}
                    className="font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {errors[field.id] && (
            <p className="text-sm text-red-500">{errors[field.id]}</p>
          )}
        </div>
      ))}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
