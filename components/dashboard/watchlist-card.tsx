"use client"

import { getAirportByCode } from "@/lib/airports/major-airports"

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

  const airlineReference: Record<
    string,
    {
      name: string
      tier: "major" | "secondary" | "unknown"
    }
  > = {
    AA: { name: "American Airlines", tier: "major" },
    AC: { name: "Air Canada", tier: "major" },
    AF: { name: "Air France", tier: "major" },
    AH: { name: "Air Algerie", tier: "secondary" },
    AI: { name: "Air India", tier: "major" },
    AK: { name: "AirAsia", tier: "secondary" },
    AM: { name: "Aeromexico", tier: "major" },
    AS: { name: "Alaska Airlines", tier: "major" },
    AT: { name: "Royal Air Maroc", tier: "secondary" },
    AV: { name: "Avianca", tier: "major" },
    AY: { name: "Finnair", tier: "major" },

    B6: { name: "JetBlue", tier: "major" },
    BA: { name: "British Airways", tier: "major" },
    BR: { name: "EVA Air", tier: "major" },
    BT: { name: "airBaltic", tier: "secondary" },

    CA: { name: "Air China", tier: "major" },
    CI: { name: "China Airlines", tier: "major" },
    CM: { name: "Copa Airlines", tier: "major" },
    CX: { name: "Cathay Pacific", tier: "major" },
    CZ: { name: "China Southern Airlines", tier: "major" },

    DE: { name: "Condor", tier: "secondary" },
    DL: { name: "Delta", tier: "major" },
    DY: { name: "Norwegian Air Shuttle", tier: "secondary" },

    EK: { name: "Emirates", tier: "major" },
    ET: { name: "Ethiopian Airlines", tier: "major" },
    EW: { name: "Eurowings", tier: "secondary" },
    EY: { name: "Etihad Airways", tier: "major" },

    F9: { name: "Frontier Airlines", tier: "secondary" },
    FD: { name: "Thai AirAsia", tier: "secondary" },
    FJ: { name: "Fiji Airways", tier: "secondary" },
    FM: { name: "Shanghai Airlines", tier: "secondary" },
    FR: { name: "Ryanair", tier: "secondary" },

    G4: { name: "Allegiant Air", tier: "secondary" },
    GA: { name: "Garuda Indonesia", tier: "major" },
    GF: { name: "Gulf Air", tier: "secondary" },

    HA: { name: "Hawaiian Airlines", tier: "secondary" },
    HV: { name: "Transavia", tier: "secondary" },
    HU: { name: "Hainan Airlines", tier: "major" },

    IB: { name: "Iberia", tier: "major" },

    JL: { name: "Japan Airlines", tier: "major" },
    JU: { name: "Air Serbia", tier: "secondary" },

    KE: { name: "Korean Air", tier: "major" },
    KL: { name: "KLM", tier: "major" },
    KP: { name: "ASKY Airlines", tier: "secondary" },
    KQ: { name: "Kenya Airways", tier: "secondary" },
    KU: { name: "Kuwait Airways", tier: "secondary" },

    LA: { name: "LATAM Airlines Group", tier: "major" },
    LH: { name: "Lufthansa", tier: "major" },
    LO: { name: "LOT Polish", tier: "major" },
    LR: { name: "Avianca Costa Rica", tier: "secondary" },
    LX: { name: "SWISS", tier: "major" },
    LY: { name: "EL AL", tier: "major" },

    MH: { name: "Malaysia Airlines", tier: "major" },
    MS: { name: "Egyptair", tier: "secondary" },
    MU: { name: "China Eastern", tier: "major" },

    NH: { name: "All Nippon Airways", tier: "major" },
    NK: { name: "Spirit Airlines", tier: "secondary" },
    NZ: { name: "Air New Zealand", tier: "major" },

    OS: { name: "Austrian Airlines", tier: "major" },
    OU: { name: "Croatia Airlines", tier: "secondary" },
    OZ: { name: "Asiana Airlines", tier: "major" },

    PK: { name: "PIA", tier: "secondary" },
    PR: { name: "Philippine Airlines", tier: "secondary" },

    QF: { name: "Qantas", tier: "major" },
    QR: { name: "Qatar Airways", tier: "major" },
    QZ: { name: "Indonesia AirAsia", tier: "secondary" },

    RJ: { name: "Royal Jordanian", tier: "secondary" },
    RO: { name: "Tarom", tier: "secondary" },

    SA: { name: "South African Airways", tier: "secondary" },
    SC: { name: "Shandong Airlines", tier: "secondary" },
    SK: { name: "SAS Scandinavian", tier: "major" },
    SL: { name: "Thai Lion Air", tier: "secondary" },
    SQ: { name: "Singapore Airlines", tier: "major" },
    SU: { name: "Aeroflot", tier: "secondary" },
    SV: { name: "Saudia", tier: "major" },

    TA: { name: "Avianca El Salvador", tier: "secondary" },
    TG: { name: "THAI Airways", tier: "major" },
    TK: { name: "Turkish Airlines", tier: "major" },
    TP: { name: "TAP Air Portugal", tier: "major" },

    U2: { name: "easyJet", tier: "secondary" },
    UA: { name: "United Airlines", tier: "major" },
    UL: { name: "SriLankan Airlines", tier: "secondary" },

    VA: { name: "Virgin Australia", tier: "major" },
    VJ: { name: "Vietjet", tier: "secondary" },
    VN: { name: "Vietnam Airlines", tier: "major" },
    VS: { name: "Virgin Atlantic", tier: "major" },
    VY: { name: "Vueling", tier: "secondary" },

    W6: { name: "Wizz Air", tier: "secondary" },
    WN: { name: "Southwest Airlines", tier: "major" },
    WS: { name: "WestJet", tier: "secondary" },
    WY: { name: "Oman Air", tier: "secondary" },

    ZH: { name: "Shenzhen Airlines", tier: "secondary" },
  }

  function getAirlineDisplayName(code?: string | null) {
    const normalizedCode = code?.trim().toUpperCase()

    if (!normalizedCode) {
      return "Airline pending"
    }

    return airlineReference[normalizedCode]?.name ?? normalizedCode
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

    // Normalize: handle both "YYYY-MM-DD" and ISO strings
    const raw = departureDate.split("T")[0]

    const parts = raw.split("-")
    if (parts.length !== 3) return departureDate

    const [year, month, day] = parts.map(Number)

    if (!year || !month || !day) return departureDate

    const parsed = new Date(year, month - 1, day)

    if (Number.isNaN(parsed.getTime())) return departureDate

    return parsed.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  })()

  const currentFareDisplay = hasPrice
    ? `$${Math.round(latestPrice).toLocaleString()}`
    : "—"

  const priceHistoryDisplay =
    typeof avgPrice === "number"
      ? `$${Math.round(avgPrice).toLocaleString()}`
      : "Pending"

  const airlineDisplay = getAirlineDisplayName(latestAirline)

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
      return airlineReference[code]?.tier === "major"
    })

    const secondaryFlights = sortedFlights.filter((flight) => {
      const code = flight.airline?.trim().toUpperCase() ?? ""
      return airlineReference[code]?.tier === "secondary"
    })

    const unknownFlights = sortedFlights.filter((flight) => {
      const code = flight.airline?.trim().toUpperCase() ?? ""
      return !airlineReference[code] || airlineReference[code]?.tier === "unknown"
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
            <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium">Route Average</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="font-semibold text-slate-900">{priceHistoryDisplay}</span>
            </div>

            <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium">Tracking</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="font-semibold text-slate-900">Active</span>
            </div>

            <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium">History</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="font-semibold text-slate-900">
                {hasPrice ? "Active" : "Building"}
              </span>
            </div>

            <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium">Signals</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="font-semibold text-slate-900">{volatilityDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}