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
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.6, ease: "easeOut" as const },
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

type SessionSubscription = {
  id: string | null
  user_id: string
  plan_id: string
  status: string
  billing_interval: string | null
  stripe_subscription_id: string | null
  current_period_end: string | null
  created_at: string | null
}

type SessionResponse = {
  user?: {
    id: string
    email: string
    is_admin: boolean
    is_verified: boolean
    created_at: string
  }
  subscription?: SessionSubscription
  error?: string
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

type WatchlistRoute = {
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
}

type WatchlistResponse =
  | WatchlistRoute[]
  | {
    watchlist?: WatchlistRoute[]
    routes?: WatchlistRoute[]
    data?: WatchlistRoute[]
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
  travelerIdentity: "Smart Traveler",
  bestRoute: {
    route: "—",
    saved: 0,
    beforeSpike: "—",
    timingGrade: "—",
  },
}

const WRAPPED_START_YEAR = 2026

async function fetchAvailableWrappedYears(token: string) {
  const currentYear = new Date().getFullYear()

  const candidateYears = Array.from(
    { length: Math.max(currentYear - WRAPPED_START_YEAR + 1, 1) },
    (_, index) => currentYear - index
  ).filter((year) => year >= WRAPPED_START_YEAR)

  const results = await Promise.all(
    candidateYears.map(async (year) => {
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

        if (res.ok && data?.success && data?.wrapped) {
          return year
        }

        return null
      } catch {
        return null
      }
    })
  )

  const availableYears = results.filter((year): year is number => year !== null)

  return availableYears.length ? availableYears : [currentYear]
}

export default function ProDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [wrappedLoading, setWrappedLoading] = useState(true)
  const [watchlist, setWatchlist] = useState<WatchlistRoute[]>([])
  const [wrappedData, setWrappedData] = useState<WrappedData>(defaultWrappedData)
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [availableWrappedYears, setAvailableWrappedYears] = useState<number[]>([2026])
  const [wrappedSegments, setWrappedSegments] = useState<WrappedSegment[]>([])
  const [subscription, setSubscription] = useState<SessionSubscription | null>(null)
  const [watchlistFetchKey, setWatchlistFetchKey] = useState(0)

  const isLifetimePro = subscription?.plan_id === "pro_lifetime"

  const proIntelligenceItems = [
    {
      title: "Skysirv Monitor™",
      stat: "25 route capacity",
      description:
        "High-frequency route monitoring designed for travelers with a more active booking strategy.",
    },
    {
      title: "Skysirv Signals™",
      stat: "Smart drop detection",
      description:
        "Stronger signal visibility with more actionable fare timing and booking opportunity awareness.",
    },
    {
      title: "Skysirv Price Behavior™",
      stat: "30–90 day analysis",
      description:
        "Expanded lookback windows to understand pricing direction, route pressure, and volatility patterns.",
    },
    {
      title: "Skysirv Predict™",
      stat: "Forecast signals",
      description:
        "Forward-looking guidance designed to help you avoid weak timing and identify stronger buy windows.",
    },
    {
      title: "Skyscore™",
      stat: "Full intelligence scoring",
      description:
        "A complete scoring layer that reflects booking quality, timing confidence, and decision discipline.",
    },
    {
      title: "Skysirv Route Digest™",
      stat: "Included",
      description:
        "A richer route summary layer with digest-style intelligence across your monitored activity.",
    },
  ]

  useEffect(() => {
    let cancelled = false

    async function loadWatchlist() {
      const token = localStorage.getItem("skysirv_token")

      if (!token) {
        if (!cancelled) {
          setWatchlist([])
          setLoading(false)
        }
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/watchlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data: WatchlistResponse = await res.json().catch(() => [])

        if (cancelled) return

        const routes = Array.isArray(data)
          ? data
          : Array.isArray(data.watchlist)
            ? data.watchlist
            : Array.isArray(data.routes)
              ? data.routes
              : Array.isArray(data.data)
                ? data.data
                : []

        setWatchlist(routes)
      } catch (error) {
        console.error("Failed to load watchlist", error)

        if (!cancelled) {
          setWatchlist([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadWatchlist()

    return () => {
      cancelled = true
    }
  }, [watchlistFetchKey])

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      const token = localStorage.getItem("skysirv_token")

      if (!token) return

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data: SessionResponse = await res.json().catch(() => ({}))

        if (!cancelled && res.ok) {
          setSubscription(data.subscription ?? null)
        }
      } catch (error) {
        console.error("Failed to load pro dashboard session", error)
      }
    }

    loadSession()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadAvailableYears() {
      const token = localStorage.getItem("skysirv_token")

      if (!token) {
        if (cancelled) return
        return
      }

      try {
        const years = await fetchAvailableWrappedYears(token)

        if (cancelled) return

        setAvailableWrappedYears(years)
        setSelectedYear((currentSelectedYear) => {
          return years.includes(currentSelectedYear) ? currentSelectedYear : years[0]
        })
      } catch (error) {
        console.error("Failed to load available wrapped years", error)
      }
    }

    loadAvailableYears()

    return () => {
      cancelled = true
    }
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
          travelerIdentity: data.wrapped.traveler_identity ?? "Smart Traveler",
          bestRoute: {
            route: bestRoute.route ?? "—",
            saved: Number(bestRoute.saved ?? 0),
            beforeSpike: bestRoute.beforeSpike ?? "—",
            timingGrade: bestRoute.timingGrade ?? "—",
          },
        })

        setWrappedSegments(segments)
      } catch (err) {
        console.error("Pro wrapped load failed", err)

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

  function handleRouteAdded(route: WatchlistRoute) {
    setWatchlist((prev) => {
      if (prev.length >= 25) {
        toast({
          title: "Pro plan limit reached",
          description: "Pro plans can monitor up to 25 routes.",
        })
        return prev
      }

      const routeId = route.id ?? route.route_hash ?? route.route

      const alreadyExists = prev.some((item) => {
        const itemId = item.id ?? item.route_hash ?? item.route
        return itemId && routeId && itemId === routeId
      })

      if (alreadyExists) {
        toast({
          title: "Route already monitored",
          description: "That route is already in your Pro watchlist.",
        })
        return prev
      }

      toast({
        title: "Route added",
        description: "The route is now being monitored on your Pro plan.",
      })

      return [route, ...prev]
    })

    refreshWatchlistWithRetries()
  }

  async function handleRouteRemoved(routeId: string) {
    const token = localStorage.getItem("skysirv_token")

    if (!token) {
      toast({
        title: "Unable to remove route",
        description: "You must be signed in to update your watchlist.",
      })
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/watchlist/${routeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        console.error("Failed to delete watchlist route", data)

        toast({
          title: "Remove failed",
          description: "The route could not be removed from your watchlist.",
        })
        return
      }

      setWatchlist((prev) => prev.filter((item) => item.id !== routeId))

      toast({
        title: "Route removed",
        description: "The route was removed from your Pro watchlist.",
      })
    } catch (error) {
      console.error("Watchlist delete request failed", error)

      toast({
        title: "Remove failed",
        description: "Something went wrong while removing the route.",
      })
    }
  }

  function refreshWatchlistWithRetries() {
    const delays = [1500, 4000, 7000]

    delays.forEach((delay) => {
      window.setTimeout(() => {
        setWatchlistFetchKey((prev) => prev + 1)
      }, delay)
    })
  }

  const remainingRoutes = Math.max(0, 25 - watchlist.length)

  const sortedSegments = useMemo(() => {
    return [...wrappedSegments].sort((a, b) => {
      return Number(a.segment_order ?? 0) - Number(b.segment_order ?? 0)
    })
  }, [wrappedSegments])

  return (
    <section className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_42%,#ffffff_100%)]">
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6 md:pb-24 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm backdrop-blur-sm">
                {isLifetimePro ? "Lifetime Pro Dashboard" : "Pro Plan Dashboard"}
              </div>

              {isLifetimePro && (
                <div className="mb-4 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 shadow-sm">
                  Gifted Lifetime Access
                </div>
              )}

              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                A sharper intelligence solution for more serious travelers
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Pro unlocks deeper route behavior, stronger signal visibility,
                full Skyscore™ access, and a more capable dashboard designed for
                travelers who want richer insight as real route data begins to build.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="max-w-[280px] rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  System Status
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  Pending
                </p>
              </div>

              <Link
                href="/account"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl bg-slate-950 px-6 py-4 text-sm font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:bg-slate-900"
              >
                Account Settings
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-xl"
          >
            <HeroStat
              label={"Watchlist\nCapacity"}
              value={loading ? "—" : `${watchlist.length}/25`}
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

      {/* Main Content */}
      <div className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          {/* Route Search */}
          <div className="mb-10">
            <RouteSearch onRouteAdded={handleRouteAdded} />
          </div>

          {/* Watchlist Zone */}
          <motion.section
            {...fadeUp}
            className="relative mb-12 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#f6f9fc_42%,#ffffff_100%)] px-5 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:px-7 md:px-8 md:py-10"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.10)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
              <div className="absolute right-[-60px] top-[-20px] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(255,255,255,0)_74%)] blur-3xl" />
            </div>

            <div className="relative">
              <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur-sm">
                    Pro Watchlist Intelligence
                  </div>

                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                    Expand your monitored decision layer
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                    Pro gives you meaningful scale without the full Enterprise
                    command center — more routes, stronger signal coverage, and
                    a more capable market-reading workflow.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <CompactStat
                    label="Tracked"
                    value={loading ? "—" : String(watchlist.length)}
                  />
                  <CompactStat
                    label="Remaining"
                    value={loading ? "—" : String(remainingRoutes)}
                  />
                  <CompactStat label="Tier" value={isLifetimePro ? "Lifetime Pro" : "Pro"} />
                </div>
              </div>

              <div className="grid max-h-[1400px] gap-6 overflow-y-auto pr-2 md:grid-cols-2 xl:grid-cols-3">
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
                      No Pro routes monitored yet
                    </h3>

                    <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">
                      Add routes above to begin monitoring pricing activity. As your
                      tracked routes collect real data, Pro intelligence layers will
                      begin populating automatically.
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
                          bookingSignal={route.booking_signal ?? null}
                          latestAirline={route.latest_airline ?? null}
                          latestFlightNumber={route.latest_flight_number ?? null}
                          latestCapturedAt={route.latest_captured_at ?? null}
                          volatilityIndex={route.volatility_index ?? null}
                          onRemove={() => {
                            if (!route.id) return
                            void handleRouteRemoved(route.id)
                          }}
                        />
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </motion.section>

          {/* Pro Capability Stats */}
          <motion.section
            {...fadeUp}
            className="mb-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <InfoCard
              label="Price Behavior™"
              value="30–90 Day Window"
              description="Pro supports deeper historical monitoring windows once your tracked routes begin collecting enough data."
            />
            <InfoCard
              label="Skysirv Signals™"
              value="Pro Access"
              description="Signal visibility becomes available as monitored routes build real pricing history over time."
            />
            <InfoCard
              label="Skyscore™"
              value="Included"
              description="Pro includes full scoring access when enough real monitoring data exists to generate it."
            />
            <InfoCard
              label="Forecast Visibility"
              value="Available"
              description="Forward-looking guidance appears once monitored routes have enough live data to support it."
            />
          </motion.section>

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

                  <TravelGlobe />
                </motion.div>

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
                  <div
                    className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
                  >
                    <div
                      className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white"
                    >
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

          {/* Pro Stack */}
          <motion.section {...fadeUp} className="mx-auto mt-14 max-w-7xl">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                Pro Intelligence Layer
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                A more capable stack for better timing
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Pro opens up more of the Skysirv system while holding back the
                full Enterprise command layer. You get stronger route analysis,
                forecast visibility, and deeper signal clarity.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              {proIntelligenceItems.map((item) => (
                <motion.div key={item.title} variants={staggerItem}>
                  <DarkWrappedCard>
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.title}
                        </p>

                        <p className="mt-4 text-sm font-medium text-sky-200">
                          {item.stat}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-6 inline-flex w-fit items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-300">
                        Pro Access
                      </div>
                    </div>
                  </DarkWrappedCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Pro Market View */}
          <motion.section {...fadeUp} className="mt-14">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                Pro Market View
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Better visibility once monitoring begins
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Pro is designed to surface deeper price behavior, stronger route
                context, and more actionable monitoring visibility — but those
                intelligence layers only appear after you begin tracking routes.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.22)]">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Route Intelligence Preview
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      No monitored route data yet
                    </h3>
                  </div>

                  <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300">
                    DATA PENDING
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <ProRouteStat
                    label="Current Fare"
                    value="—"
                    subtext="Appears after route monitoring begins"
                  />
                  <ProRouteStat
                    label="Price Behavior"
                    value="Pending"
                    subtext="Waiting for enough tracked history"
                  />
                  <ProRouteStat
                    label="Signal Status"
                    value="Pending"
                    subtext="Signals appear after monitoring begins"
                  />
                </div>

                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                    <span>Price Behavior</span>
                    <span>Monitoring required</span>
                  </div>

                  <div className="relative min-h-[220px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.4)_0%,rgba(2,6,23,0.65)_100%)] p-6">
                    <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />
                    <div className="absolute inset-x-0 bottom-8 border-t border-dashed border-white/10" />

                    <div className="flex h-full items-center justify-center">
                      <div className="max-w-md text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-300 shadow-inner">
                          ✈
                        </div>
                        <p className="text-sm font-semibold text-white">
                          No chart data available yet
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          Once you add routes and monitoring begins, this area
                          will populate with real pricing behavior from your
                          tracked activity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.20)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Signal Feed
                  </p>

                  <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/20 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-300 shadow-inner">
                      ⌁
                    </div>

                    <h3 className="text-lg font-semibold text-white">
                      No signals available yet
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Pro signals are generated from real monitored route behavior.
                      Once your tracked routes begin collecting enough pricing data,
                      this feed will populate automatically.
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Enterprise Difference
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                    Need the full command layer?
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Enterprise goes beyond Pro with deeper forecasting,
                    enhanced summaries, broader behavioral history, and full
                    Intelligence Engine™ access.
                  </p>

                  <div className="mt-6 space-y-3">
                    <UpgradeRow label="Forecast modeling" value="Enterprise only" />
                    <UpgradeRow label="Enhanced route summaries" value="Enterprise only" />
                    <UpgradeRow label="Full Intelligence Engine™" value="Enterprise only" />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </section>
  )
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

function InfoCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </motion.div>
  )
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

function ProRouteStat({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtext}</p>
    </div>
  )
}

function UpgradeRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
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