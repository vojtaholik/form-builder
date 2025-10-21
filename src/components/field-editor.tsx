"use client"

import { GripVertical, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FieldType } from "@/lib/types"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import { Badge } from "./ui/badge"
import { FieldContent } from "./ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item"

export interface Field {
  id: string
  label: string
  type: FieldType
  required: boolean
  options?: string[]
  placeholder?: string
}

interface FieldEditorProps {
  field: Field
  index: number
  onUpdate: (field: Field) => void
  onDelete: () => void
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDrop: (e: React.DragEvent, index: number) => void
  isDragging: boolean
  error?: string
}

export function FieldEditor({
  field,
  index,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  error,
}: FieldEditorProps) {
  const updateField = (updates: Partial<Field>) => {
    onUpdate({ ...field, ...updates })
  }

  const addOption = () => {
    const options = field.options || []
    updateField({ options: [...options, ""] })
  }

  const updateOption = (idx: number, value: string) => {
    const options = [...(field.options || [])]
    options[idx] = value
    updateField({ options })
  }

  const removeOption = (idx: number) => {
    const options = field.options?.filter((_, i) => i !== idx) || []
    updateField({ options })
  }

  const getFieldDescription = () => {
    if (field.type === "text") {
      return "Text input"
    }
    if (field.type === "radio") {
      const optionCount = field.options?.length || 0
      return `Radio button • ${optionCount} option${
        optionCount !== 1 ? "s" : ""
      }`
    }
    if (field.type === "multi") {
      const optionCount = field.options?.length || 0
      return `Multi-select • ${optionCount} option${
        optionCount !== 1 ? "s" : ""
      }`
    }
    return field.type
  }

  return (
    <AccordionItem
      value={field.id}
      className={`transition-opacity border-0 [&[data-state="open"]_[data-slot="item"]]:rounded-b-none ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >
      <Item variant="outline" className="cursor-default">
        {/* Header - always visible */}
        <ItemMedia
          variant="default"
          className="cursor-grab mt-0.5 active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </ItemMedia>
        <ItemContent className="flex-1">
          <AccordionTrigger className="py-0 hover:no-underline items-center w-full">
            <div className="flex flex-col items-start gap-1 w-full">
              <ItemTitle>
                <span className="font-semibold">
                  {field.label || "Untitled field"}
                </span>
                {field.required && (
                  <Badge variant="secondary" className="text-xs h-4.5">
                    Required
                  </Badge>
                )}
              </ItemTitle>
              <ItemDescription className="text-xs">
                {getFieldDescription()}
              </ItemDescription>
            </div>
          </AccordionTrigger>
        </ItemContent>

        <ItemActions>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </ItemActions>
      </Item>

      {/* Expanded content */}
      <AccordionContent className="border pt-4 -mt-4 rounded-lg px-4">
        <div className="">
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              {/* <Badge>{field.type}</Badge> */}
            </div>

            <FieldContent>
              <Label htmlFor={`label-${field.id}`}>Label</Label>
              <Input
                id={`label-${field.id}`}
                value={field.label}
                onChange={(e) => updateField({ label: e.target.value })}
                placeholder="Field label"
              />
            </FieldContent>

            {field.type === "text" && (
              <FieldContent>
                <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
                <Input
                  id={`placeholder-${field.id}`}
                  value={field.placeholder || ""}
                  onChange={(e) => updateField({ placeholder: e.target.value })}
                  placeholder="Enter placeholder text"
                />
              </FieldContent>
            )}

            {(field.type === "radio" || field.type === "multi") && (
              <div className="flex flex-col gap-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {field.options?.map((option, idx) => (
                    <FieldContent
                      key={`${field.id}-option-${idx}`}
                      className="flex gap-2 items-center flex-row"
                    >
                      <Input
                        value={option}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </FieldContent>
                  ))}
                </div>
                <FieldContent className="flex items-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </FieldContent>
              </div>
            )}
            <div className="flex items-center gap-2 ">
              <Checkbox
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked) =>
                  updateField({ required: checked === true })
                }
              />
              <Label htmlFor={`required-${field.id}`} className="text-sm">
                Required
              </Label>
            </div>
            {/* Preview section */}
            {/* <FieldPreview field={field} /> */}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
