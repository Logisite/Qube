import { useMemo } from "react"
import { useSearchParams } from "react-router"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WrapForm } from "@/components/wrap/WrapForm"
import { useRegistryPairs } from "@/hooks/useRegistryPairs"
import { mergePairs } from "@/lib/mergePairs"
import { getTokenPairsForChain } from "@/lib/tokens"
import { isSupportedChain } from "@/lib/chains"

export function WrapPage() {
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
        <h1 className="text-3xl font-bold text-card-foreground">Wrap</h1>
        <p className="text-muted-foreground">
          Convert public ERC-20 to confidential tokens.
        </p>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Button onClick={openConnectModal} variant="outline" size="sm">
            Connect Wallet
          </Button>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to wrap tokens.
          </p>
        </div>
      ) : isSupportedChain(chainId) ? (
        <WrapForm pairs={mergedPairs} initialTokenIndex={initialTokenIndex} />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <AlertTriangle className="size-5 text-yellow-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Unsupported Network</p>
            <p className="text-xs text-muted-foreground">
              Connect to Sepolia or Ethereum mainnet to wrap tokens.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
