import { motion, MotionValue, useTransform } from "motion/react"

interface HowItWorksCardProps {
  y: MotionValue<string>
  scale: MotionValue<number>
  opacity: MotionValue<number>
  activeTab: "tab1" | "tab2" | "tab3"
  blur: MotionValue<number>
}

const tabs = [
  {
    id: "tab1" as const,
    label: "All 7 official pairs.",
    description: "Browse the registry. Every ERC-20 to ERC-7984 pair with addresses, ABIs, and metadata.",
    icon: <circle cx="11" cy="11" r="8" />,
    iconPath2: <path d="m21 21-4.3-4.3" />,
  },
  {
    id: "tab2" as const,
    label: "Convert public to private.",
    description: "Wrap your ERC-20 tokens into encrypted ERC-7984. Balance hidden on-chain.",
    icon: <><path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="m16 21 4-4-4-4" /><path d="M20 17H4" /></>,
  },
  {
    id: "tab3" as const,
    label: "See your encrypted balance.",
    description: "Decrypt any ERC-7984 balance. Only you can see the real number.",
    icon: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  },
]

export function HowItWorksCard({ y, scale, opacity, activeTab, blur }: HowItWorksCardProps) {
  const filter = useTransform(blur, (v) => v > 0 ? `blur(${v}px)` : "none")

  return (
    <motion.div
      style={{ y, scale, opacity, filter, borderRadius: "32px" }}
      className="absolute inset-0 bg-white text-neutral-900 border border-neutral-200 flex flex-col justify-start overflow-hidden shadow-2xl p-6 md:p-12 z-30 pt-16 md:pt-20"
    >
      <div className="max-w-6xl mx-auto w-full py-4">
        <div className="mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            <span className="text-brand-green">Browse.</span> Wrap. Decrypt.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col gap-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`p-5 rounded-xl border transition-all ${
                  activeTab === tab.id
                    ? "bg-neutral-50 border-neutral-200 shadow-sm"
                    : "border-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <svg
                    className={`w-5 h-5 mt-0.5 ${activeTab === tab.id ? "text-brand-green" : "text-neutral-400"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {tab.icon}
                    {tab.iconPath2}
                  </svg>
                  <div>
                    <h3 className={`font-display text-base md:text-lg font-bold ${activeTab === tab.id ? "text-neutral-950 font-black" : "text-neutral-400"}`}>
                      {tab.label}
                    </h3>
                    {activeTab === tab.id && (
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        {tab.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 h-[340px] md:h-[400px] w-full flex items-center justify-center relative bg-neutral-950 rounded-2xl border border-neutral-800 p-6 overflow-hidden">
            {activeTab === "tab1" && <RegistryPanel />}
            {activeTab === "tab2" && <WrapPanel />}
            {activeTab === "tab3" && <DecryptPanel />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function RegistryPanel() {
  return (
    <div className="w-full h-full flex flex-col justify-between text-white">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-neutral-400 font-mono tracking-wider">Registry Browser</span>
        <span className="text-[9px] bg-brand-green/20 text-brand-green px-2 py-0.5 rounded font-bold font-mono">LIVE</span>
      </div>

      <div className="space-y-2 my-auto">
        {["cUSDCMock", "cUSDTMock", "cWETHMock", "cBRONMock"].map((token, i) => (
          <div key={token} className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-green" />
              <span className="text-xs font-bold text-white">{token}</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">0x{(i + 1).toString().padStart(4, "0")}...</span>
          </div>
        ))}
        <div className="text-center text-[10px] text-neutral-600 font-mono">+ 3 more pairs</div>
      </div>

      <div className="bg-neutral-900/40 rounded-lg p-3 border border-neutral-800/60 font-mono text-[10px] text-neutral-400">
        <p className="text-neutral-300">All pairs read from on-chain registry at 0x2f07...</p>
      </div>
    </div>
  )
}

function WrapPanel() {
  return (
    <div className="w-full h-full flex flex-col justify-between text-white">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
        <span className="text-[10px] text-neutral-400 font-mono tracking-wider">Wrap Flow</span>
        <span className="text-[9px] bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded font-bold font-mono">STEP 1 OF 2</span>
      </div>

      <div className="my-auto space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-neutral-400">Amount</span>
            <span className="text-lg font-black text-white">100 USDC</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-green h-full rounded-full" style={{ width: "75%" }} />
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-neutral-500">Approve</span>
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-brand-green font-bold">Wrap</span>
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-500">Done</span>
        </div>
      </div>

      <div className="bg-neutral-900/40 rounded-lg p-3 border border-neutral-800/60 font-mono text-[10px]">
        <span className="text-brand-green font-bold">100 USDC</span>
        <span className="text-neutral-500"> becomes </span>
        <span className="text-brand-green font-bold">100 cUSDC</span>
        <span className="text-neutral-500"> (encrypted)</span>
      </div>
    </div>
  )
}

function DecryptPanel() {
  return (
    <div className="w-full h-full flex flex-col justify-between text-white relative">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-neutral-300 font-mono">Decrypt Balance</span>
        <span className="text-[9px] bg-brand-green text-black px-2 py-0.5 rounded font-bold">ACTIVE</span>
      </div>

      <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 max-w-xs mx-auto my-auto text-center">
        <span className="text-[10px] text-neutral-500 block mb-2">Your encrypted balance</span>
        <div className="text-2xl font-black text-brand-green font-display mb-1">handle: 0x7f3a...</div>
        <div className="text-[10px] text-neutral-500 mb-3">Only you can see the real number</div>
        <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
          <span className="text-lg font-black text-white font-display">42.5 USDC</span>
          <span className="text-[9px] text-brand-green block mt-1">Decrypted locally</span>
        </div>
      </div>

      <div className="text-[9px] text-neutral-500 font-mono text-center">
        EIP-712 permit signed. KMS decrypted.
      </div>
    </div>
  )
}
