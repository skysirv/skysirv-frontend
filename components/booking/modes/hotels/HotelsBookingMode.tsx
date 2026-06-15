import { motion } from "framer-motion"
import { useState } from "react"

import type {
  BookingModeConfig,
  PlanToBookingHandoff,
} from "@/components/booking/shared/bookingLabTypes"
import {
  searchHotelStays,
  type HotelStaySearchResponse,
} from "@/lib/booking-api"
import BookingSearchPanel, { type HotelSearchPayload } from "./BookingSearchPanel"
import CompactHotelSearchStrip from "./CompactHotelSearchStrip"
import HotelsResultsPreview from "./HotelsResultsPreview"

function formatDateForApi(date: Date | null): string {
  if (!date) return ""

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export default function HotelsBookingMode({
  config,
  planHandoff,
}: {
  config: BookingModeConfig
  planHandoff?: PlanToBookingHandoff | null
}) {
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true)
  const [searchPayload, setSearchPayload] = useState<HotelSearchPayload | null>(
    null,
  )
  const [searchResult, setSearchResult] =
    useState<HotelStaySearchResponse | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  async function handleSearchHotels(payload: HotelSearchPayload) {
    setIsSearching(true)
    setSearchError(null)
    setSearchPayload(payload)

    const checkInDate = formatDateForApi(payload.dateRange.start)
    const checkOutDate = formatDateForApi(payload.dateRange.end)

    try {
      if (!payload.destination.trim()) {
        throw new Error("Choose a hotel destination.")
      }

      if (!payload.latitude || !payload.longitude) {
        throw new Error("Choose a destination from the dropdown before searching.")
      }

      if (!checkInDate || !checkOutDate) {
        throw new Error("Choose check-in and check-out dates.")
      }

      const result = await searchHotelStays({
        provider: "duffel",
        destination: payload.destination.trim(),
        latitude: payload.latitude,
        longitude: payload.longitude,
        checkInDate,
        checkOutDate,
        adults: payload.travelers.adults,
        children: payload.travelers.children,
        rooms: payload.rooms,
        radiusKm: 15,
      })

      setSearchResult(result)
      setHasSearched(true)
      setIsSearchPanelOpen(false)
    } catch (error) {
      setSearchError(
        error instanceof Error
          ? error.message
          : "Unable to complete this hotel search right now.",
      )
      setIsSearchPanelOpen(true)
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
          hasSearched && !isSearchPanelOpen
            ? "relative z-[300] py-2"
            : "relative rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_rgba(15,23,42,0.08)] sm:p-6"
        }
      >
        {hasSearched && !isSearchPanelOpen && searchPayload ? (
          <CompactHotelSearchStrip
            payload={searchPayload}
            loading={isSearching}
            onSearch={handleSearchHotels}
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

        <div className={isSearchPanelOpen || !hasSearched ? "block" : "hidden"}>
          <BookingSearchPanel
            onSearch={handleSearchHotels}
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
        <HotelsResultsPreview
          results={searchResult.results}
          destination={searchResult.destination}
        />
      ) : null}
    </>
  )
}