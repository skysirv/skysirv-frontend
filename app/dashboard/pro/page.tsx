"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/utils/auth-storage"

import RouteSearch from "@/components/dashboard/route-search"
import type { SavedFlightCardData } from "@/components/dashboard/saved-flight-card"
import FlightIntelligenceModal from "@/components/dashboard/flight-intelligence-modal"
import WelcomeModal from "@/components/dashboard/welcome-modal"
import ProDashboardHero from "@/components/dashboard/pro/pro-dashboard-hero"
import ProWatchlistSection from "@/components/dashboard/pro/pro-watchlist-section"
import ProSavedFlightsSection from "@/components/dashboard/pro/pro-saved-flights-section"
import ProCapabilityStats from "@/components/dashboard/pro/pro-capability-stats"
import ProGlobalIntelligence from "@/components/dashboard/pro/pro-global-intelligence"
import ProIntelligenceWrappedSection from "@/components/dashboard/pro/pro-intelligence-wrapped-section"
import ProStackSection from "@/components/dashboard/pro/pro-stack-section"
import ProMarketView from "@/components/dashboard/pro/pro-market-view"

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
  travelerIdentity: string
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
  travelerIdentity: "Smart Traveler",
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
  const router = useRouter()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showLifetimeSetupModal, setShowLifetimeSetupModal] = useState(false)
  const [lifetimeSetupComplete, setLifetimeSetupComplete] = useState(false)
  const [lifetimePassword, setLifetimePassword] = useState("")
  const [showLifetimePassword, setShowLifetimePassword] = useState(false)
  const [lifetimeSetupLoading, setLifetimeSetupLoading] = useState(false)
  const [lifetimeSetupError, setLifetimeSetupError] = useState("")

  useEffect(() => {
    if (!lifetimeSetupComplete) return

    const timer = window.setTimeout(() => {
      setShowLifetimeSetupModal(false)
      setShowWelcomeModal(true)
      setLifetimePassword("")
      setShowLifetimePassword(false)
      setLifetimeSetupError("")
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [lifetimeSetupComplete])

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
  const [subscription, setSubscription] = useState<SessionSubscription | null>(null)
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

  const isLifetimePro = subscription?.plan_id === "pro_lifetime"

  async function handleLifetimeSetupSubmit(e: React.FormEvent) {
    e.preventDefault()

    const inviteToken = sessionStorage.getItem("skysirv_lifetime_invite_token")

    if (!inviteToken) {
      setLifetimeSetupError("Invite token missing. Please reopen your gifted access link.")
      return
    }

    if (!lifetimePassword.trim()) {
      setLifetimeSetupError("Please create a password.")
      return
    }

    try {
      setLifetimeSetupLoading(true)
      setLifetimeSetupError("")

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invite/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: inviteToken,
          password: lifetimePassword,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Unable to finish setup.")
      }

      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: lifetimePassword,
        }),
      })

      const loginData = await loginRes.json().catch(() => null)

      if (!loginRes.ok || !loginData?.token) {
        throw new Error("Login failed after setup.")
      }

      localStorage.setItem("skysirv_token", loginData.token)
      localStorage.setItem("skysirv_admin", loginData.user?.is_admin ? "true" : "false")

      await refreshSession()

      sessionStorage.removeItem("skysirv_lifetime_invite_token")
      setLifetimeSetupComplete(true)
    } catch (err: any) {
      setLifetimeSetupError(err?.message || "Unable to finish setup.")
    } finally {
      setLifetimeSetupLoading(false)
    }
  }

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
    const params = new URLSearchParams(window.location.search)
    const shouldShowWelcome = params.get("welcome") === "1"
    const gifted = params.get("gifted") === "true"
    const setupLifetimePro = params.get("setupLifetimePro") === "1"
    const inviteToken = params.get("inviteToken")

    if (inviteToken) {
      sessionStorage.setItem("skysirv_lifetime_invite_token", inviteToken)
    }

    if (setupLifetimePro && gifted) {
      setShowLifetimeSetupModal(true)
      return
    }

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

  async function refreshSession() {
    const token = getAuthToken()

    if (!token) return null

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data: SessionResponse = await res.json().catch(() => ({}))

      if (res.ok) {
        setSubscription(data.subscription ?? null)
        return data.subscription ?? null
      }
    } catch (error) {
      console.error("Failed to load pro dashboard session", error)
    }

    return null
  }

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      if (cancelled) return
      await refreshSession()
    }

    loadSession()

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
          travelerIdentity: data.wrapped.traveler_identity ?? "Smart Traveler",
        })

        setWrappedSegments(segments)
        setGlobeAirportNodes(airportNodes)
        setGlobeRouteArcs(routeArcs)
      } catch (err) {
        console.error("Pro wrapped load failed", err)

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
          description: "That saved flight is already in your Pro dashboard.",
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

  const remainingRoutes = Math.max(0, 25 - watchlist.length)

  const sortedSegments = useMemo(() => {
    return [...wrappedSegments].sort((a, b) => {
      return Number(a.segment_order ?? 0) - Number(b.segment_order ?? 0)
    })
  }, [wrappedSegments])

  return (
    <>
      {showLifetimeSetupModal && (
        <div className="fixed inset-0 z-[90] bg-slate-950/35 backdrop-blur-sm" />
      )}

      {showLifetimeSetupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-10">
            {lifetimeSetupComplete ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <img
                  src="/branding/icon/skysirv-icon-512.png"
                  alt="Skysirv"
                  className="mb-5 h-14 w-14 rounded-2xl"
                />

                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Welcome to your Free Lifetime Pro Dashboard
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
                  Your gifted Lifetime Pro access is now active and your dashboard is ready.
                </p>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Gifted Lifetime Pro Access
                </div>

                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Create your password to enter your dashboard
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  You’ve been granted complimentary Lifetime Pro access. Create your password below to finish setup and unlock your dashboard.
                </p>

                <form onSubmit={handleLifetimeSetupSubmit} className="mt-8 space-y-4">
                  <div className="relative">
                    <input
                      type={showLifetimePassword ? "text" : "password"}
                      placeholder="Create password"
                      required
                      value={lifetimePassword}
                      onChange={(e) => setLifetimePassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowLifetimePassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                    >
                      {showLifetimePassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {lifetimeSetupError && (
                    <p className="text-sm text-red-500">{lifetimeSetupError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={lifetimeSetupLoading}
                    className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {lifetimeSetupLoading ? "Setting up..." : "Create Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <WelcomeModal
        open={showWelcomeModal}
        plan="pro"
        onContinue={() => {
          setShowWelcomeModal(false)
          setLifetimeSetupComplete(false)
          router.replace("/dashboard/pro")
        }}
      />

      <section
        className={`min-h-screen bg-white transition duration-300 ${showWelcomeModal || showLifetimeSetupModal ? "pointer-events-none blur-md select-none" : ""
          }`}
      >
        <ProDashboardHero
          loading={loading}
          watchlistCount={watchlist.length}
          remainingRoutes={remainingRoutes}
          isLifetimePro={isLifetimePro}
          showWelcomeModal={showWelcomeModal}
          showLifetimeSetupModal={showLifetimeSetupModal}
          fadeUp={fadeUp}
        />

        {/* Main Content */}
        <div className="relative z-10 px-6 py-6 md:py-8">
          <div className="mx-auto max-w-7xl">
            {/* Route Search */}
            <div className="mb-10">
              <RouteSearch onRouteAdded={handleRouteAdded} />
            </div>

            <ProWatchlistSection
              loading={loading}
              watchlist={watchlist}
              remainingRoutes={remainingRoutes}
              isLifetimePro={isLifetimePro}
              fadeUp={fadeUp}
              onOpenFlightModal={handleOpenFlightModal}
              onRemoveRoute={(routeId) => {
                void handleRouteRemoved(routeId)
              }}
            />

            <ProSavedFlightsSection
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

            <ProCapabilityStats fadeUp={fadeUp} />

            <ProGlobalIntelligence loading={loading} />

            <ProIntelligenceWrappedSection
              wrappedLoading={wrappedLoading}
              wrappedData={wrappedData}
              selectedYear={selectedYear}
              availableWrappedYears={availableWrappedYears}
              setSelectedYear={setSelectedYear}
              sortedSegments={sortedSegments}
              globeAirportNodes={globeAirportNodes}
              globeRouteArcs={globeRouteArcs}
              fadeUp={fadeUp}
              staggerContainer={staggerContainer}
              staggerItem={staggerItem}
            />

            <ProStackSection
              fadeUp={fadeUp}
              staggerContainer={staggerContainer}
              staggerItem={staggerItem}
            />

            <ProMarketView fadeUp={fadeUp} />
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