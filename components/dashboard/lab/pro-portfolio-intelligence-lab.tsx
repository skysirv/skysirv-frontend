"use client"

import { useState } from "react"

const decisionStack = [
  {
    label: "Best opportunity",
    value: "BOS → MIA",
    detail: "American Airlines · $186 · below recent route average",
    status: "Review",
  },
  {
    label: "Saved flight change",
    value: "MIA → VVI",
    detail: "OB 767 is now $23 below the saved price",
    status: "Improved",
  },
  {
    label: "Routes needing review",
    value: "2 routes",
    detail: "1 active · 1 below average · 1 building history",
    status: "Active",
  },
  {
    label: "Monitoring coverage",
    value: "3 monitored",
    detail: "3 saved flights · Pro limit 25 routes",
    status: "Healthy",
  },
]

const opportunities = [
  {
    route: "BOS → MIA",
    source: "Watchlist",
    title: "Strongest current booking opportunity",
    detail:
      "American Airlines is priced at $186, below the recent route average for this monitored trip.",
    action: "Open route intelligence",
  },
  {
    route: "MIA → VVI",
    source: "Saved Flight",
    title: "Saved fare improved",
    detail: "OB 767 is now below the price saved for this flight.",
    action: "Open saved flight",
  },
  {
    route: "BOS → PTY",
    source: "Watchlist",
    title: "Active movement detected",
    detail:
      "This route is showing fare movement and may benefit from continued monitoring before booking.",
    action: "Review route",
  },
]

export default function ProPortfolioIntelligenceLab() {
  const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false)
  const [isDigestOpen, setIsDigestOpen] = useState(false)

  return (
    <>
      <section className="pb-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                Skysirv Intelligence
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                Your flight intelligence portfolio
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                A compact decision layer across monitored routes, saved flights,
                and upcoming travel decisions.
              </p>
            </div>

            <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <span className="animate-pulse text-sm font-semibold text-emerald-600 drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]">
                Live
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Intelligence
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Today&apos;s booking brief
                  </p>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                    Lucy found 2 items worth reviewing before your next
                    booking decision.
                  </h3>
                </div>

                <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  Building Signal
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                BOS → MIA is currently the strongest route opportunity, while
                one saved MIA → VVI flight has improved since it was saved.
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Recommended next action
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-950">
                  Review BOS → MIA before prices move again.
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  American Airlines is currently below the tracked route
                  average, while this route continues building Pro-level fare
                  history.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpportunitiesOpen(true)}
                  className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  Review opportunities
                </button>

                <button
                  type="button"
                  onClick={() => setIsDigestOpen(true)}
                  className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  View Lucy digest
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Decision stack
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {decisionStack.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-3 px-4 py-3 sm:grid-cols-[0.8fr_1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {item.label}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {item.value}
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {item.detail}
                    </p>

                    <span className="inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isOpportunitiesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <button
            type="button"
            aria-label="Close opportunities modal"
            onClick={() => setIsOpportunitiesOpen(false)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  Review Opportunities
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Ranked items worth action
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Lucy ranks route and saved-flight opportunities by
                  urgency, price movement, and booking relevance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpportunitiesOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            <div className="mt-6 max-h-[52vh] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.45)_rgba(241,245,249,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400">
              {opportunities.map((item, index) => (
                <article
                  key={`${item.route}-${item.title}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                >
                  <div className="grid gap-3 sm:grid-cols-[0.7fr_1.2fr_auto] sm:items-center">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        #{index + 1} · {item.source}
                      </p>

                      <h4 className="mt-1 text-base font-semibold text-slate-950">
                        {item.route}
                      </h4>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.detail}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      {item.action}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <p className="text-xs leading-5 text-slate-500">
                Showing the highest-priority items only. Lower-priority routes
                remain available in the watchlist and saved-flight sections.
              </p>

              <button
                type="button"
                onClick={() => setIsOpportunitiesOpen(false)}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isDigestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <button
            type="button"
            aria-label="Close Lucy digest"
            onClick={() => setIsDigestOpen(false)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  Lucy Digest
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Booking intelligence summary
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A plain-language explanation of the route and saved-flight
                  signals behind today&apos;s recommendation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDigestOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
              <p>
                Lucy is prioritizing BOS → MIA because American Airlines is
                currently pricing below the tracked route average while the
                route continues building useful fare history.
              </p>

              <p>
                MIA → VVI is also worth reviewing because one saved BoA flight
                has improved since it was saved. The route is currently stable,
                but the saved fare movement is favorable.
              </p>

              <p>
                BOS → PTY is showing active fare movement and should remain
                under watch before making a booking decision.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Open top route
              </button>

              <button
                type="button"
                onClick={() => setIsDigestOpen(false)}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Close digest
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}