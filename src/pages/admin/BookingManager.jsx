import { useCallback, useEffect, useState } from "react"
import { adminGetBookings, adminUpdateBookingStatus } from "../../services/admin"

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"]

const statusColors = {
    Pending: "bg-amber-100 text-amber-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-slate-100 text-slate-500",
}

export default function BookingManager() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const result = await adminGetBookings()
            setBookings(result.records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const filtered = bookings.filter(b => !statusFilter || b.status === statusFilter)

    async function handleStatusChange(id, newStatus) {
        try {
            await adminUpdateBookingStatus(id, newStatus)
            setBookings(prev =>
                prev.map(b => (b.id === id ? { ...b, status: newStatus } : b)),
            )
        } catch (err) {
            setError(err.message)
        }
    }

    function formatDateTime(value) {
        if (!value) return "—"
        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-200" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>
            )}

            <div className="flex items-center gap-3">
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <p className="text-xs text-slate-500">{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-600">
                            <th className="px-4 py-3">User Email</th>
                            <th className="px-4 py-3">Mentor</th>
                            <th className="px-4 py-3">Topic</th>
                            <th className="px-4 py-3">Date & Time</th>
                            <th className="px-4 py-3">Duration</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(booking => (
                            <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3 text-slate-900">{booking.user_email}</td>
                                <td className="px-4 py-3 text-slate-600">{booking.mentors?.name || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{booking.topic || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{formatDateTime(booking.requested_datetime)}</td>
                                <td className="px-4 py-3 text-slate-600">{booking.duration_minutes || 30} min</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={booking.status}
                                        onChange={e => handleStatusChange(booking.id, e.target.value)}
                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[booking.status] || "bg-slate-100 text-slate-500"}`}
                                    >
                                        {STATUS_OPTIONS.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
