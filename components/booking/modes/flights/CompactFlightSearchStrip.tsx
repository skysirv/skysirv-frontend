import { useEffect, useRef, useState, type ReactNode } from "react"

import AirportCodeField from "@/components/booking/shared/AirportCodeField"
import CompactDateField from "@/components/booking/shared/CompactDateField"
import CompactDatePicker from "@/components/booking/shared/CompactDatePicker"
import TravelersField from "@/components/booking/shared/TravelersField"
import type {
  DateRange,
  TravelersState,
} from "@/components/booking/shared/bookingLabTypes"
import {
  formatBookingDate,
  formatDateRange,
} from "@/components/booking/shared/bookingLabUtils"
import type {
  BookingCabinClass,
  BookingSearchPayload,
} from "@/lib/booking-api"

type EditableTripType = "one_way" | "round_trip" | "multi_city"

type SelectOption = {
  label: string
  value: string
}

type CalendarTarget =
  | {
    type: "main"
  }
  | {
    type: "segment"
    segmentId: string
  }

type CompactFlightSegment = {
  id: string
  origin: string
  destination: string
  departureDate: Date | null
}

const tripTypeOptions: SelectOption[] = [
  {
    label: "One-way",
    value: "one_way",
  },
  {
    label: "Round-trip",
    value: "round_trip",
  },
  {
    label: "Multi-destination",
    value: "multi_city",
  },
]

const cabinOptions: SelectOption[] = [
  {
    label: "Economy",
    value: "Economy",
  },
  {
    label: "Premium Economy",
    value: "Premium Economy",
  },
  {
    label: "Business",
    value: "Business",
  },
  {
    label: "First",
    value: "First",
  },
]

function parseApiDate(value?: string | null): Date | null {
  if (!value) return null

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)

  return Number.isNaN(date.getTime()) ? null : date
}

function formatDateForApi(date: Date | null): string {
  if (!date) return ""

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function normalizeAirportCode(value: string): string {
  const normalized = value.trim().toUpperCase()
  const parenthesizedCode = normalized.match(/\(([A-Z0-9]{3})\)/)

  if (parenthesizedCode?.[1]) {
    return parenthesizedCode[1]
  }

  return normalized
}

function getCabinLabel(cabinClass: BookingCabinClass): string {
  const labels: Record<BookingCabinClass, string> = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First",
  }

  return labels[cabinClass]
}

function mapCabinClass(label: string): BookingCabinClass {
  const normalized = label.trim().toLowerCase()

  if (normalized.includes("premium")) return "premium_economy"
  if (normalized.includes("business")) return "business"
  if (normalized.includes("first")) return "first"

  return "economy"
}

function getTravelerState(payload: BookingSearchPayload): TravelersState {
  return {
    adults: payload.adults,
    children: payload.children ?? 0,
    infants: payload.infants ?? 0,
  }
}

function getEditableTripType(payload: BookingSearchPayload): EditableTripType {
  if (payload.tripType === "multi_city") return "multi_city"
  if (payload.tripType === "round_trip") return "round_trip"

  return "one_way"
}

function buildInitialSegments(
  payload: BookingSearchPayload,
): CompactFlightSegment[] {
  if (payload.tripType === "multi_city" && payload.legs?.length) {
    return payload.legs.map((leg, index) => ({
      id: `segment-${index + 1}`,
      origin: leg.origin,
      destination: leg.destination,
      departureDate: parseApiDate(leg.departureDate),
    }))
  }

  return [
    {
      id: "segment-1",
      origin: payload.origin ?? "",
      destination: payload.destination ?? "",
      departureDate: parseApiDate(payload.departureDate),
    },
    {
      id: "segment-2",
      origin: payload.destination ?? "",
      destination: "",
      departureDate: parseApiDate(payload.returnDate),
    },
  ]
}

function createSegmentId(index: number): string {
  return `segment-${index + 1}-${Date.now()}`
}

export default function CompactFlightSearchStrip({
  payload,
  loading,
  onSearch,
}: {
  payload: BookingSearchPayload
  loading: boolean
  onSearch: (payload: BookingSearchPayload) => void
}) {
  const [tripType, setTripType] = useState<EditableTripType>(
    getEditableTripType(payload),
  )
  const [origin, setOrigin] = useState(payload.origin ?? "")
  const [destination, setDestination] = useState(payload.destination ?? "")
  const [range, setRange] = useState<DateRange>({
    start: parseApiDate(payload.departureDate),
    end: parseApiDate(payload.returnDate),
  })
  const [segments, setSegments] = useState<CompactFlightSegment[]>(
    buildInitialSegments(payload),
  )
  const [calendarTarget, setCalendarTarget] = useState<CalendarTarget | null>(
    null,
  )
  const [travelers, setTravelers] = useState<TravelersState>(
    getTravelerState(payload),
  )
  const [cabinClass, setCabinClass] = useState(getCabinLabel(payload.cabinClass))
  const [includeNearbyAirports, setIncludeNearbyAirports] = useState(
    Boolean(payload.includeNearbyAirports),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTripType(getEditableTripType(payload))
    setOrigin(payload.origin ?? "")
    setDestination(payload.destination ?? "")
    setRange({
      start: parseApiDate(payload.departureDate),
      end: parseApiDate(payload.returnDate),
    })
    setSegments(buildInitialSegments(payload))
    setTravelers(getTravelerState(payload))
    setCabinClass(getCabinLabel(payload.cabinClass))
    setIncludeNearbyAirports(Boolean(payload.includeNearbyAirports))
    setError(null)
    setCalendarTarget(null)
  }, [payload])

  function handleTripTypeChange(value: string) {
    const nextTripType = value as EditableTripType

    setTripType(nextTripType)
    setError(null)
    setCalendarTarget(null)

    if (nextTripType === "one_way") {
      setRange((current) => ({
        start: current.start,
        end: null,
      }))
      return
    }

    if (nextTripType === "multi_city") {
      setIncludeNearbyAirports(false)
      setSegments([
        {
          id: "segment-1",
          origin,
          destination,
          departureDate: range.start,
        },
        {
          id: "segment-2",
          origin: destination,
          destination: "",
          departureDate: range.end,
        },
      ])
    }
  }

  function handleMainRangeSelect(date: Date) {
    if (tripType === "one_way") {
      setRange({
        start: date,
        end: null,
      })
      setCalendarTarget(null)
      return
    }

    if (!range.start || range.end) {
      setRange({
        start: date,
        end: null,
      })
      return
    }

    if (date < range.start) {
      setRange({
        start: date,
        end: null,
      })
      return
    }

    setRange({
      start: range.start,
      end: date,
    })
    setCalendarTarget(null)
  }

  function updateSegment(
    segmentId: string,
    updates: Partial<CompactFlightSegment>,
  ) {
    setSegments((current) =>
      current.map((segment) =>
        segment.id === segmentId
          ? {
            ...segment,
            ...updates,
          }
          : segment,
      ),
    )
  }

  function updateSegmentDate(segmentId: string, date: Date) {
    updateSegment(segmentId, {
      departureDate: date,
    })
    setCalendarTarget(null)
  }

  function addSegment() {
    setSegments((current) => {
      if (current.length >= 6) return current

      const previousSegment = current[current.length - 1]

      return [
        ...current,
        {
          id: createSegmentId(current.length),
          origin: previousSegment?.destination ?? "",
          destination: "",
          departureDate: null,
        },
      ]
    })
  }

  function removeSegment(segmentId: string) {
    setSegments((current) => {
      if (current.length <= 2) return current

      return current.filter((segment) => segment.id !== segmentId)
    })
  }

  function handleSubmitStandardSearch() {
    const originCode = normalizeAirportCode(origin)
    const destinationCode = normalizeAirportCode(destination)
    const departureDate = formatDateForApi(range.start)
    const returnDate = formatDateForApi(range.end)

    if (originCode.length !== 3 || destinationCode.length !== 3) {
      setError("Enter valid 3-letter airport codes.")
      return
    }

    if (originCode === destinationCode) {
      setError("Origin and destination must be different.")
      return
    }

    if (!departureDate) {
      setError("Choose a departure date.")
      return
    }

    if (tripType === "round_trip" && !returnDate) {
      setError("Choose a return date.")
      return
    }

    onSearch({
      ...payload,
      tripType,
      origin: originCode,
      destination: destinationCode,
      departureDate,
      returnDate: tripType === "round_trip" ? returnDate : null,
      adults: travelers.adults,
      children: travelers.children,
      infants: travelers.infants,
      cabinClass: mapCabinClass(cabinClass),
      includeNearbyAirports,
    })
  }

  function handleSubmitMultiCitySearch() {
    const legs = segments.map((segment) => ({
      origin: normalizeAirportCode(segment.origin),
      destination: normalizeAirportCode(segment.destination),
      departureDate: formatDateForApi(segment.departureDate),
    }))

    const incompleteLegIndex = legs.findIndex(
      (leg) =>
        leg.origin.length !== 3 ||
        leg.destination.length !== 3 ||
        !leg.departureDate,
    )

    if (incompleteLegIndex !== -1) {
      setError(
        `Complete flight ${incompleteLegIndex + 1} with valid airport codes and a departure date.`,
      )
      return
    }

    const sameAirportLegIndex = legs.findIndex(
      (leg) => leg.origin === leg.destination,
    )

    if (sameAirportLegIndex !== -1) {
      setError(
        `Flight ${sameAirportLegIndex + 1} origin and destination must be different airports.`,
      )
      return
    }

    onSearch({
      provider: "duffel",
      tripType: "multi_city",
      legs,
      adults: travelers.adults,
      children: travelers.children,
      infants: travelers.infants,
      cabinClass: mapCabinClass(cabinClass),
      maxConnections: payload.maxConnections ?? 1,
      includeNearbyAirports: false,
    })
  }

  function handleSubmit() {
    setError(null)

    if (tripType === "multi_city") {
      handleSubmitMultiCitySearch()
      return
    }

    handleSubmitStandardSearch()
  }

  return (
    <div className="relative left-1/2 z-[300] w-[min(1180px,calc(100vw-48px))] -translate-x-1/2">
      <div className="relative z-[80] mb-2 flex flex-wrap items-center gap-x-6 gap-y-2">
        <CompactInlineSelect
          value={tripType}
          options={tripTypeOptions}
          dropdownClassName="w-[520px]"
          onChange={handleTripTypeChange}
        />

        <CompactInlineSelect
          value={cabinClass}
          options={cabinOptions}
          dropdownClassName="w-[360px]"
          onChange={setCabinClass}
        />

        {tripType !== "multi_city" ? (
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold leading-none text-slate-800">
            <input
              type="checkbox"
              checked={includeNearbyAirports}
              onChange={(event) =>
                setIncludeNearbyAirports(event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-200"
            />

            <span>Include nearby airports</span>
          </label>
        ) : null}
      </div>

      {tripType === "multi_city" ? (
        <MultiCityCompactRows
          segments={segments}
          travelers={travelers}
          loading={loading}
          calendarTarget={calendarTarget}
          onSetCalendarTarget={setCalendarTarget}
          onUpdateSegment={updateSegment}
          onUpdateSegmentDate={updateSegmentDate}
          onRemoveSegment={removeSegment}
          onTravelersChange={setTravelers}
          onAddSegment={addSegment}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="relative z-[10] grid w-full items-center gap-2 xl:grid-cols-[minmax(230px,1fr)_minmax(230px,1fr)_minmax(180px,0.8fr)_minmax(165px,0.7fr)_110px]">
          <CompactAirportFieldShell>
            <AirportCodeField
              placeholder="Leaving from"
              value={origin}
              excludeCode={destination}
              onChange={setOrigin}
            />
          </CompactAirportFieldShell>

          <CompactAirportFieldShell>
            <AirportCodeField
              placeholder="Going to"
              value={destination}
              excludeCode={origin}
              onChange={setDestination}
            />
          </CompactAirportFieldShell>

          <div className="relative">
            <CompactDateField
              compact
              placeholder={tripType === "round_trip" ? "Dates" : "Date"}
              value={
                tripType === "round_trip"
                  ? formatDateRange(range)
                  : formatBookingDate(range.start)
              }
              onClick={() =>
                setCalendarTarget({
                  type: "main",
                })
              }
            />

            {calendarTarget?.type === "main" ? (
              <CompactDatePicker
                mode={tripType === "round_trip" ? "range" : "single"}
                range={range}
                singleDate={range.start}
                onSelectDate={handleMainRangeSelect}
                onClose={() => setCalendarTarget(null)}
              />
            ) : null}
          </div>

          <TravelersField
            compact
            travelers={travelers}
            onChange={setTravelers}
          />

          <SearchStripButton loading={loading} onClick={handleSubmit} />
        </div>
      )}

      {error ? (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function MultiCityCompactRows({
  segments,
  travelers,
  loading,
  calendarTarget,
  onSetCalendarTarget,
  onUpdateSegment,
  onUpdateSegmentDate,
  onRemoveSegment,
  onTravelersChange,
  onAddSegment,
  onSubmit,
}: {
  segments: CompactFlightSegment[]
  travelers: TravelersState
  loading: boolean
  calendarTarget: CalendarTarget | null
  onSetCalendarTarget: (target: CalendarTarget | null) => void
  onUpdateSegment: (
    segmentId: string,
    updates: Partial<CompactFlightSegment>,
  ) => void
  onUpdateSegmentDate: (segmentId: string, date: Date) => void
  onRemoveSegment: (segmentId: string) => void
  onTravelersChange: (travelers: TravelersState) => void
  onAddSegment: () => void
  onSubmit: () => void
}) {
  return (
    <div className="space-y-2">
      {segments.map((segment, index) => (
        <div
          key={segment.id}
          className="grid w-full items-center gap-2 xl:grid-cols-[minmax(230px,1fr)_minmax(230px,1fr)_minmax(180px,0.8fr)_minmax(165px,0.7fr)_110px]"
        >
          <CompactAirportFieldShell>
            <AirportCodeField
              placeholder="Leaving from"
              value={segment.origin}
              excludeCode={segment.destination}
              onChange={(value) =>
                onUpdateSegment(segment.id, {
                  origin: value,
                })
              }
            />
          </CompactAirportFieldShell>

          <CompactAirportFieldShell>
            <AirportCodeField
              placeholder="Where to?"
              value={segment.destination}
              excludeCode={segment.origin}
              onChange={(value) =>
                onUpdateSegment(segment.id, {
                  destination: value,
                })
              }
            />
          </CompactAirportFieldShell>

          <div className="relative">
            <CompactDateField
              compact
              placeholder="Date"
              value={formatBookingDate(segment.departureDate)}
              onClick={() =>
                onSetCalendarTarget({
                  type: "segment",
                  segmentId: segment.id,
                })
              }
            />

            {calendarTarget?.type === "segment" &&
              calendarTarget.segmentId === segment.id ? (
              <CompactDatePicker
                mode="single"
                range={{
                  start: segment.departureDate,
                  end: null,
                }}
                singleDate={segment.departureDate}
                onSelectDate={(date) => onUpdateSegmentDate(segment.id, date)}
                onClose={() => onSetCalendarTarget(null)}
              />
            ) : null}
          </div>

          {index === 0 ? (
            <TravelersField
              compact
              travelers={travelers}
              onChange={onTravelersChange}
            />
          ) : (
            <button
              type="button"
              onClick={() => onRemoveSegment(segment.id)}
              className="inline-flex h-[46px] items-center justify-center rounded-lg text-2xl font-light text-blue-700 transition hover:bg-blue-50 hover:text-blue-800"
              aria-label={`Remove flight ${index + 1}`}
            >
              ×
            </button>
          )}

          {index === 0 ? (
            <SearchStripButton loading={loading} onClick={onSubmit} />
          ) : (
            <div />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={onAddSegment}
        className="inline-flex min-h-[34px] items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-800"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded border border-blue-700 text-sm leading-none">
          +
        </span>
        Add Flight
      </button>
    </div>
  )
}

function CompactAirportFieldShell({ children }: { children: ReactNode }) {
  return (
    <div className="[&>label>input]:!h-[46px] [&>label>input]:!min-h-[46px] [&>label>input]:rounded-lg [&>label>input]:border-slate-300 [&>label>input]:py-0 [&>label>input]:pl-12 [&>label>input]:pr-3 [&>label>input]:text-sm">
      {children}
    </div>
  )
}

function SearchStripButton({
  loading,
  onClick,
}: {
  loading: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex h-[46px] items-center justify-center rounded-lg bg-blue-700 px-5 text-sm font-black text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? "Searching..." : "Search"}
    </button>
  )
}

function CompactInlineSelect({
  value,
  options,
  dropdownClassName,
  onChange,
}: {
  value: string
  options: SelectOption[]
  dropdownClassName: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current) return

      if (!dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
      >
        <span>{selectedOption.label}</span>

        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
        >
          <path
            d="M5.5 7.5 10 12l4.5-4.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          className={`absolute left-0 top-full z-[9999] mt-3 overflow-hidden rounded-[1rem] border border-slate-200 bg-white py-2 shadow-[0_22px_60px_rgba(15,23,42,0.18)] ${dropdownClassName}`}
        >
          {options.map((option) => {
            const selected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex min-h-[46px] w-full items-center justify-between gap-5 px-5 text-left text-sm font-normal leading-5 transition ${selected
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-800 hover:bg-blue-50 hover:text-blue-700"
                  }`}
              >
                <span>{option.label}</span>

                {selected ? (
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-blue-700"
                    fill="none"
                  >
                    <path
                      d="M4.5 10.2 8.1 13.8 15.7 6.2"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}