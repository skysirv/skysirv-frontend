"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import AuthModal from "@/components/auth/AuthModal"
import CreateAccountForm from "@/components/auth/CreateAccountForm"

type Billing = "monthly" | "annual"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>("monthly")
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false)

  useEffect(() => {
    const originalBackground = document.body.style.background
    const originalBackgroundColor = document.body.style.backgroundColor

    document.body.style.background =
      "linear-gradient(to bottom, rgb(248 250 252), rgb(255 255 255), rgb(241 245 249))"
    document.body.style.backgroundColor = "rgb(248 250 252)"

    return () => {
      document.body.style.background = originalBackground
      document.body.style.backgroundColor = originalBackgroundColor
    }
  }, [])

  const prices = useMemo(() => {
    const monthly = { free: 0, pro: 19, business: 49 }
    const annual = { free: 0, pro: 15, business: 39 }

    return billing === "monthly" ? monthly : annual
  }, [billing])

  const billingLabel =
    billing === "monthly"
      ? "Billed monthly"
      : "Billed annually (save ~20%)"

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-32 text-slate-950 sm:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ opacity: [0.16, 0.28, 0.16], scale: [1, 1.04, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.10),transparent_42%)]"
          />
          <motion.div
            animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
            transition={{ duration: 8.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[-40px] top-[-20px] h-72 w-72 rounded-full bg-sky-200/45 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
            transition={{ duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-40px] left-[-20px] h-80 w-80 rounded-full bg-indigo-200/35 blur-3xl"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-10 lg:px-12">
          {/* HERO */}
          <div className="mx-auto max-w-4xl text-center">

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.72, ease: "easeOut" }}
              className="mt-6 text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:mt-8 sm:text-6xl md:text-7xl"
            >
              Choose the intelligence layer
              built for your travel style
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.62, ease: "easeOut" }}
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl"
            >
              Start free, monitor the routes that matter, and upgrade when you want
              deeper fare intelligence, smarter signals, and a stronger timing edge.
            </motion.p>
          </div>

          {/* PRICING PANEL */}
          <div className="mx-auto mt-10 max-w-6xl sm:mt-16">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.09)] sm:px-8 sm:py-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Pricing overview
                  </div>

                  <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                    Start free — upgrade when intelligence becomes leverage
                  </h2>

                  <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
                    Skysirv™ is built for travelers who want signal over noise —
                    and timing advantage over guesswork.
                  </p>
                </div>

                <div className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setBilling("monthly")}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-slate-500",
                      billing === "monthly"
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-950"
                    )}
                  >
                    Monthly
                  </button>

                  <button
                    type="button"
                    onClick={() => setBilling("annual")}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-slate-500",
                      billing === "annual"
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-950"
                    )}
                  >
                    Annual
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">{billingLabel}</p>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <MarketingTierCard
                  title="Free"
                  subtitle="Basic fare monitoring"
                  price={prices.free}
                  priceNote="Always free"
                  accent={false}
                  badge={undefined}
                  ctaLabel="Create account"
                  ctaVariant="secondary"
                  onClick={() => setCreateAccountModalOpen(true)}
                  bullets={[
                    { label: "Watchlist", value: "Up to 3 routes" },
                    { label: "Price history", value: "Basic snapshots" },
                    { label: "Skyscore™", value: "Preview only" },
                    { label: "Skysirv Signals™", value: "Limited alerts" },
                    { label: "Monitoring", value: "Standard cadence" },
                    { label: "AI Intelligence", value: "Limited Access" },
                  ]}
                />

                <MarketingTierCard
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
                  ctaLabel="Create account"
                  ctaVariant="primary"
                  onClick={() => setCreateAccountModalOpen(true)}
                  bullets={[
                    { label: "Watchlist", value: "Up to 25 routes" },
                    { label: "Price Behavior™", value: "30–90 day analysis" },
                    { label: "Skyscore™", value: "Full intelligence scoring" },
                    { label: "Skysirv Signals™", value: "Smart drop detection" },
                    { label: "Skysirv Predict™", value: "Forecast signals" },
                    { label: "AI Intelligence", value: "Standard Access" },
                  ]}
                />

                <MarketingTierCard
                  title="Business"
                  subtitle="Full Skysirv engine"
                  price={prices.business}
                  priceNote={
                    billing === "annual"
                      ? "per month billed annually"
                      : "per month"
                  }
                  accent={false}
                  badge="Full System Access"
                  ctaLabel="Create account"
                  ctaVariant="secondary"
                  onClick={() => setCreateAccountModalOpen(true)}
                  bullets={[
                    { label: "Watchlist", value: "Unlimited routes" },
                    { label: "Price Behavior™", value: "Extended history" },
                    { label: "Skysirv Predict™", value: "Forecast modeling" },
                    { label: "Skysirv Insights™", value: "Advanced analysis" },
                    { label: "Intelligence Engine™", value: "Full system access" },
                    { label: "AI Intelligence", value: "Advanced Access" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* COMPARISON TABLE */}
          <div className="mx-auto mt-20 max-w-6xl">
            <DetailedPricingTableDark />
          </div>

          {/* SYSTEM STORY */}
          <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Why pricing matters
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                This is not just a pricing page. It is your entry point into a calmer booking workflow.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Skysirv™ is designed to help travelers monitor routes, understand
                pricing behavior, and make more disciplined booking decisions
                using structured signals instead of raw fare noise.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <SlateMetricCard
                  label="Free"
                  value="Entry"
                  subtext="Basic route tracking visibility"
                />
                <SlateMetricCard
                  label="Pro"
                  value="Advantage"
                  subtext="Timing + scoring + signals"
                />
                <SlateMetricCard
                  label="Business"
                  value="Full Engine"
                  subtext="Deep intelligence access"
                />
              </div>
            </div>

            <div className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:grid-cols-2">
              <SlateFeatureCard
                title="Clarity"
                text="Organize route behavior into something easier to read and act on."
              />
              <SlateFeatureCard
                title="Timing"
                text="Recognize meaningful market moments before they disappear."
              />
              <SlateFeatureCard
                title="Confidence"
                text="Use structured summaries and scoring to reduce booking uncertainty."
              />
              <SlateFeatureCard
                title="Discipline"
                text="Turn a noisy airfare market into a cleaner decision process."
              />
            </div>
          </div>

          {/* FINAL CTA */}
          <div className="mx-auto mt-20 max-w-6xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-14 text-center shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:px-8 sm:py-16">
              <div className="pointer-events-none absolute inset-0">
                <motion.div
                  animate={{ opacity: [0.12, 0.2, 0.12], scale: [1, 1.03, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.10),transparent_45%)]"
                />
              </div>

              <div className="relative mx-auto max-w-3xl">
                <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  Start with the plan that fits now.
                  <span className="block text-slate-600">
                    Upgrade when you want deeper intelligence.
                  </span>
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Create your account, verify your email, and continue through the
                  correct Skysirv onboarding flow without skipping a step.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCreateAccountModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Create account to continue
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Back to homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PricingFooter />
      </section >

      <AuthModal
        open={createAccountModalOpen}
        onClose={() => setCreateAccountModalOpen(false)}
        title="Create your Skysirv™ account"
        description="Start monitoring airfare with real travel intelligence"
        maxWidthClassName="max-w-sm"
      >
        <CreateAccountForm />
      </AuthModal>
    </>
  )
}

function MarketingTierCard(props: {
  title: string
  subtitle: string
  price: number
  priceNote: string
  bullets: Array<{ label: string; value: string }>
  accent: boolean
  badge?: string
  ctaLabel: string
  ctaVariant: "primary" | "secondary"
  onClick: () => void
}) {
  const {
    title,
    subtitle,
    price,
    priceNote,
    bullets,
    accent,
    badge,
    ctaLabel,
    ctaVariant,
    onClick,
  } = props

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)]",
        accent
          ? "border-sky-300 ring-1 ring-sky-200"
          : "border-slate-200"
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,rgba(14,165,233,0.06),transparent)]" />

      {accent && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-slate-400 to-sky-300" />
      )}

      <div className="relative">
        <div className="mb-3 flex min-h-[24px] justify-end">
          {badge && (
            <span
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
                accent
                  ? "border border-sky-200 bg-sky-50 text-sky-700"
                  : "border border-slate-200 bg-slate-50 text-slate-600"
              )}
            >
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

        <div className="mt-6 text-5xl font-semibold tracking-tight text-slate-950">
          {price === 0 ? "$0" : `$${price}`}
        </div>

        <p className="mt-2 text-xs text-slate-500">{priceNote}</p>

        <div className="mt-6">
          <button
            type="button"
            onClick={onClick}
            className={cn(
              "w-full rounded-xl px-4 py-3 text-sm font-medium transition",
              ctaVariant === "primary"
                ? "bg-slate-950 text-white hover:bg-slate-800"
                : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            )}
          >
            {ctaLabel}
          </button>
        </div>

        <div className="mt-7 space-y-3">
          {bullets.map((bullet) => (
            <div
              key={bullet.label}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
            >
              <span className="text-xs font-semibold text-slate-500">
                {bullet.label}
              </span>
              <span className="text-xs text-slate-700">{bullet.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function SlateMetricCard({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left sm:min-h-[132px] sm:flex-col sm:justify-center sm:rounded-2xl sm:p-4 sm:text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <div className="text-right sm:text-center">
        <p className="text-sm font-semibold leading-tight text-slate-950 sm:mt-2 sm:text-xl">
          {value}
        </p>
        <p className="mt-0.5 text-[11px] leading-4 text-slate-500 sm:mt-2 sm:text-xs sm:leading-5">
          {subtext}
        </p>
      </div>
    </div>
  )
}

function SlateFeatureCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="flex min-h-0 flex-col justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-h-[120px] sm:rounded-2xl sm:px-5 sm:py-4"
    >
      <h3 className="text-lg font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-slate-600 sm:mt-2 sm:leading-6">
        {text}
      </p>
    </motion.div>
  )
}

function PricingFooter() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-center md:max-w-4xl md:text-left">
      <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-4 md:text-left">
        <div className="mx-auto flex max-w-xs flex-col justify-start text-center md:mx-0 md:text-left">
          <Link
            href="/"
            className="text-xl font-bold leading-none text-slate-950 transition hover:text-slate-700"
          >
            Skysirv™
          </Link>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Flight intelligence that helps travelers understand pricing and
            book with more confidence.
          </p>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-950">
            Products
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>
              <Link href="/pricing" className="transition hover:text-slate-950">
                Pricing
              </Link>
            </li>

            <li>
              <Link href="/booking" className="transition hover:text-slate-950">
                Booking
              </Link>
            </li>

            <li>
              <Link href="/flight-attendant" className="transition hover:text-slate-950">
                Skysirv Flight Attendant™
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-950">
            Company
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>
              <Link href="/about" className="transition hover:text-slate-950">
                About
              </Link>
            </li>

            <li>
              <Link href="/beta" className="transition hover:text-slate-950">
                Skysirv™ Beta
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-950">
            Legal
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>
              <Link href="/privacy" className="transition hover:text-slate-950">
                Privacy
              </Link>
            </li>

            <li>
              <Link href="/terms" className="transition hover:text-slate-950">
                Terms
              </Link>
            </li>

            <li>
              <Link href="/refund-policy" className="transition hover:text-slate-950">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 text-center">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Skysirv™. All rights reserved.
        </p>
      </div>
    </div>
  )
}

function DetailedPricingTableDark() {
  const plans = ["Free", "Pro", "Business"]
  const [selectedMobilePlan, setSelectedMobilePlan] = useState<"Free" | "Pro" | "Business">("Free")

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
      title: "Advanced AI Intelligence",
      rows: [
        { label: "Lucy's AI Intelligence", values: ["Limited Access", "Standard Access + Limited Live Chat", "Advanced Access + Live Chat"] },
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
        { label: "Multi-device sync", values: ["—", "✔", "✔"] },
      ],
    },
  ]

  return (
    <div className="mx-auto max-w-6xl text-center">
      <h3 className="text-5xl font-bold text-slate-950">
        Full feature breakdown
      </h3>

      <p className="mx-auto mt-2 max-w-3xl text-lg text-slate-600">
        Compare Skysirv™ intelligence capabilities across all plans.
      </p>

      <div className="mt-8 md:hidden">
        <div className="grid grid-cols-3 rounded-full border border-slate-200 bg-slate-100 p-1">
          {plans.map((plan) => (
            <button
              key={plan}
              type="button"
              onClick={() => setSelectedMobilePlan(plan as "Free" | "Pro" | "Business")}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-semibold transition",
                selectedMobilePlan === plan
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-500"
              )}
            >
              {plan}
            </button>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {section.title}
              </div>

              {section.rows.map((row) => {
                const planIndex = plans.indexOf(selectedMobilePlan)

                return (
                  <div
                    key={row.label}
                    className="border-t border-slate-100 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      {row.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {row.values[planIndex]}
                    </p>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 hidden overflow-x-auto md:block">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid min-w-[700px] grid-cols-4 border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-700">
            <div className="px-6 py-4">Feature</div>
            {plans.map((plan) => (
              <div key={plan} className="px-6 py-4 text-center">
                {plan}
              </div>
            ))}
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {section.title}
              </div>

              {section.rows.map((row, index) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid min-w-[700px] grid-cols-4 border-t border-slate-100 text-sm",
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  )}
                >
                  <div className="px-6 py-4 text-left font-semibold text-slate-800">
                    {row.label}
                  </div>

                  {row.values.map((value, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-4 text-center text-slate-600"
                    >
                      {value}
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