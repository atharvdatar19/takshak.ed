import { motion } from "framer-motion"
import { useState } from "react"
import { Users, Shield, Pencil, Ban, CheckCircle, Search } from "lucide-react"

const DEMO_USERS = [
    { id: "u1", full_name: "Arjun Mehta", email: "arjun@iitb.ac.in", role: "mentor", status: "active", joined: "2026-01-15" },
    { id: "u2", full_name: "Neha Deshmukh", email: "neha@gmail.com", role: "student", status: "active", joined: "2026-02-01" },
    { id: "u3", full_name: "Varun Kumar", email: "varun@gmail.com", role: "student", status: "active", joined: "2026-02-10" },
    { id: "u4", full_name: "Priya Sharma", email: "priya@aiims.in", role: "mentor", status: "active", joined: "2026-01-20" },
    { id: "u5", full_name: "Admin User", email: "admin@netrax.in", role: "admin", status: "active", joined: "2026-01-01" },
]

export default function AdminUsers() {
    const [search, setSearch] = useState("")
    const filtered = DEMO_USERS.filter(u =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Users</h1>
                <p className="text-sm text-slate-500 mt-1">Manage all platform users.</p>
            </div>
            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                    className="w-full rounded-xl border border-[#1f1f35] bg-[#0d0e1a] pl-9 pr-4 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 transition placeholder:text-slate-600" />
            </div>
            <div className="rounded-2xl border border-[#1f1f35] bg-[#111120] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#1f1f35]">
                            {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                                <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u, i) => (
                            <tr key={u.id} className={`border-b border-[#1f1f35]/50 ${i % 2 === 0 ? "bg-[#0d0e1a]" : ""} hover:bg-[#161830] transition`}>
                                <td className="px-5 py-3 text-xs font-semibold text-white">{u.full_name}</td>
                                <td className="px-5 py-3 text-xs text-slate-400">{u.email}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${u.role === "admin" ? "bg-rose-500/10 text-rose-400" :
                                            u.role === "mentor" ? "bg-indigo-500/10 text-indigo-400" :
                                                "bg-slate-500/10 text-slate-400"
                                        }`}>{u.role}</span>
                                </td>
                                <td className="px-5 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400">{u.status}</span>
                                </td>
                                <td className="px-5 py-3 text-xs text-slate-500">{u.joined}</td>
                                <td className="px-5 py-3">
                                    <div className="flex gap-1">
                                        <button className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400"><Pencil size={12} /></button>
                                        <button className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"><Ban size={12} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
