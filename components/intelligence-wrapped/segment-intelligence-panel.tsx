"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"

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

type SegmentIntelligencePanelProps = {
  wrappedLoading: boolean
  selectedYear: number
  sortedSegments: WrappedSegment[]
  fadeUp?: {
    initial: { opacity: number; y: number }
    whileInView: { opacity: number; y: number }
    viewport: { once: boolean; amount: number }
    transition: { duration: number; ease: "easeOut" }
  }
}

export default function SegmentIntelligencePanel({
  wrappedLoading,
  selectedYear,
  sortedSegments,
  fadeUp,
}: SegmentIntelligencePanelProps) {

  const [selectedSegment, setSelectedSegment] = useState<WrappedSegment | null>(null)

  return (
    <motion.div {...(fadeUp ?? {})} className="mt-14">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
          Route Segment Intelligence
        </p>
        <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Terminal-by-terminal trip flow
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Follow how you moved through each leg of your journey with terminal,
          gate, timing, aircraft, and cabin-level detail pulled directly from
          your wrapped travel history.
        </p>
      </div>

      {wrappedLoading ? (
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="max-h-[520px] overflow-hidden">
            <div className="divide-y divide-slate-200">
              <SegmentRowSkeleton />
              <SegmentRowSkeleton />
              <SegmentRowSkeleton />
              <SegmentRowSkeleton />
              <SegmentRowSkeleton />
            </div>
          </div>
        </div>
      ) : sortedSegments.length === 0 ? (
        <div className="overflow-hidden rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-inner">
            ⌁
          </div>

          <h4 className="text-lg font-semibold text-slate-900">
            No route segments available for {selectedYear}
          </h4>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Once completed trips exist for this wrapped year, your terminals,
            gates, aircraft, and segment flow will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="max-h-[520px] overflow-y-auto">
            <div className="divide-y divide-slate-200">
              {sortedSegments.map((segment) => (
                <SegmentRow
                  key={segment.id}
                  segment={segment}
                  onSelect={setSelectedSegment}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedSegment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <h3 className="text-lg font-semibold text-slate-900">
              {selectedSegment.departure_airport_code ?? "—"} →{" "}
              {selectedSegment.arrival_airport_code ?? "—"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Flight {selectedSegment.airline_code ?? "—"}{" "}
              {selectedSegment.flight_number ?? ""}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedSegment(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  )
}

function SegmentCard({ segment }: { segment: WrappedSegment }) {
  const departureTime = formatSegmentTime(
    segment.actual_departure_at ?? segment.scheduled_departure_at
  )
  const arrivalTime = formatSegmentTime(
    segment.actual_arrival_at ?? segment.scheduled_arrival_at
  )

  const scheduledDeparture = formatSegmentDateTime(segment.scheduled_departure_at)
  const actualDeparture = formatSegmentDateTime(segment.actual_departure_at)
  const scheduledArrival = formatSegmentDateTime(segment.scheduled_arrival_at)
  const actualArrival = formatSegmentDateTime(segment.actual_arrival_at)

  const flightLabel = [segment.airline_code, segment.flight_number]
    .filter(Boolean)
    .join(" ")

  const departureTerminal = segment.departure_terminal || "—"
  const arrivalTerminal = segment.arrival_terminal || "—"
  const departureGate = segment.departure_gate || "—"
  const arrivalGate = segment.arrival_gate || "—"
  const aircraft = segment.aircraft_type || "—"
  const cabin = segment.cabin_class ? toTitleCase(segment.cabin_class) : "—"
  const fareClass = segment.fare_class || "—"
  const segmentDistance =
    typeof segment.distance_km === "number"
      ? `${segment.distance_km.toLocaleString()} km`
      : "—"

  const duration = getFlightDuration(
    segment.actual_departure_at ?? segment.scheduled_departure_at,
    segment.actual_arrival_at ?? segment.scheduled_arrival_at
  )

  const departurePerformance = getTimingPerformance(
    segment.scheduled_departure_at,
    segment.actual_departure_at,
    "departure"
  )

  const arrivalPerformance = getTimingPerformance(
    segment.scheduled_arrival_at,
    segment.actual_arrival_at,
    "arrival"
  )

  const routeSummary = `${segment.departure_airport_code ?? "—"} (${departureTerminal}, Gate ${departureGate}) → ${segment.arrival_airport_code ?? "—"} (${arrivalTerminal}, Gate ${arrivalGate})`

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur"
    >
      <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Segment {segment.segment_order}
            </div>

            <h4 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {segment.departure_airport_code ?? "—"}{" "}
              <span className="text-slate-400">→</span>{" "}
              {segment.arrival_airport_code ?? "—"}
            </h4>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              <span className="font-semibold text-slate-900">{routeSummary}</span>
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {flightLabel || "Flight data unavailable"} • {aircraft} • {cabin} • Fare{" "}
              {fareClass}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SegmentMetaPill label="Distance" value={segmentDistance} />
            <SegmentMetaPill label="Status" value={toTitleCase(segment.status || "—")} />
            <SegmentMetaPill label="Duration" value={duration} />
            <SegmentMetaPill label="Flight" value={flightLabel || "—"} />
          </div>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Departure
            </p>

            <h5 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {segment.departure_airport_code ?? "—"}
            </h5>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniField label="Terminal" value={departureTerminal} />
              <MiniField label="Gate" value={departureGate} />
            </div>

            <div className="mt-4 space-y-2">
              <TimeRow label="Scheduled" value={scheduledDeparture} />
              <TimeRow label="Actual" value={actualDeparture} />
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Timing Readout
              </p>
              <p className={`mt-1 text-sm font-semibold ${departurePerformance.color}`}>
                {departurePerformance.label}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full min-w-[200px] max-w-[260px]">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>{departureTime}</span>
                <span>{arrivalTime}</span>
              </div>

              <div className="relative h-3 rounded-full bg-slate-200">
                <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-400" />
                <div className="absolute -left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-sky-500 shadow-md" />
                <div className="absolute -right-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-500 shadow-md" />
              </div>

              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <span className="text-lg text-slate-400">✈</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Terminal Flow
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Arrival
            </p>

            <h5 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {segment.arrival_airport_code ?? "—"}
            </h5>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniField label="Terminal" value={arrivalTerminal} />
              <MiniField label="Gate" value={arrivalGate} />
            </div>

            <div className="mt-4 space-y-2">
              <TimeRow label="Scheduled" value={scheduledArrival} />
              <TimeRow label="Actual" value={actualArrival} />
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Timing Readout
              </p>
              <p className={`mt-1 text-sm font-semibold ${arrivalPerformance.color}`}>
                {arrivalPerformance.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SegmentRow({
  segment,
  onSelect,
}: {
  segment: WrappedSegment
  onSelect: (segment: WrappedSegment) => void
}) {
  const date = formatSegmentDateTime(
    segment.actual_departure_at ?? segment.scheduled_departure_at
  )

  const route = `${segment.departure_airport_code ?? "—"} → ${segment.arrival_airport_code ?? "—"}`

  const flight = [segment.airline_code, segment.flight_number]
    .filter(Boolean)
    .join(" ") || "—"

  const aircraft = segment.aircraft_type || "—"

  return (
    <div
      onClick={() => {
        console.log("SEGMENT CLICKED:", segment)
        onSelect(segment)
      }}
      className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition cursor-pointer"
    >
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-slate-900">{route}</p>
        <p className="text-xs text-slate-500">{date}</p>
      </div>

      <div className="hidden sm:flex flex-col items-end">
        <p className="text-sm font-medium text-slate-700">{flight}</p>
        <p className="text-xs text-slate-500">{aircraft}</p>
      </div>
    </div>
  )
}

function SegmentRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
        <div className="h-3 w-32 rounded bg-slate-200 animate-pulse" />
      </div>

      <div className="h-3 w-12 rounded bg-slate-200 animate-pulse" />
    </div>
  )
}

function SegmentSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="mt-4 h-8 w-48 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-64 rounded bg-slate-100" />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="h-40 rounded-[1.5rem] bg-slate-100" />
          <div className="h-16 rounded-full bg-slate-100 lg:self-center" />
          <div className="h-40 rounded-[1.5rem] bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

function SegmentMetaPill({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 px-3 py-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function MiniField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function TimeRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  )
}

function formatSegmentTime(value?: string | null) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatSegmentDateTime(value?: string | null) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function getFlightDuration(
  departure?: string | null,
  arrival?: string | null
) {
  if (!departure || !arrival) return "—"

  const departureDate = new Date(departure)
  const arrivalDate = new Date(arrival)

  if (
    Number.isNaN(departureDate.getTime()) ||
    Number.isNaN(arrivalDate.getTime())
  ) {
    return "—"
  }

  const diffMs = arrivalDate.getTime() - departureDate.getTime()

  if (diffMs <= 0) return "—"

  const totalMinutes = Math.round(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${minutes}m`
}

function getTimingPerformance(
  scheduled?: string | null,
  actual?: string | null,
  type: "departure" | "arrival" = "departure"
) {
  if (!scheduled || !actual) {
    return {
      label: "Timing data unavailable",
      color: "text-slate-600",
    }
  }

  const scheduledDate = new Date(scheduled)
  const actualDate = new Date(actual)

  if (
    Number.isNaN(scheduledDate.getTime()) ||
    Number.isNaN(actualDate.getTime())
  ) {
    return {
      label: "Timing data unavailable",
      color: "text-slate-600",
    }
  }

  const diffMinutes = Math.round(
    (actualDate.getTime() - scheduledDate.getTime()) / 60000
  )

  if (diffMinutes === 0) {
    return {
      label: `Right on time ${type === "arrival" ? "arrival" : "departure"}`,
      color: "text-emerald-600",
    }
  }

  if (diffMinutes < 0) {
    return {
      label: `${Math.abs(diffMinutes)} min early`,
      color: "text-emerald-600",
    }
  }

  return {
    label: `${diffMinutes} min late`,
    color: "text-rose-600",
  }
}

function toTitleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}