import { type TokenPair } from "@/lib/tokens"

export type MergedPair = TokenPair & { source: "on-chain" | "local" | "cached" }

export function mergePairs(
  onChainPairs: readonly MergedPair[],
  localPairs: readonly TokenPair[],
  isFromChain: boolean,
): MergedPair[] {
  if (isFromChain && onChainPairs.length > 0) {
    return [...onChainPairs]
  }
  return localPairs.map((tp) => ({ ...tp, source: "local" as const }))
}
