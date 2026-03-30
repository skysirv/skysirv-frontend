export default function MarketSignals() {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_42%,#ffffff_100%)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-14 top-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.10)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
        <div className="absolute right-[-40px] bottom-[-30px] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(148,163,184,0.25)_50%,rgba(255,255,255,0)_100%)]" />
      </div>

      <div className="relative">
        <div className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur-sm">
          Live Signal Feed
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Market Signals
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              A live readout of current airfare conditions, timing pressure, and
              confidence signals shaping the booking environment.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Network Status
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Signals updating in real time
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Volatility Index
              </p>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                Moderate
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Moderate
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Market movement remains active but controlled, with selective fare
              dips appearing across monitored routes.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Booking Window
              </p>
              <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                Active
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              3–5 weeks
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Timing conditions currently favor travelers monitoring near-term
              international pricing behavior.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Market Confidence
              </p>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                High
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              High
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Pricing signals remain consistent enough to support stronger route
              guidance and clearer buy-or-wait decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}