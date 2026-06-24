"use client"

export type LucyTripMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  status?: "sending" | "complete" | "error"
}

export type LucyTripPlanTone =
  | "orange"
  | "purple"
  | "green"
  | "blue"
  | "amber"
  | "rose"
  | "slate"

export type LucyTripPlanStatusStep = {
  label: string
  status: "complete" | "in_progress" | "pending"
  tone: LucyTripPlanTone
}

export type LucyTripPlanDetail = {
  label: string
  value: string
}

export type LucyTripPlanBlock =
  | {
    type: "paragraph"
    text: string
  }
  | {
    type: "heading"
    text: string
  }
  | {
    type: "callout"
    title: string
    text: string
    tone: LucyTripPlanTone
  }
  | {
    type: "bullets"
    title?: string
    items: string[]
  }
  | {
    type: "table"
    title?: string
    columns: string[]
    rows: string[][]
    note?: string
  }
  | {
    type: "recommendation"
    title: string
    subtitle?: string
    description: string
    details?: LucyTripPlanDetail[]
    bestFor?: string
    tone?: LucyTripPlanTone
  }

export type LucyTripPlanSection = {
  id: string
  title: string
  navLabel: string
  icon: "stay" | "food" | "go" | "about" | "alternatives" | "next"
  tone: LucyTripPlanTone
  summary?: string
  blocks: LucyTripPlanBlock[]
}

export type LucyTripMapPlace = {
  name: string
  category: "stay" | "food" | "attraction" | "area" | "airport" | "other"
  description?: string
  latitude?: number | null
  longitude?: number | null
}

export type LucyTripStructuredPlan = {
  title: string
  subtitle: string
  destinationSummary: string
  statusSteps: LucyTripPlanStatusStep[]
  sections: LucyTripPlanSection[]
  mapPlaces: LucyTripMapPlace[]
  nextQuestions: string[]
}

type LucyTripGuideContentProps = {
  messages: LucyTripMessage[]
  tripPlan?: LucyTripStructuredPlan | null
  isLucyThinking?: boolean
}

const sectionIconLabels: Record<LucyTripPlanSection["icon"], string> = {
  stay: "Stay",
  food: "Eat",
  go: "Go",
  about: "Trip",
  alternatives: "Alt",
  next: "Next",
}

const sectionNavLabels: Record<LucyTripPlanSection["icon"], string> = {
  stay: "Where to stay?",
  food: "Where to eat?",
  go: "Where to go?",
  about: "About trip",
  alternatives: "Alternatives",
  next: "What’s next?",
}

const sectionSvgIcons: Record<LucyTripPlanSection["icon"], string> = {
  stay: "/images/stock/icons/lucy-trip/stay.png",
  food: "/images/stock/icons/lucy-trip/food.png",
  go: "/images/stock/icons/lucy-trip/go.png",
  about: "/images/stock/icons/lucy-trip/about.png",
  alternatives: "/images/stock/icons/lucy-trip/alternatives.png",
  next: "/images/stock/icons/lucy-trip/next.png",
}

function getToneClasses(tone: LucyTripPlanTone) {
  switch (tone) {
    case "purple":
      return {
        text: "text-purple-600",
        border: "border-purple-200",
        bg: "bg-purple-50",
        softBg: "bg-purple-50/70",
      }

    case "green":
      return {
        text: "text-emerald-600",
        border: "border-emerald-200",
        bg: "bg-emerald-50",
        softBg: "bg-emerald-50/70",
      }

    case "blue":
      return {
        text: "text-blue-600",
        border: "border-blue-200",
        bg: "bg-blue-50",
        softBg: "bg-blue-50/70",
      }

    case "amber":
      return {
        text: "text-amber-600",
        border: "border-amber-200",
        bg: "bg-amber-50",
        softBg: "bg-amber-50/70",
      }

    case "rose":
      return {
        text: "text-rose-600",
        border: "border-rose-200",
        bg: "bg-rose-50",
        softBg: "bg-rose-50/70",
      }

    case "slate":
      return {
        text: "text-slate-700",
        border: "border-slate-200",
        bg: "bg-slate-50",
        softBg: "bg-slate-50/70",
      }

    case "orange":
    default:
      return {
        text: "text-orange-600",
        border: "border-orange-200",
        bg: "bg-orange-50",
        softBg: "bg-orange-50/70",
      }
  }
}

export default function LucyTripGuideContent({
  messages,
  tripPlan = null,
  isLucyThinking = false,
}: LucyTripGuideContentProps) {
  const openingMessage = messages[0]
  const followUpMessages = messages.slice(1)
  const hasVisibleContent = Boolean(openingMessage || tripPlan || isLucyThinking)

  return (
    <div className="h-[calc(100vh-190px)] px-2 pb-0 pt-0">
      <div className="mx-auto flex h-full max-w-[860px] flex-col">
        {tripPlan && tripPlan.sections.length > 0 && (
          <div className="mb-5 shrink-0">
            <LucyTripSectionNav sections={tripPlan.sections} />
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {hasVisibleContent ? (
            <div className="space-y-9">
              {openingMessage && (
                <LucyTripMessageBubble message={openingMessage} />
              )}

              {tripPlan && <LucyTripPlan plan={tripPlan} />}

              {followUpMessages.map((message) => (
                <LucyTripMessageBubble key={message.id} message={message} />
              ))}

              {isLucyThinking && <LucyThinkingBubble />}
            </div>
          ) : (
            <LucyTripEmptyState isLucyThinking={isLucyThinking} />
          )}
        </div>
      </div>
    </div>
  )
}

function LucyTripMessageBubble({ message }: { message: LucyTripMessage }) {
  const isAssistant = message.role === "assistant"

  return (
    <div className="relative">
      <div
        className={`absolute -left-14 top-0 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${isAssistant
          ? "bg-gradient-to-br from-orange-400 to-yellow-300 text-lg"
          : "bg-emerald-700"
          }`}
      >
        {isAssistant ? "L" : "A"}
      </div>

      <div className="pt-1">
        <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">
          {message.content}
        </p>

        {message.status === "error" && (
          <p className="mt-3 text-xs font-semibold text-red-600">
            Lucy could not finish this response. Please try again.
          </p>
        )}
      </div>
    </div>
  )
}

function LucyTripPlan({ plan }: { plan: LucyTripStructuredPlan }) {
  return (
    <div className="relative">
      <div className="absolute -left-14 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 text-lg font-bold text-white shadow-sm">
        L
      </div>

      <div className="space-y-8 pt-1">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Lucy Trip Plan
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {plan.title}
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {plan.subtitle}
          </p>

          <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
            <p className="text-sm font-semibold leading-7 text-slate-700">
              {plan.destinationSummary}
            </p>
          </div>
        </div>

        {plan.statusSteps.length > 0 && (
          <LucyTripStatusPanel statusSteps={plan.statusSteps} />
        )}

        <div className="space-y-7">
          {plan.sections.map((section, index) => (
            <LucyTripPlanSectionCard
              key={section.id}
              section={section}
              defaultOpen={index < 3}
            />
          ))}
        </div>

        {plan.nextQuestions.length > 0 && (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-extrabold text-slate-900">
              What Lucy needs next
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {plan.nextQuestions.map((question) => (
                <div
                  key={question}
                  className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 text-sm font-semibold leading-6 text-slate-700"
                >
                  {question}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LucyTripStatusPanel({
  statusSteps,
}: {
  statusSteps: LucyTripPlanStatusStep[]
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
      <div className="space-y-3">
        {statusSteps.map((step) => {
          const tone = getToneClasses(step.tone)

          return (
            <div key={step.label} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${tone.border} ${tone.bg} ${tone.text} text-xs font-extrabold`}
              >
                ✓
              </span>

              <span className="text-sm font-semibold text-slate-700">
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LucyTripSectionNav({
  sections,
}: {
  sections: LucyTripPlanSection[]
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white/95 p-2 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {sections.map((section) => {
          const tone = getToneClasses(section.tone)

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              title={section.navLabel}
              className={`inline-flex min-h-[34px] items-center justify-center rounded-full border ${tone.border} ${tone.bg} px-3.5 text-[11px] font-extrabold ${tone.text} transition hover:-translate-y-0.5 hover:shadow-sm`}
            >
              {sectionNavLabels[section.icon]}
            </a>
          )
        })}
      </div>
    </div>
  )
}

function LucyTripPlanSectionCard({
  section,
  defaultOpen,
}: {
  section: LucyTripPlanSection
  defaultOpen: boolean
}) {
  const tone = getToneClasses(section.tone)

  return (
    <details
      id={section.id}
      open={defaultOpen}
      className="scroll-mt-28 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
    >
      <summary className="cursor-pointer list-none">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-14 w-14 shrink-0 items-center justify-center">
            <LucyTripSectionIcon icon={section.icon} tone={section.tone} />
          </div>

          <span>
            <h2 className={`text-2xl font-extrabold tracking-tight ${tone.text}`}>
              {section.title}
            </h2>

            {section.summary && (
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {section.summary}
              </p>
            )}
          </span>
        </div>
      </summary>

      <div className="mt-6 space-y-5">
        {section.blocks.map((block, index) => (
          <LucyTripPlanBlockRenderer
            key={`${section.id}-block-${index}`}
            block={block}
            fallbackTone={section.tone}
          />
        ))}
      </div>
    </details>
  )
}

function LucyTripSectionIcon({
  icon,
  tone,
}: {
  icon: LucyTripPlanSection["icon"]
  tone: LucyTripPlanTone
}) {
  const svgPath = sectionSvgIcons[icon]
  const toneClasses = getToneClasses(tone)

  if (!svgPath) {
    return (
      <span className={`text-[10px] font-extrabold ${toneClasses.text}`}>
        {sectionIconLabels[icon]}
      </span>
    )
  }

  return (
    <img
      src={svgPath}
      alt=""
      aria-hidden="true"
      className="h-9 w-9 object-contain"
    />
  )
}

function LucyTripPlanBlockRenderer({
  block,
  fallbackTone,
}: {
  block: LucyTripPlanBlock
  fallbackTone: LucyTripPlanTone
}) {
  if (block.type === "paragraph") {
    return <p className="text-sm leading-7 text-slate-600">{block.text}</p>
  }

  if (block.type === "heading") {
    return (
      <h3 className="pt-2 text-lg font-extrabold tracking-tight text-slate-900">
        {block.text}
      </h3>
    )
  }

  if (block.type === "callout") {
    const tone = getToneClasses(block.tone)

    return (
      <div className={`rounded-2xl border ${tone.border} ${tone.softBg} p-5`}>
        <p className={`text-sm font-extrabold ${tone.text}`}>{block.title}</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">{block.text}</p>
      </div>
    )
  }

  if (block.type === "bullets") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        {block.title && (
          <p className="text-sm font-extrabold text-slate-900">{block.title}</p>
        )}

        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (block.type === "table") {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        {block.title && (
          <div className="border-b border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-900">
            {block.title}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                {block.columns.map((column) => (
                  <th key={column} className="px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {block.rows.map((row, rowIndex) => (
                <tr key={`${row.join("-")}-${rowIndex}`} className="bg-white">
                  {block.columns.map((column, columnIndex) => (
                    <td
                      key={`${column}-${rowIndex}-${columnIndex}`}
                      className="px-4 py-3 align-top text-slate-600"
                    >
                      {row[columnIndex] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {block.note && (
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold leading-6 text-slate-500">
            {block.note}
          </div>
        )}
      </div>
    )
  }

  if (block.type === "recommendation") {
    const tone = getToneClasses(block.tone || fallbackTone)

    return (
      <div className={`rounded-2xl border ${tone.border} bg-white p-5`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {block.title}
            </h3>

            {block.subtitle && (
              <p className={`mt-1 text-xs font-bold ${tone.text}`}>
                {block.subtitle}
              </p>
            )}
          </div>

          <span
            className={`rounded-full border ${tone.border} ${tone.bg} px-3 py-1 text-[11px] font-extrabold ${tone.text}`}
          >
            Pick
          </span>
        </div>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          {block.description}
        </p>

        {block.details && block.details.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {block.details.map((detail) => (
              <div
                key={`${detail.label}-${detail.value}`}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {detail.label}
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {block.bestFor && (
          <div className={`mt-4 rounded-xl ${tone.softBg} px-4 py-3`}>
            <p className="text-sm font-semibold leading-6 text-slate-700">
              <span className="font-extrabold text-slate-900">Best for: </span>
              {block.bestFor}
            </p>
          </div>
        )}
      </div>
    )
  }

  return null
}

function LucyThinkingBubble() {
  return (
    <div className="relative">
      <div className="absolute -left-14 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 text-lg font-bold text-white shadow-sm">
        L
      </div>

      <div className="pt-1">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm font-semibold text-slate-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />
          Lucy is shaping your trip plan...
        </div>
      </div>
    </div>
  )
}

function LucyTripEmptyState({
  isLucyThinking,
}: {
  isLucyThinking: boolean
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center text-center">
      <div className="max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_22px_65px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 text-xl font-bold text-white shadow-sm">
          L
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
          Lucy Trip is ready.
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          Start with a destination, a feeling, a budget, a date range, or
          anything you already know. Lucy will help shape it into a trip plan.
        </p>

        {isLucyThinking && (
          <p className="mt-4 text-xs font-bold text-orange-600">
            Lucy is preparing your first trip response...
          </p>
        )}
      </div>
    </div>
  )
}