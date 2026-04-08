export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="animate-pulse space-y-3 rounded-xl glass p-5 shadow-sm">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-4 rounded bg-surface-container-high" />
      ))}
    </div>
  )
}
