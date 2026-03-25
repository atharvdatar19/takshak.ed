/**
 * Returns true if animations should play (user has not requested reduced motion).
 */
export const shouldAnimate = () =>
  typeof window !== 'undefined'
    ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : true
