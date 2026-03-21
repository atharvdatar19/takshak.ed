import { motion } from "framer-motion"
import { useState } from "react"
import { ShieldCheck, Plus, Trash2, Save } from "lucide-react"

const ROLES = ["admin", "moderator", "content_editor", "finance_viewer"]
const DEMO_TEAM = [
    { id: "t1", name: "Atharv (Founder)", email: "admin@takshak.in", role: "admin" },
    { id: "t2", name: "Priya (Content Lead)", email: "priya@takshak.in", role: "content_editor" },
    { id: "t3", name: "Rahul (Finance)", email: "rahul@takshak.in", role: "finance_viewer" },
]

export default function AdminTeamAccess() {
    const [team, setTeam] = useState(DEMO_TEAM)
    const [newEmail, setNewEmail] = useState("")
    const [newRole, setNewRole] = useState("moderator")

    const addMember = () => {
        if (!newEmail.trim()) return
        setTeam(prev => [...prev, { id: `t${Date.now()}`, name: newEmail.split("@")[0], email: newEmail, role: newRole }])
        setNewEmail(""); setNewRole("moderator")
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Team Access</h1>
                <p className="text-sm text-slate-500 mt-1">Manage who has admin access and their role levels.</p>
            </div>

            <div className="rounded-2xl border border-indigo-500/20 bg-[#111120] p-5 flex flex-col sm:flex-row gap-3">
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address"
                    className="flex-1 rounded-xl border border-[#1f1f35] bg-[#0d0e1a] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 transition placeholder:text-slate-600" />
                <select value={newRole} onChange={e => setNewRole(e.target.value)}
                    className="rounded-xl border border-[#1f1f35] bg-[#0d0e1a] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 appearance-none">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button onClick={addMember}
                    className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2 text-xs font-bold hover:bg-indigo-500/20 transition flex items-center gap-2">
                    <Plus size={14} /> Add
                </button>
            </div>

            <div className="rounded-2xl border border-[#1f1f35] bg-[#111120] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#1f1f35]">
                            {["Name", "Email", "Role", "Actions"].map(h => (
                                <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {team.map((m, i) => (
                            <tr key={m.id} className={`border-b border-[#1f1f35]/50 ${i % 2 === 0 ? "bg-[#0d0e1a]" : ""}`}>
                                <td className="px-5 py-3 text-xs font-semibold text-white">{m.name}</td>
                                <td className="px-5 py-3 text-xs text-slate-400">{m.email}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${m.role === "admin" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                        }`}>{m.role}</span>
                                </td>
                                <td className="px-5 py-3">
                                    {m.role !== "admin" && (
                                        <button onClick={() => setTeam(prev => prev.filter(t => t.id !== m.id))}
                                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"><Trash2 size={12} /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
