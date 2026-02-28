import { useEffect, useRef } from "react"

/**
 * IntersectionObserver-based scroll reveal.
 * Adds `.revealed` class when element enters viewport.
 * CSS handles the opacity/translateY transition.
 *
 * Usage:
 *   const ref = useScrollReveal()
 *   <div ref={ref} className="reveal">...</div>
 */
export function useScrollReveal(options = {}) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed")
                    observer.unobserve(entry.target) // only animate once
                }
            },
            { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || "0px 0px -40px 0px" }
        )

        observer.observe(el)

        return () => observer.disconnect()
    }, [])

    return ref
}

/**
 * Auto-reveal all .reveal elements within a container.
 * Call once in a page component.
 */
export function useAutoReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed")
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
        )

        // Observe all .reveal elements
        const elements = document.querySelectorAll(".reveal:not(.revealed)")
        elements.forEach(el => observer.observe(el))

        return () => observer.disconnect()
    }, [])
}
