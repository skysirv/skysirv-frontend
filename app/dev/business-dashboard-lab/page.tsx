"use client"

import { useEffect } from "react"
import { notFound } from "next/navigation"
import DashboardFlightAttendant from "@/components/flight-attendant/DashboardFlightAttendant"
import RouteSearch from "@/components/dashboard/route-search"
import BusinessWatchlistIntelligenceLab from "@/components/dashboard/lab/business-watchlist-intelligence-lab"
import BusinessSavedRoutesLab from "@/components/dashboard/lab/business-saved-routes-lab"

export default function BusinessDashboardLabPage() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  useEffect(() => {
    const originalBackground = document.body.style.background
    const originalBackgroundColor = document.body.style.backgroundColor

    document.body.style.background =
      "linear-gradient(to bottom, rgb(2 6 23), rgb(2 6 23), rgb(15 23 42))"
    document.body.style.backgroundColor = "rgb(2 6 23)"

    return () => {
      document.body.style.background = originalBackground
      document.body.style.backgroundColor = originalBackgroundColor
    }
  }, [])

  return (
    <main className="min-h-screen bg-transparent text-white">
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Business Plan Dashboard
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Your full flight intelligence dashboard
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
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

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <RouteSearch theme="dark" />
      </section>

      <BusinessWatchlistIntelligenceLab />

      <BusinessSavedRoutesLab />
    </main>
  )
}