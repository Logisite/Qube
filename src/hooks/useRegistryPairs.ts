import { useAccount } from "wagmi"
import { useListPairs } from "@zama-fhe/react-sdk"
import type { TokenWrapperPairWithMetadata } from "@zama-fhe/react-sdk"
import type { UseQueryResult } from "@tanstack/react-query"
import { getTokenPairsForChain } from "@/lib/tokens"
import type { MergedPair } from "@/lib/mergePairs"

const CACHE_KEY = "registry-cached-pairs"

export interface RegistryPairsResult {
  pairs: MergedPair[]
  isLoading: boolean
  error: Error | null
  total: number
  isFromChain: boolean
  refetch: () => Promise<UseQueryResult>
}

function toMergedPair(item: TokenWrapperPairWithMetadata, localPairs: ReturnType<typeof getTokenPairsForChain>): MergedPair {
  const symbol = item.confidential.symbol
  const local = localPairs.find((tp) => tp.erc20.address.toLowerCase() === item.tokenAddress.toLowerCase())

  return {
    symbol,
    name: item.confidential.name,
    displayName: local?.displayName ?? symbol.replace(/^c/, "").replace(/Mock$/, ""),
    erc20: {
      address: item.tokenAddress,
      decimals: item.underlying.decimals,
    },
    erc7984: {
      address: item.confidentialTokenAddress,
      decimals: item.confidential.decimals,
    },
    source: "on-chain",
  }
}

function localFallback(chainId: number | undefined): MergedPair[] {
  return getTokenPairsForChain(chainId).map((tp) => ({
    ...tp,
    source: "local" as const,
  }))
}

function loadCache(): MergedPair[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw) as { pairs: MergedPair[]; timestamp: number }
    return cached.pairs
  } catch {
    return null
  }
}

function saveCache(pairs: MergedPair[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ pairs, timestamp: Date.now() }))
  } catch {
    // localStorage full or unavailable silently ignore
  }
}

export function useRegistryPairs(): RegistryPairsResult {
  const { chainId } = useAccount()
  const { data, isLoading, error, refetch } = useListPairs({
    page: 1,
    pageSize: 100,
    metadata: true,
  })

  if (isLoading) {
    return {
      pairs: [],
      isLoading: true,
      error: null,
      total: 0,
      isFromChain: false,
      refetch,
    }
  }

  if (error || !data || data.items.length === 0) {
    const cached = loadCache()
    if (cached && cached.length > 0) {
      return {
        pairs: cached,
        isLoading: false,
        error,
        total: cached.length,
        isFromChain: false,
        refetch,
      }
    }
    const fallbackPairs = localFallback(chainId)
    return {
      pairs: fallbackPairs,
      isLoading: false,
      error,
      total: fallbackPairs.length,
      isFromChain: false,
      refetch,
    }
  }

  const localPairs = getTokenPairsForChain(chainId)
  const pairs: MergedPair[] = data.items.map((item) => {
    if ("underlying" in item && "confidential" in item) {
      return toMergedPair(item as TokenWrapperPairWithMetadata, localPairs)
    }
    return {
      symbol: "Unknown",
      name: "Unknown Token",
      displayName: "Unknown",
      erc20: { address: item.tokenAddress, decimals: 0 },
      erc7984: { address: item.confidentialTokenAddress, decimals: 0 },
      source: "on-chain" as const,
    }
  })

  saveCache(pairs)

  return {
    pairs,
    isLoading: false,
    error: null,
    total: data.total,
    isFromChain: true,
    refetch,
  }
}
