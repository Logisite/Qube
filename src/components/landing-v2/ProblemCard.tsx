import { useRef, useState } from "react"
import { motion, useTransform, useMotionValueEvent, animate } from "motion/react"
import { useScrollSection } from "./useScrollSection"
import { useAnimationConfig } from "./AnimationConfigContext"

interface ProblemCardProps {
  sectionId: string
}

export function ProblemCard({ sectionId }: ProblemCardProps) {
  const { y, scale, borderRadius, opacity, blur, progress } = useScrollSection(sectionId)
  const filter = useTransform(blur, (v) => v > 0 ? `blur(${v}px)` : "none")
  const { config } = useAnimationConfig()

  const problemSection = config.sections.find((s) => s.id === "problem")
  const leftTrigger = problemSection?.subAnimations?.left.trigger ?? 0.18
  const rightTrigger = problemSection?.subAnimations?.right.trigger ?? 0.26
  const sectionStart = problemSection?.scrollRange[0] ?? 0.06
  const sectionEnd = problemSection?.scrollRange[1] ?? 0.48

  const refLeft = useRef<HTMLDivElement>(null)
  const refRight = useRef<HTMLDivElement>(null)
  const [leftPlayed, setLeftPlayed] = useState(false)
  const [rightPlayed, setRightPlayed] = useState(false)

  useMotionValueEvent(progress, "change", (v) => {
    if (v < sectionStart || v >= sectionEnd) {
      if (leftPlayed || rightPlayed) {
        setLeftPlayed(false)
        setRightPlayed(false)
        if (refLeft.current) {
          refLeft.current.style.opacity = "0"
          refLeft.current.style.transform = "translateX(-60px)"
        }
        if (refRight.current) {
          refRight.current.style.opacity = "0"
          refRight.current.style.transform = "translateX(60px)"
        }
      }
      return
    }

    if (v >= leftTrigger && !leftPlayed && refLeft.current) {
      setLeftPlayed(true)
      animate(refLeft.current, { opacity: 1, x: 0 }, { type: "spring", stiffness: config.subAnimationSpring.stiffness, damping: config.subAnimationSpring.damping })
    }
    if (v >= rightTrigger && !rightPlayed && refRight.current) {
      setRightPlayed(true)
      animate(refRight.current, { opacity: 1, x: 0 }, { type: "spring", stiffness: config.subAnimationSpring.stiffness, damping: config.subAnimationSpring.damping })
    }
  })

  return (
    <motion.div
      style={{ y, scale, borderRadius, opacity, filter }}
      className="absolute inset-0 bg-white text-neutral-900 border border-neutral-200 flex flex-col justify-start overflow-hidden shadow-2xl p-4 md:p-8 z-20 pt-16 md:pt-20"
    >
      <div className="max-w-6xl mx-auto w-full py-4">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 text-neutral-900">
            Stop <span className="text-brand-green">Fragmenting</span>. Start Composing.
          </h2>
          <p className="text-neutral-500 font-semibold text-sm md:text-base leading-relaxed">
            Developers deploy their own test tokens instead of using official ones. The ecosystem breaks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <motion.div
            ref={refLeft}
            initial={{ opacity: 0, x: -60 }}
            className="bg-neutral-950 rounded-2xl p-5 flex flex-col justify-between border border-neutral-800 shadow-xl h-full"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-4 h-4 rounded-full bg-red-500/80" />
                <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Scattered Deployments</span>
              </div>
              <h3 className="font-display text-base md:text-lg font-black text-white mb-3 leading-snug">
                Two teams. Two USDCs. Zero composability.
              </h3>
            </div>

            <div className="bg-[#0f1115] rounded-xl border border-neutral-800/80 overflow-hidden font-mono text-xs text-neutral-400 mb-4">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#08090c] border-b border-neutral-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] text-neutral-500 font-medium tracking-wide">tokens.ts</span>
                <div className="w-8" />
              </div>
              <div className="p-4 space-y-1.5 text-[11px] leading-relaxed text-left text-neutral-300">
                <p><span className="text-pink-500">const</span> teamA_USDC = <span className="text-amber-300">"0xABC..."</span></p>
                <p><span className="text-pink-500">const</span> teamB_USDC = <span className="text-amber-300">"0xDEF..."</span></p>
                <p><span className="text-neutral-500">// integrations break across apps</span></p>
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-red-400 flex items-center gap-1 font-bold">Not composable</span>
                  <span className="text-neutral-500 font-bold">0 interop</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={refRight}
            initial={{ opacity: 0, x: 60 }}
            className="bg-neutral-950 rounded-2xl p-5 flex flex-col justify-between border border-neutral-800 shadow-xl h-full"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-4 h-4 rounded-full bg-brand-green/80" />
                <span className="text-brand-green text-[10px] font-bold uppercase tracking-widest">Canonical Pairs</span>
              </div>
              <h3 className="font-display text-base md:text-lg font-black text-white mb-3 leading-snug">
                One registry. Seven official pairs. Everything composes.
              </h3>
            </div>

            <div className="bg-[#0f1115] rounded-xl border border-neutral-800/80 overflow-hidden font-mono text-xs text-neutral-400 mb-4">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#08090c] border-b border-neutral-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] text-neutral-500 font-medium tracking-wide">registry.ts</span>
                <div className="w-8" />
              </div>
              <div className="p-4 space-y-1.5 text-[11px] leading-relaxed text-left text-neutral-300">
                <p><span className="text-pink-500">import</span> &#123; registry &#125; <span className="text-pink-500">from</span> <span className="text-amber-300">"0x2f07..."</span></p>
                <p><span className="text-pink-500">const</span> pairs = <span className="text-pink-500">await</span> registry.<span className="text-teal-400">getTokenConfidentialTokenPairs</span>()</p>
                <p>pairs.<span className="text-blue-400">forEach</span>(p =&gt; console.<span className="text-blue-400">log</span>(p.wrapper))</p>
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-brand-green flex items-center gap-1 font-bold">Verified on-chain</span>
                  <span className="text-neutral-500 font-bold">7 pairs</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
