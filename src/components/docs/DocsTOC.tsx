import { useState, useEffect, useCallback } from "react"

interface TocItem {
  id: string
  text: string
  level: number
}

interface DocsTOCProps {
  headings: TocItem[]
}

export function DocsTOC({ headings }: DocsTOCProps) {
  const [activeId, setActiveId] = useState<string>("")

  const handleScroll = useCallback(() => {
    const headings = document.querySelectorAll("h2[id], h3[id]")
    let current = ""

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect()
      if (rect.top <= 120) {
        current = heading.id
      }
    })

    setActiveId(current)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  if (headings.length === 0) return null

  return (
    <nav className="w-[220px] shrink-0 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto py-6 pl-4 custom-scrollbar">
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white/30 mb-3">
        On this page
      </h4>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: heading.level === 3 ? "12px" : "0" }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(heading.id)
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              }}
              className={`block text-[13px] py-1 border-l-2 transition-colors no-underline ${
                activeId === heading.id
                  ? "border-white text-white pl-3"
                  : "border-transparent text-white/40 hover:text-white/70 pl-3"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
