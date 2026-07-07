import { useState, useMemo } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import type { MergedPair } from "@/lib/mergePairs"
import { TokenRow } from "./TokenRow"

interface RegistryGridProps {
  pairs: MergedPair[]
  isLoading: boolean
}

type SortKey = "name-asc" | "name-desc" | "symbol"

const SORTS: { key: SortKey; label: string }[] = [
  { key: "name-asc", label: "Name A-Z" },
  { key: "name-desc", label: "Name Z-A" },
  { key: "symbol", label: "Symbol" },
]

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-muted animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-muted animate-pulse" /></td>
      <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-28 rounded bg-muted animate-pulse" /></td>
      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-28 rounded bg-muted animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-5 w-16 rounded-full bg-muted animate-pulse" /></td>
    </tr>
  )
}

export function RegistryGrid({ pairs, isLoading }: RegistryGridProps) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("name-asc")

  const filtered = useMemo(() => {
    let result = pairs

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.symbol.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.displayName.toLowerCase().includes(q) ||
          p.erc20.address.toLowerCase().includes(q) ||
          p.erc7984.address.toLowerCase().includes(q),
      )
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "symbol":
          return a.symbol.localeCompare(b.symbol)
        default:
          return 0
      }
    })

    return result
  }, [pairs, query, sort])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
            <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Token</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Symbol</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Wrapper</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Underlying</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (pairs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="font-medium text-foreground">No pairs found</p>
        <p className="text-sm text-muted-foreground">
          The registry returned no token pairs.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, symbol, or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="font-medium text-foreground">No matching pairs</p>
          <p className="text-sm text-muted-foreground">
            No pairs match &ldquo;{query}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Token</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Symbol</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Wrapper</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Underlying</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pair) => (
                <TokenRow
                  key={pair.erc20.address}
                  pair={pair}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
