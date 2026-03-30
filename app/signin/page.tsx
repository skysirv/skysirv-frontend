"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    google?: any
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
console.log("GOOGLE CLIENT ID IN USE:", GOOGLE_CLIENT_ID)

export default function SignInPage() {
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

      if (!res.ok) {
        throw new Error("Login failed")
      }

      const data = await res.json()

      localStorage.setItem("skysirv_token", data.token)
      localStorage.setItem("skysirv_admin", data.user?.is_admin ? "true" : "false")

      if (data.user?.is_admin) {
        window.location.href = "/admin"
      } else {
        window.location.href = "/dashboard"
      }
    } catch {
      setError("Invalid email or password")
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
          mode: "signin" // 🔥 IMPORTANT
        })
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Google sign-in failed")
      }

      localStorage.setItem("skysirv_token", data.token)
      localStorage.setItem("skysirv_admin", data.user?.is_admin ? "true" : "false")

      if (data.user?.is_admin) {
        window.location.href = "/admin"
      } else {
        window.location.href = "/dashboard"
      }
    } catch (err: any) {
      setError(err?.message || "Unable to continue with Google")
      setGoogleLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <h1 className="text-2xl font-semibold text-slate-900">
          Sign in to Skysirv
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Access your flight intelligence dashboard
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
    </section>
  )
}