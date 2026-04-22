import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
    const [dark, setDark] = useState(() => {
        if (typeof window === "undefined") return false
        return localStorage.getItem("theme") === "dark"
    })

    useEffect(() => {
        const root = document.documentElement
        if (dark) {
            root.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            root.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [dark])

    return (
        <button
            type="button"
            onClick={() => setDark(prev => !prev)}
            className="group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Toggle theme"
        >
            <div className="relative h-4 w-4 overflow-hidden">
                <Sun
                    size={16}
                    className={`absolute inset-0 transform transition-all duration-300 ${dark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                        }`}
                />
                <Moon
                    size={16}
                    className={`absolute inset-0 transform transition-all duration-300 ${dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                        }`}
                />
            </div>
            <span>{dark ? "Dark Mode" : "Light Mode"}</span>
        </button>
    )
}
