import { Link } from "react-router"
import { ExternalLink } from "lucide-react"
import type { TokenPair } from "@/lib/tokens"
import { DecryptBalanceButton } from "@/components/decrypt/DecryptBalanceButton"
import { Button } from "@/components/ui/button"

export function ConfidentialAssetRow({ pair }: { pair: TokenPair }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-medium text-card-foreground">
          {pair.displayName}
        </p>
        <p className="text-xs text-muted-foreground">
          Confidential balance
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <DecryptBalanceButton
          wrapperAddress={pair.erc7984.address}
          decimals={pair.erc7984.decimals}
          displayName={pair.displayName}
        />
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/unwrap?token=${pair.symbol}`}>
            Unwrap
            <ExternalLink className="size-3 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
