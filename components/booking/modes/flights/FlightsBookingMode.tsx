import { motion } from "framer-motion"
import { useState } from "react"

import type {
  BookingModeConfig,
  FlightTripType,
  PlanToBookingHandoff,
} from "@/components/booking/shared/bookingLabTypes"
import {
  searchBookingOffers,
  type BookingOffer,
  type BookingSearchPayload,
} from "@/lib/booking-api"
import BookingSearchPanel from "./BookingSearchPanel"
import CompactFlightSearchStrip from "./CompactFlightSearchStrip"
import FlightsResultsPreview from "./FlightsResultsPreview"

type FlightSearchResultState = {
  offers: BookingOffer[]
  offerRequestId: string
  liveMode: boolean
  routeTitle: string
  summaryLabel: string
  passengerCount: number
  payload: BookingSearchPayload
}

function buildRouteTitle(payload: BookingSearchPayload): string {
  if (payload.tripType === "multi_city") {
    return (
      payload.legs
        ?.map((leg) => `${leg.origin} → ${leg.destination}`)
        .join(" · ") ?? "Multi-city flight search"
    )
  }

  if (!payload.origin || !payload.destination) {
    return "Flight search"
  }

  if (payload.tripType === "round_trip") {
    return `${payload.origin} → ${payload.destination} → ${payload.origin}`
  }

  return `${payload.origin} → ${payload.destination}`
}

function formatDateLabel(value?: string | null): string {
  if (!value) return "Dates not set"

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date)
}

function formatTripDates(payload: BookingSearchPayload): string {
  if (payload.tripType === "multi_city") {
    const dates =
      payload.legs
        ?.map((leg) => formatDateLabel(leg.departureDate))
        .filter(Boolean) ?? []

    return dates.length ? dates.join(" · ") : "Dates not set"
  }

  if (payload.tripType === "round_trip") {
    return `${formatDateLabel(payload.departureDate)} – ${formatDateLabel(
      payload.returnDate,
    )}`
  }

  return formatDateLabel(payload.departureDate)
}

function formatTravelerLabel(payload: BookingSearchPayload): string {
  const children = payload.children ?? 0
  const infants = payload.infants ?? 0
  const totalTravelers = payload.adults + children + infants

  return `${totalTravelers} traveler${totalTravelers === 1 ? "" : "s"}`
}

function formatCabinLabel(payload: BookingSearchPayload): string {
  const labels: Record<BookingSearchPayload["cabinClass"], string> = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First",
  }

  return labels[payload.cabinClass]
}

function buildSummaryLabel(payload: BookingSearchPayload): string {
  return [
    buildRouteTitle(payload),
    formatTripDates(payload),
    formatTravelerLabel(payload),
    formatCabinLabel(payload),
  ].join(" · ")
}

function getPassengerCount(payload: BookingSearchPayload): number {
  return payload.adults + (payload.children ?? 0) + (payload.infants ?? 0)
}

export default function FlightsBookingMode({
  config,
  flightTripType,
  onFlightTripTypeChange,
  planHandoff,
  onHeroImageVisibilityChange,
}: {
  config: BookingModeConfig
  flightTripType: FlightTripType
  onFlightTripTypeChange: (tripType: FlightTripType) => void
  planHandoff?: PlanToBookingHandoff | null
  onHeroImageVisibilityChange?: (visible: boolean) => void
}) {
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchResult, setSearchResult] =
    useState<FlightSearchResultState | null>(null)
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true)

  async function handleSearchFlights(payload: BookingSearchPayload) {
    setIsSearching(true)
    setSearchError(null)

    try {
      const result = await searchBookingOffers(payload)

      setSearchResult({
        offers: result.offers,
        offerRequestId: result.offerRequestId,
        liveMode: result.liveMode,
        routeTitle: buildRouteTitle(payload),
        summaryLabel: buildSummaryLabel(payload),
        passengerCount: getPassengerCount(payload),
        payload,
      })

      setIsSearchPanelOpen(false)
      onHeroImageVisibilityChange?.(false)
    } catch (error) {
      setSearchError(
        error instanceof Error
          ? error.message
          : "Unable to complete this flight search right now.",
      )
      setIsSearchPanelOpen(true)
      onHeroImageVisibilityChange?.(true)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        className={
          searchResult && !isSearchPanelOpen
            ? "relative z-[300] py-2"
            : "relative rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_rgba(15,23,42,0.08)] sm:p-6"
        }
      >
        {searchResult && !isSearchPanelOpen ? (
          <CompactFlightSearchStrip
            payload={searchResult.payload}
            loading={isSearching}
            onSearch={handleSearchFlights}
          />
        ) : (
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">
              {config.label}
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              {config.panelSubtitle}
            </p>
          </div>
        )}

        <div className={isSearchPanelOpen || !searchResult ? "block" : "hidden"}>
          <BookingSearchPanel
            flightTripType={flightTripType}
            onFlightTripTypeChange={onFlightTripTypeChange}
            onSearch={handleSearchFlights}
            loading={isSearching}
            planHandoff={planHandoff}
          />
        </div>

        {searchError ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {searchError}
          </p>
        ) : null}
      </motion.div>

      {searchResult ? (
        <FlightsResultsPreview
          offers={searchResult.offers}
          offerRequestId={searchResult.offerRequestId}
          liveMode={searchResult.liveMode}
          routeTitle={searchResult.routeTitle}
          passengerCount={searchResult.passengerCount}
        />
      ) : null}
    </>
  )
}