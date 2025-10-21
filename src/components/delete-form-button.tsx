"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"

interface DeleteFormButtonProps {
  formId: string
  formTitle: string
}

export function DeleteFormButton({ formId, formTitle }: DeleteFormButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete "${formTitle}"? This will permanently delete the form and all its submissions. This action cannot be undone.`
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!result.success) {
        toast.error(result.error || "Failed to delete form")
        return
      }

      toast.success("Form deleted successfully")
      router.refresh()
    } catch (_error) {
      toast.error("Failed to delete form")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  )
}
