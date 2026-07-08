import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { Search, X } from "lucide-react"
import { getAllDocPages, type DocPage } from "@/lib/docs"

interface DocsSearchProps {
  isOpen: boolean
  onClose: () => void
}

const ALL_PAGES = getAllDocPages()

export function DocsSearch({ isOpen, onClose }: DocsSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<DocPage[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const lower = query.toLowerCase()
    const filtered = ALL_PAGES.filter(
      (page) =>
        page.title.toLowerCase().includes(lower) ||
        page.description.toLowerCase().includes(lower) ||
        page.slug.toLowerCase().includes(lower)
    )
    setResults(filtered)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          // Parent should open
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-white/10">
          <Search className="h-4 w-4 text-white/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex-1 py-3 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
          />
          <button
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((page) => (
              <li key={page.slug}>
                <button
                  onClick={() => {
                    navigate(`/docs/${page.slug}`)
                    onClose()
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="text-sm text-white font-medium">{page.title}</div>
                  <div className="text-xs text-white/40 mt-0.5">{page.description}</div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-white/40">
            No results found for "{query}"
          </div>
        )}

        {!query && (
          <div className="px-4 py-6 text-center text-sm text-white/30">
            Type to search documentation...
          </div>
        )}
      </div>
    </div>
  )
}
