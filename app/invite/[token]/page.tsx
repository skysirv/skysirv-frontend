"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function InvitePage({ params }: { params: { token: string } }) {
    const router = useRouter()

    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleActivate(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${API_BASE_URL}/api/invite/activate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: params.token,
                    password
                })
            })

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                throw new Error(data?.error || "Activation failed")
            }

            // 🔥 Auto login after activation
            const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: data.email,
                    password
                })
            })

            const loginData = await loginRes.json()

            if (!loginRes.ok) {
                throw new Error("Login failed after activation")
            }

            localStorage.setItem("skysirv_token", loginData.token)
            localStorage.setItem(
                "skysirv_admin",
                loginData.user?.is_admin ? "true" : "false"
            )

            // 🔥 Redirect to gifted welcome
            router.push("/welcome?gifted=true")

        } catch (err: any) {
            setError(err?.message || "Unable to activate invite")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-white px-6">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Activate Your Access ✈️
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    You’ve been granted <strong>Lifetime Pro Access</strong>.
                    Set your password to continue.
                </p>

                <form onSubmit={handleActivate} className="mt-6 space-y-4">
                    <input
                        type="password"
                        placeholder="Create password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                    />

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {loading ? "Activating..." : "Activate Account"}
                    </button>
                </form>
            </div>
        </section>
    )
}