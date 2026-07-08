import { useState } from "react"
import { NavLink, Link, useLocation } from "react-router"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Shield, Menu } from "lucide-react"
import { navLinks } from "@/lib/nav"
import { isTestnet } from "@/lib/chains"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChainSwitcher } from "@/components/layout/ChainSwitcher"
import logoWhite from "@/assets/logos/logo-white.svg"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { chainId } = useAccount()
  const { pathname } = useLocation()
  const onTestnet = isTestnet(chainId)
  const visibleLinks = onTestnet
    ? navLinks
    : navLinks.filter((link) => !link.href.includes("/faucet"))

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[9999] backdrop-blur-md border-b bg-black/50 border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
        <Link to="/registry" className="flex items-center gap-1.5 no-underline">
          <img
            src={logoWhite}
            alt="Qube logo"
            className="h-6 w-6 md:h-7 md:w-7"
          />
          <span className="font-display text-base md:text-lg font-bold tracking-tight text-white">
            Qube
          </span>
          <div className="w-[3px] h-3 bg-brand-green rounded-sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-neutral-400">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `transition-colors no-underline ${
                  isActive ? "text-white" : "text-neutral-400 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {pathname !== "/" && <ChainSwitcher />}
          <div className="hidden md:block">
            <ConnectButton chainStatus="none" />
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-black/95 border-white/5">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-brand-green" />
                  Qube
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 mt-4">
                {visibleLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2 text-sm transition-colors no-underline ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <div className="px-4 pt-4 flex items-center gap-2">
                {pathname !== "/" && <ChainSwitcher />}
                <ConnectButton chainStatus="none" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
