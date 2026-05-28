type PortfolioDecisionStackItem = {
  label: string
  value: string
  detail: string
  status: string
}

type PortfolioDecisionStackProps = {
  items: PortfolioDecisionStackItem[]
}

function getDecisionStackCount(item: PortfolioDecisionStackItem) {
  const normalizedLabel = item.label.toLowerCase()
  const normalizedValue = item.value.toLowerCase()

  if (normalizedLabel.includes("saved flight")) {
    return normalizedValue.includes("no") || normalizedValue.includes("none")
      ? "0"
      : "1"
  }

  if (
    normalizedLabel.includes("routes") ||
    normalizedLabel.includes("monitoring")
  ) {
    return item.value.match(/\d+/)?.[0] ?? "0"
  }

  return "1"
}

export default function PortfolioDecisionStack({
  items,
}: PortfolioDecisionStackProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Decision stack
        </p>
      </div>

      <div className="space-y-2 p-3">
        {items.map((item) => {
          const itemCount = getDecisionStackCount(item)

          return (
            <details
              key={item.label}
              className="group rounded-full border border-slate-200 bg-slate-50/80 transition open:rounded-2xl open:bg-white open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 [&::-webkit-details-marker]:hidden">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                    {item.label}
                  </span>

                  <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 px-1.5 text-[10px] font-semibold text-cyan-700">
                    {itemCount}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-700 sm:inline-flex">
                    {item.status}
                  </span>

                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-5 w-5 text-slate-400 transition group-open:rotate-180 group-open:text-cyan-700"
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
                </div>
              </summary>

              <div className="border-t border-slate-100 px-3 pb-3 pt-2">
                <div className="grid gap-2 sm:grid-cols-[0.8fr_1.2fr] sm:items-start">
                  <p className="text-sm font-semibold text-slate-950">
                    {item.value}
                  </p>

                  <p className="text-sm leading-6 text-slate-600">
                    {item.detail}
                  </p>
                </div>
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}