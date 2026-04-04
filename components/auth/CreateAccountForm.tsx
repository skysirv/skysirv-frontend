"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

declare global {
    interface Window {
        google?: any
    }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

type CreateAccountFormProps = {
    onSuccessRedirect?: string
}

export default function CreateAccountForm({
    onSuccessRedirect = "/account-created",
}: CreateAccountFormProps) {
    const router = useRouter()
    const googleButtonRef = useRef<HTMLDivElement | null>(null)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    const hasStartedConfirming = confirmPassword.length > 0
    const passwordsMatch = hasStartedConfirming && password === confirmPassword
    const passwordsMismatch = hasStartedConfirming && password !== confirmPassword

    const passwordMatchMessage = useMemo(() => {
        if (!hasStartedConfirming) return ""
        if (!password) return "Enter your password first."
        if (passwordsMatch) return "Passwords match."
        return "Passwords do not match."
    }, [hasStartedConfirming, password, passwordsMatch])

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
                callback: handleGoogleCredentialResponse,
            })

            window.google.accounts.id.renderButton(googleButtonRef.current, {
                theme: "outline",
                size: "large",
                type: "standard",
                shape: "pill",
                text: "continue_with",
                logo_alignment: "left",
                width: 320,
            })
        }

        initializeGoogle()
    }, [])

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            const data = await response.json().catch(() => null)

            if (!response.ok) {
                throw new Error(data?.error || "Signup failed")
            }

            router.push(onSuccessRedirect)
        } catch (err: any) {
            setError(err?.message || "Unable to create account")
        } finally {
            setLoading(false)
        }
    }

    async function handleGoogleCredentialResponse(response: { credential?: string }) {
        if (!response?.credential) {
            setError("Google sign-up failed. No credential was returned.")
            return
        }

        setGoogleLoading(true)
        setError("")

        try {
            const apiResponse = await fetch(`${API_BASE_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    credential: response.credential,
                    mode: "signup",
                }),
            })

            const data = await apiResponse.json().catch(() => null)

            if (!apiResponse.ok) {
                throw new Error(data?.error || "Google sign-up failed")
            }

            localStorage.setItem("skysirv_token", data.token)
            localStorage.setItem("skysirv_admin", data.user?.is_admin ? "true" : "false")

            window.location.href = "/choose-plan"
        } catch (err: any) {
            setError(err?.message || "Unable to continue with Google")
            setGoogleLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        required
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className={`w-full rounded-xl px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${passwordsMismatch
                            ? "border border-red-300 focus:border-red-500 focus:ring-red-500/10"
                            : passwordsMatch
                                ? "border border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                                : "border border-slate-200 focus:border-slate-900 focus:ring-slate-900/10"
                            }`}
                    />

                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                </div>

                {passwordMatchMessage && (
                    <p
                        className={`text-sm ${passwordsMismatch
                            ? "text-red-500"
                            : passwordsMatch
                                ? "text-emerald-600"
                                : "text-slate-500"
                            }`}
                    >
                        {passwordMatchMessage}
                    </p>
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading || googleLoading || passwordsMismatch}
                    className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <div className="my-6 flex items-center gap-4 text-xs text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                or
                <div className="h-px flex-1 bg-slate-200" />
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
        </>
    )
}