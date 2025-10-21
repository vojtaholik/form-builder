import { Edit, ExternalLink, File, FileText, Plus } from "lucide-react"
import Link from "next/link"
import pluralize from "pluralize"
import { DeleteFormButton } from "@/components/delete-form-button"
import { RecentSubmissionsFeed } from "@/components/recent-submissions-feed"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAllForms } from "@/lib/redis"

export default async function Home() {
  const forms = await getAllForms()

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto lg:py-10 py-6 px-4 max-w-7xl">
        <div className="lg:grid flex flex-col grid-cols-12 gap-5">
          <section className="lg:col-span-8">
            <h2 className="text-xl font-semibold mb-4">Forms</h2>
            <div className="p-5 bg-muted shadow-inner rounded-xl ring-1 ring-border">
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
                    <Card key={form.id} className="gap-2">
                      <CardHeader>
                        <CardTitle>
                          <h3 className="text-xl font-semibold">
                            <Link
                              className="hover:underline inline-flex items-center gap-2"
                              href={`/forms/${form.id}`}
                            >
                              <File className="size-4 opacity-50" />{" "}
                              {form.title}
                            </Link>
                          </h3>
                        </CardTitle>
                      </CardHeader>
                      {form.description && (
                        <CardContent className="mb-3">
                          <CardDescription>
                            <p>{form.description}</p>
                          </CardDescription>
                        </CardContent>
                      )}
                      <CardFooter className="border-t border-border md:flex-row flex-col-reverse gap-5 flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/forms/${form.id}`}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/forms/${form.id}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/forms/${form.id}/submissions`}>
                              <FileText className="h-4 w-4 mr-1" />
                              Submissions
                            </Link>
                          </Button>
                          {process.env.NEXT_PUBLIC_ALLOW_FORM_DELETION ===
                            "true" && (
                            <DeleteFormButton
                              formId={form.id}
                              formTitle={form.title}
                            />
                          )}
                        </div>
                        <div className="flex text-sm items-center gap-2">
                          <span>
                            {form.fields.length}{" "}
                            {pluralize("field", form.fields.length)}
                          </span>
                          <span>•</span>
                          <span>
                            Created{" "}
                            {new Date(form.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          <RecentSubmissionsFeed />
        </div>
      </div>
    </div>
  )
}
