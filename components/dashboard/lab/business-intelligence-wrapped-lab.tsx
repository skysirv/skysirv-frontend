"use client"

import { useMemo, useState } from "react"
import TravelGlobe from "@/components/intelligence-wrapped/travel-globe"
import WrappedCompactModal from "@/components/dashboard/lab/wrapped-compact-modal"

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

type BusinessIntelligenceWrappedLabProps = {
  wrappedLoading?: boolean
  wrappedData: WrappedData
  selectedYear: number
  availableWrappedYears: number[]
  setSelectedYear: (year: number) => void
  globeAirportNodes: GlobeAirportNode[]
  globeRouteArcs: GlobeRouteArc[]
}

export default function BusinessIntelligenceWrappedLab({
  wrappedLoading = false,
  wrappedData,
  selectedYear,
  availableWrappedYears,
  setSelectedYear,
  globeAirportNodes,
  globeRouteArcs,
}: BusinessIntelligenceWrappedLabProps) {
  const [isRouteStoryOpen, setIsRouteStoryOpen] = useState(false)
  const [isWrappedDetailsOpen, setIsWrappedDetailsOpen] = useState(false)

  const hasWrappedActivity =
    wrappedData.flights > 0 ||
    wrappedData.countries > 0 ||
    globeAirportNodes.length > 0 ||
    globeRouteArcs.length > 0

  const bestRoute = getBestRoute(wrappedData, globeRouteArcs)
  const timingLabel = wrappedData.bestRoute.beforeSpike || "Building"
  const gradeLabel = wrappedData.bestRoute.timingGrade || "—"

  const metrics = useMemo(
    () => [
      {
        label: "Flights",
        value: wrappedLoading ? "Loading" : String(wrappedData.flights),
      },
      {
        label: "Countries",
        value: wrappedLoading ? "Loading" : String(wrappedData.countries),
      },
      {
        label: "Distance",
        value: wrappedLoading ? "Loading" : wrappedData.distance,
      },
      {
        label: "Skyscore",
        value: wrappedLoading ? "Loading" : String(wrappedData.skyscore),
      },
    ],
    [wrappedData, wrappedLoading]
  )

  return (
    <section className="pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Intelligence Wrapped
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              Your travel intelligence archive
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Completed trips, airport activity, route behavior, and yearly
              travel intelligence summarized into one compact view.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWrappedDetailsOpen(true)}
              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              View more intelligence
            </button>

            <label className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Year
              </span>

              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="bg-transparent text-sm font-semibold text-slate-950 outline-none"
              >
                {availableWrappedYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {metric.label}
              </p>

              <p className="shrink-0 text-sm font-semibold tracking-tight text-slate-950">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          {hasWrappedActivity ? (
            <TravelGlobe
              airportNodes={globeAirportNodes}
              routeArcs={globeRouteArcs}
            />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Your Business travel globe is building.
                </p>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Mark saved flights as completed to start creating airport
                  nodes, route arcs, and yearly Business travel intelligence.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Best route
                  </p>

                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    {hasWrappedActivity ? "Smartest move" : "Building"}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                    {bestRoute}
                  </h3>

                  <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    {getBestRouteDetail(hasWrappedActivity, bestRoute, wrappedData)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRouteStoryOpen(true)}
                className="mt-2 inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                View route story
              </button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
            <SummaryCard label="Savings" value={formatCurrency(wrappedData.savings)} />
            <SummaryCard label="Beat market" value={`${wrappedData.beatMarket}%`} />
            <SummaryCard
              label="Traveler identity"
              value={wrappedData.travelerIdentity || "Precision Booker"}
            />
          </div>
        </div>
      </div>

      {isRouteStoryOpen ? (
        <WrappedCompactModal
          eyebrow="Route Story"
          title={bestRoute}
          description="A compact explanation of why this route stood out inside your yearly travel intelligence."
          onClose={() => setIsRouteStoryOpen(false)}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-5 text-slate-500">
                Route story details become more precise as completed trip and
                fare-history depth increases.
              </p>

              <button
                type="button"
                onClick={() => setIsRouteStoryOpen(false)}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Smartest move
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {getBestRouteDetail(hasWrappedActivity, bestRoute, wrappedData)}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <RouteStoryPill
                label="Timing"
                value={hasWrappedActivity ? timingLabel : "Building"}
              />
              <RouteStoryPill
                label="Savings"
                value={formatCurrency(wrappedData.bestRoute.saved || wrappedData.savings)}
              />
              <RouteStoryPill
                label="Grade"
                value={hasWrappedActivity ? gradeLabel : "—"}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Why it mattered
              </p>

              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                <p>
                  This route stood out because it connects completed travel
                  activity with Skysirv&apos;s yearly route intelligence layer.
                </p>

                <p>
                  As more saved flights are completed, this story can include
                  fare movement before and after booking, alert context, route
                  volatility, and how the decision affected the user&apos;s
                  annual Skyscore.
                </p>
              </div>
            </div>
          </div>
        </WrappedCompactModal>
      ) : null}

      {isWrappedDetailsOpen ? (
        <WrappedCompactModal
          eyebrow="Wrapped Intelligence"
          title={`${selectedYear} travel intelligence`}
          description="A deeper dashboard-native view of your yearly travel behavior, savings profile, airport activity, and route intelligence."
          onClose={() => setIsWrappedDetailsOpen(false)}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-5 text-slate-500">
                This compact modal can expand over time with richer fare history,
                route comparisons, and completed-trip intelligence.
              </p>

              <button
                type="button"
                onClick={() => setIsWrappedDetailsOpen(false)}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <WrappedDetailPill label="Flights" value={String(wrappedData.flights)} />
              <WrappedDetailPill
                label="Countries"
                value={String(wrappedData.countries)}
              />
              <WrappedDetailPill label="Distance" value={wrappedData.distance} />
              <WrappedDetailPill label="Skyscore" value={String(wrappedData.skyscore)} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Yearly profile
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Your {selectedYear} Business profile is built from completed
                trips, monitored routes, airport activity, alert outcomes, and
                booking decisions. As more trips are completed, this view becomes
                a richer annual intelligence archive.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <WrappedDetailPill
                label="Savings"
                value={formatCurrency(wrappedData.savings)}
              />
              <WrappedDetailPill
                label="Beat market"
                value={`${wrappedData.beatMarket}%`}
              />
              <WrappedDetailPill
                label="Identity"
                value={wrappedData.travelerIdentity || "Precision Booker"}
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <WrappedDetailPill
                label="Alerts"
                value={String(wrappedData.alertsTriggered)}
              />
              <WrappedDetailPill
                label="Alerts won"
                value={String(wrappedData.alertsWon)}
              />
              <WrappedDetailPill
                label="Routes"
                value={String(wrappedData.routesMonitored)}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                What this includes
              </p>

              <div className="mt-3 grid gap-2">
                <WrappedDetailRow
                  title="Fare movement"
                  description="How monitored routes changed before and after completed bookings."
                />

                <WrappedDetailRow
                  title="Airport behavior"
                  description="Top airports, repeat hubs, lounge time, layover depth, and travel concentration."
                />

                <WrappedDetailRow
                  title="Route intelligence"
                  description="Best routes, strongest timing wins, volatility exposure, and alerts that helped."
                />

                <WrappedDetailRow
                  title="Year-over-year growth"
                  description="Future comparison between travel years once more Wrapped history exists."
                />
              </div>
            </div>
          </div>
        </WrappedCompactModal>
      ) : null}
    </section>
  )
}

function getBestRoute(wrappedData: WrappedData, routeArcs: GlobeRouteArc[]) {
  if (wrappedData.bestRoute.route && wrappedData.bestRoute.route !== "—") {
    return wrappedData.bestRoute.route
  }

  const firstArc = routeArcs[0]

  if (!firstArc?.origin || !firstArc?.destination) {
    return "Building"
  }

  return `${firstArc.origin} → ${firstArc.destination}`
}

function getBestRouteDetail(
  hasWrappedActivity: boolean,
  bestRoute: string,
  wrappedData: WrappedData
) {
  if (!hasWrappedActivity || bestRoute === "Building") {
    return "Complete saved flights to build route stories, airport activity, alert outcomes, and yearly Business travel intelligence."
  }

  if (wrappedData.bestRoute.saved > 0) {
    return `${bestRoute} stands out with ${formatCurrency(
      wrappedData.bestRoute.saved
    )} in tracked savings and helps shape your yearly Skysirv intelligence profile.`
  }

  return `${bestRoute} stands out in your completed travel archive and helps shape your yearly Skysirv intelligence profile.`
}

function formatCurrency(value?: number | null) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "$0"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function SummaryCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="shrink-0 text-sm font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  )
}

function RouteStoryPill({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5">
      <p className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="shrink-0 text-sm font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  )
}

function WrappedDetailPill({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5">
      <p className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="shrink-0 text-sm font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  )
}

function WrappedDetailRow({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
      <p className="text-sm font-semibold tracking-tight text-slate-950">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  )
}