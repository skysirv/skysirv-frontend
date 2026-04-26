"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/utils/auth-storage"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type AdminUser = {
  id: string
  email: string
  plan: string
  billing_interval?: string | null
  status: string
  createdAt?: string | null
}

type ActivityEvent = {
  id?: string
  time: string
  message: string
}

type BetaApplication = {
  id: string
  full_name: string
  email: string
  travel_frequency: string
  booking_method: string
  reason: string
  status: string
  created_at: string
}

type UserFeedback = {
  id: string
  userId: string | null
  email: string | null
  rating: number
  message: string
  status: string
  adminResponse: string | null
  respondedAt: string | null
  usedAsTestimonial: boolean
  testimonialApprovedAt: string | null
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [activity, setActivity] = useState<ActivityEvent[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [telemetry, setTelemetry] = useState<any>(null)
  const [activityLoaded, setActivityLoaded] = useState(false)
  const [betaApplications, setBetaApplications] = useState<BetaApplication[]>([])
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([])
  const [betaReviewModalOpen, setBetaReviewModalOpen] = useState(false)
  const [selectedBetaApplication, setSelectedBetaApplication] = useState<BetaApplication | null>(null)
  const [feedbackResponseModalOpen, setFeedbackResponseModalOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<UserFeedback | null>(null)
  const [feedbackResponseMessage, setFeedbackResponseMessage] = useState("")
  const [feedbackResponseSending, setFeedbackResponseSending] = useState(false)

  const adminUsers = useMemo(
    () => users.filter((user) => user.plan === "admin"),
    [users]
  )

  const platformUsers = useMemo(
    () => users.filter((user) => user.plan !== "admin"),
    [users]
  )

  function formatPlanLabel(user: AdminUser) {
    if (user.plan === "admin") return "Admin"
    if (user.plan === "free") return "Free"

    if (user.plan === "pro") {
      if (user.billing_interval === "monthly") return "Pro — Monthly"
      if (user.billing_interval === "yearly") return "Pro — Yearly"
      return "Pro"
    }

    if (user.plan === "business") {
      if (user.billing_interval === "monthly") return "Business — Monthly"
      if (user.billing_interval === "yearly") return "Business — Yearly"
      return "Business"
    }

    return user.plan
  }

  function getPlanBadgeClasses(plan: string) {
    if (plan === "admin") {
      return "bg-purple-100 text-purple-700"
    }

    if (plan === "pro") {
      return "bg-blue-100 text-blue-700"
    }

    if (plan === "business") {
      return "bg-indigo-100 text-indigo-700"
    }

    return "bg-slate-100 text-slate-700"
  }

  function getBetaStatusBadgeClasses(status: string) {
    if (status === "approved") {
      return "bg-green-100 text-green-700"
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700"
    }

    return "bg-amber-100 text-amber-700"
  }

  async function deleteUser(userId: string) {
    const token = getAuthToken()

    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } else {
      alert("Failed to delete user")
    }
  }

  async function sendFeedbackResponse() {
    if (!selectedFeedback || !feedbackResponseMessage.trim()) return

    const token = getAuthToken()

    if (!token) {
      alert("Missing admin session")
      return
    }

    setFeedbackResponseSending(true)

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/feedback/${selectedFeedback.id}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: feedbackResponseMessage.trim()
          })
        }
      )

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send feedback response")
      }

      const updatedFeedback = data.feedback

      setUserFeedback((prev) =>
        prev.map((feedback) =>
          feedback.id === selectedFeedback.id
            ? {
              ...feedback,
              status: updatedFeedback.status,
              adminResponse: updatedFeedback.admin_response,
              respondedAt: updatedFeedback.responded_at
            }
            : feedback
        )
      )

      alert("Response sent successfully")

      setFeedbackResponseModalOpen(false)
      setSelectedFeedback(null)
      setFeedbackResponseMessage("")
    } catch (error: any) {
      alert(error?.message || "Failed to send response")
    } finally {
      setFeedbackResponseSending(false)
    }
  }

  async function markFeedbackAsTestimonial(feedback: UserFeedback) {
    const token = getAuthToken()

    if (!token) {
      alert("Missing admin session")
      return
    }

    const confirmed = window.confirm(
      `Use this feedback from ${feedback.email || "unknown user"} as a homepage testimonial?`
    )

    if (!confirmed) return

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/feedback/${feedback.id}/testimonial`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to mark feedback as testimonial")
      }

      const updatedFeedback = data.feedback

      setUserFeedback((prev) =>
        prev.map((item) =>
          item.id === feedback.id
            ? {
              ...item,
              usedAsTestimonial: updatedFeedback.used_as_testimonial,
              testimonialApprovedAt: updatedFeedback.testimonial_approved_at
            }
            : item
        )
      )

      console.log("Feedback marked as testimonial")
    } catch (error: any) {
      alert(error?.message || "Failed to mark feedback as testimonial")
    }
  }

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      router.push("/")
      return
    }

    let eventSource: EventSource | null = null
    const seenActivityKeys = new Set<string>()

    fetch(`${API_BASE_URL}/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user || data.user.is_admin !== true) {
          router.push("/")
          return
        }

        fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((res) => res.json())
          .then((result) => {
            setUsers(result.users || [])
          })

        fetch(`${API_BASE_URL}/api/admin/status`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setStats(data)
          })

        fetch(`${API_BASE_URL}/api/admin/telemetry`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setTelemetry(data)
          })

        fetch(`${API_BASE_URL}/api/admin/activity`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((res) => res.json())
          .then((result) => {
            const initialActivity = (result.activity || []) as ActivityEvent[]

            for (const item of initialActivity) {
              const key = item.id || `${item.time}-${item.message}`
              seenActivityKeys.add(key)
            }

            setActivity(initialActivity)
            setActivityLoaded(true)
          })
          .catch(() => {
            setActivityLoaded(true)
          })

        fetch(`${API_BASE_URL}/api/admin/beta-applications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setBetaApplications(data.applications || [])
          })

        eventSource = new EventSource(
          `${API_BASE_URL}/api/admin/activity-stream?token=${token}`
        )

        fetch(`${API_BASE_URL}/api/admin/feedback`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setUserFeedback(data.feedback || [])
          })

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as ActivityEvent
            const key = data.id || `${data.time}-${data.message}`

            if (seenActivityKeys.has(key)) {
              return
            }

            seenActivityKeys.add(key)

            setActivity((prev) => [data, ...prev].slice(0, 50))
          } catch { }
        }

        eventSource.onerror = () => {
          console.error("Admin activity stream disconnected")
        }
      })
      .catch(() => {
        router.push("/")
      })

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [router])

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Admin Control Panel
        </h1>
      </div>

      <section className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <p className="text-sm font-bold text-slate-500">Users</p>
          <p className="mt-2 text-3xl font-semibold">{stats?.users ?? "…"}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <p className="text-sm font-bold text-slate-500">Active Subscriptions</p>
          <p className="mt-2 text-3xl font-semibold">{stats?.activeSubscriptions ?? "…"}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <p className="text-sm font-bold text-slate-500">Watchlists</p>
          <p className="mt-2 text-3xl font-semibold">{stats?.watchlists ?? "…"}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <p className="text-sm font-bold text-slate-500">Routes Monitored</p>
          <p className="mt-2 text-3xl font-semibold">{stats?.routesMonitored ?? "…"}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <p className="text-sm font-bold text-slate-500">Alerts Sent</p>
          <p className="mt-2 text-3xl font-semibold">{telemetry?.alertsSent ?? "…"}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <p className="text-sm font-bold text-slate-500">Queue Jobs</p>
          <p className="mt-2 text-3xl font-semibold">{stats?.queueJobs ?? "…"}</p>
        </div>
      </section>

      <section className="mb-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <p className="text-xs text-slate-400">Latest platform events</p>
          </div>

          <div className="max-h-64 overflow-y-auto pr-2">
            {!activityLoaded ? (
              <div className="text-sm text-slate-500">
                Loading recent activity...
              </div>
            ) : activity.length === 0 ? (
              <div className="text-sm text-slate-500">
                No recent platform activity yet.
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map((item, index) => (
                  <div
                    key={item.id || `${item.time}-${item.message}-${index}`}
                    className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div className="text-sm text-slate-700">{item.message}</div>
                    <div className="shrink-0 text-xs text-slate-500">
                      {new Date(item.time).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <h2 className="mb-6 text-lg font-semibold">System Health</h2>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="text-sm font-bold text-slate-500">API</p>
              <p className="text-sm font-medium text-green-600">online</p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">Database</p>
              <p className="text-sm font-medium text-green-600">online</p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">Workers</p>
              <p className="text-sm font-medium text-green-600">active</p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">Monitor Queue</p>
              <p className="text-sm font-medium text-green-600">running</p>
            </div>
          </div>
        </div>
      </section>

      {adminUsers.length > 0 && (
        <section className="mb-10">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <h2 className="mb-6 text-lg font-semibold">Protected Admin Accounts</h2>

            <div className="max-h-[420px] overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-3">Email</th>
                    <th className="py-3">Plan</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Created</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {adminUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100">
                      <td className="py-4">{user.email}</td>

                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getPlanBadgeClasses(user.plan)}`}
                        >
                          {formatPlanLabel(user)}
                        </span>
                      </td>

                      <td className="font-medium text-green-600">{user.status}</td>

                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <span className="text-slate-400">Protected</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <h2 className="mb-6 text-lg font-semibold">Platform Users</h2>

          <div className="max-h-[420px] overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3">Email</th>
                  <th className="py-3">Plan</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Created</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {platformUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="py-4">{user.email}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPlanBadgeClasses(user.plan)}`}
                      >
                        {formatPlanLabel(user)}
                      </span>
                    </td>

                    <td className="font-medium text-green-600">{user.status}</td>

                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <button
                        onClick={() => {
                          setUserToDelete(user)
                          setDeleteModalOpen(true)
                        }}
                        className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}

                {platformUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-sm text-slate-500">
                      No non-admin users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <h2 className="mb-2 text-lg font-semibold">Beta Applications</h2>

          <p className="mb-6 text-sm text-slate-500">
            Review incoming beta access requests before sending lifetime Pro invites.
          </p>

          <div className="max-h-[420px] overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3">Name</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Travel Frequency</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Submitted</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {betaApplications.map((application) => (
                  <tr key={application.id} className="border-b border-slate-100 align-top">
                    <td className="py-4 font-medium text-slate-900">
                      {application.full_name}
                    </td>

                    <td className="py-4 text-slate-700">
                      {application.email}
                    </td>

                    <td className="py-4 text-slate-700">
                      {application.travel_frequency}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getBetaStatusBadgeClasses(application.status)}`}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td className="py-4 text-slate-700">
                      {application.created_at
                        ? new Date(application.created_at).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="py-4">
                      <button
                        onClick={() => {
                          setSelectedBetaApplication(application)
                          setBetaReviewModalOpen(true)
                        }}
                        className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}

                {betaApplications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm text-slate-500">
                      No beta applications submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">User Feedback</h2>

              <p className="mt-1 text-sm text-slate-500">
                Review beta feedback, respond to users, and flag strong messages for homepage testimonials.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {userFeedback.length} total
            </span>
          </div>

          <div className="max-h-[360px] overflow-y-auto pr-2">
            {userFeedback.length === 0 ? (
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No user feedback submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {userFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            {feedback.email || "Unknown user"}
                          </p>

                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-600">
                            {"★".repeat(feedback.rating)}
                            {"☆".repeat(5 - feedback.rating)}
                          </span>

                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                            {feedback.status}
                          </span>

                          {feedback.usedAsTestimonial && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              Testimonial
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {feedback.message}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {feedback.createdAt
                            ? new Date(feedback.createdAt).toLocaleString()
                            : "-"}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFeedback(feedback)
                            setFeedbackResponseMessage(feedback.adminResponse || "")
                            setFeedbackResponseModalOpen(true)
                          }}
                          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Respond
                        </button>

                        <button
                          type="button"
                          disabled={feedback.usedAsTestimonial}
                          onClick={() => markFeedbackAsTestimonial(feedback)}
                          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {feedback.usedAsTestimonial ? "Added" : "Use as Testimonial"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <h2 className="mb-2 text-lg font-semibold">
            Free Lifetime Pro Subscription
          </h2>

          <p className="mb-6 text-sm text-slate-500">
            Send an invitation link to grant free lifetime pro subscription.
          </p>

          <div className="flex gap-3">
            <input
              type="email"
              placeholder="email@example.com"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="invite-email"
            />

            <button
              onClick={async () => {
                const emailInput = document.getElementById("invite-email") as HTMLInputElement
                const email = emailInput.value.trim()

                if (!email) {
                  alert("Please enter an email")
                  return
                }

                const token = getAuthToken()

                const res = await fetch(`${API_BASE_URL}/api/admin/invite-user`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({ email })
                })

                const data = await res.json()

                if (res.ok) {
                  alert("Invite sent successfully")
                  emailInput.value = ""
                } else {
                  alert(data.error || "Failed to send invite")
                }
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Send Invite
            </button>
          </div>
        </div>
      </section>

      {betaReviewModalOpen && selectedBetaApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Review Beta Application
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Review the full application before making a decision.
                </p>
              </div>

              <button
                onClick={() => {
                  setBetaReviewModalOpen(false)
                  setSelectedBetaApplication(null)
                }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Full Name
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedBetaApplication.full_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 break-all">
                  {selectedBetaApplication.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Travel Frequency
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedBetaApplication.travel_frequency}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Status
                </p>
                <div className="mt-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getBetaStatusBadgeClasses(selectedBetaApplication.status)}`}
                  >
                    {selectedBetaApplication.status}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  How They Currently Book Flights
                </p>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {selectedBetaApplication.booking_method}
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Why They Want To Join The Beta
                </p>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {selectedBetaApplication.reason}
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Submitted
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedBetaApplication.created_at
                    ? new Date(selectedBetaApplication.created_at).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                onClick={async () => {
                  if (selectedBetaApplication.status !== "pending") return

                  const confirmed = window.confirm(
                    `Approve this beta application and create a lifetime Pro invite for ${selectedBetaApplication.email}?`
                  )

                  if (!confirmed) return

                  const token = getAuthToken()

                  const res = await fetch(
                    `${API_BASE_URL}/api/admin/beta-applications/${selectedBetaApplication.id}/approve`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )

                  if (res.ok) {
                    setBetaApplications((prev) =>
                      prev.map((a) =>
                        a.id === selectedBetaApplication.id ? { ...a, status: "approved" } : a
                      )
                    )

                    await fetch(`${API_BASE_URL}/api/admin/invite-user`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        email: selectedBetaApplication.email,
                      }),
                    })

                    setSelectedBetaApplication((prev) =>
                      prev ? { ...prev, status: "approved" } : prev
                    )

                    alert("Application approved + invite created")
                    setBetaReviewModalOpen(false)
                    setSelectedBetaApplication(null)
                  } else {
                    alert("Failed to approve")
                  }
                }}
                disabled={selectedBetaApplication.status !== "pending"}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Approve
              </button>

              <button
                onClick={async () => {
                  if (selectedBetaApplication.status !== "pending") return

                  const confirmed = window.confirm(
                    `Reject this beta application for ${selectedBetaApplication.email}?`
                  )

                  if (!confirmed) return

                  const token = getAuthToken()

                  const res = await fetch(
                    `${API_BASE_URL}/api/admin/beta-applications/${selectedBetaApplication.id}/reject`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )

                  if (res.ok) {
                    setBetaApplications((prev) =>
                      prev.map((a) =>
                        a.id === selectedBetaApplication.id ? { ...a, status: "rejected" } : a
                      )
                    )

                    setSelectedBetaApplication((prev) =>
                      prev ? { ...prev, status: "rejected" } : prev
                    )

                    setBetaReviewModalOpen(false)
                    setSelectedBetaApplication(null)
                  } else {
                    alert("Failed to reject")
                  }
                }}
                disabled={selectedBetaApplication.status !== "pending"}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackResponseModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Respond to Feedback
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Send a response by email to {selectedFeedback.email || "this user"}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (feedbackResponseSending) return
                  setFeedbackResponseModalOpen(false)
                  setSelectedFeedback(null)
                  setFeedbackResponseMessage("")
                }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                User feedback
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {selectedFeedback.message}
              </p>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Your response
              </label>

              <textarea
                value={feedbackResponseMessage}
                onChange={(event) => setFeedbackResponseMessage(event.target.value)}
                rows={6}
                placeholder="Write a thoughtful response to this user..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={feedbackResponseSending}
                onClick={() => {
                  if (feedbackResponseSending) return
                  setFeedbackResponseModalOpen(false)
                  setSelectedFeedback(null)
                  setFeedbackResponseMessage("")
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={feedbackResponseSending || !feedbackResponseMessage.trim()}
                onClick={sendFeedbackResponse}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {feedbackResponseSending ? "Sending..." : "Send Response"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Delete User
            </h3>

            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to remove this user?
            </p>

            <p className="mt-2 text-sm font-medium text-slate-800">
              {userToDelete.email}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setUserToDelete(null)
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteUser(userToDelete.id)
                  setDeleteModalOpen(false)
                  setUserToDelete(null)
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}