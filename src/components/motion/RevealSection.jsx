import { motion } from 'framer-motion'
import { variantMap, staggerFast, staggerMid, staggerSlow } from '../../animations/variants'

const staggerMap = {
  fast: staggerFast,
  mid: staggerMid,
  slow: staggerSlow,
}

/**
 * Scroll-triggered section reveal wrapper using Framer Motion whileInView.
 *
 * @prop {React.ReactNode} children
 * @prop {number}          delay        - seconds, default 0
 * @prop {string}          variant      - keyof variantMap, default "fadeUp"
 * @prop {boolean}         stagger      - wrap children in stagger container, default false
 * @prop {"fast"|"mid"|"slow"} staggerSpeed - default "mid"
 * @prop {string}          className
 * @prop {string}          as           - HTML tag, default "div"
 * @prop {number}          threshold    - viewport amount, default 0.15
 */
export default function RevealSection({
  children,
  delay = 0,
  variant = 'fadeUp',
  stagger = false,
  staggerSpeed = 'mid',
  className = '',
  as = 'div',
  threshold = 0.15,
}) {
  const baseVariant = variantMap[variant] ?? variantMap.fadeUp
  const staggerVariant = staggerMap[staggerSpeed] ?? staggerMid

  // Merge delay into the variant transition
  const delayedVariant = {
    hidden: baseVariant.hidden,
    visible: {
      ...baseVariant.visible,
      transition: {
        ...baseVariant.visible?.transition,
        delay,
      },
    },
  }

  const containerVariant = stagger
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            ...staggerVariant.visible?.transition,
            delay,
          },
        },
      }
    : delayedVariant

  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      className={className}
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
    >
      {children}
    </MotionTag>
  )
}
