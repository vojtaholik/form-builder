"use client"

import { Plus } from "lucide-react"

import { useState } from "react"
import { toast } from "sonner"
import { type Field, FieldEditor } from "@/components/field-editor"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { FieldType, FormSchema } from "@/lib/types"

interface FormBuilderProps {
  initialForm?: FormSchema
  onSave: (form: Omit<FormSchema, "id" | "createdAt">) => Promise<void>
}

export function FormBuilder({ initialForm, onSave }: FormBuilderProps) {
  const [title, setTitle] = useState(initialForm?.title || "")
  const [description, setDescription] = useState(initialForm?.description || "")
  const [fields, setFields] = useState<Field[]>(initialForm?.fields || [])
  const [saving, setSaving] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [expandedFields, setExpandedFields] = useState<string[]>([])

  const addField = (type: FieldType) => {
    const newField: Field = {
      id: crypto.randomUUID(),
      label: "",
      type,
      required: false,
      ...(type === "radio" || type === "multi" ? { options: [] } : {}),
    }
    setFields([...fields, newField])
    // Auto-expand newly added fields
    setExpandedFields([...expandedFields, newField.id])
  }

  const updateField = (index: number, updatedField: Field) => {
    const newFields = [...fields]
    newFields[index] = updatedField
    setFields(newFields)
  }

  const deleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    if (draggedIndex === null || draggedIndex === index) {
      return
    }

    const newFields = [...fields]
    const draggedField = newFields[draggedIndex]
    newFields.splice(draggedIndex, 1)
    newFields.splice(index, 0, draggedField)

    setFields(newFields)
    setDraggedIndex(index)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDraggedIndex(null)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }

    if (fields.length === 0) {
      toast.error("At least one field is required")
      return
    }

    // Validate all fields have labels
    const invalidFields = fields.filter((f) => !f.label.trim())
    if (invalidFields.length > 0) {
      toast.error("All fields must have labels")
      return
    }

    // Validate radio/multi fields have options
    const invalidOptions = fields.filter(
      (f) =>
        (f.type === "radio" || f.type === "multi") &&
        (!f.options || f.options.length === 0)
    )
    if (invalidOptions.length > 0) {
      toast.error("Radio and multi-select fields must have at least one option")
      return
    }

    setSaving(true)
    try {
      await onSave({
        title,
        description,
        fields: fields.map((f) => ({
          id: f.id,
          label: f.label,
          type: f.type,
          required: f.required,
          options: f.options,
          placeholder: f.placeholder,
        })),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FieldContent>
          <Label htmlFor="title">Form Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
          />
        </FieldContent>

        <FieldContent>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter form description"
            rows={3}
          />
        </FieldContent>
      </div>

      <div className="space-y-4">
        <div className="flex md:flex-row flex-col md:items-center gap-2 justify-between">
          <h3 className="text-lg font-semibold">Fields</h3>
          <ButtonGroup>
            <Button variant="outline" onClick={() => addField("text")}>
              <Plus className="size-3" /> Text Input
            </Button>
            <Button variant="outline" onClick={() => addField("radio")}>
              <Plus className="size-3" /> Radio Buttons
            </Button>
            <Button variant="outline" onClick={() => addField("multi")}>
              <Plus className="size-3" /> Multi-select
            </Button>
          </ButtonGroup>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-zinc-500">
              No fields yet. Add a field to get started.
            </p>
          </div>
        ) : (
          <Accordion
            type="multiple"
            value={expandedFields}
            onValueChange={setExpandedFields}
            className="space-y-3"
          >
            {fields.map((field, index) => (
              <FieldEditor
                key={field.id}
                field={field}
                index={index}
                onUpdate={(updatedField) => updateField(index, updatedField)}
                onDelete={() => deleteField(index)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggedIndex === index}
              />
            ))}
          </Accordion>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Form"}
        </Button>
      </div>
    </div>
  )
}
