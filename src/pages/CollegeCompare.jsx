import { motion } from "framer-motion"
import {
    ArrowLeftRight,
    BarChart2,
    GraduationCap,
    MapPin,
    Minus,
    Plus,
    SlidersHorizontal,
    X,
} from "lucide-react"
import { useMemo, useState } from "react"
import { getColleges } from "../services/api"
import { useAsyncData } from "../hooks/useAsyncData"

const DEMO_COLLEGES = [
    { id: "d1", name: "IIT Bombay", city: "Mumbai", state: "Maharashtra", type: "government", established_year: 1958, annual_fees: 220000, placement_rate: 98, avg_package: 1800000, ranking_nirf: 3, streams_supported: ["PCM"], facilities: ["Hostel", "Library", "Lab", "WiFi", "Cafeteria"] },
    { id: "d2", name: "IIT Delhi", city: "New Delhi", state: "Delhi", type: "government", established_year: 1961, annual_fees: 210000, placement_rate: 97, avg_package: 1700000, ranking_nirf: 2, streams_supported: ["PCM"], facilities: ["Hostel", "Library", "Lab", "WiFi", "Sports"] },
    { id: "d3", name: "BITS Pilani", city: "Pilani", state: "Rajasthan", type: "private", established_year: 1964, annual_fees: 560000, placement_rate: 95, avg_package: 1400000, ranking_nirf: 25, streams_supported: ["PCM"], facilities: ["Hostel", "Library", "Lab", "WiFi", "Medical"] },
    { id: "d4", name: "NIT Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", type: "government", established_year: 1964, annual_fees: 155000, placement_rate: 90, avg_package: 900000, ranking_nirf: 8, streams_supported: ["PCM"], facilities: ["Hostel", "Library", "Lab", "WiFi"] },
    { id: "d5", name: "AIIMS Delhi", city: "New Delhi", state: "Delhi", type: "government", established_year: 1956, annual_fees: 1628, placement_rate: 100, avg_package: 2000000, ranking_nirf: 1, streams_supported: ["PCB"], facilities: ["Hostel", "Library", "Lab", "Hospital", "Research"] },
    { id: "d6", name: "VIT Vellore", city: "Vellore", state: "Tamil Nadu", type: "private", established_year: 1984, annual_fees: 195000, placement_rate: 85, avg_package: 650000, ranking_nirf: 11, streams_supported: ["PCM"], facilities: ["Hostel", "Library", "Lab", "WiFi", "Sports"] },
]

const COMPARE_FIELDS = [
    { label: "📍 Location", key: v => `${v.city}, ${v.state}` },
    { label: "🏛️ Type", key: v => v.type === "government" ? "🟢 Government" : "🔵 Private" },
    { label: "📅 Established", key: v => v.established_year },
    { label: "💰 Annual Fees", key: v => `₹${(v.annual_fees || 0).toLocaleString()}` },
    { label: "📈 Placement %", key: v => `${v.placement_rate}%` },
    { label: "💼 Avg Package", key: v => `₹${((v.avg_package || 0) / 100000).toFixed(1)} LPA` },
    { label: "🏆 NIRF Rank", key: v => `#${v.ranking_nirf || "N/A"}` },
]

export default function CollegeCompare() {
    const [selected, setSelected] = useState([DEMO_COLLEGES[0], DEMO_COLLEGES[1]])
    const [search, setSearch] = useState("")

    const filtered = DEMO_COLLEGES.filter(c =>
        !search || c.name.toLowerCase().includes(search.toLowerCase())
    )

    function addCollege(college) {
        if (selected.length >= 3) return
        if (selected.find(s => s.id === college.id)) return
        setSelected(prev => [...prev, college])
        setSearch("")
    }

    function removeCollege(id) {
        setSelected(prev => prev.filter(s => s.id !== id))
    }

    return (
        <div className="space-y-6">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-center text-white shadow-xl md:p-10"
            >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl glass/20 shadow-lg">
                    <ArrowLeftRight size={40} />
                </div>
                <h1 className="text-4xl font-extrabold md:text-5xl">College Compare</h1>
                <p className="mt-3 text-lg text-white/80">Compare up to 3 colleges side by side — make the right choice</p>
            </motion.section>

            {/* Add colleges */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-outline-variant/20/60 glass p-5 shadow-[0_0_20px_rgba(255,180,165,0.08)]"
            >
                <h2 className="mb-3 text-sm font-bold text-on-surface">Selected ({selected.length}/3)</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                    {selected.map(c => (
                        <span key={c.id} className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                            {c.name}
                            <button type="button" onClick={() => removeCollege(c.id)} className="text-primary/70 hover:text-primary"><X size={12} /></button>
                        </span>
                    ))}
                    {selected.length < 3 && (
                        <div className="relative">
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="+ Add college..."
                                className="rounded-full border border-dashed border-primary bg-primary/10 px-4 py-1.5 text-sm text-primary outline-none"
                            />
                            {search && (
                                <div className="absolute left-0 top-full z-10 mt-1 w-64 rounded-2xl border border-outline-variant/20 glass shadow-lg">
                                    {filtered.map(c => (
                                        <button key={c.id} type="button" onClick={() => addCollege(c)} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-surface-container-low">
                                            <GraduationCap size={14} className="text-on-surface-variant/60" /> {c.name}
                                        </button>
                                    ))}
                                    {filtered.length === 0 && <p className="px-4 py-3 text-sm text-on-surface-variant/60">No matches</p>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Comparison Table */}
            {selected.length >= 2 && (
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-lg border border-outline-variant/20/60 glass shadow-[0_0_20px_rgba(255,180,165,0.08)]"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-outline-variant/10 bg-surface-container-low">
                                    <th className="px-5 py-4 text-left text-xs font-bold text-on-surface-variant">Criteria</th>
                                    {selected.map(c => (
                                        <th key={c.id} className="px-5 py-4 text-left">
                                            <p className="font-bold text-on-surface">{c.name}</p>
                                            <p className="text-xs font-normal text-on-surface-variant">{c.city}</p>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARE_FIELDS.map((field, i) => (
                                    <tr key={i} className={`border-b border-outline-variant/10 ${i % 2 === 0 ? "glass" : "bg-surface-container-low/50"}`}>
                                        <td className="px-5 py-3.5 text-xs font-semibold text-on-surface-variant">{field.label}</td>
                                        {selected.map(c => (
                                            <td key={c.id} className="px-5 py-3.5 font-medium text-on-surface">{field.key(c)}</td>
                                        ))}
                                    </tr>
                                ))}
                                {/* Facilities row */}
                                <tr className="border-b border-outline-variant/10">
                                    <td className="px-5 py-3.5 text-xs font-semibold text-on-surface-variant">🏫 Facilities</td>
                                    {selected.map(c => (
                                        <td key={c.id} className="px-5 py-3.5">
                                            <div className="flex flex-wrap gap-1">
                                                {(c.facilities || []).map(f => (
                                                    <span key={f} className="rounded-full bg-tertiary/15 px-2 py-0.5 text-[10px] font-medium text-tertiary">{f}</span>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </motion.section>
            )}

            {selected.length < 2 && (
                <div className="rounded-lg border border-dashed border-outline-variant/20 glass p-12 text-center text-on-surface-variant">
                    Select at least 2 colleges to compare
                </div>
            )}
        </div>
    )
}
