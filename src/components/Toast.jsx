import { createContext, useCallback, useContext, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react"

const ToastContext = createContext({ addToast: () => { } })

const ICONS = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
}

const COLORS = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    error: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200",
    info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
    warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = "info", duration = 4000) => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, duration)
        }
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast Container */}
            <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map(toast => {
                        const Icon = ICONS[toast.type] || Info
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: 20, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-premium ${COLORS[toast.type]}`}
                                style={{ minWidth: 280, maxWidth: 400 }}
                            >
                                <Icon size={16} className="shrink-0" />
                                <p className="flex-1 text-sm font-medium">{toast.message}</p>
                                <button
                                    type="button"
                                    onClick={() => removeToast(toast.id)}
                                    className="shrink-0 opacity-50 transition hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    return useContext(ToastContext)
}
