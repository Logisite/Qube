import { useCallback, useEffect, useState } from "react"
import { useParams, useOutletContext } from "react-router"
import { DocsMarkdownRenderer } from "@/components/docs/DocsMarkdownRenderer"
import { getDocBySlug } from "@/lib/docs"

const markdownFiles = import.meta.glob("/src/docs/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>

interface DocContext {
  headings: { id: string; text: string; level: number }[]
  setHeadings: (headings: { id: string; text: string; level: number }[]) => void
}

export function DocsPage() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setHeadings } = useOutletContext<DocContext>()

  const handleHeadingsExtracted = useCallback(
    (headings: { id: string; text: string; level: number }[]) => {
      setHeadings(headings)
    },
    [setHeadings]
  )

  useEffect(() => {
    const currentSlug = slug || "introduction"
    const doc = getDocBySlug(currentSlug)

    if (!doc) {
      setError("Page not found")
      setLoading(false)
      return
    }

    const filePath = `/src/docs/${currentSlug}.md`
    const loader = markdownFiles[filePath]

    if (!loader) {
      setError("Page not found")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    loader()
      .then((raw) => {
        // Strip frontmatter
        const frontmatterRegex = /^---\n[\s\S]*?\n---\n/
        const cleanContent = raw.replace(frontmatterRegex, "")
        setContent(cleanContent)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load page")
        setLoading(false)
      })
  }, [slug])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/40 text-sm">{error}</div>
      </div>
    )
  }

  return (
    <DocsMarkdownRenderer content={content} onHeadingsExtracted={handleHeadingsExtracted} />
  )
}
