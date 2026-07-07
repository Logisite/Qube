import { useAccount } from "wagmi"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RegistryBannerProps {
  isFromChain: boolean
  onRetry?: () => void
}

export function RegistryBanner({ isFromChain, onRetry }: RegistryBannerProps) {
  const { isConnected } = useAccount()

  if (isFromChain) return null

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <AlertTriangle className="size-5 text-warning shrink-0" />
        <p className="text-sm text-foreground">
          {isConnected
            ? "Could not reach the registry. Showing cached pairs."
            : "Connect your wallet to load live on-chain pairs. Showing cached data."}
        </p>
      </div>
      {isConnected && onRetry && (
        <div className="shrink-0">
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="size-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}
