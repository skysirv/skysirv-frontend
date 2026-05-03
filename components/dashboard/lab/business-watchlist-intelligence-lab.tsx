"use client"

import { useState } from "react"
import { getAirportByCode } from "@/lib/airports/major-airports"

export type BusinessWatchlistRouteLabData = {
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

type BusinessWatchlistIntelligenceLabProps = {
  loading?: boolean
  watchlist: BusinessWatchlistRouteLabData[]
  onOpenFlightModal?: (
    route: BusinessWatchlistRouteLabData,
    flight?: RecommendedFlight | null
  ) => void
  onRemoveRoute?: (routeId: string) => void
}

export default function BusinessWatchlistIntelligenceLab({
  loading = false,
  watchlist,
  onOpenFlightModal,
  onRemoveRoute,
}: BusinessWatchlistIntelligenceLabProps) {
  const [openRoute, setOpenRoute] = useState<string | null>(null)

  return (
    <section className="pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Route Watchlist
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Active tracked routes with fare context, signal state, and
              recommended flight availability.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-sm font-semibold text-slate-950">
              {watchlist.length}
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Routes
            </span>
          </div>
        </div>

        {loading ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-6">
            <p className="text-sm font-semibold text-slate-950">
              Loading monitored routes.
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Skysirv is pulling your Business watchlist and live fare context.
            </p>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-6">
            <p className="text-sm font-semibold text-slate-950">
              No monitored routes yet.
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Add a route above to begin building Business-level fare
              intelligence.
            </p>
          </div>
        ) : (
          <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.45)_rgba(241,245,249,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400">
            {watchlist.map((route) => {
              const routeKey = getRouteKey(route)
              const isOpen = openRoute === routeKey
              const recommendedFlights = normalizeRecommendedFlights(route)

              const chevronClasses = isOpen
                ? "rotate-180 border-cyan-200 bg-cyan-50 text-cyan-700"
                : "hover:border-slate-300 hover:text-slate-700"

              return (
                <article
                  key={route.id}
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
                          {getRouteLabel(route)}
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
                          {getDepartureLabel(route)}
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
                      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_auto]">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Recommended flights
                          </p>

                          {recommendedFlights.length > 0 ? (
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              {recommendedFlights.map((flight, index) => (
                                <button
                                  key={`${route.id}-${flight.airline ?? "flight"}-${flight.flightNumber ?? index
                                    }-${flight.price ?? "price"}`}
                                  type="button"
                                  onClick={() => {
                                    if (onOpenFlightModal) {
                                      onOpenFlightModal(route, flight)
                                    }
                                  }}
                                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-cyan-200 hover:bg-white"
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
                              ))}
                            </div>
                          ) : (
                            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                              <p className="text-sm text-slate-600">
                                Recommended flights are building for this route.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Route avg
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-950">
                              {formatAveragePrice(route.avg_price)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Tracking
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-950">
                              Active
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              History
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-950">
                              {route.last_checked_at ? "Active" : "Building"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Signal
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-950">
                              {getSignalLabel(route)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-end justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenFlightModal) {
                                onOpenFlightModal(route, recommendedFlights[0] ?? null)
                              }
                            }}
                            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                          >
                            View intelligence
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onRemoveRoute) {
                                onRemoveRoute(route.id)
                              }
                            }}
                            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function getRouteKey(route: BusinessWatchlistRouteLabData) {
  return route.route_hash ?? route.id
}

function getRouteLabel(route: BusinessWatchlistRouteLabData) {
  if (route.route) return route.route

  const origin = route.origin?.trim() || "—"
  const destination = route.destination?.trim() || "—"

  return `${origin} → ${destination}`
}

function getAirportLabel(route: BusinessWatchlistRouteLabData) {
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

function getDepartureLabel(route: BusinessWatchlistRouteLabData) {
  if (!route.departure_date) return "Departure · Watching"

  const parsedDate = new Date(route.departure_date)

  if (Number.isNaN(parsedDate.getTime())) {
    return `Departure · ${route.departure_date}`
  }

  return `Departure · ${parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`
}

function getStatusLabel(route: BusinessWatchlistRouteLabData) {
  if (route.latest_price != null || route.recommended_flights?.length) {
    return "Live Data"
  }

  return "Building"
}

function getSignalLabel(route: BusinessWatchlistRouteLabData) {
  if (route.booking_signal) return route.booking_signal
  if (route.volatility_index) return route.volatility_index
  if (route.latest_price != null) return "Active"
  return "Building"
}

function normalizeRecommendedFlights(route: BusinessWatchlistRouteLabData) {
  const directFlights = Array.isArray(route.recommended_flights)
    ? route.recommended_flights
    : []

  if (directFlights.length > 0) {
    return directFlights.slice(0, 6)
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

  if (!raw) return "Airline pending"

  const normalizedCode = raw.toUpperCase()

  return airlineNamesByCode[normalizedCode] ?? raw
}

function getSegmentFlightLabel(segment: ItinerarySegment) {
  const carrier =
    segment.marketingCarrier?.trim().toUpperCase() ||
    segment.operatingCarrier?.trim().toUpperCase()

  const rawFlightNumber =
    segment.marketingFlightNumber?.trim() ||
    segment.operatingFlightNumber?.trim()

  if (!carrier || !rawFlightNumber) return null

  const normalizedFlightNumber = rawFlightNumber
    .replace(/^[A-Z]{2}\s*/i, "")
    .replace(/^0+/, "")

  return `${carrier} ${normalizedFlightNumber || rawFlightNumber}`
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

  const airlineCode = flight.airline?.trim().toUpperCase()
  const numericFlightNumber = rawFlightNumber
    .replace(/^[A-Z]{2}\s*/i, "")
    .replace(/^0+/, "")

  if (airlineCode && /^[A-Z0-9]{2}$/.test(airlineCode)) {
    return `${airlineCode} ${numericFlightNumber || rawFlightNumber}`
  }

  return rawFlightNumber
}

function getFlightLabel(flight: RecommendedFlight) {
  const airline = getAirlineDisplay(flight.airline)
  const segments = Array.isArray(flight.itinerarySegments)
    ? flight.itinerarySegments
    : []

  if (segments.length > 1) {
    return `${airline} · ${segments.length} segments`
  }

  return `${airline} · ${getPrimarySegmentLabel(flight)} · Direct`
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

  const routeShape = routePoints.length > 1 ? routePoints.join(" → ") : "Route pending"

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

function formatAveragePrice(value?: number | null) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "Building"
  }

  return formatPrice(Number(value) / 100)
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