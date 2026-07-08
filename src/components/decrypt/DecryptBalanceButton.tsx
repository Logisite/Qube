import { useState, useEffect, useRef, useCallback } from "react"
import { formatUnits } from "viem"
import { Loader2, Eye, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { SigningRejectedError } from "@zama-fhe/react-sdk"
import { Button } from "@/components/ui/button"
import { useDecryptAllow, useDecryptAllowed, useDecryptBalance } from "@/hooks/useDecrypt"

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 2000

interface DecryptBalanceButtonProps {
  wrapperAddress: `0x${string}`
  decimals: number
  displayName: string
  onPhaseChange?: (phase: string) => void
}

export function DecryptBalanceButton({ wrapperAddress, decimals, displayName, onPhaseChange }: DecryptBalanceButtonProps) {
  const [phase, setPhase] = useState<"idle" | "authorizing" | "decrypting" | "done" | "error">("idle")
  const [decrypted, setDecrypted] = useState<bigint | null>(null)
  const retryCount = useRef(0)
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: isAllowed, isLoading: isAllowedLoading } = useDecryptAllowed([wrapperAddress])
  const { allow, isPending: isAllowPending } = useDecryptAllow()
  // Always enabled — pre-warms the SDK so encrypted state is ready when user clicks
  const { data: balance, error: sdkError, refetch } = useDecryptBalance(wrapperAddress, true)

  function updatePhase(next: typeof phase) {
    setPhase(next)
    onPhaseChange?.(next)
  }

  useEffect(() => {
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current)
    }
  }, [])

  const doRetry = useCallback(async () => {
    if (retryCount.current >= MAX_RETRIES) {
      console.error(`[Decrypt] ${displayName}: gave up after ${MAX_RETRIES} retries, balance still 0`)
      toast.error(`${displayName}: balance unavailable after retries`)
      updatePhase("error")
      return
    }
    retryCount.current += 1
    console.log(`[Decrypt] ${displayName}: retry ${retryCount.current}/${MAX_RETRIES}, balance was 0n`)
    retryTimer.current = setTimeout(async () => {
      try {
        await refetch()
      } catch {
        // refetch errors are handled by the sdkError effect
      }
    }, RETRY_DELAY_MS)
  }, [displayName, refetch])

  // When balance arrives during decrypting phase, store it and mark done.
  useEffect(() => {
    if (phase !== "decrypting") return
    if (sdkError) {
      console.error("[Decrypt] SDK query error:", sdkError)
      toast.error(`Decryption failed: ${sdkError.message}`)
      updatePhase("error")
    } else if (balance !== undefined) {
      if (balance === 0n) {
        doRetry()
      } else {
        setDecrypted(balance)
        updatePhase("done")
      }
    }
  }, [balance, sdkError, phase, doRetry])

  async function handleDecrypt() {
    if (decrypted !== null) return

    retryCount.current = 0

    // Step 1: Grant permit if needed
    if (!isAllowed) {
      updatePhase("authorizing")
      try {
        await allow([wrapperAddress])
      } catch (err) {
        if (err instanceof SigningRejectedError) {
          toast.info("Authorization rejected try again when ready")
        } else {
          toast.error(`Authorization failed for ${displayName}`)
        }
        updatePhase("error")
        return
      }
    }

    // Step 2: Check if we already have a cached balance from pre-warm
    if (balance !== undefined && balance !== 0n) {
      setDecrypted(balance)
      updatePhase("done")
      return
    }

    // Step 3: Enter decrypting phase — the always-on query will keep updating
    updatePhase("decrypting")
    // Refetch to ensure fresh data
    try {
      const result = await refetch()
      if (result.data !== undefined && result.data !== 0n) {
        setDecrypted(result.data)
        updatePhase("done")
      } else if (result.error) {
        console.error("[Decrypt] refetch error:", result.error)
        toast.error(`Decryption failed: ${(result.error as Error).message}`)
        updatePhase("error")
      } else {
        // Balance is 0n or undefined — start retry loop
        doRetry()
      }
    } catch (err) {
      console.error("[Decrypt] refetch threw:", err)
      updatePhase("error")
    }
  }

  function handleRetry() {
    setDecrypted(null)
    retryCount.current = 0
    if (retryTimer.current) clearTimeout(retryTimer.current)
    updatePhase("idle")
  }

  if (decrypted !== null) {
    return (
      <span className="font-mono text-sm font-medium text-foreground">
        {formatUnits(decrypted, decimals)} {displayName}
      </span>
    )
  }

  if (phase === "error") {
    return (
      <Button variant="outline" size="sm" onClick={handleRetry}>
        <RotateCcw className="size-3.5" />
        Retry
      </Button>
    )
  }

  const loading = phase !== "idle" || isAllowedLoading

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDecrypt}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Eye className="size-3.5" />
      )}
      {phase === "authorizing" || isAllowPending
        ? "Authorizing"
        : phase === "decrypting"
          ? "Decrypting"
          : "Decrypt Balance"}
    </Button>
  )
}
