import { createContext, useContext, useState, useCallback, useRef, type PropsWithChildren } from "react"
import type { AnimationConfig } from "./animationConfig"
import { defaultAnimationConfig } from "./animationConfig"

interface AnimationConfigContextValue {
  config: AnimationConfig
  defaultConfig: AnimationConfig
  updateConfig: (path: string, value: number | number[] | string) => void
  resetConfig: () => void
  exportConfig: () => string
  importConfig: (json: string) => boolean
  editorOpen: boolean
  toggleEditor: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const AnimationConfigContext = createContext<AnimationConfigContextValue | null>(null)

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function setNestedValue(obj: unknown, path: string, value: unknown): unknown {
  const keys = path.split(".")
  if (keys.length === 1) {
    if (Array.isArray(obj)) {
      const copy = [...obj]
      copy[Number(keys[0])] = value
      return copy
    }
    return { ...(obj as Record<string, unknown>), [keys[0]]: value }
  }
  const [head, ...rest] = keys
  if (Array.isArray(obj)) {
    const copy = [...obj]
    copy[Number(head)] = setNestedValue(copy[Number(head)], rest.join("."), value)
    return copy
  }
  return {
    ...(obj as Record<string, unknown>),
    [head]: setNestedValue((obj as Record<string, unknown>)[head], rest.join("."), value),
  }
}

function cloneConfig(cfg: AnimationConfig): AnimationConfig {
  return JSON.parse(JSON.stringify(cfg)) as AnimationConfig
}

export function AnimationConfigProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<AnimationConfig>(defaultAnimationConfig)
  const [editorOpen, setEditorOpen] = useState(false)
  const [historyIndex, setHistoryIndex] = useState(0)
  const historyRef = useRef<AnimationConfig[]>([defaultAnimationConfig])

  const toggleEditor = useCallback(() => {
    setEditorOpen((prev) => !prev)
  }, [])

  const updateConfig = useCallback((path: string, value: number | number[] | string) => {
    setConfig((prev) => {
      const next = setNestedValue(prev, path, value) as AnimationConfig
      historyRef.current = [...historyRef.current.slice(0, historyIndex + 1), cloneConfig(next)]
      setHistoryIndex(historyRef.current.length - 1)
      return next
    })
  }, [historyIndex])

  const resetConfig = useCallback(() => {
    const next = cloneConfig(defaultAnimationConfig)
    historyRef.current = [...historyRef.current.slice(0, historyIndex + 1), next]
    setHistoryIndex(historyRef.current.length - 1)
    setConfig(next)
  }, [historyIndex])

  const undo = useCallback(() => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    setConfig(cloneConfig(historyRef.current[newIndex]))
  }, [historyIndex])

  const redo = useCallback(() => {
    if (historyIndex >= historyRef.current.length - 1) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    setConfig(cloneConfig(historyRef.current[newIndex]))
  }, [historyIndex])

  const exportConfig = useCallback(() => {
    return JSON.stringify(config, null, 2)
  }, [config])

  const importConfig = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as AnimationConfig
      historyRef.current = [...historyRef.current.slice(0, historyIndex + 1), cloneConfig(parsed)]
      setHistoryIndex(historyRef.current.length - 1)
      setConfig(parsed)
      return true
    } catch {
      return false
    }
  }, [historyIndex])

  return (
    <AnimationConfigContext.Provider value={{
      config,
      defaultConfig: defaultAnimationConfig,
      updateConfig,
      resetConfig,
      exportConfig,
      importConfig,
      editorOpen,
      toggleEditor,
      undo,
      redo,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < historyRef.current.length - 1,
    }}>
      {children}
    </AnimationConfigContext.Provider>
  )
}

export function useAnimationConfig(): AnimationConfigContextValue {
  const ctx = useContext(AnimationConfigContext)
  if (!ctx) throw new Error("useAnimationConfig must be used within AnimationConfigProvider")
  return ctx
}

export function useAnimationConfigValue<T>(path: string): T {
  const { config } = useAnimationConfig()
  return getNestedValue(config, path) as T
}
