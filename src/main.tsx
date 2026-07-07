import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { useGSAP } from "@gsap/react"
import { AppProviders } from "./providers"
import "./index.css"
import App from "./App"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
)
