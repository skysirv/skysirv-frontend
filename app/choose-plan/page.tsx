"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { getAuthToken, setAuthToken } from "@/utils/auth-storage"

type Billing = "monthly" | "annual"

type PlanId = "free" | "pro" | "business"

type SessionUser = {
  id: string
  email: string
  is_admin: boolean
  is_verified: boolean
  created_at: string
}

type SessionSubscription = {
  id: string | null
  user_id: string
  plan_id: string
  status: string
  billing_interval: string | null
  stripe_subscription_id: string | null
  current_period_end: string | null
  created_at: string | null
}

type SessionResponse = {
  user?: SessionUser
  subscription?: SessionSubscription
  error?: string
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function normalizePlanTier(planId?: string | null): "free" | "pro" | "business" | null {
  if (!planId) return null

  if (planId === "free") return "free"

  if (
    planId === "pro" ||
    planId === "pro_lifetime" ||
    planId === "pro_monthly" ||
    planId === "pro_yearly"
  ) {
    return "pro"
  }

  if (
    planId === "business" ||
    planId === "business_monthly" ||
    planId === "business_yearly" ||
    planId === "enterprise" ||
    planId === "enterprise_monthly" ||
    planId === "enterprise_yearly"
  ) {
    return "business"
  }

  return null
}

export default function ChoosePlanPage() {
  return (
    <Suspense fallback={<ChoosePlanPageSkeleton />}>
      <ChoosePlanPageContent />
    </Suspense>
  )
}

function ChoosePlanPageContent() {
  const [billing, setBilling] = useState<Billing>("monthly")
  const [loading, setLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [error, setError] = useState("")
  const [sessionSubscription, setSessionSubscription] =
    useState<SessionSubscription | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  const pageMode = searchParams.get("mode")
  const target = searchParams.get("target")

  const isUpgradeMode = pageMode === "upgrade"
  const currentPlanTier = normalizePlanTier(sessionSubscription?.plan_id)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get("token")

    if (!tokenFromUrl) return

    setAuthToken(tokenFromUrl)

    params.delete("token")
    const nextQuery = params.toString()
    const cleanUrl = nextQuery ? `/choose-plan?${nextQuery}` : "/choose-plan"

    router.replace(cleanUrl)
  }, [router])

  useEffect(() => {
    async function loadSession() {
      const token = getAuthToken()

      if (!token) {
        setSessionLoading(false)
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data: SessionResponse = await res.json().catch(() => ({}))

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load session")
        }

        setSessionSubscription(data.subscription ?? null)

        const normalizedPlan = normalizePlanTier(data.subscription?.plan_id)

        if (normalizedPlan === "free") {
          router.replace("/dashboard/free")
          return
        }

        if (normalizedPlan === "pro") {
          router.replace("/dashboard/pro")
          return
        }

        if (normalizedPlan === "business") {
          router.replace("/dashboard/business")
          return
        }
      } catch (err) {
        console.error("Failed to load choose-plan session:", err)
      } finally {
        setSessionLoading(false)
      }
    }

    loadSession()
  }, [router])

  async function handlePlanSelection(plan: PlanId) {
    const token = getAuthToken()

    if (!token) {
      router.push("/signin")
      return
    }

    if (isUpgradeMode) {
      if (plan === currentPlanTier) return

      if (currentPlanTier === "pro" && plan === "free") return

      if (currentPlanTier === "business" && (plan === "free" || plan === "pro")) {
        return
      }

      if (sessionSubscription?.plan_id === "pro_lifetime" && plan !== "business") {
        return
      }

      if (target === "business" && plan !== "business") {
        return
      }
    }

    setLoading(true)
    setError("")

    try {
      if (plan === "free") {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscriptions/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              plan: "free",
            }),
          },
        )

        const data = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error(data?.error || "Free plan creation failed")
        }

        router.push("/dashboard/free?welcome=1")
        return
      }

      if (plan === "pro" || plan === "business") {
        const billingType = billing === "monthly" ? "monthly" : "yearly"

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/billing/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              plan,
              billing: billingType,
            }),
          },
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

  const billingNote = useMemo(() => {
    return billing === "monthly"
      ? "Billed monthly"
      : "Billed annually — estimated savings shown monthly"
  }, [billing])

  const prices = useMemo(() => {
    const monthly = { free: 0, pro: 19, business: 49 }
    const annual = { free: 0, pro: 15, business: 39 }

    return billing === "monthly" ? monthly : annual
  }, [billing])

  const heroTitle = isUpgradeMode
    ? "Upgrade your Skysirv travel intelligence."
    : "Choose your Skysirv plan."

  const heroCopy = isUpgradeMode
    ? "Choose the next level of Skysirv access for your current account."
    : "Start free, or unlock deeper dashboard history, route monitoring, Lucy memory, smarter alerts, and travel intelligence that grows with you."

  const freeCardState = getPlanCardState({
    plan: "free",
    currentPlanTier,
    currentPlanId: sessionSubscription?.plan_id ?? null,
    isUpgradeMode,
    target,
    sessionLoading,
  })

  const proCardState = getPlanCardState({
    plan: "pro",
    currentPlanTier,
    currentPlanId: sessionSubscription?.plan_id ?? null,
    isUpgradeMode,
    target,
    sessionLoading,
  })

  const businessCardState = getPlanCardState({
    plan: "business",
    currentPlanTier,
    currentPlanId: sessionSubscription?.plan_id ?? null,
    isUpgradeMode,
    target,
    sessionLoading,
  })

  const planCards = [
    {
      planId: "free" as const,
      name: "Free",
      subtitle: "Start your Skysirv account",
      description:
        "Create a basic travel profile, explore Skysirv, and start using limited dashboard tools without needing a paid plan.",
      price: prices.free,
      badge: freeCardState.badge ?? "Start here",
      ctaLabel: freeCardState.ctaLabel,
      disabled: freeCardState.disabled,
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
      planId: "pro" as const,
      name: "Pro",
      subtitle: "Personal travel command center",
      description:
        "For travelers who want Lucy to monitor, remember, organize, and explain their travel decisions across their personal dashboard.",
      price: prices.pro,
      badge: proCardState.badge ?? "Most popular",
      ctaLabel: proCardState.ctaLabel,
      disabled: proCardState.disabled,
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
      planId: "business" as const,
      name: "Business",
      subtitle: "Advanced travel intelligence",
      description:
        "For high-volume travelers, teams, and business users who need stronger monitoring, deeper history, and priority intelligence.",
      price: prices.business,
      badge: businessCardState.badge ?? "Full access",
      ctaLabel: businessCardState.ctaLabel,
      disabled: businessCardState.disabled,
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

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative isolate overflow-hidden bg-white px-6 pb-16 pt-32 sm:pt-40">
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-slate-800 sm:text-6xl lg:text-6xl">
              {heroTitle}
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-700 sm:text-xl">
              {heroCopy}
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

          {error && (
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {planCards.map((plan, index) => (
              <TierCard
                key={plan.name}
                plan={plan}
                index={index}
                billing={billing}
                loading={loading}
                onSelect={handlePlanSelection}
              />
            ))}
          </div>

          <ComparePlansTable />
        </div>
      </section>
    </main>
  )
}

function ChoosePlanPageSkeleton() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative bg-white px-6 pb-16 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mx-auto h-16 max-w-3xl rounded-2xl bg-slate-100" />
          <div className="mx-auto mt-6 h-8 max-w-2xl rounded-2xl bg-slate-100" />

          <div className="mx-auto mt-10 h-12 w-56 rounded-full bg-slate-100" />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="h-[520px] rounded-[2rem] border border-slate-200 bg-slate-50" />
            <div className="h-[520px] rounded-[2rem] border border-slate-200 bg-slate-50" />
            <div className="h-[520px] rounded-[2rem] border border-slate-200 bg-slate-50" />
          </div>
        </div>
      </section>
    </main>
  )
}

function getPlanCardState(args: {
  plan: PlanId
  currentPlanTier: "free" | "pro" | "business" | null
  currentPlanId: string | null
  isUpgradeMode: boolean
  target: string | null
  sessionLoading: boolean
}) {
  const { plan, currentPlanTier, currentPlanId, isUpgradeMode, target, sessionLoading } = args

  if (sessionLoading && isUpgradeMode) {
    return {
      disabled: true,
      ctaLabel: "Loading...",
      badge: undefined as string | undefined,
    }
  }

  if (!isUpgradeMode) {
    if (plan === "pro") {
      return {
        disabled: false,
        ctaLabel: "Start Pro",
        badge: "Most popular",
      }
    }

    if (plan === "business") {
      return {
        disabled: false,
        ctaLabel: "Start Business",
        badge: "Full access",
      }
    }

    return {
      disabled: false,
      ctaLabel: "Start Free",
      badge: "Start here",
    }
  }

  if (plan === currentPlanTier) {
    if (plan === "pro" && currentPlanId === "pro_lifetime") {
      return {
        disabled: true,
        ctaLabel: "Current Plan",
        badge: "Lifetime Pro",
      }
    }

    return {
      disabled: true,
      ctaLabel: "Current Plan",
      badge: "Current Plan",
    }
  }

  if (currentPlanTier === "pro" && plan === "free") {
    return {
      disabled: true,
      ctaLabel: "Unavailable",
      badge: undefined,
    }
  }

  if (currentPlanTier === "business" && (plan === "free" || plan === "pro")) {
    return {
      disabled: true,
      ctaLabel: "Unavailable",
      badge: undefined,
    }
  }

  if (currentPlanId === "pro_lifetime") {
    if (plan === "business") {
      return {
        disabled: false,
        ctaLabel: "Upgrade to Business",
        badge: "Eligible upgrade",
      }
    }

    return {
      disabled: true,
      ctaLabel: "Unavailable",
      badge: undefined,
    }
  }

  if (target === "business" && plan !== "business") {
    return {
      disabled: true,
      ctaLabel: "Unavailable",
      badge: undefined,
    }
  }

  if (plan === "pro") {
    return {
      disabled: false,
      ctaLabel: "Upgrade to Pro",
      badge: "Most popular",
    }
  }

  if (plan === "business") {
    return {
      disabled: false,
      ctaLabel: "Upgrade to Business",
      badge: "Best value",
    }
  }

  return {
    disabled: false,
    ctaLabel: "Start Free",
    badge: "Start here",
  }
}

function TierCard({
  plan,
  index,
  billing,
  loading,
  onSelect,
}: {
  plan: {
    planId: PlanId
    name: string
    subtitle: string
    description: string
    price: number
    badge: string
    ctaLabel: string
    disabled: boolean
    featured: boolean
    features: string[]
  }
  index: number
  billing: Billing
  loading: boolean
  onSelect: (plan: PlanId) => void
}) {
  return (
    <motion.article
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
        plan.disabled && "opacity-70",
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
            ${plan.price}
          </span>

          <span className="pb-2 text-sm font-semibold text-slate-500">
            {plan.price === 0 ? "forever" : "/mo"}
          </span>
        </div>

        <p
          className={cn(
            "mt-2 min-h-[16px] text-xs font-medium text-slate-500",
            plan.price === 0 && "invisible",
          )}
        >
          {plan.price === 0
            ? "Always free"
            : billing === "annual"
              ? "Billed annually"
              : "Billed monthly"}
        </p>

        <button
          type="button"
          disabled={loading || plan.disabled}
          onClick={() => onSelect(plan.planId)}
          className={cn(
            "mt-7 inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-5 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
            plan.featured
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
          )}
        >
          {loading && !plan.disabled ? "Please wait..." : plan.ctaLabel}
        </button>

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
}

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
          A simple view of how Skysirv expands from starter access to deeper
          monitoring, memory, alerts, and intelligence across each plan.
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
}: {
  value: "full" | "limited" | "none"
}) {
  return (
    <div className="flex items-center justify-center">
      <CheckCircle value={value} />
    </div>
  )
}

function MobileCompareRow({
  plan,
  value,
}: {
  plan: string
  value: "full" | "limited" | "none"
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <span className="text-xs font-bold text-slate-600">
        {plan}
      </span>

      <CheckCircle value={value} />
    </div>
  )
}

function CheckCircle({
  value,
}: {
  value: "full" | "limited" | "none"
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

  return (
    <span
      aria-label="Included"
      className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[11px] font-bold text-white"
    >
      ✓
    </span>
  )
}