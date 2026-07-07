import { useState } from "react"
import { formatUnits } from "viem"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getClaimAmount, hasPublicMint } from "@/lib/mint-abi"
import type { TokenPair } from "@/lib/tokens"

interface TokenClaimRowProps {
  pair: TokenPair
  onClaim: (tokenAddress: `0x${string}`, rawAmount: bigint) => Promise<unknown>
  disabled: boolean
  balance: bigint | undefined
  onRefetch: () => void
}

export function TokenClaimRow({ pair, onClaim, disabled, balance, onRefetch }: TokenClaimRowProps) {
  const [isClaiming, setIsClaiming] = useState(false)

  const isPublic = hasPublicMint(pair)
  const { display, raw } = getClaimAmount(pair)

  async function handleClaim() {
    setIsClaiming(true)
    try {
      await onClaim(pair.erc20.address, raw)
      onRefetch()
      toast.success(`${pair.displayName} minted`)
    } catch {
      toast.error(`${pair.displayName} mint failed`)
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-medium text-card-foreground">
          {pair.displayName}
        </p>
        <p className="text-xs text-muted-foreground">
          Balance: {balance !== undefined ? formatUnits(balance, pair.erc20.decimals) : "0"}
        </p>
      </div>
      {isPublic ? (
        <span className="shrink-0 rounded-md bg-muted/50 px-2 py-0.5 text-xs font-medium text-foreground">
          {display}
        </span>
      ) : (
        <span className="shrink-0 rounded-md bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
          Restricted
        </span>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleClaim}
        disabled={disabled || isClaiming || !isPublic}
      >
        {isClaiming && <Loader2 className="size-3.5 animate-spin" />}
        {isClaiming ? "Claiming" : "Claim"}
      </Button>
    </div>
  )
}
