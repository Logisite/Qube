import { useRef, useEffect } from "react"
import { useLocation } from "react-router"

export function useGlassTrack(routeOrder: string[]) {
  const location = useLocation()
  const previousRef = useRef<string>("")

  const currentIndex = routeOrder.indexOf(location.pathname)
  const previousIndex = routeOrder.indexOf(previousRef.current)

  useEffect(() => {
    const current = location.pathname
    return () => {
      previousRef.current = current
    }
  }, [location.pathname])

  const active = String(currentIndex + 1)
  const previous = previousIndex >= 0 ? String(previousIndex + 1) : ""

  return { active, previous, previousRaw: previousRef.current }
}
