import { motion } from "framer-motion"
import { useState } from "react"

import type {
  BookingModeConfig,
  PlanToBookingHandoff,
} from "@/components/booking/shared/bookingLabTypes"
import BookingSearchPanel from "./BookingSearchPanel"
import CarsResultsPreview from "./CarsResultsPreview"

export default function CarsBookingMode({
  config,
  planHandoff,
}: {
  config: BookingModeConfig
  planHandoff?: PlanToBookingHandoff | null
}) {
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  function handleSearchCars() {
    setIsSearching(true)

    window.setTimeout(() => {
      setIsSearching(false)
      setHasSearched(true)
    }, 650)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        className="relative rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_rgba(15,23,42,0.08)] sm:p-6"
      >
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">{config.label}</h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
            {config.panelSubtitle}
          </p>
        </div>

        <BookingSearchPanel
          onSearch={handleSearchCars}
          loading={isSearching}
          planHandoff={planHandoff}
        />
      </motion.div>

      {hasSearched && <CarsResultsPreview />}
    </>
  )
}