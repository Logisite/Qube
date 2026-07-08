import { useState, useCallback } from "react"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Loader2, Rocket, Unlock, Lock, History, AlertTriangle } from "lucide-react"
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
import { ActivitySection } from "./assets/ActivitySection"
import { CustomTokenInput } from "./assets/CustomTokenInput"

type AssetView = "standard" | "confidential" | "activity"

export function AssetsPage() {
  const { isConnected, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { mint, mintAll, isPending } = useFaucet()
  const { balances, refetch: refetchBalances } = useAllTokenBalances()
  const [view, setView] = useState<AssetView>("standard")
  const pairs = getTokenPairsForChain(chainId)

  const isLocked = view === "confidential"

  function togglePadlock() {
    if (view === "activity") {
      setView("standard")
    } else {
      setView(view === "standard" ? "confidential" : "standard")
    }
  }

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
      {/* Fixed header — never scrolls */}
      <div className="shrink-0 text-center pt-4 pb-2">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-card-foreground">Assets</h1>
          <p className="text-xs text-muted-foreground">
            Your tokens, balances, and actions.
          </p>
        </div>
      </div>

      {/* Fixed toggle bar — never scrolls */}
      <div className="shrink-0 px-4 pb-3">
        <div className="max-w-2xl mx-auto">
          {!isConnected ? null : !isSupportedChain(chainId) ? null : (
            <div className="flex items-center gap-3">
              <nav
                className="assets-toggle"
                data-active={view === "activity" ? "2" : "1"}
              >
                <div className="assets-toggle__track" />
                <button
                  type="button"
                  onClick={togglePadlock}
                  className="assets-toggle__option"
                  aria-label={isLocked ? "Switch to Standard" : "Switch to Confidential"}
                >
                  {isLocked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                  <span>Lock</span>
                </button>
                <button
                  type="button"
                  onClick={() => setView("activity")}
                  className="assets-toggle__option"
                  aria-label="Activity"
                >
                  <History className="size-3.5" />
                  <span>History</span>
                </button>
              </nav>
              <span className="text-sm font-medium text-card-foreground">
                {view === "standard" && "Standard Assets"}
                {view === "confidential" && "Confidential Assets"}
                {view === "activity" && "Activity"}
              </span>
              <div className="ml-auto">
                {view === "standard" && (
                  <Button onClick={handleMintAll} disabled={isPending} size="sm">
                    {isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Rocket className="size-3.5" />
                    )}
                    {isPending ? "Minting..." : "Top Up All"}
                  </Button>
                )}
                {view === "confidential" && <DecryptAllButton />}
              </div>
            </div>
          )}
        </div>
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
              {view === "activity" && <ActivitySection />}

              {/* Track Other Token — only in confidential view */}
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
