export const SLIDER_DESCRIPTIONS: Record<string, string> = {
  // Hero Card
  "sections.0.scrollRange.0": "The scroll position where this card starts appearing. Lower values mean it shows up earlier on the page.",
  "sections.0.scrollRange.1": "The scroll position where this card finishes disappearing. Higher values keep it visible longer.",
  "firstSectionAnimation.y.enterDuration": "How many seconds the card takes to slide up from below into its final position.",
  "firstSectionAnimation.y.exitValue": "How far the card slides up (in viewport heights) when exiting. Negative values = slides up.",
  "firstSectionAnimation.scale.enterDuration": "How many seconds the card takes to zoom in from small to full size.",
  "firstSectionAnimation.scale.startValue": "The initial size when the card first appears. 1.0 = full size, 0.8 = 80% size.",
  "firstSectionAnimation.scale.midValue": "The peak size during the animation. Values above 1.0 create a brief放大 effect.",
  "firstSectionAnimation.scale.exitValue": "The final size when the card exits. 1.0 = stays full size, 0.8 = shrinks to 80%.",
  "firstSectionAnimation.opacity.enterDuration": "How many seconds the card takes to fade from transparent to visible.",
  "firstSectionAnimation.opacity.startValue": "Initial visibility when the card appears. 0 = fully transparent, 1 = fully visible.",
  "firstSectionAnimation.opacity.exitValue": "Final visibility when the card exits. 0 = fades to invisible, 1 = stays visible.",
  "firstSectionAnimation.blur.startOffset": "The scroll point where the card starts getting blurry. 0 = blur starts immediately.",
  "firstSectionAnimation.blur.maxValue": "Maximum blur applied to the card in pixels. 0 = sharp, 10 = very blurry.",
  "firstSectionAnimation.borderRadius.startOffset": "The scroll point where corners start rounding. 0 = rounds immediately.",
  "firstSectionAnimation.borderRadius.endOffset": "The scroll point where corners finish rounding.",
  "firstSectionAnimation.borderRadius.startValue": "The starting corner radius in pixels. 0 = sharp corners, 32 = very rounded.",
  "firstSectionAnimation.borderRadius.endValue": "The ending corner radius in pixels.",

  // Problem Card / Middle Section
  "sections.1.scrollRange.0": "The scroll position where this card starts appearing.",
  "sections.1.scrollRange.1": "The scroll position where this card finishes disappearing.",
  "middleSectionAnimation.y.enterDuration": "How many seconds the card takes to slide up into view.",
  "middleSectionAnimation.y.exitStartOffset": "How long after entering before the card starts its exit animation.",
  "middleSectionAnimation.y.exitValue": "How far the card slides up when exiting.",
  "middleSectionAnimation.scale.enterDuration": "How many seconds the card takes to zoom in.",
  "middleSectionAnimation.scale.enterValue": "The initial size when the card first appears.",
  "middleSectionAnimation.scale.exitValue": "The final size when the card exits.",
  "middleSectionAnimation.opacity.enterDuration": "How many seconds the card takes to fade in.",
  "middleSectionAnimation.opacity.exitValue": "Final visibility when the card exits.",
  "middleSectionAnimation.blur.endOffset": "The scroll point where blur stops being applied.",
  "middleSectionAnimation.blur.maxValue": "Maximum blur intensity in pixels.",
  "middleSectionAnimation.borderRadius.startOffset": "The scroll point where corners start rounding.",
  "middleSectionAnimation.borderRadius.endOffset": "The scroll point where corners finish rounding.",
  "middleSectionAnimation.borderRadius.value": "The corner radius value in pixels (fixed, not animated).",

  // Sub-Animations (Problem Card sub-cards)
  "sections.1.subAnimations.left.trigger": "The scroll position where the left sub-card slides in from the side.",
  "sections.1.subAnimations.right.trigger": "The scroll position where the right sub-card slides in from the side.",
  "subAnimationSpring.stiffness": "How springy the sub-card animation feels. Higher = more bouncy, lower = more sluggish.",
  "subAnimationSpring.damping": "How quickly the sub-card bounce settles. Higher = stops sooner, lower = bounces longer.",

  // HowItWorks Card
  "sections.2.scrollRange.0": "The scroll position where the first tab (Browse) becomes active.",
  "sections.2.scrollRange.1": "The scroll position where the HowItWorks card exits.",
  "sections.3.scrollRange.0": "The scroll position where the second tab (Wrap) becomes active.",
  "sections.4.scrollRange.0": "The scroll position where the third tab (Decrypt) becomes active.",

  // CTA Card
  "sections.5.scrollRange.0": "The scroll position where the CTA card starts appearing.",
  "sections.5.scrollRange.1": "The scroll position where the CTA card finishes.",
  "lastSectionAnimation.y.enterDuration": "How many seconds the CTA takes to slide up into view.",
  "lastSectionAnimation.scale.enterDuration": "How many seconds the CTA takes to zoom in.",
  "lastSectionAnimation.scale.enterValue": "The initial size when the CTA first appears.",
  "lastSectionAnimation.opacity.enterDuration": "How many seconds the CTA takes to fade in.",
  "lastSectionAnimation.blur.maxValue": "Maximum blur intensity in pixels.",
  "lastSectionAnimation.borderRadius.value": "The corner radius value in pixels.",

  // Global
  "scrollHeightVH": "Total scroll distance in viewport heights. 500vh means you scroll 5 times the screen height.",
  "spring.stiffness": "How smooth the scroll-to-animation feels. Higher = snappier, lower = more sluggish.",
  "spring.damping": "How quickly the scroll animation settles after you stop scrolling.",
  "spring.restDelta": "When the animation is 'done' enough to stop. Lower = more precise but slower.",
  "lazyMountMargin": "How early cards load before they're visible. 0.2 = loads 20% before entering viewport.",

  // Background Glow
  "bgGlowOpacity.input.0": "The scroll position where the background glow changes to its first brightness level.",
  "bgGlowOpacity.output.0": "The glow opacity at that scroll point. 0 = invisible, 1 = fully bright.",
  "bgGlowOpacity.input.1": "The scroll position where the glow changes to its second brightness level.",
  "bgGlowOpacity.output.1": "The glow opacity at that scroll point.",
  "bgGlowOpacity.input.2": "The scroll position where the glow changes to its third brightness level.",
  "bgGlowOpacity.output.2": "The glow opacity at that scroll point.",
  "bgGlowOpacity.input.3": "The scroll position where the glow changes to its fourth brightness level.",
  "bgGlowOpacity.output.3": "The glow opacity at that scroll point.",
  "bgGlowOpacity.input.4": "The scroll position where the glow changes to its fifth brightness level.",
  "bgGlowOpacity.output.4": "The glow opacity at that scroll point.",
}
