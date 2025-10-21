import { ArrowLeft, Edit, FileText } from "lucide-react"
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
      <div className="container max-w-7xl mx-auto px-4 lg:py-10 py-5 lg:grid flex flex-col-reverse grid-cols-12 gap-10">
        <div className="col-span-2 flex flex-col gap-2 md:items-start items-center">
          <Button className="lg:hidden flex" asChild variant="outline">
            <Link href={`/forms/${id}/submissions`}>
              <FileText className="h-4 w-4 mr-2" />
              View Submissions
            </Link>
          </Button>
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forms
            </Link>
          </Button>
        </div>
        <div className="col-span-8">
          <div className="lg:mb-8 mb-5">
            <div className="flex lg:flex-row flex-col lg:items-end lg:gap-16 lg:justify-between">
              <div>
                <div className="inline-flex items-baseline gap-2 flex-wrap">
                  <h1 className="lg:text-4xl text-3xl font-bold lg:mb-2">
                    {form.title}
                  </h1>
                  <Button size="icon" asChild variant="ghost">
                    <Link href={`/forms/${id}/edit`}>
                      <Edit className="size-4" />
                    </Link>
                  </Button>
                </div>
                {form.description && (
                  <p className="text-zinc-600">{form.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button className="lg:flex hidden" asChild variant="outline">
                  <Link href={`/forms/${id}/submissions`}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Submissions
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="shadow-inner rounded-xl bg-muted p-5 ring-1 ring-border">
            <div className="bg-white rounded-lg border p-6 shadow-md">
              <FormRendererClient form={form} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
