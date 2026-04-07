"use client"

interface WatchlistCardProps {
  origin?: string
  destination?: string
  departureDate?: string

  // NEW — future intelligence props
  latestPrice?: number | null
  avgPrice?: number | null
  priceDelta?: number | null

  onRemove?: () => void
}

export default function WatchlistCard({
  origin = "—",
  destination = "—",
  departureDate = "Pending",

  latestPrice = null,
  avgPrice = null,
  priceDelta = null,

  onRemove,
}: WatchlistCardProps) {

  function handleRemoveRoute() {
    onRemove?.()
  }

  // ----------------------------
  // Derived display values
  // ----------------------------

  const hasPrice = typeof latestPrice === "number"

  const currentFareDisplay = hasPrice
    ? `$${latestPrice.toLocaleString()}`
    : "—"

  const priceHistoryDisplay =
    typeof avgPrice === "number"
      ? `Avg $${avgPrice.toLocaleString()}`
      : "Pending"

  const signalDisplay =
    typeof priceDelta === "number"
      ? priceDelta < 0
        ? "Buy"
        : priceDelta > 0
          ? "Avoid"
          : "Wait"
      : "Pending"

  // ----------------------------

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,rgba(255,255,255,0)_72%)] blur-2xl" />
        <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(255,255,255,0)_72%)] blur-2xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 ring-1 ring-sky-200">
                {hasPrice ? "Live Data" : "Waiting for data"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Monitoring
              </span>
            </div>

            <p className="text-xl font-semibold tracking-tight text-slate-900">
              {origin} → {destination}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Departure • {departureDate}
            </p>

            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
              Monitoring begins after route tracking starts
            </p>
          </div>

          <button
            onClick={handleRemoveRoute}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Monitoring Status */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Current Fare
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {currentFareDisplay}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Price History
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {priceHistoryDisplay}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Signal Status
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {signalDisplay}
            </p>
          </div>
        </div>

        {/* Intelligence Status */}
        <div className="mt-6">
          <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,1)_100%)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Intelligence Status
            </p>

            <p className="mt-3 min-h-[108px] text-sm leading-6 text-slate-600">
              {hasPrice
                ? "Real pricing data is now being tracked. Price behavior and signal intelligence will continue to improve as more data is collected."
                : "This route is saved and ready for monitoring. Pricing history, route behavior, and Pro intelligence signals will appear here automatically once enough real data has been collected."}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full bg-sky-500/60 transition-all duration-500 ${hasPrice ? "w-2/3" : "w-1/4"
                  }`}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Data Readiness</span>
              <span className="font-semibold text-slate-700">
                {hasPrice ? "Active" : "Collecting"}
              </span>
            </div>
          </div>
        </div>

        {/* Monitoring Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Tracking
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Active</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              History
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {hasPrice ? "Active" : "Building"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Signals
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {hasPrice ? "Emerging" : "Pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}