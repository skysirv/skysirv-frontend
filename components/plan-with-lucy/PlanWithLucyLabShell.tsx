"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

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
  PlanningMode,
  RangeStep,
} from "@/components/plan-with-lucy/shared/planWithLucyTypes"
import { cn } from "@/components/plan-with-lucy/shared/planWithLucyUtils"

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
  const [showOnboardingPanel, setShowOnboardingPanel] = useState(true)

  const activeFlow = modeFlows[activeMode]

  const visibleSteps = useMemo(() => {
    return activeFlow.steps.filter((step) => !confirmedStepIds.includes(step.id))
  }, [activeFlow.steps, confirmedStepIds])

  const confirmedSteps = useMemo(() => {
    return activeFlow.steps.filter((step) => confirmedStepIds.includes(step.id))
  }, [activeFlow.steps, confirmedStepIds])

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

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative min-h-screen overflow-hidden bg-white px-5 pb-44 pt-24 sm:px-8 sm:pt-24">
        <Link
          href="/dev/homepage-lab"
          className="fixed left-5 top-5 z-50 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600"
        >
          <span aria-hidden="true">←</span>
          Home
        </Link>

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

        {showOnboardingPanel && (
          <OnboardingPanel onClose={() => setShowOnboardingPanel(false)} />
        )}

        <BottomLucyComposer
          modeLabel={activeFlow.label}
          composerText={composerText}
          confirmedSteps={confirmedSteps}
          confirmedAnswers={confirmedAnswers}
          onComposerChange={setComposerText}
        />
      </section>
    </main>
  )
}