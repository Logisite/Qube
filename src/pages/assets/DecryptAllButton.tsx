import { useState } from "react"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getTokenPairsForChain } from "@/lib/tokens"
import { useDecryptBalances } from "@/hooks/useDecrypt"
import { Button } from "@/components/ui/button"
import { saveActivity } from "./activity"

export function DecryptAllButton() {
  const { chainId } = useAccount()
  const pairs = getTokenPairsForChain(chainId)
  const [decrypted, setDecrypted] = useState(false)
  const [batchResult, setBatchResult] = useState<{
    results: Map<string, bigint>
    errors: Map<string, Error>
  } | null>(null)
  const addresses = pairs.map((p) => p.erc7984.address)
  const { isLoading, refetch } = useDecryptBalances(addresses, false)

  async function handleDecryptAll() {
    if (decrypted) {
      setDecrypted(false)
      setBatchResult(null)
      return
    }
    try {
      const result = await refetch()
      if (result.data) {
        setBatchResult(result.data)
        setDecrypted(true)
        saveActivity({ type: "decrypt", token: "All tokens", timestamp: Date.now() })
      }
    } catch {
      toast.error("Batch decryption failed try individual decryption")
    }
  }

  if (decrypted && batchResult) {
    return (
      <div className="space-y-3">
        <Button variant="outline" size="sm" onClick={handleDecryptAll}>
          Hide All Balances
        </Button>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          {pairs.map((pair) => {
            const balance = batchResult.results.get(pair.erc7984.address)
            const err = batchResult.errors.get(pair.erc7984.address)
            return (
              <div
                key={pair.erc7984.address}
                className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50"
              >
                <span className="text-sm text-muted-foreground">{pair.displayName}</span>
                {err ? (
                  <span className="text-xs text-destructive">Error</span>
                ) : balance !== undefined ? (
                  <span className="font-mono text-sm text-foreground">
                    {formatUnits(balance, pair.erc7984.decimals)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDecryptAll} disabled={isLoading}>
      {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : null}
      {isLoading ? "Decrypting..." : "Decrypt All"}
    </Button>
  )
}
