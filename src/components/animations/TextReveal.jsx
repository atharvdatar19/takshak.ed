import { motion } from "framer-motion"

/**
 * Text Reveal — Each character/word appears one-by-one with stagger.
 * Creates a cinematic "typing into existence" effect.
 *
 * mode="char" → single character reveal
 * mode="word" → word-by-word reveal
 */
export default function TextReveal({
    text,
    mode = "char",
    className = "",
    delay = 0,
    stagger = 0.03,
    tag: Tag = "h1",
}) {
    const units = mode === "word" ? text.split(" ") : text.split("")

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: delay },
        },
    }

    const child = {
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: -90,
            filter: "blur(8px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 150,
            },
        },
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
            style={{ perspective: "600px" }}
        >
            <Tag className={className} style={{ display: "flex", flexWrap: "wrap" }}>
                {units.map((unit, i) => (
                    <motion.span
                        key={i}
                        variants={child}
                        style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
                    >
                        {unit === " " || mode === "word" ? (
                            <>{unit}&nbsp;</>
                        ) : (
                            unit
                        )}
                    </motion.span>
                ))}
            </Tag>
        </motion.div>
    )
}
