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
      <div className="container max-w-7xl mx-auto px-4 lg:py-10 py-5 lg:grid flex flex-col-reverse grid-cols-12 gap-5">
        <div className="col-span-2 flex lg:items-start flex-col items-center">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forms
            </Link>
          </Button>
        </div>
        <div className="col-span-8">
          <div className="mb-5">
            <h1 className="lg:text-4xl text-2xl font-bold lg:mb-2">
              Edit Form
            </h1>
            <p className="text-zinc-600">Update your form configuration</p>
          </div>
          <div className="shadow-inner rounded-xl bg-muted p-5 ring-1 ring-border">
            <div className="bg-white rounded-lg border p-6 shadow-md">
              <FormBuilderClient form={form} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
