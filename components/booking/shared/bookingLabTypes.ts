export type BookingMode =
  | "flights"
  | "hotels"
  | "cars"
  | "cruises"
  | "experiences"

export type FlightTripType = "round-trip" | "one-way" | "multi-city"

export type CalendarMode = "single" | "range"

export type BookingModeConfig = {
  id: BookingMode
  label: string
  title: string
  subtitle: string
  panelSubtitle: string
}

export type DateRange = {
  start: Date | null
  end: Date | null
}

export type CalendarRequest = {
  key: string
  mode: CalendarMode
}

export type FlightSegment = {
  id: string
  departureDate: Date | null
}

export type TravelersState = {
  adults: number
  children: number
  infants: number
}

export type FieldIconName =
  | "search"
  | "calendar"
  | "traveler"
  | "seat"
  | "hotel"
  | "car"
  | "cruise"
  | "map"
  | "clock"
  | "bag"

export type PlanToBookingHandoff = {
  source?: string
  mode?: string
  modeLabel?: string
  prompt?: string
  confirmedAnswers?: Record<
    string,
    {
      icon: string
      label: string
      values?: string[]
    }
  >
  confirmedStepIds?: string[]
  createdAt?: string
}