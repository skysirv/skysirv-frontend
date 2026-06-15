"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "@/components/ui/Toasts/use-toast"
import { AirportOption, searchAirports } from "@/lib/airports/major-airports"
import { getAuthToken } from "@/utils/auth-storage"
import CompactDatePicker from "@/components/booking/shared/CompactDatePicker"

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

type RouteSearchTheme = "light" | "dark"

type RouteSearchProps = {
  onRouteAdded?: (route: WatchlistRoute) => void
  theme?: RouteSearchTheme
}

type AirportPickerProps = {
  label: string
  placeholder: string
  query: string
  selectedAirport: AirportOption | null
  onQueryChange: (value: string) => void
  onSelect: (airport: AirportOption) => void
  excludeCode?: string | null
  inputClassName?: string
  labelClassName?: string
  dropdownClassName?: string
  dropdownItemClassName?: string
  dropdownMetaClassName?: string
  icon?: React.ReactNode
}

type MultiCitySegment = {
  origin: AirportOption | null
  destination: AirportOption | null
  originQuery: string
  destinationQuery: string
  date: string
}

function AirportPicker({
  label,
  placeholder,
  query,
  selectedAirport,
  onQueryChange,
  onSelect,
  excludeCode,
  inputClassName,
  labelClassName,
  dropdownClassName,
  dropdownItemClassName,
  dropdownMetaClassName,
  icon,
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
      <label className={labelClassName ?? "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"}>
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-blue-700">
            {icon}
          </span>
        )}

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
          className={
            inputClassName ??
            "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          }
        />
      </div>

      {open && (
        <div
          className={
            dropdownClassName ??
            "absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
          }
        >
          {results.length === 0 ? (
            <div className={dropdownMetaClassName ?? "px-3 py-3 text-sm text-slate-500"}>
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
                className={
                  dropdownItemClassName ??
                  "flex w-full items-start justify-between rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
                }
              >
                <div>
                  <div
                    className={
                      dropdownMetaClassName
                        ? "text-sm font-semibold text-white"
                        : "text-sm font-semibold text-slate-900"
                    }
                  >
                    {airport.city} — {airport.code}
                  </div>
                  <div className={dropdownMetaClassName ?? "mt-1 text-xs text-slate-500"}>
                    {airport.name}
                  </div>
                </div>

                <div
                  className={
                    dropdownMetaClassName
                      ? "ml-4 text-[11px] uppercase tracking-[0.14em] text-slate-500"
                      : "ml-4 text-[11px] uppercase tracking-[0.14em] text-slate-400"
                  }
                >
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

function SearchFieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="10.75"
        cy="10.75"
        r="6.25"
        stroke="currentColor"
        strokeWidth="2.35"
      />
      <path
        d="M15.5 15.5 20 20"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CalendarFieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 4v3M17 4v3M5.5 9.5h13"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="6"
        width="16"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.2"
      />
    </svg>
  )
}

function formatDateForStorage(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatDateForDisplay(value: string): string {
  if (!value) return ""

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date)
}

function parseStoredDate(value: string): Date | undefined {
  if (!value) return undefined

  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export default function RouteSearch({
  onRouteAdded,
  theme = "light",
}: RouteSearchProps) {
  const isDark = theme === "dark"

  const cardClassName = isDark
    ? "rounded-[2rem] border border-white/10 bg-slate-950/50 p-6 shadow-[0_22px_65px_rgba(0,0,0,0.28)] transition-shadow hover:shadow-[0_28px_80px_rgba(0,0,0,0.34)]"
    : "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_24px_65px_rgba(15,23,42,0.09)]"

  const titleClassName = isDark
    ? "text-lg font-bold text-white"
    : "text-lg font-semibold text-slate-800"

  const descriptionClassName = isDark
    ? "mt-1 text-sm leading-6 text-slate-400"
    : "mt-1 text-sm leading-6 text-slate-700"

  const inactiveTabClassName = isDark
    ? "text-slate-300 hover:text-white"
    : "text-slate-700 hover:text-slate-950"

  const activeTabClassName = isDark
    ? "text-white"
    : "text-slate-950"

  const inactiveTabDotClassName = isDark
    ? "border-white/25 bg-transparent"
    : "border-slate-300 bg-white"

  const activeTabDotClassName = isDark
    ? "border-blue-400 bg-blue-400"
    : "border-blue-700 bg-blue-700"

  const labelClassName = isDark
    ? "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
    : "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"

  const inputClassName = isDark
    ? "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 pl-12 text-sm font-semibold text-white placeholder:font-semibold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
    : "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm font-semibold text-slate-950 placeholder:font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100"

  const readOnlyInputClassName = isDark
    ? "w-full cursor-pointer rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 pl-12 text-sm font-semibold text-white placeholder:font-semibold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
    : "w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm font-semibold text-slate-950 placeholder:font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100"

  const dropdownClassName = isDark
    ? "absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-slate-950 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
    : undefined

  const dropdownItemClassName = isDark
    ? "flex w-full items-start justify-between rounded-lg px-3 py-3 text-left transition hover:bg-white/[0.06]"
    : undefined

  const dropdownMetaClassName = isDark
    ? "mt-1 text-xs text-slate-400"
    : undefined

  const multiCityBuilderClassName = isDark
    ? "mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.04] p-5"
    : "mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5"

  const multiCityTitleClassName = isDark
    ? "text-sm font-semibold text-white"
    : "text-sm font-semibold text-slate-900"

  const multiCityDescriptionClassName = isDark
    ? "mt-2 text-sm text-slate-400"
    : "mt-2 text-sm text-slate-600"

  const addLegButtonClassName = isDark
    ? "text-sm font-semibold text-cyan-200 hover:text-white"
    : "text-sm font-semibold text-slate-700 hover:text-slate-900"

  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "multicity">("oneway")

  const [originQuery, setOriginQuery] = useState("")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState<AirportOption | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<AirportOption | null>(null)

  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false)
  const [showRoundtripCalendar, setShowRoundtripCalendar] = useState(false)
  const [roundtripSelectionPhase, setRoundtripSelectionPhase] = useState<"departure" | "return">("departure")
  const [isMonitoring, setIsMonitoring] = useState(false)

  const [multiCitySegments, setMultiCitySegments] = useState<MultiCitySegment[]>([
    {
      origin: null,
      destination: null,
      originQuery: "",
      destinationQuery: "",
      date: "",
    },
  ])
  const [multiCityCalendarIndex, setMultiCityCalendarIndex] = useState<number | null>(null)

  function resetMultiCitySegments() {
    setMultiCitySegments([
      {
        origin: null,
        destination: null,
        originQuery: "",
        destinationQuery: "",
        date: "",
      },
    ])
    setMultiCityCalendarIndex(null)
  }

  async function createWatchlistRoute({
    token,
    origin,
    destination,
    date,
  }: {
    token: string
    origin: string
    destination: string
    date: string
  }): Promise<WatchlistRoute> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        origin,
        destination,
        departureDate: date,
      }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(data?.error ?? "Something went wrong while starting route monitoring.")
    }

    return data as WatchlistRoute
  }

  async function createMultiCityWatchlist({
    token,
    legs,
  }: {
    token: string
    legs: {
      origin: string
      destination: string
      departureDate: string
    }[]
  }): Promise<{ success: true; legs: WatchlistRoute[] }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        legs,
      }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(data?.error ?? "Something went wrong while starting route monitoring.")
    }

    return data as { success: true; legs: WatchlistRoute[] }
  }

  async function handleMonitorRoute() {
    const token = getAuthToken()

    if (!token) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to monitor a route.",
      })
      return
    }

    if (tripType === "multicity") {
      const normalizedLegs = multiCitySegments.map((segment) => ({
        origin: segment.origin?.code?.trim().toUpperCase() ?? "",
        destination: segment.destination?.code?.trim().toUpperCase() ?? "",
        departureDate: segment.date,
      }))

      const hasMissingFields = normalizedLegs.some(
        (leg) => !leg.origin || !leg.destination || !leg.departureDate
      )

      if (hasMissingFields) {
        toast({
          title: "Missing multi-city details",
          description: "Please complete origin, destination, and departure date for every leg.",
        })
        return
      }

      const hasInvalidLeg = normalizedLegs.some(
        (leg) => leg.origin === leg.destination
      )

      if (hasInvalidLeg) {
        toast({
          title: "Invalid route",
          description: "Origin and destination cannot be the same airport on any leg.",
        })
        return
      }

      setIsMonitoring(true)

      try {
        const response = await createMultiCityWatchlist({
          token,
          legs: normalizedLegs,
        })

        if (onRouteAdded) {
          response.legs.forEach((route) => onRouteAdded(route))
        }

        toast({
          title: "Multi-city route added",
          description: "Monitoring has started across every leg of your journey.",
        })

        resetMultiCitySegments()
        setTripType("oneway")
      } catch (error) {
        console.error("Multi-city watchlist create request failed", error)

        toast({
          title: "Could not add multi-city route",
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong while starting multi-city monitoring.",
        })
      } finally {
        setIsMonitoring(false)
      }

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
      setShowDepartureCalendar(false)
      setShowRoundtripCalendar(false)
      setRoundtripSelectionPhase("departure")

      return
    }

    setIsMonitoring(true)

    try {
      const outboundRoute = await createWatchlistRoute({
        token,
        origin: normalizedOrigin,
        destination: normalizedDestination,
        date: departureDate,
      })

      if (onRouteAdded) {
        onRouteAdded(outboundRoute)
      }

      if (tripType === "roundtrip") {
        const inboundRoute = await createWatchlistRoute({
          token,
          origin: normalizedDestination,
          destination: normalizedOrigin,
          date: returnDate,
        })

        if (onRouteAdded) {
          onRouteAdded(inboundRoute)
        }
      }

      toast({
        title: tripType === "roundtrip" ? "Round-trip routes added" : "Route added",
        description:
          tripType === "roundtrip"
            ? "Outbound and return monitoring have started."
            : "Route monitoring has started.",
      })

      setOriginQuery("")
      setDestinationQuery("")
      setSelectedOrigin(null)
      setSelectedDestination(null)
      setDepartureDate("")
      setReturnDate("")
      setTripType("oneway")
      setShowDepartureCalendar(false)
      setShowRoundtripCalendar(false)
      setRoundtripSelectionPhase("departure")
    } catch (error) {
      console.error("Watchlist create request failed", error)

      toast({
        title: "Could not add route",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while starting route monitoring.",
      })
    } finally {
      setIsMonitoring(false)
    }
  }

  return (
    <div className={cardClassName}>
      <h2 className={titleClassName}>Track a Route</h2>

      <p className={descriptionClassName}>
        Search major airports worldwide and start monitoring airfare intelligence.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={() => {
            resetMultiCitySegments()
            setTripType("oneway")
          }}
          className={`inline-flex items-center gap-2 text-sm font-semibold transition ${tripType === "oneway" ? activeTabClassName : inactiveTabClassName
            }`}
        >
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${tripType === "oneway" ? activeTabDotClassName : inactiveTabDotClassName
              }`}
            aria-hidden="true"
          >
            {tripType === "oneway" && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </span>
          One-way
        </button>

        <button
          type="button"
          onClick={() => {
            resetMultiCitySegments()
            setTripType("roundtrip")
          }}
          className={`inline-flex items-center gap-2 text-sm font-semibold transition ${tripType === "roundtrip" ? activeTabClassName : inactiveTabClassName
            }`}
        >
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${tripType === "roundtrip" ? activeTabDotClassName : inactiveTabDotClassName
              }`}
            aria-hidden="true"
          >
            {tripType === "roundtrip" && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </span>
          Round-trip
        </button>

        <button
          type="button"
          onClick={() => setTripType("multicity")}
          className={`inline-flex items-center gap-2 text-sm font-semibold transition ${tripType === "multicity" ? activeTabClassName : inactiveTabClassName
            }`}
        >
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${tripType === "multicity" ? activeTabDotClassName : inactiveTabDotClassName
              }`}
            aria-hidden="true"
          >
            {tripType === "multicity" && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </span>
          Multi-city
        </button>
      </div>

      {tripType === "multicity" ? (
        <div className={multiCityBuilderClassName}>
          <div className={multiCityTitleClassName}>
            Multi-city route builder
          </div>

          <p className={multiCityDescriptionClassName}>
            Build a multi-city journey with stopovers along the way. Track pricing across every leg — from departure to final destination.
          </p>

          <div className="mt-4 space-y-4">
            {multiCitySegments.map((segment, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-3">
                <AirportPicker
                  label={`Leg ${index + 1} Origin`}
                  placeholder="Search airport"
                  query={segment.originQuery}
                  selectedAirport={segment.origin}
                  onQueryChange={(value) => {
                    const updated = [...multiCitySegments]
                    updated[index].originQuery = value
                    updated[index].origin = null
                    setMultiCitySegments(updated)
                  }}
                  onSelect={(airport) => {
                    const updated = [...multiCitySegments]
                    updated[index].origin = airport
                    updated[index].originQuery = `${airport.city} (${airport.code})`
                    setMultiCitySegments(updated)
                  }}
                  inputClassName={inputClassName}
                  labelClassName={labelClassName}
                  dropdownClassName={dropdownClassName}
                  dropdownItemClassName={dropdownItemClassName}
                  dropdownMetaClassName={dropdownMetaClassName}
                  icon={<SearchFieldIcon />}
                />

                <AirportPicker
                  label={`Leg ${index + 1} Destination`}
                  placeholder="Search airport"
                  query={segment.destinationQuery}
                  selectedAirport={segment.destination}
                  onQueryChange={(value) => {
                    const updated = [...multiCitySegments]
                    updated[index].destinationQuery = value
                    updated[index].destination = null
                    setMultiCitySegments(updated)
                  }}
                  onSelect={(airport) => {
                    const updated = [...multiCitySegments]
                    updated[index].destination = airport
                    updated[index].destinationQuery = `${airport.city} (${airport.code})`
                    setMultiCitySegments(updated)
                  }}
                  inputClassName={inputClassName}
                  labelClassName={labelClassName}
                  dropdownClassName={dropdownClassName}
                  dropdownItemClassName={dropdownItemClassName}
                  dropdownMetaClassName={dropdownMetaClassName}
                  excludeCode={segment.origin?.code ?? null}
                  icon={<SearchFieldIcon />}
                />

                <div className="relative">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Leg {index + 1} Departure Date
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-blue-700">
                      <CalendarFieldIcon />
                    </span>

                    <input
                      type="text"
                      readOnly
                      value={formatDateForDisplay(segment.date)}
                      placeholder="Select date"
                      onClick={() =>
                        setMultiCityCalendarIndex((prev) => (prev === index ? null : index))
                      }
                      className={readOnlyInputClassName}
                    />
                  </div>

                  {multiCityCalendarIndex === index && (
                    <CompactDatePicker
                      mode="single"
                      range={{ start: null, end: null }}
                      singleDate={parseStoredDate(segment.date) ?? null}
                      onSelectDate={(date) => {
                        const iso = formatDateForStorage(date)

                        const updated = [...multiCitySegments]
                        updated[index].date = iso
                        setMultiCitySegments(updated)
                      }}
                      onClose={() => setMultiCityCalendarIndex(null)}
                    />
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setMultiCitySegments((prev) => [
                  ...prev,
                  {
                    origin: null,
                    destination: null,
                    originQuery: "",
                    destinationQuery: "",
                    date: "",
                  },
                ])
              }
              className={addLegButtonClassName}
            >
              + Add another leg
            </button>
          </div>
        </div>
      ) : (
        <div className="relative mt-6">
          <div
            className={`grid gap-4 ${tripType === "roundtrip" ? "md:grid-cols-4" : "md:grid-cols-3"
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
              inputClassName={inputClassName}
              labelClassName={labelClassName}
              dropdownClassName={dropdownClassName}
              dropdownItemClassName={dropdownItemClassName}
              dropdownMetaClassName={dropdownMetaClassName}
              excludeCode={selectedDestination?.code ?? null}
              icon={<SearchFieldIcon />}
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
              inputClassName={inputClassName}
              labelClassName={labelClassName}
              dropdownClassName={dropdownClassName}
              dropdownItemClassName={dropdownItemClassName}
              dropdownMetaClassName={dropdownMetaClassName}
              excludeCode={selectedOrigin?.code ?? null}
              icon={<SearchFieldIcon />}
            />

            {tripType === "roundtrip" ? (
              <div className="relative grid gap-4 md:col-span-2 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Departure Date
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-blue-700">
                      <CalendarFieldIcon />
                    </span>

                    <input
                      type="text"
                      readOnly
                      value={formatDateForDisplay(departureDate)}
                      placeholder="Select date"
                      onClick={() => {
                        setRoundtripSelectionPhase("departure")
                        setShowRoundtripCalendar(true)
                      }}
                      className={readOnlyInputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Return Date
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-blue-700">
                      <CalendarFieldIcon />
                    </span>

                    <input
                      type="text"
                      readOnly
                      value={formatDateForDisplay(returnDate)}
                      placeholder="Select date"
                      onClick={() => {
                        setRoundtripSelectionPhase("return")
                        setShowRoundtripCalendar(true)
                      }}
                      className={
                        showRoundtripCalendar && roundtripSelectionPhase === "return"
                          ? `${readOnlyInputClassName} border-blue-700 ring-4 ring-blue-100`
                          : readOnlyInputClassName
                      }
                    />
                  </div>
                </div>

                {showRoundtripCalendar && (
                  <CompactDatePicker
                    mode="range"
                    range={{
                      start: parseStoredDate(departureDate) ?? null,
                      end: parseStoredDate(returnDate) ?? null,
                    }}
                    singleDate={null}
                    onSelectDate={(date) => {
                      const iso = formatDateForStorage(date)

                      if (!departureDate || returnDate) {
                        setDepartureDate(iso)
                        setReturnDate("")
                        setRoundtripSelectionPhase("return")
                        return
                      }

                      if (iso < departureDate) {
                        setDepartureDate(iso)
                        setReturnDate("")
                        setRoundtripSelectionPhase("return")
                        return
                      }

                      setReturnDate(iso)
                    }}
                    onClose={() => setShowRoundtripCalendar(false)}
                  />
                )}
              </div>
            ) : (
              <div className="relative">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Departure Date
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-blue-700">
                    <CalendarFieldIcon />
                  </span>

                  <input
                    type="text"
                    readOnly
                    value={formatDateForDisplay(departureDate)}
                    placeholder="Select date"
                    onClick={() => {
                      setShowDepartureCalendar((prev) => !prev)
                    }}
                    className={readOnlyInputClassName}
                  />
                </div>

                {showDepartureCalendar && (
                  <CompactDatePicker
                    mode="single"
                    range={{ start: null, end: null }}
                    singleDate={parseStoredDate(departureDate) ?? null}
                    onSelectDate={(date) => {
                      const iso = formatDateForStorage(date)

                      setDepartureDate(iso)

                      if (returnDate && returnDate < iso) {
                        setReturnDate("")
                      }
                    }}
                    onClose={() => setShowDepartureCalendar(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleMonitorRoute}
        disabled={isMonitoring}
        className="mt-6 rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isMonitoring ? "Monitoring..." : "Start Monitoring"}
      </button>
    </div>
  )
}