import { NavLink } from "react-router"
import { DOC_GROUPS } from "@/lib/docs"

interface DocsSidebarProps {
  currentSlug: string
}

export function DocsSidebar({ currentSlug }: DocsSidebarProps) {
  return (
    <nav className="w-[260px] shrink-0 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto bg-[#0a0a0a] border-r border-white/10 py-6 px-4 custom-scrollbar">
      {DOC_GROUPS.map((group) => (
        <div key={group.title} className="mb-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/30 mb-2 px-2">
            {group.title}
          </h3>
          <ul className="space-y-0.5">
            {group.pages.map((page) => (
              <li key={page.slug}>
                <NavLink
                  to={`/docs/${page.slug}`}
                  className={`block px-2 py-1.5 text-sm rounded-md transition-colors no-underline ${
                    currentSlug === page.slug
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  {page.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
