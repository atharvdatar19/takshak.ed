import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const curtainVariants = {
  visible: {
    clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hidden: {
    clipPath: "polygon(50% 0,50% 0,50% 100%,50% 100%)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

const CardCurtainRevealContext = React.createContext(undefined)

function useCardCurtainRevealContext() {
  const context = React.useContext(CardCurtainRevealContext)
  if (!context) throw new Error("useCardCurtainRevealContext must be used within CardCurtainReveal")
  return context
}

const CardCurtainReveal = React.forwardRef(({ children, className, ...props }, ref) => {
  const [isMouseIn, setIsMouseIn] = React.useState(false)
  const handleMouseEnter = React.useCallback(() => setIsMouseIn(true), [])
  const handleMouseLeave = React.useCallback(() => setIsMouseIn(false), [])

  return (
    <CardCurtainRevealContext.Provider value={{ isMouseIn }}>
      <div
        ref={ref}
        className={cn("relative flex flex-col gap-0 overflow-hidden", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    </CardCurtainRevealContext.Provider>
  )
})
CardCurtainReveal.displayName = "CardCurtainReveal"

const CardCurtainRevealFooter = React.forwardRef(({ className, ...props }, ref) => {
  const { isMouseIn } = useCardCurtainRevealContext()
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={curtainVariants}
      animate={isMouseIn ? "visible" : "hidden"}
      {...props}
    />
  )
})
CardCurtainRevealFooter.displayName = "CardCurtainRevealFooter"

const CardCurtainRevealBody = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex-1 p-5", className)} {...props} />
})
CardCurtainRevealBody.displayName = "CardCurtainRevealBody"

const CardCurtainRevealTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { isMouseIn } = useCardCurtainRevealContext()
  return (
    <motion.h2
      ref={ref}
      className={className}
      animate={isMouseIn ? { y: 0 } : { y: 120 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      {...props}
    />
  )
})
CardCurtainRevealTitle.displayName = "CardCurtainRevealTitle"

const CardCurtain = React.forwardRef(({ className, ...props }, ref) => {
  const { isMouseIn } = useCardCurtainRevealContext()
  return (
    <motion.div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 size-full mix-blend-difference", className)}
      variants={curtainVariants}
      animate={isMouseIn ? "visible" : "hidden"}
      {...props}
    />
  )
})
CardCurtain.displayName = "CardCurtain"

const CardCurtainRevealDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { isMouseIn } = useCardCurtainRevealContext()
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={curtainVariants}
      animate={isMouseIn ? "visible" : "hidden"}
      {...props}
    />
  )
})
CardCurtainRevealDescription.displayName = "CardCurtainRevealDescription"

export {
  CardCurtainReveal,
  CardCurtainRevealBody,
  CardCurtainRevealFooter,
  CardCurtainRevealDescription,
  CardCurtainRevealTitle,
  CardCurtain,
}
