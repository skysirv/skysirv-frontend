"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "@/components/ui/Toasts/use-toast"
import { AirportOption, searchAirports } from "@/lib/airports/major-airports"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

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

type AirportPickerProps = {
  label: string
  placeholder: string
  query: string
  selectedAirport: AirportOption | null
  onQueryChange: (value: string) => void
  onSelect: (airport: AirportOption) => void
  excludeCode?: string | null
}

function AirportPicker({
  label,
  placeholder,
  query,
  selectedAirport,
  onQueryChange,
  onSelect,
  excludeCode,
}: AirportPickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const results = useMemo(() => {
    if (query.trim().length < 2) return []

    return searchAirports(query)
      .filter((airport) => airport.code !== excludeCode)
      .slice(0, 8)
  }, [query, excludeCode])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onFocus={() => {
          if (query.trim().length >= 2) {
            setOpen(true)
          }
        }}
        onChange={(e) => {
          const value = e.target.value
          onQueryChange(value)
          setOpen(value.trim().length >= 2)
        }}
        className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
      />

      {open && (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
          {results.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-500">
              No matching airports found.
            </div>
          ) : (
            results.map((airport) => (
              <button
                key={airport.code}
                type="button"
                onClick={() => {
                  onSelect(airport)
                  setOpen(false)
                }}
                className="flex w-full items-start justify-between rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {airport.city} — {airport.code}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {airport.name}
                  </div>
                </div>

                <div className="ml-4 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  {airport.country}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function RouteSearch({ onRouteAdded }: RouteSearchProps) {
  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "multicity">("oneway")

  const [originQuery, setOriginQuery] = useState("")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState<AirportOption | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<AirportOption | null>(null)

  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(false)

  const departureCalendarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!departureCalendarRef.current) return

      if (!departureCalendarRef.current.contains(event.target as Node)) {
        setShowDepartureCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleMonitorRoute() {
    if (tripType === "multicity") {
      toast({
        title: "Multi-city coming next",
        description:
          "The new multi-city route mode is now visible in the UI. Segment entry and backend monitoring wiring are the next step.",
      })
      return
    }

    const normalizedOrigin = selectedOrigin?.code?.trim().toUpperCase() ?? ""
    const normalizedDestination = selectedDestination?.code?.trim().toUpperCase() ?? ""

    if (!normalizedOrigin || !normalizedDestination || !departureDate) {
      toast({
        title: "Missing route details",
        description: "Please choose an origin, destination, and departure date.",
      })
      return
    }

    if (tripType === "roundtrip" && !returnDate) {
      toast({
        title: "Missing return date",
        description: "Please choose a return date for this round-trip route.",
      })
      return
    }

    if (tripType === "roundtrip" && returnDate < departureDate) {
      toast({
        title: "Invalid return date",
        description: "Return date must be on or after the departure date.",
      })
      return
    }

    if (normalizedOrigin === normalizedDestination) {
      toast({
        title: "Invalid route",
        description: "Origin and destination cannot be the same airport.",
      })

      setOriginQuery("")
      setDestinationQuery("")
      setSelectedOrigin(null)
      setSelectedDestination(null)
      setDepartureDate("")
      setReturnDate("")
      setTripType("oneway")

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
        title: tripType === "roundtrip" ? "Round-trip route added" : "Route added",
        description:
          tripType === "roundtrip"
            ? "Round-trip monitoring UI is ready. Return-leg backend wiring comes next."
            : "Route monitoring has started.",
      })

      setOriginQuery("")
      setDestinationQuery("")
      setSelectedOrigin(null)
      setSelectedDestination(null)
      setDepartureDate("")
      setReturnDate("")
      setTripType("oneway")
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
        Search major airports worldwide and start monitoring airfare intelligence.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTripType("oneway")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${tripType === "oneway"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
        >
          One-way
        </button>

        <button
          type="button"
          onClick={() => setTripType("roundtrip")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${tripType === "roundtrip"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
        >
          Round-trip
        </button>

        <button
          type="button"
          onClick={() => setTripType("multicity")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${tripType === "multicity"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
        >
          Multi-city
        </button>
      </div>

      {tripType === "multicity" ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <div className="text-sm font-semibold text-slate-900">
            Multi-city route builder
          </div>

          <p className="mt-2 text-sm text-slate-600">
            This mode is now active in the UI. The next step is wiring leg-by-leg
            segment entry so travelers can monitor routes like BOS → PTY → VVI.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Leg 1 Origin
              </label>
              <div className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400">
                Coming next
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Leg 1 Destination
              </label>
              <div className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400">
                Coming next
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Leg 1 Departure Date
              </label>
              <div className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400">
                Coming next
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`mt-6 grid gap-4 ${tripType === "roundtrip" ? "md:grid-cols-4" : "md:grid-cols-3"
            }`}
        >
          <AirportPicker
            label="Origin"
            placeholder="Search by airport, city, or code"
            query={originQuery}
            selectedAirport={selectedOrigin}
            onQueryChange={(value) => {
              setOriginQuery(value)
              setSelectedOrigin(null)
            }}
            onSelect={(airport) => {
              setSelectedOrigin(airport)
              setOriginQuery(`${airport.city} (${airport.code})`)
            }}
            excludeCode={selectedDestination?.code ?? null}
          />

          <AirportPicker
            label="Destination"
            placeholder="Search by airport, city, or code"
            query={destinationQuery}
            selectedAirport={selectedDestination}
            onQueryChange={(value) => {
              setDestinationQuery(value)
              setSelectedDestination(null)
            }}
            onSelect={(airport) => {
              setSelectedDestination(airport)
              setDestinationQuery(`${airport.city} (${airport.code})`)
            }}
            excludeCode={selectedOrigin?.code ?? null}
          />

          <div className="relative">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Departure Date
            </label>

            <input
              type="text"
              readOnly
              value={departureDate}
              placeholder="Select date"
              onClick={() => setShowDepartureCalendar((prev) => !prev)}
              className="w-full cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />

            {showDepartureCalendar && (
              <div
                ref={departureCalendarRef}
                className="absolute z-30 mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
              >
                <DayPicker
                  mode="single"
                  selected={departureDate ? new Date(departureDate) : undefined}
                  className="text-sm"
                  classNames={{
                    day_selected: "bg-slate-900 text-white hover:bg-slate-800",
                    day_today: "border border-slate-400",
                    day: "rounded-md hover:bg-slate-100 transition",
                    head_cell: "text-xs font-semibold text-slate-500",
                    caption: "text-sm font-semibold text-slate-900",
                  }}
                  onSelect={(date) => {
                    if (!date) return
                    const iso = date.toISOString().split("T")[0]
                    setDepartureDate(iso)
                    setShowDepartureCalendar(false)
                  }}
                />
              </div>
            )}
          </div>

          {tripType === "roundtrip" && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Return Date
              </label>

              <input
                type="date"
                value={returnDate}
                min={departureDate || undefined}
                onChange={(e) => setReturnDate(e.target.value)}
                onClick={(e) => {
                  // force open picker on full field click
                  (e.target as HTMLInputElement).showPicker?.()
                }}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          )}
        </div>
      )}

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