"use client"

import { getAirportByCode } from "@/lib/airports/major-airports"
import { getAirlineDisplayName, getAirlineTier } from "@/lib/airlines/airlines"

interface WatchlistCardProps {
  origin?: string
  destination?: string
  departureDate?: string
  latestPrice?: number | null
  avgPrice?: number | null
  priceDelta?: number | null
  latestAirline?: string | null
  latestFlightNumber?: string | null
  latestCapturedAt?: string | null
  recommendedFlights?:
  | {
    airline?: string | null
    flightNumber?: string | null
    price?: number | null
    currency?: string | null
    capturedAt?: string | null
  }[]
  | null
  volatilityIndex?: string | null
  onOpenFlightModal?: (flight?: {
    airline?: string | null
    flightNumber?: string | null
    price?: number | null
    currency?: string | null
    capturedAt?: string | null
  } | null) => void
  onRemove?: () => void
}

export default function WatchlistCard({
  origin = "—",
  destination = "—",
  departureDate = "Pending",
  latestPrice = null,
  avgPrice = null,
  priceDelta = null,
  latestAirline = null,
  latestFlightNumber = null,
  latestCapturedAt = null,
  recommendedFlights = null,
  volatilityIndex = null,
  onOpenFlightModal,
  onRemove,
}: WatchlistCardProps) {
  function handleRemoveRoute() {
    onRemove?.()
  }

  const hasPrice = typeof latestPrice === "number"

  const originAirport = getAirportByCode(origin)
  const destinationAirport = getAirportByCode(destination)

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

  const routeLocationDisplay =
    originAirport && destinationAirport
      ? `${formatAirportDisplay(originAirport)} → ${formatAirportDisplay(destinationAirport)}`
      : null

  const departureDateDisplay = (() => {
    if (!departureDate) return "Pending"

    const raw = departureDate.split("T")[0]

    let year: number | null = null
    let month: number | null = null
    let day: number | null = null

    const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    const usMatch = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)

    if (isoMatch) {
      year = Number(isoMatch[1])
      month = Number(isoMatch[2])
      day = Number(isoMatch[3])
    } else if (usMatch) {
      month = Number(usMatch[1])
      day = Number(usMatch[2])
      year = Number(usMatch[3])
    } else {
      return departureDate
    }

    if (!year || !month || !day) return departureDate

    const parsed = new Date(year, month - 1, day)

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.getFullYear() !== year ||
      parsed.getMonth() + 1 !== month ||
      parsed.getDate() !== day
    ) {
      return departureDate
    }

    return `${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}-${year}`
  })()

  const currentFareDisplay = hasPrice
    ? `$${Math.round(latestPrice).toLocaleString()}`
    : "—"

  const priceHistoryDisplay =
    typeof avgPrice === "number"
      ? `$${Math.round(avgPrice).toLocaleString()}`
      : "Pending"

  const airlineDisplay = getAirlineDisplayName(latestAirline)

  const recommendedFlightsDisplay = (() => {
    if (!recommendedFlights || recommendedFlights.length === 0) {
      return []
    }

    const sortedFlights = [...recommendedFlights].sort((a, b) => {
      const priceA =
        typeof a.price === "number" && Number.isFinite(a.price)
          ? a.price
          : Number.POSITIVE_INFINITY

      const priceB =
        typeof b.price === "number" && Number.isFinite(b.price)
          ? b.price
          : Number.POSITIVE_INFINITY

      return priceA - priceB
    })

    const majorFlights = sortedFlights.filter((flight) => {
      const code = flight.airline?.trim().toUpperCase() ?? ""
      return getAirlineTier(code) === "major"
    })

    const secondaryFlights = sortedFlights.filter((flight) => {
      const code = flight.airline?.trim().toUpperCase() ?? ""
      return getAirlineTier(code) === "secondary"
    })

    const unknownFlights = sortedFlights.filter((flight) => {
      const code = flight.airline?.trim().toUpperCase() ?? ""
      return getAirlineTier(code) === "unknown"
    })

    const combined = [
      ...majorFlights.slice(0, 2),
      ...secondaryFlights.slice(0, 2),
    ]

    if (combined.length < 4) {
      for (const flight of [
        ...majorFlights.slice(2),
        ...secondaryFlights.slice(2),
        ...unknownFlights,
      ]) {
        const alreadyIncluded = combined.some(
          (included) =>
            included.airline === flight.airline &&
            included.flightNumber === flight.flightNumber &&
            included.price === flight.price
        )

        if (!alreadyIncluded) {
          combined.push(flight)
        }

        if (combined.length >= 4) {
          break
        }
      }
    }

    return combined
  })()

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

  return (
    <div className="group relative min-h-[640px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,rgba(255,255,255,0)_72%)] blur-2xl" />
        <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(255,255,255,0)_72%)] blur-2xl" />
      </div>

      <div className="relative flex min-h-[592px] flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 ring-1 ring-sky-200">
                {hasPrice ? "Live Data" : "Waiting for data"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Monitoring
              </span>
            </div>

            <p className="text-xl font-semibold tracking-tight text-slate-900">
              {origin} → {destination}
            </p>

            {routeLocationDisplay && (
              <p className="mt-1 text-sm text-slate-500">
                {routeLocationDisplay}
              </p>
            )}

            <p className="mt-1 text-sm text-slate-500">
              Departure • {departureDateDisplay}
            </p>
          </div>

          <button
            onClick={handleRemoveRoute}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,1)_100%)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recommended Flights
            </p>

            <div className="mt-4 space-y-2">
              {recommendedFlightsDisplay.length > 0 ? (
                recommendedFlightsDisplay.map((flight, index) => {
                  const flightAirline = getAirlineDisplayName(flight.airline)
                  const flightPrice =
                    typeof flight.price === "number" && Number.isFinite(flight.price)
                      ? `$${Math.round(flight.price).toLocaleString()}`
                      : "—"

                  return (
                    <button
                      type="button"
                      key={`${flight.airline ?? "airline"}-${flight.flightNumber ?? "flight"}-${index}`}
                      onClick={() => onOpenFlightModal?.(flight)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/40"
                    >
                      <span>{flightAirline}</span>
                      <span className="font-semibold text-slate-900">{flightPrice}</span>
                    </button>
                  )
                })
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    onOpenFlightModal?.({
                      airline: latestAirline,
                      flightNumber: latestFlightNumber,
                      price: latestPrice,
                      capturedAt: latestCapturedAt,
                    })
                  }
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/40"
                >
                  <span>{airlineDisplay}</span>
                  <span className="font-semibold text-slate-900">{currentFareDisplay}</span>
                </button>
              )}
            </div>
          </div>

        </div>

        <div className="mt-auto pt-6">
          <div className="flex flex-col gap-3">
            <div className="flex w-full items-center justify-between rounded-full border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium">Route Average</span>
              <span className="font-semibold text-slate-900">{priceHistoryDisplay}</span>
            </div>

            <div className="flex w-full items-center justify-between rounded-full border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium">Tracking</span>
              <span className="font-semibold text-slate-900">Active</span>
            </div>

            <div className="flex w-full items-center justify-between rounded-full border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium">History</span>
              <span className="font-semibold text-slate-900">
                {hasPrice ? "Active" : "Building"}
              </span>
            </div>

            <div className="flex w-full items-center justify-between rounded-full border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium">Signals</span>
              <span className="font-semibold text-slate-900">{volatilityDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}