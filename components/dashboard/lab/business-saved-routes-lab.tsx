"use client"

import { useState } from "react"

import type { SavedFlightCardData } from "@/components/dashboard/saved-flight-card"

type BusinessSavedFlightLabData = SavedFlightCardData & {
  completed_at?: string | null
  status?: string | null
  signal?: string | null
  booking_signal?: string | null
}

type BusinessSavedRoutesLabProps = {
  savedFlights: BusinessSavedFlightLabData[]
  onOpenSavedFlightIntelligence?: (flight: BusinessSavedFlightLabData) => void
  onMarkSavedFlightCompleted?: (flight: BusinessSavedFlightLabData) => void
  onDeleteSavedFlight?: (flight: BusinessSavedFlightLabData) => void
}

export default function BusinessSavedRoutesLab({
  savedFlights,
  onOpenSavedFlightIntelligence,
  onMarkSavedFlightCompleted,
  onDeleteSavedFlight,
}: BusinessSavedRoutesLabProps) {
  const [openRoute, setOpenRoute] = useState<string | null>(null)

  return (
    <section className="pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Saved Flights
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Flights you saved for closer tracking, comparison, and future trip
              history.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-sm font-semibold text-slate-950">
              {savedFlights.length}
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Saved
            </span>
          </div>
        </div>

        {savedFlights.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-6">
            <p className="text-sm font-semibold text-slate-950">
              No saved flights yet.
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Open a monitored route, review a recommended flight, and save it
              for deeper Business tracking.
            </p>
          </div>
        ) : (
          <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.45)_rgba(241,245,249,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400">
            {savedFlights.map((flight) => {
              const isOpen = openRoute === flight.id
              const isCompleted = Boolean(flight.completed_at)

              const chevronClasses = isOpen
                ? "rotate-180 border-cyan-200 bg-cyan-50 text-cyan-700"
                : "hover:border-slate-300 hover:text-slate-700"

              return (
                <article
                  key={flight.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-cyan-200 hover:bg-slate-50/60"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenRoute((current) =>
                        current === flight.id ? null : flight.id
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="shrink-0 text-sm font-semibold tracking-tight text-slate-950">
                          {getRouteLabel(flight)}
                        </span>

                        <span className="hidden text-slate-300 sm:inline">
                          •
                        </span>

                        <span className="shrink-0 text-sm text-slate-600">
                          {getAirlineLabel(flight)}
                        </span>

                        <span className="hidden text-slate-300 md:inline">
                          •
                        </span>

                        <span className="shrink-0 text-sm text-slate-500">
                          {getFlightNumberLabel(flight)}
                        </span>

                        <span className="hidden text-slate-300 md:inline">
                          •
                        </span>

                        <span className="shrink-0 text-sm text-slate-500">
                          {getDepartureLabel(flight)}
                        </span>

                        <span className="hidden text-slate-300 md:inline">
                          •
                        </span>

                        <span className="shrink-0 text-sm font-semibold text-slate-950">
                          {formatPrice(flight.price)}
                        </span>

                        <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                          {getStatusLabel(flight)}
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
                            {formatPrice(flight.price)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Latest price
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {formatPrice(flight.latest_price ?? flight.price)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Status
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {getStatusLabel(flight)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Signal
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {getSignalLabel(flight)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-end justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenSavedFlightIntelligence) {
                                onOpenSavedFlightIntelligence(flight)
                              }
                            }}
                            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                          >
                            Open intelligence
                          </button>

                          <button
                            type="button"
                            disabled={isCompleted}
                            onClick={() => {
                              if (onMarkSavedFlightCompleted && !isCompleted) {
                                onMarkSavedFlightCompleted(flight)
                              }
                            }}
                            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isCompleted ? "Completed" : "Mark completed"}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onDeleteSavedFlight) {
                                onDeleteSavedFlight(flight)
                              }
                            }}
                            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                          >
                            Delete
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

function getRouteLabel(flight: BusinessSavedFlightLabData) {
  const origin = flight.origin?.trim() || "—"
  const destination = flight.destination?.trim() || "—"

  return `${origin} → ${destination}`
}

function getAirlineLabel(flight: BusinessSavedFlightLabData) {
  return flight.airline?.trim() || "Airline building"
}

function getFlightNumberLabel(flight: BusinessSavedFlightLabData) {
  return flight.flight_number?.trim() || "Flight building"
}

function getDepartureLabel(flight: BusinessSavedFlightLabData) {
  if (!flight.departure_date) return "Departure · Watching"

  const parsedDate = new Date(flight.departure_date)

  if (Number.isNaN(parsedDate.getTime())) {
    return `Departure · ${flight.departure_date}`
  }

  return `Departure · ${parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`
}

function getStatusLabel(flight: BusinessSavedFlightLabData) {
  if (flight.completed_at) return "Completed"
  if (flight.status) return flight.status
  return "Active"
}

function getSignalLabel(flight: BusinessSavedFlightLabData) {
  if (flight.signal) return flight.signal
  if (flight.booking_signal) return flight.booking_signal
  if (flight.latest_price != null && flight.price != null) {
    const latestPrice = Number(flight.latest_price)
    const savedPrice = Number(flight.price)

    if (
      Number.isFinite(latestPrice) &&
      Number.isFinite(savedPrice) &&
      latestPrice < savedPrice
    ) {
      return "Improved"
    }

    if (
      Number.isFinite(latestPrice) &&
      Number.isFinite(savedPrice) &&
      latestPrice > savedPrice
    ) {
      return "Increased"
    }
  }

  return "Watching"
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