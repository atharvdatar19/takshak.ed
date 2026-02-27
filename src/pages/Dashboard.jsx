import { Building2, CalendarDays, IndianRupee, ShieldCheck, TrendingUp } from "lucide-react"
import { useMemo } from "react"
import DataState from "../components/DataState"
import PageHeader from "../components/PageHeader"
import { useAsyncData } from "../hooks/useAsyncData"
import { APP_CONFIG } from "../lib/config"
import { getDaysLeft, isWithinRange } from "../lib/date"
import { getColleges, getExamsTimeline } from "../services/api"

function StatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 inline-flex rounded-lg bg-indigo-50 p-2 text-indigo-700">
        <Icon size={18} />
      </div>
      <h3 className="text-sm text-slate-500">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </article>
  )
}

export default function Dashboard() {
  const collegesData = useAsyncData(getColleges, [])
  const examsData = useAsyncData(getExamsTimeline, [])

  const loading = collegesData.loading || examsData.loading
  const error = collegesData.error || examsData.error

  const colleges = collegesData.data
  const exams = examsData.data

  const closingSoon = useMemo(
    () => colleges.filter(c => isWithinRange(c.application_end, 7)),
    [colleges],
  )
  const upcomingExams = useMemo(() => exams.filter(e => isWithinRange(e.exam_date, 14)), [exams])

  const projectedMonthlyRevenue =
    APP_CONFIG.pricing.pro * Math.max(1, Math.floor(colleges.length / 10))

  return (
    <div>
      <PageHeader
        title="Investor-Ready Operations Dashboard"
        description="Scalable admissions operations with monetization and risk visibility."
        cta={
          <div className="rounded-xl bg-slate-900 px-4 py-3 text-white">
            <p className="text-xs text-slate-300">MRR Projection</p>
            <p className="text-lg font-semibold">₹{projectedMonthlyRevenue.toLocaleString("en-IN")}</p>
          </div>
        }
      />

      <DataState loading={loading} error={error} empty={!colleges.length && !exams.length}>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={Building2}
            title="Active Opportunities"
            value={colleges.length}
            subtitle="Live institutions in admissions funnel"
          />
          <StatCard
            icon={CalendarDays}
            title="Exams in 14 Days"
            value={upcomingExams.length}
            subtitle="Time-sensitive preparation queue"
          />
          <StatCard
            icon={TrendingUp}
            title="Deadline Risk"
            value={closingSoon.length}
            subtitle="Applications closing within 7 days"
          />
          <StatCard
            icon={IndianRupee}
            title="Pro Plan Price"
            value={`₹${APP_CONFIG.pricing.pro}`}
            subtitle="Monetization baseline for B2C upsell"
          />
          <StatCard
            icon={ShieldCheck}
            title="Admin Coverage"
            value="100%"
            subtitle="Data visible in Admin Control panel"
          />
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-2">
          <InsightList
            title="Critical Application Deadlines"
            items={closingSoon.slice(0, 6).map(item => ({
              id: item.id,
              title: item.name,
              daysLeft: getDaysLeft(item.application_end),
            }))}
            tone="rose"
          />

          <InsightList
            title="Upcoming Exam Events"
            items={upcomingExams.slice(0, 6).map(item => ({
              id: item.id,
              title: item.exam_name,
              daysLeft: getDaysLeft(item.exam_date),
            }))}
            tone="indigo"
          />
        </section>
      </DataState>
    </div>
  )
}

function InsightList({ title, items, tone }) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No urgent items.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map(item => (
            <li key={item.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-sm font-medium text-slate-800">{item.title}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  tone === "rose" ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {item.daysLeft}d left
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
