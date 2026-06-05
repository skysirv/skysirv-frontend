import { useState } from "react"

import CompactDateField from "@/components/booking/shared/CompactDateField"
import CompactDatePicker from "@/components/booking/shared/CompactDatePicker"
import CompactField from "@/components/booking/shared/CompactField"
import SearchOptionsAndButton from "@/components/booking/shared/SearchOptionsAndButton"
import TravelersField from "@/components/booking/shared/TravelersField"
import type {
  CalendarMode,
  CalendarRequest,
  DateRange,
  TravelersState,
} from "@/components/booking/shared/bookingLabTypes"
import { formatDateRange } from "@/components/booking/shared/bookingLabUtils"

export default function BookingSearchPanel() {
  const [calendarRequest, setCalendarRequest] = useState<CalendarRequest | null>(
    null,
  )

  const [hotelRange, setHotelRange] = useState<DateRange>({
    start: null,
    end: null,
  })

  const [hotelTravelers, setHotelTravelers] = useState<TravelersState>({
    adults: 2,
    children: 0,
    infants: 0,
  })

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

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <CompactField placeholder="Destination" icon="hotel" />

        <div className="relative">
          <CompactDateField
            placeholder="Check-in – Check-out"
            value={formatDateRange(hotelRange)}
            onClick={() =>
              setCalendarRequest({
                key: "hotel-stay",
                mode: "range",
              })
            }
          />

          {renderCalendarPopover({
            calendarKey: "hotel-stay",
            calendarMode: "range",
            range: hotelRange,
            singleDate: hotelRange.start,
            onSelectDate: (date) =>
              handleRangeSelect(date, hotelRange, setHotelRange),
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <TravelersField
          travelers={hotelTravelers}
          onChange={setHotelTravelers}
        />

        <CompactField placeholder="Rooms · 1 room" icon="hotel" />
        <CompactField placeholder="Stay style" icon="map" />
      </div>

      <SearchOptionsAndButton mode="hotels" />
    </div>
  )
}