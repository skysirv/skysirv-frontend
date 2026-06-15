import { useEffect, useState } from "react"

import CompactDateField from "@/components/booking/shared/CompactDateField"
import CompactDatePicker from "@/components/booking/shared/CompactDatePicker"
import CompactField from "@/components/booking/shared/CompactField"
import TravelersField from "@/components/booking/shared/TravelersField"
import type {
  DateRange,
  TravelersState,
} from "@/components/booking/shared/bookingLabTypes"
import { formatDateRange } from "@/components/booking/shared/bookingLabUtils"
import type { HotelSearchPayload } from "./BookingSearchPanel"

function parseRooms(value: string): number {
  const parsedRooms = Number(value.match(/\d+/)?.[0] ?? 1)

  return Number.isFinite(parsedRooms) ? Math.max(1, parsedRooms) : 1
}

function formatRoomsLabel(rooms: number): string {
  return `${rooms} room${rooms === 1 ? "" : "s"}`
}

function getInitialRoomsLabel(payload: HotelSearchPayload): string {
  return formatRoomsLabel(payload.rooms)
}

export default function CompactHotelSearchStrip({
  payload,
  loading,
  onSearch,
}: {
  payload: HotelSearchPayload
  loading: boolean
  onSearch: (payload: HotelSearchPayload) => void
}) {
  const [destination, setDestination] = useState(payload.destination)
  const [dateRange, setDateRange] = useState<DateRange>(payload.dateRange)
  const [travelers, setTravelers] = useState<TravelersState>(payload.travelers)
  const [rooms, setRooms] = useState(getInitialRoomsLabel(payload))
  const [stayStyle, setStayStyle] = useState(payload.stayStyle)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDestination(payload.destination)
    setDateRange(payload.dateRange)
    setTravelers(payload.travelers)
    setRooms(getInitialRoomsLabel(payload))
    setStayStyle(payload.stayStyle)
    setCalendarOpen(false)
    setError(null)
  }, [payload])

  function handleRangeSelect(date: Date) {
    if (!dateRange.start || dateRange.end) {
      setDateRange({
        start: date,
        end: null,
      })

      return
    }

    if (date < dateRange.start) {
      setDateRange({
        start: date,
        end: null,
      })

      return
    }

    setDateRange({
      start: dateRange.start,
      end: date,
    })

    setCalendarOpen(false)
  }

  function handleSubmit() {
    const trimmedDestination = destination.trim()
    const trimmedStayStyle = stayStyle.trim()
    const parsedRooms = parseRooms(rooms)

    setError(null)

    if (!trimmedDestination) {
      setError("Enter a hotel destination.")
      return
    }

    if (!dateRange.start || !dateRange.end) {
      setError("Choose check-in and check-out dates.")
      return
    }

    onSearch({
      destination: trimmedDestination,
      dateRange,
      travelers,
      rooms: parsedRooms,
      stayStyle: trimmedStayStyle,
    })
  }

  return (
    <div className="relative left-1/2 z-[300] w-[min(1180px,calc(100vw-48px))] -translate-x-1/2">
      <div className="relative z-[10] grid w-full items-center gap-2 xl:grid-cols-[minmax(230px,1fr)_minmax(230px,1fr)_minmax(165px,0.7fr)_minmax(135px,0.55fr)_minmax(165px,0.7fr)_110px]">
        <CompactHotelFieldShell>
          <CompactField
            placeholder="Destination"
            icon="hotel"
            value={destination}
            onChange={setDestination}
          />
        </CompactHotelFieldShell>

        <div className="relative">
          <CompactDateField
            compact
            placeholder="Check-in – Check-out"
            value={formatDateRange(dateRange)}
            onClick={() => setCalendarOpen(true)}
          />

          {calendarOpen ? (
            <CompactDatePicker
              mode="range"
              range={dateRange}
              singleDate={dateRange.start}
              onSelectDate={handleRangeSelect}
              onClose={() => setCalendarOpen(false)}
            />
          ) : null}
        </div>

        <TravelersField
          compact
          travelers={travelers}
          onChange={setTravelers}
        />

        <CompactHotelFieldShell>
          <CompactField
            placeholder="Rooms"
            icon="hotel"
            value={rooms}
            onChange={setRooms}
          />
        </CompactHotelFieldShell>

        <CompactHotelFieldShell>
          <CompactField
            placeholder="Stay style"
            icon="map"
            value={stayStyle}
            onChange={setStayStyle}
          />
        </CompactHotelFieldShell>

        <SearchStripButton loading={loading} onClick={handleSubmit} />
      </div>

      {error ? (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function CompactHotelFieldShell({
  children,
}: {
  children: React.ReactNode
}) {
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