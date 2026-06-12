"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import CarsBookingMode from "@/components/booking/modes/cars/CarsBookingMode"
import CruisesBookingMode from "@/components/booking/modes/cruises/CruisesBookingMode"
import FlightsBookingMode from "@/components/booking/modes/flights/FlightsBookingMode"
import HotelsBookingMode from "@/components/booking/modes/hotels/HotelsBookingMode"
import { BookingLucyComposerProvider } from "@/components/booking/shared/BookingLucyComposerContext"
import {
  bookingModeOrder,
  bookingModes,
} from "@/components/booking/shared/bookingLabConfig"
import type {
  BookingMode,
  FlightTripType,
  PlanToBookingHandoff,
} from "@/components/booking/shared/bookingLabTypes"
import { cn } from "@/components/booking/shared/bookingLabUtils"
import LargeChevron from "@/components/ui/LargeChevron"

export default function BookingLabShell({
  initialMode = "flights",
}: {
  initialMode?: BookingMode
}) {
  const [activeMode, setActiveMode] = useState<BookingMode>(initialMode)
  const [searchSeed, setSearchSeed] = useState(0)
  const [flightTripType, setFlightTripType] =
    useState<FlightTripType>("round-trip")

  const [composerText, setComposerText] = useState("")
  const [planHandoff, setPlanHandoff] =
    useState<PlanToBookingHandoff | null>(null)

  useEffect(() => {
    const storedHandoff = window.sessionStorage.getItem(
      "skysirv-plan-to-booking-handoff",
    )

    if (!storedHandoff) return

    try {
      const handoff = JSON.parse(storedHandoff) as PlanToBookingHandoff

      if (handoff.source !== "plan-with-lucy") return

      setPlanHandoff(handoff)

      if (handoff.mode === "flights") {
        const nextFlightTripType = getFlightTripTypeFromHandoff(handoff)

        if (nextFlightTripType) {
          setFlightTripType(nextFlightTripType)
        }
      }

      const promptText = handoff.prompt?.trim()

      if (!promptText) return

      setComposerText(
        `Lucy, use this planning context to help with my booking: ${promptText}`,
      )
    } catch {
      window.sessionStorage.removeItem("skysirv-plan-to-booking-handoff")
    }
  }, [])

  const activeConfig = bookingModes[activeMode]
  const itineraryIncludedModes = getItineraryIncludedModes()

  function resetSearch(nextMode: BookingMode = activeMode) {
    setActiveMode(nextMode)
    setSearchSeed((current) => current + 1)
  }

  function getFlightTripTypeFromHandoff(
    handoff: PlanToBookingHandoff,
  ): FlightTripType | null {
    const flightTypeLabel = handoff.confirmedAnswers?.["flight-type"]?.label

    if (flightTypeLabel === "One-way trip") return "one-way"
    if (flightTypeLabel === "Round trip") return "round-trip"
    if (flightTypeLabel === "Multi-city travel") return "multi-city"

    return null
  }

  function getItineraryIncludedModes(): BookingMode[] {
    if (planHandoff?.mode !== "itinerary") return []

    const values = planHandoff.confirmedAnswers?.["trip-includes"]?.values ?? []

    return bookingModeOrder.filter((modeId) => values.includes(modeId))
  }

  function renderActiveMode() {
    if (activeMode === "flights") {
      return (
        <FlightsBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
          flightTripType={flightTripType}
          onFlightTripTypeChange={setFlightTripType}
          planHandoff={planHandoff}
        />
      )
    }

    if (activeMode === "hotels") {
      return (
        <HotelsBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
          planHandoff={planHandoff}
        />
      )
    }

    if (activeMode === "cars") {
      return (
        <CarsBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
          planHandoff={planHandoff}
        />
      )
    }

    return (
      <CruisesBookingMode
        key={`${activeMode}-${searchSeed}`}
        config={activeConfig}
        planHandoff={planHandoff}
      />
    )
  }

  return (
    <BookingLucyComposerProvider
      value={{
        modeLabel: activeConfig.label,
        composerText,
        onComposerChange: setComposerText,
      }}
    >
      <main className="min-h-screen overflow-hidden bg-white text-slate-950">
        <section className="skysirv-booking-lab relative min-h-screen overflow-visible bg-white px-5 pb-44 pt-24 sm:px-8 sm:pt-24">
          <Link
            href="/dev/homepage-lab"
            className="fixed left-5 top-5 z-50 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600"
          >
            <LargeChevron direction="left" />
            Home
          </Link>

          <div className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 justify-center">
            <div className="flex w-fit max-w-[calc(100vw-160px)] items-center justify-center gap-1 overflow-x-auto rounded-xl border border-slate-200/70 bg-white p-1 shadow-sm">
              {bookingModeOrder.map((modeId) => {
                const mode = bookingModes[modeId]
                const itineraryModeIndex = itineraryIncludedModes.indexOf(modeId)
                const hasItineraryContext = itineraryModeIndex !== -1

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => resetSearch(mode.id)}
                    className={cn(
                      "inline-flex min-h-[38px] min-w-[120px] shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                      activeMode === mode.id
                        ? "bg-blue-700 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900",
                    )}
                  >
                    {mode.label}

                    {hasItineraryContext && (
                      <span
                        className={cn(
                          "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black leading-none",
                          activeMode === mode.id
                            ? "bg-white text-blue-700"
                            : "bg-orange-500 text-white",
                        )}
                        aria-label={`Lucy itinerary context ${itineraryModeIndex + 1}`}
                        title="Lucy itinerary context ready"
                      >
                        {itineraryModeIndex + 1}
                      </span>
                    )}
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
            {renderActiveMode()}
          </div>
        </section>
      </main>
    </BookingLucyComposerProvider>
  )
}