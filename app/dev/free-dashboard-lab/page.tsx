"use client"

import { useEffect } from "react"

import RouteSearch from "@/components/dashboard/route-search"
import FreeLucyPreviewLab from "@/components/dashboard/lab/free-lucy-preview-lab"
import FreeWatchlistLab from "@/components/dashboard/lab/free-watchlist-lab"
import FreeSavedFlightsLab from "@/components/dashboard/lab/free-saved-flights-lab"
import FreePremiumTeasersLab from "@/components/dashboard/lab/free-premium-teasers-lab"

export default function FreeDashboardLabPage() {
  useEffect(() => {
    const originalBackground = document.body.style.background
    const originalBackgroundColor = document.body.style.backgroundColor

    document.body.style.background = "rgb(255 255 255)"
    document.body.style.backgroundColor = "rgb(255 255 255)"

    return () => {
      document.body.style.background = originalBackground
      document.body.style.backgroundColor = originalBackgroundColor
    }
  }, [])

  return (
    <section className="min-h-screen bg-white text-slate-950">
      <div className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <section className="pb-14">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                    Free Dashboard
                  </p>

                  <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Basic Tracking
                  </p>
                </div>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  Start tracking flights with basic route intelligence
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
                  Monitor up to 3 routes, save up to 3 flights, and get a simple
                  view of fare movement before upgrading to deeper Skysirv
                  intelligence.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  <FreeHeroPill label="3 monitored routes" />
                  <FreeHeroPill label="3 saved flights" />
                  <FreeHeroPill label="Basic fare tracking" />
                  <FreeHeroPill label="Paid intelligence previews" />
                </div>
              </div>

              <FreeLucyPreviewLab />
            </div>
          </section>

          <div className="mb-10">
            <RouteSearch theme="light" />
          </div>

          <FreeWatchlistLab watchlist={[]} remainingRoutes={3} />

          <FreeSavedFlightsLab savedFlights={[]} remainingSavedFlights={3} />

          <FreePremiumTeasersLab />
        </div>
      </div>
    </section>
  )
}

function FreeHeroPill({ label }: { label: string }) {
  return (
    <div className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
      {label}
    </div>
  )
}