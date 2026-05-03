"use client"

import { useEffect } from "react"
import { notFound } from "next/navigation"
import DashboardFlightAttendant from "@/components/flight-attendant/DashboardFlightAttendant"
import RouteSearch from "@/components/dashboard/route-search"
import BusinessWatchlistIntelligenceLab from "@/components/dashboard/lab/business-watchlist-intelligence-lab"
import BusinessSavedRoutesLab from "@/components/dashboard/lab/business-saved-routes-lab"
import BusinessPortfolioIntelligenceLab from "@/components/dashboard/lab/business-portfolio-intelligence-lab"
import BusinessIntelligenceWrappedLab from "@/components/dashboard/lab/business-intelligence-wrapped-lab"

export default function BusinessDashboardLabPage() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

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
                <p className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                  Business Plan Dashboard
                </p>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  Your full flight intelligence dashboard
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
                  Monitor tracked routes, build pricing history over time, and
                  unlock a fuller intelligence layer designed to surface richer
                  route context as real data begins to accumulate.
                </p>
              </div>

              <DashboardFlightAttendant
                tier="business"
                placement="inline"
                defaultOpen
              />
            </div>
          </section>

          <div className="mb-10">
            <RouteSearch theme="light" />
          </div>

          <BusinessWatchlistIntelligenceLab watchlist={[]} />

          <BusinessSavedRoutesLab savedFlights={[]} />

          <BusinessPortfolioIntelligenceLab
            watchlist={[]}
            savedFlights={[]}
          />

          <BusinessIntelligenceWrappedLab
            wrappedLoading={false}
            wrappedData={{
              flights: 0,
              countries: 0,
              distance: "0 km",
              skyscore: 0,
              savings: 0,
              avgSavings: 0,
              beatMarket: 0,
              routesMonitored: 0,
              alertsTriggered: 0,
              alertsWon: 0,
              travelerIdentity: "Precision Booker",
              bestRoute: {
                route: "—",
                saved: 0,
                beforeSpike: "—",
                timingGrade: "—",
              },
            }}
            selectedYear={2026}
            availableWrappedYears={[2026]}
            setSelectedYear={() => { }}
            globeAirportNodes={[]}
            globeRouteArcs={[]}
          />
        </div>
      </div>
    </section>
  )
}