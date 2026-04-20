export default function PageHeader({ title, description, cta }) {
  return (
    <header className="mb-6 rounded-2xl border border-outline-variant/20 glass p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-on-surface">{title}</h2>
          {description && <p className="mt-1 text-sm text-on-surface-variant">{description}</p>}
        </div>
        {cta}
      </div>
    </header>
  )
}
