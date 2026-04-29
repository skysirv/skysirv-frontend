"use client"

import { motion } from "framer-motion"

type LucyDashboardSummary = {
  headline: string
  summary: string
  signalFeed: string[]
  systemReadout: string
  recommendedAction: "watch" | "wait" | "book" | "insufficient_data"
  confidence: "low" | "medium" | "high"
  dataStatus: "pending" | "building" | "ready"
}

type BusinessMarketViewProps = {
  watchlistCount: number
  lucySummary: LucyDashboardSummary | null
  lucySummaryLoading: boolean
}

function MarketMetric({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function DarkMetric({
  label,
  value,
  helper,
  helperClassName = "text-slate-400",
}: {
  label: string
  value: string
  helper: string
  helperClassName?: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className={`mt-1 text-xs ${helperClassName}`}>{helper}</p>
    </div>
  )
}

export default function BusinessMarketView({
  watchlistCount,
  lucySummary,
  lucySummaryLoading,
}: BusinessMarketViewProps) {
  const signalFeedItems =
    lucySummary?.signalFeed && lucySummary.signalFeed.length > 0
      ? lucySummary.signalFeed
      : [
        "Signal feed will activate once monitored routes begin generating real market data.",
      ]

  const systemReadout =
    lucySummary?.systemReadout ||
    "System metrics will populate as route monitoring and signal processing begins."

  const dashboardSummary =
    lucySummary?.summary ||
    "Live route behavior is being translated into guidance, confidence scoring, and decision-ready signals across the network."
  return (
    <div className="relative mt-14">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm">
            Live Market Intelligence
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Your intelligence layer, building in real time
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            As routes are monitored and pricing history develops, your intelligence
            layer will begin surfacing route behavior, signal strength, and timing
            insights based on real market data.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MarketMetric label="Routes Scanned" value={watchlistCount} />
          <MarketMetric label="Price Shifts" value="—" />
          <MarketMetric label="Alerts Triggered" value="—" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
          className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.22)]"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Featured Route
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                No route selected
              </h3>
            </div>

            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              DATA PENDING
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <DarkMetric
              label="Current Fare"
              value="—"
              helper="No data yet"
              helperClassName="text-emerald-300"
            />
            <DarkMetric label="Volatility" value="—" helper="Awaiting data" />
            <DarkMetric
              label="Confidence"
              value="—"
              helper="Not available"
              helperClassName="text-sky-300"
            />
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
              <span>Price Behavior</span>
              <span>Data builds after monitoring begins</span>
            </div>

            <div className="relative h-40 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.4)_0%,rgba(2,6,23,0.65)_100%)] p-4">
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />
              <div className="absolute inset-x-0 bottom-8 border-t border-dashed border-white/10" />

              <svg
                viewBox="0 0 600 180"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 42 C40 50, 75 78, 118 70 C165 60, 210 102, 252 90 C302 76, 340 110, 386 92 C430 74, 468 58, 516 66 C548 72, 575 60, 600 48"
                  fill="none"
                  stroke="rgba(56,189,248,0.95)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M0 42 C40 50, 75 78, 118 70 C165 60, 210 102, 252 90 C302 76, 340 110, 386 92 C430 74, 468 58, 516 66 C548 72, 575 60, 600 48 L600 180 L0 180 Z"
                  fill="url(#businessDashboardPriceGlow)"
                  opacity="0.35"
                />
                <defs>
                  <linearGradient
                    id="businessDashboardPriceGlow"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="rgba(56,189,248,0.35)" />
                    <stop offset="100%" stopColor="rgba(56,189,248,0)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="grid gap-6"
        >
          <div className="rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.20)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Signal Feed
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/20 p-5">
              {lucySummaryLoading ? (
                <p className="text-sm text-slate-300">
                  Lucy is reviewing your route intelligence…
                </p>
              ) : (
                <div className="space-y-3">
                  {signalFeedItems.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                    >
                      <p className="text-sm leading-6 text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.20)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              System Readout
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/20 p-5">
              <p className="text-sm leading-6 text-slate-300">
                {lucySummaryLoading
                  ? "Lucy is preparing your system readout…"
                  : systemReadout}
              </p>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-300">
              {dashboardSummary}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}