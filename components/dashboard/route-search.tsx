"use client"

import { useState } from "react"
import { toast } from "@/components/ui/Toasts/use-toast"

type WatchlistRoute = {
  id: string
  route?: string | null
  route_hash?: string | null
  origin?: string | null
  destination?: string | null
  departure_date?: string | null
  last_checked_at?: string | null
  created_at?: string | null
}

type RouteSearchProps = {
  onRouteAdded?: (route: WatchlistRoute) => void
}

export default function RouteSearch({ onRouteAdded }: RouteSearchProps) {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [isMonitoring, setIsMonitoring] = useState(false)

  async function handleMonitorRoute() {
    const normalizedOrigin = origin.trim().toUpperCase()
    const normalizedDestination = destination.trim().toUpperCase()

    if (!normalizedOrigin || !normalizedDestination || !departureDate) {
      toast({
        title: "Missing route details",
        description: "Please enter an origin, destination, and departure date.",
      })
      return
    }

    if (normalizedOrigin === normalizedDestination) {
      toast({
        title: "Invalid route",
        description: "Origin and destination cannot be the same airport.",
      })
      return
    }

    const token = localStorage.getItem("skysirv_token")

    if (!token) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to monitor a route.",
      })
      return
    }

    setIsMonitoring(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin: normalizedOrigin,
          destination: normalizedDestination,
          departureDate,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        console.error("Failed to create watchlist route", data)

        toast({
          title: "Could not add route",
          description:
            data?.error ?? "Something went wrong while starting route monitoring.",
        })
        return
      }

      if (onRouteAdded) {
        onRouteAdded(data)
      }

      toast({
        title: "Route added",
        description: "Route monitoring has started.",
      })

      setOrigin("")
      setDestination("")
      setDepartureDate("")
    } catch (error) {
      console.error("Watchlist create request failed", error)

      toast({
        title: "Request failed",
        description: "Something went wrong while contacting the server.",
      })
    } finally {
      setIsMonitoring(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
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
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        <input
          type="text"
          placeholder="Destination (ex: LHR)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-slate-300"
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
        className="mt-6 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isMonitoring ? "Monitoring..." : "Start Monitoring"}
      </button>
    </div>
  )
}