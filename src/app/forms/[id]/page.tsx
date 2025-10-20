import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getForm } from "@/lib/redis"
import { FormRendererClient } from "./form-renderer-client"

export default async function FormPage({
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
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forms
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{form.title}</h1>
              {form.description && (
                <p className="text-zinc-600">{form.description}</p>
              )}
            </div>
            <Button asChild variant="outline">
              <Link href={`/forms/${id}/submissions`}>
                <FileText className="h-4 w-4 mr-2" />
                View Submissions
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <FormRendererClient form={form} />
        </div>
      </div>
    </div>
  )
}
