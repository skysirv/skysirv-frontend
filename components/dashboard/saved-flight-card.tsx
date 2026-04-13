"use client"

import { getAirportByCode } from "@/lib/airports/major-airports"

export type SavedFlightCardData = {
    id: string
    origin?: string | null
    destination?: string | null
    departure_date?: string | null
    airline?: string | null
    flight_number?: string | null
    price?: number | null
    currency?: string | null
    saved_at?: string | null
    latest_price?: number | null
    status?: "active" | "completed" | null
}

type SavedFlightCardProps = {
    flight: SavedFlightCardData
    onOpenIntelligence?: () => void
    onMarkRouteCompleted?: () => void
}

function formatAirportDisplay(
    airport: ReturnType<typeof getAirportByCode>
) {
    if (!airport) return null

    const locationLabel =
        airport.country === "United States" && airport.region
            ? `${airport.city}, ${airport.region}`
            : `${airport.city}, ${airport.country}`

    const airportLabel = airport.displayName ?? airport.name

    return `${locationLabel} - ${airportLabel} (${airport.code})`
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
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function formatPrice(value?: number | null) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return "—"
    }

    return `$${Math.round(value).toLocaleString()}`
}

export default function SavedFlightCard({
    flight,
    onOpenIntelligence,
    onMarkRouteCompleted,
}: SavedFlightCardProps) {
    const originAirport = getAirportByCode(flight.origin)
    const destinationAirport = getAirportByCode(flight.destination)

    const routeLocationDisplay =
        originAirport && destinationAirport
            ? `${formatAirportDisplay(originAirport)} → ${formatAirportDisplay(destinationAirport)}`
            : null

    return (
        <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Saved Flight
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                        {flight.origin ?? "—"} → {flight.destination ?? "—"}
                    </h3>

                    {routeLocationDisplay && (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                            {routeLocationDisplay}
                        </p>
                    )}

                    <p className="mt-2 text-sm text-slate-600">
                        {flight.airline ?? "Airline pending"}
                        {flight.flight_number ? ` • ${flight.flight_number}` : ""}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Departure • {formatDepartureDate(flight.departure_date)}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Saved Price
                        </p>
                        <p className="mt-1 text-base font-semibold text-slate-950">
                            {formatPrice(flight.price)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Latest Price
                        </p>
                        <p className="mt-1 text-base font-semibold text-slate-950">
                            {formatPrice(flight.latest_price)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Status
                        </p>
                        <p className="mt-1 text-base font-semibold text-slate-950">
                            {flight.status === "completed" ? "Completed" : "Active"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={onOpenIntelligence}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                >
                    Open Intelligence
                </button>

                <button
                    type="button"
                    onClick={onMarkRouteCompleted}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                    Mark Route Completed
                </button>
            </div>
        </div>
    )
}