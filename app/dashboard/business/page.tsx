"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/utils/auth-storage"
import { AirportOption, searchAirports } from "@/lib/airports/major-airports"
import { getAirlineDisplayName, normalizeAirlineCode } from "@/lib/airlines/airlines"

import DashboardFlightAttendant from "@/components/flight-attendant/DashboardFlightAttendant"
import RouteSearch from "@/components/dashboard/route-search"
import type { SavedFlightCardData } from "@/components/dashboard/saved-flight-card"
import FlightIntelligenceModal from "@/components/dashboard/flight-intelligence-modal"
import WelcomeModal from "@/components/dashboard/welcome-modal"
import AirportExplorerModal from "@/components/dashboard/airport-explorer/AirportExplorerModal"
import BusinessWatchlistIntelligenceLab from "@/components/dashboard/lab/business-watchlist-intelligence-lab"
import BusinessSavedRoutesLab from "@/components/dashboard/lab/business-saved-routes-lab"
import BusinessPortfolioIntelligenceLab from "@/components/dashboard/lab/business-portfolio-intelligence-lab"
import BusinessIntelligenceWrappedLab from "@/components/dashboard/lab/business-intelligence-wrapped-lab"

import { toast } from "@/components/ui/Toasts/use-toast"

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
    airlineName?: string | null
    airlineLogoSymbolUrl?: string | null
    airlineLogoLockupUrl?: string | null
    flightNumber?: string | null
    price?: number | null
    currency?: string | null
    capturedAt?: string | null
    bookingSignal?: string | null
    volatilityIndex?: string | null
    stopCount?: number | null
    itineraryKey?: string | null
    itinerarySegments?:
    | {
      origin?: string | null
      destination?: string | null
      marketingCarrier?: string | null
      operatingCarrier?: string | null
      marketingFlightNumber?: string | null
      operatingFlightNumber?: string | null
      departureTime?: string | null
      arrivalTime?: string | null
    }[]
    | null
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
  const [availableWrappedYears, setAvailableWrappedYears] = useState<number[]>([
    2026,
  ])
  const [globeAirportNodes, setGlobeAirportNodes] = useState<GlobeAirportNode[]>(
    []
  )
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
  const [airportSearch, setAirportSearch] = useState("")
  const [selectedAirport, setSelectedAirport] = useState<AirportOption | null>(null)
  const [airportSearchOpen, setAirportSearchOpen] = useState(false)
  const [isAirportExplorerOpen, setIsAirportExplorerOpen] = useState(false)
  const [airportExplorerTarget, setAirportExplorerTarget] =
    useState<AirportOption | null>(null)

  const airportSearchRef = useRef<HTMLDivElement | null>(null)

  const airportSearchResults =
    airportSearch.trim().length >= 2
      ? searchAirports(airportSearch).slice(0, 8)
      : []

  useEffect(() => {
    const originalBackground = document.body.style.background
    const originalBackgroundColor = document.body.style.backgroundColor

    document.body.style.background = "rgb(255 255 255)"
    document.body.style.backgroundColor = "rgb(255 255 255)"

    return () => {
      document.body.style.background = originalBackground
      document.body.style.backgroundColor = originalBackgroundColor
    }
  }, [])

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/watchlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

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
    function handleLucyWatchlistUpdated() {
      setWatchlistFetchKey((prev) => prev + 1)

      const retryTimers = [1500, 4000, 7000].map((delay) =>
        window.setTimeout(() => {
          setWatchlistFetchKey((prev) => prev + 1)
        }, delay)
      )

      return retryTimers
    }

    let activeRetryTimers: number[] = []

    function handleWatchlistUpdatedEvent() {
      activeRetryTimers.forEach((timer) => window.clearTimeout(timer))
      activeRetryTimers = handleLucyWatchlistUpdated()
    }

    window.addEventListener(
      "skysirv:watchlist-updated",
      handleWatchlistUpdatedEvent
    )

    return () => {
      activeRetryTimers.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener(
        "skysirv:watchlist-updated",
        handleWatchlistUpdatedEvent
      )
    }
  }, [])

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/saved-flights`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

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

    function handleSavedFlightsUpdated() {
      void loadSavedFlights()
    }

    window.addEventListener(
      "skysirv:saved-flights-updated",
      handleSavedFlightsUpdated
    )

    loadSavedFlights()

    return () => {
      cancelled = true
      window.removeEventListener(
        "skysirv:saved-flights-updated",
        handleSavedFlightsUpdated
      )
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
          return years.includes(currentSelectedYear)
            ? currentSelectedYear
            : years[0]
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
        setGlobeAirportNodes([])
        setGlobeRouteArcs([])
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
          setGlobeAirportNodes([])
          setGlobeRouteArcs([])
          return
        }

        const payload = data.wrapped.wrapped_payload_json ?? {}
        const bestRoute = payload.bestRoute ?? {}
        const airportNodes = Array.isArray(data.airportNodes)
          ? data.airportNodes
          : []
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

        setGlobeAirportNodes(airportNodes)
        setGlobeRouteArcs(routeArcs)
      } catch (err) {
        console.error("Wrapped load failed", err)

        if (!cancelled) {
          setWrappedData(defaultWrappedData)
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!airportSearchRef.current) return

      if (!airportSearchRef.current.contains(event.target as Node)) {
        setAirportSearchOpen(false)

        if (!selectedAirport) {
          setAirportSearch("")
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
          : route.latest_price != null &&
            Number.isFinite(Number(route.latest_price))
            ? Number(route.latest_price)
            : null,
      currency: flight?.currency ?? "USD",
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/saved-flights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

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
        description:
          "The matching monitored route could not be found for this saved flight.",
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
        description: `${flight.origin ?? "—"} → ${flight.destination ?? "—"
          } was added to trip history.`,
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
        description: `${flight.origin ?? "—"} → ${flight.destination ?? "—"
          } was removed.`,
      })
    } catch (error) {
      console.error("Failed to delete saved flight", error)

      toast({
        title: "Delete failed",
        description: "Something went wrong while deleting the saved flight.",
      })
    }
  }

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
        className={`min-h-screen bg-white text-slate-950 transition duration-300 ${showWelcomeModal ? "pointer-events-none select-none blur-md" : ""
          }`}
      >
        <div className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-7xl">
            <section className="pb-14">
              <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                <div>
                  <p className="mb-4 inline-flex rounded-full border border-blue-700 bg-blue-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white">
                    Business Plan Dashboard
                  </p>

                  <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-800 sm:text-6xl">
                    Your full flight intelligence dashboard
                  </h1>

                  <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
                    Unlimited access across your Skysirv Network — flights, hotels,
                    car rentals, cruises, monitored routes, saved trips, airport intelligence,
                    travel history, Lucy context, and deeper signals built for high-volume
                    travelers and business users.
                  </p>
                </div>

                <DashboardFlightAttendant
                  tier="business"
                  placement="inline"
                  defaultOpen
                  dashboardRoutes={watchlist.map((route) => ({
                    id: route.id,
                    origin: route.origin || "",
                    destination: route.destination || "",
                    departureDate: route.departure_date || null,
                    routeLabel:
                      route.origin && route.destination
                        ? `${route.origin} → ${route.destination}`
                        : route.route || undefined,
                    latestPrice: route.latest_price ?? null,
                    averagePrice: route.avg_price ?? null,
                    bookingSignal: route.booking_signal ?? null,
                    recommendedFlights: Array.isArray(route.recommended_flights)
                      ? route.recommended_flights.map((flight) => {
                        const airlineCode = normalizeAirlineCode(flight.airline)

                        return {
                          airline: airlineCode,
                          airlineName: flight.airlineName ?? getAirlineDisplayName(airlineCode),
                          airlineLogoSymbolUrl: flight.airlineLogoSymbolUrl ?? null,
                          airlineLogoLockupUrl: flight.airlineLogoLockupUrl ?? null,
                          flightNumber: flight.flightNumber ?? null,
                          price: flight.price ?? null,
                          currency: flight.currency ?? null,
                          stopCount: flight.stopCount ?? null,
                        }
                      })
                      : [],
                  }))}
                />
              </div>
            </section>

            <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                    Airport Explorer
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">
                    Explore terminals, gates, lounges, and airport services
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                    Search supported airports and open an indoor terminal map with 3D view,
                    satellite mode, gate search, and airport location intelligence.
                  </p>
                </div>

                <div
                  ref={airportSearchRef}
                  className="relative w-full lg:max-w-md"
                >
                  <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1 shadow-inner">
                    <input
                      value={airportSearch}
                      onChange={(event) => {
                        const value = event.target.value
                        setAirportSearch(value)
                        setSelectedAirport(null)
                        setAirportSearchOpen(value.trim().length >= 2)
                      }}
                      onFocus={() => {
                        if (airportSearch.trim().length >= 2) {
                          setAirportSearchOpen(true)
                        }
                      }}
                      placeholder="Search airport, e.g. JFK or Miami"
                      className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const airportToExplore = selectedAirport

                        if (!airportToExplore) {
                          toast({
                            title: "Search an airport first",
                            description: "Choose an airport from the dropdown before exploring.",
                          })
                          return
                        }

                        setAirportExplorerTarget(airportToExplore)
                        setIsAirportExplorerOpen(true)
                        setAirportSearch("")
                        setSelectedAirport(null)
                        setAirportSearchOpen(false)
                      }}
                      className="shrink-0 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      Explore
                    </button>
                  </div>

                  {airportSearchOpen && (
                    <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                      {airportSearchResults.length === 0 ? (
                        <div className="px-3 py-3 text-sm text-slate-500">
                          No matching airports found.
                        </div>
                      ) : (
                        airportSearchResults.map((airport) => (
                          <button
                            key={airport.code}
                            type="button"
                            onClick={() => {
                              setSelectedAirport(airport)
                              setAirportSearch(`${airport.city} (${airport.code})`)
                              setAirportSearchOpen(false)
                            }}
                            className="flex w-full items-start justify-between rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
                          >
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {airport.city} ({airport.code})
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                {airport.name} · {airport.country}
                              </div>
                            </div>

                            <div className="ml-4 shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                              {airport.region ?? "Airport"}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <RouteSearch theme="light" onRouteAdded={handleRouteAdded} />
            </div>

            <BusinessWatchlistIntelligenceLab
              loading={loading}
              watchlist={watchlist}
              onOpenFlightModal={handleOpenFlightModal}
              onRemoveRoute={(routeId) => {
                void handleRouteRemoved(routeId)
              }}
            />

            <BusinessSavedRoutesLab
              savedFlights={savedFlights}
              onOpenSavedFlightIntelligence={handleOpenSavedFlightIntelligence}
              onMarkSavedFlightCompleted={(flight) => {
                void handleMarkSavedFlightCompleted(flight)
              }}
              onDeleteSavedFlight={(flight) => {
                void handleDeleteSavedFlight(flight)
              }}
            />

            <BusinessPortfolioIntelligenceLab
              watchlist={watchlist}
              savedFlights={savedFlights}
              onOpenFlightModal={handleOpenFlightModal}
              onOpenSavedFlightIntelligence={handleOpenSavedFlightIntelligence}
            />

            <BusinessIntelligenceWrappedLab
              wrappedLoading={wrappedLoading}
              wrappedData={wrappedData}
              selectedYear={selectedYear}
              availableWrappedYears={availableWrappedYears}
              setSelectedYear={setSelectedYear}
              globeAirportNodes={globeAirportNodes}
              globeRouteArcs={globeRouteArcs}
            />
          </div>
        </div>

        <AirportExplorerModal
          open={isAirportExplorerOpen}
          airport={airportExplorerTarget}
          onClose={() => {
            setIsAirportExplorerOpen(false)
            setAirportExplorerTarget(null)
          }}
        />

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