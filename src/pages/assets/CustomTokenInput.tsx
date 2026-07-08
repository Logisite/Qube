import { useState } from "react"
import { isAddress } from "viem"
import { DecryptBalanceButton } from "@/components/decrypt/DecryptBalanceButton"
import { Button } from "@/components/ui/button"

interface CustomTokenEntry {
  address: `0x${string}`
  decimals: number
}

function loadTokens(): CustomTokenEntry[] {
  try {
    const raw = localStorage.getItem("assets-custom-tokens")
    if (!raw) return []
    return JSON.parse(raw) as CustomTokenEntry[]
  } catch {
    return []
  }
}

function saveTokens(tokens: CustomTokenEntry[]): void {
  localStorage.setItem("assets-custom-tokens", JSON.stringify(tokens))
}

export function CustomTokenInput() {
  const [inputValue, setInputValue] = useState("")
  const [decimals, setDecimals] = useState("18")
  const [customTokens, setCustomTokens] = useState<CustomTokenEntry[]>(loadTokens)

  function handleAdd() {
    if (!isAddress(inputValue)) return
    const addr = inputValue as `0x${string}`
    if (!customTokens.some((t) => t.address === addr)) {
      const next = [...customTokens, { address: addr, decimals: Number(decimals) || 18 }]
      setCustomTokens(next)
      saveTokens(next)
    }
    setInputValue("")
  }

  function handleRemove(addr: `0x${string}`) {
    const next = customTokens.filter((t) => t.address !== addr)
    setCustomTokens(next)
    saveTokens(next)
  }

  function handleDecimalsChange(addr: `0x${string}`, newDecimals: string) {
    const parsed = Number(newDecimals)
    if (isNaN(parsed) || parsed < 0 || parsed > 36) return
    const next = customTokens.map((t) =>
      t.address === addr ? { ...t, decimals: parsed } : t,
    )
    setCustomTokens(next)
    saveTokens(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Paste ERC-7984 wrapper address..."
          className="flex-1 rounded-md bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground font-mono"
        />
        <input
          type="number"
          min="0"
          max="36"
          value={decimals}
          onChange={(e) => setDecimals(e.target.value)}
          placeholder="Decimals"
          className="w-20 rounded-md bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
        />
        <Button onClick={handleAdd} disabled={!isAddress(inputValue)}>
          Track
        </Button>
      </div>

      {customTokens.length > 0 && (
        <div className="space-y-2">
          {customTokens.map((token) => (
            <div
              key={token.address}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm text-card-foreground truncate">{token.address}</p>
                <input
                  type="number"
                  min="0"
                  max="36"
                  value={token.decimals}
                  onChange={(e) => handleDecimalsChange(token.address, e.target.value)}
                  className="mt-1 w-20 rounded-md bg-background border border-border px-2 py-1 text-xs text-foreground"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <DecryptBalanceButton
                  wrapperAddress={token.address}
                  decimals={token.decimals}
                  displayName="Custom"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(token.address)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
