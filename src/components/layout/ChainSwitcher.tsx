import { useState, useRef, useEffect } from "react"
import { useAccount, useSwitchChain } from "wagmi"
import { toast } from "sonner"
import { ChevronDown, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { SUPPORTED_CHAINS, type SupportedChainId } from "@/lib/chains"
import ethLogo from "@/assets/icons/ethereum-eth-logo.svg"

const chainEntries = Object.entries(SUPPORTED_CHAINS) as unknown as [
  SupportedChainId,
  (typeof SUPPORTED_CHAINS)[SupportedChainId],
][]

export function ChainSwitcher() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { chainId } = useAccount()
  const { switchChain, isPending } = useSwitchChain()

  const current = chainId
    ? (SUPPORTED_CHAINS[chainId as SupportedChainId] ?? SUPPORTED_CHAINS[11155111])
    : SUPPORTED_CHAINS[11155111]
  const activeChainId = (chainId as SupportedChainId) ?? 11155111

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSwitch(target: SupportedChainId) {
    if (target === activeChainId) {
      setOpen(false)
      return
    }
    setOpen(false)
    switchChain(
      { chainId: target },
      {
        onSuccess: () => {
          toast.success(`Switched to ${SUPPORTED_CHAINS[target].name}`)
          setOpen(false)
        },
        onError: (error: Error) => {
          toast.error(error?.message ?? "Network switch cancelled")
        },
      },
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-full text-sm font-medium transition-colors",
          "bg-white/5 border border-white/10 hover:bg-white/10",
          "text-neutral-300 hover:text-white",
          "disabled:opacity-50",
        )}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          <img src={ethLogo} alt="" className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {isPending ? "Switching..." : current.shortName}
        </span>
        {!isPending && (
          <span className="hidden md:inline text-neutral-500">
            {current.isTestnet ? "Testnet" : "Mainnet"}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 text-neutral-500 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-1">
            {chainEntries.map(([id, chain]) => {
              const numId = Number(id) as SupportedChainId
              const isActive = numId === activeChainId
              return (
                <button
                  key={id}
                  onClick={() => handleSwitch(numId)}
                  disabled={isPending}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    "text-neutral-400 hover:text-white hover:bg-white/5",
                    "disabled:opacity-50",
                  )}
                >
                  <img src={ethLogo} alt="" className="h-4 w-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {chain.name}
                    </div>
                  </div>
                  {isActive && (
                    <Check className="h-4 w-4 text-brand-green shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
