"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "@/components/ui/Toasts/use-toast"
import { useRouter } from "next/navigation"
import { clearAuthSession, getAuthToken } from "@/utils/auth-storage"
import FeedbackModal from "@/components/feedback/FeedbackModal"
import LargeChevron from "@/components/ui/LargeChevron"

type SessionUser = {
  id: string
  email: string
  is_admin: boolean
  is_verified: boolean
  created_at: string
  first_name?: string | null
  last_name?: string | null
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
  cancel_at_period_end?: boolean
  cancel_at?: string | null
  canceled_at?: string | null
}

type SessionResponse = {
  user?: SessionUser
  subscription?: SessionSubscription
  error?: string
}

type BillingPortalResponse = {
  url?: string
  error?: string
}

type SmsPreferences = {
  id: string | null
  userId: string | null
  phoneNumber: string | null
  phoneVerified: boolean
  smsEnabled: boolean
  priceAlertsEnabled: boolean
  watchlistAlertsEnabled: boolean
  systemAlertsEnabled: boolean
  smsOptedInAt: string | null
  smsOptedOutAt: string | null
  phoneVerifiedAt: string | null
  lastSmsSentAt: string | null
  optOutReason: string | null
  createdAt: string | null
  updatedAt: string | null
}

type SmsPreferencesResponse = {
  success?: boolean
  smsPreferences?: SmsPreferences
  error?: string
}

const RECURRING_PAID_PLAN_IDS = [
  "pro_monthly",
  "pro_yearly",
  "business_monthly",
  "business_yearly",
]

function isValidE164PhoneNumber(phoneNumber: string) {
  return /^\+[1-9]\d{7,14}$/.test(phoneNumber.trim())
}

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)
  const [subscription, setSubscription] = useState<SessionSubscription | null>(null)
  const [smsPreferences, setSmsPreferences] = useState<SmsPreferences | null>(null)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

  const [accountEditOpen, setAccountEditOpen] = useState(false)
  const [accountEditLoading, setAccountEditLoading] = useState(false)
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")
  const [editPhoneNumber, setEditPhoneNumber] = useState("")
  const [editSmsEnabled, setEditSmsEnabled] = useState(false)
  const [editPriceAlertsEnabled, setEditPriceAlertsEnabled] = useState(false)
  const [editWatchlistAlertsEnabled, setEditWatchlistAlertsEnabled] = useState(false)
  const [editSystemAlertsEnabled, setEditSystemAlertsEnabled] = useState(false)

  const [subscriptionActionLoading, setSubscriptionActionLoading] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false)

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

        const smsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-preferences/sms`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const smsData: SmsPreferencesResponse = await smsRes.json().catch(() => ({}))

        if (smsRes.ok && smsData.smsPreferences) {
          setSmsPreferences(smsData.smsPreferences)
        }
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

  const isRecurringPaidPlan = useMemo(() => {
    const planId = subscription?.plan_id

    if (!planId) {
      return false
    }

    return RECURRING_PAID_PLAN_IDS.includes(planId)
  }, [subscription])

  const hasStripeManagedSubscription = useMemo(() => {
    return Boolean(isRecurringPaidPlan && subscription?.stripe_subscription_id)
  }, [isRecurringPaidPlan, subscription])

  const subscriptionActionLabel = useMemo(() => {
    const planId = subscription?.plan_id

    if (subscriptionActionLoading) {
      return "Opening..."
    }

    if (!planId || planId === "free") {
      return "Upgrade Plan"
    }

    if (planId === "pro_lifetime") {
      return "Upgrade to Business"
    }

    return "Manage Subscription"
  }, [subscription, subscriptionActionLoading])

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

  const dashboardHref = useMemo(() => {
    const planId = subscription?.plan_id

    if (planId === "business_monthly" || planId === "business_yearly") {
      return "/dashboard/business"
    }

    if (
      planId === "pro_monthly" ||
      planId === "pro_yearly" ||
      planId === "pro_lifetime"
    ) {
      return "/dashboard/pro"
    }

    return "/dashboard/free"
  }, [subscription])

  const smsStatusLabel = useMemo(() => {
    if (!smsPreferences) {
      return "Not configured"
    }

    if (smsPreferences.smsEnabled) {
      return "Enabled"
    }

    return "Off"
  }, [smsPreferences])

  const phoneNumberLabel = useMemo(() => {
    return smsPreferences?.phoneNumber || "Not added"
  }, [smsPreferences])

  const accountNameLabel = useMemo(() => {
    const fullName = [sessionUser?.first_name, sessionUser?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim()

    return fullName || "Not added"
  }, [sessionUser])

  function openAccountEditModal() {
    setEditFirstName(sessionUser?.first_name ?? "")
    setEditLastName(sessionUser?.last_name ?? "")
    setEditPhoneNumber(smsPreferences?.phoneNumber ?? "")
    setEditSmsEnabled(Boolean(smsPreferences?.smsEnabled))
    setEditPriceAlertsEnabled(Boolean(smsPreferences?.priceAlertsEnabled))
    setEditWatchlistAlertsEnabled(Boolean(smsPreferences?.watchlistAlertsEnabled))
    setEditSystemAlertsEnabled(Boolean(smsPreferences?.systemAlertsEnabled))
    setAccountEditOpen(true)
  }

  function handleSavePreferences() {
    toast({
      title: "Preferences saved",
      description: "Your travel preferences have been updated."
    })
  }

  async function handleSaveAccountEdit() {
    try {
      setAccountEditLoading(true)

      const token = getAuthToken()

      if (!token) {
        throw new Error("You must be signed in to update account settings.")
      }

      const cleanedFirstName = editFirstName.trim().replace(/\s+/g, " ")
      const cleanedLastName = editLastName.trim().replace(/\s+/g, " ")
      const cleanedPhoneNumber = editPhoneNumber.trim()

      if (cleanedPhoneNumber && !isValidE164PhoneNumber(cleanedPhoneNumber)) {
        toast({
          title: "Invalid phone number",
          description: "Use international format, for example +15551234567.",
          variant: "destructive",
        })
        return
      }

      const wantsAnySms =
        editSmsEnabled ||
        editPriceAlertsEnabled ||
        editWatchlistAlertsEnabled ||
        editSystemAlertsEnabled

      if (wantsAnySms && !cleanedPhoneNumber && !smsPreferences?.phoneNumber) {
        toast({
          title: "Phone number required",
          description: "Add a phone number before turning on SMS alerts.",
          variant: "destructive",
        })
        return
      }

      const nameChanged =
        cleanedFirstName !== (sessionUser?.first_name ?? "") ||
        cleanedLastName !== (sessionUser?.last_name ?? "")

      if (nameChanged) {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-preferences/profile-name`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: cleanedFirstName,
            lastName: cleanedLastName || undefined,
          }),
        })

        const profileData = await profileRes.json().catch(() => null)

        if (!profileRes.ok) {
          throw new Error(profileData?.error || "Unable to update your name.")
        }

        setSessionUser((current) =>
          current
            ? {
              ...current,
              first_name: profileData?.user?.first_name ?? cleanedFirstName,
              last_name: profileData?.user?.last_name ?? (cleanedLastName || null),
            }
            : current
        )
      }

      const smsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-preferences/sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber: cleanedPhoneNumber || undefined,
          smsEnabled: editSmsEnabled,
          priceAlertsEnabled: editSmsEnabled ? editPriceAlertsEnabled : false,
          watchlistAlertsEnabled: editSmsEnabled ? editWatchlistAlertsEnabled : false,
          systemAlertsEnabled: editSmsEnabled ? editSystemAlertsEnabled : false,
        }),
      })

      const smsData: SmsPreferencesResponse = await smsRes.json().catch(() => ({}))

      if (!smsRes.ok || !smsData.smsPreferences) {
        throw new Error(smsData?.error || "Unable to update SMS preferences.")
      }

      setSmsPreferences(smsData.smsPreferences)

      toast({
        title: "Account updated",
        description: "Your account details and SMS preferences have been saved.",
      })

      setAccountEditOpen(false)
    } catch (error: any) {
      toast({
        title: "Unable to update account",
        description: error?.message || "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setAccountEditLoading(false)
    }
  }

  async function handleManageSubscription() {
    const planId = subscription?.plan_id

    if (!planId || planId === "free") {
      router.push("/choose-plan?mode=upgrade")
      return
    }

    if (planId === "pro_lifetime") {
      router.push("/choose-plan?mode=upgrade&target=business")
      return
    }

    if (!hasStripeManagedSubscription) {
      toast({
        title: "Subscription details unavailable",
        description: "We could not find a Stripe subscription for this account yet.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubscriptionActionLoading(true)

      const token = getAuthToken()

      if (!token) {
        throw new Error("You must be signed in to manage your subscription.")
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/billing/portal-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/account`,
        }),
      })

      const data: BillingPortalResponse = await res.json().catch(() => ({}))

      if (!res.ok || !data.url) {
        throw new Error(data?.error || "Unable to open subscription management.")
      }

      window.location.href = data.url
    } catch (error: any) {
      toast({
        title: "Unable to open billing portal",
        description: error?.message || "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setSubscriptionActionLoading(false)
    }
  }

  function handleChangePassword() {
    toast({
      title: "Password updates are not available yet",
      description: "Password change flow will be added here next."
    })
  }

  function handleDeleteAccount() {
    setDeleteConfirmOpen(true)
  }

  async function handleConfirmDeleteAccount() {
    try {
      setDeleteAccountLoading(true)

      const token = getAuthToken()

      if (!token) {
        throw new Error("You must be signed in to delete your account.")
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Unable to delete account.")
      }

      clearAuthSession()

      toast({
        title: "Account deleted",
        description: "Your Skysirv account has been deleted.",
      })

      router.push("/")
    } catch (error: any) {
      toast({
        title: "Unable to delete account",
        description: error?.message || "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setDeleteAccountLoading(false)
    }
  }

  async function handleSubmitFeedback(payload: { rating: number; message: string }) {
    try {
      const token = getAuthToken()

      if (!token) {
        throw new Error("You must be signed in to submit feedback.")
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Unable to submit feedback")
      }

      toast({
        title: "Feedback received",
        description: "Thank you for helping improve Skysirv.",
      })
    } catch (error: any) {
      toast({
        title: "Feedback not sent",
        description: error?.message || "Please try again in a moment.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => {
              console.log("Back to Dashboard clicked:", dashboardHref)
              window.location.href = dashboardHref
            }}
            className="relative top-6 inline-flex text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <>
              <LargeChevron direction="left" />
              Back to Dashboard
            </>
          </button>
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
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Account
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Your core account information and SMS alert settings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAccountEditModal}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Edit Account
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Name
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {accountNameLabel}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Email
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-900">
                    {sessionUser?.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Phone
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {phoneNumberLabel}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    SMS alerts
                  </p>
                  <p
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${smsPreferences?.smsEnabled
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {smsStatusLabel}
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
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
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
                  type="button"
                  onClick={handleManageSubscription}
                  disabled={subscriptionActionLoading}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                    {subscription?.cancel_at || subscription?.cancel_at_period_end
                      ? "Access ends"
                      : "Next billing date"}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {nextBillingDateLabel}
                  </p>
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
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
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
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

      {accountEditOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="max-h-[90dvh] overflow-y-auto px-6 py-6 pr-5 [scrollbar-color:rgba(100,116,139,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/70 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400/80">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Edit account
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Update your name, phone number, and SMS alert preferences.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAccountEditOpen(false)}
                  aria-label="Close edit account modal"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-light leading-none text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    First name
                  </label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(event) => setEditFirstName(event.target.value)}
                    placeholder="Example: John"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Last name <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(event) => setEditLastName(event.target.value)}
                    placeholder="Example: Smith"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    SMS phone number
                  </label>
                  <input
                    type="tel"
                    value={editPhoneNumber}
                    onChange={(event) => setEditPhoneNumber(event.target.value)}
                    placeholder="+15551234567"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Use international format. For US numbers, include +1 before the number.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <SmsToggle
                    checked={editSmsEnabled}
                    onChange={(checked) => {
                      setEditSmsEnabled(checked)

                      if (!checked) {
                        setEditPriceAlertsEnabled(false)
                        setEditWatchlistAlertsEnabled(false)
                        setEditSystemAlertsEnabled(false)
                      }

                      if (
                        checked &&
                        !editPriceAlertsEnabled &&
                        !editWatchlistAlertsEnabled &&
                        !editSystemAlertsEnabled
                      ) {
                        setEditPriceAlertsEnabled(true)
                        setEditWatchlistAlertsEnabled(true)
                        setEditSystemAlertsEnabled(true)
                      }
                    }}
                    title="Receive SMS alerts"
                    description="Turn this off to opt out of Skysirv SMS alerts."
                  />

                  <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4">
                    <SmsToggle
                      checked={editPriceAlertsEnabled}
                      disabled={!editSmsEnabled}
                      onChange={setEditPriceAlertsEnabled}
                      title="Price movement alerts"
                      description="Get notified when tracked routes show meaningful fare movement."
                    />

                    <SmsToggle
                      checked={editWatchlistAlertsEnabled}
                      disabled={!editSmsEnabled}
                      onChange={setEditWatchlistAlertsEnabled}
                      title="Watchlist and route tracking alerts"
                      description="Receive updates tied to your monitored routes and tracking activity."
                    />

                    <SmsToggle
                      checked={editSystemAlertsEnabled}
                      disabled={!editSmsEnabled}
                      onChange={setEditSystemAlertsEnabled}
                      title="Saved flight updates"
                      description="Get updates related to saved flights and important saved-flight changes."
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-xs leading-5 text-sky-800">
                  SMS preferences are saved now. Live phone verification and real SMS alert sending will be enabled after the Twilio production setup is complete.
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setAccountEditOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveAccountEdit}
                  disabled={accountEditLoading}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {accountEditLoading ? "Saving..." : "Save account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {deleteConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-slate-900">
              Delete account?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              This will remove your Skysirv account access. This action should only be used if you want to permanently leave Skysirv.
            </p>

            {hasStripeManagedSubscription ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                You currently have a paid Stripe-managed subscription. Please use Manage Subscription to cancel billing before deleting your account.
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Keep Account
              </button>

              {hasStripeManagedSubscription ? (
                <button
                  type="button"
                  onClick={handleManageSubscription}
                  disabled={subscriptionActionLoading}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {subscriptionActionLoading ? "Opening..." : "Manage Subscription"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmDeleteAccount}
                  disabled={deleteAccountLoading}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteAccountLoading ? "Deleting..." : "Delete Account"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <FeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleSubmitFeedback}
      />
    </main>
  )
}

function SmsToggle({
  checked,
  disabled,
  onChange,
  title,
  description,
}: {
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl px-1 py-1 text-left transition disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span>
        <span className="block text-sm font-semibold text-slate-900">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-600">
          {description}
        </span>
      </span>

      <span
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${checked ? "bg-slate-950" : "bg-slate-300"
          }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </span>
    </button>
  )
}