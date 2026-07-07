import { useState } from "react"
import { Link } from "react-router"
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "motion/react"
import { HeroCard } from "./HeroCard"
import { ProblemCard } from "./ProblemCard"
import { HowItWorksCard } from "./HowItWorksCard"
import { CtaCard } from "./CtaCard"

export function LandingPage() {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1")
  const [headerTheme, setHeaderTheme] = useState<"dark" | "light">("dark")

  const { scrollYProgress } = useScroll()

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 30,
    restDelta: 0.001,
  })

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest < 0.15) {
      setHeaderTheme("dark")
    } else if (latest < 0.78) {
      setHeaderTheme("light")
    } else {
      setHeaderTheme("dark")
    }

    if (latest < 0.56) {
      setActiveTab("tab1")
    } else if (latest < 0.67) {
      setActiveTab("tab2")
    } else {
      setActiveTab("tab3")
    }
  })

  const scaleHero = useTransform(smoothProgress, [0, 0.10, 0.15], [1, 0.9, 0.85], { clamp: true })
  const yHero = useTransform(smoothProgress, [0, 0.10, 0.15], ["0vh", "0vh", "-8vh"], { clamp: true })
  const radiusHero = useTransform(smoothProgress, [0, 0.10], ["0px", "32px"], { clamp: true })
  const opacityHero = useTransform(smoothProgress, [0, 0.10, 0.15], [1, 1, 0], { clamp: true })
  const blurHero = useTransform(smoothProgress, [0.10, 0.15], [0, 8], { clamp: true })

  const yProblem = useTransform(smoothProgress, [0.08, 0.15, 0.38, 0.45], ["100vh", "0vh", "0vh", "-8vh"], { clamp: true })
  const scaleProblem = useTransform(smoothProgress, [0.08, 0.15, 0.38, 0.45], [0.96, 1, 1, 0.9], { clamp: true })
  const radiusProblem = useTransform(smoothProgress, [0.10, 0.15], ["32px", "32px"], { clamp: true })
  const opacityProblem = useTransform(smoothProgress, [0.08, 0.12, 0.40, 0.45], [0, 1, 1, 0], { clamp: true })
  const blurProblem = useTransform(smoothProgress, [0.40, 0.45], [0, 8], { clamp: true })

  const ySolution = useTransform(smoothProgress, [0.38, 0.45, 0.78, 0.83], ["100vh", "0vh", "0vh", "-8vh"], { clamp: true })
  const scaleSolution = useTransform(smoothProgress, [0.38, 0.45, 0.78, 0.83], [0.96, 1, 1, 0.9], { clamp: true })
  const opacitySolution = useTransform(smoothProgress, [0.38, 0.42, 0.80, 0.83], [0, 1, 1, 0], { clamp: true })
  const blurSolution = useTransform(smoothProgress, [0.80, 0.83], [0, 8], { clamp: true })

  const yCta = useTransform(smoothProgress, [0.78, 0.83], ["100vh", "0vh"], { clamp: true })
  const scaleCta = useTransform(smoothProgress, [0.78, 0.83], [0.96, 1], { clamp: true })
  const opacityCta = useTransform(smoothProgress, [0.78, 0.81], [0, 1], { clamp: true })

  const bgGlowOpacity = useTransform(smoothProgress, [0, 0.10, 0.40, 0.81, 0.90], [0.1, 0.8, 0.1, 0.1, 0.7], { clamp: true })

  return (
    <div className="relative w-full bg-black text-white select-none selection:bg-brand-green selection:text-black">

      <header
        className={`fixed top-0 left-0 right-0 w-full z-[9999] transition-all duration-300 backdrop-blur-md border-b ${
          headerTheme === "dark"
            ? "bg-black/50 border-white/5 text-white"
            : "bg-white/50 border-neutral-200/80 text-neutral-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`font-display text-xl md:text-2xl font-black tracking-tight transition-colors ${headerTheme === "dark" ? "text-white" : "text-neutral-900"}`}>
              Qube
            </span>
            <div className="w-[3px] h-5 bg-brand-green rounded-sm" />
          </div>

          <nav className={`hidden md:flex items-center gap-8 font-semibold text-sm transition-colors ${headerTheme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
            <a href="#" className={`transition-colors ${headerTheme === "dark" ? "hover:text-white" : "hover:text-neutral-900"}`}>Registry</a>
            <a href="#" className={`transition-colors ${headerTheme === "dark" ? "hover:text-white" : "hover:text-neutral-900"}`}>Docs</a>
          </nav>

          <div className="flex items-center gap-5">
            <Link
              to="/registry"
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-brand-green hover:bg-brand-green-hover text-black rounded-lg transition-colors font-extrabold"
            >
              Open App
            </Link>
          </div>
        </div>
      </header>

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-neutral-900/90 border border-neutral-800/80 px-4 py-2 rounded-full shadow-2xl backdrop-blur-sm pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Scroll</span>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <motion.div
          style={{ opacity: bgGlowOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,200,102,0.18)_0%,rgba(0,0,0,0)_75%)]"
        />
      </div>

      <div className="relative h-[500vh] w-full z-10">
        <div className="fixed inset-0 w-full h-screen overflow-hidden flex items-center justify-center z-10">
          <HeroCard scale={scaleHero} y={yHero} borderRadius={radiusHero} opacity={opacityHero} blur={blurHero} />
          <ProblemCard y={yProblem} scale={scaleProblem} borderRadius={radiusProblem} opacity={opacityProblem} blur={blurProblem} progress={smoothProgress} />
          <HowItWorksCard y={ySolution} scale={scaleSolution} opacity={opacitySolution} activeTab={activeTab} blur={blurSolution} />
          <CtaCard y={yCta} scale={scaleCta} opacity={opacityCta} />
        </div>
      </div>

    </div>
  )
}
