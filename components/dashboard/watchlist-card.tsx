"use client"

interface WatchlistCardProps {
  origin?: string
  destination?: string
  departureDate?: string
}

export default function WatchlistCard({
  origin = "BOS",
  destination = "LHR",
  departureDate = "Oct 14",
}: WatchlistCardProps) {
  const score = 82

  const circumference = 2 * Math.PI * 45
  const progress = circumference - (score / 100) * circumference

  let strokeColor = "#22c55e"
  let signal = "BUY"
  let signalBg = "bg-emerald-500/10"
  let signalText = "text-emerald-700"
  let signalRing = "ring-emerald-200"
  let signalGlow = "shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_12px_30px_rgba(16,185,129,0.12)]"
  let insight = "Excellent booking window detected with pricing well below the 30-day average."
  let insightText = "text-emerald-700"
  let deltaText = "text-emerald-600"

  if (score <= 40) {
    strokeColor = "#ef4444"
    signal = "AVOID"
    signalBg = "bg-red-500/10"
    signalText = "text-red-700"
    signalRing = "ring-red-200"
    signalGlow = "shadow-[0_0_0_1px_rgba(239,68,68,0.10),0_12px_30px_rgba(239,68,68,0.12)]"
    insight = "Fare pressure remains elevated and current pricing is not yet in an attractive range."
    insightText = "text-red-700"
    deltaText = "text-red-600"
  } else if (score <= 70) {
    strokeColor = "#f59e0b"
    signal = "WAIT"
    signalBg = "bg-amber-500/10"
    signalText = "text-amber-700"
    signalRing = "ring-amber-200"
    signalGlow = "shadow-[0_0_0_1px_rgba(245,158,11,0.10),0_12px_30px_rgba(245,158,11,0.12)]"
    insight = "Market conditions are mixed. Watching for a stronger downward move before booking."
    insightText = "text-amber-700"
    deltaText = "text-amber-600"
  }

  function handleRemoveRoute() {
    console.log("Remove route clicked")
  }

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
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase ${signalBg} ${signalText} ring-1 ${signalRing} ${signalGlow}`}
              >
                {signal} SIGNAL
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
              Last Scan • 2 minutes ago
            </p>
          </div>

          <button
            onClick={handleRemoveRoute}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Price Section */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Current
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">$412</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              30-Day Avg
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">$545</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Delta
            </p>
            <p className={`mt-1 text-base font-semibold ${deltaText}`}>↓ $133</p>
          </div>
        </div>

        {/* Score + Insight */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[140px_minmax(0,1fr)] lg:items-center">
          <div className="flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="rotate-[-90deg]"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke={strokeColor}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progress}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute text-center">
                <div className="text-2xl font-bold text-slate-900">{score}</div>

                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  Skyscore™
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,1)_100%)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Intelligence Readout
            </p>

            <p className={`mt-3 text-sm leading-6 ${insightText}`}>{insight}</p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${score}%`,
                  backgroundColor: strokeColor,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Signal Strength</span>
              <span className="font-semibold text-slate-700">{score}%</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Trend
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Falling</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Volatility
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Moderate</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Confidence
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">High</p>
          </div>
        </div>
      </div>
    </div>
  )
}