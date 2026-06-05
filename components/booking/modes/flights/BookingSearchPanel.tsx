import { useState } from "react"

import CabinClassField from "@/components/booking/shared/CabinClassField"
import CompactDateField from "@/components/booking/shared/CompactDateField"
import CompactDatePicker from "@/components/booking/shared/CompactDatePicker"
import CompactField from "@/components/booking/shared/CompactField"
import CompactRadioGroup from "@/components/booking/shared/CompactRadioGroup"
import SearchButton from "@/components/booking/shared/SearchButton"
import SearchOptionsAndButton from "@/components/booking/shared/SearchOptionsAndButton"
import TravelersField from "@/components/booking/shared/TravelersField"
import type {
  CalendarMode,
  CalendarRequest,
  DateRange,
  FlightSegment,
  FlightTripType,
  TravelersState,
} from "@/components/booking/shared/bookingLabTypes"
import {
  formatBookingDate,
  formatDateRange,
} from "@/components/booking/shared/bookingLabUtils"

export default function BookingSearchPanel({
  flightTripType,
  onFlightTripTypeChange,
}: {
  flightTripType: FlightTripType
  onFlightTripTypeChange: (tripType: FlightTripType) => void
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

  const [flightSegments, setFlightSegments] = useState<FlightSegment[]>([
    { id: "segment-1", departureDate: null },
    { id: "segment-2", departureDate: null },
  ])

  function handleFlightTripTypeChange(nextTripType: FlightTripType) {
    onFlightTripTypeChange(nextTripType)
    setCalendarRequest(null)
  }

  function addFlightSegment() {
    setFlightSegments((current) => {
      if (current.length >= 6) return current

      return [
        ...current,
        {
          id: `segment-${current.length + 1}`,
          departureDate: null,
        },
      ]
    })
  }

  function updateSegmentDate(segmentId: string, date: Date) {
    setFlightSegments((current) =>
      current.map((segment) =>
        segment.id === segmentId
          ? {
            ...segment,
            departureDate: date,
          }
          : segment,
      ),
    )
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
              <CompactField placeholder="Departing from?" icon="search" />
              <CompactField placeholder="Going to?" icon="search" />

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

        <div className="grid gap-3 sm:grid-cols-3">
          <TravelersField
            travelers={flightTravelers}
            onChange={setFlightTravelers}
          />

          <CabinClassField
            cabinClass={flightCabinClass}
            onChange={setFlightCabinClass}
          />

          <SearchButton mode="flights" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <CompactRadioGroup
        value={flightTripType}
        onChange={handleFlightTripTypeChange}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <CompactField placeholder="Departing from?" icon="search" />
        <CompactField placeholder="Going to?" icon="search" />
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

      <SearchOptionsAndButton mode="flights" />
    </div>
  )
}