import { useState, useEffect, useRef } from "react"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"
import { Loader2, Eye } from "lucide-react"
import { toast } from "sonner"
import { SigningRejectedError } from "@zama-fhe/react-sdk"
import { getTokenPairsForChain } from "@/lib/tokens"
import { useDecryptAllow, useDecryptBalances } from "@/hooks/useDecrypt"
import { Button } from "@/components/ui/button"
import { saveActivity } from "./activity"

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 2000

export function DecryptAllButton() {
  const { chainId } = useAccount()
  const pairs = getTokenPairsForChain(chainId)
  const addresses = pairs.map((p) => p.erc7984.address)
  const [phase, setPhase] = useState<"idle" | "authorizing" | "decrypting" | "done">("idle")
  const [queryEnabled, setQueryEnabled] = useState(false)
  const [batchResult, setBatchResult] = useState<{
    results: Map<string, bigint>
    errors: Map<string, Error>
  } | null>(null)
  const retryCount = useRef(0)
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { allow } = useDecryptAllow()
  const { data, isLoading, error: sdkError, refetch } = useDecryptBalances(addresses, queryEnabled)

  useEffect(() => {
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current)
    }
  }, [])

  useEffect(() => {
    if (phase !== "decrypting") return
    if (sdkError) {
      console.error("[DecryptAll] SDK query error:", sdkError)
      toast.error(`Decryption failed: ${sdkError.message}`)
      setPhase("idle")
      return
    }
    if (!data) return

    const allZero = [...data.results.values()].every((v) => v === 0n)
    const hasAnyErrors = data.errors.size > 0

    if (allZero && !hasAnyErrors && retryCount.current < MAX_RETRIES) {
      retryCount.current += 1
      console.log(`[DecryptAll] retry ${retryCount.current}/${MAX_RETRIES}, all balances are 0n`)
      retryTimer.current = setTimeout(async () => {
        try {
          await refetch()
        } catch {
          // errors handled by sdkError effect
        }
      }, RETRY_DELAY_MS)
      return
    }

    setBatchResult(data)
    setPhase("done")
    saveActivity({ type: "decrypt", token: "All tokens", timestamp: Date.now() })
  }, [data, sdkError, phase, refetch])

  async function handleDecryptAll() {
    if (phase === "done") {
      setPhase("idle")
      setQueryEnabled(false)
      setBatchResult(null)
      return
    }

    retryCount.current = 0
    setPhase("authorizing")
    try {
      await allow(addresses)
    } catch (err) {
      console.error("[DecryptAll] allow failed:", err)
      if (err instanceof SigningRejectedError) {
        toast.info("Authorization rejected")
      } else {
        toast.error("Authorization failed")
      }
      setPhase("idle")
      return
    }

    setPhase("decrypting")
    setQueryEnabled(true)
  }

  if (phase === "done" && batchResult) {
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
    <Button variant="outline" size="sm" onClick={handleDecryptAll} disabled={isLoading || phase === "authorizing"}>
      {isLoading || phase !== "idle" ? <Loader2 className="size-3.5 animate-spin" /> : <Eye className="size-3.5" />}
      {phase === "authorizing" ? "Authorizing..."
        : phase === "decrypting" ? "Decrypting..."
        : phase === "done" ? "Hide All Balances"
        : "Decrypt All"}
    </Button>
  )
}
