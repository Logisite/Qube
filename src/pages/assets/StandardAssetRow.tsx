import { useState } from "react"
import { Link } from "react-router"
import { formatUnits } from "viem"
import { Loader2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import type { TokenPair } from "@/lib/tokens"
import { Button } from "@/components/ui/button"
import { saveActivity } from "./activity"

export function StandardAssetRow({
  pair,
  isPending,
  onMint,
  balance,
  onRefetch,
}: {
  pair: TokenPair
  isPending: boolean
  onMint: (tokenAddress: `0x${string}`, rawAmount: bigint) => Promise<unknown>
  balance: bigint | undefined
  onRefetch: () => void
}) {
  const [claiming, setClaiming] = useState(false)

  const isPublic = pair.symbol.endsWith("Mock")
  const claimAmount = pair.symbol === "cWETHMock" ? "1" : "1M"
  const claimRaw = pair.symbol === "cWETHMock"
    ? 10n ** BigInt(pair.erc20.decimals)
    : 1_000_000n * 10n ** BigInt(pair.erc20.decimals)

  async function handleClaim() {
    setClaiming(true)
    try {
      await onMint(pair.erc20.address, claimRaw)
      onRefetch()
      saveActivity({ type: "claim", token: pair.displayName, amount: claimAmount, timestamp: Date.now() })
      toast.success(`${pair.displayName} minted`)
    } catch {
      toast.error(`${pair.displayName} mint failed`)
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 px-2 py-3 hover:bg-white/[0.02] rounded-lg transition-colors">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-medium text-card-foreground">
          {pair.displayName}
        </p>
        <p className="text-xs text-muted-foreground">
          {balance !== undefined ? formatUnits(balance, pair.erc20.decimals) : "0"} {pair.displayName}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isPublic ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClaim}
            disabled={isPending || claiming}
          >
            {claiming && <Loader2 className="size-3.5 animate-spin" />}
            {claiming ? "Claiming" : `Top Up ${claimAmount}`}
          </Button>
        ) : (
          <span className="rounded-md bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
            Restricted
          </span>
        )}
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/wrap?token=${pair.symbol}`}>
            Wrap
            <ExternalLink className="size-3 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
