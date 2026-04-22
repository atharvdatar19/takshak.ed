export default function DataState({ loading, error, empty, children }) {
  if (loading) {
    return <div className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">Loading...</div>
  }

  if (error) {
    return <div className="rounded-xl bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
  }

  if (empty) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No records found.
      </div>
    )
  }

  return children
}
