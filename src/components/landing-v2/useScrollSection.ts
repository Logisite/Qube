import { useScroll, useSpring, useTransform, type MotionValue } from "motion/react"
import { useAnimationConfig } from "./AnimationConfigContext"

interface ScrollSectionResult {
  y: MotionValue<string>
  scale: MotionValue<number>
  opacity: MotionValue<number>
  blur: MotionValue<number>
  borderRadius: MotionValue<string>
  progress: MotionValue<number>
}

export function useScrollSection(sectionId: string): ScrollSectionResult {
  const { config } = useAnimationConfig()
  const sections = config.sections

  const sectionIndex = sections.findIndex((s) => s.id === sectionId)
  if (sectionIndex === -1) throw new Error(`Unknown section: ${sectionId}`)

  const section = sections[sectionIndex]
  const [start, end] = section.scrollRange
  const isFirst = sectionIndex === 0
  const isLast = sectionIndex === sections.length - 1

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: config.spring.stiffness,
    damping: config.spring.damping,
    restDelta: config.spring.restDelta,
  })

  const firstAnim = config.firstSectionAnimation
  const middleAnim = config.middleSectionAnimation
  const lastAnim = config.lastSectionAnimation

  const yInput = isFirst
    ? [start, start + firstAnim.y.enterDuration, end]
    : isLast
      ? [start, start + lastAnim.y.enterDuration]
      : [start, start + middleAnim.y.enterDuration, end - middleAnim.y.exitStartOffset, end]

  const yOutput = isFirst
    ? ["0vh", "0vh", `${firstAnim.y.exitValue}vh`]
    : isLast
      ? ["100vh", "0vh"]
      : ["100vh", "0vh", "0vh", `${middleAnim.y.exitValue}vh`]

  const y = useTransform(smoothProgress, yInput, yOutput, { clamp: true })

  const scaleInput = isFirst
    ? [start, start + firstAnim.scale.enterDuration, end]
    : isLast
      ? [start, start + lastAnim.scale.enterDuration]
      : [start, start + middleAnim.scale.enterDuration, end - middleAnim.scale.exitStartOffset, end]

  const scaleOutput = isFirst
    ? [firstAnim.scale.startValue, firstAnim.scale.midValue, firstAnim.scale.exitValue]
    : isLast
      ? [lastAnim.scale.enterValue, 1]
      : [middleAnim.scale.enterValue, 1, 1, middleAnim.scale.exitValue]

  const scale = useTransform(smoothProgress, scaleInput, scaleOutput, { clamp: true })

  const opacityInput = isFirst
    ? [start, start + firstAnim.opacity.enterDuration, end]
    : isLast
      ? [start, start + lastAnim.opacity.enterDuration]
      : [start, start + middleAnim.opacity.enterDuration, end - middleAnim.opacity.exitStartOffset, end]

  const opacityOutput = isFirst
    ? [firstAnim.opacity.startValue, firstAnim.opacity.startValue, firstAnim.opacity.exitValue]
    : isLast
      ? [0, 1]
      : [0, 1, 1, middleAnim.opacity.exitValue]

  const opacity = useTransform(smoothProgress, opacityInput, opacityOutput, { clamp: true })

  const blurInput = isFirst
    ? [start + firstAnim.blur.startOffset, end]
    : isLast
      ? [start, start]
      : [end - middleAnim.blur.endOffset, end]

  const blurOutput = isFirst
    ? [0, firstAnim.blur.maxValue]
    : isLast
      ? [0, 0]
      : [0, middleAnim.blur.maxValue]

  const blur = useTransform(smoothProgress, blurInput, blurOutput, { clamp: true })

  const borderRadiusInput = isFirst
    ? [start + firstAnim.borderRadius.startOffset, start + firstAnim.borderRadius.endOffset]
    : isLast
      ? [start, start]
      : [start + middleAnim.borderRadius.startOffset, start + middleAnim.borderRadius.endOffset]

  const borderRadiusOutput = isFirst
    ? [`${firstAnim.borderRadius.startValue}px`, `${firstAnim.borderRadius.endValue}px`]
    : isLast
      ? [`${lastAnim.borderRadius.value}px`, `${lastAnim.borderRadius.value}px`]
      : [`${middleAnim.borderRadius.value}px`, `${middleAnim.borderRadius.value}px`]

  const borderRadius = useTransform(smoothProgress, borderRadiusInput, borderRadiusOutput, { clamp: true })

  return { y, scale, opacity, blur, borderRadius, progress: smoothProgress }
}
