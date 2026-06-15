import { useEffect, useState } from "react"

import CompactDateField from "@/components/booking/shared/CompactDateField"
import CompactDatePicker from "@/components/booking/shared/CompactDatePicker"
import CompactField from "@/components/booking/shared/CompactField"
import SearchOptionsAndButton from "@/components/booking/shared/SearchOptionsAndButton"
import TravelersField from "@/components/booking/shared/TravelersField"
import type {
  CalendarMode,
  CalendarRequest,
  DateRange,
  PlanToBookingHandoff,
  TravelersState,
} from "@/components/booking/shared/bookingLabTypes"
import { formatBookingDate } from "@/components/booking/shared/bookingLabUtils"

export default function BookingSearchPanel({
  onSearch,
  loading = false,
  planHandoff,
}: {
  onSearch?: () => void
  loading?: boolean
  planHandoff?: PlanToBookingHandoff | null
}) {
  const [calendarRequest, setCalendarRequest] = useState<CalendarRequest | null>(
    null,
  )

  const [cruiseDate, setCruiseDate] = useState<Date | null>(null)

  const [cruiseTravelers, setCruiseTravelers] = useState<TravelersState>({
    adults: 2,
    children: 0,
    infants: 0,
  })

  const [destinationRegion, setDestinationRegion] = useState("")
  const [cabinStyle, setCabinStyle] = useState("")

  useEffect(() => {
    if (!planHandoff) return

    const directRegionLabel =
      planHandoff.confirmedAnswers?.["cruise-region"]?.label

    const itineraryRegionLabel =
      planHandoff.confirmedAnswers?.["itinerary-cruise-region"]?.label

    const regionLabel =
      planHandoff.mode === "cruises" ? directRegionLabel : itineraryRegionLabel

    const directCabinLabel =
      planHandoff.confirmedAnswers?.["cruise-style"]?.label

    const itineraryCabinLabel =
      planHandoff.confirmedAnswers?.["itinerary-cruise-cabin"]?.label

    const cabinLabel =
      planHandoff.mode === "cruises" ? directCabinLabel : itineraryCabinLabel

    if (regionLabel && regionLabel !== "Not sure") {
      setDestinationRegion(regionLabel)
    }

    if (cabinLabel) {
      setCabinStyle(cabinLabel)
    }
  }, [planHandoff])

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
        <CompactField
          placeholder="Destination region"
          icon="cruise"
          value={destinationRegion}
          onChange={setDestinationRegion}
        />
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

      <CompactField
        placeholder="Cabin style"
        icon="seat"
        value={cabinStyle}
        onChange={setCabinStyle}
      />

      <SearchOptionsAndButton
        mode="cruises"
        onSearch={onSearch}
        loading={loading}
      />
    </div>
  )
}