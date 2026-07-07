import { useState } from "react"
import { isAddress } from "viem"
import { DecryptBalanceButton } from "@/components/decrypt/DecryptBalanceButton"
import { Button } from "@/components/ui/button"

export function CustomTokenInput() {
  const [inputValue, setInputValue] = useState("")
  const [customAddresses, setCustomAddresses] = useState<`0x${string}`[]>(() => {
    try {
      const raw = localStorage.getItem("assets-custom-tokens")
      if (!raw) return []
      return JSON.parse(raw) as `0x${string}`[]
    } catch {
      return []
    }
  })

  function handleAdd() {
    if (!isAddress(inputValue)) return
    const addr = inputValue as `0x${string}`
    if (!customAddresses.includes(addr)) {
      const next = [...customAddresses, addr]
      setCustomAddresses(next)
      localStorage.setItem("assets-custom-tokens", JSON.stringify(next))
    }
    setInputValue("")
  }

  function handleRemove(addr: `0x${string}`) {
    const next = customAddresses.filter((a) => a !== addr)
    setCustomAddresses(next)
    localStorage.setItem("assets-custom-tokens", JSON.stringify(next))
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
        <Button onClick={handleAdd} disabled={!isAddress(inputValue)}>
          Track
        </Button>
      </div>

      {customAddresses.length > 0 && (
        <div className="space-y-2">
          {customAddresses.map((addr) => (
            <div
              key={addr}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm text-card-foreground truncate">{addr}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <DecryptBalanceButton
                  wrapperAddress={addr}
                  decimals={18}
                  displayName="Custom"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(addr)}
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
