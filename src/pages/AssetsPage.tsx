import { useState, useCallback } from "react"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { getTokenPairsForChain } from "@/lib/tokens"
import { isSupportedChain } from "@/lib/chains"
import { useFaucet } from "@/hooks/useFaucet"
import { useAllTokenBalances } from "@/hooks/useAllTokenBalances"
import { Button } from "@/components/ui/button"
import { saveActivity } from "./assets/activity"
import { StandardAssetRow } from "./assets/StandardAssetRow"
import { ConfidentialAssetRow } from "./assets/ConfidentialAssetRow"
import { DecryptAllButton } from "./assets/DecryptAllButton"
import { CustomTokenInput } from "./assets/CustomTokenInput"

type AssetView = "standard" | "confidential"

export function AssetsPage() {
  const { isConnected, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { mint, mintAll, isPending } = useFaucet()
  const { balances, refetch: refetchBalances } = useAllTokenBalances()
  const [view, setView] = useState<AssetView>("standard")
  const pairs = getTokenPairsForChain(chainId)

  const handleMintAll = useCallback(async () => {
    const publicPairs = pairs.filter((p) => p.symbol.endsWith("Mock"))
    try {
      await mintAll(publicPairs)
      saveActivity({ type: "claim", token: "All tokens", amount: "Bundle", timestamp: Date.now() })
      toast.success("All test tokens minted")
    } catch {
      toast.error("Bundle mint failed")
    }
  }, [mintAll, pairs])

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Fixed segmented control bar — never scrolls */}
      <div className="shrink-0 px-4 pb-3">
        {!isConnected ? null : !isSupportedChain(chainId) ? null : (
          <div className="flex items-center">
            <div className="flex-1" />
            <nav className="assets-segmented" data-active={view}>
              <div className="assets-segmented__track" />
              <button
                type="button"
                onClick={() => setView("standard")}
                className="assets-segmented__option"
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setView("confidential")}
                className="assets-segmented__option"
              >
                Confidential
              </button>
            </nav>
            <div className="flex-1 flex justify-end">
              {view === "standard" && (
                <Button onClick={handleMintAll} disabled={isPending} size="sm">
                  {isPending ? "Minting..." : "Top Up All"}
                </Button>
              )}
              {view === "confidential" && <DecryptAllButton />}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable rows — only this scrolls */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {!isConnected ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Button onClick={openConnectModal} variant="outline" size="sm">
                Connect Wallet
              </Button>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to view assets.
              </p>
            </div>
          ) : !isSupportedChain(chainId) ? (
            <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <AlertTriangle className="size-5 text-yellow-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Unsupported Network</p>
                <p className="text-xs text-muted-foreground">
                  Connect to Sepolia or Ethereum mainnet to view assets.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {view === "standard" && pairs.map((pair) => (
                <StandardAssetRow
                  key={pair.erc20.address}
                  pair={pair}
                  isPending={isPending}
                  onMint={mint}
                  balance={balances.get(pair.erc20.address)}
                  onRefetch={refetchBalances}
                />
              ))}
              {view === "confidential" && pairs.map((pair) => (
                <ConfidentialAssetRow
                  key={pair.erc7984.address}
                  pair={pair}
                />
              ))}

              {view === "confidential" && (
                <div className="mt-8 space-y-3">
                  <h3 className="text-sm font-medium text-card-foreground">Track Other Token</h3>
                  <p className="text-xs text-muted-foreground">
                    Decrypt any ERC-7984 token, even outside the registry.
                  </p>
                  <CustomTokenInput />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
