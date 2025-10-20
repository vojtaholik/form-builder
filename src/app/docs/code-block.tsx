import { codeToHtml } from "shiki"
import { CopyButton } from "./copy-button"

interface CodeBlockProps {
  code: string
  language: "bash" | "javascript" | "json"
  title: string
}

export async function CodeBlock({ code, language, title }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-dark",
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        <CopyButton text={code} />
      </div>
      <div
        className="rounded-lg overflow-x-auto text-sm [&_pre]:!bg-zinc-900 bg-zinc-900 [&_pre]:p-4 [&_pre]:m-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
