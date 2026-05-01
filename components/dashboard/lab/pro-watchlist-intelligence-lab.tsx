"use client"

import { useState } from "react"

const monitoredRoutes = [
  {
    route: "BOS → MIA",
    status: "Live Data",
    airports: "Boston Logan Intl Airport → Miami Intl Airport",
    date: "Departure · Apr 30, 2026",
    routeAverage: "$224",
    tracking: "Active",
    history: "Active",
    signal: "Good Deal",
    recommendedFlights: [{ airline: "American Airlines", price: "$186" }],
  },
  {
    route: "BOS → PTY",
    status: "Live Data",
    airports: "Boston Logan Intl Airport → Tocumen Intl Airport",
    date: "Departure · May 12, 2026",
    routeAverage: "$438",
    tracking: "Active",
    history: "Active",
    signal: "Watch",
    recommendedFlights: [
      { airline: "Copa Airlines", price: "$412" },
      { airline: "Avianca", price: "$447" },
    ],
  },
  {
    route: "MIA → VVI",
    status: "Building",
    airports: "Miami Intl Airport → Viru Viru Intl Airport",
    date: "Departure · Jun 2, 2026",
    routeAverage: "$506",
    tracking: "Active",
    history: "Active",
    signal: "Stable",
    recommendedFlights: [{ airline: "BoA", price: "$529" }],
  },
]

export default function ProWatchlistIntelligenceLab() {
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
            <span className="text-sm font-semibold text-slate-950">3</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Routes
            </span>
          </div>
        </div>

        <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.45)_rgba(241,245,249,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400">
          {monitoredRoutes.map((route) => {
            const isOpen = openRoute === route.route

            return (
              <article
                key={route.route}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-cyan-200 hover:bg-slate-50/60"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenRoute((current) =>
                      current === route.route ? null : route.route
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="shrink-0 text-sm font-semibold tracking-tight text-slate-950">
                        {route.route}
                      </span>

                      <span className="hidden text-slate-300 sm:inline">•</span>

                      <span className="min-w-0 truncate text-sm text-slate-600">
                        {route.airports}
                      </span>

                      <span className="hidden text-slate-300 md:inline">•</span>

                      <span className="shrink-0 text-sm text-slate-500">
                        {route.date}
                      </span>

                      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                        {route.status}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition ${isOpen
                      ? "rotate-180 border-cyan-200 bg-cyan-50 text-cyan-700"
                      : "hover:border-slate-300 hover:text-slate-700"
                      }`}
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

                {isOpen && (
                  <div className="border-t border-slate-200 px-4 pb-4 pt-3">
                    <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_auto]">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Recommended flights
                        </p>

                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {route.recommendedFlights.map((flight) => (
                            <button
                              key={`${route.route}-${flight.airline}-${flight.price}`}
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
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Route avg
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {route.routeAverage}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Tracking
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {route.tracking}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            History
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {route.history}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Signal
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            {route.signal}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          View intelligence
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}