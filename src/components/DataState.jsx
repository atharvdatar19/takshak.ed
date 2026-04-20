export default function DataState({ loading, error, empty, children }) {
  if (loading) {
    return <div className="rounded-xl glass p-6 text-on-surface-variant shadow-sm">Loading...</div>
  }

  if (error) {
    return <div className="rounded-xl bg-error/10 p-6 text-error shadow-sm">{error}</div>
  }

  if (empty) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant/20 glass p-8 text-center text-on-surface-variant">
        No records found.
      </div>
    )
  }

  return children
}
