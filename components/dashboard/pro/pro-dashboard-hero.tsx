"use client"

import { motion } from "framer-motion"
import DashboardFlightAttendant from "@/components/flight-attendant/DashboardFlightAttendant"

type ProDashboardHeroProps = {
  loading: boolean
  watchlistCount: number
  remainingRoutes: number
  isLifetimePro: boolean
  showWelcomeModal: boolean
  showLifetimeSetupModal: boolean
  fadeUp: {
    initial: { opacity: number; y: number }
    whileInView: { opacity: number; y: number }
    viewport: { once: boolean; amount: number }
    transition: { duration: number; ease: "easeOut" }
  }
}

function HeroStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-4 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 whitespace-pre-line">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  )
}

export default function ProDashboardHero({
  loading,
  watchlistCount,
  remainingRoutes,
  isLifetimePro,
  showWelcomeModal,
  showLifetimeSetupModal,
  fadeUp,
}: ProDashboardHeroProps) {
  return (
    <div className="relative z-20 overflow-visible bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_42%,#ffffff_100%)]">
      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-6 md:pb-6 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm backdrop-blur-sm">
                {isLifetimePro ? "Lifetime Pro Dashboard" : "Pro Plan Dashboard"}
              </div>

              {isLifetimePro && (
                <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 shadow-sm">
                  Gifted Lifetime Access
                </div>
              )}
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              A sharper intelligence solution for more serious travelers
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Pro unlocks deeper route behavior, stronger signal visibility,
              full Skyscore™ access, and a more capable dashboard designed for
              travelers who want richer insight as real route data begins to build.
            </p>
          </div>

          <div className="w-full max-w-md lg:ml-auto lg:translate-y-[112px]">
            {!showWelcomeModal && !showLifetimeSetupModal && (
              <DashboardFlightAttendant
                tier="pro"
                placement="inline"
                defaultOpen
              />
            )}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-xl"
        >
          <HeroStat
            label={"Watchlist\nCapacity"}
            value={loading ? "—" : `${watchlistCount}/25`}
          />
          <HeroStat
            label={"Routes\nRemaining"}
            value={loading ? "—" : String(remainingRoutes)}
          />
          <HeroStat
            label={"Access\nTier"}
            value={isLifetimePro ? "Lifetime Pro" : "Pro"}
          />
        </motion.div>
      </div>
    </div>
  )
}