import { type TokenPair } from "@/lib/tokens"

export type MergedPair = TokenPair & { source: "on-chain" | "local" | "cached" }

export function mergePairs(
  onChainPairs: readonly MergedPair[],
  localPairs: readonly TokenPair[],
): MergedPair[] {
  const result: MergedPair[] = []
  const matchedDisplayNames = new Set<string>()

  for (const oc of onChainPairs) {
    result.push(oc)
    matchedDisplayNames.add(oc.displayName.toLowerCase())
  }

  for (const lp of localPairs) {
    if (!matchedDisplayNames.has(lp.displayName.toLowerCase())) {
      result.push({ ...lp, source: "local" })
    }
  }

  return result
}
