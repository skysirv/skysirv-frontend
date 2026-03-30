"use client"

import { useState } from "react"

type RouteSearchProps = {
  onRouteAdded?: (route: any) => void
}

export default function RouteSearch({ onRouteAdded }: RouteSearchProps) {

  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [isMonitoring, setIsMonitoring] = useState(false)

  function handleMonitorRoute() {

    if (!origin || !destination || !departureDate) {
      return
    }

    setIsMonitoring(true)

    const newRoute = {
      origin,
      destination,
      departureDate
    }

    // simulate backend processing delay
    setTimeout(() => {

      if (onRouteAdded) {
        onRouteAdded(newRoute)
      }

      setOrigin("")
      setDestination("")
      setDepartureDate("")

      setIsMonitoring(false)

    }, 600)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">

      <h2 className="text-lg font-semibold text-slate-900">
        Track a Route
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Start monitoring airfare intelligence for a specific route.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">

        <input
          type="text"
          placeholder="Origin (ex: BOS)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        <input
          type="text"
          placeholder="Destination (ex: LHR)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

      </div>

      <button
        onClick={handleMonitorRoute}
        disabled={isMonitoring}
        className="mt-6 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isMonitoring ? "Monitoring..." : "Start Monitoring"}
      </button>

    </div>
  )
}