"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useInView } from "framer-motion"
import { getAuthToken } from "@/utils/auth-storage"

import RouteSearch from "@/components/dashboard/route-search"
import OpportunityBanner from "@/components/dashboard/opportunity-banner"
import MarketSignals from "@/components/dashboard/market-signals"
import WatchlistCard from "@/components/dashboard/watchlist-card"
import SavedFlightCard, {
  type SavedFlightCardData,
} from "@/components/dashboard/saved-flight-card"
import FlightIntelligenceModal from "@/components/dashboard/flight-intelligence-modal"
import WelcomeModal from "@/components/dashboard/welcome-modal"

import WatchlistSkeleton from "@/components/dashboard/watchlist-skeleton"
import OpportunitySkeleton from "@/components/dashboard/opportunity-skeleton"
import MarketSignalsSkeleton from "@/components/dashboard/market-signals-skeleton"

import TravelGlobe from "@/components/intelligence-wrapped/travel-globe"
import SegmentIntelligencePanel from "@/components/intelligence-wrapped/segment-intelligence-panel"
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
  travelerIdentity: "Precision Booker",
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

export default function BusinessDashboardPage() {
  const router = useRouter()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const [loading, setLoading] = useState(true)
  const [wrappedLoading, setWrappedLoading] = useState(true)
  const [watchlist, setWatchlist] = useState<WatchlistRoute[]>([])
  const [savedFlights, setSavedFlights] = useState<SavedFlightCardData[]>([])
  const [wrappedData, setWrappedData] = useState<WrappedData>(defaultWrappedData)
  const [wrappedRefreshKey, setWrappedRefreshKey] = useState(0)
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [availableWrappedYears, setAvailableWrappedYears] = useState<number[]>([2026])
  const [wrappedSegments, setWrappedSegments] = useState<WrappedSegment[]>([])
  const [globeAirportNodes, setGlobeAirportNodes] = useState<GlobeAirportNode[]>([])
  const [globeRouteArcs, setGlobeRouteArcs] = useState<GlobeRouteArc[]>([])
  const [watchlistFetchKey, setWatchlistFetchKey] = useState(0)
  const [selectedFlightForModal, setSelectedFlightForModal] = useState<{
    route: WatchlistRoute
    flight: {
      airline?: string | null
      flightNumber?: string | null
      price?: number | null
      currency?: string | null
      capturedAt?: string | null
    } | null
  } | null>(null)
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false)

  const intelligenceItems = [
    {
      title: "Skysirv Monitor™",
      stat: "Business Access",
      description:
        "Expanded route monitoring designed to support broader tracking coverage as real data begins to build.",
    },
    {
      title: "Skysirv Signals™",
      stat: "Included",
      description:
        "Signal visibility becomes available as monitored routes accumulate enough real pricing history.",
    },
    {
      title: "Skysirv Price Behavior™",
      stat: "Included",
      description:
        "Behavior modeling appears as tracked routes develop meaningful pricing history over time.",
    },
    {
      title: "Skysirv Predict™",
      stat: "Available",
      description:
        "Forward-looking guidance activates when monitored routes have enough live data to support it.",
    },
    {
      title: "Skyscore™",
      stat: "Full Access",
      description:
        "Business includes the full scoring layer once real route monitoring data supports score generation.",
    },
    {
      title: "Skysirv Insights™",
      stat: "Included",
      description:
        "Route insights populate automatically as monitored activity produces enough data to summarize.",
    },
    {
      title: "Skysirv Route Digest™",
      stat: "Included",
      description:
        "Digest-style route summaries appear as your monitoring history becomes rich enough to support them.",
    },
    {
      title: "Skysirv Intelligence Engine™",
      stat: "Active Framework",
      description:
        "The system layer is in place and begins surfacing intelligence as monitored pricing data accumulates.",
    },
  ]

  const winRate =
    wrappedData.alertsTriggered > 0
      ? Math.round((wrappedData.alertsWon / wrappedData.alertsTriggered) * 100)
      : 0

  useEffect(() => {
    let cancelled = false

    async function loadWatchlist() {
      const token = getAuthToken()

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
        console.error("Failed to load business dashboard watchlist", error)

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
    if (typeof window === "undefined") return

    const shouldShowWelcome =
      new URLSearchParams(window.location.search).get("welcome") === "1"

    if (shouldShowWelcome) {
      setShowWelcomeModal(true)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadSavedFlights() {
      const token = getAuthToken()

      if (!token) {
        if (!cancelled) {
          setSavedFlights([])
        }
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/saved-flights`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json().catch(() => [])

        if (cancelled) return

        const savedFlightsData = Array.isArray(data) ? data : []

        setSavedFlights(
          savedFlightsData.map((flight) => ({
            ...flight,
            price:
              flight.price != null && Number.isFinite(Number(flight.price))
                ? Number(flight.price) / 100
                : null,
            latest_price:
              flight.price != null && Number.isFinite(Number(flight.price))
                ? Number(flight.price) / 100
                : null,
          }))
        )
      } catch (error) {
        console.error("Failed to load saved flights", error)

        if (!cancelled) {
          setSavedFlights([])
        }
      }
    }

    loadSavedFlights()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadAvailableYears() {
      const token = getAuthToken()

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
      const token = getAuthToken()

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
          setGlobeAirportNodes([])
          setGlobeRouteArcs([])
          return
        }

        const payload = data.wrapped.wrapped_payload_json ?? {}
        const bestRoute = payload.bestRoute ?? {}
        const segments = Array.isArray(data.segments) ? data.segments : []
        const airportNodes = Array.isArray(data.airportNodes) ? data.airportNodes : []
        const routeArcs = Array.isArray(data.routeArcs) ? data.routeArcs : []

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
            route: bestRoute.route ?? "—",
            saved: Number(bestRoute.saved ?? 0),
            beforeSpike: bestRoute.beforeSpike ?? "—",
            timingGrade: bestRoute.timingGrade ?? "—",
          },
        })

        setWrappedSegments(segments)
        setGlobeAirportNodes(airportNodes)
        setGlobeRouteArcs(routeArcs)
      } catch (err) {
        console.error("Wrapped load failed", err)

        if (!cancelled) {
          setWrappedData(defaultWrappedData)
          setWrappedSegments([])
          setGlobeAirportNodes([])
          setGlobeRouteArcs([])
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
  }, [selectedYear, wrappedRefreshKey])

  function handleRouteAdded(route: WatchlistRoute) {
    setWatchlist((prev) => [route, ...prev])

    toast({
      title: "Route added",
      description: "The route is now being monitored.",
    })

    refreshWatchlistWithRetries()
  }

  async function handleRouteRemoved(routeId: string) {
    const token = getAuthToken()

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
        console.error("Failed to delete business watchlist route", data)

        toast({
          title: "Remove failed",
          description: "The route could not be removed from your watchlist.",
        })
        return
      }

      setWatchlist((prev) => prev.filter((item) => item.id !== routeId))

      toast({
        title: "Route removed",
        description: "The route was removed from your watchlist.",
      })
    } catch (error) {
      console.error("Business watchlist delete request failed", error)

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

  function handleOpenFlightModal(
    route: WatchlistRoute,
    flight?: {
      airline?: string | null
      flightNumber?: string | null
      price?: number | null
      currency?: string | null
      capturedAt?: string | null
    } | null
  ) {
    setSelectedFlightForModal({
      route,
      flight: flight ?? null,
    })
    setIsFlightModalOpen(true)
  }

  async function handleSaveFlight() {
    if (!selectedFlightForModal?.route) {
      toast({
        title: "No flight selected",
        description: "Select a flight before saving it.",
      })
      return
    }

    const token = getAuthToken()

    if (!token) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to save flights.",
      })
      return
    }

    const { route, flight } = selectedFlightForModal

    const payload = {
      origin: route.origin ?? "",
      destination: route.destination ?? "",
      departureDate: route.departure_date ?? null,
      airline: flight?.airline ?? route.latest_airline ?? null,
      flightNumber: flight?.flightNumber ?? route.latest_flight_number ?? null,
      price:
        typeof flight?.price === "number" && Number.isFinite(flight.price)
          ? flight.price
          : route.latest_price != null && Number.isFinite(Number(route.latest_price))
            ? Number(route.latest_price)
            : null,
      currency: flight?.currency ?? "USD",
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/saved-flights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)

      if (res.status === 409) {
        toast({
          title: "Flight already saved",
          description: "That saved flight is already in your Business dashboard.",
        })
        return
      }

      if (!res.ok || !data) {
        toast({
          title: "Save failed",
          description: "The flight could not be saved.",
        })
        return
      }

      const savedFlight: SavedFlightCardData = {
        ...data,
        price:
          data.price != null && Number.isFinite(Number(data.price))
            ? Number(data.price) / 100
            : null,
        latest_price:
          data.price != null && Number.isFinite(Number(data.price))
            ? Number(data.price) / 100
            : null,
      }

      setSavedFlights((prev) => [savedFlight, ...prev])

      toast({
        title: "Flight saved",
        description: "The flight was added to your saved flights section.",
      })

      setIsFlightModalOpen(false)
    } catch (error) {
      console.error("Failed to save flight", error)

      toast({
        title: "Save failed",
        description: "Something went wrong while saving the flight.",
      })
    }
  }

  function handleOpenSavedFlightIntelligence(flight: SavedFlightCardData) {
    const matchingRoute =
      watchlist.find(
        (route) =>
          route.origin === flight.origin &&
          route.destination === flight.destination &&
          route.departure_date === flight.departure_date
      ) ?? null

    if (!matchingRoute) {
      toast({
        title: "Route not found",
        description: "The matching monitored route could not be found for this saved flight.",
      })
      return
    }

    setSelectedFlightForModal({
      route: matchingRoute,
      flight: {
        airline: flight.airline ?? null,
        flightNumber: flight.flight_number ?? null,
        price: flight.latest_price ?? flight.price ?? null,
        currency: flight.currency ?? "USD",
        capturedAt: flight.saved_at ?? null,
      },
    })

    setIsFlightModalOpen(true)
  }

  async function handleMarkSavedFlightCompleted(flight: SavedFlightCardData) {
    const token = getAuthToken()

    if (!token) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to complete saved flights.",
      })
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/saved-flights/${flight.id}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json().catch(() => null)

      if (res.status === 409) {
        toast({
          title: "Already completed",
          description: "That saved flight has already been marked completed.",
        })
        return
      }

      if (!res.ok || !data) {
        toast({
          title: "Completion failed",
          description: "The saved flight could not be marked completed.",
        })
        return
      }

      const updatedFlight: SavedFlightCardData = {
        ...data,
        price:
          data.price != null && Number.isFinite(Number(data.price))
            ? Number(data.price) / 100
            : null,
        latest_price:
          data.price != null && Number.isFinite(Number(data.price))
            ? Number(data.price) / 100
            : null,
      }

      setSavedFlights((prev) =>
        prev.map((item) => (item.id === updatedFlight.id ? updatedFlight : item))
      )

      setWrappedRefreshKey((prev) => prev + 1)

      toast({
        title: "Route completed",
        description: `${flight.origin ?? "—"} → ${flight.destination ?? "—"} was added to trip history.`,
      })
    } catch (error) {
      console.error("Failed to complete saved flight", error)

      toast({
        title: "Completion failed",
        description: "Something went wrong while completing the saved flight.",
      })
    }
  }

  async function handleDeleteSavedFlight(flight: SavedFlightCardData) {
    const token = getAuthToken()

    if (!token) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to delete saved flights.",
      })
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/saved-flights/${flight.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        toast({
          title: "Delete failed",
          description: "The saved flight could not be removed.",
        })
        return
      }

      setSavedFlights((prev) => prev.filter((item) => item.id !== flight.id))

      toast({
        title: "Saved flight deleted",
        description: `${flight.origin ?? "—"} → ${flight.destination ?? "—"} was removed.`,
      })
    } catch (error) {
      console.error("Failed to delete saved flight", error)

      toast({
        title: "Delete failed",
        description: "Something went wrong while deleting the saved flight.",
      })
    }
  }

  const sortedSegments = useMemo(() => {
    return [...wrappedSegments].sort((a, b) => {
      return Number(a.segment_order ?? 0) - Number(b.segment_order ?? 0)
    })
  }, [wrappedSegments])

  return (
    <>
      <WelcomeModal
        open={showWelcomeModal}
        plan="business"
        onContinue={() => {
          setShowWelcomeModal(false)
          router.replace("/dashboard/business")
        }}
      />

      <section
        className={`min-h-screen bg-white transition duration-300 ${showWelcomeModal ? "pointer-events-none blur-md select-none" : ""
          }`}
      >
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
                  Business Plan Dashboard
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
                      history builds, Business intelligence surfaces will begin
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
                        history. Business intelligence layers will populate
                        automatically as real monitored data accumulates.
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
                            onOpenFlightModal={(flight) => handleOpenFlightModal(route, flight)}
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
            </motion.div>

            {/* Saved Flights Section */}
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
                        onOpenIntelligence={() => handleOpenSavedFlightIntelligence(flight)}
                        onMarkRouteCompleted={() => handleMarkSavedFlightCompleted(flight)}
                        onDelete={() => handleDeleteSavedFlight(flight)}
                      />
                    ))
                  )}
                </div>
              </div>
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
                          {availableWrappedYears.map((year) => (
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

                    <TravelGlobe
                      airportNodes={globeAirportNodes}
                      routeArcs={globeRouteArcs}
                    />
                  </motion.div>

                  {/* Segment Intelligence */}
                  <SegmentIntelligencePanel
                    wrappedLoading={wrappedLoading}
                    selectedYear={selectedYear}
                    sortedSegments={sortedSegments}
                    fadeUp={fadeUp}
                  />
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
                          {wrappedLoading || wrappedData.skyscore === 0 ? "Awaiting score data" : "Elite Traveler"}
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
                      Once real monitoring and booking activity exist, this section
                      will highlight your strongest route decision with timing and
                      market context.
                    </p>
                  </div>

                  {wrappedLoading || wrappedData.routesMonitored === 0 ? (
                    <div className="overflow-hidden rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-inner">
                        ✈
                      </div>

                      <h4 className="text-lg font-semibold text-slate-900">
                        No route insights yet
                      </h4>

                      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                        Once you begin tracking routes and capturing booking activity,
                        your strongest decision story will appear here with timing
                        insights, savings impact, and market behavior context.
                      </p>
                    </div>
                  ) : (
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
                  )}
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

                {/* Share Card */}
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

                    <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
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

        <FlightIntelligenceModal
          isOpen={isFlightModalOpen}
          onClose={() => setIsFlightModalOpen(false)}
          onSaveFlight={handleSaveFlight}
          route={selectedFlightForModal?.route ?? null}
          flight={selectedFlightForModal?.flight ?? null}
        />
      </section>
    </>
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