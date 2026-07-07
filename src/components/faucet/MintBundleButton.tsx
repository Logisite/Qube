import { Loader2, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MintBundleButtonProps {
  onMintAll: () => Promise<unknown>
  isPending: boolean
  currentIndex: number
  totalTokens: number
}

export function MintBundleButton({
  onMintAll,
  isPending,
  currentIndex,
  totalTokens,
}: MintBundleButtonProps) {
  return (
    <div className="space-y-2">
      <Button
        className="w-full h-12 text-base font-semibold"
        onClick={onMintAll}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Rocket className="size-4" />
        )}
        {isPending
          ? `Minting ${currentIndex + 1}/${totalTokens}...`
          : "Mint Dev Bundle (1M of each)"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        1M USDC · 1M USDT · 1 WETH · 1M BRON · 1M ZAMA · 1M tGBP · 1M XAUt
      </p>
    </div>
  )
}
