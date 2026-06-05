import { useState } from "react"

import CompactDateField from "@/components/booking/shared/CompactDateField"
import CompactDatePicker from "@/components/booking/shared/CompactDatePicker"
import CompactField from "@/components/booking/shared/CompactField"
import SearchOptionsAndButton from "@/components/booking/shared/SearchOptionsAndButton"
import type {
  CalendarMode,
  CalendarRequest,
  DateRange,
} from "@/components/booking/shared/bookingLabTypes"
import { formatDateRange } from "@/components/booking/shared/bookingLabUtils"

export default function BookingSearchPanel() {
  const [calendarRequest, setCalendarRequest] = useState<CalendarRequest | null>(
    null,
  )

  const [carRange, setCarRange] = useState<DateRange>({
    start: null,
    end: null,
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
        <CompactField placeholder="Pickup location" icon="car" />
        <CompactField placeholder="Drop-off location" icon="map" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <CompactDateField
            placeholder="Pickup – Return"
            value={formatDateRange(carRange)}
            onClick={() =>
              setCalendarRequest({
                key: "car-rental",
                mode: "range",
              })
            }
          />

          {renderCalendarPopover({
            calendarKey: "car-rental",
            calendarMode: "range",
            range: carRange,
            singleDate: carRange.start,
            onSelectDate: (date) =>
              handleRangeSelect(date, carRange, setCarRange),
          })}
        </div>

        <CompactField placeholder="Vehicle type" icon="car" />
        <CompactField placeholder="Driver age" type="number" icon="traveler" />
      </div>

      <SearchOptionsAndButton mode="cars" />
    </div>
  )
}