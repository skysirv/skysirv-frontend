'use client'

import { useEffect, useRef, useState } from "react"
import { setAuthAdmin, setAuthToken } from "@/utils/auth-storage"

declare global {
  interface Window {
    google?: any
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

export default function SignInForm() {
  const googleButtonRef = useRef<HTMLDivElement | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID")
      return
    }

    let attempts = 0
    const maxAttempts = 50

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        attempts += 1

        if (attempts < maxAttempts) {
          window.setTimeout(initializeGoogle, 200)
        }

        return
      }

      googleButtonRef.current.innerHTML = ""

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse
      })

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        shape: "pill",
        text: "continue_with",
        logo_alignment: "left",
        width: 320
      })
    }

    initializeGoogle()
  }, [])

  async function routeUserAfterAuth(token: string, isAdmin: boolean) {
    if (isAdmin) {
      window.location.href = "/admin"
      return
    }

    const sessionRes = await fetch(`${API_BASE_URL}/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const sessionData = await sessionRes.json().catch(() => null)

    if (!sessionRes.ok || !sessionData?.user) {
      throw new Error("Unable to load session")
    }

    const subscription = sessionData.subscription
    const planId = subscription?.plan_id || null

    if (!planId) {
      window.location.href = "/choose-plan"
      return
    }

    if (planId === "free") {
      window.location.href = "/dashboard/free"
      return
    }

    if (
      planId === "pro" ||
      planId === "pro_monthly" ||
      planId === "pro_yearly" ||
      planId === "pro_lifetime"
    ) {
      window.location.href = "/dashboard/pro"
      return
    }

    if (
      planId === "business" ||
      planId === "business_monthly" ||
      planId === "business_yearly"
    ) {
      window.location.href = "/dashboard/business"
      return
    }

    window.location.href = "/dashboard"
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Login failed")
      }

      setAuthToken(data.token)
      setAuthAdmin(data.user?.is_admin === true)

      await routeUserAfterAuth(data.token, data.user?.is_admin === true)
    } catch (err: any) {
      setError(err?.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleCredentialResponse(response: { credential?: string }) {
    if (!response?.credential) {
      setError("Google sign-in failed. No credential was returned.")
      return
    }

    setGoogleLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          credential: response.credential,
          mode: "signin"
        })
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Google sign-in failed")
      }

      setAuthToken(data.token)
      setAuthAdmin(data.user?.is_admin === true)

      await routeUserAfterAuth(data.token, data.user?.is_admin === true)
    } catch (err: any) {
      setError(err?.message || "Unable to continue with Google")
      setGoogleLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200"></div>
        or
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      <div className="flex w-full justify-center">
        <div ref={googleButtonRef} />
      </div>

      {googleLoading && (
        <p className="mt-3 text-center text-sm text-slate-500">
          Continuing with Google...
        </p>
      )}

      {!GOOGLE_CLIENT_ID && (
        <p className="mt-3 text-center text-sm text-red-500">
          Google sign-in is not configured yet.
        </p>
      )}
    </div>
  )
}