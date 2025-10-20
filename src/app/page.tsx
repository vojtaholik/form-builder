import { Edit, ExternalLink, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { RecentSubmissionsFeed } from "@/components/recent-submissions-feed"
import { Button } from "@/components/ui/button"
import { getAllForms } from "@/lib/redis"

export default async function Home() {
  const forms = await getAllForms()

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Form Builder</h1>
            <p className="text-zinc-600">
              Create, manage, and collect submissions from your forms
            </p>
          </div>
          <Button asChild>
            <Link href="/forms/new">
              <Plus className="h-4 w-4 mr-2" />
              Create New Form
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {forms.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed p-12 text-center">
                <h2 className="text-xl font-semibold mb-2">No forms yet</h2>
                <p className="text-zinc-600 mb-6">
                  Get started by creating your first form
                </p>
                <Button asChild>
                  <Link href="/forms/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Form
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">
                          {form.title}
                        </h3>
                        {form.description && (
                          <p className="text-zinc-600 mb-3">
                            {form.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <span>{form.fields.length} fields</span>
                          <span>•</span>
                          <span>
                            Created{" "}
                            {new Date(form.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/forms/${form.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/forms/${form.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/forms/${form.id}/submissions`}>
                            <FileText className="h-4 w-4 mr-1" />
                            Submissions
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <RecentSubmissionsFeed />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/docs">View API Documentation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
