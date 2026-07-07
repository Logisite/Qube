import { motion, MotionValue } from "motion/react"

interface CtaCardProps {
  y: MotionValue<string>
  scale: MotionValue<number>
  opacity: MotionValue<number>
}

export function CtaCard({ y, scale, opacity }: CtaCardProps) {
  return (
    <motion.div
      style={{ y, scale, opacity }}
      className="absolute inset-0 bg-black text-white flex items-start justify-start overflow-hidden p-6 md:p-12 z-40 pt-16 md:pt-20"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-4">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="text-brand-green uppercase tracking-widest text-[10px] font-bold mb-4">Get Started</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-5">
            Stop Deploying.<br />
            <span className="text-brand-green">Start Building.</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            7 official pairs. Zero deployment. Free on Sepolia. Just connect and go.
          </p>

          <div className="mt-8 flex items-center gap-6 border-t border-neutral-800 pt-6">
            <div>
              <span className="block text-2xl font-black text-white">7</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Official Pairs</span>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div>
              <span className="block text-2xl font-black text-white">0</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Deployments Needed</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 w-full h-[380px] md:h-[480px] relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl z-0">
            <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-black to-neutral-900 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="absolute left-6 bottom-6 right-6 z-10 flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-1 bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 backdrop-blur-md shadow-2xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-bold font-mono">Registry</span>
                <span className="text-[9px] text-neutral-500 font-mono">Sepolia</span>
              </div>
              <p className="text-xs font-bold text-white leading-snug">0x2f0750Bbb0A246059d80e94c454586a7F27a128e</p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-black font-bold">
                +
              </div>
            </div>

            <div className="flex-1 bg-neutral-950/95 border-2 border-brand-green rounded-xl p-4 shadow-[0_0_25px_rgba(46,200,102,0.15)]">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
                  <span className="text-[9px] text-brand-green font-bold uppercase tracking-wider">Qube</span>
                </div>
                <span className="text-[9px] text-neutral-400 font-mono">Open the App</span>
              </div>
              <p className="text-xs font-bold text-white mb-2 leading-snug">Every official wrapper. One place.</p>
              <div className="flex items-center gap-1 text-[10px] text-brand-green font-semibold">
                Connect Wallet
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
