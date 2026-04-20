"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

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
  const searchParams = useSearchParams()
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
    const shouldShowWelcome = searchParams.get("welcome") === "1"

    if (shouldShowWelcome) {
      setShowWelcomeModal(true)
    }
  }, [searchParams])

  useEffect(() => {
    let cancelled = false

    async function loadSavedFlights() {
      const token = localStorage.getItem("skysirv_token")

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

    const token = localStorage.getItem("skysirv_token")

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
    const token = localStorage.getItem("skysirv_token")

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
    const token = localStorage.getItem("skysirv_token")

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

  const visibleSavedFlights =
    savedFlights.length > 0
      ? savedFlights
      : [
        {
          id: "demo-1",
          origin: "VVI",
          destination: "LAX",
          departure_date: "2026-04-25",
          airline: "LATAM Airlines Group",
          flight_number: "LA 2468",
          price: 1363,
          latest_price: 1328,
          status: "active" as const,
        },
      ]

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
        {/* Hero */}
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
                  Free Plan Dashboard
                </div>

                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                  Start tracking smarter without the noise
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Your Free dashboard gives you a clean look at route monitoring,
                  light market visibility, and a preview of the intelligence layer
                  that powers Skysirv.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Free Access
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    Monitoring up to 3 routes
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

        {/* Main Content */}
        <div className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-7xl">
            {/* Route Search */}
            <div className="mb-10">
              <RouteSearch onRouteAdded={handleRouteAdded} />
            </div>

            {/* Watchlist Section */}
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
                      Free Watchlist
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                      Monitor up to 3 routes
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                      Free plans are designed to help you sample the Skysirv
                      experience with lightweight monitoring, visible pricing
                      context, and a clear path to deeper intelligence.
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
                    <CompactStat label="Tier" value="Free" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                        No free routes monitored yet
                      </h3>

                      <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">
                        Add up to 3 routes above to begin building your first layer
                        of price awareness and monitoring confidence.
                      </p>
                    </div>
                  ) : (
                    watchlist.slice(0, 3).map((route, index) => {
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
            </motion.section>

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

            {/* Quick Free Stats */}
            <motion.section
              {...fadeUp}
              className="mb-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              <InfoCard
                label="Monitoring Cadence"
                value="Standard"
                description="Steady route tracking for users getting started."
              />
              <InfoCard
                label="Price History"
                value="Basic"
                description="Light fare snapshots instead of deep historical analysis."
              />
              <InfoCard
                label="Alerts"
                value="Limited"
                description="Essential signals without the advanced intelligence stack."
              />
              <InfoCard
                label="Skyscore™"
                value="Preview"
                description="A teaser of your intelligence profile, not the full readout."
              />
            </motion.section>

            {/* Global Intelligence */}
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

            {/* Preview Section */}
            <motion.section
              {...fadeUp}
              className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
            >
              <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                  Skyscore™ Preview
                </p>

                <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  64
                </h3>

                <p className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Preview only on Free
                </p>

                <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                  You can preview your intelligence standing, but deeper scoring,
                  stronger signal interpretation, and richer behavior analysis are
                  unlocked on paid plans.
                </p>

                <div className="mt-8 space-y-4">
                  <PreviewRow
                    label="Decision confidence"
                    value="Visible in preview"
                  />
                  <PreviewRow
                    label="Advanced scoring logic"
                    value="Unlock on Pro"
                  />
                  <PreviewRow
                    label="Route-level intelligence depth"
                    value="Unlock on Pro / Business"
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-8 text-white shadow-[0_24px_60px_rgba(2,6,23,0.18)]">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-400">
                  What you unlock next
                </p>

                <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Upgrade when intelligence starts to matter more
                </h3>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Pro and Business open up deeper forecasting, richer route
                  behavior analysis, stronger alerting, and full access to more of
                  the Skysirv intelligence stack.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <UpgradeFeature
                    title="Pro"
                    description="Full Skyscore™, stronger signals, forecast visibility, and up to 25 monitored routes."
                  />
                  <UpgradeFeature
                    title="Business"
                    description="Full intelligence engine access, enhanced analysis, broader history, and premium monitoring depth."
                  />
                </div>

                <div className="mt-8">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                  >
                    Compare Plans
                  </Link>
                </div>
              </div>
            </motion.section>

            {/* Simple Free Intelligence Grid */}
            <motion.section {...fadeUp} className="mt-14">
              <div className="mb-8 max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                  Free Intelligence Snapshot
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  A lighter look at the market
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  Free gives you just enough visibility to start learning how
                  fares move, when signals appear, and why intelligence-driven
                  booking beats guesswork.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <LightFeatureCard
                  title="Basic Monitoring"
                  stat="Up to 3 routes"
                  description="Track a small set of routes to understand how Skysirv surfaces opportunity."
                />
                <LightFeatureCard
                  title="Limited Signals"
                  stat="Essential alerts"
                  description="See the beginnings of fare movement detection without the full decision layer."
                />
                <LightFeatureCard
                  title="Market Visibility"
                  stat="Snapshot level"
                  description="Quick awareness of route conditions without advanced historical depth."
                />
                <LightFeatureCard
                  title="Upgrade Path"
                  stat="Pro / Business"
                  description="Unlock deeper route behavior, predictive signals, and stronger intelligence tools."
                />
              </div>
            </motion.section>
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

function PreviewRow({
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

function UpgradeFeature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  )
}

function LightFeatureCard({
  title,
  stat,
  description,
}: {
  title: string
  stat: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      className="h-full rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-7 shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
    >
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
        {stat}
      </p>
      <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
    </motion.div>
  )
}