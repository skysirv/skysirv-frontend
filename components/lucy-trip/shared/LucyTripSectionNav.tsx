export default function LucyTripSectionNav() {
  return (
    <div className="sticky top-6 z-30 mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-[0_16px_45px_rgba(15,23,42,0.12)]">
      <button
        type="button"
        className="inline-flex min-h-[34px] items-center gap-2 rounded-full bg-emerald-50 px-3 text-xs font-bold text-emerald-700"
      >
        <span aria-hidden="true">◆</span>
        Trip direction
      </button>

      <button
        type="button"
        className="inline-flex min-h-[34px] items-center gap-2 rounded-full px-3 text-xs font-bold text-orange-700 transition hover:bg-orange-50"
      >
        <span aria-hidden="true">◇</span>
        Travel profile
      </button>

      <button
        type="button"
        className="inline-flex min-h-[34px] items-center gap-2 rounded-full px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
      >
        <span aria-hidden="true">✈</span>
        Flight angle
      </button>
    </div>
  )
}