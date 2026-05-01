"use client"

import { useMemo, useState } from "react"
import TravelGlobe from "@/components/intelligence-wrapped/travel-globe"
import WrappedCompactModal from "@/components/dashboard/lab/wrapped-compact-modal"

const years = [2026] as const

type WrappedYear = (typeof years)[number]

const wrappedByYear = {
  2026: {
    flights: 8,
    countries: 3,
    distance: "48,000 km",
    skyscore: 82,
    bestRoute: "BOS → MIA",
    bestRouteDetail:
      "Reviewed before prices moved upward and captured one of the strongest Pro timing wins in your profile.",
    savings: "$640",
    beatMarket: "63%",
    travelerIdentity: "Smart Watcher",
    airportNodes: [
      {
        airportCode: "BOS",
        lat: 42.3656,
        lng: -71.0096,
        name: "Boston Logan International Airport",
        city: "Boston",
        country: "United States",
        visits: 3,
        flights: 3,
        layoverHours: 1.2,
        loungeHours: 0.8,
      },
      {
        airportCode: "MIA",
        lat: 25.7959,
        lng: -80.287,
        name: "Miami International Airport",
        city: "Miami",
        country: "United States",
        visits: 3,
        flights: 3,
        layoverHours: 2.1,
        loungeHours: 1.1,
      },
      {
        airportCode: "PTY",
        lat: 9.0714,
        lng: -79.3835,
        name: "Tocumen International Airport",
        city: "Panama City",
        country: "Panama",
        visits: 1,
        flights: 1,
        layoverHours: 2.8,
        loungeHours: 1.4,
      },
      {
        airportCode: "VVI",
        lat: -17.6448,
        lng: -63.1354,
        name: "Viru Viru International Airport",
        city: "Santa Cruz",
        country: "Bolivia",
        visits: 1,
        flights: 1,
        layoverHours: 0.9,
        loungeHours: 0.3,
      },
    ],
    routeArcs: [
      {
        tripId: "trip-1",
        segmentId: "segment-1",
        segmentOrder: 1,
        origin: "BOS",
        destination: "MIA",
        airlineCode: "AA",
        flightNumber: "1421",
        status: "completed",
        source: "wrapped",
        scheduledDepartureAt: "2026-04-30T14:10:00Z",
        scheduledArrivalAt: "2026-04-30T17:45:00Z",
      },
      {
        tripId: "trip-2",
        segmentId: "segment-2",
        segmentOrder: 1,
        origin: "BOS",
        destination: "PTY",
        airlineCode: "CM",
        flightNumber: "704",
        status: "completed",
        source: "wrapped",
        scheduledDepartureAt: "2026-05-12T12:20:00Z",
        scheduledArrivalAt: "2026-05-12T17:05:00Z",
      },
      {
        tripId: "trip-3",
        segmentId: "segment-3",
        segmentOrder: 1,
        origin: "MIA",
        destination: "VVI",
        airlineCode: "OB",
        flightNumber: "767",
        status: "completed",
        source: "wrapped",
        scheduledDepartureAt: "2026-06-02T23:15:00Z",
        scheduledArrivalAt: "2026-06-03T07:35:00Z",
      },
    ],
  },
}

export default function ProIntelligenceWrappedLab() {
  const [selectedYear, setSelectedYear] = useState<WrappedYear>(2026)
  const [isRouteStoryOpen, setIsRouteStoryOpen] = useState(false)
  const [isWrappedDetailsOpen, setIsWrappedDetailsOpen] = useState(false)

  const wrapped = wrappedByYear[selectedYear]

  const metrics = useMemo(
    () => [
      {
        label: "Flights",
        value: String(wrapped.flights),
      },
      {
        label: "Countries",
        value: String(wrapped.countries),
      },
      {
        label: "Distance",
        value: wrapped.distance,
      },
      {
        label: "Skyscore",
        value: String(wrapped.skyscore),
      },
    ],
    [wrapped]
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
                onChange={(event) =>
                  setSelectedYear(Number(event.target.value) as WrappedYear)
                }
                className="bg-transparent text-sm font-semibold text-slate-950 outline-none"
              >
                {years.map((year) => (
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
          <TravelGlobe
            airportNodes={wrapped.airportNodes}
            routeArcs={wrapped.routeArcs}
          />
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
                    Smartest move
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                    {wrapped.bestRoute}
                  </h3>

                  <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    {wrapped.bestRouteDetail}
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
            <SummaryCard label="Savings" value={wrapped.savings} />
            <SummaryCard label="Beat market" value={wrapped.beatMarket} />
            <SummaryCard label="Traveler identity" value={wrapped.travelerIdentity} />
          </div>
        </div>
      </div>

      {isRouteStoryOpen && (
        <WrappedCompactModal
          eyebrow="Route Story"
          title={wrapped.bestRoute}
          description="A compact explanation of why this route stood out inside your yearly travel intelligence."
          onClose={() => setIsRouteStoryOpen(false)}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-5 text-slate-500">
                Route story details will become more precise as completed trip
                and fare-history depth increases.
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
                {wrapped.bestRouteDetail}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <RouteStoryPill label="Timing" value="Before spike" />
              <RouteStoryPill label="Savings" value={wrapped.savings} />
              <RouteStoryPill label="Grade" value="A" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Why it mattered
              </p>

              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                <p>
                  This route stood out because it combined favorable price
                  behavior, better-than-market timing, and a completed booking
                  outcome that improved the yearly intelligence profile.
                </p>

                <p>
                  In the full data-backed version, this story can include fare
                  movement before and after booking, alert context, route
                  volatility, and how the decision affected the user&apos;s
                  annual Skyscore.
                </p>
              </div>
            </div>
          </div>
        </WrappedCompactModal>
      )}

      {isWrappedDetailsOpen && (
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
              <WrappedDetailPill label="Flights" value={String(wrapped.flights)} />
              <WrappedDetailPill label="Countries" value={String(wrapped.countries)} />
              <WrappedDetailPill label="Distance" value={wrapped.distance} />
              <WrappedDetailPill label="Skyscore" value={String(wrapped.skyscore)} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Yearly profile
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Your {selectedYear} profile shows a growing travel pattern built
                from completed trips, monitored routes, airport activity, and
                booking outcomes. As more trips are completed, this view can
                become a richer annual intelligence archive.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <WrappedDetailPill label="Savings" value={wrapped.savings} />
              <WrappedDetailPill label="Beat market" value={wrapped.beatMarket} />
              <WrappedDetailPill
                label="Identity"
                value={wrapped.travelerIdentity}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                What this can include later
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
      )}
    </section>
  )
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

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}