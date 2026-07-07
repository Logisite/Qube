import { useState, useCallback, useRef, useMemo } from "react"
import { Download, Upload, RotateCcw, Undo2, Redo2 } from "lucide-react"
import { useAnimationConfig } from "./AnimationConfigContext"
import { EditorSlider } from "./EditorSlider"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import type { AnimationConfig } from "./animationConfig"
import { defaultAnimationConfig } from "./animationConfig"

interface SliderDef {
  label: string
  path: string
  min: number
  max: number
  step: number
  unit?: string
}

function getVal(cfg: AnimationConfig, path: string): number {
  return path.split(".").reduce((acc: unknown, k) => (acc as Record<string, unknown>)?.[k], cfg) as number
}

function getDefaultVal(path: string): number {
  return getVal(defaultAnimationConfig, path)
}

const GROUPS: { id: string; label: string; sliders: SliderDef[] }[] = [
  {
    id: "timing",
    label: "Section Timing",
    sliders: [
      { label: "Hero Start", path: "sections.0.scrollRange.0", min: 0, max: 0.5, step: 0.01 },
      { label: "Hero End", path: "sections.0.scrollRange.1", min: 0.05, max: 0.8, step: 0.01 },
      { label: "Problem Start", path: "sections.1.scrollRange.0", min: 0, max: 0.5, step: 0.01 },
      { label: "Problem End", path: "sections.1.scrollRange.1", min: 0.1, max: 0.8, step: 0.01 },
      { label: "HowItWorks Start", path: "sections.2.scrollRange.0", min: 0.1, max: 0.8, step: 0.01 },
      { label: "HowItWorks End", path: "sections.2.scrollRange.1", min: 0.3, max: 0.9, step: 0.01 },
      { label: "Tab 2 Start", path: "sections.3.scrollRange.0", min: 0.2, max: 0.9, step: 0.01 },
      { label: "Tab 3 Start", path: "sections.4.scrollRange.0", min: 0.3, max: 0.9, step: 0.01 },
      { label: "CTA Start", path: "sections.5.scrollRange.0", min: 0.5, max: 0.95, step: 0.01 },
      { label: "CTA End", path: "sections.5.scrollRange.1", min: 0.8, max: 1.0, step: 0.01 },
    ],
  },
  {
    id: "global",
    label: "Global",
    sliders: [
      { label: "Scroll Height", path: "scrollHeightVH", min: 200, max: 1000, step: 10, unit: "vh" },
      { label: "Spring Stiffness", path: "spring.stiffness", min: 10, max: 300, step: 5 },
      { label: "Spring Damping", path: "spring.damping", min: 5, max: 50, step: 1 },
      { label: "Spring Rest Delta", path: "spring.restDelta", min: 0.0001, max: 0.01, step: 0.0001 },
      { label: "Lazy Mount Margin", path: "lazyMountMargin", min: 0, max: 0.5, step: 0.05 },
    ],
  },
  {
    id: "hero",
    label: "Hero Animation",
    sliders: [
      { label: "Y Enter Duration", path: "firstSectionAnimation.y.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Y Exit Value (vh)", path: "firstSectionAnimation.y.exitValue", min: -20, max: 0, step: 1 },
      { label: "Scale Enter Duration", path: "firstSectionAnimation.scale.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Scale Start", path: "firstSectionAnimation.scale.startValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Scale Mid", path: "firstSectionAnimation.scale.midValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Scale Exit", path: "firstSectionAnimation.scale.exitValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Opacity Enter Duration", path: "firstSectionAnimation.opacity.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Opacity Start", path: "firstSectionAnimation.opacity.startValue", min: 0, max: 1, step: 0.1 },
      { label: "Opacity Exit", path: "firstSectionAnimation.opacity.exitValue", min: 0, max: 1, step: 0.1 },
      { label: "Blur Start Offset", path: "firstSectionAnimation.blur.startOffset", min: 0, max: 0.3, step: 0.01 },
      { label: "Blur Max", path: "firstSectionAnimation.blur.maxValue", min: 0, max: 20, step: 1 },
      { label: "Radius Start Offset", path: "firstSectionAnimation.borderRadius.startOffset", min: 0, max: 0.2, step: 0.01 },
      { label: "Radius End Offset", path: "firstSectionAnimation.borderRadius.endOffset", min: 0.01, max: 0.3, step: 0.01 },
      { label: "Radius Start (px)", path: "firstSectionAnimation.borderRadius.startValue", min: 0, max: 64, step: 1 },
      { label: "Radius End (px)", path: "firstSectionAnimation.borderRadius.endValue", min: 0, max: 64, step: 1 },
    ],
  },
  {
    id: "card",
    label: "Card Animation",
    sliders: [
      { label: "Y Enter Duration", path: "middleSectionAnimation.y.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Y Exit Start Offset", path: "middleSectionAnimation.y.exitStartOffset", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Y Exit Value (vh)", path: "middleSectionAnimation.y.exitValue", min: -20, max: 0, step: 1 },
      { label: "Scale Enter Duration", path: "middleSectionAnimation.scale.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Scale Enter", path: "middleSectionAnimation.scale.enterValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Scale Exit", path: "middleSectionAnimation.scale.exitValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Opacity Enter Duration", path: "middleSectionAnimation.opacity.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Opacity Exit", path: "middleSectionAnimation.opacity.exitValue", min: 0, max: 1, step: 0.1 },
      { label: "Blur End Offset", path: "middleSectionAnimation.blur.endOffset", min: 0.01, max: 0.3, step: 0.01 },
      { label: "Blur Max", path: "middleSectionAnimation.blur.maxValue", min: 0, max: 20, step: 1 },
      { label: "Radius Start Offset", path: "middleSectionAnimation.borderRadius.startOffset", min: 0, max: 0.2, step: 0.01 },
      { label: "Radius End Offset", path: "middleSectionAnimation.borderRadius.endOffset", min: 0.01, max: 0.3, step: 0.01 },
      { label: "Radius (px)", path: "middleSectionAnimation.borderRadius.value", min: 0, max: 64, step: 1 },
    ],
  },
  {
    id: "sub",
    label: "Sub-Animations",
    sliders: [
      { label: "Left Card Slide-in Point", path: "sections.1.subAnimations.left.trigger", min: 0.05, max: 0.5, step: 0.01 },
      { label: "Right Card Slide-in Point", path: "sections.1.subAnimations.right.trigger", min: 0.1, max: 0.6, step: 0.01 },
      { label: "Sub-card Spring Stiffness", path: "subAnimationSpring.stiffness", min: 10, max: 300, step: 5 },
      { label: "Sub-card Spring Damping", path: "subAnimationSpring.damping", min: 5, max: 50, step: 1 },
    ],
  },
  {
    id: "bg",
    label: "Background Glow",
    sliders: [
      { label: "Glow Point 1", path: "bgGlowOpacity.input.0", min: 0, max: 0.5, step: 0.01 },
      { label: "Opacity 1", path: "bgGlowOpacity.output.0", min: 0, max: 1, step: 0.05 },
      { label: "Glow Point 2", path: "bgGlowOpacity.input.1", min: 0, max: 0.5, step: 0.01 },
      { label: "Opacity 2", path: "bgGlowOpacity.output.1", min: 0, max: 1, step: 0.05 },
      { label: "Glow Point 3", path: "bgGlowOpacity.input.2", min: 0.1, max: 0.8, step: 0.01 },
      { label: "Opacity 3", path: "bgGlowOpacity.output.2", min: 0, max: 1, step: 0.05 },
      { label: "Glow Point 4", path: "bgGlowOpacity.input.3", min: 0.5, max: 0.95, step: 0.01 },
      { label: "Opacity 4", path: "bgGlowOpacity.output.3", min: 0, max: 1, step: 0.05 },
      { label: "Glow Point 5", path: "bgGlowOpacity.input.4", min: 0.7, max: 1, step: 0.01 },
      { label: "Opacity 5", path: "bgGlowOpacity.output.4", min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    id: "cta",
    label: "CTA Animation",
    sliders: [
      { label: "Y Enter Duration", path: "lastSectionAnimation.y.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Scale Enter Duration", path: "lastSectionAnimation.scale.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Scale Enter", path: "lastSectionAnimation.scale.enterValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Opacity Enter Duration", path: "lastSectionAnimation.opacity.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Blur Max", path: "lastSectionAnimation.blur.maxValue", min: 0, max: 20, step: 1 },
      { label: "Radius (px)", path: "lastSectionAnimation.borderRadius.value", min: 0, max: 64, step: 1 },
    ],
  },
]

const CARD_GROUPS: { id: string; label: string; sliders: SliderDef[] }[] = [
  {
    id: "hero-card",
    label: "Hero Card",
    sliders: [
      { label: "Appear Point", path: "sections.0.scrollRange.0", min: 0, max: 0.5, step: 0.01 },
      { label: "Exit Point", path: "sections.0.scrollRange.1", min: 0.05, max: 0.8, step: 0.01 },
      { label: "Slide-up Time", path: "firstSectionAnimation.y.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Slide-up Distance", path: "firstSectionAnimation.y.exitValue", min: -20, max: 0, step: 1 },
      { label: "Zoom Time", path: "firstSectionAnimation.scale.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Start Scale", path: "firstSectionAnimation.scale.startValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Peak Scale", path: "firstSectionAnimation.scale.midValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "End Scale", path: "firstSectionAnimation.scale.exitValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Fade-in Time", path: "firstSectionAnimation.opacity.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Start Opacity", path: "firstSectionAnimation.opacity.startValue", min: 0, max: 1, step: 0.1 },
      { label: "End Opacity", path: "firstSectionAnimation.opacity.exitValue", min: 0, max: 1, step: 0.1 },
      { label: "Blur Start", path: "firstSectionAnimation.blur.startOffset", min: 0, max: 0.3, step: 0.01 },
      { label: "Max Blur", path: "firstSectionAnimation.blur.maxValue", min: 0, max: 20, step: 1 },
      { label: "Round Start", path: "firstSectionAnimation.borderRadius.startOffset", min: 0, max: 0.2, step: 0.01 },
      { label: "Round End", path: "firstSectionAnimation.borderRadius.endOffset", min: 0.01, max: 0.3, step: 0.01 },
      { label: "Start Radius", path: "firstSectionAnimation.borderRadius.startValue", min: 0, max: 64, step: 1 },
      { label: "End Radius", path: "firstSectionAnimation.borderRadius.endValue", min: 0, max: 64, step: 1 },
    ],
  },
  {
    id: "problem-card",
    label: "Problem Card",
    sliders: [
      { label: "Appear Point", path: "sections.1.scrollRange.0", min: 0, max: 0.5, step: 0.01 },
      { label: "Exit Point", path: "sections.1.scrollRange.1", min: 0.1, max: 0.8, step: 0.01 },
      { label: "Slide-up Time", path: "middleSectionAnimation.y.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Exit Delay", path: "middleSectionAnimation.y.exitStartOffset", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Slide-up Distance", path: "middleSectionAnimation.y.exitValue", min: -20, max: 0, step: 1 },
      { label: "Zoom Time", path: "middleSectionAnimation.scale.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Start Scale", path: "middleSectionAnimation.scale.enterValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "End Scale", path: "middleSectionAnimation.scale.exitValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Fade-in Time", path: "middleSectionAnimation.opacity.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "End Opacity", path: "middleSectionAnimation.opacity.exitValue", min: 0, max: 1, step: 0.1 },
      { label: "Blur Fade Point", path: "middleSectionAnimation.blur.endOffset", min: 0.01, max: 0.3, step: 0.01 },
      { label: "Max Blur", path: "middleSectionAnimation.blur.maxValue", min: 0, max: 20, step: 1 },
      { label: "Round Start", path: "middleSectionAnimation.borderRadius.startOffset", min: 0, max: 0.2, step: 0.01 },
      { label: "Round End", path: "middleSectionAnimation.borderRadius.endOffset", min: 0.01, max: 0.3, step: 0.01 },
      { label: "Corner Radius", path: "middleSectionAnimation.borderRadius.value", min: 0, max: 64, step: 1 },
      { label: "Left Sub-card At", path: "sections.1.subAnimations.left.trigger", min: 0.05, max: 0.5, step: 0.01 },
      { label: "Right Sub-card At", path: "sections.1.subAnimations.right.trigger", min: 0.1, max: 0.6, step: 0.01 },
      { label: "Bounce Strength", path: "subAnimationSpring.stiffness", min: 10, max: 300, step: 5 },
      { label: "Bounce Settle", path: "subAnimationSpring.damping", min: 5, max: 50, step: 1 },
    ],
  },
  {
    id: "how-card",
    label: "HowItWorks Card",
    sliders: [
      { label: "Tab 1 Appears At", path: "sections.2.scrollRange.0", min: 0.1, max: 0.8, step: 0.01 },
      { label: "Tab 1 Exits At", path: "sections.2.scrollRange.1", min: 0.3, max: 0.9, step: 0.01 },
      { label: "Tab 2 Appears At", path: "sections.3.scrollRange.0", min: 0.2, max: 0.9, step: 0.01 },
      { label: "Tab 3 Appears At", path: "sections.4.scrollRange.0", min: 0.3, max: 0.9, step: 0.01 },
    ],
  },
  {
    id: "cta-card",
    label: "CTA Card",
    sliders: [
      { label: "Appear Point", path: "sections.5.scrollRange.0", min: 0.5, max: 0.95, step: 0.01 },
      { label: "Exit Point", path: "sections.5.scrollRange.1", min: 0.8, max: 1.0, step: 0.01 },
      { label: "Slide-up Time", path: "lastSectionAnimation.y.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Zoom Time", path: "lastSectionAnimation.scale.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Start Scale", path: "lastSectionAnimation.scale.enterValue", min: 0.5, max: 1.5, step: 0.01 },
      { label: "Fade-in Time", path: "lastSectionAnimation.opacity.enterDuration", min: 0.01, max: 0.25, step: 0.01 },
      { label: "Max Blur", path: "lastSectionAnimation.blur.maxValue", min: 0, max: 20, step: 1 },
      { label: "Corner Radius", path: "lastSectionAnimation.borderRadius.value", min: 0, max: 64, step: 1 },
    ],
  },
  {
    id: "global-card",
    label: "Global",
    sliders: [
      { label: "Scroll Length", path: "scrollHeightVH", min: 200, max: 1000, step: 10, unit: "vh" },
      { label: "Scroll Smoothness", path: "spring.stiffness", min: 10, max: 300, step: 5 },
      { label: "Scroll Settle", path: "spring.damping", min: 5, max: 50, step: 1 },
      { label: "Rest Threshold", path: "spring.restDelta", min: 0.0001, max: 0.01, step: 0.0001 },
      { label: "Pre-load Margin", path: "lazyMountMargin", min: 0, max: 0.5, step: 0.05 },
      { label: "Glow Checkpoint 1", path: "bgGlowOpacity.input.0", min: 0, max: 0.5, step: 0.01 },
      { label: "Glow Opacity 1", path: "bgGlowOpacity.output.0", min: 0, max: 1, step: 0.05 },
      { label: "Glow Checkpoint 2", path: "bgGlowOpacity.input.1", min: 0, max: 0.5, step: 0.01 },
      { label: "Glow Opacity 2", path: "bgGlowOpacity.output.1", min: 0, max: 1, step: 0.05 },
      { label: "Glow Checkpoint 3", path: "bgGlowOpacity.input.2", min: 0.1, max: 0.8, step: 0.01 },
      { label: "Glow Opacity 3", path: "bgGlowOpacity.output.2", min: 0, max: 1, step: 0.05 },
      { label: "Glow Checkpoint 4", path: "bgGlowOpacity.input.3", min: 0.5, max: 0.95, step: 0.01 },
      { label: "Glow Opacity 4", path: "bgGlowOpacity.output.3", min: 0, max: 1, step: 0.05 },
      { label: "Glow Checkpoint 5", path: "bgGlowOpacity.input.4", min: 0.7, max: 1, step: 0.01 },
      { label: "Glow Opacity 5", path: "bgGlowOpacity.output.4", min: 0, max: 1, step: 0.05 },
    ],
  },
]

type ViewMode = "type" | "card"

export function AnimationEditor() {
  const { config, updateConfig, resetConfig, exportConfig, importConfig, undo, redo, canUndo, canRedo } = useAnimationConfig()
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState(false)

  const activeGroups = viewMode === "type" ? GROUPS : CARD_GROUPS

  const filteredGroups = useMemo(() => {
    return activeGroups
  }, [activeGroups])

  const handleExport = useCallback(() => {
    const json = exportConfig()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "animationConfig.json"
    a.click()
    URL.revokeObjectURL(url)
  }, [exportConfig])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const text = reader.result as string
        const ok = importConfig(text)
        setImportError(!ok)
        setTimeout(() => setImportError(false), 2000)
      }
      reader.readAsText(file)
      e.target.value = ""
    },
    [importConfig],
  )

  const handleReset = useCallback(() => {
    resetConfig()
  }, [resetConfig])

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex bg-neutral-900 border border-neutral-700 rounded-md p-0.5">
          <button
            onClick={() => setViewMode("type")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded transition-colors",
              viewMode === "type"
                ? "bg-brand-green text-black"
                : "text-neutral-400 hover:text-white",
            )}
          >
            Type
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded transition-colors",
              viewMode === "card"
                ? "bg-brand-green text-black"
                : "text-neutral-400 hover:text-white",
            )}
          >
            Per Card
          </button>
        </div>

        <div className="flex-1" />

        <button onClick={handleImportClick} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors border border-neutral-700">
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Import</span>
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />

        <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black bg-brand-green hover:bg-brand-green-hover rounded-md transition-colors">
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors border border-neutral-700">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-neutral-700" />

        <button
          onClick={undo}
          disabled={!canUndo}
          className={cn(
            "p-1.5 rounded-md transition-colors border border-neutral-700",
            canUndo
              ? "text-neutral-300 bg-neutral-800 hover:bg-neutral-700"
              : "text-neutral-600 bg-neutral-900 cursor-not-allowed",
          )}
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={cn(
            "p-1.5 rounded-md transition-colors border border-neutral-700",
            canRedo
              ? "text-neutral-300 bg-neutral-800 hover:bg-neutral-700"
              : "text-neutral-600 bg-neutral-900 cursor-not-allowed",
          )}
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {importError && (
        <p className="text-xs text-red-400 mb-3">Invalid JSON. Please check the file format.</p>
      )}

      <Accordion type="multiple" className="space-y-2">
        {filteredGroups.map((group) => (
          <AccordionItem key={group.id} value={group.id} className="border border-neutral-800 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-neutral-200 hover:no-underline hover:bg-neutral-900/50 data-[state=open]:bg-neutral-900/50">
              {group.label}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className={cn("grid gap-x-6", "grid-cols-1 md:grid-cols-2")}>
                {group.sliders.map((slider) => {
                  const current = getVal(config, slider.path)
                  const def = getDefaultVal(slider.path)
                  const differs = Math.abs(current - def) > 0.0001
                  return (
                    <EditorSlider
                      key={slider.path}
                      label={slider.label}
                      value={current}
                      min={slider.min}
                      max={slider.max}
                      step={slider.step}
                      unit={slider.unit}
                      differsFromDefault={differs}
                      onChange={(v) => updateConfig(slider.path, v)}
                    />
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
