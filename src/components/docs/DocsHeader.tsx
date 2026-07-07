import { Link } from "react-router"
import { Search, ExternalLink } from "lucide-react"
import logoWhite from "@/assets/logos/logo-white.svg"

interface DocsHeaderProps {
  onSearchOpen: () => void
}

export function DocsHeader({ onSearchOpen }: DocsHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 no-underline">
            <img src={logoWhite} alt="Qube" className="h-7 w-7" />
            <span className="font-display text-lg font-black tracking-tight text-white">
              Qube
            </span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-white/20" />
          <span className="hidden sm:block text-sm text-white/50">Docs</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 hover:text-white/70 transition-colors cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/40 font-mono">
              Ctrl K
            </kbd>
          </button>

          <Link
            to="/registry"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 hover:text-white transition-colors no-underline"
          >
            <span className="hidden sm:inline">Registry</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
