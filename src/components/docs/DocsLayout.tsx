import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router"
import { DocsHeader } from "./DocsHeader"
import { DocsSidebar } from "./DocsSidebar"
import { DocsTOC } from "./DocsTOC"
import { DocsSearch } from "./DocsSearch"
import { DocsBreadcrumbs } from "./DocsBreadcrumbs"
import { DocsPrevNext } from "./DocsPrevNext"
import { getDocBySlug } from "@/lib/docs"

interface TocItem {
  id: string
  text: string
  level: number
}

export function DocsLayout() {
  const { pathname } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const slug = pathname.split("/docs/")[1] || "introduction"
  const doc = getDocBySlug(slug)

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-[#000] text-white">
      <DocsHeader onSearchOpen={() => setSearchOpen(true)} />
      <DocsSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white text-black shadow-lg cursor-pointer"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute left-0 top-14 bottom-0 w-[280px] bg-[#0a0a0a] border-r border-white/10 overflow-y-auto">
            <DocsSidebar currentSlug={slug} />
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="max-w-[1600px] mx-auto flex pt-14">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <DocsSidebar currentSlug={slug} />
        </div>

        {/* Content area */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[768px] mx-auto px-6 md:px-10 py-10">
            {doc && <DocsBreadcrumbs currentTitle={doc.title} />}
            <Outlet context={{ headings, setHeadings }} />
            <DocsPrevNext currentSlug={slug} />
          </div>
        </main>

        {/* Desktop TOC */}
        <div className="hidden xl:block">
          <DocsTOC headings={headings} />
        </div>
      </div>
    </div>
  )
}
