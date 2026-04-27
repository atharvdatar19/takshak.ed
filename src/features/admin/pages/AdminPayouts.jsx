import { motion } from "framer-motion"
import { useState, useEffect, useCallback, useMemo } from "react"
import { DollarSign, Download, Loader2, RefreshCw, CheckCircle } from "lucide-react"
import { adminGetTransactions, adminUpdateTransactionStatus } from "@database/services/admin"
import { useRealtimeSync } from "@hooks/useRealtimeSync"

export default function AdminPayouts() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState("all")
    const [actionLoading, setActionLoading] = useState(null)

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            const { records } = await adminGetTransactions()
            setTransactions(records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadData() }, [loadData])
    useRealtimeSync("transactions", () => loadData())

    const filtered = filter === "all" ? transactions : transactions.filter(t => t.status === filter)

    const totalRevenue = useMemo(() => transactions.filter(t => t.status === "captured").reduce((s, t) => s + Number(t.amount_inr || 0), 0), [transactions])
    const totalFees = useMemo(() => transactions.filter(t => t.status === "captured").reduce((s, t) => s + Number(t.platform_fee_inr || 0), 0), [transactions])
    const pendingAmount = useMemo(() => transactions.filter(t => t.status === "pending").reduce((s, t) => s + Number(t.amount_inr || 0), 0), [transactions])

    const handleRelease = async (id) => {
        try {
            setActionLoading(id)
            await adminUpdateTransactionStatus(id, "captured")
            setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "captured" } : t))
        } catch (err) {
            setError(err.message)
        } finally {
            setActionLoading(null)
        }
    }

    const exportCSV = () => {
        const headers = "ID,Type,Amount,Platform Fee,Status,Date\n"
        const rows = transactions.map(t => `${t.id},${t.type},${t.amount_inr},${t.platform_fee_inr},${t.status},${t.created_at}`).join("\n")
        const blob = new Blob([headers + rows], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`; a.click()
        URL.revokeObjectURL(url)
    }

    const statCards = [
        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "emerald" },
        { label: "Platform Earnings", value: `₹${totalFees.toLocaleString()}`, color: "indigo" },
        { label: "Pending", value: `₹${pendingAmount.toLocaleString()}`, color: "amber" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Payouts</h1>
                    <p className="text-[11px] text-slate-600 mt-1">{transactions.length} transactions</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={exportCSV}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 transition text-xs font-medium">
                        <Download size={13} /> Export CSV
                    </button>
                    <button onClick={loadData} disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 transition text-xs font-medium">
                        {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
                    </button>
                </div>
            </div>

            {error && <div className="rounded-xl bg-rose-500/8 border border-rose-500/15 px-4 py-3 text-xs text-rose-400">{error}</div>}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] p-5">
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-white tabular-nums">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex gap-1.5 flex-wrap">
                {["all", "pending", "captured", "refunded", "failed"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${filter === f
                            ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                            : "text-slate-600 hover:text-slate-400 hover:bg-white/[0.03]"
                            }`}>
                        {f === "all" ? "All" : f}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading && transactions.length === 0 ? (
                <div className="space-y-2">{[1, 2, 3, 4].map(i => <div key={i} className="h-14 rounded-xl bg-white/[0.02] animate-pulse" />)}</div>
            ) : (
                <div className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.04]">
                                    {["Type", "Amount", "Platform Fee", "Date", "Status", "Action"].map(h => (
                                        <th key={h} className="text-left text-[9px] font-black uppercase tracking-wider text-slate-600 px-5 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((t, i) => (
                                    <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                        className={`border-b border-white/[0.02] ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-white/[0.03] transition`}>
                                        <td className="px-5 py-3 text-xs font-medium text-indigo-400">{(t.type || "—").replace("_", " ")}</td>
                                        <td className="px-5 py-3 text-xs font-bold text-white">₹{Number(t.amount_inr || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-xs text-emerald-400">₹{Number(t.platform_fee_inr || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-[10px] text-slate-600">
                                            {t.created_at ? new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${t.status === "captured" ? "bg-emerald-500/10 text-emerald-400" :
                                                t.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                                                    t.status === "refunded" ? "bg-indigo-500/10 text-indigo-400" :
                                                        "bg-rose-500/10 text-rose-400"
                                                }`}>{t.status || "unknown"}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {t.status === "pending" && (
                                                <button onClick={() => handleRelease(t.id)} disabled={actionLoading === t.id}
                                                    className="rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 px-2.5 py-1 text-[10px] font-bold hover:bg-emerald-500/15 transition flex items-center gap-1 disabled:opacity-50">
                                                    {actionLoading === t.id ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle size={10} />} Release
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-600">No transactions found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
