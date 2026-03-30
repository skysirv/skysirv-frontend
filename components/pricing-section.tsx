"use client"

import Link from "next/link";
import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type Billing = "monthly" | "annual"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function PricingSection({
  mode = "marketing",
}: {
  mode?: "marketing" | "choose-plan"
}) {

  const [billing, setBilling] = useState<Billing>("monthly")
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedPlan = searchParams.get("plan")

  const prices = useMemo(() => {
    const monthly = { free: 0, pro: 19, intelligence: 59 }
    const annual = { free: 0, pro: 15, intelligence: 49 }

    return billing === "monthly" ? monthly : annual
  }, [billing])

  const billingLabel =
    billing === "monthly"
      ? "Billed monthly"
      : "Billed annually (save ~20%)"

  return (
    <section className="w-full bg-white py-24">

      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}

        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">

          <div>

            <h2 className="mt-3 text-5xl font-bold tracking-light text-slate-900 sm:text-6xl">
              Start free — Upgrade when intelligence becomes leverage
            </h2>

            <p className="mt-6 max-w-2xl text-lg text-slate-600">
              Skysirv™ is built for travelers who want signal over noise —
              and timing advantage over guesswork.
            </p>

          </div>

          {/* Billing Toggle */}

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 p-1">

            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-slate-300",
                billing === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-slate-300",
                billing === "annual"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              Annual
            </button>

          </div>

        </div>

        <p className="mt-4 text-xs text-slate-400">{billingLabel}</p>

        {/* Plans */}

        <div className="mt-12 grid gap-6 lg:grid-cols-3">

          <TierCard
            mode={mode}
            router={router}
            highlight={selectedPlan === "free"}
            title="Free"
            subtitle="Basic fare monitoring"
            price={prices.free}
            priceNote="Always free"
            accent={false}
            ctaLabel="Start Free"
            ctaVariant="secondary"
            bullets={[
              { label: "Watchlist", value: "Up to 3 routes" },
              { label: "Price history", value: "Basic snapshots" },
              { label: "Skyscore™", value: "Preview only" },
              { label: "Skysirv Signals™", value: "Limited alerts" },
              { label: "Monitoring", value: "Standard cadence" },
            ]}
          />

          <TierCard
            mode={mode}
            router={router}
            highlight={selectedPlan === "pro"}
            title="Pro"
            subtitle="Advanced intelligence"
            price={prices.pro}
            priceNote={
              billing === "annual"
                ? "per month billed annually"
                : "per month"
            }
            accent
            badge="Most Popular"
            ctaLabel="Upgrade to Pro"
            ctaVariant="primary"
            bullets={[
              { label: "Watchlist", value: "Up to 25 routes" },
              { label: "Price Behavior™", value: "30–90 day analysis" },
              { label: "Skyscore™", value: "Full intelligence scoring" },
              { label: "Skysirv Signals™", value: "Smart drop detection" },
              { label: "Skysirv Predict™", value: "Forecast signals" },
            ]}
          />

          <TierCard
            mode={mode}
            router={router}
            highlight={selectedPlan === "enterprise"}
            title="Enterprise"
            subtitle="Full Skysirv engine"
            price={prices.intelligence}
            priceNote={
              billing === "annual"
                ? "per month billed annually"
                : "per month"
            }
            accent={false}
            ctaLabel="Contact Sales"
            ctaVariant="secondary"
            bullets={[
              { label: "Watchlist", value: "Unlimited routes" },
              { label: "Price Behavior™", value: "Extended history" },
              { label: "Skysirv Predict™", value: "Deep forecast modeling" },
              { label: "Skysirv Insights™", value: "Advanced route analysis" },
              { label: "Intelligence Engine™", value: "Full system access" },
            ]}
          />

        </div>

      </div>

    </section>
  )
}

function TierCard(props: {
  mode: "marketing" | "choose-plan"
  router: any
  highlight?: boolean
  title: string
  subtitle: string
  price: number
  priceNote: string
  bullets: Array<{ label: string; value: string }>
  accent: boolean
  badge?: string
  ctaLabel: string
  ctaVariant: "primary" | "secondary"
}) {

  const {
    mode,
    router,
    highlight,
    title,
    subtitle,
    price,
    priceNote,
    bullets,
    accent,
    badge,
    ctaLabel,
    ctaVariant,
  } = props

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white p-7 transition hover:-translate-y-1 shadow-sm",
        highlight
          ? "border-slate-400 shadow-md"
          : accent
          ? "border-slate-300 shadow-xl ring-1 ring-slate-200"
          : "border-slate-200"
      )}
    >

      <div className="relative">

        {/* RESERVED BADGE ROW */}

        <div className="flex justify-end h-6 mb-2">

          {badge && (
            <span className="whitespace-nowrap rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {badge}
            </span>
          )}

        </div>

        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

        <div className="mt-6 text-4xl font-semibold text-slate-900">
          {price === 0 ? "$0" : `$${price}`}
        </div>

        <p className="mt-2 text-xs text-slate-400">{priceNote}</p>

        <div className="mt-6">

          <button
            type="button"
            onClick={() => {

              if (mode === "marketing") {
                router.push("/create-account")
                return
              }

              if (title === "Free") router.push("/choose-plan?plan=free")
              if (title === "Pro") router.push("/choose-plan?plan=pro")
              if (title === "Enterprise") router.push("/choose-plan?plan=enterprise")

            }}
            className={cn(
              "w-full rounded-lg px-4 py-3 text-sm font-medium transition",
              ctaVariant === "primary"
                ? "bg-slate-900 text-white hover:bg-slate-700"
                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            {mode === "marketing" ? "Choose Plan" : ctaLabel}
          </button>

        </div>

        <div className="mt-7 space-y-3">

          {bullets.map((b) => (
            <div
              key={b.label}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <span className="text-xs font-medium text-slate-500">{b.label}</span>
              <span className="text-xs text-slate-700">{b.value}</span>
            </div>
          ))}

        </div>

      </div>

    </div>
  )
}