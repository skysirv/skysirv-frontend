"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function AdminPage() {
  const router = useRouter()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [activity, setActivity] = useState<ActivityEvent[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [telemetry, setTelemetry] = useState<any>(null)
  const [activityLoaded, setActivityLoaded] = useState(false)

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

    if (user.plan === "enterprise") {
      if (user.billing_interval === "monthly") return "Enterprise — Monthly"
      if (user.billing_interval === "yearly") return "Enterprise — Yearly"
      return "Enterprise"
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

    if (plan === "enterprise") {
      return "bg-indigo-100 text-indigo-700"
    }

    return "bg-slate-100 text-slate-700"
  }

  async function deleteUser(userId: string) {
    const token = localStorage.getItem("skysirv_token")

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

  useEffect(() => {
    const token = localStorage.getItem("skysirv_token")

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

        eventSource = new EventSource(
          `${API_BASE_URL}/api/admin/activity-stream?token=${token}`
        )

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

            <div className="overflow-x-auto">
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

          <div className="overflow-x-auto">
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
                    <td colSpan={5} className="py-6 text-center text-sm text-slate-500">
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
          <h2 className="mb-2 text-lg font-semibold">
            Invite Beta User
          </h2>

          <p className="mb-6 text-sm text-slate-500">
            Send an invitation link to grant beta access to Skysirv.
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

                const token = localStorage.getItem("skysirv_token")

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