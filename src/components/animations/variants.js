/**
 * Framer Motion variants for Takshak.
 * Ease used throughout: ease-out-expo = [0.19, 1, 0.22, 1]
 */

const EXPO = [0.19, 1, 0.22, 1]

// ─── Fade variants ──────────────────────────────────────────────────────────

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EXPO },
  },
}

export const fadeDown = {
  hidden: { opacity: 0, y: -32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EXPO },
  },
}

export const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EXPO },
  },
}

export const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EXPO },
  },
}

// ─── Clip reveal ─────────────────────────────────────────────────────────────

export const clipReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 0.7, ease: EXPO },
  },
}

// ─── Scale variants ──────────────────────────────────────────────────────────

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EXPO },
  },
}

export const scaleUp = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EXPO },
  },
}

// ─── Stagger containers ───────────────────────────────────────────────────────

export const staggerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045 },
  },
}

export const staggerMid = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

export const staggerSlow = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13 },
  },
}

// ─── Page transitions ─────────────────────────────────────────────────────────

export const pageEnter = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: EXPO },
  },
}

export const pageExit = {
  hidden: { opacity: 1, x: 0 },
  visible: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.22, ease: EXPO },
  },
}

// ─── Named variant map (for RevealSection prop access) ────────────────────────

export const variantMap = {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  clipReveal,
  scaleIn,
  scaleUp,
}
