"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import TravelGlobe from "@/components/intelligence-wrapped/travel-globe"

type GlobeAirportNode = {
  airportCode: string
  lat?: number
  lng?: number
  name?: string
  city?: string
  country?: string
  visits?: number
  layoverHours?: number
  loungeHours?: number
  flights?: number
}

type GlobeRouteArc = {
  tripId: string
  segmentId: string
  segmentOrder: number
  origin: string
  destination: string
  airlineCode: string | null
  flightNumber: string | null
  status: string
  source: string | null
  scheduledDepartureAt: string | null
  scheduledArrivalAt: string | null
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, ease: "easeOut" as const },
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
}

export default function IntelligenceWrappedPage() {
  const [globeAirportNodes, setGlobeAirportNodes] = useState<GlobeAirportNode[]>([])
  const [globeRouteArcs, setGlobeRouteArcs] = useState<GlobeRouteArc[]>([])
  const data = {
    flights: 18,
    countries: 7,
    distance: "142,000 km",
    skyscore: 87,
    savings: 2340,
    avgSavings: 130,
    beatMarket: 71,
    routesMonitored: 12,
    alertsTriggered: 46,
    alertsWon: 9,
  }

  const intelligenceItems = [
    {
      title: "Skysirv Monitor™",
      stat: "12 active routes",
      description: "Live route monitoring across your most important fare watches.",
    },
    {
      title: "Skysirv Signals™",
      stat: "14 buy opportunities",
      description: "Actionable moments detected before the market moved away from you.",
    },
    {
      title: "Skysirv Price Behavior™",
      stat: "6 volatile routes detected",
      description: "Pattern analysis for unstable routes and risky booking windows.",
    },
    {
      title: "Skysirv Predict™",
      stat: "3 spike windows avoided",
      description: "Forward-looking logic that helped you dodge unfavorable surges.",
    },
    {
      title: "Skyscore™",
      stat: "87 annual average",
      description: "A confidence measure of how intelligently you booked all year.",
    },
    {
      title: "Skysirv Insights™",
      stat: "21 intelligence summaries",
      description: "Concise route intelligence generated from your monitored activity.",
    },
    {
      title: "Skysirv Route Digest™",
      stat: "8 key route briefings",
      description: "High-level summaries of route performance and timing quality.",
    },
    {
      title: "Skysirv Intelligence Engine™",
      stat: "Always learning",
      description: "The central system connecting your price, timing, and decision signals.",
    },
  ]

  const winRate = Math.round((data.alertsWon / data.alertsTriggered) * 100)

  useEffect(() => {
    async function loadWrapped() {
      try {
        const token = localStorage.getItem("skysirv_token")

        if (!token) return

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/intelligence/wrapped/2026`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const json = await res.json()
        console.log("wrapped globe payload", json)

        if (!json?.success) return

        setGlobeAirportNodes(json.airportNodes ?? [])
        setGlobeRouteArcs(json.routeArcs ?? [])
      } catch (err) {
        console.error("Failed to load wrapped data", err)
      }
    }

    loadWrapped()
  }, [])

  return (
    <div className="relative overflow-hidden bg-white text-slate-900">
      {/* Background atmosphere */}
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
      </div>

      {/* ================= HERO ================= */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.55 }}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium tracking-[0.18em] text-slate-600 uppercase shadow-sm backdrop-blur"
          >
            2026 Annual Intelligence Report
          </motion.div>

          <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Your Skysirv Intelligence Wrapped™
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg"
          >
            You didn’t just travel. You tracked smarter, booked sharper, and
            outperformed the market with confidence.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
        >
          <motion.div variants={staggerItem}>
            <Stat label="Flights" value={data.flights} />
          </motion.div>

          <motion.div variants={staggerItem}>
            <Stat label="Countries" value={data.countries} />
          </motion.div>

          <motion.div variants={staggerItem}>
            <Stat label="Distance" value={data.distance} />
          </motion.div>

          <motion.div variants={staggerItem}>
            <Stat label="Routes Monitored" value={data.routesMonitored} />
          </motion.div>
        </motion.div>

        {/* ================= TRAVEL GLOBE UPGRADE ================= */}
        <motion.div
          {...fadeUp}
          className="mt-12"
        >
          <div className="mb-6 text-center">
            <p className="text-sm font-medium tracking-[0.16em] text-slate-500 uppercase">
              Travel Footprint
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Explore your year on the globe
            </h2>
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
      </section>

      {/* ================= PREMIUM DIVIDER ================= */}
      <motion.section
        {...fadeUp}
        className="relative mx-auto max-w-4xl px-6 py-2"
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

      {/* ================= SKYSCORE ================= */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-5xl px-6 py-10 sm:py-14"
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
              <p className="text-sm font-medium tracking-[0.16em] text-slate-500 uppercase">
                Annual Skyscore™
              </p>

              <h2 className="mt-4 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
                <CountUpNumber end={data.skyscore} />
              </h2>

              <p className="mt-3 text-lg font-semibold text-emerald-600">
                Elite Traveler
              </p>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Your booking behavior consistently landed in high-confidence
                territory, with strong timing discipline and above-market
                decision quality throughout the year.
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
                  <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                    Score
                  </p>
                  <p className="mt-2 text-6xl font-bold tracking-tight text-slate-950">
                    <CountUpNumber end={data.skyscore} />
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ================= SAVINGS ================= */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.05, duration: 0.75, ease: "easeOut" }}
        className="mx-auto grid max-w-6xl gap-6 px-6 py-12 sm:grid-cols-3 sm:py-16"
      >
        <MotionCard>
          <p className="text-sm text-slate-500">Total Saved</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            $<CountUpNumber end={data.savings} />
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Estimated savings captured through smarter timing and monitored
            opportunities.
          </p>
        </MotionCard>

        <MotionCard>
          <p className="text-sm text-slate-500">Avg / Flight</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            $<CountUpNumber end={data.avgSavings} />
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your average booking advantage across completed trips this year.
          </p>
        </MotionCard>

        <MotionCard>
          <p className="text-sm text-slate-500">Beat Market</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            <CountUpNumber end={data.beatMarket} suffix="%" />
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            How often your booking decisions outperformed the broader fare
            environment.
          </p>
        </MotionCard>
      </motion.section>

      {/* ================= INTELLIGENCE LAYER ================= */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.08, duration: 0.75, ease: "easeOut" }}
        className="mx-auto max-w-6xl px-6 py-12 sm:py-16"
      >
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium tracking-[0.16em] text-slate-500 uppercase">
            Proprietary Stack
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Skysirv Intelligence Layer
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            The systems behind your alerts, route analysis, price behavior
            modeling, and decision confidence — all working together as one
            intelligence network.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {intelligenceItems.map((item, index) => (
            <motion.div key={item.title} variants={staggerItem}>
              <MotionCard>
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <PulseDot delay={index * 0.18} />
                      <p className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </p>
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-700">
                      {item.stat}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Active
                  </div>
                </div>
              </MotionCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= ROUTE STORY ================= */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.08, duration: 0.75, ease: "easeOut" }}
        className="mx-auto max-w-6xl px-6 py-12 sm:py-16"
      >
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-medium tracking-[0.16em] text-slate-500 uppercase">
            Route Story
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Your smartest move this year
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            One route stood out above the rest — not just because of savings,
            but because of timing, restraint, and sharp decision-making before
            the market turned.
          </p>
        </div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
        >
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative p-8 sm:p-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-sky-50/60" />
              <div className="relative">
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                  Best Booking of the Year
                </div>

                <h4 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  BOS → LHR
                </h4>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  You booked before a major upward move and locked in one of the
                  strongest timing wins in your travel profile.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <MiniMetric label="Saved" value="$312" />
                  <MiniMetric label="Before Spike" value="19%" />
                  <MiniMetric label="Timing Grade" value="A+" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white sm:p-10">
              <motion.div
                animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-[-20px] top-[-20px] h-40 w-40 rounded-full bg-sky-500/10 blur-3xl"
              />
              <motion.div
                animate={{ x: [0, -12, 0], y: [0, 16, 0] }}
                transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-30px] left-[-20px] h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl"
              />

              <div className="relative">
                <p className="text-xs font-medium tracking-[0.16em] text-slate-300 uppercase">
                  Why it mattered
                </p>

                <div className="mt-6 space-y-5">
                  <StoryPoint
                    title="Price behavior"
                    text="This route showed rising pressure before departure with a tightening discount window."
                  />
                  <StoryPoint
                    title="Signal quality"
                    text="Skysirv identified a favorable timing pocket before volatility accelerated."
                  />
                  <StoryPoint
                    title="Decision outcome"
                    text="You beat the route’s later market conditions and preserved a higher-confidence buy."
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ================= MONITOR PERFORMANCE ================= */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.1, duration: 0.75, ease: "easeOut" }}
        className="mx-auto grid max-w-6xl gap-6 px-6 py-12 sm:grid-cols-3 sm:py-16"
      >
        <MotionCard>
          <p className="text-sm text-slate-500">Alerts Triggered</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            <CountUpNumber end={data.alertsTriggered} />
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Monitor activity generated across tracked routes and pricing events.
          </p>
        </MotionCard>

        <MotionCard>
          <p className="text-sm text-slate-500">Successful Alerts</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            <CountUpNumber end={data.alertsWon} />
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Signals that turned into smart decisions or avoided unfavorable fare
            moves.
          </p>
        </MotionCard>

        <MotionCard>
          <p className="text-sm text-slate-500">Win Rate</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            <CountUpNumber end={winRate} suffix="%" />
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A clean measure of how often Skysirv alerts created real booking
            value.
          </p>
        </MotionCard>
      </motion.section>

      {/* ================= TRAVELER IDENTITY ================= */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.12, duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-4xl px-6 py-16 sm:py-20"
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
            <p className="text-xs font-medium tracking-[0.18em] text-slate-300 uppercase">
              Traveler Identity
            </p>

            <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              You are a Precision Booker
            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              You wait, analyze, and strike at the right moment — consistently
              outperforming the market with calm, disciplined timing.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* ================= SHARE CARD ================= */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-3xl px-6 pb-24 pt-8 sm:pb-28"
      >
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.16em] text-slate-500 uppercase">
            Shareable Snapshot
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Share Your Intelligence
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            A social-ready summary of how you traveled, saved, and outperformed
            the market this year.
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
                <p className="text-xs font-medium tracking-[0.16em] text-slate-300 uppercase">
                  Skysirv Intelligence Wrapped™
                </p>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-400">Skyscore™</p>
                    <h2 className="mt-2 text-5xl font-bold">
                      <CountUpNumber end={data.skyscore} />
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Beat Market</p>
                    <h2 className="mt-2 text-5xl font-bold">
                      <CountUpNumber end={data.beatMarket} suffix="%" />
                    </h2>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  <SharePill label="Flights" value={String(data.flights)} />
                  <SharePill label="Saved" value={`$${data.savings.toLocaleString()}`} />
                  <SharePill label="Routes" value={String(data.routesMonitored)} />
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-sm leading-7 text-slate-300">
                    You beat the market {data.beatMarket}% of the time and saved{" "}
                    ${data.savings.toLocaleString()} this year.
                  </p>

                  <p className="mt-4 text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
                    Powered by Skysirv Intelligence™
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
          >
            Download Image
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
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

function MotionCard({ children }: { children: React.ReactNode }) {
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

function PulseDot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      animate={{ scale: [1, 1.35, 1], opacity: [0.55, 1, 0.55] }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className="inline-block h-2.5 w-2.5 rounded-full bg-sky-600 shadow-[0_0_14px_rgba(14,165,233,0.45)]"
    />
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  )
}

function StoryPoint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
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