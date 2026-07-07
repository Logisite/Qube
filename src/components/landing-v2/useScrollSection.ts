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

  const y = isFirst
    ? useTransform(
        smoothProgress,
        [start, start + firstAnim.y.enterDuration, end],
        ["0vh", "0vh", `${firstAnim.y.exitValue}vh`],
        { clamp: true },
      )
    : isLast
      ? useTransform(
          smoothProgress,
          [start, start + lastAnim.y.enterDuration],
          ["100vh", "0vh"],
          { clamp: true },
        )
      : useTransform(
          smoothProgress,
          [start, start + middleAnim.y.enterDuration, end - middleAnim.y.exitStartOffset, end],
          ["100vh", "0vh", "0vh", `${middleAnim.y.exitValue}vh`],
          { clamp: true },
        )

  const scale = isFirst
    ? useTransform(
        smoothProgress,
        [start, start + firstAnim.scale.enterDuration, end],
        [firstAnim.scale.startValue, firstAnim.scale.midValue, firstAnim.scale.exitValue],
        { clamp: true },
      )
    : isLast
      ? useTransform(
          smoothProgress,
          [start, start + lastAnim.scale.enterDuration],
          [lastAnim.scale.enterValue, 1],
          { clamp: true },
        )
      : useTransform(
          smoothProgress,
          [start, start + middleAnim.scale.enterDuration, end - middleAnim.scale.exitStartOffset, end],
          [middleAnim.scale.enterValue, 1, 1, middleAnim.scale.exitValue],
          { clamp: true },
        )

  const opacity = isFirst
    ? useTransform(
        smoothProgress,
        [start, start + firstAnim.opacity.enterDuration, end],
        [firstAnim.opacity.startValue, firstAnim.opacity.startValue, firstAnim.opacity.exitValue],
        { clamp: true },
      )
    : isLast
      ? useTransform(
          smoothProgress,
          [start, start + lastAnim.opacity.enterDuration],
          [0, 1],
          { clamp: true },
        )
      : useTransform(
          smoothProgress,
          [start, start + middleAnim.opacity.enterDuration, end - middleAnim.opacity.exitStartOffset, end],
          [0, 1, 1, middleAnim.opacity.exitValue],
          { clamp: true },
        )

  const blur = isFirst
    ? useTransform(
        smoothProgress,
        [start + firstAnim.blur.startOffset, end],
        [0, firstAnim.blur.maxValue],
        { clamp: true },
      )
    : isLast
      ? useTransform(
          smoothProgress,
          [start, start],
          [0, 0],
          { clamp: true },
        )
      : useTransform(
          smoothProgress,
          [end - middleAnim.blur.endOffset, end],
          [0, middleAnim.blur.maxValue],
          { clamp: true },
        )

  const borderRadius = isFirst
    ? useTransform(
        smoothProgress,
        [start + firstAnim.borderRadius.startOffset, start + firstAnim.borderRadius.endOffset],
        [`${firstAnim.borderRadius.startValue}px`, `${firstAnim.borderRadius.endValue}px`],
        { clamp: true },
      )
    : isLast
      ? useTransform(
          smoothProgress,
          [start, start],
          [`${lastAnim.borderRadius.value}px`, `${lastAnim.borderRadius.value}px`],
          { clamp: true },
        )
      : useTransform(
          smoothProgress,
          [start + middleAnim.borderRadius.startOffset, start + middleAnim.borderRadius.endOffset],
          [`${middleAnim.borderRadius.value}px`, `${middleAnim.borderRadius.value}px`],
          { clamp: true },
        )

  return { y, scale, opacity, blur, borderRadius, progress: smoothProgress }
}
