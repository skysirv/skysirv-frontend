import type { LucyConversationSummary } from "./dashboardFlightAttendant.chat"

export type DashboardLucyTier = "free" | "pro" | "business"

export type DashboardRouteContext = {
  id?: string
  origin: string
  destination: string
  departureDate?: string | null
  routeLabel?: string
  latestPrice?: number | null
  averagePrice?: number | null
  bookingSignal?: string | null
  recommendedFlights?: Array<{
    airline?: string | null
    airlineName?: string | null
    airlineLogoSymbolUrl?: string | null
    airlineLogoLockupUrl?: string | null
    flightNumber?: string | null
    price?: number | null
    currency?: string | null
    stopCount?: number | null
  }>
}

export type DashboardFlightAttendantProps = {
  tier: DashboardLucyTier
  placement?: "inline" | "floating" | "workspace"
  defaultOpen?: boolean
  dashboardRoutes?: DashboardRouteContext[]
  requestedConversationId?: string | null
  newConversationRequestKey?: number
  initialPrompt?: string | null
  onActiveConversationChange?: (
    conversationId: string | null
  ) => void
  onConversationCreated?: (
    conversation: LucyConversationSummary
  ) => void
  onConversationUpdated?: (
    conversation: LucyConversationSummary
  ) => void
}

export type LucyLiveFlightResult = {
  offerId: string
  airlineName?: string | null
  airlineIataCode?: string | null
  flightNumber?: string | null
  departureTime?: string | null
  arrivalTime?: string | null
  duration?: string | null
  stops?: number | null
  totalAmount?: string | number | null
  totalCurrency?: string | null
  expiresAt?: string | null
  slices?: Array<{
    origin?: string | null
    destination?: string | null
    departureTime?: string | null
    arrivalTime?: string | null
    duration?: string | null
    stops?: number | null
    segments?: Array<{
      airlineName?: string | null
      airlineIataCode?: string | null
      flightNumber?: string | null
      origin?: string | null
      destination?: string | null
      departingAt?: string | null
      arrivingAt?: string | null
      duration?: string | null
      aircraft?: string | null
    }>
  }>
}

export type LucyLiveHotelResult = {
  searchResultId?: string | null
  accommodationId?: string | null
  name: string
  description?: string | null
  address?: string | null
  cityName?: string | null
  countryCode?: string | null
  latitude?: number | null
  longitude?: number | null
  rating?: number | null
  reviewScore?: number | null
  reviewCount?: number | null
  chainName?: string | null
  brandName?: string | null
  totalAmount?: string | number | null
  totalCurrency?: string | null
  publicAmount?: string | number | null
  publicCurrency?: string | null
  amenities?: string[]
  images?: string[]
  expiresAt?: string | null
}

export type LucyLiveCarResult = {
  name: string
  description?: string | null
  type?: string | null
  vehicleCode?: string | null
  passengers?: number | null
  bags?: number | null
  doors?: string | null
  automatic?: boolean | null
  airConditioning?: boolean | null
  fuelType?: string | null
  supplierName?: string | null
  supplierCode?: string | null
  supplierLogo?: string | null
  image?: string | null
  totalAmount?: string | number | null
  currency?: string | null
  paymentMode?: "postpaid" | "prepaid" | null
  payAtBooking?: boolean | null
  freeCancellation?: boolean | null
  mileageIncluded?: boolean | null
  fareCode?: string | null
  features?: string[]
  inclusions?: string[]
}

export type LucyLiveSearchResult =
  | {
    type: "flights"
    provider?: string | null
    offerRequestId?: string | null
    liveMode?: boolean | null
    offers: LucyLiveFlightResult[]
  }
  | {
    type: "hotels"
    provider?: string | null
    destination?: unknown
    checkInDate?: string | null
    checkOutDate?: string | null
    hotels: LucyLiveHotelResult[]
  }
  | {
    type: "cars"
    provider?: string | null
    correlationId?: string | null
    pickupLocation?: unknown
    dropoffLocation?: unknown
    pickupDate?: string | null
    dropoffDate?: string | null
    cars: LucyLiveCarResult[]
  }

export type FlightAttendantMessage = {
  id: string
  role: "assistant" | "user"
  label: string
  text: string
  liveSearch?: LucyLiveSearchResult | null
}

export type LucyChatThread = {
  id: string
  title: string
  messages: FlightAttendantMessage[]
  pinned: boolean
  createdAt: number
  updatedAt: number
}