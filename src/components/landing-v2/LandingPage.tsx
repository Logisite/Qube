import { Link } from "react-router"
import logoWhite from "@/assets/logos/logo-white.svg"

export function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 flex items-center">
          <div className="flex items-center gap-1.5">
            <img src={logoWhite} alt="Qube logo" className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">Qube</span>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Why is every team building their own test tokens?
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            The official Zama Wrappers Registry already has canonical pairs on Sepolia and
            mainnet. All of them are here. Browse the list, see the addresses, and start
            using what already exists.
          </p>
          <Link
            to="/registry"
            className="inline-block px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Open the Registry
          </Link>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Everything you need to know is in the docs.
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            How to wrap a token, how to decrypt a balance, how to add a new pair.
            Step-by-step, with code.
          </p>
          <Link
            to="/docs"
            className="inline-block px-8 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-colors"
          >
            Read the Docs
          </Link>
        </div>
      </section>
    </div>
  )
}
