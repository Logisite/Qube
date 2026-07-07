import { useCallback, useId, useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { SLIDER_DESCRIPTIONS } from "./descriptions"

interface EditorSliderProps {
  label: string
  path: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (value: number) => void
  differsFromDefault?: boolean
}

export function EditorSlider({ label, path, value, min, max, step, unit, onChange, differsFromDefault }: EditorSliderProps) {
  const id = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  const description = SLIDER_DESCRIPTIONS[path]
  const hasDescription = description !== undefined

  const percent = ((value - min) / (max - min)) * 100

  const clampToStep = useCallback(
    (raw: number) => {
      let v = Math.round(raw / step) * step
      v = Math.max(min, Math.min(max, v))
      return Math.round(v / step) * step
    },
    [min, max, step],
  )

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return value
      const rect = track.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return clampToStep(min + ratio * (max - min))
    },
    [min, max, step, value, clampToStep],
  )

  const handleThumbPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [],
  )

  const handleThumbPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      const newValue = getValueFromPosition(e.clientX)
      onChange(newValue)
    },
    [isDragging, getValueFromPosition, onChange],
  )

  const handleThumbPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      setIsDragging(false)
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    },
    [isDragging],
  )

  useEffect(() => {
    if (!isDragging) return
    const handleGlobalMove = (e: PointerEvent) => {
      const newValue = getValueFromPosition(e.clientX)
      onChange(newValue)
    }
    const handleGlobalUp = () => {
      setIsDragging(false)
    }
    window.addEventListener("pointermove", handleGlobalMove)
    window.addEventListener("pointerup", handleGlobalUp)
    return () => {
      window.removeEventListener("pointermove", handleGlobalMove)
      window.removeEventListener("pointerup", handleGlobalUp)
    }
  }, [isDragging, getValueFromPosition, onChange])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value)
      if (!isNaN(v)) onChange(clampToStep(v))
    },
    [onChange, clampToStep],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      let v = Number(e.target.value)
      if (isNaN(v)) v = min
      v = clampToStep(v)
      onChange(v)
    },
    [min, clampToStep, onChange],
  )

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 py-1.5">
      <div className="flex items-center gap-2 sm:w-[180px] shrink-0">
        {differsFromDefault && <span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />}
        <label htmlFor={id} className="text-xs text-neutral-400 truncate">{label}</label>
        {hasDescription && (
          <button
            type="button"
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center justify-center w-3.5 h-3.5 rounded-full border border-neutral-600 text-[8px] text-neutral-500 hover:text-neutral-300 hover:border-neutral-400 transition-colors shrink-0"
          >
            i
          </button>
        )}
      </div>

      <div
        ref={trackRef}
        className="relative flex-1 h-6 flex items-center cursor-pointer touch-none"
      >
        <div className="absolute h-1.5 bg-neutral-800 rounded-full w-full" />
        <div
          className="absolute h-1.5 bg-neutral-600 rounded-full"
          style={{ width: `${percent}%` }}
        />
        <div
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          className={cn(
            "absolute w-3.5 h-3.5 rounded-full bg-brand-green shadow-[0_0_6px_rgba(46,200,102,0.4)] cursor-grab active:cursor-grabbing touch-none select-none",
            isDragging && "ring-2 ring-brand-green/30",
          )}
          style={{ left: `calc(${percent}% - 7px)` }}
        />
      </div>

      <div className="flex items-center gap-1 sm:w-[100px] shrink-0">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={cn(
            "w-full px-2 py-1 text-xs font-mono rounded border bg-neutral-900 text-neutral-200 outline-none transition-colors",
            "border-neutral-700 focus:border-brand-green",
          )}
        />
        {unit && <span className="text-[10px] text-neutral-500 shrink-0">{unit}</span>}
      </div>

      {hasDescription && showDescription && (
        <div className="bg-neutral-900 border border-neutral-800 rounded p-2 mt-1 text-xs text-neutral-500 sm:col-span-3">
          {description}
        </div>
      )}
    </div>
  )
}
