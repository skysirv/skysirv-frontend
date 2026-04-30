"use client"

import { useState } from "react"

const monitoredRoutes = [
  {
    route: "LAX → SIN",
    status: "Live Data",
    airports: "Los Angeles Intl Airport → Singapore Changi Airport",
    date: "Departure · May 26, 2026",
    routeAverage: "$989",
    tracking: "Active",
    history: "Active",
    signal: "Volatile",
    recommendedFlights: [
      { airline: "EVA Air", price: "$868" },
      { airline: "Air Canada", price: "$1,022" },
      { airline: "Asiana Airlines", price: "$1,092" },
      { airline: "JX", price: "$918" },
    ],
  },
  {
    route: "MIA → LAX",
    status: "Live Data",
    airports: "Miami Intl Airport → Los Angeles Intl Airport",
    date: "Departure · May 20, 2026",
    routeAverage: "$377",
    tracking: "Active",
    history: "Active",
    signal: "Volatile",
    recommendedFlights: [
      { airline: "American Airlines", price: "$387" },
      { airline: "Spirit Airlines", price: "$229" },
    ],
  },
  {
    route: "BOS → MIA",
    status: "Building",
    airports: "Boston Logan Intl Airport → Miami Intl Airport",
    date: "Departure · May 8, 2026",
    routeAverage: "$262",
    tracking: "Active",
    history: "Active",
    signal: "Stable",
    recommendedFlights: [{ airline: "American Airlines", price: "$258" }],
  },
]

export default function BusinessWatchlistIntelligenceLab() {
  const [openRoute, setOpenRoute] = useState<string | null>(null)

  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Watchlist Intelligence
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Monitored route portfolio
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Active tracked routes with fare context, signal state, and recommended flight availability.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
            <span className="text-sm font-semibold text-white">3</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Routes
            </span>
          </div>
        </div>

        <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.35)_rgba(15,23,42,0.65)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-950/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600/60 [&::-webkit-scrollbar-thumb:hover]:bg-slate-500/80">
          {monitoredRoutes.map((route) => {
            const isOpen = openRoute === route.route

            return (
              <article
                key={route.route}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:border-cyan-300/30 hover:bg-white/[0.055]"
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
                      <span className="shrink-0 text-sm font-semibold tracking-tight text-white">
                        {route.route}
                      </span>

                      <span className="hidden text-slate-600 sm:inline">•</span>

                      <span className="min-w-0 truncate text-sm text-slate-400">
                        {route.airports}
                      </span>

                      <span className="hidden text-slate-600 md:inline">•</span>

                      <span className="shrink-0 text-sm text-slate-500">
                        {route.date}
                      </span>

                      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                        {route.status}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition ${isOpen ? "rotate-180 text-cyan-200" : "hover:text-white"
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
                  <div className="border-t border-white/10 px-4 pb-4 pt-3">
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
                              className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2 text-left transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
                            >
                              <span className="min-w-0 truncate text-sm text-slate-300">
                                {flight.airline}
                              </span>

                              <span className="shrink-0 text-sm font-semibold text-white">
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
                          <p className="mt-1 text-sm font-semibold text-white">
                            {route.routeAverage}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Tracking
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {route.tracking}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            History
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {route.history}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Signal
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {route.signal}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
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