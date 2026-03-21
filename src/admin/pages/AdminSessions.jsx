import { motion } from "framer-motion"
import { CalendarDays, Video, CheckCircle, Clock, XCircle } from "lucide-react"

const DEMO_SESSIONS = [
    { id: "s1", student: "Neha D.", mentor: "Arjun Mehta", topic: "JEE Maths Strategy", duration: 60, rate: 499, status: "completed", date: "2026-03-10", meet_link: "https://meet.jit.si/takshak-s1" },
    { id: "s2", student: "Varun K.", mentor: "Arjun Mehta", topic: "Mock Test Analysis", duration: 30, rate: 299, status: "confirmed", date: "2026-03-20", meet_link: "https://meet.jit.si/takshak-s2" },
    { id: "s3", student: "Priya S.", mentor: "Anita R.", topic: "NEET Bio Revision", duration: 60, rate: 449, status: "confirmed", date: "2026-03-22", meet_link: "https://meet.jit.si/takshak-s3" },
    { id: "s4", student: "Karan J.", mentor: "Arjun Mehta", topic: "College Selection", duration: 30, rate: 299, status: "cancelled", date: "2026-03-07", meet_link: null },
]

export default function AdminSessions() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Sessions</h1>
                <p className="text-sm text-slate-500 mt-1">View all sessions across the platform.</p>
            </div>
            <div className="rounded-2xl border border-[#1f1f35] bg-[#111120] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#1f1f35]">
                                {["ID", "Student", "Mentor", "Topic", "Duration", "Rate", "Date", "Status", "Meet"].map(h => (
                                    <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {DEMO_SESSIONS.map((s, i) => (
                                <tr key={s.id} className={`border-b border-[#1f1f35]/50 ${i % 2 === 0 ? "bg-[#0d0e1a]" : ""} hover:bg-[#161830] transition`}>
                                    <td className="px-5 py-3 text-xs font-mono text-slate-400">{s.id}</td>
                                    <td className="px-5 py-3 text-xs text-white font-semibold">{s.student}</td>
                                    <td className="px-5 py-3 text-xs text-slate-300">{s.mentor}</td>
                                    <td className="px-5 py-3 text-xs text-slate-400">{s.topic}</td>
                                    <td className="px-5 py-3 text-xs text-slate-400">{s.duration}min</td>
                                    <td className="px-5 py-3 text-xs text-emerald-400 font-bold">₹{s.rate}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{s.date}</td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${s.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                                                s.status === "confirmed" ? "bg-indigo-500/10 text-indigo-400" :
                                                    "bg-rose-500/10 text-rose-400"
                                            }`}>{s.status}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        {s.meet_link && <a href={s.meet_link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline text-[10px]">Link</a>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
