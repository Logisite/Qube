import { useState, useEffect, useRef } from "react"
import { Link } from "react-router"
import { useAccount, useBalance } from "wagmi"
import { formatUnits, parseUnits } from "viem"
import { toast } from "sonner"
import { Loader2, CheckCircle, ArrowRight, ExternalLink, X } from "lucide-react"
import {
  useConfidentialBalance,
  InsufficientConfidentialBalanceError,
  SigningRejectedError,
  EncryptionFailedError,
  DecryptionFailedError,
  TransactionRevertedError,
} from "@zama-fhe/react-sdk"
import { useUnwrap } from "@/hooks/useUnwrap"
import { Button } from "@/components/ui/button"
import type { MergedPair } from "@/lib/mergePairs"
import { getEtherscanUrl } from "@/lib/chains"

type Phase = "idle" | "confirming" | "processing" | "decrypting"

interface UnwrapFormProps {
  pairs: MergedPair[]
  initialTokenIndex?: number
}

export function UnwrapForm({ pairs, initialTokenIndex = 0 }: UnwrapFormProps) {
  const { address, chainId } = useAccount()
  const [selectedIndex, setSelectedIndex] = useState(initialTokenIndex)
  const [amount, setAmount] = useState("")
  const [phase, setPhase] = useState<Phase>("idle")
  const [success, setSuccess] = useState<{ amount: string; symbol: string; displayName: string; txHash: string } | null>(null)
  const prevTokenIndex = useRef(selectedIndex)

  const pair = pairs[selectedIndex]
  const { unshield, isPending } = useUnwrap(pair.erc20.address, pair.erc7984.address)

  const { data: confidentialBalance, refetch: refetchConfidential } = useConfidentialBalance({
    tokenAddress: pair.erc7984.address,
  })

  const { data: erc20Balance, refetch: refetchErc20 } = useBalance({
    address,
    token: pair.erc20.address,
  })

  // Auto-clear success when token changes
  useEffect(() => {
    if (selectedIndex !== prevTokenIndex.current) {
      setSuccess(null)
      prevTokenIndex.current = selectedIndex
    }
  }, [selectedIndex])

  // Auto-clear success when amount is edited.
  // success is omitted this should only fire on amount changes, not when success toggles.
  useEffect(() => {
    if (amount && success) {
      setSuccess(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run only on amount change
  }, [amount])

  const parsedAmount = (() => {
    try {
      const value = parseUnits(amount || "0", pair.erc7984.decimals)
      return value > 0n ? value : null
    } catch {
      return null
    }
  })()

  function handleMax() {
    if (confidentialBalance) {
      setAmount(formatUnits(confidentialBalance, pair.erc7984.decimals))
    }
  }

  async function handleUnwrap() {
    if (!parsedAmount) return

    setPhase("confirming")
    try {
      const result = await unshield({
        amount: parsedAmount,
        onUnwrapSubmitted: () => setPhase("processing"),
        onFinalizing: () => setPhase("decrypting"),
        onFinalizeSubmitted: () => setPhase("decrypting"),
      })
      setSuccess({
        amount,
        symbol: pair.symbol,
        displayName: pair.displayName,
        txHash: result.txHash,
      })
      toast.success(`Unshielded ${amount} ${pair.displayName}`)
      refetchConfidential()
      refetchErc20()
    } catch (err) {
      if (err instanceof SigningRejectedError) {
        toast.info("Transaction rejected")
      } else if (err instanceof InsufficientConfidentialBalanceError) {
        toast.error(
          `Insufficient balance requested ${formatUnits(err.requested, pair.erc7984.decimals)}, available ${formatUnits(err.available, pair.erc7984.decimals)}`,
        )
      } else if (err instanceof EncryptionFailedError) {
        toast.error("Encryption failed")
      } else if (err instanceof DecryptionFailedError) {
        toast.error("Decryption failed")
      } else if (err instanceof TransactionRevertedError) {
        toast.error("Transaction reverted")
      } else {
        toast.error("Unshield failed")
      }
    } finally {
      setPhase("idle")
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="size-6 text-success mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-card-foreground">
                Unshielded {success.amount} {success.displayName}
              </p>
              <p className="text-sm text-muted-foreground">
                Back to your public wallet.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 size-8"
            onClick={() => setSuccess(null)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {success.txHash && (
          <a
            href={`${getEtherscanUrl(chainId, "tx")}/${success.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View transaction
            <ExternalLink className="size-3.5" />
          </a>
        )}

        {erc20Balance && (
          <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Your {success.displayName} balance: </span>
            <span className="font-medium text-foreground">
              {formatUnits(erc20Balance.value, pair.erc20.decimals)} {success.displayName}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => setSuccess(null)}>
            Unwrap Another
          </Button>
          <Button variant="ghost" asChild>
            <Link to={`/wrap?token=${pair.symbol}`}>
              Wrap More
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      <div className="space-y-2">
        <label htmlFor="unwrap-token" className="text-sm text-muted-foreground">
          Token
        </label>
        <select
          id="unwrap-token"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm text-foreground"
        >
          {pairs.map((tp, i) => (
            <option key={tp.erc20.address} value={i}>
              {tp.displayName} {tp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="unwrap-amount" className="text-sm text-muted-foreground">
          Amount
        </label>
        <div className="flex gap-2">
          <input
            id="unwrap-amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 rounded-md bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          />
          <Button variant="outline" size="sm" onClick={handleMax} type="button">
            Max
          </Button>
        </div>
        {confidentialBalance !== undefined && (
          <p className="text-xs text-muted-foreground">
            Encrypted balance: {formatUnits(confidentialBalance, pair.erc7984.decimals)} {pair.displayName}
          </p>
        )}
      </div>

      <Button
        onClick={handleUnwrap}
        disabled={isPending || !parsedAmount}
        variant="outline"
        className="w-full border-white/25"
      >
        {(phase === "confirming" || phase === "processing" || phase === "decrypting") && (
          <Loader2 className="size-4 animate-spin" />
        )}
        {phase === "confirming"
          ? "Confirm in wallet"
          : phase === "processing"
            ? "Processing"
            : phase === "decrypting"
              ? "Decrypting"
              : "Unwrap"}
      </Button>

      {erc20Balance && (
        <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
          <span className="text-muted-foreground">ERC-20 balance: </span>
          <span className="font-medium text-foreground">
            {formatUnits(erc20Balance.value, pair.erc20.decimals)} {pair.displayName}
          </span>
        </div>
      )}
    </div>
  )
}
