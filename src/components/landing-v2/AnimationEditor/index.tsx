import { useState, useCallback, useRef, useMemo } from "react"
import { Download, Upload, RotateCcw, Undo2, Redo2 } from "lucide-react"
import { useAnimationConfig } from "../AnimationConfigContext"
import { EditorSlider } from "./EditorSlider"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import type { AnimationConfig } from "../animationConfig"
import { defaultAnimationConfig } from "../animationConfig"
import { GROUPS } from "./GROUPS"
import { CARD_GROUPS } from "./CARD_GROUPS"

function getVal(cfg: AnimationConfig, path: string): number {
  return path.split(".").reduce((acc: unknown, k) => (acc as Record<string, unknown>)?.[k], cfg) as number
}

function getDefaultVal(path: string): number {
  return getVal(defaultAnimationConfig, path)
}

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
                      path={slider.path}
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
