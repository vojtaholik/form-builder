import { ArrowLeft, Copy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllForms } from "@/lib/redis"
import { CopyButton } from "./copy-button"

export default async function DocsPage() {
  const forms = await getAllForms()
  const exampleFormId = forms[0]?.id || "your-form-id"
  const apiKey = process.env.SUBMIT_API_KEY || "your-api-key"

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
          <h1 className="text-4xl font-bold mb-2">API Documentation</h1>
          <p className="text-zinc-600">
            Public API endpoints for external integrations
          </p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-zinc-600 mb-4">
              The Form Builder API provides RESTful endpoints for retrieving
              form schemas, listing submissions, and submitting form data
              programmatically.
            </p>
            <div className="bg-zinc-50 p-4 rounded-lg">
              <div className="font-mono text-sm">
                <strong>Base URL:</strong>{" "}
                {process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
            <p className="text-zinc-600 mb-4">
              Only the{" "}
              <code className="bg-zinc-100 px-2 py-1 rounded">
                POST /api/forms/:id/submissions
              </code>{" "}
              endpoint requires authentication. Include your API key in the{" "}
              <code className="bg-zinc-100 px-2 py-1 rounded">x-api-key</code>{" "}
              header.
            </p>
            <div className="bg-zinc-50 p-4 rounded-lg">
              <div className="font-mono text-sm">x-api-key: {apiKey}</div>
            </div>
          </section>

          {/* Endpoints */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

            {/* GET /api/forms */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 font-mono text-sm rounded">
                  GET
                </span>
                <code className="font-mono text-lg">/api/forms</code>
              </div>
              <p className="text-zinc-600 mb-4">List all form IDs.</p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">cURL</h4>
                    <CopyButton
                      text={`curl -X GET "${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        "https://your-domain.com"
                      }/api/forms"`}
                    />
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`curl -X GET "${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://your-domain.com"
                    }/api/forms"`}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">
                      JavaScript (fetch)
                    </h4>
                    <CopyButton
                      text={`fetch('${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        "https://your-domain.com"
                      }/api/forms')
  .then(res => res.json())
  .then(data => console.log(data));`}
                    />
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`fetch('${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://your-domain.com"
                    }/api/forms')
  .then(res => res.json())
  .then(data => console.log(data));`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* GET /api/forms/:id */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 font-mono text-sm rounded">
                  GET
                </span>
                <code className="font-mono text-lg">/api/forms/:id</code>
              </div>
              <p className="text-zinc-600 mb-4">Get form schema by ID.</p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">cURL</h4>
                    <CopyButton
                      text={`curl -X GET "${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        "https://your-domain.com"
                      }/api/forms/${exampleFormId}"`}
                    />
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`curl -X GET "${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://your-domain.com"
                    }/api/forms/${exampleFormId}"`}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">
                      JavaScript (fetch)
                    </h4>
                    <CopyButton
                      text={`fetch('${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        "https://your-domain.com"
                      }/api/forms/${exampleFormId}')
  .then(res => res.json())
  .then(data => console.log(data));`}
                    />
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`fetch('${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://your-domain.com"
                    }/api/forms/${exampleFormId}')
  .then(res => res.json())
  .then(data => console.log(data));`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* GET /api/forms/:id/submissions */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 font-mono text-sm rounded">
                  GET
                </span>
                <code className="font-mono text-lg">
                  /api/forms/:id/submissions
                </code>
              </div>
              <p className="text-zinc-600 mb-4">
                List submissions for a form. Supports pagination via{" "}
                <code className="bg-zinc-100 px-2 py-1 rounded">limit</code> and{" "}
                <code className="bg-zinc-100 px-2 py-1 rounded">offset</code>{" "}
                query parameters.
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">cURL</h4>
                    <CopyButton
                      text={`curl -X GET "${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        "https://your-domain.com"
                      }/api/forms/${exampleFormId}/submissions?limit=20&offset=0"`}
                    />
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`curl -X GET "${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://your-domain.com"
                    }/api/forms/${exampleFormId}/submissions?limit=20&offset=0"`}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">
                      JavaScript (fetch)
                    </h4>
                    <CopyButton
                      text={`fetch('${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        "https://your-domain.com"
                      }/api/forms/${exampleFormId}/submissions?limit=20&offset=0')
  .then(res => res.json())
  .then(data => console.log(data));`}
                    />
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`fetch('${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://your-domain.com"
                    }/api/forms/${exampleFormId}/submissions?limit=20&offset=0')
  .then(res => res.json())
  .then(data => console.log(data));`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* POST /api/forms/:id/submissions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 font-mono text-sm rounded">
                  POST
                </span>
                <code className="font-mono text-lg">
                  /api/forms/:id/submissions
                </code>
              </div>
              <p className="text-zinc-600 mb-4">
                Submit form data. Requires{" "}
                <code className="bg-zinc-100 px-2 py-1 rounded">x-api-key</code>{" "}
                header.
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">cURL</h4>
                    <CopyButton
                      text={`curl -X POST "${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        "https://your-domain.com"
                      }/api/forms/${exampleFormId}/submissions" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"field_id": "value"}'`}
                    />
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`curl -X POST "${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://your-domain.com"
                    }/api/forms/${exampleFormId}/submissions" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"field_id": "value"}'`}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">
                      JavaScript (fetch)
                    </h4>
                    <CopyButton
                      text={`fetch('${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        "https://your-domain.com"
                      }/api/forms/${exampleFormId}/submissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${apiKey}'
  },
  body: JSON.stringify({
    field_id: 'value'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));`}
                    />
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`fetch('${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://your-domain.com"
                    }/api/forms/${exampleFormId}/submissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${apiKey}'
  },
  body: JSON.stringify({
    field_id: 'value'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Response Format */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Response Format</h2>
            <p className="text-zinc-600 mb-4">
              All API responses follow this structure:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Success Response</h4>
                <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`{
  "success": true,
  "data": { ... }
}`}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Error Response</h4>
                <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // Optional validation errors
}`}</code>
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
