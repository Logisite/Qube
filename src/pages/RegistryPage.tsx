import { useMemo } from "react"
import { useAccount } from "wagmi"
import { useRegistryPairs } from "@/hooks/useRegistryPairs"
import { mergePairs } from "@/lib/mergePairs"
import { getTokenPairsForChain } from "@/lib/tokens"
import { getChainConfig } from "@/lib/chains"
import { RegistryGrid } from "@/components/registry/RegistryGrid"
import { RegistryBanner } from "@/components/registry/RegistryBanner"
import { WhyCanonicalPairs } from "@/components/registry/WhyCanonicalPairs"

export function RegistryPage() {
  const { chainId } = useAccount()
  const chainConfig = getChainConfig(chainId)
  const localPairs = getTokenPairsForChain(chainId)
  const { pairs: onChainPairs, isLoading, refetch, isFromChain } = useRegistryPairs()
  const mergedPairs = useMemo(
    () => mergePairs(onChainPairs, localPairs),
    [onChainPairs, localPairs],
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Registry</h1>
        <p className="text-muted-foreground max-w-prose">
          Browse all official confidential token wrapper pairs on {chainConfig.name}. Each
          pair maps a public ERC-20 token to its encrypted ERC-7984 wrapper.
        </p>
      </div>

      <RegistryBanner isFromChain={isFromChain} onRetry={() => { refetch() }} />

      <RegistryGrid
        pairs={mergedPairs}
        isLoading={isLoading}
      />

      <WhyCanonicalPairs />
    </div>
  )
}
