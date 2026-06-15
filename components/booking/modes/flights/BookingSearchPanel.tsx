import { useEffect, useState } from "react"

import CabinClassField from "@/components/booking/shared/CabinClassField"
import CompactDateField from "@/components/booking/shared/CompactDateField"
import CompactDatePicker from "@/components/booking/shared/CompactDatePicker"
import CompactRadioGroup from "@/components/booking/shared/CompactRadioGroup"
import SearchButton from "@/components/booking/shared/SearchButton"
import SearchOptionsAndButton from "@/components/booking/shared/SearchOptionsAndButton"
import TravelersField from "@/components/booking/shared/TravelersField"
import AirportCodeField from "@/components/booking/shared/AirportCodeField"
import type {
  CalendarMode,
  CalendarRequest,
  DateRange,
  FlightTripType,
  PlanToBookingHandoff,
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

type SearchFlightSegment = {
  id: string
  origin: string
  destination: string
  departureDate: Date | null
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

function mapFlightTripType(tripType: FlightTripType) {
  if (tripType === "round-trip") return "round_trip"
  if (tripType === "multi-city") return "multi_city"

  return "one_way"
}

function mapCabinClass(label: string): BookingCabinClass {
  const normalized = label.trim().toLowerCase()

  if (normalized.includes("premium")) return "premium_economy"
  if (normalized.includes("business")) return "business"
  if (normalized.includes("first")) return "first"

  return "economy"
}

export default function BookingSearchPanel({
  flightTripType,
  onFlightTripTypeChange,
  onSearch,
  loading = false,
  planHandoff,
}: {
  flightTripType: FlightTripType
  onFlightTripTypeChange: (tripType: FlightTripType) => void
  onSearch?: (payload: BookingSearchPayload) => void
  loading?: boolean
  planHandoff?: PlanToBookingHandoff | null
}) {
  const [calendarRequest, setCalendarRequest] = useState<CalendarRequest | null>(
    null,
  )

  const [flightRange, setFlightRange] = useState<DateRange>({
    start: null,
    end: null,
  })

  const [flightTravelers, setFlightTravelers] = useState<TravelersState>({
    adults: 1,
    children: 0,
    infants: 0,
  })

  const [flightCabinClass, setFlightCabinClass] = useState("Economy")

  const [flightOrigin, setFlightOrigin] = useState("")
  const [flightDestination, setFlightDestination] = useState("")
  const [includeNearbyAirports, setIncludeNearbyAirports] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (!planHandoff) return

    const directCabinLabel =
      planHandoff.confirmedAnswers?.["flight-comfort"]?.label

    const itineraryCabinLabel =
      planHandoff.confirmedAnswers?.["itinerary-flight-cabin"]?.label

    const cabinLabel =
      planHandoff.mode === "flights" ? directCabinLabel : itineraryCabinLabel

    if (cabinLabel) {
      setFlightCabinClass(cabinLabel)
    }
  }, [planHandoff])

  const [flightSegments, setFlightSegments] = useState<SearchFlightSegment[]>([
    {
      id: "segment-1",
      origin: "",
      destination: "",
      departureDate: null,
    },
    {
      id: "segment-2",
      origin: "",
      destination: "",
      departureDate: null,
    },
  ])

  function handleFlightTripTypeChange(nextTripType: FlightTripType) {
    onFlightTripTypeChange(nextTripType)
    setCalendarRequest(null)

    if (nextTripType === "multi-city") {
      setIncludeNearbyAirports(false)
    }
  }

  function addFlightSegment() {
    setFlightSegments((current) => {
      if (current.length >= 6) return current

      return [
        ...current,
        {
          id: `segment-${current.length + 1}`,
          origin: "",
          destination: "",
          departureDate: null,
        }
      ]
    })
  }

  function updateFlightSegment(
    segmentId: string,
    updates: Partial<SearchFlightSegment>,
  ) {
    setFlightSegments((current) =>
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
    updateFlightSegment(segmentId, {
      departureDate: date,
    })
  }

  function handleRangeSelect(
    date: Date,
    range: DateRange,
    setRange: (range: DateRange) => void,
  ) {
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

    setCalendarRequest(null)
  }

  function renderCalendarPopover({
    calendarKey,
    calendarMode,
    range,
    singleDate,
    onSelectDate,
  }: {
    calendarKey: string
    calendarMode: CalendarMode
    range: DateRange
    singleDate: Date | null
    onSelectDate: (date: Date) => void
  }) {
    if (calendarRequest?.key !== calendarKey) return null

    return (
      <CompactDatePicker
        mode={calendarMode}
        range={range}
        singleDate={singleDate}
        onSelectDate={onSelectDate}
        onClose={() => setCalendarRequest(null)}
      />
    )
  }

  function handleSearchClick() {
    setValidationError(null)

    const totalTravelers =
      flightTravelers.adults + flightTravelers.children + flightTravelers.infants

    if (flightTravelers.infants > flightTravelers.adults) {
      setValidationError("Infants on lap cannot exceed the number of adults.")
      return
    }

    if (totalTravelers > 9) {
      setValidationError("Passenger total cannot exceed 9 travelers.")
      return
    }

    const cabinClass = mapCabinClass(flightCabinClass)

    if (flightTripType === "multi-city") {
      const legs = flightSegments.map((segment) => ({
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
        setValidationError(
          `Complete flight ${incompleteLegIndex + 1} with valid airport codes and a departure date.`,
        )
        return
      }

      const sameAirportLegIndex = legs.findIndex(
        (leg) => leg.origin === leg.destination,
      )

      if (sameAirportLegIndex !== -1) {
        setValidationError(
          `Flight ${sameAirportLegIndex + 1} origin and destination must be different airports.`,
        )
        return
      }

      onSearch?.({
        provider: "duffel",
        tripType: "multi_city",
        legs,
        adults: flightTravelers.adults,
        children: flightTravelers.children,
        infants: flightTravelers.infants,
        cabinClass,
        maxConnections: 1,
      })

      return
    }

    const origin = normalizeAirportCode(flightOrigin)
    const destination = normalizeAirportCode(flightDestination)
    const departureDate = formatDateForApi(flightRange.start)
    const returnDate = formatDateForApi(flightRange.end)

    if (origin.length !== 3 || destination.length !== 3) {
      setValidationError("Enter valid 3-letter airport codes for origin and destination.")
      return
    }

    if (origin === destination) {
      setValidationError("Origin and destination must be different airports.")
      return
    }

    if (!departureDate) {
      setValidationError("Choose a departure date.")
      return
    }

    if (flightTripType === "round-trip" && !returnDate) {
      setValidationError("Choose a return date.")
      return
    }

    onSearch?.({
      provider: "duffel",
      tripType: mapFlightTripType(flightTripType),
      origin,
      destination,
      departureDate,
      returnDate: flightTripType === "round-trip" ? returnDate : null,
      adults: flightTravelers.adults,
      children: flightTravelers.children,
      infants: flightTravelers.infants,
      cabinClass,
      maxConnections: 1,
      includeNearbyAirports,
    })
  }

  if (flightTripType === "multi-city") {
    return (
      <div className="space-y-4">
        <CompactRadioGroup
          value={flightTripType}
          onChange={handleFlightTripTypeChange}
        />

        {flightSegments.map((segment, index) => (
          <div
            key={segment.id}
            className="border-b border-slate-200 pb-4 last:border-b-0"
          >
            <p className="mb-3 text-sm font-bold text-slate-900">
              Flight {index + 1}
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <AirportCodeField
                placeholder="Departing from?"
                value={segment.origin}
                excludeCode={segment.destination}
                onChange={(value) =>
                  updateFlightSegment(segment.id, {
                    origin: value,
                  })
                }
              />

              <AirportCodeField
                placeholder="Going to?"
                value={segment.destination}
                excludeCode={segment.origin}
                onChange={(value) =>
                  updateFlightSegment(segment.id, {
                    destination: value,
                  })
                }
              />

              <div className="relative">
                <CompactDateField
                  placeholder="Departing"
                  value={formatBookingDate(segment.departureDate)}
                  onClick={() =>
                    setCalendarRequest({
                      key: segment.id,
                      mode: "single",
                    })
                  }
                />

                {renderCalendarPopover({
                  calendarKey: segment.id,
                  calendarMode: "single",
                  range: {
                    start: segment.departureDate,
                    end: null,
                  },
                  singleDate: segment.departureDate,
                  onSelectDate: (date) => {
                    updateSegmentDate(segment.id, date)
                    setCalendarRequest(null)
                  },
                })}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addFlightSegment}
          className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
        >
          + Add another flight
        </button>

        {validationError ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {validationError}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <TravelersField
            travelers={flightTravelers}
            onChange={setFlightTravelers}
          />

          <CabinClassField
            cabinClass={flightCabinClass}
            onChange={setFlightCabinClass}
          />

          <SearchButton mode="flights" onClick={handleSearchClick} loading={loading} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 [&>*:first-child]:contents">
        <CompactRadioGroup
          value={flightTripType}
          onChange={handleFlightTripTypeChange}
        />

        <NearbyAirportsCheckbox
          checked={includeNearbyAirports}
          onChange={setIncludeNearbyAirports}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AirportCodeField
          placeholder="Departing from?"
          value={flightOrigin}
          excludeCode={flightDestination}
          onChange={setFlightOrigin}
        />

        <AirportCodeField
          placeholder="Going to?"
          value={flightDestination}
          excludeCode={flightOrigin}
          onChange={setFlightDestination}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <CompactDateField
            placeholder={
              flightTripType === "round-trip"
                ? "Departing – Returning"
                : "Departing"
            }
            value={
              flightTripType === "round-trip"
                ? formatDateRange(flightRange)
                : formatBookingDate(flightRange.start)
            }
            onClick={() =>
              setCalendarRequest({
                key: "flight-main",
                mode: flightTripType === "round-trip" ? "range" : "single",
              })
            }
          />

          {renderCalendarPopover({
            calendarKey: "flight-main",
            calendarMode: flightTripType === "round-trip" ? "range" : "single",
            range: flightRange,
            singleDate: flightRange.start,
            onSelectDate: (date) => {
              if (flightTripType === "round-trip") {
                handleRangeSelect(date, flightRange, setFlightRange)
                return
              }

              setFlightRange({
                start: date,
                end: null,
              })

              setCalendarRequest(null)
            },
          })}
        </div>

        <TravelersField
          travelers={flightTravelers}
          onChange={setFlightTravelers}
        />

        <CabinClassField
          cabinClass={flightCabinClass}
          onChange={setFlightCabinClass}
        />
      </div>

      {validationError ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {validationError}
        </p>
      ) : null}

      <SearchOptionsAndButton
        mode="flights"
        onSearch={handleSearchClick}
        loading={loading}
      />
    </div>
  )
}

function NearbyAirportsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold leading-none text-slate-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-200"
      />

      <span>Include nearby airports</span>
    </label>
  )
}