# MEMORY — Confidential Wrapper Project

## Project Identity

- **Name:** confidential-wrapper
- **Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS 4, shadcn (radix-nova style)
- **Blockchain:** Sepolia testnet, wagmi + viem, RainbowKit for wallet connection
- **Confidential Computing:** Zama FHE SDK (`@zama-fhe/react-sdk`, `@zama-fhe/sdk`)
- **Animation:** GSAP (ScrollSmoother, ScrollTrigger), Motion (framer-motion successor)
- **Fonts:** Geist Variable (sans), Outfit (display/brand)
- **Linting:** oxlint (NOT eslint)
- **Testing:** vitest + testing-library

---

## Brand & Design

- **Brand name:** "Qube" (used on landing page header + footer)
- **App name:** "Confidential Wrapper Registry" (used in config)
- **Brand color:** `#2ec866` (brand-green), `#25a152` (brand-green-hover), `#00ff66` (brand-green-bright)
- **Design language:** Flat, no glow, dark theme, green accent, neutral grays for surfaces
- **Font for brand:** `font-display` (Outfit), `font-black`, `tracking-tight`

---

## Git Conventions

- **Commit format:** Conventional Commits
  - `feat:` new feature
  - `fix:` bug fix
  - `style:` formatting/visual changes (no logic change)
  - `refactor:` code restructuring (no feature/bug change)
  - `docs:` documentation only
- **Subject line:** imperative mood, max 50 chars, no period
- **Body:** explain what and why, not how. Max 72 chars per line
- **Example:**
  ```
  fix: replace 0x placeholder with connect wallet button

  Use RainbowKit useConnectModal to open the connect modal
  on disconnected pages.
  ```
- **Never commit unless explicitly asked**
- **Always run `npx tsc --noEmit` before committing** to verify no type errors
- **`npx oxlint`** for linting (can be slow, timeout at 60000ms)

---

## Codebase Structure

```
src/
├── App.tsx                    # Routes definition
├── main.tsx                   # Entry point, GSAP plugin registration
├── index.css                  # Tailwind + CSS variables (dark theme)
├── lib/
│   ├── config.ts              # wagmi config, registry address, ABIs
│   ├── nav.ts                 # Nav links: Registry, Assets, Docs
│   ├── tokens.ts              # TOKEN_PAIRS constant
│   ├── mergePairs.ts          # Merge on-chain + cached pairs
│   ├── mint-abi.ts            # Mint ABI helpers
│   ├── signer.ts              # Signer utilities
│   └── utils.ts               # cn() helper (clsx + tailwind-merge)
├── hooks/
│   ├── useWrap.ts             # Shield (wrap) logic
│   ├── useUnwrap.ts           # Unshield (unwrap) logic
│   ├── useFaucet.ts           # Mint/faucet logic
│   ├── useRegistryPairs.ts    # Fetch on-chain registry pairs
│   ├── useAllTokenBalances.ts # Batch balance fetching
│   ├── useDecrypt.ts          # Decryption hooks
│   └── useGlassTrack.ts       # Glass pill animation tracker
├── components/
│   ├── layout/
│   │   ├── Layout.tsx         # Main layout (landing vs inner pages)
│   │   └── Navbar.tsx         # Shared navbar (Qube brand, dark glass)
│   ├── landing/               # Landing page components (OLD — pending rewrite)
│   │   ├── LandingPage.tsx    # Scroll-driven stacked cards
│   │   ├── HeroCard.tsx
│   │   ├── ProblemCard.tsx
│   │   ├── HowItWorksCard.tsx
│   │   ├── CtaCard.tsx
│   │   └── Footer.tsx
│   ├── registry/              # Registry page components
│   ├── wrap/                  # Wrap form
│   ├── unwrap/                # Unwrap form
│   ├── faucet/                # Faucet components
│   ├── decrypt/               # Decrypt balance button
│   ├── ui/                    # shadcn components (button, dialog, sheet, accordion, social-tooltip)
│   └── GlassFilterSvg.tsx     # SVG filter for glass effect
├── pages/
│   ├── LandingPage.tsx        # Imports from components/landing/
│   ├── RegistryPage.tsx       # Registry with search/sort
│   ├── AssetsPage.tsx         # Standard/Confidential/Activity views
│   ├── WrapPage.tsx           # Wrap form page
│   ├── UnwrapPage.tsx         # Unwrap form page
│   ├── FaucetPage.tsx         # Token faucet page
│   ├── DocsPage.tsx           # Placeholder docs page
│   └── assets/                # Assets page sub-components
└── providers/
    └── index.tsx              # AppProviders (QueryClient, wagmi, RainbowKit)
```

---

## Current State (as of last commit)

### Done ✅
1. **Navbar redesign** — Shared navbar now matches landing page header (Qube brand, backdrop-blur, dark glass, ConnectButton on right, mobile Sheet menu)
2. **Nav links** — Updated to Registry, Assets, Docs (matching original app nav)
3. **Color scheme** — Changed from blue (oklch 250°) to green (oklch 149°) matching brand-green
4. **Border visibility** — Increased from 8%/12% to 15%/18% white opacity
5. **Connect Wallet button** — Replaced 0x placeholder with RainbowKit `useConnectModal` button on Assets, Wrap, Unwrap, Faucet pages
6. **Unwrap button differentiation** — Changed to `variant="outline"` with `border-white/25`
7. **Explainer page removed** — Dead code deleted, route removed, landing page link removed

### In Progress 🔄
8. **Landing page animation refactor** — Plan written at `plan/landing-page-animation-refactor.md`
   - Create `src/components/landing-v2/` with new architecture
   - Section config array (single source of truth for timing)
   - `useScrollSection` hook (derives animation values from config)
   - Lazy card mounting (±20% margin)
   - Wider transitions (50-60vh instead of 15-35vh)
   - Mobile vh fix (dvh)
   - Graceful degradation (noscript)
   - **NOT started yet — plan approved, awaiting implementation**

---

## Landing Page Refactor — Key Details

### Problems Being Fixed
1. Magic numbers scattered across 60+ lines of useTransform
2. Fixed 500vh container is arbitrary
3. Sections can't be added/removed independently
4. Transitions too short and jumpy (15-35vh → need 50-60vh)
5. All 4 cards always mounted in DOM
6. 5+ MotionValue props per card (heavy coupling)
7. vh units break on mobile
8. Header theme coupled to magic numbers
9. No single source of truth
10. No graceful degradation

### New Architecture
- `sectionConfig.ts` — SECTIONS array with scrollRange, headerTheme, tab per section
- `useScrollSection.ts` — Hook that derives y/scale/opacity/blur/borderRadius from config
- Cards accept `{ sectionId: string }` instead of 5 MotionValue props
- Lazy mounting: only mount cards when scroll is within ±20% of their range
- Header theme derived from section config, not magic numbers

### New Timing (wider transitions)
```
Hero:      [0,    0.18]  — slide-in: none, fade-out: 50vh
Problem:   [0.06, 0.48]  — slide-in: 60vh, fade-out: 60vh
HowItWorks:[0.36, 0.86]  — slide-in: 60vh, fade-out: 50vh
CTA:       [0.76, 1.0]   — slide-in: 50vh
```

### ProblemCard Sub-Animation Triggers (new timing)
- Reset when `v < 0.06 || v >= 0.48`
- Left card slides in at `v >= 0.18`
- Right card slides in at `v >= 0.26`

### Safe Workflow
1. Create all files in `src/components/landing-v2/`
2. Run `npx tsc --noEmit` to verify
3. Read each new file vs original to verify content preserved
4. Only after user approval: update import in `src/pages/LandingPage.tsx`
5. Only after user approval: delete `src/components/landing/` (except Footer.tsx)

### What NOT to Change
- `src/components/landing/Footer.tsx` — stays in `landing/` directory
- All SVG icons (ShieldIcon, LockIcon) — copy exactly
- All text content — copy exactly
- All className strings — copy exactly
- The ProblemCard sub-animation logic — keep global scroll triggers (new timing)
- The HowItWorksCard tab/panel content — copy exactly
- The CtaCard visual content — copy exactly

---

## CSS Theme Variables (Current)

The `.dark` class in `src/index.css` defines:

```css
--background: oklch(0.05 0 0);      /* near-black, neutral */
--foreground: oklch(0.97 0 0);      /* near-white */
--card: oklch(0.10 0 0);            /* neutral dark surface */
--primary: oklch(0.72 0.19 149);    /* brand green */
--secondary: oklch(0.14 0 0);       /* neutral elevated surface */
--muted: oklch(0.14 0 0);           /* same as secondary */
--muted-foreground: oklch(0.55 0 0);/* medium gray text */
--accent: oklch(0.72 0.19 149);     /* same as primary */
--success: oklch(0.72 0.19 149);    /* same as primary */
--warning: oklch(0.75 0.15 75);     /* amber */
--destructive: oklch(0.65 0.20 25); /* red */
--border: oklch(1 0 0 / 15%);       /* white 15% opacity */
--input: oklch(1 0 0 / 18%);        /* white 18% opacity */
--ring: oklch(0.72 0.19 149);       /* brand green */
```

---

## Key Files to Know

| File | Purpose | Important notes |
|------|---------|-----------------|
| `src/lib/nav.ts` | Nav links | Currently: Registry, Assets, Docs |
| `src/components/layout/Layout.tsx` | Main layout | Landing page = no Navbar, inner pages = Navbar + pt-16 |
| `src/components/layout/Navbar.tsx` | Shared navbar | Qube brand, dark glass, ConnectButton, mobile Sheet |
| `src/pages/LandingPage.tsx` | Landing page wrapper | Imports LandingHero + Footer |
| `src/components/landing/LandingPage.tsx` | Landing page animation | **Pending rewrite to landing-v2/** |
| `src/index.css` | Theme + glass pill CSS | `.dark` block defines all colors |
| `src/lib/config.ts` | Registry address + ABIs | 0x2f0750Bbb0A246059d80e94c454586a7F27a128e |
| `src/App.tsx` | Routes | Landing, Registry, Faucet, Wrap, Unwrap, Assets, Docs |

---

## Gotchas & Things to Remember

1. **Landing page has NO Navbar** — Layout.tsx checks `isLanding` and skips Navbar
2. **Inner pages use ScrollSmoother** — GSAP smooth scroll, landing page does NOT
3. **Glass pill CSS** — Complex backdrop-filter effect, used in AssetsPage vertical nav
4. **RainbowKit ConnectButton** — Has its own styling, don't override
5. **`useGlassTrack`** — Used in old Navbar for pill animation, NOT used in new Navbar
6. **ProblemCard sub-animations** — Use `animate()` from motion/react, not useTransform
7. **`font-display`** — Maps to Outfit font, used for brand text
8. **`brand-green`** — Tailwind color defined in index.css `@theme inline` block
9. **500vh scroll container** — Landing page scroll height, may need adjustment
10. **`noscript`** — Currently no fallback, should be added in refactor

---

## Pending TODOs

- [ ] Implement landing page refactor (plan at `plan/landing-page-animation-refactor.md`)
- [ ] Add `<noscript>` fallback for landing page
- [ ] Fix mobile vh with dvh fallback
- [ ] Consider lazy card mounting
- [ ] Test on mobile viewport sizes
