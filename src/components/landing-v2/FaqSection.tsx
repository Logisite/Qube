import { useState } from "react"
import { Plus, X } from "lucide-react"

const FAQ_ITEMS = [
  {
    question: "What is Qube?",
    answer:
      "Qube is a Confidential Wrapper Registry dApp. It lets you browse, wrap, unwrap, and decrypt official ERC-20 to ERC-7984 wrapper pairs on Sepolia and Ethereum mainnet.",
  },
  {
    question: "What is ERC-7984?",
    answer:
      "ERC-7984 is a standard for confidential fungible tokens. Balances and transfer amounts are encrypted on-chain using Fully Homomorphic Encryption (FHE). Only the token holder can decrypt their own balance.",
  },
  {
    question: "What networks does Qube support?",
    answer:
      "Qube supports Sepolia (testnet) with 7 token pairs and Ethereum mainnet with 9 token pairs. Make sure your wallet is connected to the correct network before using any features.",
  },
  {
    question: "How do I wrap a token?",
    answer:
      "Navigate to the Wrap page, select a token from the dropdown, enter an amount, and click Wrap. Your wallet will prompt you for an ERC-20 approval and then the shield transaction. After both confirm, your public tokens are converted to confidential ERC-7984 tokens.",
  },
  {
    question: "How do unwrap and decrypt work?",
    answer:
      "Unwrapping converts confidential tokens back to public ERC-20 via a two-step process: unwrap request and finalize. Decryption uses EIP-712 user decryption to securely reveal your encrypted balance without exposing it to anyone else.",
  },
  {
    question: "Why use official pairs instead of deploying my own?",
    answer:
      "When everyone uses the canonical pairs from the Wrappers Registry, integrations compose naturally, wallets can reliably display confidential balances, and developers build against a stable, well-documented set of contracts.",
  },
  {
    question: "Can I add custom token pairs?",
    answer:
      "Yes. Add a new entry to src/lib/tokens.ts with your ERC-20 and ERC-7984 addresses. It will appear in the registry alongside official pairs. See the Adding New Pairs guide in the docs for a step-by-step walkthrough.",
  },
  {
    question: "How do I get test tokens?",
    answer:
      "Navigate to the Faucet page on Sepolia, connect your wallet, and click Mint Dev Bundle to claim all official cTokenMock test tokens at once. You can also claim individually.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="px-6 py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3 space-y-4 shrink-0">
          <p className="text-sm font-medium text-brand-green tracking-wide uppercase">
            // FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Questions{" "}
            <span className="text-white/40">like?</span>
          </h2>
          <p className="text-white/50 leading-relaxed">
            For support, please open an issue on{" "}
            <a
              href="https://github.com/your-org/qube/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-2 decoration-white/30 hover:decoration-white/60 transition-colors"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <div className="lg:w-2/3 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="border border-white/10 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <span className="font-medium text-white text-[15px]">
                    {item.question}
                  </span>
                  <span className="shrink-0 size-5 flex items-center justify-center rounded-md bg-white/5">
                    {isOpen ? (
                      <X className="size-3.5 text-white/60" />
                    ) : (
                      <Plus className="size-3.5 text-white/60" />
                    )}
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? "200px" : "0" }}
                >
                  <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
