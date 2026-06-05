export default function BookingPreferencePill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-[34px] items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      {label}
    </button>
  )
}