import { useAccount } from "wagmi"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { getChainConfig } from "@/lib/chains"

export function WhyCanonicalPairs() {
  const { chainId } = useAccount()
  const chainConfig = getChainConfig(chainId)

  const rows: [string, string][] = [
    [
      "Each team deploys own test tokens",
      `Official cTokenMocks on ${chainConfig.shortName}`,
    ],
    [
      "Wallet full of non-interoperable assets",
      "All wrappers registered in one registry",
    ],
    [
      "Integrations don't compose",
      "Same token pairs across all dApps",
    ],
    [
      "Hard to find which tokens are real",
      "One registry, one source of truth",
    ],
    [
      "New teams waste time deploying wrappers",
      "Just use the existing ones",
    ],
    [
      "No standard addresses",
      "Registered pairs have canonical addresses",
    ],
  ]

  return (
    <section className="mt-12 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Why Official Pairs?</h2>
        <p className="text-muted-foreground max-w-prose">
          One app. One registry. All canonical pairs. Zero fragmentation. The
          Confidential Token Wrappers Registry is the single source of truth for
          ERC-20 to ERC-7984 token pairs on {chainConfig.name}. Use official pairs so your
          dApp composes with every other dApp in the ecosystem.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-destructive">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldAlert className="size-4" />
                  Fragmentation
                </span>
              </th>
              <th className="px-4 py-3 text-left font-medium text-success">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-4" />
                  Canonical
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([bad, good], i) => (
              <tr
                key={i}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-2.5 text-muted-foreground">{bad}</td>
                <td className="px-4 py-2.5 text-foreground">{good}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
