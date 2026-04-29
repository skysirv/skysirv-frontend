"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/utils/auth-storage"

import RouteSearch from "@/components/dashboard/route-search"
import type { SavedFlightCardData } from "@/components/dashboard/saved-flight-card"
import FlightIntelligenceModal from "@/components/dashboard/flight-intelligence-modal"
import WelcomeModal from "@/components/dashboard/welcome-modal"
import BusinessDashboardHero from "@/components/dashboard/business/business-dashboard-hero"
import BusinessWatchlistSection from "@/components/dashboard/business/business-watchlist-section"
import BusinessSavedFlightsSection from "@/components/dashboard/business/business-saved-flights-section"
import BusinessGlobalIntelligence from "@/components/dashboard/business/business-global-intelligence"
import BusinessIntelligenceWrappedSection from "@/components/dashboard/business/business-intelligence-wrapped-section"
import BusinessMarketView from "@/components/dashboard/business/business-market-view"

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

type LucyDashboardSummary = {
  headline: string
  summary: string
  signalFeed: string[]
  systemReadout: string
  recommendedAction: "watch" | "wait" | "book" | "insufficient_data"
  confidence: "low" | "medium" | "high"
  dataStatus: "pending" | "building" | "ready"
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
  const [lucyDashboardSummary, setLucyDashboardSummary] =
    useState<LucyDashboardSummary | null>(null)
  const [lucyDashboardSummaryLoading, setLucyDashboardSummaryLoading] =
    useState(false)
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
    let cancelled = false

    async function loadLucyDashboardSummary() {
      const token = getAuthToken()

      if (!token) {
        if (!cancelled) {
          setLucyDashboardSummary(null)
          setLucyDashboardSummaryLoading(false)
        }
        return
      }

      if (!cancelled) {
        setLucyDashboardSummaryLoading(true)
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight-attendant/dashboard-summary`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json().catch(() => null)

        if (cancelled) return

        if (!res.ok || !data?.success || !data?.summary) {
          setLucyDashboardSummary(null)
          return
        }

        setLucyDashboardSummary(data.summary)
      } catch (error) {
        console.error("Failed to load Lucy dashboard summary", error)

        if (!cancelled) {
          setLucyDashboardSummary(null)
        }
      } finally {
        if (!cancelled) {
          setLucyDashboardSummaryLoading(false)
        }
      }
    }

    loadLucyDashboardSummary()

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
        <BusinessDashboardHero showWelcomeModal={showWelcomeModal} />

        {/* Main Dashboard Content */}
        <div className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-7xl">
            {/* Route Search */}
            <div className="mb-10">
              <RouteSearch onRouteAdded={handleRouteAdded} />
            </div>

            <BusinessWatchlistSection
              loading={loading}
              watchlist={watchlist}
              onOpenFlightModal={handleOpenFlightModal}
              onRemoveRoute={(routeId) => {
                void handleRouteRemoved(routeId)
              }}
            />

            <BusinessSavedFlightsSection
              savedFlights={savedFlights}
              fadeUp={fadeUp}
              onOpenSavedFlightIntelligence={handleOpenSavedFlightIntelligence}
              onMarkSavedFlightCompleted={(flight) => {
                void handleMarkSavedFlightCompleted(flight)
              }}
              onDeleteSavedFlight={(flight) => {
                void handleDeleteSavedFlight(flight)
              }}
            />

            <BusinessGlobalIntelligence loading={loading} />

            <BusinessIntelligenceWrappedSection
              wrappedLoading={wrappedLoading}
              wrappedData={wrappedData}
              selectedYear={selectedYear}
              availableWrappedYears={availableWrappedYears}
              setSelectedYear={setSelectedYear}
              sortedSegments={sortedSegments}
              globeAirportNodes={globeAirportNodes}
              globeRouteArcs={globeRouteArcs}
              intelligenceItems={intelligenceItems}
              winRate={winRate}
              fadeUp={fadeUp}
              staggerContainer={staggerContainer}
              staggerItem={staggerItem}
            />

            <BusinessMarketView
              watchlistCount={watchlist.length}
              lucySummary={lucyDashboardSummary}
              lucySummaryLoading={lucyDashboardSummaryLoading}
            />
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