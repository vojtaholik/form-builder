"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Field } from "./field-editor"

interface FieldPreviewProps {
  field: Field
}

export function FieldPreview({ field }: FieldPreviewProps) {
  return (
    <div className="space-y-2 p-4 bg-muted/30 rounded-md border border-border/50">
      <div className="text-xs text-muted-foreground mb-3 font-medium">
        Preview
      </div>
      <div className="space-y-2">
        <Label htmlFor={`preview-${field.id}`}>
          {field.label || "Untitled field"}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {field.type === "text" && (
          <Input
            id={`preview-${field.id}`}
            placeholder={field.placeholder}
            disabled
            className="cursor-not-allowed"
          />
        )}

        {field.type === "radio" && (
          <div className="space-y-2">
            {field.options && field.options.length > 0 ? (
              field.options.map((option, idx) => (
                <div key={`${field.id}-radio-preview-${idx}`} className="flex items-center gap-2">
                  <input
                    type="radio"
                    disabled
                    className="w-4 h-4 cursor-not-allowed"
                  />
                  <Label className="font-normal text-muted-foreground cursor-not-allowed">
                    {option || `Option ${idx + 1}`}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No options added yet
              </p>
            )}
          </div>
        )}

        {field.type === "multi" && (
          <div className="space-y-2">
            {field.options && field.options.length > 0 ? (
              field.options.map((option, idx) => (
                <div key={`${field.id}-multi-preview-${idx}`} className="flex items-center gap-2">
                  <Checkbox disabled className="cursor-not-allowed" />
                  <Label className="font-normal text-muted-foreground cursor-not-allowed">
                    {option || `Option ${idx + 1}`}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No options added yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

