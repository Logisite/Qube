import { Link } from "react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getDocNavigation } from "@/lib/docs"

interface DocsPrevNextProps {
  currentSlug: string
}

export function DocsPrevNext({ currentSlug }: DocsPrevNextProps) {
  const { prev, next } = getDocNavigation(currentSlug)

  if (!prev && !next) return null

  return (
    <div className="border-t border-white/10 mt-12 pt-8 flex gap-4">
      {prev ? (
        <Link
          to={`/docs/${prev.slug}`}
          className="flex-1 group p-4 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all no-underline"
        >
          <div className="flex items-center gap-1 text-xs text-white/40 mb-1">
            <ChevronLeft className="h-3 w-3" />
            Previous
          </div>
          <div className="text-sm text-white/70 group-hover:text-white transition-colors font-medium">
            {prev.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          to={`/docs/${next.slug}`}
          className="flex-1 group p-4 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-right no-underline"
        >
          <div className="flex items-center justify-end gap-1 text-xs text-white/40 mb-1">
            Next
            <ChevronRight className="h-3 w-3" />
          </div>
          <div className="text-sm text-white/70 group-hover:text-white transition-colors font-medium">
            {next.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}
