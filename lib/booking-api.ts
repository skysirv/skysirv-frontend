export type BookingTripType = "one_way" | "round_trip" | "multi_city"

export type BookingCabinClass =
  | "economy"
  | "premium_economy"
  | "business"
  | "first"

export type BookingSearchLeg = {
  origin: string
  destination: string
  departureDate: string
}

export type BookingSearchPayload = {
  tripType: BookingTripType
  origin?: string
  destination?: string
  departureDate?: string
  returnDate?: string | null
  legs?: BookingSearchLeg[]
  adults: number
  cabinClass: BookingCabinClass
  maxConnections: number
}

export type BookingAirport = {
  iataCode: string | null
  name: string | null
  cityName: string | null
}

export type BookingSegment = {
  id: string
  airlineName: string | null
  airlineIataCode: string | null
  flightNumber: string | null
  origin: BookingAirport
  destination: BookingAirport
  departingAt: string | null
  arrivingAt: string | null
  duration: string | null
  aircraft: string | null
}

export type BookingSlice = {
  id: string
  duration: string | null
  origin: BookingAirport
  destination: BookingAirport
  departureTime: string | null
  arrivalTime: string | null
  stops: number
  segments: BookingSegment[]
}

export type BookingOffer = {
  id: string
  provider: "duffel"
  owner: {
    id: string | null
    name: string | null
    iataCode: string | null
  }
  totalAmount: string
  totalCurrency: string
  baseAmount: string | null
  taxAmount: string | null
  expiresAt: string | null
  liveMode: boolean | null
  slices: BookingSlice[]
  summary: {
    airlineName: string
    airlineIataCode: string | null
    flightNumber: string | null
    departureTime: string | null
    arrivalTime: string | null
    duration: string | null
    stops: number
  }
}

export type BookingSearchResponse = {
  provider: "duffel"
  offerRequestId: string
  liveMode: boolean
  passengerIds: string[]
  offers: BookingOffer[]
}

type BookingApiResponse =
  | {
    status: "success"
    data: BookingSearchResponse
  }
  | {
    error: string
    details?: unknown
  }

export async function searchBookingOffers(
  payload: BookingSearchPayload
): Promise<BookingSearchResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured")
  }

  const response = await fetch(`${apiBaseUrl}/booking/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const json = (await response.json()) as BookingApiResponse

  if (!response.ok || "error" in json) {
    throw new Error(
      "error" in json ? json.error : "Unable to complete booking search"
    )
  }

  return json.data
}