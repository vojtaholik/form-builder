import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getForm } from "@/lib/redis"
import { FormBuilderClient } from "./form-builder-client"

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const form = await getForm(id)

  if (!form) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forms
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-2">Edit Form</h1>
          <p className="text-zinc-600">Update your form configuration</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <FormBuilderClient form={form} />
        </div>
      </div>
    </div>
  )
}
