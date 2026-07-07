import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router"
import { Toaster } from "sonner"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { Navbar } from "./Navbar"
import { GlassFilterSvg } from "@/components/GlassFilterSvg"

export function Layout() {
  const { pathname } = useLocation()
  const isLanding = pathname === "/"
  const smootherRef = useRef<ScrollSmoother | null>(null)

  useEffect(() => {
    if (isLanding) return
    smootherRef.current = ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
    })

    return () => {
      smootherRef.current?.kill()
    }
  }, [isLanding])

  useEffect(() => {
    smootherRef.current?.scrollTo(0, false)
  }, [pathname])

  if (isLanding) {
    return (
      <div className="min-h-screen flex flex-col">
        <GlassFilterSvg />
        <Outlet />
        <Toaster />
      </div>
    )
  }

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <div className="min-h-screen flex flex-col">
          <GlassFilterSvg />
          <Navbar />
          <main className="flex-1 pt-16">
            <Outlet />
          </main>
          <Toaster />
        </div>
      </div>
    </div>
  )
}
