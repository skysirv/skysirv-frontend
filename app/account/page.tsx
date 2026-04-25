"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "@/components/ui/Toasts/use-toast"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/utils/auth-storage"
import FeedbackModal from "@/components/feedback/FeedbackModal"

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

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)
  const [subscription, setSubscription] = useState<SessionSubscription | null>(null)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

  const [preferredAirports, setPreferredAirports] = useState("")
  const [preferredTravelTimes, setPreferredTravelTimes] = useState("")
  const [preferredLounges, setPreferredLounges] = useState("")

  useEffect(() => {
    async function loadSession() {
      try {
        const token = getAuthToken()

        if (!token) {
          setLoading(false)
          return
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data: SessionResponse = await res.json()

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load account data")
        }

        setSessionUser(data.user ?? null)
        setSubscription(data.subscription ?? null)
      } catch (error) {
        console.error("Failed to load account session:", error)

        toast({
          title: "Unable to load account",
          description: "We could not load your account details right now.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  const planLabel = useMemo(() => {
    const planId = subscription?.plan_id

    switch (planId) {
      case "pro_lifetime":
        return "Lifetime Pro"
      case "pro_monthly":
        return "Pro Monthly"
      case "pro_yearly":
        return "Pro Yearly"
      case "business_monthly":
        return "Business Monthly"
      case "business_yearly":
        return "Business Yearly"
      case "free":
      default:
        return "Free"
    }
  }, [subscription])

  const billingCycleLabel = useMemo(() => {
    if (!subscription) {
      return "—"
    }

    if (subscription.plan_id === "free") {
      return "Free plan"
    }

    if (subscription.plan_id === "pro_lifetime") {
      return "Lifetime access"
    }

    if (subscription.billing_interval) {
      const normalized = subscription.billing_interval.toLowerCase()

      if (normalized === "month" || normalized === "monthly") {
        return "Monthly"
      }

      if (normalized === "year" || normalized === "yearly" || normalized === "annual") {
        return "Yearly"
      }

      return subscription.billing_interval
    }

    if (subscription.plan_id.includes("monthly")) {
      return "Monthly"
    }

    if (subscription.plan_id.includes("yearly")) {
      return "Yearly"
    }

    return "Active"
  }, [subscription])

  const subscriptionActionLabel = useMemo(() => {
    const planId = subscription?.plan_id

    if (!planId || planId === "free") {
      return "Upgrade Plan"
    }

    if (planId === "pro_lifetime") {
      return "Upgrade to Business"
    }

    return "Manage Subscription"
  }, [subscription])

  const accountStatusLabel = useMemo(() => {
    if (!sessionUser) {
      return "Unavailable"
    }

    if (!sessionUser.is_verified) {
      return "Pending verification"
    }

    if (subscription?.status === "active") {
      return "Active"
    }

    return "Active"
  }, [sessionUser, subscription])

  const memberSinceLabel = useMemo(() => {
    if (!sessionUser?.created_at) {
      return "—"
    }

    return new Date(sessionUser.created_at).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }, [sessionUser])

  const nextBillingDateLabel = useMemo(() => {
    if (
      !subscription ||
      subscription.plan_id === "free" ||
      subscription.plan_id === "pro_lifetime" ||
      !subscription.current_period_end
    ) {
      return "—"
    }

    return new Date(subscription.current_period_end).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }, [subscription])

  function handleSavePreferences() {
    toast({
      title: "Preferences saved",
      description: "Your travel preferences have been updated."
    })
  }

  function handleManageSubscription() {
    const planId = subscription?.plan_id

    if (!planId || planId === "free") {
      router.push("/choose-plan?mode=upgrade")
      return
    }

    if (planId === "pro_lifetime") {
      router.push("/choose-plan?mode=upgrade&target=business")
      return
    }

    if (planId === "pro_monthly" || planId === "pro_yearly") {
      router.push("/choose-plan?mode=upgrade")
      return
    }

    toast({
      title: "Coming soon",
      description: "Stripe Customer Portal will be connected here soon."
    })
  }

  function handleChangePassword() {
    toast({
      title: "Coming soon",
      description: "Password change flow will be added here next."
    })
  }

  function handleDeleteAccount() {
    toast({
      title: "Action blocked",
      description: "Account deletion is not available during beta.",
      variant: "destructive"
    })
  }

  function handleSubmitFeedback(payload: { rating: number; message: string }) {
    console.log("Feedback submitted:", payload)

    toast({
      title: "Feedback received",
      description: "Thank you for helping improve Skysirv.",
    })
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Account Settings
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Manage your Skysirv account, subscription, preferences, and security from one place.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
            <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
            <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
            <div className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Feedback */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Share Feedback
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Tell us what is working, what feels confusing, or what would make Skysirv better.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(true)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Give Feedback
                </button>
              </div>
            </section>

            {/* Account */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Account
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Your core account information.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Email
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900 break-all">
                    {sessionUser?.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Member since
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {memberSinceLabel}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Account status
                  </p>
                  <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    {accountStatusLabel}
                  </p>
                </div>
              </div>
            </section>

            {/* Subscription */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Subscription
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Your current plan and billing details.
                  </p>
                </div>

                <button
                  onClick={handleManageSubscription}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {subscriptionActionLabel}
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Current plan
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {planLabel}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Billing cycle
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {billingCycleLabel}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Next billing date
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {nextBillingDateLabel}
                  </p>
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Preferences
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Personalize Skysirv intelligence around how you like to travel.
                </p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Preferred airports
                  </label>
                  <input
                    type="text"
                    value={preferredAirports}
                    onChange={(e) => setPreferredAirports(e.target.value)}
                    placeholder="Example: BOS, MIA, MAD"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Preferred travel times
                  </label>
                  <input
                    type="text"
                    value={preferredTravelTimes}
                    onChange={(e) => setPreferredTravelTimes(e.target.value)}
                    placeholder="Example: Early morning, overnight, weekends"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Preferred airport lounges
                  </label>
                  <input
                    type="text"
                    value={preferredLounges}
                    onChange={(e) => setPreferredLounges(e.target.value)}
                    placeholder="Example: Centurion Lounge, Delta Sky Club"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSavePreferences}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Security
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Password and account protection controls.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleChangePassword}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                >
                  Change Password
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
      <FeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleSubmitFeedback}
      />
    </main>
  )
}