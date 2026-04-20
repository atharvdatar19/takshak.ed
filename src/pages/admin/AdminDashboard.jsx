import { useCallback, useEffect, useState } from "react"
import {
    AlertTriangle,
    Building2,
    CalendarDays,
    GraduationCap,
    ShieldCheck,
    TrendingUp,
    Users,
} from "lucide-react"
import { adminGetDataHealth } from "../../services/admin"

export default function AdminDashboard() {
    const [health, setHealth] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const result = await adminGetDataHealth()
            setHealth(result)
        } catch (err) {
            setError(err.message || "Failed to load data health")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-container-high" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-error/20 bg-error/10 p-5 text-sm text-error">
                {error}
            </div>
        )
    }

    if (!health) return null

    const { totals, health: dataHealth, distributions } = health

    const totalMetrics = [
        { icon: Building2, label: "Total Colleges", value: totals.colleges, color: "indigo" },
        { icon: CalendarDays, label: "Total Exams", value: totals.exams, color: "blue" },
        { icon: GraduationCap, label: "Total Mentors", value: totals.mentors, color: "emerald" },
        { icon: Users, label: "Total Users", value: totals.users, color: "violet" },
        { icon: ShieldCheck, label: "Total Bookings", value: totals.bookings, color: "amber" },
        { icon: TrendingUp, label: "Premium Users", value: dataHealth.premiumUsers, color: "rose" },
    ]

    const healthFlags = [
        { label: "Colleges missing official link", value: dataHealth.missingLinks, severity: dataHealth.missingLinks > 0 ? "warn" : "ok" },
        { label: "Mentors with 0 rating", value: dataHealth.lowRatingMentors, severity: dataHealth.lowRatingMentors > 3 ? "warn" : "ok" },
        { label: "Unverified mentors", value: dataHealth.unverifiedMentors, severity: dataHealth.unverifiedMentors > 0 ? "info" : "ok" },
        { label: "Exams missing start date", value: dataHealth.missingDates, severity: dataHealth.missingDates > 0 ? "warn" : "ok" },
        { label: "Pending bookings", value: dataHealth.pendingBookings, severity: dataHealth.pendingBookings > 5 ? "warn" : "info" },
    ]

    const severityClasses = {
        ok: "bg-tertiary/10 text-tertiary border-tertiary/20",
        info: "bg-primary/10 text-blue-700 border-blue-200",
        warn: "bg-tertiary/10 text-amber-700 border-amber-200",
    }

    const colorMap = {
        indigo: "bg-primary/15 text-primary",
        blue: "bg-primary/15 text-blue-700",
        emerald: "bg-tertiary/15 text-tertiary",
        violet: "bg-violet-100 text-violet-700",
        amber: "bg-tertiary/15 text-amber-700",
        rose: "bg-error/15 text-error",
    }

    return (
        <div className="space-y-6">
            {/* ── Total Metrics ── */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {totalMetrics.map(metric => (
                    <article key={metric.label} className="rounded-xl border border-outline-variant/20 glass p-5 shadow-sm">
                        <div className={`mb-3 inline-flex rounded-lg p-2 ${colorMap[metric.color]}`}>
                            <metric.icon size={16} />
                        </div>
                        <p className="text-sm text-on-surface-variant">{metric.label}</p>
                        <p className="mt-1 text-2xl font-semibold text-on-surface">{metric.value}</p>
                    </article>
                ))}
            </section>

            {/* ── Data Health ── */}
            <section className="rounded-xl border border-outline-variant/20 glass p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-on-surface">
                    <AlertTriangle size={16} className="text-amber-600" />
                    Data Health Monitor
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {healthFlags.map(flag => (
                        <div
                            key={flag.label}
                            className={`rounded-lg border px-4 py-3 ${severityClasses[flag.severity]}`}
                        >
                            <p className="text-sm font-medium">{flag.label}</p>
                            <p className="mt-1 text-xl font-semibold">{flag.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Distribution Charts ── */}
            <section className="grid gap-5 xl:grid-cols-2">
                <DistributionCard title="Colleges by State" data={distributions.collegesByState} color="indigo" />
                <DistributionCard title="Mentors by Stream" data={distributions.mentorsByStream} color="emerald" />
                <DistributionCard title="Users by Stream" data={distributions.usersByStream} color="violet" />
                <DistributionCard title="Bookings by Status" data={distributions.bookingsByStatus} color="amber" />
            </section>
        </div>
    )
}

function DistributionCard({ title, data, color }) {
    const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1])
    const max = entries.length > 0 ? Math.max(...entries.map(e => e[1])) : 1

    const barColor = {
        indigo: "bg-primary/100",
        emerald: "bg-tertiary/100",
        violet: "bg-violet-500",
        amber: "bg-tertiary/100",
    }

    return (
        <article className="rounded-xl border border-outline-variant/20 glass p-5 shadow-sm">
            <h4 className="mb-4 text-sm font-semibold text-on-surface">{title}</h4>
            {entries.length === 0 ? (
                <p className="text-sm text-on-surface-variant/60">No data available.</p>
            ) : (
                <ul className="space-y-2">
                    {entries.slice(0, 8).map(([key, count]) => (
                        <li key={key}>
                            <div className="mb-1 flex items-center justify-between text-xs text-on-surface-variant">
                                <span>{key}</span>
                                <span className="font-medium">{count}</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                                <div
                                    className={`h-full rounded-full ${barColor[color]}`}
                                    style={{ width: `${(count / max) * 100}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </article>
    )
}
