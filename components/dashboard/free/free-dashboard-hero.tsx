"use client"

import { motion } from "framer-motion"
import DashboardFlightAttendant from "@/components/flight-attendant/DashboardFlightAttendant"

type FreeDashboardHeroProps = {
  showWelcomeModal: boolean
}

export default function FreeDashboardHero({
  showWelcomeModal,
}: FreeDashboardHeroProps) {
  return (
    <div className="relative overflow-visible bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_48%,#ffffff_100%)]">
      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-6 md:pb-0 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm backdrop-blur-sm">
              Free Plan Dashboard
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              Start tracking smarter without the noise
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Your Free dashboard gives you a clean look at route monitoring,
              light market visibility, and a preview of the intelligence layer
              that powers Skysirv.
            </p>
          </div>

          <div className="w-full max-w-md lg:ml-auto">
            {!showWelcomeModal && (
              <DashboardFlightAttendant
                tier="free"
                placement="inline"
                defaultOpen
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}