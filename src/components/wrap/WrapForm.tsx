import { useState, useEffect, useRef } from "react"
import { Link } from "react-router"
import { useAccount, useBalance } from "wagmi"
import { formatUnits, parseUnits } from "viem"
import { toast } from "sonner"
import { Loader2, CheckCircle, ArrowRight, ChevronDown, ChevronUp, ExternalLink, X } from "lucide-react"
import {
  useConfidentialBalance,
  InsufficientERC20BalanceError,
  SigningRejectedError,
  ApprovalFailedError,
  TransactionRevertedError,
} from "@zama-fhe/react-sdk"
import { useWrap } from "@/hooks/useWrap"
import { Button } from "@/components/ui/button"
import { DecryptBalanceButton } from "@/components/decrypt/DecryptBalanceButton"
import type { MergedPair } from "@/lib/mergePairs"
import { getEtherscanUrl } from "@/lib/chains"

type ApprovalStrategy = "exact" | "max" | "skip"

const STRATEGIES: { value: ApprovalStrategy; label: string; description: string }[] = [
  { value: "exact", label: "Exact", description: "Approve exactly the amount needed" },
  { value: "max", label: "Max", description: "Approve unlimited (fewer future approvals)" },
  { value: "skip", label: "Skip", description: "Use existing approval" },
]

interface WrapFormProps {
  pairs: MergedPair[]
  initialTokenIndex?: number
}

export function WrapForm({ pairs, initialTokenIndex = 0 }: WrapFormProps) {
  const { address, chainId } = useAccount()
  const [selectedIndex, setSelectedIndex] = useState(initialTokenIndex)
  const [amount, setAmount] = useState("")
  const [strategy, setStrategy] = useState<ApprovalStrategy>("exact")
  const [phase, setPhase] = useState<"idle" | "confirming" | "processing">("idle")
  const [success, setSuccess] = useState<{ amount: string; symbol: string; displayName: string; txHash: string } | null>(null)
  const [approvalExpanded, setApprovalExpanded] = useState(false)
  const prevTokenIndex = useRef(selectedIndex)

  const pair = pairs[selectedIndex]
  const { shield, isPending } = useWrap(pair.erc20.address, pair.erc7984.address)

  const { data: erc20Balance, refetch: refetchErc20 } = useBalance({
    address,
    token: pair.erc20.address,
  })

  const { data: confidentialBalance, refetch: refetchConfidential } = useConfidentialBalance({
    tokenAddress: pair.erc7984.address,
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
      const value = parseUnits(amount || "0", pair.erc20.decimals)
      return value > 0n ? value : null
    } catch {
      return null
    }
  })()

  function handleMax() {
    if (erc20Balance) {
      setAmount(formatUnits(erc20Balance.value, pair.erc20.decimals))
    }
  }

  async function handleWrap() {
    if (!parsedAmount) return

    setPhase("confirming")
    try {
      const result = await shield({
        amount: parsedAmount,
        approvalStrategy: strategy,
        onApprovalSubmitted: () => setPhase("processing"),
        onShieldSubmitted: () => setPhase("processing"),
      })
      setSuccess({
        amount,
        symbol: pair.symbol,
        displayName: pair.displayName,
        txHash: result.txHash,
      })
      toast.success(`Shielded ${amount} ${pair.displayName}`)
      refetchErc20()
      refetchConfidential()
    } catch (err) {
      if (err instanceof SigningRejectedError) {
        toast.info("Transaction rejected")
      } else if (err instanceof InsufficientERC20BalanceError) {
        toast.error(
          `Insufficient balance requested ${formatUnits(err.requested, pair.erc20.decimals)}, available ${formatUnits(err.available, pair.erc20.decimals)}`,
        )
      } else if (err instanceof ApprovalFailedError) {
        toast.error("Approval failed")
      } else if (err instanceof TransactionRevertedError) {
        toast.error("Transaction reverted")
      } else {
        toast.error("Shield failed")
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
                You wrapped {success.amount} {success.displayName} into {success.symbol}
              </p>
              <p className="text-sm text-muted-foreground">
                Your tokens are now confidential on-chain.
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

        {confidentialBalance !== undefined && confidentialBalance > 0n && (
          <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Your {success.symbol} balance: </span>
            <span className="font-medium text-foreground">
              {formatUnits(confidentialBalance, pair.erc7984.decimals)} {success.symbol}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <DecryptBalanceButton
            wrapperAddress={pair.erc7984.address}
            decimals={pair.erc7984.decimals}
            displayName={pair.displayName}
          />
          <Button variant="outline" onClick={() => setSuccess(null)}>
            Wrap More
          </Button>
          <Button variant="ghost" asChild>
            <Link to={`/unwrap?token=${pair.symbol}`}>
              Unwrap
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
        <label htmlFor="wrap-token" className="text-sm text-muted-foreground">
          Token
        </label>
        <select
          id="wrap-token"
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
        <label htmlFor="wrap-amount" className="text-sm text-muted-foreground">
          Amount
        </label>
        <div className="flex gap-2">
          <input
            id="wrap-amount"
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
        {erc20Balance && (
          <p className="text-xs text-muted-foreground">
            Balance: {formatUnits(erc20Balance.value, pair.erc20.decimals)} {pair.displayName}
          </p>
        )}
      </div>

      {/* Approval strategy collapsed by default */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setApprovalExpanded((prev) => !prev)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Approval: {STRATEGIES.find((s) => s.value === strategy)?.label}
          {approvalExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
        {approvalExpanded && (
          <div className="space-y-2 pt-1">
            <div className="flex gap-3">
              {STRATEGIES.map((s) => (
                <label key={s.value} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="radio"
                    name="approval-strategy"
                    value={s.value}
                    checked={strategy === s.value}
                    onChange={() => setStrategy(s.value)}
                    className="accent-primary"
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {STRATEGIES.find((s) => s.value === strategy)?.description}
            </p>
          </div>
        )}
      </div>

      <Button
        onClick={handleWrap}
        disabled={isPending || !parsedAmount}
        className="w-full"
      >
        {(phase === "confirming" || phase === "processing") && (
          <Loader2 className="size-4 animate-spin" />
        )}
        {phase === "confirming"
          ? "Confirm in wallet"
          : phase === "processing"
            ? "Processing"
            : "Wrap"}
      </Button>

      {confidentialBalance !== undefined && confidentialBalance > 0n && (
        <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
          <span className="text-muted-foreground">Encrypted balance: </span>
          <span className="font-medium text-foreground">
            {formatUnits(confidentialBalance, pair.erc7984.decimals)} {pair.symbol}
          </span>
        </div>
      )}
    </div>
  )
}
