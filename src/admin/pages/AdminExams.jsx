import { motion } from "framer-motion"
import { Clock, Plus, Pencil, Trash2 } from "lucide-react"

const DEMO = [
    { id: "ex1", name: "JEE Main 2026", stream: "Engineering", start_date: "2026-04-01", end_date: "2026-04-15", priority: 1, is_national: true },
    { id: "ex2", name: "NEET UG 2026", stream: "Medical", start_date: "2026-05-04", end_date: "2026-05-04", priority: 1, is_national: true },
    { id: "ex3", name: "CUET UG 2026", stream: "General", start_date: "2026-05-15", end_date: "2026-05-28", priority: 2, is_national: true },
    { id: "ex4", name: "JEE Advanced 2026", stream: "Engineering", start_date: "2026-06-08", end_date: "2026-06-08", priority: 1, is_national: true },
]

export default function AdminExams() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Exam Timeline</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage exam dates and registration windows.</p>
                </div>
                <button className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2 text-xs font-bold hover:bg-indigo-500/20 transition flex items-center gap-2">
                    <Plus size={14} /> Add Exam
                </button>
            </div>
            <div className="rounded-2xl border border-[#1f1f35] bg-[#111120] overflow-hidden">
                <table className="w-full">
                    <thead><tr className="border-b border-[#1f1f35]">
                        {["Exam", "Stream", "Start", "End", "Priority", "National", "Actions"].map(h => (
                            <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {DEMO.map((e, i) => (
                            <tr key={e.id} className={`border-b border-[#1f1f35]/50 ${i % 2 === 0 ? "bg-[#0d0e1a]" : ""} hover:bg-[#161830] transition`}>
                                <td className="px-5 py-3 text-xs font-semibold text-white">{e.name}</td>
                                <td className="px-5 py-3 text-xs text-slate-400">{e.stream}</td>
                                <td className="px-5 py-3 text-xs text-slate-400">{e.start_date}</td>
                                <td className="px-5 py-3 text-xs text-slate-400">{e.end_date}</td>
                                <td className="px-5 py-3 text-xs text-amber-400 font-bold">P{e.priority}</td>
                                <td className="px-5 py-3">{e.is_national && <span className="text-emerald-400 text-[10px]">✓</span>}</td>
                                <td className="px-5 py-3"><div className="flex gap-1">
                                    <button className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400"><Pencil size={12} /></button>
                                    <button className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"><Trash2 size={12} /></button>
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
