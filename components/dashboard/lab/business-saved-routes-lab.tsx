"use client"

import { useState } from "react"

const savedRoutes = [
  {
    route: "LAX → SIN",
    airline: "EVA Air",
    flight: "BR 0023",
    date: "May 26, 2026",
    savedPrice: "$868",
    latestPrice: "$868",
    status: "Active",
    signal: "Volatile",
  },
  {
    route: "MIA → LAX",
    airline: "American Airlines",
    flight: "AA 1418",
    date: "May 20, 2026",
    savedPrice: "$387",
    latestPrice: "$377",
    status: "Active",
    signal: "Volatile",
  },
  {
    route: "JFK → LHR",
    airline: "British Airways",
    flight: "BA 112",
    date: "June 14, 2026",
    savedPrice: "$621",
    latestPrice: "$648",
    status: "Watching",
    signal: "Watching",
  },
]

export default function BusinessSavedRoutesLab() {
  const [openRoute, setOpenRoute] = useState<string | null>(null)

  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Saved Flights
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Saved fare decisions
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Flights you saved for closer tracking, comparison, and future trip history.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
            <span className="text-sm font-semibold text-white">3</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Saved
            </span>
          </div>
        </div>

        <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.35)_rgba(15,23,42,0.65)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-950/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600/60 [&::-webkit-scrollbar-thumb:hover]:bg-slate-500/80">
          {savedRoutes.map((route) => {
            const isOpen = openRoute === route.flight

            return (
              <article
                key={route.flight}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:border-cyan-300/30 hover:bg-white/[0.055]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenRoute((current) =>
                      current === route.flight ? null : route.flight
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

                      <span className="shrink-0 text-sm text-slate-400">
                        {route.airline}
                      </span>

                      <span className="hidden text-slate-600 md:inline">•</span>

                      <span className="shrink-0 text-sm text-slate-500">
                        {route.flight}
                      </span>

                      <span className="hidden text-slate-600 md:inline">•</span>

                      <span className="shrink-0 text-sm text-slate-500">
                        Departure · {route.date}
                      </span>

                      <span className="hidden text-slate-600 md:inline">•</span>

                      <span className="shrink-0 text-sm font-semibold text-white">
                        {route.savedPrice}
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
                    <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Saved price
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {route.savedPrice}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Latest price
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {route.latestPrice}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {route.status}
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

                      <div className="flex flex-wrap items-end justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
                        >
                          Open intelligence
                        </button>

                        <button
                          type="button"
                          className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
                        >
                          Mark completed
                        </button>

                        <button
                          type="button"
                          className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:border-red-300/40 hover:bg-red-400/15"
                        >
                          Delete
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