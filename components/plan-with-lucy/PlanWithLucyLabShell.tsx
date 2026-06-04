"use client"

import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useMemo, useState } from "react"

type PlanningMode = "flights" | "hotels" | "cars" | "cruises" | "itinerary"

type ChoiceOption = {
  icon: string
  label: string
  value?: string
}

type ChoiceStep = {
  id: string
  type: "choice"
  title: string
  helper?: string
  variant?: "card" | "pill"
  options: ChoiceOption[]
  prompt: (value: string) => string
}

type RangeStep = {
  id: string
  type: "range"
  title: string
  helper?: string
  min: number
  max: number
  step?: number
  defaultValue: number
  marks: Array<{ label: string; value: number }>
  icon: string
  formatValue: (value: number) => string
  prompt: (value: string) => string
}

type FlowStep = ChoiceStep | RangeStep

type ModeFlow = {
  id: PlanningMode
  label: string
  title: string
  subtitle: string
  promptStart: string
  steps: FlowStep[]
}

type ConfirmedAnswer = {
  icon: string
  label: string
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

const modeFlows: Record<PlanningMode, ModeFlow> = {
  flights: {
    id: "flights",
    label: "Flights",
    title: "Plan flights with Lucy.",
    subtitle:
      "Choose your flight style, priorities, airport flexibility, and comfort preferences. Lucy will turn it into a smarter flight-planning prompt.",
    promptStart: "I want Lucy to help me plan flight options",
    steps: [
      {
        id: "flight-type",
        type: "choice",
        title: "Flight type",
        variant: "pill",
        options: [
          { icon: "🛫", label: "One-way trip", value: "as a one-way trip" },
          { icon: "🔁", label: "Round trip", value: "as a round trip" },
          {
            icon: "🧭",
            label: "Flexible destination",
            value: "with flexible destination options",
          },
          {
            icon: "📅",
            label: "Flexible dates",
            value: "with flexible travel dates",
          },
          {
            icon: "🌍",
            label: "Multi-city travel",
            value: "as a multi-city trip",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "flight-priority",
        type: "choice",
        title: "Priorities",
        variant: "pill",
        options: [
          {
            icon: "💸",
            label: "Budget first",
            value: "with budget as the main priority",
          },
          {
            icon: "⚡",
            label: "Shortest duration",
            value: "with shorter travel time preferred",
          },
          {
            icon: "🛋️",
            label: "Comfort first",
            value: "with comfort and easy timing prioritized",
          },
          {
            icon: "🌙",
            label: "Red-eye friendly",
            value: "and I am open to red-eye flights",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "airport-flexibility",
        type: "choice",
        title: "Airport flexibility",
        variant: "pill",
        options: [
          {
            icon: "📍",
            label: "Exact airports",
            value: "using exact airports only",
          },
          {
            icon: "🧭",
            label: "Nearby airports",
            value: "with nearby airport options included",
          },
          {
            icon: "🚗",
            label: "Drive to better fare",
            value: "and I am willing to drive farther for a better fare",
          },
          {
            icon: "🧳",
            label: "Easy airport experience",
            value: "with easier airport experience preferred",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "flight-comfort",
        type: "choice",
        title: "Comfort",
        variant: "pill",
        options: [
          { icon: "💺", label: "Economy", value: "in economy" },
          {
            icon: "✨",
            label: "Premium economy",
            value: "with premium economy considered",
          },
          {
            icon: "💼",
            label: "Business class",
            value: "with business class considered",
          },
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family timing",
            value: "with family-friendly timing",
          },
        ],
        prompt: (value) => value,
      },
    ],
  },

  hotels: {
    id: "hotels",
    label: "Hotels",
    title: "Plan hotel stays with Lucy.",
    subtitle:
      "Choose your stay style, location needs, amenities, and nightly budget. Lucy will turn it into a smarter hotel-planning prompt.",
    promptStart: "I want Lucy to help me plan hotel options",
    steps: [
      {
        id: "hotel-type",
        type: "choice",
        title: "Hotel type",
        variant: "pill",
        options: [
          {
            icon: "🏙️",
            label: "Business travel",
            value: "for a business travel stay",
          },
          {
            icon: "🏖️",
            label: "Beach resort",
            value: "with beach resort options",
          },
          {
            icon: "🎨",
            label: "Boutique hotel",
            value: "with boutique hotel options",
          },
          {
            icon: "🧳",
            label: "Budget smart stay",
            value: "with budget-smart stays prioritized",
          },
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family comfort",
            value: "with family comfort prioritized",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "hotel-location",
        type: "choice",
        title: "Location",
        variant: "pill",
        options: [
          { icon: "🏛️", label: "Downtown", value: "near the city center" },
          { icon: "✈️", label: "Near airport", value: "near the airport" },
          {
            icon: "🚇",
            label: "Transit nearby",
            value: "near public transportation",
          },
          {
            icon: "🍽️",
            label: "Food district",
            value: "near good restaurants and food areas",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "hotel-amenities",
        type: "choice",
        title: "Amenities",
        variant: "pill",
        options: [
          {
            icon: "☕",
            label: "Breakfast",
            value: "with breakfast included if possible",
          },
          { icon: "🏊", label: "Pool", value: "with a pool preferred" },
          {
            icon: "🐾",
            label: "Pet friendly",
            value: "with pet-friendly options",
          },
          {
            icon: "🧺",
            label: "Laundry",
            value: "with laundry or longer-stay convenience",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "hotel-budget",
        type: "range",
        title: "Nightly budget",
        helper: "Set a rough nightly comfort range.",
        min: 50,
        max: 800,
        step: 25,
        defaultValue: 200,
        icon: "💸",
        marks: [
          { label: "$50", value: 50 },
          { label: "$200", value: 200 },
          { label: "$500", value: 500 },
          { label: "$800", value: 800 },
        ],
        formatValue: (value) => `$${value}/night`,
        prompt: (value) => `with a hotel budget around ${value}`,
      },
    ],
  },

  cars: {
    id: "cars",
    label: "Car rentals",
    title: "Plan car rentals with Lucy.",
    subtitle:
      "Choose your vehicle style, pickup plan, driving needs, and rental duration. Lucy will turn it into a smarter car-rental prompt.",
    promptStart: "I want Lucy to help me plan a car rental",
    steps: [
      {
        id: "vehicle-type",
        type: "choice",
        title: "Vehicle type",
        variant: "pill",
        options: [
          { icon: "🚗", label: "Compact", value: "with a compact car preferred" },
          { icon: "🚙", label: "SUV", value: "with an SUV preferred" },
          {
            icon: "👨‍👩‍👧",
            label: "Family vehicle",
            value: "with a family-friendly vehicle",
          },
          {
            icon: "⚡",
            label: "Electric",
            value: "with electric car options considered",
          },
          {
            icon: "🧳",
            label: "Large luggage",
            value: "with enough space for large luggage",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "pickup-style",
        type: "choice",
        title: "Pickup style",
        variant: "pill",
        options: [
          { icon: "✈️", label: "Airport pickup", value: "with airport pickup" },
          { icon: "🏙️", label: "City pickup", value: "with city pickup" },
          {
            icon: "🔁",
            label: "One-way return",
            value: "with one-way return considered",
          },
          {
            icon: "🕒",
            label: "Flexible timing",
            value: "with flexible pickup and return timing",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "driving-style",
        type: "choice",
        title: "Driving style",
        variant: "pill",
        options: [
          { icon: "🏙️", label: "City driving", value: "mostly for city driving" },
          { icon: "🛣️", label: "Road trip", value: "for a road trip" },
          {
            icon: "🏔️",
            label: "Mountain roads",
            value: "with mountain or rougher roads possible",
          },
          {
            icon: "👶",
            label: "Kids / car seats",
            value: "with kids or car seats needed",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "rental-days",
        type: "range",
        title: "Rental duration",
        helper: "Choose roughly how long the rental is needed.",
        min: 1,
        max: 30,
        step: 1,
        defaultValue: 5,
        icon: "📅",
        marks: [
          { label: "1", value: 1 },
          { label: "7", value: 7 },
          { label: "14", value: 14 },
          { label: "30", value: 30 },
        ],
        formatValue: (value) => `${value} ${value === 1 ? "day" : "days"}`,
        prompt: (value) => `for about ${value}`,
      },
    ],
  },

  cruises: {
    id: "cruises",
    label: "Cruises",
    title: "Plan cruises with Lucy.",
    subtitle:
      "Choose your cruise style, destination region, duration, and onboard priorities. Lucy will turn it into a smarter cruise-planning prompt.",
    promptStart: "I want Lucy to help me plan cruise options",
    steps: [
      {
        id: "cruise-style",
        type: "choice",
        title: "Cruise style",
        variant: "pill",
        options: [
          { icon: "🚢", label: "Ocean cruise", value: "as an ocean cruise" },
          {
            icon: "🏝️",
            label: "Island route",
            value: "with island routes preferred",
          },
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family cruise",
            value: "with family-friendly cruise options",
          },
          {
            icon: "✨",
            label: "Premium cabin",
            value: "with premium cabin options considered",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "cruise-region",
        type: "choice",
        title: "Destination region",
        variant: "pill",
        options: [
          { icon: "🌴", label: "Caribbean", value: "in the Caribbean" },
          { icon: "🏛️", label: "Mediterranean", value: "in the Mediterranean" },
          {
            icon: "❄️",
            label: "Alaska",
            value: "with Alaska cruise options",
          },
          {
            icon: "🧭",
            label: "Not sure",
            value: "and I am open to destination suggestions",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "cruise-duration",
        type: "range",
        title: "Cruise duration",
        min: 2,
        max: 21,
        step: 1,
        defaultValue: 7,
        icon: "📅",
        marks: [
          { label: "2", value: 2 },
          { label: "7", value: 7 },
          { label: "14", value: 14 },
          { label: "21", value: 21 },
        ],
        formatValue: (value) => `${value} ${value === 1 ? "day" : "days"}`,
        prompt: (value) => `for about ${value}`,
      },
      {
        id: "cruise-priority",
        type: "choice",
        title: "Cruise priority",
        variant: "pill",
        options: [
          {
            icon: "🛏️",
            label: "Cabin comfort",
            value: "with cabin comfort prioritized",
          },
          {
            icon: "🍽️",
            label: "Dining",
            value: "with dining quality prioritized",
          },
          {
            icon: "🎭",
            label: "Entertainment",
            value: "with entertainment and activities prioritized",
          },
          {
            icon: "🧘",
            label: "Relaxed pace",
            value: "with a relaxed onboard pace",
          },
        ],
        prompt: (value) => value,
      },
    ],
  },

  itinerary: {
    id: "itinerary",
    label: "Itinerary",
    title: "Build the full trip flow with Lucy.",
    subtitle:
      "Start with pace, budget, duration, and travel style, then adjust each layer of the trip planning until it’s just right. This is how a full planning conversation with Lucy could go — but in a more visual way.",
    promptStart: "I want to plan a trip",
    steps: [
      {
        id: "pace",
        type: "choice",
        title: "Pace level",
        variant: "pill",
        options: [
          { icon: "🌴", label: "Relaxed", value: "with a relaxed pace" },
          { icon: "☀️", label: "Moderate", value: "with a moderate pace" },
          { icon: "🚶", label: "Active", value: "with an active pace" },
          { icon: "🚀", label: "Intense", value: "with an intense pace" },
        ],
        prompt: (value) => value,
      },
      {
        id: "budget",
        type: "range",
        title: "Budget level",
        min: 0,
        max: 100000,
        step: 1000,
        defaultValue: 5000,
        icon: "💸",
        marks: [
          { label: "$0", value: 0 },
          { label: "$25,000", value: 25000 },
          { label: "$50,000", value: 50000 },
          { label: "$75,000", value: 75000 },
          { label: "$100,000", value: 100000 },
        ],
        formatValue: (value) => `$${value.toLocaleString("en-US")}`,
        prompt: (value) => `with an all-inclusive budget around ${value}`,
      },
      {
        id: "duration",
        type: "range",
        title: "Duration",
        min: 1,
        max: 30,
        step: 1,
        defaultValue: 7,
        icon: "📅",
        marks: [
          { label: "1", value: 1 },
          { label: "7", value: 7 },
          { label: "14", value: 14 },
          { label: "30", value: 30 },
        ],
        formatValue: (value) => `${value} ${value === 1 ? "day" : "days"}`,
        prompt: (value) => `lasting about ${value}`,
      },
      {
        id: "trip-focus",
        type: "choice",
        title: "Trip focus",
        variant: "pill",
        options: [
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family trip",
            value: "focused on family-friendly planning",
          },
          {
            icon: "🍝",
            label: "Food focused",
            value: "focused on food and local restaurants",
          },
          {
            icon: "🏖️",
            label: "Beach + city",
            value: "mixing beach time and city exploring",
          },
          {
            icon: "🎒",
            label: "Adventure",
            value: "with adventure and outdoor activities included",
          },
        ],
        prompt: (value) => value,
      },
    ],
  },
}

export default function PlanWithLucyLabShell({
  initialMode = "itinerary",
}: {
  initialMode?: PlanningMode
}) {
  const [activeMode, setActiveMode] = useState<PlanningMode>(initialMode)
  const [confirmedStepIds, setConfirmedStepIds] = useState<string[]>([])
  const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, ConfirmedAnswer>>({})
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
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-xl font-bold text-white shadow-sm"
              aria-label="Plan with Lucy workspace"
              title="Plan with Lucy workspace"
            >
              “
            </button>

            <div className="h-px w-8 bg-slate-200" />

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

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_rgba(15,23,42,0.08)] sm:p-6">
            <AnimatePresence mode="popLayout">
              {visibleSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <PromptBuilderStep
                    step={step}
                    rangeValue={
                      rangeValues[step.id] ??
                      (step.type === "range" ? step.defaultValue : 0)
                    }
                    onRangeChange={(value) => {
                      setRangeValues((current) => ({
                        ...current,
                        [step.id]: value,
                      }))
                    }}
                    onChoiceSelect={(option) => {
                      if (step.type === "choice") {
                        confirmChoice(step, option)
                      }
                    }}
                    onRangeConfirm={() => {
                      if (step.type === "range") {
                        confirmRange(step)
                      }
                    }}
                  />

                  {index < visibleSteps.length - 1 && (
                    <div className="my-8 h-px bg-slate-200" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {visibleSteps.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="py-12 text-center"
              >
                <div className="mb-6 flex justify-center">
                  <img
                    src="/images/stock/lucy/lucy-watch.png"
                    alt="Lucy"
                    className="h-[230px] w-auto object-contain"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-800">
                  Your Lucy prompt is ready.
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                  Review the prompt below, adjust anything you want, then send it
                  to Lucy.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {showOnboardingPanel && (
          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="fixed right-6 top-14 z-40 hidden h-[calc(100vh-5.75rem)] w-[420px] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.12)] xl:block"
          >
            <div className="flex h-full flex-col">
              <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/images/stock/onboarding-hero.jpg')",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-950/10 to-blue-700/25" />

                <button
                  type="button"
                  onClick={() => setShowOnboardingPanel(false)}
                  className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-2xl leading-none text-slate-500 shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-slate-900"
                  aria-label="Close onboarding panel"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="text-sm font-semibold text-slate-600">
                  You are using limited trial planning.
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-orange-500">
                  Unlock more planning with Lucy.
                </h2>

                <div className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
                  <p>✓ Save planning sessions to your Skysirv dashboard.</p>
                  <p>✓ Let Lucy remember preferences across future trips.</p>
                  <p>✓ Unlock deeper itinerary, route, hotel, car, and cruise planning.</p>
                </div>

                <button
                  type="button"
                  className="mt-8 inline-flex min-h-[50px] w-full items-center justify-center rounded-xl bg-gradient-to-r bg-blue-700 px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600"
                >
                  Continue with Google
                </button>

                <div className="my-6 flex items-center gap-3 text-xs font-semibold text-slate-400">
                  <div className="h-px flex-1 bg-slate-200" />
                  Or continue with email
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="min-h-[48px] w-full rounded-xl border border-slate-100 bg-slate-100 px-4 text-sm font-semibold outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="min-h-[48px] w-full rounded-xl border border-slate-100 bg-slate-100 px-4 text-sm font-semibold outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-blue-700 px-6 text-sm font-bold text-white hover:border-blue-600 hover:bg-blue-600"
                  >
                    Sign up / Sign in
                  </button>
                </div>

                <p className="mt-auto pt-8 text-xs leading-6 text-slate-500">
                  By continuing, you agree to Skysirv’s{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-blue-700 underline underline-offset-2 transition hover:text-blue-800"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-blue-700 underline underline-offset-2 transition hover:text-blue-800"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </motion.aside>
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

function PromptBuilderStep({
  step,
  rangeValue,
  onRangeChange,
  onChoiceSelect,
  onRangeConfirm,
}: {
  step: FlowStep
  rangeValue: number
  onRangeChange: (value: number) => void
  onChoiceSelect: (option: ChoiceOption) => void
  onRangeConfirm: () => void
}) {
  if (step.type === "choice") {
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">{step.title}</h2>

          {step.helper && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {step.helper}
            </p>
          )}
        </div>

        {step.variant === "pill" ? (
          <div className="flex flex-wrap gap-3">
            {step.options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onChoiceSelect(option)}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="text-lg transition group-hover:scale-110">
                  {option.icon}
                </span>

                <span>{option.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {step.options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onChoiceSelect(option)}
                className="group flex min-h-[86px] flex-col items-center justify-center rounded-xl border border-transparent bg-gradient-to-br from-emerald-50 via-yellow-50 to-pink-50 px-4 py-4 text-center transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_16px_35px_rgba(37,99,235,0.16)]"
              >
                <span className="text-2xl transition group-hover:scale-110">
                  {option.icon}
                </span>

                <span className="mt-2 text-sm font-semibold text-slate-700">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const getSliderPercent = (value: number) => {
    return ((value - step.min) / (step.max - step.min)) * 100
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">{step.title}</h2>

          {step.helper && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {step.helper}
            </p>
          )}
        </div>

        <p className="text-sm font-bold text-blue-700">
          {step.formatValue(rangeValue)}
        </p>
      </div>

      <input
        type="range"
        min={step.min}
        max={step.max}
        step={step.step ?? 1}
        value={rangeValue}
        onChange={(event) => onRangeChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-700"
      />

      <div className="relative mt-4 h-5 text-xs font-semibold text-slate-400">
        {step.marks.map((mark) => {
          const markLeft = Math.min(96, Math.max(4, getSliderPercent(mark.value)))

          return (
            <span
              key={mark.label}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${markLeft}%` }}
            >
              {mark.label}
            </span>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onRangeConfirm}
        className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-blue-700 bg-blue-700 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600"
      >
        Confirm
      </button>
    </div>
  )
}

function BottomLucyComposer({
  modeLabel,
  composerText,
  confirmedSteps,
  confirmedAnswers,
  onComposerChange,
}: {
  modeLabel: string
  composerText: string
  confirmedSteps: FlowStep[]
  confirmedAnswers: Record<string, ConfirmedAnswer>
  onComposerChange: (value: string) => void
}) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(760px,calc(100vw-40px))] -translate-x-1/2">
      <div className="rounded-[1.35rem] border border-slate-200 bg-white p-3 shadow-[0_18px_55px_rgba(15,23,42,0.16)]">
        <textarea
          value={composerText}
          onChange={(event) => onComposerChange(event.target.value)}
          placeholder="Get Lucy started with a prompt..."
          rows={2}
          className="min-h-[46px] w-full resize-none rounded-xl border-0 bg-transparent px-2 py-2 text-sm font-medium leading-6 text-slate-800 outline-none placeholder:text-slate-400"
        />

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-lg text-orange-500"
            aria-label="Voice input"
          >
            ◉
          </button>

          <span className="inline-flex min-h-[30px] items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-500">
            Deep Planning
            <span aria-hidden="true">🔒</span>
          </span>

          <span className="inline-flex min-h-[30px] items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
            {modeLabel}
          </span>

          {confirmedSteps.map((step) => {
            const answer = confirmedAnswers[step.id]

            if (!answer) return null

            return (
              <motion.span
                key={step.id}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                title={answer.label}
                aria-label={answer.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-base text-blue-700"
              >
                {answer.icon}
              </motion.span>
            )
          })}

          <button
            type="button"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white shadow-sm transition hover:bg-blue-800"
            aria-label="Send to Lucy"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}