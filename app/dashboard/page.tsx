"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

function getDashboardRoute(planId: string) {
  const normalizedPlan = String(planId || "").trim().toLowerCase()

  if (
    normalizedPlan === "enterprise" ||
    normalizedPlan.startsWith("enterprise_") ||
    normalizedPlan.startsWith("enterprise-") ||
    normalizedPlan.includes("enterprise")
  ) {
    return "/dashboard/enterprise"
  }

  if (
    normalizedPlan === "pro" ||
    normalizedPlan.startsWith("pro_") ||
    normalizedPlan.startsWith("pro-") ||
    normalizedPlan.includes("pro")
  ) {
    return "/dashboard/pro"
  }

  return "/dashboard/free"
}

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function routeUserToDashboard() {
      const token = localStorage.getItem("skysirv_token")

      if (!token) {
        router.replace("/")
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          localStorage.removeItem("skysirv_token")
          router.replace("/")
          return
        }

        const data = await res.json().catch(() => null)

        if (cancelled) return

        const planId = String(data?.subscription?.plan_id ?? "")
        const dashboardRoute = getDashboardRoute(planId)

        router.replace(dashboardRoute)
      } catch (error) {
        console.error("Dashboard redirect failed", error)
        localStorage.removeItem("skysirv_token")
        router.replace("/")
      }
    }

    routeUserToDashboard()

    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_48%,#ffffff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-xl rounded-[2rem] border border-slate-200/80 bg-white/90 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 shadow-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="h-6 w-6 rounded-full border-2 border-sky-600 border-t-transparent"
            />
          </div>

          <div className="mt-6 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
            Dashboard Access Check
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Routing you to your dashboard
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            We’re verifying your active plan and sending you to the correct
            Skysirv dashboard experience.
          </p>
        </motion.div>
      </div>
    </section>
  )
}