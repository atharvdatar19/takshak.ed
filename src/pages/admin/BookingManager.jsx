import { useCallback, useEffect, useState } from "react"
import { adminGetBookings, adminUpdateBookingStatus } from "../../services/admin"

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"]

const statusColors = {
    Pending: "bg-tertiary/15 text-amber-700",
    Confirmed: "bg-primary/15 text-blue-700",
    Completed: "bg-tertiary/15 text-tertiary",
    Cancelled: "bg-surface-container text-on-surface-variant",
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
                    <div key={i} className="h-16 animate-pulse rounded-lg bg-surface-container-high" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-lg border border-error/20 bg-error/10 px-4 py-2 text-sm text-error">{error}</div>
            )}

            <div className="flex items-center gap-3">
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-outline-variant/20 px-3 py-2 text-sm"
                >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <p className="text-xs text-on-surface-variant">{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-outline-variant/20 glass shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-outline-variant/20 bg-surface-container-low text-left text-xs font-semibold text-on-surface-variant">
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
                            <tr key={booking.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low">
                                <td className="px-4 py-3 text-on-surface">{booking.user_email}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{booking.mentors?.name || "—"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{booking.topic || "—"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{formatDateTime(booking.requested_datetime)}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{booking.duration_minutes || 30} min</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={booking.status}
                                        onChange={e => handleStatusChange(booking.id, e.target.value)}
                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[booking.status] || "bg-surface-container text-on-surface-variant"}`}
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
                                <td colSpan={6} className="px-4 py-8 text-center text-sm text-on-surface-variant/60">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
