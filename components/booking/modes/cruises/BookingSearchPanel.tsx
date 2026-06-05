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
import { formatBookingDate } from "@/components/booking/shared/bookingLabUtils"

export default function BookingSearchPanel() {
  const [calendarRequest, setCalendarRequest] = useState<CalendarRequest | null>(
    null,
  )

  const [cruiseDate, setCruiseDate] = useState<Date | null>(null)

  const [cruiseTravelers, setCruiseTravelers] = useState<TravelersState>({
    adults: 2,
    children: 0,
    infants: 0,
  })

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
        <CompactField placeholder="Destination region" icon="cruise" />
        <CompactField placeholder="Departure port" icon="map" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <CompactDateField
            placeholder="Travel month"
            value={formatBookingDate(cruiseDate)}
            onClick={() =>
              setCalendarRequest({
                key: "cruise-month",
                mode: "single",
              })
            }
          />

          {renderCalendarPopover({
            calendarKey: "cruise-month",
            calendarMode: "single",
            range: {
              start: cruiseDate,
              end: null,
            },
            singleDate: cruiseDate,
            onSelectDate: (date) => {
              setCruiseDate(date)
              setCalendarRequest(null)
            },
          })}
        </div>

        <CompactField placeholder="Duration" icon="clock" />

        <TravelersField
          travelers={cruiseTravelers}
          onChange={setCruiseTravelers}
        />
      </div>

      <CompactField placeholder="Cabin style" icon="seat" />

      <SearchOptionsAndButton mode="cruises" />
    </div>
  )
}