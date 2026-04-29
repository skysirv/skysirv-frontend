"use client"

import { motion } from "framer-motion"
import SavedFlightCard, {
  type SavedFlightCardData,
} from "@/components/dashboard/saved-flight-card"

type ProSavedFlightsSectionProps = {
  savedFlights: SavedFlightCardData[]
  fadeUp: {
    initial: { opacity: number; y: number }
    whileInView: { opacity: number; y: number }
    viewport: { once: boolean; amount: number }
    transition: { duration: number; ease: "easeOut" }
  }
  onOpenSavedFlightIntelligence: (flight: SavedFlightCardData) => void
  onMarkSavedFlightCompleted: (flight: SavedFlightCardData) => void
  onDeleteSavedFlight: (flight: SavedFlightCardData) => void
}

export default function ProSavedFlightsSection({
  savedFlights,
  fadeUp,
  onOpenSavedFlightIntelligence,
  onMarkSavedFlightCompleted,
  onDeleteSavedFlight,
}: ProSavedFlightsSectionProps) {
  return (
    <motion.section
      {...fadeUp}
      className="relative mb-12 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white px-5 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:px-7 md:px-8 md:py-10"
    >
      <div className="relative">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur-sm">
              Saved Flights
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              Your saved flight decisions
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Save specific flights from your intelligence modal to track price changes,
              trigger alerts, and build your travel history.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {savedFlights.length === 0 ? (
            <div className="col-span-full overflow-hidden rounded-[1.75rem] border border-dashed border-slate-300 bg-white/75 p-10 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-inner">
                ✈
              </div>

              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                No saved flights yet
              </h3>

              <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">
                Open a flight from your watchlist and save it to start tracking
                that exact fare and building your intelligence history.
              </p>
            </div>
          ) : (
            savedFlights.map((flight, index) => (
              <SavedFlightCard
                key={flight.id ?? `${flight.origin}-${flight.destination}-${index}`}
                flight={flight}
                onOpenIntelligence={() => onOpenSavedFlightIntelligence(flight)}
                onMarkRouteCompleted={() => onMarkSavedFlightCompleted(flight)}
                onDelete={() => onDeleteSavedFlight(flight)}
              />
            ))
          )}
        </div>
      </div>
    </motion.section>
  )
}