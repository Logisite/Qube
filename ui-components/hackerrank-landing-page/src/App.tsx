/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import { Bot, Award, Sparkles, Check, Terminal, Users, Zap, ExternalLink } from 'lucide-react';

// Fingerprint Icon (flat, clean, crisp green matching the video)
const FingerprintIcon = () => (
  <svg
    className="w-10 h-10 md:w-14 md:h-14 inline-block mx-2 text-brand-green align-middle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22v-4" />
    <path d="M12 14c1.66 0 3-1.34 3-3V7c0-1.66-1.34-3-3-3S9 5.34 9 7v4c0 1.66 1.34 3 3 3z" />
    <path d="M5 14a7 7 0 0 0 14 0" />
    <path d="M19 10a9.96 9.96 0 0 0-4.5-8.3" />
    <path d="M4.5 18.3A9.96 9.96 0 0 0 5 10" />
    <path d="M8 11a4 4 0 0 1 8 0" />
  </svg>
);

// Sparkle/Star Icon (flat 4-point star matching the video)
const SparkleIcon = () => (
  <svg
    className="w-9 h-9 md:w-12 md:h-12 inline-block mx-2 text-brand-green align-middle"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0c.2 3.8 2.2 5.8 6 6-3.8.2-5.8 2.2-6 6-.2-3.8-2.2-5.8-6-6 3.8-.2 5.8-2.2 6-6z" transform="translate(0, 0) scale(1.3)" />
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2' | 'tab3'>('tab1');
  const [cookieVisible, setCookieVisible] = useState(true);
  const [headerTheme, setHeaderTheme] = useState<'dark' | 'light'>('dark');

  // Monitor scroll position
  const { scrollYProgress } = useScroll();
  
  // Create a spring-smoothed value for butter-smooth scroll animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 30,
    restDelta: 0.001
  });

  // Track state changes based on scroll progression thresholds
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    // Nav bar theme transitions based on active stacked card
    if (latest < 0.18) {
      setHeaderTheme('dark');
    } else if (latest < 0.84) {
      setHeaderTheme('light');
    } else {
      setHeaderTheme('dark');
    }

    // Precise interactive tab state tracking within Card 3's active scroll region
    if (latest < 0.48) {
      setActiveTab('tab1');
    } else if (latest < 0.58) {
      setActiveTab('tab1');
    } else if (latest < 0.68) {
      setActiveTab('tab2');
    } else {
      setActiveTab('tab3');
    }
  });

  // =========================================================
  // STACKED OVERLAP CARD ANIMATION VALUES
  // =========================================================

  // Card 1 (Hero): Active from 0.0 to 0.20, then stays scaled down as Card 2 slides over it
  const scaleHero = useTransform(smoothProgress, [0, 0.15, 0.22], [1, 0.90, 0.85], { clamp: true });
  const yHero = useTransform(smoothProgress, [0, 0.15, 0.22], ["0vh", "0vh", "-8vh"], { clamp: true }); // subtle parallax push up
  const radiusHero = useTransform(smoothProgress, [0, 0.15], ["0px", "32px"], { clamp: true });
  const opacityHero = useTransform(smoothProgress, [0, 0.18, 0.22], [1, 1, 0], { clamp: true }); // fade out once fully covered

  // Card 2 (Adventure): Slides up from 0.15 to 0.22, active to 0.45, then shrinks as Card 3 covers it
  const yAdventure = useTransform(smoothProgress, [0.12, 0.22, 0.42, 0.48], ["100vh", "0vh", "0vh", "-8vh"], { clamp: true });
  const scaleAdventure = useTransform(smoothProgress, [0.12, 0.22, 0.42, 0.48], [1, 1, 1, 0.90], { clamp: true });
  const radiusAdventure = useTransform(smoothProgress, [0.12, 0.22], ["32px", "32px"], { clamp: true });
  const opacityAdventure = useTransform(smoothProgress, [0.12, 0.18, 0.44, 0.48], [0, 1, 1, 0], { clamp: true });

  // Card 3 (Features): Slides up from 0.38 to 0.48, active to 0.78, then shrinks as Card 4 covers it
  const yFeatures = useTransform(smoothProgress, [0.38, 0.48, 0.78, 0.84], ["100vh", "0vh", "0vh", "-8vh"], { clamp: true });
  const scaleFeatures = useTransform(smoothProgress, [0.38, 0.48, 0.78, 0.84], [1, 1, 1, 0.90], { clamp: true });
  const opacityFeatures = useTransform(smoothProgress, [0.38, 0.44, 0.80, 0.84], [0, 1, 1, 0], { clamp: true });

  // Card 4 (Climax): Slides up from 0.78 to 0.84 and stays full-screen to the end
  const yClimax = useTransform(smoothProgress, [0.78, 0.84], ["100vh", "0vh"], { clamp: true });
  const scaleClimax = useTransform(smoothProgress, [0.78, 0.84], [0.95, 1], { clamp: true });
  const opacityClimax = useTransform(smoothProgress, [0.78, 0.82], [0, 1], { clamp: true });

  // Ambient green glow background opacity mapping
  const bgGlowOpacity = useTransform(smoothProgress, [0, 0.15, 0.45, 0.82, 0.92], [0.1, 0.8, 0.1, 0.1, 0.7], { clamp: true });

  return (
    <div className="relative w-full bg-black text-white select-none selection:bg-brand-green selection:text-black">
      
      {/* Sticky Global Header with dynamic color theme */}
      <header className={`fixed top-0 left-0 right-0 w-full z-[9999] transition-all duration-300 backdrop-blur-md border-b ${
        headerTheme === 'dark' 
          ? 'bg-black/50 border-white/5 text-white' 
          : 'bg-white/50 border-neutral-200/80 text-neutral-900'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <span className={`font-display text-xl md:text-2xl font-black tracking-tight transition-colors ${
              headerTheme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              HackerRank
            </span>
            <div className="w-[3px] h-5 bg-brand-green rounded-sm" />
          </div>

          {/* Nav Links */}
          <nav className={`hidden md:flex items-center gap-8 font-semibold text-sm transition-colors ${
            headerTheme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            <a href="#products" className={`transition-colors ${headerTheme === 'dark' ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Products</a>
            <a href="#solutions" className={`transition-colors ${headerTheme === 'dark' ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Solutions</a>
            <a href="#resources" className={`transition-colors ${headerTheme === 'dark' ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Resources</a>
            <a href="#pricing" className={`transition-colors ${headerTheme === 'dark' ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Pricing</a>
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-5">
            <a
              href="#developers"
              className={`hidden lg:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                headerTheme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              For Developers
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>
            <button className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer border ${
              headerTheme === 'dark' 
                ? 'border-white/10 hover:border-white/30 text-white' 
                : 'border-neutral-200 hover:border-neutral-400 text-neutral-900'
            }`}>
              Request Demo
            </button>
            <button className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-brand-green hover:bg-brand-green-hover text-black rounded-lg transition-colors cursor-pointer font-extrabold">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Scroll indicator for the user to understand the interactive nature */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-neutral-900/90 border border-neutral-800/80 px-4 py-2 rounded-full shadow-2xl backdrop-blur-sm pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Scroll Driven Website</span>
      </div>

      {/* Pinned background container providing standard ambient visual depth */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        {/* Deep green radial glow centered */}
        <motion.div 
          style={{ opacity: bgGlowOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,200,102,0.18)_0%,rgba(0,0,0,0)_75%)]"
        />
      </div>

      {/* Primary Fixed Scroll Space (giving ample scrolling depth) */}
      <div className="relative h-[800vh] w-full z-10">
        
        {/* Fixed wrapper to host the cards viewport (bulletproof fallback for sandboxed frames and standard browsers) */}
        <div className="fixed inset-0 w-full h-screen overflow-hidden flex items-center justify-center z-10">

          {/* ========================================================= */}
          {/* PHASE 1: HERO SECTION CARD                                */}
          {/* ========================================================= */}
          <motion.div
            style={{
              scale: scaleHero,
              y: yHero,
              borderRadius: radiusHero,
              opacity: opacityHero,
            }}
            className="absolute inset-0 bg-black border border-white/5 flex flex-col justify-between overflow-hidden shadow-2xl z-10 pt-20"
          >
            {/* Hero Headline content */}
            <div className="max-w-5xl mx-auto px-6 text-center my-auto flex flex-col items-center">
              <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-medium tracking-tight text-white leading-[1.1] md:leading-[1.15]">
                <span className="block text-neutral-400 font-light">The future</span>
                <span className="block text-white py-1">of development</span>
                <span className="block mt-4 text-3xl sm:text-5xl md:text-7xl font-extrabold flex flex-wrap items-center justify-center gap-y-3">
                  is <FingerprintIcon /> <span className="text-white tracking-tight">human</span> 
                  <span className="text-neutral-500 font-light mx-2">+</span> 
                  <SparkleIcon /> <span className="text-white tracking-tight">AI</span>
                </span>
              </h1>

              <p className="mt-8 text-sm sm:text-base md:text-lg text-neutral-400 leading-relaxed max-w-xl">
                We help you map the skills you need, track the skills you have, and close your gaps to thrive in a GenAI world.
              </p>

              <button className="mt-10 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white border border-brand-green/40 hover:border-brand-green rounded-full bg-black/40 hover:bg-black/80 transition-all shadow-[0_0_20px_rgba(46,200,102,0.1)] cursor-pointer">
                Join The Community
              </button>
            </div>

            {/* Cookie Policy Banner */}
            {cookieVisible && (
              <div className="w-full px-4 md:px-10 pb-8 pt-4">
                <div className="max-w-4xl mx-auto bg-neutral-950/95 border border-neutral-800 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
                  <p className="text-[11px] text-neutral-400 leading-relaxed text-center sm:text-left flex-1 max-w-2xl">
                    We set essential cookies to help our run websites and services. By clicking Accept, you consent to the use of additional cookies for analytics and marketing. Feel free to update your settings at any time. Read more in our{' '}
                    <a href="#cookie" className="text-brand-green hover:underline font-semibold">Cookie Policy</a>.
                  </p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setCookieVisible(false)} className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white">
                      Decline
                    </button>
                    <button onClick={() => setCookieVisible(false)} className="px-5 py-2 text-[10px] font-bold uppercase tracking-wider bg-brand-green text-black rounded-md font-extrabold">
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>


          {/* ========================================================= */}
          {/* PHASE 2: CHOOSE YOUR ADVENTURE SECTION CARD               */}
          {/* ========================================================= */}
          <motion.div
            style={{
              y: yAdventure,
              scale: scaleAdventure,
              borderRadius: radiusAdventure,
              opacity: opacityAdventure,
            }}
            className="absolute inset-0 bg-white text-neutral-900 border border-neutral-200 flex flex-col justify-center overflow-hidden shadow-2xl p-6 md:p-12 z-20 pt-24 md:pt-28"
          >
            <div className="max-w-6xl mx-auto w-full max-h-[82vh] overflow-y-auto custom-scrollbar pr-2 py-4">
              {/* Title Header */}
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 text-neutral-900">
                  Choose Your <span className="text-brand-green">Adventure</span>
                </h2>
                <p className="text-neutral-500 font-semibold text-sm md:text-base leading-relaxed">
                  We build elite tech teams for companies and advance candidates' tech skills and job prospects.
                </p>
              </div>

              {/* Grid with Two Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                
                {/* Developer Card */}
                <div className="bg-neutral-950 rounded-2xl p-8 flex flex-col justify-between border border-neutral-800 shadow-xl h-full">
                  <div>
                    <div className="flex items-center gap-1.5 mb-5">
                      <Terminal className="w-4 h-4 text-brand-green" />
                      <span className="text-brand-green text-[10px] font-bold uppercase tracking-widest">For developers</span>
                    </div>

                    <h3 className="font-display text-xl md:text-2xl font-black text-white mb-5 leading-snug">
                      HackerRank helps you hone your developer skills and become GenAI-ready.
                    </h3>

                    <ul className="space-y-3.5 mb-8">
                      {[
                        'Track your skill proficiency',
                        'Prepare for technical interviews',
                        'Learn the latest GenAI skills',
                      ].map((bullet, i) => (
                        <li key={i} className="flex items-center gap-3 text-neutral-300 text-sm font-medium">
                          <span className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                            <Check className="w-3 h-3 text-brand-green" />
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Python Skills panel resembling a premium IDE */}
                  <div className="bg-[#0f1115] rounded-xl border border-neutral-800/80 overflow-hidden font-mono text-xs text-neutral-400 mb-6">
                    {/* IDE Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#08090c] border-b border-neutral-800/80">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-[10px] text-neutral-500 font-medium tracking-wide">verify.py</span>
                      <div className="w-8" />
                    </div>
                    {/* IDE Content */}
                    <div className="p-4 space-y-1.5 text-[11px] leading-relaxed text-left text-neutral-300">
                      <p><span className="text-pink-500">import</span> hackerrank <span className="text-pink-500">as</span> hr</p>
                      <p className="text-neutral-500"># Verify skills to unlock GenAI access</p>
                      <p>dev = hr.<span className="text-teal-400">Developer</span>(id=<span className="text-amber-300">"dev_9281"</span>)</p>
                      <p>dev.<span className="text-blue-400">verify_proficiency</span>(<span className="text-amber-300">"Python"</span>)</p>
                      
                      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-brand-green flex items-center gap-1 font-bold">
                          <Check className="w-3.5 h-3.5" />
                          Verified (Score: 98%) - GenAI Ready
                        </span>
                        <span className="text-neutral-500 font-bold">100ms</span>
                      </div>
                    </div>
                  </div>

                  <button className="self-start px-6 py-3 text-xs font-bold uppercase tracking-wider bg-brand-green text-black rounded-lg font-extrabold cursor-pointer">
                    Explore the HackerRank Community
                  </button>
                </div>

                {/* Business Card */}
                <div className="bg-neutral-950 rounded-2xl p-8 flex flex-col justify-between border border-neutral-800 shadow-xl h-full">
                  <div>
                    <div className="flex items-center gap-1.5 mb-5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">For business</span>
                    </div>

                    <h3 className="font-display text-xl md:text-2xl font-black text-white mb-5 leading-snug">
                      Get your company GenAI-ready.
                    </h3>

                    <ul className="space-y-3.5 mb-8">
                      {[
                        'Attract and hire the right developers',
                        'Upskill your team with the latest GenAI skills',
                        'Build out your AI platform team',
                      ].map((bullet, i) => (
                        <li key={i} className="flex items-center gap-3 text-neutral-300 text-sm font-medium">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Check className="w-3 h-3 text-emerald-400" />
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual GenAI Team panel */}
                  <div className="bg-[#0f1115] rounded-xl border border-neutral-800/80 p-4 font-mono text-xs text-neutral-400 mb-6 text-left">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2 mb-3">
                      <span className="text-emerald-400 font-bold tracking-wide">GenAI Assessment Suite</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">ACTIVE ANALYSIS</span>
                    </div>
                    
                    <div className="space-y-2 text-[11px] mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-300">Prompt Engineering Benchmark</span>
                        <span className="text-emerald-400 font-bold">92% AVG</span>
                      </div>
                      <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '92%' }} />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-neutral-300">AI Agent Orchestration</span>
                        <span className="text-emerald-400 font-bold">88% AVG</span>
                      </div>
                      <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-neutral-500 italic mt-2">✓ 14 developers evaluated. GenAI-ready threshold met.</p>
                  </div>

                  <button className="self-start px-6 py-3 text-xs font-bold uppercase tracking-wider border border-neutral-800 hover:border-neutral-600 text-white rounded-lg font-extrabold cursor-pointer">
                    Explore HackerRank Business
                  </button>
                </div>

              </div>
            </div>
          </motion.div>


          {/* ========================================================= */}
          {/* PHASE 3: AI CHANGING SOFTWARE DEVELOPMENT SECTION         */}
          {/* ========================================================= */}
          <motion.div
            style={{
              y: yFeatures,
              scale: scaleFeatures,
              opacity: opacityFeatures,
              borderRadius: "32px",
            }}
            className="absolute inset-0 bg-white text-neutral-900 border border-neutral-200 flex flex-col justify-center overflow-hidden shadow-2xl p-6 md:p-12 z-30 pt-24 md:pt-28"
          >
            <div className="max-w-6xl mx-auto w-full max-h-[82vh] overflow-y-auto custom-scrollbar pr-2 py-4">
              {/* Heading */}
              <div className="mb-12">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
                  <span className="text-brand-green">AI Changing</span>
                  <br /> Software Development
                </h2>
              </div>

              {/* Two Column Interactive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Side: Vertical Tabs */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  
                  {/* Tab 1 */}
                  <div className={`p-5 rounded-xl border transition-all ${
                    activeTab === 'tab1' 
                      ? 'bg-neutral-50 border-neutral-200 shadow-sm' 
                      : 'border-transparent'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Zap className={`w-5 h-5 mt-0.5 ${activeTab === 'tab1' ? 'text-brand-green' : 'text-neutral-400'}`} />
                      <div>
                        <h3 className={`font-display text-base md:text-lg font-bold ${activeTab === 'tab1' ? 'text-neutral-950 font-black' : 'text-neutral-400'}`}>
                          GenAI advances daily.
                        </h3>
                        {activeTab === 'tab1' && (
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                            An AI's ability to write code is evolving at a dizzying pace.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tab 2 */}
                  <div className={`p-5 rounded-xl border transition-all ${
                    activeTab === 'tab2' 
                      ? 'bg-neutral-50 border-neutral-200 shadow-sm' 
                      : 'border-transparent'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Award className={`w-5 h-5 mt-0.5 ${activeTab === 'tab2' ? 'text-brand-green' : 'text-neutral-400'}`} />
                      <div>
                        <h3 className={`font-display text-base md:text-lg font-bold ${activeTab === 'tab2' ? 'text-neutral-950 font-black' : 'text-neutral-400'}`}>
                          GenAI is becoming a part of everything.
                        </h3>
                        {activeTab === 'tab2' && (
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                            HackerRank verified profiles prove you have real-world coding capability.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tab 3 */}
                  <div className={`p-5 rounded-xl border transition-all ${
                    activeTab === 'tab3' 
                      ? 'bg-neutral-50 border-neutral-200 shadow-sm' 
                      : 'border-transparent'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Bot className={`w-5 h-5 mt-0.5 ${activeTab === 'tab3' ? 'text-brand-green' : 'text-neutral-400'}`} />
                      <div>
                        <h3 className={`font-display text-base md:text-lg font-bold ${activeTab === 'tab3' ? 'text-neutral-950 font-black' : 'text-neutral-400'}`}>
                          GenAI will execute more mundane development tasks.
                        </h3>
                        {activeTab === 'tab3' && (
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                            Developers will orchestrate the work of AI agents while focusing on higher-level problem solving.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Interactive Panels */}
                <div className="lg:col-span-7 h-[340px] md:h-[400px] w-full flex items-center justify-center relative bg-neutral-950 rounded-2xl border border-neutral-800 p-6 overflow-hidden">
                  
                  {/* Tab 1 Panel: Speedup Metrics */}
                  {activeTab === 'tab1' && (
                    <div className="w-full h-full flex flex-col justify-between text-white">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-neutral-400 font-mono tracking-wider">Metrics Panel</span>
                        <span className="text-[9px] bg-brand-green/20 text-brand-green px-2 py-0.5 rounded font-bold font-mono">LIVE FEED</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 my-auto">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                          <div className="text-3xl md:text-4xl font-extrabold text-brand-green font-display mb-1">90%</div>
                          <div className="text-[10px] text-neutral-400">Faster Boilerplate Execution</div>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                          <div className="text-3xl md:text-4xl font-extrabold text-brand-green font-display mb-1">85%</div>
                          <div className="text-[10px] text-neutral-400">Reduction in Syntax Errors</div>
                        </div>
                      </div>

                      <div className="bg-neutral-900/40 rounded-lg p-3 border border-neutral-800/60 font-mono text-[10px] text-neutral-400">
                        <p className="text-neutral-300">✓ Verified via 1.5M daily user code executions.</p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2 Panel: Ada Profile */}
                  {activeTab === 'tab2' && (
                    <div className="w-full h-full flex flex-col justify-between text-white">
                      <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                        <span className="text-[10px] text-neutral-400 font-mono tracking-wider">Developer Profile Card</span>
                        <span className="text-[9px] bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded font-bold font-mono">VERIFIED</span>
                      </div>

                      <div className="flex items-center gap-5 my-auto">
                        <div className="relative">
                          <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
                            alt="Ada" 
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-brand-green/20"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-brand-green p-1 rounded-full">
                            <Sparkles className="w-3 h-3 text-black" />
                          </span>
                        </div>
                        <div>
                          <h4 className="font-display text-lg font-black text-white">Ada</h4>
                          <p className="text-[11px] text-neutral-400 font-medium">Machine Learning Engineer</p>
                          <div className="mt-2 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-[10px] text-neutral-300 inline-block">
                            Certifications: <span className="font-bold text-white">Machine learning engineer</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 bg-neutral-900 rounded p-2 text-center text-[10px]">
                          <span className="text-neutral-400">Python</span>
                          <span className="block text-brand-green font-bold">★ 100%</span>
                        </div>
                        <div className="flex-1 bg-neutral-900 rounded p-2 text-center text-[10px]">
                          <span className="text-neutral-400">GenAI</span>
                          <span className="block text-brand-green font-bold">★ 95%</span>
                        </div>
                        <div className="flex-1 bg-neutral-900 rounded p-2 text-center text-[10px]">
                          <span className="text-neutral-400">PyTorch</span>
                          <span className="block text-brand-green font-bold">★ 98%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3 Panel: Mini Preview of Climax Section */}
                  {activeTab === 'tab3' && (
                    <div className="w-full h-full flex flex-col justify-between text-white relative">
                      <div className="absolute inset-0 opacity-20">
                        <img 
                          src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300&h=300" 
                          alt="Developer" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="relative z-10 flex justify-between items-center">
                        <span className="text-[10px] text-neutral-300 font-mono">AI Orchestrator Engine</span>
                        <span className="text-[9px] bg-brand-green text-black px-2 py-0.5 rounded font-bold">ACTIVE</span>
                      </div>
                      <div className="relative z-10 bg-neutral-900/90 border border-neutral-800 rounded-lg p-3 max-w-xs mx-auto my-auto text-[10px]">
                        <span className="text-brand-green font-bold block mb-1">AI Delegate</span>
                        <p className="text-neutral-300">Reviewing schema models & auto-routing code blocks...</p>
                      </div>
                      <div className="relative z-10 text-[9px] text-neutral-400 font-mono text-center">
                        Scroll further to see orchestrations in full 3D action
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </motion.div>


          {/* ========================================================= */}
          {/* PHASE 4: FINAL INTENSE DARK SECTION (MUNDANE DEVELOPMENT)  */}
          {/* ========================================================= */}
          <motion.div
            style={{
              y: yClimax,
              scale: scaleClimax,
              opacity: opacityClimax,
            }}
            className="absolute inset-0 bg-black text-white flex items-center justify-center overflow-hidden p-6 md:p-12 z-40 pt-24 md:pt-28"
          >
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-h-[82vh] overflow-y-auto custom-scrollbar pr-2 py-4">
              
              {/* Left Side text */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className="text-brand-green uppercase tracking-widest text-[10px] font-bold mb-4">The Climax</span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-5">
                  GenAI will execute <br />
                  <span className="text-brand-green">more mundane</span> <br />
                  development tasks.
                </h2>
                <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                  Developers will orchestrate the work of AI agents while focusing on higher-level problem solving.
                </p>
                
                {/* Embedded quick status stats */}
                <div className="mt-8 flex items-center gap-6 border-t border-neutral-800 pt-6">
                  <div>
                    <span className="block text-2xl font-black text-white">4.2x</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Productivity boost</span>
                  </div>
                  <div className="w-px h-8 bg-neutral-800" />
                  <div>
                    <span className="block text-2xl font-black text-white">0s</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Manual pipeline delay</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Portrait image & active floating Delegate boards */}
              <div className="lg:col-span-7 w-full h-[380px] md:h-[480px] relative flex items-center justify-center">
                
                {/* Developer with headphones portrait */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800&h=600" 
                    alt="Developer Headphones" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Floating Mockup Cards */}
                <div className="absolute left-6 bottom-6 right-6 z-10 flex flex-col md:flex-row gap-4 items-stretch">
                  
                  {/* Card 1: Backlog */}
                  <div className="flex-1 bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 backdrop-blur-md shadow-2xl">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-bold font-mono">Backlog</span>
                      <span className="text-[9px] text-neutral-500 font-mono">May 20 - July 1</span>
                    </div>
                    <p className="text-xs font-bold text-white leading-snug">Making API requests and handling responses</p>
                  </div>

                  {/* Connect Indicator (Arrow icon) */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-black font-bold">
                      →
                    </div>
                  </div>

                  {/* Card 2: AI Delegate (active action) */}
                  <div className="flex-1 bg-neutral-950/95 border-2 border-brand-green rounded-xl p-4 shadow-[0_0_25px_rgba(46,200,102,0.15)]">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
                        <span className="text-[9px] text-brand-green font-bold uppercase tracking-wider">AI Delegate</span>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-mono">Writing 20 JS/TS files</span>
                    </div>
                    <p className="text-xs font-bold text-white mb-2 leading-snug">Making API requests and handling responses</p>
                    <div className="flex items-center gap-1 text-[10px] text-brand-green font-semibold">
                      <Check className="w-3 h-3" />
                      <span>Completed in 0.8s</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
}
