"use client"

import { useEffect, useState } from "react"
import { getAirportByCode } from "@/lib/airports/major-airports"

type RecommendedFlight = {
    airline?: string | null
    flightNumber?: string | null
    price?: number | null
    currency?: string | null
    capturedAt?: string | null
    bookingSignal?: string | null
    volatilityIndex?: string | null
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
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function formatCapturedTime(value?: string | null) {
    if (!value) return "Capture time pending"

    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
        return "Capture time pending"
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

    const routeLocationDisplay =
        originAirport && destinationAirport
            ? `${formatAirportDisplay(originAirport)} → ${formatAirportDisplay(destinationAirport)}`
            : null

    const selectedFlightSummary = selectedFlight
        ? `${selectedFlight.airline ?? "Airline"}${selectedFlight.flightNumber ? ` ${selectedFlight.flightNumber}` : ""} • ${formatPrice(selectedFlight.price)}`
        : null

    const marketStatusDisplay = (() => {
        const raw = selectedFlight?.bookingSignal?.trim().toLowerCase()

        if (!raw) return "Pending"

        if (["strong buy", "buy", "cheap"].includes(raw)) return "Good Deal"
        if (["favorable window", "fair price", "neutral", "wait"].includes(raw)) return "Fair Price"
        if (["overpriced", "expensive"].includes(raw)) return "Overpriced"
        if (["monitor closely"].includes(raw)) return "Watch"

        return "Pending"
    })()

    const marketStatusClass =
        marketStatusDisplay === "Good Deal"
            ? "text-emerald-600"
            : marketStatusDisplay === "Fair Price"
                ? "text-slate-700"
                : marketStatusDisplay === "Overpriced"
                    ? "text-rose-600"
                    : marketStatusDisplay === "Watch"
                        ? "text-amber-600"
                        : "text-slate-400"

    const signalDisplay = (() => {
        const numericVolatility = Number(selectedFlight?.volatilityIndex)

        if (!Number.isFinite(numericVolatility)) return "Pending"
        if (numericVolatility < 5) return "Stable"
        if (numericVolatility < 12) return "Moderate"
        return "Volatile"
    })()

    const intelligenceModules = [
        {
            id: "monitor",
            eyebrow: "Selected Route Intelligence",
            title: "Skysirv Monitor™",
            description:
                "Live route tracking focused on this selected city pair, watching fare movement, timing shifts, and booking pressure.",
        },
        {
            id: "signals",
            eyebrow: "Selected Route Intelligence",
            title: "Skysirv Signals™",
            description:
                "Clear signal detection for fare momentum, timing opportunities, and notable movement across the selected route.",
        },
        {
            id: "price-behavior",
            eyebrow: "Selected Route Intelligence",
            title: "Skysirv Price Behavior™",
            description:
                "A focused look at how this route tends to move, settle, spike, or soften as departure approaches.",
        },
        {
            id: "predict",
            eyebrow: "Selected Route Intelligence",
            title: "Skysirv Predict™",
            description:
                "Forward-looking guidance built to help estimate whether this route is more likely to rise, dip, or hold.",
        },
        {
            id: "insights",
            eyebrow: "Selected Route Intelligence",
            title: "Skysirv Insights™",
            description:
                "High-value route context distilled into a premium intelligence layer for faster booking decisions.",
        },
        {
            id: "route-digest",
            eyebrow: "Selected Route Intelligence",
            title: "Skysirv Route Digest™",
            description:
                "A concise route briefing that summarizes what matters most right now for this selected flight path.",
        },
        {
            id: "skyscore",
            eyebrow: "Selected Route Intelligence",
            title: "Skyscore™",
            description:
                "A simple confidence indicator designed to express the overall quality of the current opportunity.",
        },
        {
            id: "intelligence-engine",
            eyebrow: "Selected Route Intelligence",
            title: "Skysirv Intelligence Engine™",
            description:
                "The full intelligence layer bringing together monitoring, signals, behavior, and predictive confidence.",
        },
    ]

    const [activeIntelligenceModule, setActiveIntelligenceModule] = useState(0)

    function handlePreviousIntelligenceModule() {
        setActiveIntelligenceModule((current) =>
            current === 0 ? intelligenceModules.length - 1 : current - 1
        )
    }

    function handleNextIntelligenceModule() {
        setActiveIntelligenceModule((current) =>
            current === intelligenceModules.length - 1 ? 0 : current + 1
        )
    }

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

    const recommendedFlights = Array.isArray(route.recommendedFlights)
        ? route.recommendedFlights
        : []

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative z-[101] max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.22)]">
                <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 pl-6 pr-0 py-5 backdrop-blur">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-start w-full">
                                <div className="flex-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                                        Flight Intelligence
                                    </p>

                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                                        {route.origin ?? "—"} → {route.destination ?? "—"}
                                    </h2>

                                    {routeLocationDisplay && (
                                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                                            {routeLocationDisplay}
                                        </p>
                                    )}

                                    <p className="mt-2 text-sm text-slate-500">
                                        Departure • {formatDepartureDate(route.departureDate)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="ml-auto mr-6 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                >
                                    ✕
                                </button>
                            </div>

                            {selectedFlightSummary && (
                                <div className="flex items-center w-full">
                                    <p className="text-sm font-medium text-slate-700">
                                        Selected Flight • {selectedFlightSummary}
                                    </p>

                                    {selectedFlight && (
                                        <button
                                            type="button"
                                            onClick={onSaveFlight}
                                            className="ml-auto mr-6 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                                        >
                                            Save Flight
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Selected Flight
                        </p>

                        {selectedFlight ? (
                            <>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <div className="min-w-[160px] rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-center">
                                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                            Market Status
                                        </p>
                                        <p className={`mt-1 text-base font-semibold ${marketStatusClass}`}>
                                            {marketStatusDisplay}
                                        </p>
                                    </div>

                                    <div className="min-w-[140px] rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-center">
                                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                            Signals
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-900">
                                            {signalDisplay}
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="mt-2 text-sm text-slate-500">
                                No flight selected
                            </p>
                        )}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Route Snapshot
                            </p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                        Latest Fare
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                                        {formatPrice(route.latestPrice)}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                        Route Average
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                                        {formatPrice(route.avgPrice)}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                        Latest Airline
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-slate-950">
                                        {route.latestAirline ?? "Pending"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                        Captured
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-slate-950">
                                        {formatCapturedTime(route.latestCapturedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Selected Route Intelligence
                            </p>

                            <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                                            {intelligenceModules[activeIntelligenceModule].eyebrow}
                                        </p>

                                        <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                                            {intelligenceModules[activeIntelligenceModule].title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handlePreviousIntelligenceModule}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                                            aria-label="Previous intelligence module"
                                        >
                                            ←
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleNextIntelligenceModule}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                                            aria-label="Next intelligence module"
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
                                    {intelligenceModules[activeIntelligenceModule].description}
                                </p>

                                <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                                    <p className="text-sm font-medium text-slate-700">
                                        Module content area
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        This is where the live intelligence output for the active module
                                        will render next.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Recommended Flights
                        </p>

                        <div className="mt-4 space-y-3">
                            {recommendedFlights.length > 0 ? (
                                recommendedFlights.map((flight, index) => (
                                    <div
                                        key={`${flight.airline ?? "airline"}-${flight.flightNumber ?? "flight"}-${index}`}
                                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {flight.airline ?? "Airline pending"}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Flight detail expansion comes next
                                            </p>
                                        </div>

                                        <p className="text-base font-semibold text-slate-950">
                                            {formatPrice(flight.price)}
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
        </div>
    )
}