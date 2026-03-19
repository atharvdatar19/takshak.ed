import { motion } from "framer-motion"
import { Building2, Plus, Pencil, Trash2, ExternalLink } from "lucide-react"

const DEMO = [
    { id: "c1", name: "IIT Bombay", city: "Mumbai", state: "Maharashtra", admission_mode: "JEE Advanced", is_featured: true },
    { id: "c2", name: "NIT Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", admission_mode: "JEE Main", is_featured: true },
    { id: "c3", name: "AIIMS Delhi", city: "New Delhi", state: "Delhi", admission_mode: "NEET", is_featured: true },
    { id: "c4", name: "BITS Pilani", city: "Pilani", state: "Rajasthan", admission_mode: "BITSAT", is_featured: false },
]

export default function AdminColleges() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">College CMS</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage the college directory.</p>
                </div>
                <button className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2 text-xs font-bold hover:bg-indigo-500/20 transition flex items-center gap-2">
                    <Plus size={14} /> Add College
                </button>
            </div>
            <div className="rounded-2xl border border-[#1f1f35] bg-[#111120] overflow-hidden">
                <table className="w-full">
                    <thead><tr className="border-b border-[#1f1f35]">
                        {["College", "City", "State", "Admission", "Featured", "Actions"].map(h => (
                            <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {DEMO.map((c, i) => (
                            <tr key={c.id} className={`border-b border-[#1f1f35]/50 ${i % 2 === 0 ? "bg-[#0d0e1a]" : ""} hover:bg-[#161830] transition`}>
                                <td className="px-5 py-3 text-xs font-semibold text-white">{c.name}</td>
                                <td className="px-5 py-3 text-xs text-slate-400">{c.city}</td>
                                <td className="px-5 py-3 text-xs text-slate-400">{c.state}</td>
                                <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{c.admission_mode}</span></td>
                                <td className="px-5 py-3">{c.is_featured && <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400">⭐</span>}</td>
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
