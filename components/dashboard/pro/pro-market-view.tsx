"use client"

import { motion } from "framer-motion"

type ProMarketViewProps = {
  fadeUp: {
    initial: { opacity: number; y: number }
    whileInView: { opacity: number; y: number }
    viewport: { once: boolean; amount: number }
    transition: { duration: number; ease: "easeOut" }
  }
}

function ProRouteStat({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtext}</p>
    </div>
  )
}

function UpgradeRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  )
}

export default function ProMarketView({ fadeUp }: ProMarketViewProps) {
  return (
    <motion.section {...fadeUp} className="mt-14">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
          Pro Market View
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Better visibility once monitoring begins
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          Pro is designed to surface deeper price behavior, stronger route
          context, and more actionable monitoring visibility — but those
          intelligence layers only appear after you begin tracking routes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.22)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Route Intelligence Preview
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                No monitored route data yet
              </h3>
            </div>

            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300">
              DATA PENDING
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <ProRouteStat
              label="Current Fare"
              value="—"
              subtext="Appears after route monitoring begins"
            />
            <ProRouteStat
              label="Price Behavior"
              value="Pending"
              subtext="Waiting for enough tracked history"
            />
            <ProRouteStat
              label="Signal Status"
              value="Pending"
              subtext="Signals appear after monitoring begins"
            />
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
              <span>Price Behavior</span>
              <span>Monitoring required</span>
            </div>

            <div className="relative min-h-[220px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.4)_0%,rgba(2,6,23,0.65)_100%)] p-6">
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />
              <div className="absolute inset-x-0 bottom-8 border-t border-dashed border-white/10" />

              <div className="flex h-full items-center justify-center">
                <div className="max-w-md text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-300 shadow-inner">
                    ✈
                  </div>
                  <p className="text-sm font-semibold text-white">
                    No chart data available yet
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Once you add routes and monitoring begins, this area will
                    populate with real pricing behavior from your tracked
                    activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.20)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Signal Feed
            </p>

            <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/20 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-300 shadow-inner">
                ⌁
              </div>

              <h3 className="text-lg font-semibold text-white">
                No signals available yet
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Pro signals are generated from real monitored route behavior.
                Once your tracked routes begin collecting enough pricing data,
                this feed will populate automatically.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Business Difference
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Need the full command layer?
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Business goes beyond Pro with deeper forecasting, enhanced
              summaries, broader behavioral history, and full Intelligence
              Engine™ access.
            </p>

            <div className="mt-6 space-y-3">
              <UpgradeRow label="Forecast modeling" value="Business only" />
              <UpgradeRow label="Enhanced route summaries" value="Business only" />
              <UpgradeRow label="Full Intelligence Engine™" value="Business only" />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}