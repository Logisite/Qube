import { type TokenPair } from "@/lib/tokens"

export type MergedPair = TokenPair & { source: "on-chain" | "local" | "cached" }

export function mergePairs(
  onChainPairs: readonly MergedPair[],
  localPairs: readonly TokenPair[],
  isFromChain: boolean,
): MergedPair[] {
  if (!isFromChain || onChainPairs.length === 0) {
    return localPairs.map((tp) => ({ ...tp, source: "local" as const }))
  }

  const onChainAddresses = new Set(
    onChainPairs.map((p) => p.erc20.address.toLowerCase()),
  )

  const result: MergedPair[] = [...onChainPairs]

  for (const lp of localPairs) {
    if (!onChainAddresses.has(lp.erc20.address.toLowerCase())) {
      result.push({ ...lp, source: "local" as const })
    }
  }

  return result
}
