export default function LucyTripLeftRail() {
  return (
    <aside className="hidden lg:block">
      <div className="fixed left-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
        <button
          type="button"
          className="flex flex-col items-center gap-1 text-slate-700 transition hover:text-slate-950"
          aria-label="Start a fresh Lucy trip session"
          title="Start a fresh Lucy trip session"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
            +
          </span>
          <span className="text-[11px] font-semibold">New chat</span>
        </button>

        <button
          type="button"
          disabled
          className="flex cursor-not-allowed flex-col items-center gap-1 text-slate-400"
          aria-label="Saved trip sessions will be available later"
          title="Saved trip sessions will be available later"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
            ◷
          </span>
          <span className="text-[11px] font-semibold">History</span>
        </button>
      </div>
    </aside>
  )
}