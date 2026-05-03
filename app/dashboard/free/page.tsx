"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/utils/auth-storage"

import RouteSearch from "@/components/dashboard/route-search"
import WelcomeModal from "@/components/dashboard/welcome-modal"
import FreeLucyPreviewLab from "@/components/dashboard/lab/free-lucy-preview-lab"
import FreeWatchlistLab from "@/components/dashboard/lab/free-watchlist-lab"
import FreeSavedFlightsLab, {
  type FreeSavedFlightLabData,
} from "@/components/dashboard/lab/free-saved-flights-lab"
import FreePremiumTeasersLab from "@/components/dashboard/lab/free-premium-teasers-lab"

import { toast } from "@/components/ui/Toasts/use-toast"

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

type SavedFlightsResponse =
  | FreeSavedFlightLabData[]
  | {
    savedFlights?: FreeSavedFlightLabData[]
    saved_flights?: FreeSavedFlightLabData[]
    flights?: FreeSavedFlightLabData[]
    data?: FreeSavedFlightLabData[]
  }

export default function FreeDashboardPage() {
  const router = useRouter()

  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [watchlist, setWatchlist] = useState<WatchlistRoute[]>([])
  const [watchlistFetchKey, setWatchlistFetchKey] = useState(0)
  const [savedFlights, setSavedFlights] = useState<FreeSavedFlightLabData[]>([])
  const [savedFlightsLoading, setSavedFlightsLoading] = useState(true)
  const [savedFlightsFetchKey, setSavedFlightsFetchKey] = useState(0)

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
    if (typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    const shouldShowWelcome = params.get("welcome") === "1"

    if (shouldShowWelcome) {
      setShowWelcomeModal(true)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadWatchlist() {
      const token = getAuthToken()

      if (!token) {
        if (!cancelled) {
          setWatchlist([])
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
      }
    }

    loadWatchlist()

    return () => {
      cancelled = true
    }
  }, [watchlistFetchKey])

  useEffect(() => {
    let cancelled = false

    async function loadSavedFlights() {
      const token = getAuthToken()

      if (!token) {
        if (!cancelled) {
          setSavedFlights([])
          setSavedFlightsLoading(false)
        }
        return
      }

      try {
        setSavedFlightsLoading(true)

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/saved-flights`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data: SavedFlightsResponse = await res.json().catch(() => [])

        if (cancelled) return

        const flights = Array.isArray(data)
          ? data
          : Array.isArray(data.savedFlights)
            ? data.savedFlights
            : Array.isArray(data.saved_flights)
              ? data.saved_flights
              : Array.isArray(data.flights)
                ? data.flights
                : Array.isArray(data.data)
                  ? data.data
                  : []

        setSavedFlights(flights)
      } catch (error) {
        console.error("Failed to load free dashboard saved flights", error)

        if (!cancelled) {
          setSavedFlights([])
        }
      } finally {
        if (!cancelled) {
          setSavedFlightsLoading(false)
        }
      }
    }

    loadSavedFlights()

    return () => {
      cancelled = true
    }
  }, [savedFlightsFetchKey])

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
        title: "Session expired",
        description: "Please sign in again to manage your watchlist.",
      })
      return
    }

    const previousWatchlist = watchlist

    setWatchlist((prev) => prev.filter((route) => route.id !== routeId))

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

      if (!res.ok) {
        throw new Error("Failed to remove route")
      }

      toast({
        title: "Route removed",
        description: "The route was removed from your Free watchlist.",
      })

      setWatchlistFetchKey((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to remove free dashboard route", error)

      setWatchlist(previousWatchlist)

      toast({
        title: "Could not remove route",
        description: "Please try again in a moment.",
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

  async function handleDeleteSavedFlight(savedFlightId: string) {
    const token = getAuthToken()

    if (!token) {
      toast({
        title: "Session expired",
        description: "Please sign in again to manage saved flights.",
      })
      return
    }

    const previousSavedFlights = savedFlights

    setSavedFlights((prev) =>
      prev.filter((savedFlight) => savedFlight.id !== savedFlightId)
    )

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/saved-flights/${savedFlightId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error("Failed to delete saved flight")
      }

      toast({
        title: "Saved flight removed",
        description: "The flight was removed from your saved flights.",
      })

      setSavedFlightsFetchKey((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to delete saved flight", error)

      setSavedFlights(previousSavedFlights)

      toast({
        title: "Could not remove saved flight",
        description: "Please try again in a moment.",
      })
    }
  }

  async function handleCompleteSavedFlight(savedFlightId: string) {
    const token = getAuthToken()

    if (!token) {
      toast({
        title: "Session expired",
        description: "Please sign in again to update saved flights.",
      })
      return
    }

    const previousSavedFlights = savedFlights

    setSavedFlights((prev) =>
      prev.map((savedFlight) =>
        savedFlight.id === savedFlightId
          ? {
            ...savedFlight,
            status: "Completed",
            completed_at: new Date().toISOString(),
          }
          : savedFlight
      )
    )

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/saved-flights/${savedFlightId}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error("Failed to complete saved flight")
      }

      toast({
        title: "Flight marked completed",
        description: "Your saved flight was added to your travel history.",
      })

      setSavedFlightsFetchKey((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to complete saved flight", error)

      setSavedFlights(previousSavedFlights)

      toast({
        title: "Could not mark flight completed",
        description: "Please try again in a moment.",
      })
    }
  }

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
        className={`min-h-screen bg-white text-slate-950 transition duration-300 ${showWelcomeModal ? "pointer-events-none blur-md select-none" : ""
          }`}
      >
        <div className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-7xl">
            <section className="pb-14">
              <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                      Free Dashboard
                    </p>

                    <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Basic Tracking
                    </p>
                  </div>

                  <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                    Start tracking flights with basic route intelligence
                  </h1>

                  <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
                    Monitor up to 3 routes, save up to 3 flights, and get a simple
                    view of fare movement before upgrading to deeper Skysirv
                    intelligence.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <FreeHeroPill label="3 monitored routes" />
                    <FreeHeroPill label="3 saved flights" />
                    <FreeHeroPill label="Basic fare tracking" />
                    <FreeHeroPill label="Paid intelligence previews" />
                  </div>
                </div>

                <FreeLucyPreviewLab />
              </div>
            </section>

            <div className="mb-10">
              <RouteSearch theme="light" onRouteAdded={handleRouteAdded} />
            </div>

            <FreeWatchlistLab
              watchlist={watchlist}
              remainingRoutes={Math.max(0, 3 - watchlist.length)}
              onRemoveRoute={handleRouteRemoved}
            />

            <FreeSavedFlightsLab
              loading={savedFlightsLoading}
              savedFlights={savedFlights}
              remainingSavedFlights={Math.max(0, 3 - savedFlights.length)}
              onDeleteSavedFlight={handleDeleteSavedFlight}
              onCompleteSavedFlight={handleCompleteSavedFlight}
            />

            <FreePremiumTeasersLab />
          </div>
        </div>
      </section>
    </>
  )
}

function FreeHeroPill({ label }: { label: string }) {
  return (
    <div className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
      {label}
    </div>
  )
}