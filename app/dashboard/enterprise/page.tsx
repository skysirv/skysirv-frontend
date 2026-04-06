"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"

import RouteSearch from "@/components/dashboard/route-search"
import OpportunityBanner from "@/components/dashboard/opportunity-banner"
import MarketSignals from "@/components/dashboard/market-signals"
import WatchlistCard from "@/components/dashboard/watchlist-card"

import WatchlistSkeleton from "@/components/dashboard/watchlist-skeleton"
import OpportunitySkeleton from "@/components/dashboard/opportunity-skeleton"
import MarketSignalsSkeleton from "@/components/dashboard/market-signals-skeleton"

import TravelGlobe from "@/components/intelligence-wrapped/travel-globe"
import { toast } from "@/components/ui/Toasts/use-toast"

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

type WrappedData = {
  flights: number
  countries: number
  distance: string
  skyscore: number
  savings: number
  avgSavings: number
  beatMarket: number
  routesMonitored: number
  alertsTriggered: number
  alertsWon: number
  travelerIdentity: string
  bestRoute: {
    route: string
    saved: number
    beforeSpike: string
    timingGrade: string
  }
}

type WrappedSegment = {
  id: string
  trip_id: string
  user_id: string
  segment_order: number
  airline_code: string | null
  flight_number: string | null
  departure_airport_code: string | null
  departure_terminal: string | null
  departure_gate: string | null
  scheduled_departure_at: string | null
  actual_departure_at: string | null
  arrival_airport_code: string | null
  arrival_terminal: string | null
  arrival_gate: string | null
  scheduled_arrival_at: string | null
  actual_arrival_at: string | null
  cabin_class: string | null
  fare_class: string | null
  aircraft_type: string | null
  distance_km: number | null
  status: string | null
  source: string | null
  created_at: string | null
  updated_at: string | null
}

const defaultWrappedData: WrappedData = {
  flights: 0,
  countries: 0,
  distance: "0 km",
  skyscore: 0,
  savings: 0,
  avgSavings: 0,
  beatMarket: 0,
  routesMonitored: 0,
  alertsTriggered: 0,
  alertsWon: 0,
  travelerIdentity: "Precision Booker",
  bestRoute: {
    route: "BOS-LHR",
    saved: 312,
    beforeSpike: "19%",
    timingGrade: "A+",
  },
}

const WRAPPED_YEAR_OPTIONS = [2026]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [wrappedLoading, setWrappedLoading] = useState(true)
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [wrappedData, setWrappedData] = useState<WrappedData>(defaultWrappedData)
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [wrappedSegments, setWrappedSegments] = useState<WrappedSegment[]>([])

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

  const winRate =
    wrappedData.alertsTriggered > 0
      ? Math.round((wrappedData.alertsWon / wrappedData.alertsTriggered) * 100)
      : 0

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setWatchlist([])
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadWrapped(year: number) {
      const token = localStorage.getItem("skysirv_token")

      if (!token) {
        if (cancelled) return
        setWrappedData(defaultWrappedData)
        setWrappedSegments([])
        setWrappedLoading(false)
        return
      }

      if (!cancelled) {
        setWrappedLoading(true)
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/intelligence/wrapped/${year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json().catch(() => null)

        if (cancelled) return

        if (!res.ok || !data?.success || !data?.wrapped) {
          setWrappedData(defaultWrappedData)
          setWrappedSegments([])
          return
        }

        const payload = data.wrapped.wrapped_payload_json ?? {}
        const bestRoute = payload.bestRoute ?? {}
        const segments = Array.isArray(data.segments) ? data.segments : []

        setWrappedData({
          flights: Number(data.wrapped.flights ?? 0),
          countries: Number(data.wrapped.countries ?? 0),
          distance: `${Number(data.wrapped.distance_km ?? 0).toLocaleString()} km`,
          skyscore: Number(data.wrapped.skyscore_avg ?? 0),
          savings: Number(data.wrapped.savings_total ?? 0),
          avgSavings: Number(data.wrapped.avg_savings ?? 0),
          beatMarket: Number(data.wrapped.beat_market_pct ?? 0),
          routesMonitored: Number(data.wrapped.routes_monitored ?? 0),
          alertsTriggered: Number(data.wrapped.alerts_triggered ?? 0),
          alertsWon: Number(data.wrapped.alerts_won ?? 0),
          travelerIdentity: data.wrapped.traveler_identity ?? "Precision Booker",
          bestRoute: {
            route: bestRoute.route ?? "BOS-LHR",
            saved: Number(bestRoute.saved ?? 312),
            beforeSpike: bestRoute.beforeSpike ?? "19%",
            timingGrade: bestRoute.timingGrade ?? "A+",
          },
        })

        setWrappedSegments(segments)
      } catch (err) {
        console.error("Wrapped load failed", err)

        if (!cancelled) {
          setWrappedData(defaultWrappedData)
          setWrappedSegments([])
        }
      } finally {
        if (!cancelled) {
          setWrappedLoading(false)
        }
      }
    }

    loadWrapped(selectedYear)

    const onFocus = () => {
      loadWrapped(selectedYear)
    }

    window.addEventListener("focus", onFocus)

    return () => {
      cancelled = true
      window.removeEventListener("focus", onFocus)
    }
  }, [selectedYear])

  function handleRouteAdded(route: any) {
    setWatchlist((prev) => [...prev, route])

    toast({
      title: "Route added",
      description: "The route is now being monitored.",
    })
  }

  const sortedSegments = useMemo(() => {
    return [...wrappedSegments].sort((a, b) => {
      return Number(a.segment_order ?? 0) - Number(b.segment_order ?? 0)
    })
  }, [wrappedSegments])

  return (
    <section className="min-h-screen bg-white">
      {/* Cinematic Hero */}
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_48%,#ffffff_100%)]">
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6 md:pb-24 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm backdrop-blur-sm">
                Enterprise Plan Dashboard
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                Your full flight intelligence dashboard
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Monitor tracked routes, build pricing history over time, and unlock
                a fuller intelligence layer designed to surface richer route context
                as real data begins to accumulate.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  System Status
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  Pending
                </p>
              </div>

              <Link
                href="/account"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)] transition hover:bg-slate-800"
              >
                Account Settings
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          {/* Route Search */}
          <div className="mb-10">
            <RouteSearch onRouteAdded={handleRouteAdded} />
          </div>

          {/* Watchlist Intelligence Zone */}
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
                    history builds, Enterprise intelligence surfaces will begin
                    populating with richer route context and deeper monitoring detail.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Monitoring
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {loading ? "—" : watchlist.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Data Status
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      Building
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Signals
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      Pending
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      history. Enterprise intelligence layers will populate
                      automatically as real monitored data accumulates.
                    </p>
                  </div>
                ) : (
                  watchlist.map((route, index) => (
                    <div
                      key={index}
                      className="animate-[fadeInUp_0.35s_ease-out]"
                    >
                      <WatchlistCard
                        origin={route.origin}
                        destination={route.destination}
                        departureDate={route.departureDate ?? "Pending"}
                        onRemove={() => {
                          setWatchlist((prev) => prev.filter((_, i) => i !== index))
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Global Intelligence Signals */}
          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            {loading ? (
              <>
                <OpportunitySkeleton />
                <MarketSignalsSkeleton />
              </>
            ) : (
              <>
                <OpportunityBanner />
                <MarketSignals />
              </>
            )}
          </div>

          {/* Intelligence Wrapped Section */}
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
              {/* Wrapped Hero */}
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
                        {WRAPPED_YEAR_OPTIONS.map((year) => (
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

                {/* Travel Globe */}
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

                  <TravelGlobe />
                </motion.div>

                {/* Segment Intelligence */}
                <motion.div {...fadeUp} className="mt-14">
                  <div className="mb-8 text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                      Route Segment Intelligence
                    </p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                      Terminal-by-terminal trip flow
                    </h3>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      Follow how you moved through each leg of your journey with terminal,
                      gate, timing, aircraft, and cabin-level detail pulled directly from
                      your wrapped travel history.
                    </p>
                  </div>

                  {wrappedLoading ? (
                    <div className="grid gap-4">
                      <SegmentSkeleton />
                      <SegmentSkeleton />
                    </div>
                  ) : sortedSegments.length === 0 ? (
                    <div className="overflow-hidden rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-inner">
                        ⌁
                      </div>

                      <h4 className="text-lg font-semibold text-slate-900">
                        No route segments available for {selectedYear}
                      </h4>

                      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                        Once completed trips exist for this wrapped year, your terminals,
                        gates, aircraft, and segment flow will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-5">
                      {sortedSegments.map((segment) => (
                        <SegmentCard key={segment.id} segment={segment} />
                      ))}
                    </div>
                  )}
                </motion.div>
              </section>

              {/* Premium Divider */}
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

              {/* Annual Skyscore */}
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

              {/* Savings */}
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
                    Estimated savings captured through smarter timing and monitored
                    opportunities.
                  </p>
                </MotionCard>

                <MotionCard>
                  <p className="text-sm text-slate-500">Avg / Flight</p>
                  <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    $<CountUpNumber end={wrappedData.avgSavings} />
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Your average booking advantage across completed trips this year.
                  </p>
                </MotionCard>

                <MotionCard>
                  <p className="text-sm text-slate-500">Beat Market</p>
                  <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    <CountUpNumber end={wrappedData.beatMarket} suffix="%" />
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    How often your booking decisions outperformed the broader fare
                    environment.
                  </p>
                </MotionCard>
              </motion.section>

              {/* Intelligence Layer */}
              <motion.section
                {...fadeUp}
                transition={{ delay: 0.08, duration: 0.75, ease: "easeOut" }}
                className="mx-auto max-w-6xl py-12 sm:py-16"
              >
                <div className="mb-8 max-w-2xl">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
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
                      <DarkWrappedCard>
                        <div className="flex h-full flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <PulseDot delay={index * 0.18} />
                              <p className="text-sm font-semibold text-white">
                                {item.title}
                              </p>
                            </div>

                            <p className="mt-4 text-sm font-medium text-sky-200">
                              {item.stat}
                            </p>

                            <p className="mt-3 text-sm leading-6 text-slate-300">
                              {item.description}
                            </p>
                          </div>

                          <div className="mt-6 inline-flex w-fit items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                            Active
                          </div>
                        </div>
                      </DarkWrappedCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>

              {/* Route Story */}
              <motion.section
                {...fadeUp}
                transition={{ delay: 0.08, duration: 0.75, ease: "easeOut" }}
                className="mx-auto max-w-6xl py-12 sm:py-16"
              >
                <div className="mb-8 max-w-3xl">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
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
                          {wrappedData.bestRoute.route.replace("-", " → ")}
                        </h4>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                          You booked before a major upward move and locked in one of the
                          strongest timing wins in your travel profile.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                          <MiniMetric
                            label="Saved"
                            value={`$${wrappedData.bestRoute.saved.toLocaleString()}`}
                          />
                          <MiniMetric
                            label="Before Spike"
                            value={wrappedData.bestRoute.beforeSpike}
                          />
                          <MiniMetric
                            label="Timing Grade"
                            value={wrappedData.bestRoute.timingGrade}
                          />
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
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
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

              {/* Monitor Performance */}
              <motion.section
                {...fadeUp}
                transition={{ delay: 0.1, duration: 0.75, ease: "easeOut" }}
                className="mx-auto grid max-w-6xl gap-6 py-12 sm:grid-cols-3 sm:py-16"
              >
                <MotionCard>
                  <p className="text-sm text-slate-500">Alerts Triggered</p>
                  <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    <CountUpNumber end={wrappedData.alertsTriggered} />
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Monitor activity generated across tracked routes and pricing events.
                  </p>
                </MotionCard>

                <MotionCard>
                  <p className="text-sm text-slate-500">Successful Alerts</p>
                  <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    <CountUpNumber end={wrappedData.alertsWon} />
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

              {/* Traveler Identity */}
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
                      You are a {wrappedData.travelerIdentity}
                    </h3>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                      You wait, analyze, and strike at the right moment — consistently
                      outperforming the market with calm, disciplined timing.
                    </p>
                  </div>
                </motion.div>
              </motion.section>

              {/* Share Card */}
              <motion.section
                {...fadeUp}
                transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
                className="mx-auto max-w-3xl px-0 pb-6 pt-8"
              >
                <div className="text-center">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
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
                          <SharePill
                            label="Flights"
                            value={String(wrappedData.flights)}
                          />
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
                            You beat the market {wrappedData.beatMarket}% of the time and
                            saved ${wrappedData.savings.toLocaleString()} this year.
                          </p>

                          <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
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
          </div>

          {/* Market Section on Light Background */}
          <div className="relative mt-14">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm">
                  Live Market Intelligence
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                  Your intelligence layer, building in real time
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  As routes are monitored and pricing history develops, your intelligence
                  layer will begin surfacing route behavior, signal strength, and
                  timing insights based on real market data.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Routes Scanned
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    {watchlist.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Price Shifts
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">—</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Alerts Triggered
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">—</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
                className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.22)]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Featured Route
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      No route selected
                    </h3>
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    DATA PENDING
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                      Current Fare
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">—</p>
                    <p className="mt-1 text-xs text-emerald-300">No data yet</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                      Volatility
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      —
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Awaiting data
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                      Confidence
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">—</p>
                    <p className="mt-1 text-xs text-sky-300">
                      Not available
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                    <span>Price Behavior</span>
                    <span>Data builds after monitoring begins</span>
                  </div>

                  <div className="relative h-40 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.4)_0%,rgba(2,6,23,0.65)_100%)] p-4">
                    <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />
                    <div className="absolute inset-x-0 bottom-8 border-t border-dashed border-white/10" />
                    <svg
                      viewBox="0 0 600 180"
                      className="h-full w-full"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 42 C40 50, 75 78, 118 70 C165 60, 210 102, 252 90 C302 76, 340 110, 386 92 C430 74, 468 58, 516 66 C548 72, 575 60, 600 48"
                        fill="none"
                        stroke="rgba(56,189,248,0.95)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0 42 C40 50, 75 78, 118 70 C165 60, 210 102, 252 90 C302 76, 340 110, 386 92 C430 74, 468 58, 516 66 C548 72, 575 60, 600 48 L600 180 L0 180 Z"
                        fill="url(#dashboardPriceGlow)"
                        opacity="0.35"
                      />
                      <defs>
                        <linearGradient
                          id="dashboardPriceGlow"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="rgba(56,189,248,0.35)" />
                          <stop offset="100%" stopColor="rgba(56,189,248,0)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="grid gap-6"
              >
                <div className="rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.20)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Signal Feed
                  </p>

                  <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-slate-950/20 p-6 text-center">
                    <p className="text-sm text-slate-300">
                      Signal feed will activate once monitored routes begin generating
                      real market data.
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.20)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    System Readout
                  </p>

                  <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-slate-950/20 p-6 text-center">
                    <p className="text-sm text-slate-300">
                      System metrics will populate as route monitoring and signal
                      processing begins.
                    </p>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-300">
                    Live route behavior is being translated into guidance,
                    confidence scoring, and decision-ready signals across the
                    network.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
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

function DarkWrappedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22 }}
      className="group h-full rounded-[1.75rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-8 shadow-[0_20px_50px_rgba(2,6,23,0.16)]"
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
      className="inline-block h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.45)]"
    />
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
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

function SegmentCard({ segment }: { segment: WrappedSegment }) {
  const departureTime = formatSegmentTime(
    segment.actual_departure_at ?? segment.scheduled_departure_at
  )
  const arrivalTime = formatSegmentTime(
    segment.actual_arrival_at ?? segment.scheduled_arrival_at
  )

  const scheduledDeparture = formatSegmentDateTime(segment.scheduled_departure_at)
  const actualDeparture = formatSegmentDateTime(segment.actual_departure_at)
  const scheduledArrival = formatSegmentDateTime(segment.scheduled_arrival_at)
  const actualArrival = formatSegmentDateTime(segment.actual_arrival_at)

  const flightLabel = [segment.airline_code, segment.flight_number]
    .filter(Boolean)
    .join(" ")

  const departureTerminal = segment.departure_terminal || "—"
  const arrivalTerminal = segment.arrival_terminal || "—"
  const departureGate = segment.departure_gate || "—"
  const arrivalGate = segment.arrival_gate || "—"
  const aircraft = segment.aircraft_type || "—"
  const cabin = segment.cabin_class ? toTitleCase(segment.cabin_class) : "—"
  const fareClass = segment.fare_class || "—"
  const segmentDistance =
    typeof segment.distance_km === "number"
      ? `${segment.distance_km.toLocaleString()} km`
      : "—"

  const duration = getFlightDuration(
    segment.actual_departure_at ?? segment.scheduled_departure_at,
    segment.actual_arrival_at ?? segment.scheduled_arrival_at
  )

  const departurePerformance = getTimingPerformance(
    segment.scheduled_departure_at,
    segment.actual_departure_at,
    "departure"
  )

  const arrivalPerformance = getTimingPerformance(
    segment.scheduled_arrival_at,
    segment.actual_arrival_at,
    "arrival"
  )

  const routeSummary = `${segment.departure_airport_code ?? "—"} (${departureTerminal}, Gate ${departureGate}) → ${segment.arrival_airport_code ?? "—"} (${arrivalTerminal}, Gate ${arrivalGate})`

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur"
    >
      <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Segment {segment.segment_order}
            </div>

            <h4 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {segment.departure_airport_code ?? "—"}{" "}
              <span className="text-slate-400">→</span>{" "}
              {segment.arrival_airport_code ?? "—"}
            </h4>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              <span className="font-semibold text-slate-900">{routeSummary}</span>
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {flightLabel || "Flight data unavailable"} • {aircraft} • {cabin} • Fare{" "}
              {fareClass}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SegmentMetaPill label="Distance" value={segmentDistance} />
            <SegmentMetaPill label="Status" value={toTitleCase(segment.status || "—")} />
            <SegmentMetaPill label="Duration" value={duration} />
            <SegmentMetaPill label="Flight" value={flightLabel || "—"} />
          </div>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Departure
            </p>

            <h5 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {segment.departure_airport_code ?? "—"}
            </h5>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniField label="Terminal" value={departureTerminal} />
              <MiniField label="Gate" value={departureGate} />
            </div>

            <div className="mt-4 space-y-2">
              <TimeRow label="Scheduled" value={scheduledDeparture} />
              <TimeRow label="Actual" value={actualDeparture} />
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Timing Readout
              </p>
              <p className={`mt-1 text-sm font-semibold ${departurePerformance.color}`}>
                {departurePerformance.label}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full min-w-[200px] max-w-[260px]">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>{departureTime}</span>
                <span>{arrivalTime}</span>
              </div>

              <div className="relative h-3 rounded-full bg-slate-200">
                <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-400" />
                <div className="absolute -left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-sky-500 shadow-md" />
                <div className="absolute -right-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-500 shadow-md" />
              </div>

              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <span className="text-lg text-slate-400">✈</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Terminal Flow
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Arrival
            </p>

            <h5 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {segment.arrival_airport_code ?? "—"}
            </h5>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniField label="Terminal" value={arrivalTerminal} />
              <MiniField label="Gate" value={arrivalGate} />
            </div>

            <div className="mt-4 space-y-2">
              <TimeRow label="Scheduled" value={scheduledArrival} />
              <TimeRow label="Actual" value={actualArrival} />
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Timing Readout
              </p>
              <p className={`mt-1 text-sm font-semibold ${arrivalPerformance.color}`}>
                {arrivalPerformance.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SegmentSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="mt-4 h-8 w-48 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-64 rounded bg-slate-100" />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="h-40 rounded-[1.5rem] bg-slate-100" />
          <div className="h-16 rounded-full bg-slate-100 lg:self-center" />
          <div className="h-40 rounded-[1.5rem] bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

function SegmentMetaPill({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 px-3 py-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function MiniField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function TimeRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  )
}

function formatSegmentTime(value?: string | null) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatSegmentDateTime(value?: string | null) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function getFlightDuration(
  departure?: string | null,
  arrival?: string | null
) {
  if (!departure || !arrival) return "—"

  const departureDate = new Date(departure)
  const arrivalDate = new Date(arrival)

  if (
    Number.isNaN(departureDate.getTime()) ||
    Number.isNaN(arrivalDate.getTime())
  ) {
    return "—"
  }

  const diffMs = arrivalDate.getTime() - departureDate.getTime()

  if (diffMs <= 0) return "—"

  const totalMinutes = Math.round(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${minutes}m`
}

function getTimingPerformance(
  scheduled?: string | null,
  actual?: string | null,
  type: "departure" | "arrival" = "departure"
) {
  if (!scheduled || !actual) {
    return {
      label: "Timing data unavailable",
      color: "text-slate-600",
    }
  }

  const scheduledDate = new Date(scheduled)
  const actualDate = new Date(actual)

  if (
    Number.isNaN(scheduledDate.getTime()) ||
    Number.isNaN(actualDate.getTime())
  ) {
    return {
      label: "Timing data unavailable",
      color: "text-slate-600",
    }
  }

  const diffMinutes = Math.round(
    (actualDate.getTime() - scheduledDate.getTime()) / 60000
  )

  if (diffMinutes === 0) {
    return {
      label: `Right on time ${type === "arrival" ? "arrival" : "departure"}`,
      color: "text-emerald-600",
    }
  }

  if (diffMinutes < 0) {
    return {
      label: `${Math.abs(diffMinutes)} min early`,
      color: "text-emerald-600",
    }
  }

  return {
    label: `${diffMinutes} min late`,
    color: "text-rose-600",
  }
}

function toTitleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}