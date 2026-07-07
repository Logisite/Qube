# Landing Page Animation Refactor Plan

## Overview

Rewrite the landing page scroll-driven animation syst
---  
chaii

## Problems to Fix

| # | Problem | Current behavior |
|---|---------|------------------|
| 1 | Magic numbers everywhere | All animation timing is hardcoded scroll percentages (e.g., `[0.08, 0.15, 0.38, 0.45]`). Adding a section means recalculating 15+ lines. |
| 2 | Fixed 500vh container | `<div className="relative h-[500vh]">` is arbitrary. Adding a section means manually changing this value. |
| 3 | Sections can't be added/removed independently | Every section's timing is coupled to every other section's timing. |
| 4 | Transitions are too short and jumpy | Slide-in happens in 35vh (less than one screen). Fade-out for HowItWorks is only 15vh. Feels like snapping, not scrolling. |
| 5 | All cards always mounted | All 4 cards are rendered in the DOM at all times, even when invisible. |
| 6 | 5+ MotionValue props per card | Parent defines every animation curve for every child. Heavy prop coupling. |
| 7 | `vh` units break on mobile | `100vh` doesn't account for mobile browser chrome. |
| 8 | Header theme coupled to scroll magic numbers | Header dark/light switch uses hardcoded percentages. |
| 9 | No single source of truth | Section boundaries are scattered across 60+ lines of `useTransform` calls. |
| 10 | No graceful degradation | Blank page if JS is slow to load. |

---

## Architecture

### 1. Section Config (`sectionConfig.ts`)

Single source of truth for all section timing. One array defines everything:

```ts
export interface SectionConfig {
  id: string
  /** Scroll range where this section is active [start, end] as fraction of total scroll */
  scrollRange: [number, number]
  /** Header theme while this section is active */
  headerTheme: "dark" | "light"
  /** Tab state while this section is active (only for HowItWorks section) */
  tab?: "tab1" | "tab2" | "tab3"
}

export const SECTIONS: SectionConfig[] = [
  { id: "hero",    scrollRange: [0,    0.18], headerTheme: "dark" },
  { id: "problem", scrollRange: [0.06, 0.48], headerTheme: "light" },
  { id: "how",     scrollRange: [0.36, 0.86], headerTheme: "light", tab: "tab1" },
  { id: "how2",    scrollRange: [0.54, 0.86], headerTheme: "light", tab: "tab2" },
  { id: "how3",    scrollRange: [0.65, 0.86], headerTheme: "light", tab: "tab3" },
  { id: "cta",     scrollRange: [0.76, 1.0],  headerTheme: "dark" },
]

/** Total scroll height in vh units. Update this when adding/removing sections. */
export const SCROLL_HEIGHT_VH = 500
```

**Timing rationale (wider transitions for smooth flow):**

| Transition | Old range | New range | Old distance | New distance |
|---|---|---|---|---|
| Hero visible | 0 → 0.10 | 0 → 0.08 | 50vh | 40vh |
| Hero fade out | 0.10 → 0.15 | 0.08 → 0.18 | 25vh | **50vh** |
| Problem slide in | 0.08 → 0.15 | 0.06 → 0.18 | 35vh | **60vh** |
| Problem visible | 0.15 → 0.38 | 0.18 → 0.36 | 115vh | 90vh |
| Problem fade out | 0.40 → 0.45 | 0.36 → 0.48 | 25vh | **60vh** |
| HowItWorks slide in | 0.38 → 0.45 | 0.36 → 0.48 | 35vh | **60vh** |
| HowItWorks visible | 0.45 → 0.78 | 0.48 → 0.76 | 165vh | 140vh |
| HowItWorks fade out | 0.80 → 0.83 | 0.76 → 0.86 | 15vh | **50vh** |
| CTA slide in | 0.78 → 0.83 | 0.76 → 0.86 | 25vh | **50vh** |

**To add a section:** Add one entry to `SECTIONS`. Update `SCROLL_HEIGHT_VH` if needed. Done.

### 2. Hook: `useScrollSection.ts`

A hook that derives all animation values from the section config. Each card calls this hook with its section ID.

```ts
import { useScroll, useSpring, useTransform, MotionValue } from "motion/react"
import { SECTIONS } from "./sectionConfig"

interface ScrollSectionResult {
  y: MotionValue<string>
  scale: MotionValue<number>
  opacity: MotionValue<number>
  blur: MotionValue<number>
  borderRadius: MotionValue<string>
  progress: MotionValue<number>  // raw scroll progress for sub-animations
}

export function useScrollSection(sectionId: string): ScrollSectionResult
```

**Implementation logic:**
1. Find the section config by ID from `SECTIONS`
2. Get `scrollYProgress` from `useScroll()`
3. Smooth it with `useSpring({ stiffness: 85, damping: 30, restDelta: 0.001 })`
4. Derive `y`, `scale`, `opacity`, `blur`, `borderRadius` using `useTransform` with the section's `scrollRange`
5. Return all values

**Animation math for each section** (with wider transitions for smooth flow):

For the **first section** (hero) — `scrollRange: [0, 0.18]`:
- `y`: maps `[start, start+0.08, end]` → `["0vh", "0vh", "-8vh"]`
- `scale`: maps `[start, start+0.08, end]` → `[1, 0.9, 0.85]`
- `opacity`: maps `[start, start+0.08, end]` → `[1, 1, 0]`
- `blur`: maps `[start+0.08, end]` → `[0, 8]`
- `borderRadius`: maps `[start, start+0.08]` → `["0px", "32px"]`

For **middle sections** (problem, howItWorks) — e.g., `scrollRange: [0.06, 0.48]`:
- `y`: maps `[start, start+0.12, end-0.12, end]` → `["100vh", "0vh", "0vh", "-8vh"]`
- `scale`: maps `[start, start+0.12, end-0.12, end]` → `[0.96, 1, 1, 0.9]`
- `opacity`: maps `[start, start+0.12, end-0.12, end]` → `[0, 1, 1, 0]`
- `blur`: maps `[end-0.10, end]` → `[0, 8]`
- `borderRadius`: maps `[start+0.02, start+0.12]` → `["32px", "32px"]`

For the **last section** (cta) — `scrollRange: [0.76, 1.0]`:
- `y`: maps `[start, start+0.10]` → `["100vh", "0vh"]`
- `scale`: maps `[start, start+0.10]` → `[0.96, 1]`
- `opacity`: maps `[start, start+0.08]` → `[0, 1]`
- `blur`: none (last section)
- `borderRadius`: none (last section)

### 3. Header theme derivation

In `LandingPage.tsx`, derive `headerTheme` from the section config instead of magic numbers:

```ts
const [headerTheme, setHeaderTheme] = useState<"dark" | "light">("dark")
const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1")

useMotionValueEvent(smoothProgress, "change", (latest) => {
  // Find which section contains the current scroll position
  for (const section of SECTIONS) {
    if (latest >= section.scrollRange[0] && latest < section.scrollRange[1]) {
      setHeaderTheme(section.headerTheme)
      if (section.tab) setActiveTab(section.tab)
      break
    }
  }
})
```

### 4. Lazy card mounting

Cards are only mounted when scroll is within ±20% of their range:

```ts
const [mountedSections, setMountedSections] = useState<Set<string>>(new Set(["hero"]))

useMotionValueEvent(smoothProgress, "change", (latest) => {
  const newMounted = new Set<string>()
  for (const section of SECTIONS) {
    const [start, end] = section.scrollRange
    const margin = (end - start) * 0.2
    if (latest >= start - margin && latest <= end + margin) {
      newMounted.add(section.id)
    }
  }
  // Always keep hero mounted
  newMounted.add("hero")
  setMountedSections(newMounted)
})
```

Then in JSX:
```tsx
{mountedSections.has("hero") && <HeroCard sectionId="hero" />}
{mountedSections.has("problem") && <ProblemCard sectionId="problem" />}
{mountedSections.has("how") && <HowItWorksCard sectionId="how" activeTab={activeTab} />}
{mountedSections.has("cta") && <CtaCard sectionId="cta" />}
```

### 5. Mobile vh fix

In `index.css`, add a fallback for the scroll container:

```css
.scroll-container {
  height: 100vh; /* fallback */
  height: 100dvh; /* dynamic viewport height — accounts for mobile browser chrome */
}
```

Or calculate height in JS using `window.innerHeight` and set it as a CSS variable.

### 6. Graceful degradation

Add a `<noscript>` tag in `index.html` or at the top of `LandingPage.tsx`:

```tsx
<noscript>
  <div style={{ padding: "2rem", textAlign: "center", color: "white", background: "black" }}>
    <h1>Qube — Confidential Wrapper Registry</h1>
    <p>Enable JavaScript to view the interactive landing page.</p>
    <a href="/registry" style={{ color: "#2ec866" }}>Open the Registry →</a>
  </div>
</noscript>
```

Cards should start with `opacity: 1` by default (visible without JS), and only hide when scroll tracking initializes.

---

## Step-by-Step Implementation

### Step 1: Create `src/components/landing-v2/sectionConfig.ts`

Create the file with the `SECTIONS` array and `SCROLL_HEIGHT_VH` constant as described above. Copy the exact scroll percentage values from the current `LandingPage.tsx` lines 39-60.

### Step 2: Create `src/components/landing-v2/useScrollSection.ts`

Create the hook that:
1. Accepts a `sectionId: string`
2. Finds the section in `SECTIONS`
3. Calls `useScroll()` and `useSpring()`
4. Derives all 5 animation values using `useTransform`
5. Returns `{ y, scale, opacity, blur, borderRadius, progress }`

The animation math must produce the new smoother values. Here's the mapping:

**New HeroCard animations (wider transitions):**
```
scale:  [0, 0.08, 0.18]     → [1, 0.9, 0.85]
y:      [0, 0.08, 0.18]     → ["0vh", "0vh", "-8vh"]
radius: [0, 0.08]           → ["0px", "32px"]
opacity:[0, 0.08, 0.18]     → [1, 1, 0]
blur:   [0.08, 0.18]        → [0, 8]
```

**New ProblemCard animations (wider transitions):**
```
y:      [0.06, 0.18, 0.36, 0.48] → ["100vh", "0vh", "0vh", "-8vh"]
scale:  [0.06, 0.18, 0.36, 0.48] → [0.96, 1, 1, 0.9]
radius: [0.08, 0.18]             → ["32px", "32px"]
opacity:[0.06, 0.18, 0.36, 0.48] → [0, 1, 1, 0]
blur:   [0.38, 0.48]             → [0, 8]
```

**New HowItWorksCard animations (wider transitions):**
```
y:      [0.36, 0.48, 0.76, 0.86] → ["100vh", "0vh", "0vh", "-8vh"]
scale:  [0.36, 0.48, 0.76, 0.86] → [0.96, 1, 1, 0.9]
opacity:[0.36, 0.48, 0.76, 0.86] → [0, 1, 1, 0]
blur:   [0.76, 0.86]             → [0, 8]
```

**New CtaCard animations (wider transitions):**
```
y:      [0.76, 0.86]       → ["100vh", "0vh"]
scale:  [0.76, 0.86]       → [0.96, 1]
opacity:[0.76, 0.84]       → [0, 1]
```

The hook must produce these exact same values. The `useTransform` input ranges are calculated relative to each section's `scrollRange`.

### Step 3: Create `src/components/landing-v2/HeroCard.tsx`

Copy the current `HeroCard.tsx` exactly, but change the props interface:

**Current props:**
```ts
interface HeroCardProps {
  scale: MotionValue<number>
  y: MotionValue<string>
  borderRadius: MotionValue<string>
  opacity: MotionValue<number>
  blur: MotionValue<number>
}
```

**New props:**
```ts
interface HeroCardProps {
  sectionId: string
}
```

Inside the component, call `useScrollSection(sectionId)` to get all animation values. Everything else (JSX, SVGs, classes, content) stays identical.

**Preserve exactly:**
- ShieldIcon SVG (lines 4-12)
- LockIcon SVG (lines 15-18)
- All className strings
- All text content
- The `Link to="/registry"` with its className

### Step 4: Create `src/components/landing-v2/ProblemCard.tsx`

Copy the current `ProblemCard.tsx` exactly, but:

1. Change props to `{ sectionId: string }`
2. Call `useScrollSection(sectionId)` for outer card animations
3. Keep the internal sub-animation logic (lines 16-46) — the `refLeft`/`refRight` slide-in animations triggered by `progress`

**The internal sub-animation uses hardcoded scroll percentages (0.06, 0.18, 0.26, 0.48). These are global scroll values.**

Current sub-animation triggers (with wider ranges):
- Reset when `v < 0.06 || v >= 0.48`
- Left card slides in at `v >= 0.18`
- Right card slides in at `v >= 0.26`

These need to be converted to be relative to the section's start. If the problem section starts at 0.06 and ends at 0.48:
- Reset when scroll is outside `[0.06, 0.48]` (keep these as global scroll values)
- Left slides at `0.18` (global)
- Right slides at `0.26` (global)

**Keep these as global scroll values** — they're already correct and don't need to change.

**Preserve exactly:**
- All JSX content (the two-column comparison layout)
- All className strings
- The `refLeft`/`refRight` animation logic

### Step 5: Create `src/components/landing-v2/HowItWorksCard.tsx`

Copy the current `HowItWorksCard.tsx` exactly, but:

1. Change props to `{ sectionId: string, activeTab: "tab1" | "tab2" | "tab3" }`
2. Call `useScrollSection(sectionId)` for outer card animations
3. Keep `activeTab` as a prop (driven by parent)
4. Keep the `tabs` array and all panel components (`RegistryPanel`, `WrapPanel`, `DecryptPanel`) exactly as-is

**Preserve exactly:**
- The `tabs` array (lines 11-31)
- All panel components (lines 98-186)
- All className strings
- All text content

### Step 6: Create `src/components/landing-v2/CtaCard.tsx`

Copy the current `CtaCard.tsx` exactly, but:

1. Change props to `{ sectionId: string }`
2. Call `useScrollSection(sectionId)` for animation values

**Preserve exactly:**
- All JSX content
- All className strings
- All text content

### Step 7: Create `src/components/landing-v2/LandingPage.tsx`

This is the main rewrite. It must:

1. Import `SECTIONS`, `SCROLL_HEIGHT_VH` from `./sectionConfig`
2. Import `useScrollSection` from `./useScrollSection`
3. Import all 4 card components from `./HeroCard`, `./ProblemCard`, `./HowItWorksCard`, `./CtaCard`
4. Set up `scrollYProgress` and `smoothProgress` (same spring config as current)
5. Derive `headerTheme` and `activeTab` from section config (not magic numbers)
6. Implement lazy mounting with ±20% margin
7. Render the same DOM structure as current:
   - `<header>` with Qube brand, nav links, "Open App" button
   - Scroll indicator pill (fixed bottom-right)
   - Background glow
   - Scroll container with `h-[${SCROLL_HEIGHT_VH}vh]`
   - Fixed viewport with stacked cards

**The header JSX must be copied exactly from the current `LandingPage.tsx` lines 65-94.**

**The scroll indicator must be copied exactly from lines 96-99.**

**The background glow must be copied exactly from lines 101-106.**

### Step 8: Update `src/pages/LandingPage.tsx`

Change the import path:

```tsx
// Before:
import { LandingPage as LandingHero } from "@/components/landing/LandingPage"

// After:
import { LandingPage as LandingHero } from "@/components/landing-v2/LandingPage"
```

Keep the Footer import unchanged — it stays in `@/components/landing/Footer`.

### Step 9: Update `src/index.css`

Add mobile viewport height fallback. Add this rule:

```css
.scroll-container {
  height: 100vh;
  height: 100dvh;
}
```

### Step 10: Verify

1. Run `npx tsc --noEmit` — must pass with no errors
2. Run `npx oxlint` — must pass with no new errors
3. Read each new file and compare against the original to verify:
   - All SVGs are identical
   - All text content is identical
   - All className strings are identical
   - All conditional rendering logic is preserved
   - All sub-animations (ProblemCard slide-in) are preserved
4. Verify the scroll animation timing matches the new smoother ranges (transitions are 50-60vh instead of 15-35vh)

---

## File Checklist

| File | Status | Notes |
|------|--------|-------|
| `src/components/landing-v2/sectionConfig.ts` | NEW | Section timing config |
| `src/components/landing-v2/useScrollSection.ts` | NEW | Animation hook |
| `src/components/landing-v2/LandingPage.tsx` | NEW | Main landing page |
| `src/components/landing-v2/HeroCard.tsx` | NEW | Hero card |
| `src/components/landing-v2/ProblemCard.tsx` | NEW | Problem card |
| `src/components/landing-v2/HowItWorksCard.tsx` | NEW | How it works card |
| `src/components/landing-v2/CtaCard.tsx` | NEW | CTA card |
| `src/pages/LandingPage.tsx` | EDIT | Change import path |
| `src/index.css` | EDIT | Add dvh fallback |
| `src/components/landing/` | DELETE | After user approval |

---

## What NOT to Change

- `src/components/landing/Footer.tsx` — stays as-is, stays in `landing/` directory
- All SVG icons (ShieldIcon, LockIcon) — copy exactly
- All text content — copy exactly
- All className strings — copy exactly
- The ProblemCard sub-animation logic — keep the global scroll triggers (updated to new timing: 0.06, 0.18, 0.26, 0.48)
- The HowItWorksCard tab/panel content — copy exactly
- The CtaCard visual content — copy exactly
