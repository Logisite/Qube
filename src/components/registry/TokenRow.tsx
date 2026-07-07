import { useState, useEffect } from "react"
import { Link } from "react-router"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"
import { Copy, Check, ExternalLink, ArrowRight } from "lucide-react"
import {
  useConfidentialBalance,
  useIsAllowed,
} from "@zama-fhe/react-sdk"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { MergedPair } from "@/lib/mergePairs"
import { getEtherscanUrl } from "@/lib/chains"

interface TokenRowProps {
  pair: MergedPair
}

function AddressRow({ label, address, chainId }: { label: string; address: `0x${string}`; chainId?: number }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(address).catch(() => {})
    setCopied(true)
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-xs break-all leading-relaxed">{address}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center size-7 rounded-md hover:bg-muted transition-colors"
          aria-label={`Copy ${label} address`}
        >
          {copied ? (
            <Check className="size-3.5 text-success" />
          ) : (
            <Copy className="size-3.5 text-muted-foreground" />
          )}
        </button>
        <a
          href={`${getEtherscanUrl(chainId, "address")}/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center size-7 rounded-md hover:bg-muted transition-colors"
          aria-label={`View ${label} on Etherscan`}
        >
          <ExternalLink className="size-3.5 text-muted-foreground" />
        </a>
      </div>
    </div>
  )
}

export function TokenRow({ pair }: TokenRowProps) {
  const [open, setOpen] = useState(false)
  const { chainId } = useAccount()
  const { data: confidentialBalance } = useConfidentialBalance({
    tokenAddress: pair.erc7984.address,
  })

  const { data: isAllowed } = useIsAllowed({
    contractAddresses: [pair.erc7984.address],
  })

  const hasConfidentialBalance = confidentialBalance !== undefined && confidentialBalance > 0n

  function handleRowClick() {
    setOpen(true)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <>
      <tr
        className="border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors"
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <td className="px-4 py-3">
          <span className="font-medium text-foreground">{pair.displayName}</span>
        </td>
        <td className="px-4 py-3">
          <span className="font-mono text-muted-foreground text-xs">{pair.symbol}</span>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <span className="font-mono text-xs text-muted-foreground truncate max-w-[140px] block">
            {pair.erc7984.address}
          </span>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="font-mono text-xs text-muted-foreground truncate max-w-[140px] block">
            {pair.erc20.address}
          </span>
        </td>
        <td className="px-4 py-3">
          <span
            className={cn(
              "text-xs font-medium",
              pair.source === "on-chain" && "text-success",
              pair.source === "cached" && "text-primary",
              pair.source === "local" && "text-warning",
            )}
          >
            {pair.source === "on-chain" ? "On-Chain" : pair.source === "cached" ? "Cached" : "Local"}
          </span>
        </td>
      </tr>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{pair.name}</DialogTitle>
            <DialogDescription>
              {pair.displayName} → {pair.symbol}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <AddressRow label="Wrapper (ERC-7984)" address={pair.erc7984.address} chainId={chainId} />
            <AddressRow label="Underlying (ERC-20)" address={pair.erc20.address} chainId={chainId} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs text-muted-foreground gap-1">
              <span>
                Wrapper decimals: <span className="font-medium text-foreground">{pair.erc7984.decimals}</span>
              </span>
              <span>
                Token decimals: <span className="font-medium text-foreground">{pair.erc20.decimals}</span>
              </span>
            </div>

            {hasConfidentialBalance && (
              <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                <span className="text-sm text-muted-foreground">Encrypted balance</span>
                <span className="font-mono text-sm font-medium text-foreground">
                  {formatUnits(confidentialBalance, pair.erc7984.decimals)} {pair.displayName}
                </span>
              </div>
            )}

            {isAllowed && isAllowed !== undefined && (
              <p className="text-xs text-muted-foreground">
                Decryption permit: granted
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link to={`/wrap?token=${pair.symbol}`}>
                Wrap
                <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link to={`/unwrap?token=${pair.symbol}`}>
                Unwrap
              </Link>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild size="sm" variant="ghost" className="flex-1">
              <Link to="/faucet">
                Claim Test Tokens
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="flex-1">
              <Link to="/assets">
                View in Assets
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
