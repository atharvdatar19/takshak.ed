import { motion } from "framer-motion"

export default function WeeklyTrendChart({ title, data = [], color = "indigo" }) {
  const barClass = color === "emerald" ? "bg-emerald-500" : "bg-indigo-500"

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="mb-4 text-sm font-semibold text-slate-800">{title}</h4>
      <div className="flex h-28 items-end gap-2">
        {data.map(point => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${point.percent}%` }}
              className={`w-full rounded-t ${barClass}`}
            />
            <span className="text-[10px] text-slate-500">{point.label}</span>
          </div>
        ))}
      </div>
    </article>
  )
}
