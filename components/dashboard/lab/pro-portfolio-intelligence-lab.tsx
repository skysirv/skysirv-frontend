"use client"

import { useMemo, useState } from "react"
import { getAirlineDisplayName } from "@/lib/airlines/airlines"

import type { SavedFlightCardData } from "@/components/dashboard/saved-flight-card"
import type { ProWatchlistRouteLabData } from "@/components/dashboard/lab/pro-watchlist-intelligence-lab"
import PortfolioDecisionStack from "@/components/dashboard/lab/portfolio-decision-stack"

type RecommendedFlight = {
  airline?: string | null
  airlineName?: string | null
  flightNumber?: string | null
  price?: number | null
  currency?: string | null
  capturedAt?: string | null
}

type ProPortfolioSavedFlightData = SavedFlightCardData & {
  completed_at?: string | null
}

type ProPortfolioIntelligenceLabProps = {
  watchlist: ProWatchlistRouteLabData[]
  savedFlights: ProPortfolioSavedFlightData[]
  remainingRoutes: number
  onOpenFlightModal?: (
    route: ProWatchlistRouteLabData,
    flight?: RecommendedFlight | null
  ) => void
  onOpenSavedFlightIntelligence?: (flight: ProPortfolioSavedFlightData) => void
}

type DecisionStackItem = {
  label: string
  value: string
  detail: string
  status: string
}

type OpportunityItem = {
  id: string
  route: string
  source: "Watchlist" | "Saved Flight"
  title: string
  detail: string
  action: string
  routeData?: ProWatchlistRouteLabData
  flightData?: ProPortfolioSavedFlightData
  recommendedFlight?: RecommendedFlight | null
}

export default function ProPortfolioIntelligenceLab({
  watchlist,
  savedFlights,
  remainingRoutes,
  onOpenFlightModal,
  onOpenSavedFlightIntelligence,
}: ProPortfolioIntelligenceLabProps) {
  const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false)
  const [isDigestOpen, setIsDigestOpen] = useState(false)

  const intelligence = useMemo(() => {
    return buildPortfolioIntelligence(watchlist, savedFlights, remainingRoutes)
  }, [watchlist, savedFlights, remainingRoutes])

  return (
    <>
      <section className="pb-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                Skysirv Intelligence
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                Your flight intelligence portfolio
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                A compact decision layer across monitored routes, saved flights,
                and upcoming travel decisions.
              </p>
            </div>

            <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <span className="animate-pulse text-sm font-semibold text-emerald-600 drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]">
                Live
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Intelligence
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Today&apos;s booking brief
                  </p>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                    {intelligence.briefTitle}
                  </h3>
                </div>

                <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  {intelligence.briefStatus}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {intelligence.briefBody}
              </p>

              <details className="group mt-4 rounded-full border border-slate-200 bg-white transition open:rounded-2xl open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 [&::-webkit-details-marker]:hidden">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Recommended action
                    </span>

                    <span className="truncate text-sm font-semibold text-slate-950">
                      {intelligence.nextActionTitle}
                    </span>
                  </div>

                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180 group-open:text-cyan-700"
                    fill="none"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>

                <div className="border-t border-slate-100 px-3 pb-3 pt-2">
                  <p className="text-sm leading-6 text-slate-600">
                    {intelligence.nextActionDetail}
                  </p>
                </div>
              </details>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpportunitiesOpen(true)}
                  className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  Review opportunities
                </button>

                <button
                  type="button"
                  onClick={() => setIsDigestOpen(true)}
                  className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  View Lucy digest
                </button>
              </div>
            </div>

            <PortfolioDecisionStack items={intelligence.decisionStack} />
          </div>
        </div>
      </section>

      {isOpportunitiesOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <button
            type="button"
            aria-label="Close opportunities modal"
            onClick={() => setIsOpportunitiesOpen(false)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  Review Opportunities
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Ranked items worth action
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Lucy ranks route and saved-flight opportunities by urgency,
                  price movement, and booking relevance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpportunitiesOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            <div className="mt-6 max-h-[52vh] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.45)_rgba(241,245,249,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-slate-400">
              {intelligence.opportunities.map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                >
                  <div className="grid gap-3 sm:grid-cols-[0.7fr_1.2fr_auto] sm:items-center">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        #{index + 1} · {item.source}
                      </p>

                      <h4 className="mt-1 text-base font-semibold text-slate-950">
                        {item.route}
                      </h4>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.detail}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (item.routeData && onOpenFlightModal) {
                          onOpenFlightModal(
                            item.routeData,
                            item.recommendedFlight ?? null
                          )
                          setIsOpportunitiesOpen(false)
                          return
                        }

                        if (item.flightData && onOpenSavedFlightIntelligence) {
                          onOpenSavedFlightIntelligence(item.flightData)
                          setIsOpportunitiesOpen(false)
                        }
                      }}
                      className="inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      {item.action}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <p className="text-xs leading-5 text-slate-500">
                Showing the highest-priority items only. Lower-priority routes
                remain available in the watchlist and saved-flight sections.
              </p>

              <button
                type="button"
                onClick={() => setIsOpportunitiesOpen(false)}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDigestOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <button
            type="button"
            aria-label="Close Lucy digest"
            onClick={() => setIsDigestOpen(false)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  Lucy Digest
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Booking intelligence summary
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A plain-language explanation of the route and saved-flight
                  signals behind today&apos;s recommendation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDigestOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
              {intelligence.digestParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const topOpportunity = intelligence.opportunities[0]

                  if (topOpportunity?.routeData && onOpenFlightModal) {
                    onOpenFlightModal(
                      topOpportunity.routeData,
                      topOpportunity.recommendedFlight ?? null
                    )
                    setIsDigestOpen(false)
                    return
                  }

                  if (
                    topOpportunity?.flightData &&
                    onOpenSavedFlightIntelligence
                  ) {
                    onOpenSavedFlightIntelligence(topOpportunity.flightData)
                    setIsDigestOpen(false)
                  }
                }}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Open top item
              </button>

              <button
                type="button"
                onClick={() => setIsDigestOpen(false)}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Close digest
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function buildPortfolioIntelligence(
  watchlist: ProWatchlistRouteLabData[],
  savedFlights: ProPortfolioSavedFlightData[],
  remainingRoutes: number
) {
  const opportunities = buildOpportunities(watchlist, savedFlights)
  const bestOpportunity = opportunities[0]

  const improvedSavedFlights = savedFlights.filter((flight) => {
    const savedPrice = Number(flight.price)
    const latestPrice = Number(flight.latest_price ?? flight.price)

    return (
      Number.isFinite(savedPrice) &&
      Number.isFinite(latestPrice) &&
      latestPrice < savedPrice
    )
  })

  const activeRoutes = watchlist.filter(
    (route) => route.latest_price != null || route.last_checked_at
  )

  const belowAverageRoutes = watchlist.filter((route) => {
    const latestPrice = Number(route.latest_price)
    const averagePrice =
      route.avg_price != null && Number.isFinite(Number(route.avg_price))
        ? Number(route.avg_price) / 100
        : null

    return (
      Number.isFinite(latestPrice) &&
      averagePrice != null &&
      latestPrice < averagePrice
    )
  })

  const briefTitle =
    opportunities.length > 0
      ? `Lucy found ${opportunities.length} item${opportunities.length === 1 ? "" : "s"
      } worth reviewing before your next booking decision.`
      : "Lucy is watching your routes while Skysirv builds stronger fare history."

  const briefBody =
    bestOpportunity != null
      ? `${bestOpportunity.route} is currently the highest-priority item in your Pro dashboard. ${bestOpportunity.detail}`
      : "Add monitored routes and save flights to help Skysirv build a clearer booking brief."

  const nextActionTitle =
    bestOpportunity != null
      ? bestOpportunity.action
      : "Add or save a flight to build your portfolio."

  const nextActionDetail =
    bestOpportunity != null
      ? bestOpportunity.detail
      : "Your Pro intelligence layer becomes more useful as routes collect pricing history and saved flights create comparison points."

  const decisionStack: DecisionStackItem[] = [
    {
      label: "Best opportunity",
      value: bestOpportunity?.route ?? "Building",
      detail:
        bestOpportunity?.detail ??
        "No route or saved-flight opportunity is ready yet.",
      status: bestOpportunity ? "Review" : "Building",
    },
    {
      label: "Saved flight change",
      value:
        improvedSavedFlights.length > 0
          ? getSavedFlightRouteLabel(improvedSavedFlights[0])
          : "No drop yet",
      detail:
        improvedSavedFlights.length > 0
          ? `${getSavedFlightLabel(
            improvedSavedFlights[0]
          )} is now below the saved price.`
          : "Saved flights are being monitored for price movement.",
      status: improvedSavedFlights.length > 0 ? "Improved" : "Watching",
    },
    {
      label: "Routes needing review",
      value: `${opportunities.length} item${opportunities.length === 1 ? "" : "s"
        }`,
      detail: `${activeRoutes.length} active · ${belowAverageRoutes.length} below average · ${Math.max(
        watchlist.length - activeRoutes.length,
        0
      )} building history`,
      status: activeRoutes.length > 0 ? "Active" : "Building",
    },
    {
      label: "Monitoring coverage",
      value: `${watchlist.length} monitored`,
      detail: `${savedFlights.length} saved flight${savedFlights.length === 1 ? "" : "s"
        } · ${remainingRoutes} Pro route slot${remainingRoutes === 1 ? "" : "s"
        } remaining`,
      status: watchlist.length > 0 ? "Healthy" : "Open",
    },
  ]

  const digestParagraphs =
    bestOpportunity != null
      ? [
        `Lucy is prioritizing ${bestOpportunity.route} because it is currently the strongest item across your monitored routes and saved flights.`,
        bestOpportunity.detail,
        `Your Pro dashboard is currently watching ${watchlist.length} monitored route${watchlist.length === 1 ? "" : "s"
        } and ${savedFlights.length} saved flight${savedFlights.length === 1 ? "" : "s"
        }. Routes with live fare movement and saved flights with price changes are ranked first.`,
      ]
      : [
        "Lucy is watching your Pro dashboard, but there is not enough live movement yet to rank a strong booking opportunity.",
        "As your monitored routes collect pricing history and saved flights receive updated comparisons, this digest will become more specific.",
        `You currently have ${remainingRoutes} Pro route slot${remainingRoutes === 1 ? "" : "s"
        } remaining for additional monitoring coverage.`,
      ]

  return {
    briefTitle,
    briefBody,
    briefStatus: opportunities.length > 0 ? "Live Signal" : "Building Signal",
    nextActionTitle,
    nextActionDetail,
    decisionStack,
    opportunities,
    digestParagraphs,
  }
}

function buildOpportunities(
  watchlist: ProWatchlistRouteLabData[],
  savedFlights: ProPortfolioSavedFlightData[]
): OpportunityItem[] {
  const watchlistOpportunities = watchlist
    .map((route) => {
      const recommendedFlight = normalizeRecommendedFlights(route)[0] ?? null
      const latestPrice = Number(recommendedFlight?.price ?? route.latest_price)
      const averagePrice =
        route.avg_price != null && Number.isFinite(Number(route.avg_price))
          ? Number(route.avg_price) / 100
          : null

      const routeLabel = getRouteLabel(route)
      const airlineLabel = getAirlineLabel({
        airlineName: recommendedFlight?.airlineName,
        airline: recommendedFlight?.airline ?? route.latest_airline,
        fallback: "Recommended flight",
      })

      const isBelowAverage =
        Number.isFinite(latestPrice) &&
        averagePrice != null &&
        latestPrice < averagePrice

      const detail = isBelowAverage
        ? `${airlineLabel} is priced at ${formatPrice(
          latestPrice
        )}, below the recent route average of ${formatPrice(averagePrice)}.`
        : `${routeLabel} is active and building Pro-level fare intelligence.`

      return {
        id: `watchlist-${route.id}`,
        route: routeLabel,
        source: "Watchlist" as const,
        title: isBelowAverage
          ? "Strong current booking opportunity"
          : "Active route movement detected",
        detail,
        action: "Open route intelligence",
        routeData: route,
        recommendedFlight,
        score: isBelowAverage ? 3 : route.latest_price != null ? 2 : 1,
      }
    })
    .filter((item) => item.score > 1)

  const savedFlightOpportunities = savedFlights
    .map((flight) => {
      const savedPrice = Number(flight.price)
      const latestPrice = Number(flight.latest_price ?? flight.price)
      const improved =
        Number.isFinite(savedPrice) &&
        Number.isFinite(latestPrice) &&
        latestPrice < savedPrice

      const routeLabel = getSavedFlightRouteLabel(flight)

      return {
        id: `saved-${flight.id}`,
        route: routeLabel,
        source: "Saved Flight" as const,
        title: improved ? "Saved fare improved" : "Saved flight under watch",
        detail: improved
          ? `${getSavedFlightLabel(flight)} is now ${formatPrice(
            savedPrice - latestPrice
          )} below the saved price.`
          : `${getSavedFlightLabel(
            flight
          )} is saved and being monitored for movement.`,
        action: "Open saved flight",
        flightData: flight,
        score: improved ? 4 : 1,
      }
    })
    .filter((item) => item.score > 1)

  return [...savedFlightOpportunities, ...watchlistOpportunities]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

function normalizeRecommendedFlights(route: ProWatchlistRouteLabData) {
  const directFlights = Array.isArray(route.recommended_flights)
    ? route.recommended_flights
    : []

  if (directFlights.length > 0) {
    return directFlights.slice(0, 4)
  }

  if (route.latest_price != null || route.latest_airline || route.latest_flight_number) {
    return [
      {
        airline: route.latest_airline,
        airlineName: route.latest_airline
          ? getAirlineDisplayName(route.latest_airline)
          : null,
        flightNumber: route.latest_flight_number,
        price: route.latest_price,
        currency: "USD",
        capturedAt: route.latest_captured_at,
      },
    ]
  }

  return []
}

function getRouteLabel(route: ProWatchlistRouteLabData) {
  if (route.route) return route.route

  const origin = route.origin?.trim() || "—"
  const destination = route.destination?.trim() || "—"

  return `${origin} → ${destination}`
}

function getSavedFlightRouteLabel(flight: ProPortfolioSavedFlightData) {
  const origin = flight.origin?.trim() || "—"
  const destination = flight.destination?.trim() || "—"

  return `${origin} → ${destination}`
}

function getAirlineLabel({
  airline,
  airlineName,
  fallback = "Recommended flight",
}: {
  airline?: string | null
  airlineName?: string | null
  fallback?: string
}) {
  const displayName = airlineName?.trim()

  if (displayName) return displayName

  const airlineCode = airline?.trim()

  if (!airlineCode) return fallback

  return getAirlineDisplayName(airlineCode)
}

function getSavedFlightLabel(flight: ProPortfolioSavedFlightData) {
  const airline = getAirlineLabel({
    airline: flight.airline,
    fallback: "Saved flight",
  })
  const flightNumber = flight.flight_number?.trim()

  return flightNumber ? `${airline} · ${flightNumber}` : airline
}

function formatPrice(value?: number | null) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "Building"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value))
}