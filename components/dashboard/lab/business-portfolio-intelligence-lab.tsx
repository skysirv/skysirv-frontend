"use client"

import { useState } from "react"

const decisionStack = [
  {
    label: "Best opportunity",
    value: "LAX → SIN",
    detail: "EVA Air · $868 · 12% below route average",
    status: "Review",
  },
  {
    label: "Saved flight change",
    value: "MIA → LAX",
    detail: "AA 1418 is now $10 below the saved price",
    status: "Improved",
  },
  {
    label: "Routes needing review",
    value: "3 routes",
    detail: "2 volatile · 1 below average · 1 limited history",
    status: "Active",
  },
  {
    label: "Monitoring coverage",
    value: "3 monitored",
    detail: "3 saved flights · 2 with active history",
    status: "Healthy",
  },
]

const opportunities = [
  {
    route: "LAX → SIN",
    source: "Watchlist",
    title: "Strongest current booking opportunity",
    detail:
      "EVA Air is priced at $868, roughly 12% below the tracked route average.",
    action: "Open route intelligence",
  },
  {
    route: "MIA → LAX",
    source: "Saved Flight",
    title: "Saved fare improved",
    detail: "AA 1418 is now $10 below the price saved for this flight.",
    action: "Open saved flight",
  },
  {
    route: "JFK → LHR",
    source: "Watchlist",
    title: "Volatility detected",
    detail:
      "This route is showing wider fare movement and may need closer timing review.",
    action: "Review route",
  },
]

export default function BusinessPortfolioIntelligenceLab() {
  const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false)
  const [isDigestOpen, setIsDigestOpen] = useState(false)

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Skysirv Intelligence
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Your live booking brief
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                A compact decision layer across monitored routes, saved flights,
                and upcoming travel opportunities.
              </p>
            </div>

            <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
              <span className="text-sm font-semibold text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.55)]">
                Live
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Intelligence
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Today&apos;s booking brief
                  </p>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    Lucy found 2 items worth reviewing before your next booking
                    decision.
                  </h3>
                </div>

                <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  Building Signal
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                LAX → SIN is currently the strongest route opportunity, while
                one saved MIA → LAX flight has improved since it was saved.
              </p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Recommended next action
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  Review LAX → SIN before prices move again.
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  EVA Air is currently below the tracked route average, while
                  other available options are priced higher.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpportunitiesOpen(true)}
                  className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
                >
                  Review opportunities
                </button>

                <button
                  type="button"
                  onClick={() => setIsDigestOpen(true)}
                  className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
                >
                  View Lucy digest
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Decision stack
                </p>
              </div>

              <div className="divide-y divide-white/10">
                {decisionStack.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-3 px-4 py-3 sm:grid-cols-[0.8fr_1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {item.label}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {item.value}
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-slate-400">
                      {item.detail}
                    </p>

                    <span className="inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
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
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Review Opportunities
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Ranked items worth action
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Lucy ranks route and saved-flight opportunities by urgency,
                  price movement, and booking relevance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpportunitiesOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:text-white"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            <div className="mt-6 max-h-[52vh] space-y-2 overflow-y-auto pr-2 [scrollbar-color:rgba(148,163,184,0.35)_rgba(15,23,42,0.65)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-950/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600/60 [&::-webkit-scrollbar-thumb:hover]:bg-slate-500/80">
              {opportunities.map((item, index) => (
                <article
                  key={`${item.route}-${item.title}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
                >
                  <div className="grid gap-3 sm:grid-cols-[0.7fr_1.2fr_auto] sm:items-center">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        #{index + 1} · {item.source}
                      </p>

                      <h4 className="mt-1 text-base font-semibold text-white">
                        {item.route}
                      </h4>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {item.detail}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
                    >
                      {item.action}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <p className="text-xs leading-5 text-slate-500">
                Showing the highest-priority items only. Lower-priority routes
                remain available in the watchlist and saved-flight sections.
              </p>

              <button
                type="button"
                onClick={() => setIsOpportunitiesOpen(false)}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
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
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Lucy Digest
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Booking intelligence summary
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  A plain-language explanation of the route and saved-flight
                  signals behind today&apos;s recommendation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDigestOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:text-white"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
              <p>
                Lucy is prioritizing LAX → SIN because EVA Air is currently
                priced below the tracked route average while other available
                options remain materially higher. That creates the strongest
                booking opportunity in the current monitored set.
              </p>

              <p>
                MIA → LAX is also worth reviewing because one saved American
                Airlines flight has improved since it was saved. The route is
                still volatile, so the fare may not remain stable for long.
              </p>

              <p>
                BOS → MIA is holding close to its tracked average and does not
                require urgent action right now. Skysirv will continue watching
                for stronger movement before elevating it.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
              >
                Open top route
              </button>

              <button
                type="button"
                onClick={() => setIsDigestOpen(false)}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
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