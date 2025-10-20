import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SubmissionsRealTime } from "@/components/submissions-real-time"
import { Button } from "@/components/ui/button"
import { getForm, getSubmissionCount, getSubmissions } from "@/lib/redis"

export default async function SubmissionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page = "1" } = await searchParams
  const form = await getForm(id)

  if (!form) {
    notFound()
  }

  const currentPage = Number.parseInt(page, 10)
  const limit = 20
  const offset = (currentPage - 1) * limit

  const submissions = await getSubmissions(id, limit, offset)
  const totalCount = await getSubmissionCount(id)
  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forms
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Submissions</h1>
              <p className="text-zinc-600">
                {form.title} - {totalCount} submission
                {totalCount !== 1 ? "s" : ""}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/forms/${id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Form
              </Link>
            </Button>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">No submissions yet</h2>
            <p className="text-zinc-600 mb-6">
              Submissions will appear here once users fill out your form
            </p>
            <Button asChild>
              <Link href={`/forms/${id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Form
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <SubmissionsRealTime
              formId={id}
              initialSubmissions={submissions}
              formFields={form.fields}
            />

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-zinc-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Button asChild variant="outline">
                      <Link
                        href={`/forms/${id}/submissions?page=${
                          currentPage - 1
                        }`}
                      >
                        Previous
                      </Link>
                    </Button>
                  )}
                  {currentPage < totalPages && (
                    <Button asChild variant="outline">
                      <Link
                        href={`/forms/${id}/submissions?page=${
                          currentPage + 1
                        }`}
                      >
                        Next
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
