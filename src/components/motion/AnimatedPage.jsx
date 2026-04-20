import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Page transition wrapper for React Router.
 * Enter: y:16→0, opacity:0→1 over 0.3s ease-out-expo
 * Exit:  opacity:1→0 over 0.18s
 *
 * Also renders a 2px indigo progress bar at top of viewport during navigation.
 *
 * @prop {React.ReactNode} children
 * @prop {string}          routeKey - should be location.pathname for keying
 */
export default function AnimatedPage({ children, routeKey }) {
  const [showBar, setShowBar] = useState(true)

  useEffect(() => {
    setShowBar(true)
    const t = setTimeout(() => setShowBar(false), 500)
    return () => clearTimeout(t)
  }, [routeKey])

  return (
    <>
      {/* Navigation progress bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            key={`progress-${routeKey}`}
            initial={{ width: '0%', opacity: 1 }}
            animate={{ width: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #4edea3 0%, #c0c1ff 100%)',
              zIndex: 9999,
              transformOrigin: 'left',
            }}
          />
        )}
      </AnimatePresence>

      {/* Page content */}
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.19, 1, 0.22, 1],
          exit: { duration: 0.18 },
        }}
      >
        {children}
      </motion.div>
    </>
  )
}
