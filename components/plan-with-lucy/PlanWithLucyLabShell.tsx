"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  currencyOptions,
  defaultCurrencyCode,
  defaultRegionId,
  getCurrencyByCode,
  getRegionById,
  regionOptions,
} from "@/components/shared/regionCurrencyOptions"
import CarsPlanMode from "@/components/plan-with-lucy/modes/cars/CarsPlanMode"
import CruisesPlanMode from "@/components/plan-with-lucy/modes/cruises/CruisesPlanMode"
import FlightsPlanMode from "@/components/plan-with-lucy/modes/flights/FlightsPlanMode"
import HotelsPlanMode from "@/components/plan-with-lucy/modes/hotels/HotelsPlanMode"
import ItineraryPlanMode from "@/components/plan-with-lucy/modes/itinerary/ItineraryPlanMode"
import BottomLucyComposer from "@/components/plan-with-lucy/shared/BottomLucyComposer"
import OnboardingPanel from "@/components/plan-with-lucy/shared/OnboardingPanel"
import { modeFlows } from "@/components/plan-with-lucy/shared/planWithLucyConfig"
import type {
  ChoiceOption,
  ChoiceStep,
  ConfirmedAnswer,
  MultiChoiceStep,
  PlanningMode,
  RangeStep,
} from "@/components/plan-with-lucy/shared/planWithLucyTypes"
import { cn } from "@/components/plan-with-lucy/shared/planWithLucyUtils"
import { getAuthToken } from "@/utils/auth-storage"
import LargeChevron from "@/components/ui/LargeChevron"

type ActivePicker = "region" | "currency" | null

export default function PlanWithLucyLabShell({
  initialMode = "itinerary",
}: {
  initialMode?: PlanningMode
}) {
  const [activeMode, setActiveMode] = useState<PlanningMode>(initialMode)
  const [confirmedStepIds, setConfirmedStepIds] = useState<string[]>([])
  const [confirmedAnswers, setConfirmedAnswers] = useState<
    Record<string, ConfirmedAnswer>
  >({})
  const [rangeValues, setRangeValues] = useState<Record<string, number>>({})
  const [composerText, setComposerText] = useState("")
  const [showOnboardingPanel, setShowOnboardingPanel] = useState(false)
  const [isSessionReady, setIsSessionReady] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [initialAuthMode, setInitialAuthMode] = useState<"signin" | "signup">(
    "signin",
  )

  const [regionMenuOpen, setRegionMenuOpen] = useState(false)
  const [activePicker, setActivePicker] = useState<ActivePicker>(null)
  const [selectedRegionId, setSelectedRegionId] = useState(defaultRegionId)
  const [selectedCurrencyCode, setSelectedCurrencyCode] =
    useState(defaultCurrencyCode)

  const regionMenuRef = useRef<HTMLDivElement | null>(null)

  const selectedRegion = getRegionById(selectedRegionId)
  const selectedCurrency = getCurrencyByCode(selectedCurrencyCode)
  const activeFlow = modeFlows[activeMode]

  useEffect(() => {
    // TEMP DEV BYPASS:
    // Keep Plan with Lucy fully viewable/editable while we polish the UI.
    setIsSignedIn(true)
    setIsSessionReady(true)
    setInitialAuthMode("signin")
    setShowOnboardingPanel(false)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!regionMenuRef.current) return

      if (!regionMenuRef.current.contains(event.target as Node)) {
        setRegionMenuOpen(false)
        setActivePicker(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const isPlanLocked = false

  const selectedTripIncludes = useMemo(() => {
    return confirmedAnswers["trip-includes"]?.values ?? []
  }, [confirmedAnswers])

  const visibleSteps = useMemo(() => {
    return activeFlow.steps.filter((step) => {
      if (confirmedStepIds.includes(step.id)) return false

      if (!step.requiresTripInclude?.length) return true

      return step.requiresTripInclude.some((mode) =>
        selectedTripIncludes.includes(mode),
      )
    })
  }, [activeFlow.steps, confirmedStepIds, selectedTripIncludes])

  const confirmedSteps = useMemo(() => {
    return activeFlow.steps.filter((step) => confirmedStepIds.includes(step.id))
  }, [activeFlow.steps, confirmedStepIds])

  function toggleMainMenu() {
    setRegionMenuOpen((current) => {
      const nextOpen = !current

      if (!nextOpen) {
        setActivePicker(null)
      }

      return nextOpen
    })
  }

  function togglePicker(picker: Exclude<ActivePicker, null>) {
    setActivePicker((current) => (current === picker ? null : picker))
  }

  function openOnboardingPanel(mode: "signin" | "signup") {
    setInitialAuthMode(mode)
    setShowOnboardingPanel(true)
  }

  function resetFlow(nextMode: PlanningMode) {
    setActiveMode(nextMode)
    setConfirmedStepIds([])
    setConfirmedAnswers({})
    setRangeValues({})
    setComposerText("")
  }

  function appendToComposer(fragment: string) {
    setComposerText((current) => {
      const trimmed = current.trim()

      if (!trimmed) {
        return `${activeFlow.promptStart} ${fragment}`
      }

      return `${trimmed}, ${fragment}`
    })
  }

  function confirmChoice(step: ChoiceStep, option: ChoiceOption) {
    const value = option.value ?? option.label

    setConfirmedAnswers((current) => ({
      ...current,
      [step.id]: {
        icon: option.icon,
        label: option.label,
      },
    }))

    appendToComposer(step.prompt(value))
    setConfirmedStepIds((current) => [...current, step.id])
  }

  function confirmMultiChoice(step: MultiChoiceStep, options: ChoiceOption[]) {
    const labels = options.map((option) => option.label)
    const values = options.map((option) => option.value ?? option.label)

    setConfirmedAnswers((current) => ({
      ...current,
      [step.id]: {
        icon: step.icon,
        label: labels.join(", "),
        values,
      },
    }))

    appendToComposer(step.prompt(labels))
    setConfirmedStepIds((current) => [...current, step.id])
  }

  function confirmRange(step: RangeStep) {
    const rawValue = rangeValues[step.id] ?? step.defaultValue
    const formattedValue = step.formatValue(rawValue)

    setConfirmedAnswers((current) => ({
      ...current,
      [step.id]: {
        icon: step.icon,
        label: formattedValue,
      },
    }))

    appendToComposer(step.prompt(formattedValue))
    setConfirmedStepIds((current) => [...current, step.id])
  }

  function handleRangeChange(stepId: string, value: number) {
    setRangeValues((current) => ({
      ...current,
      [stepId]: value,
    }))
  }

  function renderActiveMode() {
    const sharedModeProps = {
      visibleSteps,
      rangeValues,
      onRangeChange: handleRangeChange,
      onChoiceSelect: confirmChoice,
      onMultiChoiceConfirm: confirmMultiChoice,
      onRangeConfirm: confirmRange,
    }

    if (activeMode === "flights") {
      return <FlightsPlanMode {...sharedModeProps} />
    }

    if (activeMode === "hotels") {
      return <HotelsPlanMode {...sharedModeProps} />
    }

    if (activeMode === "cars") {
      return <CarsPlanMode {...sharedModeProps} />
    }

    if (activeMode === "cruises") {
      return <CruisesPlanMode {...sharedModeProps} />
    }

    return <ItineraryPlanMode {...sharedModeProps} />
  }

  function getBookingHandoffPath(mode: PlanningMode) {
    if (mode === "flights") return "/booking/flights"
    if (mode === "hotels") return "/booking/hotels"
    if (mode === "cars") return "/booking/car-rentals"
    if (mode === "cruises") return "/booking/cruises"

    return "/booking/flights"
  }

  function handleSendToBooking() {
    if (!isSignedIn) {
      openOnboardingPanel("signin")
      return
    }

    const handoffPayload = {
      source: "plan-with-lucy",
      mode: activeMode,
      modeLabel: activeFlow.label,
      prompt: composerText,
      confirmedAnswers,
      confirmedStepIds,
      createdAt: new Date().toISOString(),
    }

    window.sessionStorage.setItem(
      "skysirv-plan-to-booking-handoff",
      JSON.stringify(handoffPayload),
    )

    window.location.href = getBookingHandoffPath(activeMode)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative min-h-screen overflow-hidden bg-white px-5 pb-44 pt-24 sm:px-8 sm:pt-24">
        <Link
          href="/"
          className="fixed left-5 top-5 z-50 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600"
        >
          <LargeChevron direction="left" />
          Home
        </Link>

        {!isPlanLocked && (
          <div className="fixed right-5 top-5 z-[80] flex items-start gap-3">
            <div
              ref={regionMenuRef}
              className="relative"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={toggleMainMenu}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white"
                aria-expanded={regionMenuOpen}
              >
                <span
                  aria-hidden="true"
                  className={`fi fi-${selectedRegion.flagCode} rounded-[2px]`}
                  style={{ width: "20px", height: "15px" }}
                />

                <span>{selectedCurrency.code}</span>

                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className={`h-4 w-4 text-slate-400 transition-transform ${regionMenuOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                >
                  <path
                    d="M5.5 7.5 10 12l4.5-4.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {regionMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[330px] rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Country / Region
                    </p>

                    <button
                      type="button"
                      onClick={() => togglePicker("region")}
                      className={`mt-3 flex min-h-[42px] w-full items-center justify-between rounded-xl border px-3 text-sm font-medium transition ${activePicker === "region"
                        ? "border-orange-200 ring-2 ring-orange-100"
                        : "border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`fi fi-${selectedRegion.flagCode} rounded-[2px]`}
                          style={{ width: "20px", height: "15px" }}
                        />
                        <span className="text-slate-700">
                          {selectedRegion.countryName}
                        </span>
                      </span>

                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className={`h-4 w-4 text-slate-400 transition-transform ${activePicker === "region" ? "rotate-180" : ""
                          }`}
                        fill="none"
                      >
                        <path
                          d="M5.5 7.5 10 12l4.5-4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {activePicker === "region" && (
                      <div className="mt-2 max-h-[230px] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                        {regionOptions.map((region) => {
                          const isSelected = region.id === selectedRegion.id

                          return (
                            <button
                              key={region.id}
                              type="button"
                              onClick={() => {
                                setSelectedRegionId(region.id)
                                setSelectedCurrencyCode(
                                  region.defaultCurrencyCode,
                                )
                                setActivePicker(null)
                              }}
                              className={`flex min-h-[42px] w-full items-center gap-3 px-3 text-sm font-medium transition ${isSelected
                                ? "bg-slate-50 text-slate-900"
                                : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                              <span
                                aria-hidden="true"
                                className={`fi fi-${region.flagCode} rounded-[2px]`}
                                style={{ width: "20px", height: "15px" }}
                              />

                              <span>{region.countryName}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-bold text-slate-800">
                      Currency
                    </p>

                    <button
                      type="button"
                      onClick={() => togglePicker("currency")}
                      className={`mt-3 flex min-h-[42px] w-full items-center justify-between rounded-xl border px-3 text-sm font-medium transition ${activePicker === "currency"
                        ? "border-slate-300 ring-2 ring-slate-100"
                        : "border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      <span className="text-slate-700">
                        {selectedCurrency.code} - {selectedCurrency.name}
                      </span>

                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className={`h-4 w-4 text-slate-400 transition-transform ${activePicker === "currency" ? "rotate-180" : ""
                          }`}
                        fill="none"
                      >
                        <path
                          d="M5.5 7.5 10 12l4.5-4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {activePicker === "currency" && (
                      <div className="mt-2 max-h-[190px] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                        {currencyOptions.map((currency) => {
                          const isSelected =
                            currency.code === selectedCurrency.code

                          return (
                            <button
                              key={currency.code}
                              type="button"
                              onClick={() => {
                                setSelectedCurrencyCode(currency.code)
                                setActivePicker(null)
                              }}
                              className={`flex min-h-[42px] w-full items-center px-3 text-sm font-medium transition ${isSelected
                                ? "bg-slate-50 text-slate-900"
                                : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                              {currency.code} - {currency.name}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isSessionReady && !isSignedIn && (
              <button
                type="button"
                onClick={() => openOnboardingPanel("signin")}
                className="inline-flex min-h-[38px] items-center justify-center rounded-lg border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600"
              >
                Sign in
              </button>
            )}
          </div>
        )}

        <div className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 justify-center">
          <div className="flex w-fit max-w-[calc(100vw-160px)] items-center gap-1 overflow-x-auto rounded-xl border border-slate-200/70 bg-white p-1 shadow-sm">
            {Object.values(modeFlows).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => resetFlow(mode.id)}
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition",
                  activeMode === mode.id
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="fixed left-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
            <button
              type="button"
              onClick={() => resetFlow(activeMode)}
              className="flex flex-col items-center gap-1 text-slate-700 transition hover:text-slate-950"
              aria-label="Start a new planning chat"
              title="Start a new planning chat"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
                +
              </span>
              <span className="text-[11px] font-semibold">New chat</span>
            </button>

            <button
              type="button"
              disabled
              className="flex cursor-not-allowed flex-col items-center gap-1 text-slate-400"
              aria-label="Planning history will be available later"
              title="Planning history will be available later"
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
              {activeFlow.title}
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {activeFlow.subtitle}
            </p>
          </div>

          {renderActiveMode()}
        </div>

        {isPlanLocked && (
          <div
            className="fixed inset-0 z-[60] bg-white/35 backdrop-blur-[3px]"
            aria-hidden="true"
          />
        )}

        {showOnboardingPanel && isSessionReady && (
          <OnboardingPanel
            variant="drawer"
            initialAuthMode={initialAuthMode}
            onClose={() => {
              if (isPlanLocked) return

              setShowOnboardingPanel(false)
            }}
            onSigninComplete={() => {
              setIsSignedIn(true)
              setIsSessionReady(true)
              setShowOnboardingPanel(false)
            }}
            onSignupComplete={() => {
              const signedIn = !!getAuthToken()

              setIsSignedIn(signedIn)
              setIsSessionReady(true)
              setInitialAuthMode("signin")
              setShowOnboardingPanel(!signedIn)
            }}
            showCloseButton={false}
          />
        )}

        <BottomLucyComposer
          modeLabel={activeFlow.label}
          composerText={composerText}
          confirmedSteps={confirmedSteps}
          confirmedAnswers={confirmedAnswers}
          onComposerChange={setComposerText}
          onSend={handleSendToBooking}
        />
      </section>
    </main>
  )
}