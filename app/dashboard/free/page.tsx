"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/utils/auth-storage"

import RouteSearch from "@/components/dashboard/route-search"
import {
  type SavedFlightCardData,
} from "@/components/dashboard/saved-flight-card"
import FlightIntelligenceModal from "@/components/dashboard/flight-intelligence-modal"
import WelcomeModal from "@/components/dashboard/welcome-modal"
import FreeDashboardHero from "@/components/dashboard/free/free-dashboard-hero"
import FreeWatchlistSection from "@/components/dashboard/free/free-watchlist-section"
import FreeSavedFlightsSection from "@/components/dashboard/free/free-saved-flights-section"
import FreeQuickStats from "@/components/dashboard/free/free-quick-stats"
import FreeGlobalIntelligence from "@/components/dashboard/free/free-global-intelligence"
import FreePreviewUpgradeSection from "@/components/dashboard/free/free-preview-upgrade-section"
import FreeIntelligenceSnapshot from "@/components/dashboard/free/free-intelligence-snapshot"

import { toast } from "@/components/ui/Toasts/use-toast"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.6, ease: "easeOut" as const },
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

export default function FreeDashboardPage() {
  const router = useRouter()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const [loading, setLoading] = useState(true)
  const [watchlist, setWatchlist] = useState<WatchlistRoute[]>([])
  const [savedFlights, setSavedFlights] = useState<SavedFlightCardData[]>([])
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
        console.error("Failed to load free dashboard watchlist", error)

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

    const params = new URLSearchParams(window.location.search)
    const shouldShowWelcome = params.get("welcome") === "1"

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

  function handleRouteAdded(route: WatchlistRoute) {
    setWatchlist((prev) => {
      if (prev.length >= 3) {
        toast({
          title: "Free plan limit reached",
          description: "Free plans can monitor up to 3 routes.",
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
          description: "That route is already in your Free watchlist.",
        })
        return prev
      }

      toast({
        title: "Route added",
        description: "The route is now being monitored on your Free plan.",
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
        console.error("Failed to delete free watchlist route", data)

        toast({
          title: "Remove failed",
          description: "The route could not be removed from your watchlist.",
        })
        return
      }

      setWatchlist((prev) => prev.filter((item) => item.id !== routeId))

      toast({
        title: "Route removed",
        description: "The route was removed from your Free watchlist.",
      })
    } catch (error) {
      console.error("Free watchlist delete request failed", error)

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
          description: "That saved flight is already in your Free dashboard.",
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

  const remainingRoutes = Math.max(0, 3 - watchlist.length)

  function handleDismissWelcomeModal() {
    setShowWelcomeModal(false)
    router.replace("/dashboard/free")
  }

  return (
    <>
      <WelcomeModal
        open={showWelcomeModal}
        plan="free"
        onContinue={handleDismissWelcomeModal}
      />

      <section
        className={`min-h-screen bg-white transition duration-300 ${showWelcomeModal ? "pointer-events-none blur-md select-none" : ""
          }`}
      >
        <FreeDashboardHero showWelcomeModal={showWelcomeModal} />

        {/* Main Content */}
        <div className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-7xl">
            {/* Route Search */}
            <div className="mb-10">
              <RouteSearch onRouteAdded={handleRouteAdded} />
            </div>

            <FreeWatchlistSection
              loading={loading}
              watchlist={watchlist}
              remainingRoutes={remainingRoutes}
              fadeUp={fadeUp}
              onOpenFlightModal={handleOpenFlightModal}
              onRemoveRoute={(routeId) => {
                void handleRouteRemoved(routeId)
              }}
            />

            <FreeSavedFlightsSection
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

            <FreeQuickStats fadeUp={fadeUp} />

            <FreeGlobalIntelligence loading={loading} />

            <FreePreviewUpgradeSection fadeUp={fadeUp} />

            <FreeIntelligenceSnapshot fadeUp={fadeUp} />
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