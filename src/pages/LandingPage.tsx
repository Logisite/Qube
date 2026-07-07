import { LandingPage as LandingHero } from "@/components/landing-v2/LandingPage"
import { Footer } from "@/components/landing/Footer"
import { AnimationConfigProvider } from "@/components/landing-v2/AnimationConfigContext"

export function LandingPage() {
  return (
    <AnimationConfigProvider>
      <LandingHero />
      <Footer />
    </AnimationConfigProvider>
  )
}
