"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

type Billing = "monthly" | "annual"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

const planCards = [
  {
    name: "Free",
    subtitle: "Start your Skysirv account",
    description:
      "Create a basic travel profile, explore Skysirv, and start using limited dashboard tools without needing a paid plan.",
    monthlyPrice: 0,
    annualPrice: 0,
    badge: "Start here",
    cta: "Create free account",
    href: "/create-account",
    featured: false,
    features: [
      "Basic Skysirv account",
      "Starter dashboard access",
      "Limited tracked routes",
      "Limited saved flights",
      "Basic travel history",
      "Limited Lucy guidance",
    ],
  },
  {
    name: "Pro",
    subtitle: "Personal travel command center",
    description:
      "For travelers who want Lucy to monitor, remember, organize, and explain their travel decisions across their personal dashboard.",
    monthlyPrice: 19,
    annualPrice: 15,
    badge: "Most popular",
    cta: "Start Pro",
    href: "/create-account",
    featured: true,
    features: [
      "Expanded route tracking",
      "Saved flights and watched routes",
      "Personal travel history",
      "Lucy memory and preferences",
      "Smarter alerts and timing signals",
      "Deeper dashboard intelligence",
    ],
  },
  {
    name: "Business",
    subtitle: "Advanced travel intelligence",
    description:
      "For high-volume travelers, teams, and business users who need stronger monitoring, deeper history, and priority intelligence.",
    monthlyPrice: 49,
    annualPrice: 39,
    badge: "Full access",
    cta: "Start Business",
    href: "/create-account",
    featured: false,
    features: [
      "Unlimited route monitoring",
      "Advanced saved travel history",
      "Priority alerts and signals",
      "Advanced Lucy intelligence",
      "Deeper Skysirv Live context",
      "Highest dashboard limits",
    ],
  },
]

const comparePlanRows = [
  {
    feature: "Open booking pathways",
    free: "full",
    pro: "full",
    business: "full",
  },
  {
    feature: "Dashboard access",
    free: "full",
    pro: "full",
    business: "full",
  },
  {
    feature: "Tracked routes",
    free: "limited",
    pro: "full",
    business: "full",
  },
  {
    feature: "Saved flights",
    free: "limited",
    pro: "full",
    business: "full",
  },
  {
    feature: "Travel history",
    free: "none",
    pro: "full",
    business: "full",
  },
  {
    feature: "Combined booking history",
    free: "none",
    pro: "full",
    business: "full",
  },
  {
    feature: "Lucy guidance",
    free: "none",
    pro: "full",
    business: "full",
  },
  {
    feature: "Lucy memory",
    free: "none",
    pro: "full",
    business: "full",
  },
  {
    feature: "Route monitoring",
    free: "none",
    pro: "limited",
    business: "full",
  },
  {
    feature: "Pricing signals",
    free: "none",
    pro: "limited",
    business: "full",
  },
  {
    feature: "Smart alerts",
    free: "none",
    pro: "limited",
    business: "full",
  },
  {
    feature: "Skysirv Live intelligence",
    free: "none",
    pro: "limited",
    business: "full",
  },
  {
    feature: "Advanced intelligence depth",
    free: "none",
    pro: "limited",
    business: "full",
  },
  {
    feature: "Highest dashboard limits",
    free: "none",
    pro: "limited",
    business: "full",
  },
] as const

export default function PricingLabPage() {
  const [billing, setBilling] = useState<Billing>("monthly")

  const billingNote = useMemo(() => {
    return billing === "monthly"
      ? "Billed monthly"
      : "Billed annually — estimated savings shown monthly"
  }, [billing])

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative isolate overflow-hidden bg-white px-6 pb-0 pt-32 sm:pb-0 sm:pt-40">
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-slate-800 sm:text-6xl lg:text-6xl">
              Choose how much travel intelligence Lucy unlocks.
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-700 sm:text-xl">
              Booking through Skysirv is free. Upgrade when you want Lucy to
              remember your travel style, monitor the routes that matter, organize
              your history, and give you deeper intelligence over time.
            </p>
          </motion.div>

          <div className="mx-auto mt-10 flex w-fit items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                billing === "monthly"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-950",
              )}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                billing === "annual"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-950",
              )}
            >
              Annual
            </button>
          </div>

          <p className="mt-3 text-center text-xs font-medium text-slate-500">
            {billingNote}
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {planCards.map((plan, index) => {
              const price =
                billing === "monthly" ? plan.monthlyPrice : plan.annualPrice

              return (
                <motion.article
                  key={plan.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.32,
                    ease: "easeOut",
                    delay: index * 0.04,
                  }}
                  className={cn(
                    "relative overflow-hidden rounded-[2rem] p-[3px] shadow-[0_22px_65px_rgba(15,23,42,0.08)]",
                    plan.featured
                      ? "border border-transparent"
                      : "border border-slate-200 bg-white",
                  )}
                >
                  {plan.featured && (
                    <>
                      <div
                        aria-hidden="true"
                        className="absolute inset-[-80%] animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_0deg,rgba(34,211,238,0.95)_35deg,rgba(59,130,246,0.95)_90deg,rgba(168,85,247,0.95)_145deg,rgba(236,72,153,0.95)_205deg,rgba(251,146,60,0.95)_265deg,rgba(34,197,94,0.95)_325deg,transparent_360deg)] opacity-90"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-blue-500/10 blur-2xl"
                      />
                    </>
                  )}

                  <div className="relative rounded-[calc(2rem-2px)] bg-white p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                          {plan.name}
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {plan.subtitle}
                        </p>
                      </div>

                      <span
                        className={cn(
                          "shrink-0 rounded-full px-3 py-1 text-xs font-bold",
                          plan.featured
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {plan.badge}
                      </span>
                    </div>

                    <p className="mt-5 min-h-[72px] text-sm leading-6 text-slate-600">
                      {plan.description}
                    </p>

                    <div className="mt-7 flex items-end gap-2">
                      <span className="text-5xl font-bold tracking-tight text-slate-950">
                        ${price}
                      </span>

                      <span className="pb-2 text-sm font-semibold text-slate-500">
                        {price === 0 ? "forever" : "/mo"}
                      </span>
                    </div>

                    <Link
                      href={plan.href}
                      className={cn(
                        "mt-7 inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-5 text-sm font-bold transition hover:-translate-y-0.5",
                        plan.featured
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
                      )}
                    >
                      {plan.cta}
                    </Link>

                    <div className="mt-7 space-y-3">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                        >
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                            ✓
                          </span>

                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <ComparePlansTable />

          <PricingFinalCTA />

          <PricingLabFooter />
        </div>
      </section>
    </main>
  )
}

function ComparePlansTable() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="mx-auto mt-20 max-w-6xl"
    >
      <div className="mb-8 text-center">
        <h2 className="mx-auto mt-3 max-w-4xl text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
          Compare dashboard intelligence across every plan.
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
          A simple view of how Skysirv expands from starter access to deeper monitoring, memory, alerts, and intelligence across each plan.
        </p>
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] border-b border-slate-200 px-2 py-4 text-sm font-bold text-slate-800">
          <div>Feature</div>
          <div className="text-center">Free</div>
          <div className="text-center">Pro</div>
          <div className="text-center">Business</div>
        </div>

        {comparePlanRows.map((row) => (
          <div
            key={row.feature}
            className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] border-b border-slate-200 px-2 py-4 text-sm"
          >
            <div className="font-semibold text-slate-700">
              {row.feature}
            </div>

            <CompareCell value={row.free} />
            <CompareCell value={row.pro} />
            <CompareCell value={row.business} />
          </div>
        ))}
      </div>

      <div className="divide-y divide-slate-200 md:hidden">
        {comparePlanRows.map((row) => (
          <div key={row.feature} className="py-5">
            <p className="text-sm font-bold text-slate-950">
              {row.feature}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MobileCompareRow plan="Free" value={row.free} />
              <MobileCompareRow plan="Pro" value={row.pro} />
              <MobileCompareRow plan="Business" value={row.business} />
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

function CompareCell({
  value,
  featured = false,
}: {
  value: "full" | "limited" | "none"
  featured?: boolean
}) {
  return (
    <div className="flex items-center justify-center">
      <CheckCircle value={value} featured={featured} />
    </div>
  )
}

function MobileCompareRow({
  plan,
  value,
  featured = false,
}: {
  plan: string
  value: "full" | "limited" | "none"
  featured?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <span className={cn("text-xs font-bold", featured ? "text-blue-700" : "text-slate-600")}>
        {plan}
      </span>

      <CheckCircle value={value} featured={featured} />
    </div>
  )
}

function CheckCircle({
  value,
  featured = false,
}: {
  value: "full" | "limited" | "none"
  featured?: boolean
}) {
  if (value === "none") {
    return (
      <span
        aria-label="Not included"
        className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-slate-100"
      />
    )
  }

  if (value === "limited") {
    return (
      <span
        aria-label="Limited"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-500"
      >
        ✓
      </span>
    )
  }

  if (value === "full") {
    return (
      <span
        aria-label="Limited"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[11px] font-bold text-white"
      >
        ✓
      </span>
    )
  }
}

function PricingFinalCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="mx-auto mt-20 max-w-6xl"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white px-6 py-12 text-center shadow-[0_24px_75px_rgba(15,23,42,0.08)] sm:px-10 sm:py-14">
        <div className="relative mx-auto max-w-3xl">
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            Start free. Upgrade when Skysirv becomes part of how you travel.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
            Booking pathways stay open. Paid plans unlock deeper dashboard history,
            route monitoring, Lucy memory, smarter alerts, and travel intelligence
            that grows with you.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/create-account"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Create account
            </Link>

            <Link
              href="/dev/homepage-lab"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function PricingLabFooter() {
  return (
    <footer className="mx-auto mt-16 max-w-6xl px-6 pb-16 pt-8 text-center md:text-left">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:justify-items-center md:text-center">
        <div className="flex max-w-xs flex-col justify-start text-center md:text-left">
          <Link
            href="/dev/homepage-lab"
            className="text-xl font-bold leading-none text-slate-800 transition hover:text-slate-700"
          >
            Skysirv
          </Link>

          <p className="mt-4 text-sm leading-6 text-slate-700">
            AI-powered travel intelligence that helps travelers compare trips,
            understand signals, and plan with more confidence.
          </p>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">
            Book
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li><Link href="/booking" className="transition hover:text-slate-400">Flights</Link></li>
            <li><Link href="/hotels" className="transition hover:text-slate-400">Hotels</Link></li>
            <li><Link href="/car-rentals" className="transition hover:text-slate-400">Car rentals</Link></li>
            <li><Link href="/cruises" className="transition hover:text-slate-400">Cruises</Link></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">
            Plan
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li><Link href="/itinerary" className="transition hover:text-slate-400">Generate itinerary</Link></li>
            <li><Link href="/travel-preferences" className="transition hover:text-slate-400">Travel preferences</Link></li>
            <li><Link href="/lucy-memory" className="transition hover:text-slate-400">Lucy memory</Link></li>
            <li><Link href="/trip-ideas" className="transition hover:text-slate-400">Trip ideas</Link></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">
            Company
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li><Link href="/skysirv-live" className="transition hover:text-slate-400">Skysirv Live</Link></li>
            <li><Link href="/dev/pricing-lab" className="transition hover:text-slate-400">Pricing</Link></li>
            <li><Link href="/about" className="transition hover:text-slate-400">About</Link></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">
            Legal
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li><Link href="/privacy" className="transition hover:text-slate-400">Privacy</Link></li>
            <li><Link href="/terms" className="transition hover:text-slate-400">Terms</Link></li>
            <li><Link href="/refund-policy" className="transition hover:text-slate-400">Refund Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 text-center">
        <p className="text-sm text-slate-800">
          &copy; {new Date().getFullYear()} Skysirv. All rights reserved.
        </p>
      </div>
    </footer>
  )
}