import {
    type DashboardRouteContext,
    type FlightAttendantMessage,
} from "./dashboardFlightAttendant.types"

import { type LucySaveVisibleFlightAction } from "./dashboardFlightAttendant.actions"

import {
    formatReadableFlightDate,
    formatVisibleFlightPrice,
    normalizeFlightSearchText,
} from "./dashboardFlightAttendant.formatters"

function isVisibleFlightSaveRequest(message: string) {
    const normalized = message.trim().toLowerCase()

    if (!normalized) return false

    const savedFlightQuestionSignals = [
        "what flights do i have saved",
        "what saved flights",
        "show me my saved flights",
        "do i have that flight saved",
        "is that flight saved",
        "have i saved that flight",
        "which flights are saved",
        "flights do i have saved",
    ]

    if (savedFlightQuestionSignals.some((signal) => normalized.includes(signal))) {
        return false
    }

    const directSaveSignals = [
        "save that flight",
        "save this flight",
        "save the flight",
        "save flight",
        "save it to my saved flights",
        "save this one",
        "save that one",
        "add that flight to my saved flights",
        "add this flight to my saved flights",
        "add it to my saved flights",
    ]

    return directSaveSignals.some((signal) => normalized.includes(signal))
}

export function buildLocalVisibleFlightSaveAction({
    message,
    messages,
    dashboardRoutes,
}: {
    message: string
    messages: FlightAttendantMessage[]
    dashboardRoutes: DashboardRouteContext[]
}): LucySaveVisibleFlightAction | null {
    if (!isVisibleFlightSaveRequest(message)) return null

    const visibleFlights = dashboardRoutes.flatMap((route) => {
        const origin = route.origin?.trim().toUpperCase()
        const destination = route.destination?.trim().toUpperCase()

        if (!origin || !destination) return []

        const flights = Array.isArray(route.recommendedFlights)
            ? route.recommendedFlights
            : []

        return flights
            .filter((flight) => flight.flightNumber || flight.airline || flight.airlineName)
            .map((flight) => ({
                route,
                origin,
                destination,
                flight,
                normalizedFlightNumber: normalizeFlightSearchText(flight.flightNumber),
            }))
    })

    if (!visibleFlights.length) return null

    const recentMessages = [...messages].reverse()

    const matchedFlight = recentMessages
        .flatMap((item) => {
            const messageText = normalizeFlightSearchText(item.text)

            return visibleFlights.filter((candidate) => {
                if (!candidate.normalizedFlightNumber) return false

                const numericFlightNumber = candidate.normalizedFlightNumber.replace(
                    /^[A-Z]+/,
                    ""
                )

                return (
                    messageText.includes(candidate.normalizedFlightNumber) ||
                    Boolean(
                        numericFlightNumber &&
                        numericFlightNumber.length >= 2 &&
                        messageText.includes(numericFlightNumber)
                    )
                )
            })
        })
        .at(0)

    if (!matchedFlight) return null

    const { route, origin, destination, flight } = matchedFlight

    const airline =
        typeof flight.airline === "string" && flight.airline.trim()
            ? flight.airline.trim().toUpperCase()
            : null

    const airlineName =
        typeof flight.airlineName === "string" && flight.airlineName.trim()
            ? flight.airlineName.trim()
            : null

    const flightNumber =
        typeof flight.flightNumber === "string" && flight.flightNumber.trim()
            ? flight.flightNumber.trim().toUpperCase()
            : null

    const price =
        typeof flight.price === "number" && Number.isFinite(flight.price)
            ? flight.price
            : null

    const currency =
        typeof flight.currency === "string" && flight.currency.trim()
            ? flight.currency.trim().toUpperCase()
            : "USD"

    const departureDate =
        typeof route.departureDate === "string" && route.departureDate.trim()
            ? route.departureDate.trim()
            : null

    const flightLabel = `${airlineName || airline || "Flight"}${flightNumber ? ` ${flightNumber}` : ""
        }`.trim()

    const readableDate = formatReadableFlightDate(departureDate)
    const priceLabel = formatVisibleFlightPrice(price, currency)

    const detailParts = [
        `${origin} → ${destination}`,
        readableDate ? `on ${readableDate}` : null,
        priceLabel ? `for ${priceLabel}` : null,
    ].filter(Boolean)

    const confirmationPrompt = `Save ${flightLabel} ${detailParts.join(
        " "
    )} to your Saved Flights?`

    return {
        type: "save_visible_flight",
        status: "needs_confirmation",
        origin,
        destination,
        departureDate,
        airline,
        airlineName,
        flightNumber,
        price,
        currency,
        flightLabel,
        confirmationPrompt,
    }
}