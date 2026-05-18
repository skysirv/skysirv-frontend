"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import {
  searchBookingOffers,
  type BookingCabinClass,
  type BookingOffer,
  type BookingTripType,
} from "@/lib/booking-api"
import { AirportOption, searchAirports } from "@/lib/airports/major-airports"

type SearchLeg = {
  origin: AirportOption | null
  destination: AirportOption | null
  originQuery: string
  destinationQuery: string
  date: string
}

type SelectOption = {
  value: string
  label: string
}

export type BookingSearchContext = {
  tripType: BookingTripType
  routeTitle: string
  originCode?: string
  destinationCode?: string
  departureDate?: string
  returnDate?: string
  legs?: {
    origin: string
    destination: string
    departureDate: string
  }[]
}

export type BookingSearchSuccessPayload = {
  offers: BookingOffer[]
  offerRequestId: string
  liveMode: boolean
  context: BookingSearchContext
}

type BookingSearchPanelProps = {
  onSearchStart: () => void
  onSearchSuccess: (payload: BookingSearchSuccessPayload) => void
  onSearchError: (message: string) => void
}

const MAX_PASSENGERS = 9

const cabinClassOptions: {
  value: BookingCabinClass
  label: string
}[] = [
    { value: "economy", label: "Economy" },
    { value: "premium_economy", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
  ]

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

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

function formatPassengerSummary({
  adults,
  children,
  infants,
  cabinClass,
}: {
  adults: number
  children: number
  infants: number
  cabinClass: BookingCabinClass
}) {
  const parts = [
    `${adults} adult${adults === 1 ? "" : "s"}`,
    children > 0 ? `${children} child${children === 1 ? "" : "ren"}` : null,
    infants > 0 ? `${infants} infant${infants === 1 ? "" : "s"}` : null,
  ].filter(Boolean)

  const cabinLabel =
    cabinClassOptions.find((option) => option.value === cabinClass)?.label ??
    "Economy"

  return `${parts.join(", ")}, ${cabinLabel}`
}

const calendarDayPickerClassNames = {
  day_selected: "bg-slate-900 text-white hover:bg-slate-800",
  day_today: "border border-slate-400",
  day: "rounded-md hover:bg-slate-100 transition",
  head_cell: "text-xs font-semibold text-slate-500",
  caption: "text-sm font-semibold text-slate-900",
  caption_label: "text-sm font-semibold text-slate-900",
  nav_button: "text-slate-600 hover:text-slate-900",
  table: "w-full border-collapse space-y-1",
  row: "flex w-full mt-1",
  cell: "text-center text-sm p-0 relative",
}

export default function BookingSearchPanel({
  onSearchStart,
  onSearchSuccess,
  onSearchError,
}: BookingSearchPanelProps) {
  const [tripType, setTripType] = useState<BookingTripType>("one_way")

  const [originQuery, setOriginQuery] = useState("")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState<AirportOption | null>(null)
  const [selectedDestination, setSelectedDestination] =
    useState<AirportOption | null>(null)

  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")

  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [cabinClass, setCabinClass] = useState<BookingCabinClass>("economy")
  const [maxConnections, setMaxConnections] = useState(1)

  const [multiCitySegments, setMultiCitySegments] = useState<SearchLeg[]>([
    {
      origin: null,
      destination: null,
      originQuery: "",
      destinationQuery: "",
      date: "",
    },
    {
      origin: null,
      destination: null,
      originQuery: "",
      destinationQuery: "",
      date: "",
    },
  ])

  const [isSearching, setIsSearching] = useState(false)

  function resetResultsForMode(nextTripType: BookingTripType) {
    setTripType(nextTripType)
    setReturnDate(nextTripType === "one_way" ? "" : returnDate)
  }

  function updateMultiCitySegment(index: number, updates: Partial<SearchLeg>) {
    setMultiCitySegments((current) =>
      current.map((segment, segmentIndex) =>
        segmentIndex === index ? { ...segment, ...updates } : segment
      )
    )
  }

  function addMultiCitySegment() {
    setMultiCitySegments((current) => [
      ...current,
      {
        origin: null,
        destination: null,
        originQuery: "",
        destinationQuery: "",
        date: "",
      },
    ])
  }

  function removeMultiCitySegment(index: number) {
    setMultiCitySegments((current) =>
      current.length <= 2
        ? current
        : current.filter((_, segmentIndex) => segmentIndex !== index)
    )
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSearchStart()
    setIsSearching(true)

    try {
      if (infants > adults) {
        throw new Error("Infants on lap cannot exceed the number of adults.")
      }

      if (adults + children + infants > MAX_PASSENGERS) {
        throw new Error(`Passenger total cannot exceed ${MAX_PASSENGERS}.`)
      }

      if (tripType === "multi_city") {
        const legs = multiCitySegments.map((segment) => ({
          origin:
            segment.origin?.code ?? segment.originQuery.trim().toUpperCase(),
          destination:
            segment.destination?.code ??
            segment.destinationQuery.trim().toUpperCase(),
          departureDate: segment.date,
        }))

        const incompleteLegIndex = legs.findIndex(
          (leg) =>
            leg.origin.length !== 3 ||
            leg.destination.length !== 3 ||
            !leg.departureDate
        )

        if (incompleteLegIndex !== -1) {
          throw new Error(
            `Complete leg ${incompleteLegIndex + 1} with valid airports and a departure date.`
          )
        }

        const sameAirportLegIndex = legs.findIndex(
          (leg) => leg.origin === leg.destination
        )

        if (sameAirportLegIndex !== -1) {
          throw new Error(
            `Leg ${sameAirportLegIndex + 1} origin and destination must be different airports.`
          )
        }

        const result = await searchBookingOffers({
          tripType: "multi_city",
          legs,
          adults,
          children,
          infants,
          cabinClass,
          maxConnections,
        })

        onSearchSuccess({
          offers: result.offers,
          offerRequestId: result.offerRequestId,
          liveMode: result.liveMode,
          context: {
            tripType: "multi_city",
            routeTitle: legs
              .map((leg) => `${leg.origin} → ${leg.destination}`)
              .join(" · "),
            legs,
          },
        })

        return
      }

      const origin = selectedOrigin?.code ?? originQuery.trim().toUpperCase()
      const destination =
        selectedDestination?.code ?? destinationQuery.trim().toUpperCase()

      if (origin.length !== 3 || destination.length !== 3) {
        throw new Error(
          "Enter valid 3-letter airport codes or select airports from the list."
        )
      }

      if (origin === destination) {
        throw new Error("Origin and destination must be different airports.")
      }

      if (!departureDate) {
        throw new Error("Choose a departure date.")
      }

      if (tripType === "round_trip" && !returnDate) {
        throw new Error("Choose a return date.")
      }

      const result = await searchBookingOffers({
        tripType,
        origin,
        destination,
        departureDate,
        returnDate: tripType === "round_trip" ? returnDate : null,
        adults,
        children,
        infants,
        cabinClass,
        maxConnections,
      })

      onSearchSuccess({
        offers: result.offers,
        offerRequestId: result.offerRequestId,
        liveMode: result.liveMode,
        context: {
          tripType,
          routeTitle:
            tripType === "round_trip"
              ? `${origin} → ${destination} → ${origin}`
              : `${origin} → ${destination}`,
          originCode: origin,
          destinationCode: destination,
          departureDate,
          returnDate: tripType === "round_trip" ? returnDate : undefined,
        },
      })
    } catch (error) {
      onSearchError(
        error instanceof Error
          ? error.message
          : "Unable to complete this flight search right now."
      )
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="mx-auto mt-7 max-w-6xl rounded-[2rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_28px_80px_rgba(15,23,42,0.09)] sm:mt-14">
      <form onSubmit={handleSearch}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            <TripTypeButton
              active={tripType === "one_way"}
              label="One-way"
              onClick={() => resetResultsForMode("one_way")}
            />
            <TripTypeButton
              active={tripType === "round_trip"}
              label="Round-trip"
              onClick={() => resetResultsForMode("round_trip")}
            />
            <TripTypeButton
              active={tripType === "multi_city"}
              label="Multi-city"
              onClick={() => resetResultsForMode("multi_city")}
            />
          </div>
        </div>

        {tripType === "multi_city" ? (
          <div className="mt-6 space-y-4">
            {multiCitySegments.map((segment, index) => (
              <div
                key={index}
                className="grid gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 md:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <AirportPicker
                  label={`From ${index + 1}`}
                  placeholder={
                    index === 0 ? "Boston or BOS" : "Miami or MIA"
                  }
                  query={segment.originQuery}
                  selectedAirport={segment.origin}
                  excludeCode={segment.destination?.code ?? null}
                  onQueryChange={(value) =>
                    updateMultiCitySegment(index, {
                      originQuery: value,
                      origin: null,
                    })
                  }
                  onSelect={(airport) =>
                    updateMultiCitySegment(index, {
                      origin: airport,
                      originQuery: `${airport.city} (${airport.code})`,
                    })
                  }
                />

                <AirportPicker
                  label={`To ${index + 1}`}
                  placeholder={
                    index === 0 ? "Miami or MIA" : "New York or JFK"
                  }
                  query={segment.destinationQuery}
                  selectedAirport={segment.destination}
                  excludeCode={segment.origin?.code ?? null}
                  onQueryChange={(value) =>
                    updateMultiCitySegment(index, {
                      destinationQuery: value,
                      destination: null,
                    })
                  }
                  onSelect={(airport) =>
                    updateMultiCitySegment(index, {
                      destination: airport,
                      destinationQuery: `${airport.city} (${airport.code})`,
                    })
                  }
                />

                <SingleDatePicker
                  label="Departure Date"
                  value={segment.date}
                  placeholder="Select date"
                  onChange={(date) =>
                    updateMultiCitySegment(index, {
                      date,
                    })
                  }
                />

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeMultiCitySegment(index)}
                    disabled={multiCitySegments.length <= 2}
                    className="h-11 rounded-full px-4 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-4 pt-1 lg:flex-row lg:items-end lg:justify-between">
              <button
                type="button"
                onClick={addMultiCitySegment}
                className="w-fit rounded-full px-1 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
              >
                + Add another city
              </button>

              <div className="grid w-full gap-4 lg:max-w-xl lg:grid-cols-[1fr_0.75fr]">
                <TravelersCabinPicker
                  adults={adults}
                  children={children}
                  infants={infants}
                  cabinClass={cabinClass}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                  onInfantsChange={setInfants}
                  onCabinClassChange={setCabinClass}
                />

                <SkysirvSelect
                  label="Stops"
                  value={String(maxConnections)}
                  onChange={(value) => setMaxConnections(Number(value))}
                  options={[
                    { value: "0", label: "Nonstop" },
                    { value: "1", label: "Up to 1 stop" },
                    { value: "2", label: "Up to 2 stops" },
                  ]}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative mt-6">
            <div
              className={
                tripType === "round_trip"
                  ? "grid gap-4 lg:grid-cols-[1.1fr_1.1fr_1fr_1fr_0.95fr_0.75fr]"
                  : "grid gap-4 lg:grid-cols-[1.2fr_1.2fr_1fr_0.95fr_0.75fr]"
              }
            >
              <AirportPicker
                label="Origin"
                placeholder="Search by airport, city, or code"
                query={originQuery}
                selectedAirport={selectedOrigin}
                excludeCode={selectedDestination?.code ?? null}
                onQueryChange={(value) => {
                  setOriginQuery(value)
                  setSelectedOrigin(null)
                }}
                onSelect={(airport) => {
                  setSelectedOrigin(airport)
                  setOriginQuery(`${airport.city} (${airport.code})`)
                }}
              />

              <AirportPicker
                label="Destination"
                placeholder="Search by airport, city, or code"
                query={destinationQuery}
                selectedAirport={selectedDestination}
                excludeCode={selectedOrigin?.code ?? null}
                onQueryChange={(value) => {
                  setDestinationQuery(value)
                  setSelectedDestination(null)
                }}
                onSelect={(airport) => {
                  setSelectedDestination(airport)
                  setDestinationQuery(`${airport.city} (${airport.code})`)
                }}
              />

              {tripType === "round_trip" ? (
                <RoundTripDatePicker
                  departureDate={departureDate}
                  returnDate={returnDate}
                  onDepartureChange={(date) => {
                    setDepartureDate(date)

                    if (returnDate && returnDate < date) {
                      setReturnDate("")
                    }
                  }}
                  onReturnChange={setReturnDate}
                />
              ) : (
                <SingleDatePicker
                  label="Departure Date"
                  value={departureDate}
                  placeholder="Select date"
                  onChange={(date) => {
                    setDepartureDate(date)

                    if (returnDate && returnDate < date) {
                      setReturnDate("")
                    }
                  }}
                />
              )}

              <TravelersCabinPicker
                adults={adults}
                children={children}
                infants={infants}
                cabinClass={cabinClass}
                onAdultsChange={setAdults}
                onChildrenChange={setChildren}
                onInfantsChange={setInfants}
                onCabinClassChange={setCabinClass}
              />

              <SkysirvSelect
                label="Stops"
                value={String(maxConnections)}
                onChange={(value) => setMaxConnections(Number(value))}
                options={[
                  { value: "0", label: "Nonstop" },
                  { value: "1", label: "Up to 1 stop" },
                  { value: "2", label: "Up to 2 stops" },
                ]}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500">
            Live offer search is active. Passenger checkout will follow once
            confirmation and payment flows are production-ready.
          </p>

          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? "Searching..." : "Search flights"}
          </button>
        </div>
      </form>
    </div>
  )
}

function AirportPicker({
  label,
  placeholder,
  query,
  selectedAirport,
  onQueryChange,
  onSelect,
  excludeCode,
}: {
  label: string
  placeholder: string
  query: string
  selectedAirport: AirportOption | null
  onQueryChange: (value: string) => void
  onSelect: (airport: AirportOption) => void
  excludeCode?: string | null
}) {
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
      <FieldLabel>{label}</FieldLabel>

      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onFocus={() => {
          if (query.trim().length >= 2) setOpen(true)
        }}
        onChange={(event) => {
          const value = event.target.value
          onQueryChange(value)
          setOpen(value.trim().length >= 2)
        }}
        className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_22px_60px_rgba(15,23,42,0.12)] sm:right-auto sm:mt-3 sm:min-w-[430px] sm:max-w-[32rem]">
          <div className="max-h-80 overflow-y-auto pr-1">
            {results.length === 0 ? (
              <div className="px-4 py-4 text-sm text-slate-500">
                No matching airports found.
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((airport) => (
                  <button
                    key={airport.code}
                    type="button"
                    onClick={() => {
                      onSelect(airport)
                      setOpen(false)
                    }}
                    className="flex w-full items-start justify-between gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-semibold leading-6 text-slate-950">
                        {airport.city} — {airport.code}
                      </div>
                      <div className="mt-1 text-sm leading-5 text-slate-500">
                        {airport.name}
                      </div>
                    </div>

                    <div className="shrink-0 pt-1 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {airport.country}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SingleDatePicker({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (date: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState<Date | undefined>(undefined)
  const calendarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!calendarRef.current) return

      if (!calendarRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={calendarRef} className="relative">
      <FieldLabel>{label}</FieldLabel>

      <input
        type="text"
        readOnly
        value={formatDateForDisplay(value)}
        placeholder={placeholder}
        onClick={() => {
          setMonth(parseStoredDate(value))
          setOpen((current) => !current)
        }}
        className="w-full cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />

      {open && (
        <div className="absolute z-30 mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          <DayPicker
            mode="single"
            month={month ?? parseStoredDate(value)}
            onMonthChange={setMonth}
            selected={parseStoredDate(value)}
            disabled={{ before: startOfToday() }}
            className="text-sm"
            classNames={calendarDayPickerClassNames}
            onSelect={(date) => {
              if (!date) return

              onChange(formatDateForStorage(date))
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function RoundTripDatePicker({
  departureDate,
  returnDate,
  onDepartureChange,
  onReturnChange,
}: {
  departureDate: string
  returnDate: string
  onDepartureChange: (date: string) => void
  onReturnChange: (date: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<"departure" | "return">("departure")
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined)
  const [month, setMonth] = useState<Date | undefined>(undefined)
  const calendarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!calendarRef.current) return

      if (!calendarRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={calendarRef} className="relative grid gap-4 lg:col-span-2 lg:grid-cols-2">
      <div>
        <FieldLabel>Departure Date</FieldLabel>

        <input
          type="text"
          readOnly
          value={formatDateForDisplay(departureDate)}
          placeholder="Select date"
          onClick={() => {
            setPhase("departure")
            setMonth(parseStoredDate(departureDate) ?? parseStoredDate(returnDate))
            setOpen(true)
          }}
          className="w-full cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      <div>
        <FieldLabel>Return Date</FieldLabel>

        <input
          type="text"
          readOnly
          value={formatDateForDisplay(returnDate)}
          placeholder="Select date"
          onClick={() => {
            setPhase("return")
            setMonth(parseStoredDate(departureDate) ?? parseStoredDate(returnDate))
            setOpen(true)
          }}
          className={
            open && phase === "return"
              ? "w-full cursor-pointer rounded-lg border border-slate-900 px-4 py-2 text-sm font-normal text-slate-950 outline-none ring-2 ring-slate-300"
              : "w-full cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          }
        />
      </div>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-8">
              <div className="text-sm font-semibold text-slate-900">
                {phase === "departure"
                  ? "Select departure date"
                  : "Select return date"}
              </div>

              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {phase === "departure" ? "Step 1 of 2" : "Step 2 of 2"}
              </div>
            </div>

            <DayPicker
              mode="range"
              month={
                month ??
                parseStoredDate(departureDate) ??
                parseStoredDate(returnDate)
              }
              onMonthChange={setMonth}
              numberOfMonths={2}
              pagedNavigation
              fixedWeeks
              selected={
                departureDate
                  ? {
                    from: parseStoredDate(departureDate),
                    to:
                      returnDate
                        ? parseStoredDate(returnDate)
                        : phase === "return"
                          ? hoveredDate
                          : undefined,
                  }
                  : undefined
              }
              disabled={
                phase === "return" && departureDate
                  ? { before: parseStoredDate(departureDate)! }
                  : { before: startOfToday() }
              }
              className="text-sm"
              classNames={{
                ...calendarDayPickerClassNames,
                months: "flex flex-col gap-4 sm:flex-row sm:gap-8",
                month: "space-y-4",
                day_selected: "bg-slate-900 text-white hover:bg-slate-800",
                day_range_start: "bg-slate-900 text-white rounded-md",
                day_range_end: "bg-slate-900 text-white rounded-md",
                day_range_middle: "bg-slate-100 text-slate-900",
              }}
              onSelect={(range, selectedDay) => {
                if (!selectedDay) return

                const selectedIso = formatDateForStorage(selectedDay)

                if (phase === "departure") {
                  onDepartureChange(selectedIso)
                  onReturnChange("")
                  setHoveredDate(undefined)
                  setPhase("return")
                  setMonth(parseStoredDate(selectedIso))
                  return
                }

                if (departureDate && selectedIso < departureDate) return

                onReturnChange(selectedIso)
                setHoveredDate(undefined)
                setOpen(false)
              }}
              onDayMouseEnter={(date) => {
                if (phase === "return") {
                  setHoveredDate(date)
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function TravelersCabinPicker({
  adults,
  children,
  infants,
  cabinClass,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onCabinClassChange,
}: {
  adults: number
  children: number
  infants: number
  cabinClass: BookingCabinClass
  onAdultsChange: (value: number) => void
  onChildrenChange: (value: number) => void
  onInfantsChange: (value: number) => void
  onCabinClassChange: (value: BookingCabinClass) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const totalPassengers = adults + children + infants
  const selectedSummary = formatPassengerSummary({
    adults,
    children,
    infants,
    cabinClass,
  })

  function increaseAdults() {
    if (totalPassengers >= MAX_PASSENGERS) return
    onAdultsChange(adults + 1)
  }

  function decreaseAdults() {
    if (adults <= 1) return

    const nextAdults = adults - 1
    onAdultsChange(nextAdults)

    if (infants > nextAdults) {
      onInfantsChange(nextAdults)
    }
  }

  function increaseChildren() {
    if (totalPassengers >= MAX_PASSENGERS) return
    onChildrenChange(children + 1)
  }

  function decreaseChildren() {
    if (children <= 0) return
    onChildrenChange(children - 1)
  }

  function increaseInfants() {
    if (totalPassengers >= MAX_PASSENGERS || infants >= adults) return
    onInfantsChange(infants + 1)
  }

  function decreaseInfants() {
    if (infants <= 0) return
    onInfantsChange(infants - 1)
  }

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
      <FieldLabel>Travelers & Cabin</FieldLabel>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-left text-sm font-normal text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        <span className="truncate">{selectedSummary}</span>
        <ChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-[22rem] overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white p-3 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
          <div className="px-1 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Travelers
          </div>

          <div className="space-y-2">
            <PassengerCounter
              title="Adults"
              description="18+"
              value={adults}
              decrementDisabled={adults <= 1}
              incrementDisabled={totalPassengers >= MAX_PASSENGERS}
              onDecrement={decreaseAdults}
              onIncrement={increaseAdults}
            />

            <PassengerCounter
              title="Children"
              description="0–17"
              value={children}
              decrementDisabled={children <= 0}
              incrementDisabled={totalPassengers >= MAX_PASSENGERS}
              onDecrement={decreaseChildren}
              onIncrement={increaseChildren}
            />

            <PassengerCounter
              title="Infants on lap"
              description="Under 2"
              value={infants}
              decrementDisabled={infants <= 0}
              incrementDisabled={
                totalPassengers >= MAX_PASSENGERS || infants >= adults
              }
              onDecrement={decreaseInfants}
              onIncrement={increaseInfants}
            />
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="px-1 pb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Cabin Class
            </div>

            <div className="grid grid-cols-2 gap-2">
              {cabinClassOptions.map((option) => {
                const isSelected = option.value === cabinClass

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onCabinClassChange(option.value)}
                    className={`rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${isSelected
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                      }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">
              Max {MAX_PASSENGERS} travelers total.
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PassengerCounter({
  title,
  description,
  value,
  decrementDisabled,
  incrementDisabled,
  onDecrement,
  onIncrement,
}: {
  title: string
  description: string
  value: number
  decrementDisabled: boolean
  incrementDisabled: boolean
  onDecrement: () => void
  onIncrement: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-xl px-2 py-2.5">
      <div>
        <div className="text-sm font-semibold text-slate-950">{title}</div>
        <div className="mt-0.5 text-xs text-slate-500">{description}</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={decrementDisabled}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-lg leading-none text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
        >
          −
        </button>

        <span className="w-5 text-center text-sm font-semibold text-slate-950">
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrement}
          disabled={incrementDisabled}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-lg leading-none text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
        >
          +
        </button>
      </div>
    </div>
  )
}

function SkysirvSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedOption = options.find((option) => option.value === value)

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
      <FieldLabel>{label}</FieldLabel>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-left text-sm font-normal text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        <span className="truncate">{selectedOption?.label ?? value}</span>
        <ChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-full min-w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition ${isSelected
                  ? "bg-slate-900 font-semibold text-white"
                  : "font-normal text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  }`}
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <span className="text-xs text-slate-300">Selected</span>
                ) : null}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
      {children}
    </label>
  )
}

function TripTypeButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${active
        ? "bg-slate-900 text-white"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
    >
      {label}
    </button>
  )
}

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0 text-slate-500"
      fill="none"
    >
      <path
        d="M5.5 7.5 10 12l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}