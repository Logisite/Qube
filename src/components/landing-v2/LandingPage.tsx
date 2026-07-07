import { useState } from "react"
import { Link } from "react-router"
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "motion/react"
import { SlidersHorizontal } from "lucide-react"
import { useAnimationConfig } from "./AnimationConfigContext"
import { HeroCard } from "./HeroCard"
import { ProblemCard } from "./ProblemCard"
import { HowItWorksCard } from "./HowItWorksCard"
import { CtaCard } from "./CtaCard"
import { AnimationEditor } from "./AnimationEditor"
import logoWhite from "@/assets/logos/logo-white.svg"
import logoBlack from "@/assets/logos/logo-black.svg"

function LandingPageInner() {
  const { config, editorOpen, toggleEditor } = useAnimationConfig()
  const sections = config.sections

  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1")
  const [headerTheme, setHeaderTheme] = useState<"dark" | "light">("dark")
  const [mountedSections, setMountedSections] = useState<Set<string>>(new Set(["hero"]))

  const { scrollYProgress } = useScroll()

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: config.spring.stiffness,
    damping: config.spring.damping,
    restDelta: config.spring.restDelta,
  })

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    let foundTheme = false
    for (const section of sections) {
      if (latest >= section.scrollRange[0] && latest < section.scrollRange[1]) {
        if (!foundTheme) {
          setHeaderTheme(section.headerTheme as "dark" | "light")
          foundTheme = true
        }
        if (section.tab) setActiveTab(section.tab as "tab1" | "tab2" | "tab3")
      }
    }

    const newMounted = new Set<string>()
    for (const section of sections) {
      const [start, end] = section.scrollRange
      const margin = (end - start) * config.lazyMountMargin
      if (latest >= start - margin && latest <= end + margin) {
        newMounted.add(section.id)
      }
    }
    newMounted.add("hero")
    setMountedSections(newMounted)
  })

  const bgGlowOpacity = useTransform(smoothProgress, config.bgGlowOpacity.input, config.bgGlowOpacity.output, { clamp: true })

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
            <img
              src={headerTheme === "dark" ? logoWhite : logoBlack}
              alt="Qube logo"
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <span className={`font-display text-xl md:text-2xl font-black tracking-tight transition-colors ${headerTheme === "dark" ? "text-white" : "text-neutral-900"}`}>
              Qube
            </span>
            <div className="w-[3px] h-5 bg-brand-green rounded-sm" />
          </div>

          <nav className={`hidden md:flex items-center gap-8 font-semibold text-sm transition-colors ${headerTheme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
            <Link to="/registry" className={`transition-colors no-underline ${headerTheme === "dark" ? "hover:text-white" : "hover:text-neutral-900"}`}>Registry</Link>
            <Link to="/docs" className={`transition-colors no-underline ${headerTheme === "dark" ? "hover:text-white" : "hover:text-neutral-900"}`}>Docs</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleEditor}
              className={`p-2 rounded-lg transition-colors ${headerTheme === "dark" ? "hover:bg-white/10 text-neutral-400 hover:text-white" : "hover:bg-black/10 text-neutral-500 hover:text-neutral-900"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
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

      <div className="relative w-full z-10" style={{ height: `${config.scrollHeightVH}vh` }}>
        <div className="fixed inset-0 w-full h-screen overflow-hidden flex items-center justify-center z-10">
          {mountedSections.has("hero") && <HeroCard sectionId="hero" />}
          {mountedSections.has("problem") && <ProblemCard sectionId="problem" />}
          {mountedSections.has("how") && <HowItWorksCard sectionId="how" activeTab={activeTab} />}
          {mountedSections.has("cta") && <CtaCard sectionId="cta" />}
        </div>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-[10000] overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleEditor}
          />
          <div className="absolute inset-4 sm:inset-6 md:inset-8 lg:inset-12 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-green" />
                <span className="text-sm font-bold text-white tracking-tight">Animation Editor</span>
              </div>
              <button
                onClick={toggleEditor}
                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <AnimationEditor />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export { LandingPageInner as LandingPage }
