"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type UserPlan = "free" | "pro" | "business"

function normalizePlan(planId: string): UserPlan {
  const normalized = String(planId || "").trim().toLowerCase()

  if (
    normalized === "business" ||
    normalized.startsWith("business_") ||
    normalized.startsWith("business-") ||
    normalized.includes("business")
  ) {
    return "business"
  }

  if (
    normalized === "pro" ||
    normalized.startsWith("pro_") ||
    normalized.startsWith("pro-") ||
    normalized.includes("pro")
  ) {
    return "pro"
  }

  return "free"
}

function getDashboardPath(plan: UserPlan) {
  switch (plan) {
    case "pro":
      return "/dashboard/pro"
    case "business":
      return "/dashboard/business"
    case "free":
    default:
      return "/dashboard/free"
  }
}

export default function WelcomePage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<UserPlan>("free")
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    async function fetchSessionWithRetry(token: string) {
      const MAX_ATTEMPTS = 5

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL!}/auth/session`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error(data?.error || "Unable to load subscription")
        }

        const planId = data?.subscription?.plan_id

        // 🔥 If we see a paid plan, stop immediately
        if (planId && planId !== "free") {
          return normalizePlan(planId)
        }

        // If still free, wait and retry
        if (attempt < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, 1200))
        }
      }

      // fallback (after retries)
      return "free"
    }

    async function loadPlan() {
      const token = localStorage.getItem("skysirv_token")

      if (!token) {
        router.push("/signin")
        return
      }

      try {
        setLoading(true)
        setError("")

        const resolvedPlan = await fetchSessionWithRetry(token)

        if (!isMounted) return

        setPlan(resolvedPlan)
      } catch (err: any) {
        if (!isMounted) return
        setError(err?.message || "Unable to determine your dashboard access")
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }

    loadPlan()

    return () => {
      isMounted = false
    }
  }, [router])

  function handleContinue() {
    router.push(getDashboardPath(plan))
  }

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-white px-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-md transition-shadow hover:shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">
          Welcome to Skysirv
        </h1>

        <p className="mt-4 text-slate-600">
          {loading
            ? "Finalizing your subscription and preparing your dashboard..."
            : error
              ? "We ran into a problem while checking your plan."
              : "Your flight intelligence dashboard is ready."}
        </p>

        {!loading && !error && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Active Plan
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {plan === "free"
                ? "Free"
                : plan === "pro"
                  ? "Pro"
                  : "Business"}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={loading || !!error}
          className="mt-8 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Loading..." : "Go to Dashboard"}
        </button>
      </div>
    </section>
  )
}