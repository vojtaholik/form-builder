"use client"

import { Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { deleteFormAction } from "@/app/actions"
import { Button } from "./ui/button"

interface DeleteFormButtonProps {
  formId: string
  formTitle: string
}

export function DeleteFormButton({ formId, formTitle }: DeleteFormButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isConfirming, setIsConfirming] = useState(false)

  const handleDelete = () => {
    if (!isConfirming) {
      setIsConfirming(true)
      return
    }

    startTransition(async () => {
      const result = await deleteFormAction(formId)

      if (!result.success) {
        toast.error(result.error || "Failed to delete form")
      } else {
        toast.success("Form deleted successfully")
      }
      setIsConfirming(false)
    })
  }

  const handleCancel = () => {
    setIsConfirming(false)
  }

  if (isConfirming) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-sm text-red-600 font-medium">
          Delete &quot;{formTitle}&quot;?
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="border-red-600 text-red-600 hover:bg-red-50"
        >
          {isPending ? "Deleting..." : "Confirm"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 mr-1" />
      Delete
    </Button>
  )
}
