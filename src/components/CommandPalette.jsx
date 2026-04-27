import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Command, Search, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

const COMMANDS = [
    { id: "dashboard", label: "Go to Dashboard", path: "/dashboard", keywords: "home overview metrics" },
    { id: "colleges", label: "Go to College Directory", path: "/", keywords: "college university admission" },
    { id: "timeline", label: "Go to Timeline", path: "/timeline", keywords: "exams schedule dates deadlines" },
    { id: "alerts", label: "Go to Alerts", path: "/alerts", keywords: "deadline urgent closing" },
    { id: "mentors", label: "Go to Mentor Marketplace", path: "/mentor-marketplace", keywords: "mentor booking guide educator tutor" },
    { id: "takshak-courses", label: "Search Official Courses (TAKक्षक)", path: "/marketplace", keywords: "course live recorded physicswallah unacademy learn study" },
    { id: "takshak-opportunities", label: "Track Internships & Hackathons", path: "/applications", keywords: "internship hackathon scholarship opportunity tracker" },
    { id: "admin", label: "Go to Admin Control", path: "/admin", keywords: "admin manage control panel" },
    { id: "admin-colleges", label: "Admin → Manage Colleges", path: "/admin", keywords: "add edit college crud" },
    { id: "admin-exams", label: "Admin → Manage Exams", path: "/admin", keywords: "add edit exam timeline" },
    { id: "admin-mentors", label: "Admin → Manage Mentors", path: "/admin", keywords: "verify mentor approve" },
    { id: "admin-users", label: "Admin → Manage Users", path: "/admin", keywords: "user premium toggle" },
    { id: "admin-notify", label: "Admin → Send Notifications", path: "/admin", keywords: "broadcast notify alert" },
]

export default function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [selected, setSelected] = useState(0)
    const inputRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        function handleKeyDown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault()
                setOpen(prev => !prev)
            }
            if (e.key === "Escape") setOpen(false)
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    useEffect(() => {
        if (open) {
            setQuery("")
            setSelected(0)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [open])

    const filtered = useMemo(() => {
        if (!query.trim()) return COMMANDS
        const lower = query.toLowerCase()
        return COMMANDS.filter(
            cmd => cmd.label.toLowerCase().includes(lower) || cmd.keywords.includes(lower),
        )
    }, [query])

    useEffect(() => {
        setSelected(0)
    }, [filtered])

    const runCommand = useCallback(
        (cmd) => {
            navigate(cmd.path)
            setOpen(false)
        },
        [navigate],
    )

    function handleKeyNav(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelected(prev => (prev + 1) % filtered.length)
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelected(prev => (prev - 1 + filtered.length) % filtered.length)
        } else if (e.key === "Enter" && filtered[selected]) {
            runCommand(filtered[selected])
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
                    onClick={() => setOpen(false)}
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                            <Search size={16} className="text-slate-400" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleKeyNav}
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                            />
                            <kbd className="hidden rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 sm:inline dark:border-slate-600">
                                ESC
                            </kbd>
                        </div>

                        {/* Results */}
                        <ul className="max-h-64 overflow-y-auto p-2">
                            {filtered.length === 0 ? (
                                <li className="px-3 py-6 text-center text-sm text-slate-400">No results found.</li>
                            ) : (
                                filtered.map((cmd, i) => (
                                    <li key={cmd.id}>
                                        <button
                                            type="button"
                                            onClick={() => runCommand(cmd)}
                                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${i === selected
                                                ? "bg-indigo-600 text-white"
                                                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            <Command size={14} className={i === selected ? "text-white/70" : "text-slate-400"} />
                                            {cmd.label}
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>

                        {/* Footer hint */}
                        <div className="border-t border-slate-200 px-4 py-2 text-[11px] text-slate-400 dark:border-slate-700">
                            <span className="mr-3">↑↓ Navigate</span>
                            <span className="mr-3">↵ Select</span>
                            <span>Esc Close</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
