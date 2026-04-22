export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="animate-pulse space-y-3 rounded-xl bg-white p-5 shadow-sm">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-4 rounded bg-slate-200" />
      ))}
    </div>
  )
}
