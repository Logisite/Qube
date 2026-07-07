import { Link } from "react-router"
import { useAccount } from "wagmi"
import { motion, useTransform } from "motion/react"
import { useScrollSection } from "./useScrollSection"
import { getChainConfig } from "@/lib/chains"

const ShieldIcon = () => (
  <svg className="w-10 h-10 md:w-14 md:h-14 inline-block mx-2 text-brand-green align-middle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-4" />
    <path d="M12 14c1.66 0 3-1.34 3-3V7c0-1.66-1.34-3-3-3S9 5.34 9 7v4c0 1.66 1.34 3 3 3z" />
    <path d="M5 14a7 7 0 0 0 14 0" />
    <path d="M19 10a9.96 9.96 0 0 0-4.5-8.3" />
    <path d="M4.5 18.3A9.96 9.96 0 0 0 5 10" />
    <path d="M8 11a4 4 0 0 1 8 0" />
  </svg>
)

const LockIcon = () => (
  <svg className="w-9 h-9 md:w-12 md:h-12 inline-block mx-2 text-brand-green align-middle" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c.2 3.8 2.2 5.8 6 6-3.8.2-5.8 2.2-6 6-.2-3.8-2.2-5.8-6-6 3.8-.2 5.8-2.2 6-6z" transform="translate(0, 0) scale(1.3)" />
  </svg>
)

interface HeroCardProps {
  sectionId: string
}

export function HeroCard({ sectionId }: HeroCardProps) {
  const { scale, y, borderRadius, opacity, blur } = useScrollSection(sectionId)
  const filter = useTransform(blur, (v) => v > 0 ? `blur(${v}px)` : "none")
  const { chainId } = useAccount()
  const chainConfig = getChainConfig(chainId)

  return (
    <motion.div
      style={{ scale, y, borderRadius, opacity, filter }}
      className="absolute inset-0 bg-black border border-white/5 flex flex-col justify-start overflow-hidden shadow-2xl z-10 pt-16"
    >
      <div className="max-w-5xl mx-auto px-6 text-center my-auto flex flex-col items-center">
        <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-medium tracking-tight text-white leading-[1.1] md:leading-[1.15]">
          <span className="block text-neutral-400 font-light">Every Official</span>
          <span className="block text-white py-1">Confidential Wrapper</span>
          <span className="block mt-4 text-2xl sm:text-4xl md:text-6xl font-extrabold flex flex-wrap items-center justify-center gap-y-3">
            One <ShieldIcon /> <span className="text-white tracking-tight">App</span>
            <span className="text-neutral-500 font-light mx-2">+</span>
            <LockIcon /> <span className="text-white tracking-tight">Zero Fragmentation</span>
          </span>
        </h1>

        <p className="mt-8 text-sm sm:text-base md:text-lg text-neutral-400 leading-relaxed max-w-xl">
          The canonical ERC-20 to ERC-7984 registry for {chainConfig.name}. Every official pair. One place.
        </p>

        <Link
          to="/registry"
          className="mt-10 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white border border-brand-green/40 hover:border-brand-green rounded-full bg-black/40 hover:bg-black/80 transition-all shadow-[0_0_20px_rgba(46,200,102,0.1)]"
        >
          Open the Registry
        </Link>
      </div>
    </motion.div>
  )
}
