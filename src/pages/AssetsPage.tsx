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
    <div className="relative mx-auto max-w-2xl px-4 py-12">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-card-foreground">Assets</h1>
        <p className="text-muted-foreground">
          Your tokens, balances, and actions.
        </p>
      </div>

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
        <div className="flex gap-4 items-start">
          <nav
            className="glass-pill glass-pill--vertical sticky top-20 z-10 self-start"
            data-active={view === "activity" ? "2" : "1"}
          >
            <div className="glass-pill__track" />
            <button
              type="button"
              onClick={togglePadlock}
              className="glass-pill__option"
              style={{ color: view !== "activity" ? "var(--foreground)" : "var(--muted-foreground)" }}
              aria-label={isLocked ? "Switch to Standard" : "Switch to Confidential"}
            >
              {isLocked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => setView("activity")}
              className="glass-pill__option"
              style={{ color: view === "activity" ? "var(--foreground)" : "var(--muted-foreground)" }}
              aria-label="Activity"
            >
              <History className="size-4" />
            </button>
          </nav>

          <div className="flex-1 min-w-0 space-y-4">
            {view === "standard" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-card-foreground">Standard Assets</h2>
                   <Button onClick={handleMintAll} disabled={isPending} size="sm">
                     {isPending ? (
                       <Loader2 className="size-3.5 animate-spin" />
                     ) : (
                       <Rocket className="size-3.5" />
                     )}
                     {isPending ? "Minting..." : "Top Up All"}
                   </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Public ERC-20 tokens. Claim from the faucet, then wrap into confidential equivalents.
                </p>
                <div className="space-y-2">
                  {pairs.map((pair) => (
                    <StandardAssetRow
                      key={pair.erc20.address}
                      pair={pair}
                      isPending={isPending}
                      onMint={mint}
                      balance={balances.get(pair.erc20.address)}
                      onRefetch={refetchBalances}
                    />
                  ))}
                </div>
              </>
            )}

            {view === "confidential" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-card-foreground">Confidential Assets</h2>
                  <DecryptAllButton />
                </div>
                <p className="text-sm text-muted-foreground">
                  Encrypted ERC-7984 balances. Decrypt to view, unwrap to convert back.
                </p>
                <div className="space-y-2">
                  {pairs.map((pair) => (
                    <ConfidentialAssetRow
                      key={pair.erc7984.address}
                      pair={pair}
                    />
                  ))}
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <h3 className="text-sm font-medium text-card-foreground">Track Other Token</h3>
                  <p className="text-xs text-muted-foreground">
                    Decrypt any ERC-7984 token, even outside the registry.
                  </p>
                  <CustomTokenInput />
                </div>
              </>
            )}

            {view === "activity" && (
              <>
                <h2 className="text-lg font-medium text-card-foreground">Activity</h2>
                <ActivitySection />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
