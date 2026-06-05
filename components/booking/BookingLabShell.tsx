"use client"

import Link from "next/link"
import { useState } from "react"

import CarsBookingMode from "@/components/booking/modes/cars/CarsBookingMode"
import CruisesBookingMode from "@/components/booking/modes/cruises/CruisesBookingMode"
import FlightsBookingMode from "@/components/booking/modes/flights/FlightsBookingMode"
import HotelsBookingMode from "@/components/booking/modes/hotels/HotelsBookingMode"
import {
  bookingModeOrder,
  bookingModes,
} from "@/components/booking/shared/bookingLabConfig"
import type {
  BookingMode,
  FlightTripType,
} from "@/components/booking/shared/bookingLabTypes"
import { cn } from "@/components/booking/shared/bookingLabUtils"

export default function BookingLabShell({
  initialMode = "flights",
}: {
  initialMode?: BookingMode
}) {
  const [activeMode, setActiveMode] = useState<BookingMode>(initialMode)
  const [searchSeed, setSearchSeed] = useState(0)
  const [flightTripType, setFlightTripType] =
    useState<FlightTripType>("round-trip")

  const activeConfig = bookingModes[activeMode]

  function resetSearch(nextMode: BookingMode = activeMode) {
    setActiveMode(nextMode)
    setSearchSeed((current) => current + 1)
  }

  function renderActiveMode() {
    if (activeMode === "flights") {
      return (
        <FlightsBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
          flightTripType={flightTripType}
          onFlightTripTypeChange={setFlightTripType}
        />
      )
    }

    if (activeMode === "hotels") {
      return (
        <HotelsBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
        />
      )
    }

    if (activeMode === "cars") {
      return (
        <CarsBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
        />
      )
    }

    return (
      <CruisesBookingMode
        key={`${activeMode}-${searchSeed}`}
        config={activeConfig}
      />
    )
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="skysirv-booking-lab relative min-h-screen overflow-visible bg-white px-5 pb-24 pt-24 sm:px-8 sm:pt-24">
        <Link
          href="/dev/homepage-lab"
          className="fixed left-5 top-5 z-50 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600"
        >
          <span aria-hidden="true">←</span>
          Home
        </Link>

        <div className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 justify-center">
          <div className="flex w-fit max-w-[calc(100vw-160px)] items-center gap-1 overflow-x-auto rounded-xl border border-slate-200/70 bg-white p-1 shadow-sm">
            {bookingModeOrder.map((modeId) => {
              const mode = bookingModes[modeId]

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => resetSearch(mode.id)}
                  className={cn(
                    "shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition",
                    activeMode === mode.id
                      ? "bg-blue-700 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="fixed left-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
            <button
              type="button"
              onClick={() => resetSearch(activeMode)}
              className="flex flex-col items-center gap-1 text-slate-700 transition hover:text-slate-950"
              aria-label="Start a new booking search"
              title="Start a new booking search"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
                +
              </span>
              <span className="text-[11px] font-semibold">New search</span>
            </button>

            <button
              type="button"
              disabled
              className="flex cursor-not-allowed flex-col items-center gap-1 text-slate-400"
              aria-label="Booking history will be available later"
              title="Booking history will be available later"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
                ◷
              </span>
              <span className="text-[11px] font-semibold">History</span>
            </button>
          </div>
        </aside>

        <div className="mx-auto max-w-3xl">
          <div className="mb-5 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              {activeConfig.title}
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {activeConfig.subtitle}
            </p>
          </div>

          {renderActiveMode()}
        </div>
      </section>
    </main>
  )
}