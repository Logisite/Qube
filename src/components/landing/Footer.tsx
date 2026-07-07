const links = [
  { href: "https://github.com/Logisite/confidential-wrapper", label: "GitHub" },
  { href: "https://docs.zama.ai", label: "Zama SDK" },
  { href: "https://eips.ethereum.org/EIPS/eip-7984", label: "ERC-7984" },
]

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-black text-white tracking-tight">Qube</span>
            <div className="w-[3px] h-4 bg-brand-green rounded-sm" />
          </div>

          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-500 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-5 text-center">
          <span className="blur-reveal inline-block text-sm font-semibold tracking-wide text-neutral-500">
            Powered by Zama
          </span>
        </div>
      </div>
    </footer>
  )
}
