"use client"

import { useState } from "react"

export type FreeSavedFlightLabData = {
  id: string
  route?: string | null
  origin?: string | null
  destination?: string | null
  airline?: string | null
  flightNumber?: string | null
  flight_number?: string | null
  departureDate?: string | null
  departure_date?: string | null
  savedPrice?: number | null
  saved_price?: number | null
  price?: number | null
  latestPrice?: number | null
  latest_price?: number | null
  status?: string | null
  signal?: string | null
  booking_signal?: string | null
  completed_at?: string | null
}

type FreeSavedFlightsLabProps = {
  loading?: boolean
  savedFlights: FreeSavedFlightLabData[]
  remainingSavedFlights: number
  onDeleteSavedFlight?: (savedFlightId: string) => void
  onCompleteSavedFlight?: (savedFlightId: string) => void
}

export default function FreeSavedFlightsLab({
  loading = false,
  savedFlights,
  remainingSavedFlights,
  onDeleteSavedFlight,
  onCompleteSavedFlight,
}: FreeSavedFlightsLabProps) {
  const [openSavedFlightId, setOpenSavedFlightId] = useState<string | null>(null)

  const visibleSavedFlights = savedFlights.slice(0, 3)
  const usedSavedFlights = Math.min(visibleSavedFlights.length, 3)

  return (
    <section className="pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Saved Flights
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Save up to 3 flights for basic tracking and quick comparison.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-sm font-semibold text-slate-950">
              {usedSavedFlights} / 3
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Saved
            </span>
          </div>
        </div>

        {loading ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-6">
            <p className="text-sm leading-6 text-slate-600">
              Loading your saved flights…
            </p>
          </div>
        ) : visibleSavedFlights.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-6">
            <p className="text-sm font-semibold text-slate-950">
              No saved flights yet.
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Open a route above and save a flight to start tracking it here.
            </p>
          </div>
        ) : (
          <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.45)_rgba(241,245,249,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400">
            {visibleSavedFlights.map((savedFlight) => {
              const savedFlightId = savedFlight.id
              const isOpen = openSavedFlightId === savedFlightId
              const status = getSavedFlightStatus(savedFlight)

              const chevronClasses = isOpen
                ? "rotate-180 border-cyan-200 bg-cyan-50 text-cyan-700"
                : "hover:border-slate-300 hover:text-slate-700"

              return (
                <article
                  key={savedFlightId}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-cyan-200 hover:bg-slate-50/60"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSavedFlightId((current) =>
                        current === savedFlightId ? null : savedFlightId
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="shrink-0 text-sm font-semibold tracking-tight text-slate-950">
                          {getRouteLabel(savedFlight)}
                        </span>

                        <span className="hidden text-slate-300 sm:inline">
                          •
                        </span>

                        <span className="shrink-0 text-sm text-slate-600">
                          {getAirlineLabel(savedFlight)}
                        </span>

                        <span className="hidden text-slate-300 md:inline">
                          •
                        </span>

                        <span className="shrink-0 text-sm text-slate-500">
                          {getFlightNumberLabel(savedFlight)}
                        </span>

                        <span className="hidden text-slate-300 md:inline">
                          •
                        </span>

                        <span className="shrink-0 text-sm text-slate-500">
                          {getDepartureLabel(savedFlight)}
                        </span>

                        <span className="hidden text-slate-300 md:inline">
                          •
                        </span>

                        <span className="shrink-0 text-sm font-semibold text-slate-950">
                          {formatSavedFlightPrice(savedFlight)}
                        </span>

                        <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                          {status}
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
                      <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Saved price
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {formatSavedFlightPrice(savedFlight)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Latest price
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {formatLatestFlightPrice(savedFlight)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Status
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {status}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Signal
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {getBasicSignal(savedFlight)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-end justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onCompleteSavedFlight) {
                                onCompleteSavedFlight(savedFlightId)
                              }
                            }}
                            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                          >
                            Mark completed
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onDeleteSavedFlight) {
                                onDeleteSavedFlight(savedFlightId)
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

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
          <p className="text-sm leading-6 text-slate-600">
            Free plans can save up to 3 flights. You have{" "}
            <span className="font-semibold text-slate-950">
              {remainingSavedFlights}
            </span>{" "}
            saved-flight slot{remainingSavedFlights === 1 ? "" : "s"} remaining.
          </p>
        </div>
      </div>
    </section>
  )
}

function getRouteLabel(savedFlight: FreeSavedFlightLabData) {
  if (savedFlight.route) return savedFlight.route

  const origin = savedFlight.origin?.trim() || "—"
  const destination = savedFlight.destination?.trim() || "—"

  return `${origin} → ${destination}`
}

function getAirlineLabel(savedFlight: FreeSavedFlightLabData) {
  return savedFlight.airline?.trim() || "Saved flight"
}

function getFlightNumberLabel(savedFlight: FreeSavedFlightLabData) {
  return (
    savedFlight.flightNumber?.trim() ||
    savedFlight.flight_number?.trim() ||
    "Flight"
  )
}

function getDepartureLabel(savedFlight: FreeSavedFlightLabData) {
  const date = savedFlight.departureDate ?? savedFlight.departure_date

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

function getSavedFlightStatus(savedFlight: FreeSavedFlightLabData) {
  if (savedFlight.completed_at) return "Completed"
  if (savedFlight.status?.trim()) return savedFlight.status
  return "Saved"
}

function getBasicSignal(savedFlight: FreeSavedFlightLabData) {
  const rawSignal =
    savedFlight.signal ?? savedFlight.booking_signal ?? savedFlight.status ?? ""

  const normalized = rawSignal.toLowerCase()

  if (normalized.includes("complete")) return "Completed"
  if (normalized.includes("good")) return "Good watch"
  if (normalized.includes("hold")) return "Watching"
  if (normalized.includes("over")) return "High fare"

  return "Basic watch"
}

function formatSavedFlightPrice(savedFlight: FreeSavedFlightLabData) {
  return formatPrice(
    savedFlight.savedPrice ?? savedFlight.saved_price ?? savedFlight.price
  )
}

function formatLatestFlightPrice(savedFlight: FreeSavedFlightLabData) {
  return formatPrice(
    savedFlight.latestPrice ??
    savedFlight.latest_price ??
    savedFlight.savedPrice ??
    savedFlight.saved_price ??
    savedFlight.price
  )
}

function formatPrice(value?: number | null) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "Building"
  }

  const numericValue = Number(value)

  const normalizedValue = numericValue > 10000 ? numericValue / 100 : numericValue

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(normalizedValue)
}