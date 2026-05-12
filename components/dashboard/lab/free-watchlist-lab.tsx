"use client"

import { useState } from "react"
import { getAirportByCode } from "@/lib/airports/major-airports"

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

type WatchlistRoute = {
  id: string
  route?: string | null
  route_hash?: string | null
  origin?: string | null
  destination?: string | null
  departure_date?: string | null
  last_checked_at?: string | null
  created_at?: string | null
  latest_price?: number | null
  avg_price?: number | null
  booking_signal?: string | null
  latest_airline?: string | null
  latest_flight_number?: string | null
  latest_captured_at?: string | null
  latest_stop_count?: number | null
  latest_itinerary_key?: string | null
  latest_itinerary_segments?: ItinerarySegment[] | null
  volatility_index?: string | null
  recommended_flights?: RecommendedFlight[] | null
}

type FreeWatchlistLabProps = {
  loading?: boolean
  watchlist: WatchlistRoute[]
  remainingRoutes: number
  remainingSavedFlights?: number
  onRemoveRoute?: (routeId: string) => void
  onSaveFlight?: (
    route: WatchlistRoute,
    flight?: RecommendedFlight | null
  ) => Promise<boolean | void> | boolean | void
}

type BasicContextSelection = {
  route: WatchlistRoute
  flight?: RecommendedFlight | null
}

export default function FreeWatchlistLab({
  loading = false,
  watchlist,
  remainingRoutes,
  remainingSavedFlights = 0,
  onRemoveRoute,
  onSaveFlight,
}: FreeWatchlistLabProps) {
  const [openRoute, setOpenRoute] = useState<string | null>(null)
  const [basicContextSelection, setBasicContextSelection] =
    useState<BasicContextSelection | null>(null)

  function openBasicContext(
    route: WatchlistRoute,
    flight?: RecommendedFlight | null
  ) {
    setBasicContextSelection({
      route,
      flight: flight ?? null,
    })
  }

  const visibleRoutes = watchlist.slice(0, 3)
  const usedRoutes = Math.min(visibleRoutes.length, 3)

  return (
    <section className="pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Route Watchlist
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Track up to 3 routes with basic fare context and simple route
              monitoring.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-sm font-semibold text-slate-950">
              {usedRoutes} / 3
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Routes
            </span>
          </div>
        </div>

        {loading ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-6">
            <p className="text-sm leading-6 text-slate-600">
              Loading your Free route watchlist…
            </p>
          </div>
        ) : visibleRoutes.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-6">
            <p className="text-sm font-semibold text-slate-950">
              No routes tracked yet.
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Add your first route above to start basic fare tracking on the
              Free plan.
            </p>
          </div>
        ) : (
          <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.45)_rgba(241,245,249,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400">
            {visibleRoutes.map((route) => {
              const routeKey = getRouteKey(route)
              const routeLabel = getRouteLabel(route)
              const isOpen = openRoute === routeKey

              const recommendedFlights = normalizeRecommendedFlights(route)

              const chevronClasses = isOpen
                ? "rotate-180 border-cyan-200 bg-cyan-50 text-cyan-700"
                : "hover:border-slate-300 hover:text-slate-700"

              return (
                <article
                  key={routeKey}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-cyan-200 hover:bg-slate-50/60"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenRoute((current) =>
                        current === routeKey ? null : routeKey
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="shrink-0 text-sm font-semibold tracking-tight text-slate-950">
                          {routeLabel}
                        </span>

                        <span className="hidden text-slate-300 sm:inline">
                          •
                        </span>

                        <span className="min-w-0 truncate text-sm text-slate-600">
                          {getAirportLabel(route)}
                        </span>

                        <span className="hidden text-slate-300 md:inline">
                          •
                        </span>

                        <span className="shrink-0 text-sm text-slate-500">
                          {getDepartureLabel(route.departure_date)}
                        </span>

                        <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                          {getStatusLabel(route)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition ${chevronClasses}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-slate-200 px-4 pb-4 pt-3">
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Available fares
                          </p>

                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {recommendedFlights.length > 0 ? (
                              recommendedFlights.map((flight) => (
                                <button
                                  key={`${routeKey}-${flight.airline}-${flight.price}`}
                                  type="button"
                                  onClick={() => openBasicContext(route, flight)}
                                  className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-cyan-200 hover:bg-white"
                                >
                                  <span className="min-w-0">
                                    <span className="block truncate text-sm font-medium text-slate-700">
                                      {getFlightLabel(flight)}
                                    </span>

                                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                                      {getItineraryRouteLabel(flight)}
                                    </span>
                                  </span>

                                  <span className="shrink-0 text-sm font-semibold text-slate-950">
                                    {formatPrice(flight.price)}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                <p className="text-sm text-slate-600">
                                  Fare options are still building for this route.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex min-w-[190px] flex-col items-end justify-between gap-3">
                          <div className="flex max-w-[260px] flex-wrap justify-end gap-2">
                            <MetricPill label="Latest" value={formatPrice(route.latest_price)} />
                            <MetricPill label="Route avg" value={formatAveragePrice(route.avg_price)} />
                            <MetricPill label="Tracking" value="Active" />
                            <MetricPill label="Signal" value={getBasicSignal(route.booking_signal)} />
                          </div>

                          <div className="flex flex-wrap items-end justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openBasicContext(route, recommendedFlights[0] ?? null)}
                              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                            >
                              Basic context
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (onRemoveRoute) {
                                  onRemoveRoute(route.id)
                                }
                              }}
                              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
          <p className="text-sm leading-6 text-slate-600">
            Free plans include basic monitoring for up to 3 routes. You have{" "}
            <span className="font-semibold text-slate-950">
              {remainingRoutes}
            </span>{" "}
            route slot{remainingRoutes === 1 ? "" : "s"} remaining.
          </p>
        </div>
      </div>

      {basicContextSelection ? (
        <FreeBasicContextModal
          selection={basicContextSelection}
          remainingSavedFlights={remainingSavedFlights}
          onSaveFlight={onSaveFlight}
          onClose={() => setBasicContextSelection(null)}
        />
      ) : null}
    </section>
  )
}

function FreeBasicContextModal({
  selection,
  remainingSavedFlights,
  onSaveFlight,
  onClose,
}: {
  selection: BasicContextSelection
  remainingSavedFlights: number
  onSaveFlight?: (
    route: WatchlistRoute,
    flight?: RecommendedFlight | null
  ) => Promise<boolean | void> | boolean | void
  onClose: () => void
}) {
  const [saving, setSaving] = useState(false)

  const route = selection.route
  const flight = selection.flight ?? null

  const routeLabel = getRouteLabel(route)

  const flightLabel = flight
    ? getFlightLabel(flight)
    : route.latest_flight_number
      ? `${getAirlineDisplay(route.latest_airline)} · ${route.latest_flight_number}`
      : "Flight details building"

  const itineraryLabel = flight
    ? getItineraryRouteLabel(flight)
    : getAirportLabel(route)

  const priceLabel = formatPrice(flight?.price ?? route.latest_price)

  const signalLabel = getBasicSignal(
    flight?.bookingSignal ?? route.booking_signal
  )

  const saveDisabled = saving || !onSaveFlight || remainingSavedFlights <= 0

  async function handleSaveFlight() {
    if (!onSaveFlight || saveDisabled) return

    setSaving(true)

    try {
      const result = await onSaveFlight(route, flight)

      if (result !== false) {
        onClose()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Basic fare context
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              {routeLabel}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Free plan view with simple fare visibility and route monitoring.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close basic context"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          >
            ×
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-sm font-semibold text-slate-950">
            {flightLabel}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {itineraryLabel}
          </p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <BasicContextRow label="Visible fare" value={priceLabel} />
          <BasicContextRow
            label="Route average"
            value={formatAveragePrice(route.avg_price)}
          />
          <BasicContextRow label="Signal" value={signalLabel} />
          <BasicContextRow label="Tracking" value="Active" />
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3">
          <p className="text-sm leading-6 text-slate-700">
            Upgrade plans unlock deeper timing guidance, confidence scoring,
            volatility context, and richer route intelligence.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            Not now
          </button>

          <button
            type="button"
            onClick={handleSaveFlight}
            disabled={saveDisabled}
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500"
          >
            {saving
              ? "Saving…"
              : remainingSavedFlights <= 0
                ? "Saved slots full"
                : "Save flight"}
          </button>
        </div>
      </div>
    </div>
  )
}

function BasicContextRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  )
}

function getRouteKey(route: WatchlistRoute) {
  return route.id ?? route.route_hash ?? route.route ?? `${route.origin}-${route.destination}`
}

function getRouteLabel(route: WatchlistRoute) {
  if (route.route) return route.route

  const origin = route.origin?.trim() || "—"
  const destination = route.destination?.trim() || "—"

  return `${origin} → ${destination}`
}

function getAirportLabel(route: WatchlistRoute) {
  return `${getAirportDisplay(route.origin)} → ${getAirportDisplay(
    route.destination
  )}`
}

function getAirportDisplay(code?: string | null) {
  const airportCode = code?.trim().toUpperCase()

  if (!airportCode) return "Airport pending"

  const airport = getAirportByCode(airportCode)

  if (!airport) return airportCode

  const airportName = airport.displayName ?? airport.name

  return `${airportCode} · ${airportName}`
}

function getDepartureLabel(date?: string | Date | null) {
  return formatDepartureDateOnly(date)
}

function formatDepartureDateOnly(
  date?: string | Date | null,
  fallback = "Departure · Watching"
) {
  if (!date) return fallback

  const raw =
    typeof date === "string"
      ? date.split("T")[0]
      : date.toISOString().split("T")[0]

  const parts = raw.split("-")

  if (parts.length !== 3) {
    return `Departure · ${raw}`
  }

  const [year, month, day] = parts.map(Number)

  if (!year || !month || !day) {
    return `Departure · ${raw}`
  }

  const parsedDate = new Date(year, month - 1, day)

  if (Number.isNaN(parsedDate.getTime())) {
    return `Departure · ${raw}`
  }

  return `Departure · ${parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`
}

function getStatusLabel(route: WatchlistRoute) {
  if (!route.latest_price) return "Building"
  return "Tracking"
}

function getBasicSignal(signal?: string | null) {
  const normalized = signal?.trim().toLowerCase().replace(/_/g, " ") ?? ""

  if (normalized.includes("fair")) return "Fair Price"
  if (normalized.includes("good")) return "Good Watch"
  if (normalized.includes("hold")) return "Watching"
  if (normalized.includes("over") || normalized.includes("expensive")) return "High Fare"

  return "Basic Watch"
}

function normalizeRecommendedFlights(route: WatchlistRoute): RecommendedFlight[] {
  const flights = Array.isArray(route.recommended_flights)
    ? route.recommended_flights
    : []

  if (flights.length > 0) {
    return flights.slice(0, 2)
  }

  if (route.latest_price != null || route.latest_airline || route.latest_flight_number) {
    return [
      {
        airline: route.latest_airline,
        flightNumber: route.latest_flight_number,
        price: route.latest_price,
        currency: "USD",
        capturedAt: route.latest_captured_at,
        stopCount: route.latest_stop_count,
        itineraryKey: route.latest_itinerary_key,
        itinerarySegments: route.latest_itinerary_segments,
      },
    ]
  }

  return []
}

const airlineNamesByCode: Record<string, string> = {
  AA: "American Airlines",
  AC: "Air Canada",
  AF: "Air France",
  AM: "Aeromexico",
  AV: "Avianca",
  BA: "British Airways",
  B6: "JetBlue",
  BR: "EVA Air",
  CM: "Copa Airlines",
  DL: "Delta Air Lines",
  EK: "Emirates",
  IB: "Iberia",
  KL: "KLM",
  LA: "LATAM Airlines",
  LH: "Lufthansa",
  QR: "Qatar Airways",
  TK: "Turkish Airlines",
  UA: "United Airlines",
  VS: "Virgin Atlantic",
}

function getAirlineDisplay(value?: string | null) {
  const raw = value?.trim()

  if (!raw) return "Available fare"

  const normalizedCode = raw.toUpperCase()

  return airlineNamesByCode[normalizedCode] ?? raw
}

function normalizeFlightNumberForCarrier(
  rawFlightNumber?: string | null,
  carrier?: string | null
) {
  const raw = rawFlightNumber?.trim().toUpperCase().replace(/\s+/g, "")

  if (!raw) return null

  const normalizedCarrier = carrier?.trim().toUpperCase()

  let withoutCarrier = raw

  if (normalizedCarrier && raw.startsWith(normalizedCarrier)) {
    withoutCarrier = raw.slice(normalizedCarrier.length)
  } else {
    withoutCarrier = raw.replace(/^[A-Z]{2}/, "")
  }

  const withoutLeadingZeros = withoutCarrier.replace(/^0+/, "")

  return withoutLeadingZeros || withoutCarrier || raw
}

function getFlightCarrierFromFlightNumber(rawFlightNumber?: string | null) {
  const raw = rawFlightNumber?.trim().toUpperCase().replace(/\s+/g, "")

  if (!raw) return null

  const match = raw.match(/^([A-Z0-9]{2})(\d+)/)

  return match?.[1] ?? null
}

function getSegmentFlightLabel(segment: ItinerarySegment) {
  const rawFlightNumber =
    segment.marketingFlightNumber?.trim() ||
    segment.operatingFlightNumber?.trim()

  const carrier =
    segment.marketingCarrier?.trim().toUpperCase() ||
    segment.operatingCarrier?.trim().toUpperCase() ||
    getFlightCarrierFromFlightNumber(rawFlightNumber)

  if (!carrier || !rawFlightNumber) return null

  const normalizedFlightNumber = normalizeFlightNumberForCarrier(
    rawFlightNumber,
    carrier
  )

  return `${carrier} ${normalizedFlightNumber ?? rawFlightNumber}`
}

function getPrimarySegmentLabel(flight: RecommendedFlight) {
  const segments = Array.isArray(flight.itinerarySegments)
    ? flight.itinerarySegments
    : []

  const firstSegmentLabel = segments[0]
    ? getSegmentFlightLabel(segments[0])
    : null

  if (firstSegmentLabel) return firstSegmentLabel

  const rawFlightNumber = flight.flightNumber?.trim()

  if (!rawFlightNumber) return "Flight pending"

  const airlineCode =
    flight.airline?.trim().toUpperCase() ||
    getFlightCarrierFromFlightNumber(rawFlightNumber)

  const normalizedFlightNumber = normalizeFlightNumberForCarrier(
    rawFlightNumber,
    airlineCode
  )

  if (airlineCode && /^[A-Z0-9]{2}$/.test(airlineCode)) {
    return `${airlineCode} ${normalizedFlightNumber ?? rawFlightNumber}`
  }

  return normalizedFlightNumber ?? rawFlightNumber
}

function getFlightLabel(flight: RecommendedFlight) {
  const primarySegmentLabel = getPrimarySegmentLabel(flight)
  const carrierCode = primarySegmentLabel.split(" ")[0]
  const airline = getAirlineDisplay(carrierCode || flight.airline)

  const segments = Array.isArray(flight.itinerarySegments)
    ? flight.itinerarySegments
    : []

  if (segments.length > 1) {
    return `${airline} · ${segments.length} segments`
  }

  return `${airline} · ${primarySegmentLabel} · Direct`
}

function getItineraryRouteLabel(flight: RecommendedFlight) {
  const segments = Array.isArray(flight.itinerarySegments)
    ? flight.itinerarySegments
    : []

  if (!segments.length) {
    return flight.stopCount && flight.stopCount > 0
      ? `${flight.stopCount + 1} segments`
      : "Direct itinerary"
  }

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

  const routeShape =
    routePoints.length > 1 ? routePoints.join(" → ") : "Route pending"

  if (segments.length === 1) {
    const segmentLabel = getSegmentFlightLabel(segments[0])
    return segmentLabel ? `${routeShape} · ${segmentLabel}` : routeShape
  }

  const segmentLabels = segments
    .map(getSegmentFlightLabel)
    .filter((value): value is string => Boolean(value))

  return segmentLabels.length
    ? `${routeShape} · ${segmentLabels.join(" + ")}`
    : routeShape
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>

      <span className="text-xs font-semibold text-slate-950">{value}</span>
    </div>
  )
}

function formatPrice(value?: number | null) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "Building"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function formatAveragePrice(value?: number | null) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "Building"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) / 100)
}