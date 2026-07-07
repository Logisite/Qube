import { useAccount, useSwitchChain } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTokenPairsForChain } from "@/lib/tokens"
import { isTestnet } from "@/lib/chains"
import { useFaucet } from "@/hooks/useFaucet"
import { useAllTokenBalances } from "@/hooks/useAllTokenBalances"
import { MintBundleButton } from "@/components/faucet/MintBundleButton"
import { TokenClaimRow } from "@/components/faucet/TokenClaimRow"

export function FaucetPage() {
  const { isConnected, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { mint, mintAll, isPending, currentIndex } = useFaucet()
  const { balances, refetch: refetchBalances } = useAllTokenBalances()

  const onTestnet = isTestnet(chainId)
  const allPairs = getTokenPairsForChain(chainId)
  const FAUCET_PAIRS = allPairs.filter((p) => p.symbol.includes("Mock"))

  async function handleMintAll() {
    toast.promise(mintAll(FAUCET_PAIRS), {
      loading: "Minting dev bundle...",
      success: (result) => `Minted ${result.successCount} tokens`,
      error: (err) => {
        if (err && typeof err === "object" && "completedCount" in err) {
          const failed = "failedIndex" in err ? Number(err.failedIndex) : 0
          const done = "completedCount" in err ? Number(err.completedCount) : 0
          return `Minting stopped at token ${failed + 1} ${done}/7 completed`
        }
        return "Bundle mint failed"
      },
    })
  }

  if (!onTestnet) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-card-foreground">Developer Faucet</h1>
          <p className="text-muted-foreground">Claim test tokens instantly.</p>
        </div>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="size-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <AlertTriangle className="size-6 text-yellow-500" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">Faucet not available on Mainnet</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              The faucet only works on testnet. Switch to Sepolia to claim free test tokens.
            </p>
            <Button
              onClick={() => switchChain({ chainId: 11155111 })}
              disabled={isSwitching}
              size="sm"
              variant="outline"
            >
              {isSwitching ? "Switching..." : "Switch to Sepolia"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-card-foreground">Developer Faucet</h1>
        <p className="text-muted-foreground">Claim test tokens instantly.</p>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Button onClick={openConnectModal} variant="outline" size="sm">
            Connect Wallet
          </Button>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to claim test tokens.
          </p>
        </div>
      ) : (
        <>
          <MintBundleButton
            onMintAll={handleMintAll}
            isPending={isPending}
            currentIndex={currentIndex}
            totalTokens={FAUCET_PAIRS.length}
            pairs={FAUCET_PAIRS}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Or claim individually
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {FAUCET_PAIRS.map((pair) => (
              <TokenClaimRow
                key={pair.erc20.address}
                pair={pair}
                onClaim={mint}
                disabled={isPending}
                balance={balances.get(pair.erc20.address)}
                onRefetch={refetchBalances}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
