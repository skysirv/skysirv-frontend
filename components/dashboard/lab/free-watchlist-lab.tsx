"use client"

import { useState } from "react"

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
  volatility_index?: string | null
  recommended_flights?:
  | {
    airline?: string | null
    flightNumber?: string | null
    price?: number | null
    currency?: string | null
    capturedAt?: string | null
  }[]
  | null
}

type FreeWatchlistLabProps = {
  loading?: boolean
  watchlist: WatchlistRoute[]
  remainingRoutes: number
  onRemoveRoute?: (routeId: string) => void
}

export default function FreeWatchlistLab({
  loading = false,
  watchlist,
  remainingRoutes,
  onRemoveRoute,
}: FreeWatchlistLabProps) {
  const [openRoute, setOpenRoute] = useState<string | null>(null)

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
                      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_auto]">
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
                                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-cyan-200 hover:bg-white"
                                >
                                  <span className="min-w-0 truncate text-sm text-slate-700">
                                    {flight.airline}
                                  </span>

                                  <span className="shrink-0 text-sm font-semibold text-slate-950">
                                    {flight.price}
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

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Latest price
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-950">
                              {formatPrice(route.latest_price)}
                            </p>
                          </div>

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
                              Signal
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-950">
                              {getBasicSignal(route.booking_signal)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-end justify-end gap-2">
                          <button
                            type="button"
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
    </section>
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
  const origin = route.origin?.trim() || "Origin"
  const destination = route.destination?.trim() || "Destination"

  return `${origin} → ${destination}`
}

function getDepartureLabel(date?: string | null) {
  if (!date) return "Departure · Watching"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return `Departure · ${date}`
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
  const normalized = signal?.toLowerCase() ?? ""

  if (normalized.includes("good")) return "Good watch"
  if (normalized.includes("hold")) return "Watching"
  if (normalized.includes("over")) return "High fare"

  return "Basic watch"
}

function normalizeRecommendedFlights(route: WatchlistRoute) {
  const flights = Array.isArray(route.recommended_flights)
    ? route.recommended_flights
    : []

  if (flights.length > 0) {
    return flights.slice(0, 2).map((flight) => ({
      airline: flight.airline?.trim() || "Available fare",
      price: formatPrice(flight.price),
    }))
  }

  if (route.latest_airline || route.latest_price) {
    return [
      {
        airline: route.latest_airline?.trim() || "Latest available fare",
        price: formatPrice(route.latest_price),
      },
    ]
  }

  return []
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