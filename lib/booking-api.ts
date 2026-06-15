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
  provider?: "duffel"
  tripType: BookingTripType
  origin?: string
  destination?: string
  departureDate?: string
  returnDate?: string | null
  legs?: BookingSearchLeg[]
  adults: number
  children?: number
  infants?: number
  cabinClass: BookingCabinClass
  maxConnections: number
  includeNearbyAirports?: boolean
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
  airlineLogoSymbolUrl: string | null
  airlineLogoLockupUrl: string | null
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
    airlineLogoSymbolUrl: string | null
    airlineLogoLockupUrl: string | null
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

export type HotelStaySearchPayload = {
  provider?: "duffel"
  destination: string
  latitude: number
  longitude: number
  checkInDate: string
  checkOutDate: string
  adults: number
  children?: number
  rooms: number
  radiusKm?: number
}

export type HotelStaySearchResult = {
  id: string
  provider: "duffel"
  accommodationId: string | null
  name: string
  description: string | null
  address: string | null
  cityName: string | null
  countryCode: string | null
  latitude: number | null
  longitude: number | null
  rating: number | null
  chainName: string | null
  brandName: string | null
  cheapestRateTotalAmount: string
  cheapestRateCurrency: string
  cheapestRatePublicAmount: string | null
  cheapestRatePublicCurrency: string | null
  amenities: string[]
  images: string[]
  checkInDate: string
  checkOutDate: string
  rooms: number
  liveMode: boolean
}

export type HotelStaySearchResponse = {
  provider: "duffel"
  liveMode: boolean
  destination: string
  results: HotelStaySearchResult[]
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

type HotelStayApiResponse =
  | {
    status: "success"
    data: HotelStaySearchResponse
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

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => {
    controller.abort()
  }, 45000)

  try {
    const response = await fetch(`${apiBaseUrl}/booking/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(payload),
    })

    const contentType = response.headers.get("content-type") ?? ""
    const json = contentType.includes("application/json")
      ? ((await response.json()) as BookingApiResponse)
      : ({
        error: "Booking search returned an unexpected response.",
      } as BookingApiResponse)

    if (!response.ok || "error" in json) {
      throw new Error(
        "error" in json ? json.error : "Unable to complete booking search"
      )
    }

    return json.data
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "This flight search is taking longer than expected. Please try again."
      )
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function searchHotelStays(
  payload: HotelStaySearchPayload
): Promise<HotelStaySearchResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured")
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => {
    controller.abort()
  }, 45000)

  try {
    const response = await fetch(`${apiBaseUrl}/booking/hotels/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(payload),
    })

    const contentType = response.headers.get("content-type") ?? ""
    const json = contentType.includes("application/json")
      ? ((await response.json()) as HotelStayApiResponse)
      : ({
        error: "Hotel search returned an unexpected response.",
      } as HotelStayApiResponse)

    if (!response.ok || "error" in json) {
      throw new Error(
        "error" in json ? json.error : "Unable to complete hotel search"
      )
    }

    return json.data
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "This hotel search is taking longer than expected. Please try again."
      )
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}