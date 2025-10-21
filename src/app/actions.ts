"use server"

import { revalidatePath } from "next/cache"
import { deleteForm } from "@/lib/redis"

export async function deleteFormAction(formId: string) {
  try {
    await deleteForm(formId)
    revalidatePath("/")
    return { success: true }
  } catch (_error) {
    return { success: false, error: "Failed to delete form" }
  }
}
