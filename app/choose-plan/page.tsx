"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type Billing = "monthly" | "annual"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function PricingSection({
  mode = "choose-plan",
}: {
  mode?: "marketing" | "choose-plan"
}) {
  const [billing, setBilling] = useState<Billing>("monthly")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")

    if (tokenFromUrl) {
      localStorage.setItem("skysirv_token", tokenFromUrl)
    }
  }, [searchParams])

  async function handlePlanSelection(plan: string) {
    const token = localStorage.getItem("skysirv_token")

    if (!token) {
      router.push("/signin")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (plan === "free") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscriptions/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            plan: "free"
          })
        })

        const data = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error(data?.error || "Free plan creation failed")
        }

        router.push("/welcome")
        return
      }

      if (plan === "pro" || plan === "enterprise") {
        const billingType = billing === "monthly" ? "monthly" : "yearly"

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/billing/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              plan,
              billing: billingType
            })
          }
        )

        const data = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error(data?.error || "Unable to start checkout")
        }

        if (!data?.url) {
          throw new Error("Stripe checkout URL missing")
        }

        window.location.href = data.url
        return
      }
    } catch (err: any) {
      setError(err?.message || "Unable to continue")
    } finally {
      setLoading(false)
    }
  }

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

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <TierCard
            mode={mode}
            handlePlanSelection={handlePlanSelection}
            loading={loading}
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
            handlePlanSelection={handlePlanSelection}
            loading={loading}
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
            handlePlanSelection={handlePlanSelection}
            loading={loading}
            title="Enterprise"
            subtitle="Full Skysirv engine"
            price={prices.intelligence}
            priceNote={
              billing === "annual"
                ? "per month billed annually"
                : "per month"
            }
            accent={false}
            ctaLabel="Upgrade to Enterprise"
            ctaVariant="secondary"
            bullets={[
              { label: "Watchlist", value: "Unlimited routes" },
              { label: "Price Behavior™", value: "Extended history" },
              { label: "Skysirv Predict™", value: "Forecast modeling" },
              { label: "Skysirv Insights™", value: "Advanced analysis" },
              { label: "Intelligence Engine™", value: "Full system access" },
            ]}
          />
        </div>

        <div className="mt-24">
          <DetailedPricingTable />
        </div>
      </div>
    </section>
  )
}

function TierCard(props: {
  mode: "marketing" | "choose-plan"
  handlePlanSelection: (plan: string) => void
  loading: boolean
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
    handlePlanSelection,
    loading,
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
        "relative overflow-hidden rounded-2xl border bg-white p-7 shadow-sm transition hover:-translate-y-1",
        highlight
          ? "border-slate-400 shadow-md"
          : accent
            ? "border-slate-300 shadow-xl ring-1 ring-slate-200"
            : "border-slate-200"
      )}
    >
      <div className="relative">
        <div className="mb-2 flex h-6 justify-end">
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
            disabled={loading}
            onClick={() => {
              if (mode === "choose-plan") {
                handlePlanSelection(title.toLowerCase())
              }
            }}
            className={cn(
              "w-full rounded-lg px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
              ctaVariant === "primary"
                ? "bg-slate-900 text-white hover:bg-slate-700"
                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            {loading ? "Please wait..." : ctaLabel}
          </button>
        </div>

        <div className="mt-7 space-y-3">
          {bullets.map((b) => (
            <div
              key={b.label}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <span className="text-xs font-medium text-slate-500">
                {b.label}
              </span>
              <span className="text-xs text-slate-700">{b.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DetailedPricingTable() {
  const plans = ["Free", "Pro", "Enterprise"]

  const sections = [
    {
      title: "Core Monitoring",
      rows: [
        { label: "Watchlist", values: ["3 routes", "25 routes", "Unlimited"] },
        { label: "Monitoring cadence", values: ["Standard", "High frequency", "Real-time priority"] },
        { label: "Route coverage", values: ["Basic", "Expanded", "Global coverage"] },
      ],
    },
    {
      title: "Skysirv Intelligence Layer",
      rows: [
        { label: "Skysirv Monitor™", values: ["Basic monitoring", "High-frequency monitoring", "Priority monitoring"] },
        { label: "Skysirv Signals™", values: ["Limited alerts", "Smart drop detection", "Priority intelligence alerts"] },
        { label: "Skysirv Price Behavior™", values: ["Basic snapshots", "30–90 day analysis", "Extended behavioral history"] },
        { label: "Skysirv Predict™", values: ["—", "Forecast signals", "Deep forecasting models"] },
        { label: "Skyscore™", values: ["Preview only", "Full scoring", "Advanced scoring"] },
        { label: "Skysirv Insights™", values: ["—", "Standard insights", "Advanced route analysis"] },
        { label: "Skysirv Route Digest™", values: ["—", "Included", "Enhanced summaries"] },
        { label: "Skysirv Intelligence Engine™", values: ["—", "Partial access", "Full system access"] },
      ],
    },
    {
      title: "Advanced Intelligence",
      rows: [
        { label: "Trend analysis", values: ["—", "Standard", "Advanced"] },
        { label: "Volatility insights", values: ["—", "Included", "Enhanced"] },
        { label: "Historical depth", values: ["Limited", "Expanded", "Full dataset"] },
      ],
    },
    {
      title: "Platform Access",
      rows: [
        { label: "Dashboard", values: ["✔", "✔", "✔"] },
        { label: "Alerts", values: ["Basic", "Smart alerts", "Priority alerts"] },
        { label: "Multi-device sync", values: ["✔", "✔", "✔"] },
      ],
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <h3 className="text-5xl font-semibold text-slate-900">
        Full feature breakdown
      </h3>

      <p className="mt-2 text-lg text-slate-500">
        Compare Skysirv™ intelligence capabilities across all plans
      </p>

      <div className="mt-10 overflow-x-auto">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid min-w-[700px] grid-cols-4 border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-600">
            <div className="px-6 py-4">Feature</div>
            {plans.map((plan) => (
              <div key={plan} className="px-6 py-4 text-center">
                {plan}
              </div>
            ))}
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                {section.title}
              </div>

              {section.rows.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid min-w-[700px] grid-cols-4 border-t border-slate-100 text-sm",
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                  )}
                >
                  <div className="px-6 py-4 font-medium text-slate-700">
                    {row.label}
                  </div>

                  {row.values.map((val, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-4 text-center text-slate-600"
                    >
                      {val}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}