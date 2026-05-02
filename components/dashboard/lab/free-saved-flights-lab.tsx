"use client"

import { useState } from "react"

type FreeSavedFlight = {
  route: string
  airline: string
  flightNumber: string
  date: string
  savedPrice: string
  latestPrice: string
  status: string
  signal: string
}

const savedFlights: FreeSavedFlight[] = [
  {
    route: "BOS → MIA",
    airline: "American Airlines",
    flightNumber: "AA 1421",
    date: "Apr 30, 2026",
    savedPrice: "$192",
    latestPrice: "$192",
    status: "Saved",
    signal: "Basic watch",
  },
  {
    route: "BOS → PTY",
    airline: "Copa Airlines",
    flightNumber: "CM 704",
    date: "May 12, 2026",
    savedPrice: "$438",
    latestPrice: "$438",
    status: "Saved",
    signal: "Watching",
  },
  {
    route: "MIA → VVI",
    airline: "Boliviana de Aviación",
    flightNumber: "OB 767",
    date: "Jun 2, 2026",
    savedPrice: "$506",
    latestPrice: "$506",
    status: "Limit Slot",
    signal: "Basic watch",
  },
]

export default function FreeSavedFlightsLab() {
  const [openFlightNumber, setOpenFlightNumber] = useState<string | null>(null)

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
            <span className="text-sm font-semibold text-slate-950">3 / 3</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Saved
            </span>
          </div>
        </div>

        <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.45)_rgba(241,245,249,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400">
          {savedFlights.map((savedFlight) => {
            const isOpen = openFlightNumber === savedFlight.flightNumber

            const chevronClasses = isOpen
              ? "rotate-180 border-cyan-200 bg-cyan-50 text-cyan-700"
              : "hover:border-slate-300 hover:text-slate-700"

            return (
              <article
                key={`${savedFlight.route}-${savedFlight.flightNumber}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-cyan-200 hover:bg-slate-50/60"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFlightNumber((current) =>
                      current === savedFlight.flightNumber
                        ? null
                        : savedFlight.flightNumber
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="shrink-0 text-sm font-semibold tracking-tight text-slate-950">
                        {savedFlight.route}
                      </span>

                      <span className="hidden text-slate-300 sm:inline">•</span>

                      <span className="shrink-0 text-sm text-slate-600">
                        {savedFlight.airline}
                      </span>

                      <span className="hidden text-slate-300 md:inline">•</span>

                      <span className="shrink-0 text-sm text-slate-500">
                        {savedFlight.flightNumber}
                      </span>

                      <span className="hidden text-slate-300 md:inline">•</span>

                      <span className="shrink-0 text-sm text-slate-500">
                        Departure · {savedFlight.date}
                      </span>

                      <span className="hidden text-slate-300 md:inline">•</span>

                      <span className="shrink-0 text-sm font-semibold text-slate-950">
                        {savedFlight.savedPrice}
                      </span>

                      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                        {savedFlight.status}
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
                          {savedFlight.savedPrice}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Latest price
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-950">
                          {savedFlight.latestPrice}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-950">
                          {savedFlight.status}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Signal
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-950">
                          {savedFlight.signal}
                        </p>
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

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
          <p className="text-sm leading-6 text-slate-600">
            Free plans can save up to 3 flights. Upgrade to Pro to unlock Lucy
            guidance, deeper route context, and more saved-flight capacity.
          </p>
        </div>
      </div>
    </section>
  )
}