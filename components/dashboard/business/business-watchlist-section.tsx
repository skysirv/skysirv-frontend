"use client"

import { motion } from "framer-motion"
import WatchlistCard from "@/components/dashboard/watchlist-card"
import WatchlistSkeleton from "@/components/dashboard/watchlist-skeleton"

export type BusinessWatchlistRoute = {
  id: string
  route?: string | null
  route_hash?: string | null
  origin?: string | null
  destination?: string | null
  departure_date?: string | null
  last_checked_at?: string | null
  created_at?: string | null
  latest_price?: number | null
  avg_price?: number | null
  booking_signal?: string | null
  latest_airline?: string | null
  latest_flight_number?: string | null
  latest_captured_at?: string | null
  volatility_index?: string | null
  recommended_flights?:
  | {
    airline?: string | null
    flightNumber?: string | null
    price?: number | null
    currency?: string | null
    capturedAt?: string | null
  }[]
  | null
}

type BusinessWatchlistSectionProps = {
  loading: boolean
  watchlist: BusinessWatchlistRoute[]
  onOpenFlightModal: (
    route: BusinessWatchlistRoute,
    flight?: {
      airline?: string | null
      flightNumber?: string | null
      price?: number | null
      currency?: string | null
      capturedAt?: string | null
    } | null
  ) => void
  onRemoveRoute: (routeId: string) => void
}

function CompactStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export default function BusinessWatchlistSection({
  loading,
  watchlist,
  onOpenFlightModal,
  onRemoveRoute,
}: BusinessWatchlistSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
      className="relative mb-12 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#f6f9fc_42%,#ffffff_100%)] px-5 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:px-7 md:px-8 md:py-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.10)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
        <div className="absolute right-[-60px] top-[-20px] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(255,255,255,0)_74%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(148,163,184,0.25)_50%,rgba(255,255,255,0)_100%)]" />
      </div>

      <div className="relative">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur-sm">
              Watchlist Intelligence
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              Your active route decision layer
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Every monitored route begins as a tracked data layer. As pricing
              history builds, Business intelligence surfaces will begin
              populating with richer route context and deeper monitoring detail.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <CompactStat
              label="Monitoring"
              value={loading ? "—" : String(watchlist.length)}
            />
            <CompactStat label="Data Status" value="Building" />
            <CompactStat label="Signals" value="Pending" />
          </div>
        </div>

        <div className="grid max-h-[1600px] gap-6 overflow-y-auto pr-2 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <>
              <WatchlistSkeleton />
              <WatchlistSkeleton />
              <WatchlistSkeleton />
            </>
          ) : watchlist.length === 0 ? (
            <div className="col-span-full overflow-hidden rounded-[1.75rem] border border-dashed border-slate-300 bg-white/75 p-10 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-inner">
                ✈
              </div>

              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                No routes monitored yet
              </h3>

              <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">
                Start tracking a flight route above to begin collecting pricing
                history. Business intelligence layers will populate automatically
                as real monitored data accumulates.
              </p>
            </div>
          ) : (
            watchlist.map((route, index) => {
              const routeCode = route.route ?? ""
              const [fallbackOrigin, fallbackDestination] = routeCode.includes("-")
                ? routeCode.split("-")
                : ["", ""]

              const origin = route.origin ?? fallbackOrigin ?? "—"
              const destination = route.destination ?? fallbackDestination ?? "—"
              const departureDate = route.departure_date ?? "Pending"

              return (
                <div
                  key={route.id ?? route.route_hash ?? `${origin}-${destination}-${index}`}
                  className="animate-[fadeInUp_0.35s_ease-out]"
                >
                  <WatchlistCard
                    origin={origin}
                    destination={destination}
                    departureDate={departureDate}
                    latestPrice={
                      route.latest_price != null && Number.isFinite(Number(route.latest_price))
                        ? Number(route.latest_price)
                        : null
                    }
                    avgPrice={
                      route.avg_price != null && Number.isFinite(Number(route.avg_price))
                        ? Number(route.avg_price) / 100
                        : null
                    }
                    priceDelta={null}
                    latestAirline={route.latest_airline ?? null}
                    latestFlightNumber={route.latest_flight_number ?? null}
                    latestCapturedAt={route.latest_captured_at ?? null}
                    volatilityIndex={route.volatility_index ?? null}
                    recommendedFlights={route.recommended_flights ?? null}
                    onOpenFlightModal={(flight) => onOpenFlightModal(route, flight)}
                    onRemove={() => {
                      if (!route.id) return
                      onRemoveRoute(route.id)
                    }}
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
    </motion.div>
  )
}