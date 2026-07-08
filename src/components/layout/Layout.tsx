import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router"
import { Toaster } from "sonner"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { Navbar } from "./Navbar"
import { GlassFilterSvg } from "@/components/GlassFilterSvg"

export function Layout() {
  const { pathname } = useLocation()
  const smootherRef = useRef<ScrollSmoother | null>(null)

  useEffect(() => {
    smootherRef.current = ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
    })

    return () => {
      smootherRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    smootherRef.current?.scrollTo(0, false)
  }, [pathname])

  return (
    <>
      <GlassFilterSvg />
      <Navbar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="min-h-screen flex-1 pt-16">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </>
  )
}
