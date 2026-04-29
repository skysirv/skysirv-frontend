"use client"

import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import { motion, useInView, type Variants } from "framer-motion"

import TravelGlobe from "@/components/intelligence-wrapped/travel-globe"
import SegmentIntelligencePanel from "@/components/intelligence-wrapped/segment-intelligence-panel"

type TravelGlobeProps = ComponentProps<typeof TravelGlobe>
type SegmentIntelligencePanelProps = ComponentProps<typeof SegmentIntelligencePanel>

type WrappedData = {
  flights: number
  countries: number
  distance: string | number
  routesMonitored: number
  skyscore: number
  savings: number
  avgSavings: number
  beatMarket: number
  travelerIdentity: string
}

type ProIntelligenceWrappedSectionProps = {
  wrappedLoading: boolean
  wrappedData: WrappedData
  selectedYear: number
  availableWrappedYears: number[]
  setSelectedYear: (year: number) => void
  sortedSegments: SegmentIntelligencePanelProps["sortedSegments"]
  globeAirportNodes: TravelGlobeProps["airportNodes"]
  globeRouteArcs: TravelGlobeProps["routeArcs"]
  fadeUp: SegmentIntelligencePanelProps["fadeUp"]
  staggerContainer: Variants
  staggerItem: Variants
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  const isStringValue = typeof value === "string"

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-slate-200/80 bg-white/85 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)] backdrop-blur"
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {isStringValue ? value : <CountUpNumber end={Number(value)} />}
      </p>
    </motion.div>
  )
}

function MotionCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(15,23,42,0.09)" }}
      transition={{ duration: 0.22 }}
      className="group h-full rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur"
    >
      {children}
    </motion.div>
  )
}

function CountUpNumber({
  end,
  duration = 1400,
  suffix = "",
}: {
  end: number
  duration?: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTimestamp: number | null = null

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(end * eased))

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }, [duration, end, isInView])

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

function SharePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-sm">
      <span className="text-slate-400">{label}</span>{" "}
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}

export default function ProIntelligenceWrappedSection({
  wrappedLoading,
  wrappedData,
  selectedYear,
  availableWrappedYears,
  setSelectedYear,
  sortedSegments,
  globeAirportNodes,
  globeRouteArcs,
  fadeUp,
  staggerContainer,
  staggerItem,
}: ProIntelligenceWrappedSectionProps) {
  return (
    <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_36%,#ffffff_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.07)]">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-80px] top-16 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-100px] top-40 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl"
        />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(148,163,184,0.28)_50%,rgba(255,255,255,0)_100%)]" />
      </div>

      <div className="relative px-6 py-10 md:px-8 md:py-12">
        <section className="relative mx-auto max-w-6xl pb-16 pt-2 sm:pt-4">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.05, duration: 0.55 }}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur"
              >
                {selectedYear} Annual Intelligence Report
              </motion.div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
                <label
                  htmlFor="wrapped-year"
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                >
                  Year
                </label>

                <select
                  id="wrapped-year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent pr-1 text-sm font-medium text-slate-900 outline-none"
                >
                  {availableWrappedYears.map((year: number) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h2 className="mt-8 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Your Skysirv Intelligence Wrapped™
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.18, duration: 0.6 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg"
            >
              You didn’t just travel. You tracked smarter, booked sharper,
              and outperformed the market with confidence.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
          >
            <motion.div variants={staggerItem}>
              <Stat label="Flights" value={wrappedLoading ? "—" : wrappedData.flights} />
            </motion.div>

            <motion.div variants={staggerItem}>
              <Stat label="Countries" value={wrappedLoading ? "—" : wrappedData.countries} />
            </motion.div>

            <motion.div variants={staggerItem}>
              <Stat label="Distance" value={wrappedLoading ? "—" : wrappedData.distance} />
            </motion.div>

            <motion.div variants={staggerItem}>
              <Stat
                label="Routes Monitored"
                value={wrappedLoading ? "—" : wrappedData.routesMonitored}
              />
            </motion.div>
          </motion.div>

          <motion.div {...fadeUp} className="mt-12">
            <div className="mb-6 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                Travel Footprint
              </p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Explore your year on the globe
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Every glowing point marks an airport you passed through during the
                year. Click a destination to reveal your visit count, layover time,
                and airport intelligence snapshot.
              </p>
            </div>

            <TravelGlobe
              airportNodes={globeAirportNodes}
              routeArcs={globeRouteArcs}
            />
          </motion.div>

          <SegmentIntelligencePanel
            wrappedLoading={wrappedLoading}
            selectedYear={selectedYear}
            sortedSegments={sortedSegments}
            fadeUp={fadeUp}
          />
        </section>

        <motion.section
          {...fadeUp}
          className="relative mx-auto max-w-4xl py-2"
        >
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-2.5 w-2.5 rounded-full bg-sky-600 shadow-[0_0_18px_rgba(14,165,233,0.45)]"
            />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-200" />
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-slate-500 sm:text-base">
            This year, you didn’t just fly. You moved through the market with
            better timing, better signals, and better decisions.
          </p>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto max-w-5xl py-10 sm:py-14"
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50" />
            <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute bottom-[-70px] left-[-30px] h-44 w-44 rounded-full bg-indigo-200/30 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                  Annual Skyscore™
                </p>

                <h3 className="mt-4 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
                  <CountUpNumber end={wrappedData.skyscore} />
                </h3>

                <p className="mt-3 text-lg font-semibold text-emerald-600">
                  {wrappedLoading || wrappedData.skyscore === 0 ? "Awaiting score data" : "Pro Intelligence Traveler"}
                </p>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  {wrappedLoading || wrappedData.skyscore === 0
                    ? "Your annual score and booking profile will appear here once enough real monitoring and wrapped travel data exists."
                    : "Your booking behavior consistently landed in high-confidence territory, with strong timing discipline and above-market decision quality throughout the year."}
                </p>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-sky-200/70"
                  />

                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border border-indigo-200/70"
                  />

                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-8 rounded-full bg-gradient-to-br from-white via-sky-50 to-indigo-50 shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
                  />

                  <motion.div
                    animate={{ opacity: [0.45, 0.8, 0.45] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-10 rounded-full bg-sky-100/40 blur-md"
                  />

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative z-10 text-center"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                      Score
                    </p>
                    <p className="mt-2 text-6xl font-bold tracking-tight text-slate-950">
                      <CountUpNumber end={wrappedData.skyscore} />
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ delay: 0.05, duration: 0.75, ease: "easeOut" }}
          className="mx-auto grid max-w-6xl gap-6 py-12 sm:grid-cols-3 sm:py-16"
        >
          <MotionCard>
            <p className="text-sm text-slate-500">Total Saved</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              $<CountUpNumber end={wrappedData.savings} />
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {wrappedLoading || wrappedData.savings === 0
                ? "Savings totals will appear here once monitored bookings and wrapped travel data are available."
                : "Estimated savings captured through smarter timing and monitored opportunities."}
            </p>
          </MotionCard>

          <MotionCard>
            <p className="text-sm text-slate-500">Avg / Flight</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              $<CountUpNumber end={wrappedData.avgSavings} />
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {wrappedLoading || wrappedData.avgSavings === 0
                ? "Average per-flight savings will appear once enough completed trip data exists."
                : "Your average booking advantage across completed trips this year."}
            </p>
          </MotionCard>

          <MotionCard>
            <p className="text-sm text-slate-500">Beat Market</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              <CountUpNumber end={wrappedData.beatMarket} suffix="%" />
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {wrappedLoading || wrappedData.beatMarket === 0
                ? "Market outperformance will appear here once enough real booking comparisons are available."
                : "How often your booking decisions outperformed the broader fare environment."}
            </p>
          </MotionCard>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ delay: 0.12, duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-4xl px-0 py-16 sm:py-20"
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 text-center text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
          >
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.06, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_38%)]"
            />

            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Traveler Identity
              </p>

              <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {wrappedLoading || wrappedData.routesMonitored === 0
                  ? "Your traveler identity will appear here"
                  : `You are a ${wrappedData.travelerIdentity}`}
              </h3>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {wrappedLoading || wrappedData.routesMonitored === 0
                  ? "As your monitoring history and booking behavior develop, Skysirv will generate a clearer identity profile here."
                  : "You wait, analyze, and strike at the right moment — consistently outperforming the market with calm, disciplined timing."}
              </p>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl px-0 pb-6 pt-8"
        >
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              Summary Snapshot
            </p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Wrapped Summary
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              {wrappedLoading || wrappedData.routesMonitored === 0
                ? "Once wrapped data is available, this section will summarize your travel activity and intelligence highlights."
                : "A summary of how you traveled, saved, and outperformed the market this year."}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-10"
          >
            <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_22px_60px_rgba(15,23,42,0.10)]">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white">
                <motion.div
                  animate={{ x: [0, 16, 0], y: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-[-16px] top-[-16px] h-36 w-36 rounded-full bg-sky-500/10 blur-3xl"
                />
                <motion.div
                  animate={{ x: [0, -12, 0], y: [0, 14, 0] }}
                  transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-[-20px] left-[-10px] h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl"
                />

                <div className="relative">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
                    Skysirv Intelligence Wrapped™
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-400">Skyscore™</p>
                      <h2 className="mt-2 text-5xl font-bold">
                        <CountUpNumber end={wrappedData.skyscore} />
                      </h2>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Beat Market</p>
                      <h2 className="mt-2 text-5xl font-bold">
                        <CountUpNumber end={wrappedData.beatMarket} suffix="%" />
                      </h2>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <SharePill label="Flights" value={String(wrappedData.flights)} />
                    <SharePill
                      label="Saved"
                      value={`$${wrappedData.savings.toLocaleString()}`}
                    />
                    <SharePill
                      label="Routes"
                      value={String(wrappedData.routesMonitored)}
                    />
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="text-sm leading-7 text-slate-300">
                      {wrappedLoading || wrappedData.routesMonitored === 0
                        ? "Your wrapped summary will appear here once enough real monitoring and travel data has been collected."
                        : `You beat the market ${wrappedData.beatMarket}% of the time and saved $${wrappedData.savings.toLocaleString()} this year.`}
                    </p>

                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Powered by Skysirv Intelligence™
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}