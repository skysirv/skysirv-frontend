import { motion } from "framer-motion"

import type {
  BookingModeConfig,
  FlightTripType,
} from "@/components/booking/shared/bookingLabTypes"
import BookingSearchPanel from "./BookingSearchPanel"

export default function FlightsBookingMode({
  config,
  flightTripType,
  onFlightTripTypeChange,
}: {
  config: BookingModeConfig
  flightTripType: FlightTripType
  onFlightTripTypeChange: (tripType: FlightTripType) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="relative rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_rgba(15,23,42,0.08)] sm:p-6"
    >
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">{config.label}</h2>

        <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
          {config.panelSubtitle}
        </p>
      </div>

      <BookingSearchPanel
        flightTripType={flightTripType}
        onFlightTripTypeChange={onFlightTripTypeChange}
      />
    </motion.div>
  )
}