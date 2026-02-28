import { motion, AnimatePresence } from "framer-motion"
import {
    Heart,
    MessageCircle,
    Smile,
    TrendingDown,
    TrendingUp,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const MOODS = [
    { emoji: "😊", label: "Happy", value: 5, color: "emerald" },
    { emoji: "🙂", label: "Good", value: 4, color: "lime" },
    { emoji: "😐", label: "Neutral", value: 3, color: "amber" },
    { emoji: "😰", label: "Stressed", value: 2, color: "orange" },
    { emoji: "😫", label: "Overwhelmed", value: 1, color: "rose" },
]

const STRESS_TIPS = {
    5: ["Great energy today! Channel it into a deep study session.", "Share your positivity with your peers."],
    4: ["You're in a good zone. Try tackling your hardest topic today.", "Consistency on good days builds momentum."],
    3: ["Take a 10-minute walk before studying.", "Break your tasks into smaller 25-minute chunks (Pomodoro)."],
    2: ["Breathe. 5 minutes of deep breathing can reset your focus.", "Talk to someone — a friend, family or mentor.", "Don't skip meals or sleep. Your brain needs fuel."],
    1: ["Stop. Step away from books for 30 minutes. It's okay.", "You're not alone — thousands of students feel this way.", "Consider talking to a counselor or trusted mentor today."],
}

// Local storage key for demo
const LS_KEY = "mentorbhaiyaa_stress_logs"

function loadLogs() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]") } catch { return [] }
}
function saveLogs(logs) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(logs)) } catch { }
}

export default function StressCheckin() {
    const [selectedMood, setSelectedMood] = useState(null)
    const [stressLevel, setStressLevel] = useState(3)
    const [note, setNote] = useState("")
    const [logs, setLogs] = useState(loadLogs())
    const [submitted, setSubmitted] = useState(false)

    const todayKey = new Date().toDateString()
    const loggedToday = logs.some(l => new Date(l.logged_at).toDateString() === todayKey)

    function handleSubmit() {
        if (!selectedMood) return
        const entry = {
            id: Date.now(),
            mood: selectedMood,
            stress_level: stressLevel,
            note,
            logged_at: new Date().toISOString(),
        }
        const updated = [entry, ...logs]
        setLogs(updated)
        saveLogs(updated)
        setSubmitted(true)
    }

    const weekData = useMemo(() => {
        const days = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toDateString()
            const dayLog = logs.find(l => new Date(l.logged_at).toDateString() === dateStr)
            days.push({ label: d.toLocaleDateString("en", { weekday: "short" }), mood: dayLog?.mood || null, stress: dayLog?.stress_level || null })
        }
        return days
    }, [logs])

    const tips = STRESS_TIPS[selectedMood || 3]

    return (
        <div className="space-y-6">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 p-8 text-center text-white shadow-xl md:p-10"
            >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
                    <Heart size={40} />
                </div>
                <h1 className="text-4xl font-extrabold md:text-5xl">Wellness Check-in</h1>
                <p className="mt-3 text-lg text-white/80">Your mental health matters as much as your rank</p>
            </motion.section>

            {/* Daily Check-in */}
            {!submitted && !loggedToday ? (
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-card space-y-5"
                >
                    <h2 className="text-lg font-bold text-slate-900">How are you feeling today?</h2>

                    {/* Mood Picker */}
                    <div className="flex justify-around gap-2">
                        {MOODS.map(m => (
                            <button
                                key={m.value}
                                type="button"
                                onClick={() => setSelectedMood(m.value)}
                                className={`flex flex-col items-center gap-1 rounded-2xl p-3 transition-all ${selectedMood === m.value ? "bg-indigo-50 ring-2 ring-indigo-400 scale-110" : "hover:bg-slate-50"}`}
                            >
                                <span className="text-4xl">{m.emoji}</span>
                                <span className="text-xs font-medium text-slate-600">{m.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Stress Slider */}
                    <div>
                        <label className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                            <span>Stress Level</span>
                            <span className="text-indigo-600 font-bold">{stressLevel}/5</span>
                        </label>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            value={stressLevel}
                            onChange={e => setStressLevel(Number(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                        <div className="mt-1 flex justify-between text-xs text-slate-400">
                            <span>Calm</span><span>Moderate</span><span>Very Stressed</span>
                        </div>
                    </div>

                    {/* Note */}
                    <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Optional: What's on your mind? (stays private)"
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                    />

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedMood}
                        className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
                    >
                        Save Check-in ✨
                    </button>
                </motion.section>
            ) : (
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center"
                >
                    <p className="text-4xl">✅</p>
                    <p className="mt-2 text-lg font-bold text-emerald-800">Check-in logged for today!</p>
                    <p className="text-sm text-emerald-600">Come back tomorrow to continue your streak.</p>
                </motion.section>
            )}

            {/* Tips based on mood */}
            {selectedMood && (
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-card"
                >
                    <h3 className="mb-3 text-sm font-bold text-indigo-900">💡 Tips for you right now</h3>
                    <ul className="space-y-2">
                        {tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-indigo-800">
                                <span className="mt-0.5 text-indigo-400">•</span> {tip}
                            </li>
                        ))}
                    </ul>
                </motion.section>
            )}

            {/* 7-Day Mood Trend */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-card"
            >
                <h2 className="mb-4 text-lg font-bold text-slate-900">📈 7-Day Mood Trend</h2>
                <div className="flex items-end justify-between gap-2">
                    {weekData.map((day, i) => {
                        const moodObj = MOODS.find(m => m.value === day.mood)
                        const height = day.mood ? `${(day.mood / 5) * 80}px` : "8px"
                        return (
                            <div key={i} className="flex flex-1 flex-col items-center gap-1">
                                <span title={moodObj?.label}>{moodObj?.emoji || "—"}</span>
                                <div
                                    className={`w-full rounded-t-lg transition-all ${day.mood ? "bg-indigo-400" : "bg-slate-100"}`}
                                    style={{ height }}
                                />
                                <span className="text-[10px] text-slate-500">{day.label}</span>
                            </div>
                        )
                    })}
                </div>
            </motion.section>
        </div>
    )
}
