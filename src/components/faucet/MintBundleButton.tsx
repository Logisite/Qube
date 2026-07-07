import { Loader2, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TokenPair } from "@/lib/tokens"

interface MintBundleButtonProps {
  onMintAll: () => Promise<unknown>
  isPending: boolean
  currentIndex: number
  totalTokens: number
  pairs: TokenPair[]
}

export function MintBundleButton({
  onMintAll,
  isPending,
  currentIndex,
  totalTokens,
  pairs,
}: MintBundleButtonProps) {
  const summary = pairs
    .map((p) => {
      const amount = p.symbol.includes("WETH") ? "1" : "1M"
      return `${amount} ${p.displayName}`
    })
    .join(" · ")

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
        {summary}
      </p>
    </div>
  )
}
