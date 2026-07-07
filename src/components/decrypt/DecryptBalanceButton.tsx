import { useState, useEffect } from "react"
import { formatUnits } from "viem"
import { Loader2, Eye, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { SigningRejectedError, DecryptionFailedError } from "@zama-fhe/react-sdk"
import { Button } from "@/components/ui/button"
import { useDecryptAllow, useDecryptAllowed, useDecryptBalance } from "@/hooks/useDecrypt"

interface DecryptBalanceButtonProps {
  wrapperAddress: `0x${string}`
  decimals: number
  displayName: string
  onPhaseChange?: (phase: string) => void
}

export function DecryptBalanceButton({ wrapperAddress, decimals, displayName, onPhaseChange }: DecryptBalanceButtonProps) {
  const [phase, setPhase] = useState<"idle" | "authorizing" | "decrypting" | "done" | "error">("idle")
  const [queryEnabled, setQueryEnabled] = useState(false)
  const [decrypted, setDecrypted] = useState<bigint | null>(null)

  const { data: isAllowed, isLoading: isAllowedLoading } = useDecryptAllowed([wrapperAddress])
  const { allow, isPending: isAllowPending } = useDecryptAllow()
  const { data: balance, refetch } = useDecryptBalance(wrapperAddress, queryEnabled)

  function updatePhase(next: typeof phase) {
    setPhase(next)
    onPhaseChange?.(next)
  }

  // When balance arrives, store it and mark done.
  // updatePhase is omitted it's a stable wrapper whose identity doesn't affect the effect.
  useEffect(() => {
    if (balance !== undefined && phase === "decrypting") {
      setDecrypted(balance)
      updatePhase("done")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- updatePhase is stable
  }, [balance, phase])

  async function handleDecrypt() {
    if (decrypted !== null) return

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

    // Step 2: Enable query and trigger decryption
    updatePhase("decrypting")
    setQueryEnabled(true)

    // If query was already enabled (e.g. retry), refetch manually
    if (queryEnabled) {
      try {
        const result = await refetch()
        if (result.data !== undefined) {
          setDecrypted(result.data)
          updatePhase("done")
        } else if (result.error) {
          handleDecryptError(result.error)
        } else {
          updatePhase("error")
        }
      } catch (err) {
        handleDecryptError(err)
      }
    }
  }

  function handleDecryptError(err: unknown) {
    if (err instanceof SigningRejectedError) {
      toast.info("Wallet rejected try again when ready")
    } else if (err instanceof DecryptionFailedError) {
      toast.error(`Decryption failed for ${displayName}`)
    } else {
      toast.error(`Decryption failed for ${displayName}`)
    }
    updatePhase("error")
  }

  function handleRetry() {
    setDecrypted(null)
    setQueryEnabled(false)
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
