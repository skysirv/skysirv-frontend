import { useEffect, useRef, useState } from "react"

import CompactDateField from "@/components/booking/shared/CompactDateField"
import CompactDatePicker from "@/components/booking/shared/CompactDatePicker"
import CompactField from "@/components/booking/shared/CompactField"
import SearchOptionsAndButton from "@/components/booking/shared/SearchOptionsAndButton"
import type {
  CalendarMode,
  CalendarRequest,
  DateRange,
  PlanToBookingHandoff,
  TravelersState,
} from "@/components/booking/shared/bookingLabTypes"
import { formatDateRange } from "@/components/booking/shared/bookingLabUtils"

export type HotelSearchPayload = {
  destination: string
  dateRange: DateRange
  travelers: TravelersState
  rooms: number
  stayStyle: string
  latitude?: number | null
  longitude?: number | null
}

type HotelStayScope = "single_stay" | "multi_stay"

type HotelDestinationSuggestion = {
  id: string
  label: string
  meta: string
  kind: string
  latitude: number | null
  longitude: number | null
}

type MapboxGeocodingContext = {
  id?: string
  text?: string
}

type MapboxGeocodingFeature = {
  id: string
  text?: string
  place_name?: string
  place_type?: string[]
  context?: MapboxGeocodingContext[]
  center?: [number, number]
}

type MapboxGeocodingResponse = {
  features?: MapboxGeocodingFeature[]
}

function getMapboxDestinationKind(placeTypes?: string[]): string {
  if (!placeTypes?.length) return "Destination"
  if (placeTypes.includes("place")) return "City"
  if (placeTypes.includes("locality")) return "Area"
  if (placeTypes.includes("neighborhood")) return "Neighborhood"
  if (placeTypes.includes("district")) return "District"
  if (placeTypes.includes("region")) return "Region"
  if (placeTypes.includes("poi")) return "Place"

  return "Destination"
}

function formatMapboxDestination(
  feature: MapboxGeocodingFeature,
): HotelDestinationSuggestion {
  const label = feature.text ?? feature.place_name ?? "Destination"
  const contextParts =
    feature.context
      ?.map((context) => context.text)
      .filter(Boolean) ?? []

  const meta =
    contextParts.length > 0
      ? contextParts.join(", ")
      : feature.place_name?.replace(label, "").replace(/^,\s*/, "") ??
      "Global destination"

  return {
    id: feature.id,
    label,
    meta,
    kind: getMapboxDestinationKind(feature.place_type),
    latitude: feature.center?.[1] ?? null,
    longitude: feature.center?.[0] ?? null,
  }
}

function formatSelectedDestinationLabel(
  suggestion: HotelDestinationSuggestion,
): string {
  if (!suggestion.meta || suggestion.meta === "Global destination") {
    return suggestion.label
  }

  return `${suggestion.label}, ${suggestion.meta}`
}

export default function BookingSearchPanel({
  onSearch,
  loading = false,
  planHandoff,
}: {
  onSearch?: (payload: HotelSearchPayload) => void
  loading?: boolean
  planHandoff?: PlanToBookingHandoff | null
}) {
  const [calendarRequest, setCalendarRequest] = useState<CalendarRequest | null>(
    null,
  )

  const [destination, setDestination] = useState("")
  const [selectedDestination, setSelectedDestination] =
    useState<HotelDestinationSuggestion | null>(null)
  const [hotelStayScope, setHotelStayScope] =
    useState<HotelStayScope>("single_stay")
  const [roomCount, setRoomCount] = useState(1)

  const [hotelRange, setHotelRange] = useState<DateRange>({
    start: null,
    end: null,
  })

  const [hotelTravelers, setHotelTravelers] = useState<TravelersState>({
    adults: 2,
    children: 0,
    infants: 0,
  })

  const [stayStyle, setStayStyle] = useState("")

  useEffect(() => {
    if (!planHandoff) return

    const directStayStyle =
      planHandoff.confirmedAnswers?.["hotel-type"]?.label

    const itineraryStayStyle =
      planHandoff.confirmedAnswers?.["itinerary-hotel-style"]?.label

    const stayStyleLabel =
      planHandoff.mode === "hotels" ? directStayStyle : itineraryStayStyle

    if (stayStyleLabel) {
      setStayStyle(stayStyleLabel)
    }
  }, [planHandoff])

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

  function handleSearchClick() {
    onSearch?.({
      destination: destination.trim(),
      dateRange: hotelRange,
      travelers: hotelTravelers,
      rooms: roomCount,
      stayStyle: stayStyle.trim(),
      latitude: selectedDestination?.latitude ?? null,
      longitude: selectedDestination?.longitude ?? null,
    })
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
      <HotelStayScopeSelector
        value={hotelStayScope}
        onChange={setHotelStayScope}
      />

      <HotelDestinationField
        value={destination}
        onChange={(nextValue) => {
          setDestination(nextValue)
          setSelectedDestination(null)
        }}
        onSelectDestination={(suggestion) => {
          setDestination(formatSelectedDestinationLabel(suggestion))
          setSelectedDestination(suggestion)
        }}
      />

      <div className="grid gap-3 sm:grid-cols-2">
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

        <HotelGuestsRoomsField
          travelers={hotelTravelers}
          roomCount={roomCount}
          onTravelersChange={setHotelTravelers}
          onRoomCountChange={setRoomCount}
        />
      </div>

      <SearchOptionsAndButton
        mode="hotels"
        onSearch={handleSearchClick}
        loading={loading}
      />
    </div>
  )
}

function HotelStayScopeSelector({
  value,
  onChange,
}: {
  value: HotelStayScope
  onChange: (value: HotelStayScope) => void
}) {
  const options: {
    label: string
    value: HotelStayScope
  }[] = [
      {
        label: "Single hotel",
        value: "single_stay",
      },
      {
        label: "Multiple hotels",
        value: "multi_stay",
      },
    ]

  return (
    <div className="flex flex-wrap items-center gap-6 pt-1">
      {options.map((option) => (
        <label
          key={option.value}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800"
        >
          <input
            type="radio"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-200"
          />

          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

function HotelDestinationField({
  value,
  onChange,
  onSelectDestination,
}: {
  value: string
  onChange: (value: string) => void
  onSelectDestination: (suggestion: HotelDestinationSuggestion) => void
}) {
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<HotelDestinationSuggestion[]>([])
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false)
  const [destinationError, setDestinationError] = useState<string | null>(null)

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const suppressNextDestinationSearchRef = useRef(false)

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

  useEffect(() => {
    const searchValue = value.trim()

    if (suppressNextDestinationSearchRef.current) {
      suppressNextDestinationSearchRef.current = false
      setSuggestions([])
      setIsLoadingDestinations(false)
      setDestinationError(null)
      setOpen(false)
      return
    }

    if (searchValue.length < 2) {
      setSuggestions([])
      setIsLoadingDestinations(false)
      setDestinationError(null)
      return
    }

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    if (!mapboxToken) {
      setSuggestions([])
      setIsLoadingDestinations(false)
      setDestinationError("Destination search is not configured yet.")
      setOpen(true)
      return
    }

    const controller = new AbortController()

    const searchTimer = window.setTimeout(async () => {
      setIsLoadingDestinations(true)
      setDestinationError(null)

      try {
        const params = new URLSearchParams({
          access_token: mapboxToken,
          autocomplete: "true",
          language: "en",
          limit: "8",
          types: "place,locality,neighborhood,district,region,poi",
        })

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchValue,
          )}.json?${params.toString()}`,
          {
            signal: controller.signal,
          },
        )

        if (!response.ok) {
          throw new Error("Unable to load hotel destinations.")
        }

        const data = (await response.json()) as MapboxGeocodingResponse

        setSuggestions(
          (data.features ?? []).map((feature) =>
            formatMapboxDestination(feature),
          ),
        )
        setOpen(true)
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return

        setSuggestions([])
        setDestinationError("Unable to load destinations right now.")
        setOpen(true)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingDestinations(false)
        }
      }
    }, 250)

    return () => {
      window.clearTimeout(searchTimer)
      controller.abort()
    }
  }, [value])

  const shouldShowDropdown =
    open &&
    value.trim().length >= 2 &&
    (isLoadingDestinations || destinationError || suggestions.length > 0)

  return (
    <div ref={dropdownRef} className="relative">
      <CompactField
        placeholder="Going to?"
        icon="search"
        value={value}
        onChange={(nextValue) => {
          onChange(nextValue)
          setOpen(nextValue.trim().length >= 2)
        }}
      />

      {shouldShowDropdown ? (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-2 max-h-[340px] overflow-y-auto rounded-[1rem] border border-slate-200 bg-white py-2 shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
          {isLoadingDestinations ? (
            <div className="px-4 py-3 text-sm font-semibold text-slate-500">
              Searching destinations...
            </div>
          ) : null}

          {!isLoadingDestinations && destinationError ? (
            <div className="px-4 py-3 text-sm font-semibold text-red-600">
              {destinationError}
            </div>
          ) : null}

          {!isLoadingDestinations && !destinationError
            ? suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => {
                  suppressNextDestinationSearchRef.current = true
                  onSelectDestination(suggestion)
                  setSuggestions([])
                  setOpen(false)
                }}
                className="flex min-h-[54px] w-full items-center justify-between gap-4 px-4 text-left transition hover:bg-blue-50"
              >
                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    {suggestion.label}
                  </span>

                  <span className="block text-xs font-medium text-slate-500">
                    {suggestion.meta}
                  </span>
                </span>
              </button>
            ))
            : null}
        </div>
      ) : null}
    </div>
  )
}

function HotelGuestsRoomsField({
  travelers,
  roomCount,
  onTravelersChange,
  onRoomCountChange,
}: {
  travelers: TravelersState
  roomCount: number
  onTravelersChange: (travelers: TravelersState) => void
  onRoomCountChange: (roomCount: number) => void
}) {
  const [open, setOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement | null>(null)

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

  const guestCount = travelers.adults + travelers.children
  const guestLabel = `${guestCount} Guest${guestCount === 1 ? "" : "s"}`
  const roomLabel = `${roomCount} Room${roomCount === 1 ? "" : "s"}`

  function updateAdults(nextAdults: number) {
    onTravelersChange({
      ...travelers,
      adults: Math.max(1, nextAdults),
    })
  }

  function updateChildren(nextChildren: number) {
    onTravelersChange({
      ...travelers,
      children: Math.max(0, nextChildren),
    })
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-[58px] w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-left transition hover:border-blue-200 hover:shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        <span className="text-blue-700">
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
          >
            <path
              d="M10 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M4.5 17c.7-2.7 2.7-4.2 5.5-4.2s4.8 1.5 5.5 4.2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <span>
          <span className="block text-[11px] font-bold leading-none text-slate-400">
            Travelers
          </span>

          <span className="mt-1 block text-sm font-semibold text-slate-800">
            {guestLabel}, {roomLabel}
          </span>
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-2 rounded-[1rem] border border-slate-200 bg-white p-4 shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
          <HotelGuestsRoomsCounter
            label="Rooms"
            value={roomCount}
            minValue={1}
            onChange={onRoomCountChange}
          />

          <HotelGuestsRoomsCounter
            label="Adults"
            value={travelers.adults}
            minValue={1}
            onChange={updateAdults}
          />

          <HotelGuestsRoomsCounter
            label="Children"
            value={travelers.children}
            minValue={0}
            onChange={updateChildren}
          />

          <p className="mt-3 text-xs font-medium leading-5 text-slate-500">
            Add children before search so hotel policies and room options can be
            matched more accurately.
          </p>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function HotelGuestsRoomsCounter({
  label,
  value,
  minValue,
  onChange,
}: {
  label: string
  value: number
  minValue: number
  onChange: (value: number) => void
}) {
  const canDecrease = value > minValue

  return (
    <div className="flex min-h-[58px] items-center justify-between border-b border-slate-100 last:border-b-0">
      <span className="text-sm font-semibold text-slate-900">{label}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!canDecrease}
          onClick={() => onChange(value - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-300"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>

        <span className="w-5 text-center text-sm font-semibold text-slate-800">
          {value}
        </span>

        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white transition hover:bg-blue-600"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}