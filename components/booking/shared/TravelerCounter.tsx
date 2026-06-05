export default function TravelerCounter({
  title,
  subtitle,
  value,
  min,
  onMinus,
  onPlus,
}: {
  title: string
  subtitle?: string
  value: number
  min: number
  onMinus: () => void
  onPlus: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>

        {subtitle && (
          <p className="mt-0.5 text-xs font-medium text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMinus}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label={`Decrease ${title}`}
        >
          −
        </button>

        <span className="w-6 text-center text-sm font-bold text-slate-900">
          {value}
        </span>

        <button
          type="button"
          onClick={onPlus}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
          aria-label={`Increase ${title}`}
        >
          +
        </button>
      </div>
    </div>
  )
}