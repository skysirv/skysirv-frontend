"use client"

import { useEffect } from "react"

import DashboardFlightAttendant from "@/components/flight-attendant/DashboardFlightAttendant"
import RouteSearch from "@/components/dashboard/route-search"
import ProWatchlistIntelligenceLab from "@/components/dashboard/lab/pro-watchlist-intelligence-lab"
import ProSavedRoutesLab from "@/components/dashboard/lab/pro-saved-routes-lab"
import ProPortfolioIntelligenceLab from "@/components/dashboard/lab/pro-portfolio-intelligence-lab"
import ProIntelligenceWrappedLab from "@/components/dashboard/lab/pro-intelligence-wrapped-lab"

const isLifetimeProPreview = false

export default function ProDashboardLabPage() {
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

  const dashboardLabel = isLifetimeProPreview
    ? "Lifetime Pro Dashboard"
    : "Pro Plan Dashboard"

  return (
    <section className="min-h-screen bg-white text-slate-950">
      <div className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <section className="pb-14">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                    {dashboardLabel}
                  </p>

                  {isLifetimeProPreview ? (
                    <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                      Gifted Lifetime Pro Access
                    </p>
                  ) : null}
                </div>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  Your personal flight intelligence dashboard
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
                  Monitor up to 25 routes, track pricing behavior, review saved
                  flights, and use Skysirv intelligence to make calmer, better
                  timed booking decisions.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  <ProHeroPill label="25 monitored routes" />
                  <ProHeroPill label="High-frequency monitoring" />
                  <ProHeroPill label="Standard AI intelligence" />
                  <ProHeroPill label="Full Skyscore" />
                </div>
              </div>

              <DashboardFlightAttendant
                tier="pro"
                placement="inline"
                defaultOpen
              />
            </div>
          </section>

          <div className="mb-10">
            <RouteSearch theme="light" />
          </div>

          <ProWatchlistIntelligenceLab />

          <ProSavedRoutesLab />

          <ProPortfolioIntelligenceLab />

          <ProIntelligenceWrappedLab />
        </div>
      </div>
    </section>
  )
}

function ProHeroPill({ label }: { label: string }) {
  return (
    <div className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
      {label}
    </div>
  )
}