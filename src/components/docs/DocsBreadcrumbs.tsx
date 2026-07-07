import { Link } from "react-router"
import { ChevronRight } from "lucide-react"

interface DocsBreadcrumbsProps {
  currentTitle: string
}

export function DocsBreadcrumbs({ currentTitle }: DocsBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
      <Link to="/" className="hover:text-white/70 transition-colors no-underline text-white/40">
        Home
      </Link>
      <ChevronRight className="h-3 w-3" />
      <Link to="/docs/introduction" className="hover:text-white/70 transition-colors no-underline text-white/40">
        Docs
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-white/70">{currentTitle}</span>
    </nav>
  )
}
