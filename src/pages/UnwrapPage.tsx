import { useMemo } from "react"
import { useSearchParams } from "react-router"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { UnwrapForm } from "@/components/unwrap/UnwrapForm"
import { useRegistryPairs } from "@/hooks/useRegistryPairs"
import { mergePairs } from "@/lib/mergePairs"
import { getTokenPairsForChain } from "@/lib/tokens"

export function UnwrapPage() {
  const { isConnected, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [searchParams] = useSearchParams()

  const { pairs: onChainPairs } = useRegistryPairs()
  const localPairs = useMemo(() => getTokenPairsForChain(chainId), [chainId])
  const mergedPairs = useMemo(() => mergePairs(onChainPairs, localPairs), [onChainPairs, localPairs])

  const initialTokenIndex = useMemo(() => {
    const tokenParam = searchParams.get("token")
    if (!tokenParam) return 0
    const idx = mergedPairs.findIndex((tp) => tp.symbol === tokenParam)
    return idx >= 0 ? idx : 0
  }, [searchParams, mergedPairs])

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-card-foreground">Unwrap</h1>
        <p className="text-muted-foreground">
          Convert confidential tokens back to public ERC-20.
        </p>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Button onClick={openConnectModal} variant="outline" size="sm">
            Connect Wallet
          </Button>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to unwrap tokens.
          </p>
        </div>
      ) : (
        <UnwrapForm pairs={mergedPairs} initialTokenIndex={initialTokenIndex} />
      )}
    </div>
  )
}
