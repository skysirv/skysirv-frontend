export default function OpportunityBanner() {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.26)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_36px_90px_rgba(2,6,23,0.34)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14)_0%,rgba(15,23,42,0)_72%)] blur-3xl" />
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16)_0%,rgba(15,23,42,0)_72%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(56,189,248,0.20)_50%,rgba(255,255,255,0)_100%)]" />
      </div>

      <div className="relative">
        <div className="mb-4 inline-flex items-center rounded-full border border-sky-400/20 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300 backdrop-blur-sm">
          Opportunity Layer
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              Opportunity signals will appear as real route data builds
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              Skysirv surfaces stronger booking opportunities after routes are
              added and enough live monitoring data begins to accumulate.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-3">
            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur-sm">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Signal
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-200">
                —
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur-sm">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Strength
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-200">
                —
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur-sm">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Status
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                Waiting
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Intelligence Readout
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Once live monitoring is active, this area will highlight
                meaningful route opportunities based on pricing behavior and
                signal quality.
              </p>
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-400">
                <span className="truncate">Opportunity Score</span>
                <span className="shrink-0 font-semibold text-slate-200">—</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-0 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}