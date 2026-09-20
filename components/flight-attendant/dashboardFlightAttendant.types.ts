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
    placement?: "inline" | "floating"
    defaultOpen?: boolean
    dashboardRoutes?: DashboardRouteContext[]
}

export type FlightAttendantMessage = {
    id: string
    role: "assistant" | "user"
    label: string
    text: string
}

export type LucyChatThread = {
    id: string
    title: string
    messages: FlightAttendantMessage[]
    pinned: boolean
    createdAt: number
    updatedAt: number
}