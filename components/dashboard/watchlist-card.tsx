"use client"

interface WatchlistCardProps {
  origin?: string
  destination?: string
  departureDate?: string

  // NEW — future intelligence props
  latestPrice?: number | null
  avgPrice?: number | null
  priceDelta?: number | null
  bookingSignal?: string | null
  latestAirline?: string | null
  latestFlightNumber?: string | null
  latestCapturedAt?: string | null
  volatilityIndex?: string | null

  onRemove?: () => void
}

export default function WatchlistCard({
  origin = "—",
  destination = "—",
  departureDate = "Pending",

  latestPrice = null,
  avgPrice = null,
  priceDelta = null,
  bookingSignal = null,
  latestAirline = null,
  latestFlightNumber = null,
  latestCapturedAt = null,
  volatilityIndex = null,

  onRemove,
}: WatchlistCardProps) {

  function handleRemoveRoute() {
    onRemove?.()
  }

  function getAirlineDisplayName(code?: string | null) {
    const normalizedCode = code?.trim().toUpperCase()

    if (!normalizedCode) {
      return "Airline pending"
    }

    const airlineNames: Record<string, string> = {
      AA: "American Airlines",
      AS: "Alaska Airlines",
      UA: "United Airlines",
      DL: "Delta Air Lines",
      WN: "Southwest Airlines",
      B6: "JetBlue",
      NK: "Spirit Airlines",
      F9: "Frontier Airlines",
    }

    return airlineNames[normalizedCode] ?? normalizedCode
  }

  // ----------------------------
  // Derived display values
  // ----------------------------

  const hasPrice = typeof latestPrice === "number"

  const departureDateDisplay = (() => {
    if (!departureDate) {
      return "Pending"
    }

    const parsed = new Date(departureDate)

    if (Number.isNaN(parsed.getTime())) {
      return departureDate
    }

    return parsed.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  })()

  const currentFareDisplay = hasPrice
    ? `$${latestPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
    : "—"

  const priceHistoryDisplay =
    typeof avgPrice === "number"
      ? `$${avgPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
      : "Pending"

  const normalizedBookingSignal =
    typeof bookingSignal === "string" ? bookingSignal.trim().toLowerCase() : null

  const signalDisplay =
    normalizedBookingSignal === "buy" || normalizedBookingSignal === "cheap"
      ? "Good Deal"
      : normalizedBookingSignal === "wait" || normalizedBookingSignal === "neutral"
        ? "Hold"
        : normalizedBookingSignal === "avoid" || normalizedBookingSignal === "expensive"
          ? "Overpriced"
          : "Pending"

  const signalDisplayClass =
    signalDisplay === "Good Deal"
      ? "text-emerald-600"
      : signalDisplay === "Hold"
        ? "text-violet-600"
        : signalDisplay === "Overpriced"
          ? "text-rose-600"
          : "text-slate-900"

  const airlineDisplay = getAirlineDisplayName(latestAirline)

  const flightNumberDisplay = latestFlightNumber?.trim()
    ? latestFlightNumber
    : "Flight pending"

  const capturedTimeDisplay = latestCapturedAt
    ? (() => {
      const parsed = new Date(latestCapturedAt)

      if (Number.isNaN(parsed.getTime())) {
        return "Capture time pending"
      }

      return parsed.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
      })
    })()
    : "Capture time pending"

  const volatilityDisplay = (() => {
    if (!volatilityIndex?.trim()) {
      return "Pending"
    }

    const numericVolatility = Number(volatilityIndex)

    if (!Number.isFinite(numericVolatility)) {
      return "Pending"
    }

    if (numericVolatility < 5) {
      return "Stable"
    }

    if (numericVolatility < 12) {
      return "Moderate"
    }

    return "Volatile"
  })()

  // ----------------------------

  return (
    <div className="group relative min-h-[640px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
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
              Departure • {departureDateDisplay}
            </p>

            <p className="text-xs font-medium text-slate-700">
              {airlineDisplay} • {flightNumberDisplay}
            </p>

            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
              Captured • {capturedTimeDisplay}
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
              Observed Fare
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {currentFareDisplay}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Route Average
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {priceHistoryDisplay}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Market Status
            </p>
            <p className={`mt-0.5 text-base font-semibold text-center leading-tight ${signalDisplayClass}`}>
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
                ? "Live fare snapshots are now being captured. This specific flight reflects current market conditions, and Skysirv™ will refine timing, volatility, and pricing intelligence as more data is collected."
                : "This route is saved and ready for monitoring. Skysirv™ will begin capturing real fare snapshots, and intelligence layers will activate as pricing history builds."}
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
              {volatilityDisplay}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}