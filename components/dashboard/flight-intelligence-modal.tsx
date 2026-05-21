"use client"

import { useEffect } from "react"
import { getAirportByCode } from "@/lib/airports/major-airports"
import { getAirlineDisplayName } from "@/lib/airlines/airlines"

type ItinerarySegment = {
  origin?: string | null
  destination?: string | null
  marketingCarrier?: string | null
  operatingCarrier?: string | null
  marketingFlightNumber?: string | null
  operatingFlightNumber?: string | null
  departureTime?: string | null
  arrivalTime?: string | null
}

type RecommendedFlight = {
  airline?: string | null
  flightNumber?: string | null
  price?: number | null
  currency?: string | null
  capturedAt?: string | null
  bookingSignal?: string | null
  volatilityIndex?: string | null
  stopCount?: number | null
  itineraryKey?: string | null
  itinerarySegments?: ItinerarySegment[] | null
}

type FlightIntelligenceModalProps = {
  isOpen: boolean
  onClose: () => void
  onSaveFlight?: () => void
  route: {
    id?: string | null
    origin?: string | null
    destination?: string | null
    departureDate?: string | null
    latestPrice?: number | null
    avgPrice?: number | null
    latestAirline?: string | null
    latestCapturedAt?: string | null
    volatilityIndex?: string | null
    recommendedFlights?: RecommendedFlight[] | null
  } | null
  flight: RecommendedFlight | null
}

function formatDepartureDate(value?: string | null) {
  if (!value) return "Pending"

  const raw = value.split("T")[0]
  const parts = raw.split("-")

  if (parts.length !== 3) return value

  const [year, month, day] = parts.map(Number)

  if (!year || !month || !day) return value

  const parsed = new Date(year, month - 1, day)

  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatCapturedTime(value?: string | null) {
  if (!value) return "Pending"

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return "Pending"
  }

  return parsed.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatPrice(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—"
  }

  return `$${Math.round(value).toLocaleString()}`
}

function getMarketStatusDisplay(signal?: string | null) {
  const raw = signal?.trim().toLowerCase()

  if (!raw) return "Pending"

  if (["strong buy", "buy", "cheap", "good deal"].includes(raw)) {
    return "Good Deal"
  }

  if (["favorable window", "fair price", "neutral", "wait"].includes(raw)) {
    return "Fair Price"
  }

  if (["overpriced", "expensive"].includes(raw)) {
    return "Overpriced"
  }

  if (["monitor closely", "watch"].includes(raw)) {
    return "Watch"
  }

  return signal ?? "Pending"
}

function getMarketStatusClasses(status: string) {
  if (status === "Good Deal") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

  if (status === "Fair Price") {
    return "border-slate-200 bg-slate-50 text-slate-700"
  }

  if (status === "Overpriced") {
    return "border-rose-200 bg-rose-50 text-rose-700"
  }

  if (status === "Watch") {
    return "border-amber-200 bg-amber-50 text-amber-700"
  }

  return "border-slate-200 bg-slate-50 text-slate-500"
}

function getSignalDisplay(volatility?: string | null) {
  const numericVolatility = Number(volatility)

  if (!Number.isFinite(numericVolatility)) return "Pending"
  if (numericVolatility < 5) return "Stable"
  if (numericVolatility < 12) return "Moderate"

  return "Volatile"
}

function getAirlineDisplay(value?: string | null) {
  return getAirlineDisplayName(value)
}

function getSegmentCarrier(segment: ItinerarySegment) {
  return (
    segment.marketingCarrier?.trim().toUpperCase() ||
    segment.operatingCarrier?.trim().toUpperCase() ||
    null
  )
}

function getSegmentFlightNumber(segment: ItinerarySegment) {
  const rawFlightNumber =
    segment.marketingFlightNumber?.trim() ||
    segment.operatingFlightNumber?.trim()

  if (!rawFlightNumber) return null

  return rawFlightNumber.replace(/^[A-Z]{2}\s*/i, "").replace(/^0+/, "")
}

function getSegmentFlightLabel(segment: ItinerarySegment) {
  const carrier = getSegmentCarrier(segment)
  const flightNumber = getSegmentFlightNumber(segment)

  if (!carrier || !flightNumber) return "Flight pending"

  return `${carrier} ${flightNumber}`
}

function getSelectedFlightDisplay(flight?: RecommendedFlight | null) {
  if (!flight) return "No flight selected"

  const segments = Array.isArray(flight.itinerarySegments)
    ? flight.itinerarySegments
    : []

  if (segments.length > 1) {
    return `${getAirlineDisplay(flight.airline)} · ${segments.length} segments · ${formatPrice(
      flight.price
    )}`
  }

  if (segments.length === 1) {
    return `${getAirlineDisplay(flight.airline)} · ${getSegmentFlightLabel(
      segments[0]
    )} · ${formatPrice(flight.price)}`
  }

  return `${getAirlineDisplay(flight.airline)}${flight.flightNumber ? ` ${flight.flightNumber}` : ""
    } • ${formatPrice(flight.price)}`
}

function getRouteShapeFromSegments(flight?: RecommendedFlight | null) {
  const segments = Array.isArray(flight?.itinerarySegments)
    ? flight?.itinerarySegments
    : []

  if (!segments.length) return null

  const routePoints = segments.reduce<string[]>((points, segment, index) => {
    const origin = segment.origin?.trim().toUpperCase()
    const destination = segment.destination?.trim().toUpperCase()

    if (index === 0 && origin) {
      points.push(origin)
    }

    if (destination) {
      points.push(destination)
    }

    return points
  }, [])

  return routePoints.length > 1 ? routePoints.join(" → ") : null
}

function getPrimaryFlightLabel(flight?: RecommendedFlight | null) {
  if (!flight) return "Flight pending"

  const segments = Array.isArray(flight.itinerarySegments)
    ? flight.itinerarySegments
    : []

  if (segments.length > 1) {
    return `${segments.length} segments`
  }

  if (segments.length === 1) {
    return getSegmentFlightLabel(segments[0])
  }

  return flight.flightNumber ?? "Flight pending"
}

function getSegmentAirportLabel(code?: string | null) {
  const airportCode = code?.trim().toUpperCase()

  if (!airportCode) return "Airport pending"

  const airport = getAirportByCode(airportCode)

  if (!airport) return airportCode

  const airportName = airport.displayName ?? airport.name

  return `${airportCode} · ${airportName}`
}

function getSegmentTimeLabel(value?: string | null) {
  if (!value) return "Time pending"

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) return "Time pending"

  return parsed.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function getSignalClasses(signal: string) {
  if (signal === "Stable") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

  if (signal === "Moderate") {
    return "border-amber-200 bg-amber-50 text-amber-700"
  }

  if (signal === "Volatile") {
    return "border-rose-200 bg-rose-50 text-rose-700"
  }

  return "border-slate-200 bg-slate-50 text-slate-500"
}

function buildLucyBrief({
  routeLabel,
  marketStatus,
  signalDisplay,
  latestPrice,
  avgPrice,
}: {
  routeLabel: string
  marketStatus: string
  signalDisplay: string
  latestPrice?: number | null
  avgPrice?: number | null
}) {
  const hasLatestPrice = typeof latestPrice === "number" && Number.isFinite(latestPrice)
  const hasAveragePrice = typeof avgPrice === "number" && Number.isFinite(avgPrice)

  if (marketStatus === "Overpriced") {
    return {
      recommendation: "Wait",
      confidence: signalDisplay === "Volatile" ? "Medium" : "Standard",
      title: "This route does not look like the strongest booking moment yet.",
      body: `${routeLabel} is currently showing an overpriced signal${signalDisplay !== "Pending" ? ` with ${signalDisplay.toLowerCase()} movement` : ""
        }. Unless the travel date is fixed, this is a better route to keep watching before committing.`,
    }
  }

  if (marketStatus === "Good Deal") {
    return {
      recommendation: "Review",
      confidence: "High",
      title: "This route is showing a stronger booking opportunity.",
      body: `${routeLabel} is currently presenting a favorable fare signal. Review the selected flight and compare it against the route average before prices move again.`,
    }
  }

  if (hasLatestPrice && hasAveragePrice && latestPrice < avgPrice) {
    return {
      recommendation: "Review",
      confidence: "Medium",
      title: "The selected fare is below the tracked route average.",
      body: `${routeLabel} is currently pricing below its tracked average. That does not guarantee the lowest fare, but it is worth reviewing while the route is active.`,
    }
  }

  return {
    recommendation: "Watch",
    confidence: "Building",
    title: "Skysirv is still building route context here.",
    body: `${routeLabel} is being monitored for fare movement, volatility, and timing pressure. More captured pricing history will make this intelligence stronger over time.`,
  }
}

export default function FlightIntelligenceModal({
  isOpen,
  onClose,
  onSaveFlight,
  route,
  flight,
}: FlightIntelligenceModalProps) {
  const selectedFlight = flight ?? null

  const originAirport = getAirportByCode(route?.origin)
  const destinationAirport = getAirportByCode(route?.destination)

  const formatAirportDisplay = (
    airport: ReturnType<typeof getAirportByCode>
  ) => {
    if (!airport) return null

    const locationLabel =
      airport.country === "United States" && airport.region
        ? `${airport.city}, ${airport.region}`
        : `${airport.city}, ${airport.country}`

    const airportLabel = airport.displayName ?? airport.name

    return `${locationLabel} - ${airportLabel} (${airport.code})`
  }

  const routeLabel = `${route?.origin ?? "—"} → ${route?.destination ?? "—"}`

  const routeLocationDisplay =
    originAirport && destinationAirport
      ? `${formatAirportDisplay(originAirport)} → ${formatAirportDisplay(destinationAirport)}`
      : null

  const selectedFlightSummary = getSelectedFlightDisplay(selectedFlight)

  const marketStatusDisplay = getMarketStatusDisplay(
    selectedFlight?.bookingSignal
  )

  const signalDisplay = getSignalDisplay(
    selectedFlight?.volatilityIndex ?? route?.volatilityIndex
  )

  const lucyBrief = buildLucyBrief({
    routeLabel,
    marketStatus: marketStatusDisplay,
    signalDisplay,
    latestPrice: selectedFlight?.price ?? route?.latestPrice,
    avgPrice: route?.avgPrice,
  })

  const recommendedFlights = Array.isArray(route?.recommendedFlights)
    ? route.recommendedFlights
    : []

  const selectedSegments = Array.isArray(selectedFlight?.itinerarySegments)
    ? selectedFlight.itinerarySegments
    : []

  const selectedRouteShape = getRouteShapeFromSegments(selectedFlight)

  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen || !route) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-[101] flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.22)]">
        <div className="border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-700">
                Flight Intelligence
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {routeLabel}
              </h2>

              {routeLocationDisplay ? (
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  {routeLocationDisplay}
                </p>
              ) : null}

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                <span>Departure · {formatDepartureDate(route.departureDate)}</span>
                <span className="hidden text-slate-300 sm:inline">•</span>
                <span>Selected · {selectedFlightSummary}</span>
              </div>

              {selectedFlight && onSaveFlight ? (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={onSaveFlight}
                    className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    Save flight
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close flight intelligence"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>
        </div>

        <div className="skysirv-modal-scroll flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-wrap gap-2">
            <CompactPill
              label="Market"
              value={marketStatusDisplay}
              className={getMarketStatusClasses(marketStatusDisplay)}
            />

            <CompactPill
              label="Signal"
              value={signalDisplay}
              className={getSignalClasses(signalDisplay)}
            />

            <CompactPill
              label="Selected fare"
              value={formatPrice(selectedFlight?.price)}
            />

            <CompactPill label="Latest fare" value={formatPrice(route.latestPrice)} />

            <CompactPill label="Route avg" value={formatPrice(route.avgPrice)} />

            <CompactPill
              label="Captured"
              value={formatCapturedTime(
                selectedFlight?.capturedAt ?? route.latestCapturedAt
              )}
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Lucy Route Brief
                  </p>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                    {lucyBrief.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    {lucyBrief.recommendation}
                  </span>

                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {lucyBrief.confidence}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {lucyBrief.body}
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Recommended next move
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {lucyBrief.recommendation === "Wait"
                    ? "Keep watching before booking."
                    : lucyBrief.recommendation === "Review"
                      ? "Review this fare before it moves again."
                      : "Let Skysirv collect more route history."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Route Snapshot
              </p>

              <div className="mt-3 space-y-2">
                <SnapshotRow label="Route" value={routeLabel} />
                <SnapshotRow
                  label="Airline"
                  value={getAirlineDisplay(selectedFlight?.airline ?? route.latestAirline)}
                />
                <SnapshotRow
                  label="Flight"
                  value={getPrimaryFlightLabel(selectedFlight)}
                />
                {selectedRouteShape ? (
                  <SnapshotRow label="Itinerary" value={selectedRouteShape} />
                ) : null}
                <SnapshotRow
                  label="Tracking"
                  value={route.latestPrice ? "Live data" : "Building history"}
                />
                <SnapshotRow label="Departure" value={formatDepartureDate(route.departureDate)} />
              </div>
            </div>
          </div>

          {selectedSegments.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Selected Itinerary
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Exact provider-returned segment details for the selected fare.
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {selectedSegments.length === 1
                    ? "Direct"
                    : `${selectedSegments.length} segments`}
                </span>
              </div>

              <div className="mt-3 grid gap-2">
                {selectedSegments.map((segment, index) => (
                  <div
                    key={`${segment.origin ?? "origin"}-${segment.destination ?? "destination"}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-950">
                          Segment {index + 1} · {getSegmentFlightLabel(segment)}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {getSegmentAirportLabel(segment.origin)} →{" "}
                          {getSegmentAirportLabel(segment.destination)}
                        </p>
                      </div>

                      <div className="shrink-0 text-right text-xs text-slate-500">
                        <p>Depart · {getSegmentTimeLabel(segment.departureTime)}</p>
                        <p className="mt-0.5">
                          Arrive · {getSegmentTimeLabel(segment.arrivalTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Recommended Flights
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Comparable route options currently available from the latest
                  monitored response.
                </p>
              </div>

              <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {recommendedFlights.length} shown
              </span>
            </div>

            <div className="mt-3 grid gap-2">
              {recommendedFlights.length > 0 ? (
                recommendedFlights.slice(0, 4).map((recommendedFlight, index) => (
                  <div
                    key={`${recommendedFlight.airline ?? "airline"}-${recommendedFlight.flightNumber ?? "flight"
                      }-${index}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-950">
                          {getAirlineDisplay(recommendedFlight.airline)}
                        </p>

                        <span className="text-slate-300">•</span>

                        <p className="text-sm text-slate-500">
                          {getPrimaryFlightLabel(recommendedFlight)}
                        </p>
                      </div>

                      {getRouteShapeFromSegments(recommendedFlight) ? (
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {getRouteShapeFromSegments(recommendedFlight)}
                        </p>
                      ) : null}

                      <p className="mt-1 text-xs text-slate-500">
                        Captured · {formatCapturedTime(recommendedFlight.capturedAt)}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-slate-950">
                      {formatPrice(recommendedFlight.price)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  No recommended flights available yet for this route.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .skysirv-modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(15, 23, 42, 0.24) transparent;
        }

        .skysirv-modal-scroll::-webkit-scrollbar {
          width: 10px;
        }

        .skysirv-modal-scroll::-webkit-scrollbar-track {
          background: transparent;
          margin: 12px 0 20px 0;
        }

        .skysirv-modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(15, 23, 42, 0.18);
          border: 3px solid transparent;
          border-radius: 999px;
          background-clip: padding-box;
        }

        .skysirv-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(15, 23, 42, 0.3);
          border: 3px solid transparent;
          border-radius: 999px;
          background-clip: padding-box;
        }
      `}</style>
    </div>
  )
}

function CompactPill({
  label,
  value,
  className = "border-slate-200 bg-slate-50 text-slate-700",
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">
        {label}
      </span>

      <span className="text-xs font-semibold">{value}</span>
    </div>
  )
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="shrink-0 text-right text-sm font-semibold text-slate-950">
        {value}
      </p>
    </div>
  )
}